'use client';

import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, FolderDown, Loader2 } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';
import { ScrollReveal } from '@/shared/ui/ScrollReveal';

export default function DownloadsPage() {
  const [downloadIdx, setDownloadIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const docs = [
    {
      title: 'Pouch Medication Guide (v2.1)',
      desc: 'Complete symptoms-to-medication mappings, color-coded sector layout, warning labels, and dosage instructions for all 40+ supplies.',
      size: '2.4 MB',
      format: 'PDF Manual'
    },
    {
      title: 'Airport & Customs Medicine Checklist',
      desc: 'Formal DCGI approved medicine inventory checklist matching customs regulations. Show this sheet at airport customs if queried.',
      size: '1.1 MB',
      format: 'PDF Form'
    },
    {
      title: 'Global Travel Health Guide & Checklist',
      desc: 'Pre-trip preparations guide, emergency hotline directory for 195+ countries, and vaccine schedules advice from our medical board.',
      size: '4.8 MB',
      format: 'PDF Booklet'
    }
  ];

  const handleDownload = (idx: number, title: string) => {
    if (downloadIdx !== null) return;
    setDownloadIdx(idx);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadIdx(null);
            alert(`Mock PDF document downloaded successfully: "${title.replace(/\s+/g, '_')}.pdf"`);
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <PageHero
        badge="Document Center"
        badgeIcon={<FolderDown className="h-3.5 w-3.5 text-secondary" />}
        title="Official resource"
        highlight="downloads"
        description="Customs verification sheets, colour-coded pouch manuals, and travel checklists for every destination."
        size="compact"
      />

      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          {docs.map((doc, idx) => {
            const isDownloading = downloadIdx === idx;
            return (
              <ScrollReveal key={doc.title} direction="up" delay={idx * 0.08}>
                <div className="group flex flex-col sm:flex-row sm:items-center gap-5 rounded-[24px] border border-border bg-white p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/20">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg font-bold font-heading">{doc.title}</h2>
                    <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{doc.desc}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <span className="rounded-md bg-secondary/10 px-2 py-0.5 font-semibold text-secondary-dark">{doc.format}</span>
                      <span>·</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(idx, doc.title)}
                    disabled={downloadIdx !== null && !isDownloading}
                    className={`relative inline-flex h-12 min-w-[160px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[14px] px-5 text-sm font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDownloading
                        ? 'border border-primary/20 bg-primary/5 text-primary'
                        : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <span
                          aria-hidden
                          className="absolute inset-y-0 left-0 bg-primary/10 transition-[width] duration-300"
                          style={{ width: `${progress}%` }}
                        />
                        <Loader2 className="relative h-4 w-4 animate-spin" />
                        <span className="relative tabular-nums">{progress}%</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </ScrollReveal>
            );
          })}

          <p className="flex items-center justify-center gap-2 pt-6 text-center text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-secondary-dark" />
            Documents compliant with DCGI approved medicine regulations
          </p>
        </div>
      </section>
    </div>
  );
}
