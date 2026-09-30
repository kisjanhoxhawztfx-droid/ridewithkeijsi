const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function listAll() {
  const posts = await db.instagramPost.findMany({
    orderBy: { postedAt: "desc" }
  });
  console.log(`Total posts in DB: ${posts.length}`);
  const shitet = posts.filter(p => p.category === "SHITET");
  const episod = posts.filter(p => p.category === "EPISOD");
  console.log(`SHITET: ${shitet.length}`);
  console.log(`EPISOD: ${episod.length}`);

  console.log("\n--- SHITET POSTS ---");
  shitet.forEach((p, i) => {
    console.log(`${i+1}. [${p.status}] ${p.permalink} | ${p.title || p.caption?.slice(0, 50).replace(/\n/g, ' ')}`);
  });

  console.log("\n--- EPISOD POSTS ---");
  episod.forEach((p, i) => {
    console.log(`${i+1}. [${p.status}] ${p.permalink} | ${p.caption?.slice(0, 50).replace(/\n/g, ' ')}`);
  });
}

listAll().then(() => db.$disconnect());
