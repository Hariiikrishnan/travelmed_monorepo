'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag, Menu, X, ChevronDown, ChevronRight, Phone, Mail, Truck, Home, Workflow, Stethoscope, BookOpen, Info, ArrowRight, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { site } from '@/shared/config/site';
import { usePricing } from '@/shared/providers/ProductProvider';
import { useCart } from '@/shared/providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: Array<{ name: string; path: string; icon: LucideIcon; hint: string }> = [
  { name: 'Home', path: '/', icon: Home, hint: 'Start here' },
  { name: 'Buy Kit', path: '/buy', icon: ShoppingBag, hint: '150+ doctor-curated medicines' },
  { name: 'How It Works', path: '/how-it-works', icon: Workflow, hint: 'Pack, use & consult' },
  { name: 'Teleconsultation', path: '/teleconsultation', icon: Stethoscope, hint: '2 free doctor consults' },
  { name: 'Blog', path: '/blog', icon: BookOpen, hint: 'Doctor-reviewed travel guides' },
  { name: 'About', path: '/about', icon: Info, hint: 'Our doctor-founded story' },
];

const isActivePath = (pathname: string, path: string) => (path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`));

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getCartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = getCartCount();
  const pricing = usePricing();

  // Close the mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Mobile menu: Escape to close + lock page scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileMenuOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);


  return (
    <>
      {/* Top strip */}
      <div className="bg-primary text-white text-[11px] font-semibold py-2 px-4 tracking-wide select-none">
        <p className="flex items-center justify-center gap-2 text-center">
          <Truck className="h-3.5 w-3.5 shrink-0 text-secondary" />
          <span>
            Free shipping across India<span className="hidden sm:inline"> &nbsp;·&nbsp; 2 free teleconsultations &nbsp;·&nbsp; CDSCO-regulated medicines</span>
          </span>
        </p>
      </div>

      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(15,23,42,0.08)]'
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[80px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="TravelMed"
                className="h-14 sm:h-16 md:h-18 w-auto object-contain max-h-[68px]"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = isActivePath(pathname, item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group whitespace-nowrap ${
                      isActive
                        ? 'text-primary'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              {/* Teleconsult pill — desktop only */}
              <Link
                href="/teleconsultation"
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-bold hover:border-primary/40 hover:text-primary transition-all duration-200 whitespace-nowrap"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Free Consult</span>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 flex items-center justify-center rounded-full bg-primary text-white text-[9px] font-extrabold">
                    {cartCount}
                  </span>
                )}
              </button>



              {/* Buy Now CTA */}
              <Link href="/buy" className="hidden sm:block">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap">
                  Buy Now
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 opacity-70" />
                </button>
              </Link>

              {/* Mobile Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition active:scale-95 cursor-pointer"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile menu (full-screen sheet) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="fixed inset-0 z-[10001] lg:hidden flex flex-col bg-white font-sans"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} aria-label="TravelMed home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.webp" alt="TravelMed" className="h-11 w-auto object-contain" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-heading transition hover:bg-slate-200 active:scale-95 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-8">
              {/* Nav links */}
              <nav aria-label="Mobile">
                <ul className="space-y-1.5">
                  {navItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(pathname, item.path);
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`group flex items-center gap-4 rounded-2xl px-3 py-3 transition ${
                            isActive ? 'bg-primary text-white shadow-[0_12px_30px_rgba(11,79,140,0.25)]' : 'text-heading hover:bg-background active:bg-background'
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${
                              isActive ? 'bg-white/15 text-white' : 'bg-primary/5 text-primary'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-heading text-[17px] font-bold leading-tight">{item.name}</span>
                            <span className={`mt-0.5 block text-xs ${isActive ? 'text-white/70' : 'text-slate-500'}`}>{item.hint}</span>
                          </span>
                          <ChevronRight className={`h-5 w-5 shrink-0 transition-transform group-active:translate-x-0.5 ${isActive ? 'text-white/70' : 'text-slate-300'}`} />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Kit promo */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="relative mt-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-5 text-white"
              >
                <div aria-hidden className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-secondary/30 blur-[60px]" />
                <div className="relative flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pro.webp" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">Travel Med Kit</p>
                    {pricing && (
                      <p className="mt-1 flex items-baseline gap-2">
                        <span className="font-heading text-2xl font-extrabold text-white">{pricing.priceText}</span>
                        {pricing.save > 0 && <span className="text-sm text-white/50 line-through">{pricing.mrpText}</span>}
                      </p>
                    )}
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-white/70">
                      <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> 150+ medicines · 2 free consults
                    </p>
                  </div>
                </div>
                <Link
                  href="/buy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-secondary text-sm font-bold text-white shadow-lg shadow-secondary/30 transition active:scale-[0.98]"
                >
                  <ShoppingBag className="h-4 w-4" /> Buy Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              {/* Quick actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.35 }}
                className="mt-4 grid grid-cols-3 gap-2"
              >
                {[
                  { icon: Phone, label: 'Call us', href: `tel:${site.contact.phoneE164}` },
                  { icon: Mail, label: 'Email', href: `mailto:${site.contact.email}` },
                  { icon: Truck, label: 'Track order', href: '/track-order' },
                ].map(({ icon: Icon, label, href }) => {
                  const cls =
                    'flex flex-col items-center gap-2 rounded-2xl border border-border bg-white py-3.5 text-xs font-semibold text-heading transition active:scale-[0.97] active:bg-background';
                  const inner = (
                    <>
                      <Icon className="h-5 w-5 text-primary" />
                      {label}
                    </>
                  );
                  return href.startsWith('/') ? (
                    <Link key={label} href={href} onClick={() => setMobileMenuOpen(false)} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <a key={label} href={href} className={cls}>
                      {inner}
                    </a>
                  );
                })}
              </motion.div>

              <p className="mt-6 text-center text-xs text-slate-400">Support {site.contact.hours}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
