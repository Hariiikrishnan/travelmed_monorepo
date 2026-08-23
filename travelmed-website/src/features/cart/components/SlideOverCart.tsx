'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Drawer } from '@/shared/ui/Drawer';
import { useCart } from '@/shared/providers/CartProvider';
import { Button } from '@/shared/ui/Button';
import { Plus, Minus, Trash2, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SlideOverCart: React.FC = () => {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    getCartTotal,
    placeOrder
  } = useCart();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    country: 'United States',
    zipCode: ''
  });
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.address || !form.city || !form.zipCode) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      placeOrder(form);
      setLoading(false);
      setCheckoutMode(false);
      setIsCartOpen(false);
      
      // Reset form
      setForm({
        fullName: '',
        address: '',
        city: '',
        country: 'United States',
        zipCode: ''
      });
      
      router.push('/success');
    }, 1500);
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={() => {
        setIsCartOpen(false);
        setCheckoutMode(false);
      }}
      title={checkoutMode ? "Shipping Details" : "Shopping Bag"}
      size="md"
    >
      <AnimatePresence mode="wait">
        {!checkoutMode ? (
          /* Cart items list */
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full justify-between"
          >
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-400">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h4 className="text-base font-bold">Your bag is empty</h4>
                <p className="text-xs text-neutral-500 max-w-[240px]">
                  Add a Travel Med kit to secure your medical protection abroad.
                </p>
                <Button size="sm" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 border border-border rounded-xl bg-neutral-50/50 dark:bg-neutral-800/10"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold">{item.name}</h4>
                          <span className="text-sm font-extrabold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                        {item.description && <p className="text-xs text-neutral-400">{item.description}</p>}
                        
                        {item.options && (
                          <div className="flex gap-2 flex-wrap pt-1 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                            {item.options.size && <span>Size: {item.options.size}</span>}
                            {item.options.pediatricAddon && <span className="text-secondary">+ Pediatric Pack</span>}
                            {item.options.seniorAddon && <span className="text-warning">+ Senior Pack</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity control */}
                          <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 border border-border rounded-full p-1 select-none">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full text-neutral-400 hover:text-foreground cursor-pointer hover:bg-neutral-50"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full text-neutral-400 hover:text-foreground cursor-pointer hover:bg-neutral-50"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summaries */}
                <div className="border-t border-border pt-6 space-y-4">
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Shipping</span>
                      <span className="font-semibold">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold border-t border-border/40 pt-2">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="primary" fullWidth size="lg" onClick={() => {
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}>
                      Checkout
                    </Button>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      <span>Security & TSA regulatory compliant checkout</span>
                    </div>
                    {shipping > 0 && (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-primary">
                        <Truck className="h-4 w-4" />
                        <span>Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for Free Shipping!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Checkout form */
          <motion.form
            key="checkout"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Ocean Drive, Apt 4"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Miami"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Zip Code</label>
                  <input
                    type="text"
                    required
                    placeholder="33139"
                    value={form.zipCode}
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-sm focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>Singapore</option>
                </select>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between text-base font-extrabold">
                <span>Total Due</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => setCheckoutMode(false)} className="flex-1">
                  Back
                </Button>
                <Button variant="primary" type="submit" disabled={loading} className="flex-1 select-none">
                  {loading ? 'Processing...' : 'Place Free Order'}
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
