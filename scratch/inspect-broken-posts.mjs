import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.instagramPost.findMany({
    where: {
      permalink: { in: [
        'https://www.instagram.com/p/Ddl8sVrAQEy/',
        'https://www.instagram.com/p/DdjCY5Bg8b6/',
        'https://www.instagram.com/p/DdMyfMoOvyi/',
        'https://www.instagram.com/p/DZDL-EhiT7i/',
        'https://www.instagram.com/p/DdleGWiRARz/',
        'https://www.instagram.com/p/DdjNJZAAMx5/',
        'https://www.instagram.com/p/DdisLBpCd5e/'
      ]}
    },
    select: { id: true, instagramId: true, caption: true, thumbnailUrl: true, mediaUrl: true, permalink: true, category: true, status: true }
  });

  for (const p of posts) {
    console.log(`\n--- ${p.permalink} ---`);
    console.log(`Category: ${p.category}, Status: ${p.status}`);
    console.log(`Caption: ${p.caption?.slice(0, 40)}`);
    console.log(`Thumbnail: ${p.thumbnailUrl}`);
    if (p.thumbnailUrl && p.thumbnailUrl.startsWith('/')) {
      const localFile = 'public' + p.thumbnailUrl;
      console.log(`Local file ${localFile} exists: ${fs.existsSync(localFile)}, size: ${fs.existsSync(localFile) ? fs.statSync(localFile).size : 0}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
