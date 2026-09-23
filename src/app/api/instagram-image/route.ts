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

    // 4. Try mediaUrl if it's an image (not a video)
    const mediaUrl = post?.mediaUrl;
    if (
      mediaUrl &&
      mediaUrl.startsWith("http") &&
      !mediaUrl.includes("ytimg.com") &&
      !mediaUrl.includes(".mp4") &&
      !mediaUrl.includes("video")
    ) {
      try {
        const imgRes = await fetch(mediaUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
        if (imgRes.ok) {
          const ct = imgRes.headers.get("content-type") || "";
          if (ct.startsWith("image/")) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            return new NextResponse(buffer, {
              headers: {
                "Content-Type": ct,
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
              },
            });
          }
        }
      } catch {}
    }

    // 5. Return SVG placeholder (never 404 - show a motorcycle icon instead)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="540" viewBox="0 0 400 540">
  <rect width="400" height="540" fill="#0c121d"/>
  <rect x="1" y="1" width="398" height="538" fill="none" stroke="#ffffff15" stroke-width="1" rx="12"/>
  <text x="200" y="240" text-anchor="middle" font-size="80" fill="#1a2a3a">🏍️</text>
  <text x="200" y="310" text-anchor="middle" font-family="system-ui" font-size="13" fill="#334155">Foto nuk disponohet</text>
  <text x="200" y="335" text-anchor="middle" font-family="system-ui" font-size="11" fill="#1e3a5f">ridewithkeijsi</text>
</svg>`;
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("Image proxy route error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

