import { NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing post ID", { status: 400 });
    }

    // 1. Check direct local file on disk first
    const directLocal = path.join(process.cwd(), "public", "instagram", `${id}.jpg`);
    if (fs.existsSync(directLocal)) {
      const buffer = fs.readFileSync(directLocal);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000",
        },
      });
    }

    const post = await db.instagramPost.findFirst({
      where: {
        OR: [{ id }, { instagramId: id }],
      },
    });

    const igId = post?.instagramId || id;

    // 2. Check local file on disk for post.instagramId
    const localPath = path.join(process.cwd(), "public", "instagram", `${igId}.jpg`);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000",
        },
      });
    }

    // 3. Fetch from permanent GitHub raw repository
    const rawGithubUrl = `https://raw.githubusercontent.com/kisjanhoxhawztfx-droid/ridewithkeijsi/master/public/instagram/${igId}.jpg`;
    try {
      const ghRes = await fetch(rawGithubUrl);
      if (ghRes.ok) {
        const buffer = Buffer.from(await ghRes.arrayBuffer());
        try {
          const dir = path.join(process.cwd(), "public", "instagram");
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(localPath, buffer);
        } catch {}
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=604800, stale-while-revalidate=2592000",
          },
        });
      }
    } catch {}

    // 4. Fetch from post.thumbnailUrl or mediaUrl (if valid HTTP and not YouTube)
    const targetUrl = post?.thumbnailUrl || post?.mediaUrl;
    if (targetUrl && targetUrl.startsWith("http") && !targetUrl.includes("ytimg.com")) {
      try {
        const imgRes = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
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

