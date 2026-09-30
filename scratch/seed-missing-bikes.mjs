import { PrismaClient } from "@prisma/client";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const db = new PrismaClient();

const newMotorcycles = [
  {
    instagramId: "yt_3_jhuqMxmDc",
    shortcode: "3_jhuqMxmDc",
    permalink: "https://www.instagram.com/ridewithkeijsi/",
    thumbnailSrc: "https://i.ytimg.com/vi/3_jhuqMxmDc/hqdefault.jpg",
    caption: "📞 069 775 8970\n\nHonda Integra 700\n2014\n68,000 km\n700 cc + 51 hp\n4,700 €\n\n#ridewithkeijsi #shitet #motorr",
    status: "FOR_SALE",
    postedAt: new Date("2026-09-16T08:54:38Z"),
    mediaType: "VIDEO",
  },
  {
    instagramId: "yt_nbaRpO6XSNg",
    shortcode: "nbaRpO6XSNg",
    permalink: "https://www.instagram.com/ridewithkeijsi/",
    thumbnailSrc: "https://i.ytimg.com/vi/nbaRpO6XSNg/hqdefault.jpg",
    caption: "📞 +355 69 723 6989\n\nKawasaki ER-6N\n2014\n23,000 km\n649 cc + 35 kW (në leje qarkullimi)\n5,000€\n\n#ridewithkeijsi #shitet #motorr",
    status: "FOR_SALE",
    postedAt: new Date("2026-09-15T12:02:58Z"),
    mediaType: "VIDEO",
  },
  {
    instagramId: "yt_Sv1s2N8tdZA",
    shortcode: "Sv1s2N8tdZA",
    permalink: "https://www.instagram.com/ridewithkeijsi/",
    thumbnailSrc: "https://i.ytimg.com/vi/Sv1s2N8tdZA/hqdefault.jpg",
    caption: "BMW R 1300 GS Adventure\n❌SHITUR❌\n\n#ridewithkeijsi #shitur #motorr",
    status: "SOLD",
    postedAt: new Date("2026-09-15T09:08:25Z"),
    mediaType: "VIDEO",
  },
  {
    instagramId: "yt_RhrDtCAUYRk",
    shortcode: "RhrDtCAUYRk",
    permalink: "https://www.instagram.com/ridewithkeijsi/",
    thumbnailSrc: "https://i.ytimg.com/vi/RhrDtCAUYRk/hqdefault.jpg",
    caption: "+355 69 530 4711\n\nYamaha DragStar 650\n2006\n17,000 km\n650cc + 40 hp\n4,000€\n\n#ridewithkeijsi #shitet #motorr",
    status: "FOR_SALE",
    postedAt: new Date("2026-09-14T19:14:15Z"),
    mediaType: "VIDEO",
  },
  {
    instagramId: "3989086127369213855",
    shortcode: "DdcFLKgR9ef",
    permalink: "https://www.instagram.com/reel/DdcFLKgR9ef/",
    thumbnailSrc: "https://i.ytimg.com/vi/ITJ02EEpsi4/hqdefault.jpg",
    caption: "❌BOOOOOOM❌\n\nMotorra në Shitje Ride With Keijsi\n\n#ridewithkeijsi #shitet #motorr",
    status: "FOR_SALE",
    postedAt: new Date("2026-09-18T19:02:44Z"),
    mediaType: "VIDEO",
  },
  {
    instagramId: "3986937497216423729",
    shortcode: "DdUcoevRRcx",
    permalink: "https://www.instagram.com/reel/DdUcoevRRcx/",
    thumbnailSrc: "https://i.ytimg.com/vi/6SWm4YEnMAk/hqdefault.jpg",
    caption: "Kujdes 🏍️\n\nMotorra në Shitje Ride With Keijsi\n\n#ridewithkeijsi #shitet #motorr",
    status: "FOR_SALE",
    postedAt: new Date("2026-09-15T09:05:09Z"),
    mediaType: "VIDEO",
  },
];

async function seedMissingBikes() {
  const dir = path.join(process.cwd(), "public", "instagram");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  for (const bike of newMotorcycles) {
    console.log(`Processing ${bike.shortcode}...`);
    let localThumb = `/instagram/${bike.instagramId}.jpg`;
    const destPath = path.join(dir, `${bike.instagramId}.jpg`);

    try {
      const res = await fetch(bike.thumbnailSrc);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        writeFileSync(destPath, buf);
        console.log(`  Saved thumbnail to ${destPath}`);
      } else {
        console.warn(`  Failed to download thumb: HTTP ${res.status}`);
        localThumb = bike.thumbnailSrc;
      }
    } catch (e) {
      console.warn(`  Error downloading thumb: ${e.message}`);
      localThumb = bike.thumbnailSrc;
    }

    const existing = await db.instagramPost.findFirst({
      where: {
        OR: [
          { instagramId: bike.instagramId },
          { permalink: { contains: bike.shortcode } },
        ],
      },
    });

    if (existing) {
      console.log(`  Already exists in DB: [${existing.status}] ${existing.permalink}. Updating caption/thumbnail...`);
      await db.instagramPost.update({
        where: { id: existing.id },
        data: {
          thumbnailUrl: localThumb,
          caption: bike.caption,
          category: "SHITET",
          // Retain existing status so admin manual choice is never overwritten
          status: existing.status,
          isVisible: true,
        },
      });
    } else {
      console.log(`  Creating new post in DB...`);
      await db.instagramPost.create({
        data: {
          instagramId: bike.instagramId,
          permalink: bike.permalink,
          thumbnailUrl: localThumb,
          mediaUrl: null,
          caption: bike.caption,
          category: "SHITET",
          status: bike.status,
          isVisible: true,
          postedAt: bike.postedAt,
          mediaType: bike.mediaType,
        },
      });
    }
  }

  const allShitet = await db.instagramPost.findMany({
    where: { category: "SHITET" },
    orderBy: { postedAt: "desc" },
  });
  console.log(`\n========================================`);
  console.log(`Total SHITET posts in DB now: ${allShitet.length}`);
  const forSale = allShitet.filter(b => b.status === "FOR_SALE");
  const sold = allShitet.filter(b => b.status === "SOLD");
  console.log(`FOR_SALE: ${forSale.length} | SOLD: ${sold.length}`);
  allShitet.forEach((b, i) => {
    console.log(`${i+1}. [${b.status}] ${b.permalink} - ${b.caption.slice(0, 40).replace(/\n/g, ' ')}`);
  });
}

seedMissingBikes()
  .then(() => db.$disconnect())
  .catch(console.error);
