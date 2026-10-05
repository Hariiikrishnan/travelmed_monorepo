/**
 * Single source of truth for business facts used by metadata, structured data,
 * FAQ content, guides and the chatbot. Keep this in sync with the policy pages.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://travelmed.org').replace(/\/$/, '');

export const site = {
  name: 'TravelMed',
  legalName: 'Travel Med', // TODO: confirm registered legal entity name
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  tagline: 'Your Global Health Companion',
  description:
    'Doctor-curated travel medical kit for Indians travelling abroad: 150+ medicines across 17 categories, a signed doctor’s prescription and 2 free doctor teleconsultations.',
  locale: 'en_IN',
  country: 'IN',

  contact: {
    phone: '+91 81484 93389',
    phoneE164: '+918148493389',
    email: 'sales@travelmed.org',
    hours: 'Mon–Sat, 9:00 AM – 6:00 PM IST',
  },

  /** Profiles that actually exist — leave empty until confirmed. */
  sameAs: [] as string[],

  founder: {
    name: 'Dr. Chitarth Rajasekaran',
    jobTitle: 'Founder & Medical Director',
    credentials: 'MBBS, MS Ortho, DNB Ortho, MRCS (Edin), Fellow in FIJR, FISS',
    image: `${SITE_URL}/founder/sidharathfounder.webp`,
    url: `${SITE_URL}/about`,
  },

  product: {
    name: 'TravelMed Travel Medical Kit',
    sku: 'kit-standard-india',
    medicines: '150+',
    categories: 17,
    image: `${SITE_URL}/products.webp`,
    images: [`${SITE_URL}/products.webp`, `${SITE_URL}/pro.webp`, `${SITE_URL}/products/trollybag.webp`],
    url: `${SITE_URL}/buy`,
  },

  consults: {
    count: 2,
    value: 1500,
    specialists: 'General Physician & Orthopaedician',
    validityMonths: 12,
    callbackHours: '8–12',
  },

  shipping: {
    free: true,
    shipsTo: 'India',
    processingDays: 1,
    zones: [
      { label: 'Metro cities', min: 2, max: 3 },
      { label: 'Tier 2 & 3 cities', min: 3, max: 5 },
      { label: 'Remote areas & North-East', min: 5, max: 7 },
    ],
    minDays: 2,
    maxDays: 7,
  },

  // TODO: confirm — the refund page says 30 days unopened, shipping/FAQ say 7 days for damaged/incorrect items.
  returns: {
    windowDays: 7,
    summary: 'Damaged, defective or incorrect items can be replaced or refunded within 7 days of delivery.',
  },

  // TODO: confirm — FAQ page says 6–24 months, buy/home pages say 18–24 months.
  shelfLife: '18 to 24 months',
} as const;

// Prices are admin-managed (see src/shared/pricing.ts); formatINR is re-exported for convenience
export { formatINR } from '@/shared/pricing';
export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
