import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseCaption(caption) {
  if (!caption) return { title: "Motorr", year: null, price: null, mileage: null, phone: null, engine: null };
  const lines = caption.split("\n").map(l => l.trim()).filter(Boolean);
  let title = "Motorr";
  let year = null;
  let price = null;
  let mileage = null;
  let phone = null;
  let engine = null;

  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes("viti") || l.includes("vit") || l.includes("year")) {
      const ym = line.match(/\b(20[12]\d)\b/);
      if (ym) year = parseInt(ym[1], 10);
    }
    if (l.includes("çmimi") || l.includes("cmimi") || l.includes("price") || l.includes("€")) {
      const pm = line.match(/([0-9]{1,3}(?:[.,][0-9]{3})*|[0-9]+)\s*(?:€|euro)?/i);
      if (pm) price = parseFloat(pm[1].replace(/[.,]/g, ""));
    }
    if (l.includes("km") || l.includes("kilometra") || l.includes("milje")) {
      const km = line.match(/([0-9]{1,3}(?:[.,][0-9]{3})*|[0-9]+)\s*(?:km|milje)?/i);
      if (km) mileage = parseInt(km[1].replace(/[.,]/g, ""), 10);
    }
    if (line.match(/(?:06[789]|\+355\s*6[789])/)) {
      const ph = line.match(/(?:\+355\s*)?0?6[789][\s\d]{6,10}/);
      if (ph) phone = ph[0].replace(/\s+/g, "");
    }
    if (l.match(/\b\d{2,4}\s*cc\b/i)) {
      const em = line.match(/\b(\d{2,4}\s*cc)\b/i);
      if (em) engine = em[1].toUpperCase();
    }
    // Brand detection for title
    const brands = ["Yamaha", "Honda", "BMW", "Kawasaki", "KTM", "Ducati", "Suzuki", "Vespa", "Piaggio", "CFMOTO", "Harley", "Voge"];
    for (const b of brands) {
      if (line.toLowerCase().includes(b.toLowerCase()) && title === "Motorr") {
        title = line.replace(/^[🏍️🏁📞❌\s]+/, "").trim();
      }
    }
  }

  if (title === "Motorr" && lines[0]) {
    title = lines[0].replace(/^[🏍️🏁📞❌\s]+/, "").trim();
  }

  return { title, year, price, mileage, phone, engine };
}

async function main() {
  const existingMotorcyclesCount = await prisma.motorcycle.count();
  console.log(`Current motorcycles in Motorcycle table: ${existingMotorcyclesCount}`);

  const igPosts = await prisma.instagramPost.findMany({
    where: { category: "SHITET" },
    orderBy: { postedAt: "desc" },
  });

  console.log(`Found ${igPosts.length} motorcycle posts in InstagramPost table.`);

  let created = 0;
  for (const post of igPosts) {
    const existing = await prisma.motorcycle.findFirst({
      where: {
        OR: [
          { instagramMediaId: post.instagramId },
          { permalink: post.permalink },
        ],
      },
    });

    if (existing) continue;

    const specs = parseCaption(post.caption);
    const title = specs.title || "Motorr";
    const brand = title.split(" ")[0] || "Motorr";
    const year = specs.year;
    const price = specs.price;
    const mileageKm = specs.mileage;
    const mileageMi = mileageKm ? Math.round(mileageKm * 0.621371) : null;

    const img = post.thumbnailUrl || `/api/instagram-image?id=${post.instagramId}`;
    const imagesList = [img];

    await prisma.motorcycle.create({
      data: {
        title,
        brand,
        model: title,
        year,
        price,
        currency: "EUR",
        mileageKm,
        mileageMi,
        engine: specs.engine || null,
        description: post.caption,
        phone: specs.phone || "+355697738559",
        whatsapp: specs.phone || "+355697738559",
        imageUrl: img,
        images: JSON.stringify(imagesList),
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        status: post.status === "SOLD" ? "SOLD" : "FOR_SALE",
        instagramMediaId: post.instagramId,
        permalink: post.permalink,
        caption: post.caption,
        isVisible: post.isVisible,
        publishedAt: post.postedAt,
      },
    });
    created++;
  }

  console.log(`Successfully migrated ${created} existing motorcycles to the dedicated Motorcycle table!`);
  const finalCount = await prisma.motorcycle.count();
  console.log(`Total motorcycles now in Motorcycle table: ${finalCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
