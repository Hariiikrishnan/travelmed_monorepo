'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, HeartPulse, ChevronDown, Phone, User } from 'lucide-react';
import { useCart } from '@/shared/providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Buy Kit', path: '/buy' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Teleconsultation', path: '/teleconsultation' },
  { name: 'About', path: '/about' },
];

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


  return (
    <>
      {/* Top strip */}
      <div className="bg-primary text-white text-[11px] font-semibold py-2 text-center tracking-wide select-none">
        🚀 Free Shipping on All Orders &nbsp;·&nbsp; 2 FREE Teleconsultations Included &nbsp;·&nbsp; CDSCO Regulated Medicines
      </div>

      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(15,23,42,0.08)]'
            : 'bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center h-9 w-9 bg-primary rounded-xl shadow-sm">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-extrabold text-slate-900 text-lg tracking-tight leading-none">
                  Travel<span className="text-primary">Med</span>
                </span>
                <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase leading-none mt-0.5">
                  Your Health. Your Journey.
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
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
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-modal overflow-hidden lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-full max-w-[300px] bg-white shadow-2xl flex flex-col h-full"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 h-[68px] border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-8 w-8 bg-primary rounded-lg">
                    <HeartPulse className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-heading font-extrabold text-slate-900 text-base">
                    Travel<span className="text-primary">Med</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-primary/8 text-primary'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* CTA */}
              <div className="p-4 border-t border-slate-100 space-y-2">
                <Link href="/buy" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-sm transition cursor-pointer">
                    Buy Now — ₹2,900
                  </button>
                </Link>
                <Link href="/teleconsultation" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Free Consultation
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
