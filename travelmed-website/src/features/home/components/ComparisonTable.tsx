import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Check, X, ShieldAlert } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const features = [
    {
      name: "TSA Carry-on Compliant Blister Pack",
      travelmed: true,
      hotel: false,
      pharmacy: false,
      details: "Fits easily into carry-on bags under TSA liquids/meds guidelines."
    },
    {
      name: "Color-Coded Symptom Compartments",
      travelmed: true,
      hotel: false,
      pharmacy: false,
      details: "Direct mapping from illness (fever, diarrhea) to dose."
    },
    {
      name: "Board-Certified Teleconsultations",
      travelmed: true,
      hotel: false, // "Can call local clinic"
      pharmacy: false,
      details: "Consult US/EU physicians in under 3 minutes via QR scan."
    },
    {
      name: "Import Compliance Guidance",
      travelmed: true,
      hotel: false,
      pharmacy: false,
      details: "Guides you on restricted substances (e.g. Pseudoephedrine in Japan)."
    },
    {
      name: "Standardized Medical Instructions",
      travelmed: true,
      hotel: false,
      pharmacy: true, // "Sometimes local language"
      details: "English warning and dosing labels for safe administration."
    },
    {
      name: "Standard Cost Protection",
      travelmed: true,
      hotel: false,
      pharmacy: false,
      details: "Avoid local pharmaceutical markups and taxi fares."
    }
  ];

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-950 font-sans overflow-hidden border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="primary">Standard Comparison</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">
            How Travel Med Compares
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            Compare our comprehensive digital-pouch integration against traditional local alternatives.
          </p>
        </div>

        {/* Table layout */}
        <Card hoverEffect={false} className="border-border overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-neutral-100/50 dark:bg-neutral-800/10 text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  <th className="p-5 md:p-6 min-w-[240px]">Feature Coverage</th>
                  <th className="p-5 md:p-6 text-center text-primary min-w-[120px]">Travel Med</th>
                  <th className="p-5 md:p-6 text-center min-w-[120px]">Hotel Concierge</th>
                  <th className="p-5 md:p-6 text-center min-w-[120px]">Local Pharmacy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs md:text-sm">
                {features.map((f, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/5 transition">
                    <td className="p-5 md:p-6 space-y-1">
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{f.name}</span>
                      <p className="text-[11px] text-neutral-400 font-medium leading-relaxed">{f.details}</p>
                    </td>
                    
                    {/* Travelmed */}
                    <td className="p-5 md:p-6 text-center">
                      <div className="inline-flex p-1.5 bg-primary-light text-primary rounded-full">
                        <Check className="h-4.5 w-4.5" />
                      </div>
                    </td>
                    
                    {/* Hotel */}
                    <td className="p-5 md:p-6 text-center">
                      <div className="inline-flex p-1.5 bg-red-100 dark:bg-red-950/20 text-red-500 rounded-full">
                        <X className="h-4.5 w-4.5" />
                      </div>
                    </td>
                    
                    {/* Pharmacy */}
                    <td className="p-5 md:p-6 text-center">
                      {f.pharmacy ? (
                        <div className="inline-flex p-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full">
                          <Check className="h-4.5 w-4.5" />
                        </div>
                      ) : (
                        <div className="inline-flex p-1.5 bg-red-100 dark:bg-red-950/20 text-red-500 rounded-full">
                          <X className="h-4.5 w-4.5" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </section>
  );
};

export default ComparisonTable;
