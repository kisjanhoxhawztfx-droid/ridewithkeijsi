"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Play, Pause, ExternalLink, Sparkles } from "lucide-react";

export interface AdvertisementData {
  id: string;
  businessName: string;
  title: string;
  description?: string | null;
  mediaUrl: string;
  mediaType: string; // VIDEO or IMAGE
  destinationUrl: string;
  position: string;
  ctaText: string;
  status: string;
}

interface AdBannerProps {
  ads: AdvertisementData[];
  position?: string;
  className?: string;
}

export default function AdBanner({ ads = [], position, className = "" }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const impressionTracked = useRef<Set<string>>(new Set());

  const activeAds = ads.filter((ad) => !position || ad.position === position);
  const currentAd = activeAds[currentAdIndex];

  // Track impression once per ad per session
  useEffect(() => {
    if (currentAd && !impressionTracked.current.has(currentAd.id)) {
      impressionTracked.current.add(currentAd.id);
      fetch("/api/ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: currentAd.id, event: "impression" }),
      }).catch(() => {});
    }
  }, [currentAd]);

  // Rotate ads every 12 seconds if multiple ads exist
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % activeAds.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [activeAds.length]);

  if (!currentAd) {
    return null;
  }

  const handleCtaClick = () => {
    fetch("/api/ads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: currentAd.id, event: "click" }),
    }).catch(() => {});
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className={`ad-slot-frame relative overflow-hidden group ${className}`}>
      {/* Top Sponsor Badge */}
      <div className="absolute top-2.5 sm:top-3 left-3 sm:left-4 z-20 flex items-center gap-2 pointer-events-none">
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-black/80 backdrop-blur-md border border-[#00b2fe]/40 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#00b2fe] flex items-center gap-1 shadow-lg">
          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00d2ff]" />
          PARTNER ZYRTAR
        </span>
      </div>

      {/* Main Media (Video or Image) with Mobile Responsive Aspect */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[28/9] min-h-[190px] sm:min-h-[220px] max-h-[360px] bg-black">
        {currentAd.mediaType === "VIDEO" ? (
          <video
            ref={videoRef}
            src={currentAd.mediaUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
          />
        ) : (
          <Image
            src={currentAd.mediaUrl}
            alt={currentAd.title}
            fill
            sizes="100vw"
            className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
          />
        )}

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 sm:via-black/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Video Controls if video */}
        {currentAd.mediaType === "VIDEO" && (
          <div className="absolute top-2.5 sm:top-3 right-3 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all"
              title={isPlaying ? "Pusho" : "Luaj"}
              aria-label="Play / Pause video"
            >
              {isPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all"
              title={isMuted ? "Aktivizo Zërin" : "Çaktivizo Zërin"}
              aria-label="Mute / Unmute video"
            >
              {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00b2fe]" />}
            </button>
          </div>
        )}

        {/* Content Details & CTA */}
        <div className="absolute inset-y-0 left-0 z-20 p-4 sm:p-8 flex flex-col justify-center max-w-xl pr-12 sm:pr-8">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00b2fe] mb-0.5 sm:mb-1 font-['Outfit']">
            {currentAd.businessName}
          </span>
          <h3 className="text-sm sm:text-2xl font-extrabold text-white leading-tight font-['Outfit'] mb-1.5 sm:mb-2 line-clamp-2">
            {currentAd.title}
          </h3>
          {currentAd.description && (
            <p className="text-xs sm:text-sm text-gray-300 line-clamp-1 sm:line-clamp-2 mb-3 sm:mb-4 leading-relaxed max-w-md hidden xs:block">
              {currentAd.description}
            </p>
          )}

          <div>
            <a
              href={currentAd.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
              className="btn-primary text-[11px] sm:text-xs !py-1.5 sm:!py-2.5 !px-3.5 sm:!px-5 inline-flex shadow-[0_0_20px_rgba(0,178,254,0.4)] font-extrabold"
            >
              <span>{currentAd.ctaText || "Eksploro"}</span>
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>

        {/* Multi-Ad Pagination Dots */}
        {activeAds.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-4 z-20 flex items-center gap-1">
            {activeAds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentAdIndex(idx)}
                aria-label={`Shko te reklama ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentAdIndex
                    ? "w-5 sm:w-6 bg-[#00b2fe] shadow-[0_0_8px_#00b2fe]"
                    : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
