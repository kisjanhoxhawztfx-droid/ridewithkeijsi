import Image from "next/image";
import { Calendar, Gauge, Tag, ExternalLink } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export interface MotorcycleData {
  id: string;
  instagramMediaId?: string | null;
  permalink: string;
  mediaType: string;
  thumbnailUrl: string;
  caption: string;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  price?: number | null;
  currency?: string | null;
  engine?: string | null;
  status?: string | null;
  isFeatured?: boolean;
  publishedAt: Date | string;
}

interface MotorraCardProps {
  motorcycle: MotorcycleData;
}

export default function MotorraCard({ motorcycle }: MotorraCardProps) {
  const publishedDate = new Date(motorcycle.publishedAt).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedPrice = motorcycle.price
    ? `${motorcycle.price.toLocaleString()} ${motorcycle.currency || "€"}`
    : "Me Marrëveshje";

  const displayTitle = motorcycle.brand && motorcycle.model
    ? `${motorcycle.brand} ${motorcycle.model}`
    : motorcycle.brand
    ? `${motorcycle.brand}`
    : "Motorr në Shitje";

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e1420] via-[#090d15] to-[#040609] hover:border-[#00b2fe]/60 hover:shadow-[0_15px_40px_rgba(0,178,254,0.2)] transition-all duration-300 flex flex-col justify-between">
      {/* Media Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        <Image
          src={motorcycle.thumbnailUrl}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1420] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {motorcycle.status === "SOLD" ? (
            <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white font-black text-[10px] tracking-wider uppercase backdrop-blur-md shadow-md">
              E SHITUR
            </span>
          ) : motorcycle.status === "RESERVED" ? (
            <span className="px-2.5 py-1 rounded-full bg-yellow-500/90 text-black font-black text-[10px] tracking-wider uppercase backdrop-blur-md shadow-md">
              E REZERVUAR
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[#00b2fe] text-black font-black text-[10px] tracking-wider uppercase backdrop-blur-md shadow-md font-['Outfit']">
              NË SHITJE
            </span>
          )}

          <div className="p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[#00b2fe] shadow-md">
            <InstagramIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bottom Price Highlight on Image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-[#00b2fe]/40 text-[#00b2fe] font-black text-xs sm:text-sm font-['Outfit'] shadow-md">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-3">
          {/* Specs Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {motorcycle.brand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-gray-300">
                <Tag className="w-3 h-3 text-[#00b2fe]" />
                {motorcycle.brand}
              </span>
            )}
            {motorcycle.year && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-gray-300">
                <Calendar className="w-3 h-3 text-[#00b2fe]" />
                {motorcycle.year}
              </span>
            )}
            {motorcycle.engine && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-gray-300">
                <Gauge className="w-3 h-3 text-[#00b2fe]" />
                {motorcycle.engine}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#00b2fe] transition-colors leading-snug font-['Outfit'] line-clamp-1">
            {displayTitle}
          </h3>

          {/* Caption */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {motorcycle.caption}
          </p>

          <div className="text-[11px] text-gray-500">
            Postuar: {publishedDate}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2 border-t border-white/10 mt-auto">
          <a
            href={motorcycle.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00b2fe] to-[#0077b6] hover:from-[#00c8ff] hover:to-[#0099e6] text-black text-xs font-black shadow-lg shadow-[#00b2fe]/25 transition-all min-h-[42px] group/btn"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-black" />
            <span>Shiko në Instagram</span>
            <ExternalLink className="w-3 h-3 text-black opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
