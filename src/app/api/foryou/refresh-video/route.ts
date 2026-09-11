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

    // Call RapidAPI to get fresh timeline videos
    const apiKey = process.env.RAPIDAPI_KEY || "f445af1383msh2d0396ce64777c4p142ed6jsn83232537dd13";
    const username = process.env.INSTAGRAM_USERNAME || "ridewithkeijsi";

    const url = `https://instagram-public-bulk-scraper.p.rapidapi.com/v1/user_info_web?username=${encodeURIComponent(username)}`;
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-host": "instagram-public-bulk-scraper.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, fallback: true });
    }

    const json = await res.json();
    const edges = json.data?.edge_owner_to_timeline_media?.edges || [];

    let targetFreshUrl: string | null = null;

    // Batch update all returned video posts in DB to keep them fresh
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
          targetFreshUrl = node.video_url;
        }
      }
    }

    if (targetFreshUrl) {
      return NextResponse.json({
        success: true,
        mediaUrl: targetFreshUrl,
      });
    }

    // If this specific post wasn't in the latest batch, tell client to use fallback embed
    return NextResponse.json({ success: false, fallback: true });
  } catch (err) {
    console.error("Failed to refresh video URL:", err);
    return NextResponse.json({ success: false, fallback: true });
  }
}
