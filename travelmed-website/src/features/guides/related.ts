import type { Article } from '@/entities/guide/types';
import { BLOG_POSTS } from '@/entities/blog/posts';
import { DESTINATIONS } from '@/entities/destination/data';
import type { RelatedLink } from './ArticleTemplate';

export const blogPath = (slug: string) => `/blog/${slug}`;
export const destinationPath = (slug: string) => `/travel-medicine-kit/${slug}`;

/** Resolve an article's related slugs into links (unknown slugs are skipped). */
export function relatedLinks(article: Article): RelatedLink[] {
  const posts = article.relatedGuides
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof BLOG_POSTS)[number] => Boolean(p))
    .map((p) => ({ href: blogPath(p.slug), title: p.title, eyebrow: p.category, image: p.image, readingMinutes: p.readingMinutes }));

  const destinations = (article.relatedDestinations ?? [])
    .map((slug) => DESTINATIONS.find((d) => d.slug === slug))
    .filter((d): d is (typeof DESTINATIONS)[number] => Boolean(d))
    .map((d) => ({ href: destinationPath(d.slug), title: d.title, eyebrow: d.name, image: d.image, readingMinutes: d.readingMinutes }));

  return [...posts, ...destinations].filter((l) => !l.href.endsWith(`/${article.slug}`)).slice(0, 4);
}
