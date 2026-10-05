import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import { BLOG_POSTS } from '@/entities/blog/posts';
import { DESTINATIONS } from '@/entities/destination/data';
import { BLOG_CATEGORIES } from '@/entities/guide/types';
import { blogPath, destinationPath } from '@/features/guides/related';
import { BlogExplorer } from '@/features/guides/BlogExplorer';
import { Eyebrow } from '@/shared/ui/PageHero';
import { buildMetadata } from '@/shared/seo/metadata';
import { JsonLd, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';
import { absoluteUrl, site } from '@/shared/config/site';
import { getFeaturedKit } from '@/shared/api/product';
import { derivePricing } from '@/shared/pricing';

export const metadata = buildMetadata({
  title: 'Travel Health Blog for Indian Travellers',
  description:
    'Doctor-reviewed travel health articles: best travel medical kit, medicines to carry abroad from India, flying with medicines, banned medicines and destination guides.',
  path: '/blog',
});

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'TravelMed Blog',
  url: absoluteUrl('/blog'),
  publisher: { '@id': `${site.url}/#organization` },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      ...BLOG_POSTS.map((p) => absoluteUrl(blogPath(p.slug))),
      ...DESTINATIONS.map((d) => absoluteUrl(destinationPath(d.slug))),
    ].map((url, i) => ({ '@type': 'ListItem', position: i + 1, url })),
  },
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function BlogHubPage() {
  const pricing = derivePricing(await getFeaturedKit());
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const rest = BLOG_POSTS.filter((p) => p.slug !== featured.slug);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-background">
      <JsonLd data={itemListSchema} />
      <JsonLd data={buildBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }])} />

      {/* ── Header + featured post ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] text-white">
        <div aria-hidden className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[120px]" />
        <div aria-hidden className="absolute -bottom-40 left-[-10%] h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-40 md:pb-48">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <BookOpen className="h-3.5 w-3.5 text-secondary" /> The TravelMed blog
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight leading-[1.05] !text-white">
              Travel health, <span className="bg-gradient-to-r from-secondary to-teal-200 bg-clip-text text-transparent">made simple.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed">
              Practical, doctor-reviewed advice for Indians travelling abroad — what to pack, how to fly with medicines, and what to do when you fall ill.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/70">
              <ShieldCheck className="h-4 w-4 text-secondary" /> Every article is medically reviewed by {site.founder.name}
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-28 md:-mt-32">
        <Link
          href={blogPath(featured.slug)}
          className="group grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_40px_100px_rgba(11,79,140,0.15)] transition hover:shadow-[0_50px_120px_rgba(11,79,140,0.22)]"
        >
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute left-5 top-5 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              Featured
            </span>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-dark">{featured.category}</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading tracking-tight leading-tight transition-colors group-hover:text-primary">
              {featured.title}
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">{featured.description}</p>
            <div className="mt-7 flex items-center justify-between border-t border-border pt-6">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/founder/sidharathfounder.webp" alt="" className="h-10 w-10 rounded-full object-cover object-top" />
                <div className="text-xs">
                  <p className="font-semibold text-heading">{site.founder.name}</p>
                  <p className="text-slate-400">
                    {formatDate(featured.dateModified)} · {featured.readingMinutes} min read
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* ── All articles ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Eyebrow>Latest articles</Eyebrow>
          <h2 className="mt-3 mb-8 text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">Browse by topic</h2>
          <BlogExplorer
            categories={BLOG_CATEGORIES}
            posts={rest.map((p) => ({
              href: blogPath(p.slug),
              title: p.title,
              description: p.description,
              category: p.category,
              image: p.image,
              readingMinutes: p.readingMinutes,
              date: p.dateModified,
            }))}
          />
        </div>
      </section>

      {/* ── Destinations ── */}
      <section className="py-16 md:py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Eyebrow>Destination guides</Eyebrow>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">Medicines to carry, by destination</h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500">Local health risks and medicine-import rules for popular trips from India.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DESTINATIONS.map((d) => (
              <Link key={d.slug} href={destinationPath(d.slug)} className="group relative block aspect-[16/11] overflow-hidden rounded-[24px] bg-slate-200">
                {d.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                    <MapPin className="h-3.5 w-3.5" /> {d.name}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug !text-white">{d.title}</h3>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-white/70">
                    <Clock className="h-3.5 w-3.5" /> {d.readingMinutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-[#0A3F70] p-8 sm:p-12 text-white shadow-[0_40px_100px_rgba(11,79,140,0.25)]">
            <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <Eyebrow light>Skip the pharmacy run</Eyebrow>
                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading tracking-tight !text-white leading-tight">
                  Everything our guides recommend, in one doctor-curated pouch.
                </h2>
                <p className="mt-3 text-white/70">
                  {site.product.medicines} medicines · signed prescription · {site.consults.count} free doctor consults · free shipping across India
                </p>
              </div>
              <Link
                href="/buy"
                className="group inline-flex shrink-0 items-center gap-2 rounded-[14px] bg-secondary px-7 py-4 text-base font-bold text-white shadow-lg shadow-secondary/30 transition hover:bg-secondary-dark"
              >
                <ShoppingBag className="h-5 w-5" /> Shop the kit{pricing ? ` · ${pricing.priceText}` : ''}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
