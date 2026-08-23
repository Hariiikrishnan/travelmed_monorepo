'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/shared/providers/CartProvider';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2, Truck, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';

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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm font-bold text-neutral-500">Securing your order receipt...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans">
        <h3 className="text-xl font-bold">No Order Record Found</h3>
        <p className="text-xs text-neutral-400">Build your kit first and complete checkout.</p>
        <Link href="/buy">
          <Button size="sm">Go to Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <Card hoverEffect={false} className="p-8 md:p-12 border-border bg-card shadow-lg text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent to-secondary" />

          {/* Celebratory Check */}
          <div className="flex justify-center">
            <div className="p-4 bg-accent-light text-accent rounded-full animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="accent">Order Placed Successfully</Badge>
            <h1 className="text-3xl font-black font-heading tracking-tight">Your Protection is en route!</h1>
            <p className="text-xs md:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
              We received your order and are sorting your color-coded medical pouch at our laboratory.
            </p>
          </div>

          {/* Order Details Grid */}
          <div className="border-y border-border/60 py-6 text-xs text-left space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Order ID</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{order.orderId}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Estimated Delivery</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>{order.estimatedDelivery}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Carrier Tracking Code</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span className="underline select-text">{order.trackingNumber}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-0.5">Shipping Address</span>
                <span className="font-medium text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="flex flex-col">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {typeof order.shippingAddress === 'object' 
                        ? order.shippingAddress?.fullName || 'Customer'
                        : (order as any).shippingFullName || 'Customer'}
                    </span>
                    <span>
                      {typeof order.shippingAddress === 'string' ? `${order.shippingAddress}, ` : order.shippingAddress?.address ? `${order.shippingAddress.address}, ` : ''}
                      {(order as any).shippingCity ? `${(order as any).shippingCity}, ` : typeof order.shippingAddress === 'object' && order.shippingAddress?.city ? `${order.shippingAddress.city}, ` : ''}
                      {(order as any).shippingZipCode ? `${(order as any).shippingZipCode}` : typeof order.shippingAddress === 'object' && order.shippingAddress?.zipCode ? `${order.shippingAddress.zipCode}` : ''}
                    </span>
                  </span>
                </span>
              </div>
            </div>

          </div>

          {/* Items Summary list */}
          <div className="text-left space-y-3.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
              Package Contents Summary
            </span>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-border/20">
                  <div className="flex gap-2">
                    <span className="font-bold text-primary">{item.quantity}x</span>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2 text-xs text-right text-neutral-500 border-t border-border/40 pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost?.toLocaleString('en-IN')}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-primary border-t border-border/20 pt-2">
              <span>Total Paid:</span>
              <span>₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" fullWidth size="md">
                Back to Safety
              </Button>
            </Link>
            <Link href="/track-order" className="flex-1">
              <Button variant="primary" fullWidth size="md">
                <span>Track Transit Delivery</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider pt-2">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>TSA compliant laboratory shipping clearance</span>
          </div>

        </Card>
        
      </div>
    </div>
  );
}
