'use client';

import React from 'react';
import Link from 'next/link';
import { Timeline } from '@/shared/ui/Timeline';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { Accordion } from '@/shared/ui/Accordion';
import { ApprovalsSection } from '@/shared/ui/ApprovalsSection';
import { AlertCircle, Plane, Sparkles, FolderOpen, Heart, QrCode, Video, ShieldCheck, Sun, HelpCircle, ChevronRight } from 'lucide-react';

export default function HowItWorksPage() {
  const timelineItems = [
    {
      id: 'chapter-1',
      badge: 'Arrival Alert',
      title: 'You Feel Unwell Abroad',
      subtitle: 'Acute sickness triggers mid-trip.',
      description: 'Whether it is food poisoning from a night market, a throbbing vascular headache at 11,000 feet, or an itchy coral reef scratch, travel health challenges happen when least expected.',
      icon: <AlertCircle className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['Instant access', 'No local travel needed', 'Saves emergency costs']
    },
    {
      id: 'chapter-2',
      badge: 'Airport Approved',
      title: 'Pack With Security Compliances',
      subtitle: 'Compact pouch sits in carry-on.',
      description: 'The Travel Med pouch is built around TSA regulations. Liquid-free, compact, and shockproof. Put it in your carry-on without second-guessing customs check lines.',
      icon: <Plane className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['TSA Liquid-free compliant', '1680D Ballistic Nylon', 'Fits in backpack slots']
    },
    {
      id: 'chapter-3',
      badge: 'Intuitive Sorting',
      title: 'Open the Pouch',
      subtitle: 'Exposing sorted compartments.',
      description: 'Open the waterproof zipper. Inside you will find four color-coded, labeled compartments mapping to symptoms. No loose boxes, no searching in panic.',
      icon: <FolderOpen className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1607619056574-7b8f304b3c86?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['Color-coded dividers', 'Blistered medications', 'Protected from elements']
    },
    {
      id: 'chapter-4',
      badge: 'Clinical Dosing',
      title: 'Instant Medicine Matching',
      subtitle: 'Match symptoms in English.',
      description: 'Consult the printed medical guide inside the pouch. Match your symptoms (e.g. Travelers Diarrhea) to the exact color compartment and take the pre-sorted blister capsule.',
      icon: <Sparkles className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['English dosage guidelines', 'DCGI approved over the counter medicine', 'Expiry date tracking']
    },
    {
      id: 'chapter-5',
      badge: 'Doctor Video Call',
      title: ' Doctor Consultation',
      subtitle: 'Instant video connection.',
      description: 'Connect instantly to a board-certified physician in under 3 minutes. The doctor reviews your condition, advises on self-medicating, and assists with importing details.',
      icon: <Video className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['Average wait < 3 minutes', 'Licensed  doctors', 'Multilingual support']
    },
    {
      id: 'chapter-7',
      badge: 'Vacation Saved',
      title: 'Continue Your Journey',
      subtitle: 'Always protected.',
      description: 'With symptoms checked and treatments taken, you are back to enjoying your vacation. No local clinic queue, no language issues, just peace of mind.',
      icon: <Sun className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['No cut-short vacations', 'Full travel continuity', 'Global guard']
    }
  ];

  const howItWorksFaqs = [
    {
      id: 'hiw-faq-1',
      title: "How do I know which medication to take for my symptoms?",
      content: (
        <span>
          Inside the pouch, medicines are organized into <strong className="font-bold text-slate-900 dark:text-white">color-coded symptom-based compartments</strong> with an easy-to-read Quick Reference Treatment Guide printed in clear English. For any doubt, connect instantly to our doctor via teleconsultation.
        </span>
      )
    },
    {
      id: 'hiw-faq-2',
      title: "What happens if I encounter an emergency while traveling?",
      content: (
        <span>
          The Travel Med Kit is designed for <strong className="font-bold text-slate-900 dark:text-white">mild to moderate non-life-threatening travel ailments</strong> (fever, stomach upset, allergies, motion sickness, sprains). For life-threatening emergencies, always contact local emergency services (e.g., 911 / 112).
        </span>
      )
    },
    {
      id: 'hiw-faq-3',
      title: "How long does a teleconsultation video call take?",
      content: (
        <span>
          Average physician wait time is <strong className="font-bold text-slate-900 dark:text-white">under 3 minutes</strong>. Consultations usually take 5 to 10 minutes, during which our licensed doctor evaluates your symptoms, approves medication usage from your kit, or prescribes localized care.
        </span>
      )
    },
    {
      id: 'hiw-faq-4',
      title: "Can airport security confiscate my Travel Med Kit?",
      content: (
        <span>
          <strong className="font-bold text-slate-900 dark:text-white">No.</strong> The kit contains zero restricted liquids, and all medications are solid blister packs accompanied by an official signed doctor's prescription for seamless airport security & customs clearance.
        </span>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-neutral-50 dark:bg-neutral-950">

      {/* Header */}
      <section className="py-12 md:py-20 bg-white dark:bg-neutral-900 border-b border-border/40 relative">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-1">
          <Badge variant="primary">The Story of Protection</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading max-w-2xl mx-auto">
            How Travel Med Works
          </h1>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto">
            See the timeline journey of carrying, using, and getting digital support with your travel medical kit anywhere globally.
          </p>
        </ScrollReveal>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Timeline items={timelineItems} />
        </ScrollReveal>
      </section>

      {/* GMP, WHO, CDSCO, DCGI Approvals Section */}
      <ApprovalsSection />

      {/* Animated FAQ Section */}
      <section className="py-16 bg-white/50 dark:bg-neutral-900/50 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" /> Usage & Safety
            </div>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-neutral-400 text-sm max-w-xl mx-auto">
              Got questions about using your kit on the road? Here is everything explained.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Accordion items={howItWorksFaqs} defaultOpenId="hiw-faq-1" />
          </ScrollReveal>

          <ScrollReveal className="text-center pt-2" delay={0.2}>
            <Link href="/faq">
              <Button variant="outline" className="px-8 py-3.5 rounded-full text-xs font-extrabold border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-xs cursor-pointer">
                Visit Travel Med FAQ Center <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
