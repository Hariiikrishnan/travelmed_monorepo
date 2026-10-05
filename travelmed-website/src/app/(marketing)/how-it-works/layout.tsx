import { buildMetadata } from '@/shared/seo/metadata';
import { JsonLd, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

export const metadata = buildMetadata({
  title: 'How Our Travel Medical Kit Works',
  description: 'See how the TravelMed kit works abroad: colour-coded compartments, English dosage guide, airport-friendly packing and free doctor teleconsultations.',
  path: '/how-it-works',
});

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'How It Works', url: '/how-it-works' }])} />
      {children}
    </>
  );
}
