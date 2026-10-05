'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCatalog, usePricing } from '@/shared/providers/ProductProvider';
import { derivePricing, fillPriceTokens } from '@/shared/pricing';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, ShieldCheck, RotateCcw, Pill, Plane, Truck, FileText, Stethoscope,
  Tag, RefreshCw, CalendarClock, Baby, CreditCard, Headphones, AlertTriangle,
  ArrowUpRight, Phone, Mail, MessageCircle, ChevronDown, type LucideIcon,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
 * Knowledge base — keep in sync with /buy, /shipping, /faq and /refund.
 * ──────────────────────────────────────────────────────────────────────────── */

interface Action {
  label: string;
  href: string;
}

interface Suggestion {
  label: string;
  icon: LucideIcon;
}

interface Intent {
  id: string;
  /** Lower-case keywords; multi-word phrases score higher than single words. */
  keywords: string[];
  text: string;
  bullets?: string[];
  actions?: Action[];
  followUps?: string[];
}

const SUPPORT_PHONE = '+91 81484 93389';
const SUPPORT_EMAIL = 'sales@travelmed.org';

const INTENTS: Intent[] = [
  {
    id: 'medicines',
    keywords: ['medicine', 'medicines', 'inside', 'contain', 'contents', 'included', 'does the kit include', 'in the kit', "what's in", 'whats in', 'categories', 'tablets', 'pills', 'list'],
    text: 'The kit contains **150+ CDSCO-regulated medicines and essentials** across 17 categories:',
    bullets: [
      'Antacids, antispasmodics & antimotility drugs',
      'Pain killers, antipyretics (fever) & anti-cold',
      'Antibiotic, antihistamine & antiemetic',
      'Motion sickness tablets & ORS salts',
      'Cough suppressant & sore throat lozenges',
      'Laxative, pre & probiotics',
      'Bandages, plasters & first-aid cotton',
    ],
    actions: [{ label: 'View full kit details', href: '/buy' }, { label: 'Travel medicine checklist', href: '/blog/medicines-to-carry-abroad-from-india' }],
    followUps: ['How do the free consults work?', 'Is it airport friendly?'],
  },
  {
    id: 'teleconsult',
    keywords: ['consult', 'consults', 'consultation', 'teleconsult', 'teleconsultation', 'doctor', 'physician', 'call', 'qr', 'book'],
    text: 'Every kit includes **2 free teleconsultations** (General Physician & Orthopaedician) worth ₹1,500, valid for **12 months**.',
    bullets: [
      'Scan the QR code inside your pouch or use your order link',
      'Share your symptoms and Order ID',
      'A licensed doctor contacts you within **8–12 hours** of booking',
    ],
    actions: [{ label: 'Book a consultation', href: '/teleconsultation' }],
    followUps: ['Does it include a prescription?', 'What medicines are included?'],
  },
  {
    id: 'airport',
    keywords: ['tsa', 'airport', 'flight', 'fly', 'flying', 'security', 'customs', 'carry', 'cabin', 'baggage', 'luggage', 'check-in', 'approved', 'allowed'],
    text: 'Yes — the kit is built for air travel. It is **liquid-free**, uses solid blister packs in a shockproof 1680D nylon pouch, and comes with a **signed doctor\'s prescription** for customs.',
    bullets: [
      'Pack the kit in your **checked baggage**, and keep a day or two of essentials plus any daily prescription medicines in your **cabin bag**.',
      'Some countries restrict certain medicines — check your destination before you fly.',
    ],
    actions: [{ label: 'Flying with medicines', href: '/blog/carrying-medicines-on-international-flights' }, { label: 'Banned medicines abroad', href: '/blog/medicines-banned-abroad-for-indian-travellers' }],
    followUps: ['Does it include a prescription?', 'Delivery timeline?'],
  },
  {
    id: 'shipping',
    keywords: ['shipping', 'ship', 'delivery', 'deliver', 'dispatch', 'arrive', 'days', 'how long', 'timeline', 'courier'],
    text: 'Shipping is **free on every order** across India. Orders are processed within 1 business day.',
    bullets: [
      'Metro cities: **2–3 business days**',
      'Tier 2 & 3 cities: **3–5 business days**',
      'Remote areas & North-East: **5–7 business days**',
    ],
    actions: [{ label: 'Shipping policy', href: '/shipping' }, { label: 'Track an order', href: '/track-order' }],
    followUps: ['Do you ship outside India?', 'How much does the kit cost?'],
  },
  {
    id: 'international',
    keywords: ['outside india', 'international shipping', 'abroad', 'overseas', 'usa', 'uk', 'dubai', 'singapore', 'ship to'],
    text: 'We currently **ship within India only**. You can order before you fly and carry the kit with you — it works anywhere in the world, and the teleconsultations are available globally.',
    actions: [{ label: 'Shipping policy', href: '/shipping' }],
    followUps: ['Delivery timeline?', 'Is it airport friendly?'],
  },
  {
    id: 'track',
    keywords: ['track', 'tracking', 'where is my order', 'order status', 'my order'],
    text: 'You can track your order anytime with your **Order ID** (e.g. TM-XXXXXX) from your confirmation.',
    actions: [{ label: 'Track my order', href: '/track-order' }],
    followUps: ['Delivery timeline?', 'Talk to support'],
  },
  {
    id: 'prescription',
    keywords: ['prescription', 'rx', 'signed', 'need a prescription', 'dosage', 'instructions', 'guide'],
    text: 'No prescription is needed to buy. Every kit includes an **official signed doctor\'s prescription** matching the medicines inside, plus clear English dosage instructions.',
    actions: [{ label: 'Shop the kit', href: '/buy' }],
    followUps: ['How do the free consults work?', 'Is it airport friendly?'],
  },
  {
    id: 'price',
    keywords: ['price', 'cost', 'how much', 'buy', 'order', 'purchase', 'discount', 'offer', 'sale', '₹', 'rupees', 'cheap'],
    text: 'The Travel Med Kit is **{price}** (MRP {mrp} — you save {save}). That includes 150+ medicines, 2 free doctor consultations, a signed prescription and free shipping.',
    actions: [{ label: 'Buy the kit', href: '/buy' }],
    followUps: ['What medicines are included?', 'What payment methods do you accept?'],
  },
  {
    id: 'payment',
    keywords: ['payment', 'pay', 'upi', 'card', 'credit', 'debit', 'net banking', 'emi', 'razorpay', 'wallet', 'invoice', 'gst'],
    text: 'Payments are processed securely via **Razorpay**. We accept UPI (GPay, PhonePe, Paytm), credit & debit cards, net banking and wallets. A GST invoice is emailed after your order.',
    actions: [{ label: 'Go to checkout', href: '/checkout' }],
    followUps: ['How much does the kit cost?', 'Delivery timeline?'],
  },
  {
    id: 'returns',
    keywords: ['return', 'refund', 'replace', 'replacement', 'damaged', 'broken', 'wrong', 'cancel', 'cancellation', 'missing'],
    text: 'If your kit arrives **damaged, defective or incorrect**, contact us within **7 days of delivery** with photos and your Order ID. We\'ll send a replacement or process a full refund within 5–7 business days.',
    bullets: ['Opened or used kits can\'t be returned for safety reasons.', 'Orders can be cancelled before dispatch.'],
    actions: [{ label: 'Returns policy', href: '/shipping' }, { label: 'Refund policy', href: '/refund' }],
    followUps: ['Talk to support', 'Track my order'],
  },
  {
    id: 'expiry',
    keywords: ['expiry', 'expire', 'expiration', 'shelf life', 'how long does it last', 'valid'],
    text: 'Every medicine carries its own printed expiry date, and we guarantee **18 to 24 months of shelf life** on dispatch.',
    followUps: ['What medicines are included?', 'How much does the kit cost?'],
  },
  {
    id: 'children',
    keywords: ['child', 'children', 'kid', 'kids', 'baby', 'infant', 'toddler', 'pregnant', 'pregnancy', 'elderly'],
    text: 'The kit is **primarily formulated for adults**. For children, pregnancy or special conditions, please consult a doctor before using any medicine — you can use one of your free teleconsultations for this.',
    actions: [{ label: 'Book a consultation', href: '/teleconsultation' }],
    followUps: ['How do the free consults work?', 'What medicines are included?'],
  },
  {
    id: 'destination',
    keywords: ['thailand', 'bangkok', 'phuket', 'bali', 'dubai', 'uae', 'abu dhabi', 'singapore', 'europe', 'schengen', 'japan', 'tokyo', 'umrah', 'hajj', 'saudi', 'mecca', 'makkah', 'destination', 'country', 'trip to'],
    text: 'We have doctor-reviewed guides on what to carry and the local medicine rules for popular destinations from India:',
    actions: [
      { label: 'Thailand', href: '/travel-medicine-kit/thailand' },
      { label: 'Dubai & UAE', href: '/travel-medicine-kit/dubai-uae' },
      { label: 'Singapore', href: '/travel-medicine-kit/singapore' },
      { label: 'Europe', href: '/travel-medicine-kit/europe' },
      { label: 'Japan', href: '/travel-medicine-kit/japan' },
      { label: 'Umrah & Hajj', href: '/travel-medicine-kit/umrah-hajj' },
    ],
    followUps: ['What medicines are included?', 'Is it airport friendly?'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'support', 'human', 'agent', 'person', 'talk to', 'speak', 'phone', 'email', 'call you', 'help desk'],
    text: `Our team is available **Mon–Sat, 9 AM – 6 PM IST**. Call ${SUPPORT_PHONE} or email ${SUPPORT_EMAIL}.`,
    actions: [
      { label: 'Call support', href: `tel:${SUPPORT_PHONE.replace(/\s/g, '')}` },
      { label: 'Email us', href: `mailto:${SUPPORT_EMAIL}` },
    ],
    followUps: ['Track my order', 'Returns & refunds'],
  },
];

const EMERGENCY_KEYWORDS = [
  'emergency', 'chest pain', 'heart attack', "can't breathe", 'cant breathe', 'difficulty breathing', 'not breathing',
  'unconscious', 'fainted', 'seizure', 'stroke', 'severe bleeding', 'bleeding heavily', 'overdose', 'poisoning',
  'suicide', 'anaphylaxis', 'throat swelling', 'dying',
];

const EMERGENCY_REPLY: Omit<Intent, 'id' | 'keywords'> = {
  text: '**This sounds like a medical emergency.** Please call your local emergency number right now — **112** in India and much of Europe, **911** in the US — or go to the nearest hospital. Our kit and teleconsultations are not a substitute for emergency care.',
  actions: [{ label: 'Call 112', href: 'tel:112' }],
};

const FALLBACK: Omit<Intent, 'id' | 'keywords'> = {
  text: 'I\'m not sure I understood that. I can help with kit contents, doctor consultations, airport travel, shipping, returns and pricing — or connect you with our team.',
  followUps: ['What medicines are included?', 'How do the free consults work?', 'Talk to support'],
};

const SUGGESTIONS: Suggestion[] = [
  { label: 'What medicines are included?', icon: Pill },
  { label: 'How do the free consults work?', icon: Stethoscope },
  { label: 'Is it airport friendly?', icon: Plane },
  { label: 'Delivery timeline?', icon: Truck },
  { label: 'Does it include a prescription?', icon: FileText },
  { label: 'How much does the kit cost?', icon: Tag },
];

const FOLLOW_UP_ICONS: Record<string, LucideIcon> = {
  medicines: Pill,
  consult: Stethoscope,
  airport: Plane,
  delivery: Truck,
  ship: Truck,
  prescription: FileText,
  cost: Tag,
  payment: CreditCard,
  track: Truck,
  support: Headphones,
  return: RefreshCw,
  expiry: CalendarClock,
  children: Baby,
};

const iconForLabel = (label: string): LucideIcon => {
  const l = label.toLowerCase();
  const key = Object.keys(FOLLOW_UP_ICONS).find((k) => l.includes(k));
  return key ? FOLLOW_UP_ICONS[key] : MessageCircle;
};

function matchIntent(query: string): Omit<Intent, 'id' | 'keywords'> & { emergency?: boolean } {
  const q = ` ${query.toLowerCase().replace(/[?!.,]/g, ' ')} `;

  if (EMERGENCY_KEYWORDS.some((k) => q.includes(k))) {
    return { ...EMERGENCY_REPLY, emergency: true };
  }

  const tokens = q.split(/[^a-z0-9'\-]+/).filter(Boolean);
  // Include naive singulars so "returns" also matches "return"
  const words = new Set([...tokens, ...tokens.map((t) => t.replace(/s$/, ''))]);

  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      // Phrases match as substrings and weigh more; single words must match a whole word
      const isPhrase = kw.includes(' ');
      const hit = isPhrase || kw === '₹' ? q.includes(kw) : words.has(kw);
      if (hit) score += isPhrase ? 3 : 1;
    }
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  return best ?? FALLBACK;
}

/* ──────────────────────────────────────────────────────────────────────────── */

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  bullets?: string[];
  actions?: Action[];
  followUps?: string[];
  emergency?: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'travelmed_chat_v2';
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const welcomeMessage = (): Message => ({
  id: 'welcome',
  sender: 'bot',
  text: "Hello! I'm the **TravelMed Assistant**. Ask me anything about our medical kit, doctor consultations, delivery or travel with medicines.",
  timestamp: now(),
});

/** Renders **bold** segments safely without HTML injection. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-heading">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function AssistantAvatar({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const dims = size === 'lg' ? 'h-11 w-11 rounded-2xl' : 'h-7 w-7 rounded-lg';
  const icon = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <span className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-secondary to-primary text-white shadow-sm ${dims}`}>
      <Stethoscope className={icon} />
    </span>
  );
}

export const Chatbot: React.FC = () => {
  const pricing = usePricing();
  const catalog = useCatalog();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTeaser, setShowTeaser] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore conversation for this browser session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Message[];
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
          setHasUnread(false);
          return;
        }
      }
    } catch {
      /* storage unavailable */
    }
    setMessages([welcomeMessage()]);
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage unavailable */
    }
  }, [messages]);

  // Gentle one-time teaser bubble on desktop
  useEffect(() => {
    if (!hasUnread) return;
    const show = setTimeout(() => setShowTeaser(true), 6000);
    const hide = setTimeout(() => setShowTeaser(false), 16000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [hasUnread]);

  useEffect(() => () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, messages, isTyping, scrollToBottom]);

  // Open/close side effects: focus, Escape, mobile scroll lock
  useEffect(() => {
    if (!isOpen) return;
    setHasUnread(false);
    setShowTeaser(false);
    const focusTimer = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);

    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    const prevOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
      if (isMobile) document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleSend = (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { id: uid(), sender: 'user', text, timestamp: now() }]);
    if (!preset) setInput('');
    setIsTyping(true);

    const matched = matchIntent(text);
    // With more than one kit, the price answer lists every kit with its live price
    const reply =
      matched.text.includes('{price}') && catalog.length > 1
        ? {
            ...matched,
            text: `We have **${catalog.length} kits** — pick the one that fits your trip. All include a signed doctor's prescription and free shipping:`,
            bullets: catalog.map((k) => {
              const p = derivePricing(k)!;
              const consults = k.consultsIncluded > 0 ? `, ${k.consultsIncluded} free consult${k.consultsIncluded === 1 ? '' : 's'}` : '';
              return `**${k.name}** — ${p.priceText}${k.tripLength ? ` (${k.tripLength}${consults})` : consults ? ` (${consults.slice(2)})` : ''}`;
            }),
            actions: [{ label: 'Compare kits', href: '/buy' }],
          }
        : matched;
    const delay = Math.min(1400, 500 + reply.text.length * 4);
    typingTimer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          sender: 'bot',
          // Price answers always use the live admin-managed price
          text:
            reply.text.includes('{price}') && !pricing
              ? 'Please see the **Buy Kit** page for the current price and offers. Every kit includes 150+ medicines, 2 free doctor consultations, a signed prescription and free shipping.'
              : fillPriceTokens(reply.text, pricing),
          bullets: reply.bullets?.map((b) => fillPriceTokens(b, pricing)),
          actions: reply.actions,
          followUps: reply.followUps,
          emergency: reply.emergency,
          timestamp: now(),
        },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const resetChat = () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setIsTyping(false);
    setMessages([welcomeMessage()]);
    inputRef.current?.focus();
  };

  const lastBotId = [...messages].reverse().find((m) => m.sender === 'bot')?.id;
  const showSuggestions = messages.length === 1 && messages[0].id === 'welcome' && !isTyping;

  return (
    <>
      {/* ── Launcher ──────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-[9999] font-sans">
        <AnimatePresence>
          {showTeaser && !isOpen && (
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute bottom-[72px] right-0 hidden w-64 rounded-2xl rounded-br-md border border-border bg-white p-4 text-left shadow-[0_20px_50px_rgba(15,23,42,0.15)] sm:block cursor-pointer"
            >
              <p className="text-sm font-semibold text-heading">Questions before you travel?</p>
              <p className="mt-1 text-xs text-slate-500">Ask about medicines, consultations or delivery.</p>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpen && (
            <motion.button
              type="button"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              aria-label="Open TravelMed Assistant"
              className="group relative flex h-14 items-center gap-3 rounded-full bg-gradient-to-br from-primary to-primary-dark pl-2 pr-2 sm:pr-5 text-white shadow-[0_12px_40px_rgba(11,79,140,0.40)] ring-1 ring-white/10 transition-shadow hover:shadow-[0_16px_48px_rgba(11,79,140,0.50)] cursor-pointer"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="hidden sm:block text-left">
                <span className="block text-[13px] font-bold leading-tight">Ask TravelMed</span>
                <span className="block text-[11px] text-white/70 leading-tight">Usually replies instantly</span>
              </span>
              {hasUnread && (
                <span className="absolute right-0.5 top-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-secondary" />
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat window ───────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9998] bg-slate-950/40 backdrop-blur-[2px] sm:hidden"
            />
            <motion.section
              role="dialog"
              aria-label="TravelMed Assistant"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', damping: 30, stiffness: 340 }}
              style={{ transformOrigin: 'bottom right' }}
              className="fixed inset-x-0 bottom-0 z-[9999] flex h-[88dvh] flex-col overflow-hidden rounded-t-[28px] border border-border bg-white font-sans shadow-[0_30px_100px_rgba(2,6,23,0.30)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[640px] sm:max-h-[calc(100dvh-40px)] sm:w-[400px] sm:rounded-[28px]"
            >
              {/* Header */}
              <header className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] px-5 pt-5 pb-5 text-white">
                <div aria-hidden className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-secondary/30 blur-[60px]" />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                        <Stethoscope className="h-5 w-5 text-white" />
                      </span>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-emerald-400" />
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold leading-tight" style={{ color: '#fff' }}>
                        TravelMed Assistant
                      </p>
                      <p className="mt-0.5 text-xs text-white/70">Online · Replies instantly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={resetChat}
                      aria-label="Start a new conversation"
                      title="New conversation"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close chat"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15 cursor-pointer"
                    >
                      <ChevronDown className="h-5 w-5 sm:hidden" />
                      <X className="hidden h-5 w-5 sm:block" />
                    </button>
                  </div>
                </div>
              </header>

              {/* Messages */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto overscroll-contain bg-background/60 px-4 py-5 space-y-4"
              >
                {messages.map((msg) =>
                  msg.sender === 'user' ? (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-end"
                    >
                      <div className="max-w-[82%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                        {msg.text}
                      </div>
                      <span className="mt-1 px-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2.5"
                    >
                      <AssistantAvatar />
                      <div className="min-w-0 max-w-[85%]">
                        <div
                          className={`rounded-2xl rounded-tl-md border px-4 py-3 text-sm leading-relaxed text-slate-600 shadow-sm ${
                            msg.emergency ? 'border-rose-200 bg-rose-50' : 'border-border bg-white'
                          }`}
                        >
                          {msg.emergency && (
                            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-rose-600">
                              <AlertTriangle className="h-3.5 w-3.5" /> Urgent
                            </p>
                          )}
                          <p>
                            <RichText text={msg.text} />
                          </p>
                          {msg.bullets && (
                            <ul className="mt-2.5 space-y-1.5">
                              {msg.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                                  <span>
                                    <RichText text={b} />
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {msg.actions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.actions.map((a) => {
                                const external = a.href.startsWith('tel:') || a.href.startsWith('mailto:');
                                const Icon = a.href.startsWith('tel:') ? Phone : a.href.startsWith('mailto:') ? Mail : ArrowUpRight;
                                const cls = `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                                  msg.emergency
                                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                                    : 'bg-primary text-white hover:bg-primary-dark'
                                }`;
                                return external ? (
                                  <a key={a.label} href={a.href} className={cls}>
                                    <Icon className="h-3.5 w-3.5" /> {a.label}
                                  </a>
                                ) : (
                                  <Link key={a.label} href={a.href} onClick={() => setIsOpen(false)} className={cls}>
                                    {a.label} <Icon className="h-3.5 w-3.5" />
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <span className="mt-1 block px-1 text-[10px] text-slate-400">{msg.timestamp}</span>

                        {msg.id === lastBotId && msg.followUps && !isTyping && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {msg.followUps.map((f) => {
                              const Icon = iconForLabel(f);
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => handleSend(f)}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary/40 hover:text-primary cursor-pointer"
                                >
                                  <Icon className="h-3.5 w-3.5 text-secondary-dark" />
                                  {f}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                )}

                {/* Starter suggestions */}
                {showSuggestions && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="pl-[38px]">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Popular questions</p>
                    <div className="grid grid-cols-1 gap-2">
                      {SUGGESTIONS.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleSend(label)}
                          className="group flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-2.5 text-left text-sm font-medium text-heading transition hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(11,79,140,0.08)] cursor-pointer"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary transition group-hover:bg-primary group-hover:text-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2.5" aria-label="Assistant is typing">
                    <AssistantAvatar />
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-md border border-border bg-white px-4 py-3.5 shadow-sm">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-background/70 p-1.5 pl-4 transition focus-within:border-primary/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question…"
                    aria-label="Type your question"
                    maxLength={500}
                    className="min-w-0 flex-1 bg-transparent text-sm text-heading placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-dark disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck className="h-3 w-3" /> General guidance only — not a substitute for medical advice
                </p>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
