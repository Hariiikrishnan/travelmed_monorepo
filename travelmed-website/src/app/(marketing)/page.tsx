'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/shared/providers/CartProvider';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Rating } from '@/shared/ui/Rating';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { Accordion } from '@/shared/ui/Accordion';
import { ApprovalsSection } from '@/shared/ui/ApprovalsSection';
import { DestinationCard } from '@/shared/ui/DestinationCard';
import {
  ShoppingBag, ShieldCheck, HeartPulse, Plane, Truck, Award, CheckCircle2,
  HelpCircle, ChevronRight, MessageSquare, Activity, Compass, Flame,
  FileText, Smartphone, User, Calendar, Star, Pill, Check
} from 'lucide-react';

// Custom high-fidelity outline SVG icons matching the mockup
const CategoryIcon = ({ name }: { name: string }) => {
  switch (name) {
    case "Antacids":
      return (
        <img
          src="/icons/Antacids.webp"
          alt="Antacids"
          className="w-10 h-10 object-contain"
        />
      );
    case "Pain Killers & Analgesics":
    case "Pain Relief":
      return (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
          <rect x="5" y="11" width="6" height="11" rx="3" transform="rotate(-45 5 11)" strokeLinecap="round" />
          <path d="M7.12 12.12L11.36 7.88" stroke="#14B8A6" />
          <circle cx="16" cy="15" r="5" strokeLinecap="round" />
          <line x1="13.5" y1="12.5" x2="18.5" y2="17.5" stroke="#14B8A6" />
        </svg>
      );
    case "Antimotility Drugs":
      return (
        <img
          src="/icons/Antimotility Drugs.webp"
          alt="Antimotility Drugs"
          className="w-10 h-10 object-contain"
        />
      );
    case "Laxative Stimulant":
    case "Laxative Stimulant for Constipation":
      return (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
          <path d="M12 3V6" strokeLinecap="round" />
          <path d="M8 8H16" strokeLinecap="round" />
          <path d="M9 8V18C9 19.1 9.9 20 11 20H13C14.1 20 15 19.1 15 18V8" strokeLinecap="round" />
          <path d="M12 11C12 11 10.5 13 10.5 14C10.5 14.83 11.17 15.5 12 15.5C12.83 15.5 13.5 14.83 13.5 14C13.5 13 12 11 12 11Z" fill="#14B8A6" stroke="#14B8A6" />
        </svg>
      );
    case "Antispasmodics":
      return (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
          <circle cx="12" cy="12" r="8" strokeLinecap="round" />
          <path d="M12 8A4 4 0 0 1 12 16A4 4 0 0 1 12 8" stroke="#14B8A6" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.5" fill="#14B8A6" />
        </svg>
      );
    case "Cough Suppressant":
      return (
        <img
          src="/icons/cough.webp"
          alt="Cough Suppressant"
          className="w-10 h-10 object-contain"
        />
      );
    case "Antibiotic":
      return (
        <img
          src="/icons/antibiotic.webp"
          alt="Antibiotic"
          className="w-10 h-10 object-contain"
        />
      );
    case "ORS Salts":
      return (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
          <rect x="5" y="5" width="8" height="12" rx="1" transform="rotate(-15 5 5)" />
          <path d="M11 14L16 19C16.6 19.6 17.4 20 18.2 20H19.5" stroke="#14B8A6" strokeLinecap="round" />
          <circle cx="16" cy="10" r="1.5" fill="#14B8A6" />
        </svg>
      );
    case "Antihistamine":
    case "Allergies":
      return (
        <img
          src="/icons/antihistamines.webp"
          alt="Antihistamine"
          className="w-10 h-10 object-contain"
        />
      );
    case "Motion Sickness Tablets":
      return (
        <img
          src="/icons/Motion Sickness Tablets.webp"
          alt="Motion Sickness Tablets"
          className="w-10 h-10 object-contain"
        />
      );
    case "Antiemetic":
      return (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" stroke="#14B8A6" strokeLinecap="round" />
        </svg>
      );
    case "Antipyretic (Fever)":
    case "Antipyretic":
      return (
        <img
          src="/icons/Antipyretic.svg"
          alt="Antipyretic"
          className="w-10 h-10 object-contain"
        />
      );
    case "Anti Cold":
      return (
        <img
          src="/icons/Anticold.webp"
          alt="Anti Cold"
          className="w-10 h-10 object-contain"
        />
      );
    case "Sore Throat Lozenges":
      return (
        <img
          src="/icons/sore-throat.webp"
          alt="Sore Throat Lozenges"
          className="w-10 h-10 object-contain"
        />
      );
    case "Pre & Probiotics":
    case "Digestion":
      return (
        <img
          src="/icons/probiotics.webp"
          alt="Pre & Probiotics"
          className="w-10 h-10 object-contain"
        />
      );
    case "Bandages & Plasters":
    case "Bandages":
    case "Bandages and Plasters":
      return (
        <img
          src="/icons/bandage.webp"
          alt="Bandages & Plasters"
          className="w-10 h-10 object-contain"
        />
      );
    case "First Aid Cotton":
    case "First Aid":
      return (
        <img
          src="/icons/bandage.webp"
          alt="First Aid Cotton"
          className="w-10 h-10 object-contain"
        />
      );
    default:
      return <Pill className="w-10 h-10 text-primary" />;
  }
};

const LoveIcon = ({ title }: { title: string }) => {
  switch (title) {
    case "Works Anywhere":
      return (
        <img
          src="/world.webp"
          alt="World"
          className="w-16 h-16 object-contain shrink-0"
        />
      );
    case "150+ Medicines":
      return (
        <img
          src="/medicine.webp"
          alt="150+ Medicines"
          className="w-16 h-16 object-contain shrink-0"
        />
      );
    case "Doctor Support":
      return (
        <img
          src="/doctor.webp"
          alt="Doctor Support"
          className="w-16 h-16 object-contain shrink-0"
        />
      );
    case "Fits in Cabin Bag":
      return (
        <img
          src="/luggage.webp"
          alt="Fits in Cabin Bag"
          className="w-16 h-16 object-contain shrink-0"
        />
      );
    default:
      return <Compass className="w-10 h-10 text-primary shrink-0" />;
  }
};

const DEFAULT_KIT_CATEGORIES = [
  { name: "Antacids" },
  { name: "Pain Killers & Analgesics" },
  { name: "Antimotility Drugs" },
  { name: "Laxative Stimulant" },
  { name: "Antispasmodics" },
  { name: "Cough Suppressant" },
  { name: "Antibiotic" },
  { name: "ORS Salts" },
  { name: "Antihistamine" },
  { name: "Motion Sickness Tablets" },
  { name: "Antiemetic" },
  { name: "Antipyretic (Fever)" },
  { name: "Anti Cold" },
  { name: "Sore Throat Lozenges" },
  { name: "Pre & Probiotics" },
  { name: "Bandages & Plasters" },
  { name: "First Aid Cotton" }
];

const DEFAULT_TRAVEL_SCENARIOS = [
  {
    title: "Airport Delays",
    symptoms: "Headache, body pain, or fatigue?",
    tagline: "We've got you covered.",
    image: "/scenarios/airport.webp",
    themeColor: "210 65% 28%"
  },
  {
    title: "Mountain Treks",
    symptoms: "Altitude sickness or motion issues?",
    tagline: "Stay safe, stay strong.",
    image: "/scenarios/mountain.webp",
    themeColor: "150 50% 25%"
  },
  {
    title: "Europe Trips",
    symptoms: "Cold, sore throat or allergies?",
    tagline: "Your health, uninterrupted.",
    image: "/scenarios/europe.webp",
    themeColor: "250 50% 30%"
  },
  {
    title: "Thailand Getaway",
    symptoms: "Stomach issues or food allergies?",
    tagline: "Enjoy without worries.",
    image: "/scenarios/thailand.webp",
    themeColor: "170 70% 25%"
  },
  {
    title: "Business Travel",
    symptoms: "Long meetings, stress or back pain?",
    tagline: "Stay productive always.",
    image: "/scenarios/business.webp",
    themeColor: "220 60% 22%"
  },
  {
    title: "Family Vacation",
    symptoms: "Fever, cough or minor injuries?",
    tagline: "We care for your family.",
    image: "/scenarios/family.webp",
    themeColor: "25 80% 32%"
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    loc: "• New York, USA",
    quote: "My husband got Bali Belly on day 3. Having the Travel Med kit in our hotel room saved us a trip to the local clinic!",
    rating: 5,
    flag: "🇺🇸"
  },
  {
    name: "David Chen",
    loc: "• San Francisco, USA",
    quote: "At 11,000 feet in Peru, I got a pounding headache. Took the meds from the kit and felt stable within an hour.",
    rating: 5,
    flag: "🇺🇸"
  },
  {
    name: "Emma Watson",
    loc: "• London, UK",
    quote: "The teleconsultation feature was amazing. Spoke to a doctor in minutes while stranded with a fever in Thailand.",
    rating: 5,
    flag: "🇬🇧"
  },
  {
    name: "Rahul Sharma",
    loc: "• Mumbai, India",
    quote: "Packed neatly in cabin baggage size. Perfect peace of mind for international family trips.",
    rating: 5,
    flag: "🇮🇳"
  }
];

const homeFaqs = [
  {
    id: 'home-faq-1',
    title: "What is included inside the Travel Med Kit?",
    content: (
      <span>
        The kit includes <strong className="font-bold text-slate-900 dark:text-white">150+ DCGI & CDSCO-approved medicines and essentials</strong> covering 17 critical categories (fever, food poisoning, acidity, allergies, pain, motion sickness, antibiotics, first aid, etc.) plus <strong className="font-bold text-slate-900 dark:text-white">2 FREE doctor teleconsultations</strong> and a signed physician prescription.
      </span>
    )
  },
  {
    id: 'home-faq-2',
    title: "How do the 2 FREE doctor teleconsultations work while traveling?",
    content: (
      <span>
        Inside your kit pouch and on your order confirmation, you will receive direct access to our teleconsultation portal. Scan the pouch QR code or click your private link to initiate a video call with a licensed General Physician or Orthopaedician in <strong className="font-bold text-slate-900 dark:text-white">under 3 minutes</strong> — available worldwide.
      </span>
    )
  },
  {
    id: 'home-faq-3',
    title: "Can I carry the Travel Med Kit on international flights?",
    content: (
      <span>
        <strong className="font-bold text-slate-900 dark:text-white">Yes, absolutely.</strong> All solid blister-packed tablets, capsules, and band-aids adhere strictly to TSA, IATA, and international airport security guidelines. The kit includes an official signed Doctor's Prescription matching all OTC & prescribed items for smooth customs clearance.
      </span>
    )
  },
  {
    id: 'home-faq-4',
    title: "What is the shelf life and expiry guarantee of the medicines?",
    content: (
      <span>
        We guarantee a minimum of <strong className="font-bold text-slate-900 dark:text-white">18 to 24 months shelf life</strong> on all medications from your date of purchase. Every item is individually stamped with clear expiry dates, batch codes, and English dosage guidelines.
      </span>
    )
  },
  {
    id: 'home-faq-5',
    title: "How fast is shipping and delivery?",
    content: (
      <span>
        We offer <strong className="font-bold text-slate-900 dark:text-white">FREE Express Shipping</strong> across India, delivering within 2-4 business days. Priority same-day or next-day dispatch is available for urgent upcoming trips at checkout.
      </span>
    )
  }
];

export default function HomePage() {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const [featuresActiveIndex, setFeaturesActiveIndex] = React.useState(0);
  
  // Dynamic State for Models
  const [kitCategories, setKitCategories] = React.useState<{name: string}[]>(DEFAULT_KIT_CATEGORIES);
  const [travelScenarios, setTravelScenarios] = React.useState<any[]>(DEFAULT_TRAVEL_SCENARIOS);
  const [testimonials, setTestimonials] = React.useState<any[]>(DEFAULT_TESTIMONIALS);

  React.useEffect(() => {
    // Fetch Dynamic Data from backend
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const safeFetch = (url: string) => fetch(url).catch(() => null);

      try {
        const [medRes, scenRes, testRes] = await Promise.all([
          safeFetch(`${baseUrl}/api/medicines`),
          safeFetch(`${baseUrl}/api/travel-scenarios`),
          safeFetch(`${baseUrl}/api/testimonials`)
        ]);
        
        if (medRes?.ok) {
          const medData = await medRes.json();
          // Extract unique categories if present, otherwise fall back to DEFAULT_KIT_CATEGORIES
          if (medData?.data?.length > 0) {
            const categories = Array.from(new Set(medData.data.map((m: any) => m.category))).map(name => ({ name: String(name) }));
            if (categories.length > 0) {
              setKitCategories(categories);
            }
          }
        }
        
        if (scenRes?.ok) {
          const scenData = await scenRes.json();
          if (scenData?.data?.length > 0) {
            setTravelScenarios(scenData.data);
          }
        }
        
        if (testRes?.ok) {
          const testData = await testRes.json();
          if (testData?.data?.length > 0) {
            setTestimonials(testData.data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch dynamic data:', err);
      }
    };
    
    fetchData();
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFeaturesActiveIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const trustFeatures = [
    {
      id: 0,
      icon: (
        <svg className="h-8 w-8 shrink-0 text-primary" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="10" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M4 16h32" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="10" cy="27" r="2.5" fill="currentColor" opacity="0.4" />
          <rect x="16" y="25" width="12" height="4" rx="2" fill="currentColor" opacity="0.4" />
          <path d="M28 6L20 3L12 6" stroke="#FF8C42" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      content: (
        <div>
          <div className="flex gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-[12px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
            Trusted by 10,000+<br />Travelers
          </p>
        </div>
      )
    },
    {
      id: 1,
      icon: (
        <svg className="h-8 w-8 shrink-0 text-primary" viewBox="0 0 40 40" fill="none">
          <path d="M20 4L6 10V22C6 29.7 12.3 36.5 20 38C27.7 36.5 34 29.7 34 22V10L20 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M14 20L18 24L27 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      content: (
        <p className="text-[12px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
          CDSCO Regulated<br />Medicines
        </p>
      )
    },
    {
      id: 2,
      icon: (
        <svg className="h-8 w-8 shrink-0 text-primary" viewBox="0 0 40 40" fill="none">
          <rect x="3" y="14" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <path d="M25 18H32L37 25V30H25V18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="10" cy="32" r="3" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="30" cy="32" r="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M7 14V10C7 8.9 7.9 8 9 8H23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      content: (
        <p className="text-[12px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
          Free Shipping<br />Across India
        </p>
      )
    },
    {
      id: 3,
      icon: (
        <svg className="h-8 w-8 shrink-0 text-primary" viewBox="0 0 40 40" fill="none">
          <circle cx="16" cy="14" r="6" stroke="currentColor" strokeWidth="2.5" />
          <path d="M6 34C6 28.5 10.5 24 16 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="29" cy="26" r="5" stroke="#14B8A6" strokeWidth="2.5" />
          <path d="M27 26H31M29 24V28" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      content: (
        <p className="text-[12px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
          2 Free<br />Teleconsultations
        </p>
      )
    },
    {
      id: 4,
      icon: (
        <svg className="h-8 w-8 shrink-0 text-primary" viewBox="0 0 40 40" fill="none">
          <rect x="10" y="6" width="20" height="28" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path d="M16 14h8M16 20h8M16 26h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="30" r="4.5" fill="#14B8A6" />
          <path d="M26.5 30l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      content: (
        <p className="text-[12px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
          Doctor's<br />Prescription
        </p>
      )
    }
  ];

  const handleBuyNow = () => {
    addItem({
      id: 'kit-standard-india',
      name: 'Travel Med Kit - Standard Package',
      price: 2900,
      type: 'kit',
      description: 'Includes 150+ curated medicines, doctor prescription, waterproof pouch, and 2 FREE teleconsultations worth ₹1,500.',
      options: {
        size: 'Solo'
      },
      quantity: 1
    });
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const trustBadges = [
    { text: "Trusted by 10,000+ Travelers", icon: <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> },
    { text: "CDSCO Regulated Medicines", icon: <ShieldCheck className="h-5 w-5 text-primary" /> },
    { text: "Free Shipping Across India", icon: <Truck className="h-5 w-5 text-primary" /> },
    { text: "2 Free Teleconsultations", icon: <MessageSquare className="h-5 w-5 text-primary" /> },
    { text: "Doctor's Prescription Included", icon: <FileText className="h-5 w-5 text-primary" /> }
  ];



  const loveFeatures = [
    { title: "Works Anywhere", desc: "Curated for international & domestic travel" },
    { title: "150+ Medicines", desc: "Covers all common ailments & emergencies" },
    { title: "Doctor Support", desc: "2 FREE consultations & signed prescription" },
    { title: "Fits in Cabin Bag", desc: "Compact, lightweight & travel friendly" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#DCEBFF] via-white to-[#EEF6FF] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 bg-fixed font-sans">

      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden home-hero-bg"
        style={{
          minHeight: '600px',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* MOBILE HERO VIEW (Mockup-inspired) */}
          <div className="flex lg:hidden flex-col text-center py-10 px-2 space-y-8 min-h-[580px] justify-between mobile-hero-container">
            {/* Header Pill Badge */}
            <div className="flex justify-center">
              <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-neutral-350 bg-white/90 dark:bg-neutral-900/90 border border-slate-200/60 dark:border-neutral-800/85 px-4.5 py-1.5 rounded-full whitespace-nowrap shadow-[0_4px_15px_rgba(15,23,42,0.02)]">
                150+ Medicines &bull; Doctor Prescription &bull; 2 Free Consults
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-4 pt-1 -translate-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight font-heading max-w-lg mx-auto">
                Your Health,<br />Anywhere in the World
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-350 max-w-md mx-auto leading-relaxed font-semibold">
                The complete travel pharmacy kit with 150+ curated medicines and essentials for every journey.
              </p>
            </div>

            {/* 4 Circular Icons Row */}
            <div className="flex items-stretch justify-around w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto pt-1 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 dark:border-neutral-800/60 -translate-y-8">
              {[
                { label: "150+ Medicines", icon: <Pill className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-secondary" /> },
                { label: "Doctor's Prescription", icon: <User className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-secondary" /> },
                { label: "2 FREE Consultations", icon: <Smartphone className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-secondary" /> },
                { label: "Trusted by Travelers", icon: <ShieldCheck className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-secondary" /> }
              ].map((feat, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div className="w-[1px] bg-slate-200/80 dark:bg-neutral-800/80 self-stretch my-1" />}
                  <div className="flex flex-col items-center text-center space-y-1.5 flex-1 px-0.5">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-neutral-850 flex items-center justify-center border border-slate-100 dark:border-neutral-800/60 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                      {feat.icon}
                    </div>
                    <span className="text-[10px] sm:text-[11.5px] md:text-[13px] font-bold text-slate-800 dark:text-neutral-300 leading-snug whitespace-normal max-w-[80px] sm:max-w-[100px] md:max-w-[110px]">
                      {feat.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Pouch Spacer - centers the background pouch in the gap */}
            <div className="h-60 sm:h-[340px] md:h-[420px] pointer-events-none mobile-pouch-spacer" />

            {/* Bottom Group (Features Card & BUY NOW button clustered together) */}
            <div className="space-y-4 max-w-sm sm:max-w-md md:max-w-lg mx-auto w-full">

              {/* Action Area */}
              <div className="w-full pt-1 space-y-3 -translate-y-8">
                <button
                  className="w-full bg-secondary hover:bg-secondary-dark text-white text-base sm:text-lg font-bold h-12 sm:h-14 rounded-[14px] shadow-lg shadow-secondary/15 transition-all duration-300 gap-2 flex items-center justify-center active:scale-95 cursor-pointer uppercase"
                  onClick={handleBuyNow}
                >
                  <ShoppingBag className="h-5 w-5" /> BUY NOW
                </button>

                <div className="flex justify-center items-center gap-3 text-[10px] sm:text-xs text-neutral-500 font-bold">
                  <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5 text-secondary" /> Free Express Shipping</span>
                  <span className="w-[1px] h-3 bg-slate-200 dark:bg-neutral-850" />
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Easy 7-Day Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP HERO VIEW (Original split layout) */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch" style={{ minHeight: '520px' }}>

            {/* ── LEFT: text sits on the outer vignette – no inner gradient ── */}
            <div className="flex flex-col justify-center py-14 pr-8 space-y-6">

              <Badge variant="primary" className="bg-secondary/10 text-secondary-dark border border-secondary/20 px-4 py-1.5 font-semibold text-xs rounded-full w-fit">
                Your Ultimate Health Companion on the Move
              </Badge>

              <h1 className="text-5xl sm:text-6xl font-black text-heading leading-tight tracking-tight font-heading">
                Never Let a Minor Illness<br />Ruin Your Journey
              </h1>

              <p className="text-body text-base leading-relaxed max-w-md">
                Travel Med Kit is your complete travel healthcare companion containing{' '}
                <strong>150+ curated medicines</strong>, a{' '}
                <strong>Doctor's Prescription</strong>, and{' '}
                <strong>FREE teleconsultations</strong>—designed for international & domestic travelers.
              </p>

              {/* Price block */}
              <div className="space-y-2.5">
                <div>
                  <span className="bg-[#FF8C42] text-white text-xs font-extrabold px-3 py-1 rounded-full tracking-wide">
                    35% OFF
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[42px] font-black text-secondary leading-none">₹2,900</span>
                  <span className="text-[18px] line-through text-neutral-400 font-medium">₹4,500</span>
                </div>
                <p className="text-xs text-neutral-500 font-medium leading-none">Inclusive of all taxes | Free shipping on all orders</p>
                <div className="pt-0.5">
                  <span className="inline-block text-xs font-bold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                    You save ₹1,600!
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  className="bg-secondary hover:bg-secondary-dark text-white text-[18px] font-semibold h-13 px-8 rounded-[14px] shadow-lg shadow-secondary/15 transition-all duration-300 gap-2 flex items-center justify-center active:scale-95 cursor-pointer"
                  onClick={handleBuyNow}
                >
                  <ShoppingBag className="h-5 w-5" /> Buy Now
                </button>
              </div>

              {/* Mini trust strip */}
              <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 pt-2 border-t border-neutral-200/80 text-[11px] sm:text-xs text-neutral-500 font-semibold">
                <span className="flex items-center gap-1 shrink-0"><Pill className="h-3.5 w-3.5 text-secondary" /> 150+ Medicines</span>
                <span className="flex items-center gap-1 shrink-0"><FileText className="h-3.5 w-3.5 text-secondary" /> Rx Prescription</span>
                <span className="flex items-center gap-1 shrink-0"><Award className="h-3.5 w-3.5 text-secondary" /> Doctor Approved</span>
                <span className="flex items-center gap-1 shrink-0"><MessageSquare className="h-3.5 w-3.5 text-secondary" /> 2 Free Consults</span>
              </div>
            </div>

            {/* ── RIGHT: transparent – overlaying the interactive badges on the background product image ── */}
            <div className="hidden lg:flex flex-col justify-between py-10 relative">

              {/* 150+ badge – top right of the kit bag */}
              <div className="absolute top-10 right-4 w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border-[6px] border-white bg-[#14B8A6] text-white z-10 transform hover:scale-105 transition-transform duration-300">
                <span className="text-[34px] font-black leading-none tracking-tight">150+</span>
                <span className="text-[10px] font-black uppercase tracking-wider mt-1">Curated</span>
                <span className="text-[10px] font-black uppercase tracking-wider">Medicines</span>
              </div>

              <div className="flex-1" />

            </div>

          </div>
        </div>

        {/* Teleconsultation banner – bottom right overlay of the entire screen */}
        <div className="hidden lg:flex absolute bottom-1 right-6 lg:right-1 bg-[#172B4D] text-white rounded-2xl p-4 items-center gap-4 shadow-2xl border border-white/10 max-w-sm hover:translate-y-[-2px] transition-transform duration-300 z-20">
          {/* Doctor Avatars */}
          <div className="flex -space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Doctor Female"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Doctor Male"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-bold leading-tight">
              Includes 2 FREE Teleconsultations worth ₹1,500
            </p>
            <p className="text-[10.5px] text-slate-300 font-medium tracking-wide mt-0.5">
              General Physician &amp; Orthopaedician access
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-10 pb-6">
        <div className="max-w-6xl mx-auto px-0 lg:px-8">
          
          {/* Desktop View */}
          <div className="hidden lg:flex flex-row overflow-visible gap-0 divide-x divide-slate-100 dark:divide-neutral-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-neutral-900 dark:to-neutral-950/40 border border-border rounded-2xl shadow-card p-2 w-full">
            {trustFeatures.map((feat) => (
              <div
                key={feat.id}
                className="flex items-center gap-3 py-1 px-4.5 flex-1 min-w-0 bg-transparent border-0 shadow-none rounded-none justify-start group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-all duration-300"
              >
                <div className="p-1.5 bg-slate-50 dark:bg-neutral-850 rounded-lg group-hover:scale-105 transition-transform duration-300">
                  {feat.icon}
                </div>
                {feat.content}
              </div>
            ))}
          </div>

          {/* Mobile Auto-Swiping Carousel */}
          <div className="lg:hidden flex flex-col items-center w-full max-w-none mx-auto px-0 -mt-2">
            <motion.div
              className="relative w-full h-[76px] bg-white dark:bg-neutral-900 border-y border-slate-100 dark:border-neutral-800/80 overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, info) => {
                if (info.offset.x < -40) {
                  setFeaturesActiveIndex((prev) => (prev + 1) % 5);
                } else if (info.offset.x > 40) {
                  setFeaturesActiveIndex((prev) => (prev - 1 + 5) % 5);
                }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuresActiveIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center gap-3.5 py-3.5 px-5 pointer-events-none"
                >
                  <div className="p-1.5 bg-slate-50 dark:bg-neutral-850 rounded-lg shrink-0">
                    {trustFeatures[featuresActiveIndex].icon}
                  </div>
                  <div className="text-left">
                    {trustFeatures[featuresActiveIndex].content}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Dot indicators */}
            <div className="flex gap-1.5 mt-3 select-none">
              {trustFeatures.map((feat) => (
                <button
                  key={feat.id}
                  onClick={() => setFeaturesActiveIndex(feat.id)}
                  className={`h-1.5 rounded-full transition-all duration-300 outline-none ${
                    featuresActiveIndex === feat.id 
                      ? 'w-5 bg-primary' 
                      : 'w-1.5 bg-slate-200 dark:bg-neutral-800'
                  }`}
                  aria-label={`Go to slide ${feat.id + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* 3. What's Included Grid explorer */}
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <ScrollReveal className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-heading">
              What's Included in the Kit
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* 17 Vector Category Cards — 6-col grid */}
            <ScrollReveal direction="up" delay={0.1} className="lg:col-span-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {kitCategories.map((cat: any, idx: number) => (
                <Card key={idx} hoverEffect={true} className="p-3 text-center flex flex-col items-center justify-center gap-2 border-border bg-gradient-to-br from-white to-slate-50/50 dark:from-neutral-900 dark:to-neutral-950/40 shadow-sm hover:border-primary/20">
                  <div className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors shrink-0">
                    <CategoryIcon name={cat.name} />
                  </div>
                  <h4 className="text-[11px] font-bold tracking-tight leading-snug">{cat.name}</h4>
                </Card>
              ))}
            </ScrollReveal>

            {/* Checklist right panel */}
            <ScrollReveal direction="up" delay={0.2} className="lg:col-span-4 space-y-6">
              <Card hoverEffect={false} className="p-8 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950/40 dark:to-neutral-900 border-border space-y-6">

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">150+ Curated Medicines</span>
                      <p className="text-neutral-400">Comprehensive selection covering all common travel ailments.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-border/40 pt-4">
                    <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">100% Trusted Quality</span>
                      <p className="text-neutral-400">CDSCO-regulated, premium Indian branded medicines.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-border/40 pt-4">
                    <CheckCircle2 className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">Complimentary Teleconsultations &amp; Prescription</span>
                      <p className="text-neutral-400">2 FREE consultations with General Physician and Orthopedician, including signed Doctor's Prescription.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                </div>

              </Card>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* 4. Why Travelers Love Travel Med */}
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <ScrollReveal className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight font-heading text-heading">
              Why Travelers Love Travel Med
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loveFeatures.map((feat: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 0.08} direction="up">
                <Card hoverEffect={true} className="p-6 bg-gradient-to-br from-white to-slate-50/50 dark:from-neutral-900 dark:to-neutral-950/40 border-border flex items-start gap-4 hover:border-primary/20 h-full">
                  <div className="text-slate-400 dark:text-slate-500 hover:text-primary transition-colors shrink-0">
                    <LoveIcon title={feat.title} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-100">{feat.title}</h4>
                    <p className="text-neutral-400 leading-normal">{feat.desc}</p>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Be Prepared. Travel Confidently. */}
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <ScrollReveal className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight font-heading text-heading">
              Be Prepared. Travel Confidently.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {travelScenarios.map((scen: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 0.06} direction="up" className="h-full">
                <DestinationCard
                  location={scen.title}
                  imageUrl={scen.image}
                  stats={scen.symptoms}
                  tagline={scen.tagline}
                  themeColor={scen.themeColor || "210 60% 30%"}
                  href="/buy"
                  buttonText="Explore Kit"
                  className="min-h-[260px] sm:min-h-[280px]"
                />
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 6.5 GMP, WHO, CDSCO, DCGI Approvals Section */}
      <ApprovalsSection />

      {/* 7. Trusted by Travelers Worldwide */}
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <ScrollReveal className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight font-heading text-heading">
              Trusted by Travelers Worldwide
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {testimonials.map((test: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 0.08} direction="up">
                <Card hoverEffect={true} className="p-6 bg-gradient-to-br from-white to-slate-50/50 dark:from-neutral-900 dark:to-neutral-950/40 border-border flex flex-col justify-between min-h-[220px] hover:border-primary/20 h-full">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Rating value={test.rating} />
                      <span className="text-base shrink-0">{test.flag}</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed italic">
                      "{test.quote}"
                    </p>
                  </div>

                  <div className="border-t border-border/40 pt-4 mt-4 flex items-center gap-2 text-xs">
                    <span className="font-bold">{test.name}</span>
                    <span className="text-neutral-400 font-semibold">{test.loc}</span>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 7.5. Frequently Asked Questions Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <ScrollReveal className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" /> Got Questions?
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-heading tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-neutral-400 text-sm max-w-xl mx-auto">
              Everything you need to know about our medical kit, flight customs compliance, and 24/7 doctor access.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Accordion items={homeFaqs} defaultOpenId="home-faq-1" />
          </ScrollReveal>

          <ScrollReveal className="text-center pt-2" delay={0.2}>
            <Link href="/faq">
              <Button variant="outline" className="px-8 py-3.5 rounded-full text-xs font-extrabold border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer">
                Explore Full Help Center & FAQs <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* 7.8 SEO & GEO Travel Healthcare Knowledge Index */}
      <section className="py-12 bg-slate-50/50 dark:bg-neutral-900/40 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
              Global Travel Medicine Directory & Health Search Index
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Explore essential medical kits, travel prescription rules, and instant physician advice for major global destinations.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
            {[
              { label: 'Best Travel Medical Kit', href: '/buy' },
              { label: 'International Travel First Aid Kit', href: '/buy' },
              { label: 'Prescription Travel Medical Kit', href: '/buy' },
              { label: 'Family Travel Medical Kit', href: '/buy' },
              { label: 'TSA Approved Travel Medicine Kit', href: '/buy' },
              { label: 'Bali Belly Medicine Kit', href: '/buy' },
              { label: 'Altitude Sickness Pills Travel', href: '/buy' },
              { label: 'Southeast Asia Travel Medicine List', href: '/buy' },
              { label: 'Travel Medicine for Europe Trip', href: '/buy' },
              { label: 'Medicines to Take to Thailand', href: '/buy' },
              { label: 'Traveler Diarrhea Kit', href: '/buy' },
              { label: 'Online Doctor Consultation While Traveling', href: '/teleconsultation' },
              { label: 'Telehealth for International Travelers', href: '/teleconsultation' },
              { label: 'Get Doctor Prescription Abroad Online', href: '/teleconsultation' },
              { label: '24/7 Video Doctor Travel Emergency', href: '/teleconsultation' },
              { label: 'Travel Clinic Online Video Call', href: '/teleconsultation' },
              { label: 'WHO GMP Approved Travel Medical Kit', href: '/buy' },
              { label: 'CDSCO DCGI Approved Travel Prescription', href: '/faq' },
              { label: 'Taking Prescription Medicines Through Airport Customs', href: '/faq' },
              { label: 'Customs Friendly Travel Medicine Pouch', href: '/buy' }
            ].map((kw, i) => (
              <Link
                key={i}
                href={kw.href}
                className="text-[11px] font-semibold text-slate-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-slate-200/80 dark:border-neutral-700/60 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors duration-200"
              >
                {kw.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="py-12 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={0.6}>
            <div
              className="relative overflow-hidden bg-[#F4F8FF] dark:bg-neutral-900 border border-[#E4EFFF] dark:border-neutral-800 p-8 sm:p-10 md:p-12 rounded-3xl shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 select-none"
            >
              {/* Glowing blur mesh backgrounds */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5 max-w-xl text-left relative z-10">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-[10px] font-black tracking-wider text-rose-600 bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/60 px-3.5 py-1 rounded-full uppercase">
                    Save 35% OFF
                  </span>
                  <span className="text-[10px] font-black tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/60 px-3.5 py-1 rounded-full uppercase">
                    You save ₹1,600!
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight leading-snug text-slate-900 dark:text-white">
                  Don't Leave Your Health to Chance.
                  <span className="block text-secondary mt-1">
                    Pack Travel Med. Travel Worry-Free.
                  </span>
                </h2>

                {/* High-End Mini Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-1 text-slate-650 dark:text-neutral-350 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>150+ Sourced Medicines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>2 Free Doctor Consultations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Signed Doctor Prescription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>24-Month Expiry Guarantee</span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#172B4D] dark:text-white">₹2,900</span>
                  <span className="text-lg line-through text-slate-400 font-medium">₹4,500</span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-650 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 rounded-full font-bold ml-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Free Express Shipping
                  </span>
                </div>
              </div>

              <div className="shrink-0 relative z-10 w-full lg:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full lg:w-auto px-12 py-5 text-base font-bold shadow-lg bg-secondary hover:bg-secondary-dark border-transparent text-white shadow-secondary/10 hover:shadow-xl hover:shadow-secondary/20 hover:scale-102 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                  onClick={handleBuyNow}
                >
                  <ShoppingBag className="h-5 w-5" /> Buy Now
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
