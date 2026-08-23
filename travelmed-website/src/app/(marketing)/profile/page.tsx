'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { User, Mail, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [testimonialLoading, setTestimonialLoading] = useState(false);
  const [testimonialMsg, setTestimonialMsg] = useState('');
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    location: '',
    tripType: 'Vacation',
    quote: '',
    rating: 5
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('travelmed_client_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const body = await res.json();
        if (res.ok) {
          const usr = body.data?.user || body.data;
          setUser(usr);
          setTestimonialForm(prev => ({ ...prev, name: usr.name }));
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonialMsg('');
    setTestimonialLoading(true);
    try {
      const token = localStorage.getItem('travelmed_client_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...testimonialForm,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(testimonialForm.name)}`
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonialMsg('Your review is safely submitted! It will appear after admin approval.');
        setTestimonialForm(prev => ({ ...prev, quote: '', rating: 5, location: '' }));
      } else {
        setTestimonialMsg(data.message || 'Error submitting review');
      }
    } catch (e) {
      setTestimonialMsg('Failed to connect to backend.');
    }
    setTestimonialLoading(false);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 font-sans">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full shadow-md" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-12 md:py-20 font-sans min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-4 text-center pb-8 border-b border-border/50">
          <Badge variant="primary">Client Account Portal</Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-neutral-500">
            Manage your travel health kits, review active consultations, and track orders safely here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect={false} className="p-6 md:p-8 flex flex-col justify-center gap-4 bg-white dark:bg-neutral-900 border-border shadow-sm">
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-black mx-auto">
               {user.name.charAt(0)}
             </div>
             <div className="space-y-1 text-center">
               <div className="font-bold text-lg text-neutral-800 dark:text-neutral-100 flex items-center justify-center gap-1.5 focus:outline-none">
                 {user.name} 
                 {user.role === 'admin' && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
               </div>
               <div className="text-sm text-neutral-500 flex items-center justify-center gap-1.5">
                 <Mail className="h-4 w-4" />
                 {user.email}
               </div>
             </div>
             
             <div className="pt-6 mt-2 border-t border-border/40 text-xs text-neutral-400 text-center">
               Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
             </div>
          </Card>

          <Card hoverEffect={false} className="p-6 md:p-8 md:col-span-2 bg-gradient-to-br from-white to-slate-50/50 dark:from-neutral-900 dark:to-neutral-900/60 border-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold">Quick Actions</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


               <button onClick={() => router.push('/teleconsultation')} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-white dark:bg-neutral-950 hover:border-primary/40 transition cursor-pointer text-left">
                  <div className="h-10 w-10 shrink-0 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex justify-center items-center relative">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    {(user.freeConsultationCount ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 h-4.5 w-4.5 bg-secondary text-white rounded-full text-[10px] font-black flex items-center justify-center">
                        {user.freeConsultationCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      Teleconsultation
                      {(user.freeConsultationCount ?? 0) > 0 && (
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                          {user.freeConsultationCount} Available
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400">Schedule your consultation</div>
                  </div>
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2 border-t border-border/40">
                <button onClick={() => router.push('/contact')} className="flex items-center gap-3 p-4 rounded-xl border border-rose-100 bg-rose-50/50 dark:bg-rose-950/20 hover:border-rose-200 transition cursor-pointer text-left">
                  <div className="h-10 w-10 shrink-0 bg-rose-100 dark:bg-rose-900 rounded-full flex justify-center items-center">
                    <ShieldCheck className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-rose-800 dark:text-rose-400">Raise Support Ticket</div>
                    <div className="text-xs text-rose-600/70 dark:text-rose-500/70">Issues with an order or medicine? Request immediate assistance.</div>
                  </div>
                </button>
             </div>
          </Card>
        </div>

        <Card hoverEffect={false} className="p-6 md:p-8 bg-white dark:bg-neutral-900 border-border shadow-sm space-y-6">
          <h3 className="text-lg font-bold">Write a Review</h3>
          <p className="text-xs text-neutral-500">Post a testimonial out of 5 stars based on your travel medicine experience.</p>
          
          <form onSubmit={submitTestimonial} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs font-bold text-neutral-500">
                <label className="uppercase tracking-wider">Location / Destination</label>
                <input required placeholder="e.g. Kyoto, Japan" value={testimonialForm.location} onChange={e => setTestimonialForm(p => ({...p, location: e.target.value}))} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-neutral-50 dark:bg-neutral-950 font-normal outline-none focus:border-primary" />
              </div>
              <div className="space-y-1 text-xs font-bold text-neutral-500">
                <label className="uppercase tracking-wider">Trip Type</label>
                <select value={testimonialForm.tripType} onChange={e => setTestimonialForm(p => ({...p, tripType: e.target.value}))} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-neutral-50 dark:bg-neutral-950 font-normal outline-none focus:border-primary">
                  <option>Vacation</option>
                  <option>Business Trip</option>
                  <option>Backpacking</option>
                  <option>Family Emergency</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1 text-xs font-bold text-neutral-500">
               <label className="uppercase tracking-wider">Rating (Out of 5)</label>
               <input required type="number" min="1" max="5" step="0.5" value={testimonialForm.rating} onChange={e => setTestimonialForm(p => ({...p, rating: parseFloat(e.target.value)}))} className="w-full md:w-32 px-3 py-2 border border-border rounded-lg text-sm bg-neutral-50 dark:bg-neutral-950 font-normal outline-none focus:border-primary" />
            </div>

            <div className="space-y-1 text-xs font-bold text-neutral-500">
               <label className="uppercase tracking-wider">Your Experience</label>
               <textarea required rows={3} placeholder="How was the medicine kit setup process?" value={testimonialForm.quote} onChange={e => setTestimonialForm(p => ({...p, quote: e.target.value}))} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-neutral-50 dark:bg-neutral-950 font-normal outline-none focus:border-primary resize-none"></textarea>
            </div>

            <Button type="submit" disabled={testimonialLoading}>
              {testimonialLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
            
            {testimonialMsg && <p className="text-[11px] font-bold mt-2 text-primary">{testimonialMsg}</p>}
          </form>
        </Card>

      </div>
    </div>
  );
}
