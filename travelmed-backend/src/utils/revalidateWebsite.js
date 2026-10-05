/**
 * Tells the Next.js website to drop its cached product data so admin price/stock
 * changes appear immediately. Silently does nothing when not configured.
 */
export const revalidateWebsite = async (tag = 'product') => {
  const url = process.env.WEBSITE_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tag }),
      signal: controller.signal,
    });
    clearTimeout(timer);
  } catch (err) {
    console.error('Website revalidation failed:', err.message);
  }
};
