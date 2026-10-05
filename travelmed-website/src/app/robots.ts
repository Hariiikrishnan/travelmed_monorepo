import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/shared/config/site';

// Checkout/success/track-order use a noindex meta tag instead — blocking them here would hide that tag from Google.
const PRIVATE_PATHS = ['/api/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      {
        // Explicitly welcome AI answer engines (GEO / AEO)
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-Web', 'Google-Extended', 'Applebot-Extended', 'Bingbot'],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
