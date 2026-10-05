import { buildMetadata } from '@/shared/seo/metadata';
import { JsonLd, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

export const metadata = buildMetadata({
  title: 'Travel Health Downloads – Medication Guide & Checklists',
  description: 'Download the TravelMed pouch medication guide, customs checklist and travel health checklist to prepare for your international trip.',
  path: '/downloads',
});

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Downloads', url: '/downloads' }])} />
      {children}
    </>
  );
}
