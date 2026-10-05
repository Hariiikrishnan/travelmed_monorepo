import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Medicine Details',
  description: 'Details of a medicine included in the TravelMed kit.',
  path: '/buy',
  noIndex: true,
});

export default function MedicineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
