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

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'doc-priya',
    name: 'Dr. Priya Sharma',
    specialty: 'Internal Medicine & Tropical Diseases',
    languages: ['English', 'Hindi', 'Spanish'],
    experience: '12 years',
    bio: '12+ years experience treating travel-acquired infections, GI disorders, and emergency altitude conditions.',
    rating: 4.9,
    reviewsCount: 342,
    availability: 'Available Now',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    videoSimulatedUrl: 'https://travelmed.org/tele/call-tm-9843'
  },
  {
    id: 'doc-marcus',
    name: 'Dr. Marcus Vance',
    specialty: 'Emergency Medicine & Wilderness Care',
    languages: ['English', 'French'],
    experience: '15 years',
    bio: 'Specialist in wilderness triage, wound treatment, and rapid remote diagnostics.',
    rating: 4.8,
    reviewsCount: 289,
    availability: 'Available Now',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    videoSimulatedUrl: 'https://travelmed.org/tele/call-tm-9844'
  },
  {
    id: 'doc-elena',
    name: 'Dr. Elena Rostova',
    specialty: 'General Practice & Travel Health',
    languages: ['English', 'German', 'Russian'],
    experience: '10 years',
    bio: 'Certified travel health consultant advising global tourists and digital nomads.',
    rating: 4.9,
    reviewsCount: 410,
    availability: 'Available Now',
    image: 'https://images.unsplash.com/photo-1594824813566-78a1ed649474?auto=format&fit=crop&q=80&w=300',
    videoSimulatedUrl: 'https://travelmed.org/tele/call-tm-9845'
  }
];

export default function TeleconsultationPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/doctors`)
      .then(res => res.json())
      .then(body => {
        if (body.success && Array.isArray(body.data) && body.data.length > 0) {
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

    const docList = doctors.length > 0 ? doctors : DEFAULT_DOCTORS;
    let matchedDoc: Doctor | undefined;

    if (sym.includes('Stomach')) {
      matchedDoc = docList.find(d => d.id === 'doc-priya') || docList[0];
    } else if (sym.includes('Wound') || sym.includes('Fever')) {
      matchedDoc = docList.find(d => d.id === 'doc-marcus') || docList[0];
    } else {
      matchedDoc = docList.find(d => d.id === 'doc-elena') || docList[0];
    }

    setSelectedDoctor(matchedDoc || DEFAULT_DOCTORS[0]);
    setStep(2);
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
    if (!selectedDoctor) {
      const docList = doctors.length > 0 ? doctors : DEFAULT_DOCTORS;
      setSelectedDoctor(docList[0]);
    }
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

  const activeDoctor = selectedDoctor || (doctors.length > 0 ? doctors[0] : DEFAULT_DOCTORS[0]);

  const faqs = [
    {
      id: 'tele-faq-1',
      title: 'Are the doctors licensed to consult international travelers?',
      content: (
        <span>
          Our medical panel consists of board-certified General Physicians and Orthopaedicians licensed in India, holding international travel medicine certifications. They are fully authorized to provide medical guidance, triage assessment, dosage instructions, and signed travel prescriptions for global travelers.
        </span>
      )
    },
    {
      id: 'tele-faq-2',
      title: 'How do I connect to a doctor video call while abroad?',
      content: (
        <span>
          Inside your Travel Med pouch lid, scan the high-definition QR code using any mobile camera or click the consultation link from your email order confirmation. You will be routed directly into our secure waiting room with a physician connecting in <strong className="font-bold text-slate-900 dark:text-white">under 3 minutes</strong>.
        </span>
      )
    },
    {
      id: 'tele-faq-3',
      title: "Is the Doctor's Prescription valid for airport security and customs?",
      content: (
        <span>
          <strong className="font-bold text-slate-900 dark:text-white">Yes.</strong> Every Travel Med Kit comes with an official signed Doctor's Prescription matching the exact 150+ medications inside, formatted to meet TSA, IATA, and international border customs verification standards.
        </span>
      )
    },
    {
      id: 'tele-faq-4',
      title: 'What hours are the doctors available?',
      content: (
        <span>
          Our teleconsultation network operates <strong className="font-bold text-slate-900 dark:text-white">24 hours a day, 7 days a week, 365 days a year</strong> across all global time zones. Whether you are in Tokyo, Paris, or New York, a doctor is always available.
        </span>
      )
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

              {step === 3 && activeDoctor && (
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
                        We mapped your concern ({symptom || 'General Query'}) in {destination || 'Global'} to our leading remote physician.
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
                        src={activeDoctor.image}
                        alt={activeDoctor.name}
                        className="w-24 h-24 rounded-full object-cover border border-primary/20"
                      />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs md:text-sm">{activeDoctor.name}</h4>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{activeDoctor.specialty}</span>
                        <Rating value={activeDoctor.rating} className="justify-center mt-1" />
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-normal max-w-xs">{activeDoctor.bio}</p>
                    </Card>
                  </div>
                </motion.div>
              )}

              {step === 4 && activeDoctor && (
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
                      Your session with <strong>{activeDoctor.name}</strong> is booked for <strong>{selectedTimeSlot}</strong>.
                    </p>
                  </div>

                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-950/40 rounded-2xl border border-border p-5 text-xs text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4.5 w-4.5 text-primary" />
                      <span><strong>Date/Time:</strong> {selectedTimeSlot} (Local Time Zone)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4.5 w-4.5 text-primary" />
                      <span className="truncate"><strong>Video Conference Link:</strong> <span className="text-primary underline cursor-pointer font-semibold">https://travelmed.org/tele/call-tm-9843</span></span>
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
