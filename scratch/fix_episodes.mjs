import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// IDs e videos te shkurtra (jo episodë te vertete) qe duhen fshire
const toDeleteVideoIds = [
  "4RCUBrQfC4I",  // Episodi i Plote - 1:13
  "hHOFmgMqHwI",  // Te Saci - 1:33
  "9j_uVVqnc0o",  // Te Saci - 2:41
  "zbHlEcP2gd0",  // #RideWithKeijsi #RoadTalk - 1:44
  "QWfdODT5_aA",  // Artan Kola ft Keijsi - 1:51
  "ojIFJ3VO8I0",  // Optik de Lunette - 1:02
  "5PR-IOaZuZs",  // Cfare Stenaldo kameraman - 1:25
];

// Gjithashtu fshi episodet demo
const demosDeleted = await db.episode.deleteMany({
  where: { youtubeVideoId: { startsWith: "demo" } }
});
console.log(`Deleted ${demosDeleted.count} demo episodes`);

const deleted = await db.episode.deleteMany({
  where: { youtubeVideoId: { in: toDeleteVideoIds } }
});
console.log(`Deleted ${deleted.count} short/clip videos`);

// Shfaq ato qe mbeten
const remaining = await db.episode.findMany({
  orderBy: { publishedAt: "desc" },
  select: { youtubeVideoId: true, title: true, duration: true }
});
console.log("\nEpisodet qe mbeten:");
remaining.forEach((e, i) => console.log(`  ${i+1}. [${e.duration}] ${e.title}`));

// Set newest real episode as featured
if (remaining.length > 0) {
  await db.episode.updateMany({ data: { isFeatured: false } });
  const newest = await db.episode.findFirst({ orderBy: { publishedAt: "desc" } });
  if (newest) {
    await db.episode.update({ where: { youtubeVideoId: newest.youtubeVideoId }, data: { isFeatured: true } });
    console.log(`\nFeatured: ${newest.title}`);
  }
}

await db.$disconnect();
