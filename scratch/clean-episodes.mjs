import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function cleanEpisodes() {
  const realVideoIds = [
    "JpJ0gMdQkgs", // Episodi 5 Flori Official
    "w6V5S2R7bB8", // Episodi 4 Artan Kola Part 2
    "ia1W5b2nZ-s", // Episodi 4 Artan Kola Part 1
    "98_70ufHplA", // Episodi 3 Ilir Vrenozi Part 2
    "0Ibn4kHXpts", // Episodi 3 Ilir Vrenozi Part 1
    "rxHHbAMrj98", // Episodi 2 Nje udhetim ne Zvicer
    "lYChSWvwSaI", // Episodi 1 Stenaldo i jep Motorrit
  ];

  const deleted = await db.episode.deleteMany({
    where: {
      youtubeVideoId: { notIn: realVideoIds },
    },
  });

  console.log(`Deleted ${deleted.count} non-episode items from Episode table.`);
  const remaining = await db.episode.findMany();
  console.log(`Remaining episodes: ${remaining.length}`);
  remaining.forEach(r => console.log(`- ${r.title}`));
}

cleanEpisodes()
  .then(() => db.$disconnect())
  .catch(console.error);
