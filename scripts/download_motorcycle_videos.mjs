import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const YOUTUBE_MAP = {
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
  "3988890188540656647": "jgC5RdUmct8", // Harley Davidson
};

async function main() {
  const dir = path.join(process.cwd(), "public", "videos");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const posts = await prisma.instagramPost.findMany({
    where: { category: "SHITET" },
  });

  console.log(`Found ${posts.length} motorcycles in DB.`);
  let updated = 0;

  for (const post of posts) {
    const scMatch = post.permalink.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    const shortcode = scMatch ? scMatch[1] : "";
    const key = shortcode || post.instagramId;
    const ytId = YOUTUBE_MAP[key] || (post.instagramId.startsWith("yt_") ? post.instagramId.replace("yt_", "") : null);

    if (!ytId) {
      console.log(`[SKIP] No video source mapped for ${key} (${post.caption.slice(0, 30)})`);
      continue;
    }

    const filename = `${key}.mp4`;
    const dest = path.join(dir, filename);

    if (!fs.existsSync(dest) || fs.statSync(dest).size < 10000) {
      console.log(`Downloading ${filename} from YouTube ${ytId}...`);
      try {
        execSync(`python -m yt_dlp -f 18 -o "${dest}" "https://www.youtube.com/watch?v=${ytId}"`, { stdio: "pipe" });
        const sizeMb = (fs.statSync(dest).size / 1024 / 1024).toFixed(2);
        console.log(`-> Saved ${filename} (${sizeMb} MB)`);
      } catch (err) {
        console.error(`-> Failed to download ${filename}:`, err.message);
        continue;
      }
    } else {
      console.log(`-> Already exists: ${filename}`);
    }

    // Update DB with permanent local video URL
    const videoUrl = `/videos/${filename}`;
    await prisma.instagramPost.update({
      where: { id: post.id },
      data: {
        mediaUrl: videoUrl,
        mediaType: "VIDEO",
      },
    });
    updated++;
  }

  console.log(`\nSuccessfully updated ${updated} / ${posts.length} motorcycles with permanent MP4 videos!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
