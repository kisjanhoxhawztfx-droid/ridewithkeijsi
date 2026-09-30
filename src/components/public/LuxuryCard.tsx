"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Phone, CheckCircle2, Star, Play, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { WhatsAppIcon, CrownIcon } from "@/components/ui/Icons";

export interface LuxuryVehicleData {
  id: string;
  name: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string | null;
  pricePerDay?: number | null;
  priceText?: string | null;
  features?: string | null;
  isFeatured: boolean;
}

interface LuxuryCardProps {
  vehicle: LuxuryVehicleData;
  contactPhone?: string;
  contactWhatsapp?: string;
}

export default function LuxuryCard({
  vehicle,
  contactPhone = "+355697738559",
  contactWhatsapp = "+355697738559",
}: LuxuryCardProps) {
  const cleanWhatsapp = contactWhatsapp.replace(/[^0-9]/g, "");
  const featuresList = vehicle.features
    ? vehicle.features.split(",").map((f) => f.trim()).filter(Boolean)
    : ["Shofer Personal VIP", "Interior Lëkure", "Wi-Fi 5G & Minibar", "Siguri & Konfidencialitet"];

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "ROLLS_ROYCE": return "ROLLS-ROYCE";
      case "BENTLEY": return "BENTLEY";
      case "MAYBACH_VAN": return "MAYBACH VIP VAN";
      case "LIMOUSINE": return "LIMUZINË VIP";
      case "LUXURY_SUV": return "SUV PRESIDENCIAL";
      default: return "LUKSOZE";
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Përshëndetje Luxury Services, dëshiroj të kërkoj informacion dhe rezervim për: ${vehicle.title}`
  );

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || !videoRef.current.duration) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-gradient-to-b from-[#0e131d] via-[#090d15] to-[#05070a] shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:border-[#ffd700]/70 hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-between">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#ffd700]/20 transition-all duration-500" />

      <div>
        {/* Media Frame: video if available, else photo */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
          {vehicle.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={vehicle.videoUrl}
                poster={vehicle.imageUrl}
                muted
                playsInline
                loop
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
                className="w-full h-full object-cover"
                onClick={handlePlayPause}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e131d] via-transparent to-black/40 pointer-events-none" />

              {/* Play button overlay (shows when paused) */}
              {!playing && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center z-10 group/play"
                  aria-label="Play video"
                >
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm border border-[#ffd700]/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] group-hover/play:bg-[#ffd700]/20 transition-all">
                    <Play className="w-6 h-6 text-[#ffd700] fill-[#ffd700] ml-0.5" />
                  </div>
                </button>
              )}

              {/* Controls: mute + fullscreen (top right) */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <button
                  onClick={handleMute}
                  className="p-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ffd700]/20 hover:border-[#ffd700]/40 transition-all"
                  aria-label={muted ? "Aktivizo zërin" : "Hesho zërin"}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleFullscreen}
                  className="p-1.5 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 text-white hover:bg-[#ffd700]/20 hover:border-[#ffd700]/40 transition-all"
                  aria-label="Ekran i plotë"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Blue scrubber bar (bottom) */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 cursor-pointer z-20 hover:h-1.5 transition-all"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-blue-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Image
                src={vehicle.imageUrl}
                alt={vehicle.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e131d] via-transparent to-black/40" />
            </>
          )}

          {/* Category Gold Crown Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#ffd700]/50 text-[10px] sm:text-xs font-black text-[#ffd700] tracking-wider uppercase font-['Outfit'] shadow-lg">
              <CrownIcon className="w-3 h-3 text-[#ffd700]" />
              <span>{getCategoryBadge(vehicle.category)}</span>
            </span>
          </div>

          {/* Featured Badge */}
          {vehicle.isFeatured && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                <Star className="w-3 h-3 fill-black text-black" />
                VIP TOP
              </span>
            </div>
          )}

          {/* Bottom Price Tag */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/15 text-xs font-extrabold text-[#ffd700]">
              {vehicle.priceText || (vehicle.pricePerDay ? `Nga €${vehicle.pricePerDay}/ditë` : "Me Rezervim")}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white font-['Outfit'] group-hover:text-[#ffd700] transition-colors leading-snug">
              {vehicle.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            {featuresList.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 sm:p-6 pt-0 grid grid-cols-2 gap-2.5">
        <a
          href={`tel:${contactPhone}`}
          className="btn-primary !from-[#ffd700] !to-[#b8860b] hover:!from-[#ffe033] hover:!to-[#d4af37] !text-black font-extrabold text-xs !py-2.5 !px-3 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,215,0,0.3)] min-h-[40px]"
        >
          <Phone className="w-3.5 h-3.5 fill-black" />
          <span>Telefono</span>
        </a>

        <a
          href={`https://wa.me/${cleanWhatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !from-green-600 !to-emerald-700 hover:!from-green-500 hover:!to-emerald-600 text-white font-bold text-xs !py-2.5 !px-3 flex items-center justify-center gap-1.5 shadow-md min-h-[40px]"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
