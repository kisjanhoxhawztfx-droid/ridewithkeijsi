import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");
    const status = searchParams.get("status");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const admin = searchParams.get("admin") === "true";

    const whereClause: {
      isVisible?: boolean;
      status?: string;
      brand?: { equals: string; mode: "insensitive" };
    } = {};

    if (!admin) {
      whereClause.isVisible = true;
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (brand && brand !== "ALL") {
      whereClause.brand = { equals: brand, mode: "insensitive" };
    }

    const rawMotorcycles = await db.motorcycle.findMany({
      where: whereClause,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    const motorcycles = rawMotorcycles.map((m) => {
      let imagesList: string[] = [];
      if (m.images) {
        try {
          imagesList = JSON.parse(m.images);
        } catch {
          imagesList = m.images.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
      if (imagesList.length === 0 && m.imageUrl) {
        imagesList = [m.imageUrl];
      }
      if (imagesList.length === 0 && m.thumbnailUrl) {
        imagesList = [m.thumbnailUrl];
      }

      const pubDate = m.publishedAt || m.createdAt || new Date();

      return {
        ...m,
        images: imagesList,
        imageUrl: m.imageUrl || imagesList[0] || m.thumbnailUrl || "",
        publishedAt: pubDate instanceof Date ? pubDate.toISOString() : String(pubDate),
      };
    });

    const allBrands = await db.motorcycle.findMany({
      select: { brand: true },
      distinct: ["brand"],
      where: { brand: { not: null } },
    });
    const distinctBrands = allBrands.map((b) => b.brand).filter(Boolean);

    return NextResponse.json({
      motorcycles,
      brands: distinctBrands,
    });
  } catch (err: unknown) {
    console.error("GET /api/motorra error:", err);
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
      title,
      brand,
      model,
      year,
      price,
      currency = "EUR",
      mileageKm,
      mileageMi,
      engine,
      phone,
      whatsapp,
      description,
      imageUrl,
      images,
      status = "FOR_SALE",
      isFeatured = false,
      isVisible = true,
    } = body;

    const imagesArray = Array.isArray(images) ? images : (imageUrl ? [imageUrl] : []);
    const primaryImage = imageUrl || imagesArray[0] || "";

    if (!title) {
      return NextResponse.json({ error: "Titulli i motorrit është i detyrueshëm" }, { status: 400 });
    }

    if (!primaryImage) {
      return NextResponse.json({ error: "Të paktën 1 foto është e detyrueshme" }, { status: 400 });
    }

    const km = mileageKm !== undefined && mileageKm !== null && mileageKm !== "" ? parseInt(String(mileageKm), 10) : null;
    let mi = mileageMi !== undefined && mileageMi !== null && mileageMi !== "" ? parseInt(String(mileageMi), 10) : null;
    if (mi === null && km !== null) {
      mi = Math.round(km * 0.621371);
    }

    const created = await db.motorcycle.create({
      data: {
        title: title.trim(),
        brand: brand ? brand.trim() : null,
        model: model ? model.trim() : null,
        year: year ? parseInt(String(year), 10) : null,
        price: price ? parseFloat(String(price)) : null,
        currency,
        mileageKm: km,
        mileageMi: mi,
        engine: engine ? engine.trim() : null,
        phone: phone ? phone.trim() : null,
        whatsapp: whatsapp ? whatsapp.trim() : (phone ? phone.trim() : null),
        description: description ? description.trim() : null,
        imageUrl: primaryImage,
        images: JSON.stringify(imagesArray),
        thumbnailUrl: primaryImage,
        mediaType: "IMAGE",
        status: status === "SOLD" ? "SOLD" : "FOR_SALE",
        isFeatured: Boolean(isFeatured),
        isVisible: Boolean(isVisible),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      motorcycle: {
        ...created,
        images: imagesArray,
      },
    });
  } catch (err: unknown) {
    console.error("POST /api/motorra error:", err);
    const msg = err instanceof Error ? err.message : "Failed to create motorcycle";
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
    const { id, isVisible, status, isFeatured, ...otherFields } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (typeof isVisible === "boolean") updateData.isVisible = isVisible;
    if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
    if (status && (status === "FOR_SALE" || status === "SOLD")) updateData.status = status;

    if (otherFields.title !== undefined) updateData.title = otherFields.title;
    if (otherFields.brand !== undefined) updateData.brand = otherFields.brand;
    if (otherFields.model !== undefined) updateData.model = otherFields.model;
    if (otherFields.year !== undefined) updateData.year = otherFields.year ? parseInt(String(otherFields.year), 10) : null;
    if (otherFields.price !== undefined) updateData.price = otherFields.price ? parseFloat(String(otherFields.price)) : null;
    if (otherFields.engine !== undefined) updateData.engine = otherFields.engine;
    if (otherFields.description !== undefined) updateData.description = otherFields.description;
    if (otherFields.phone !== undefined) updateData.phone = otherFields.phone;
    if (otherFields.whatsapp !== undefined) updateData.whatsapp = otherFields.whatsapp;
    if (otherFields.mileageKm !== undefined) updateData.mileageKm = otherFields.mileageKm ? parseInt(String(otherFields.mileageKm), 10) : null;
    if (otherFields.mileageMi !== undefined) updateData.mileageMi = otherFields.mileageMi ? parseInt(String(otherFields.mileageMi), 10) : null;

    if (Array.isArray(otherFields.images)) {
      updateData.images = JSON.stringify(otherFields.images);
      if (otherFields.images[0]) {
        updateData.imageUrl = otherFields.images[0];
        updateData.thumbnailUrl = otherFields.images[0];
      }
    } else if (otherFields.imageUrl) {
      updateData.imageUrl = otherFields.imageUrl;
      updateData.thumbnailUrl = otherFields.imageUrl;
    }

    const updated = await db.motorcycle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, motorcycle: updated });
  } catch (err: unknown) {
    console.error("PATCH /api/motorra error:", err);
    const msg = err instanceof Error ? err.message : "Failed to update motorcycle";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
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
    await db.motorcycle.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Motorcycle deleted" });
  } catch (err: unknown) {
    console.error("DELETE /api/motorra error:", err);
    const msg = err instanceof Error ? err.message : "Failed to delete motorcycle";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
