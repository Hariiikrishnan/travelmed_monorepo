'use client';

import React, { useState, useMemo } from 'react';
import { Accordion } from '@/shared/ui/Accordion';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';
import { 
  Search, 
  HelpCircle, 
  Phone, 
  Mail, 
  Sparkles, 
  Package, 
  Stethoscope, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  id: string;
  category: string;
  title: string;
  content: React.ReactNode;
  searchText: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'product', label: 'About the Product', icon: <Package className="h-4 w-4" /> },
    { id: 'consults', label: 'Teleconsultations', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'payment', label: 'Orders & Payment', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <Truck className="h-4 w-4" /> },
    { id: 'returns', label: 'Returns & Refunds', icon: <RefreshCw className="h-4 w-4" /> }
  ];

  const faqs: FAQItem[] = useMemo(() => [
    // Category: About the Product (product)
    {
      id: 'prod-1',
      category: 'product',
      title: 'What is the Travel Med Kit?',
      content: (
        <span>
          The Travel Med Kit is a comprehensive, pre-packed healthcare kit designed for global travelers. It contains <strong className="font-bold text-slate-900 dark:text-white">150+ carefully curated medicines and essentials</strong> covering common travel ailments — from upset stomachs and fevers to cuts and allergies — along with <strong className="font-bold text-slate-900 dark:text-white">2 FREE teleconsultations</strong> with a General Physician and an Orthopaedician.
        </span>
      ),
      searchText: "The Travel Med Kit is a comprehensive, pre-packed healthcare kit designed for travelers. It contains 150+ carefully curated medicines and essentials covering common travel ailments — from upset stomachs and fevers to cuts and allergies — along with 2 FREE teleconsultations with a General Physician and an Orthopaedician."
    },
    {
      id: 'prod-2',
      category: 'product',
      title: 'What medicines are included in the kit?',
      content: (
        <div className="space-y-3 text-left">
          <p>The Travel Med Kit contains <strong className="font-bold text-slate-900 dark:text-white">150+ carefully curated medicines and essentials</strong> covering 17 travel ailment categories:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {[
              "Antacids", "Pain Killers & Analgesics", "Antimotility Drugs",
              "Laxative Stimulant", "Antispasmodics", "Cough Suppressant",
              "Antibiotics", "ORS Salts", "Antihistamines", "Motion Sickness Tablets",
              "Antiemetics", "Antipyretics (Fever)", "Anti Cold", "Sore Throat Lozenges",
              "Pre & Probiotics", "Bandages & Plasters", "First Aid Cotton"
            ].map((med, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/60 dark:border-neutral-800 rounded-xl text-xs font-bold text-slate-800 dark:text-neutral-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span>{med}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      searchText: "The Travel Med Kit contains 150+ carefully curated medicines and essentials covering common travel ailments: Antacids, Pain Killers & Analgesics, Antimotility Drugs, Laxative Stimulant for Constipation, Antispasmodics, Cough Suppressant, Antibiotic, ORS Salts, Antihistamine, Motion Sickness Tablets, Antiemetic, Antipyretic (Fever), Anti Cold, Sore Throat Lozenges, Pre & Probiotics, Bandages & Plasters, First Aid Cotton."
    },
    {
      id: 'prod-3',
      category: 'product',
      title: 'Are the medicines safe and approved?',
      content: (
        <span>
          Yes. All medicines in the Travel Med Kit are <strong className="font-bold text-slate-900 dark:text-white">CDSCO-regulated</strong> (Central Drugs Standard Control Organisation) and sourced exclusively from trusted, DCGI-approved pharmaceutical labs. They meet strict Indian and international quality safety standards.
        </span>
      ),
      searchText: "Yes. All medicines in the Travel Med Kit are CDSCO-regulated (Central Drugs Standard Control Organisation) and sourced exclusively from trusted, premium Indian pharmaceutical brands such as Abbott, Cipla, Torrent Pharma, and others. They meet Indian and international safety standards."
    },
    {
      id: 'prod-4',
      category: 'product',
      title: 'Is this kit suitable for children?',
      content: (
        <span>
          The kit is <strong className="font-bold text-slate-900 dark:text-white">primarily formulated for adults</strong>. Some items may be suitable for older adolescents, but we strongly recommend consulting a pediatrician before administering any medication to a young child.
        </span>
      ),
      searchText: "The kit is primarily designed for adults. Some items may be suitable for older children, but we strongly recommend consulting a pediatrician before administering any medicine to a child. For travel with young children, please consult your doctor for age-appropriate alternatives."
    },
    {
      id: 'prod-5',
      category: 'product',
      title: 'Does the kit have a guaranteed expiry shelf-life?',
      content: (
        <span>
          Each medicine in the kit carries its own individual blister expiry date. We guarantee that all items dispatched have a <strong className="font-bold text-slate-900 dark:text-white">minimum shelf life of 6 to 24 months</strong> from the date of purchase.
        </span>
      ),
      searchText: "Each medicine in the kit carries its own individual expiry date printed on the packaging. We ensure that all items dispatched have a minimum shelf life of 6 months from the date of delivery."
    },

    // Category: Teleconsultations (consults)
    {
      id: 'cons-1',
      category: 'consults',
      title: 'What are the included free teleconsultations?',
      content: (
        <span>
          Every Travel Med Kit includes <strong className="font-bold text-slate-900 dark:text-white">2 complimentary online doctor consultations</strong> — one with a General Physician and one with an Orthopaedician — worth <strong className="font-bold text-secondary">₹1,500</strong>. These can be accessed digitally from anywhere in the world in under 3 minutes!
        </span>
      ),
      searchText: "Every Travel Med Kit includes 2 complimentary online doctor consultations — one with a General Physician and one with an Orthopaedician — valued at ₹1,500 in total. These are available digitally and can be accessed from anywhere in the world."
    },
    {
      id: 'cons-2',
      category: 'consults',
      title: 'How do I access my free teleconsultations?',
      content: (
        <span>
          Activation instructions and a unique QR code are printed right inside your kit cover. Simply scan the QR code using your smartphone camera to connect directly to a doctor video call without password friction.
        </span>
      ),
      searchText: "Activation instructions are included inside your kit packaging. You'll receive a unique code to redeem your consultations through our partner telemedicine platform. If you face any issues, contact us at sales@travelmed.org or +91 81484 93389."
    },
    {
      id: 'cons-3',
      category: 'consults',
      title: 'How long are the teleconsultations valid?',
      content: (
        <span>
          The teleconsultations are <strong className="font-bold text-slate-900 dark:text-white">valid for 12 full months</strong> from the date of purchase.
        </span>
      ),
      searchText: "The teleconsultations are valid for 12 months from the date of purchase. They are non-transferable and cannot be exchanged for cash or other services."
    },
    {
      id: 'cons-4',
      category: 'consults',
      title: 'Can I use the teleconsultations for emergencies?',
      content: (
        <span>
          <strong className="font-bold text-slate-900 dark:text-white">No. Included teleconsultations are for non-emergency medical guidance and triage advice.</strong> In case of a life-threatening emergency, please contact local emergency services immediately or visit the nearest hospital.
        </span>
      ),
      searchText: "No. The included teleconsultations are for general health queries and non-emergency medical advice only. In case of a medical emergency, please call your local emergency services (dial 112 in India) or visit the nearest hospital immediately."
    },

    // Category: Orders & Payment (payment)
    {
      id: 'pay-1',
      category: 'payment',
      title: 'How do I place an order?',
      content: (
        <span>
          Simply visit the <strong className="font-bold text-secondary">Buy Kit</strong> page, select your quantity, and click <strong className="font-bold text-slate-900 dark:text-white">"Add to Cart"</strong> or <strong className="font-bold text-slate-900 dark:text-white">"Buy Now"</strong>. Complete your shipping address and pay securely via Razorpay.
        </span>
      ),
      searchText: "Simply visit the Product Details page, select your desired quantity, and click \"Add to Cart\" or \"Buy Now\". Then proceed to checkout, fill in your delivery details, and complete payment via Razorpay."
    },
    {
      id: 'pay-2',
      category: 'payment',
      title: 'What payment methods are accepted?',
      content: (
        <div className="space-y-2 text-left">
          <p>We accept all major payment options via Razorpay's 256-bit encrypted gateway:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {[
              "UPI (Google Pay, PhonePe, Paytm, BHIM)",
              "Credit & Debit Cards (Visa, Mastercard, RuPay)",
              "Net Banking (All Major Indian Banks)",
              "Wallets & No-Cost EMI"
            ].map((pm, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-neutral-800/60 rounded-xl text-xs font-bold text-slate-800 dark:text-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                {pm}
              </div>
            ))}
          </div>
        </div>
      ),
      searchText: "We accept all major payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm, etc.), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking, Mobile Wallets, EMI (on eligible cards)."
    },
    {
      id: 'pay-3',
      category: 'payment',
      title: 'Will I receive a tax invoice?',
      content: (
        <span>
          Yes. A GST tax invoice is automatically generated and emailed to your registered address upon order confirmation.
        </span>
      ),
      searchText: "Yes. A digital invoice with GST breakdown will be emailed to you at the email address provided during checkout within 24 hours of order confirmation."
    },

    // Category: Shipping & Delivery (shipping)
    {
      id: 'ship-1',
      category: 'shipping',
      title: 'Is shipping free across India?',
      content: (
        <span>
          Yes! Express Air Shipping is <strong className="font-bold text-emerald-600 dark:text-emerald-400">100% FREE</strong> on all orders across India.
        </span>
      ),
      searchText: "Yes! Shipping is completely FREE on all orders across India, regardless of the order value."
    },
    {
      id: 'ship-2',
      category: 'shipping',
      title: 'How long does delivery take?',
      content: (
        <div className="space-y-3 text-left">
          <p>Dispatches occur within 24 hours. Estimated delivery timelines:</p>
          <div className="overflow-hidden border border-slate-200/80 dark:border-neutral-800 rounded-2xl max-w-md">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 font-extrabold">
                  <th className="p-3">Region</th>
                  <th className="p-3">Estimated Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-slate-600 dark:text-neutral-400 font-semibold">
                <tr>
                  <td className="p-3">Metro Cities (Mumbai, Delhi, Bengaluru, etc.)</td>
                  <td className="p-3 font-bold text-secondary">1–2 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3">Tier 2 &amp; Tier 3 Cities</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">2–4 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3">Remote / Island Regions</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">4–6 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      searchText: "Standard delivery timelines across India are as follows: Metro Cities 2–3 Business Days, Tier 2 & Tier 3 Cities 3–5 Business Days, Remote / North-East India 5–7 Business Days."
    },

    // Category: Returns & Refunds (returns)
    {
      id: 'ret-1',
      category: 'returns',
      title: 'What if I receive a damaged product?',
      content: (
        <span>
          If your shipment arrives damaged or defective, notify us within 7 days at <strong className="text-secondary font-bold">sales@travelmed.org</strong> or <strong className="text-secondary font-bold">+91 81484 93389</strong> with a photo. We will immediately dispatch a free replacement or issue a full refund!
        </span>
      ),
      searchText: "Please contact us within 7 days of delivery with photos/videos of the issue at sales@travelmed.org or +91 81484 93389. We will arrange a replacement or full refund promptly."
    }
  ], []);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.searchText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        activeCategory === 'all' || faq.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, faqs]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#EFF6FF] via-white to-[#F8FAFC] dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      
      {/* Hero Header */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-20 relative text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10">
          
          <ScrollReveal direction="down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs">
            <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
            <span className="text-xs font-black text-secondary uppercase tracking-widest">
              HELP CENTER &amp; FAQ
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto">
              Everything You Need to Know About <span className="text-secondary">Travel Med</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-sm sm:text-base text-slate-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Have questions about kit contents, doctor consultations, TSA compliance, or express shipping? We’re here to help.
            </p>
          </ScrollReveal>

          {/* Interactive Search Bar */}
          <ScrollReveal direction="up" delay={0.3} className="max-w-xl mx-auto pt-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search help topics (e.g. medicines, TSA, teleconsult, shipping)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-lg shadow-slate-900/5 transition-all"
              />
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Category Pills Strip */}
      <section className="py-1 border-y border-slate-200/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2.5 px-3 justify-start sm:justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-extrabold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-secondary text-white shadow-md shadow-secondary/25 scale-102 ring-2 ring-secondary/20'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200/80 dark:hover:bg-neutral-700'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-12 md:py-16 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatePresence mode="wait">
            {filteredFaqs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-16 px-6 bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-sm space-y-4"
              >
                <div className="h-14 w-14 bg-teal-50 dark:bg-teal-950/40 text-primary rounded-2xl flex items-center justify-center mx-auto">
                  <HelpCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-black font-heading text-slate-900 dark:text-white">No questions found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any questions matching "{searchTerm}". Try clearing your search filter or selecting another category.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-secondary-dark cursor-pointer transition"
                >
                  Reset Search Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + searchTerm}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </div>

                <Accordion items={filteredFaqs} defaultOpenId={filteredFaqs[0]?.id} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Support Footer Contact Box */}
      <section className="pb-16 pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="inline-block text-[10px] font-black tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase">
                  SUPPORT DESK
                </span>
                <h3 className="text-xl font-black font-heading text-slate-900 dark:text-white">
                  Still have questions?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Our doctor support team is available Mon to Sat, 9 AM – 6 PM IST.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <a
                  href="tel:+918148493389"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-neutral-800 hover:bg-secondary hover:text-white text-slate-800 dark:text-neutral-200 font-extrabold text-xs rounded-2xl transition cursor-pointer border border-slate-200/70 dark:border-neutral-700 shadow-2xs group whitespace-nowrap shrink-0"
                >
                  <Phone className="h-4 w-4 text-secondary group-hover:text-white shrink-0" />
                  <span className="whitespace-nowrap">+91 81484 93389</span>
                </a>

                <a
                  href="mailto:sales@travelmed.org"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 dark:bg-neutral-800 hover:bg-secondary hover:text-white text-slate-800 dark:text-neutral-200 font-extrabold text-xs rounded-2xl transition cursor-pointer border border-slate-200/70 dark:border-neutral-700 shadow-2xs group whitespace-nowrap shrink-0"
                >
                  <Mail className="h-4 w-4 text-secondary group-hover:text-white shrink-0" />
                  <span className="whitespace-nowrap">sales@travelmed.org</span>
                </a>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
