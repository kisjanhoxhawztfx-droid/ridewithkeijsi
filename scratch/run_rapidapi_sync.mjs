import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { readFileSync } from "fs";
const envFile = readFileSync(".env", "utf8");
for (const line of envFile.split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) {
    const val = v.join("=").replace(/^"|"$/g, "").trim();
    if (!process.env[k.trim()]) process.env[k.trim()] = val;
  }
}

const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const apiKey = process.env.RAPIDAPI_KEY;
const username = process.env.INSTAGRAM_USERNAME || "keijsi09";

console.log("Testing RapidAPI sync for @keijsi09...");
const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${username}`;
const res = await fetch(url, {
  headers: {
    "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
    "x-rapidapi-key": apiKey
  }
});
const json = await res.json();
const edges = json.data?.edge_owner_to_timeline_media?.edges || [];
console.log(`Fetched ${edges.length} posts from @${username}`);

let added = 0, updated = 0, skipped = 0;
for (const p of edges) {
  const node = p.node;
  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  const lower = caption.toLowerCase();

  const hasShitet = lower.includes("#shitet");
  const hasEpisod = lower.includes("#episod");

  if (!hasShitet && !hasEpisod) {
    skipped++;
    continue;
  }

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
  const mediaUrl = node.video_url || node.display_url || null;
  const thumbnailUrl = node.display_url || null;
  const mediaType = node.is_video ? "VIDEO" : "IMAGE";
  const postedAt = node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000) : new Date();

  const existing = await db.instagramPost.findUnique({ where: { instagramId } });
  if (existing) {
    await db.instagramPost.update({
      where: { instagramId },
      data: { caption, mediaUrl, thumbnailUrl, status: category === "SHITET" ? status : existing.status, category, permalink }
    });
    updated++;
    console.log(`  UPDATE: [${category}] [${status}] ${node.shortcode}`);
  } else {
    await db.instagramPost.create({
      data: {
        instagramId, caption, mediaUrl, thumbnailUrl, permalink,
        mediaType, category, status, isVisible: true, postedAt
      }
    });
    added++;
    console.log(`  ADD: [${category}] [${status}] ${node.shortcode}`);
  }
}

console.log(`\nResult: ${added} added, ${updated} updated, ${skipped} skipped (without #shitet or #episod).`);
await db.$disconnect();
