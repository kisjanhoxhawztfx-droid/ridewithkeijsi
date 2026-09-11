"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, ExternalLink, ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export interface ForYouPostItem {
  id: string;
  instagramId: string;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string;
  permalink: string;
  mediaType: string;
  category: string;
  status: string;
  postedAt: Date | string;
}

interface ForYouGridProps {
  posts: ForYouPostItem[];
  title?: string;
  viewAllLink?: string;
}

export default function ForYouGrid({ posts, title = "FOR YOU", viewAllLink = "/episodes?tab=foryou" }: ForYouGridProps) {
  const [selectedPost, setSelectedPost] = useState<ForYouPostItem | null>(null);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const handleSelectPost = (post: ForYouPostItem) => {
    setSelectedPost(post);
    setCaptionExpanded(false);
    setVideoError(false);
    setActiveMediaUrl(post.mediaUrl);
  };

  const handleVideoError = async () => {
    if (!selectedPost || isLoadingVideo) return;
    setIsLoadingVideo(true);
    try {
      const res = await fetch(`/api/foryou/refresh-video?id=${selectedPost.id}`);
      const data = await res.json();
      if (data.success && data.mediaUrl) {
        setActiveMediaUrl(data.mediaUrl);
        setVideoError(false);
        setIsLoadingVideo(false);
        return;
      }
    } catch {
      // ignore
    }
    setVideoError(true);
    setIsLoadingVideo(false);
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Compact Grid: 3 columns on mobile (fits 6-9 neatly), 6 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3.5">
        {posts.map((post) => {
          const thumb = post.thumbnailUrl || post.mediaUrl;
          return (
            <div
              key={post.id}
              onClick={() => handleSelectPost(post)}
              className="group relative aspect-[9/13] rounded-xl overflow-hidden bg-[#0a0f18] border border-white/10 hover:border-[#00b2fe] cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(0,178,254,0.35)] transition-all duration-300 active:scale-95"
            >
              {thumb ? (
                <Image
                  src={thumb}
                  alt={post.caption?.slice(0, 40) || "For You"}
                  fill
                  sizes="(max-width: 640px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <InstagramIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}

              {/* Dark subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/70 transition-colors" />

              {/* Top Instagram badge */}
              <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 pointer-events-none">
                <InstagramIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>

              {/* Center Play Icon on Hover / Idle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/30 group-hover:bg-[#00b2fe] group-hover:border-[#00b2fe] flex items-center justify-center text-white group-hover:text-black transition-all shadow-lg group-hover:scale-110">
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Caption Sneak */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 pointer-events-none">
                <p className="text-[9px] sm:text-[10px] text-gray-200 line-clamp-1 font-medium leading-tight drop-shadow-md">
                  {post.caption || "#episod"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Modal Viewer When Clicked */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md max-h-[92vh] bg-[#090d15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.25)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#06090e]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
                <span className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider">
                  {title} • @ridewithkeijsi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                aria-label="Mbyll"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Media Player, Instagram Embed, or Large Photo */}
            <div className="relative aspect-[9/14] sm:aspect-square w-full bg-black overflow-hidden flex-shrink-0 flex items-center justify-center">
              {selectedPost.mediaType === "VIDEO" ? (
                !videoError && activeMediaUrl ? (
                  <video
                    key={activeMediaUrl}
                    src={activeMediaUrl}
                    controls
                    autoPlay
                    playsInline
                    onError={handleVideoError}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <iframe
                      src={`${selectedPost.permalink.replace(/\/$/, "")}/embed/`}
                      className="w-full h-full border-0"
                      scrolling="no"
                      allowTransparency
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />
                  </div>
                )
              ) : selectedPost.thumbnailUrl || selectedPost.mediaUrl ? (
                <Image
                  src={selectedPost.thumbnailUrl || selectedPost.mediaUrl || ""}
                  alt={selectedPost.caption || "For You"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : null}
            </div>

            {/* Caption & Actions Drawer */}
            <div className="p-4 space-y-3 bg-[#080d16] flex-1 overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-green-400 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Postim Zyrtar
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(selectedPost.postedAt).toLocaleDateString("sq-AL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className={`text-xs text-gray-200 leading-relaxed ${captionExpanded ? "" : "line-clamp-2"}`}>
                {selectedPost.caption}
              </p>

              {selectedPost.caption && selectedPost.caption.length > 80 && (
                <button
                  type="button"
                  onClick={() => setCaptionExpanded(!captionExpanded)}
                  className="text-[10px] text-[#00b2fe] hover:underline flex items-center gap-1 font-bold"
                >
                  {captionExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" /> Zvogëlo
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" /> Lexo të plotë
                    </>
                  )}
                </button>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00b2fe] to-[#0077b6] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-black" />
                  <span>Hap në Instagram</span>
                  <ExternalLink className="w-3 h-3 text-black opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs active:scale-95 transition-all"
                >
                  Mbyll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
