'use client';

import React, { useState, useMemo } from 'react';
import { Accordion } from '@/shared/ui/Accordion';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Search, HelpCircle, Phone, Mail } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  title: string;
  content: React.ReactNode;
  searchText: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'product', label: 'About the Product' },
    { id: 'consults', label: 'Teleconsultations' },
    { id: 'payment', label: 'Orders & Payment' },
    { id: 'shipping', label: 'Shipping & Delivery' },
    { id: 'returns', label: 'Returns & Refunds' }
  ];

  const faqs: FAQItem[] = [
    // Category: About the Product (product)
    {
      id: 'prod-1',
      category: 'product',
      title: 'What is the Travel Med Kit?',
      content: (
        <span>
          The Travel Med Kit is a comprehensive, pre-packed healthcare kit designed for travelers. It contains <strong className="font-bold text-slate-800 dark:text-neutral-200">150+ carefully curated medicines and essentials</strong> covering common travel ailments — from upset stomachs and fevers to cuts and allergies — along with <strong className="font-bold text-slate-800 dark:text-neutral-200">2 FREE teleconsultations</strong> with a General Physician and an Orthopaedician.
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
          <p>The Travel Med Kit contains <strong className="font-bold text-slate-800 dark:text-neutral-200">150+ carefully curated medicines and essentials</strong> covering common travel ailments:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {[
              "Antacids", "Pain Killers & Analgesics", "Antimotility Drugs",
              "Laxative Stimulant for Constipation", "Antispasmodics", "Cough Suppressant",
              "Antibiotic", "ORS Salts", "Antihistamine", "Motion Sickness Tablets",
              "Antiemetic", "Antipyretic (Fever)", "Anti Cold", "Sore Throat Lozenges",
              "Pre & Probiotics", "Bandages & Plasters", "First Aid Cotton"
            ].map((med, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-neutral-800/40 border border-slate-100/50 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {med}
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
          Yes. All medicines in the Travel Med Kit are <strong className="font-bold text-slate-800 dark:text-neutral-200">CDSCO-regulated</strong> (Central Drugs Standard Control Organisation) and sourced exclusively from trusted, premium Indian pharmaceutical brands such as Abbott, Cipla, Torrent Pharma, and others. They meet Indian and international safety standards.
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
          The kit is <strong className="font-bold text-slate-800 dark:text-neutral-200">primarily designed for adults</strong>. Some items may be suitable for older children, but we strongly recommend consulting a pediatrician before administering any medicine to a child. For travel with young children, please consult your doctor for age-appropriate alternatives.
        </span>
      ),
      searchText: "The kit is primarily designed for adults. Some items may be suitable for older children, but we strongly recommend consulting a pediatrician before administering any medicine to a child. For travel with young children, please consult your doctor for age-appropriate alternatives."
    },
    {
      id: 'prod-5',
      category: 'product',
      title: 'Does the kit have an expiry date?',
      content: (
        <span>
          Each medicine in the kit carries its own individual expiry date printed on the packaging. We ensure that all items dispatched have a <strong className="font-bold text-slate-800 dark:text-neutral-200">minimum shelf life of 6 months</strong> from the date of delivery.
        </span>
      ),
      searchText: "Each medicine in the kit carries its own individual expiry date printed on the packaging. We ensure that all items dispatched have a minimum shelf life of 6 months from the date of delivery."
    },

    // Category: Teleconsultations (consults)
    {
      id: 'cons-1',
      category: 'consults',
      title: 'What are the free teleconsultations?',
      content: (
        <span>
          Every Travel Med Kit includes <strong className="font-bold text-slate-800 dark:text-neutral-200">2 complimentary online doctor consultations</strong> — one with a General Physician and one with an Orthopaedician — valued at <strong className="font-bold text-slate-800 dark:text-neutral-200">₹1,500</strong> in total. These are available digitally and can be accessed from anywhere in the world.
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
          Activation instructions are included inside your kit packaging. You'll receive a unique code to redeem your consultations through our partner telemedicine platform. If you face any issues, contact us at <strong className="text-slate-705 dark:text-white">sales@travelmed.org</strong> or <strong className="text-slate-705 dark:text-white">+91 81484 93389</strong>.
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
          The teleconsultations are <strong className="font-bold text-slate-800 dark:text-neutral-200">valid for 12 months</strong> from the date of purchase. They are non-transferable and cannot be exchanged for cash or other services.
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
          <strong className="font-bold text-slate-800 dark:text-neutral-200">No. The included teleconsultations are for general health queries and non-emergency medical advice only.</strong> In case of a medical emergency, please call your local emergency services (dial 112 in India) or visit the nearest hospital immediately.
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
          Simply visit the Product Details page, select your desired quantity, and click <strong className="font-bold text-slate-800 dark:text-neutral-200">"Add to Cart"</strong> or <strong className="font-bold text-slate-800 dark:text-neutral-200">"Buy Now"</strong>. Then proceed to checkout, fill in your delivery details, and complete payment via Razorpay.
        </span>
      ),
      searchText: "Simply visit the Product Details page, select your desired quantity, and click \"Add to Cart\" or \"Buy Now\". Then proceed to checkout, fill in your delivery details, and complete payment via Razorpay."
    },
    {
      id: 'pay-2',
      category: 'payment',
      title: 'What payment methods are accepted?',
      content: (
        <div className="space-y-3 text-left">
          <p>We accept all major payment methods via Razorpay:</p>
          <ul className="space-y-2 pl-1">
            {[
              "UPI (Google Pay, PhonePe, Paytm, etc.)",
              "Credit & Debit Cards (Visa, Mastercard, RuPay)",
              "Net Banking",
              "Mobile Wallets",
              "EMI (on eligible cards)"
            ].map((bullet, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs md:text-sm text-neutral-500 dark:text-neutral-455 font-semibold leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
      searchText: "We accept all major payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm, etc.), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking, Mobile Wallets, EMI (on eligible cards)."
    },
    {
      id: 'pay-3',
      category: 'payment',
      title: 'Can I modify or cancel my order?',
      content: (
        <span>
          You can request an order modification or cancellation before dispatch by contacting us at <strong className="text-slate-705 dark:text-white">+91 81484 93389</strong> or <strong className="text-slate-705 dark:text-white">sales@travelmed.org</strong>. Once the order has been dispatched, cancellations are not possible.
        </span>
      ),
      searchText: "You can request an order modification or cancellation before dispatch by contacting us at +91 81484 93389 or sales@travelmed.org. Once the order has been dispatched, cancellations are not possible."
    },
    {
      id: 'pay-4',
      category: 'payment',
      title: 'Will I receive an invoice?',
      content: (
        <span>
          Yes. A digital invoice with GST breakdown will be emailed to you at the email address provided during checkout <strong className="font-bold text-slate-800 dark:text-neutral-200">within 24 hours</strong> of order confirmation.
        </span>
      ),
      searchText: "Yes. A digital invoice with GST breakdown will be emailed to you at the email address provided during checkout within 24 hours of order confirmation."
    },

    // Category: Shipping & Delivery (shipping)
    {
      id: 'ship-1',
      category: 'shipping',
      title: 'Is shipping free?',
      content: (
        <span>
          Yes! Shipping is <strong className="font-bold text-emerald-600 dark:text-emerald-450">completely FREE</strong> on all orders across India, regardless of the order value.
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
          <p>Standard delivery timelines across India are as follows:</p>
          <div className="overflow-hidden border border-slate-100 dark:border-neutral-800 rounded-2xl max-w-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-neutral-800/80 border-b border-slate-100 dark:border-neutral-800 text-xs">
                  <th className="p-3 text-xs font-bold text-slate-600 dark:text-neutral-350">Location</th>
                  <th className="p-3 text-xs font-bold text-slate-600 dark:text-neutral-350">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">Metro Cities</td>
                  <td className="p-3 font-bold text-primary">2–3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">Tier 2 & Tier 3 Cities</td>
                  <td className="p-3 font-bold text-slate-700 dark:text-neutral-300">3–5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">Remote / North-East India</td>
                  <td className="p-3 font-bold text-slate-700 dark:text-neutral-300">5–7 Business Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      searchText: "Standard delivery timelines across India are as follows: Metro Cities 2–3 Business Days, Tier 2 & Tier 3 Cities 3–5 Business Days, Remote / North-East India 5–7 Business Days."
    },
    {
      id: 'ship-3',
      category: 'shipping',
      title: 'How do I track my order?',
      content: (
        <span>
          Once your order is dispatched, you will receive an email with the tracking number and courier details. You can use this information on the courier's website to <strong className="font-bold text-slate-800 dark:text-neutral-200">track your shipment in real time</strong>.
        </span>
      ),
      searchText: "Once your order is dispatched, you will receive an email with the tracking number and courier details. You can use this information on the courier's website to track your shipment in real time."
    },
    {
      id: 'ship-4',
      category: 'shipping',
      title: 'Do you ship internationally?',
      content: (
        <span>
          Currently, we <strong className="font-bold text-slate-800 dark:text-neutral-200">only ship within India</strong>. International shipping is on our roadmap and we hope to offer it in the future. Stay tuned!
        </span>
      ),
      searchText: "Currently, we only ship within India. International shipping is on our roadmap and we hope to offer it in the future. Stay tuned!"
    },

    // Category: Returns & Refunds (returns)
    {
      id: 'ret-1',
      category: 'returns',
      title: 'Can I return the kit if I change my mind?',
      content: (
        <span>
          We <strong className="font-bold text-slate-800 dark:text-neutral-200">do not accept returns for change of mind</strong>, as our kits contain medicines and hygiene-sensitive items that cannot be resold once a seal is broken. However, if your order arrives damaged, defective, or incorrect, we will <strong className="font-bold text-slate-800 dark:text-neutral-200">fully replace it or issue a refund</strong>.
        </span>
      ),
      searchText: "We do not accept returns for change of mind, as our kits contain medicines and hygiene-sensitive items that cannot be resold once a seal is broken. However, if your order arrives damaged, defective, or incorrect, we will fully replace it or issue a refund."
    },
    {
      id: 'ret-2',
      category: 'returns',
      title: 'What if I receive a damaged or wrong product?',
      content: (
        <span>
          Please contact us within 7 days of delivery with photos/videos of the issue at <strong className="text-slate-750 dark:text-white">sales@travelmed.org</strong> or <strong className="text-slate-750 dark:text-white">+91 81484 93389</strong>. We will arrange a replacement or full refund promptly.
        </span>
      ),
      searchText: "Please contact us within 7 days of delivery with photos/videos of the issue at sales@travelmed.org or +91 81484 93389. We will arrange a replacement or full refund promptly."
    },
    {
      id: 'ret-3',
      category: 'returns',
      title: 'How long does a refund take?',
      content: (
        <div className="space-y-3 text-left">
          <p>Upon approval, refunds are processed according to your payment method's standard timelines:</p>
          <div className="overflow-hidden border border-slate-100 dark:border-neutral-800 rounded-2xl max-w-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-neutral-800/80 border-b border-slate-100 dark:border-neutral-800 text-xs">
                  <th className="p-3 text-xs font-bold text-slate-600 dark:text-neutral-350">Payment Method</th>
                  <th className="p-3 text-xs font-bold text-slate-600 dark:text-neutral-350">Refund Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">UPI / Wallets</td>
                  <td className="p-3 font-bold text-slate-700 dark:text-neutral-300">1–3 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">Debit / Credit Card</td>
                  <td className="p-3 font-bold text-slate-700 dark:text-neutral-300">5–7 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">Net Banking</td>
                  <td className="p-3 font-bold text-slate-700 dark:text-neutral-300">3–5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-neutral-300">Cash on Delivery</td>
                  <td className="p-3 font-bold text-primary">7 Business Days (bank transfer)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      searchText: "Upon approval, refunds are processed according to your payment method's standard timelines: UPI / Wallets 1–3 Business Days, Debit / Credit Card 5–7 Business Days, Net Banking 3–5 Business Days, Cash on Delivery 7 Business Days."
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchSearch =
        faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.searchText.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [searchTerm]);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#DCEBFF]/40 via-white to-[#EEF6FF]/40 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary" className="px-3.5 py-1 bg-primary/10 text-primary border-primary/20">
            Frequently Asked Questions
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
            Everything you need to know about Travel Med
          </h1>
          
          {/* Search bar */}
          <div className="max-w-md mx-auto pt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-full text-xs md:text-sm focus:outline-none focus:border-primary shadow-[0_4px_20_rgba(15,23,42,0.02)]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-3xl mx-auto w-full space-y-12">
          {searchTerm.trim() !== '' ? (
            // Search View
            <div className="space-y-6">
              <h2 className="text-lg font-black font-heading text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-neutral-800 pb-2 text-left">
                Search Results ({filteredFaqs.length})
              </h2>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-16 space-y-4 bg-white dark:bg-neutral-900/60 rounded-3xl border border-slate-100 dark:border-neutral-800">
                  <HelpCircle className="h-8 w-8 text-neutral-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100">No results match your search</h3>
                  <p className="text-xs text-neutral-400">Try searching general terms like "shipping" or "medicines".</p>
                </div>
              ) : (
                <Accordion items={filteredFaqs} />
              )}
            </div>
          ) : (
            // Grouped Section View
            categories.map((cat) => {
              const categoryFaqs = faqs.filter(faq => faq.category === cat.id);
              return (
                <div key={cat.id} className="space-y-5 text-left">
                  <h2 className="text-xl md:text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-neutral-800 pb-3">
                    {cat.label}
                  </h2>
                  <Accordion items={categoryFaqs} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Contact Card */}
        <Card hoverEffect={false} className="p-6 md:p-8 border-slate-100 bg-white dark:bg-neutral-900/60 dark:border-neutral-800 shadow-[0_8px_30px_rgba(15,23,42,0.02)] rounded-3xl max-w-3xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <span className="inline-block text-[9px] font-extrabold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase">
                Support Desk
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-neutral-100">
                Still have questions?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                Our team is happy to help — <strong className="text-slate-700 dark:text-neutral-350">Mon to Sat, 9 AM – 6 PM IST</strong>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a 
                href="tel:+918148493389" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 hover:bg-primary hover:text-white dark:bg-neutral-800 dark:hover:bg-primary rounded-2xl transition duration-300 group font-bold text-xs"
              >
                <Phone className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                <span className="text-slate-755 dark:text-neutral-200 group-hover:text-white whitespace-nowrap">+91 81484 93389</span>
              </a>

              <a 
                href="mailto:sales@travelmed.org" 
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 hover:bg-primary hover:text-white dark:bg-neutral-800 dark:hover:bg-primary rounded-2xl transition duration-300 group font-bold text-xs"
              >
                <Mail className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                <span className="text-slate-755 dark:text-neutral-200 group-hover:text-white whitespace-nowrap">sales@travelmed.org</span>
              </a>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
