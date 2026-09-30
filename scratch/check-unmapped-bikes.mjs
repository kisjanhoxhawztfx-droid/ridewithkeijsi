import { PrismaClient } from '@prisma/client';
import { getMotorcycleYouTubeId } from '../src/lib/motorcycleParser.js';

const prisma = new PrismaClient();

async function main() {
  const bikes = await prisma.instagramPost.findMany({
    where: { category: 'SHITET' },
    select: { id: true, instagramId: true, caption: true, permalink: true, thumbnailUrl: true }
  });

  console.log(`Checking ${bikes.length} motorcycles for YouTube mapping...`);
  let unmapped = 0;
  for (const b of bikes) {
    const ytId = getMotorcycleYouTubeId(b);
    if (!ytId) {
      unmapped++;
      console.log(`UNMAPPED: ${b.permalink} - ${b.caption?.slice(0, 40).replace(/\n/g, ' ')}`);
    } else {
      console.log(`MAPPED: ${ytId} - ${b.caption?.slice(0, 30).replace(/\n/g, ' ')}`);
    }
  }
  console.log(`Total unmapped: ${unmapped} / ${bikes.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
