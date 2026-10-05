import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { PRODUCT_CACHE_TAG } from '@/shared/api/product';

const ALLOWED_TAGS = new Set([PRODUCT_CACHE_TAG]);

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
};

/**
 * Called by the backend after an admin changes a product, so new prices appear
 * across the site immediately. Protected by a shared secret.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get('x-revalidate-secret') ?? '';
  if (!secret || !safeEqual(provided, secret)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const tag = typeof body?.tag === 'string' ? body.tag : PRODUCT_CACHE_TAG;
  if (!ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ success: false, message: 'Unknown tag' }, { status: 400 });
  }

  revalidateTag(tag);
  return NextResponse.json({ success: true, revalidated: tag, at: Date.now() });
}
