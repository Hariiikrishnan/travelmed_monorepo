'use client';

import React, { useState, useEffect } from 'react';
import { TravelScenario } from '@/types';
// Loaded dynamically from backend API
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2, ShieldAlert, ShieldCheck, Award, Compass, Palmtree, Mountain, Sun } from 'lucide-react';

export default function TravelGuidePage() {
  const [travelScenarios, setTravelScenarios] = useState<TravelScenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/travel-scenarios`)
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setTravelScenarios(body.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const [checklist, setChecklist] = useState([
    { id: 'item-1', label: 'Photocopy of Passport & Visas uploaded', checked: false },
    { id: 'item-2', label: 'Standard travel insurance policy activated', checked: false },
    { id: 'item-3', label: 'Travel Med Pouch carry-on seal verified', checked: false },
    { id: 'item-4', label: 'Emergency QR code bookmark on phone', checked: false },
    { id: 'item-5', label: 'Local emergency contacts downloaded', checked: false }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const checkedCount = checklist.filter((x) => x.checked).length;
  const progressPercent = Math.round((checkedCount / checklist.length) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palmtree': return <Palmtree className="h-6 w-6 text-primary" />;
      case 'Mountain': return <Mountain className="h-6 w-6 text-primary" />;
      case 'Sun': return <Sun className="h-6 w-6 text-primary" />;
      default: return <Compass className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary">Travel Guides</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
            Regional Travel Safety Guides
          </h1>
          <p className="text-sm md:text-base text-neutral-500">
            Select a guide to prepare your medical bag for specific regional pathogens, altitude challenges, or city allergy factors.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Departure checklist */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <Card hoverEffect={false} className="p-6 bg-card border-border shadow-md space-y-6">
              
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Departure Verification</span>
                <h3 className="text-lg font-black font-heading tracking-tight">Travel Safety Checklist</h3>
                <p className="text-xs text-neutral-500">Verify these tasks before checking in at the flight gates.</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-500">Departure Preparedness:</span>
                  <span className="text-primary">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist list */}
              <div className="space-y-3 pt-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full text-left flex gap-3 items-start cursor-pointer select-none group focus:outline-none"
                  >
                    <div className={`mt-0.5 border rounded flex items-center justify-center shrink-0 h-4.5 w-4.5 transition ${
                      item.checked
                        ? 'border-primary bg-primary text-white'
                        : 'border-border group-hover:border-primary bg-white dark:bg-neutral-900'
                    }`}>
                      {item.checked && <CheckCircle2 className="h-3 w-3 fill-current text-white bg-primary rounded-full" />}
                    </div>
                    <span className={`text-xs ${
                      item.checked ? 'text-neutral-400 line-through' : 'text-neutral-700 dark:text-neutral-300'
                    }`}>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border/40 pt-4 flex justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Travel Med safety verification protocol</span>
              </div>

            </Card>
          </div>

          {/* Right Column: Scenario guides */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {travelScenarios.map((scen) => (
                <Card key={scen.id} hoverEffect={true} className="p-6 bg-card border-border flex flex-col justify-between h-full min-h-[380px] hover:border-primary/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2.5 bg-primary-light dark:bg-neutral-800 text-primary rounded-xl shrink-0">
                        {getIcon(scen.icon)}
                      </div>
                      <Badge variant={scen.riskLevel === 'High' ? 'warning' : 'neutral'}>
                        {scen.riskLevel} Risk
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold font-heading">{scen.title}</h3>
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">{scen.region}</span>
                    </div>

                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-4">
                      {scen.description}
                    </p>

                    <div className="border-t border-border/40 pt-4 space-y-2">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Recommended items</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {scen.medicinesList.slice(0, 3).map((med, idx) => (
                          <Badge key={idx} variant="primary" className="text-[9px] px-2 py-0.5">
                            {med}
                          </Badge>
                        ))}
                        {scen.medicinesList.length > 3 && (
                          <Badge variant="neutral" className="text-[9px] px-2 py-0.5">
                            +{scen.medicinesList.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4 mt-6">
                    <p className="text-[11px] text-neutral-400 leading-normal bg-neutral-50 dark:bg-neutral-800/10 p-3 rounded-xl border border-border">
                      <strong>Rule:</strong> {scen.instructions}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
