import { PrismaClient } from '@prisma/client';

const passwords = ['postgres', 'admin', 'root', 'password', '123456', 'admin123', '1234', 'p@ssword', 'P@ssword', 'Postgres', 'travelmed', ''];

async function test() {
  for (const pw of passwords) {
    const url = pw 
      ? `postgresql://postgres:${pw}@localhost:5432/postgres?schema=public`
      : `postgresql://postgres@localhost:5432/postgres?schema=public`;
    
    console.log(`Testing password: "${pw}"`);
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url
        }
      }
    });

    try {
      // Try a simple query
      await prisma.$queryRaw`SELECT 1`;
      console.log(`\n🎉 SUCCESS! Database connected with password: "${pw}"`);
      console.log(`DATABASE_URL should be: "postgresql://postgres:${pw}@localhost:5432/travelmed?schema=public"`);
      await prisma.$disconnect();
      process.exit(0);
    } catch (err) {
      // If error is code P1000 (Authentication failed), we continue.
      // Other database connection errors might indicate postgres is up but credentials are wrong.
      console.log(`Failed for "${pw}": ${err.message.substring(0, 120)}`);
      await prisma.$disconnect();
    }
  }
  console.log('\n❌ None of the common passwords worked.');
  process.exit(1);
}

test();
