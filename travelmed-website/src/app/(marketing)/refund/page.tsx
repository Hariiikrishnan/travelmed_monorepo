import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { LegalDocument } from '@/shared/ui/LegalDocument';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Refund & Guarantee Policy',
  description: 'TravelMed refund and replacement policy for damaged, incorrect or undelivered travel medical kits and teleconsultation credits.',
  path: '/refund',
});

export default function RefundPage() {
  return (
    <LegalDocument
      badge="Customer Protection"
      title="Refund & Guarantee Policy"
      description="Our returns, refunds and replacement guarantee."
      path="/refund"
      lastUpdated="August 2026"
      intro="At Travel Med, we stand behind our medical logistics. Your safety and satisfaction are our primary priorities."
      sections={[
        {
          id: 'unopened-returns',
          title: '30-Day Unopened Returns',
          content: (
            <p>
              We accept returns of unopened, factory-sealed Travel Med kits within 30 days of purchase for a full refund.
              Because our kits contain regulated pharmaceuticals, we cannot accept returns of any kit where the security
              seal has been broken or tampered with.
            </p>
          ),
        },
        {
          id: 'carrier-delays',
          title: 'Carrier Delays & Flight Cancellations',
          content: (
            <p>
              If your kit fails to arrive before your departure check-in date due to carrier transit delays, we will
              provide a full refund and assist you in rerouting or canceling the parcel.
            </p>
          ),
        },
        {
          id: 'teleconsultation-credits',
          title: 'Teleconsultation Credits',
          content: (
            <p>
              The digital teleconsultation portion of your subscription remains active for 12 months. If you return the
              physical kit, the doctor consultation service credits will be canceled immediately.
            </p>
          ),
        },
      ]}
      footnote={
        <div className="flex items-start gap-4 rounded-2xl border border-secondary/20 bg-secondary/5 p-5 sm:p-6">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-secondary-dark" />
          <div>
            <h3 className="font-heading text-base font-bold">Our Safety Promise</h3>
            <p className="mt-1.5 text-[15px] text-slate-600 leading-relaxed">
              If any medication package is damaged in transit, contact support within 48 hours. We will dispatch
              replacement blister sleeves immediately to your destination address free of charge.
            </p>
          </div>
        </div>
      }
    />
  );
}
