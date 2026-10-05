import { pickFeatured, type ProductInfo } from '@/shared/pricing';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/** Cache tag invalidated by /api/revalidate when an admin edits kits, kit types or categories. */
export const PRODUCT_CACHE_TAG = 'product';

const cache = { next: { tags: [PRODUCT_CACHE_TAG], revalidate: 300 } };

/**
 * All kits visible on the website, in admin display order. Cached (ISR) and refreshed on
 * demand when the admin saves. Returns [] if the API is unreachable — callers must handle
 * "price unavailable".
 */
export async function getCatalog(): Promise<ProductInfo[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, cache);
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body?.data) ? (body.data as ProductInfo[]) : [];
  } catch {
    return [];
  }
}

/** One visible kit by slug (or id), or null. */
export async function getProduct(slug: string): Promise<ProductInfo | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(slug)}`, cache);
    if (!res.ok) return null;
    const body = await res.json();
    return (body?.data as ProductInfo) ?? null;
  } catch {
    return null;
  }
}

/** The featured kit — drives site-wide prices in the home hero, FAQ, blog and share image. */
export async function getFeaturedKit(): Promise<ProductInfo | null> {
  return pickFeatured(await getCatalog());
}
