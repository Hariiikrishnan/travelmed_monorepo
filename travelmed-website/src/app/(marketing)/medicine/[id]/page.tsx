'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2, AlertTriangle, ArrowLeft, Pill, HeartPulse } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MedicineDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [med, setMed] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medicines/${resolvedParams.id}`)
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setMed(body.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans">
        <h3 className="text-xl font-bold">Loading Medicine Details...</h3>
      </div>
    );
  }

  if (!med) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans">
        <h3 className="text-xl font-bold">Medicine Record Not Found</h3>
        <p className="text-xs text-neutral-400">The requested medication is not registered in our travel inventory.</p>
        <Link href="/whats-inside">
          <Button size="sm">Back to Explorer</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="mb-6">
          <Link href="/whats-inside" className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Inventory Explorer</span>
          </Link>
        </div>

        <Card hoverEffect={false} className="p-8 md:p-12 border-border bg-card shadow-lg space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary">Compartment {med.compartment}</Badge>
                <Badge variant="secondary">{med.category}</Badge>
              </div>
              <h1 className="text-3xl font-black font-heading tracking-tight flex items-center gap-2">
                <Pill className="h-7 w-7 text-primary shrink-0" />
                <span>{med.name}</span>
              </h1>
            </div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Item Ref: {med.id}
            </span>
          </div>

          <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-medium border-l-2 border-primary pl-4 py-1">
            {med.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border/45 pt-6 text-xs text-neutral-500 leading-relaxed">
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Active Ingredient</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{med.activeIngredient}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Dosage Guidelines</span>
                <p>{med.dosage}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">FDA Regulatory Status</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                  <CheckCircle2 className="h-4.5 w-4.5 text-accent" />
                  <span>{med.fdaStatus}</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Common Alternatives</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{med.alternative}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Travel & Customs Clearance</span>
                <p className="bg-neutral-50 dark:bg-neutral-800/10 p-3.5 border border-border rounded-xl">
                  {med.travelNote}
                </p>
              </div>
            </div>

          </div>

          <div className="border-t border-border/40 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex gap-3 text-red-500 dark:text-red-400 bg-red-50/10 dark:bg-red-950/10 p-4 border border-red-100/50 rounded-xl text-xs leading-normal">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider block text-[10px]">Warning Label</span>
                <p>{med.warning}</p>
              </div>
            </div>
            
            <div className="md:col-span-4 w-full">
              <Link href="/teleconsultation" className="w-full">
                <Button variant="outline" size="sm" fullWidth className="flex items-center gap-1.5">
                  <HeartPulse className="h-4.5 w-4.5 text-primary" />
                  <span>Consult Doctor</span>
                </Button>
              </Link>
            </div>
          </div>

        </Card>
      </div>
    </div>
  );
}
