import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const WEBHOOK_SECRET = process.env.INSTAGRAM_WEBHOOK_SECRET || "ridewithkeijsi_secret_2024";

function extractHashtags(caption: string): string[] {
  const matches = caption.match(/#[\w\u00C0-\u024F]+/gi) || [];
  return matches.map((h) => h.toLowerCase());
}

function detectCategory(hashtags: string[]): "SHITET" | "EPISOD" | null {
  if (hashtags.includes("#shitet")) return "SHITET";
  if (hashtags.includes("#episod")) return "EPISOD";
  return null;
}

function detectSold(caption: string): boolean {
  const lower = caption.toLowerCase();
  return (
    lower.includes("shitur") ||
    lower.includes("e shitur") ||
    lower.includes("sold") ||
    lower.includes("#shitur")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const secret = body.secret || request.headers.get("x-webhook-secret");
    if (secret !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { instagramId, mediaUrl, thumbnailUrl, caption, permalink, mediaType, postedAt } = body;

    if (!instagramId || !caption || !permalink) {
      return NextResponse.json(
        { error: "instagramId, caption dhe permalink jane te detyrueshme" },
        { status: 400 }
      );
    }

    const hashtags = extractHashtags(caption);
    const category = detectCategory(hashtags);

    if (!category) {
      return NextResponse.json({
        success: true,
        action: "ignored",
        reason: "No #shitet or #episod hashtag found",
        hashtags,
      });
    }

    const isSold = category === "SHITET" && detectSold(caption);
    const status = isSold ? "SOLD" : "FOR_SALE";

    const existing = await db.instagramPost.findUnique({ where: { instagramId } });

    const post = await db.instagramPost.upsert({
      where: { instagramId },
      create: {
        instagramId,
        mediaUrl: mediaUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        caption,
        permalink,
        mediaType: mediaType || "IMAGE",
        category,
        status: category === "SHITET" ? status : "FOR_SALE",
        postedAt: postedAt ? new Date(postedAt) : new Date(),
      },
      update: {
        caption,
        mediaUrl: mediaUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        status: category === "SHITET" ? status : undefined,
      },
    });

    await db.syncLog.create({
      data: {
        platform: "INSTAGRAM_WEBHOOK",
        status: "SUCCESS",
        itemsSynced: 1,
        message: `[${category}] post ${existing ? "updated" : "created"}: ${instagramId} | status: ${status}`,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      action: existing ? "updated" : "created",
      category,
      status,
      instagramId,
      postId: post.id,
    });
  } catch (error) {
    console.error("[Instagram Webhook] Error:", error);
    await db.syncLog
      .create({
        data: {
          platform: "INSTAGRAM_WEBHOOK",
          status: "ERROR",
          itemsSynced: 0,
          errorDetail: String(error),
          completedAt: new Date(),
        },
      })
      .catch(() => {});
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const recentLogs = await db.syncLog
    .findMany({ where: { platform: "INSTAGRAM_WEBHOOK" }, orderBy: { startedAt: "desc" }, take: 5 })
    .catch(() => []);
  const totalPosts = await db.instagramPost.count().catch(() => 0);
  return NextResponse.json({
    status: "ok",
    message: "Instagram Webhook aktiv — Ride with Keijsi @ridewithkeijsi",
    totalPostsSaved: totalPosts,
    recentSync: recentLogs,
  });
}
