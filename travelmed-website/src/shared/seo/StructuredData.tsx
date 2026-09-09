import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 1. Organization & MedicalBusiness Schema (AEO / GEO Entity Anchor)
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'MedicalBusiness', 'OnlineStore'],
  '@id': 'https://travelmed.org/#organization',
  name: 'TravelMed',
  legalName: 'TravelMed Global Healthcare Systems Inc.',
  url: 'https://travelmed.org',
  logo: {
    '@type': 'ImageObject',
    url: 'https://travelmed.org/logos/travelmed-logo.png',
    width: 600,
    height: 120,
  },
  image: 'https://travelmed.org/og-image.jpg',
  description:
    'TravelMed provides WHO, GMP, CDSCO, and DCGI approved travel medical kits equipped with 150+ OTC and prescription medications, paired with 24/7 instant global video doctor teleconsultations.',
  medicalSpecialty: [
    'Travel Medicine',
    'Emergency Medicine',
    'Internal Medicine',
    'Tropical Medicine'
  ],
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Worldwide'
  },
  knowsAbout: [
    'Best travel medical kit',
    'Travel medicine kit',
    'International travel first aid kit',
    'Prescription travel medical kit',
    'Travel health pouch with doctor prescription',
    'Family travel medical kit',
    'TSA approved travel medicine kit',
    'Bali belly medicine kit',
    'Altitude sickness pills travel',
    'Southeast Asia travel medicine list',
    'Travel medicine for Europe trip',
    'Medicines to take to Thailand',
    'Traveler diarrhea kit',
    'Online doctor consultation while traveling',
    'Telehealth for international travelers',
    'Get doctor prescription abroad online',
    '24/7 video doctor travel emergency',
    'Travel clinic online video call',
    'WHO GMP approved travel medical kit',
    'CDSCO DCGI approved travel prescription',
    'Taking prescription medicines through airport customs',
    'Customs friendly travel medicine pouch'
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0199',
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Spanish', 'Hindi', 'French', 'German'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '00:00',
        closes: '23:59'
      }
    }
  ],
  sameAs: [
    'https://twitter.com/travelmed_official',
    'https://instagram.com/travelmed_official',
    'https://linkedin.com/company/travelmed-healthcare'
  ]
};

// 2. Main Product Schema for Travel Medical Kits
export const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': 'https://travelmed.org/#product-kit',
  name: 'TravelMed Complete Travel Medical Kit',
  image: [
    'https://travelmed.org/kit-hero.jpg',
    'https://travelmed.org/kit-compartments.jpg'
  ],
  description:
    'WHO, GMP, CDSCO & DCGI Approved travel medical pouch featuring 150+ prescription & OTC remedies across 4 color-coded triage zones. Includes signed international doctor prescription and unlimited 24/7 video teleconsultation access.',
  sku: 'TM-KIT-2026',
  mpn: 'TM-GLOBAL-MED-01',
  brand: {
    '@type': 'Brand',
    name: 'TravelMed'
  },
  certifications: [
    'WHO-GMP Certified Manufacturing',
    'CDSCO Approved Medical Device & Rx Packaging',
    'DCGI Cleared Travel Prescription Standard'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1420',
    bestRating: '5',
    worstRating: '1'
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '79',
    highPrice: '199',
    offerCount: '3',
    offers: [
      {
        '@type': 'Offer',
        name: 'Solo Travel Kit',
        price: '79.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://travelmed.org/buy?plan=solo',
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition'
      },
      {
        '@type': 'Offer',
        name: 'Couple Travel Kit',
        price: '129.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://travelmed.org/buy?plan=couple',
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition'
      },
      {
        '@type': 'Offer',
        name: 'Family Travel Kit',
        price: '199.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://travelmed.org/buy?plan=family',
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition'
      }
    ]
  }
};

// 3. FAQ Schema Generator (for AEO / ChatGPT / Perplexity / Google AI Overviews)
export function buildFaqSchema(faqs: Array<{ title: string; contentText: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.contentText
      }
    }))
  };
}

// 4. Breadcrumb Schema Generator
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

// 5. Medical WebPage & Teleconsultation Schema
export const teleconsultationMedicalSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  '@id': 'https://travelmed.org/teleconsultation#webpage',
  name: 'Global 24/7 Travel Teleconsultation & Triage',
  url: 'https://travelmed.org/teleconsultation',
  description:
    'Connect in under 3 minutes with board-certified travel medicine physicians. Triage GI distress, fever, altitude sickness, wound care, and obtain valid international prescriptions.',
  aspect: ['Triage', 'Diagnosis', 'Treatment', 'Prescription'],
  medicalAudience: {
    '@type': 'MedicalAudience',
    audienceType: 'International Travelers and Tourists'
  }
};
