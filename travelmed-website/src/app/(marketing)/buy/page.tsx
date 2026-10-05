import BuyPageClient from './BuyPageClient';
import { JsonLd, buildProductSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/shared/seo/StructuredData';
import { buildMetadata } from '@/shared/seo/metadata';
import { BUY_FAQS, toSchemaFaqs } from '@/entities/faq/data';
import { getFeaturedKit } from '@/shared/api/product';
import { derivePricing } from '@/shared/pricing';

export async function generateMetadata() {
  const pricing = derivePricing(await getFeaturedKit());
  return buildMetadata({
    title: pricing ? `Buy Travel Medicine Kit Online in India – ${pricing.priceText}` : 'Buy Travel Medicine Kit Online in India',
    description:
      'Order the TravelMed travel medical kit: 150+ medicines in 17 categories, a signed doctor’s prescription and 2 free doctor consults. Free express shipping in India.',
    path: '/buy',
  });
}

export default async function BuyPage() {
  const product = await getFeaturedKit();
  const pricing = derivePricing(product);
  return (
    <>
      <JsonLd data={buildProductSchema(product)} />
      <JsonLd data={buildFaqSchema(toSchemaFaqs(BUY_FAQS, pricing))} />
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Buy Travel Medical Kit', url: '/buy' }])} />
      <BuyPageClient />
    </>
  );
}
