'use client';

import React, { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Phone, Mail, Globe, MapPin, Send, CheckCircle2, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: `${form.name} (${form.email})`,
          subject: form.subject,
          message: form.message,
          status: 'Open',
          priority: 'Medium'
        })
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
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 font-sans">
      
      {/* Header */}
      <section className="py-12 md:py-20 bg-white dark:bg-neutral-900 border-b border-border/40 relative">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-1">
          <Badge variant="primary">Global Communications</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading max-w-2xl mx-auto">
            We are Here to Help, Anywhere Globally
          </h1>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto">
            Connect with our logistics team regarding orders or reach out to our emergency support networks.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Form */}
            <div className="lg:col-span-6 space-y-6">
              <Card hoverEffect={false} className="p-8 border-border bg-card shadow-lg relative">
                
                <h3 className="text-xl md:text-2xl font-black font-heading mb-6 tracking-tight">Send a message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-xs md:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-xs md:text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-xs md:text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option>General Inquiry</option>
                      <option>Corporate Partnership</option>
                      <option>Logistics & Delivery Support</option>
                      <option>Emergency Medical Board</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Message Details</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Explain your inquiry..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-border rounded-xl text-xs md:text-sm focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <Button type="submit" size="md" disabled={loading} fullWidth className="relative select-none">
                    {loading ? 'Sending...' : 'Send Inquiry'}
                  </Button>

                  {formError && (
                    <div className="mt-2 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-lg text-center">
                      {formError}
                    </div>
                  )}
                </form>

                {/* Success Toast / Notification */}
                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-3 text-xs md:text-sm font-semibold">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span>Thank you! Your message has been sent successfully.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </Card>
            </div>

            {/* Right: Coverage Map & Details */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Support Helpline Card */}
              <Card hoverEffect={true} className="p-6 border-border bg-card shadow-sm space-y-4 text-left">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0 mt-0.5">
                    <Phone className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-black tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase">
                      Support Helpline
                    </span>
                    <h4 className="text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100 font-heading">
                      Need Help with Shipping or Returns?
                    </h4>
                    <p className="text-neutral-400 font-medium">
                      Our support team is available Mon–Sat, 9:00 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-500">Phone:</span>
                    <a href="tel:+918148493389" className="font-extrabold text-primary hover:underline select-text">
                      +91 81484 93389
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-500">Email:</span>
                    <a href="mailto:sales@travelmed.org" className="font-extrabold text-primary hover:underline select-text">
                      sales@travelmed.org
                    </a>
                  </div>
                </div>
              </Card>

              {/* Domestic Express Logistics Card */}
              <Card hoverEffect={true} className="p-6 border-border bg-card shadow-sm flex items-start gap-4 text-left">
                <div className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0 mt-0.5">
                  <Truck className="h-5.5 w-5.5" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-black tracking-wider text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full uppercase">
                    Logistics &amp; Fulfillment
                  </span>
                  <h4 className="text-[15px] font-extrabold text-neutral-800 dark:text-neutral-100 font-heading">
                    Domestic Express Logistics
                  </h4>
                  <p className="text-neutral-500 dark:text-slate-400 leading-relaxed font-normal">
                    Sourced from CDSCO licensed laboratory facilities and delivered straight to your home, office, or hotel receipt desk.
                  </p>
                </div>
              </Card>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
