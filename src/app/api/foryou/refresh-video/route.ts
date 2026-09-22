import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    const post = await db.instagramPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const dbSetting = await db.siteSetting.findUnique({ where: { key: "rapidapi_key" } }).catch(() => null);
    const rawKey = process.env.RAPIDAPI_KEY || dbSetting?.value || "7b910a7ee5mshabcc5df6919c3a0p11cae0jsn4875c9201a43";
    const apiKey = rawKey.replace(/[\uFEFF\s"]/g, "").trim();

    // Extract shortcode from permalink (e.g., https://www.instagram.com/p/DZapFOCxGMm/ -> DZapFOCxGMm)
    const shortcodeMatch = post.permalink.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    if (shortcodeMatch) {
      const shortcode = shortcodeMatch[1];
      try {
        const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/media_info?code_or_id_or_url=${encodeURIComponent(shortcode)}`;
        const res = await fetch(url, {
          headers: {
            "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
            "x-rapidapi-key": apiKey,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const freshVideoUrl = data.data?.video_versions?.[0]?.url || data.data?.video_url;
          if (freshVideoUrl) {
            await db.instagramPost.update({
              where: { id: post.id },
              data: { mediaUrl: freshVideoUrl },
            });

            return NextResponse.json({
              success: true,
              mediaUrl: freshVideoUrl,
            });
          }
        }
      } catch (e) {
        console.error("Individual media_info error:", e);
      }
    }

    // Fallback: Check profile timeline
    const username = process.env.INSTAGRAM_USERNAME || "ridewithkeijsi";
    const timelineUrl = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${encodeURIComponent(username)}`;
    const tRes = await fetch(timelineUrl, {
      headers: {
        "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
    });

    if (tRes.ok) {
      const json = await tRes.json();
      const edges = json.data?.edge_owner_to_timeline_media?.edges || [];
      for (const p of edges) {
        const node = p.node;
        if (node.is_video && node.video_url) {
          const shortcode = node.shortcode;
          const permalink = `https://www.instagram.com/p/${shortcode}/`;

          await db.instagramPost.updateMany({
            where: { permalink },
            data: { mediaUrl: node.video_url },
          });

          if (post.permalink.includes(shortcode)) {
            return NextResponse.json({
              success: true,
              mediaUrl: node.video_url,
            });
          }
        }
      }
    }

    return NextResponse.json({ success: false, fallback: true });
  } catch (err) {
    console.error("Failed to refresh video URL:", err);
    return NextResponse.json({ success: false, fallback: true });
  }
}
