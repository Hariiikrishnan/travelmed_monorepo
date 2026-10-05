'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCart } from '@/shared/providers/CartProvider';
import { usePricing } from '@/shared/providers/ProductProvider';
import { CategoryIcon } from '@/shared/ui/CategoryIcon';
import { Rating } from '@/shared/ui/Rating';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { Accordion } from '@/shared/ui/Accordion';
import { ApprovalsSection } from '@/shared/ui/ApprovalsSection';
import { FloatingKit } from '@/shared/ui/FloatingKit';
import { BLOG_POSTS } from '@/entities/blog/posts';
import { DESTINATIONS } from '@/entities/destination/data';
import {
  ShoppingBag, ShieldCheck, Truck, ChevronRight, MessageSquare, Compass,
  FileText, Star, Pill, Check, ArrowRight, Quote, Stethoscope, Video
} from 'lucide-react';

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
    name: "Sowmya Ramakrishnan",
    loc: "• New York, USA",
    quote: "My husband got Bali Belly on day 3. Having the Travel Med kit in our hotel room saved us a trip to the local clinic!",
    rating: 5,
    flag: "🇺🇸"
  },
  {
    name: "Venkatesh Iyer",
    loc: "• San Francisco, USA",
    quote: "At 11,000 feet in Peru, I got a pounding headache. Took the meds from the kit and felt stable within an hour.",
    rating: 5,
    flag: "🇺🇸"
  },
  {
    name: "Ananya Nair",
    loc: "• London, UK",
    quote: "The teleconsultation feature was amazing. Spoke to a doctor in minutes while stranded with a fever in Thailand.",
    rating: 5,
    flag: "🇬🇧"
  },
  {
    name: "Ashwin Sundaram",
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
        Inside your kit pouch and on your order confirmation, you will receive direct access to our teleconsultation portal. Scan the pouch QR code or click your private link to book a consultation with a licensed General Physician or Orthopaedician — our team will contact you within <strong className="font-bold text-slate-900 dark:text-white">8–12 hours of booking</strong>.
      </span>
    )
  },
  {
    id: 'home-faq-3',
    title: "Can I carry the Travel Med Kit on international flights?",
    content: (
      <span>
        <strong className="font-bold text-slate-900 dark:text-white">Yes, absolutely.</strong> All solid blister-packed tablets, capsules, and band-aids are allowed under airport security rules for passengers. The kit includes an official signed Doctor's Prescription matching all OTC & prescribed items for smooth customs clearance.
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

const HERO_SLIDE_MS = 6000;
const HERO_SLIDES = [
  {
    src: '/herobg2.webp',
    position: '70% center',
    caption: 'Coastal escapes',
    eyebrow: 'Beach & island getaways',
    lines: ['Chase sunsets,', 'not pharmacies,', 'on every holiday.'],
    description:
      'New cuisines, sea swims and tropical heat can upset any holiday. Carry 150+ doctor-curated medicines for tummy troubles, fevers and scrapes, right in your bag.',
  },
  {
    src: '/herobg3.webp',
    position: '70% center',
    caption: 'Airport ready',
    eyebrow: 'Flight & customs ready',
    lines: ['Cleared for', 'take-off.', 'Covered on landing.'],
    description:
      "Liquid-free, compact and packed with a signed doctor's prescription for smooth security and customs checks, wherever you fly.",
  },
  {
    src: '/hero.webp',
    position: '75% center',
    caption: 'Every journey',
    eyebrow: 'Doctor-curated travel pharmacy',
    lines: ['Never let a', 'minor illness', 'ruin your journey.'],
    description:
      'The complete travel healthcare kit: 150+ curated medicines, a signed prescription and 2 free doctor teleconsultations for every trip.',
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-dark">
      <span className="h-px w-6 bg-secondary-dark" />
      {children}
    </span>
  );
}

export default function HomePageClient() {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();
  // Admin-managed price/MRP/stock
  const pricing = usePricing();
  const [currentHeroBgIndex, setCurrentHeroBgIndex] = React.useState(0);

  const [featuresActiveIndex, setFeaturesActiveIndex] = React.useState(0);

  // Dynamic State for Models
  const kitCategories: { name: string; icon?: string }[] = DEFAULT_KIT_CATEGORIES;
  const travelScenarios = DEFAULT_TRAVEL_SCENARIOS;
  const [testimonials, setTestimonials] = React.useState<any[]>(DEFAULT_TESTIMONIALS);

  const prefersReducedMotion = useReducedMotion();

  // Advance hero slides; restarts whenever the slide changes (auto or manual)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentHeroBgIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [currentHeroBgIndex]);

  React.useEffect(() => {
    // Fetch Dynamic Data from backend
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const safeFetch = (url: string) => fetch(url).catch(() => null);

      try {
        // Kit categories are the curated 17 (each with its own icon) — the medicines table uses broader groups
        const testRes = await safeFetch(`${baseUrl}/api/testimonials`);

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
    // Price unknown or out of stock: send shoppers to the product page, which explains the status
    if (!pricing?.inStock) {
      router.push('/buy');
      return;
    }
    addItem({
      id: pricing.product.id,
      name: pricing.product.name,
      price: pricing.price,
      type: 'kit',
      image: pricing.product.images[0],
      description: pricing.product.tagline,
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
      <section className="relative isolate overflow-hidden bg-white lg:bg-[#061a30] text-white">
        {/* One H1 for the page; the rotating visual headlines below are decorative text */}
        <h1 className="sr-only">
          TravelMed travel medical kit for international trips from India — doctor-curated medicines, a signed prescription and free doctor consultations
        </h1>
        {/* ── Background media ── */}
        {/* Desktop: cross-fading cinematic slides with slow zoom */}
        <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block">
          {HERO_SLIDES.map((slide, idx) => {
            const active = idx === currentHeroBgIndex;
            return (
              <motion.div
                key={slide.src}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              >
                <motion.img
                  src={slide.src}
                  alt=""
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: slide.position }}
                  initial={false}
                  animate={{ scale: active && !prefersReducedMotion ? 1.08 : 1 }}
                  transition={{ duration: active ? HERO_SLIDE_MS / 1000 + 1.2 : 0.01, ease: 'linear' }}
                />
              </motion.div>
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061a30]/95 via-[#061a30]/70 via-40% to-transparent to-75%" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#061a30]/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Mobile layout ── */}
          <div className="lg:hidden -mx-4 sm:-mx-6">
            {/* Photo panel with headline on the sky */}
            <div className="relative h-[min(56svh,480px)] min-h-[420px] overflow-hidden">
              <motion.img
                src="/mobilehero.webp"
                alt="Travel Med kit on a beach with passport and camera"
                fetchPriority="high"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
              />
              <div aria-hidden className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-[#061a30]/85 via-[#061a30]/45 to-transparent" />

              <div className="relative px-6 pt-6 text-center">
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md"
                >
                  <ShieldCheck className="h-3 w-3 text-secondary" /> Doctor-curated
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-4 text-[34px] sm:text-5xl font-extrabold font-heading tracking-tight leading-[1.05] !text-white drop-shadow-[0_2px_12px_rgba(6,26,48,0.35)]"
                >
                  Your health,
                  <span className="block bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">anywhere you go.</span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-3 text-sm text-white/85 max-w-[300px] mx-auto leading-relaxed"
                >
                  The doctor-curated travel pharmacy that fits in your bag.
                </motion.p>
              </div>
            </div>

            {/* Buy panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative -mt-8 rounded-t-[28px] bg-white px-5 pt-5 pb-8 text-heading shadow-[0_-20px_50px_rgba(6,26,48,0.18)]"
            >
              <div aria-hidden className="mx-auto -mt-1 mb-4 h-1 w-10 rounded-full bg-slate-200" />

              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Travel Med Kit</p>
                  {pricing ? (
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-heading text-[34px] font-extrabold tracking-tight leading-none text-heading">{pricing.priceText}</span>
                      {pricing.save > 0 && <span className="text-sm text-slate-400 line-through">{pricing.mrpText}</span>}
                    </div>
                  ) : (
                    <p className="mt-1 font-heading text-lg font-bold text-heading">See current price</p>
                  )}
                </div>
                <div className="text-right">
                  {pricing && pricing.save > 0 && (
                    <span className="inline-block rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      Save {pricing.saveText}
                    </span>
                  )}
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    {pricing && !pricing.inStock ? 'Out of stock' : 'Incl. all taxes'}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-background/60 py-3 text-center">
                {[
                  { icon: Pill, value: '150+', label: 'Medicines' },
                  { icon: Stethoscope, value: '2 Free', label: 'Doctor consults' },
                  { icon: FileText, value: 'Signed', label: 'Prescription' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="px-1.5">
                    <Icon className="mx-auto h-4 w-4 text-secondary-dark" />
                    <p className="mt-1.5 text-sm font-bold text-heading leading-none">{value}</p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="group mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[16px] bg-primary text-base font-bold text-white shadow-[0_12px_30px_rgba(11,79,140,0.30)] transition hover:bg-primary-dark active:scale-[0.98] cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" /> Buy Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-secondary-dark" /> Free express shipping</span>
                <span className="h-3 w-px bg-border" />
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary-dark" /> 7-day returns</span>
              </div>
            </motion.div>
          </div>

          {/* ── Desktop layout ── */}
          <div className="hidden lg:flex min-h-[680px] xl:min-h-[720px] items-center pt-14 pb-24">
            <div className="max-w-[620px]">
              {/* Per-slide copy is stacked in one grid cell so the height stays stable while cross-fading */}
              <div className="grid">
                {HERO_SLIDES.map((slide, idx) => {
                  const active = idx === currentHeroBgIndex;
                  return (
                    <motion.span
                      key={slide.src}
                      aria-hidden={!active}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: active ? 1 : 0, y: active ? 0 : -6 }}
                      transition={{ duration: 0.5, delay: active ? 0.15 : 0 }}
                      className="[grid-area:1/1] inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> {slide.eyebrow}
                    </motion.span>
                  );
                })}
              </div>

              <p className="mt-7 grid text-5xl xl:text-[64px] font-extrabold font-heading tracking-tight leading-[1.04] !text-white">
                {HERO_SLIDES.map((slide, idx) => {
                  const active = idx === currentHeroBgIndex;
                  return (
                    <motion.span
                      key={slide.src}
                      aria-hidden={!active}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: active ? 1 : 0, y: active ? 0 : -12 }}
                      transition={{ duration: 0.6, delay: active ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
                      className={`[grid-area:1/1] block ${active ? '' : 'pointer-events-none select-none'}`}
                    >
                      {slide.lines.map((line, i) => (
                        <span
                          key={line}
                          className={`block whitespace-nowrap ${i === slide.lines.length - 1
                              ? 'bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent'
                              : ''
                            }`}
                        >
                          {line}
                        </span>
                      ))}
                    </motion.span>
                  );
                })}
              </p>

              <div className="mt-6 grid max-w-[540px]">
                {HERO_SLIDES.map((slide, idx) => {
                  const active = idx === currentHeroBgIndex;
                  return (
                    <motion.p
                      key={slide.src}
                      aria-hidden={!active}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: active ? 1 : 0, y: active ? 0 : -8 }}
                      transition={{ duration: 0.6, delay: active ? 0.3 : 0 }}
                      className="[grid-area:1/1] text-lg text-white/75 leading-relaxed"
                    >
                      {slide.description}
                    </motion.p>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="group inline-flex h-14 items-center gap-2.5 rounded-[14px] bg-secondary pl-7 pr-6 text-base font-bold text-white shadow-[0_15px_40px_rgba(20,184,166,0.35)] transition hover:bg-secondary-dark active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5" /> Buy Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#inside-the-kit"
                  className="inline-flex h-14 items-center gap-2 rounded-[14px] border border-white/20 bg-white/5 px-6 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  See what&apos;s inside
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-9 flex items-center gap-6"
              >
                {pricing && (
                  <>
                    <div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-heading text-4xl font-extrabold tracking-tight text-white">{pricing.priceText}</span>
                        {pricing.save > 0 && <span className="text-lg text-white/50 line-through">{pricing.mrpText}</span>}
                      </div>
                      <p className="mt-1 text-xs text-white/60">
                        {pricing.inStock ? 'Inclusive of all taxes · Free shipping' : 'Currently out of stock'}
                      </p>
                    </div>
                    <span className="h-12 w-px bg-white/15" />
                  </>
                )}
                <div className="flex gap-6">
                  {[
                    { value: '150+', label: 'Medicines' },
                    { value: '17', label: 'Categories' },
                    { value: '2', label: 'Free consults' },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="font-heading text-2xl font-extrabold text-white leading-none">{s.value}</p>
                      <p className="mt-1.5 text-xs text-white/60">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Slide indicators with progress */}
              <div className="mt-12 flex items-center gap-5">
                {HERO_SLIDES.map((slide, idx) => {
                  const active = idx === currentHeroBgIndex;
                  return (
                    <button
                      key={slide.src}
                      type="button"
                      onClick={() => setCurrentHeroBgIndex(idx)}
                      aria-label={`Show slide ${idx + 1}: ${slide.caption}`}
                      aria-current={active}
                      className="group w-32 text-left cursor-pointer"
                    >
                      <span className="block h-[3px] overflow-hidden rounded-full bg-white/20">
                        {active && (
                          <motion.span
                            key={`progress-${currentHeroBgIndex}`}
                            className="block h-full rounded-full bg-secondary"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: HERO_SLIDE_MS / 1000, ease: 'linear' }}
                          />
                        )}
                      </span>
                      <span className={`mt-2 block text-xs font-medium transition ${active ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                        {slide.caption}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: teleconsultation glass card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute bottom-20 right-8 hidden xl:flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 pr-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
        >
          <div className="flex -space-x-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/doctor.webp" alt="" className="h-10 w-10 rounded-full border-2 border-white/80 object-cover object-top" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-secondary text-white">
              <Video className="h-4.5 w-4.5" />
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">2 free teleconsultations</p>
            <p className="mt-0.5 text-xs text-white/65">Worth ₹1,500 · GP &amp; Orthopaedician</p>
          </div>
        </motion.div>
      </section>

      {/* 2. Trust strip */}
      <section className="relative z-20 pt-2 lg:pt-0 lg:-mt-10 pb-6">
        <div className="max-w-6xl mx-auto px-0 lg:px-8">

          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-5 gap-px overflow-hidden rounded-[24px] border border-border bg-border shadow-[0_20px_50px_rgba(11,79,140,0.10)]">
            {trustFeatures.map((feat) => (
              <div
                key={feat.id}
                className="group flex items-center gap-3.5 bg-white px-5 py-5 transition-colors duration-300 hover:bg-slate-50/80"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 transition-transform duration-300 group-hover:scale-105">
                  {feat.icon}
                </div>
                {feat.content}
              </div>
            ))}
          </div>

          {/* Mobile Auto-Swiping Carousel */}
          <div className="lg:hidden flex flex-col items-center w-full px-4 -mt-2">
            <motion.div
              className="relative w-full h-[80px] rounded-[20px] bg-white border border-border shadow-[0_15px_40px_rgba(11,79,140,0.10)] overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
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
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center gap-3.5 px-5 pointer-events-none"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5">
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
                  className={`h-1.5 rounded-full transition-all duration-300 outline-none ${featuresActiveIndex === feat.id ? 'w-5 bg-primary' : 'w-1.5 bg-slate-300'
                    }`}
                  aria-label={`Go to slide ${feat.id + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. What's Included */}
      <section id="inside-the-kit" className="scroll-mt-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-3xl mx-auto text-center">
            <Eyebrow>Inside the kit</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              What&apos;s included in the kit
            </h2>
            <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed">
              {kitCategories.length} medicine categories, thoughtfully organised into one compact, travel-ready pouch.
            </p>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <ScrollReveal direction="up" delay={0.1} className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {kitCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_15px_40px_rgba(11,79,140,0.08)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background text-slate-500 transition-colors group-hover:text-primary [&_img]:h-8 [&_img]:w-8 [&_svg]:h-8 [&_svg]:w-8">
                      <CategoryIcon name={cat.name} icon={cat.icon} />
                    </div>
                    <h3 className="text-xs sm:text-[13px] font-semibold leading-snug text-heading">{cat.name}</h3>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} className="lg:col-span-4">
              <div className="relative h-full overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-8 text-white shadow-[0_30px_80px_rgba(11,79,140,0.25)]">
                <div aria-hidden className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-secondary/30 blur-[90px]" />
                <div className="relative flex h-full flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Every kit includes</p>
                  <ul className="mt-6 space-y-6">
                    {[
                      { title: '150+ Curated Medicines', desc: 'Comprehensive selection covering all common travel ailments.' },
                      { title: '100% Trusted Quality', desc: 'CDSCO-regulated, premium Indian branded medicines.' },
                      { title: 'Teleconsultations & Prescription', desc: "2 FREE consultations with a General Physician and Orthopaedician, plus a signed doctor's prescription." },
                    ].map((item) => (
                      <li key={item.title} className="flex gap-3.5">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                          <Check className="h-3.5 w-3.5 text-secondary" />
                        </span>
                        <div>
                          <p className="font-heading text-base font-bold text-white">{item.title}</p>
                          <p className="mt-1 text-sm text-white/65 leading-relaxed">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/buy"
                    className="group mt-8 lg:mt-auto inline-flex items-center justify-center gap-2 rounded-[14px] bg-white px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-slate-100"
                  >
                    View Full Kit Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Why Travelers Love Travel Med */}
      <section className="py-20 md:py-28 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-3xl mx-auto text-center">
            <Eyebrow>Why Travel Med</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Why travelers love Travel Med
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loveFeatures.map((feat: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 0.08} direction="up" className="h-full">
                <div className="group relative h-full overflow-hidden rounded-[24px] border border-border bg-background/50 p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]">
                  <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(11,79,140,0.08)] transition-transform duration-300 group-hover:scale-105">
                    <LoveIcon title={feat.title} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold font-heading">{feat.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Be Prepared. Travel Confidently. */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <ScrollReveal direction="up" className="max-w-2xl">
              <Eyebrow>Made for every journey</Eyebrow>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
                Be prepared. Travel confidently.
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.1}>
              <Link href="/buy" className="group inline-flex items-center gap-2 text-sm font-bold text-primary">
                Explore the kit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {travelScenarios.map((scen: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 0.06} direction="up" className="h-full">
                <Link
                  href="/buy"
                  className="group relative block aspect-[4/3] overflow-hidden rounded-[24px] bg-slate-200 shadow-[0_15px_40px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_30px_70px_rgba(11,79,140,0.18)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scen.image}
                    alt={scen.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {scen.tagline}
                    </span>
                    <h3 className="mt-2 text-xl sm:text-2xl font-extrabold font-heading !text-white">{scen.title}</h3>
                    <p className="mt-1.5 text-sm text-white/75">{scen.symptoms}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white opacity-90 transition group-hover:opacity-100">
                      Explore Kit
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GMP, WHO, CDSCO, DCGI Approvals Section */}
      <ApprovalsSection />

      {/* 7. Trusted by Travelers Worldwide */}
      <section className="py-20 md:py-28 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="max-w-3xl mx-auto text-center">
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-[1.1]">
              Trusted by travelers worldwide
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((test: any, idx: number) => (
              <ScrollReveal key={idx} delay={idx * 0.08} direction="up" className="h-full">
                <figure className="flex h-full flex-col rounded-[24px] border border-border bg-background/50 p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]">
                  <div className="flex items-center justify-between">
                    <Quote aria-hidden className="h-8 w-8 text-secondary/40" />
                    <Rating value={test.rating} />
                  </div>
                  <blockquote className="mt-5 flex-1 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                      {String(test.name || '?').charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-heading">{test.name}</p>
                      <p className="truncate text-xs text-slate-500">
                        {test.flag} {String(test.loc || '').replace(/^•\s*/, '')}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <ScrollReveal direction="up" className="lg:sticky lg:top-28">
                <Eyebrow>Got questions?</Eyebrow>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-heading tracking-tight leading-[1.1]">
                  Frequently asked questions
                </h2>
                <p className="mt-5 text-base text-slate-500 leading-relaxed">
                  Everything you need to know about our medical kit, flight customs compliance and doctor access.
                </p>
                <Link href="/faq" className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Explore the full Help Center
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-8">
              <ScrollReveal direction="up" delay={0.1}>
                <Accordion items={homeFaqs} defaultOpenId="home-faq-1" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA Banner */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" duration={0.6}>
            <div className="relative rounded-[32px] p-8 sm:p-12 md:p-14 text-white shadow-[0_40px_100px_rgba(11,79,140,0.25)]">
              {/* Background layer clips the glow blobs */}
              <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70]">
                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-[100px]" />
              </div>

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7">
                  {pricing && pricing.save > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                        Save {pricing.savePercent}%
                      </span>
                      <span className="rounded-full bg-secondary/20 border border-secondary/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-100">
                        You save {pricing.saveText}
                      </span>
                    </div>
                  )}
                  <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight !text-white leading-[1.1]">
                    Don&apos;t leave your health to chance.{' '}
                    <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">
                      Travel worry-free.
                    </span>
                  </h2>
                  <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium text-white/85">
                    {['150+ Sourced Medicines', '2 Free Doctor Consultations', 'Signed Doctor Prescription', '12-Month Expiry Guarantee'].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                          <Check className="h-3 w-3 text-secondary" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative rounded-[24px] border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
                    <FloatingKit className="mx-auto -mt-1 mb-6 w-[200px] sm:w-[230px]" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Travel Med Kit</p>
                    {pricing ? (
                      <div className="mt-3 flex items-baseline gap-3">
                        <span className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight text-white">{pricing.priceText}</span>
                        {pricing.save > 0 && <span className="text-lg text-white/50 line-through">{pricing.mrpText}</span>}
                      </div>
                    ) : (
                      <p className="mt-3 font-heading text-2xl font-bold text-white">See current price</p>
                    )}
                    <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal-100">
                      <Truck className="h-4 w-4" /> Free express shipping across India
                    </p>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-secondary px-6 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark active:scale-[0.99] cursor-pointer"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Buy Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 10. Travel health guides (internal links into the content hub) */}
      <section className="py-16 md:py-20 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Eyebrow>Travel health guides</Eyebrow>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight">
                Plan your trip like a doctor would
              </h2>
            </div>
            <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-bold text-primary">
              All articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {BLOG_POSTS.slice(0, 6).map((g) => (
              <Link
                key={g.slug}
                href={`/blog/${g.slug}`}
                className="group flex items-start justify-between gap-4 rounded-[20px] border border-border bg-background/50 p-5 transition hover:border-primary/25 hover:bg-white hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
              >
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-dark">{g.eyebrow}</span>
                  <span className="mt-1.5 block font-heading text-base font-bold leading-snug text-heading group-hover:text-primary">{g.title}</span>
                </span>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>

          <p className="mt-10 text-sm font-semibold text-heading">Medicines to carry, by destination</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => (
              <Link
                key={d.slug}
                href={`/travel-medicine-kit/${d.slug}`}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
