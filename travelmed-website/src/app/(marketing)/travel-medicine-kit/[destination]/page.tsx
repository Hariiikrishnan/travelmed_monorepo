import { notFound } from 'next/navigation';
import { DESTINATIONS, getDestination } from '@/entities/destination/data';
import { ArticleTemplate } from '@/features/guides/ArticleTemplate';
import { destinationPath, relatedLinks } from '@/features/guides/related';
import { buildMetadata } from '@/shared/seo/metadata';
import { absoluteUrl } from '@/shared/config/site';

interface PageProps {
  params: Promise<{ destination: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ destination: d.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { destination } = await params;
  const dest = getDestination(destination);
  if (!dest) return {};
  return buildMetadata({
    title: dest.metaTitle,
    description: dest.description,
    path: destinationPath(dest.slug),
    type: 'article',
    image: dest.image ? absoluteUrl(dest.image) : undefined,
  });
}

export default async function DestinationPage({ params }: PageProps) {
  const { destination } = await params;
  const dest = getDestination(destination);
  if (!dest) notFound();

  const path = destinationPath(dest.slug);
  return (
    <ArticleTemplate
      article={dest}
      path={path}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: dest.name, url: path },
      ]}
      related={relatedLinks(dest)}
      label={dest.eyebrow}
    />
  );
}
