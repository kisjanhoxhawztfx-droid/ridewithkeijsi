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
