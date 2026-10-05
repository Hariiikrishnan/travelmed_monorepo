'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/providers/CartProvider';
import {
  Plus, Minus, Trash2, ShieldCheck, Truck, Lock, ArrowLeft,
  Sparkles, ShoppingBag, User, Phone, MapPin, Building, Globe,
  CheckCircle2, Gift, ChevronRight, Check, Loader2, Tag, Mail, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { analytics, kitItem } from '@/shared/analytics/gtag';
import type { Order } from '@/types';

const inputClass =
  'w-full rounded-[14px] border border-border bg-white px-4 py-3.5 text-sm font-medium text-heading placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10';

const COUNTRY_OPTIONS = [
  { value: 'India', label: 'India', code: 'IN' },
  { value: 'Singapore', label: 'Singapore', code: 'SG' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates', code: 'AE' },
  { value: 'United Kingdom', label: 'United Kingdom', code: 'GB' },
  { value: 'United States', label: 'United States', code: 'US' },
  { value: 'Australia', label: 'Australia', code: 'AU' },
  { value: 'Canada', label: 'Canada', code: 'CA' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Quote {
  subtotal: number;
  discount: number;
  coupon: { code: string; type: string; value: number } | null;
  shippingCost: number;
  total: number;
  savings: number;
  freeShippingThreshold: number;
  /** Free teleconsultations this order will include (sum of each kit's consults × quantity) */
  consultsIncluded: number;
}

const EMPTY_FORM = { fullName: '', email: '', address: '', city: '', country: 'India', zipCode: '', phone: '' };

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeItem, getCartTotal, completeOrder } = useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState('');

  // Server-calculated totals: exactly what Razorpay will charge (admin price, coupon, shipping)
  const itemsKey = cartItems.map((i) => `${i.id}:${i.quantity}`).join('|');
  const fetchQuote = useCallback(
    async (coupon: string | null) => {
      if (cartItems.length === 0) return null;
      const res = await fetch(`${API_URL}/api/orders/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
          couponCode: coupon || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Could not calculate your total.');
      return body.data as Quote;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemsKey]
  );

  useEffect(() => {
    let cancelled = false;
    fetchQuote(activeCoupon)
      .then((q) => {
        if (cancelled || !q) return;
        setQuote(q);
        setQuoteError('');
      })
      .catch((err: Error) => {
        if (cancelled) return;
        if (activeCoupon) {
          // Coupon became invalid (e.g. deactivated) — drop it and re-quote without it
          setActiveCoupon(null);
          setCouponError(err.message);
        } else {
          setQuote(null);
          setQuoteError(err.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fetchQuote, activeCoupon]);

  const cartTotal = quote?.subtotal ?? getCartTotal();
  const couponDiscount = quote?.discount ?? 0;
  const shipping = quote?.shippingCost ?? 0;
  const total = quote?.total ?? cartTotal;
  const totalSavings = quote?.savings ?? 0;
  const appliedCoupon = quote?.coupon ? { code: quote.coupon.code, discount: quote.coupon.value, type: quote.coupon.type } : null;

  const handleApplyCoupon = async () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    try {
      const q = await fetchQuote(code);
      if (q) {
        setQuote(q);
        setActiveCoupon(code);
      }
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : 'Failed to validate coupon');
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('travelmed_client_name');
    if (name) {
      setForm((prev) => ({ ...prev, fullName: prev.fullName || name }));
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  // GA4: begin_checkout once per visit when the bag has items
  const checkoutTracked = React.useRef(false);
  useEffect(() => {
    if (checkoutTracked.current || cartItems.length === 0) return;
    checkoutTracked.current = true;
    analytics.beginCheckout(cartItems.map((i) => ({ ...kitItem(i.quantity, i.price), item_id: i.id, item_name: i.name })));
  }, [cartItems]);

  const finish = (order: Order) => {
    completeOrder(order);
    setForm(EMPTY_FORM);
    router.push('/success');
  };

  const verify = async (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature?: string }) => {
    const res = await fetch(`${API_URL}/api/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || 'Payment verification failed.');
    return body.data as Order;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.address || !form.city || !form.zipCode || !form.phone) return;

    setLoading(true);
    setPayError('');
    try {
      // 1. Server prices the bag, creates a pending order and the Razorpay order
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
          couponCode: activeCoupon || undefined,
          shippingAddress: form,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to start payment.');
      const rzpOrder = body.data;

      // 2a. Development only: no gateway keys configured
      if (rzpOrder.isDummy) {
        const order = await verify({
          razorpay_order_id: rzpOrder.id,
          razorpay_payment_id: 'pay_dummy_' + Math.random().toString(36).slice(2, 9),
        });
        finish(order);
        return;
      }

      // 2b. Real payment via Razorpay Checkout
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        throw new Error('Payment window failed to load. Please check your connection and try again.');
      }
      const rzp = new (window as any).Razorpay({
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'TravelMed',
        description: `Order ${rzpOrder.orderId}`,
        order_id: rzpOrder.id,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: '#0B4F8C' },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            setLoading(true);
            finish(await verify(response));
          } catch (err) {
            setPayError(
              (err instanceof Error ? err.message : 'Payment verification failed.') +
                ` If money was debited, contact support with order ${rzpOrder.orderId}.`
            );
            setLoading(false);
          }
        },
      });
      rzp.on('payment.failed', (resp: { error?: { description?: string } }) => {
        setPayError(resp?.error?.description || 'Payment failed. No money was taken — please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Failed to start payment.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-24 font-sans">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md rounded-[28px] border border-border bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold font-heading">Your bag is empty</h1>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Add the Travel Med Kit to your bag to secure your travel healthcare companion.
          </p>
          <Link
            href="/buy"
            className="group mt-7 inline-flex items-center gap-2 rounded-[14px] bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
          >
            Go to Store
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const steps = [
    { label: 'Bag', done: true },
    { label: 'Shipping', done: false, active: true },
    { label: 'Payment', done: false },
  ];

  return (
    <div className="relative flex flex-col min-h-screen font-sans bg-background pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#E6F0FC] to-transparent" />

      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 md:mb-10">
          <div>
            <Link
              href="/buy"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to store
            </Link>
            <h1 className="mt-3 flex items-center gap-2.5 text-3xl md:text-4xl font-extrabold font-heading tracking-tight">
              Secure checkout <Lock className="h-6 w-6 text-secondary-dark" />
            </h1>
          </div>

          {/* Stepper */}
          <ol className="flex items-center gap-2 text-sm">
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <li className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      s.done
                        ? 'bg-secondary text-white'
                        : s.active
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'border border-border bg-white text-slate-400'
                    }`}
                  >
                    {s.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`font-semibold ${s.done || s.active ? 'text-heading' : 'text-slate-400'}`}>{s.label}</span>
                </li>
                {i < steps.length - 1 && <span aria-hidden className="h-px w-6 sm:w-10 bg-border" />}
              </React.Fragment>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Shipping form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 space-y-5 relative z-20"
          >
            <div className="relative z-30 rounded-[28px] border border-border bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-heading">Shipping information</h2>
                  <p className="mt-1 text-sm text-slate-500">Where should we deliver your Travel Med Kit?</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Dispatch in 24 hrs
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="co-name" className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                      <User className="h-3.5 w-3.5 text-slate-400" /> Full name
                    </label>
                    <input
                      id="co-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="co-phone" className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone number
                    </label>
                    <input
                      id="co-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="e.g. +91 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="co-email" className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> Email address
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="For your order confirmation & invoice"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="co-address" className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> Delivery address
                  </label>
                  <input
                    id="co-address"
                    type="text"
                    required
                    autoComplete="street-address"
                    placeholder="Street address, flat / apartment / house no."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="co-city" className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                      <Building className="h-3.5 w-3.5 text-slate-400" /> City / town
                    </label>
                    <input
                      id="co-city"
                      type="text"
                      required
                      autoComplete="address-level2"
                      placeholder="e.g. Mumbai"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="co-zip" className="block text-sm font-semibold text-heading">Pincode / ZIP</label>
                    <input
                      id="co-zip"
                      type="text"
                      required
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="e.g. 400001"
                      value={form.zipCode}
                      onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                    <Globe className="h-3.5 w-3.5 text-slate-400" /> Country
                  </p>
                  <CustomSelect
                    options={COUNTRY_OPTIONS}
                    value={form.country}
                    onChange={(val) => setForm({ ...form, country: val })}
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <div className="mb-4 flex items-baseline justify-between lg:hidden">
                    <span className="text-sm font-semibold text-slate-500">Total to pay</span>
                    <span className="font-heading text-2xl font-extrabold text-heading tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  {(payError || quoteError) && (
                    <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {payError || quoteError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !quote}
                    className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-8 text-[15px] font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Pay ₹{total.toLocaleString('en-IN')} &amp; Place Order
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    256-bit SSL encrypted · Payments secured by Razorpay
                  </p>
                </div>
              </form>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Truck, title: 'Free express delivery', desc: 'Dispatched within 24 hours with tracking.' },
                { icon: ShieldCheck, title: 'CDSCO regulated quality', desc: '100% genuine medicines & signed Rx.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3.5 rounded-2xl border border-border bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 lg:sticky lg:top-24"
          >
            <div className="rounded-[28px] border border-border bg-white shadow-[0_30px_80px_rgba(11,79,140,0.10)]">
              <div className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-7">
                <h2 className="text-lg font-bold font-heading">Order summary</h2>
                <span className="rounded-full bg-primary/5 px-3 py-1 text-xs font-bold text-primary tabular-nums">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="px-6 py-5 sm:px-7 space-y-5">
                {/* Items */}
                <ul className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-background">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/products.webp" alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-heading">{item.name}</p>
                              <p className="text-xs text-slate-500">{item.options?.size || 'Solo'} package</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-border bg-background p-0.5 select-none">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-heading transition hover:bg-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 items-center justify-center rounded-full text-heading transition hover:bg-white cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-heading tabular-nums">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Included */}
                <div className="flex items-center gap-3.5 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-white shadow-md shadow-secondary/20">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading">
                      {quote && quote.consultsIncluded > 0
                        ? `${quote.consultsIncluded} free doctor consultation${quote.consultsIncluded === 1 ? '' : 's'} included`
                        : quote
                        ? 'Doctor-curated kit'
                        : 'Free doctor consultations included'}
                    </p>
                    <p className="text-xs text-slate-600">Plus signed doctor&apos;s Rx &amp; airport customs letter</p>
                  </div>
                </div>

                {/* Coupon */}
                <div>
                  <label htmlFor="co-coupon" className="text-sm font-semibold text-heading">Promo code</label>
                  <div className="mt-2 flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="co-coupon"
                        type="text"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                        className="w-full rounded-[12px] border border-border bg-white py-3 pl-10 pr-3 text-sm font-semibold uppercase text-heading placeholder:normal-case placeholder:font-medium placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      type="button"
                      className="rounded-[12px] border border-primary/20 bg-primary/5 px-5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="mt-2 text-xs font-medium text-rose-600">{couponError}</p>}
                  {appliedCoupon && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Coupon &lsquo;{appliedCoupon.code}&rsquo; applied (-{appliedCoupon.discount}{appliedCoupon.type === 'Percentage' ? '%' : '₹'})
                    </p>
                  )}
                </div>

                {/* Totals */}
                <dl className="space-y-3 border-t border-border pt-5 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-heading tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</dd>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <dt>Coupon ({appliedCoupon?.code})</dt>
                      <dd className="font-semibold text-emerald-600 tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <dt>Express shipping</dt>
                    <dd className={shipping === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-heading tabular-nums'}>
                      {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-border pt-4">
                    <dt className="text-base font-bold text-heading">Total</dt>
                    <dd className="text-right">
                      <span className="block font-heading text-3xl font-extrabold tracking-tight text-heading tabular-nums">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500">Inclusive of all taxes</span>
                    </dd>
                  </div>
                </dl>

                {totalSavings > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    You&apos;re saving ₹{Math.round(totalSavings).toLocaleString('en-IN')} on this order
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
