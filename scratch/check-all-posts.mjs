import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.instagramPost.findMany({
    select: { id: true, instagramId: true, caption: true, category: true, isVisible: true, mediaType: true, permalink: true }
  });
  console.log('Total in db:', all.length);
  const byCat = {};
  all.forEach(x => { byCat[x.category] = (byCat[x.category] || 0) + 1; });
  console.log('By category:', byCat);

  const images = all.filter(x => x.mediaType === 'IMAGE');
  console.log('Images count:', images.length);
  images.forEach(img => {
    console.log(`[${img.category}] ${img.caption?.slice(0, 50)} - ${img.permalink}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
