import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

interface PageHeroProps {
  badge: string;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  /** Gradient-highlighted trailing part of the title */
  highlight?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Compact heroes suit utility and legal pages */
  size?: 'default' | 'compact';
  /** Leaves extra room at the bottom for content that overlaps the hero */
  overlap?: boolean;
}

/** Navy gradient page hero shared across marketing pages. */
export function PageHero({
  badge,
  badgeIcon,
  title,
  highlight,
  description,
  children,
  size = 'default',
  overlap = false,
}: PageHeroProps) {
  const compact = size === 'compact';
  const bottomPadding = overlap ? 'pb-28 md:pb-36' : compact ? 'pb-14 md:pb-20' : 'pb-20 md:pb-28';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
      <div aria-hidden className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
      <div aria-hidden className="absolute -bottom-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-[120px]" />

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${compact ? 'pt-12 md:pt-16' : 'pt-16 md:pt-24'} ${bottomPadding}`}>
        <ScrollReveal direction="down">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            {badgeIcon ?? <ShieldCheck className="h-3.5 w-3.5 text-secondary" />}
            {badge}
          </span>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <h1
            className={`mt-6 font-extrabold font-heading tracking-tight !text-white leading-[1.08] max-w-4xl mx-auto ${
              compact ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl'
            }`}
          >
            {title}
            {highlight && (
              <>
                {' '}
                <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">{highlight}</span>
              </>
            )}
          </h1>
        </ScrollReveal>

        {description && (
          <ScrollReveal direction="up" delay={0.2}>
            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">{description}</p>
          </ScrollReveal>
        )}

        {children && (
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-8">{children}</div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
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
