import { NextResponse } from "next/server";
import { syncYouTubeEpisodes, testYouTubeConnection } from "@/lib/youtube";
import { getAdminSession } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const channelSetting = await db.siteSetting.findUnique({ where: { key: "youtube_channel_id" } });
    const autoSyncSetting = await db.siteSetting.findUnique({ where: { key: "youtube_auto_sync" } });
    const totalEpisodes = await db.episode.count();
    const latestEpisode = await db.episode.findFirst({
      orderBy: { publishedAt: "desc" },
    });
    const lastSyncLog = await db.syncLog.findFirst({
      where: { platform: "YOUTUBE" },
      orderBy: { startedAt: "desc" },
    });

    const isApiKeySet = !!process.env.YOUTUBE_API_KEY;

    return NextResponse.json({
      configured: isApiKeySet && !!channelSetting?.value,
      isApiKeySet,
      channelId: channelSetting?.value || process.env.YOUTUBE_CHANNEL_ID || "",
      autoSync: autoSyncSetting?.value === "true",
      totalEpisodes,
      latestEpisode,
      lastSyncLog,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch YouTube status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, apiKey, channelId } = body;

    if (action === "test") {
      const testRes = await testYouTubeConnection(apiKey, channelId);
      return NextResponse.json(testRes);
    }

    // Otherwise trigger synchronization
    const syncRes = await syncYouTubeEpisodes();
    return NextResponse.json(syncRes);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
