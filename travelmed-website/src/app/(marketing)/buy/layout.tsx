import type { Metadata } from 'next';
import { JsonLd, productSchema, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Buy TravelMed Medical Kits | Solo, Couple & Family Travel Medicine Pouches',
  description: 'Order WHO, GMP, CDSCO & DCGI approved travel medical kits. Includes 150+ prescription & OTC remedies, official signed doctor prescription, and unlimited 24/7 video doctor access worldwide.',
  keywords: [
    'best travel medical kit',
    'travel medicine kit',
    'international travel first aid kit',
    'prescription travel medical kit',
    'travel health pouch with doctor prescription',
    'family travel medical kit',
    'TSA approved travel medicine kit',
    'bali belly medicine kit',
    'altitude sickness pills travel',
    'southeast asia travel medicine list',
    'travel medicine for europe trip',
    'medicines to take to thailand',
    'traveler diarrhea kit',
    'WHO GMP approved travel medical kit',
    'CDSCO DCGI approved travel prescription',
    'customs friendly travel medicine pouch'
  ],
  openGraph: {
    title: 'Buy TravelMed Medical Kits | Complete Travel Healthcare',
    description: 'Order your complete travel healthcare pouch with 150+ medications and 24/7 doctor teleconsultation support.',
    url: 'https://travelmed.org/buy',
  },
};

export default function BuyLayout({ children }: { children: React.ReactNode }) {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://travelmed.org' },
    { name: 'Buy Medical Kits', url: 'https://travelmed.org/buy' }
  ]);

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
