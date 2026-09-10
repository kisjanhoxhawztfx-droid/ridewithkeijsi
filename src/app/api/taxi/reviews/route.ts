import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    const reviews = await db.taxiReview.findMany({
      where: isAdmin ? {} : { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Taxi reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      authorName,
      authorPhotoUrl,
      rating = 5,
      text,
      relativeTimeDescription = "sapo u postua",
      isFeatured = false,
      isVisible = true,
      source = "GOOGLE",
    } = body;

    if (!authorName || !text) {
      return NextResponse.json(
        { error: "Emri i autorit dhe teksti i vlerësimit janë të detyrueshme" },
        { status: 400 }
      );
    }

    const review = await db.taxiReview.create({
      data: {
        authorName,
        authorPhotoUrl: authorPhotoUrl || null,
        rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
        text,
        relativeTimeDescription,
        isFeatured: Boolean(isFeatured),
        isVisible: Boolean(isVisible),
        source,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create Taxi review" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, isVisible, isFeatured, rating, text } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await db.taxiReview.update({
      where: { id },
      data: {
        ...(typeof isVisible === "boolean" ? { isVisible } : {}),
        ...(typeof isFeatured === "boolean" ? { isFeatured } : {}),
        ...(typeof rating === "number" ? { rating } : {}),
        ...(typeof text === "string" ? { text } : {}),
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update Taxi review" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await db.taxiReview.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
