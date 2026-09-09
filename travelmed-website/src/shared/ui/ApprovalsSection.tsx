'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
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
    highlights: ['Essential Travel Formula', 'International Travel Safe', 'TSA & IATA Carry-On Ready'],
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
    highlights: ['100% Legitimate Formulations', 'Signed Doctor Prescription', '24-Month Expiry Guarantee'],
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

export const ApprovalsSection: React.FC<ApprovalsSectionProps> = ({
  className = '',
  title = 'Certified & Regulated Healthcare Standards',
  subtitle = 'Every medication and essential in the Travel Med Kit complies strictly with national and international health regulations.'
}) => {
  return (
    <section className={`py-14 md:py-20 bg-transparent ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span>100% Certified & Approved</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed font-medium max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>

        {/* 4 Approval Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {APPROVALS_DATA.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 0.08} direction="up">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`h-full bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-3xl p-5 sm:p-5.5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group ${item.colorTheme.borderHover}`}
              >
                <div className="space-y-4">
                  {/* Top Logo Container & Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-neutral-800/80 pb-3">
                    <div className="h-9 max-w-[125px] flex items-center shrink-0">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="h-8 sm:h-8.5 w-auto max-w-full object-contain select-none"
                      />
                    </div>
                    <span className={`text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap ${item.colorTheme.badgeBg} ${item.colorTheme.badgeText}`}>
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-extrabold font-heading text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-neutral-450 uppercase tracking-wider leading-tight">
                      {item.fullName}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-neutral-350 leading-relaxed font-sans pt-1.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="border-t border-slate-100 dark:border-neutral-800/80 pt-3.5 mt-4 space-y-2">
                  {item.highlights.map((high, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-neutral-200">
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${item.colorTheme.iconColor}`} />
                      <span className="text-[11px] leading-tight font-medium">{high}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ApprovalsSection;
