"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Loader2,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
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

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function ForYouGrid({
  posts,
  title = "FOR YOU",
}: ForYouGridProps) {
  const [selectedPost, setSelectedPost] = useState<ForYouPostItem | null>(null);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  // Player Controls State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPlayIconAnimation, setShowPlayIconAnimation] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectPost = (post: ForYouPostItem) => {
    setSelectedPost(post);
    setCaptionExpanded(false);
    setVideoError(false);
    setActiveMediaUrl(post.mediaUrl);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setIsBuffering(false);
  };

  const handleClose = () => {
    setSelectedPost(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
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

  // Attempt unmuted play, fallback to muted if browser blocks autoplay
  useEffect(() => {
    if (!selectedPost || selectedPost.mediaType !== "VIDEO" || !activeMediaUrl) return;

    const v = videoRef.current;
    if (!v) return;

    v.currentTime = 0;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay with audio restricted by browser — mute and continue
          v.muted = true;
          setIsMuted(true);
          v.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
    }
  }, [selectedPost, activeMediaUrl]);

  // Reset controls timer
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2800);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      // If was muted because of autoplay restriction, unmute on user interaction
      if (isMuted && v.muted) {
        v.muted = false;
        setIsMuted(false);
      }
      v.play();
      setIsPlaying(true);
      setShowPlayIconAnimation(false);
    } else {
      v.pause();
      setIsPlaying(false);
      setShowPlayIconAnimation(true);
    }
    resetControlsTimer();
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    resetControlsTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const target = parseFloat(e.target.value);
    v.currentTime = target;
    setCurrentTime(target);
    resetControlsTimer();
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPost) return;
      if (e.key === "Escape") handleClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "m" || e.key === "M") toggleMute();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost, isMuted]);

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

              {/* Center Play Icon */}
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[390px] sm:max-w-md max-h-[94vh] bg-[#090d15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.25)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#06090e] z-30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
                <span className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider">
                  {title} • @ridewithkeijsi
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

            {/* Media Box */}
            <div
              ref={containerRef}
              onClick={togglePlay}
              onMouseMove={resetControlsTimer}
              onTouchStart={resetControlsTimer}
              className="relative aspect-[9/14] sm:aspect-[9/13] w-full bg-black overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer select-none group/video"
            >
              {selectedPost.mediaType === "VIDEO" ? (
                !videoError && activeMediaUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      key={activeMediaUrl}
                      src={activeMediaUrl}
                      playsInline
                      loop
                      className="w-full h-full object-contain pointer-events-none"
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setCurrentTime(videoRef.current.currentTime);
                        }
                      }}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          setDuration(videoRef.current.duration);
                        }
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

                    {/* Central Play/Pause Watermark / Big Icon */}
                    {(!isPlaying || showPlayIconAnimation) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-[#00b2fe] shadow-[0_0_30px_rgba(0,178,254,0.4)] animate-in zoom-in-90 duration-150">
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Top-Right Mute & Fullscreen Controls */}
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

                    {/* Unmute Prompt Pill if Autoplay was muted by browser */}
                    {isMuted && isPlaying && (
                      <div
                        onClick={toggleMute}
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#00b2fe]/40 text-[11px] font-bold text-[#00b2fe] z-20 animate-pulse cursor-pointer shadow-lg"
                      >
                        <VolumeX className="w-3.5 h-3.5 text-red-400" />
                        <span>Prek për zë</span>
                      </div>
                    )}

                    {/* Bottom Floating Scrubber & Info Overlay */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-20 transition-opacity duration-300 ${
                        showControls || !isPlaying ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Scrub input slider */}
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-300 font-mono font-bold mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00b2fe]"
                        />
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Fallback Instagram Embed if Direct stream cannot be loaded */
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
            <div className="p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 bg-[#080d16] flex-1 overflow-y-auto">
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
              <div className="pt-1 flex items-center gap-2">
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
                  onClick={handleClose}
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
