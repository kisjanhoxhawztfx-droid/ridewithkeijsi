import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, isVisible } = await request.json();
    if (!id) return NextResponse.json({ error: "id eshte i detyrueshem" }, { status: 400 });
    const updateData: { status?: string; isVisible?: boolean } = {};
    if (status !== undefined) updateData.status = status;
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    const updated = await db.instagramPost.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
