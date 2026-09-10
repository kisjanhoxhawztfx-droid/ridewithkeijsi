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
      pricePerDay,
      priceText,
      features,
      isFeatured = false,
      isVisible = true,
      orderIndex = 0,
    } = body;

    if (!title || !imageUrl) {
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
        imageUrl,
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
    const { id, isVisible, isFeatured, title, description, priceText, pricePerDay, features, category, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await db.luxuryVehicle.update({
      where: { id },
      data: {
        ...(typeof isVisible === "boolean" ? { isVisible } : {}),
        ...(typeof isFeatured === "boolean" ? { isFeatured } : {}),
        ...(typeof title === "string" ? { title } : {}),
        ...(typeof description === "string" ? { description } : {}),
        ...(typeof priceText === "string" ? { priceText } : {}),
        ...(typeof pricePerDay === "number" ? { pricePerDay } : {}),
        ...(typeof features === "string" ? { features } : {}),
        ...(typeof category === "string" ? { category } : {}),
        ...(typeof imageUrl === "string" ? { imageUrl } : {}),
      },
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
