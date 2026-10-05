import React from 'react';
import Link from 'next/link';
import {
  ChevronRight, Clock, ShieldCheck, Info, AlertTriangle, ExternalLink, ShoppingBag, ArrowRight,
  Stethoscope, Check, CalendarDays, Sparkles,
} from 'lucide-react';
import type { Article } from '@/entities/guide/types';
import { site, absoluteUrl } from '@/shared/config/site';
import { getFeaturedKit } from '@/shared/api/product';
import { derivePricing, fillPriceTokens, type Pricing } from '@/shared/pricing';
import { JsonLd, buildBreadcrumbSchema, buildFaqSchema, buildMedicalArticleSchema } from '@/shared/seo/StructuredData';
import { ReadingProgress, TableOfContents, ShareButtons, CopyBlock } from './ArticleClient';

export interface RelatedLink {
  href: string;
  title: string;
  eyebrow: string;
  image?: string;
  readingMinutes?: number;
}

interface ArticleTemplateProps {
  article: Article;
  path: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  related: RelatedLink[];
  /** Pill shown above the title (e.g. blog category) */
  label?: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

function KitCard({ compact = false, pricing }: { compact?: boolean; pricing: Pricing | null }) {
  return (
    <aside className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white ${compact ? 'p-6' : 'p-6 sm:p-8'}`}>
      <div aria-hidden className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-secondary/30 blur-[70px]" />
      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Doctor-curated kit</p>
        <p className="mt-2 font-heading text-xl font-bold leading-snug text-white">Everything in this guide, in one pouch</p>
        <ul className="mt-4 space-y-2 text-sm text-white/80">
          {[`${site.product.medicines} medicines · ${site.product.categories} categories`, 'Signed doctor’s prescription', `${site.consults.count} free doctor teleconsultations`].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-secondary" /> {t}
            </li>
          ))}
        </ul>
        {pricing && (
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-white">{pricing.priceText}</span>
            {pricing.save > 0 && <span className="text-sm text-white/50 line-through">{pricing.mrpText}</span>}
          </div>
        )}
        <p className="mt-1 text-xs text-white/60">Free express shipping across India</p>
        <Link
          href="/buy"
          className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-secondary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark"
        >
          <ShoppingBag className="h-4 w-4" /> Shop the kit
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  );
}

function AuthorBox() {
  return (
    <div className="flex flex-col sm:flex-row gap-5 rounded-[24px] border border-border bg-background/60 p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/founder/sidharathfounder.webp" alt={site.founder.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top" />
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-dark">Medically reviewed by</p>
        <p className="mt-1 font-heading text-lg font-bold text-heading">{site.founder.name}</p>
        <p className="text-sm text-slate-500">{site.founder.jobTitle} · {site.founder.credentials}</p>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          A practising surgeon and frequent traveller, Dr. Chitarth founded TravelMed after a family trip abroad was derailed by a minor illness.
        </p>
        <Link href="/about" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Read his story <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/** Server-rendered, fully indexable article layout for blog posts and destination pages. */
export async function ArticleTemplate({ article: rawArticle, path, breadcrumbs, related, label }: ArticleTemplateProps) {
  // Live, admin-managed price — also substituted into any {price}/{mrp}/{save} placeholders in the copy
  const pricing = derivePricing(await getFeaturedKit());
  const fill = (t: string) => fillPriceTokens(t, pricing);
  const article = {
    ...rawArticle,
    quickAnswer: fill(rawArticle.quickAnswer),
    description: fill(rawArticle.description),
    sections: rawArticle.sections.map((sec) => ({
      ...sec,
      paragraphs: sec.paragraphs?.map(fill),
      bullets: sec.bullets?.map(fill),
      steps: sec.steps?.map(fill),
      table: sec.table ? { ...sec.table, rows: sec.table.rows.map((r) => r.map(fill)) } : undefined,
      callout: sec.callout ? { ...sec.callout, text: fill(sec.callout.text) } : undefined,
    })),
    faqs: rawArticle.faqs.map((f) => ({ q: f.q, a: fill(f.a) })),
  };
  const url = absoluteUrl(path);
  const toc = [
    ...article.sections.map((s) => ({ id: slugify(s.heading), label: s.heading })),
    ...(article.faqs.length ? [{ id: 'faq', label: 'FAQs' }] : []),
  ];
  const inlineCtaAfter = Math.min(1, article.sections.length - 1);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <ReadingProgress />
      <JsonLd
        data={buildMedicalArticleSchema({
          title: article.title,
          description: article.description,
          path,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          image: article.image ? absoluteUrl(article.image) : undefined,
        })}
      />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
      {article.faqs.length > 0 && <JsonLd data={buildFaqSchema(article.faqs.map((f) => ({ title: f.q, contentText: f.a })))} />}

      {/* ── Header ── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
        <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 ${article.image ? 'pb-40 md:pb-56' : 'pb-16'}`}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              {breadcrumbs.map((b, i) => (
                <li key={b.url} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={b.url} className="transition hover:text-white">{b.name}</Link>
                  ) : (
                    <span aria-current="page" className="line-clamp-1 text-white/90">{b.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-secondary" /> {label ?? article.eyebrow}
            </span>
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1] !text-white">
              {article.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">{article.description}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/founder/sidharathfounder.webp" alt="" className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-white/30" />
              <div className="text-sm">
                <p className="flex items-center gap-1.5 font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-secondary" /> Reviewed by {site.founder.name}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-white/60">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Updated {formatDate(article.dateModified)}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readingMinutes} min read</span>
                </p>
              </div>
            </div>
            <ShareButtons url={url} title={article.title} />
          </div>
        </div>
      </header>

      {/* ── Cover ── */}
      {article.image && (
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 -mt-28 md:-mt-44">
          <div className="aspect-[16/8] overflow-hidden rounded-[28px] border-4 border-white bg-slate-100 shadow-[0_40px_100px_rgba(11,79,140,0.20)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image} alt={article.title} fetchPriority="high" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-12 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-8 min-w-0">
            {/* Quick answer */}
            <section aria-label="Quick answer" className="relative overflow-hidden rounded-[24px] border border-secondary/25 bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,79,140,0.08)]">
              <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-secondary to-primary" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-dark">Quick answer</p>
              <p className="mt-3 text-[17px] text-heading leading-relaxed">{article.quickAnswer}</p>
            </section>

            <article className="mt-12">
              {article.sections.map((s, idx) => (
                <React.Fragment key={s.heading}>
                  <section id={slugify(s.heading)} className={`scroll-mt-28 ${idx > 0 ? 'mt-14' : ''}`}>
                    <h2 className="text-2xl sm:text-[28px] font-bold font-heading tracking-tight leading-tight">{s.heading}</h2>
                    {s.paragraphs?.map((p) => (
                      <p key={p} className="mt-4 text-[17px] text-slate-600 leading-[1.8]">{p}</p>
                    ))}
                    {s.bullets && (
                      <ul className="mt-5 space-y-3">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-[17px] text-slate-600 leading-relaxed">
                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                              <Check className="h-3 w-3 text-secondary-dark" strokeWidth={3} />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.steps && (
                      <ol className="mt-5 space-y-3">
                        {s.steps.map((step, i) => (
                          <li key={step} className="flex gap-4 text-[17px] text-slate-600 leading-relaxed">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{i + 1}</span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {s.table && (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
                        <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
                          <thead>
                            <tr className="bg-background">
                              {s.table.head.map((h) => (
                                <th key={h} scope="col" className="px-5 py-3.5 text-sm font-bold text-heading">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {s.table.rows.map((row) => (
                              <tr key={row.join('|')} className="transition-colors hover:bg-background/60">
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`px-5 py-3.5 align-top ${ci === 0 ? 'font-semibold text-heading' : 'text-slate-600'}`}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {s.template && <CopyBlock title={s.template.title} body={s.template.body} />}
                    {s.callout && (
                      <div className={`mt-6 flex gap-3.5 rounded-2xl border p-5 ${s.callout.tone === 'warning' ? 'border-amber-200 bg-amber-50/70' : 'border-secondary/25 bg-secondary/5'}`}>
                        {s.callout.tone === 'warning' ? (
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        ) : (
                          <Info className="mt-0.5 h-5 w-5 shrink-0 text-secondary-dark" />
                        )}
                        <div>
                          <p className="font-bold text-heading">{s.callout.title}</p>
                          <p className="mt-1 text-[15px] text-slate-600 leading-relaxed">{s.callout.text}</p>
                        </div>
                      </div>
                    )}
                  </section>
                  {idx === inlineCtaAfter && (
                    <div className="mt-12 lg:hidden">
                      <KitCard pricing={pricing} />
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* FAQ */}
              {article.faqs.length > 0 && (
                <section id="faq" className="mt-16 scroll-mt-28">
                  <h2 className="text-2xl sm:text-[28px] font-bold font-heading tracking-tight">Frequently asked questions</h2>
                  <div className="mt-6 space-y-3">
                    {article.faqs.map((f, i) => (
                      <details key={f.q} className="group rounded-2xl border border-border bg-white px-5 py-4 transition open:border-primary/30 open:shadow-[0_10px_30px_rgba(11,79,140,0.06)]" open={i === 0}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="text-base font-semibold text-heading">{f.q}</h3>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background transition-transform group-open:rotate-90">
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          </span>
                        </summary>
                        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Author */}
              <div className="mt-14">
                <AuthorBox />
              </div>

              {/* Sources */}
              {article.sources.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-lg font-bold font-heading">Sources</h2>
                  <ul className="mt-3 space-y-2">
                    {article.sources.map((src) => (
                      <li key={src.url}>
                        <a href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                          {src.label} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-xs text-slate-500 leading-relaxed">
                    This article is general information for travellers and is not a substitute for personal medical advice. Medicine-import rules change —
                    always confirm with the destination’s official health authority or embassy.
                  </p>
                </section>
              )}

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-8">
                <p className="text-sm font-semibold text-heading">Found this useful? Share it with your travel group.</p>
                <ShareButtons url={url} title={article.title} tone="light" />
              </div>
            </article>
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-[24px] border border-border bg-white p-6">
                <TableOfContents items={toc} />
              </div>
              <KitCard compact pricing={pricing} />
              <Link
                href="/teleconsultation"
                className="group flex items-start gap-3 rounded-[24px] border border-border bg-white p-5 transition hover:border-primary/25"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <Stethoscope className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-bold text-heading">Not sure what to take?</span>
                  <span className="mt-0.5 block text-xs text-slate-500">A doctor calls within {site.consults.callbackHours} hours of booking.</span>
                </span>
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">Keep reading</h2>
              <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                All articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex flex-col overflow-hidden rounded-[22px] border border-border bg-white transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]"
                >
                  {r.image && (
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-secondary-dark">{r.eyebrow}</p>
                    <p className="mt-2 font-heading text-base font-bold leading-snug text-heading group-hover:text-primary">{r.title}</p>
                    {r.readingMinutes && (
                      <p className="mt-auto pt-4 inline-flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" /> {r.readingMinutes} min read
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
