const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function checkEpisodes() {
  const posts = await db.instagramPost.findMany({
    where: { category: "EPISOD" },
    orderBy: { postedAt: "desc" },
  });
  console.log(`Total EPISOD posts in DB: ${posts.length}`);
  posts.forEach((p, i) => {
    console.log(`\n#${i + 1} [${p.id}] Shortcode: ${p.permalink}`);
    console.log(`Caption: ${p.caption}`);
  });
}

checkEpisodes()
  .then(() => db.$disconnect())
  .catch(console.error);
