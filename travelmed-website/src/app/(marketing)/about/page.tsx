'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { 
  Globe, 
  Users, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Award, 
  Sparkles, 
  Stethoscope, 
  MapPin, 
  Compass, 
  Plane, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight,
  Shield,
  Zap,
  DollarSign,
  Smile
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const storyTimeline = [
    {
      tag: "ACT I",
      title: "The Unexpected Turn",
      desc: "A few years ago, on one of our family trips, what was supposed to be a dream vacation took an unexpected turn. My wife and mother both fell ill with a sudden bout of severe stomach distress and fever from trying local delicacies and adapting to a new environment.",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-500/5 border-amber-200/60 dark:border-amber-900/40"
    },
    {
      tag: "ACT II",
      title: "Pacing Foreign Streets",
      desc: "Instead of enjoying sight-seeing, I found myself pacing down unfamiliar streets in search of an open pharmacy. When I finally found one, I hit a wall. In many countries, basic over-the-counter medications aren't readily available without a local prescription. Getting a doctor's appointment on short notice was nearly impossible—and exorbitantly expensive.",
      icon: <MapPin className="h-5 w-5 text-rose-500" />,
      color: "bg-rose-500/5 border-rose-200/60 dark:border-rose-900/40"
    },
    {
      tag: "ACT III",
      title: "The Physician's Realization",
      desc: "What should have been a memorable holiday turned into stress, unexpected hotel extensions, mounting expenses, and a cancelled itinerary. Looking at my family resting in the hotel room, a realization struck me: A single minor health issue shouldn't have the power to ruin a lifelong memory.",
      icon: <Stethoscope className="h-5 w-5 text-secondary" />,
      color: "bg-teal-500/5 border-teal-200/60 dark:border-teal-900/40"
    },
    {
      tag: "ACT IV",
      title: "The Spark of Travel Med",
      desc: "As a physician, I knew exactly which medications could have resolved their symptoms quickly and safely. If only we had brought a curated, medically sound kit with us, our trip would have been saved within hours. That was the spark that created Travel Med.",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      color: "bg-blue-500/5 border-blue-200/60 dark:border-blue-900/40"
    }
  ];

  const whyPillars = [
    {
      icon: <Stethoscope className="h-6 w-6 text-primary" />,
      title: "Doctor-Curated Care",
      desc: "Designed by medical professionals, our kits contain safe, essential, and high-quality remedies specifically targeted for everyday travel ailments.",
      badge: "Clinical Science"
    },
    {
      icon: <Globe className="h-6 w-6 text-secondary" />,
      title: "Hassle-Free & Overseas Ready",
      desc: "Avoid the frustration of trying to navigate foreign healthcare systems, language barriers, or strict prescription regulations abroad.",
      badge: "Customs Compliant"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
      title: "Save Time & Money",
      desc: "No more expensive emergency consultations or ruined itineraries for ailments that can be safely managed on the spot.",
      badge: "Zero Lost Vacation"
    },
    {
      icon: <Smile className="h-6 w-6 text-amber-500" />,
      title: "Peace of Mind",
      desc: "Pack your bags knowing that whether you’re trekking a mountain or dining on street food across the globe, expert-approved care is right inside your luggage.",
      badge: "100% Protection"
    }
  ];

  const travelVulnerabilities = [
    "Motion Sickness",
    "Food Contamination",
    "Sudden Fever",
    "Allergies & Hives",
    "Digestive Distress",
    "Acidity & Heartburn",
    "Dehydration & ORS",
    "Wounds & Cuts"
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50/60 via-white to-slate-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 overflow-x-hidden">
      
      {/* Hero Header Section */}
      <section className="relative pt-12 pb-14 md:pt-20 md:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <ScrollReveal direction="down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs mb-6">
            <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
            <span className="text-xs font-black text-secondary uppercase tracking-widest">
              BORN FROM EXPERIENCE &bull; CRAFTED BY DOCTORS
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl mx-auto">
              The Story Behind <span className="text-secondary">Travel Med</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-base sm:text-xl text-slate-500 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed mt-5 font-medium">
              As a physician, my passion has always been healing people. But outside the clinic, my greatest joy is exploring the world with the people I love most.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* Founder Featured Card & Narrative Section */}
      <section className="py-10 md:py-14 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Founder Card */}
            <ScrollReveal direction="left" className="lg:col-span-5">
              <div className="relative group">
                
                <div className="relative bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-[32px] p-4 sm:p-6 shadow-md space-y-5 overflow-hidden">
                  
                  {/* Founder Image */}
                  <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative border border-slate-100 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-950 shadow-inner">
                    <img
                      src="/founder/sidharathfounder.webp"
                      alt="Dr. Sidharath - Founder & Medical Director of Travel Med"
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700"
                    />
                  </div>

                  {/* Founder Info Below Image */}
                  <div className="space-y-1.5 text-left pt-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] sm:text-[10.5px] font-black tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                        FOUNDER &amp; MEDICAL DIRECTOR
                      </span>
                    </div>

                    <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                      Dr. Sidharath
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 font-semibold">
                      Physician &amp; Travel Medicine Specialist
                    </p>
                  </div>

                  {/* Personal Quote Callout */}
                  <div className="bg-slate-50 dark:bg-neutral-950/80 rounded-2xl p-4 border border-slate-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs">
                      <Stethoscope className="h-4 w-4" />
                      <span>Founder's Promise</span>
                    </div>
                    <p className="text-xs italic text-slate-700 dark:text-neutral-300 leading-relaxed font-serif">
                      "A single minor health issue shouldn't have the power to ruin a lifelong family memory."
                    </p>
                  </div>

                  {/* Medical Badges */}
                  <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 dark:border-neutral-800">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-secondary" /> CLINICALLY TESTED</span>
                    <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-emerald-500" /> CDSCO APPROVED</span>
                  </div>

                </div>

              </div>
            </ScrollReveal>

            {/* Right: Narrative Story Timeline */}
            <ScrollReveal direction="right" className="lg:col-span-7 space-y-6">
              
              <div className="space-y-3">
                <Badge variant="primary" className="bg-secondary text-white border-none px-3.5 py-1 text-xs font-black">
                  OUR ORIGIN STORY
                </Badge>
                
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white leading-tight">
                  Born from Experience, <br />
                  <span className="text-primary">Crafted by Doctors</span>
                </h2>
                
                <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed font-normal">
                  As a doctor, my passion has always been healing people. But outside the clinic, my greatest joy is exploring the world with the people I love most—<strong className="font-bold text-slate-900 dark:text-white">my wife and my mother</strong>.
                </p>
              </div>

              {/* Story Timeline Cards */}
              <div className="space-y-4 pt-2">
                {storyTimeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className={`p-5 rounded-2xl border ${item.color} backdrop-blur-sm space-y-2 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 shadow-xs border border-slate-200/80 dark:border-neutral-800">
                          {item.icon}
                        </div>
                        <h4 className="text-base font-extrabold font-heading text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-slate-400 bg-white dark:bg-neutral-900 px-2.5 py-1 rounded-full uppercase border border-slate-200 dark:border-neutral-800">
                        {item.tag}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-sans pl-0.5">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* Why Travel Med Section */}
      <section className="py-14 md:py-20 relative bg-white/40 dark:bg-neutral-900/40 border-t border-slate-200/60 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <ScrollReveal direction="down">
              <span className="text-[11px] font-black text-secondary tracking-widest uppercase bg-secondary/10 border border-secondary/20 px-3.5 py-1.5 rounded-full inline-block">
                THE SOLUTION
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900 dark:text-white leading-tight">
                Why Travel Med?
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-slate-500 dark:text-neutral-400 leading-relaxed">
                Travel exposes our bodies to new climates, unfamiliar water, different cuisines, and fatigue—making us vulnerable to common ailments like motion sickness, food contamination, sudden fever, allergies, and digestive distress.
              </p>
            </ScrollReveal>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyPillars.map((pillar, idx) => (
              <ScrollReveal key={idx} direction={idx % 2 === 0 ? "left" : "right"} delay={idx * 0.1}>
                <Card 
                  hoverEffect={true} 
                  className="p-7 sm:p-8 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl space-y-4 hover:border-primary/30 transition-all duration-300 shadow-xs hover:shadow-lg relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 bg-slate-100 dark:bg-neutral-800 rounded-2xl w-fit group-hover:scale-105 transition-transform duration-300">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Vulnerabilities Chips Strip */}
          <ScrollReveal direction="up" delay={0.3} className="mt-12 p-6 bg-slate-50 dark:bg-neutral-950/80 rounded-3xl border border-slate-200 dark:border-neutral-800 text-center space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Comprehensive Protection Against Everyday Travel Ailments
            </h4>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {travelVulnerabilities.map((vuln, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-extrabold text-slate-800 dark:text-neutral-200 shadow-2xs hover:border-secondary transition cursor-default"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                  {vuln}
                </span>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Core Mission Highlight Box (Glassmorphism Blue Theme) */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="up">
            <div className="relative overflow-hidden bg-[#EAF4FE]/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-blue-200/90 dark:border-neutral-800 rounded-[36px] p-8 sm:p-14 text-center space-y-7 shadow-[0_20px_50px_rgba(11,79,140,0.08)]">
              
              {/* Subtle Ambient Glass Glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-neutral-800/90 text-primary border border-blue-200/80 dark:border-neutral-700 text-xs font-black uppercase tracking-widest shadow-2xs backdrop-blur-md">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" /> OUR MISSION STATEMENT
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading leading-tight text-slate-900 dark:text-white max-w-3xl mx-auto tracking-tight">
                "At Travel Med, our mission is simple: We take care of the unexpected, so you can focus on the unforgettable."
              </h2>

              <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
                <Link href="/buy">
                  <Button 
                    size="lg"
                    className="bg-secondary hover:bg-secondary-dark text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-lg shadow-secondary/20 transition cursor-pointer border-none"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" /> Get Your Travel Med Kit
                  </Button>
                </Link>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

    </div>
  );
}
