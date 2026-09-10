import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { getSiteSettings, getSocialLinks, getCustomSections } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    const socialLinks = await getSocialLinks();
    const sections = await getCustomSections();

    return NextResponse.json({
      settings,
      socialLinks,
      sections,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch settings";
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
    const { settings, socialLinks, sections } = body;

    // 1. Update site settings
    if (settings && typeof settings === "object") {
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === "string") {
          await db.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value, group: "general" },
          });
        }
      }
    }

    // 2. Update social links
    if (Array.isArray(socialLinks)) {
      for (const link of socialLinks) {
        if (link.id) {
          await db.socialLink.update({
            where: { id: link.id },
            data: {
              label: link.label,
              url: link.url,
              isVisible: link.isVisible,
              orderIndex: link.orderIndex,
            },
          });
        } else if (link.platform && link.url) {
          await db.socialLink.create({
            data: {
              platform: link.platform,
              label: link.label || link.platform,
              url: link.url,
              icon: link.icon || link.platform,
              isVisible: link.isVisible !== false,
              orderIndex: link.orderIndex || 0,
            },
          });
        }
      }
    }

    // 3. Update sections
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        if (sec.id) {
          await db.customSection.update({
            where: { id: sec.id },
            data: {
              title: sec.title,
              description: sec.description,
              isVisible: sec.isVisible,
              showOnHomepage: sec.showOnHomepage,
              orderIndex: sec.orderIndex,
            },
          });
        }
      }
    }

    // Purge ISR caches immediately across public site
    revalidatePath("/", "layout");
    revalidatePath("/taxi");
    revalidatePath("/contact");
    revalidatePath("/motorra");
    revalidatePath("/episodes");
    revalidatePath("/luxury");

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
