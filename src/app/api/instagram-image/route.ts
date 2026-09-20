import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs";
import path from "path";
import { getMotorcycleYouTubeId } from "@/lib/motorcycleParser";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing post ID", { status: 400 });
    }

    const post = await db.instagramPost.findFirst({
      where: {
        OR: [{ id }, { instagramId: id }],
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // 1. Check local file on disk first
    const localPath = path.join(process.cwd(), "public", "instagram", `${post.instagramId}.jpg`);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    // 2. Fetch from post.thumbnailUrl or mediaUrl
    let targetUrl = post.thumbnailUrl || post.mediaUrl;

    // If targetUrl is a local relative URL but missing on disk, fallback to YouTube CDN
    if (!targetUrl || !targetUrl.startsWith("http")) {
      const ytId = getMotorcycleYouTubeId(post);
      if (ytId) {
        targetUrl = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
      }
    }

    if (targetUrl && targetUrl.startsWith("http")) {
      try {
        const imgRes = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // Try to cache locally if filesystem permits
          try {
            const dir = path.join(process.cwd(), "public", "instagram");
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(localPath, buffer);
          } catch {}

          return new NextResponse(buffer, {
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
          });
        }
      } catch (err) {
        console.error("Failed to proxy image:", err);
      }
    }

    // 3. Last fallback: Try YouTube CDN directly
    const ytId = getMotorcycleYouTubeId(post);
    if (ytId) {
      try {
        const ytRes = await fetch(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
        if (ytRes.ok) {
          const buffer = Buffer.from(await ytRes.arrayBuffer());
          return new NextResponse(buffer, {
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
          });
        }
      } catch {}
    }

    return new NextResponse("Image not available", { status: 404 });
  } catch (err) {
    console.error("Image proxy route error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

