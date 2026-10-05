import { site } from '@/shared/config/site';
import { getCatalog } from '@/shared/api/product';
import { kitPath, type ProductInfo } from '@/shared/pricing';

/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace) for free Shopping listings.
 * One item per visible kit. Prices and availability come from the admin-managed kits, so the feed always
 * matches the website (a mismatch gets products disapproved in Merchant Center).
 * Submit https://travelmed.org/feed.xml in Merchant Center → Products → Feeds.
 */
export const revalidate = 300;

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const absolute = (src: string) => (src.startsWith('http') ? src : `${site.url}${src.startsWith('/') ? src : `/${src}`}`);

function itemXml(product: ProductInfo) {
  const { shipping } = site;
  const currency = product.commerce?.currency ?? 'INR';
  const inStock = product.status === 'In Stock' && product.stock > 0;
  const hasDiscount = product.mrp > product.price;
  const images = product.images.length ? product.images.map(absolute) : site.product.images;
  const consults = product.consultsIncluded > 0 ? ` & ${product.consultsIncluded} Free Doctor Consult${product.consultsIncluded === 1 ? '' : 's'}` : '';
  const description =
    product.seoDescription ||
    product.description ||
    `${product.tagline || product.name}. ${product.counts.medicines} doctor-curated medicines, a signed prescription. Free express shipping across India.`;

  return `    <item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <g:title>${escapeXml(`${product.name} – ${product.counts.medicines} Medicines, Doctor Prescription${consults}`)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${site.url}${escapeXml(kitPath(product))}</g:link>
      <g:image_link>${escapeXml(images[0])}</g:image_link>
${images.slice(1, 10).map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n')}
      <g:availability>${inStock ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${(hasDiscount ? product.mrp : product.price).toFixed(2)} ${currency}</g:price>
${hasDiscount ? `      <g:sale_price>${product.price.toFixed(2)} ${currency}</g:sale_price>` : ''}
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(site.name)}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Health &amp; Beauty &gt; Health Care &gt; First Aid &gt; First Aid Kits</g:google_product_category>
      <g:product_type>Travel Medical Kits${product.kitType ? ` &gt; ${escapeXml(product.kitType.name)}` : ''}</g:product_type>
      <g:shipping>
        <g:country>${site.country}</g:country>
        <g:service>Free express shipping</g:service>
        <g:price>0.00 ${currency}</g:price>
        <g:min_handling_time>0</g:min_handling_time>
        <g:max_handling_time>${shipping.processingDays}</g:max_handling_time>
        <g:min_transit_time>${shipping.minDays}</g:min_transit_time>
        <g:max_transit_time>${shipping.maxDays}</g:max_transit_time>
      </g:shipping>
    </item>`;
}

export async function GET() {
  const catalog = await getCatalog();
  if (!catalog.length) {
    return new Response('Product feed temporarily unavailable', { status: 503, headers: { 'Retry-After': '300' } });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
${catalog.map(itemXml).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
