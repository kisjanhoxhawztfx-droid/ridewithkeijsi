import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const forSale = await db.instagramPost.count({ where: { category: "SHITET", status: "FOR_SALE" } });
const sold = await db.instagramPost.count({ where: { category: "SHITET", status: "SOLD" } });
const forYou = await db.instagramPost.count({ where: { category: "EPISOD" } });

console.log(`\nAktualisht në DB nga @ridewithkeijsi:`);
console.log(`- Motorra në shitje (#shitet): ${forSale}`);
console.log(`- Motorra të shitur (shitur): ${sold}`);
console.log(`- For You (#episod): ${forYou}`);

const sample = await db.instagramPost.findMany({ take: 5, orderBy: { postedAt: "desc" } });
sample.forEach((p, i) => console.log(`${i+1}. [${p.category}] ${p.caption.slice(0, 60)}...`));

await db.$disconnect();
