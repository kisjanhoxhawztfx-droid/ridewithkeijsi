const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  await prisma.siteSetting.upsert({
    where: { key: "taxi_phone" },
    update: { value: "+355697777799" },
    create: { key: "taxi_phone", value: "+355697777799", group: "taxi" },
  });

  await prisma.siteSetting.upsert({
    where: { key: "taxi_whatsapp" },
    update: { value: "+355697777799" },
    create: { key: "taxi_whatsapp", value: "+355697777799", group: "taxi" },
  });

  console.log("Updated taxi_phone and taxi_whatsapp to +355697777799 in DB");
  await prisma.$disconnect();
}

run();
