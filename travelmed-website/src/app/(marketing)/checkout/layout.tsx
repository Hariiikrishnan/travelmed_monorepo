import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Secure Checkout',
  description: 'Complete your TravelMed order securely with Razorpay.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
