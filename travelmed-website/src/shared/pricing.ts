/**
 * Product + pricing model shared by server and client code.
 * Every price shown on the website comes from the admin-managed Product in the
 * database — never from constants in this repo.
 */
export interface CommerceConfig {
  currency: string;
  freeShippingThreshold: number;
  shippingFee: number;
}

export interface MedicineCategoryInfo {
  id: string;
  slug: string;
  name: string;
  /** Website path or URL; empty = use the built-in icon for this category name */
  icon: string;
}

export interface KitContentItem {
  medicineId: string;
  name: string;
  activeIngredient: string;
  quantity: number;
  unit: string;
  note: string;
  category: MedicineCategoryInfo | null;
}

/** A kit as returned by the public products API. */
export interface ProductInfo {
  id: string;
  slug: string;
  name: string;
  sku: string;
  mrp: number;
  price: number;
  stock: number;
  status: string;
  visibility: string;
  description: string;
  highlights: string[];
  benefits: string[];
  specs: Record<string, string>;
  faqs: { q: string; a: string }[];
  images: string[];
  seoTitle: string;
  seoDescription: string;
  kitType: { id: string; slug: string; name: string } | null;
  tagline: string;
  tripLength: string;
  bagSize: string;
  bagWeight: string;
  consultsIncluded: number;
  isFeatured: boolean;
  sortOrder: number;
  items: KitContentItem[];
  categories: (MedicineCategoryInfo & { medicines: number })[];
  counts: { medicines: number; units: number; categories: number };
  commerce: CommerceConfig;
  updatedAt?: string;
}

/** Public page of a kit: the featured kit is the main /buy page, others live at /buy/<slug>. */
export const kitPath = (kit: Pick<ProductInfo, 'slug' | 'isFeatured'>) => (kit.isFeatured ? '/buy' : `/buy/${kit.slug}`);

/** The kit used for site-wide messaging (home hero, FAQ, blog): the featured one, else the first. */
export const pickFeatured = (catalog: ProductInfo[]) => catalog.find((p) => p.isFeatured) ?? catalog[0] ?? null;

export interface Pricing {
  product: ProductInfo;
  price: number;
  mrp: number;
  /** MRP minus price */
  save: number;
  /** Whole-number discount percentage */
  savePercent: number;
  inStock: boolean;
  priceText: string;
  mrpText: string;
  saveText: string;
}

export const formatINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export function derivePricing(product: ProductInfo | null | undefined): Pricing | null {
  if (!product) return null;
  const save = Math.max(0, product.mrp - product.price);
  return {
    product,
    price: product.price,
    mrp: product.mrp,
    save,
    savePercent: product.mrp > 0 ? Math.round((save / product.mrp) * 100) : 0,
    inStock: product.status === 'In Stock' && product.stock > 0,
    priceText: formatINR(product.price),
    mrpText: formatINR(product.mrp),
    saveText: formatINR(save),
  };
}

/**
 * Replaces {price}, {mrp}, {save} and {savePercent} placeholders in editorial
 * content (FAQs, articles, chatbot answers) with the live admin values.
 */
export function fillPriceTokens(text: string, pricing: Pricing | null): string {
  if (!text.includes('{')) return text;
  return text
    .replace(/\{price\}/g, pricing ? pricing.priceText : 'the current listed price')
    .replace(/\{mrp\}/g, pricing ? pricing.mrpText : 'the MRP')
    .replace(/\{save\}/g, pricing ? pricing.saveText : 'a discount')
    .replace(/\{savePercent\}/g, pricing ? `${pricing.savePercent}%` : 'a discount');
}
