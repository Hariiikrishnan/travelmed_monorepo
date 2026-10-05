import { buildMetadata } from '@/shared/seo/metadata';
import { getFeaturedKit } from '@/shared/api/product';
import { derivePricing } from '@/shared/pricing';
import HomePageClient from './HomePageClient';

export async function generateMetadata() {
  const pricing = derivePricing(await getFeaturedKit());
  return buildMetadata({
    title: 'Travel Medical Kit for International Trips | TravelMed',
    description: `Doctor-curated travel medical kit for Indians travelling abroad: 150+ medicines, a signed prescription & 2 free doctor consults.${
      pricing ? ` ${pricing.priceText}, free shipping.` : ' Free shipping in India.'
    }`,
    path: '/',
    absoluteTitle: true,
  });
}

export default function HomePage() {
  return <HomePageClient />;
}
