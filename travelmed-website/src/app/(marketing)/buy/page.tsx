'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/shared/providers/CartProvider';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Rating } from '@/shared/ui/Rating';
import { 
  Plus, 
  Minus, 
  ShieldCheck, 
  Check, 
  Truck, 
  Sparkles, 
  MessageSquare, 
  Award, 
  Star, 
  Pill, 
  ShoppingBag, 
  Lock, 
  ChevronDown, 
  FileText 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Gallery images (defined statically outside component to prevent needless re-renders/timer resets)
const images = [
  '/pro.webp',       // Premium bag close-up
  '/products.webp', // Full kit spread — all medicines & bag
  '/products/trollybag.webp', // Kit in trolley bag
  '/products/handbag.webp', // Kit in handbag
  '/products/backpack.webp', // Kit in backpack
  '/products/all rounder.webp', // Kit all-rounder display
];

export default function BuyPage() {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play interval: shifts every 4 seconds (best practices for user attention and detail digestion)
  // Stops automatically if the user manually clicks/inspects a thumbnail to preserve their control.
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveImageIdx((prevIdx) => (prevIdx + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Accordion open/close states
  const [isWhatOpen, setIsWhatOpen] = useState(true);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [isWhatExpanded, setIsWhatExpanded] = useState(false);

  const unitPrice = 2900;
  const oldPrice = 4500;
  const totalPrice = unitPrice * quantity;

  const handleAddToBag = () => {
    addItem({
      id: 'kit-standard-india',
      name: 'Travel Med Kit - Standard Package',
      price: unitPrice,
      type: 'kit',
      description: 'Includes 150+ curated medicines, doctor prescription, waterproof pouch, and 2 FREE teleconsultations worth ₹1,500.',
      options: {
        size: 'Solo'
      },
      quantity
    });
  };

  const handleBuyNow = () => {
    handleAddToBag();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const categories = [
    { name: "Antacids", desc: "For acidity and heartburn" },
    { name: "Pain Killers & Analgesics", desc: "For body pain & headache" },
    { name: "Antimotility Drugs", desc: "For loose motions" },
    { name: "Laxative Stimulant for Constipation", desc: "For stomach clearing" },
    { name: "Antispasmodics", desc: "For abdominal spasms" },
    { name: "Cough Suppressant", desc: "For dry/wet cough" },
    { name: "Antibiotic", desc: "For bacterial infections" },
    { name: "ORS Salts", desc: "For dehydration prevention" },
    { name: "Antihistamine", desc: "For allergies & sneezing" },
    { name: "Motion Sickness Tablets", desc: "For vomit & nausea in travel" },
    { name: "Antiemetic", desc: "For morning sickness & vomit" },
    { name: "Antipyretic (Fever)", desc: "For temperature control" },
    { name: "Anti Cold", desc: "For runny nose & head block" },
    { name: "Sore Throat Lozenges", desc: "For throat irritation relief" },
    { name: "Pre & Probiotics", desc: "For gut health maintenance" },
    { name: "Bandages & Plasters", desc: "For wounds & cuts wrapping" },
    { name: "First Aid Cotton", desc: "For dressing & sanitization" }
  ];

  const benefits = [
    {
      title: "150+ Curated Medicines",
      desc: "Comprehensive selection covering all common travel ailments and emergency events."
    },
    {
      title: "100% Trusted Quality",
      desc: "CDSCO-regulated, premium Indian branded medicines checked for quality and long shelf life."
    },
    {
      title: "Complimentary Teleconsultations & Prescription",
      desc: "2 FREE consultations with General Physician and Orthopaedician, including signed Doctor's Prescription."
    }
  ];

  const specs = [
    {
      id: 'spec-1',
      title: 'Pouch Specifications',
      icon: <Sparkles className="h-5 w-5 text-primary" />,
      content: (
        <ul className="space-y-1.5 text-xs md:text-sm">
          <li><strong>Dimensions:</strong> Standard (8.2 &times; 5.5 &times; 2.4 in)</li>
          <li><strong>Material:</strong> 1680D Ballistic Nylon (shockproof)</li>
          <li><strong>Zipper:</strong> YKK Waterproof Aquaguard Slider</li>
          <li><strong>TSA Rating:</strong> Liquid-free, carry-on compliant</li>
        </ul>
      )
    },
    {
      id: 'spec-2',
      title: 'Medical Compliance & Ingredients',
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      content: (
        <p className="text-xs md:text-sm leading-relaxed">
          All medications are individually blistered and sourced directly from FDA-approved labs, meeting USP guidelines. Expiry dates are monitored and guaranteed for a minimum of 24 months from purchase.
        </p>
      )
    },
    {
      id: 'spec-3',
      title: 'Doctor Teleconsult Policy',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      content: (
        <p className="text-xs md:text-sm leading-relaxed">
          Every purchase includes 2 FREE teleconsultations with a General Physician and Orthopaedician, including a signed Doctor's Prescription. Connect with experienced doctors anywhere in the world, anytime you need.
        </p>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#DCEBFF] via-white to-[#EEF6FF] bg-fixed dark:bg-neutral-950">
      
      {/* Immersive Purchase Section */}
      <section className="py-8 md:py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-500">Travel Med Kit Bundle</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Gallery & Social Proof Summary */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Image Frame */}
              <div className="w-full h-[260px] sm:h-[340px] md:h-[400px] bg-white dark:bg-neutral-900 rounded-3xl border border-blue-100 dark:border-neutral-800 overflow-hidden relative group shadow-sm flex items-center justify-center">
                <div className="absolute inset-0 bg-mesh opacity-5 pointer-events-none" />
                <img
                  src={images[activeImageIdx]}
                  alt="Product view"
                  className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-102"
                />
                
                <Badge variant="primary" className="absolute top-6 left-6 shadow-md bg-secondary text-white border-transparent text-xs font-bold py-1 px-3">
                  ★ CDSCO REGULATED
                </Badge>
              </div>
 
              {/* Thumbnails */}
              <div className="flex gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIdx(idx);
                      setIsAutoPlaying(false); // Stop autoplay when user manually selects an image
                    }}
                    className={`w-20 h-20 rounded-2xl border overflow-hidden cursor-pointer transition ${
                      activeImageIdx === idx 
                        ? 'border-secondary ring-4 ring-secondary/15 scale-95 shadow-inner' 
                        : 'border-blue-100 bg-white dark:bg-neutral-900 opacity-80 hover:opacity-100 hover:scale-95'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>

              {/* Desktop Configurator Controls & Sub-strip (hidden on mobile) */}
              <div className="hidden lg:block space-y-4">
                {/* Configurator Controls: Quantity & Checkout */}
                <div className="pt-4 border-t border-blue-100/60 space-y-4">
                  {/* Quantity Block */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">Quantity</span>
                    <div className="flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-full p-1 select-none shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 rounded-full text-neutral-500 hover:text-foreground cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1.5 rounded-full text-neutral-500 hover:text-foreground cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Final Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={handleAddToBag}
                      className="w-full bg-gradient-to-r from-secondary to-teal-500 hover:from-secondary-dark hover:to-teal-600 text-white text-[15px] sm:text-[16px] font-bold h-13 rounded-[14px] shadow-lg shadow-secondary/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                    </button>
                     <button 
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-[15px] sm:text-[16px] font-bold h-13 rounded-[14px] transition-all duration-300 flex items-center justify-center active:scale-95 cursor-pointer shadow-lg shadow-primary/10"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* Sub-strip specifications & Secure Badges */}
                <div className="pt-2 text-center space-y-3">
                  <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <ShieldCheck className="h-4 w-4 text-secondary" />
                      <span>Complimentary consultations &amp; Rx</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Truck className="h-4 w-4 text-secondary" />
                      <span>Free express delivery in India</span>
                    </div>
                  </div>

                  {/* Secure trust checkout seal */}
                  <div className="flex items-center justify-center gap-1 text-[9px] text-neutral-400 font-black tracking-wider uppercase select-none opacity-80 pt-1">
                    <Lock className="h-3 w-3 text-neutral-400" />
                    <span>100% SECURE TRANSACTIONS &bull; CDSCO COMPLIANT PHARMACY</span>
                  </div>
                </div>
              </div>

              {/* Social Proof Trust Strip */}
              <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl p-5 border border-blue-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=64&h=64" alt="Doctor" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                    <span className="w-8 h-8 rounded-full bg-secondary text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">4.9</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <Rating value={5} />
                      <span className="text-[12px] font-bold text-neutral-800 dark:text-neutral-200">4.9/5 Rating</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">1,240+ Verified Travelers</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center text-[10px] text-neutral-400 font-semibold tracking-wider uppercase border-t sm:border-t-0 sm:border-l border-neutral-200/60 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-[#14B8A6]" /> SECURE SSL</span>
                  <span className="flex items-center gap-1"><Award className="h-4 w-4 text-[#14B8A6]" /> FDA FACILITY</span>
                </div>
              </div>

            </div>
            
            {/* Right Column: Premium Configurator Panel */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
              
              {/* Product Heading & Review Quick-Hook */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <Rating value={5} />
                  <span className="text-secondary hover:underline cursor-pointer">5.0 (1,240+ Reviews)</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-neutral-900 dark:text-white leading-tight">
                  The Travel Med Kit
                </h1>
                
                <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                  Complete Travel Pharmacy &amp; Medical Pouch
                </p>
              </div>

              {/* Price Details - Redesigned as Value Document Card */}
              <div className="bg-[#EAF4FE]/60 dark:bg-neutral-900/40 border border-blue-200/60 dark:border-neutral-800 rounded-2xl p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-3 py-1 rounded-full">
                    Save 35% OFF
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 px-3 py-1 rounded-full">
                    You save ₹1,600!
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-[44px] font-black text-secondary leading-none">₹2,900</span>
                  <span className="text-[18px] line-through text-neutral-400 font-medium">₹4,500</span>
                </div>

                <p className="text-xs text-neutral-500 font-bold border-t border-blue-100/60 pt-2.5 pb-1 leading-normal">
                  Inclusive of all taxes | Free express shipping on all orders
                </p>

                {/* Complimentary Value Box - Integrated inside pricing card */}
                <div className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-emerald-500/15 dark:border-emerald-500/10 rounded-xl p-3.5 shadow-[0_2px_12px_rgba(16,185,129,0.02)] flex items-start gap-3 mt-1.5">
                  <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Visual Medical Telehealth Icon */}
                  <div className="p-2.5 bg-emerald-500 text-white dark:bg-emerald-600 rounded-lg shrink-0 shadow-md shadow-emerald-500/10 mt-0.5">
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>

                  {/* Text and Badges */}
                  <div className="space-y-1 text-left flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[8.5px] font-black tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                        Included Free
                      </span>
                      <span className="text-[8.5px] font-black tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md font-bold">
                        ₹1,500 Value
                      </span>
                    </div>
                    
                    <h4 className="text-[12.5px] font-extrabold text-slate-800 dark:text-emerald-300 font-heading leading-tight">
                      2 Free Teleconsultations &amp; Signed Rx
                    </h4>
                    
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal font-normal">
                      Get instant access to licensed General Physicians &amp; Orthopaedicians. Includes a signed Doctor's Prescription ready for customs or travel verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Brief Description */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-slate-400 leading-relaxed font-normal">
                Your complete healthcare companion for global adventures. Pre-packed with <strong className="font-bold text-neutral-800 dark:text-neutral-100">150+ curated medicines</strong> and essentials, tested &amp; trusted by travelers worldwide. Includes a <strong className="font-bold text-neutral-800 dark:text-neutral-100">signed Doctor's Prescription</strong> and <strong className="font-bold text-neutral-800 dark:text-neutral-100">FREE teleconsultations</strong>.
              </p>

              {/* Senior Level Premium Accordions */}
              <div className="space-y-3">
                
                {/* 1. What's Included Accordion */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
                  <button
                    onClick={() => setIsWhatOpen(!isWhatOpen)}
                    className="flex justify-between items-center w-full px-5 py-4 text-left font-bold text-[14px] font-heading text-neutral-900 dark:text-white select-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <span>What's Included in the Kit</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-neutral-400 transition-transform duration-200 ${isWhatOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isWhatOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900">
                      <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mb-4">150+ Lifesaving Items</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {categories.map((cat, idx) => {
                          const isHiddenOnMobile = idx >= 6 && !isWhatExpanded;
                          return (
                            <div 
                              key={idx} 
                              className={`items-start gap-2.5 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/20 dark:bg-neutral-950/20 hover:border-primary/20 dark:hover:border-neutral-700 transition-colors ${
                                isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
                              }`}
                            >
                              <div className="mt-0.5 p-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md shrink-0">
                                <Check className="h-3.5 w-3.5" />
                              </div>
                              <div className="text-left space-y-0.5">
                                <h4 className="text-[12px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
                                  {cat.name}
                                </h4>
                                <p className="text-[10px] text-slate-400 dark:text-neutral-450 font-semibold leading-normal font-sans">
                                  {cat.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Mobile Expansion Buttons */}
                      <div className="sm:hidden mt-4">
                        <button
                          onClick={() => setIsWhatExpanded(!isWhatExpanded)}
                          className="w-full py-2.5 text-center text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 active:scale-98 rounded-xl transition-all duration-200"
                        >
                          {isWhatExpanded ? 'Show Less' : `+ View All ${categories.length} Items`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Key Benefits Accordion */}
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
                  <button
                    onClick={() => setIsBenefitsOpen(!isBenefitsOpen)}
                    className="flex justify-between items-center w-full px-5 py-4 text-left font-bold text-[14px] font-heading text-neutral-900 dark:text-white select-none cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <span>Key Benefits</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-neutral-400 transition-transform duration-200 ${isBenefitsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isBenefitsOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-900">
                      <ul className="space-y-4 pt-2">
                        {benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-3 group">
                            <span className="h-2 w-2 rounded-full bg-secondary shrink-0 mt-2" />
                            <div>
                              <h5 className="text-[13px] font-bold text-neutral-800 dark:text-neutral-200 font-heading">
                                {b.title}
                              </h5>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                                {b.desc}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Mobile Configurator Controls & Sub-strip (shown only on mobile) */}
                <div className="block lg:hidden space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  {/* Quantity Block */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">Quantity</span>
                    <div className="flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-full p-1 select-none shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 rounded-full text-neutral-500 hover:text-foreground cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1.5 rounded-full text-neutral-500 hover:text-foreground cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-95 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Final Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={handleAddToBag}
                      className="w-full bg-gradient-to-r from-secondary to-teal-500 hover:from-secondary-dark hover:to-teal-600 text-white text-[15px] sm:text-[16px] font-bold h-13 rounded-[14px] shadow-lg shadow-secondary/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="h-4.5 w-4.5" /> Add to Cart
                    </button>
                     <button 
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dark hover:to-blue-700 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 text-[15px] sm:text-[16px] font-bold h-13 rounded-[14px] transition-all duration-300 flex items-center justify-center active:scale-95 cursor-pointer shadow-lg shadow-primary/10"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Sub-strip specifications & Secure Badges */}
                  <div className="pt-2 text-center space-y-3">
                    <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ShieldCheck className="h-4 w-4 text-secondary" />
                        <span>Complimentary consultations &amp; Rx</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Truck className="h-4 w-4 text-secondary" />
                        <span>Free express delivery in India</span>
                      </div>
                    </div>

                    {/* Secure trust checkout seal */}
                    <div className="flex items-center justify-center gap-1 text-[9px] text-neutral-400 font-black tracking-wider uppercase select-none opacity-80 pt-1">
                      <Lock className="h-3 w-3 text-neutral-400" />
                      <span>100% SECURE TRANSACTIONS &bull; CDSCO COMPLIANT PHARMACY</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Fits Anywhere. Goes Everywhere. Section */}
      <section className="py-16 bg-white/30 dark:bg-neutral-900/30 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-850 dark:text-neutral-100">Fits Anywhere. Goes Everywhere.</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-medium">Designed to be compact so you can carry health with you, wherever you go.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { image: "/products/trollybag.webp", title: "In Your Luggage" },
              { image: "/products/backpack.webp", title: "In Your Backpack" },
              { image: "/products/handbag.webp", title: "In Your Handbag" },
              { image: "/products/all%20rounder.webp", title: "All-Rounder (Fits All Bags)" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-3.5 group">
                <div className="w-full aspect-[4/3] bg-white dark:bg-neutral-900 rounded-[24px] border border-blue-50 dark:border-neutral-800/80 overflow-hidden flex items-center justify-center p-1.5 shadow-[0_4px_20px_rgba(15,23,42,0.02)] group-hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-[18px] group-hover:scale-103 transition-transform duration-500 select-none"
                  />
                </div>
                <span className="text-[13px] font-bold text-neutral-700 dark:text-neutral-350 font-sans tracking-wide">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Technical Details Section */}
      <section className="py-16 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-black text-secondary tracking-widest uppercase bg-secondary/15 px-3 py-1 rounded-full inline-block mb-3">Specifications</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-850 dark:text-neutral-100">Technical Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {specs.map(s => (
              <Card key={s.id} className="p-6 border border-blue-50 bg-white dark:bg-neutral-900 flex flex-col justify-between shadow-xs rounded-2xl hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-neutral-800 rounded-xl">
                      {s.icon}
                    </div>
                    <h4 className="text-[14px] sm:text-[15px] font-bold text-neutral-800 dark:text-neutral-200 font-heading leading-tight">{s.title}</h4>
                  </div>
                  <div className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{s.content}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
