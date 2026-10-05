import React from 'react';
import Link from 'next/link';
import { Mail, Phone, FileText } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';

export interface LegalSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface LegalDocumentProps {
  badge: string;
  title: string;
  description?: React.ReactNode;
  lastUpdated: string;
  /** Current route, hidden from the related-policies list */
  path: string;
  intro?: React.ReactNode;
  sections: LegalSection[];
  /** Optional highlighted callout rendered after the sections */
  footnote?: React.ReactNode;
}

const relatedLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund Policy', href: '/refund' },
  { label: 'Shipping & Returns', href: '/shipping' },
];

/** Shared layout for policy pages: hero, sticky table of contents and numbered sections. */
export function LegalDocument({ badge, title, description, lastUpdated, path, intro, sections, footnote }: LegalDocumentProps) {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <PageHero badge={badge} badgeIcon={<FileText className="h-3.5 w-3.5 text-secondary" />} title={title} description={description} size="compact">
        <p className="text-xs font-medium text-white/60">Last updated: {lastUpdated}</p>
      </PageHero>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Table of contents */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <nav aria-label="On this page" className="rounded-[24px] border border-border bg-white p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">On this page</p>
                  <ol className="mt-4 space-y-1">
                    {sections.map((s, idx) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="group flex items-baseline gap-3 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-background hover:text-primary"
                        >
                          <span className="font-heading text-xs font-bold text-slate-300 tabular-nums group-hover:text-secondary-dark">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <div className="rounded-[24px] border border-border bg-white p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Related policies</p>
                  <ul className="mt-3 space-y-1">
                    {relatedLinks
                      .filter((l) => l.href !== path)
                      .map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-background hover:text-primary">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Document */}
            <div className="lg:col-span-8">
              <article className="rounded-[28px] border border-border bg-white shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
                {intro && (
                  <div className="border-b border-border px-6 py-7 sm:px-10 sm:py-9">
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{intro}</p>
                  </div>
                )}

                <div className="divide-y divide-border">
                  {sections.map((s, idx) => (
                    <section key={s.id} id={s.id} className="scroll-mt-28 px-6 py-8 sm:px-10 sm:py-10">
                      <div className="flex items-start gap-4 sm:gap-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 font-heading text-sm font-bold text-primary tabular-nums">
                          {s.icon ?? String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg sm:text-xl font-bold font-heading tracking-tight pt-1.5">{s.title}</h2>
                          <div className="mt-3 text-[15px] text-slate-600 leading-relaxed space-y-3">{s.content}</div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                {footnote && <div className="border-t border-border px-6 py-8 sm:px-10">{footnote}</div>}
              </article>

              {/* Contact card */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[24px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-6 sm:p-8 text-white">
                <div>
                  <p className="font-heading text-lg font-bold text-white">Questions about this policy?</p>
                  <p className="mt-1 text-sm text-white/70">Our team is happy to help.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="mailto:sales@travelmed.org"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-slate-100"
                  >
                    <Mail className="h-4 w-4" /> sales@travelmed.org
                  </a>
                  <a
                    href="tel:+918148493389"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4" /> +91 81484 93389
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
