import db from "./db";
import fs from "fs";
import path from "path";

/**
 * Download a thumbnail image from Instagram CDN and save it locally
 * to public/instagram/{instagramId}.jpg so it never expires.
 * Returns the local URL path (e.g. /instagram/12345.jpg).
 */
async function downloadThumbnail(cdnUrl: string, instagramId: string): Promise<string | null> {
  try {
    const dir = path.join(process.cwd(), "public", "instagram");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${instagramId}.jpg`);
    // Always re-download to get fresh image (CDN URLs change each sync)
    const res = await fetch(cdnUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return `/instagram/${instagramId}.jpg`;
  } catch {
    return null;
  }
}

export interface InstagramSyncResult {
  success: boolean;
  message: string;
  itemsSynced: number;
  newMotorcyclesAdded: number;
  motorcyclesUpdated: number;
  error?: string;
}

// Helper to heuristically extract motorcycle specifications from Instagram captions
export function extractSpecsFromCaption(caption: string): {
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  engine?: string;
} {
  const specs: {
    brand?: string;
    model?: string;
    year?: number;
    price?: number;
    engine?: string;
  } = {};

  if (!caption) return specs;

  // 1. Common Motorcycle Brands
  const brands = [
    "Yamaha",
    "Honda",
    "BMW",
    "Ducati",
    "Kawasaki",
    "KTM",
    "Suzuki",
    "Aprilia",
    "Harley-Davidson",
    "Triumph",
    "MV Agusta",
    "Husqvarna",
    "Benelli",
    "Vespa",
    "Piaggio",
  ];

  for (const b of brands) {
    if (new RegExp(`\\b${b}\\b`, "i").test(caption)) {
      specs.brand = b;
      break;
    }
  }

  // 2. Year detection (e.g., 2015-2027 or Viti 2022)
  const yearMatch = caption.match(/(?:viti|vit|year|\b)\s*(20[12][0-9])\b/i);
  if (yearMatch) {
    specs.year = parseInt(yearMatch[1], 10);
  }

  // 3. Price detection in EUR / Euro / € (e.g., 12500€, 12.500 euro, Cmimi: 8900)
  const priceMatch = caption.match(/(?:cmimi|çmimi|price|euro|€)\s*[:=]?\s*([0-9]{1,3}(?:[.,][0-9]{3})*|[0-9]+)\s*(?:€|euro|eur)?/i) ||
    caption.match(/([0-9]{1,3}(?:[.,][0-9]{3})*|[0-9]{4,6})\s*(?:€|euro|eur)\b/i);

  if (priceMatch) {
    const cleanPrice = priceMatch[1].replace(/[.,]/g, "");
    const parsed = parseFloat(cleanPrice);
    if (!isNaN(parsed) && parsed >= 500 && parsed <= 200000) {
      specs.price = parsed;
    }
  }

  // 4. Engine displacement (e.g., 600cc, 1000 cc, 1250cc)
  const engineMatch = caption.match(/\b([1-9][0-9]{2,3})\s*cc\b/i);
  if (engineMatch) {
    specs.engine = `${engineMatch[1]}cc`;
  }

  return specs;
}

export async function syncInstagramFromRapidApi(customUsername?: string): Promise<InstagramSyncResult> {
  const apiKey = process.env.RAPIDAPI_KEY || "f445af1383msh2d0396ce64777c4p142ed6jsn83232537dd13";
  const username = customUsername || process.env.INSTAGRAM_USERNAME || "ridewithkeijsi";

  if (!apiKey) {
    return {
      success: false,
      message: "RapidAPI Key is not configured in .env",
      itemsSynced: 0,
      newMotorcyclesAdded: 0,
      motorcyclesUpdated: 0,
    };
  }

  const syncLog = await db.syncLog.create({
    data: {
      platform: "INSTAGRAM_RAPIDAPI",
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  try {
    const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${encodeURIComponent(username)}`;
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
    });

    const json = await res.json();
    if (!res.ok || json.status === "error" || !json.data) {
      throw new Error(json.message || `Failed to fetch Instagram profile for @${username}`);
    }

    const edges = json.data?.edge_owner_to_timeline_media?.edges || [];
    let addedCount = 0;
    let updatedCount = 0;

    for (const p of edges) {
      const node = p.node;
      const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
      const lowerCap = caption.toLowerCase();

      const instagramId = String(node.id);
      const existing = await db.instagramPost.findUnique({ where: { instagramId } });

      // Check hashtags & keywords: #shitet, #episod, and sold keywords
      const hasShitet = lowerCap.includes("#shitet") || lowerCap.includes("shitet");
      const hasEpisod = lowerCap.includes("#episod") || lowerCap.includes("episod");
      const isSoldWord = (
        lowerCap.includes("shitur") ||
        lowerCap.includes("e shitur") ||
        lowerCap.includes("sold") ||
        lowerCap.includes("#shitur")
      );

      const isMotorra = hasShitet || isSoldWord || (existing && existing.category === "SHITET");

      if (!isMotorra && !hasEpisod) {
        continue; // Skip posts without relevant hashtags or keywords
      }

      const category = isMotorra ? "SHITET" : "EPISOD";
      const status = (isMotorra && isSoldWord) ? "SOLD" : (existing?.status || "FOR_SALE");

      const permalink = `https://www.instagram.com/p/${node.shortcode}/`;
      const mediaUrl = node.video_url || node.display_url || null;
      const cdnThumbnailUrl = node.display_url || null;
      const mediaType = node.is_video ? "VIDEO" : "IMAGE";
      const postedAt = node.taken_at_timestamp
        ? new Date(node.taken_at_timestamp * 1000)
        : new Date();

      // Download thumbnail locally so it never expires
      let thumbnailUrl: string | null = null;
      if (cdnThumbnailUrl) {
        thumbnailUrl = await downloadThumbnail(cdnThumbnailUrl, instagramId);
      }

      if (existing) {
        await db.instagramPost.update({
          where: { instagramId },
          data: {
            caption,
            mediaUrl: mediaUrl || existing.mediaUrl,
            thumbnailUrl: thumbnailUrl || existing.thumbnailUrl,
            status: category === "SHITET" ? status : existing.status,
            category,
            permalink,
          },
        });
        updatedCount++;
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
          },
        });
        addedCount++;
      }
    }

    const total = addedCount + updatedCount;
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "SUCCESS",
        itemsSynced: total,
        message: `RapidAPI sync for @${username}: ${addedCount} added, ${updatedCount} updated from ${edges.length} total posts.`,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Sync u përfundua me sukses për @${username}: ${addedCount} postime të reja, ${updatedCount} të përditësuara.`,
      itemsSynced: total,
      newMotorcyclesAdded: addedCount,
      motorcyclesUpdated: updatedCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "RapidAPI Instagram sync failed";
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "ERROR",
        errorDetail: errorMsg,
        message: "RapidAPI sync dështoi",
        completedAt: new Date(),
      },
    });

    return {
      success: false,
      message: errorMsg,
      itemsSynced: 0,
      newMotorcyclesAdded: 0,
      motorcyclesUpdated: 0,
      error: errorMsg,
    };
  }
}

export async function testInstagramConnection(accessToken?: string) {
  const token = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return { success: false, message: "Instagram Access Token is not configured." };
  }

  try {
    const res = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${token}`);
    const data = await res.json();

    if (!res.ok || data.error) {
      return { success: false, message: data.error?.message || "Instagram API connection failed" };
    }

    return {
      success: true,
      username: data.username,
      accountType: data.account_type,
      mediaCount: data.media_count,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error connecting to Instagram";
    return { success: false, message };
  }
}

export async function syncInstagramMotorcycles(): Promise<InstagramSyncResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const usernameSetting = await db.siteSetting.findUnique({ where: { key: "instagram_account_name" } });
  const accountName = usernameSetting?.value || "ridewithkeijsi";

  if (!token) {
    return {
      success: false,
      message: "Instagram Access Token is not set. You can also manually add motorcycle posts in Admin > Motorra.",
      itemsSynced: 0,
      newMotorcyclesAdded: 0,
      motorcyclesUpdated: 0,
    };
  }

  const syncLog = await db.syncLog.create({
    data: {
      platform: "INSTAGRAM",
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=25`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Failed to fetch media from Instagram Graph API");
    }

    const items = data.data || [];
    let addedCount = 0;
    let updatedCount = 0;

    for (const item of items) {
      const mediaId = item.id;
      const permalink = item.permalink || `https://instagram.com/p/${mediaId}`;
      const mediaType = item.media_type || "IMAGE";
      const thumbnailUrl = item.thumbnail_url || item.media_url || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000";
      const mediaUrl = item.media_url || null;
      const caption = item.caption || "";
      const publishedAt = item.timestamp ? new Date(item.timestamp) : new Date();

      const specs = extractSpecsFromCaption(caption);

      const existing = await db.motorcycle.findUnique({
        where: { instagramMediaId: mediaId },
      });

      if (existing) {
        await db.motorcycle.update({
          where: { instagramMediaId: mediaId },
          data: {
            caption,
            thumbnailUrl,
            mediaUrl,
            mediaType,
            permalink,
            ...(specs.brand && !existing.brand ? { brand: specs.brand } : {}),
            ...(specs.year && !existing.year ? { year: specs.year } : {}),
            ...(specs.price && !existing.price ? { price: specs.price } : {}),
            ...(specs.engine && !existing.engine ? { engine: specs.engine } : {}),
          },
        });
        updatedCount++;
      } else {
        await db.motorcycle.create({
          data: {
            instagramMediaId: mediaId,
            permalink,
            mediaType,
            mediaUrl,
            thumbnailUrl,
            caption,
            brand: specs.brand || "Motorr",
            model: specs.model || "",
            year: specs.year || new Date().getFullYear(),
            price: specs.price || null,
            engine: specs.engine || null,
            status: "FOR_SALE",
            isFeatured: false,
            isVisible: true,
            orderIndex: 0,
            publishedAt,
          },
        });
        addedCount++;
      }
    }

    const totalSynced = addedCount + updatedCount;
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "SUCCESS",
        itemsSynced: totalSynced,
        message: `Successfully synchronized ${totalSynced} Instagram motorcycle posts (${addedCount} new, ${updatedCount} updated).`,
        completedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Sync complete: ${addedCount} new motorcycles added, ${updatedCount} updated.`,
      itemsSynced: totalSynced,
      newMotorcyclesAdded: addedCount,
      motorcyclesUpdated: updatedCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Instagram sync failed";
    await db.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: "ERROR",
        errorDetail: errorMsg,
        message: "Instagram synchronization failed",
        completedAt: new Date(),
      },
    });

    return {
      success: false,
      message: errorMsg,
      itemsSynced: 0,
      newMotorcyclesAdded: 0,
      motorcyclesUpdated: 0,
      error: errorMsg,
    };
  }
}
