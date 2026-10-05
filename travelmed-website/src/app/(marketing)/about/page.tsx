'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { OriginStory } from '@/features/about/OriginStory';
import { FloatingKit } from '@/shared/ui/FloatingKit';
import {
  Globe,
  ShieldCheck,
  Award,
  Stethoscope,
  MapPin,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Wallet,
  HeartHandshake,
  Quote,
  GraduationCap,
  PlaneTakeoff,
} from 'lucide-react';

const storyTimeline = [
  {
    step: '01',
    title: 'The Unexpected Turn',
    desc: 'On one of our family trips, what was supposed to be a dream vacation took an unexpected turn. My wife and mother both fell ill with severe stomach distress and fever after trying local delicacies and adapting to a new environment.',
    icon: AlertTriangle,
  },
  {
    step: '02',
    title: 'Pacing Foreign Streets',
    desc: "Instead of sight-seeing, I was pacing unfamiliar streets in search of an open pharmacy. In many countries, basic over-the-counter medicines aren't available without a local prescription — and a short-notice doctor's appointment was nearly impossible, and exorbitantly expensive.",
    icon: MapPin,
  },
  {
    step: '03',
    title: "A Physician's Realization",
    desc: 'The holiday turned into stress, hotel extensions, mounting expenses and a cancelled itinerary. Watching my family rest in the hotel room, it struck me: a single minor health issue should never have the power to ruin a lifelong memory.',
    icon: Stethoscope,
  },
  {
    step: '04',
    title: 'The Spark of Travel Med',
    desc: 'As a physician, I knew exactly which medicines would have resolved their symptoms quickly and safely. A curated, medically sound kit would have saved our trip within hours. That was the spark. Today, my whole family carries Travel Med on every single trip.',
    icon: Sparkles,
  },
];

const whyPillars = [
  {
    icon: Stethoscope,
    title: 'Doctor-Curated Care',
    desc: 'Designed by medical professionals, every kit contains safe, essential, high-quality remedies targeted at everyday travel ailments.',
    badge: 'Clinical Science',
  },
  {
    icon: Globe,
    title: 'Hassle-Free & Overseas Ready',
    desc: 'Skip the frustration of foreign healthcare systems, language barriers and strict prescription regulations abroad.',
    badge: 'Customs Compliant',
  },
  {
    icon: Wallet,
    title: 'Save Time & Money',
    desc: 'No more expensive emergency consultations or ruined itineraries for ailments that can be safely managed on the spot.',
    badge: 'Zero Lost Vacation',
  },
  {
    icon: HeartHandshake,
    title: 'Peace of Mind',
    desc: "Whether you're trekking a mountain or tasting street food across the globe, expert-approved care is right inside your luggage.",
    badge: 'Travel Confidently',
  },
];

const travelVulnerabilities = [
  'Motion Sickness',
  'Food Contamination',
  'Sudden Fever',
  'Allergies & Hives',
  'Digestive Distress',
  'Acidity & Heartburn',
  'Dehydration & ORS',
  'Wounds & Cuts',
];

const trustStats = [
  { value: 'Doctor', label: 'Founded & curated' },
  { value: 'CDSCO', label: 'Approved medicines' },
  { value: `${travelVulnerabilities.length}+`, label: 'Ailments covered' },
  { value: 'Global', label: 'Travel ready' },
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

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        {/* Ambient glow */}
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 text-center">
          <ScrollReveal direction="down">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
              Born from experience · Crafted by doctors
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="mt-7 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight !text-white leading-[1.05] max-w-4xl mx-auto">
              Care for the unexpected,{' '}
              <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">
                wherever you go.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              As a physician, my passion has always been healing people. Outside the clinic, my greatest joy is
              exploring the world with the people I love most. Travel Med brings those two worlds together.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/buy"
                className="group inline-flex items-center gap-2 rounded-[14px] bg-secondary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop the Kit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Read Our Story
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Trust stats (overlapping hero) ───────────────────── */}
      <section className="relative z-20 -mt-12 md:-mt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-[24px] border border-border bg-border shadow-[0_20px_50px_rgba(11,79,140,0.10)]">
              {trustStats.map((stat) => (
                <div key={stat.label} className="bg-white px-5 py-6 md:py-7 text-center">
                  <div className="text-2xl md:text-3xl font-extrabold font-heading text-primary tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs md:text-sm font-medium text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Founder ──────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Portrait */}
            <ScrollReveal direction="right" className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div aria-hidden className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 blur-2xl" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white shadow-[0_40px_100px_rgba(11,79,140,0.18)] bg-slate-100">
                  <img
                    src="/founder/sidharathfounder.webp"
                    alt="Dr. Chitarth Rajasekaran - Founder & Medical Director of Travel Med"
                    className="h-full w-full object-cover object-top"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-primary-dark/95 via-primary-dark/50 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md border border-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      Founder & Medical Director
                    </span>
                    <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold font-heading !text-white leading-tight">
                      Dr. Chitarth Rajasekaran
                    </h3>
                    <p className="mt-2.5 flex items-start gap-2 text-[13px] sm:text-sm font-medium leading-relaxed text-white/85">
                      <GraduationCap aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>
                        <span className="sr-only">Credentials: </span>
                        MBBS, MS Ortho, DNB Ortho, MRCS (Edin), Fellow in FIJR, FISS
                      </span>
                    </p>
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* Founder message */}
            <ScrollReveal direction="left" className="lg:col-span-7">
              <Eyebrow>A note from our founder</Eyebrow>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
                Born from experience,
                <br />
                <span className="text-primary">crafted by doctors.</span>
              </h2>

              <div className="relative mt-8 rounded-[24px] border border-border bg-white p-7 sm:p-9 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <Quote aria-hidden className="absolute -top-4 left-7 h-9 w-9 rounded-xl bg-secondary p-2 text-white shadow-lg shadow-secondary/30" />
                <p className="text-lg sm:text-xl md:text-2xl font-heading font-semibold leading-snug text-heading">
                  “A single minor health issue shouldn&apos;t have the power to ruin a lifelong family memory.”
                </p>
                <p className="mt-4 text-sm font-medium text-slate-500">— Dr. Chitarth Rajasekaran</p>
              </div>

              <p className="mt-8 text-base sm:text-lg text-slate-600 leading-relaxed">
                As a doctor, my passion has always been healing people. But outside the clinic, my greatest joy is
                exploring the world with the people I love most —{' '}
                <strong className="font-semibold text-heading">my wife and my mother</strong>. Travel Med exists so
                that every family can explore with the same confidence a doctor in the group would give them.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-heading">
                  <ShieldCheck className="h-4 w-4 text-secondary" /> Clinically Tested
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-heading">
                  <Award className="h-4 w-4 text-primary" /> CDSCO Approved
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-heading">
                  <PlaneTakeoff className="h-4 w-4 text-secondary" /> Built for Travellers
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Origin story (scroll-driven) ─────────────────────── */}
      <section id="our-story" className="scroll-mt-24 py-20 md:py-32 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OriginStory chapters={storyTimeline} />
        </div>
      </section>

      {/* ── Why Travel Med ───────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal direction="up">
              <Eyebrow>The solution</Eyebrow>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
                Why travellers trust Travel Med
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
                Travel exposes us to new climates, unfamiliar water, different cuisines and fatigue — making us
                vulnerable to common ailments exactly when help is hardest to find.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} direction="up" delay={idx * 0.08} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-[24px] border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]">
                    <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold font-heading">{pillar.title}</h3>
                    <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">{pillar.desc}</p>
                    <span className="mt-6 inline-block text-[10px] font-bold uppercase tracking-[0.16em] text-secondary-dark">
                      {pillar.badge}
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Ailments covered */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-16 rounded-[28px] border border-border bg-white p-8 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-sm">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading">Everyday ailments, covered.</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Protection against the issues that most often disrupt a trip.
                  </p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 md:max-w-2xl">
                  {travelVulnerabilities.map((vuln) => (
                    <li key={vuln} className="flex items-center gap-2 text-sm font-medium text-heading">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" />
                      {vuln}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Mission CTA ──────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="relative rounded-[32px] shadow-[0_40px_100px_rgba(11,79,140,0.25)]">
              {/* Background layer clips the glow blobs */}
              <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70]">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-[100px]" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 px-6 py-14 sm:px-14 sm:py-16 lg:py-20">
              <div className="lg:col-span-7 text-center lg:text-left">
                <Eyebrow light>Our mission</Eyebrow>
                <h2 className="mt-6 text-2xl sm:text-4xl md:text-[44px] font-extrabold font-heading !text-white tracking-tight leading-[1.15] max-w-3xl mx-auto lg:mx-0">
                  We take care of the unexpected, so you can focus on the{' '}
                  <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">
                    unforgettable.
                  </span>
                </h2>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <Link
                    href="/buy"
                    className="group inline-flex items-center gap-2 rounded-[14px] bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-lg transition hover:bg-slate-100"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Get Your Travel Med Kit
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <FloatingKit rotate={-4} className="w-[260px] sm:w-[320px] lg:w-full lg:max-w-[400px]" />
              </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
