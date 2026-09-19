import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { parseMotorcycleCaption } from "@/lib/motorcycleParser";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const admin = searchParams.get("admin") === "true";

    const whereClause: {
      category: string;
      isVisible?: boolean;
      status?: string;
    } = {
      category: "SHITET",
    };

    if (!admin) {
      whereClause.isVisible = true;
    }

    if (status) {
      whereClause.status = status;
    }

    const posts = await db.instagramPost.findMany({
      where: whereClause,
      orderBy: { postedAt: "desc" },
      take: limit,
    });

    const motorcycles = posts
      .map((p) => {
        const specs = parseMotorcycleCaption(p.caption);
        const inferredBrand = specs.title.split(" ")[0] || "Motorr";
        const cleanPrice = specs.price ? parseFloat(specs.price.replace(/[^\d.]/g, "")) : null;
        const cleanYear = specs.year ? parseInt(specs.year, 10) : null;

        return {
          id: p.id,
          instagramMediaId: p.instagramId,
          permalink: p.permalink,
          thumbnailUrl: p.thumbnailUrl || p.mediaUrl || "",
          mediaUrl: p.mediaUrl,
          mediaType: p.mediaType,
          caption: p.caption,
          brand: inferredBrand,
          model: specs.title,
          year: cleanYear,
          price: cleanPrice,
          currency: "EUR",
          engine: specs.engine,
          status: p.status,
          isFeatured: false,
          isVisible: p.isVisible,
          publishedAt: p.postedAt.toISOString(),
        };
      })
      .filter((m) => {
        if (brand && brand !== "ALL") {
          return m.brand.toLowerCase() === brand.toLowerCase();
        }
        return true;
      });

    const distinctBrands = Array.from(new Set(motorcycles.map((m) => m.brand).filter(Boolean)));

    return NextResponse.json({
      motorcycles,
      brands: distinctBrands,
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
      status,
    } = body;

    if (!permalink || !thumbnailUrl) {
      return NextResponse.json(
        { error: "Linku i Instagramit dhe fotoja/thumbnail janë të detyrueshme." },
        { status: 400 }
      );
    }

    const constructedCaption =
      caption ||
      `${brand || ""} ${model || ""} ${year ? `Viti: ${year}` : ""} ${price ? `Çmimi: ${price}€` : ""}`.trim();

    const newPost = await db.instagramPost.create({
      data: {
        instagramId: `manual_${Date.now()}`,
        permalink: permalink.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        mediaUrl: thumbnailUrl.trim(),
        caption: constructedCaption,
        mediaType: "IMAGE",
        category: "SHITET",
        status: status || "FOR_SALE",
        isVisible: true,
        postedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, motorcycle: newPost });
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
    const { id, status, isVisible } = body;

    if (!id) {
      return NextResponse.json({ error: "Motorcycle ID is required" }, { status: 400 });
    }

    const updateData: { status?: string; isVisible?: boolean } = {};
    if (status !== undefined) updateData.status = status;
    if (isVisible !== undefined) updateData.isVisible = isVisible;

    try {
      const updated = await db.instagramPost.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, motorcycle: updated });
    } catch {
      const updatedMoto = await db.motorcycle.update({
        where: { id },
        data: updateData,
      });
      return NextResponse.json({ success: true, motorcycle: updatedMoto });
    }
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

    try {
      await db.instagramPost.delete({ where: { id } });
    } catch {
      await db.motorcycle.delete({ where: { id } }).catch(() => {});
    }

    return NextResponse.json({ success: true, message: "Motorcycle removed" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete motorcycle";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
