'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { Rating } from '@/shared/ui/Rating';
import { Badge } from '@/shared/ui/Badge';
import { HeartPulse, Quote, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const TravelStories: React.FC = () => {
  const stories = [
    {
      name: "Marcus Jenkins",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      destination: "Koh Samui, Thailand",
      scenario: "Food Poisoning",
      quote: "Spent the night sick from street oysters. Popped the Diarrhea Shield and mixed the WHO-grade rehydration salts. Within 12 hours I was back exploring temples instead of stuck in a clinic.",
      rating: 5
    },
    {
      name: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      destination: "Cusco, Peru",
      scenario: "Altitude Sickness",
      quote: "The 11,000-ft altitude gave me a crushing vascular headache. I took the Travel-Ibuprofen after a brief call with Travel Med doctor Elena. It reduced the inflammation quickly.",
      rating: 5
    },
    {
      name: "Dimitri Dupont",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
      destination: "Interlaken, Switzerland",
      scenario: "Trail Scraping",
      quote: "Scraped my leg badly on gravel while hiking. Having the first aid alcohol wipes and triple antibiotic ointment in my pocket kept it clean. Zero infection, zero complications.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-950 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl">
            <Badge variant="secondary">Travel Case Studies</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
              Stories From the Road
            </h2>
            <p className="text-sm md:text-base text-neutral-500">
              See how travelers recovered quickly from injuries, local ailments, and stomach issues.
            </p>
          </div>
          <Link href="/travel-blog" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            <span>Read all travel logs</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stories list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((s, idx) => (
            <Card key={idx} hoverEffect={true} className="p-8 bg-card border-border relative flex flex-col justify-between h-full min-h-[300px]">
              
              <Quote className="absolute right-6 top-6 h-12 w-12 text-primary/5 dark:text-white/5" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{s.scenario}</Badge>
                  <span className="text-xs text-neutral-400 font-semibold">{s.destination}</span>
                </div>
                
                <p className="text-xs md:text-sm text-neutral-500 leading-relaxed italic">
                  "{s.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-3 pt-6 border-t border-border/40 mt-6">
                <Avatar src={s.avatar} alt={s.name} size="sm" />
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{s.name}</span>
                  <span className="text-neutral-400 font-medium">{s.destination}</span>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TravelStories;
