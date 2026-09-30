import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.instagramPost.count();
  const byCategory = await prisma.instagramPost.groupBy({
    by: ['category', 'isVisible'],
    _count: true
  });
  console.log('Total Instagram posts:', total);
  console.log('By category & visibility:', JSON.stringify(byCategory, null, 2));

  const episodes = await prisma.instagramPost.findMany({
    where: { category: 'EPISOD' },
    select: { id: true, caption: true, mediaUrl: true, thumbnailUrl: true, isVisible: true, postedAt: true, permalink: true },
    orderBy: { postedAt: 'desc' }
  });
  console.log('Total EPISOD posts in DB:', episodes.length);
  const withoutMedia = episodes.filter(e => !e.mediaUrl);
  console.log('EPISOD posts without mediaUrl:', withoutMedia.length);
  console.log('Sample episodes:');
  episodes.forEach((e, idx) => {
    console.log(`${idx + 1}. [${e.postedAt.toISOString().slice(0, 10)}] ${e.caption ? e.caption.substring(0, 50).replace(/\n/g, ' ') : 'NO CAPTION'} | media: ${!!e.mediaUrl} | thumb: ${!!e.thumbnailUrl}`);
  });

  // Also check standard Episode model
  const regularEpisodes = await prisma.episode.findMany({
    select: { id: true, title: true, isVisible: true, videoUrl: true, youtubeVideoId: true }
  });
  console.log('\nStandard Episode model items:', regularEpisodes.length);
  regularEpisodes.forEach((ep, i) => {
    console.log(`${i+1}. ${ep.title} | ytId: ${ep.youtubeVideoId} | videoUrl: ${ep.videoUrl}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
