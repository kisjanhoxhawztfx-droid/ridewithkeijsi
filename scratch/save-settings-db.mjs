import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.siteSetting.findMany();
  console.log('SiteSettings in DB:', settings.map(s => ({ key: s.key, value: s.value ? s.value.slice(0, 15) + '...' : null })));

  // Check if rapidapi_key exists in siteSetting or if we can save it there
  const key = process.env.RAPIDAPI_KEY;
  console.log('Current RAPIDAPI_KEY from .env:', key);

  if (key) {
    await prisma.siteSetting.upsert({
      where: { key: 'rapidapi_key' },
      update: { value: key },
      create: { key: 'rapidapi_key', value: key }
    });
    console.log('Saved rapidapi_key into database siteSetting table!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
