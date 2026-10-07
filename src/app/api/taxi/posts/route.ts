import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";

  try {
    const posts = await db.taxiPost.findMany({
      where: isAdmin ? {} : { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Taxi posts" }, { status: 500 });
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
      permalink,
      thumbnailUrl,
      images,
      caption,
      isFeatured = false,
      isVisible = true,
      mediaType = "IMAGE",
    } = body;

    if (!permalink || !thumbnailUrl) {
      return NextResponse.json(
        { error: "Permalink dhe Thumbnail janë të detyrueshme" },
        { status: 400 }
      );
    }

    const post = await db.taxiPost.create({
      data: {
        permalink,
        thumbnailUrl,
        images: images ? JSON.stringify(images) : null,
        caption: caption || "",
        mediaType,
        isFeatured: Boolean(isFeatured),
        isVisible: Boolean(isVisible),
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create Taxi post" },
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
    const { id, isVisible, isFeatured, caption, images, thumbnailUrl, permalink } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (typeof isVisible === "boolean") dataToUpdate.isVisible = isVisible;
    if (typeof isFeatured === "boolean") dataToUpdate.isFeatured = isFeatured;
    if (typeof caption === "string") dataToUpdate.caption = caption;
    if (typeof permalink === "string") dataToUpdate.permalink = permalink;
    if (Array.isArray(images)) {
      dataToUpdate.images = JSON.stringify(images);
      if (images.length > 0) {
        dataToUpdate.thumbnailUrl = images[0];
      }
    } else if (typeof thumbnailUrl === "string") {
      dataToUpdate.thumbnailUrl = thumbnailUrl;
    }

    const updated = await db.taxiPost.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update Taxi post" }, { status: 500 });
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
    await db.taxiPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
