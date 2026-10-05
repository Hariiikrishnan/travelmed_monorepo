'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Medicine } from '@/types';
import { CheckCircle2, AlertTriangle, ArrowLeft, Pill, Stethoscope, FlaskConical, ClipboardList, Plane, Repeat, SearchX, ChevronRight } from 'lucide-react';
import { JsonLd, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

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
      <div className="flex-1 bg-background font-sans">
        <div className="h-72 bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-24 pb-20">
          <div className="animate-pulse rounded-[28px] border border-border bg-white p-8 space-y-4">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-8 w-2/3 rounded bg-slate-200" />
            <div className="h-3 rounded bg-slate-100" />
            <div className="h-3 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!med) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-24 font-sans">
        <div className="max-w-md rounded-[28px] border border-border bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <SearchX className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold font-heading">Medicine not found</h1>
          <p className="mt-2 text-sm text-slate-500">The requested medication is not registered in our travel inventory.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const drugSchema = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: med.name,
    description: med.description,
    activeIngredient: med.activeIngredient,
    dosageForm: med.dosage,
    warning: med.warning,
    category: med.category,
    nonProprietaryName: med.activeIngredient,
    clinicalOverview: med.travelNote,
    prescriptionStatus: med.fdaStatus
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://travelmed.org' },
    { name: 'Medicines Catalog', url: 'https://travelmed.org/buy' },
    { name: med.name, url: `https://travelmed.org/medicine/${med.id}` }
  ]);

  const facts = [
    { icon: FlaskConical, label: 'Active ingredient', value: med.activeIngredient },
    { icon: ClipboardList, label: 'Dosage guidelines', value: med.dosage },
    { icon: CheckCircle2, label: 'DCGI regulatory status', value: med.fdaStatus },
    { icon: Repeat, label: 'Common alternatives', value: med.alternative },
  ];

  return (
    <div className="flex-1 bg-background font-sans">
      <JsonLd data={drugSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        <div aria-hidden className="absolute -top-32 right-[-10%] h-[360px] w-[360px] rounded-full bg-secondary/25 blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-32">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-white/60">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/buy" className="transition hover:text-white">Medicines</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-white/90">{med.name}</span>
          </nav>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Compartment {med.compartment}
            </span>
            <span className="rounded-full border border-secondary/30 bg-secondary/20 px-3 py-1 text-xs font-semibold text-teal-100">
              {med.category}
            </span>
          </div>
          <h1 className="mt-4 flex items-center gap-3 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight !text-white">
            <Pill className="h-8 w-8 shrink-0 text-secondary" />
            {med.name}
          </h1>
          <p className="mt-2 text-xs font-medium text-white/50">Item ref: {med.id}</p>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 -mt-20 pb-20 md:pb-28 space-y-6">
        <div className="rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-[0_30px_80px_rgba(11,79,140,0.10)]">
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{med.description}</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-background/60 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-4 w-4" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-heading leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-5">
            <div className="flex items-center gap-2 text-secondary-dark">
              <Plane className="h-4 w-4" />
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]">Travel &amp; customs clearance</p>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{med.travelNote}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div role="note" className="md:col-span-8 flex items-start gap-3.5 rounded-[24px] border border-rose-200 bg-rose-50/70 p-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-700">Warning</p>
              <p className="mt-1.5 text-sm text-rose-900/80 leading-relaxed">{med.warning}</p>
            </div>
          </div>
          <Link
            href="/teleconsultation"
            className="group md:col-span-4 flex flex-col justify-between gap-4 rounded-[24px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-6 text-white transition hover:shadow-[0_25px_60px_rgba(11,79,140,0.25)]"
          >
            <Stethoscope className="h-6 w-6 text-secondary" />
            <div>
              <p className="font-heading text-lg font-bold text-white">Unsure? Consult a doctor</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/70">
                Book a teleconsultation <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
