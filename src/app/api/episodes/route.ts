import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { generateSlug } from "@/lib/youtube";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const search = searchParams.get("search");
    const admin = searchParams.get("admin") === "true";

    const whereClause: {
      isVisible?: boolean;
      isFeatured?: boolean;
      OR?: Array<{ title?: { contains: string }; description?: { contains: string } }>;
    } = {};

    if (!admin) {
      whereClause.isVisible = true;
    }

    if (featured === "true") {
      whereClause.isFeatured = true;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const episodes = await db.episode.findMany({
      where: whereClause,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }, { orderIndex: "asc" }],
      take: limit,
    });

    return NextResponse.json({ episodes });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch episodes";
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
    const { youtubeVideoId, title, description, thumbnailUrl, duration, isFeatured } = body;

    if (!youtubeVideoId || !title) {
      return NextResponse.json({ error: "YouTube Video ID dhe Titulli janë të detyrueshëm." }, { status: 400 });
    }

    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await db.episode.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newEpisode = await db.episode.create({
      data: {
        youtubeVideoId: youtubeVideoId.trim(),
        title: title.trim(),
        slug,
        description: description || "",
        thumbnailUrl: thumbnailUrl || `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
        duration: duration || "15:00",
        publishedAt: new Date(),
        isFeatured: isFeatured === true,
        isVisible: true,
        orderIndex: 0,
      },
    });

    return NextResponse.json({ success: true, episode: newEpisode });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create episode";
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
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 });
    }

    const updatedEpisode = await db.episode.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ success: true, episode: updatedEpisode });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update episode";
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
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 });
    }

    await db.episode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Episode reference removed from website" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete episode reference";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
