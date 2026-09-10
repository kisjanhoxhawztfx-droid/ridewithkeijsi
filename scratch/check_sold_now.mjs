import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { readFileSync } from "fs";

const envFile = readFileSync(".env", "utf8");
let apiKey = "";
for (const l of envFile.split("\n")) {
  if (l.startsWith("RAPIDAPI_KEY=")) apiKey = l.split("=")[1].replace(/["']/g, "").trim();
}

const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const username = "ridewithkeijsi";
console.log(`Checking latest posts from @${username}...`);

const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=${username}`;
const res = await fetch(url, {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});

const json = await res.json();
const edges = json.data?.edges || [];
console.log(`Fetched ${edges.length} recent posts from Instagram.`);

for (const edge of edges) {
  const node = edge.node;
  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  const lower = caption.toLowerCase();

  const hasShitet = lower.includes("#shitet") || lower.includes("shitet");
  const hasEpisod = lower.includes("#episod") || lower.includes("episod");

  if (hasShitet || hasEpisod) {
    const category = hasShitet ? "SHITET" : "EPISOD";
    const isSold = category === "SHITET" && (
      lower.includes("shitur") ||
      lower.includes("e shitur") ||
      lower.includes("sold") ||
      lower.includes("#shitur")
    );
    const status = isSold ? "SOLD" : "FOR_SALE";

    const instagramId = String(node.id);
    const permalink = `https://www.instagram.com/p/${node.shortcode}/`;

    const existing = await db.instagramPost.findUnique({ where: { instagramId } });
    if (existing) {
      if (existing.status !== status || existing.caption !== caption) {
        await db.instagramPost.update({
          where: { instagramId },
          data: { caption, status: category === "SHITET" ? status : existing.status }
        });
        console.log(`⚡ STATUSI NDRYSHOI: [${category}] [${status}] ${permalink}`);
      }
    }
  }
}

// Merr te gjithe motorrat ne DB tani
const forSale = await db.instagramPost.findMany({
  where: { category: "SHITET", status: "FOR_SALE" },
  select: { id: true, permalink: true, caption: true, status: true }
});

const sold = await db.instagramPost.findMany({
  where: { category: "SHITET", status: "SOLD" },
  select: { id: true, permalink: true, caption: true, status: true }
});

console.log(`\n=== MOTORRAT NË SHITJE (${forSale.length}) ===`);
forSale.forEach((p, i) => console.log(`${i+1}. [${p.status}] ${p.permalink} | "${p.caption.slice(0, 70)}..."`));

console.log(`\n=== MOTORRAT E SHITUR (${sold.length}) ===`);
sold.forEach((p, i) => console.log(`${i+1}. [${p.status}] ${p.permalink} | "${p.caption.slice(0, 70)}..."`));

await db.$disconnect();
