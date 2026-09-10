import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const admin = searchParams.get("admin") === "true";

    const whereClause: {
      isVisible?: boolean;
      isFeatured?: boolean;
      status?: string;
      brand?: { equals: string };
      price?: { gte?: number; lte?: number };
    } = {};

    if (!admin) {
      whereClause.isVisible = true;
    }

    if (featured === "true") {
      whereClause.isFeatured = true;
    }

    if (status) {
      whereClause.status = status;
    }

    if (brand && brand !== "ALL") {
      whereClause.brand = { equals: brand };
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    const motorcycles = await db.motorcycle.findMany({
      where: whereClause,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { orderIndex: "asc" }],
      take: limit,
    });

    // Also get distinct brands for filtering
    const brands = await db.motorcycle.findMany({
      where: { isVisible: true, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    });

    return NextResponse.json({
      motorcycles,
      brands: brands.map((b) => b.brand).filter(Boolean),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch motorcycles";
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
      permalink,
      thumbnailUrl,
      caption,
      brand,
      model,
      year,
      price,
      currency,
      engine,
      status,
      isFeatured,
    } = body;

    if (!permalink || !thumbnailUrl) {
      return NextResponse.json(
        { error: "Linku i Instagramit dhe fotoja/thumbnail janë të detyrueshme." },
        { status: 400 }
      );
    }

    const newMotorcycle = await db.motorcycle.create({
      data: {
        permalink: permalink.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        caption: caption || "",
        brand: brand || "Motorr",
        model: model || "",
        year: year ? parseInt(year, 10) : new Date().getFullYear(),
        price: price ? parseFloat(price) : null,
        currency: currency || "EUR",
        engine: engine || null,
        status: status || "FOR_SALE",
        isFeatured: isFeatured === true,
        isVisible: true,
        orderIndex: 0,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, motorcycle: newMotorcycle });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add motorcycle";
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
      return NextResponse.json({ error: "Motorcycle ID is required" }, { status: 400 });
    }

    if (updates.year !== undefined) updates.year = parseInt(updates.year, 10);
    if (updates.price !== undefined) updates.price = updates.price ? parseFloat(updates.price) : null;

    const updated = await db.motorcycle.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, motorcycle: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update motorcycle";
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
      return NextResponse.json({ error: "Motorcycle ID is required" }, { status: 400 });
    }

    await db.motorcycle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Motorcycle reference removed" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete motorcycle";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
