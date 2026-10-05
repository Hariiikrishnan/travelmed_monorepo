import { buildMetadata } from '@/shared/seo/metadata';

export const metadata = buildMetadata({
  title: 'Doctor Profile',
  description: 'TravelMed teleconsultation doctor profile.',
  path: '/teleconsultation',
  noIndex: true,
});

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
