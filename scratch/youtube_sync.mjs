import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load env manually
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

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "@RideWithkeijsi";

console.log("YouTube API Key:", API_KEY ? API_KEY.slice(0,10) + "..." : "MISSING");
console.log("Channel:", CHANNEL_ID);

function parseDuration(iso) {
  if (!iso) return 0;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1]||0)*3600) + (parseInt(m[2]||0)*60) + parseInt(m[3]||0);
}

function formatDuration(iso) {
  if (!iso) return "0:00";
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return iso;
  const h = parseInt(m[1]||0), min = parseInt(m[2]||0), s = parseInt(m[3]||0);
  const ss = s < 10 ? `0${s}` : `${s}`;
  if (h > 0) {
    const mm = min < 10 ? `0${min}` : `${min}`;
    return `${h}:${mm}:${ss}`;
  }
  return `${min}:${ss}`;
}

function generateSlug(title) {
  return title.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").substring(0, 100);
}

async function run() {
  try {
    // 1. Get channel uploads playlist
    let url = CHANNEL_ID.startsWith("@")
      ? `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(CHANNEL_ID)}&key=${API_KEY}`
      : `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${encodeURIComponent(CHANNEL_ID)}&key=${API_KEY}`;

    const chanRes = await fetch(url);
    const chanData = await chanRes.json();
    if (!chanData.items || chanData.items.length === 0) {
      console.error("Channel not found:", JSON.stringify(chanData));
      process.exit(1);
    }

    const channel = chanData.items[0];
    console.log("Channel found:", channel.snippet.title);
    const uploadsId = channel.contentDetails.relatedPlaylists.uploads;
    console.log("Uploads playlist:", uploadsId);

    // 2. Fetch videos from playlist (max 50)
    const playUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsId}&key=${API_KEY}`;
    const playRes = await fetch(playUrl);
    const playData = await playRes.json();
    const items = playData.items || [];
    console.log(`Found ${items.length} videos in playlist`);

    // 3. Get video details
    const videoIds = items.map(v => v.contentDetails.videoId).filter(Boolean);
    const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`;
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();
    const videoMap = new Map();
    for (const v of (detailData.items || [])) videoMap.set(v.id, v);

    // 4. Upsert into DB (skip shorts)
    let added = 0, updated = 0, shorts = 0;
    for (const item of items) {
      const videoId = item.contentDetails.videoId;
      const detail = videoMap.get(videoId);
      const title = detail?.snippet?.title || item.snippet.title;
      const description = detail?.snippet?.description || "";
      const duration = detail?.contentDetails?.duration || "";
      const durSec = parseDuration(duration);
      
      // Skip shorts (<=60s) or #shorts tag
      if ((durSec > 0 && durSec <= 60) || `${title} ${description}`.toLowerCase().includes("#shorts")) {
        shorts++;
        console.log(`  SKIP (Short): ${title}`);
        continue;
      }

      const thumbnail = 
        detail?.snippet?.thumbnails?.maxres?.url ||
        detail?.snippet?.thumbnails?.standard?.url ||
        detail?.snippet?.thumbnails?.high?.url ||
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      const viewCount = parseInt(detail?.statistics?.viewCount || "0", 10);
      const tags = (detail?.snippet?.tags || []).join(", ");
      const publishedAt = new Date(detail?.snippet?.publishedAt || item.snippet.publishedAt);

      const existing = await db.episode.findUnique({ where: { youtubeVideoId: videoId } });

      if (existing) {
        await db.episode.update({
          where: { youtubeVideoId: videoId },
          data: { title, description, thumbnailUrl: thumbnail, duration: formatDuration(duration), viewCount, publishedAt, tags }
        });
        updated++;
        console.log(`  UPDATE: ${title}`);
      } else {
        let slug = generateSlug(title) || `ep-${videoId}`;
        let counter = 1;
        while (await db.episode.findUnique({ where: { slug } })) {
          slug = `${generateSlug(title)}-${counter++}`;
        }
        await db.episode.create({
          data: {
            youtubeVideoId: videoId,
            title, slug, description,
            thumbnailUrl: thumbnail,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            duration: formatDuration(duration),
            viewCount, publishedAt, tags,
            isFeatured: false, isVisible: true, orderIndex: 0
          }
        });
        added++;
        console.log(`  ADD: ${title}`);
      }
    }

    console.log(`\n✅ Sync done: ${added} added, ${updated} updated, ${shorts} shorts skipped`);
    
    // Set newest as featured
    const newest = await db.episode.findFirst({ orderBy: { publishedAt: "desc" }, where: { isVisible: true } });
    if (newest) {
      await db.episode.updateMany({ data: { isFeatured: false } });
      await db.episode.update({ where: { id: newest.id }, data: { isFeatured: true } });
      console.log(`⭐ Featured: ${newest.title}`);
    }
  } finally {
    await db.$disconnect();
  }
}

run().catch(e => { console.error(e); process.exit(1); });
