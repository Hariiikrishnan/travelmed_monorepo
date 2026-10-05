import { site } from '@/shared/config/site';

/** GA4 measurement ID — analytics is disabled when unset. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

type GtagItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_brand?: string;
  item_category?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function send(event: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}

export const kitItem = (quantity: number, price: number): GtagItem => ({
  item_id: site.product.sku,
  item_name: site.product.name,
  item_brand: site.name,
  item_category: 'Travel Medical Kit',
  price,
  quantity,
});

const value = (items: GtagItem[]) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

/** GA4 recommended ecommerce events. */
export const analytics = {
  viewItem(items: GtagItem[]) {
    send('view_item', { currency: 'INR', value: value(items), items });
  },
  addToCart(items: GtagItem[]) {
    send('add_to_cart', { currency: 'INR', value: value(items), items });
  },
  beginCheckout(items: GtagItem[], coupon?: string) {
    send('begin_checkout', { currency: 'INR', value: value(items), items, ...(coupon ? { coupon } : {}) });
  },
  purchase(opts: { transactionId: string; value: number; shipping?: number; items: GtagItem[]; coupon?: string }) {
    send('purchase', {
      transaction_id: opts.transactionId,
      currency: 'INR',
      value: opts.value,
      shipping: opts.shipping ?? 0,
      items: opts.items,
      ...(opts.coupon ? { coupon: opts.coupon } : {}),
    });
  },
};
