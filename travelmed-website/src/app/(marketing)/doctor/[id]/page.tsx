'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@/types';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Rating } from '@/shared/ui/Rating';
import { ArrowLeft, Clock, ShieldCheck, Languages, Award, Video, Calendar, Check, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [doc, setDoc] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingTime, setBookingTime] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false); // rename to avoid collision with load state

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
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans">
        <h3 className="text-xl font-bold">Loading Doctor Details...</h3>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 font-sans">
        <h3 className="text-xl font-bold">Doctor Record Not Found</h3>
        <p className="text-xs text-neutral-400">The requested physician is not registered in our travel medical panel.</p>
        <Link href="/teleconsultation">
          <Button size="sm">Back to Teleconsultation</Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-6">
          <Link href="/teleconsultation" className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Teleconsultation Hub</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Profile details */}
          <div className="lg:col-span-7 space-y-6">
            <Card hoverEffect={false} className="p-8 border-border bg-card shadow-lg space-y-6">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-32 h-32 rounded-3xl object-cover border border-primary/10 shadow-sm"
                />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">{doc.availability}</Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight">{doc.name}</h1>
                  <span className="text-xs md:text-sm text-primary font-bold uppercase tracking-wider block">
                    {doc.specialty}
                  </span>
                  <Rating value={doc.rating} showText={true} className="mt-1" />
                </div>
              </div>

              <div className="space-y-4 border-t border-border/40 pt-6 text-xs md:text-sm text-neutral-500 leading-relaxed">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Professional Bio</h3>
                  <p>{doc.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Languages Spoken
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <Languages className="h-4 w-4 text-primary" />
                      <span>{doc.languages.join(', ')}</span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Certifications
                    </span>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Board Certified</span>
                    </span>
                  </div>
                </div>
              </div>

            </Card>
          </div>

          {/* Right Column: Booking widget */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Card hoverEffect={false} className="p-6 bg-card border-border shadow-lg relative min-h-[350px] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />

              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="scheduler"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Currently Consulting</span>
                      <h3 className="text-lg font-black font-heading tracking-tight">Select Consult Time</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {['Connect Now (Wait < 3m)', 'In 15 minutes', 'In 1 hour', 'Tomorrow morning'].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleBook(slot)}
                          className="p-4 border border-border rounded-xl text-center text-xs font-bold hover:border-primary hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer select-none focus:outline-none transition"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider pt-2 border-t border-border/40">
                      <ShieldCheck className="h-4 w-4 text-accent animate-pulse" />
                      <span>Secured video waiting channel</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-6 space-y-6 flex flex-col items-center justify-center"
                  >
                    <div className="p-3 bg-accent-light text-accent rounded-full">
                      <Check className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <Badge variant="accent">Slot Scheduled</Badge>
                      <h4 className="font-extrabold text-sm md:text-base">Consultation Reserved!</h4>
                      <p className="text-[10px] text-neutral-400 leading-relaxed max-w-[200px] mx-auto">
                        Your appointment with {doc.name} is scheduled for {bookingTime}.
                      </p>
                    </div>

                    <div className="w-full bg-neutral-50 dark:bg-neutral-950/40 rounded-xl border border-border p-4 text-[10px] text-left space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span><strong>Time Slot:</strong> {bookingTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LinkIcon className="h-4 w-4 text-primary" />
                        <span className="truncate"><strong>Call Meeting Code:</strong> <span className="text-primary underline cursor-pointer">zoom.us/tmed-call-29</span></span>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" onClick={() => setSuccess(false)} className="flex-1">
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Reset</span>
                      </Button>
                      <Button variant="primary" size="sm" className="flex-1">
                        <Video className="h-3.5 w-3.5" />
                        <span>Enter room</span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}
