'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/providers/CartProvider';
import {
  Plus, Minus, Trash2, ShieldCheck, Truck, ShoppingBag,
  Check, ChevronRight, Lock, Gift, X, Stethoscope, FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCatalog, usePricing } from '@/shared/providers/ProductProvider';

const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const buildPerks = (consults: number) => [
  ...(consults > 0
    ? [{ icon: Stethoscope, label: `${consults} doctor teleconsultation${consults === 1 ? '' : 's'}`, note: 'Free' }]
    : []),
  { icon: FileText, label: "Signed doctor's prescription", note: 'Included' },
  { icon: Truck, label: 'Free express delivery', note: 'Included' },
];

/** Cart dialog: centred modal on desktop, bottom sheet on mobile. */
export const SlideOverCart: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    getCartTotal,
    getCartCount,
  } = useCart();

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Live admin-managed price/MRP and the store's shipping rule (final totals are confirmed at checkout)
  const pricing = usePricing();
  const catalog = useCatalog();
  const kitFor = (id: string) => catalog.find((k) => k.id === id);
  // MRP per line comes from that kit; never below the price actually charged
  const mrpFor = (id: string, price: number) => Math.max(price, kitFor(id)?.mrp ?? price);
  const subtotal = getCartTotal();
  const shippingThreshold = pricing?.product.commerce.freeShippingThreshold ?? 0;
  const shippingFee = pricing?.product.commerce.shippingFee ?? 0;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : shippingFee;
  const mrpTotal = cartItems.reduce((acc, item) => acc + mrpFor(item.id, item.price) * item.quantity, 0);
  const consults = cartItems.reduce((acc, item) => acc + (kitFor(item.id)?.consultsIncluded ?? 0) * item.quantity, 0);
  const perks = buildPerks(consults);
  const savings = Math.max(0, mrpTotal - subtotal);
  const total = subtotal + shipping;
  const totalItemsCount = getCartCount();

  const close = () => setIsCartOpen(false);

  // Escape to close, lock page scroll, move focus into the dialog
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeButtonRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [isCartOpen, setIsCartOpen]);

  const goToCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const continueShopping = () => {
    setIsCartOpen(false);
    router.push('/buy');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-6 font-sans">
          {/* Backdrop */}
          <motion.div
            aria-hidden
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_40px_120px_rgba(2,6,23,0.35)] sm:max-h-[88vh] sm:max-w-[560px] sm:rounded-[28px]"
          >
            {/* Mobile grab handle */}
            <div aria-hidden className="flex justify-center pt-3 sm:hidden">
              <span className="h-1.5 w-10 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-6 pt-4 pb-4 sm:px-8 sm:pt-7">
              <div>
                <h2 id="cart-title" className="text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
                  Your bag
                  {totalItemsCount > 0 && (
                    <span className="ml-2 align-middle rounded-full bg-primary/5 px-2.5 py-0.5 text-sm font-bold text-primary tabular-nums">
                      {totalItemsCount}
                    </span>
                  )}
                </h2>
                {cartItems.length > 0 && (
                  shipping === 0 ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                      <Check className="h-4 w-4" strokeWidth={3} /> Free express shipping unlocked
                    </p>
                  ) : (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                      <Truck className="h-4 w-4" /> Add {formatINR(shippingThreshold - subtotal)} more for free shipping
                    </p>
                  )
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close bag"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-slate-500 transition hover:bg-slate-200 hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center px-8 pb-10 pt-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5 text-primary">
                  <ShoppingBag className="h-9 w-9" />
                </div>
                <h3 className="mt-6 text-xl font-bold font-heading">Your bag is empty</h3>
                <p className="mt-2 max-w-xs text-sm text-slate-500 leading-relaxed">
                  Secure your healthcare protection before your next adventure.
                </p>
                <button
                  type="button"
                  onClick={continueShopping}
                  className="group mt-7 inline-flex items-center gap-2 rounded-[14px] bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark cursor-pointer"
                >
                  Shop the Travel Med Kit
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6 sm:px-8 space-y-5">
                  <ul className="space-y-3">
                    <AnimatePresence initial={false}>
                      {cartItems.map((item) => (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                          className="flex gap-4 rounded-[20px] border border-border bg-white p-3.5 sm:p-4"
                        >
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-background">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image || '/products.webp'} alt={item.name} className="h-full w-full object-cover" />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="text-[15px] font-bold font-heading leading-snug text-heading">{item.name}</h3>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {(() => {
                                    const kit = kitFor(item.id);
                                    if (!kit) return item.description;
                                    const c = kit.consultsIncluded;
                                    return `${kit.counts.medicines} medicines${c > 0 ? ` · ${c} consult${c === 1 ? '' : 's'}` : ''}`;
                                  })()}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Remove ${item.name}`}
                                className="-mr-1 -mt-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                              <div className="flex items-center rounded-full border border-border bg-background p-0.5 select-none">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  aria-label={item.quantity === 1 ? `Remove ${item.name}` : 'Decrease quantity'}
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-heading transition hover:bg-white hover:shadow-sm cursor-pointer"
                                >
                                  {item.quantity === 1 ? <Trash2 className="h-3.5 w-3.5 text-slate-500" /> : <Minus className="h-3.5 w-3.5" />}
                                </button>
                                <span className="w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-heading transition hover:bg-white hover:shadow-sm cursor-pointer"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="font-heading text-lg font-extrabold text-heading tabular-nums leading-none">
                                  {formatINR(item.price * item.quantity)}
                                </p>
                                {mrpFor(item.id, item.price) > item.price && (
                                  <p className="mt-1 text-xs text-slate-400 line-through tabular-nums">
                                    {formatINR(mrpFor(item.id, item.price) * item.quantity)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* Included */}
                  <div className="rounded-[20px] bg-gradient-to-br from-secondary/10 to-primary/5 p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-heading">
                      <Gift className="h-4 w-4 text-secondary-dark" /> Included free with every kit
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {perks.map(({ icon: Icon, label, note }) => (
                        <li key={label} className="flex items-center justify-between gap-3 text-sm">
                          <span className="flex items-center gap-2.5 text-slate-600">
                            <Icon className="h-4 w-4 shrink-0 text-secondary-dark" />
                            {label}
                          </span>
                          <span className="text-xs font-semibold text-emerald-700">{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Totals */}
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <dt>Subtotal</dt>
                      <dd className="font-semibold text-heading tabular-nums">{formatINR(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <dt>Express shipping</dt>
                      <dd className={shipping === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-heading tabular-nums'}>
                        {shipping === 0 ? 'FREE' : formatINR(shipping)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Sticky footer */}
                <div className="border-t border-border bg-white px-6 pt-5 pb-6 sm:px-8 sm:pb-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Total</p>
                      {savings > 0 && (
                        <p className="mt-0.5 text-xs font-semibold text-emerald-600">You save {formatINR(savings)}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-3xl font-extrabold tracking-tight text-heading tabular-nums leading-none">
                        {formatINR(total)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">Inclusive of all taxes</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                    <button
                      type="button"
                      onClick={goToCheckout}
                      className="group sm:order-2 sm:col-span-3 inline-flex h-14 items-center justify-center gap-2 rounded-[14px] bg-primary px-6 text-[15px] font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark active:scale-[0.99] cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      Checkout
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="sm:order-1 sm:col-span-2 inline-flex h-14 items-center justify-center rounded-[14px] border border-border bg-white px-5 text-sm font-semibold text-heading transition hover:border-primary/40 hover:text-primary cursor-pointer"
                    >
                      Continue shopping
                    </button>
                  </div>

                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure SSL checkout · Payments by Razorpay
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SlideOverCart;
