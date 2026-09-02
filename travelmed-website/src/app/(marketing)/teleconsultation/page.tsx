'use client';

import React, { useState, useEffect } from 'react';
// Loaded dynamically from backend API
import { Doctor } from '@/types';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Accordion } from '@/shared/ui/Accordion';
import { Rating } from '@/shared/ui/Rating';
import { Video, ShieldCheck, HeartPulse, Clock, Sparkles, Check, ChevronRight, RefreshCw, Calendar, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeleconsultationPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/doctors`)
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setDoctors(body.data);
        }
      })
      .catch(err => console.error('Failed to fetch doctors', err))
      .finally(() => setLoading(false));
  }, []);

  // Triage state machine
  const [step, setStep] = useState(1);
  const [symptom, setSymptom] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const symptoms = ['Stomach & GI (Bali belly)', 'Fever & Pain (Altitude/Headache)', 'Severe Allergy / Rash', 'Wound care / Scraping'];
  const destinations = ['Southeast Asia & Pacific', 'Europe & UK', 'Americas & Latin', 'Africa & Middle East'];

  const handleSymptomSelect = (sym: string) => {
    setSymptom(sym);

    if (doctors.length > 0) {
      // Choose recommended doctor based on symptom
      if (sym.includes('Stomach')) {
        setSelectedDoctor(doctors.find(d => d.id === 'doc-priya') || doctors[0]);
      } else if (sym.includes('Wound') || sym.includes('Fever')) {
        setSelectedDoctor(doctors.find(d => d.id === 'doc-marcus') || doctors[0]);
      } else {
        setSelectedDoctor(doctors.find(d => d.id === 'doc-elena') || doctors[0]);
      }
    }

    setStep(2);
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
    setStep(3);
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSymptom('');
    setDestination('');
    setSelectedDoctor(null);
    setSelectedTimeSlot('');
  };

  const faqs = [
    {
      id: 'tele-faq-1',
      title: 'Are the doctors licensed in my destination?',
      content: 'Our medical network consists of board-certified practitioners in the US and EU licensed to provide international traveler guidance, prescription verification, and triage assessment anywhere globally.'
    },
    {
      id: 'tele-faq-2',
      title: 'How do I connect to a call when I am sick?',
      content: 'Simply scan the QR code inside the Travel Med pouch lid using your mobile device. It opens a direct web portal linking you immediately to a physician video call, bypassing lengthy login fields.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-neutral-50 dark:bg-neutral-950">

      {/* Hero section */}
      <section className="py-12 md:py-20 bg-white dark:bg-neutral-900 border-b border-border/40 relative">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-1">
          {/* <Badge variant="primary" className="px-3 py-1 flex items-center gap-1.5 justify-center w-fit mx-auto">
            <Clock className="h-4 w-4 text-secondary animate-pulse" />
            <span>Average Doctor Response Latency: &lt; 2 minutes</span>
          </Badge> */}

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading max-w-2xl mx-auto">
            Global Video Consultations
          </h1>

          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto">
            Connect immediately to board-certified physicians from your phone. Triage symptoms, verify localized medication guidelines, and protect your travel continuity.
          </p>
        </div>
      </section>

      {/* Booking Triage Flow Dashboard */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-8">
            <span className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-widest block">
              Interactive Consultation Triage Simulator
            </span>
          </div>

          <Card hoverEffect={false} className="p-8 md:p-12 border-border bg-card shadow-lg relative min-h-[400px] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

            <AnimatePresence mode="wait">
              {step === 1 && (
                /* Step 1: Select symptoms */
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 1 of 3</span>
                    <h3 className="text-2xl font-black font-heading tracking-tight">What symptoms are you experiencing?</h3>
                    <p className="text-xs md:text-sm text-neutral-400">Select the primary health concern for triage recommendation.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {symptoms.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSymptomSelect(s)}
                        className="p-5 border border-border rounded-2xl text-left font-semibold text-xs md:text-sm hover:border-primary hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition cursor-pointer select-none focus:outline-none flex justify-between items-center group"
                      >
                        <span>{s}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                /* Step 2: Choose destination */
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-neutral-400 hover:text-foreground">
                      ← Back
                    </button>
                    <div className="pt-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 2 of 3</span>
                    </div>
                    <h3 className="text-2xl font-black font-heading tracking-tight">Where are you currently traveling?</h3>
                    <p className="text-xs md:text-sm text-neutral-400">Different regions require different vaccine and import compliance audits.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destinations.map((d) => (
                      <button
                        key={d}
                        onClick={() => handleDestinationSelect(d)}
                        className="p-5 border border-border rounded-2xl text-left font-semibold text-xs md:text-sm hover:border-primary hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition cursor-pointer select-none focus:outline-none flex justify-between items-center group"
                      >
                        <span>{d}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && selectedDoctor && (
                /* Step 3: Recommend Doctor & Schedule */
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
                >
                  <div className="md:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <button onClick={() => setStep(2)} className="text-xs font-bold text-neutral-400 hover:text-foreground">
                        ← Back
                      </button>
                      <div className="pt-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Step 3 of 3</span>
                      </div>
                      <h3 className="text-2xl font-black font-heading tracking-tight">Match Found: Schedule Your Video Call</h3>
                      <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                        We mapped your concern ({symptom}) in {destination} to our leading remote physician.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                        Select a time slot
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        {['Now (Wait < 3m)', 'In 15 minutes', 'In 1 hour', 'Tomorrow morning'].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleTimeSlotSelect(slot)}
                            className="p-4 border border-border rounded-xl text-center text-xs font-bold cursor-pointer hover:border-primary hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <Card hoverEffect={false} className="p-5 border-border bg-neutral-50 dark:bg-neutral-950/40 text-center flex flex-col items-center space-y-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-24 h-24 rounded-full object-cover border border-primary/20"
                      />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs md:text-sm">{selectedDoctor.name}</h4>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{selectedDoctor.specialty}</span>
                        <Rating value={selectedDoctor.rating} className="justify-center mt-1" />
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-normal max-w-xs">{selectedDoctor.bio}</p>
                    </Card>
                  </div>
                </motion.div>
              )}

              {step === 4 && selectedDoctor && (
                /* Step 4: Success confirmation */
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 space-y-6 flex flex-col items-center justify-center"
                >
                  <div className="p-4 bg-accent-light text-accent rounded-full animate-bounce">
                    <Check className="h-8 w-8" />
                  </div>

                  <div className="space-y-2">
                    <Badge variant="accent">Appointment Confirmed</Badge>
                    <h3 className="text-2xl md:text-3xl font-black font-heading tracking-tight">Your Video Call is Scheduled!</h3>
                    <p className="text-xs md:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                      Your session with <strong>{selectedDoctor.name}</strong> is booked for <strong>{selectedTimeSlot}</strong>.
                    </p>
                  </div>

                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-950/40 rounded-2xl border border-border p-5 text-xs text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4.5 w-4.5 text-primary" />
                      <span><strong>Date/Time:</strong> {selectedTimeSlot} (Local Time Zone)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4.5 w-4.5 text-primary" />
                      <span className="truncate"><strong>Video Conference Link:</strong> <span className="text-primary underline cursor-pointer font-semibold">https://travelmed.com/tele/call-tm-9843</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-accent" />
                      <span>Secure consultation compliant with medical data standards.</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RefreshCw className="h-4 w-4" />
                      <span>Simulate Again</span>
                    </Button>
                    <Button variant="primary" size="sm">
                      <Video className="h-4 w-4" />
                      <span>Join Call Waiting Room</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </section>

      {/* Doctor Registry grid */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="primary">Board Advisory Physicians</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
              Our Medical Panel Registry
            </h2>
            <p className="text-sm md:text-base text-neutral-500">
              Meet some of our board-certified travel health specialists who handle triage and import audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc) => (
              <Card key={doc.id} hoverEffect={true} className="p-6 bg-card border-border flex flex-col justify-between h-full min-h-[380px] hover:border-primary/20">
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-44 object-cover rounded-xl border border-border"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm md:text-base">{doc.name}</h3>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">{doc.specialty}</span>
                    <Rating value={doc.rating} showText={true} className="mt-1.5" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {doc.bio}
                  </p>
                </div>

                <div className="border-t border-border/40 pt-4 mt-6 space-y-3.5">
                  <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    <span>Experience: {doc.experience}</span>
                    <span className="text-green-500">{doc.availability}</span>
                  </div>
                  <Button variant="outline" size="sm" fullWidth onClick={() => {
                    setSelectedDoctor(doc);
                    setSymptom('General Inquiry');
                    setDestination('Global');
                    setSelectedTimeSlot('Now (Wait < 3m)');
                    setStep(4);
                  }}>
                    Book Consultation
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Support FAQ */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-950 border-t border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <Badge variant="primary">Help Desk</Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
              Telehealth Regulations & Policies
            </h2>
          </div>
          <Accordion items={faqs} />
        </div>
      </section>

    </div>
  );
}
