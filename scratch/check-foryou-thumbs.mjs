import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.instagramPost.findMany({
    where: { category: 'EPISOD' },
    select: { id: true, instagramId: true, caption: true, permalink: true, thumbnailUrl: true, mediaType: true }
  });

  console.log(`Checking ${posts.length} EPISOD posts...`);
  for (const p of posts) {
    let status = 'NONE';
    if (p.thumbnailUrl) {
      if (p.thumbnailUrl.startsWith('http')) {
        try {
          const res = await fetch(p.thumbnailUrl, { method: 'HEAD' });
          status = res.status.toString();
        } catch (e) {
          status = 'ERR: ' + e.message;
        }
      } else {
        status = 'LOCAL: ' + p.thumbnailUrl;
      }
    }
    console.log(`[${status}] [${p.mediaType}] ${p.permalink} - ${p.caption?.slice(0, 35).replace(/\n/g, ' ')}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
