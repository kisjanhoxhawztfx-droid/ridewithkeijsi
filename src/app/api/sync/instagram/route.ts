import { NextResponse } from "next/server";
import { syncInstagramMotorcycles, syncInstagramFromRapidApi, testInstagramConnection } from "@/lib/instagram";
import { getAdminSession } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  try {
    const isRapidApiSet = !!process.env.RAPIDAPI_KEY;
    const isTokenSet = !!process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountName = process.env.INSTAGRAM_USERNAME || "ridewithkeijsi";
    const totalPosts = await db.instagramPost.count();
    const lastSyncLog = await db.syncLog.findFirst({
      where: { platform: { in: ["INSTAGRAM", "INSTAGRAM_RAPIDAPI", "INSTAGRAM_WEBHOOK"] } },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json({
      configured: isRapidApiSet || isTokenSet,
      isRapidApiSet,
      isTokenSet,
      accountName,
      totalPosts,
      lastSyncLog,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch Instagram status";
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
    const { action, accessToken, username } = body;

    if (action === "test") {
      const testRes = await testInstagramConnection(accessToken);
      return NextResponse.json(testRes);
    }

    if (process.env.RAPIDAPI_KEY) {
      const syncRes = await syncInstagramFromRapidApi(username);
      return NextResponse.json(syncRes);
    }

    const syncRes = await syncInstagramMotorcycles();
    return NextResponse.json(syncRes);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
