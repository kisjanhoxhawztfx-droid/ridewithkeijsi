import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const YOUTUBE_MAP = {
  // New motorcycles
  "Ddl6GLQgPr3": "xX1wyD-4Pig", // Honda X-ADV 2017
  "DdleGWiRARz": "PIvT7XN_Aik", // NAS 125 2025
  "DdjdcIwgYr6": "x-P_EuHzrc8", // Yamaha TMAX 560 2024
  "DdjNJZAAMx5": "3ij1p9fjlps", // Honda CBR 1000RR 2008
  "DdisLBpCd5e": "31fs5NlNLQ8", // BMW C 650 GT / Motorr i shitur
  "DdeXKZEgIwH": "0u9zzNT_PBI", // Honda NC 700 2012
  "Ddd3Pv_uGdP": "jfthXQBXMd0", // Piaggio Beverly 350
  "DdcFLKgR9ef": "ITJ02EEpsi4", // ❌BOOOOOOM❌
  "DdbYn4QAbwH": "udKWucw4Fqo", // Honda SH 300 2017
  "DdZEbhHq40p": "eSv_Ql80ark", // Yamaha Fazer 1000 2010
  "DdYtm_RiICZ": "XrAccxg3dho", // BMW R 1250 GS 40 Years
  "DdYZBO4C6fm": "8AqYmrxt1nI", // BMW R 1200 GS Rallye
  "DdWqMhRqlc6": "8Q09d6VuN1o", // Honda X-ADV 750 (SHITUR)
  "DdWNZ66g0Od": "10hw-cUTijk", // Honda Integra 2013
  "DdV8e-hxR0E": "cb8VXlpDX5U", // Yamaha Tracer 700 2020
  "DdUcoevRRcx": "6SWm4YEnMAk", // Kujdes
  "DdUL8U5OjpQ": "lDIIx0ddFms", // Honda Africa Twin
  "DdUEfCnpDaO": "3_jhuqMxmDc", // Honda Integra 700 2014
  "DdTiUewg3-2": "nbaRpO6XSNg", // Kawasaki ER-6N 2014
  "DdTR52BRaIB": "nbaRpO6XSNg", // Kawasaki ER-6N ❌SHITUR❌
  "DdRztFLRdRt": "RhrDtCAUYRk", // Yamaha DragStar 650
  "DdRmhWYBvO9": "JYRfQCjPDn4", // Yamaha TMAX DX 530 2018
  "DdRceFjs6vt": "oktKx204xXo", // Voge SR3 2025 ❌SHITUR❌
  "DdQ-thVCDWU": "N5fqoo_oTtw", // BMW R 1250 GS Adventure 40 Years
  "DdQpxS9uuvu": "4aOj0aHVAnY", // Harley-Davidson Street Glide
  "DdMyfMoOvyi": "y-1L03OMx_4", // 🏍️ KE MOTORR PËR SHITJE? SILLE DHE SHIT
};

async function main() {
  console.log("=== FIXING MOTORCYCLES (STATUS SOLD & THUMBNAILS) ===");

  const motorcycles = await prisma.instagramPost.findMany({
    where: { category: "SHITET" },
  });

  let soldCount = 0;
  let forSaleCount = 0;

  for (const m of motorcycles) {
    const cap = (m.caption || "").toLowerCase();
    const isSoldText = (
      cap.includes("shitur") ||
      cap.includes("e shitur") ||
      cap.includes("u shit") ||
      cap.includes("ushit") ||
      cap.includes("sold") ||
      cap.includes("❌")
    );

    const newStatus = isSoldText ? "SOLD" : (m.status === "SOLD" ? "SOLD" : "FOR_SALE");
    if (newStatus === "SOLD") soldCount++;
    else forSaleCount++;

    // Extract shortcode
    const scMatch = m.permalink.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    const shortcode = scMatch ? scMatch[1] : "";
    const ytId = YOUTUBE_MAP[shortcode] || YOUTUBE_MAP[m.instagramId];

    let newThumb = m.thumbnailUrl;
    if (ytId) {
      newThumb = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    } else if (m.thumbnailUrl && m.thumbnailUrl.startsWith("/")) {
      const filename = m.thumbnailUrl.replace("/instagram/", "");
      newThumb = `https://raw.githubusercontent.com/kisjanhoxhawztfx-droid/ridewithkeijsi/master/public/instagram/${filename}`;
    }

    await prisma.instagramPost.update({
      where: { id: m.id },
      data: {
        status: newStatus,
        thumbnailUrl: newThumb,
        isVisible: true,
      },
    });

    console.log(`[${newStatus}] ${shortcode} -> ${newThumb?.slice(0, 60)} | ${m.caption?.slice(0, 30).replace(/\n/g, " ")}`);
  }

  console.log(`\nMotorcycles updated: ${soldCount} SOLD, ${forSaleCount} FOR_SALE.`);

  console.log("\n=== FIXING FOR YOU / EPISOD POSTS (THUMBNAILS) ===");
  const episodPosts = await prisma.instagramPost.findMany({
    where: { category: "EPISOD" },
  });

  for (const ep of episodPosts) {
    const scMatch = ep.permalink.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    const shortcode = scMatch ? scMatch[1] : "";
    const ytId = YOUTUBE_MAP[shortcode] || YOUTUBE_MAP[ep.instagramId];

    let newThumb = ep.thumbnailUrl;
    if (ytId) {
      newThumb = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    } else if (ep.thumbnailUrl && ep.thumbnailUrl.startsWith("/")) {
      const filename = ep.thumbnailUrl.replace("/instagram/", "");
      newThumb = `https://raw.githubusercontent.com/kisjanhoxhawztfx-droid/ridewithkeijsi/master/public/instagram/${filename}`;
    } else if (ep.thumbnailUrl && ep.thumbnailUrl.includes("cdninstagram.com")) {
      newThumb = `https://raw.githubusercontent.com/kisjanhoxhawztfx-droid/ridewithkeijsi/master/public/instagram/${ep.instagramId}.jpg`;
    }

    await prisma.instagramPost.update({
      where: { id: ep.id },
      data: {
        thumbnailUrl: newThumb,
        isVisible: true,
      },
    });

    console.log(`[EPISOD] ${shortcode} -> ${newThumb?.slice(0, 60)} | ${ep.caption?.slice(0, 30).replace(/\n/g, " ")}`);
  }

  console.log(`\nAll ${episodPosts.length} For You posts updated with permanent CDN thumbnails!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
