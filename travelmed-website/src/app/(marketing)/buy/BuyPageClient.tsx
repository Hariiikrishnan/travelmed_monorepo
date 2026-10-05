'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/shared/providers/CartProvider';
import { Rating } from '@/shared/ui/Rating';
import { Accordion } from '@/shared/ui/Accordion';
import { ApprovalsSection } from '@/shared/ui/ApprovalsSection';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { BUY_FAQS } from '@/entities/faq/data';
import { analytics, kitItem } from '@/shared/analytics/gtag';
import { usePricing } from '@/shared/providers/ProductProvider';
import { fillPriceTokens } from '@/shared/pricing';
import {
  Plus,
  Minus,
  ShieldCheck,
  Check,
  Truck,
  Sparkles,
  MessageSquare,
  Award,
  ShoppingBag,
  Lock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Luggage,
  ArrowRight,
  Gift,
  Stethoscope,
  Pill,
  BadgeCheck,
} from 'lucide-react';

// Gallery images
const images = [
  { src: '/pro.webp', alt: 'Travel Med premium pouch close-up' },
  { src: '/products.webp', alt: 'Full Travel Med kit with all medicines and pouch' },
  { src: '/products/trollybag.webp', alt: 'Travel Med kit packed in a trolley bag' },
  { src: '/products/handbag.webp', alt: 'Travel Med kit in a handbag' },
  { src: '/products/backpack.webp', alt: 'Travel Med kit in a backpack' },
  { src: '/products/all rounder.webp', alt: 'Travel Med kit all-rounder display' },
];

const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const categories = [
  { name: 'Antacids', desc: 'For acidity and heartburn' },
  { name: 'Pain Killers & Analgesics', desc: 'For body pain & headache' },
  { name: 'Antimotility Drugs', desc: 'For loose motions' },
  { name: 'Laxative Stimulant for Constipation', desc: 'For stomach clearing' },
  { name: 'Antispasmodics', desc: 'For abdominal spasms' },
  { name: 'Cough Suppressant', desc: 'For dry/wet cough' },
  { name: 'Antibiotic', desc: 'For bacterial infections' },
  { name: 'ORS Salts', desc: 'For dehydration prevention' },
  { name: 'Antihistamine', desc: 'For allergies & sneezing' },
  { name: 'Motion Sickness Tablets', desc: 'For vomiting & nausea in travel' },
  { name: 'Antiemetic', desc: 'For nausea & vomiting' },
  { name: 'Antipyretic (Fever)', desc: 'For temperature control' },
  { name: 'Anti Cold', desc: 'For runny nose & blocked head' },
  { name: 'Sore Throat Lozenges', desc: 'For throat irritation relief' },
  { name: 'Pre & Probiotics', desc: 'For gut health maintenance' },
  { name: 'Bandages & Plasters', desc: 'For wounds & cuts' },
  { name: 'First Aid Cotton', desc: 'For dressing & sanitisation' },
];

const benefits = [
  {
    icon: Pill,
    title: '150+ Curated Medicines',
    desc: 'Covers all common travel ailments and minor emergencies.',
  },
  {
    icon: BadgeCheck,
    title: '100% Trusted Quality',
    desc: 'CDSCO-regulated, premium Indian branded medicines with long shelf life.',
  },
  {
    icon: Stethoscope,
    title: 'Teleconsultations & Prescription',
    desc: "2 FREE consultations with a General Physician and Orthopaedician, plus a signed doctor's prescription.",
  },
];

const specs = [
  {
    id: 'spec-1',
    title: 'Pouch Specifications',
    icon: Sparkles,
    content: (
      <dl className="space-y-3">
        {[
          ['Dimensions', 'Standard (8.2 × 5.5 × 2.4 in)'],
          ['Material', '1680D Ballistic Nylon (shockproof)'],
          ['Zipper', 'YKK Waterproof Aquaguard Slider'],
          ['Baggage advice', 'Preferred in check-in baggage'],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0">
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{k}</dt>
            <dd className="text-sm font-medium text-heading">{v}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: 'spec-2',
    title: 'Medical Compliance & Ingredients',
    icon: ShieldCheck,
    content: (
      <p>
        All medications are individually blistered and sourced directly from DCGI-approved medicine labs. Expiry dates
        are monitored and guaranteed for a minimum of 24 months from purchase.
      </p>
    ),
  },
  {
    id: 'spec-3',
    title: 'Doctor Teleconsult Policy',
    icon: MessageSquare,
    content: (
      <p>
        Includes 2 FREE consultations with our board-certified medical team, along with an official signed
        doctor&apos;s prescription.
      </p>
    ),
  },
];

// Shared with the FAQPage JSON-LD in ./page.tsx
const buyFaqs = (pricing: ReturnType<typeof usePricing>) =>
  BUY_FAQS.map((f) => ({ id: f.id, title: f.question, content: <span>{fillPriceTokens(f.answer, pricing)}</span> }));

const fitsAnywhere = [
  { image: '/products/trollybag.webp', title: 'In your luggage' },
  { image: '/products/backpack.webp', title: 'In your backpack' },
  { image: '/products/handbag.webp', title: 'In your handbag' },
  { image: '/products/all%20rounder.webp', title: 'Fits all bags' },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-dark">
      <span className="h-px w-6 bg-secondary-dark" />
      {children}
    </span>
  );
}

/** /buy — the featured kit (the original buy page design). Other kits use /buy/[slug]. */
export default function BuyPageClient() {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  // Admin-managed price, MRP and stock
  const pricing = usePricing();
  const unitPrice = pricing?.price ?? 0;
  const oldPrice = pricing?.mrp ?? 0;
  const savePercent = pricing?.savePercent ?? 0;
  const purchasable = Boolean(pricing?.inStock);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isIncludedOpen, setIsIncludedOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pricing) analytics.viewItem([kitItem(1, pricing.price)]);
  }, [pricing]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveImageIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Show the mobile sticky purchase bar once the main CTA scrolls out of view
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goToImage = (idx: number) => {
    setActiveImageIdx((idx + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const handleAddToBag = () => {
    if (!pricing || !purchasable) return;
    addItem({
      id: pricing.product.id,
      name: pricing.product.name,
      price: unitPrice,
      type: 'kit',
      description: 'Includes 150+ curated medicines, doctor prescription, waterproof pouch, and 2 FREE teleconsultations.',
      options: {
        size: 'Solo',
      },
      quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToBag();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const total = unitPrice * quantity;
  const totalSavings = (oldPrice - unitPrice) * quantity;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      {/* ── Product section ──────────────────────────────────── */}
      <section className="relative pt-6 pb-16 md:pt-10 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-[#E6F0FC] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-heading">Travel Med Kit</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* ── Gallery ── */}
            <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
              <div className="group relative aspect-square sm:aspect-[5/4] overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_30px_80px_rgba(11,79,140,0.10)]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIdx}
                    src={images[activeImageIdx].src}
                    alt={images[activeImageIdx].alt}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-0 h-full w-full object-contain p-6 sm:p-10"
                  />
                </AnimatePresence>

                <div className="absolute left-4 top-4 sm:left-5 sm:top-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> CDSCO Regulated
                  </span>
                  {savePercent > 0 && (
                    <span className="inline-flex items-center rounded-full bg-rose-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-rose-500/20">
                      {savePercent}% off
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => goToImage(activeImageIdx - 1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/90 text-heading shadow-md backdrop-blur transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goToImage(activeImageIdx + 1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/90 text-heading shadow-md backdrop-blur transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-heading/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur tabular-nums">
                  {activeImageIdx + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => goToImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    aria-current={activeImageIdx === idx}
                    className={`aspect-square overflow-hidden rounded-xl sm:rounded-2xl border bg-white transition-all duration-200 cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt="" className="h-full w-full object-contain p-1.5 sm:p-2" />
                  </button>
                ))}
              </div>

              {/* Guarantees */}
              <div className="hidden lg:grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, title: 'Express delivery', desc: 'Dispatched within 24 hours' },
                  { icon: Lock, title: 'Secure checkout', desc: 'SSL-encrypted payments' },
                  { icon: Award, title: 'DCGI approved', desc: 'Quality-assured medicines' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-heading">{title}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Purchase panel ── */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <Rating value={5} />
                  <span className="font-bold text-heading">4.9</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">1,240+ verified travelers</span>
                </div>
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-[44px] font-extrabold font-heading tracking-tight leading-[1.1]">
                  The Travel Med Kit
                </h1>
                <p className="mt-2 text-base text-slate-500">Complete travel pharmacy &amp; medical pouch</p>
              </div>

              {/* Price */}
              <div className="rounded-[24px] border border-border bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                {pricing ? (
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                    <span className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight text-heading leading-none">
                      {pricing.priceText}
                    </span>
                    {pricing.save > 0 && (
                      <>
                        <span className="text-lg text-slate-400 line-through">{pricing.mrpText}</span>
                        <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          Save {pricing.saveText}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="font-heading text-2xl font-bold text-heading">Price unavailable right now</p>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  {pricing && !pricing.inStock ? (
                    <span className="font-semibold text-rose-600">Currently out of stock</span>
                  ) : (
                    'Inclusive of all taxes · Free express shipping across India'
                  )}
                </p>

                <div className="mt-5 flex items-start gap-3.5 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-white shadow-md shadow-secondary/20">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-heading">2 Free Teleconsultations &amp; Signed Rx</p>
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-secondary-dark">₹1,500 value</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Licensed General Physicians &amp; Orthopaedicians — doctor contacts you within 8–12 hrs of booking.
                      Includes a signed prescription for customs or travel verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <ul className="space-y-4">
                {benefits.map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-heading">{title}</p>
                      <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Quantity + CTAs */}
              <div ref={ctaRef} className="rounded-[24px] border border-border bg-white p-5 sm:p-6 space-y-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-heading">Quantity</p>
                    <p className="text-xs text-slate-500">
                      Total <span className="font-semibold text-heading tabular-nums">{formatINR(total)}</span>
                      {quantity > 1 && totalSavings > 0 && (
                        <span className="text-emerald-600"> · you save {formatINR(totalSavings)}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center rounded-full border border-border bg-background p-1 select-none">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-heading transition hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold tabular-nums" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-heading transition hover:bg-white hover:shadow-sm cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!purchasable}
                    className="group order-1 sm:order-2 inline-flex h-14 items-center justify-center gap-2 rounded-[14px] bg-primary text-[15px] font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {purchasable ? 'Buy Now' : pricing ? 'Out of stock' : 'Unavailable'}
                    {purchasable && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={!purchasable}
                    className="order-2 sm:order-1 inline-flex h-14 items-center justify-center gap-2 rounded-[14px] border-2 border-primary/15 bg-white text-[15px] font-bold text-primary transition hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    Add to Cart
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-secondary-dark" /> Free express delivery</span>
                  <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4 text-secondary-dark" /> Secure checkout</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-secondary-dark" /> CDSCO compliant</span>
                </div>
              </div>

              {/* Baggage note */}
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <Luggage className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-900 leading-relaxed">
                  <span className="font-bold">Packing tip:</span> carry the kit in your check-in baggage for smooth airport
                  security transit.
                </p>
              </div>

              {/* What's included */}
              <div className="overflow-hidden rounded-[20px] border border-border bg-white">
                <button
                  type="button"
                  onClick={() => setIsIncludedOpen(!isIncludedOpen)}
                  aria-expanded={isIncludedOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/70 cursor-pointer"
                >
                  <span>
                    <span className="block text-[15px] font-bold font-heading text-heading">What&apos;s included in the kit</span>
                    <span className="block text-xs text-slate-500">{categories.length} categories · 150+ items</span>
                  </span>
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-background transition-transform duration-300 ${isIncludedOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isIncludedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-5 pb-5 pt-4">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5">
                          {categories.map((cat, idx) => (
                            <li
                              key={cat.name}
                              className={`items-start gap-2.5 ${idx >= 6 && !showAllCategories ? 'hidden sm:flex' : 'flex'}`}
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                                <Check className="h-3 w-3 text-secondary-dark" />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-heading leading-snug">{cat.name}</span>
                                <span className="block text-xs text-slate-500">{cat.desc}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => setShowAllCategories(!showAllCategories)}
                          className="sm:hidden mt-4 w-full rounded-xl bg-primary/5 py-2.5 text-xs font-bold text-primary transition hover:bg-primary/10"
                        >
                          {showAllCategories ? 'Show less' : `View all ${categories.length} categories`}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fits anywhere ────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center">
            <Eyebrow>Compact by design</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Fits anywhere. Goes everywhere.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              Designed to be compact so you can carry health with you, wherever you go.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {fitsAnywhere.map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delay={idx * 0.08}>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.06)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <p className="absolute bottom-4 left-4 right-4 font-heading text-base sm:text-lg font-bold text-white">
                    {item.title}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical details ────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center">
            <Eyebrow>Specifications</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Technical details
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {specs.map(({ id, title, icon: Icon, content }, idx) => (
              <ScrollReveal key={id} direction="up" delay={idx * 0.08} className="h-full">
                <div className="h-full rounded-[24px] border border-border bg-white p-7 transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold font-heading">{title}</h3>
                  <div className="mt-3 text-sm text-slate-500 leading-relaxed">{content}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approvals ────────────────────────────────────────── */}
      <ApprovalsSection />

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <ScrollReveal direction="up" className="lg:sticky lg:top-28">
                <Eyebrow>Got questions?</Eyebrow>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-[1.1]">
                  Product &amp; purchase FAQs
                </h2>
                <p className="mt-5 text-base text-slate-500 leading-relaxed">
                  Everything you need to know before ordering your Travel Med Kit.
                </p>
                <Link href="/faq" className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  View all Help Center FAQs
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-8">
              <ScrollReveal direction="up" delay={0.1}>
                <Accordion items={buyFaqs(pricing)} defaultOpenId="buy-faq-1" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile sticky purchase bar ───────────────────────── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-center gap-3 px-4 py-3 pr-[84px]">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-extrabold font-heading text-heading leading-none tabular-nums">{formatINR(total)}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {totalSavings > 0 && <span className="line-through">{formatINR(oldPrice * quantity)}</span>}
                  {totalSavings > 0 ? ' · ' : ''}Free shipping
                </p>
              </div>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!purchasable}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-[14px] bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] cursor-pointer disabled:bg-slate-300 disabled:shadow-none"
              >
                Buy Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
