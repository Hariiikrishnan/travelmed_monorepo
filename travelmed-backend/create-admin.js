import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@travelmed.org';
  const adminPassword = 'Admin@2026';
  
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      role: 'admin'
    },
    create: {
      email: adminEmail,
      password: hashedAdminPassword,
      name: 'System Administrator',
      role: 'admin'
    }
  });
  console.log(`Admin account ensured: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
