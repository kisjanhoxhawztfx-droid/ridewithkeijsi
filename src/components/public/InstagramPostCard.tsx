"use client";

import Image from "next/image";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import {
  CheckCircle2,
  ShoppingBag,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Calendar,
  Gauge,
  Zap,
  Phone,
  FileText,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { parseMotorcycleCaption } from "@/lib/motorcycleParser";

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
  postedAt: Date | string;
}

interface InstagramPostCardProps {
  post: InstagramPost;
  variant?: "motorra" | "foryou";
}

export default function InstagramPostCard({
  post,
  variant = "motorra",
}: InstagramPostCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPlayAnim, setShowPlayAnim] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSold = post.status === "SOLD";
  const rawImageUrl = post.thumbnailUrl || post.mediaUrl;
  const imageUrl = rawImageUrl?.startsWith("http")
    ? `/api/instagram-image?id=${post.id}`
    : rawImageUrl;

  const isMotorra = variant === "motorra";
  const isVideo = post.mediaType === "VIDEO";
  const videoSrc = post.mediaUrl;

  // Intelligent caption parsing for marketplace
  const specs = parseMotorcycleCaption(post.caption);

  // Toggle Video Play / Pause
  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!videoRef.current || !videoSrc || isSold) return;

      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setShowPlayAnim(true);
            setTimeout(() => setShowPlayAnim(false), 500);
          })
          .catch((err) => {
            console.error("Autoplay error:", err);
            // Fallback: mute and try
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true));
            }
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayAnim(true);
        setTimeout(() => setShowPlayAnim(false), 500);
      }
    },
    [videoSrc, isSold]
  );

  // Toggle Mute
  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  }, []);

  // Handle Video Time Update
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Border styling
  const borderClass = isSold
    ? "border-gray-700/50 opacity-75"
    : "border-white/10 hover:border-[#00b2fe]/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,178,254,0.25)]";

  return (
    <>
      <div
        className={`relative flex flex-col h-full rounded-2xl sm:rounded-3xl overflow-hidden border bg-[#0a0f18] transition-all duration-300 group ${borderClass}`}
      >
        {/* ========================================================= */}
        {/* 1. MEDIA: TALL VERTICAL REELS FORMAT (9:13.5 / 9:14)      */}
        {/* ========================================================= */}
        <div
          ref={containerRef}
          onClick={isVideo && !isSold ? togglePlay : () => window.open(post.permalink, "_blank")}
          className={`relative overflow-hidden bg-black cursor-pointer select-none ${
            isMotorra ? "aspect-[9/13.5]" : "aspect-[4/3]"
          }`}
        >
          {isVideo && videoSrc ? (
            <div className="w-full h-full relative">
              <video
                ref={videoRef}
                src={videoSrc}
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover pointer-events-none"
                onError={() => {
                  setImgError(true);
                }}
              />

              {/* Central Play/Pause Watermark */}
              {(!isPlaying || showPlayAnim) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/65 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#00b2fe] shadow-[0_0_25px_rgba(0,178,254,0.4)] transition-transform duration-200 group-hover:scale-110">
                    {isPlaying ? (
                      <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white" />
                    ) : (
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 text-white" />
                    )}
                  </div>
                </div>
              )}

              {/* Video Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
                <div
                  className="h-full bg-[#00b2fe] transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Top Controls: Sound & Fullscreen */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 active:scale-90 transition-all shadow-md"
                  title={isMuted ? "Aktivizo zërin" : "Hiq zërin"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#00b2fe]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 active:scale-90 transition-all shadow-md hidden sm:flex"
                  title="Ekran i plotë"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-gray-200" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              {imageUrl && !imgError ? (
                <Image
                  src={imageUrl}
                  alt={specs.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    isSold ? "grayscale" : "group-hover:scale-105"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#0d1320] to-[#06090e]">
                  <InstagramIcon className="w-10 h-10 text-gray-600" />
                  <span className="text-[10px] text-gray-500">Shiko në Instagram</span>
                </div>
              )}
            </div>
          )}

          {/* Sold Overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
              <span className="px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-700 text-gray-300 text-xs font-black uppercase tracking-widest shadow-xl">
                E Shitur
              </span>
            </div>
          )}

          {/* Badge: Në Shitje */}
          {!isSold && (
            <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00b2fe] text-black text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,178,254,0.5)] font-['Outfit']">
                <ShoppingBag className="w-3 h-3 text-black stroke-[2.5]" />
                Në Shitje
              </span>
            </div>
          )}

          {/* Top Instagram badge if photo */}
          {!isVideo && (
            <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 pointer-events-none z-10">
              <InstagramIcon className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Gradient shadow overlay on bottom of media */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0f18] to-transparent pointer-events-none" />
        </div>

        {/* ========================================================= */}
        {/* 2. MARKETPLACE DETAILS (UNIFORM HEIGHT & STRUCTURE)       */}
        {/* ========================================================= */}
        <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between space-y-3 bg-[#0a0f18]">
          {/* A. Header: Title & Price */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-xs sm:text-sm font-extrabold text-white font-['Outfit'] uppercase leading-snug tracking-tight line-clamp-2 min-h-[2.5rem]"
                title={specs.title}
              >
                {specs.title}
              </h3>
            </div>

            {/* Price Tag */}
            {specs.price && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#00b2fe]/10 border border-[#00b2fe]/30">
                <span className="text-xs sm:text-sm font-black text-[#00d2ff] font-['Outfit'] tracking-wide">
                  {specs.price}
                </span>
              </div>
            )}
          </div>

          {/* B. Specs Pills Grid (Buttons / Badges) */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] font-semibold text-gray-300">
            {specs.year ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 truncate">
                <Calendar className="w-3 h-3 text-[#00b2fe] flex-shrink-0" />
                <span className="truncate">{specs.year}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-gray-500">
                <Calendar className="w-3 h-3 text-gray-600 flex-shrink-0" />
                <span>Model i ri</span>
              </div>
            )}

            {specs.mileage ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 truncate">
                <Gauge className="w-3 h-3 text-[#00b2fe] flex-shrink-0" />
                <span className="truncate">{specs.mileage}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-gray-500">
                <Gauge className="w-3 h-3 text-gray-600 flex-shrink-0" />
                <span>Kilometra origjinale</span>
              </div>
            )}

            {specs.engine ? (
              <div className="col-span-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 truncate">
                <Zap className="w-3 h-3 text-[#00b2fe] flex-shrink-0" />
                <span className="truncate">{specs.engine}</span>
              </div>
            ) : specs.extraSpecs.length > 0 ? (
              <div className="col-span-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 truncate">
                <Zap className="w-3 h-3 text-[#00b2fe] flex-shrink-0" />
                <span className="truncate">{specs.extraSpecs[0]}</span>
              </div>
            ) : null}
          </div>

          {/* C. Action Row: Description Trigger & Direct Contact */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
            {/* Show More / Details Button */}
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-300 hover:text-[#00b2fe] transition-colors py-1"
            >
              <FileText className="w-3 h-3 text-[#00b2fe]" />
              <span>Detaje &amp; Përshkrimi</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            {/* Direct Phone / WhatsApp Button */}
            {specs.rawPhone ? (
              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${specs.rawPhone}`}
                  className="p-1.5 rounded-full bg-[#00b2fe]/15 hover:bg-[#00b2fe] text-[#00b2fe] hover:text-black border border-[#00b2fe]/30 transition-all"
                  title={`Telefono ${specs.phone}`}
                >
                  <Phone className="w-3 h-3" />
                </a>
                <a
                  href={`https://wa.me/${specs.rawPhone.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/30 transition-all"
                  title={`WhatsApp ${specs.phone}`}
                >
                  <WhatsAppIcon className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all"
                title="Shiko në Instagram"
              >
                <InstagramIcon className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DETAILS MODAL (PREVENTS GRID MISALIGNMENT)             */}
      {/* ========================================================= */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0c121e] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.2)] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#080d17]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
                <span className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider">
                  Detajet e Motorrit • @ridewithkeijsi
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Title & Price Header */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-xl font-extrabold text-white font-['Outfit'] leading-tight">
                  {specs.title}
                </h2>
                {specs.price && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00b2fe]/15 border border-[#00b2fe]/40">
                    <span className="text-sm sm:text-base font-black text-[#00d2ff] font-['Outfit']">
                      Çmimi: {specs.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {specs.year && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Calendar className="w-4 h-4 text-[#00b2fe]" />
                    <div>
                      <div className="text-[10px] text-gray-400">Viti i Prodhimit</div>
                      <div className="font-bold text-white">{specs.year}</div>
                    </div>
                  </div>
                )}

                {specs.mileage && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Gauge className="w-4 h-4 text-[#00b2fe]" />
                    <div>
                      <div className="text-[10px] text-gray-400">Kilometra / Distanca</div>
                      <div className="font-bold text-white">{specs.mileage}</div>
                    </div>
                  </div>
                )}

                {specs.engine && (
                  <div className="col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Zap className="w-4 h-4 text-[#00b2fe]" />
                    <div>
                      <div className="text-[10px] text-gray-400">Kubikazhi &amp; Fuqia</div>
                      <div className="font-bold text-white">{specs.engine}</div>
                    </div>
                  </div>
                )}

                {specs.extraSpecs.map((extra, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-gray-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00b2fe]" />
                    <span>{extra}</span>
                  </div>
                ))}
              </div>

              {/* Full Caption / Description */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Përshkrimi i plotë nga Instagram
                </h4>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 leading-relaxed whitespace-pre-line select-text max-h-48 overflow-y-auto">
                  {post.caption}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                {specs.phone && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={`tel:${specs.rawPhone}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,178,254,0.3)]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telefono Shitësin: {specs.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${specs.rawPhone?.replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}

                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold text-xs border border-white/10 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Hap postimin origjinal në Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
