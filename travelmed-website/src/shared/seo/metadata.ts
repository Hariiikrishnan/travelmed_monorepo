import type { Metadata } from 'next';
import { absoluteUrl, site } from '@/shared/config/site';

interface BuildMetadataOptions {
  /** Page title without the brand suffix (the root template appends "| TravelMed"). */
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  /** Use for the home page so the template isn't applied. */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
}

/** Consistent per-page metadata: absolute canonical, OpenGraph, Twitter and robots. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  absoluteTitle = false,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl('/opengraph-image');

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    // Only override robots for noindex pages; otherwise inherit the site-wide defaults
    ...(noIndex ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } } : {}),
  };
}
