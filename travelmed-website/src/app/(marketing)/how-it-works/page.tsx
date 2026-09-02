'use client';

import React from 'react';
import { Timeline } from '@/shared/ui/Timeline';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { AlertCircle, Plane, Sparkles, FolderOpen, Heart, QrCode, Video, ShieldCheck, Sun } from 'lucide-react';

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
      benefits: ['English dosage guidelines', 'FDA approved OTC meds', 'Expiry date tracking']
    },
    {
      id: 'chapter-5',
      badge: 'Digital Triage',
      title: 'Scan Pouch QR Code',
      subtitle: 'Instant mobile connection.',
      description: 'Still feeling sick or unsure of a dosage? Scan the QR code printed on the inside pouch cover using your phone camera. It launches our web portal immediately without logins.',
      icon: <QrCode className="h-5 w-5" />,
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600&h=400',
      benefits: ['No passwords needed', 'Instant mobile triage', 'Secure data architecture']
    },
    {
      id: 'chapter-6',
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

  return (
    <div className="flex flex-col min-h-screen font-sans bg-neutral-50 dark:bg-neutral-950">

      {/* Header */}
      <section className="py-12 md:py-20 bg-white dark:bg-neutral-900 border-b border-border/40 relative">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-1">
          <Badge variant="primary">The Story of Protection</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading max-w-2xl mx-auto">
            How Travel Med Works
          </h1>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto">
            See the timeline journey of carrying, using, and getting digital support with your travel medical kit anywhere globally.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Timeline items={timelineItems} />
        </div>
      </section>

    </div>
  );
}
