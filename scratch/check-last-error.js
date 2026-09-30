const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const log = await db.syncLog.findFirst({
    where: { status: "ERROR" },
    orderBy: { startedAt: "desc" },
  });
  console.log("Last Error Detail:", log?.errorDetail);
}

main().then(() => db.$disconnect());
