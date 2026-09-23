import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const missingIds = [
  '3991729022643209331',
  '3991091514703924345', 
  '3986831295432111758',
  '3990946491526667870',
  '3986608836957282817'
];

async function main() {
  for (const id of missingIds) {
    const post = await db.instagramPost.findFirst({
      where: { instagramId: id },
      select: {
        instagramId: true,
        mediaUrl: true,
        thumbnailUrl: true,
        permalink: true,
        caption: true,
      }
    });
    
    if (post) {
      console.log(`\nID: ${id}`);
      console.log(`  mediaUrl: ${post.mediaUrl}`);
      console.log(`  thumbnailUrl: ${post.thumbnailUrl}`);
      console.log(`  permalink: ${post.permalink}`);
      const captionStart = post.caption?.substring(0, 60) || '(no caption)';
      console.log(`  caption: ${captionStart}`);
    } else {
      console.log(`\nID: ${id} - NOT FOUND IN DB`);
    }
  }

  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });

