import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RefundPage() {
  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <Card hoverEffect={false} className="p-8 md:p-12 border-border bg-card shadow-lg space-y-8">
          <div className="space-y-4">
            <Badge variant="primary">Customer Protection</Badge>
            <h1 className="text-3xl font-black font-heading tracking-tight">Refund & Guarantee Policy</h1>
            <p className="text-xs text-neutral-400">Last updated: August 2026</p>
          </div>

          <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
            At Travel Med, we stand behind our medical logistics. Your safety and satisfaction are our primary priorities.
          </p>

          <div className="space-y-6 pt-4 border-t border-border/40 text-xs text-neutral-500 leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">30-Day Unopened Returns</h3>
              <p>
                We accept returns of unopened, factory-sealed Travel Med kits within 30 days of purchase for a full refund. Because our kits contain regulated over-the-counter pharmaceuticals, we cannot accept returns of any kit where the security seal has been broken or tampered with.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Carrier Delays & Flight Cancellations</h3>
              <p>
                If your kit fails to arrive before your departure check-in date due to carrier transit delays, we will provide a full refund and assist you in rerouting or canceling the parcel.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Teleconsultation Credits</h3>
              <p>
                The digital teleconsultation portion of your subscription remains active for 12 months. If you return the physical kit, the doctor consultation service credits will be canceled immediately.
              </p>
            </div>

            <div className="space-y-2 bg-neutral-50 dark:bg-neutral-800/20 p-4 border border-border rounded-xl">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-accent" />
                <span>Our Safety Promise</span>
              </h3>
              <p className="mt-1">
                If any medication package is damaged in transit, contact support within 48 hours. We will dispatch replacement blister sleeves immediately to your destination address free of charge.
              </p>
            </div>
          </div>

        </Card>
        
      </div>
    </div>
  );
}
