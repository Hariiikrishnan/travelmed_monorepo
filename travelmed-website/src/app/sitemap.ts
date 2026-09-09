import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travelmed.org';
  const currentDate = new Date().toISOString();

  const routes = [
    '',
    '/buy',
    '/teleconsultation',
    '/medicine',
    '/faq',
    '/how-it-works',
    '/about',
    '/contact',
    '/track-order',
    '/shipping',
    '/refund',
    '/privacy',
    '/terms',
    '/travel-blog',
    '/travel-guide',
  ];

  return routes.map((route) => {
    let priority = 0.7;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';

    if (route === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/buy' || route === '/teleconsultation' || route === '/medicine') {
      priority = 0.9;
      changeFrequency = 'daily';
    } else if (route === '/faq' || route === '/how-it-works') {
      priority = 0.8;
      changeFrequency = 'weekly';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    };
  });
}
