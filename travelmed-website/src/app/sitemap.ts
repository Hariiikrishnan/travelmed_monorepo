import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/config/site';
import { BLOG_POSTS } from '@/entities/blog/posts';
import { DESTINATIONS } from '@/entities/destination/data';
import { getCatalog } from '@/shared/api/product';

// Bump when the content of a static page meaningfully changes.
const STATIC_UPDATED = '2026-09-29';

const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/buy', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/teleconsultation', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/how-it-works', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/downloads', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/shipping', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/refund', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kits = await getCatalog();
  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: STATIC_UPDATED,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...kits.filter((k) => !k.isFeatured).map((k) => ({
      url: `${SITE_URL}/buy/${k.slug}`,
      lastModified: k.updatedAt ?? STATIC_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...BLOG_POSTS.map((g) => ({
      url: `${SITE_URL}/blog/${g.slug}`,
      lastModified: g.dateModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...DESTINATIONS.map((d) => ({
      url: `${SITE_URL}/travel-medicine-kit/${d.slug}`,
      lastModified: d.dateModified,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];
}
