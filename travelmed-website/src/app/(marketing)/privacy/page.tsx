import React from 'react';
import { ShieldCheck, Lock, Users } from 'lucide-react';
import { LegalDocument } from '@/shared/ui/LegalDocument';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How TravelMed collects, uses and protects your personal and medical information, including teleconsultation data and payment security.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDocument
      badge="Security & Protection"
      title="Privacy Policy"
      description="How we collect, use and protect your personal and medical information."
      path="/privacy"
      lastUpdated="August 2026"
      intro="Travel Med is committed to protecting your personal and medical information. We adhere to rigorous security standards."
      sections={[
        {
          id: 'medical-confidentiality',
          title: 'Medical Record Confidentiality',
          icon: <Lock className="h-4.5 w-4.5" />,
          content: (
            <p>
              All teleconsultations and triage data are end-to-end encrypted. Your medical summaries are only accessible
              to the matching board-certified doctor during your consult window, in compliance with international patient
              data protections.
            </p>
          ),
        },
        {
          id: 'information-we-collect',
          title: 'Information We Collect',
          icon: <Users className="h-4.5 w-4.5" />,
          content: (
            <p>
              We collect your shipping name, address, and email for package routing. Additionally, when using the symptom
              triager, we record details of symptoms to suggest the optimal physician. This information is never sold to
              third-party advertisers.
            </p>
          ),
        },
        {
          id: 'security-infrastructure',
          title: 'Security Infrastructure',
          icon: <ShieldCheck className="h-4.5 w-4.5" />,
          content: (
            <p>
              Our databases utilize industrial AES-256 encryption. Session links expire immediately after consultation
              completions to protect unauthorized records access.
            </p>
          ),
        },
      ]}
    />
  );
}
