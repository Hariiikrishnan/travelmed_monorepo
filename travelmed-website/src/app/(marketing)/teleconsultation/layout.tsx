import { JsonLd, teleconsultationMedicalSchema, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';
import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Online Doctor Consultation While Abroad',
  description:
    'Every TravelMed kit includes 2 free teleconsultations with a General Physician & Orthopaedician. Book via QR code; a doctor calls you within 8–12 hours.',
  path: '/teleconsultation',
});

export default function TeleconsultationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={teleconsultationMedicalSchema} />
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Teleconsultation', url: '/teleconsultation' }])} />
      {children}
    </>
  );
}
