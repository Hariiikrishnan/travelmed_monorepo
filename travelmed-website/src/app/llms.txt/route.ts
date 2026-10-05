import { site } from '@/shared/config/site';
import { getCatalog } from '@/shared/api/product';
import { derivePricing, kitPath, pickFeatured } from '@/shared/pricing';
import { BLOG_POSTS } from '@/entities/blog/posts';
import { DESTINATIONS } from '@/entities/destination/data';

/**
 * Plain-text fact sheet for AI answer engines (llms.txt convention).
 * Generated so the price always matches the admin-managed product.
 */
export const revalidate = 300;

export async function GET() {
  const catalog = await getCatalog();
  const featured = pickFeatured(catalog);
  const pricing = derivePricing(featured);
  const priceLine = pricing
    ? `${catalog.length > 1 ? `Kits from ${derivePricing(catalog.reduce((a, b) => (a.price <= b.price ? a : b)))!.priceText}` : `Price: ${pricing.priceText}${pricing.save > 0 ? ` (MRP ${pricing.mrpText})` : ''}`}.`
    : 'Price: see https://travelmed.org/buy.';
  const kitLines = catalog
    .map((k) => {
      const p = derivePricing(k)!;
      const parts = [
        k.tripLength || k.kitType?.name,
        `${k.counts.medicines} medicines in ${k.counts.categories} categories`,
        k.consultsIncluded > 0 ? `${k.consultsIncluded} free doctor teleconsultation${k.consultsIncluded === 1 ? '' : 's'}` : 'no teleconsultations',
        k.bagSize && `pouch ${k.bagSize}`,
        `${p.priceText}${p.save > 0 ? ` (MRP ${p.mrpText})` : ''}`,
      ].filter(Boolean);
      return `- [${k.name}](${site.url}${kitPath(k)}): ${parts.join('; ')}`;
    })
    .join('\n');

  const body = `# ${site.name}

> ${site.name} (travelmed.org) sells a doctor-curated travel medical kit for people in India travelling abroad. Kits contain doctor-curated medicines and essentials, a signed doctor's prescription and, depending on the kit, free doctor teleconsultations. ${priceLine} Free express shipping within India.

## Key facts
- Founder & medical director: ${site.founder.name} (${site.founder.credentials})
- Medicines are CDSCO-regulated and made in WHO-GMP certified facilities
- Teleconsultations: set per kit and added up per order (${site.consults.specialists}), valid ${site.consults.validityMonths} months; a doctor calls back within ${site.consults.callbackHours} hours of booking; not for emergencies
- Shipping: India only; processed within ${site.shipping.processingDays} business day; ${site.shipping.zones.map((z) => `${z.label.toLowerCase()} ${z.min}–${z.max} business days`).join(', ')}
- Returns: ${site.returns.summary}
- Payment: Razorpay (UPI, cards, net banking, wallets)
- Support: ${site.contact.phone}, ${site.contact.email}, ${site.contact.hours}

## Kits
${kitLines || '- See https://travelmed.org/buy'}

## Main pages
- [Buy the kit](${site.url}/buy): product details, price and what's included
- [How it works](${site.url}/how-it-works)
- [Teleconsultation](${site.url}/teleconsultation)
- [FAQ](${site.url}/faq)
- [About the founder](${site.url}/about)

## Blog articles
${BLOG_POSTS.map((p) => `- [${p.metaTitle}](${site.url}/blog/${p.slug})`).join('\n')}

## Destination guides
${DESTINATIONS.map((d) => `- [${d.name}](${site.url}/travel-medicine-kit/${d.slug})`).join('\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
