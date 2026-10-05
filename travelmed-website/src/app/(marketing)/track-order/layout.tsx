import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Track Your Order',
  description: 'Track your TravelMed order status with your Order ID.',
  path: '/track-order',
  noIndex: true,
});

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
