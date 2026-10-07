import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request): Promise<Response> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN nuk është konfiguruar." },
      { status: 500 }
    );
  }

  const contentType = request.headers.get("content-type") || "";

  // 1. Support multipart/form-data (FormData uploads from old/unrefreshed tabs or standard forms)
  if (contentType.includes("multipart/form-data")) {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "taxi";

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${folder}/${Date.now()}-${safeName}`;

      const blob = await put(filename, file, {
        access: "public",
        token,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
      });
    } catch (err) {
      console.error("FormData upload error:", err);
      const msg = err instanceof Error ? err.message : "FormData upload failed";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // 2. Client-side upload token generation (application/json from @vercel/blob/client upload())
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
        };
      },
      onUploadCompleted: async () => {
        // Callback after direct upload completed
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("handleUpload error:", err);
    const msg = err instanceof Error ? err.message : "Client token generation failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
