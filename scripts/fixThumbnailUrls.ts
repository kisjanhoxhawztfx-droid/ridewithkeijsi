import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function fixThumbnails() {
  // Find all SHITET posts with /instagram/ prefix in thumbnailUrl
  const posts = await db.instagramPost.findMany({
    where: {
      category: "SHITET",
      thumbnailUrl: {
        startsWith: "/instagram/",
      },
    },
    select: { id: true, instagramId: true, thumbnailUrl: true },
  });

  console.log(`Found ${posts.length} posts with /instagram/ thumbnailUrl`);
  
  let updated = 0;
  for (const post of posts) {
    const newUrl = `/api/instagram-image?id=${post.instagramId}`;
    await db.instagramPost.update({
      where: { id: post.id },
      data: { thumbnailUrl: newUrl },
    });
    console.log(`  Updated: ${post.instagramId} → ${newUrl}`);
    updated++;
  }

  // Also fix any remaining ytimg.com thumbnails
  const ytPosts = await db.instagramPost.findMany({
    where: {
      category: "SHITET",
      thumbnailUrl: {
        contains: "ytimg.com",
      },
    },
    select: { id: true, instagramId: true, thumbnailUrl: true },
  });

  console.log(`\nFound ${ytPosts.length} posts with ytimg.com thumbnailUrl`);
  for (const post of ytPosts) {
    const newUrl = `/api/instagram-image?id=${post.instagramId}`;
    await db.instagramPost.update({
      where: { id: post.id },
      data: { thumbnailUrl: newUrl },
    });
    console.log(`  Updated: ${post.instagramId} → ${newUrl}`);
    updated++;
  }

  console.log(`\nTotal updated: ${updated} posts`);
  await db.$disconnect();
}

fixThumbnails().catch((e) => {
  console.error(e);
  process.exit(1);
});
