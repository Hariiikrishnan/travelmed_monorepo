import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Paid Consultation product...');
  
  await prisma.product.upsert({
    where: { id: 'paid-consultation' },
    update: {
      mrp: 1500,
      price: 500,
      consultsIncluded: 1,
    },
    create: {
      id: 'paid-consultation',
      slug: 'paid-consultation',
      name: 'Paid Teleconsultation',
      sku: 'TM-CONSULT',
      mrp: 1500,
      price: 500,
      stock: 999999, // unlimited essentially
      status: 'In Stock',
      visibility: 'Visible', // or 'Hidden' if we don't want it on main products page, but let's say Visible
      description: 'One extra teleconsultation with a board-certified doctor.',
      consultsIncluded: 1,
    },
  });

  console.log('Paid Consultation product added/updated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
