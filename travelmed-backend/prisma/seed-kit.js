import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Travel Med Kit...');

  await prisma.kitType.upsert({
    where: { id: 'kt-long-stay' },
    update: {},
    create: {
      id: 'kt-long-stay',
      slug: 'long-stay-abroad',
      name: 'Long-Stay Abroad',
      description: 'For travellers staying abroad for several weeks or months.',
      sortOrder: 1,
    }
  });

  await prisma.product.upsert({
    where: { id: 'kit-standard-india' },
    update: {
      price: 2500,
    },
    create: {
      id: 'kit-standard-india',
      slug: 'kit-standard-india',
      name: 'Travel Med Kit - Standard Package',
      sku: 'TM-KIT-STD',
      mrp: 4500,
      price: 2500,
      gstPercent: 5,
      stock: 500,
      status: 'In Stock',
      visibility: 'Visible',
      description: 'Includes 150+ curated medicines, a signed doctor prescription, a waterproof pouch and 2 free teleconsultations.',
      highlights: ['150+ curated medicines', '17 medicine categories', 'Signed doctor prescription', '2 free doctor teleconsultations'],
      benefits: ['Avoid expensive clinic visits abroad', 'Doctor support while travelling'],
      specs: { Material: '1680D ballistic nylon', Dimensions: '8.2 × 5.5 × 2.4 in', Zipper: 'YKK waterproof' },
      faqs: [],
      images: ['/pro.webp', '/products.webp', '/products/trollybag.webp', '/products/handbag.webp', '/products/backpack.webp', '/products/all rounder.webp'],
      seoTitle: 'Buy Travel Medicine Kit Online in India',
      seoDescription: 'Doctor-curated travel medical kit with 150+ medicines, a signed prescription and 2 free doctor consults.',
      kitTypeId: 'kt-long-stay',
      tagline: 'Complete travel pharmacy & medical pouch',
      tripLength: 'Long stays abroad (15+ days)',
      bagSize: '8.2 × 5.5 × 2.4 in',
      consultsIncluded: 2,
      isFeatured: true,
      sortOrder: 1
    }
  });

  console.log('Travel Med Kit product ensured with price 2500.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
