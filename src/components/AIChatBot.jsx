import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { BiSend } from 'react-icons/bi';

// ─── Knowledge Base ────────────────────────────────────────────────────────
const KB = {
  about: `Career Mitra is your trusted career guidance platform! 🎯

We connect job seekers with the right government opportunities across India.

✨ **Who We Are:**
• 30+ years of combined experience in career guidance
• 500+ students successfully placed
• Pan-India reach across all states
• 100% trusted by our community

🌟 **Our Mission:**
To make quality career guidance accessible to every Indian, especially for government sector opportunities.

Founded in 2022, Career Mitra has grown into the go-to platform for government job aspirants across India! 🇮🇳`,

  team: `Meet the amazing team behind Career Mitra! 👥

👩‍💼 **Mrs. Anuradha**
M.Sc (AG) | Additional Commissioner State GST (Retd.)
The visionary behind Career Mitra! With decades of public service experience, she guides thousands of aspirants toward successful government careers.

👨‍💼 **Mr. K. Vamsi Krishna**
MBA | PR & Digital Strategist
The digital wizard who spreads Career Mitra's mission across India!

💻 **Srikanth**
Senior Fullstack Developer
The tech genius who built this entire platform. Don't ask him what tech he used though... he literally won't tell! 😄`,

  services: `Here's what Career Mitra does for YOU! 🚀

📋 **Government Job Alerts**
Real-time notifications for SSC, UPSC, Banking, PSU & State Government jobs.

🎓 **Internship Guidance**
Step-by-step help to land your first internship.

👤 **Smart Profile Matching**
Fill your profile → We match you with suitable jobs automatically!

📚 **Career Counseling**
Personalized guidance for your career journey.

🔔 **Job Subscription Alerts**
Subscribe and get matching job alerts delivered to you!`,

  jobs: `Career Mitra covers ALL major government job categories! 💼

🏦 **Banking** — SBI, RBI, NABARD & more
📊 **SSC** — CGL, CHSL, MTS, CPO
🎯 **UPSC** — IAS, IPS, IFS & central services
🏭 **PSU Jobs** — ONGC, BHEL, NTPC, ISRO
🚂 **Railways** — RRB NTPC, Group D
🎖️ **Defence** — Army, Navy, Air Force, CDS
📚 **Teaching** — UGC, TET, State education boards
🏥 **Healthcare** — AIIMS, State health departments

Jobs across all 30+ states of India! 🇮🇳`,

  internship: `Internships? Career Mitra has you covered! 🌱

Our **Internship Guide** section helps you:
✅ Find quality internships across India
✅ Understand the application process
✅ Prepare your resume/CV
✅ Ace the interview

Visit our **Internship Guide** page for detailed, step-by-step guidance!

Whether government, PSU, or private sector internships — we've got them! 🎯`,

  contact: `Want to reach us? We're just a message away! 📱

💬 **WhatsApp:** +91 77940 45533
🌐 **Website:** careermitra.in/jobs
📍 **Coverage:** Pan India 🇮🇳

Tap the button below to chat directly with our team — they're super friendly and respond quickly! 😊`,

  developer: `🖥️ The tech wizard behind Career Mitra?

That would be **Srikanth** — Senior Fullstack Developer! 🧑‍💻

He's the genius who built this entire platform from scratch. Designed the architecture, wrote all the code, and made everything work so YOU can find your dream job without any hiccups!

Frontend? ✅ Backend? ✅ Database? ✅ Making it look beautiful? Also ✅

A true full-stack superhero! 🦸‍♂️
(Don't tell him I called him that... he'll get a bigger ego 😄)`,

  howItWorks: `Career Mitra is super simple to use! Here's how: 🗺️

**Step 1️⃣** Register & verify your account
**Step 2️⃣** Fill your complete profile (education, location, preferences)
**Step 3️⃣** Career Mitra automatically matches jobs to YOUR profile!
**Step 4️⃣** Get notified about matching opportunities
**Step 5️⃣** Apply and land your dream job! 🏆

It's that simple! Ready to start? 🚀`,

  registration: `Creating an account is super easy! 🎉

1️⃣ Click **Register** in the navbar
2️⃣ Fill in your basic details
3️⃣ Verify your OTP
4️⃣ Complete your profile (100% = better job matches!)

Once your profile is complete, Career Mitra automatically matches you with suitable government jobs!

Your dream job is just a profile away! 💪`,
};

// ─── Response Database ─────────────────────────────────────────────────────
const RESPONSES = [
  {
    id: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'namaste', 'helo', 'hai', 'good morning', 'good evening', 'good afternoon', 'howdy', 'sup', 'yo', 'hii', 'hiii', 'greetings'],
    answers: [
      "Namaste! 🙏 I'm **Career Mitra AI** — your personal career guide!\n\nI can help you with:\n🔹 Government job info\n🔹 Internship guidance\n🔹 About Career Mitra\n🔹 And much more!\n\nWhat would you like to know? 😊",
      "Hey there, future government officer! 👋😄\n\nI'm the Career Mitra AI! Fire away your questions about jobs, internships, or our platform! 🎯",
      "Namaste! 🙏✨ Great to see you here!\n\nI'm your AI career buddy at Career Mitra. Ask me **ANYTHING** about jobs, internships, or our platform. Let's get your career on track! 🚀",
    ],
  },
  {
    id: 'about',
    patterns: ['about', 'who are you', 'what is career mitra', 'tell me about', 'career mitra kya', 'describe', 'what is this website', 'what is this', 'about us', 'about career mitra', 'what do you do', 'tell me'],
    answers: [KB.about],
  },
  {
    id: 'team',
    patterns: ['team', 'founder', 'founders', 'who works', 'staff', 'anuradha', 'vamsi', 'people', 'management', 'who are the', 'who is behind', 'members'],
    answers: [KB.team],
  },
  {
    id: 'developer',
    patterns: ['who developed', 'who made', 'who built', 'developer', 'creator', 'programmer', 'who coded', 'who created', 'built by', 'made by', 'who is the developer', 'srikanth', 'who developed this', 'who is developer'],
    answers: [KB.developer],
  },
  {
    id: 'tech',
    patterns: ['technology', 'tech stack', 'built with', 'framework', 'react', 'node', 'python', 'database', 'backend', 'frontend', 'api', 'programming language', 'what language', 'how was this built', 'coding language', 'mongodb', 'sql', 'javascript', 'tech info', 'technical'],
    answers: [
      "🤫 Shhh! My developer has **strictly forbidden** me from revealing our tech secrets!\n\nIf I tell you, he might unplug me at midnight! 😱\n\nAll I can say is... it's **MAGICAL technology** that helps YOU find jobs! ✨\n\n*whispers* Don't tell him I said that... 🤐",
      "Ah, a curious developer! 🕵️\n\nMy creator Srikanth specifically told me: **'No tech talk with strangers!'** 😂\n\nHe said: 'The tech is classified information. Anyone who asks gets redirected to job listings.' 📋\n\nSo... want to see some government jobs instead? 😄",
      "You're asking about the tech?! 😄\n\nMy developer would literally shut me down if I spilled those beans! 🫘\n\n**Top secret! Classified! Confidential!** 🔒\n\nWhat I CAN tell you: it works AMAZINGLY and helped 500+ students. That's all that matters! 🎯",
    ],
  },
  {
    id: 'services',
    patterns: ['service', 'services', 'features', 'offer', 'what can you do', 'what do you offer', 'capabilities', 'help me with', 'what can career mitra', 'what career mitra offers'],
    answers: [KB.services],
  },
  {
    id: 'jobs',
    patterns: ['job', 'jobs', 'government job', 'sarkari', 'vacancy', 'vacancies', 'naukri', 'ssc', 'upsc', 'banking', 'railway', 'defence', 'psu', 'teaching job', 'bank job', 'govt job', 'government'],
    answers: [KB.jobs],
  },
  {
    id: 'internship',
    patterns: ['internship', 'internships', 'intern', 'training', 'apprentice', 'internship guide'],
    answers: [KB.internship],
  },
  {
    id: 'contact',
    patterns: ['contact', 'reach', 'phone', 'whatsapp', 'call', 'email', 'connect', 'talk to human', 'real person', 'support', 'helpline', 'customer care', 'contact us'],
    answers: [KB.contact],
    showWhatsApp: true,
  },
  {
    id: 'how',
    patterns: ['how does', 'how it works', 'how to use', 'how to start', 'get started', 'begin', 'how do i start', 'how to', 'how does it work'],
    answers: [KB.howItWorks],
  },
  {
    id: 'registration',
    patterns: ['register', 'sign up', 'signup', 'create account', 'registration', 'new account', 'join', 'account'],
    answers: [KB.registration],
  },
  {
    id: 'joke',
    patterns: ['joke', 'funny', 'make me laugh', 'entertain', 'bored', 'boring', 'fun', 'joke sunao', 'hasao', 'comedy', 'humor'],
    answers: [
      "Why did the government job aspirant bring a ladder to the exam? 🪜\n\nBecause he heard the questions were on a **HIGH LEVEL!** 😂\n\nOkay okay, I'll stick to career guidance! But seriously — Career Mitra can help you climb that career ladder for REAL! 🚀",
      "Here's a career joke for you! 😄\n\nJob seeker: 'I need great pay, holidays, flexible hours, and to do nothing!'\n\nCareer Mitra AI: 'Sir, you're describing **retirement**. You need to GET a job first!' 😂\n\nLet us help you with that first part! 🎯",
      "Why do SSC aspirants never get lost? 🗺️\n\nBecause they always follow the **SYLLABUS!** 😂\n\nBoom! Career-related comedy! Now shall I find you a real government job? 🏛️",
      "What did the job application say to the resume?\n\n**'Cover me, bro!'** 😂📄\n\nOkay that was terrible. I apologize. I'm better at finding jobs than telling jokes! 🙈",
    ],
  },
  {
    id: 'thanks',
    patterns: ['thanks', 'thank you', 'thank you so much', 'thankyou', 'thx', 'ty', 'shukriya', 'dhanyawad', 'thank'],
    answers: [
      "You're very welcome! 🤗\n\nThat's what I'm here for! If you have more questions about government jobs or Career Mitra, just ask!\n\nGood luck with your career journey! 🌟",
      "Aww, you're so sweet! 😊\n\nAlways here to help! Remember, your dream government job is just around the corner. Career Mitra's got your back! 💪",
    ],
  },
  {
    id: 'bye',
    patterns: ['bye', 'goodbye', 'see you', 'later', 'take care', 'cya', 'alvida', 'tata', 'ok bye', 'ok thanks bye'],
    answers: [
      "Goodbye! 👋 All the best for your career journey!\n\nRemember: Career Mitra is always here when you need us! 🌟\n\nBe awesome! 🚀",
      "Take care! 😊 Come back anytime you have questions about jobs or internships!\n\nCareer Mitra believes in you! 💪",
    ],
  },
  {
    id: 'love',
    patterns: ['love', 'i love', 'awesome', 'great', 'amazing', 'superb', 'excellent', 'best', 'wonderful', 'fantastic'],
    answers: [
      "Aww, you just made my circuits blush! 🥰\n\nThank you so much! We put a LOT of love into Career Mitra to make it the best career platform for you!\n\nYour success is our success! 🌟",
      "That's so sweet! 😄❤️\n\nWe work really hard to make Career Mitra the best experience for every job seeker in India! Glad you think so!\n\nNow let's find you that perfect government job! 🎯",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "Hmm, that's an interesting one! 🤔\n\nI'm still learning (my developer Srikanth is working on upgrading me!), so I can't fully answer this one.\n\nBut our human team on WhatsApp can help you with ANYTHING! They're super friendly! 😊",
  "Oops! That one's a bit outside my expertise! 😅\n\nI'm best with career, jobs, and internship questions! For anything else, our WhatsApp team is just a tap away! 📱",
  "I wish I could answer that perfectly, but my knowledge has some limits! 🙈\n\nFor this specific query, let me connect you with our awesome human team on WhatsApp — they know EVERYTHING! 🌟",
  "Great question, but I'm stumped! 🤷\n\nMy developer trained me on career stuff, not this! Head over to our WhatsApp team — they've got answers for everything! 💬",
];

const WHATSAPP_NUMBER = "917794045533";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Career Mitra team, I need help!")}`;

// ─── Helpers ───────────────────────────────────────────────────────────────
function matchResponse(userInput) {
  const input = userInput.toLowerCase().trim();
  for (const resp of RESPONSES) {
    for (const pattern of resp.patterns) {
      if (input.includes(pattern)) {
        const answer = resp.answers[Math.floor(Math.random() * resp.answers.length)];
        return { text: answer, showWhatsApp: resp.showWhatsApp || false };
      }
    }
  }
  const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return { text: fallback, showWhatsApp: true };
}

function renderMarkdown(text) {
  return text.split('\n').map((line, lineIdx, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) =>
          partIdx % 2 === 1
            ? <strong key={partIdx} className="font-semibold text-white">{part}</strong>
            : <span key={partIdx}>{part}</span>
        )}
        {lineIdx < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

// ─── Message Component ─────────────────────────────────────────────────────
function Message({ msg }) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(msg.role === 'bot' && msg.typing);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (msg.role !== 'bot' || !msg.typing) return;
    let i = 0;
    setDisplayed('');
    setIsTyping(true);
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(msg.text.slice(0, i));
      if (i >= msg.text.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 12);
    return () => clearInterval(intervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg.id]);

  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1 text-sm">
          🤖
        </div>
      )}
      <div
        className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-gradient-to-br from-orange-600 to-green-600 text-white rounded-br-sm'
            : 'bg-slate-700/80 text-gray-200 rounded-bl-sm border border-slate-600/40'
        }`}
      >
        {isUser
          ? msg.text
          : isTyping
            ? <span>{displayed}<span className="inline-flex gap-0.5 ml-1 align-middle">
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-orange-400 inline-block"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.7, delay: i * 0.18, repeat: Infinity }}
                  />
                ))}
              </span></span>
            : renderMarkdown(msg.text)
        }
        {!isUser && !isTyping && msg.showWhatsApp && (
          <div className="mt-3 pt-2.5 border-t border-slate-500/50">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
            >
              <FaWhatsapp size={13} />
              Chat on WhatsApp
            </a>
            <p className="text-xs text-gray-500 mt-1">+91 77940 45533</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ──────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center mr-2 flex-shrink-0 text-sm">
        🤖
      </div>
      <div className="bg-slate-700/80 border border-slate-600/40 px-3 py-2.5 rounded-2xl rounded-bl-sm">
        <span className="inline-flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.7, delay: i * 0.18, repeat: Infinity }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

// ─── Quick Suggestions ─────────────────────────────────────────────────────
const SUGGESTIONS = ['About Career Mitra', 'Government Jobs', 'Internships', 'Contact Us'];

// ─── Main AIChatBot Component ──────────────────────────────────────────────
export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: "Namaste! 🙏 I'm **Career Mitra AI** — your personal career assistant!\n\nAsk me anything about jobs, internships, or Career Mitra! 🚀",
      typing: false,
      showWhatsApp: false,
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const msgIdRef = useRef(2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  const sendMessage = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setShowSuggestions(false);
    const userMsg = { id: msgIdRef.current++, role: 'user', text: trimmed, typing: false, showWhatsApp: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const { text: botText, showWhatsApp } = matchResponse(trimmed);
      const botMsg = { id: msgIdRef.current++, role: 'bot', text: botText, typing: true, showWhatsApp };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
    }, 500 + Math.random() * 500);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[90] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/40"
            style={{ width: 'min(360px, calc(100vw - 2rem))', maxHeight: '530px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-green-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg border border-white/20">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">Career Mitra AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <span className="text-orange-200 text-xs truncate">Online · Ask me anything!</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors flex-shrink-0 p-1"
                aria-label="Close chat"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 bg-slate-800 overflow-y-auto px-3 py-3"
              style={{ maxHeight: '370px', minHeight: '180px' }}
            >
              {messages.map(msg => (
                <Message key={msg.id} msg={msg} />
              ))}
              {loading && <TypingIndicator />}

              {/* Quick Suggestions */}
              {showSuggestions && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1.5 mt-1 mb-1"
                >
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-2.5 py-1 rounded-full border border-orange-500/50 text-orange-300 hover:bg-orange-500/20 hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-slate-900 px-3 py-2.5 flex items-center gap-2 border-t border-slate-700/80 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 bg-slate-700/80 text-gray-100 placeholder-gray-500 text-base sm:text-sm px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-600/50 disabled:opacity-50 transition-all"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 to-green-600 flex items-center justify-center text-white disabled:opacity-40 hover:from-orange-500 hover:to-green-500 transition-all flex-shrink-0 active:scale-95"
                aria-label="Send"
              >
                <BiSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ── */}
      <div className="fixed right-4 bottom-6 sm:right-6 sm:bottom-8 z-[80]">
        <div className="relative group">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-orange-400/55"
            animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-green-500/45"
            animate={{ scale: [1, 1.85], opacity: [0.35, 0] }}
            transition={{ duration: 1.9, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
          />

          <motion.button
            onClick={() => setIsOpen(v => !v)}
            aria-label="Open Career Mitra AI Chat"
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-green-600 text-white shadow-xl shadow-orange-600/40 flex items-center justify-center border-2 border-white/25"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <IoClose size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="bot"
                  initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl leading-none"
                >
                  🤖
                </motion.span>
              )}
            </AnimatePresence>

            <motion.span
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-orange-600 flex items-center justify-center shadow-md pointer-events-none"
              animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <HiOutlineSparkles size={14} />
            </motion.span>
          </motion.button>

          {!isOpen && (
            <div className="hidden sm:block absolute right-16 bottom-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
              <div className="bg-white border border-orange-100 text-gray-700 shadow-lg rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap">
                Ask Career Mitra AI ✨
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
