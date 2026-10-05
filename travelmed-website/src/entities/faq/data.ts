import { site, formatINR } from '@/shared/config/site';
import { fillPriceTokens, type Pricing } from '@/shared/pricing';

/**
 * FAQ content shared by the visible accordions and FAQPage structured data,
 * so schema text always matches what users see.
 */
export type FaqExtra = 'medicine-list' | 'payment-list' | 'delivery-table';

export interface FaqEntry {
  id: string;
  category: 'product' | 'consults' | 'payment' | 'shipping' | 'returns';
  question: string;
  /** Plain-text answer — rendered on the page and used verbatim in JSON-LD. */
  answer: string;
  /** Optional visual detail rendered below the answer. */
  extra?: FaqExtra;
}

export const KIT_CATEGORIES = [
  'Antacids',
  'Pain Killers & Analgesics',
  'Antimotility Drugs',
  'Laxative Stimulant',
  'Antispasmodics',
  'Cough Suppressant',
  'Antibiotic',
  'ORS Salts',
  'Antihistamine',
  'Motion Sickness Tablets',
  'Antiemetic',
  'Antipyretic (Fever)',
  'Anti Cold',
  'Sore Throat Lozenges',
  'Pre & Probiotics',
  'Bandages & Plasters',
  'First Aid Cotton',
];

export const PAYMENT_METHODS = [
  'UPI (Google Pay, PhonePe, Paytm, BHIM)',
  'Credit & Debit Cards (Visa, Mastercard, RuPay)',
  'Net Banking (all major Indian banks)',
  'Wallets',
];

const { consults, shipping, product } = site;

export const HELP_CENTER_FAQS: FaqEntry[] = [
  {
    id: 'prod-1',
    category: 'product',
    question: 'What is the TravelMed kit?',
    answer: `TravelMed is a doctor-curated travel medical kit for Indians travelling abroad. It contains ${product.medicines} medicines and essentials across ${product.categories} categories for common travel ailments — upset stomach, fever, pain, allergies, motion sickness and minor cuts — plus ${consults.count} free doctor teleconsultations (${consults.specialists}) and a signed doctor's prescription.`,
  },
  {
    id: 'prod-2',
    category: 'product',
    question: 'What medicines are included in the kit?',
    answer: `The kit contains ${product.medicines} medicines and essentials across ${product.categories} categories: ${KIT_CATEGORIES.join(', ')}.`,
    extra: 'medicine-list',
  },
  {
    id: 'prod-3',
    category: 'product',
    question: 'Are the medicines safe and approved?',
    answer:
      'Yes. All medicines are CDSCO-regulated, sourced from licensed Indian pharmaceutical manufacturers and made in WHO-GMP certified facilities.',
  },
  {
    id: 'prod-4',
    category: 'product',
    question: 'Is the kit suitable for children?',
    answer:
      'The kit is formulated primarily for adults. Please consult a paediatrician before giving any medicine to a child — you can use one of your free teleconsultations for this.',
  },
  {
    id: 'prod-5',
    category: 'product',
    question: 'What is the shelf life of the medicines?',
    answer: `Every medicine carries its own printed expiry date, and items are dispatched with ${site.shelfLife} of shelf life.`,
  },
  {
    id: 'cons-1',
    category: 'consults',
    question: 'What are the free teleconsultations?',
    answer: `Every kit includes ${consults.count} free online doctor consultations — one with a General Physician and one with an Orthopaedician — worth ${formatINR(consults.value)}. After you book, a doctor contacts you within ${consults.callbackHours} hours.`,
  },
  {
    id: 'cons-2',
    category: 'consults',
    question: 'How do I book my free teleconsultation?',
    answer: `Scan the QR code inside your kit or use the link in your order confirmation, then share your symptoms and Order ID. A licensed doctor contacts you within ${consults.callbackHours} hours of booking.`,
  },
  {
    id: 'cons-3',
    category: 'consults',
    question: 'How long are the teleconsultations valid?',
    answer: `The teleconsultations are valid for ${consults.validityMonths} months from the date of purchase. They are non-transferable and cannot be exchanged for cash.`,
  },
  {
    id: 'cons-4',
    category: 'consults',
    question: 'Can I use the teleconsultations for emergencies?',
    answer:
      'No. The teleconsultations are for non-emergency medical guidance. In a medical emergency, call local emergency services (112 in India and much of Europe) or go to the nearest hospital immediately.',
  },
  {
    id: 'pay-1',
    category: 'payment',
    question: 'How do I place an order?',
    answer: `Go to the Buy Kit page, choose your quantity and click Buy Now or Add to Cart. Enter your delivery address and pay securely via Razorpay. The kit costs {price} (MRP {mrp}).`,
  },
  {
    id: 'pay-2',
    category: 'payment',
    question: 'What payment methods are accepted?',
    answer: `Payments are processed securely by Razorpay. We accept ${PAYMENT_METHODS.join('; ')}.`,
    extra: 'payment-list',
  },
  {
    id: 'pay-3',
    category: 'payment',
    question: 'Will I receive a tax invoice?',
    answer: 'Yes. A GST invoice is emailed to you after your order is confirmed.',
  },
  {
    id: 'ship-1',
    category: 'shipping',
    question: 'Is shipping free across India?',
    answer: 'Yes. Express shipping is free on every order across India. We currently ship within India only.',
  },
  {
    id: 'ship-2',
    category: 'shipping',
    question: 'How long does delivery take?',
    answer: `Orders are processed within ${shipping.processingDays} business day. Delivery takes ${shipping.zones
      .map((z) => `${z.min}–${z.max} business days to ${z.label.toLowerCase()}`)
      .join(', ')}.`,
    extra: 'delivery-table',
  },
  {
    id: 'ret-1',
    category: 'returns',
    question: 'What if my kit arrives damaged or incorrect?',
    answer: `Contact us within ${site.returns.windowDays} days of delivery at ${site.contact.email} or ${site.contact.phone} with your Order ID and photos. We will send a free replacement or issue a full refund.`,
  },
];

export const BUY_FAQS: FaqEntry[] = [
  {
    id: 'buy-faq-1',
    category: 'product',
    question: 'What medicines are inside the kit?',
    answer: `The kit contains ${product.medicines} medicines and essentials across ${product.categories} categories, organised into colour-coded compartments for stomach and digestion, fever and pain, allergies, motion sickness, cold and cough, and first aid.`,
  },
  {
    id: 'buy-faq-2',
    category: 'product',
    question: 'Do I need a prescription to buy this kit?',
    answer:
      "No prior prescription is required. Every kit includes a doctor consultation and a signed doctor's prescription matching the medicines inside.",
  },
  {
    id: 'buy-faq-3',
    category: 'product',
    question: 'Can I carry the kit on international flights?',
    answer:
      "Yes. The kit is liquid-free, uses solid blister-packed medicines and includes a signed doctor's prescription to show at security or customs if asked. Always check your destination's rules for restricted medicines.",
  },
  {
    id: 'buy-faq-4',
    category: 'product',
    question: 'What is the shelf life of the medicines?',
    answer: `Items are dispatched with ${site.shelfLife} of shelf life, and every medicine has its own printed expiry date and English dosage instructions.`,
  },
  {
    id: 'buy-faq-5',
    category: 'shipping',
    question: 'How long does shipping take?',
    answer: `Shipping is free across India. Metro cities receive orders in ${shipping.zones[0].min}–${shipping.zones[0].max} business days and most other locations in ${shipping.zones[1].min}–${shipping.zones[2].max} business days.`,
  },
];

/** Plain-text entries for buildFaqSchema, with live price placeholders filled in. */
export const toSchemaFaqs = (faqs: FaqEntry[], pricing: Pricing | null = null) =>
  faqs.map((f) => ({ title: f.question, contentText: fillPriceTokens(f.answer, pricing) }));
