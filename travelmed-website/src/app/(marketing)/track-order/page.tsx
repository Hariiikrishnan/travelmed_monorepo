'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Truck, ShieldCheck, Check, MapPin, SearchX, Package, Loader2, XCircle, Calendar } from 'lucide-react';
import { Order } from '@/types';
import { PageHero } from '@/shared/ui/PageHero';

export default function TrackOrderPage() {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check if orderId is in URL search parameters
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');

    if (orderIdParam) {
      const trimmedId = orderIdParam.trim();
      setSearchId(trimmedId);
      setSearched(true);
      setIsSearching(true);

      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${trimmedId}`)
        .then(res => res.json())
        .then(body => {
          if (body.success) {
            setOrder(body.data);
          } else {
            setOrder(null);
          }
        })
        .catch(err => {
          console.error(err);
          setOrder(null);
        })
        .finally(() => setIsSearching(false));
      return;
    }

    // Fallback: Initial fetch of the last order if it exists
    const lastOrder = localStorage.getItem('travelmed_last_order');
    if (lastOrder) {
      try {
        const parsed = JSON.parse(lastOrder);
        setOrder(parsed);
        setSearchId(parsed.orderId);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setSearched(true);
    setIsSearching(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${searchId.trim()}`);
      const body = await response.json();
      if (response.ok && body.success) {
        setOrder(body.data);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error('Failed to search order', err);
      setOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const isCancelled = order?.status === 'Cancelled' || order?.status === 'Refunded';

  const getCheckpoints = () => {
    if (!order) return [];

    const isPending = order.status === 'Pending';
    const isProcessing = order.status === 'Processing';
    const isShipped = order.status === 'Shipped' || order.status === 'Out for Delivery';
    const isDelivered = order.status === 'Delivered';

    const orderTime = new Date((order as any).createdAt || Date.now()).toLocaleDateString();

    if (isCancelled) {
      return [
        { name: 'Order Cancelled', desc: 'The order has been cancelled or refunded.', completed: true, active: false, time: 'Cancelled' }
      ];
    }

    return [
      { name: 'Order Sorted & Registered', desc: 'Laboratory received order list. Blister packing initiated.', completed: true, active: isPending, time: orderTime },
      { name: 'Quality Lab Clearance', desc: 'Physician advisory board clears batch contents and checks shelf-life.', completed: !isPending, active: isProcessing, time: !isPending ? 'Cleared' : 'Pending' },
      { name: 'Waterproof Pouch Sealed & Dispatched', desc: 'Shockproof nylon case zipped and handed over to courier.', completed: isShipped || isDelivered, active: isShipped, time: isShipped || isDelivered ? 'Dispatched' : 'Pending' },
      { name: 'Out for Local Delivery', desc: 'Courier routes transit to shipping address.', completed: isDelivered, active: order.status === 'Out for Delivery', time: isDelivered ? 'Delivered' : order.status === 'Out for Delivery' ? 'Today' : 'Pending' }
    ];
  };
  const checkpoints = getCheckpoints();
  const completedCount = checkpoints.filter((c) => c.completed).length;
  const progress = checkpoints.length > 1 ? ((completedCount - 1) / (checkpoints.length - 1)) * 100 : 100;

  const destinationName =
    typeof order?.shippingAddress === 'object'
      ? order?.shippingAddress?.fullName || 'Customer'
      : (order as any)?.shippingFullName || 'Customer';
  const destinationCity = (order as any)?.shippingCity
    ? (order as any).shippingCity
    : typeof order?.shippingAddress === 'object'
    ? order?.shippingAddress?.city
    : '';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <PageHero
        badge="Order Tracking"
        badgeIcon={<Truck className="h-3.5 w-3.5 text-secondary" />}
        title="Track your"
        highlight="delivery"
        description="Enter your order ID (e.g. TM-XXXXXX) to check lab clearance and transit updates."
        size="compact"
        overlap
      >
        <form onSubmit={handleSearch} className="mx-auto flex max-w-lg flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Order ID (e.g. TM-482931)"
              aria-label="Order ID"
              required
              className="w-full rounded-[14px] border border-white/20 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-heading placeholder:text-slate-400 shadow-[0_20px_50px_rgba(0,0,0,0.20)] focus:outline-none focus:ring-4 focus:ring-secondary/30"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-secondary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark disabled:opacity-70 cursor-pointer"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Track
          </button>
        </form>
      </PageHero>

      <section className="relative z-20 -mt-16 md:-mt-20 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-[28px] border border-border bg-white shadow-[0_40px_100px_rgba(11,79,140,0.12)]">
            {isSearching ? (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm font-medium text-slate-500">Looking up your order…</p>
              </div>
            ) : searched && !order ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <SearchX className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold font-heading">No tracking records found</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t find an order matching &ldquo;{searchId}&rdquo;. Please check the ID on the confirmation
                  email we sent you.
                </p>
              </div>
            ) : order ? (
              <>
                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px overflow-hidden rounded-t-[28px] bg-border border-b border-border">
                  <div className="bg-white p-6 sm:p-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Order ID</p>
                    <p className="mt-1 font-heading text-xl font-bold text-heading">{order.orderId}</p>
                    <span
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        isCancelled
                          ? 'border border-rose-200 bg-rose-50 text-rose-700'
                          : 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isCancelled ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {order.status}
                    </span>
                  </div>
                  <div className="bg-white p-6 sm:p-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Estimated arrival</p>
                    <p className="mt-1 flex items-center gap-2 font-heading text-xl font-bold text-primary">
                      <Calendar className="h-5 w-5" /> {order.estimatedDelivery}
                    </p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {destinationName}
                      {destinationCity ? `, ${destinationCity}` : ''}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {!isCancelled && (
                  <div className="px-6 pt-7 sm:px-8">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <ol className="px-6 py-7 sm:px-8">
                  {checkpoints.map((cp, idx) => {
                    const isLast = idx === checkpoints.length - 1;
                    return (
                      <li key={cp.name} className="relative flex gap-4 pb-7 last:pb-0">
                        {!isLast && (
                          <span
                            aria-hidden
                            className={`absolute left-[17px] top-10 bottom-1 w-0.5 rounded-full ${cp.completed ? 'bg-secondary' : 'bg-slate-200'}`}
                          />
                        )}
                        <span
                          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isCancelled
                              ? 'bg-rose-500 text-white'
                              : cp.active
                              ? 'bg-primary text-white ring-4 ring-primary/15'
                              : cp.completed
                              ? 'bg-secondary text-white'
                              : 'border-2 border-slate-200 bg-white text-slate-300'
                          }`}
                        >
                          {isCancelled ? (
                            <XCircle className="h-4.5 w-4.5" />
                          ) : cp.completed && !cp.active ? (
                            <Check className="h-4 w-4" strokeWidth={3} />
                          ) : (
                            <Package className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1 pt-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                            <h3 className={`text-sm sm:text-[15px] font-bold ${cp.active ? 'text-primary' : cp.completed ? 'text-heading' : 'text-slate-400'}`}>
                              {cp.name}
                            </h3>
                            <span className="text-xs font-medium text-slate-400">{cp.time}</span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500 leading-relaxed">{cp.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <p className="flex items-center justify-center gap-1.5 border-t border-border px-6 py-5 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-secondary-dark" /> Certified shipping container seal verified
                </p>
              </>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold font-heading">Track any order</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Enter your order ID above to see live status. Haven&apos;t ordered yet?
                </p>
                <Link
                  href="/buy"
                  className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  Shop the Kit
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
