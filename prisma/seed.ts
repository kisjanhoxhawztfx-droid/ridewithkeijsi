import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Ride with Keijsi database...");

  // 1. Create Default Admin User
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await prisma.adminUser.create({
      data: {
        username: "admin",
        email: "admin@ridewithkeijsi.com",
        passwordHash: passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log("✓ Default admin created: username 'admin', password 'admin123'");
  }

  // 2. Default Site Settings
  const defaultSettings = [
    // Branding
    { key: "site_name", value: "Ride with Keijsi", group: "branding" },
    { key: "site_tagline", value: "Emisioni & Platforma Numër Një për Motorra dhe Motorsport në Shqipëri", group: "branding" },
    { key: "logo_url", value: "/logo.png", group: "branding" },
    { key: "primary_color", value: "#00B2FE", group: "branding" },
    { key: "secondary_color", value: "#05070A", group: "branding" },
    { key: "accent_color", value: "#00D2FF", group: "branding" },

    // Homepage Hero
    { key: "hero_title", value: "RIDE WITH KEIJSI", group: "hero" },
    { key: "hero_subtitle", value: "Eksploroni botën e shpejtësisë, rrugës dhe motorrave me Keijsin. Episode ekskluzive, rishikime makinash & motorrash, dhe motorrat më të mirë në treg.", group: "hero" },
    { key: "hero_cta_text", value: "Shiko Episodin e Fundit", group: "hero" },
    { key: "hero_cta_link", value: "/episodes", group: "hero" },
    { key: "hero_secondary_cta_text", value: "Motorra në Shitje", group: "hero" },
    { key: "hero_secondary_cta_link", value: "/motorra", group: "hero" },

    // Contact Info
    { key: "contact_email", value: "contact@ridewithkeijsi.com", group: "contact" },
    { key: "contact_phone", value: "+355 69 000 0000", group: "contact" },
    { key: "contact_address", value: "Tiranë, Shqipëri", group: "contact" },

    // Taxi Keijsi Settings
    { key: "taxi_phone", value: "+355 69 000 0000", group: "taxi" },
    { key: "taxi_whatsapp", value: "+355690000000", group: "taxi" },
    { key: "taxi_instagram", value: "taxi_keijsi", group: "taxi" },
    { key: "taxi_google_business_url", value: "https://maps.google.com/?q=Taxi+Keijsi+Tirana", group: "taxi" },
    { key: "taxi_google_place_id", value: "", group: "taxi" },
    { key: "taxi_title", value: "Taxi Keijsi — Shërbim Taksie 24/7", group: "taxi" },
    { key: "taxi_description", value: "Shërbim taksie i shpejtë, komod dhe profesional në Tiranë dhe në të gjithë Shqipërinë. Transferta aeroporti, udhëtime turistike dhe shërbim VIP 24 orë në 7 ditë të javës.", group: "taxi" },

    // SEO
    { key: "seo_title", value: "Ride with Keijsi — Emisioni & Platforma e Motorrave", group: "seo" },
    { key: "seo_description", value: "Shikoni episodet e fundit të Ride with Keijsi, eksploroni motorrat për shitje në Motorra, porositni Taxi Keijsi, dhe ndiqni aventurat më të çmendura me dy dhe katër rrota.", group: "seo" },
    { key: "seo_keywords", value: "Ride with Keijsi, Keijsi, Motorra, Taxi Keijsi, Taxi Tirane, Rinas Airport Taxi, Shqiperi, Tirane, YouTube, Instagram", group: "seo" },
    { key: "seo_og_image", value: "/logo.png", group: "seo" },

    // API Config Status
    { key: "youtube_channel_id", value: "", group: "api" },
    { key: "youtube_auto_sync", value: "true", group: "api" },
    { key: "instagram_account_name", value: "ridewithkeijsi", group: "api" },
    { key: "instagram_auto_sync", value: "true", group: "api" },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("✓ Default settings seeded");

  // 3. Social Links
  const socialLinks = [
    { platform: "youtube", label: "YouTube", url: "https://www.youtube.com/@ridewithkeijsi", icon: "youtube", isVisible: true, orderIndex: 1 },
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/ridewithkeijsi", icon: "instagram", isVisible: true, orderIndex: 2 },
    { platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@ridewithkeijsi", icon: "tiktok", isVisible: true, orderIndex: 3 },
    { platform: "email", label: "Email", url: "mailto:contact@ridewithkeijsi.com", icon: "mail", isVisible: true, orderIndex: 4 },
  ];

  for (const link of socialLinks) {
    const exists = await prisma.socialLink.findFirst({ where: { platform: link.platform } });
    if (!exists) {
      await prisma.socialLink.create({ data: link });
    }
  }
  console.log("✓ Social links seeded");

  // 4. Custom Sections
  const sections = [
    { slug: "episodes", name: "Ride with Keijsi", title: "Episodet më të Fundit", description: "Emisioni zyrtar me intervista, teste dhe aventura motorike.", icon: "tv", isVisible: true, showOnHomepage: true, orderIndex: 1 },
    { slug: "motorra", name: "Motorra", title: "Motorra në Shitje", description: "Motorrat më të zgjedhur të disponueshëm për shitje në Instagram.", icon: "bike", isVisible: true, showOnHomepage: true, orderIndex: 2 },
    { slug: "taxi", name: "Taxi Keijsi", title: "Taxi Keijsi 24/7", description: "Shërbim taksie i sigurt, komod dhe i shpejtë në çdo kohë.", icon: "car", isVisible: true, showOnHomepage: true, orderIndex: 3 },
    { slug: "ads", name: "Sponsorët & Reklamat", title: "Partnerët Tanë", description: "Bizneset dhe markat zyrtare që mbështesin Ride with Keijsi.", icon: "badge-percent", isVisible: true, showOnHomepage: true, orderIndex: 4 },
    { slug: "news", name: "Lajme & Njoftime", title: "Të Rejat e Fundit", description: "Lajme nga bota e motorsportit dhe komuniteti shqiptar i motorrave.", icon: "newspaper", isVisible: false, showOnHomepage: false, orderIndex: 5 },
  ];

  for (const sec of sections) {
    await prisma.customSection.upsert({
      where: { slug: sec.slug },
      update: {},
      create: sec,
    });
  }
  console.log("✓ Dynamic sections seeded");

  // 5. Initial / Demonstration YouTube Episodes
  const sampleEpisodes = [
    {
      youtubeVideoId: "dQw4w9WgXcQ_demo1",
      title: "EP. 12 — Xhiro me Yamaha R1M në Rrugën e Kombit & Testi i Shpejtësisë",
      slug: "ep-12-xhiro-me-yamaha-r1m-ne-rrugen-e-kombit",
      description: "Në këtë episod të Ride with Keijsi testojmë bishën japoneze Yamaha R1M me 200 kuaj fuqi! Si sillet në kthesa, çfarë duhet të dini para se ta blini dhe zëri i pabesueshëm i motorrit crossplane.",
      thumbnailUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "24:18",
      viewCount: 18450,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isFeatured: true,
      isVisible: true,
      orderIndex: 1,
      tags: "Yamaha, R1M, Superbike, Ride with Keijsi, Test Ride",
    },
    {
      youtubeVideoId: "demo_vid_02",
      title: "EP. 11 — Aventura me BMW GS 1250 Adventure në Malet e Thethit",
      slug: "ep-11-aventura-me-bmw-gs-1250-adventure-ne-theth",
      description: "Një udhëtim epik drejt veriut të Shqipërisë me mbretin e rrugëve dhe off-road BMW R 1250 GS Adventure. Eksplorojmë peizazhet spektakolare dhe testojmë aftësitë e vërteta të motorrit.",
      thumbnailUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "31:45",
      viewCount: 24300,
      publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      isFeatured: false,
      isVisible: true,
      orderIndex: 2,
      tags: "BMW GS, Theth, Offroad, Albania, Adventure Ride",
    },
  ];

  for (const ep of sampleEpisodes) {
    await prisma.episode.upsert({
      where: { youtubeVideoId: ep.youtubeVideoId },
      update: {},
      create: ep,
    });
  }

  // 6. Initial Demonstration Motorra Listings
  const sampleMotorcycles = [
    {
      instagramMediaId: "ig_post_101",
      permalink: "https://www.instagram.com/p/DBk39s9MABC/",
      mediaType: "IMAGE",
      thumbnailUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop",
      caption: "🔥 Sapo mbërriti në sallon! Yamaha YZF-R6 Viti 2021. Gjendje perfekte 10/10, shërbimet e kryera, shkarkues Akrapovic Full System, me dokumenta të rregullta shqiptare. Çmimi me marrëveshje, dërgoni DM për rezervim! 🏍️💨",
      brand: "Yamaha",
      model: "YZF-R6",
      year: 2021,
      price: 11500,
      currency: "EUR",
      engine: "599cc",
      status: "FOR_SALE",
      isFeatured: true,
      isVisible: true,
      orderIndex: 1,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      instagramMediaId: "ig_post_102",
      permalink: "https://www.instagram.com/p/DBk39s9MDEF/",
      mediaType: "IMAGE",
      thumbnailUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop",
      caption: "⚡ BMW R 1250 GS Triple Black Edition. Viti 2022, 18,000 km, me valixhe origjinale BMW Alumini, Navigacion ConnectedRide, suspensione elektronike Dynamic ESA. Gati për çdo udhëtim transkontinental! 🌍🏔️",
      brand: "BMW",
      model: "R 1250 GS Triple Black",
      year: 2022,
      price: 18900,
      currency: "EUR",
      engine: "1254cc",
      status: "FOR_SALE",
      isFeatured: true,
      isVisible: true,
      orderIndex: 2,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const moto of sampleMotorcycles) {
    await prisma.motorcycle.upsert({
      where: { instagramMediaId: moto.instagramMediaId },
      update: {},
      create: moto,
    });
  }

  // 7. Initial Dedicated Taxi Keijsi Instagram Posts (@taxi_keijsi)
  const sampleTaxiPosts = [
    {
      instagramMediaId: "taxi_post_01",
      permalink: "https://www.instagram.com/taxi_keijsi/",
      mediaType: "IMAGE",
      thumbnailUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop",
      caption: "🚖 Taxi Keijsi në shërbimin tuaj 24/7! Makina komode, kondicioner, korrektësi maksimale dhe çmime të arsyeshme për çdo destinacion në Tiranë dhe rrethe. Telefononi ose shkruani në WhatsApp! 📞✨",
      isFeatured: true,
      isVisible: true,
      orderIndex: 1,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      instagramMediaId: "taxi_post_02",
      permalink: "https://www.instagram.com/taxi_keijsi/",
      mediaType: "IMAGE",
      thumbnailUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1000&auto=format&fit=crop",
      caption: "✈️ Transfertë e sigurt dhe në kohë drejt Aeroportit Ndërkombëtar të Tiranës (TIA). Rezervoni taksinë tuaj para kohe dhe udhëtoni pa stres! 🧳🛣️",
      isFeatured: true,
      isVisible: true,
      orderIndex: 2,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      instagramMediaId: "taxi_post_03",
      permalink: "https://www.instagram.com/taxi_keijsi/",
      mediaType: "IMAGE",
      thumbnailUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop",
      caption: "🌟 Udhëtime komode ndërqytetase: Tiranë - Durrës, Vlorë, Sarandë, Shkodër e më gjerë. Siguria dhe pastërtia janë prioriteti ynë numër 1. 🛡️🚘",
      isFeatured: false,
      isVisible: true,
      orderIndex: 3,
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const tp of sampleTaxiPosts) {
    await prisma.taxiPost.upsert({
      where: { instagramMediaId: tp.instagramMediaId },
      update: {},
      create: tp,
    });
  }
  console.log("✓ Sample Taxi Keijsi (@taxi_keijsi) posts seeded");

  // 8. Initial Google Business Reviews for Taxi Keijsi
  const sampleReviews = [
    {
      googleReviewId: "g_rev_01",
      authorName: "Arben Hoxha",
      authorPhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
      rating: 5,
      text: "Shërbimi më i mirë i taksisë në Tiranë! Makina ishte shumë e pastër, shoferi Keijsi shumë i sjellshëm dhe arritëm në aeroport saktësisht në kohë. E rekomandoj 100%!",
      relativeTimeDescription: "para 2 ditësh",
      source: "GOOGLE",
      isVisible: true,
      isFeatured: true,
      orderIndex: 1,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      googleReviewId: "g_rev_02",
      authorName: "Elira Dervishi",
      authorPhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
      rating: 5,
      text: "Udhëtim shumë i rehatshëm nga Tirana në Durrës. Çmimi shumë korrekt dhe komunikimi në WhatsApp ishte i menjëhershëm. Faleminderit!",
      relativeTimeDescription: "para 1 jave",
      source: "GOOGLE",
      isVisible: true,
      isFeatured: true,
      orderIndex: 2,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      googleReviewId: "g_rev_03",
      authorName: "Marco Rossi (Tourist)",
      authorPhotoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop",
      rating: 5,
      text: "Great taxi service in Albania! Very polite driver, speaks good English, safe driving and fair price. Highly recommended for tourists visiting Tirana.",
      relativeTimeDescription: "para 2 javësh",
      source: "GOOGLE",
      isVisible: true,
      isFeatured: true,
      orderIndex: 3,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const rev of sampleReviews) {
    await prisma.taxiReview.upsert({
      where: { googleReviewId: rev.googleReviewId },
      update: {},
      create: rev,
    });
  }
  console.log("✓ Sample Google Business Reviews for Taxi Keijsi seeded");

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
