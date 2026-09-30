const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const logs = await db.syncLog.findMany({
    orderBy: { startedAt: "desc" },
    take: 10,
  });
  console.log("Recent Sync Logs:");
  logs.forEach((l) => {
    console.log(`- [${l.startedAt?.toISOString()}] ${l.platform} | Status: ${l.status} | Items: ${l.itemsSynced} | Message: ${l.message}`);
  });
}

main().then(() => db.$disconnect());
