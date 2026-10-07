"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, Gauge, Tag, ExternalLink, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export interface MotorcycleData {
  id: string;
  instagramMediaId?: string | null;
  permalink: string;
  mediaType: string;
  thumbnailUrl: string;
  imageUrl?: string | null;
  images?: string[] | string | null;
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

  // Parse all available images
  const allImages: string[] = (() => {
    if (Array.isArray(motorcycle.images) && motorcycle.images.length > 0) {
      return motorcycle.images.filter(Boolean);
    }
    if (typeof motorcycle.images === "string") {
      try {
        const parsed = JSON.parse(motorcycle.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean);
      } catch {
        const split = motorcycle.images.split(",").map((s) => s.trim()).filter(Boolean);
        if (split.length > 0) return split;
      }
    }
    if (motorcycle.thumbnailUrl) return [motorcycle.thumbnailUrl];
    if (motorcycle.imageUrl) return [motorcycle.imageUrl];
    return [];
  })();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((i) => (i - 1 + allImages.length) % allImages.length);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((i) => (i + 1) % allImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextImage();
    } else if (diff < -40) {
      prevImage();
    }
    setTouchStart(null);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e1420] via-[#090d15] to-[#040609] hover:border-[#00b2fe]/60 hover:shadow-[0_15px_40px_rgba(0,178,254,0.2)] transition-all duration-300 flex flex-col justify-between">
      {/* Media Image Container with Carousel */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-black select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {allImages.length > 0 ? (
          allImages.map((src, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-300 ${
                idx === currentIdx ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={src}
                alt={`${displayTitle} - ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                unoptimized
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-gray-500 text-xs">
            Pa Foto
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1420] via-transparent to-black/30 pointer-events-none z-10" />

        {/* Carousel Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white rounded-full p-1.5 transition-all shadow-md backdrop-blur-sm active:scale-90"
              aria-label="Foto e mëparshme"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white rounded-full p-1.5 transition-all shadow-md backdrop-blur-sm active:scale-90"
              aria-label="Foto tjetër"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  className={`rounded-full transition-all ${
                    idx === currentIdx
                      ? "w-4 h-1.5 bg-[#00b2fe]"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Shko tek foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5">
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

            {allImages.length > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold flex items-center gap-1">
                <ImageIcon className="w-2.5 h-2.5 text-[#00b2fe]" />
                <span>{currentIdx + 1}/{allImages.length}</span>
              </span>
            )}
          </div>

          <div className="p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[#00b2fe] shadow-md pointer-events-auto">
            <InstagramIcon className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Bottom Price Highlight on Image */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
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
          {motorcycle.caption && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {motorcycle.caption}
            </p>
          )}

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
