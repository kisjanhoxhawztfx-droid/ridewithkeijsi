import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const episodes = await prisma.instagramPost.findMany({
    where: { category: 'EPISOD' },
    select: { id: true, thumbnailUrl: true },
    take: 10
  });

  for (const ep of episodes) {
    const url = 'https://ridewithkeijsi.com' + ep.thumbnailUrl;
    try {
      const res = await fetch(url);
      console.log(ep.thumbnailUrl, '-> Status:', res.status, res.headers.get('content-type'));
    } catch (e) {
      console.log(ep.thumbnailUrl, '-> ERROR:', e.message);
    }
  }
}

check().finally(() => prisma.$disconnect());
