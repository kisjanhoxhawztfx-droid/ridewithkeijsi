import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const apiKey = process.env.RAPIDAPI_KEY || "7b910a7ee5mshabcc5df6919c3a0p11cae0jsn4875c9201a43";

async function downloadThumbnail(cdnUrl, instagramId) {
  try {
    const dir = path.join(process.cwd(), "public", "instagram");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${instagramId}.jpg`);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      return `/instagram/${instagramId}.jpg`;
    }
    const res = await fetch(cdnUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return `/instagram/${instagramId}.jpg`;
  } catch {
    return null;
  }
}

async function fetchAllPosts() {
  let allEdges = [];
  let cursor = null;
  let hasNext = true;
  let page = 1;

  while (hasNext && page <= 6) {
    const url = cursor
      ? `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=ridewithkeijsi&end_cursor=${encodeURIComponent(cursor)}`
      : `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_posts?username_or_id=ridewithkeijsi`;

    console.log(`Fetching page ${page}...`);
    const res = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'instagram-public-bulk-scraper.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      }
    });

    if (!res.ok) {
      console.error(`Page ${page} failed with status: ${res.status}`);
      break;
    }

    const j = await res.json();
    const edges = j.data?.edges || [];
    console.log(`Page ${page} returned ${edges.length} items.`);
    allEdges.push(...edges);

    const pageInfo = j.data?.page_info;
    if (pageInfo?.has_next_page && pageInfo?.end_cursor) {
      cursor = pageInfo.end_cursor;
      hasNext = true;
      page++;
    } else {
      hasNext = false;
    }
  }

  console.log(`Total edges collected: ${allEdges.length}`);
  return allEdges;
}

async function main() {
  const edges = await fetchAllPosts();
  let forYouCount = 0;
  let motorcycleCount = 0;

  for (const item of edges) {
    const node = item.node;
    if (!node) continue;

    const instagramId = String(node.id);
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
    const lowerCap = caption.toLowerCase();
    const shortcode = node.shortcode;
    const permalink = `https://www.instagram.com/p/${shortcode}/`;
    const isVideo = Boolean(node.is_video);
    const mediaType = isVideo ? "VIDEO" : "IMAGE";
    const mediaUrl = node.video_url || node.display_url || null;
    const displayUrl = node.display_url || null;
    const postedAt = node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000) : new Date();

    // Check if existing in DB
    const existing = await prisma.instagramPost.findUnique({ where: { instagramId } });

    // Classification:
    // Is it a motorcycle for sale?
    const hasMotorrKeyword = (
      lowerCap.includes("#motorr") ||
      lowerCap.includes("#motorra") ||
      lowerCap.includes("#motor") ||
      lowerCap.includes("#shitet") ||
      lowerCap.includes("shitet") ||
      lowerCap.includes("shitur") ||
      lowerCap.includes("u shit")
    );
    const hasPhone = /\b(06[789]\d{7}|\+355\s*6[789]\d{7})\b/.test(caption);
    const hasSpecs = /(\d+[\.,]?\d*)\s*(?:cc|hp|km|€|eur)/i.test(caption);
    const isMotorra = (hasMotorrKeyword && (hasPhone || hasSpecs)) || (existing && existing.category === "SHITET") || hasMotorrKeyword;

    // RULE:
    // If it's a motorcycle, category: "SHITET"
    // EVERYTHING ELSE (videos, reels, photos, graphics, announcements): category: "EPISOD" (FOR YOU)!
    const category = isMotorra ? "SHITET" : "EPISOD";

    // Download thumbnail locally
    let thumbnailUrl = null;
    if (displayUrl) {
      thumbnailUrl = await downloadThumbnail(displayUrl, instagramId);
    }
    if (!thumbnailUrl && displayUrl) {
      thumbnailUrl = displayUrl;
    }

    let status = "FOR_SALE";
    if (isMotorra) {
      if (existing?.status) {
        status = existing.status;
      } else {
        const isSold = (
          /\b(shitur|e shitur|u shit|ushit|sold|e-shitur)\b/i.test(lowerCap) ||
          lowerCap.includes("#shitur") ||
          lowerCap.includes("#ushit") ||
          lowerCap.includes("❌")
        );
        status = isSold ? "SOLD" : "FOR_SALE";
      }
      motorcycleCount++;
    } else {
      status = "FOR_SALE";
      forYouCount++;
    }

    await prisma.instagramPost.upsert({
      where: { instagramId },
      update: {
        caption,
        permalink,
        mediaUrl: mediaUrl || existing?.mediaUrl,
        thumbnailUrl: thumbnailUrl || existing?.thumbnailUrl,
        mediaType,
        category,
        status,
        isVisible: true,
      },
      create: {
        instagramId,
        caption,
        permalink,
        mediaUrl,
        thumbnailUrl,
        mediaType,
        category,
        status,
        isVisible: true,
        postedAt,
      },
    });

    console.log(`[${category}] [${mediaType}] ${shortcode}: ${caption.slice(0, 40).replace(/\n/g, ' ')}`);
  }

  console.log(`\nDONE! Final: ${motorcycleCount} motorcycles (SHITET), ${forYouCount} for you items (EPISOD).`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
