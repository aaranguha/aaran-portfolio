import knowledge from '../data/knowledge.json';
import { createClient } from '@supabase/supabase-js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHAT_MODEL = 'gpt-4.1-mini';

let cachedEmbeddings = null;

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embedTexts(texts) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding error: ${errorText}`);
  }

  const data = await response.json();
  return data.data.map(item => item.embedding);
}

async function ensureEmbeddings() {
  if (cachedEmbeddings) return cachedEmbeddings;
  const texts = knowledge.chunks.map(chunk => normalize(chunk.text));
  const vectors = await embedTexts(texts);
  cachedEmbeddings = vectors;
  return cachedEmbeddings;
}

async function retrieveContext(question, topK = 4) {
  const [queryEmbedding] = await embedTexts([question]);
  const vectors = await ensureEmbeddings();

  const scored = vectors.map((vector, index) => ({
    index,
    score: cosineSimilarity(queryEmbedding, vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, topK);

  return top.map(({ index }) => knowledge.chunks[index]);
}

async function generateAnswer(question, contextChunks) {
  const contextText = contextChunks
    .map(chunk => `- ${chunk.text}`)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: [
                "You are Aaran's Assistant for his personal website.",
                'Answer questions using only the provided context.',
                'If the answer is not in the context, say you are not sure and suggest contacting Aaran.',
                'Keep responses concise (1-4 sentences).',
              ].join(' '),
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Context:\n${contextText}\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat error: ${errorText}`);
  }

  const data = await response.json();
  const outputText = data.output_text || (data.output && data.output[0] && data.output[0].content
    ? data.output[0].content
        .map(item => (item.type === 'output_text' ? item.text : ''))
        .join('')
    : '');
  return outputText.trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' });
    return;
  }

  try {
    const { question } = req.body || {};
    if (!question) {
      res.status(400).json({ error: 'Missing question.' });
      return;
    }

    const contextChunks = await retrieveContext(question);
    const answer = await generateAnswer(question, contextChunks);

    // Log to Supabase (non-blocking)
    if (supabase) {
      supabase.from('chat_logs').insert({ question, answer }).then();
    }

    res.status(200).json({ answer, sources: contextChunks.map(c => c.source) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
