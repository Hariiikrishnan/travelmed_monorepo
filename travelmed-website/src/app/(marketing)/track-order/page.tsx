'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Search, Truck, ShieldCheck, CheckCircle2, MapPin, SearchCode, Package } from 'lucide-react';
import { Order } from '@/types';

export default function TrackOrderPage() {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Check if orderId is in URL search parameters
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');

    if (orderIdParam) {
      const trimmedId = orderIdParam.trim();
      setSearchId(trimmedId);
      setSearched(true);
      
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
        });
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
    }
  };

  const getCheckpoints = () => {
    if (!order) return [];

    const isPending = order.status === 'Pending';
    const isProcessing = order.status === 'Processing';
    const isShipped = order.status === 'Shipped';
    const isDelivered = order.status === 'Delivered';
    const isCancelled = order.status === 'Cancelled' || order.status === 'Refunded';

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
      { name: 'Out for Local Delivery', desc: 'Courier courier routes transit to shipping address.', completed: isDelivered, active: false, time: isDelivered ? 'Delivered' : 'Pending' }
    ];
  };
  const checkpoints = getCheckpoints();

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
          <Badge variant="primary">Transit Tracking System</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading">Track Your Pouch Delivery</h1>
          <p className="text-xs md:text-sm text-neutral-400">
            Enter your order ID (e.g. TM-XXXXXX) or carrier tracking code to check laboratory seal status and transit updates.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Order ID (e.g. TM-482931)"
                required
                className="w-full px-4 py-3 pl-10 bg-white dark:bg-neutral-900 border border-border rounded-full text-xs md:text-sm focus:outline-none focus:border-primary shadow-sm"
              />
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>
        </div>

        {searched && !order ? (
          /* Empty / Not found state */
          <Card hoverEffect={false} className="p-12 text-center space-y-4">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-400 w-fit mx-auto">
              <SearchCode className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold">No tracking records found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              We couldn't locate tracking codes matching "{searchId}". Ensure the code matches the invoice sent to your email.
            </p>
          </Card>
        ) : order ? (
          /* Tracking updates details */
          <Card hoverEffect={false} className="p-6 md:p-8 bg-card border-border shadow-md space-y-8">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Currently Tracking</span>
                <span className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200">{order.orderId}</span>
              </div>
              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Estimated Arrival</span>
                <span className="font-bold text-sm text-primary">{order.estimatedDelivery}</span>
              </div>
            </div>

            {/* Vertical Tracker timeline */}
            <div className="space-y-8 pl-8 relative border-l border-border/80 ml-4 py-2">
              {checkpoints.map((cp, idx) => {
                return (
                  <div key={idx} className="relative">
                    {/* Circle check */}
                    <div className={`absolute -left-[45px] top-1 flex items-center justify-center w-8 h-8 rounded-full border shadow-sm ${
                      cp.completed
                        ? 'bg-accent-light text-accent border-accent'
                        : cp.active
                        ? 'bg-primary-light text-primary border-primary animate-pulse'
                        : 'bg-white dark:bg-neutral-900 text-neutral-300 border-border'
                    }`}>
                      {cp.completed ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Package className="h-4 w-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-xs md:text-sm font-bold ${cp.active ? 'text-primary' : 'text-neutral-800 dark:text-neutral-200'}`}>
                          {cp.name}
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-semibold">{cp.time}</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-normal max-w-lg">
                        {cp.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Courier code */}
            <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-neutral-400 shrink-0" />
                <span className="text-neutral-500">Destination: <strong>{typeof order.shippingAddress === 'object' ? order.shippingAddress?.fullName || 'Customer' : (order as any).shippingFullName || 'Customer'}, {(order as any).shippingCity ? (order as any).shippingCity : typeof order.shippingAddress === 'object' ? order.shippingAddress?.city : ''}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Certified shipping container seal verified</span>
              </div>
            </div>

          </Card>
        ) : (
          /* Initial search prompt when no checkout completed */
          <Card hoverEffect={false} className="p-8 text-center space-y-4">
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-400 w-fit mx-auto">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold">Awaiting Order Inputs</h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
              No orders have been recorded. Configure a kit, place a mock checkout order, and check updates here.
            </p>
          </Card>
        )}

      </div>
    </div>
  );
}
