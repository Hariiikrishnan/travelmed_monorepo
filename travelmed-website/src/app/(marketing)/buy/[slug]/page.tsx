import { notFound, permanentRedirect } from 'next/navigation';
import KitPageClient from './KitPageClient';
import { getCatalog, getProduct } from '@/shared/api/product';
import { derivePricing, fillPriceTokens } from '@/shared/pricing';
import { buildMetadata } from '@/shared/seo/metadata';
import { JsonLd, buildProductSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/shared/seo/StructuredData';
import { BUY_FAQS, toSchemaFaqs } from '@/entities/faq/data';
import { absoluteUrl } from '@/shared/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Kits created later in the admin are rendered on first visit, then cached
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getCatalog()).filter((kit) => !kit.isFeatured).map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const kit = await getProduct(slug);
  if (!kit) return {};
  const pricing = derivePricing(kit);
  const consults = kit.consultsIncluded > 0 ? ` and ${kit.consultsIncluded} free doctor consult${kit.consultsIncluded === 1 ? '' : 's'}` : '';
  return buildMetadata({
    title: kit.seoTitle || `${kit.name}${pricing ? ` – ${pricing.priceText}` : ''}`,
    description:
      kit.seoDescription ||
      `${kit.tagline || kit.name}: ${kit.counts.medicines} medicines in ${kit.counts.categories} categories, a signed doctor's prescription${consults}. Free express shipping across India.`,
    path: `/buy/${kit.slug}`,
    image: kit.images[0] ? absoluteUrl(kit.images[0]) : undefined,
  });
}

export default async function KitPage({ params }: PageProps) {
  const { slug } = await params;
  const kit = await getProduct(slug);
  if (!kit) notFound();
  // The featured kit's page is /buy itself
  if (kit.isFeatured) permanentRedirect('/buy');
  const pricing = derivePricing(kit);

  const faqs = [
    ...kit.faqs.map((f) => ({ title: f.q, contentText: fillPriceTokens(f.a, pricing) })),
    ...toSchemaFaqs(BUY_FAQS, pricing),
  ];

  return (
    <>
      <JsonLd data={buildProductSchema(kit)} />
      <JsonLd data={buildFaqSchema(faqs)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Travel Medical Kits', url: '/buy' },
          { name: kit.name, url: `/buy/${kit.slug}` },
        ])}
      />
      <KitPageClient slug={kit.slug} />
    </>
  );
}
