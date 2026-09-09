import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travelmed.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout/success', '/api/'],
      },
      {
        // Allow AI & Answer Engines explicitly for GEO/AEO optimization
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Claude-Web',
          'Google-Extended',
          'Bingbot',
          'Slurp',
          'Baiduspider',
          'facebookexternalhit'
        ],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
