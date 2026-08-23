'use client';

import React, { useState } from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { FileText, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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
      title: 'TSA Travel Compliance Checklist',
      desc: 'Formal FDA/USP over-the-counter inventory checklist matching TSA carry-on regulations. Show this sheet at airport customs if queried.',
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
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="primary">Document Center</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
            Official PDF Resource Downloads
          </h1>
          <p className="text-sm md:text-base text-neutral-500">
            Access customs verification sheets, color-coded pouch manuals, and travel checklists for remote destinations.
          </p>
        </div>

        {/* List of documents */}
        <div className="space-y-6">
          {docs.map((doc, idx) => {
            const isDownloading = downloadIdx === idx;
            return (
              <Card key={idx} hoverEffect={true} className="p-6 bg-card border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/20">
                <div className="flex gap-4 items-start flex-1">
                  <div className="p-3 bg-primary-light dark:bg-neutral-800 text-primary rounded-2xl shrink-0 mt-1">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 text-xs md:text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-neutral-800 dark:text-neutral-100">{doc.title}</h3>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">{doc.format}</Badge>
                    </div>
                    <p className="text-neutral-400 leading-relaxed max-w-xl">{doc.desc}</p>
                    <span className="text-[10px] text-neutral-400 font-semibold block">File Size: {doc.size}</span>
                  </div>
                </div>

                <div className="shrink-0 min-w-[160px]">
                  <Button
                    variant={isDownloading ? 'outline' : 'primary'}
                    fullWidth
                    size="sm"
                    onClick={() => handleDownload(idx, doc.title)}
                    className="relative overflow-hidden cursor-pointer"
                  >
                    {isDownloading ? (
                      <>
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 bg-primary/10"
                          style={{ width: `${progress}%` }}
                        />
                        <span>Loading ({progress}%)</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Compliance Footer check */}
        <div className="flex justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold uppercase tracking-wider text-center max-w-md mx-auto pt-6">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Documents compliant with FDA USP and TSA regulations</span>
        </div>

      </div>
    </div>
  );
}
