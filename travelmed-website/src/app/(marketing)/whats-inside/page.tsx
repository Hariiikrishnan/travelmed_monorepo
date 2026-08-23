'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Loaded dynamically from backend API
import { Medicine } from '@/types';
import { Drawer } from '@/shared/ui/Drawer';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { 
  Pill, 
  ShieldCheck, 
  Briefcase, 
  Download, 
  HelpCircle, 
  ChevronRight, 
  AlertTriangle,
  Flame,
  Search,
  Droplet,
  Compass,
  Wind,
  Shield,
  Activity,
  HeartPulse,
  Leaf,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Category tab definition with icons and mapping rules
interface CategoryTab {
  name: string;
  subText: string;
  icon: React.ComponentType<{ className?: string }>;
  colorTheme: {
    from: string;
    to: string;
    bg: string;
    text: string;
  };
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    name: 'Pain Relief & Analgesics',
    subText: 'Relieves pain, fever, headache, body ache and inflammation.',
    icon: Pill,
    colorTheme: {
      from: 'from-blue-600',
      to: 'to-indigo-700',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    }
  },
  {
    name: 'Digestive Care',
    subText: 'Soothes acidity, stomach burning, indigestion, and diarrhea.',
    icon: Activity,
    colorTheme: {
      from: 'from-teal-500',
      to: 'to-emerald-700',
      bg: 'bg-teal-50',
      text: 'text-teal-600'
    }
  },
  {
    name: 'Motion Sickness & Nausea',
    subText: 'Prevents vomiting, dizziness, and car, boat, or air sickness.',
    icon: Compass,
    colorTheme: {
      from: 'from-purple-500',
      to: 'to-indigo-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    }
  },
  {
    name: 'Cold, Cough & Throat',
    subText: 'Clears nose blocks, sinus pressure, and runny nose.',
    icon: Wind,
    colorTheme: {
      from: 'from-sky-500',
      to: 'to-blue-600',
      bg: 'bg-sky-50',
      text: 'text-sky-600'
    }
  },
  {
    name: 'Allergy & Antihistamines',
    subText: 'Relieves sneezing, insect bite swelling, rashes, and hives.',
    icon: HeartPulse,
    colorTheme: {
      from: 'from-amber-500',
      to: 'to-orange-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600'
    }
  },
  {
    name: 'Antibiotics & Antimicrobial',
    subText: 'Prescription-only antibiotics for chest, throat, and skin bacterial issues.',
    icon: Shield,
    colorTheme: {
      from: 'from-rose-500',
      to: 'to-red-700',
      bg: 'bg-rose-50',
      text: 'text-rose-600'
    }
  },
  {
    name: 'Hydration & Electrolytes',
    subText: 'Instant clinical rehydration for heat exhaustion or dehydration.',
    icon: Droplet,
    colorTheme: {
      from: 'from-cyan-500',
      to: 'to-blue-500',
      bg: 'bg-cyan-50',
      text: 'text-cyan-600'
    }
  },
  {
    name: 'First Aid & Wound Care',
    subText: 'Disinfectants, bandages, plasters, and topical healing creams.',
    icon: Plus,
    colorTheme: {
      from: 'from-emerald-500',
      to: 'to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600'
    }
  },
  {
    name: 'Vitamins & Supplements',
    subText: 'Daily immunity boosters, vitality minerals, and energy support.',
    icon: Leaf,
    colorTheme: {
      from: 'from-lime-500',
      to: 'to-emerald-600',
      bg: 'bg-lime-50',
      text: 'text-lime-600'
    }
  }
];

export default function WhatsInsidePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medicines`)
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setMedicines(body.data);
        }
      })
      .catch(err => console.error('Failed to fetch medicines', err))
      .finally(() => setLoading(false));
  }, []);

  const [activeTab, setActiveTab] = useState<string>('Pain Relief & Analgesics');
  const [activeMedicine, setActiveMedicine] = useState<Medicine | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  
  // Search input state
  const [searchTerm, setSearchTerm] = useState<string>('');

  // PDF download simulated state
  const [downloadProgress, setDownloadProgress] = useState<number>(-1);

  // Map the UI tab category to the data categories in data.ts
  const filteredMedicines = useMemo(() => {
    let list: Medicine[] = [];
    switch (activeTab) {
      case 'Pain Relief & Analgesics':
        list = medicines.filter(m => m.category === 'Pain Relief');
        break;
      case 'Digestive Care':
        list = medicines.filter(m => m.category === 'Digestion' && m.id !== 'med-avomine' && m.id !== 'med-ors');
        break;
      case 'Motion Sickness & Nausea':
        list = medicines.filter(m => m.id === 'med-avomine');
        break;
      case 'Cold, Cough & Throat':
        list = medicines.filter(m => m.category === 'Respiratory');
        break;
      case 'Allergy & Antihistamines':
        list = medicines.filter(m => m.category === 'Allergies');
        break;
      case 'Antibiotics & Antimicrobial':
        list = medicines.filter(m => m.category === 'Anti-Infectives');
        break;
      case 'Hydration & Electrolytes':
        list = medicines.filter(m => m.id === 'med-ors');
        break;
      case 'First Aid & Wound Care':
        list = medicines.filter(m => m.category === 'Wound Care');
        break;
      case 'Vitamins & Supplements':
        // Return a mock supplement since we focus on medical items
        list = [
          {
            id: 'med-multivitamin',
            name: 'Daily Multivitamins & Minerals',
            category: 'First Aid',
            description: 'Essential trace minerals and high-potency daily multivitamins to keep energy levels high and support immunity during time-zone shifts.',
            activeIngredient: 'Vitamin A, C, D3, B-Complex, Zinc & Iron',
            dosage: 'Take 1 tablet daily in the morning with breakfast.',
            warning: 'Do not take on an empty stomach. Consult doctor if pregnant.',
            sideEffects: 'None under standard consumption.',
            fdaStatus: 'FSSAI Approved / Dietary Supplement',
            travelNote: 'Provides daily nutritional cover when switching dietary habits abroad.',
            compartment: 'First Aid Pouch',
            alternative: 'A to Z Multivitamin, Becadexamin',
            symptoms: ['Fatigue', 'Low Immunity', 'Jetlag Recovery']
          }
        ];
        break;
      default:
        list = medicines;
    }

    // Apply search filter if active
    if (searchTerm.trim()) {
      return list.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.symptoms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return list;
  }, [activeTab, searchTerm, medicines]);

  // Current active category configuration details
  const activeCategoryConfig = useMemo(() => {
    return CATEGORY_TABS.find(t => t.name === activeTab) || CATEGORY_TABS[0];
  }, [activeTab]);

  const handleDownloadPDF = () => {
    if (downloadProgress >= 0) return;
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadProgress(-1);
            alert('Mock PDF downloaded: "Travel_Med_Kit_Composition_Guide.pdf"');
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      
      {/* Top Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-neutral-400 uppercase select-none">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-neutral-300" />
          <span className="text-neutral-500">What's Inside</span>
        </nav>
      </div>

      {/* Main Page Header Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Header Texts */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-slate-900">
              What's Inside<br />
              <span className="text-primary font-heading font-extrabold">The Travel Med Kit</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal max-w-lg">
              Carefully curated with 150+ essential medicines and healthcare items to help you handle common travel ailments with confidence.
            </p>
            
            {/* Value Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-xs font-bold shadow-xs">
                <Pill className="h-4 w-4" />
                150+ Curated Items
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 text-teal-600 rounded-full border border-teal-100 text-xs font-bold shadow-xs">
                <ShieldCheck className="h-4 w-4" />
                CDSCO Regulated
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-xs font-bold shadow-xs">
                <Briefcase className="h-4 w-4" />
                Travel Ready
              </span>
            </div>
          </div>

          {/* Product visual crop */}
          <div className="lg:col-span-4 flex justify-center items-center relative">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[340px] aspect-square flex justify-center items-center select-none"
            >
              <img 
                src="/products.webp" 
                alt="Travel Med Kit pouch and items" 
                className="object-contain w-full h-full drop-shadow-[0_20px_40px_rgba(11,79,140,0.12)]"
              />
            </motion.div>
          </div>

          {/* Introductory Offer Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_12px_40px_rgba(15,23,42,0.04)] text-left space-y-4">
              <div className="space-y-1">
                <span className="inline-block text-[9px] font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md uppercase">
                  Introductory Offer
                </span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">₹2,900</span>
                  <span className="text-base text-slate-400 font-medium line-through">₹4,500</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Inclusive of all taxes<br />
                Free shipping on all orders
              </div>

              <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold text-center border border-emerald-100">
                You save ₹1,600!
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Sticky Horizontal Categories Tab Bar */}
      <section className="bg-white border-y border-slate-100 sticky top-20 z-header shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1 select-none">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setVisibleCount(6); // Reset grid pagination
                  }}
                  className={`flex items-center gap-2 py-4 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition select-none outline-none ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-400 hover:text-slate-600'
                  }`}
                >
                  <TabIcon className={`h-4.5 w-4.5 transition ${isActive ? 'text-primary' : 'text-neutral-400'}`} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Main Body Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Products Grid */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Category Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-4 items-start sm:items-center">
                <div className={`p-4 rounded-2xl ${activeCategoryConfig.colorTheme.bg} ${activeCategoryConfig.colorTheme.text} shrink-0`}>
                  {React.createElement(activeCategoryConfig.icon, { className: "h-7 w-7" })}
                </div>
                <div className="space-y-1 text-left">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 leading-tight">
                    {activeCategoryConfig.name}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium">
                    {activeCategoryConfig.subText}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 text-slate-500 border border-slate-100 rounded-full px-4 py-1.5 text-xs font-extrabold shrink-0 self-start sm:self-center">
                {filteredMedicines.length} {filteredMedicines.length === 1 ? 'Item' : 'Items'}
              </div>
            </div>

            {/* Local Filter/Search Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search within this category (e.g. fever, runny nose)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition"
              />
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-neutral-400" />
            </div>

            {/* Grid of Medical Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredMedicines.length === 0 ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full py-16 text-center space-y-3 bg-white border border-dashed border-slate-200 rounded-3xl"
                  >
                    <HelpCircle className="h-10 w-10 text-neutral-300 mx-auto" />
                    <h4 className="text-base font-bold text-slate-700">No matching medicines found</h4>
                    <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                      We couldn't find items matching "{searchTerm}" under {activeTab}. Try another keyword or clear search.
                    </p>
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')} 
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                  </motion.div>
                ) : (
                  filteredMedicines.slice(0, visibleCount).map((med) => (
                    <motion.div
                      layout
                      key={med.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <button
                        onClick={() => setActiveMedicine(med)}
                        className="w-full text-left group cursor-pointer focus:outline-none block"
                      >
                        <Card
                          hoverEffect={true}
                          className="bg-white border border-slate-100 p-5 rounded-3xl shadow-[0_4px_25px_rgba(15,23,42,0.02)] h-full flex flex-col justify-between hover:shadow-[0_12px_35px_rgba(11,79,140,0.06)] hover:border-slate-200/50 transition-all duration-300 min-h-[350px]"
                        >
                          {/* CSS Coded Realistic Medical Pouch/Box representation */}
                          <div className="space-y-4 w-full flex-1 flex flex-col justify-between">
                            
                            {/* realistic 3d-like packaging visual */}
                            <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-center p-4 overflow-hidden group-hover:scale-[1.02] transition duration-300 shadow-inner select-none">
                              
                              {/* Box Illustration */}
                              <div className="w-[120px] h-[75px] rounded-lg bg-white shadow-[5px_8px_20px_rgba(0,0,0,0.08)] border border-slate-200/20 relative flex flex-col justify-between p-2.5 overflow-hidden select-none">
                                {/* Color strip */}
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${activeCategoryConfig.colorTheme.from} ${activeCategoryConfig.colorTheme.to}`} />
                                
                                {/* Tiny Brand */}
                                <div className="flex justify-between items-center text-[7px] font-bold text-neutral-400 uppercase select-none pt-1">
                                  <span>TravelMed</span>
                                  <ShieldCheck className="h-2 w-2 text-primary" />
                                </div>

                                {/* Product Name */}
                                <div className="text-[9px] font-bold text-slate-800 leading-tight select-none line-clamp-2">
                                  {med.name}
                                </div>

                                {/* Active ingredients footer on box */}
                                <div className="flex justify-between items-center text-[6px] font-medium text-neutral-400 select-none">
                                  <span className="truncate max-w-[65px]">{med.activeIngredient}</span>
                                  <span className="bg-slate-100 text-slate-600 px-1 rounded-sm uppercase font-bold shrink-0">
                                    Cpt {med.compartment}
                                  </span>
                                </div>

                                {/* Gloss overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                              </div>

                              {/* Realistic pills background decoration */}
                              <div className="absolute bottom-2 right-3 opacity-40">
                                <Pill className="h-8 w-8 text-neutral-300 transform rotate-45" />
                              </div>
                            </div>

                            {/* Text Info */}
                            <div className="space-y-2 text-left">
                              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                <span>Compartment {med.compartment}</span>
                                <span className={activeCategoryConfig.colorTheme.text}>{med.fdaStatus.split(' ')[0]}</span>
                              </div>
                              <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-primary transition duration-200">
                                {med.name}
                              </h3>
                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                {med.description}
                              </p>
                            </div>

                          </div>

                          {/* Footer Details Call */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider w-full select-none">
                            <span>Dosage & Details</span>
                            <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Card>
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Pagination View All Trigger */}
            {filteredMedicines.length > visibleCount && (
              <div className="flex justify-center pt-2 select-none">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="flex items-center gap-1.5 px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-full text-xs font-bold shadow-xs transition select-none cursor-pointer"
                >
                  <span>View All {filteredMedicines.length} Items</span>
                  <ChevronRight className="h-4 w-4 transform rotate-90" />
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Sidebar Widgets */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* About the kit bullet widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.02)] space-y-5 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                About The Kit
              </h3>
              <ul className="space-y-3.5">
                {[
                  '150+ curated medicines & essentials',
                  'CDSCO regulated & trusted Indian brands',
                  'Compact, lightweight & travel friendly',
                  '2 FREE teleconsultations included',
                  'Suitable for all age groups'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-500 font-semibold leading-normal">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PDF guide download widget */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.02)] space-y-4 text-left">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Want Full List?
              </h3>
              <p className="text-slate-400 text-xs leading-normal">
                Download the complete list of medicines included in the kit.
              </p>
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 py-3 rounded-2xl text-xs font-bold shadow-xs transition select-none cursor-pointer relative overflow-hidden"
              >
                {downloadProgress >= 0 ? (
                  <>
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 bg-emerald-500/10"
                      style={{ width: `${downloadProgress}%` }}
                    />
                    <span className="relative z-1">Downloading ({downloadProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4.5 w-4.5 text-slate-500" />
                    <span>Download Full List (PDF)</span>
                  </>
                )}
              </button>
            </div>

            {/* Doctor Consultation CTA widget */}
            <div className="bg-teal-50/30 rounded-3xl p-6 border border-teal-100/50 text-left space-y-4">
              <div className="flex gap-3 items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-neutral-100">
                  <img 
                    src="https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150&h=150" 
                    alt="Doctor profile portrait" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] font-extrabold text-teal-600 uppercase tracking-wider">Online Assistant</span>
                  <span className="block text-xs font-bold text-slate-800">Dr. Priya Patel</span>
                </div>
              </div>
              <div className="space-y-3.5">
                <p className="text-slate-500 text-xs leading-normal">
                  Not sure what you need? Book a FREE consultation with our doctors and get personalized guidance.
                </p>
                <Link 
                  href="/teleconsultation" 
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-teal-600 hover:text-teal-700 hover:underline select-none"
                >
                  <span>Book Consultation</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* Footer Disclaimer Banner */}
      <footer className="bg-slate-100 border-t border-slate-200/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 items-start text-[11px] sm:text-xs text-slate-400 font-semibold leading-relaxed max-w-4xl">
            <AlertTriangle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Disclaimer: This kit is for travel use and not a substitute for professional medical advice. Please consult a doctor for serious or persistent conditions.
            </p>
          </div>
        </div>
      </footer>

      {/* Medicine Details Drawer */}
      <Drawer
        isOpen={!!activeMedicine}
        onClose={() => setActiveMedicine(null)}
        title={activeMedicine?.name}
        size="md"
      >
        {activeMedicine && (
          <div className="space-y-6 text-left">
            
            {/* Category tag */}
            <div className="flex items-center gap-2 select-none">
              <Badge variant="primary">Compartment {activeMedicine.compartment}</Badge>
              <Badge variant="secondary">{activeMedicine.category}</Badge>
            </div>

            {/* Description */}
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold">
              {activeMedicine.description}
            </p>

            {/* Details table */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Active Ingredient
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-800">{activeMedicine.activeIngredient}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Dosage Guidelines
                </span>
                <p className="text-xs text-slate-500 leading-normal font-semibold">{activeMedicine.dosage}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Regulatory Approval
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                  <span>{activeMedicine.fdaStatus}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Common Alternatives / Indian Brands
                </span>
                <span className="text-xs font-bold text-slate-800">{activeMedicine.alternative}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                  Travel & Customs Note
                </span>
                <p className="text-xs text-slate-500 leading-normal bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-semibold">
                  {activeMedicine.travelNote}
                </p>
              </div>

              {activeMedicine.warning && (
                <div className="space-y-1 text-red-600 bg-red-50/50 p-3.5 rounded-2xl border border-red-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                    Warning Label
                  </span>
                  <p className="text-xs leading-normal font-bold">{activeMedicine.warning}</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-4 select-none">
              <Button variant="outline" fullWidth onClick={() => setActiveMedicine(null)}>
                Close Details
              </Button>
            </div>

          </div>
        )}
      </Drawer>

    </div>
  );
}
