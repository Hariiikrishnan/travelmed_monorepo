'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/providers/CartProvider';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Rating } from '@/shared/ui/Rating';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ArrowLeft,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

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

  const shipping = subtotal >= 2000 ? 0 : 150;
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

  // Check auth and load Razorpay Checkout script on mount
  useEffect(() => {
    const token = localStorage.getItem('travelmed_client_token');
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }

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
      // 1. Ask backend to create a Razorpay Order
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: total }),
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.message || 'Failed to initialize payment gateway.');
      }

      const rzpOrder = body.data;

      // 2. Dummy Payment Handling
      if (rzpOrder.isDummy) {
        const paymentId = 'pay_dummy_' + Math.random().toString(36).substring(2, 9);
        await placeOrder(form, { paymentId, paymentStatus: 'Paid' });
        
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

      // 3. Real Payment Handling (Razorpay Pop-up Modal)
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
            
            // Verify payment signature
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

            // Save order to DB
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
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#DCEBFF] via-white to-[#EEF6FF] bg-fixed dark:bg-neutral-950 font-sans justify-center items-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 bg-blue-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-primary shadow-xs">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white font-heading">Your Shopping Bag is Empty</h2>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            Let's add the Travel Med Kit to your bag to secure your travel healthcare companion.
          </p>
          <Link href="/buy">
            <Button variant="primary" size="lg" className="shadow-md shadow-primary/10 mt-4">
              Go to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#DCEBFF] via-white to-[#EEF6FF] bg-fixed dark:bg-neutral-950 pb-16">
      
      {/* Checkout Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 flex-1">
        
        {/* Navigation Breadcrumb & Back link */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/buy" className="hover:text-primary transition-colors">Buy</Link>
            <span>/</span>
            <span className="text-neutral-500">Secure Checkout</span>
          </div>

          <Link href="/buy" className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-primary transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Store</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Shipping details form */}
          <div className="lg:col-span-7 space-y-6">
            
            <Card hoverEffect={false} className="p-6 sm:p-8 bg-white dark:bg-neutral-900 border border-blue-50 dark:border-neutral-800 shadow-sm rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-neutral-800 rounded-xl text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white font-heading">Shipping Information</h2>
                  <p className="text-[11px] text-neutral-450 uppercase font-bold mt-0.5 tracking-wider">Deliver your Travel Med Kit</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Delivery Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Street Address, Flat / Apartment / House No."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">City / Town</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Pincode / ZIP</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400001"
                      value={form.zipCode}
                      onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer transition-all font-medium"
                  >
                    <option>India</option>
                    <option>Singapore</option>
                    <option>United Arab Emirates</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/60 mt-6 flex justify-between items-center gap-4">
                  <span className="text-xs text-neutral-450 font-bold flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-neutral-400" />
                    <span>Secure SSL Encrypted Checkout</span>
                  </span>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading} 
                    className="px-8 py-3 bg-gradient-to-r from-secondary to-teal-500 hover:from-secondary-dark hover:to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-secondary/15 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {loading ? 'Processing...' : 'Pay & Checkout'}
                  </Button>
                </div>

              </form>
            </Card>

            {/* Quality Seals Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 border border-blue-50 rounded-2xl p-4 flex items-center gap-3">
                <Truck className="h-6 w-6 text-secondary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">FREE Express Delivery</h4>
                  <p className="text-[10px] text-neutral-400">Shipped with premium air cargo couriers.</p>
                </div>
              </div>
              <div className="bg-white/50 border border-blue-50 rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-secondary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">CDSCO Regulated</h4>
                  <p className="text-[10px] text-neutral-400">100% genuine CDSCO regulated medicines.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <Card hoverEffect={false} className="p-6 bg-[#EAF4FE]/60 dark:bg-neutral-900/40 border border-blue-200/60 dark:border-neutral-800 shadow-xs rounded-3xl">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-heading mb-4">Order Summary</h3>
              
              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-neutral-900 border border-blue-50/50 rounded-2xl p-3.5 shadow-2xs">
                    
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 flex items-center justify-center p-1.5 shrink-0">
                      <img src="/products.webp" alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100 truncate leading-snug">{item.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{item.options?.size || 'Solo'} Pack</p>
                      
                      <div className="flex items-center justify-between mt-2.5">
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-100 rounded-full p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-full text-neutral-500 hover:text-foreground cursor-pointer hover:bg-white active:scale-95 transition-all"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-[11px] font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full text-neutral-500 hover:text-foreground cursor-pointer hover:bg-white active:scale-95 transition-all"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Cost */}
                        <span className="text-sm font-black text-secondary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo inclusion Badge */}
              <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3.5 text-center select-none shadow-3xs mt-5 flex items-center gap-2.5 justify-center">
                <Sparkles className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-emerald-800 leading-snug">Includes 2 FREE Doctor consultations &amp; Rx</span>
              </div>

              {/* Calculations block */}
              <div className="border-t border-blue-100/60 pt-4 space-y-3 text-xs mt-5 font-medium">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                </div>

                {/* COUPON ROW */}
                <div className="pt-2">
                   <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">Promo Code</label>
                   <div className="flex gap-2 mt-1">
                     <input 
                       type="text" 
                       placeholder="Enter code" 
                       value={couponCode}
                       onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                       className="flex-1 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-800 focus:outline-none"
                     />
                     <button onClick={handleApplyCoupon} type="button" className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90">
                       Apply
                     </button>
                   </div>
                   {couponError && <p className="text-red-500 text-[10px] mt-1 font-semibold">{couponError}</p>}
                   {appliedCoupon && <p className="text-emerald-500 text-[10px] mt-1 font-semibold">Coupon '{appliedCoupon.code}' applied (-{appliedCoupon.discount}{appliedCoupon.type === 'Percentage' ? '%' : '₹'})</p>}
                </div>

                <div className="flex justify-between text-neutral-500">
                  <span>Express Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between text-base font-black border-t border-blue-100/60 pt-3 text-neutral-900 dark:text-white">
                  <span>Total Price</span>
                  <span className="text-secondary text-lg">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </Card>

          </div>

        </div>

      </main>

    </div>
  );
}
