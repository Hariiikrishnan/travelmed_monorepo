'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Drawer } from '@/shared/ui/Drawer';
import { useCart } from '@/shared/providers/CartProvider';
import { Button } from '@/shared/ui/Button';
import { 
  Plus, Minus, Trash2, ShieldCheck, Truck, ShoppingBag, 
  Sparkles, Check, ChevronRight, Lock, HeartPulse, FileText, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomSelect } from '@/shared/ui/CustomSelect';

const COUNTRY_OPTIONS = [
  { value: 'India', label: 'India', code: 'IN' },
  { value: 'Singapore', label: 'Singapore', code: 'SG' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates', code: 'AE' },
  { value: 'United Kingdom', label: 'United Kingdom', code: 'GB' },
  { value: 'United States', label: 'United States', code: 'US' },
  { value: 'Australia', label: 'Australia', code: 'AU' },
  { value: 'Canada', label: 'Canada', code: 'CA' },
];

export const SlideOverCart: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    getCartTotal,
    placeOrder,
    getCartCount
  } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    country: 'India',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shippingThreshold = 2000;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;
  const originalSubtotal = cartItems.reduce((acc, item) => acc + 4500 * item.quantity, 0);
  const totalSavings = originalSubtotal > subtotal ? originalSubtotal - subtotal : 1600;
  const total = subtotal + shipping;
  const totalItemsCount = getCartCount();

  // Progress for free shipping bar
  const shippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.address || !form.city || !form.zipCode) return;

    setLoading(true);
    setTimeout(() => {
      placeOrder(form);
      setLoading(false);
      setCheckoutMode(false);
      setIsCartOpen(false);
      
      setForm({
        fullName: '',
        address: '',
        city: '',
        country: 'India',
        zipCode: ''
      });
      
      router.push('/success');
    }, 1200);
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => {
        setIsCartOpen(false);
        setCheckoutMode(false);
      }}
      title={checkoutMode ? "Shipping Details" : `Shopping Bag ${totalItemsCount > 0 ? `(${totalItemsCount})` : ''}`}
      size="md"
    >
      {/* Free Shipping Progress Banner */}
      {cartItems.length > 0 && !checkoutMode && (
        <div className="bg-slate-50 dark:bg-neutral-850 p-3.5 rounded-2xl border border-slate-200/80 dark:border-neutral-800 space-y-2 select-none">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-800 dark:text-neutral-200">
              <Truck className="h-4 w-4 text-emerald-500 shrink-0" />
              {subtotal >= shippingThreshold ? (
                <span className="text-emerald-600 dark:text-emerald-400">🎉 You've unlocked FREE Express Shipping!</span>
              ) : (
                <span>Add ₹{(shippingThreshold - subtotal).toLocaleString('en-IN')} more for <strong className="text-primary">FREE Shipping</strong></span>
              )}
            </span>
            <span className="text-[11px] text-slate-400 font-extrabold">{Math.round(shippingProgress)}%</span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${shippingProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!checkoutMode ? (
          /* Cart items list */
          <motion.div
            key="cart"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full justify-between space-y-6"
          >
            {cartItems.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
                <div className="relative">
                  <div className="p-6 bg-teal-50 dark:bg-teal-950/30 rounded-3xl text-primary border border-teal-100 dark:border-teal-900/40">
                    <ShoppingBag className="h-12 w-12 text-primary animate-pulse" />
                  </div>
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg font-black font-heading text-slate-900 dark:text-white">Your bag is empty</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-[260px] leading-relaxed mx-auto">
                    Secure your global healthcare protection before embarking on your next travel adventure.
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="px-6 py-3 text-xs font-bold rounded-2xl shadow-md bg-secondary hover:bg-secondary-dark text-white cursor-pointer"
                  onClick={() => setIsCartOpen(false)}
                >
                  Explore Travel Med Kits
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cart items cards */}
                <div className="space-y-4 max-h-[52vh] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-4 border border-slate-200/80 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-850 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative overflow-hidden group"
                    >
                      {/* Top Tag & Delete */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-teal-50 dark:bg-teal-950/40 text-primary border border-teal-100 dark:border-teal-900/50 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            150+ Medicines • 2 Consults
                          </span>
                          {item.options?.size && (
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                              SIZE: {item.options.size}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition active:scale-90"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Content Row */}
                      <div className="flex gap-3.5 items-start">
                        {/* Image Thumbnail */}
                        <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200/70 dark:border-neutral-700/80 overflow-hidden shrink-0 relative">
                          <img
                            src="/products.webp"
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title & Description */}
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight font-heading">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug line-clamp-2">
                            {item.description}
                          </p>

                          {/* Price & Savings Pill */}
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-base font-black text-secondary">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs line-through text-slate-400 font-medium">
                              ₹{(4500 * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                              35% OFF
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controller Strip */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800 pt-3">
                        <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Quantity</span>

                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 border border-slate-200/70 dark:border-neutral-700 rounded-xl p-1 select-none">
                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-lg bg-white dark:bg-neutral-700 text-slate-600 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-xs cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </motion.button>

                          <span className="text-xs font-black w-6 text-center text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-white dark:bg-neutral-700 text-slate-600 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Included Perks Strip */}
                <div className="bg-gradient-to-br from-blue-50/70 to-teal-50/70 dark:from-neutral-850 dark:to-neutral-900 p-4 rounded-2xl border border-blue-100 dark:border-neutral-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-neutral-200">
                    <Gift className="h-4 w-4 text-primary shrink-0" />
                    <span>Included FREE in Your Package</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] font-semibold text-slate-600 dark:text-neutral-350">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> 2 Doctor Teleconsultations
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹1,500 Value FREE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> Signed Doctor's Prescription
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-500" /> TSA Liquid-Free Carry-On Pouch
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Included</span>
                    </div>
                  </div>
                </div>

                {/* Order Summaries & Checkout CTA */}
                <div className="border-t border-slate-200/80 dark:border-neutral-800 pt-5 space-y-4">
                  <div className="space-y-2 text-xs md:text-sm font-medium">
                    <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                      <span>Express Shipping</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                      <span>Instant Discount</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        -₹{totalSavings.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-neutral-800 pt-2.5">
                      <span>Total Amount</span>
                      <span className="text-secondary text-lg font-black">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Primary Checkout Button */}
                  <div className="space-y-3 pt-1">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/checkout');
                      }}
                      className="w-full py-4 px-6 bg-secondary hover:bg-secondary-dark text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all flex items-center justify-between cursor-pointer group uppercase tracking-wide select-none"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        <span>Proceed to Checkout</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>₹{total.toLocaleString('en-IN')}</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>

                    {/* Trust Footnote */}
                    <div className="flex flex-col items-center gap-1.5 text-[10px] text-slate-400 dark:text-neutral-500 font-semibold tracking-wider uppercase text-center">
                      <div className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>256-Bit SSL Encrypted &amp; TSA Compliant Checkout</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Drawer Checkout Form */
          <motion.form
            key="checkout"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col h-full justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Sunshine Heights, MG Road"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="400001"
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <CustomSelect
                label="Country"
                options={COUNTRY_OPTIONS}
                value={form.country}
                onChange={(val) => setForm({ ...form, country: val })}
              />
            </div>

            <div className="border-t border-slate-200 dark:border-neutral-800 pt-6 space-y-4">
              <div className="flex justify-between text-base font-black">
                <span>Total Amount</span>
                <span className="text-secondary text-lg">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" type="button" onClick={() => setCheckoutMode(false)} className="flex-1 cursor-pointer">
                  Back
                </Button>
                <Button variant="primary" type="submit" disabled={loading} className="flex-1 cursor-pointer select-none bg-secondary hover:bg-secondary-dark">
                  {loading ? 'Processing Order...' : 'Complete Order'}
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Drawer>
  );
};

export default SlideOverCart;
