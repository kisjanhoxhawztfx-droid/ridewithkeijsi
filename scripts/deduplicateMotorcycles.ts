// Deduplication script for Motorcycle posts
import db from "../src/lib/db";

/**
 * Remove duplicate motorcycle entries from instagramPost (category: SHITET)
 * and legacy motorcycle table.
 * Keeps newest record (by createdAt) and deletes older duplicates.
 */
export async function deduplicateMotorcycles(): Promise<void> {
  try {
    // 1. Deduplicate active instagramPost records (category: SHITET)
    const posts = await db.instagramPost.findMany({
      where: { category: "SHITET" },
      orderBy: { createdAt: "desc" },
    });

    const seenCaptions = new Map<string, string>();
    const toDeletePosts: string[] = [];

    for (const p of posts) {
      const key = (p.caption || "").trim().toLowerCase();
      if (!key) continue;
      if (seenCaptions.has(key)) {
        toDeletePosts.push(p.id);
      } else {
        seenCaptions.set(key, p.id);
      }
    }

    if (toDeletePosts.length > 0) {
      await db.instagramPost.deleteMany({
        where: { id: { in: toDeletePosts } },
      });
      console.log(`Deduplicated ${toDeletePosts.length} duplicate instagramPost record(s).`);
    }

    // 2. Also deduplicate legacy motorcycle table
    const motorcycles = await db.motorcycle.findMany({
      orderBy: { createdAt: "desc" },
    });
    const seenM = new Map<string, string>();
    const toDeleteM: string[] = [];
    for (const m of motorcycles) {
      const key = (m.caption || "").trim().toLowerCase();
      if (!key) continue;
      if (seenM.has(key)) {
        toDeleteM.push(m.id);
      } else {
        seenM.set(key, m.id);
      }
    }
    if (toDeleteM.length > 0) {
      await db.motorcycle.deleteMany({
        where: { id: { in: toDeleteM } },
      });
      console.log(`Deduplicated ${toDeleteM.length} duplicate motorcycle record(s).`);
    }
  } catch (err) {
    console.error("Error running deduplicateMotorcycles:", err);
  }
}
