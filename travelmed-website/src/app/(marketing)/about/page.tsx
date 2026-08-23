'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { StatCard } from '@/shared/ui/StatCard';
import { Globe, Users, Clock, ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Regulatory Excellence",
      desc: "We never compromise. All medications are blistered inside FDA-compliant labs and checked for shelf-life before dispatch."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Global-First Design",
      desc: "Our systems are built for weak network signals. Scan the QR code in remote valleys or tropical ports and connect in under 3 minutes."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Patient Empathy",
      desc: "Getting sick abroad is frightening. Our board doctors undergo wilderness and international medicine training to assist with clarity."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-neutral-50 dark:bg-neutral-950">
      
      {/* Hero Mission */}
      <section className="py-16 md:py-24 bg-white dark:bg-neutral-900 border-b border-border/40 relative">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-1">
          <Badge variant="primary">Our Mission</Badge>
          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight max-w-4xl mx-auto">
            Travel Fearless. <br />
            Protected by Clinical Science.
          </h1>
          <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Travel Med was born from a simple realization: emergency medical care shouldn't stop at geopolitical borders. We combine clinical-grade pouch logistics with online doctor care.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Countries Covered"
              value={195}
              suffix="+"
              description="Seamless medical consultation networks and shipping dispatch coverage worldwide."
              icon={<Globe className="h-5 w-5" />}
            />
            <StatCard
              title="Kits Handed"
              value={15000}
              suffix="+"
              description="Premium medical kits delivered to international travelers, hikers, and families."
              icon={<Users className="h-5 w-5" />}
            />
            <StatCard
              title="Doctor Latency"
              value={3}
              prefix="< "
              suffix="m"
              description="Average video conference wait time when scanning the pouch emergency QR."
              icon={<Clock className="h-5 w-5" />}
            />
            <StatCard
              title="Quality Approval"
              value={100}
              suffix="%"
              description="All medications compliant with FDA over-the-counter packaging regulations."
              icon={<ShieldCheck className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="warning">Why We Exist</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight font-heading leading-tight">
                The Travel Medical Gap
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                When you fall ill in a foreign city or remote village, finding reliable treatments is complex. Local pharmacies sell unfamiliar brands, language barriers make symptoms hard to describe, and hospital queues eat into valuable travel days.
              </p>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                Travel Med integrates physical and digital healthcare. We pack exactly what you need in an intuitive, color-coded pouch, backed by US/EU doctors ready to advise in seconds.
              </p>
              <div className="pt-2">
                <Link href="/buy">
                  <Button>Get Protected Now</Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Card hoverEffect={false} className="border-none shadow-none rounded-3xl overflow-hidden aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600&h=400"
                  alt="Travel exploration"
                  className="w-full h-full object-cover"
                />
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <Card hoverEffect={false} className="border-none shadow-none rounded-3xl overflow-hidden aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </Card>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <Badge variant="primary">Founder Story</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight font-heading leading-tight">
                "We wanted to build a clinical-grade medical shield that travelers could trust."
              </h2>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed italic">
                - Vikram Vance, Founder & CEO
              </p>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                In 2024, during a hiking trip to Machu Picchu, I fell severely ill with stomach cramps and dehydration. The nearest clinic was a bumpy 2-hour taxi drive away, and local pharmacies only carried drugs with spanish warnings. It ruined my trip and cost hundreds of dollars.
              </p>
              <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                I returned home and teamed up with wilderness physicians and packaging engineers. We designed Travel Med: a beautiful, rugged, color-coded pouch packed with standardized medications and backed by immediate video consultations. We want to ensure no vacation gets cut short due to health hurdles.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-white dark:bg-neutral-900 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Badge variant="secondary">Company Values</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading">
              How We Guide Healthcare
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <Card key={idx} hoverEffect={true} className="p-8 bg-card border-border flex flex-col space-y-4 hover:border-primary/20">
                <div className="p-3 bg-primary-light dark:bg-neutral-800 text-primary rounded-2xl w-fit">
                  {v.icon}
                </div>
                <h3 className="font-extrabold text-sm md:text-base font-heading">{v.title}</h3>
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {v.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
