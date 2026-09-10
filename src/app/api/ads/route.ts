import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position");
    const admin = searchParams.get("admin") === "true";

    if (admin) {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const allAds = await db.advertisement.findMany({
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      });
      return NextResponse.json({ ads: allAds });
    }

    // Public active ads
    const now = new Date();
    const activeAds = await db.advertisement.findMany({
      where: {
        status: "ACTIVE",
        ...(position ? { position } : {}),
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ ads: activeAds });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch ads";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      businessName,
      title,
      description,
      mediaUrl,
      mediaType,
      destinationUrl,
      position,
      ctaText,
      startDate,
      endDate,
      status,
      priority,
    } = body;

    if (!businessName || !mediaUrl || !destinationUrl) {
      return NextResponse.json(
        { error: "Emri i biznesit, media dhe linku i destinacionit janë të detyrueshme." },
        { status: 400 }
      );
    }

    const newAd = await db.advertisement.create({
      data: {
        businessName,
        title: title || businessName,
        description: description || "",
        mediaUrl,
        mediaType: mediaType || "VIDEO",
        destinationUrl,
        position: position || "HOMEPAGE_MIDDLE",
        ctaText: ctaText || "Shiko Ofertën",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || "ACTIVE",
        priority: priority !== undefined ? parseInt(priority, 10) : 1,
      },
    });

    return NextResponse.json({ success: true, ad: newAd });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create ad";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 });
    }

    if (updates.startDate !== undefined) {
      updates.startDate = updates.startDate ? new Date(updates.startDate) : null;
    }
    if (updates.endDate !== undefined) {
      updates.endDate = updates.endDate ? new Date(updates.endDate) : null;
    }
    if (updates.priority !== undefined) {
      updates.priority = parseInt(updates.priority, 10);
    }

    const updatedAd = await db.advertisement.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, ad: updatedAd });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update ad";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Ad ID is required" }, { status: 400 });
    }

    await db.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Ad deleted successfully" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete ad";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
