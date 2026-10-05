'use client';

import React, { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ShieldCheck, ShieldAlert, Loader2, ArrowRight,
  ShoppingCart, Pill, Video, BarChart3, KeyRound,
} from 'lucide-react';

interface LoginViewProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

const features = [
  { icon: ShoppingCart, title: 'Orders & fulfilment', desc: 'Track every kit from payment to doorstep' },
  { icon: Pill, title: 'Medicine catalogue', desc: 'Stock, batches and expiry at a glance' },
  { icon: Video, title: 'Telehealth desk', desc: 'Doctors, bookings and callbacks' },
  { icon: BarChart3, title: 'Live analytics', desc: 'Revenue, conversion and trends' },
];

const inputBase =
  'peer w-full rounded-2xl border bg-white py-3.5 pl-12 text-[15px] font-medium text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-4';

/** Split-screen administrator sign-in with CSS-only animations. */
export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  error,
  onSubmit,
}: LoginViewProps) {
  const [capsLock, setCapsLock] = useState(false);
  // Counts submissions so the error alert re-mounts (and shakes) on every failed attempt
  const [attempt, setAttempt] = useState(0);
  const handleSubmit = (e: React.FormEvent) => {
    setAttempt((n) => n + 1);
    onSubmit(e);
  };

  const detectCaps = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.('CapsLock') ?? false);
  const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      {/* ── Brand panel ── */}
      <aside className="relative hidden lg:flex w-[46%] xl:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#083B69] via-[#0B4F8C] to-[#0A3F70] p-12 xl:p-16 text-white">
        <div aria-hidden className="login-drift absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-[#14B8A6]/30 blur-[110px]" />
        <div aria-hidden className="login-drift absolute -bottom-40 -right-24 h-[460px] w-[460px] rounded-full bg-sky-400/25 blur-[120px]" style={{ animationDelay: '-6s' }} />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.08),transparent_45%)]" />

        <div className="relative login-fade-up" style={delay(50)}>
          <div className="inline-flex items-center rounded-2xl bg-white px-4 py-2.5 shadow-lg shadow-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TravelMed" className="h-9 w-auto object-contain" />
          </div>
        </div>

        <div className="relative">
          <p className="login-fade-up inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5EEAD4]" style={delay(150)}>
            <span className="h-px w-6 bg-[#5EEAD4]" /> Admin console
          </p>
          <h2 className="login-fade-up mt-5 max-w-lg text-4xl xl:text-5xl font-extrabold leading-[1.08] tracking-tight !text-white" style={delay(250)}>
            Run every part of TravelMed from{' '}
            <span className="bg-gradient-to-r from-[#5EEAD4] to-teal-100 bg-clip-text text-transparent">one secure place.</span>
          </h2>
          <p className="login-fade-up mt-5 max-w-md text-base text-white/70 leading-relaxed" style={delay(350)}>
            Orders, medicines, doctors and analytics — with a full audit trail on every action.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 max-w-xl">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="login-fade-up" style={delay(450 + i * 90)}>
                <div
                  className="login-float rounded-2xl border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md transition-colors hover:bg-white/[0.12]"
                  style={{ animationDelay: `${i * -1.5}s` }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                    <Icon className="h-4.5 w-4.5 text-[#5EEAD4]" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-white">{title}</p>
                  <p className="mt-0.5 text-xs text-white/60 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative login-fade-up flex items-center gap-2 text-xs text-white/50" style={delay(850)}>
          <ShieldCheck className="h-4 w-4 text-[#5EEAD4]" /> Admin actions are recorded in the security audit log
        </p>
      </aside>

      {/* ── Sign-in form ── */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        {/* Mobile background accents */}
        <div aria-hidden className="login-drift absolute -top-32 -right-24 h-80 w-80 rounded-full bg-blue-200/40 blur-[100px] lg:hidden" />
        <div aria-hidden className="login-drift absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-teal-200/40 blur-[100px] lg:hidden" style={{ animationDelay: '-8s' }} />

        <div className="relative w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="login-fade-up mb-8 flex justify-center lg:hidden" style={delay(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.webp" alt="TravelMed" className="h-12 w-auto object-contain" />
          </div>

          <div className="login-fade-up" style={delay(100)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0B4F8C]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Secure admin portal
            </span>
            <h1 className="mt-5 text-3xl sm:text-[34px] font-extrabold tracking-tight text-[#172B4D]">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in with your administrator account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div
                key={attempt}
                role="alert"
                className="login-shake flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="login-fade-up space-y-2" style={delay(200)}>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-[#172B4D]">
                Email address
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@travelmed.org"
                  className={`${inputBase} pr-4 border-slate-200 hover:border-slate-300 focus:border-[#0B4F8C] focus:ring-[#0B4F8C]/10`}
                />
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-[#0B4F8C]" />
              </div>
            </div>

            <div className="login-fade-up space-y-2" style={delay(280)}>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-[#172B4D]">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={detectCaps}
                  onKeyUp={detectCaps}
                  onBlur={() => setCapsLock(false)}
                  placeholder="Enter your password"
                  className={`${inputBase} pr-12 border-slate-200 hover:border-slate-300 focus:border-[#0B4F8C] focus:ring-[#0B4F8C]/10`}
                />
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-[#0B4F8C]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {capsLock && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                  <KeyRound className="h-3.5 w-3.5" /> Caps Lock is on
                </p>
              )}
            </div>

            <div className="login-fade-up pt-1" style={delay(360)}>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#0B4F8C] text-[15px] font-bold text-white shadow-[0_15px_35px_rgba(11,79,140,0.30)] transition-all duration-200 hover:bg-[#083B69] hover:shadow-[0_18px_40px_rgba(11,79,140,0.38)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-90 cursor-pointer"
              >
                {loading && <span aria-hidden className="login-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Verifying…
                  </>
                ) : (
                  <>
                    Sign in securely
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="login-fade-up mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur" style={delay(440)}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Authorised personnel only. Admin actions are recorded in the security audit log.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
