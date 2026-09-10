import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// Delete any demo episodes
const deletedDemos = await db.episode.deleteMany({
  where: {
    OR: [
      { youtubeVideoId: { contains: "demo" } },
      { slug: { contains: "demo" } }
    ]
  }
});
console.log(`Deleted demo episodes: ${deletedDemos.count}`);

// Set the newest episode as featured
await db.episode.updateMany({ data: { isFeatured: false } });
const newest = await db.episode.findFirst({
  where: { isVisible: true },
  orderBy: { publishedAt: "desc" }
});

if (newest) {
  await db.episode.update({
    where: { id: newest.id },
    data: { isFeatured: true }
  });
  console.log(`Newest featured episode: ${newest.title} (${newest.duration})`);
}

// Show remaining list
const all = await db.episode.findMany({
  orderBy: { publishedAt: "desc" },
  select: { title: true, duration: true, isFeatured: true }
});
console.log("\nAktualisht në DB (Episodet reale):");
all.forEach((e, i) => console.log(`${i + 1}. [${e.duration}] ${e.title} ${e.isFeatured ? "⭐ (FEATURED)" : ""}`));

await db.$disconnect();
