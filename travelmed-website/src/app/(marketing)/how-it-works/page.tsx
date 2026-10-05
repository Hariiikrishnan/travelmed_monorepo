'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { Accordion } from '@/shared/ui/Accordion';
import { ApprovalsSection } from '@/shared/ui/ApprovalsSection';
import {
  AlertCircle,
  Plane,
  Sparkles,
  FolderOpen,
  Stethoscope,
  ShieldCheck,
  Sun,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

const steps = [
  {
    id: 'chapter-1',
    badge: 'Arrival Alert',
    title: 'You Feel Unwell Abroad',
    subtitle: 'Acute sickness triggers mid-trip.',
    description:
      'Whether it is food poisoning from a night market, a throbbing headache at 11,000 feet, or an itchy coral reef scratch, travel health challenges happen when least expected.',
    icon: AlertCircle,
    image: '/scenarios/thailand.webp',
    benefits: ['Instant access', 'No local travel needed', 'Saves emergency costs'],
  },
  {
    id: 'chapter-2',
    badge: 'Airport Compliant',
    title: 'Pack With Security Compliance',
    subtitle: 'Preferred: carry in check-in baggage.',
    description:
      'The Travel Med pouch is built around airport security regulations — liquid-free, compact and shockproof. We recommend packing it in your check-in baggage for smooth customs clearance.',
    icon: Plane,
    image: '/products/trollybag.webp',
    benefits: ['Preferred in check-in baggage', '1680D ballistic nylon', 'Fits in luggage compartments'],
  },
  {
    id: 'chapter-3',
    badge: 'Intuitive Sorting',
    title: 'Open the Pouch',
    subtitle: 'Sorted, labelled compartments.',
    description:
      'Open the waterproof zipper to find four colour-coded, labelled compartments mapped to symptoms. No loose boxes, no searching in a panic.',
    icon: FolderOpen,
    image: '/pro.webp',
    benefits: ['Colour-coded dividers', 'Blistered medications', 'Protected from elements'],
  },
  {
    id: 'chapter-4',
    badge: 'Clinical Dosing',
    title: 'Instant Medicine Matching',
    subtitle: 'Match symptoms in plain English.',
    description:
      "Consult the printed medical guide inside the pouch. Match your symptoms (e.g. traveller's diarrhoea) to the right colour compartment and take the pre-sorted blister dose.",
    icon: Sparkles,
    image: '/products.webp',
    benefits: ['English dosage guidelines', 'DCGI approved medications', 'Expiry date tracking'],
  },
  {
    id: 'chapter-5',
    badge: 'Doctor Teleconsultation',
    title: 'Doctor Consultation',
    subtitle: 'Doctor contact within 8–12 hours.',
    description:
      'Book a teleconsultation via the QR code inside your pouch or our portal. A board-certified physician will contact you within 8–12 hours of booking to review your condition and guide your care.',
    icon: Stethoscope,
    image: '/doctor.webp',
    benefits: ['Doctor contact within 8–12 hrs', 'Licensed doctors', 'Multilingual support'],
  },
  {
    id: 'chapter-6',
    badge: 'Vacation Saved',
    title: 'Continue Your Journey',
    subtitle: 'Always protected.',
    description:
      'Symptoms checked and treatment taken — you are back to enjoying your trip. No clinic queues, no language barriers, just peace of mind.',
    icon: Sun,
    image: '/scenarios/europe.webp',
    benefits: ['No cut-short vacations', 'Full travel continuity', 'Global protection'],
  },
];

const highlights = [
  { icon: Layers, value: '4', label: 'Colour-coded compartments' },
  { icon: Clock, value: '8–12 hrs', label: 'Doctor callback window' },
  { icon: ShieldCheck, value: 'Airport', label: 'Security compliant' },
];

const howItWorksFaqs = [
  {
    id: 'hiw-faq-1',
    title: 'How do I know which medication to take for my symptoms?',
    content: (
      <span>
        Inside the pouch, medicines are organised into{' '}
        <strong className="font-semibold text-heading">colour-coded, symptom-based compartments</strong> with an
        easy-to-read Quick Reference Treatment Guide printed in clear English. For any doubt, book a
        teleconsultation with our doctor (contact within 8–12 hours of booking).
      </span>
    ),
  },
  {
    id: 'hiw-faq-2',
    title: 'What happens if I encounter an emergency while traveling?',
    content: (
      <span>
        The Travel Med Kit is designed for{' '}
        <strong className="font-semibold text-heading">mild to moderate, non-life-threatening travel ailments</strong>{' '}
        (fever, stomach upset, allergies, motion sickness, sprains). For life-threatening emergencies, always contact
        local emergency services (e.g. 911 / 112).
      </span>
    ),
  },
  {
    id: 'hiw-faq-3',
    title: 'When will the doctor contact me after booking?',
    content: (
      <span>
        Once you book a teleconsultation, our doctor will contact you within{' '}
        <strong className="font-semibold text-heading">8–12 hours of booking</strong>. Consultations usually take 5
        to 10 minutes, during which our licensed doctor evaluates your symptoms and approves medication usage from your
        kit.
      </span>
    ),
  },
  {
    id: 'hiw-faq-4',
    title: 'Can airport security confiscate my Travel Med Kit?',
    content: (
      <span>
        <strong className="font-semibold text-heading">No.</strong> The kit contains zero restricted liquids, and all
        medications are solid blister packs accompanied by an official signed doctor&apos;s prescription for seamless
        airport security &amp; customs clearance.
      </span>
    ),
  },
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${
        light ? 'text-secondary' : 'text-secondary-dark'
      }`}
    >
      <span className={`h-px w-6 ${light ? 'bg-secondary' : 'bg-secondary-dark'}`} />
      {children}
    </span>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-end gap-8 lg:gap-6">
          {/* Copy */}
          <div className="lg:col-span-7 pt-16 md:pt-24 lg:pt-28 lg:pb-36 text-center lg:text-left">
            <ScrollReveal direction="down">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                The journey of protection
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <h1 className="mt-7 text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-extrabold font-heading tracking-tight !text-white leading-[1.05] max-w-3xl mx-auto lg:mx-0">
                From symptom to solution,{' '}
                <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">
                  wherever you are.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                See how carrying, using and getting doctor support with your Travel Med kit works — anywhere in the
                world.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a
                  href="#steps"
                  className="group inline-flex items-center gap-2 rounded-[14px] bg-secondary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark"
                >
                  See the 6 Steps
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shop the Kit
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Family cut-out, anchored to the bottom edge of the hero */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div aria-hidden className="absolute bottom-0 left-1/2 h-[78%] w-[88%] -translate-x-1/2 rounded-t-full bg-gradient-to-t from-secondary/35 via-sky-300/15 to-transparent blur-2xl" />
            <div aria-hidden className="absolute bottom-0 left-1/2 aspect-square w-[82%] -translate-x-1/2 translate-y-[38%] rounded-full border border-white/10 bg-white/[0.04]" />
            <ScrollReveal direction="up" delay={0.15} className="relative w-full max-w-[420px] sm:max-w-[500px] lg:max-w-none lg:w-[118%] xl:w-[124%] lg:-mr-6 xl:-mr-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/family-hero-crop.webp"
                alt="An Indian family on holiday holding up their Travel Med kit"
                width={1000}
                height={811}
                fetchPriority="high"
                className="relative block h-auto w-full select-none drop-shadow-[0_30px_40px_rgba(3,20,45,0.45)]"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Highlights strip ─────────────────────────────────── */}
      <section className="relative z-20 -mt-6 md:-mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-[24px] border border-border bg-border shadow-[0_20px_50px_rgba(11,79,140,0.10)]">
              {highlights.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-4 bg-white px-6 py-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl md:text-2xl font-extrabold font-heading text-primary tracking-tight">
                      {value}
                    </div>
                    <div className="text-xs md:text-sm font-medium text-slate-500">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Steps ────────────────────────────────────────────── */}
      <section id="steps" className="scroll-mt-24 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-3xl mx-auto text-center">
            <Eyebrow>Step by step</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              How Travel Med works
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              Six simple moments between feeling unwell and getting back to your trip.
            </p>
          </ScrollReveal>

          <div className="mt-16 md:mt-24 space-y-20 md:space-y-28">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const reversed = idx % 2 === 1;
              return (
                <div key={step.id} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                  {/* Image */}
                  <ScrollReveal direction={reversed ? 'left' : 'right'} className={reversed ? 'lg:order-2' : ''}>
                    <div className="relative">
                      <div aria-hidden className="absolute -inset-3 rounded-[36px] bg-gradient-to-br from-secondary/15 via-transparent to-primary/15 blur-2xl" />
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white bg-slate-100 shadow-[0_30px_80px_rgba(11,79,140,0.14)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={step.image}
                          alt={step.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                        />
                        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-md">
                          <Icon className="h-3.5 w-3.5" />
                          {step.badge}
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Copy */}
                  <ScrollReveal direction={reversed ? 'right' : 'left'} delay={0.1} className={reversed ? 'lg:order-1' : ''}>
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-gradient-to-br from-primary to-secondary bg-clip-text leading-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px flex-1 max-w-[80px] bg-border" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Step {idx + 1} of {steps.length}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-secondary-dark">{step.subtitle}</p>
                    <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">{step.description}</p>
                    <ul className="mt-7 space-y-3">
                      {step.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-sm sm:text-base font-medium text-heading">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                            <CheckCircle2 className="h-4 w-4 text-secondary-dark" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Approvals ────────────────────────────────────────── */}
      <ApprovalsSection />

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <ScrollReveal direction="up" className="lg:sticky lg:top-28">
                <Eyebrow>Usage &amp; safety</Eyebrow>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-[1.1]">
                  Questions, answered.
                </h2>
                <p className="mt-5 text-base text-slate-500 leading-relaxed">
                  Everything you need to know about using your kit on the road.
                </p>
                <Link
                  href="/faq"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  Visit the FAQ Center
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-8">
              <ScrollReveal direction="up" delay={0.1}>
                <Accordion items={howItWorksFaqs} defaultOpenId="hiw-faq-1" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] px-6 py-14 sm:px-14 sm:py-20 text-center shadow-[0_40px_100px_rgba(11,79,140,0.25)]">
              <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />
              <div aria-hidden className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-[100px]" />
              <div className="relative">
                <Eyebrow light>Ready when you are</Eyebrow>
                <h2 className="mt-6 text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading !text-white tracking-tight leading-[1.15] max-w-3xl mx-auto">
                  Pack doctor-curated care for{' '}
                  <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">
                    your next trip.
                  </span>
                </h2>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/buy"
                    className="group inline-flex items-center gap-2 rounded-[14px] bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-lg transition hover:bg-slate-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Get Your Travel Med Kit
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/teleconsultation"
                    className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Book a Consultation
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
