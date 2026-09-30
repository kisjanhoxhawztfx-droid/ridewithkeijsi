import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const motorcycles = await prisma.instagramPost.findMany({
    where: { category: 'SHITET' },
    select: { id: true, instagramId: true, caption: true, status: true, permalink: true, thumbnailUrl: true }
  });

  console.log(`Checking ${motorcycles.length} motorcycles for SOLD detection...`);
  let shouldBeSold = 0;
  for (const m of motorcycles) {
    const cap = (m.caption || "").toLowerCase();
    const isSoldText = (
      cap.includes("shitur") ||
      cap.includes("e shitur") ||
      cap.includes("u shit") ||
      cap.includes("ushit") ||
      cap.includes("sold") ||
      cap.includes("❌")
    );

    if (isSoldText) {
      shouldBeSold++;
      console.log(`[STATUS: ${m.status}] -> SHOULD BE SOLD: ${m.permalink} - ${m.caption?.slice(0, 40).replace(/\n/g, ' ')}`);
    }
  }
  console.log(`Total that should be SOLD: ${shouldBeSold}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
