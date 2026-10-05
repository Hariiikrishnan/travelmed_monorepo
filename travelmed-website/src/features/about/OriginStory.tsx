'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Quote, type LucideIcon } from 'lucide-react';

export interface StoryChapter {
  step: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

/** Editorial origin story: sticky chapter index on the left, fully readable chapters on the right. */
export function OriginStory({ chapters }: { chapters: StoryChapter[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  // The chapter crossing the middle of the viewport becomes active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (i: number) =>
    itemRefs.current[i]?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* ── Sticky intro + chapter index ── */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-dark">
            <span className="h-px w-6 bg-secondary-dark" />
            Our origin story
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-[44px] font-extrabold font-heading tracking-tight leading-[1.08]">
            One trip that changed everything.
          </h2>
          <p className="mt-5 max-w-md text-base sm:text-lg text-slate-500 leading-relaxed">
            What should have been a memorable family holiday became the reason Travel Med exists.
          </p>

          {/* Chapter index (desktop) */}
          <nav aria-label="Story chapters" className="relative mt-10 hidden lg:block">
            <span aria-hidden className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
            <motion.span
              aria-hidden
              style={{ scaleY: reduceMotion ? 1 : progress }}
              className="absolute left-0 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-secondary to-primary"
            />
            <ol className="space-y-1">
              {chapters.map((c, i) => {
                const isActive = i === active;
                return (
                  <li key={c.step}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? 'step' : undefined}
                      className="group relative flex w-full items-baseline gap-4 py-2.5 pl-6 text-left cursor-pointer"
                    >
                      <span
                        aria-hidden
                        className={`absolute -left-px top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full transition-all duration-300 ${
                          isActive ? 'bg-primary opacity-100' : 'opacity-0'
                        }`}
                      />
                      <span
                        className={`font-heading text-xs font-bold tabular-nums transition-colors duration-300 ${
                          isActive ? 'text-secondary-dark' : 'text-slate-300 group-hover:text-slate-400'
                        }`}
                      >
                        {c.step}
                      </span>
                      <span
                        className={`text-[15px] font-semibold transition-colors duration-300 ${
                          isActive ? 'text-heading' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {c.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Signature */}
          <div className="mt-10 hidden lg:flex items-center gap-3.5 border-t border-border pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder/sidharathfounder.webp"
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover object-top ring-2 ring-white shadow-md"
            />
            <div className="leading-tight">
              <p className="text-sm font-bold text-heading">Dr. Chitarth Rajasekaran</p>
              <p className="mt-0.5 text-xs text-slate-500">Founder &amp; Medical Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chapters ── */}
      <div ref={listRef} className="lg:col-span-8">
        <div className="divide-y divide-border">
          {chapters.map((c, i) => {
            const Icon = c.icon;
            const isActive = i === active;
            return (
              <motion.article
                key={c.step}
                ref={(el: HTMLElement | null) => {
                  itemRefs.current[i] = el;
                }}
                data-index={i}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10 py-10 first:pt-0 sm:py-12"
              >
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden
                    className={`font-heading text-5xl sm:text-6xl font-extrabold leading-none tracking-tighter tabular-nums transition-colors duration-500 ${
                      isActive ? 'text-primary' : 'text-primary/15'
                    }`}
                  >
                    {c.step}
                  </span>
                  <span
                    className={`mt-5 flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-500 ${
                      isActive ? 'border-secondary/30 bg-secondary/10 text-secondary-dark' : 'border-border bg-white text-slate-400'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                </div>

                <div className="min-w-0 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-dark">Chapter {c.step}</p>
                  <h3 className="mt-2 text-2xl sm:text-[28px] font-extrabold font-heading tracking-tight leading-tight text-heading">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base sm:text-[17px] text-slate-600 leading-[1.8]">{c.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Closing founder note */}
        <motion.figure
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-8 sm:p-10 text-white shadow-[0_30px_80px_rgba(11,79,140,0.22)]"
        >
          <div aria-hidden className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-secondary/25 blur-[90px]" />
          <Quote aria-hidden className="relative h-8 w-8 text-secondary" />
          <blockquote className="relative mt-4 font-heading text-xl sm:text-2xl font-bold leading-snug tracking-tight !text-white">
            A single minor health issue should never have the power to ruin a lifelong memory. Today, my whole family
            carries Travel Med on every single trip.
          </blockquote>
          <figcaption className="relative mt-7 flex items-center gap-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder/sidharathfounder.webp"
              alt="Dr. Chitarth Rajasekaran"
              className="h-12 w-12 shrink-0 rounded-full object-cover object-top ring-2 ring-white/40"
            />
            <span className="leading-tight">
              <span className="block text-sm font-bold text-white">Dr. Chitarth Rajasekaran</span>
              <span className="mt-0.5 block text-xs text-white/65">Founder &amp; Medical Director, Travel Med</span>
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </div>
  );
}
