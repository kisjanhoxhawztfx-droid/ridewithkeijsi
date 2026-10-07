import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    const vehicles = await db.luxuryVehicle.findMany({
      where: isAdmin ? {} : { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch luxury vehicles" }, { status: 500 });
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
      name,
      category = "LUXURY_CAR",
      title,
      description,
      imageUrl,
      images,
      videoUrl,
      pricePerDay,
      priceText,
      features,
      isFeatured = false,
      isVisible = true,
      orderIndex = 0,
    } = body;

    const primaryImage = imageUrl || (Array.isArray(images) && images.length > 0 ? images[0] : "");

    if (!title || !primaryImage) {
      return NextResponse.json(
        { error: "Titulli dhe Fotoja janë të detyrueshme" },
        { status: 400 }
      );
    }

    const vehicle = await db.luxuryVehicle.create({
      data: {
        name: name || title,
        category,
        title,
        description: description || "",
        imageUrl: primaryImage,
        images: Array.isArray(images) ? JSON.stringify(images) : JSON.stringify([primaryImage]),
        videoUrl: videoUrl || null,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : null,
        priceText: priceText || "Me Rezervim / Ditë",
        features: features || "Shofer VIP, Interior Lëkure, Minibar, Wi-Fi",
        isFeatured: Boolean(isFeatured),
        isVisible: Boolean(isVisible),
        orderIndex: Number(orderIndex) || 0,
      },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create luxury vehicle" },
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
    const { id, isVisible, isFeatured, name, title, description, priceText, pricePerDay, features, category, imageUrl, images, videoUrl } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (typeof isVisible === "boolean") dataToUpdate.isVisible = isVisible;
    if (typeof isFeatured === "boolean") dataToUpdate.isFeatured = isFeatured;
    if (typeof name === "string") dataToUpdate.name = name;
    if (typeof title === "string") dataToUpdate.title = title;
    if (typeof description === "string") dataToUpdate.description = description;
    if (typeof priceText === "string") dataToUpdate.priceText = priceText;
    if (typeof pricePerDay === "number" || pricePerDay === null) dataToUpdate.pricePerDay = pricePerDay;
    if (typeof features === "string") dataToUpdate.features = features;
    if (typeof category === "string") dataToUpdate.category = category;
    if (typeof videoUrl === "string" || videoUrl === null) dataToUpdate.videoUrl = videoUrl;

    if (Array.isArray(images)) {
      dataToUpdate.images = JSON.stringify(images);
      if (images.length > 0) {
        dataToUpdate.imageUrl = images[0];
      }
    } else if (typeof imageUrl === "string") {
      dataToUpdate.imageUrl = imageUrl;
    }

    const updated = await db.luxuryVehicle.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update luxury vehicle" }, { status: 500 });
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
    await db.luxuryVehicle.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Vehicle deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete luxury vehicle" }, { status: 500 });
  }
}
