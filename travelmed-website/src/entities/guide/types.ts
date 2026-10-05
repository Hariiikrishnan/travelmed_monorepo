export interface ArticleSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Numbered steps */
  steps?: string[];
  table?: { head: string[]; rows: string[][] };
  callout?: { tone: 'info' | 'warning'; title: string; text: string };
  /** Pre-formatted text block (e.g. a letter template) */
  template?: { title: string; body: string };
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface ArticleSource {
  label: string;
  url: string;
}

/** Shared content model for /blog/[slug] and /travel-medicine-kit/[destination]. */
export interface Article {
  slug: string;
  /** Visible H1 */
  title: string;
  /** <title> without brand suffix, ≤ ~48 chars (template adds "| TravelMed") */
  metaTitle: string;
  /** Meta description, ≤ ~155 chars */
  description: string;
  /** Primary keyword this page targets (for editors; not rendered). */
  keyword: string;
  eyebrow: string;
  /** 40–60 word answer-first summary for AI Overviews / featured snippets. */
  quickAnswer: string;
  datePublished: string;
  dateModified: string;
  readingMinutes: number;
  image?: string;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  sources: ArticleSource[];
  /** Slugs of related blog posts. */
  relatedGuides: string[];
  /** Slugs of related destinations. */
  relatedDestinations?: string[];
}

export const BLOG_CATEGORIES = ['Buying guides', 'Packing & checklists', 'Flights & customs', 'Health on the go'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPost extends Article {
  category: BlogCategory;
  /** Cover image path under /public */
  image: string;
  featured?: boolean;
}
