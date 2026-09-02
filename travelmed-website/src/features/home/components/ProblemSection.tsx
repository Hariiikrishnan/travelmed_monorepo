'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { ShieldX, ShieldCheck, Languages, BadgeAlert, Coins, PhoneCall, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { scrollReveal } from '@/shared/animations';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: <Languages className="h-6 w-6 text-red-500" />,
      title: "Language Barriers",
      desc: "Trying to explain gastrointestinal distress or allergic symptoms to a foreign pharmacist who doesn't speak your language is highly stressful."
    },
    {
      icon: <BadgeAlert className="h-6 w-6 text-red-500" />,
      title: "Counterfeit & Unknown Brands",
      desc: "Over 10% of medicines in developing nations are counterfeit or lack standardization. Local brand names differ completely from home."
    },
    {
      icon: <Coins className="h-6 w-6 text-red-500" />,
      title: "Astronomical Clinic Costs",
      desc: "A simple clinic visit for travelers in tourist hotspots can cost hundreds of dollars, excluding tests, waiting times, and local taxi fares."
    }
  ];

  const solutions = [
    {
      title: "Clinical-grade Blister Packs",
      desc: "Pre-sorted  approved medications, fully standardized with active ingredient summaries."
    },
    {
      title: "Color-Coded Symptom Mapping",
      desc: "Our pouch compartments map directly to your symptoms. No confusion, no mistakes."
    },
    {
      title: "Digital Triage Support",
      desc: "Scan the emergency QR on your pouch to connect instantly to a board-certified physician."
    }
  ];

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-950 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="warning">The Travel Reality</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
            Getting Sick Abroad is a Nightmare.
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            Traditional travel preparation ignores the reality of remote medical access. Don't risk your vacation.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

          {/* Problem Block */}
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 pb-2">
              <div className="p-2.5 bg-red-100 dark:bg-red-950/20 text-red-500 rounded-xl">
                <ShieldX className="h-6 w-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-black">The Risk Protocol</h3>
            </div>

            <div className="space-y-4">
              {problems.map((p, idx) => (
                <Card key={idx} hoverEffect={false} className="p-6 border-red-100/50 bg-red-50/10 dark:bg-red-950/5">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 pt-1">{p.icon}</div>
                    <div className="space-y-1">
                      <h4 className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-200">{p.title}</h4>
                      <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Solution Block */}
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 pb-2">
              <div className="p-2.5 bg-primary-light dark:bg-primary-dark/20 text-primary rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-black">The Travel Med Protocol</h3>
            </div>

            <div className="space-y-4">
              {solutions.map((s, idx) => (
                <Card key={idx} hoverEffect={true} className="p-6 border-primary-light/50 bg-white dark:bg-neutral-900 shadow-sm">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 p-1 bg-primary-light dark:bg-neutral-800 text-primary rounded-lg">
                      <Check className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm md:text-base font-bold">{s.title}</h4>
                      <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}

              <Card hoverEffect={false} className="p-6 bg-gradient-to-r from-primary to-secondary text-white border-none flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="text-base font-black">Pre-order now for your next trip</h4>
                  <p className="text-xs text-white/80 leading-relaxed">Ensure shipping arrival before flight departure.</p>
                </div>
                <div className="shrink-0 p-3 bg-white/10 rounded-full border border-white/20">
                  <PhoneCall className="h-5 w-5" />
                </div>
              </Card>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
