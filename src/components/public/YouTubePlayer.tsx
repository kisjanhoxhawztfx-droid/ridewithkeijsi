"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ExternalLink, Volume2 } from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  aspectRatio?: "16/9" | "4/3";
  autoPlayOnClick?: boolean;
}

export default function YouTubePlayer({
  videoId,
  title,
  thumbnailUrl,
  autoPlayOnClick = true,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const cleanVideoId = videoId.replace(/_demo\d+/, "");

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
      {!isPlaying ? (
        <div className="relative w-full h-full cursor-pointer" onClick={() => setIsPlaying(true)}>
          {/* High-res Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 group-hover:brightness-100"
            priority
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 group-hover:via-transparent transition-all duration-300" />

          {/* Dynamic Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#00b2fe]/30 animate-ping" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#00b2fe] to-[#0077b6] flex items-center justify-center text-white shadow-[0_0_30px_rgba(0,178,254,0.6)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(0,210,255,0.9)] transition-all duration-300">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Bottom Video Badge & Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#00b2fe]" />
                Kliko për të Parë
              </span>
            </div>

            <a
              href={`https://www.youtube.com/watch?v=${cleanVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto px-3 py-1 rounded-md bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-lg hover:scale-105"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}?autoplay=${autoPlayOnClick ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}
