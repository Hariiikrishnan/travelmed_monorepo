'use client';

import React, { useState, useMemo } from 'react';
import { Accordion } from '@/shared/ui/Accordion';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { PageHero, Eyebrow } from '@/shared/ui/PageHero';
import {
  Search,
  HelpCircle,
  Phone,
  Mail,
  Package,
  Stethoscope,
  CreditCard,
  Truck,
  RefreshCw,
  X,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HELP_CENTER_FAQS, KIT_CATEGORIES, PAYMENT_METHODS, type FaqExtra } from '@/entities/faq/data';
import { site } from '@/shared/config/site';
import { fillPriceTokens } from '@/shared/pricing';
import { usePricing } from '@/shared/providers/ProductProvider';

interface FAQItem {
  id: string;
  category: string;
  title: string;
  content: React.ReactNode;
  searchText: string;
}

function FaqExtraDetail({ type }: { type: FaqExtra }) {
  if (type === 'medicine-list') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        {KIT_CATEGORIES.map((med) => (
          <div key={med} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2 text-xs font-semibold text-heading">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-secondary-dark" />
            {med}
          </div>
        ))}
      </div>
    );
  }
  if (type === 'payment-list') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {PAYMENT_METHODS.map((pm) => (
          <div key={pm} className="flex items-center gap-2 rounded-xl bg-background/60 p-2 text-xs font-semibold text-heading">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
            {pm}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="max-w-md overflow-hidden rounded-2xl border border-border">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="bg-background font-bold text-heading">
            <th className="p-3">Region</th>
            <th className="p-3">Delivery time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-slate-600">
          {site.shipping.zones.map((z) => (
            <tr key={z.label}>
              <td className="p-3">{z.label}</td>
              <td className="p-3 font-semibold text-heading">{z.min}–{z.max} business days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'product', label: 'About the Product', icon: <Package className="h-4 w-4" /> },
    { id: 'consults', label: 'Teleconsultations', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'payment', label: 'Orders & Payment', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <Truck className="h-4 w-4" /> },
    { id: 'returns', label: 'Returns & Refunds', icon: <RefreshCw className="h-4 w-4" /> }
  ];

  // Same entries feed the FAQPage JSON-LD in ./layout.tsx, so the schema always matches this page
  const pricing = usePricing();
  const faqs: FAQItem[] = useMemo(
    () =>
      HELP_CENTER_FAQS.map((f) => ({
        id: f.id,
        category: f.category,
        title: f.question,
        searchText: fillPriceTokens(f.answer, pricing),
        content: (
          <div className="space-y-3 text-left">
            <p>{fillPriceTokens(f.answer, pricing)}</p>
            {f.extra && <FaqExtraDetail type={f.extra} />}
          </div>
        ),
      })),
    [pricing]
  );

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.searchText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        activeCategory === 'all' || faq.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, faqs]);

  const countFor = (catId: string) => (catId === 'all' ? faqs.length : faqs.filter((f) => f.category === catId).length);
  const activeLabel = categories.find((c) => c.id === activeCategory)?.label ?? 'All Questions';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <PageHero
        badge="Help Center & FAQ"
        badgeIcon={<HelpCircle className="h-3.5 w-3.5 text-secondary" />}
        title="How can we"
        highlight="help you?"
        description="Questions about kit contents, doctor consultations, airport compliance or express shipping — find answers here."
      >
        <div className="relative max-w-xl mx-auto">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            aria-label="Search help topics"
            placeholder="Search e.g. medicines, customs, teleconsult, shipping…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[18px] border border-white/20 bg-white py-4 pl-13 pr-12 text-sm font-medium text-heading placeholder:text-slate-400 shadow-[0_20px_50px_rgba(0,0,0,0.20)] focus:outline-none focus:ring-4 focus:ring-secondary/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-heading cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PageHero>

      {/* Mobile category pills */}
      <div className="lg:hidden sticky top-16 z-30 border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border border-border bg-white text-slate-600'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="py-14 md:py-20 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Desktop category sidebar */}
            <aside className="hidden lg:block lg:col-span-4">
              <nav aria-label="FAQ categories" className="sticky top-28 rounded-[24px] border border-border bg-white p-3">
                <p className="px-3 pt-2 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Browse by topic</p>
                <ul className="space-y-1">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          aria-current={isActive}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition cursor-pointer ${
                            isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-background hover:text-heading'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-slate-400'}>{cat.icon}</span>
                          <span className="flex-1">{cat.label}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                              isActive ? 'bg-white/20 text-white' : 'bg-background text-slate-500'
                            }`}
                          >
                            {countFor(cat.id)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Questions */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {filteredFaqs.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-[28px] border border-border bg-white px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                      <Search className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-xl font-bold font-heading">No questions found</h2>
                    <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                      We couldn&apos;t find anything matching &ldquo;{searchTerm}&rdquo;. Try a different search or topic.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('all');
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" /> Reset filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeCategory + searchTerm}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-5 flex items-baseline justify-between gap-4">
                      <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight">{activeLabel}</h2>
                      <span className="text-sm text-slate-500 tabular-nums">
                        {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                      </span>
                    </div>
                    <Accordion items={filteredFaqs} defaultOpenId={filteredFaqs[0]?.id} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-8 sm:p-12 text-white shadow-[0_40px_100px_rgba(11,79,140,0.25)]">
              <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <Eyebrow light>Support desk</Eyebrow>
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight !text-white leading-tight">
                    Still have questions?
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-white/70">
                    Our support team is available Mon–Sat, 9 AM – 6 PM IST.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="tel:+918148493389"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-white px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-slate-100"
                  >
                    <Phone className="h-4 w-4" /> +91 81484 93389
                  </a>
                  <a
                    href="mailto:sales@travelmed.org"
                    className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" /> sales@travelmed.org
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
