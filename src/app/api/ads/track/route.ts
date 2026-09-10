import { NextResponse } from "next/server";
import db from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adId, event } = body;

    if (!adId || !event) {
      return NextResponse.json({ error: "Missing adId or event" }, { status: 400 });
    }

    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || undefined;
    const referrer = headerList.get("referer") || undefined;

    if (event === "impression") {
      await db.$transaction([
        db.adImpression.create({
          data: {
            advertisementId: adId,
            userAgent,
            referrer,
          },
        }),
        db.advertisement.update({
          where: { id: adId },
          data: { totalImpressions: { increment: 1 } },
        }),
      ]);
    } else if (event === "click") {
      await db.$transaction([
        db.adClick.create({
          data: {
            advertisementId: adId,
            userAgent,
          },
        }),
        db.advertisement.update({
          where: { id: adId },
          data: { totalClicks: { increment: 1 } },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Tracking failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
