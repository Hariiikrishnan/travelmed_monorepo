import React from 'react';
import { site, absoluteUrl } from '@/shared/config/site';
import { kitPath, type ProductInfo } from '@/shared/pricing';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never break out of the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;
const FOUNDER_ID = `${site.url}/about#founder`;

// ── Founder (E-E-A-T: medical reviewer for guides) ─────────────────────────
export const founderSchema = {
  '@type': 'Person',
  '@id': FOUNDER_ID,
  name: site.founder.name,
  jobTitle: site.founder.jobTitle,
  description: `${site.founder.jobTitle} of TravelMed. ${site.founder.credentials}.`,
  image: site.founder.image,
  url: site.founder.url,
  hasCredential: site.founder.credentials,
  worksFor: { '@id': ORG_ID },
};

// ── Organization + WebSite (rendered once, site-wide) ──────────────────────
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: site.name,
      url: site.url,
      logo: { '@type': 'ImageObject', url: site.logo },
      image: site.product.image,
      description: site.description,
      founder: founderSchema,
      areaServed: { '@type': 'Country', name: 'India' },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.contact.phoneE164,
        email: site.contact.email,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00',
        },
      },
      ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: 'en-IN',
      publisher: { '@id': ORG_ID },
    },
  ],
};

// ── Product (only on /buy). No rating markup until genuine reviews exist. ──
/** Built from the admin-managed product so search engines always see the live price. */
/** Public page for a kit. */
export const kitUrl = (product: Pick<ProductInfo, 'slug' | 'isFeatured'>) => absoluteUrl(kitPath(product));

const kitImages = (product: ProductInfo | null) =>
  product?.images.length ? product.images.map((src) => (src.startsWith('http') ? src : absoluteUrl(src))) : site.product.images;

export function buildProductSchema(product: ProductInfo | null) {
  const url = product ? kitUrl(product) : site.product.url;
  const base = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product?.name ?? site.product.name,
    image: kitImages(product),
    description: product?.seoDescription || product?.description || `${site.description} Free express shipping across India.`,
    sku: product?.sku ?? site.product.sku,
    brand: { '@type': 'Brand', name: site.name },
    category: 'Health & Personal Care > First Aid & Medical Kits',
  };
  if (!product) return base;

  const inStock = product.status === 'In Stock' && product.stock > 0;
  return {
    ...base,
    offers: {
      '@type': 'Offer',
      url,
      price: product.price.toFixed(2),
      priceCurrency: product.commerce?.currency ?? 'INR',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: product.commerce?.currency ?? 'INR' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: site.country },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: site.shipping.processingDays, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: site.shipping.minDays, maxValue: site.shipping.maxDays, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: site.country,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: site.returns.windowDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };
}

// ── FAQPage ────────────────────────────────────────────────────────────────
export function buildFaqSchema(faqs: Array<{ title: string; contentText: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.contentText,
      },
    })),
  };
}

// ── BreadcrumbList ─────────────────────────────────────────────────────────
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
    })),
  };
}

// ── Guides & destination pages (medically reviewed articles) ──────────────
export function buildMedicalArticleSchema(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalWebPage', 'Article'],
    '@id': `${url}#article`,
    headline: opts.title,
    name: opts.title,
    description: opts.description,
    url,
    mainEntityOfPage: url,
    image: opts.image ?? site.product.image,
    inLanguage: 'en-IN',
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    lastReviewed: opts.dateModified,
    author: { '@id': ORG_ID, '@type': 'Organization', name: site.name },
    reviewedBy: founderSchema,
    publisher: { '@id': ORG_ID },
    audience: { '@type': 'PeopleAudience', geographicArea: { '@type': 'Country', name: 'India' } },
  };
}

// ── Teleconsultation page ──────────────────────────────────────────────────
export const teleconsultationMedicalSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  '@id': `${site.url}/teleconsultation#webpage`,
  name: 'Doctor teleconsultation for travellers',
  url: `${site.url}/teleconsultation`,
  description: `Every TravelMed kit includes ${site.consults.count} free teleconsultations with a ${site.consults.specialists}. After booking, a licensed doctor contacts you within ${site.consults.callbackHours} hours.`,
  medicalAudience: { '@type': 'MedicalAudience', audienceType: 'Travellers' },
  publisher: { '@id': ORG_ID },
  reviewedBy: founderSchema,
};
