'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@/types';
import { Rating } from '@/shared/ui/Rating';
import { Avatar } from '@/shared/ui/Avatar';
import {
  ArrowLeft,
  ShieldCheck,
  Languages,
  Award,
  Video,
  Calendar,
  Check,
  Link as LinkIcon,
  RefreshCw,
  Clock,
  Sun,
  Moon,
  CalendarClock,
  Loader2,
  Stethoscope,
  UserX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ id: string }>;
}

const slots = [
  { label: 'Doctor Contact in 8–12 Hrs', icon: Clock },
  { label: 'Next Morning Callback', icon: Sun },
  { label: 'Evening Callback Slot', icon: Moon },
  { label: 'Flexible Callback', icon: CalendarClock },
];

export default function DoctorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [doc, setDoc] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingTime, setBookingTime] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/doctors/${resolvedParams.id}`)
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setDoc(body.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleBook = (time: string) => {
    setBookingTime(time);
    setBookingLoading(true);
    setTimeout(() => {
      setBookingLoading(false);
      setSuccess(true);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-background font-sans">
        <div className="h-64 bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 pb-20">
          <div className="animate-pulse rounded-[28px] border border-border bg-white p-8">
            <div className="flex gap-6">
              <div className="h-32 w-32 rounded-3xl bg-slate-200" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-7 w-2/3 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            </div>
            <div className="mt-8 space-y-2.5">
              <div className="h-3 rounded bg-slate-100" />
              <div className="h-3 rounded bg-slate-100" />
              <div className="h-3 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-24 font-sans">
        <div className="max-w-md rounded-[28px] border border-border bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
            <UserX className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-2xl font-bold font-heading">Doctor not found</h1>
          <p className="mt-2 text-sm text-slate-500">The requested physician is not registered in our travel medical panel.</p>
          <Link
            href="/teleconsultation"
            className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Teleconsultation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background font-sans">
      {/* Header band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70]">
        <div aria-hidden className="absolute -top-32 right-[-10%] h-[360px] w-[360px] rounded-full bg-secondary/25 blur-[120px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-32">
          <Link
            href="/teleconsultation"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Teleconsultation
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-24 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Profile */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[28px] border border-border bg-white p-6 sm:p-8 shadow-[0_30px_80px_rgba(11,79,140,0.10)]">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar src={doc.image} alt={doc.name} size="2xl" className="rounded-3xl ring-4 ring-white shadow-lg" />
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {doc.availability}
                  </span>
                  <h1 className="mt-3 text-2xl md:text-3xl font-extrabold font-heading tracking-tight">{doc.name}</h1>
                  <p className="mt-1 text-sm font-semibold text-primary">{doc.specialty}</p>
                  <Rating value={doc.rating} showText={true} className="mt-3" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Stethoscope, label: 'Experience', value: doc.experience },
                  { icon: Languages, label: 'Languages', value: doc.languages.join(', ') },
                  { icon: Award, label: 'Certification', value: 'Board Certified' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-border bg-background/60 p-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-heading">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h2 className="text-lg font-bold font-heading">Professional bio</h2>
                <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{doc.bio}</p>
              </div>
            </div>
          </div>

          {/* Booking widget */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative min-h-[380px] overflow-hidden rounded-[28px] border border-border bg-white p-6 sm:p-7 shadow-[0_30px_80px_rgba(11,79,140,0.10)]">
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary" />

              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div key="scheduler" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-dark">Book a callback</p>
                      <h2 className="mt-1.5 text-xl font-bold font-heading tracking-tight">Select a consult time</h2>
                    </div>

                    <div className="space-y-2.5">
                      {slots.map(({ label, icon: Icon }) => {
                        const isPending = bookingLoading && bookingTime === label;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => handleBook(label)}
                            disabled={bookingLoading}
                            className="group flex w-full items-center gap-3.5 rounded-2xl border border-border bg-white p-4 text-left text-sm font-semibold text-heading transition-all hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(11,79,140,0.08)] disabled:opacity-60 cursor-pointer disabled:cursor-wait"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary transition group-hover:bg-primary group-hover:text-white">
                              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                            </span>
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <p className="flex items-center justify-center gap-1.5 border-t border-border pt-4 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-secondary-dark" /> Secured consultation channel
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="flex flex-col items-center py-4 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 ring-8 ring-secondary/5">
                      <Check className="h-7 w-7 text-secondary-dark" />
                    </div>
                    <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-dark">Slot scheduled</p>
                    <h2 className="mt-1.5 text-xl font-bold font-heading">Consultation reserved!</h2>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                      Your appointment with {doc.name} is scheduled for {bookingTime}.
                    </p>

                    <dl className="mt-6 w-full divide-y divide-border rounded-2xl border border-border bg-background/60 text-left text-sm">
                      <div className="flex items-center gap-2.5 px-4 py-3">
                        <Calendar className="h-4 w-4 shrink-0 text-primary" />
                        <dt className="text-slate-500">Time slot</dt>
                        <dd className="ml-auto font-semibold text-heading text-right">{bookingTime}</dd>
                      </div>
                      <div className="flex items-center gap-2.5 px-4 py-3">
                        <LinkIcon className="h-4 w-4 shrink-0 text-primary" />
                        <dt className="text-slate-500">Meeting</dt>
                        <dd className="ml-auto truncate font-semibold text-primary">zoom.us/tmed-call-29</dd>
                      </div>
                    </dl>

                    <div className="mt-6 grid w-full grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-border bg-white px-4 py-3 text-sm font-semibold text-heading transition hover:border-primary/40 cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4" /> Reset
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-[14px] bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark cursor-pointer"
                      >
                        <Video className="h-4 w-4" /> Enter room
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
