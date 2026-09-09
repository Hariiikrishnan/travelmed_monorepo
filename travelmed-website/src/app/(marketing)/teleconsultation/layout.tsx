import type { Metadata } from 'next';
import { JsonLd, teleconsultationMedicalSchema, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

export const metadata: Metadata = {
  title: '24/7 Global Doctor Teleconsultation | Instant Video Call Triage',
  description: 'Connect with board-certified physicians in under 3 minutes anywhere in the world. Triage symptoms, verify travel prescriptions, and receive immediate medical advice.',
  keywords: [
    'online doctor consultation while traveling',
    'telehealth for international travelers',
    'get doctor prescription abroad online',
    '24/7 video doctor travel emergency',
    'travel clinic online video call',
    'online travel doctor',
    'doctor consultation abroad',
    '24/7 travel teleconsultation',
    'remote prescription for travelers',
    'bali belly doctor video call',
    'international travel telehealth'
  ],
  openGraph: {
    title: '24/7 Global Doctor Teleconsultation | TravelMed',
    description: 'Instant video consultation with licensed physicians while traveling internationally.',
    url: 'https://travelmed.org/teleconsultation',
  },
};

export default function TeleconsultationLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://travelmed.org' },
    { name: 'Teleconsultation', url: 'https://travelmed.org/teleconsultation' }
  ]);

  return (
    <>
      <JsonLd data={teleconsultationMedicalSchema} />
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
