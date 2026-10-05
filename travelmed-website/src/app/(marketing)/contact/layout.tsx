import { buildMetadata } from '@/shared/seo/metadata';
import { JsonLd, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

export const metadata = buildMetadata({
  title: 'Contact Us – Orders, Delivery & Support',
  description: 'Contact TravelMed support on +91 81484 93389 or sales@travelmed.org, Mon–Sat 9 AM–6 PM IST, for orders, delivery, returns and partnerships.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }])} />
      {children}
    </>
  );
}
