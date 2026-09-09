import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { ShieldCheck, Lock, Users } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-neutral-50 dark:bg-neutral-950 py-16 md:py-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <Card hoverEffect={false} className="p-8 md:p-12 border-border bg-card shadow-lg space-y-8">
          <div className="space-y-4">
            <Badge variant="primary">Security & Protection</Badge>
            <h1 className="text-3xl font-black font-heading tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-neutral-400">Last updated: August 2026</p>
          </div>

          <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
            Travel Med is committed to protecting your personal and medical information. We adhere to rigorous security standards.
          </p>

          <div className="space-y-6 pt-4 border-t border-border/40 text-xs text-neutral-500 leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-primary" />
                <span>Medical Record Confidentiality</span>
              </h3>
              <p>
                All video consultations and triage data are end-to-end encrypted. Your medical summaries are only accessible to the matching board-certified doctor during your consult window, in compliance with international patient data protections.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-primary" />
                <span>Information We Collect</span>
              </h3>
              <p>
                We collect your shipping name, address, and email for package routing. Additionally, when using the symptom triager, we record details of symptoms to suggest the optimal physician. This information is never sold to third-party advertisers.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                <span>Security Infrastructure</span>
              </h3>
              <p>
                Our databases utilize industrial AES-256 encryption. Session links expire immediately after video consultation completions to protect unauthorized records access.
              </p>
            </div>
          </div>

        </Card>
        
      </div>
    </div>
  );
}
