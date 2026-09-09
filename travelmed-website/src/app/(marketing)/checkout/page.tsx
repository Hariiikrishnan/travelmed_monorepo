'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/providers/CartProvider';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { 
  Plus, Minus, Trash2, ShieldCheck, Truck, Lock, ArrowLeft,
  Sparkles, ShoppingBag, User, Phone, MapPin, Building, Globe,
  CheckCircle2, Gift, CreditCard, ChevronRight, Check
} from 'lucide-react';
import Link from 'next/link';
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

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeItem,
    getCartTotal,
    placeOrder
  } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    country: 'India',
    zipCode: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  let subtotal = getCartTotal();
  
  if (appliedCoupon) {
    if (appliedCoupon.type === 'Percentage') {
      subtotal = subtotal - ((subtotal * appliedCoupon.discount) / 100);
    } else {
      subtotal = subtotal - appliedCoupon.discount;
    }
    if (subtotal < 0) subtotal = 0;
  }

  const shippingThreshold = 2000;
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;
  const originalSubtotal = cartItems.reduce((acc, item) => acc + 4500 * item.quantity, 0);
  const totalSavings = originalSubtotal > subtotal ? originalSubtotal - subtotal : 1600;
  const total = subtotal + shipping;

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons/validate/${couponCode.trim()}`);
      const body = await res.json();
      if (res.ok) {
        setAppliedCoupon(body.data);
      } else {
        setCouponError(body.message);
        setAppliedCoupon(null);
      }
    } catch (e) {
      setCouponError('Failed to validate coupon');
      setAppliedCoupon(null);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('travelmed_client_name');
    if (name) {
      setForm(prev => ({
        ...prev,
        fullName: prev.fullName || name
      }));
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.address || !form.city || !form.zipCode) return;

    setLoading(true);
    try {
      // 1. Create Razorpay Order
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: cartItems.map(item => ({...item, quantity: item.quantity })), 
          couponCode: appliedCoupon?.code 
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || 'Failed to initialize payment gateway.');
      }

      const rzpOrder = body.data;

      // 2. Dummy Payment Handling
      if (rzpOrder.isDummy) {
        const paymentId = 'pay_dummy_' + Math.random().toString(36).substring(2, 9);
        await placeOrder(form, { paymentId, paymentStatus: 'Paid' }, appliedCoupon?.code);
        
        setForm({
          fullName: '',
          address: '',
          city: '',
          country: 'India',
          zipCode: '',
          phone: ''
        });
        router.push('/success');
        return;
      }

      // 3. Real Payment Handling (Razorpay Modal)
      const options = {
        key: rzpOrder.key || 'rzp_test_dummy',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'TravelMed',
        description: 'Secure Kit Purchase',
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          try {
            setLoading(true);
            
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyBody = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyBody.message || 'Payment signature verification failed.');
            }

            await placeOrder(form, {
              paymentId: response.razorpay_payment_id,
              paymentStatus: 'Paid'
            }, appliedCoupon?.code);

            setForm({
              fullName: '',
              address: '',
              city: '',
              country: 'India',
              zipCode: '',
              phone: ''
            });
            router.push('/success');
          } catch (err) {
            console.error(err);
            alert('Failed to verify payment: ' + (err instanceof Error ? err.message : 'Please check connection.'));
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: form.fullName,
        },
        theme: {
          color: '#0B4F8C'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to initialize payment.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/80 via-white to-slate-50 dark:from-neutral-950 dark:to-neutral-900 font-sans justify-center items-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-neutral-800"
        >
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/40 text-primary rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-teal-100 dark:border-teal-900/50">
            <ShoppingBag className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
            Let's add the Travel Med Kit to your bag to secure your travel healthcare companion.
          </p>
          <Link href="/buy">
            <Button variant="primary" size="lg" className="shadow-lg shadow-primary/20 px-8 py-3.5 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-2xl cursor-pointer">
              Go to Store
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#EFF6FF] via-white to-[#F8FAFC] dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 pb-20 select-none">
      
      {/* Top Ambient Glow backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-400/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex-1 relative z-10">
        
        {/* Navigation Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/buy" className="hover:text-primary transition-colors">Buy</Link>
            <span>/</span>
            <span className="text-primary font-black">Secure Checkout</span>
          </div>

          <Link href="/buy" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-neutral-400 hover:text-primary transition-colors group bg-white/80 dark:bg-neutral-900/80 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-neutral-800 shadow-xs">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Store</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Shipping Information Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 space-y-6 relative z-20"
          >
            
            <div className="p-6 sm:p-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-neutral-800 shadow-[0_12px_40px_rgba(15,23,42,0.06)] rounded-3xl space-y-6 relative z-30">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-5">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-primary border border-teal-100 dark:border-teal-900/60 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                      Shipping Information
                    </h2>
                    <p className="text-[11px] text-slate-400 dark:text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                      Deliver Your Travel Med Kit
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Express Dispatch Ready
                </span>
              </div>

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number (For Courier Updates)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Flat / Apartment / House No."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                {/* City & Zip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-primary" /> City / Town
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
                      Pincode / ZIP
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400001"
                      value={form.zipCode}
                      onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Country */}
                <CustomSelect
                  label="Country"
                  options={COUNTRY_OPTIONS}
                  value={form.country}
                  onChange={(val) => setForm({ ...form, country: val })}
                />

                {/* Submit Action Strip */}
                <div className="pt-5 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col items-center gap-3 space-y-1">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-8 bg-secondary hover:bg-secondary-dark text-white font-extrabold rounded-2xl shadow-lg shadow-secondary/20 transition-all cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-60"
                  >
                    <span>{loading ? 'Processing...' : 'Pay & Complete Order'}</span>
                    <ChevronRight className="h-4.5 w-4.5" />
                  </motion.button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-bold pt-1">
                    <Lock className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>256-Bit SSL Encrypted &amp; Secure Checkout</span>
                  </div>
                </div>

              </form>
            </div>

            {/* Quality Seals Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-primary shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">FREE Express Air Delivery</h4>
                  <p className="text-[11px] text-slate-400">Dispatch within 24 Hours with live tracking.</p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-slate-200/80 dark:border-neutral-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-primary shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">CDSCO Regulated Quality</h4>
                  <p className="text-[11px] text-slate-400">100% genuine OTC medicines &amp; signed Rx.</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            <div className="p-6 sm:p-7 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-neutral-800 shadow-[0_16px_48px_rgba(15,23,42,0.08)] rounded-3xl space-y-6 select-none">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                    Order Summary
                  </h3>
                </div>

                <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} {cartItems.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              
              {/* Items List Cards */}
              <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="flex gap-4 items-center bg-gradient-to-br from-slate-50/90 to-white dark:from-neutral-850 dark:to-neutral-900 border border-slate-200/80 dark:border-neutral-700/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 bg-white dark:bg-neutral-950 rounded-xl border border-slate-200/80 dark:border-neutral-700 overflow-hidden shrink-0 shadow-inner">
                      <img src="/products.webp" alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate leading-snug font-heading">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                        {item.options?.size || 'Solo'} Package
                      </p>
                      
                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-full px-2 py-0.5 select-none shadow-2xs">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-90 p-0.5"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <span className="text-xs font-black w-5 text-center text-slate-900 dark:text-white">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-90 p-0.5"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                        </div>

                        {/* Cost */}
                        <span className="text-sm font-black text-secondary">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Promo Inclusions Glass Box */}
              <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/90 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200/80 dark:border-emerald-800/70 rounded-2xl p-4 select-none flex items-center gap-3.5 shadow-xs">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                  <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-extrabold text-emerald-950 dark:text-emerald-300 block leading-tight">
                    Includes 2 FREE Doctor Consultations
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Plus signed Doctor's Rx &amp; Airport Customs Letter
                  </span>
                </div>
              </div>

              {/* Promo Code Coupon Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10.5px] font-extrabold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="ENTER CODE" 
                    value={couponCode}
                    onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:border-primary transition"
                  />
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyCoupon} 
                    type="button" 
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Apply
                  </motion.button>
                </div>
                {couponError && <p className="text-rose-500 text-[10px] font-bold pt-0.5">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-emerald-600 text-[11px] font-bold flex items-center gap-1 pt-0.5">
                    <Check className="h-3.5 w-3.5" /> Coupon '{appliedCoupon.code}' applied (-{appliedCoupon.discount}{appliedCoupon.type === 'Percentage' ? '%' : '₹'})
                  </p>
                )}
              </div>

              {/* Financial Calculations Block */}
              <div className="border-t border-slate-100 dark:border-neutral-800 pt-4 space-y-3 text-xs font-medium">
                <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span>Express Air Shipping</span>
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-neutral-400">
                  <span>Instant Package Discount</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    -₹{totalSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="flex justify-between text-base font-black border-t border-slate-100 dark:border-neutral-800 pt-3 text-slate-900 dark:text-white items-baseline">
                  <span>Total Amount</span>
                  <span className="text-secondary text-2xl font-black">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

          </motion.div>

        </div>

      </main>

    </div>
  );
}
