import { JsonLd, buildFaqSchema, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';
import { buildMetadata } from '@/shared/seo/metadata';
import { HELP_CENTER_FAQS, toSchemaFaqs } from '@/entities/faq/data';
import { getFeaturedKit } from '@/shared/api/product';
import { derivePricing } from '@/shared/pricing';

export const metadata = buildMetadata({
  title: 'Travel Medical Kit FAQ – Medicines & Delivery',
  description:
    'Answers about the TravelMed kit: medicines included, free doctor teleconsultations, carrying medicines on flights, payment, delivery across India and returns.',
  path: '/faq',
});

export default async function FaqLayout({ children }: { children: React.ReactNode }) {
  const pricing = derivePricing(await getFeaturedKit());
  return (
    <>
      <JsonLd data={buildFaqSchema(toSchemaFaqs(HELP_CENTER_FAQS, pricing))} />
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'FAQ', url: '/faq' }])} />
      {children}
    </>
  );
}
