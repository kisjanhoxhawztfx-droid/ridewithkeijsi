"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Loader2,
  X,
  ExternalLink,
  ShoppingBag,
  Calendar,
  Gauge,
  Zap,
  Phone,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { parseMotorcycleCaption, ParsedMotorcycle } from "@/lib/motorcycleParser";

export interface MotorraPostItem {
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

interface MotorraGridProps {
  posts: MotorraPostItem[];
  title?: string;
}

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function MotorraGrid({
  posts,
  title = "MOTORRA NË SHITJE",
}: MotorraGridProps) {
  const [selectedPost, setSelectedPost] = useState<MotorraPostItem | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  // Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // Play with sound by default when clicked!
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPlayIconAnimation, setShowPlayIconAnimation] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse specs for selected post
  const selectedSpecs: ParsedMotorcycle = selectedPost
    ? parseMotorcycleCaption(selectedPost.caption)
    : {
        phone: null,
        rawPhone: null,
        title: "Motorr",
        year: null,
        mileage: null,
        engine: null,
        price: null,
        extraSpecs: [],
        cleanDescription: "",
        hasStructuredSpecs: false,
      };

  // Open modal and start video with sound
  const handleSelectPost = (post: MotorraPostItem) => {
    setSelectedPost(post);
    setVideoError(false);
    setIsBuffering(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
    setIsMuted(false); // Start with sound!
    setShowDescription(false);

    if (post.mediaType === "VIDEO") {
      setActiveMediaUrl(post.mediaUrl);
    } else {
      setActiveMediaUrl(null);
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedPost(null);
    setActiveMediaUrl(null);
    setIsPlaying(false);
  };

  // Attempt unmuted play whenever selectedPost / activeMediaUrl is ready
  useEffect(() => {
    if (selectedPost && activeMediaUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false; // with sound!
      setIsMuted(false);

      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Unmuted autoplay restricted by browser, playing muted:", err);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true));
          }
        });
    }
  }, [selectedPost, activeMediaUrl]);

  // Toggle Play / Pause
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowPlayIconAnimation(true);
          setTimeout(() => setShowPlayIconAnimation(false), 500);
        })
        .catch((err) => console.warn("Play error:", err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayIconAnimation(true);
      setTimeout(() => setShowPlayIconAnimation(false), 500);
    }
  };

  // Toggle Mute
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Fullscreen
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };

  // Refresh expired video stream
  const handleVideoError = async () => {
    if (!selectedPost || isLoadingVideo) return;
    setIsLoadingVideo(true);
    try {
      const match = selectedPost.permalink?.match(/\/p\/([^/]+)/);
      const code = match ? match[1] : selectedPost.instagramId;
      const res = await fetch(`/api/foryou/refresh-video?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.mediaUrl) {
        setActiveMediaUrl(data.mediaUrl);
        setVideoError(false);
        setIsLoadingVideo(false);
        return;
      }
    } catch (err) {
      console.error("Failed to refresh video:", err);
    }
    setVideoError(true);
    setIsLoadingVideo(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") toggleMute();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* 1. COMPACT GRID: 3 COLUMNS ON MOBILE (FITS 6 NEATLY),     */}
      {/*    6 ON DESKTOP — JUST LIKE THE FOR YOU GRID!             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3.5">
        {posts.map((post) => {
          const thumb = post.thumbnailUrl || post.mediaUrl;
          const parsed = parseMotorcycleCaption(post.caption);
          const isSold = post.status === "SOLD";

          return (
            <div
              key={post.id}
              onClick={() => handleSelectPost(post)}
              className="group relative aspect-[9/13.5] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0a0f18] border border-white/10 hover:border-[#00b2fe] cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(0,178,254,0.35)] transition-all duration-300 active:scale-95 flex flex-col justify-between"
            >
              {/* Thumbnail Image: ALWAYS visible on load, NEVER black! */}
              {thumb ? (
                <Image
                  src={thumb}
                  alt={parsed.title}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                    isSold ? "grayscale opacity-60" : ""
                  }`}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <InstagramIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}

              {/* Gradient overlays for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40 pointer-events-none" />

              {/* Top Row Badges: Status & Price */}
              <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 pointer-events-none z-10">
                {/* Status Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                    isSold
                      ? "bg-zinc-800/90 text-gray-400 border border-zinc-700"
                      : "bg-[#00b2fe] text-black shadow-md font-['Outfit']"
                  }`}
                >
                  {isSold ? "E Shitur" : "Në Shitje"}
                </span>

                {/* Price Tag Badge */}
                {parsed.price && (
                  <span className="px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-[#00b2fe]/40 text-[#00d2ff] text-[8px] sm:text-[9px] font-black font-['Outfit'] shadow-sm">
                    {parsed.price}
                  </span>
                )}
              </div>

              {/* Center Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/30 group-hover:bg-[#00b2fe] group-hover:border-[#00b2fe] flex items-center justify-center text-white group-hover:text-black transition-all shadow-lg group-hover:scale-110">
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Info: Title & Specs */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 pointer-events-none z-10 space-y-0.5">
                <p className="text-[9px] sm:text-[11px] text-white font-black font-['Outfit'] uppercase line-clamp-1 leading-tight drop-shadow-md">
                  {parsed.title}
                </p>
                {parsed.year && (
                  <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-gray-300 font-semibold drop-shadow-sm">
                    <span>{parsed.year}</span>
                    {parsed.mileage && <span>• {parsed.mileage}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 2. EXPANDED REELS MARKETPLACE MODAL PLAYER                */}
      {/*    OPENS ON CLICK WITH SOUND, SPECS PILLS & CONTACTS      */}
      {/* ========================================================= */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[410px] sm:max-w-md max-h-[95vh] bg-[#090d15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#06090e] z-30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
                <span className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider truncate">
                  {selectedSpecs.title}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                aria-label="Mbyll"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Media Box: 9:14 Reels aspect */}
            <div
              ref={containerRef}
              onClick={togglePlay}
              className="relative aspect-[9/13.5] w-full bg-black overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer select-none group/video"
            >
              {selectedPost.mediaType === "VIDEO" ? (
                !videoError && activeMediaUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      key={activeMediaUrl}
                      src={activeMediaUrl}
                      poster={selectedPost.thumbnailUrl || undefined}
                      playsInline
                      loop
                      muted={isMuted}
                      className="w-full h-full object-cover pointer-events-none"
                      onTimeUpdate={() => {
                        if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                      }}
                      onLoadedMetadata={() => {
                        if (videoRef.current) setDuration(videoRef.current.duration);
                      }}
                      onWaiting={() => setIsBuffering(true)}
                      onPlaying={() => {
                        setIsBuffering(false);
                        setIsPlaying(true);
                      }}
                      onPause={() => setIsPlaying(false)}
                      onError={handleVideoError}
                    />

                    {/* Buffering Spinner */}
                    {isBuffering && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-20">
                        <Loader2 className="w-10 h-10 text-[#00b2fe] animate-spin drop-shadow-md" />
                      </div>
                    )}

                    {/* Central Play/Pause Watermark */}
                    {(!isPlaying || showPlayIconAnimation) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-[#00b2fe] shadow-[0_0_30px_rgba(0,178,254,0.4)] animate-in zoom-in-90 duration-150">
                          {isPlaying ? (
                            <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white" />
                          ) : (
                            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Top Right Controls: Mute & Fullscreen */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 active:scale-90 transition-all shadow-md"
                        title={isMuted ? "Aktivizo zërin" : "Hiq zërin"}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-red-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-[#00b2fe]" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="hidden sm:flex p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 active:scale-90 transition-all shadow-md"
                        title="Ekran i plotë"
                      >
                        <Maximize2 className="w-4 h-4 text-gray-200" />
                      </button>
                    </div>

                    {/* Unmute Prompt Pill if Autoplay was restricted */}
                    {isMuted && isPlaying && (
                      <div
                        onClick={toggleMute}
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#00b2fe]/40 text-[11px] font-bold text-[#00b2fe] z-20 animate-pulse cursor-pointer shadow-lg"
                      >
                        <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        <span>Prek për zë</span>
                      </div>
                    )}

                    {/* Bottom Floating Scrubber */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 flex flex-col gap-1.5"
                    >
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#00b2fe]"
                      />
                      <div className="flex items-center justify-between text-[10px] text-gray-300 font-mono font-bold px-0.5">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-zinc-950">
                    <p className="text-xs text-gray-400">Po ngarkohet video...</p>
                    <a
                      href={selectedPost.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs py-2 px-4"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      Shiko në Instagram
                    </a>
                  </div>
                )
              ) : (
                /* Static Image */
                <div className="relative w-full h-full">
                  <Image
                    src={selectedPost.thumbnailUrl || selectedPost.mediaUrl || ""}
                    alt={selectedSpecs.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Bottom Marketplace Info Drawer */}
            <div className="p-4 bg-[#080d17] border-t border-white/10 space-y-3 overflow-y-auto max-h-[36vh]">
              {/* Title & Price Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-white font-['Outfit'] uppercase leading-snug">
                    {selectedSpecs.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        selectedPost.status === "SOLD" ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {selectedPost.status === "SOLD" ? "E Shitur" : "Në Shitje"}
                    </span>
                    <span className="text-[10px] text-gray-500">• @ridewithkeijsi</span>
                  </div>
                </div>

                {selectedSpecs.price && (
                  <div className="px-2.5 py-1 rounded-lg bg-[#00b2fe]/15 border border-[#00b2fe]/40 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-black text-[#00d2ff] font-['Outfit']">
                      {selectedSpecs.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Specs Pills (Buttons) */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold text-gray-200">
                {selectedSpecs.year && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                    <Calendar className="w-3.5 h-3.5 text-[#00b2fe]" />
                    <span>Viti: {selectedSpecs.year}</span>
                  </div>
                )}

                {selectedSpecs.mileage && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                    <Gauge className="w-3.5 h-3.5 text-[#00b2fe]" />
                    <span>{selectedSpecs.mileage}</span>
                  </div>
                )}

                {selectedSpecs.engine && (
                  <div className="col-span-2 flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                    <Zap className="w-3.5 h-3.5 text-[#00b2fe]" />
                    <span>{selectedSpecs.engine}</span>
                  </div>
                )}

                {selectedSpecs.extraSpecs.map((extra, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] text-gray-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#00b2fe]" />
                    <span>{extra}</span>
                  </div>
                ))}
              </div>

              {/* Collapsible Full Description */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full py-1 text-[11px] font-bold text-gray-400 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#00b2fe]" />
                    {showDescription ? "Fshih përshkrimin" : "Shiko përshkrimin e plotë"}
                  </span>
                  <span>{showDescription ? "▲" : "▼"}</span>
                </button>

                {showDescription && (
                  <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-[11px] text-gray-300 leading-relaxed whitespace-pre-line select-text max-h-36 overflow-y-auto">
                    {selectedPost.caption}
                  </div>
                )}
              </div>

              {/* Direct Actions: Call, WhatsApp, Instagram */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                {selectedSpecs.phone && (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${selectedSpecs.rawPhone}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,178,254,0.3)]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telefono: {selectedSpecs.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${selectedSpecs.rawPhone?.replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                )}

                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white font-semibold text-xs border border-white/10 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Hap në Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
