'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/shared/providers/CartProvider';
import { Check, Truck, Calendar, MapPin, ArrowRight, ShieldCheck, Hash, ShoppingBag, Loader2 } from 'lucide-react';
import { Order } from '@/types';
import { analytics, kitItem } from '@/shared/analytics/gtag';

export default function SuccessPage() {
  const { currentOrder } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fallback to localStorage if state is cleared on page refresh
    if (currentOrder) {
      setOrder(currentOrder);
    } else {
      const savedOrder = localStorage.getItem('travelmed_last_order');
      if (savedOrder) {
        try {
          setOrder(JSON.parse(savedOrder));
        } catch (e) {
          console.error(e);
        }
      }
    }
    setIsLoading(false);
  }, [currentOrder]);

  // GA4: purchase — once per order, even if the page is refreshed
  useEffect(() => {
    if (!order?.orderId) return;
    const key = `travelmed_ga_purchase_${order.orderId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      /* storage unavailable — still send once for this render */
    }
    analytics.purchase({
      transactionId: order.orderId,
      value: order.total ?? 0,
      shipping: order.shippingCost ?? 0,
      items: order.items.map((i) => ({ ...kitItem(i.quantity, i.price), item_id: i.id, item_name: i.name })),
    });
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background py-24 font-sans">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-slate-500">Securing your order receipt…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-24 font-sans">
        <div className="max-w-md rounded-[28px] border border-border bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold font-heading">No order found</h1>
          <p className="mt-2 text-sm text-slate-500">Build your kit first and complete checkout.</p>
          <Link
            href="/buy"
            className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            Go to Store
          </Link>
        </div>
      </div>
    );
  }

  const fullName =
    typeof order.shippingAddress === 'object'
      ? order.shippingAddress?.fullName || 'Customer'
      : (order as any).shippingFullName || 'Customer';

  const addressLine = [
    typeof order.shippingAddress === 'string' ? order.shippingAddress : order.shippingAddress?.address,
    (order as any).shippingCity || (typeof order.shippingAddress === 'object' ? order.shippingAddress?.city : ''),
    (order as any).shippingZipCode || (typeof order.shippingAddress === 'object' ? order.shippingAddress?.zipCode : ''),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="flex-1 bg-background font-sans">
      {/* Celebration header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        <div aria-hidden className="absolute -top-32 right-[-10%] h-[380px] w-[380px] rounded-full bg-secondary/30 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-32 left-[-10%] h-[340px] w-[340px] rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-16 pb-36 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-[0_0_0_12px_rgba(20,184,166,0.15),0_20px_50px_rgba(20,184,166,0.4)]"
          >
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Order placed successfully</p>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight !text-white">
              Your protection is on its way!
            </h1>
            <p className="mt-4 text-base text-white/70 max-w-md mx-auto leading-relaxed">
              We&apos;ve received your order and are preparing your colour-coded medical pouch.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 -mt-24 pb-20 md:pb-28"
      >
        <div className="rounded-[28px] border border-border bg-white shadow-[0_40px_100px_rgba(11,79,140,0.12)]">
          {/* Key facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-t-[28px] bg-border border-b border-border">
            {[
              { icon: Hash, label: 'Order ID', value: order.orderId },
              { icon: Calendar, label: 'Est. delivery', value: order.estimatedDelivery },
              { icon: Truck, label: 'Tracking code', value: order.trackingNumber },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white p-5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Icon className="h-3.5 w-3.5" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em]">{label}</p>
                </div>
                <p className="mt-1.5 truncate text-sm font-bold text-heading select-all">{value}</p>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 space-y-7">
            {/* Address */}
            <div className="flex items-start gap-3.5 rounded-2xl bg-background/70 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Shipping to</p>
                <p className="mt-0.5 text-sm font-bold text-heading">{fullName}</p>
                {addressLine && <p className="text-sm text-slate-500">{addressLine}</p>}
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Order summary</p>
              <ul className="mt-3 divide-y divide-border">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-primary/5 px-1.5 text-xs font-bold text-primary">
                        {item.quantity}×
                      </span>
                      <span className="truncate font-medium text-heading">{item.name}</span>
                    </span>
                    <span className="font-semibold text-heading tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-3 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-slate-500">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">₹{order.subtotal?.toLocaleString('en-IN')}</dd>
                </div>
                <div className="flex justify-between text-slate-500">
                  <dt>Shipping</dt>
                  <dd className={order.shippingCost === 0 ? 'font-semibold text-emerald-600' : 'tabular-nums'}>
                    {order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost?.toLocaleString('en-IN')}`}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-3">
                  <dt className="font-bold text-heading">Total paid</dt>
                  <dd className="font-heading text-2xl font-extrabold text-primary tabular-nums">
                    ₹{order.total?.toLocaleString('en-IN')}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-[14px] border border-border bg-white px-6 py-3.5 text-sm font-semibold text-heading transition hover:border-primary/40 hover:text-primary"
              >
                Back to Home
              </Link>
              <Link
                href="/track-order"
                className="group inline-flex items-center justify-center gap-2 rounded-[14px] bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
              >
                Track Your Order
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <p className="flex items-center justify-center gap-1.5 border-t border-border px-6 py-5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-secondary-dark" /> Secure order · CDSCO-regulated medicines
          </p>
        </div>
      </motion.div>
    </div>
  );
}
