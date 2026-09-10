"use client";

import Image from "next/image";
import { InstagramIcon } from "@/components/ui/Icons";
import { CheckCircle2, ChevronDown, ChevronUp, ShoppingBag, Play } from "lucide-react";
import { useState } from "react";

interface InstagramPost {
  id: string;
  instagramId: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string;
  permalink: string;
  mediaType: string;
  category: string;
  status: string;
  postedAt: Date;
}

interface InstagramPostCardProps {
  post: InstagramPost;
  variant?: "motorra" | "foryou";
}

export default function InstagramPostCard({ post, variant = "motorra" }: InstagramPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isSold = post.status === "SOLD";
  const imageUrl = post.thumbnailUrl || post.mediaUrl;
  const isMotorra = variant === "motorra";
  const isVideo = post.mediaType === "VIDEO";
  const videoSrc = post.mediaUrl;

  const borderClass = isSold
    ? "border-gray-600/40"
    : "border-[#00b2fe]/30 hover:border-[#00b2fe]/70";

  const shortCaption = post.caption.length > 100 ? post.caption.slice(0, 100) + "..." : post.caption;
  const needsExpand = post.caption.length > 100;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border bg-[#0a0d14] transition-all duration-300 group ${borderClass} ${
        isSold ? "opacity-70" : "hover:shadow-xl hover:shadow-[#00b2fe]/15"
      }`}
    >
      {/* Media: Video Player or Clickable Thumbnail (For You is 4/3 or 16/10 aspect for cleaner compact look) */}
      <div className={`relative overflow-hidden bg-[#060810] ${!isMotorra ? "aspect-[4/3]" : "aspect-square"}`}>
        {isPlaying && videoSrc ? (
          <div className="w-full h-full relative">
            <video
              src={videoSrc}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onError={() => {
                // If direct CDN video URL expires, open permalink directly
                window.open(post.permalink, "_blank");
                setIsPlaying(false);
              }}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (isVideo && videoSrc && !isSold) {
                setIsPlaying(true);
              } else {
                window.open(post.permalink, "_blank");
              }
            }}
            className="w-full h-full relative cursor-pointer group/media"
          >
            {imageUrl && !imgError ? (
              <Image
                src={imageUrl}
                alt={post.caption.slice(0, 60)}
                fill
                className={`object-cover transition-transform duration-500 ${isSold ? "grayscale" : "group-hover/media:scale-105"}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <InstagramIcon className="w-12 h-12 text-gray-600" />
                <span className="text-[10px] text-gray-500">Shiko në Instagram</span>
              </div>
            )}

            {/* Sold Overlay */}
            {isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-gray-800 border border-gray-600 text-gray-300 text-xs font-black uppercase tracking-widest">
                  E Shitur
                </span>
              </div>
            )}

            {/* Category Badge */}
            {!isSold && (
              <div className="absolute top-3 left-3 pointer-events-none">
                {isMotorra ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00b2fe] text-black text-[10px] font-black uppercase tracking-wide backdrop-blur-sm shadow-md font-['Outfit']">
                    <ShoppingBag className="w-3 h-3 text-black" />
                    Në Shitje
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00b2fe] text-black text-[10px] font-black uppercase tracking-wide backdrop-blur-sm shadow-md font-['Outfit']">
                    For You
                  </span>
                )}
              </div>
            )}

            {/* Instagram icon top-right */}
            <div className="absolute top-3 right-3 opacity-80 pointer-events-none">
              <InstagramIcon className="w-5 h-5 text-white drop-shadow-lg" />
            </div>

            {/* Play button overlay for videos */}
            {isVideo && !isSold && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover/media:scale-115 group-hover/media:bg-[#00b2fe] group-hover/media:border-[#00b2fe] transition-all duration-300 shadow-xl">
                  <Play className="w-6 h-6 text-white ml-0.5 fill-white" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`space-y-2.5 ${!isMotorra ? "p-3.5 sm:p-4" : "p-4"}`}>
        {/* Caption */}
        <div>
          <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed whitespace-pre-line">
            {expanded ? post.caption : shortCaption}
          </p>
          {needsExpand && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-[9px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Mbylle
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> Shiko më shumë
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="flex items-center gap-1 text-[10px] text-gray-500">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            @ridewithkeijsi
          </span>

          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
              isSold
                ? "bg-gray-800 text-gray-400 cursor-default pointer-events-none"
                : "bg-[#00b2fe]/15 hover:bg-[#00b2fe] text-[#00b2fe] hover:text-black border border-[#00b2fe]/30 font-extrabold"
            }`}
          >
            <InstagramIcon className="w-3 h-3" />
            {isSold ? "E Shitur" : "Shiko"}
          </a>
        </div>
      </div>
    </div>
  );
}
