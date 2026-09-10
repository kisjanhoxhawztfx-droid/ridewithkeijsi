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
  const isSold = post.status === "SOLD";
  const imageUrl = post.thumbnailUrl || post.mediaUrl;
  const isMotorra = variant === "motorra";
  const isVideo = post.mediaType === "VIDEO";

  const accentColor = isMotorra ? "pink" : "cyan";
  const borderClass = isSold
    ? "border-gray-600/40"
    : isMotorra
    ? "border-pink-500/30 hover:border-pink-400/60"
    : "border-[#00b2fe]/30 hover:border-[#00b2fe]/60";

  const shortCaption = post.caption.length > 120 ? post.caption.slice(0, 120) + "..." : post.caption;
  const needsExpand = post.caption.length > 120;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border bg-[#0a0d14] transition-all duration-300 group ${borderClass} ${
        isSold ? "opacity-70" : "hover:shadow-xl"
      } ${isMotorra ? "hover:shadow-pink-500/10" : "hover:shadow-[#00b2fe]/10"}`}
    >
      {/* Image - clickable to Instagram */}
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-square overflow-hidden bg-[#060810] cursor-pointer"
      >
        {imageUrl && !imgError ? (
          <Image
            src={imageUrl}
            alt={post.caption.slice(0, 60)}
            fill
            className={`object-cover transition-transform duration-500 ${isSold ? "grayscale" : "group-hover:scale-105"}`}
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
          <div className="absolute top-3 left-3">
            {isMotorra ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/90 text-white text-[10px] font-black uppercase tracking-wide backdrop-blur-sm">
                <ShoppingBag className="w-3 h-3" />
                Në Shitje
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00b2fe]/90 text-white text-[10px] font-black uppercase tracking-wide backdrop-blur-sm">
                For You
              </span>
            )}
          </div>
        )}

        {/* Instagram icon top-right */}
        <div className="absolute top-3 right-3 opacity-80">
          <InstagramIcon className="w-5 h-5 text-white drop-shadow-lg" />
        </div>

        {/* Play button overlay for videos */}
        {isVideo && !isSold && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        <div>
          <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
            {expanded ? post.caption : shortCaption}
          </p>
          {needsExpand && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-[10px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
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
                : isMotorra
                ? "bg-pink-500/15 hover:bg-pink-500/30 text-pink-400 hover:text-pink-300 border border-pink-500/30"
                : "bg-[#00b2fe]/15 hover:bg-[#00b2fe]/30 text-[#00b2fe] hover:text-[#00d2ff] border border-[#00b2fe]/30"
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
