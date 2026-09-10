const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const luxurySettings = [
  { key: "luxury_phone", value: "+355697738559", group: "luxury" },
  { key: "luxury_whatsapp", value: "+355697738559", group: "luxury" },
  { key: "luxury_title", value: "LUXURY SERVICES", group: "luxury" },
  { key: "luxury_subtitle", value: "Shërbime ekskluzive me qira për makina luksoze, limuzina, furgona Maybach VIP, Rolls-Royce dhe Bentley me shofer personal 24/7 në Shqipëri.", group: "luxury" },
];

const luxuryFleet = [
  {
    name: "Rolls-Royce Ghost Black Badge",
    category: "ROLLS_ROYCE",
    title: "Rolls-Royce Ghost VIP Edition",
    description: "Luks dhe madhështi absolute me interior me yje Starlight, sedilje lëkure me masazh, izolim akustik total dhe shofer personal të certifikuar.",
    imageUrl: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1200&q=85",
    features: "Shofer VIP me Kostum, Tavan me Yje Starlight, Minibar & Shampanjë, Wi-Fi 5G & Siguri Maksimale",
    priceText: "Me Rezervim / Ditë",
    pricePerDay: 1500,
    isFeatured: true,
    isVisible: true,
    orderIndex: 1,
  },
  {
    name: "Bentley Flying Spur W12",
    category: "BENTLEY",
    title: "Bentley Flying Spur Mulliner",
    description: "Prestigj dhe elegancë britanike me detaje Mulliner punuar me dorë, sistem audio Naim dhe rehati të pakrahasueshme për delegacione dhe ceremoni.",
    imageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=85",
    features: "Shofer Personal, Interior Lëkure me Dorë, Pije Freskuese & Wi-Fi, Sistem Audio Premium",
    priceText: "Me Rezervim / Ditë",
    pricePerDay: 1200,
    isFeatured: true,
    isVisible: true,
    orderIndex: 2,
  },
  {
    name: "Mercedes-Maybach V-Class VIP Lounge",
    category: "MAYBACH_VAN",
    title: "Mercedes-Maybach V-Class VIP Van",
    description: "Furgon Maybach me sallon privat luksoz, ndarje private nga shoferi, TV Smart 4K, sedilje Maybach me masazh dhe ngrohje/ftohje, ambient zyre biznesi në lëvizje.",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=85",
    features: "Sallon Privat VIP, TV Smart 4K & Wi-Fi, Sedilje Maybach Masazh, Minibar & Tavolinë Pune",
    priceText: "Me Rezervim / Ditë",
    pricePerDay: 800,
    isFeatured: true,
    isVisible: true,
    orderIndex: 3,
  },
  {
    name: "Mercedes-Benz S-Class S580",
    category: "LIMOUSINE",
    title: "Mercedes-Benz S-Class Limousine",
    description: "Limuzina më e kërkuar ekzekutive në botë. Perfekt për transferta VIP në Aeroportin e Rinasit (TIA), eskortë biznesi dhe ceremoni dasme.",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=85",
    features: "Paketë Shoferi Ekzekutiv, Sedilje Recline, Minibar, Transfertë Aeroporti TIA",
    priceText: "Me Rezervim / Ditë",
    pricePerDay: 600,
    isFeatured: true,
    isVisible: true,
    orderIndex: 4,
  },
  {
    name: "Cadillac Escalade ESV Presidential",
    category: "LUXURY_SUV",
    title: "Cadillac Escalade ESV Presidential",
    description: "SUV presidencial me prani imponuese, hapësirë mbretërore për 6 persona dhe bagazhe, xhama të errësuar dhe siguri të nivelit më të lartë.",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=85",
    features: "Eskortë & Siguri VIP, Hapësirë për 6 Pasagjerë, Interior Lëkure Platinum, Shofer Ekspert",
    priceText: "Me Rezervim / Ditë",
    pricePerDay: 750,
    isFeatured: false,
    isVisible: true,
    orderIndex: 5,
  },
  {
    name: "Lincoln Stretch Limousine",
    category: "LIMOUSINE",
    title: "Lincoln Stretch Limousine Super-VIP",
    description: "Limuzinë e gjatë klasike e përsosur për hyrje madhështore në dasma, festa private, ditëlindje dhe netë gala.",
    imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&q=85",
    features: "Kapacitet deri në 10 Persona, Minibar & Drita Atmosferike, Ndarje me Xham Privat, Sistem Ndriçimi Show",
    priceText: "Me Rezervim / Ditë",
    pricePerDay: 900,
    isFeatured: false,
    isVisible: true,
    orderIndex: 6,
  },
];

async function run() {
  // Upsert settings
  for (const s of luxurySettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // Clear & insert luxury vehicles
  await prisma.luxuryVehicle.deleteMany({});
  for (const v of luxuryFleet) {
    await prisma.luxuryVehicle.create({
      data: v,
    });
    console.log(`✓ Seeded luxury vehicle: ${v.title}`);
  }

  console.log("✅ Luxury Services settings and fleet successfully seeded!");
  await prisma.$disconnect();
}

run().catch(console.error);
