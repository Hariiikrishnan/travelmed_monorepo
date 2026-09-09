'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, HeartPulse, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

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

  const productLinks = [
    { name: 'Buy Travel Kit', path: '/buy' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Teleconsultation', path: '/teleconsultation' },
  ];

  const supportLinks = [
    { name: 'FAQ Support', path: '/faq' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Shipping Guide', path: '/shipping' },
    { name: 'Refund Policy', path: '/refund' }
  ];

  const legalLinks = [
    { name: 'Shipping & Returns', path: '/shipping' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' }
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Doctors', path: '/doctor' }
  ];

  return (
    <footer
      className="font-sans bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/footer.webp')" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Grid links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="TravelMed"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Your Health. Your Journey. Always Protected. The premium travel medical kit combined with instant doctor teleconsultation worldwide.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs md:text-sm text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-neutral-200">
                <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
                <span>GMP, WHO, CDSCO & DCGI Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-secondary shrink-0" />
                <span>Certified Medical Advisory Endorsed</span>
              </div>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Product
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {productLinks.map((l) => (
                <li key={l.name}>
                  <Link 
                    href={l.path} 
                    className="group relative inline-flex items-center gap-2 font-medium text-slate-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 transition-all duration-300 shrink-0" />
                    <span className="relative">
                      {l.name}
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Support
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {supportLinks.map((l) => (
                <li key={l.name}>
                  <Link 
                    href={l.path} 
                    className="group relative inline-flex items-center gap-2 font-medium text-slate-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 transition-all duration-300 shrink-0" />
                    <span className="relative">
                      {l.name}
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Legal
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {legalLinks.map((l) => (
                <li key={l.name}>
                  <Link 
                    href={l.path} 
                    className="group relative inline-flex items-center gap-2 font-medium text-slate-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 transition-all duration-300 shrink-0" />
                    <span className="relative">
                      {l.name}
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 4 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-800 dark:text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
              Company
            </h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {companyLinks.map((l) => (
                <li key={l.name}>
                  <Link 
                    href={l.path} 
                    className="group relative inline-flex items-center gap-2 font-medium text-slate-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-300 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0 transition-all duration-300 shrink-0" />
                    <span className="relative">
                      {l.name}
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator */}
        <hr className="border-slate-300/60 my-12" />

        {/* Bottom bar & Newsletter */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Newsletter */}
          <div className="w-full lg:max-w-md space-y-3">
            <h5 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Subscribe to Travel Safety Guide</h5>
            <p className="text-xs text-slate-500">
              Get international pharmacy updates, customs medical regulations, and packing tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={submitted}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-slate-300 text-slate-800 placeholder-slate-400 rounded-full text-xs md:text-sm focus:outline-none focus:border-primary disabled:opacity-50"
                />
                <Mail className="absolute right-4 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              <Button type="submit" size="sm" variant={submitted ? 'accent' : 'primary'} disabled={submitted}>
                {submitted ? <Check className="h-4 w-4" /> : 'Subscribe'}
              </Button>
            </form>
          </div>

          {/* Copyrights */}
          <div className="text-center lg:text-right space-y-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Travel Med Inc. All rights reserved.</p>
            <p className="max-w-xs lg:max-w-none text-[10px] md:text-xs">
              Disclaimer: Travel Med kits contain DCGI approved over the counter medicine. Doctor consultations are provided by certified board partners. Not a substitute for emergency hospitalization.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
