// Typing Animation
const initialText = "Hey, I'm Aaran";
const secondText = "Welcome to my page";
const chatIntroText = "Hello, I'm Aaran's AI. How can I assist you today?";
const typedTextElement = document.getElementById("typed-text");
const typingSpeed = 100; // milliseconds per character


function activateSectionsOnScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            section.classList.add('active');
        }
    });
}

function typeText(text, onDone, speed = typingSpeed) {
    let index = 0;
    typedTextElement.textContent = "";
    const intervalId = setInterval(() => {
        if (index < text.length) {
            typedTextElement.textContent = text.slice(0, index + 1);
            index++;
        } else {
            clearInterval(intervalId);
            if (onDone) onDone();
        }
    }, speed);
}

function deleteText(onDone) {
    let index = typedTextElement.textContent.length;
    const intervalId = setInterval(() => {
        if (index > 0) {
            typedTextElement.textContent = typedTextElement.textContent.slice(0, index - 1);
            index--;
        } else {
            clearInterval(intervalId);
            if (onDone) onDone();
        }
    }, typingSpeed);
}

window.addEventListener('load', () => {
    activateSectionsOnScroll();
    typeText(initialText, () => {
        setTimeout(() => {
            deleteText(() => {
                typeText(secondText, () => {
                    setTimeout(() => {
                        document.body.classList.add('faded');
                        const profileInner = document.querySelector('.profile-inner');
                        const siteHeader = document.querySelector('.site-header');
                        if (profileInner && siteHeader) {
                            profileInner.scrollTop = siteHeader.offsetHeight + 12;
                        }
                    }, 1000);
                });
            });
        }, 1000);
    });
});


window.addEventListener('scroll', () => {
    if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
    }
}, { passive: true });

const chatToggle = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

const knowledgeBase = [
    {
        keywords: ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup'],
        answer: 'Hi, how can I help you?'
    },
    {
        keywords: ['name', 'aaran', 'guha', 'who', 'you'],
        answer: "You're chatting with Aaran's Assistant! How can I be of help?"
    },
    {
        keywords: ['email', 'contact', 'reach', 'phone', 'number'],
        answer: 'You can reach Aaran at aaranguhaca@gmail.com or (510) 946-9095.'
    },
    {
        keywords: ['github', 'code', 'repo', 'projects'],
        answer: 'GitHub: github.com/aaranguha.'
    },
    {
        keywords: ['location', 'where', 'based'],
        answer: 'Aaran has studied and worked across Atlanta, GA; Santa Cruz, CA; San Francisco, CA; and Washington, DC.'
    },
    {
        keywords: ['education', 'school', 'degree', 'gpa', 'georgia', 'tech', 'gt', 'ucsc', 'university', 'masters', 'master', 'bachelor', 'bachelors'],
        answer: 'Education: M.S. CS (AI) at Georgia Tech (GPA 4.00, Aug 2024 – Jul 2026) and B.S. CS at UC Santa Cruz (GPA 3.67, Sep 2021 – Jun 2024).'
    },
    {
        keywords: ['coursework', 'classes', 'relevant', 'courses'],
        answer: 'Relevant coursework includes Machine Learning, Analytics Modeling, ML for Trading, Data Analytics & Security, Ethics of Data/AI, Data Structures & Algorithms, OS, Databases (SQL), Java, Python, PL Foundations, Computer Architecture, Security, and Software Development.'
    },
    {
        keywords: ['experience', 'work', 'job', 'n2ia', 'uxly', 'sephora', 'intern', 'data scientist'],
        answer: 'Experience: Data Scientist at N2IA Technologies (Oct 2024–Present), ML Intern at UXly (Jan 2024–Jun 2024), and Data Engineering Intern at Sephora (Jun 2023–Aug 2023).'
    },
    {
        keywords: ['n2ia', 'palantir', 'vantage', 'forest', 'random', 'etl', 'dataverse', 'power', 'platform', 'pl-900', 'dod', 'army'],
        answer: 'At N2IA, Aaran built Random Forest forecasting in Palantir Vantage, designed ETL pipelines for DoD data, integrated Microsoft Dataverse/Power Automate, and earned the PL-900 Power Platform certification.'
    },
    {
        keywords: ['uxly', 'bot', 'detection', 'tensorflow', 'keras', 'typescript'],
        answer: 'At UXly, Aaran built a bot detection model in TensorFlow/Keras and integrated it into a TypeScript backend for real-time protection.'
    },
    {
        keywords: ['sephora', 'gen', 'ai', 'midjourney', 'imagine', 'stable', 'diffusion', 'dreambooth', 'image'],
        answer: 'At Sephora, Aaran used generative AI (Midjourney/ImagineAPI), trained Stable Diffusion/DreamBooth models, and applied image-to-image generation for branded visuals.'
    },
    {
        keywords: ['projects', 'project', 'pdfpal', 'touchdown', 'chipotle', 'spotify', 'apple', 'converter'],
        answer: 'Projects include Touchdown.Life, PDFPal, Spotify → Apple Music Converter, and NBA_Chipotle_Getter_6000.'
    },
    {
        keywords: ['pdfpal', 'rag', 'chatbot', 'langchain', 'transformers'],
        answer: 'PDFPal is a React/Python/LangChain app that uses RAG to query dense PDF documents with LLM tooling.'
    },
    {
        keywords: ['touchdown', 'nfl', 'game'],
        answer: 'Touchdown.Life is a Wordle-like NFL roster game built with Python/HTML/JavaScript.'
    },
    {
        keywords: ['chipotle', 'nba', 'getter', 'selenium', 'tweetdeck', 'imessage'],
        answer: 'NBA_Chipotle_Getter_6000 used Python + Selenium to monitor TweetDeck and send promo codes via iMessage.'
    },
    {
        keywords: ['spotify', 'apple', 'music', 'converter'],
        answer: 'Spotify → Apple Music Converter helps users migrate playlists to Apple Music.'
    },
    {
        keywords: ['skills', 'stack', 'tools', 'languages', 'tech'],
        answer: 'Core tools include Python, SQL, Java, TensorFlow/Keras, scikit-learn, LangChain, and automation via Microsoft Power Platform.'
    },
    {
        keywords: ['clearance', 'security', 'cac'],
        answer: 'Aaran holds an active CAC (DoD Common Access Card).'
    },
    {
        keywords: ['ai', 'bot', 'chatbot', 'assistant', 'real', 'human'],
        answer: "Yup. Aaran created me to help assist you in anything you may need while you're on this page"
    },
    {
        keywords: ['thanks', 'thank', 'appreciate', 'thx'],
        answer: "You're welcome! Anything else you'd like to know?"
    },
    {
        keywords: ['help', 'can', 'what', 'ask', 'questions'],
        answer: 'You can ask about Aaran’s experience, education, coursework, projects, skills, or contact info.'
    }
];

const fallbackResponses = [
    "I'm not sure if I have the answer to this, but feel free to contact Aaran using the contact button.",
    "I might not have that info yet—try the contact button to reach Aaran directly.",
    "Not totally sure on that one. You can reach Aaran via the contact button on this page.",
    "I don't have that detail, but Aaran can help—use the contact button to get in touch.",
    "I'm missing that answer right now. Feel free to contact Aaran through the contact button."
];

function getBestAnswer(question) {
    const tokens = normalizeText(question);
    let bestMatch = null;
    let bestScore = 0;

    knowledgeBase.forEach(entry => {
        const score = entry.keywords.reduce((acc, keyword) => acc + (tokens.includes(keyword) ? 1 : 0), 0);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    });

    if (bestMatch && bestScore > 0) {
        return bestMatch.answer;
    }

    const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomIndex];
}

function addMessage(text, role) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble assistant';
    bubble.setAttribute('data-typing', 'true');
    bubble.innerHTML = '<span class="chat-typing"><span></span><span></span><span></span></span>';
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const bubble = chatMessages.querySelector('[data-typing="true"]');
    if (bubble) bubble.remove();
}

function handleChatSubmit(event) {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    addMessage(question, 'user');
    chatInput.value = '';
    addTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const answer = getBestAnswer(question);
        addMessage(answer, 'assistant');
    }, 450);
}

chatToggle.addEventListener('click', () => {
    const isOpen = chatPanel.classList.toggle('open');
    chatToggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
        addMessage(chatIntroText, 'assistant');
        chatInput.focus();
    }
});

chatClose.addEventListener('click', () => {
    chatPanel.classList.remove('open');
    chatToggle.setAttribute('aria-expanded', 'false');
    chatMessages.innerHTML = '';
});

chatForm.addEventListener('submit', handleChatSubmit);
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScroll(container, to, duration = 700) {
    const start = container.scrollTop;
    const change = to - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = start + change * easeInOutCubic(progress);
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href');
        if (!targetId) return;
        const target = document.querySelector(targetId);
        const profileInner = document.querySelector('.profile-inner');
        if (!target || !profileInner) return;
        smoothScroll(profileInner, target.offsetTop, 800);
    });
});
