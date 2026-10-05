import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Order Confirmed',
  description: 'Your TravelMed order has been placed.',
  path: '/success',
  noIndex: true,
});

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
