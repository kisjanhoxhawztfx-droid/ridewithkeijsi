import db from "@/lib/db";
import MotorraMarketplace from "@/components/public/MotorraMarketplace";
import { MotorraPostItem } from "@/components/public/MotorraGrid";
import { Bike, ShoppingBag, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

function mapMotorcycle(m: any): MotorraPostItem {
  let imagesList: string[] = [];
  if (m.images) {
    try {
      imagesList = JSON.parse(m.images);
    } catch {
      imagesList = typeof m.images === "string" ? m.images.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
    }
  }
  if (imagesList.length === 0 && m.imageUrl) imagesList = [m.imageUrl];
  if (imagesList.length === 0 && m.thumbnailUrl) imagesList = [m.thumbnailUrl];

  return {
    id: m.id,
    title: m.title || m.model || "Motorr",
    brand: m.brand || "Motorr",
    model: m.model,
    year: m.year,
    price: m.price,
    currency: m.currency || "EUR",
    mileageKm: m.mileageKm,
    mileageMi: m.mileageMi,
    engine: m.engine,
    description: m.description || m.caption,
    phone: m.phone || "+355697738559",
    whatsapp: m.whatsapp || m.phone || "+355697738559",
    imageUrl: m.imageUrl || imagesList[0] || m.thumbnailUrl || "",
    images: imagesList,
    thumbnailUrl: m.thumbnailUrl || imagesList[0] || "",
    mediaUrl: m.mediaUrl,
    mediaType: m.mediaType || "IMAGE",
    status: m.status || "FOR_SALE",
    isFeatured: Boolean(m.isFeatured),
    instagramId: m.instagramMediaId,
    publishedAt: m.createdAt || m.publishedAt || new Date(),
  };
}

export default async function MotorraPage() {
  const rawMotorcycles = await db.motorcycle.findMany({
    where: { isVisible: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const allMotorcycles = rawMotorcycles.map(mapMotorcycle);
  const forSaleCount = allMotorcycles.filter((m) => m.status === "FOR_SALE").length;
  const soldCount = allMotorcycles.filter((m) => m.status === "SOLD").length;

  return (
    <div className="pt-2 sm:pt-4 pb-20 sm:pb-28 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-6 sm:space-y-8">
      {/* 1. Header Banner Hero */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#00b2fe]/30 bg-gradient-to-b from-[#0e1422] via-[#080d16] to-[#04060a] p-6 sm:p-8 lg:p-10 shadow-2xl text-center space-y-3 sm:space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00b2fe]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00b2fe]/15 border border-[#00b2fe]/30 text-[11px] font-black text-[#00d2ff] tracking-wider uppercase backdrop-blur-md">
            <Bike className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>MARKETPLACE ZYRTAR • RIDE WITH KEIJSI</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] uppercase leading-tight tracking-wide">
            MOTORRA <span className="text-[#00b2fe] drop-shadow-[0_0_20px_rgba(0,178,254,0.6)]">NË SHITJE</span>
          </h1>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#00b2fe]" />
              <strong className="text-white">{forSaleCount}</strong> Në Shitje
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-gray-500" />
              <strong className="text-white">{soldCount}</strong> Të Shitura
            </span>
          </div>
        </div>
      </section>

      {/* 2. Full Marketplace Experience (BicycleBlueBook format) */}
      <MotorraMarketplace posts={allMotorcycles} />
    </div>
  );
}
