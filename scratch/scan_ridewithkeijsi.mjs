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
console.log(`Scanning @${username}...`);

let cursor = "";
let page = 1;
let totalChecked = 0;
let added = 0;
let updated = 0;

while (page <= 10) {
  let url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=${username}`;
  if (cursor) url += `&end_cursor=${encodeURIComponent(cursor)}`;

  const res = await fetch(url, {
    headers: {
      "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
      "x-rapidapi-key": apiKey
    }
  });

  const json = await res.json();
  const edges = json.data?.edges || [];
  if (edges.length === 0) {
    console.log(`[Page ${page}] No posts returned.`);
    break;
  }

  totalChecked += edges.length;
  console.log(`[Page ${page}] Checked ${edges.length} posts...`);

  for (const edge of edges) {
    const node = edge.node;
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
    const lower = caption.toLowerCase();

    const hasShitet = lower.includes("#shitet") || lower.includes("shitet");
    const hasEpisod = lower.includes("#episod") || lower.includes("episod");

    console.log(`   -> [${node.shortcode}] ${caption.replace(/\n/g, " ").slice(0, 70)}...`);

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
      const mediaUrl = node.video_url || node.display_url || null;
      const thumbnailUrl = node.display_url || null;
      const mediaType = node.is_video ? "VIDEO" : "IMAGE";
      const postedAt = node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000) : new Date();

      const existing = await db.instagramPost.findUnique({ where: { instagramId } });

      if (existing) {
        await db.instagramPost.update({
          where: { instagramId },
          data: {
            caption,
            mediaUrl,
            thumbnailUrl,
            status: category === "SHITET" ? status : existing.status,
            category,
            permalink,
          }
        });
        updated++;
        console.log(`   ✅ SINKRONIZUAR (UPDATE): [${category}] [${status}] ${permalink}`);
      } else {
        await db.instagramPost.create({
          data: {
            instagramId,
            caption,
            mediaUrl,
            thumbnailUrl,
            permalink,
            mediaType,
            category,
            status,
            isVisible: true,
            postedAt,
          }
        });
        added++;
        console.log(`   ✅ SINKRONIZUAR (ADD): [${category}] [${status}] ${permalink}`);
      }
    }
  }

  const pageInfo = json.data?.page_info;
  if (!pageInfo?.has_next_page || !pageInfo?.end_cursor) break;
  cursor = pageInfo.end_cursor;
  page++;
}

console.log(`\nScan finished: checked ${totalChecked} posts for @${username}.`);
console.log(`Results: ${added} added, ${updated} updated.`);

await db.$disconnect();
