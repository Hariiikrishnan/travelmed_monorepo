'use client';

import React, { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Heart, ShieldAlert, Clock, Smartphone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Hotspot {
  id: string;
  name: string;
  coords: { x: number; y: number }; // Percentage coordinate on map
  riskFactor: string;
  medicines: string[];
  clinicLatency: string;
  teleconsultLatency: string;
  description: string;
}

export const InteractiveMap: React.FC = () => {
  const hotspots: Hotspot[] = [
    {
      id: 'hotspot-bali',
      name: 'Bali, Indonesia',
      coords: { x: 78, y: 72 },
      riskFactor: 'High (Gastroenteric Pathogens & Hydration Loss)',
      medicines: ['Diarrhea Shield', 'Bismuth Relief', 'Hydration Recovery Salts'],
      clinicLatency: '60+ min travel',
      teleconsultLatency: '2 min wait',
      description: 'Lush tropical stays and delicious street food markets present high enteric risks. Clean drinking water is scarce outside major hotels.'
    },
    {
      id: 'hotspot-machu',
      name: 'Machu Picchu, Peru',
      coords: { x: 32, y: 70 },
      riskFactor: 'Medium (Altitude Sickness & Sprains)',
      medicines: ['Travel-Ibuprofen', 'Hydration Recovery Salts', 'Hydrocortisone Cream'],
      clinicLatency: '90+ min mountain transport',
      teleconsultLatency: '3 min wait',
      description: 'High-altitude trekking causes cerebral vasoconstriction (headaches) and vomiting. Local pharmacies are far below in valleys.'
    },
    {
      id: 'hotspot-alps',
      name: 'Chamonix, French Alps',
      coords: { x: 50, y: 35 },
      riskFactor: 'Low (Joint Strain, Blisters & Cold Exposure)',
      medicines: ['Travel-Ibuprofen', 'Wound Care Wipes', 'Antiseptic Ointment'],
      clinicLatency: '45 min evacuation',
      teleconsultLatency: '1 min wait',
      description: 'Extreme heights and rugged terrain increase joint sprains and scrape risks. Instant doctor video calls support evacuation decisions.'
    },
    {
      id: 'hotspot-tokyo',
      name: 'Tokyo, Japan',
      coords: { x: 84, y: 40 },
      riskFactor: 'Low (Jetlag fatigue, Seasonal Pollen Allergies)',
      medicines: ['Allergy Shield (Cetirizine)', 'Sinus Decongestant'],
      clinicLatency: '20 min metro ride',
      teleconsultLatency: '2 min wait',
      description: 'Vast pollen storms during spring and complex local pharmacy prescriptions make importing clean OTC allergy solutions crucial.'
    }
  ];

  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(hotspots[0]);

  return (
    <section className="py-20 bg-white dark:bg-neutral-900 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="primary">Global Protection Net</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
            Interactive World Coverage & Risk Map
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            We provide medical support and dispatch kits to 195+ countries. Select a hotspot to preview local risk profiles.
          </p>
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SVG Map Section */}
          <div className="lg:col-span-8 bg-neutral-50 dark:bg-neutral-950/40 rounded-3xl border border-border p-6 aspect-[16/9] relative overflow-hidden flex items-center justify-center">
            {/* Mesh Background */}
            <div className="absolute inset-0 bg-mesh opacity-10 dark:opacity-30" />
            
            {/* Simplified SVG Map Graphic */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full text-neutral-200 dark:text-neutral-800 transition-colors duration-300"
            >
              {/* Simplified outlines for North America */}
              <path
                d="M 50 100 Q 150 50 250 150 T 350 250 T 400 120 T 350 50 Q 250 20 100 80 Z"
                fill="currentColor"
                opacity="0.5"
              />
              {/* South America */}
              <path
                d="M 280 260 Q 320 280 350 380 T 380 480 T 330 450 Q 300 350 270 280 Z"
                fill="currentColor"
                opacity="0.5"
              />
              {/* Greenland */}
              <path
                d="M 380 20 Q 420 10 440 40 T 410 80 Q 370 60 380 20 Z"
                fill="currentColor"
                opacity="0.3"
              />
              {/* Eurasia / Africa */}
              <path
                d="M 450 100 Q 550 50 700 100 T 850 120 T 900 180 T 800 250 Q 600 280 500 220 Z"
                fill="currentColor"
                opacity="0.5"
              />
              <path
                d="M 460 220 Q 580 250 580 360 T 550 450 Q 480 380 450 300 Z"
                fill="currentColor"
                opacity="0.4"
              />
              {/* Australia */}
              <path
                d="M 780 380 Q 850 390 880 420 T 820 450 Q 750 430 780 380 Z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>

            {/* Hotspot Markers */}
            {hotspots.map((hs) => {
              const isActive = hs.id === activeHotspot.id;
              return (
                <button
                  key={hs.id}
                  onClick={() => setActiveHotspot(hs)}
                  style={{ left: `${hs.coords.x}%`, top: `${hs.coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-1"
                >
                  <span className="relative flex h-5 w-5">
                    {/* Ring Pulse */}
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isActive ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    
                    {/* Center point */}
                    <span className={`relative inline-flex rounded-full h-5 w-5 border border-white dark:border-neutral-900 shadow-sm ${
                      isActive ? 'bg-primary' : 'bg-secondary'
                    }`} />
                  </span>
                  
                  {/* Tooltip Label */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-6 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {hs.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details Sidebar Panel */}
          <div className="lg:col-span-4 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card hoverEffect={false} className="p-6 bg-card border-border flex flex-col space-y-6 h-[400px] justify-between">
                  {/* Location Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold tracking-tight">{activeHotspot.name}</h3>
                    </div>
                    <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                      Regional Risk Analysis
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
                    {activeHotspot.description}
                  </p>

                  <div className="space-y-3.5 border-t border-border/40 pt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4.5 w-4.5 text-warning shrink-0" />
                      <span><strong>Key Risk:</strong> {activeHotspot.riskFactor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4.5 w-4.5 text-red-500 shrink-0" />
                      <span><strong>Physical Clinic Access:</strong> {activeHotspot.clinicLatency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4.5 w-4.5 text-accent shrink-0" />
                      <span><strong>Teleconsultation Latency:</strong> {activeHotspot.teleconsultLatency}</span>
                    </div>
                  </div>

                  {/* Medicines badges */}
                  <div className="border-t border-border/40 pt-4 space-y-2">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                      Recommended Pouch Contents
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {activeHotspot.medicines.map((m, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};

export default InteractiveMap;
