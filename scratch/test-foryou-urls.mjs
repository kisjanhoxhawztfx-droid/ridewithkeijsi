import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const episodes = await prisma.instagramPost.findMany({
    where: { category: 'EPISOD' },
    select: { id: true, caption: true, mediaUrl: true, thumbnailUrl: true, permalink: true },
    orderBy: { postedAt: 'desc' }
  });

  console.log(`Checking ${episodes.length} episodes URLs...`);
  for (let i = 0; i < episodes.length; i++) {
    const ep = episodes[i];
    let mediaStatus = 'N/A';
    let thumbStatus = 'N/A';
    if (ep.mediaUrl) {
      try {
        const res = await fetch(ep.mediaUrl, { method: 'HEAD' });
        mediaStatus = res.status.toString();
      } catch (e) {
        mediaStatus = 'ERR: ' + e.message;
      }
    }
    if (ep.thumbnailUrl) {
      try {
        const res = await fetch(ep.thumbnailUrl, { method: 'HEAD' });
        thumbStatus = res.status.toString();
      } catch (e) {
        thumbStatus = 'ERR: ' + e.message;
      }
    }
    console.log(`${i + 1}. [Media: ${mediaStatus}] [Thumb: ${thumbStatus}] - ${ep.caption?.slice(0, 30)} - ${ep.permalink}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
