import db from "./db";

export interface SiteSettingsMap {
  site_name: string;
  site_tagline: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_link: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  taxi_phone: string;
  taxi_whatsapp: string;
  taxi_instagram: string;
  taxi_google_business_url: string;
  taxi_google_place_id: string;
  taxi_title: string;
  taxi_description: string;
  luxury_phone: string;
  luxury_whatsapp: string;
  luxury_title: string;
  luxury_subtitle: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  youtube_channel_id: string;
  youtube_auto_sync: string;
  instagram_account_name: string;
  instagram_auto_sync: string;
  [key: string]: string;
}

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const defaults: SiteSettingsMap = {
    site_name: "Ride with Keijsi",
    site_tagline: "Emisioni & Platforma Numër 1 për Motorra",
    logo_url: "/logo.png",
    primary_color: "#00B2FE",
    secondary_color: "#05070A",
    accent_color: "#00D2FF",
    hero_title: "RIDE WITH KEIJSI",
    hero_subtitle: "Eksploroni botën e shpejtësisë, rrugës dhe motorrave me Keijsin. Episode ekskluzive, rishikime makinash & motorrash, dhe motorrat më të mirë në treg.",
    hero_cta_text: "Shiko Episodin e Fundit",
    hero_cta_link: "/episodes",
    hero_secondary_cta_text: "Motorra në Shitje",
    hero_secondary_cta_link: "/motorra",
    contact_email: "contact@ridewithkeijsi.com",
    contact_phone: "+355 69 000 0000",
    contact_address: "Tiranë, Shqipëri",
    taxi_phone: "+355697777799",
    taxi_whatsapp: "+355697777799",
    taxi_instagram: "taxi_keijsi",
    taxi_google_business_url: "https://maps.google.com/?q=Taxi+Keijsi+Tirana",
    taxi_google_place_id: "",
    taxi_title: "Taxi Keijsi — Shërbim Taksie 24/7",
    taxi_description: "Shërbim taksie i shpejtë, komod dhe profesional në Tiranë dhe në të gjithë Shqipërinë. Transferta aeroporti, udhëtime turistike dhe shërbim VIP 24 orë në 7 ditë të javës.",
    luxury_phone: "+355697738559",
    luxury_whatsapp: "+355697738559",
    luxury_title: "LUXURY SERVICES",
    luxury_subtitle: "Shërbime ekskluzive me qira për makina luksoze, limuzina, furgona Maybach VIP, Rolls-Royce dhe Bentley me shofer personal 24/7 në Shqipëri.",
    seo_title: "Ride with Keijsi — Emisioni & Platforma e Motorrave",
    seo_description: "Shikoni episodet e fundit të Ride with Keijsi, eksploroni motorrat për shitje në Motorra, porositni Taxi Keijsi 24/7 dhe rezervoni Luxury Services me makina luksoze me qira.",
    seo_keywords: "Ride with Keijsi, Luxury Services, Rolls Royce, Bentley, Maybach Van, Limuzina, Makina me Qira, Taxi Keijsi, Shqiperi",
    seo_og_image: "/logo.png",
    youtube_channel_id: "",
    youtube_auto_sync: "true",
    instagram_account_name: "ridewithkeijsi",
    instagram_auto_sync: "true",
  };

  try {
    const settings = await db.siteSetting.findMany();
    const map = { ...defaults };
    for (const item of settings) {
      map[item.key] = item.value;
    }
    return map;
  } catch {
    return defaults;
  }
}

export async function getSocialLinks() {
  try {
    return await db.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { orderIndex: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getCustomSections() {
  try {
    return await db.customSection.findMany({
      where: { isVisible: true },
      orderBy: { orderIndex: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getActiveAds(position?: string) {
  try {
    const now = new Date();
    return await db.advertisement.findMany({
      where: {
        status: "ACTIVE",
        ...(position ? { position } : {}),
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function getTaxiPosts(limit?: number) {
  try {
    return await db.taxiPost.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getTaxiReviews(limit?: number) {
  try {
    return await db.taxiReview.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getLuxuryVehicles(limit?: number) {
  try {
    return await db.luxuryVehicle.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  } catch {
    return [];
  }
}
