import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const eps = await db.episode.findMany({ 
  where: { youtubeVideoId: { not: { startsWith: "demo" } } },
  orderBy: { publishedAt: "desc" }, 
  select: { id: true, youtubeVideoId: true, title: true, duration: true } 
});
eps.forEach((e, i) => console.log(`${i+1}. [${e.duration}] ${e.youtubeVideoId} | ${e.title}`));
await db.$disconnect();
