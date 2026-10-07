'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/providers/CartProvider';
import { usePricing } from '@/shared/providers/ProductProvider';
// Loaded dynamically from backend API
import { Doctor } from '@/types';
import { site } from '@/shared/config/site';
import { Accordion } from '@/shared/ui/Accordion';
import { Rating } from '@/shared/ui/Rating';
import { Avatar } from '@/shared/ui/Avatar';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { FloatingKit } from '@/shared/ui/FloatingKit';
import {
  Stethoscope,
  ShieldCheck,
  Clock,
  Check,
  ChevronRight,
  RefreshCw,
  Smartphone,
  FileText,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Languages,
  Lock,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-dark">
      <span className="h-px w-6 bg-secondary-dark" />
      {children}
    </span>
  );
}

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'doc-priya',
    name: 'Dr. Priya Sharma',
    specialty: 'Internal Medicine & Tropical Diseases',
    languages: ['English', 'Hindi', 'Spanish'],
    experience: '12 years',
    bio: '12+ years experience treating travel-acquired infections, GI disorders, and emergency altitude conditions.',
    rating: 4.9,
    reviewsCount: 342,
    availability: 'Available Now',
    image: '',
    videoSimulatedUrl: 'https://travelmed.org/tele/call-tm-9843'
  },
  {
    id: 'doc-marcus',
    name: 'Dr. Marcus Vance',
    specialty: 'Emergency Medicine & Wilderness Care',
    languages: ['English', 'French'],
    experience: '15 years',
    bio: 'Specialist in wilderness triage, wound treatment, and rapid remote diagnostics.',
    rating: 4.8,
    reviewsCount: 289,
    availability: 'Available Now',
    image: '',
    videoSimulatedUrl: 'https://travelmed.org/tele/call-tm-9844'
  },
  {
    id: 'doc-elena',
    name: 'Dr. Elena Rostova',
    specialty: 'General Practice & Travel Health',
    languages: ['English', 'German', 'Russian'],
    experience: '10 years',
    bio: 'Certified travel health consultant advising global tourists and digital nomads.',
    rating: 4.9,
    reviewsCount: 410,
    availability: 'Available Now',
    image: '',
    videoSimulatedUrl: 'https://travelmed.org/tele/call-tm-9845'
  }
];

export default function TeleconsultationPage() {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();
  const pricing = usePricing('paid-consultation');

  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/doctors`)
      .then(res => res.json())
      .then(body => {
        if (body.success && Array.isArray(body.data) && body.data.length > 0) {
          setDoctors(body.data);
        }
      })
      .catch(err => console.error('Failed to fetch doctors', err))
      .finally(() => setLoading(false));
  }, []);

  // Triage state machine
  const [step, setStep] = useState(1);
  const [symptom, setSymptom] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [orderId, setOrderId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<{
    id: string;
    orderId: string;
    sequence: number;
    consultationsRemaining: number;
    consultationsAllowed: number;
  } | null>(null);

  const symptoms = ['Stomach & GI (Bali belly)', 'Fever & Pain (Altitude/Headache)', 'Severe Allergy / Rash', 'Wound care / Scraping'];
  const destinations = ['Southeast Asia & Pacific', 'Europe & UK', 'Americas & Latin', 'Africa & Middle East'];

  const handleSymptomSelect = (sym: string) => {
    setSymptom(sym);

    const docList = doctors.length > 0 ? doctors : DEFAULT_DOCTORS;
    let matchedDoc: Doctor | undefined;

    if (sym.includes('Stomach')) {
      matchedDoc = docList.find(d => d.id === 'doc-priya') || docList[0];
    } else if (sym.includes('Wound') || sym.includes('Fever')) {
      matchedDoc = docList.find(d => d.id === 'doc-marcus') || docList[0];
    } else {
      matchedDoc = docList.find(d => d.id === 'doc-elena') || docList[0];
    }

    setSelectedDoctor(matchedDoc || DEFAULT_DOCTORS[0]);
    setStep(2);
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
    if (!selectedDoctor) {
      const docList = doctors.length > 0 ? doctors : DEFAULT_DOCTORS;
      setSelectedDoctor(docList[0]);
    }
    setStep(3);
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !whatsapp.trim()) {
      setErrorMsg('Please enter both Order ID and WhatsApp Number.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      // The server checks the order is paid and enforces the 2-consultations-per-order limit
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), whatsapp: whatsapp.trim(), symptom, destination }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(body.message || 'Could not book your consultation. Please try again.');
        return;
      }
      setBooking(body.data);
      setStep(4);
    } catch {
      setErrorMsg('Unable to reach our servers. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSymptom('');
    setDestination('');
    setSelectedDoctor(null);
    setOrderId('');
    setWhatsapp('');
    setErrorMsg('');
    setBooking(null);
  };

  const activeDoctor = selectedDoctor || (doctors.length > 0 ? doctors[0] : DEFAULT_DOCTORS[0]);

  const faqs = [
    {
      id: 'tele-faq-1',
      title: 'Are the doctors licensed to consult international travelers?',
      content: (
        <span>
          Our medical panel consists of board-certified General Physicians and Orthopaedicians licensed in India, holding international travel medicine certifications. They are fully authorized to provide medical guidance, triage assessment, dosage instructions, and signed travel prescriptions for global travelers.
        </span>
      )
    },
    {
      id: 'tele-faq-2',
      title: 'How do I connect to a doctor consultation while abroad?',
      content: (
        <span>
          Inside your Travel Med pouch lid, scan the high-definition QR code using any mobile camera or click the consultation link from your email order confirmation to book your slot. Our physician will contact you within <strong className="font-bold text-slate-900 dark:text-white">8–12 hours of booking</strong>.
        </span>
      )
    },
    {
      id: 'tele-faq-3',
      title: "Is the Doctor's Prescription valid for airport security and customs?",
      content: (
        <span>
          <strong className="font-bold text-slate-900 dark:text-white">Yes.</strong> Every Travel Med Kit comes with an official signed Doctor's Prescription matching the exact 150+ medications inside to show at airport security or customs if asked.
        </span>
      )
    },
    {
      id: 'tele-faq-4',
      title: 'When will the doctor contact me after booking?',
      content: (
        <span>
          Once you submit your booking request, our medical team processes it and a licensed doctor will contact you within <strong className="font-bold text-slate-900 dark:text-white">8–12 hours of booking</strong> across all global time zones.
        </span>
      )
    }
  ];

  const stepLabels = ['Symptoms', 'Location', 'Your details'];

  const optionButtonClass =
    'group flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 text-left text-sm md:text-[15px] font-semibold text-heading transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_15px_40px_rgba(11,79,140,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer select-none';

  const inputClass =
    'w-full rounded-[14px] border border-border bg-white px-4 py-3.5 text-sm font-medium text-heading placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10';

  const stepMotion = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.3, ease: 'easeOut' as const },
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 text-center lg:text-left">
              <ScrollReveal direction="down">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                  </span>
                  Licensed physicians · Global support
                </span>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.1}>
                <h1 className="mt-7 text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight !text-white leading-[1.05]">
                  A doctor in your pocket,{' '}
                  <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">
                    wherever you travel.
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Book a consultation with board-certified physicians from your phone. Our doctor will contact you
                  within 8–12 hours of booking to triage symptoms, verify medication guidance and keep your trip on
                  track.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <a
                    href="#book"
                    className="group inline-flex items-center gap-2 rounded-[14px] bg-secondary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Book a Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#faq"
                    className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    Policies &amp; FAQ
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <div className="mt-8 flex flex-col items-center lg:items-start">
                  <p className="text-sm text-white/80">Need an extra consultation or out of free credits?</p>
                  <button
                    onClick={() => {
                      if (!pricing || !pricing.inStock) return;
                      addItem({
                        id: pricing.product.id,
                        name: pricing.product.name,
                        price: pricing.price,
                        type: 'kit',
                        description: pricing.product.description || 'One extra teleconsultation.',
                        options: {},
                        quantity: 1,
                      });
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-teal-200 hover:text-white transition group cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Buy Extra Consultation ({pricing?.priceText || '₹500'})
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </ScrollReveal>
            </div>

            {/* Kit visual */}
            <ScrollReveal direction="left" delay={0.2} className="lg:col-span-5 flex justify-center lg:justify-end">
              <FloatingKit rotate={-6} className="w-[280px] sm:w-[360px] lg:w-full lg:max-w-[460px]" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Highlights strip (same style as How It Works) ───── */}
      <section className="relative z-20 -mt-6 md:-mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-[24px] border border-border bg-border shadow-[0_20px_50px_rgba(11,79,140,0.10)]">
              {[
                { icon: BadgeCheck, value: 'Certified', label: 'Board-certified doctors' },
                { icon: Clock, value: '8–12 hrs', label: 'Doctor callback window' },
                { icon: Languages, value: 'Multilingual', label: 'Support in your language' },
                { icon: Lock, value: 'Private', label: 'Secure & confidential' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-4 bg-white px-6 py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-extrabold font-heading text-primary tracking-tight">{value}</div>
                    <div className="text-xs md:text-sm font-medium text-slate-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Booking triage ───────────────────────────────────── */}
      <section id="book" className="scroll-mt-24 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center">
            <Eyebrow>Book a consultation</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Three quick steps to a callback
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
              Tell us what&apos;s wrong and where you are — we&apos;ll match you with the right physician.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="relative mt-12 overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_40px_100px_rgba(11,79,140,0.12)]">
              {/* Stepper */}
              <div className="border-b border-border bg-background/60 px-6 py-5 sm:px-10">
                <div className="flex items-center gap-3">
                  {stepLabels.map((label, i) => {
                    const n = i + 1;
                    const done = step > n;
                    const active = step === n;
                    return (
                      <React.Fragment key={label}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300 ${
                              done
                                ? 'bg-secondary text-white'
                                : active
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'border border-border bg-white text-slate-400'
                            }`}
                          >
                            {done ? <Check className="h-4 w-4" /> : n}
                          </span>
                          <span
                            className={`hidden sm:inline text-sm font-semibold ${
                              active || done ? 'text-heading' : 'text-slate-400'
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {n < stepLabels.length && (
                          <span className="relative h-px flex-1 bg-border">
                            <span
                              className="absolute inset-y-0 left-0 bg-secondary transition-all duration-500"
                              style={{ width: step > n ? '100%' : '0%' }}
                            />
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="min-h-[420px] p-6 sm:p-10 md:p-12">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step-1" {...stepMotion} className="space-y-8">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">Step 1 of 3</p>
                        <h3 className="mt-2 text-2xl md:text-3xl font-extrabold font-heading tracking-tight">
                          What symptoms are you experiencing?
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">Select your primary health concern.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {symptoms.map((s) => (
                          <button key={s} type="button" onClick={() => handleSymptomSelect(s)} className={optionButtonClass}>
                            <span>{s}</span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-slate-400 transition group-hover:bg-primary group-hover:text-white">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step-2" {...stepMotion} className="space-y-8">
                      <div>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition cursor-pointer"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </button>
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">Step 2 of 3</p>
                        <h3 className="mt-2 text-2xl md:text-3xl font-extrabold font-heading tracking-tight">
                          Where are you currently traveling?
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Different regions have different medication and import guidelines.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {destinations.map((d) => (
                          <button key={d} type="button" onClick={() => handleDestinationSelect(d)} className={optionButtonClass}>
                            <span className="flex items-center gap-3">
                              <Globe className="h-4 w-4 text-secondary-dark" />
                              {d}
                            </span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-slate-400 transition group-hover:bg-primary group-hover:text-white">
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && activeDoctor && (
                    <motion.div key="step-3" {...stepMotion} className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                      <div className="md:col-span-7 space-y-7">
                        <div>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition cursor-pointer"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back
                          </button>
                          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">Step 3 of 3</p>
                          <h3 className="mt-2 text-2xl md:text-3xl font-extrabold font-heading tracking-tight">
                            Enter your details
                          </h3>
                          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                            Share your Order ID and WhatsApp number. Our medical team will get back to you soon.
                          </p>
                        </div>

                        <form onSubmit={handleSubmitDetails} className="space-y-5">
                          {errorMsg && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-3">
                              <p className="text-sm font-medium text-rose-600">{errorMsg}</p>
                              {errorMsg.includes('no free teleconsultations') || errorMsg.includes('already been used') || errorMsg.includes('doesn\'t include free') ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!pricing || !pricing.inStock) return;
                                    addItem({
                                      id: pricing.product.id,
                                      name: pricing.product.name,
                                      price: pricing.price,
                                      type: 'kit', // treat as kit for cart logic
                                      description: pricing.product.description || 'One extra teleconsultation.',
                                      options: {},
                                      quantity: 1,
                                    });
                                    setIsCartOpen(false);
                                    router.push('/checkout');
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-200 transition"
                                >
                                  <ShoppingBag className="h-3.5 w-3.5" /> Buy Extra Consultation ({pricing?.priceText || '₹500'})
                                </button>
                              ) : null}
                            </div>
                          )}

                          <div className="space-y-2">
                            <label htmlFor="tele-order-id" className="block text-sm font-semibold text-heading">
                              Order ID <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id="tele-order-id"
                              type="text"
                              required
                              placeholder="e.g. TM-10924"
                              value={orderId}
                              onChange={(e) => setOrderId(e.target.value)}
                              className={inputClass}
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="tele-whatsapp" className="block text-sm font-semibold text-heading">
                              WhatsApp Number <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id="tele-whatsapp"
                              type="tel"
                              required
                              placeholder="e.g. +91 98765 43210"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              className={inputClass}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                          >
                            {submitting ? 'Booking…' : 'Submit & Request Callback'}
                            {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                          </button>
                          <p className="text-center text-xs text-slate-500">
                            Free teleconsultations come with your kit — we check how many your order has left.
                          </p>
                          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                            <Lock className="h-3.5 w-3.5" /> Your details are kept secure and confidential.
                          </p>
                        </form>
                      </div>

                      <div className="md:col-span-5">
                        <div className="rounded-[24px] border border-border bg-background/70 p-6 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Matched physician</p>
                          <Avatar src={activeDoctor.image} alt={activeDoctor.name} size="xl" className="mx-auto mt-5 ring-4 ring-white shadow-lg" />
                          <h4 className="mt-4 font-heading text-base font-bold">{activeDoctor.name}</h4>
                          <p className="mt-1 text-xs font-semibold text-primary">{activeDoctor.specialty}</p>
                          <Rating value={activeDoctor.rating} className="justify-center mt-2" />
                          <p className="mt-3 text-xs text-slate-500 leading-relaxed">{activeDoctor.bio}</p>
                          {(symptom || destination) && (
                            <div className="mt-5 flex flex-wrap justify-center gap-2">
                              {symptom && (
                                <span className="rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
                                  {symptom}
                                </span>
                              )}
                              {destination && (
                                <span className="rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
                                  {destination}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && activeDoctor && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center py-6 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 ring-8 ring-secondary/5">
                        <Check className="h-8 w-8 text-secondary-dark" />
                      </div>
                      <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">
                        {booking ? `Consultation ${booking.sequence} of ${booking.consultationsAllowed} booked` : 'Request submitted'}
                      </p>
                      <h3 className="mt-2 text-2xl md:text-3xl font-extrabold font-heading tracking-tight">
                        We&apos;ll be in touch soon
                      </h3>
                      <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
                        Thank you for submitting your details. Our board-certified doctor will contact you on your
                        WhatsApp number shortly.
                      </p>

                      <dl className="mt-8 w-full max-w-md divide-y divide-border rounded-[20px] border border-border bg-background/60 text-left text-sm">
                        {[
                          { icon: FileText, term: 'Order ID', value: booking?.orderId ?? orderId },
                          { icon: Smartphone, term: 'WhatsApp', value: whatsapp },
                          { icon: Clock, term: 'Expected callback', value: `Within ${site.consults.callbackHours} hours` },
                          {
                            icon: ShieldCheck,
                            term: 'Free consultations left',
                            value: booking ? `${booking.consultationsRemaining} of ${booking.consultationsAllowed}` : '—',
                          },
                        ].map(({ icon: Icon, term, value }) => (
                          <div key={term} className="flex items-center justify-between gap-4 px-5 py-3.5">
                            <dt className="flex items-center gap-2.5 text-slate-500">
                              <Icon className="h-4 w-4 text-primary" /> {term}
                            </dt>
                            <dd className="font-semibold text-heading">{value}</dd>
                          </div>
                        ))}
                      </dl>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="mt-8 inline-flex items-center gap-2 rounded-[14px] border border-border bg-white px-6 py-3 text-sm font-semibold text-heading transition hover:border-primary/40 hover:text-primary cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Submit Another Request
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-24 py-20 md:py-28 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <ScrollReveal direction="up" className="lg:sticky lg:top-28">
                <Eyebrow>Help desk</Eyebrow>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-[1.1]">
                  Telehealth regulations &amp; policies
                </h2>
                <p className="mt-5 text-base text-slate-500 leading-relaxed">
                  How our doctors work with international travellers, prescriptions and response times.
                </p>
                <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-secondary-dark" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    For life-threatening emergencies, always contact local emergency services first.
                  </p>
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-8">
              <ScrollReveal direction="up" delay={0.1}>
                <Accordion items={faqs} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
