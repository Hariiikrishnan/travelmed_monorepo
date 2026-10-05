'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Clock, Check, ArrowRight, ShieldCheck, Lock, ArrowUp, Send } from 'lucide-react';

const linkGroups = [
  {
    title: 'Product',
    links: [
      { name: 'Buy Travel Kit', path: '/buy' },
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Teleconsultation', path: '/teleconsultation' },
      { name: 'Downloads', path: '/downloads' },
    ],
  },
  {
    title: 'Destinations',
    links: [
      { name: 'Thailand', path: '/travel-medicine-kit/thailand' },
      { name: 'Dubai & UAE', path: '/travel-medicine-kit/dubai-uae' },
      { name: 'Europe', path: '/travel-medicine-kit/europe' },
      { name: 'Umrah & Hajj', path: '/travel-medicine-kit/umrah-hajj' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'FAQ & Help Center', path: '/faq' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Track Your Order', path: '/track-order' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Shipping & Returns', path: '/shipping' },
      { name: 'Refund Policy', path: '/refund' },
      { name: 'Terms & Conditions', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Doctors', path: '/teleconsultation' },
      { name: 'Travel Health Blog', path: '/blog' },
    ],
  },
];

const certifications = [
  { name: 'GMP', logo: '/logos/gmp.svg' },
  { name: 'WHO', logo: '/logos/who.svg' },
  { name: 'CDSCO', logo: '/logos/cdsco.svg' },
  { name: 'DCGI', logo: '/logos/dcgi.svg' },
];

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat font-sans text-heading"
      style={{ backgroundImage: "url('/footer.webp')" }}
    >

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Newsletter band ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-b border-slate-300/60 py-14 md:py-16">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-dark">
              <span className="h-px w-6 bg-secondary-dark" /> Travel safety guide
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight leading-tight">
              Travel smarter, stay healthier.
            </h2>
            <p className="mt-3 max-w-md text-sm sm:text-base text-slate-600 leading-relaxed">
              Pharmacy updates, customs medicine rules and packing tips — straight to your inbox.
            </p>
          </div>

          <div className="lg:justify-self-end w-full lg:max-w-md">
            <form onSubmit={handleSubscribe} className="relative">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-300/70 bg-white/80 p-1.5 pl-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur transition focus-within:border-primary/40 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={submitted}
                  autoComplete="email"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-heading placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitted}
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:bg-emerald-600 cursor-pointer disabled:cursor-default"
                >
                  {submitted ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={3} /> Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
            <AnimatePresence>
              {submitted ? (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 text-xs text-emerald-700"
                  role="status"
                >
                  Thanks for subscribing — look out for our next guide.
                </motion.p>
              ) : (
                <p className="mt-2.5 text-xs text-slate-500">No spam. Unsubscribe anytime.</p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-x-8 gap-y-12 py-14 md:py-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5 lg:col-span-2">
            <Link href="/" aria-label="TravelMed home" className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="TravelMed" className="h-14 md:h-16 w-auto object-contain" />
            </Link>
            <p className="mt-6 max-w-sm text-sm text-slate-600 leading-relaxed">
              Your health. Your journey. Always protected. Doctor-curated travel medical kits with free teleconsultations —
              we contact you within 8–12 hrs of booking.
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a href="tel:+918148493389" className="group inline-flex items-center gap-3 text-slate-700 transition hover:text-primary">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 ring-1 ring-slate-200 transition group-hover:bg-primary group-hover:ring-primary">
                    <Phone className="h-4 w-4 text-primary transition group-hover:text-white" />
                  </span>
                  +91 81484 93389
                </a>
              </li>
              <li>
                <a href="mailto:sales@travelmed.org" className="group inline-flex items-center gap-3 text-slate-700 transition hover:text-primary">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 ring-1 ring-slate-200 transition group-hover:bg-primary group-hover:ring-primary">
                    <Mail className="h-4 w-4 text-primary transition group-hover:text-white" />
                  </span>
                  sales@travelmed.org
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-slate-500">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 ring-1 ring-slate-200">
                  <Clock className="h-4 w-4 text-primary" />
                </span>
                Mon–Sat, 9 AM – 6 PM IST
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={group.title} className="lg:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] !text-slate-900">{group.title}</h3>
              <ul className="mt-5 space-y-3.5">
                {group.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.path}
                      className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-primary"
                    >
                      {l.name}
                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-secondary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Certifications strip ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-[24px] border border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-secondary-dark" />
            <div>
              <p className="text-sm font-semibold text-heading">Certified &amp; regulated</p>
              <p className="text-xs text-slate-500">Made in WHO-GMP certified facilities · CDSCO &amp; DCGI regulated</p>
            </div>
          </div>
          <ul className="flex flex-wrap items-center gap-2.5">
            {certifications.map((c) => (
              <li key={c.name} className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logo} alt={`${c.name} certified`} className="h-6 w-auto max-w-[90px] object-contain" />
              </li>
            ))}
          </ul>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-5 py-8 mt-8 border-t border-slate-300/60 text-xs text-slate-500">
          <div className="space-y-1.5 max-w-2xl">
            <p>© {new Date().getFullYear()} Travel Med Inc. All rights reserved.</p>
            <p className="leading-relaxed">
              Travel Med kits contain DCGI approved medicines. Doctor consultations are provided by certified board partners.
              Not a substitute for emergency hospitalization.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-secondary-dark" /> Secure payments by Razorpay
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-600 transition hover:border-primary hover:bg-primary hover:text-white cursor-pointer"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
