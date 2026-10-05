import { buildMetadata } from '@/shared/seo/metadata';
import { JsonLd, buildBreadcrumbSchema, founderSchema } from '@/shared/seo/StructuredData';

export const metadata = buildMetadata({
  title: 'About Us – Doctor-Founded Travel Medical Kit',
  description: 'Founded by orthopaedic surgeon Dr. Chitarth Rajasekaran after a family trip went wrong, TravelMed makes doctor-curated medical kits for Indian travellers.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', ...founderSchema }} />
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about' }])} />
      {children}
    </>
  );
}
