"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export interface TaxiPostData {
  id: string;
  instagramMediaId?: string | null;
  permalink: string;
  mediaType: string;
  thumbnailUrl: string;
  images?: string | null; // JSON array of image URLs
  caption: string;
  isFeatured?: boolean;
  publishedAt: Date | string;
}

interface TaxiPostCardProps {
  post: TaxiPostData;
}

export default function TaxiPostCard({ post }: TaxiPostCardProps) {
  // Parse images array — fall back to just thumbnailUrl
  const allImages: string[] = (() => {
    try {
      const parsed = post.images ? JSON.parse(post.images) : null;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return [post.thumbnailUrl];
  })();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = () => setCurrentIndex((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setCurrentIndex((i) => (i + 1) % allImages.length);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      next(); // Swiped left
    } else if (diff < -40) {
      prev(); // Swiped right
    }
    setTouchStart(null);
  };

  const publishedDate = new Date(post.publishedAt).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const instagramHref =
    post.permalink === "#"
      ? "https://www.instagram.com/taxi_keijsi/"
      : post.permalink;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group relative rounded-2xl overflow-hidden bg-black border border-amber-400/20 hover:border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)] transition-all duration-300 aspect-[4/3] flex flex-col justify-between"
    >
      {/* 1. Full-Bleed Photo Slides */}
      {allImages.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-400 ${
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Image
            src={src}
            alt={post.caption || "Taxi Keijsi Post"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      ))}

      {/* Top Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/75 to-transparent z-20 pointer-events-none" />

      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 pointer-events-none" />

      {/* 2. Top Badges Overlay */}
      <div className="relative z-30 p-2.5 sm:p-3 flex items-center justify-between pointer-events-none">
        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] tracking-wider uppercase backdrop-blur-md shadow-md font-['Outfit'] pointer-events-auto">
          🚖 @taxi_keijsi
        </span>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {allImages.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-bold text-[9px]">
              {currentIndex + 1}/{allImages.length}
            </span>
          )}
          <div className="p-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/30 text-amber-400 shadow-md">
            <InstagramIcon className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Arrows (Visible when multiple images) */}
      {allImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-amber-400 hover:text-black text-white rounded-full p-1.5 transition-all shadow-md backdrop-blur-sm"
            aria-label="Foto e mëparshme"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-amber-400 hover:text-black text-white rounded-full p-1.5 transition-all shadow-md backdrop-blur-sm"
            aria-label="Foto tjetër"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* 4. Bottom Overlay Content (Date, Dots, Caption & Instagram Button) */}
      <div className="relative z-30 p-2.5 sm:p-3 mt-auto space-y-1.5">
        {/* Date & Dots Row */}
        <div className="flex items-center justify-between text-[10px] text-gray-300">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{publishedDate}</span>
          </div>

          {allImages.length > 1 && (
            <div className="flex items-center gap-1">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`rounded-full transition-all ${
                    idx === currentIndex
                      ? "w-3 h-1 bg-amber-400"
                      : "w-1 h-1 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Foto ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Optional Caption */}
        {post.caption && (
          <p className="text-[10px] sm:text-[11px] text-gray-200 line-clamp-1 leading-tight drop-shadow">
            {post.caption}
          </p>
        )}

        {/* Inset Instagram Button (inside the photo at the bottom) */}
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-black/75 hover:bg-amber-400 hover:text-black text-amber-400 text-[11px] font-bold border border-amber-400/35 backdrop-blur-md shadow-lg transition-all group/btn"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-current flex-shrink-0" />
          <span>Shiko në Instagram</span>
          <ExternalLink className="w-3 h-3 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
