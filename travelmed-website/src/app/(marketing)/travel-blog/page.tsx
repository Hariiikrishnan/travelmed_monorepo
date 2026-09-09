import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TravelBlogPage() {
  const blogs = [
    {
      id: 'blog-1',
      title: 'Navigating Customs Rules for Prescription Medication Abroad',
      desc: 'An essential checklist detailing restricted active compounds across Japan, Mexico, and the EU, and how to verify medical certification imports.',
      author: 'Vikram Vance',
      date: 'August 5, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      id: 'blog-2',
      title: 'How to Manage Gastrointestinal Health in Southeast Asia',
      desc: 'Expert recommendations from infectious pathogen board physicians on how to explore street food safely and maintain hydration recovery.',
      author: 'Dr. Priya Patel',
      date: 'July 28, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=400&h=250'
    },
    {
      id: 'blog-3',
      title: 'Wilderness Self-Medication Guidelines for Altitude Treks',
      desc: 'A clinical walk-through explaining how altitude changes cause vascular headaches, and when to administer Acetaminophen vs Ibuprofen.',
      author: 'Dr. Marcus Vance',
      date: 'June 15, 2026',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=250'
    }
  ];

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary">Travel Safety Logs</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
            Travel Med Health Journal
          </h1>
          <p className="text-sm md:text-base text-neutral-500">
            Read critical columns written by our medical advisory board and wilderness search-and-rescue team specialists.
          </p>
        </div>

        {/* Blogs list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <Card key={b.id} hoverEffect={true} className="p-0 bg-card border-border flex flex-col h-full min-h-[420px] hover:border-primary/20 overflow-hidden group">
              {/* Image header */}
              <div className="h-48 overflow-hidden bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{b.date}</span>
                    </span>
                    <span className="h-1 w-1 rounded-full bg-neutral-300" />
                    <span>{b.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold font-heading leading-tight text-neutral-800 dark:text-neutral-100 group-hover:text-primary transition duration-200">
                    {b.title}
                  </h3>
                  
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {b.desc}
                  </p>

                </div>

                <div className="border-t border-border/40 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    <User className="h-4 w-4 text-primary" />
                    <span>{b.author}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                    <span>Read article</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 duration-200" />
                  </span>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
