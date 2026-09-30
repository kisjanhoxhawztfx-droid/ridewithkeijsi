const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function check() {
  const sc1 = await db.instagramPost.findFirst({ where: { permalink: { contains: "DdUcoevRRcx" } } });
  const sc2 = await db.instagramPost.findFirst({ where: { permalink: { contains: "DdcFLKgR9ef" } } });
  console.log("DdUcoevRRcx in DB:", !!sc1);
  console.log("DdcFLKgR9ef in DB:", !!sc2);
}

check().then(() => db.$disconnect());
