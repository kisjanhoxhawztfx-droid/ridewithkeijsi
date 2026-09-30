import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { put } from "@vercel/blob";

// Allowed MIME types
const ALLOWED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = process.env.BLOB_STORE_ID;
  if (!storeId) {
    return NextResponse.json(
      { error: "BLOB_STORE_ID nuk është konfiguruar." },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "luxury";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Skedari është shumë i madh (Maksimumi 100MB)." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Lloji i skedarit nuk lejohet (${file.type}). Lejohen vetëm MP4, WebM, MOV, JPG, PNG, WebP.`,
        },
        { status: 400 }
      );
    }

    const mediaType = file.type.startsWith("video/") ? "VIDEO" : "IMAGE";
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    // Upload to Vercel Blob using OIDC authentication (no BLOB_READ_WRITE_TOKEN needed)
    const blob = await put(filename, file, {
      access: "public",
      storeId,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      mediaType,
      size: file.size,
      originalName: file.name,
    });
  } catch (err: unknown) {
    console.error("Upload error:", err);
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
