const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  await prisma.siteSetting.upsert({
    where: { key: "youtube_channel_id" },
    update: { value: "@RideWithkeijsi" },
    create: { key: "youtube_channel_id", value: "@RideWithkeijsi", group: "api" },
  });
  await prisma.advertisement.updateMany({
    data: { status: "INACTIVE" },
  });
  console.log("Updated channel to @RideWithkeijsi and deactivated ads");
  await prisma.$disconnect();
}

run();
