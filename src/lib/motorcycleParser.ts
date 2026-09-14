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
  const phoneRegex = /(\+355\s?6[7-9]\s?\d{3}\s?\d{4}|06[7-9]\s?\d{3}\s?\d{4}|\+?355\s?\d{2,3}\s?\d{3}\s?\d{3,4})/;
  const yearRegex = /\b(19\d{2}|20[0-3]\d)\b/;
  const mileageRegex = /([\d.,]+\s?(?:km|mile|milje))/i;
  const engineRegex = /([\d.,]+\s?cc|[\d.,]+\s?hp|\d+\s?engine|\d+\s?marshe|\d+\s?cc\s?\+\s?\d+\s?hp)/i;
  const priceRegex = /([\d.,]+\s?(?:€|eur|euro|lek|leke|\$))/i;

  for (const line of lines) {
    // Skip hashtag lines
    if (line.startsWith("#")) continue;

    // 1. Phone detection
    if (!phone && phoneRegex.test(line)) {
      const match = line.match(phoneRegex);
      if (match) {
        phone = match[0].trim();
        continue;
      }
    }

    // 2. Price detection
    if (!price && priceRegex.test(line)) {
      const match = line.match(priceRegex);
      if (match) {
        price = match[0].trim();
        continue;
      }
    }

    // 3. Mileage detection
    if (!mileage && mileageRegex.test(line)) {
      const match = line.match(mileageRegex);
      if (match) {
        mileage = match[0].trim();
        continue;
      }
    }

    // 4. Engine / Power detection
    if (engineRegex.test(line)) {
      if (!engine) {
        engine = line.trim();
      } else {
        extraSpecs.push(line.trim());
      }
      continue;
    }

    // 5. Standalone year
    if (!year && yearRegex.test(line) && line.replace(yearRegex, "").trim().length === 0) {
      const match = line.match(yearRegex);
      if (match) {
        year = match[0].trim();
        continue;
      }
    }

    // 6. Title detection
    if (!title && line.length > 2 && !priceRegex.test(line) && !phoneRegex.test(line)) {
      title = line.trim();
      // If year is included in title, extract it
      const yMatch = line.match(yearRegex);
      if (yMatch && !year) {
        year = yMatch[0].trim();
      }
      continue;
    }

    // 7. Extra features vs general description
    if (
      line.length < 40 &&
      (line.includes("Edition") ||
        line.includes("marshe") ||
        line.includes("ABS") ||
        line.includes("HP") ||
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
