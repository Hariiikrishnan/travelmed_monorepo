'use client';

import React, { useState } from 'react';
import { Phone, Mail, Clock, Send, CheckCircle2, Truck, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHero } from '@/shared/ui/PageHero';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

const inputClass =
  'w-full rounded-[14px] border border-border bg-white px-4 py-3.5 text-sm font-medium text-heading placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10';

const contactMethods = [
  {
    icon: Phone,
    label: 'Call us',
    value: '+91 81484 93389',
    href: 'tel:+918148493389',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'sales@travelmed.org',
    href: 'mailto:sales@travelmed.org',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setFormError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: `${form.name} (${form.email})`,
          subject: form.subject,
          message: form.message,
          status: 'Open',
          priority: 'Medium',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setFormError('Failed to submit ticket. Please check connection.');
      }
    } catch (error) {
      console.error(error);
      setFormError('Error submitting to support desk. The server might be inaccessible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <PageHero
        badge="Get in touch"
        badgeIcon={<MessageCircle className="h-3.5 w-3.5 text-secondary" />}
        title="We're here to help,"
        highlight="anywhere you are."
        description="Reach our team about orders, deliveries, partnerships or anything else — we usually reply within one business day."
        overlap
      />

      <section className="relative z-20 -mt-16 md:-mt-20 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
              {contactMethods.map(({ icon: Icon, label, value, href }, idx) => (
                <ScrollReveal key={label} direction="up" delay={idx * 0.08}>
                  <a
                    href={href}
                    className="group flex items-center gap-4 rounded-[24px] border border-border bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_25px_60px_rgba(11,79,140,0.10)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
                      <p className="mt-0.5 truncate font-heading text-lg font-bold text-heading group-hover:text-primary transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>
                </ScrollReveal>
              ))}

              <ScrollReveal direction="up" delay={0.16}>
                <div className="rounded-[24px] border border-border bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold">Support hours</p>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                        Mon–Sat, 9:00 AM – 6:00 PM IST. Need help with shipping or returns? We&apos;ve got you.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-start gap-4 border-t border-border pt-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-heading text-base font-bold">Domestic express logistics</p>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                        Sourced from CDSCO licensed facilities and delivered straight to your home, office, or hotel desk.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal direction="up" className="lg:col-span-7 order-1 lg:order-2">
              <div className="rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-[0_40px_100px_rgba(11,79,140,0.12)]">
                <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight">Send us a message</h2>
                <p className="mt-2 text-sm text-slate-500">Fill in the form and our team will get back to you.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-sm font-semibold text-heading">Your name</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-heading">Email address</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-heading">Subject</label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option>General Inquiry</option>
                      <option>Corporate Partnership</option>
                      <option>Logistics & Delivery Support</option>
                      <option>Emergency Medical Board</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-heading">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="How can we help?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  {formError && (
                    <div role="alert" className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-600">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {formError}
                    </div>
                  )}
                </form>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div role="status" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        Thank you! Your message has been sent successfully.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
