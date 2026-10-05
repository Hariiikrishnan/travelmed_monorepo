import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPost } from '@/entities/blog/posts';
import { ArticleTemplate } from '@/features/guides/ArticleTemplate';
import { blogPath, relatedLinks } from '@/features/guides/related';
import { buildMetadata } from '@/shared/seo/metadata';
import { absoluteUrl } from '@/shared/config/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle,
    description: post.description,
    path: blogPath(post.slug),
    type: 'article',
    image: absoluteUrl(post.image),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const path = blogPath(post.slug);
  return (
    <ArticleTemplate
      article={post}
      path={path}
      label={post.category}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.metaTitle, url: path },
      ]}
      related={relatedLinks(post)}
    />
  );
}
