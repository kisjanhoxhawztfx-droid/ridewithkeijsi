export interface ParsedMotorcycle {
  phone: string | null;
  rawPhone: string | null;
  title: string;
  year: string | null;
  mileage: string | null;
  engine: string | null;
  price: string | null;
  extraSpecs: string[];
  cleanDescription: string;
  hasStructuredSpecs: boolean;
}

/**
 * Intelligently parse motorcycle listing caption from Instagram
 */
export function parseMotorcycleCaption(caption: string): ParsedMotorcycle {
  if (!caption) {
    return {
      phone: null,
      rawPhone: null,
      title: "Motorr në Shitje",
      year: null,
      mileage: null,
      engine: null,
      price: null,
      extraSpecs: [],
      cleanDescription: "",
      hasStructuredSpecs: false,
    };
  }

  const lines = caption
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let phone: string | null = null;
  let title = "";
  let year: string | null = null;
  let mileage: string | null = null;
  let engine: string | null = null;
  let price: string | null = null;
  const extraSpecs: string[] = [];
  const descLines: string[] = [];

  // Regex patterns
  const phoneRegex = /(?:\+?355\s?6[7-9]\s?\d{3}\s?\d{4}|06[7-9]\s?\d{3}\s?\d{4}|\+?355\s?\d{2,3}\s?\d{3}\s?\d{3,4})/;
  const yearPattern = /(?:viti|vit|year)?\s*[:=]?\s*\b(19\d{2}|20[0-3]\d)\b/i;
  const mileageRegex = /([\d.,]+\s?(?:km|mile|milje))/i;
  const engineRegex = /([\d.,]+\s?cc(?:\s*[+•/—–-]\s*[\d.,]+\s?hp)?|[\d.,]+\s?hp|\d+\s?engine|\d+\s?marshe)/i;
  const priceRegex = /((?:€|eur|euro|lek|leke|\$)\s*[\d.,]+|[\d.,]+\s*(?:€|eur|euro|lek|leke|\$))/i;

  for (const rawLine of lines) {
    // Skip hashtag lines
    if (rawLine.startsWith("#")) continue;

    // Clean line of non-standard leading icons
    const line = rawLine.replace(/^[📞📲🏍️🏎️🔥💥✨📍👇\s]+/, "").trim();
    if (!line) continue;

    // 1. Phone detection
    if (!phone && phoneRegex.test(line)) {
      const match = line.match(phoneRegex);
      if (match) {
        phone = match[0].trim();
        continue;
      }
    }

    // 2. Price detection (e.g. 4,000€, €4,300, 3,500 lek, Çmimi: 7,500 €)
    if (!price && priceRegex.test(line)) {
      const match = line.match(priceRegex);
      if (match) {
        price = match[0].trim();
        continue;
      }
    }

    // 3. Mileage detection (e.g. 25,000 km, 18,000 milje, 6,700 miles)
    if (!mileage && mileageRegex.test(line)) {
      const match = line.match(mileageRegex);
      if (match) {
        mileage = match[0].trim();
        continue;
      }
    }

    // 4. Engine / Power detection (e.g. 998cc • 150 HP, 1,254 cc • 136 HP, 350 cc — 33 HP)
    if (engineRegex.test(line)) {
      if (!engine) {
        engine = line.trim();
      } else {
        extraSpecs.push(line.trim());
      }
      continue;
    }

    // 5. Year detection (pure year lines e.g. 2013, Viti: 2012, Vit 2018)
    const pureYearRegex = /^(?:viti|vit|year)?\s*[:=]?\s*(19\d{2}|20[0-3]\d)$/i;
    if (!year && pureYearRegex.test(line)) {
      const match = line.match(pureYearRegex);
      if (match) {
        year = match[1].trim();
        continue;
      }
    }

    // 6. Title detection
    if (!title && line.length > 2 && !priceRegex.test(line) && !phoneRegex.test(line)) {
      // Check if title is purely a SOLD marker
      if (/^❌?\s*(?:shitur|u shit|sold)\s*❌?$/i.test(line)) {
        title = "Motorr i Shitur";
      } else {
        title = line.trim();
        // If year is included in title (e.g. "Honda Integra 2013"), extract it if not yet found
        const yMatch = line.match(/\b(19\d{2}|20[0-3]\d)\b/);
        if (yMatch && !year) {
          year = yMatch[1].trim();
        }
      }
      continue;
    }

    // 7. Extra features vs general description
    if (
      line.length < 50 &&
      (line.includes("Edition") ||
        line.includes("marshe") ||
        line.includes("ABS") ||
        line.includes("HP") ||
        line.includes("Automat") ||
        line.includes("Grup i ndërruar") ||
        line.includes("Koleksion") ||
        line.includes("TCS") ||
        line.includes("Quickshifter"))
    ) {
      extraSpecs.push(line.trim());
    } else {
      descLines.push(line.trim());
    }
  }

  // Fallback title
  if (!title) {
    const fallback = lines.find((l) => !l.startsWith("#") && !phoneRegex.test(l));
    title = fallback ? fallback.slice(0, 45) : "Motorr në Shitje";
  }

  const rawPhone = phone ? phone.replace(/[^0-9+]/g, "") : null;
  const hasStructuredSpecs = Boolean(year || mileage || engine || price || phone);

  return {
    phone,
    rawPhone,
    title,
    year,
    mileage,
    engine,
    price,
    extraSpecs,
    cleanDescription: descLines.join("\n"),
    hasStructuredSpecs,
  };
}

export const MOTORCYCLE_YOUTUBE_MAP: Record<string, string> = {
  // Shortcodes
  "DdeXKZEgIwH": "0u9zzNT_PBI", // Honda NC 700
  "Ddd3Pv_uGdP": "jfthXQBXMd0", // Piaggio Beverly 350
  "DdcFLKgR9ef": "ITJ02EEpsi4", // ❌BOOOOOOM❌
  "DdbYn4QAbwH": "udKWucw4Fqo", // Honda SH 300
  "DdZEbhHq40p": "eSv_Ql80ark", // Yamaha Fazer 1000
  "DdYtm_RiICZ": "XrAccxg3dho", // BMW R 1250 GS
  "DdYZBO4C6fm": "8AqYmrxt1nI", // BMW R 1200 GS
  "DdWqMhRqlc6": "8Q09d6VuN1o", // Honda X-ADV 750
  "DdWNZ66g0Od": "10hw-cUTijk", // Honda Integra 2013
  "DdV8e-hxR0E": "cb8VXlpDX5U", // Yamaha Tracer 700
  "DdUcoevRRcx": "6SWm4YEnMAk", // Kujdes
  "DdUL8U5OjpQ": "lDIIx0ddFms", // Honda Africa Twin
  "DdRmhWYBvO9": "JYRfQCjPDn4", // Yamaha TMAX DX 530
  "DdRceFjs6vt": "oktKx204xXo", // Voge SR3 2025
  "DdQ-thVCDWU": "N5fqoo_oTtw", // BMW R 1250 GS Adv
  "DdQpxS9uuvu": "4aOj0aHVAnY", // Harley-Davidson

  // YouTube IDs / Custom IDs
  "3_jhuqMxmDc": "3_jhuqMxmDc", // Honda Integra 700 2014
  "yt_3_jhuqMxmDc": "3_jhuqMxmDc",
  "nbaRpO6XSNg": "nbaRpO6XSNg", // Kawasaki ER-6N
  "yt_nbaRpO6XSNg": "nbaRpO6XSNg",
  "Sv1s2N8tdZA": "Sv1s2N8tdZA", // BMW R 1300 GS Adventure
  "yt_Sv1s2N8tdZA": "Sv1s2N8tdZA",
  "RhrDtCAUYRk": "RhrDtCAUYRk", // Yamaha DragStar 650
  "yt_RhrDtCAUYRk": "RhrDtCAUYRk",

  // Instagram numeric PKs
  "6750313933721613571951": "0u9zzNT_PBI",
  "6750502664531810455064": "jfthXQBXMd0",
  "3989086127369213855": "ITJ02EEpsi4",
  "6750602715232073601951": "udKWucw4Fqo",
  "6750721660175146231262": "eSv_Ql80ark",
  "6750274356182938576872": "XrAccxg3dho",
  "6750277237212368253056": "8AqYmrxt1nI",
  "6750474652172946345425": "8Q09d6VuN1o",
  "6750472272252513122150": "10hw-cUTijk",
  "6750421131701759291216": "cb8VXlpDX5U",
  "3986937497216423729": "6SWm4YEnMAk",
  "6750661411666521496220": "lDIIx0ddFms",
  "3986136562735182781": "JYRfQCjPDn4",
  "3986092358053899245": "oktKx204xXo",
  "3985961477269370260": "N5fqoo_oTtw",
  "3985869377747217390": "4aOj0aHVAnY",
};

/**
 * Resolves the YouTube video ID for any motorcycle post through multiple fallback levels.
 */
export function getMotorcycleYouTubeId(post?: {
  id?: string;
  instagramId?: string | null;
  permalink?: string;
  caption?: string;
} | null): string | null {
  if (!post) return null;

  // 1. Check instagramId
  if (post.instagramId && MOTORCYCLE_YOUTUBE_MAP[post.instagramId]) {
    return MOTORCYCLE_YOUTUBE_MAP[post.instagramId];
  }

  // 2. Check id
  if (post.id && MOTORCYCLE_YOUTUBE_MAP[post.id]) {
    return MOTORCYCLE_YOUTUBE_MAP[post.id];
  }

  // 3. Check permalink shortcode
  if (post.permalink) {
    const scMatch = post.permalink.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
    if (scMatch && MOTORCYCLE_YOUTUBE_MAP[scMatch[1]]) {
      return MOTORCYCLE_YOUTUBE_MAP[scMatch[1]];
    }
  }

  // 4. Keyword heuristic matching from caption
  const cap = (post.caption || "").toLowerCase();
  if (cap.includes("nc 700")) return "0u9zzNT_PBI";
  if (cap.includes("beverly 350")) return "jfthXQBXMd0";
  if (cap.includes("boooooom") || cap.includes("boom")) return "ITJ02EEpsi4";
  if (cap.includes("sh 300")) return "udKWucw4Fqo";
  if (cap.includes("fazer 1000") || cap.includes("fazer")) return "eSv_Ql80ark";
  if (cap.includes("1250 gs 40")) return "XrAccxg3dho";
  if (cap.includes("1200 gs")) return "8AqYmrxt1nI";
  if (cap.includes("x-adv")) return "8Q09d6VuN1o";
  if (cap.includes("integra 2013") || cap.includes("integra 700 2013")) return "10hw-cUTijk";
  if (cap.includes("tracer 700")) return "cb8VXlpDX5U";
  if (cap.includes("kujdes")) return "6SWm4YEnMAk";
  if (cap.includes("africa twin")) return "lDIIx0ddFms";
  if (cap.includes("integra 700 2014")) return "3_jhuqMxmDc";
  if (cap.includes("er-6n")) return "nbaRpO6XSNg";
  if (cap.includes("1300 gs")) return "Sv1s2N8tdZA";
  if (cap.includes("dragstar")) return "RhrDtCAUYRk";
  if (cap.includes("tmax")) return "JYRfQCjPDn4";
  if (cap.includes("voge sr3")) return "oktKx204xXo";
  if (cap.includes("1250 gs adventure")) return "N5fqoo_oTtw";
  if (cap.includes("street glide") || cap.includes("harley")) return "4aOj0aHVAnY";

  return null;
}

