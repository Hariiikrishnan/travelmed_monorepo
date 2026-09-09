'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, Sparkles, ShieldCheck, 
  RefreshCw, PhoneCall, Pill, Plane, CheckCircle2, ChevronRight, User
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

const QUICK_PROMPTS = [
  "💊 What medicines are in the kit?",
  "🩺 How do the 2 free teleconsults work?",
  "✈️ Is it TSA airport approved?",
  "🚚 Delivery & shipping timeline?",
  "📋 Does it come with a prescription?"
];

const PREDEFINED_RESPONSES: Record<string, { text: string; replies?: string[] }> = {
  "medicines": {
    text: "The Travel Med Kit includes 150+ DCGI-approved over-the-counter medicines covering 17 key categories: Antacids, Pain Killers, Antimotility, Antibiotics, ORS Salts, Antihistamines, Motion Sickness, Cough Suppressants, Bandages & Dressing Cotton.",
    replies: ["Is it TSA approved?", "How do teleconsults work?"]
  },
  "teleconsult": {
    text: "Every Travel Med Kit includes 2 FREE doctor teleconsultations with licensed General Physicians & Orthopaedicians worth ₹1,500. Simply scan the QR code inside the pouch to connect in under 3 minutes globally!",
    replies: ["What medicines are included?", "Does it include a prescription?"]
  },
  "tsa": {
    text: "Yes! The Travel Med Kit is 100% TSA & international airport security compliant. It uses a liquid-free, 1680D ballistic nylon shockproof pouch designed to easily pass customs check lines.",
    replies: ["What medicines are inside?", "Delivery timeline?"]
  },
  "shipping": {
    text: "We provide Express Shipping on all orders across India! Metro deliveries arrive in 1-2 business days, and standard nationwide shipping takes 2-4 business days.",
    replies: ["How much does the kit cost?", "What's in the kit?"]
  },
  "prescription": {
    text: "Yes! Every kit comes with an official signed Doctor's Prescription along with clear English dosage & usage instructions printed right inside the pouch dividers.",
    replies: ["How do teleconsults work?", "Buy Kit Now"]
  },
  "price": {
    text: "The Travel Med Kit is currently on sale for ₹2,900 (Original ₹4,500 — You save ₹1,600 / 35% OFF). It includes 150+ medicines, 2 FREE doctor teleconsultations, and signed Rx!",
    replies: ["Buy Kit Now", "What medicines are included?"]
  }
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm your TravelMed AI Health Advisor. Planning a trip or have questions about our medical kit?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: QUICK_PROMPTS
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadBadge(false);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (userQuery?: string) => {
    const textToSend = userQuery || input.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userQuery) setInput('');
    setIsTyping(true);

    // Simulate smart AI response match
    setTimeout(() => {
      const botResponse = getAiResponse(textToSend);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 900);
  };

  const getAiResponse = (query: string): Message => {
    const q = query.toLowerCase();
    let text = "";
    let replies: string[] | undefined;

    if (q.includes("medicine") || q.includes("in the kit") || q.includes("inside") || q.includes("contain")) {
      text = PREDEFINED_RESPONSES["medicines"].text;
      replies = PREDEFINED_RESPONSES["medicines"].replies;
    } else if (q.includes("consult") || q.includes("doctor") || q.includes("teleconsult")) {
      text = PREDEFINED_RESPONSES["teleconsult"].text;
      replies = PREDEFINED_RESPONSES["teleconsult"].replies;
    } else if (q.includes("tsa") || q.includes("airport") || q.includes("flight") || q.includes("security") || q.includes("custom")) {
      text = PREDEFINED_RESPONSES["tsa"].text;
      replies = PREDEFINED_RESPONSES["tsa"].replies;
    } else if (q.includes("shipping") || q.includes("delivery") || q.includes("deliver") || q.includes("track")) {
      text = PREDEFINED_RESPONSES["shipping"].text;
      replies = PREDEFINED_RESPONSES["shipping"].replies;
    } else if (q.includes("prescription") || q.includes("rx") || q.includes("signed")) {
      text = PREDEFINED_RESPONSES["prescription"].text;
      replies = PREDEFINED_RESPONSES["prescription"].replies;
    } else if (q.includes("price") || q.includes("cost") || q.includes("buy") || q.includes("discount") || q.includes("₹")) {
      text = PREDEFINED_RESPONSES["price"].text;
      replies = PREDEFINED_RESPONSES["price"].replies;
    } else {
      text = "Travel Med Kit is designed to protect your global travels with 150+ DCGI-approved medicines, 2 FREE doctor teleconsultations, and signed Doctor's Prescription. How else can I assist your journey?";
      replies = ["What's in the kit?", "How do free consults work?", "TSA Approved?"];
    }

    return {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: replies
    };
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Chat cleared! How can I help you with Travel Med today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: QUICK_PROMPTS
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] select-none font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-full shadow-[0_8px_32px_rgba(11,79,140,0.35)] hover:shadow-[0_12px_40px_rgba(11,79,140,0.45)] border border-white/20 transition-all cursor-pointer group"
          aria-label="Open AI Health Chatbot"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-1 rounded-full bg-primary/30 blur-md group-hover:bg-primary/50 transition-all animate-pulse" />
          
          <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-white/20 backdrop-blur-md">
            <Sparkles className="h-4.5 w-4.5 text-white animate-spin-slow" />
          </div>

          <div className="relative hidden sm:flex flex-col text-left">
            <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-90 leading-none">TravelMed AI</span>
            <span className="text-xs font-bold leading-tight">Health Assistant</span>
          </div>

          {/* Unread notification badge */}
          {unreadBadge && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white" />
            </span>
          )}
        </motion.button>
      )}

      {/* Expandable Animated Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.22)] border border-slate-200/80 dark:border-neutral-800 flex flex-col overflow-hidden"
          >
            {/* Header Strip */}
            <div className="bg-primary p-4 text-white flex items-center justify-between shadow-md relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-wide font-heading" style={{ color: '#ffffff' }}>TravelMed AI</span>
                    <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: '#ffffff', opacity: 0.9 }}>Your Global Medical Advisor</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-xl hover:bg-white/15 transition text-white/80 hover:text-white cursor-pointer"
                  title="Clear chat"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/15 transition text-white cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Guarantee Badge */}
            <div className="bg-teal-50/80 dark:bg-neutral-850/80 px-4 py-2 border-b border-teal-100/60 dark:border-neutral-800 flex items-center justify-between text-[11px] font-semibold text-teal-800 dark:text-teal-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>150+ DCGI Medicines &amp; 2 Free Teleconsults</span>
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-neutral-950/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {msg.sender === 'bot' && (
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white rounded-br-xs font-medium'
                          : 'bg-white dark:bg-neutral-850 text-slate-800 dark:text-neutral-100 border border-slate-200/70 dark:border-neutral-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Quick Action Reply Chips */}
                  {msg.sender === 'bot' && msg.quickReplies && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[90%]">
                      {msg.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(reply)}
                          className="text-[11px] font-semibold px-3 py-1.5 bg-white dark:bg-neutral-800 hover:bg-primary/10 hover:text-primary text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-neutral-700 rounded-full transition-all cursor-pointer shadow-xs active:scale-95 text-left"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Animated Typing Dots Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 max-w-[85%]">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-white dark:bg-neutral-850 px-4 py-3 rounded-2xl border border-slate-200/70 dark:border-neutral-800 rounded-bl-xs flex items-center gap-1.5 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-neutral-900 border-t border-slate-200/80 dark:border-neutral-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about medicines, TSA, consults..."
                className="flex-1 px-4 py-2.5 bg-slate-100/80 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 focus:outline-none focus:border-primary transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="h-10 w-10 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white rounded-2xl flex items-center justify-center shadow-md transition cursor-pointer shrink-0 active:scale-95"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
