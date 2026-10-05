'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { Check, ShieldCheck, BadgeCheck, FileCheck2, Plane } from 'lucide-react';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

export interface ApprovalItem {
  id: string;
  name: string;
  fullName: string;
  logo: string;
  badge: string;
  description: string;
  highlights: string[];
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    iconColor: string;
  };
}

export const APPROVALS_DATA: ApprovalItem[] = [
  {
    id: 'gmp',
    name: 'GMP Certified',
    fullName: 'Good Manufacturing Practice',
    logo: '/logos/gmp.svg',
    badge: 'QUALITY ASSURED',
    description: 'Sourced exclusively from WHO-GMP certified facilities following international pharmaceutical purity & batch safety standards.',
    highlights: ['Batch Quality Tested', 'Zero Contamination Guarantee', 'Standardized Active Ingredients'],
    colorTheme: {
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/80',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      borderHover: 'hover:border-emerald-500/40 dark:hover:border-emerald-500/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    }
  },
  {
    id: 'who',
    name: 'WHO Compliant',
    fullName: 'World Health Organization Standards',
    logo: '/logos/who.svg',
    badge: 'WHO COMPLIANT',
    description: 'Curated in alignment with World Health Organization guidelines for essential travel medicines & first-aid readiness.',
    highlights: ['Essential Travel Formula', 'International Travel Safe', 'Preferred in Check-in Baggage'],
    colorTheme: {
      badgeBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/80',
      badgeText: 'text-sky-700 dark:text-sky-300',
      borderHover: 'hover:border-sky-500/40 dark:hover:border-sky-500/40',
      iconColor: 'text-sky-600 dark:text-sky-400'
    }
  },
  {
    id: 'cdsco',
    name: 'CDSCO Regulated',
    fullName: 'Central Drugs Standard Control Organisation',
    logo: '/logos/cdsco.svg',
    badge: 'GOVT. REGULATED',
    description: '100% regulated by India’s national drug authority CDSCO, ensuring fully verified OTC and doctor-prescribed medications.',
    highlights: ['Licensed Pharmacy Sourced', 'Legal Border Customs Clearance', 'Authentic Batch Tracking'],
    colorTheme: {
      badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-800/80',
      badgeText: 'text-blue-700 dark:text-blue-300',
      borderHover: 'hover:border-blue-500/40 dark:hover:border-blue-500/40',
      iconColor: 'text-blue-600 dark:text-blue-400'
    }
  },
  {
    id: 'dcgi',
    name: 'DCGI Approved',
    fullName: 'Drugs Controller General of India',
    logo: '/logos/dcgi.svg',
    badge: 'DOCTOR APPROVED',
    description: 'Approved remedies backed by a signed physician prescription matching all 150+ items inside your travel kit.',
    highlights: ['100% Legitimate Formulations', 'Signed Doctor Prescription', '12-Month Expiry Guarantee'],
    colorTheme: {
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/80',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      borderHover: 'hover:border-indigo-500/40 dark:hover:border-indigo-500/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    }
  }
];

interface ApprovalsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

const assurances = [
  { icon: BadgeCheck, label: 'Licensed pharmacy sourcing' },
  { icon: FileCheck2, label: "Signed doctor's prescription" },
  { icon: Plane, label: 'Customs-ready documentation' },
];

export const ApprovalsSection: React.FC<ApprovalsSectionProps> = ({
  className = '',
  title = 'Certified & regulated healthcare standards',
  subtitle = 'Every medication and essential in the Travel Med Kit complies strictly with national and international health regulations.'
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Scroll-linked parallax: intro and the two card columns drift at different speeds
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const introY = useTransform(progress, [0, 1], [60, -60]);
  const colAY = useTransform(progress, [0, 1], [40, -40]);
  const colBY = useTransform(progress, [0, 1], [110, -110]);
  const parallax = isDesktop && !prefersReducedMotion;

  return (
    <section ref={sectionRef} className={`relative overflow-hidden py-20 md:py-32 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Intro */}
          <motion.div className="lg:col-span-4" style={parallax ? { y: introY } : undefined}>
            <ScrollReveal direction="up">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-dark">
                <span className="h-px w-6 bg-secondary-dark" />
                Quality &amp; compliance
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
                {title}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">{subtitle}</p>

              <div className="mt-8 rounded-[24px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-6 text-white shadow-[0_25px_60px_rgba(11,79,140,0.25)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold text-white leading-tight">100% certified &amp; approved</p>
                    <p className="text-xs text-white/65">Across all 150+ items in the kit</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 border-t border-white/15 pt-5">
                  {assurances.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2.5 text-sm text-white/85">
                      <Icon className="h-4 w-4 shrink-0 text-secondary" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </motion.div>

          {/* Certification cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {APPROVALS_DATA.map((item, idx) => (
              <motion.div
                key={item.id}
                className="h-full"
                style={parallax ? { y: idx % 2 === 0 ? colAY : colBY } : undefined}
              >
                <ScrollReveal delay={idx * 0.08} direction="up" className="h-full">
                  <motion.article
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-white p-7 transition-shadow duration-300 hover:border-primary/20 hover:shadow-[0_30px_70px_rgba(11,79,140,0.12)]"
                  >
                    <div aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 items-center rounded-2xl border border-border bg-background/60 px-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.logo} alt={`${item.name} logo`} className="h-8 w-auto max-w-[120px] object-contain select-none" />
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-secondary-dark whitespace-nowrap">
                        <BadgeCheck className="h-3 w-3" />
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold font-heading tracking-tight transition-colors group-hover:text-primary">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">{item.fullName}</p>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.description}</p>

                    <ul className="mt-auto pt-6 space-y-2.5">
                      {item.highlights.map((high) => (
                        <li key={high} className="flex items-center gap-2.5 text-sm text-heading">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                            <Check className="h-3 w-3 text-secondary-dark" strokeWidth={3} />
                          </span>
                          {high}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                </ScrollReveal>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApprovalsSection;
