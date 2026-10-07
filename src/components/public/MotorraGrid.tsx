"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Bike,
  Heart,
  CheckCircle2,
  Calendar,
  Gauge,
  Zap,
  Phone,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MapPin,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { parseMotorcycleCaption } from "@/lib/motorcycleParser";

export interface MotorraPostItem {
  id: string;
  title?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  price?: number | null;
  currency?: string | null;
  mileageKm?: number | null;
  mileageMi?: number | null;
  engine?: string | null;
  description?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  imageUrl?: string | null;
  images?: string[];
  thumbnailUrl?: string | null;
  mediaUrl?: string | null;
  mediaType?: string;
  category?: string;
  caption?: string | null;
  permalink?: string | null;
  instagramId?: string | null;
  status: string;
  isFeatured?: boolean;
  postedAt?: Date | string;
  publishedAt?: Date | string;
}

interface MotorraGridProps {
  posts: MotorraPostItem[];
  title?: string;
}

function getPhotoList(post: MotorraPostItem): string[] {
  if (post.images && Array.isArray(post.images) && post.images.length > 0) {
    return post.images.filter(Boolean);
  }
  if (post.imageUrl) return [post.imageUrl];
  if (post.thumbnailUrl) return [post.thumbnailUrl];
  if (post.instagramId) return [`/api/instagram-image?id=${post.instagramId}`];
  return [];
}

/**
 * Motorcycle Card formatted like the BicycleBlueBook marketplace with dark cyber styling.
 */
function MotorraCardItem({
  post,
  onSelect,
}: {
  post: MotorraPostItem;
  onSelect: (post: MotorraPostItem) => void;
}) {
  const parsed = parseMotorcycleCaption(post.caption || "");
  const isSold = post.status === "SOLD";

  const photos = getPhotoList(post);
  const primaryThumb = photos[0] || (post.instagramId ? `/api/instagram-image?id=${post.instagramId}` : "");

  const displayTitle = post.title || post.model || parsed.title || "Motorr";
  const displayYear = post.year || parsed.year;
  const fullHeading = displayYear && !displayTitle.includes(String(displayYear))
    ? `${displayYear} ${displayTitle}`
    : displayTitle;

  const displayPrice = post.price
    ? `€${post.price.toLocaleString()}`
    : (parsed.price || "Me Rezervim");

  const specsLine = [
    (post.year || parsed.year) ? `Viti ${post.year || parsed.year}` : null,
    post.engine || parsed.engine,
    post.mileageKm ? `${post.mileageKm.toLocaleString()} km` : parsed.mileage,
    post.mileageMi ? `${post.mileageMi.toLocaleString()} mi` : null,
    isSold ? "E Shitur" : "Gjendje Perfekte",
  ].filter(Boolean).join(" • ");

  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isFav, setIsFav] = useState(false);

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((i) => (i - 1 + photos.length) % photos.length);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((i) => (i + 1) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextPhoto();
    } else if (diff < -40) {
      prevPhoto();
    }
    setTouchStart(null);
  };

  const cleanPhone = (post.phone || parsed.phone || "+355697738559").replace(/[^0-9+]/g, "");
  const cleanWa = (post.whatsapp || post.phone || parsed.phone || "+355697738559").replace(/[^0-9]/g, "");

  return (
    <div
      onClick={() => onSelect(post)}
      className="group bg-[#080d17] border border-white/10 hover:border-[#00b2fe] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,178,254,0.25)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Photo Container: 4:3 Landscape aspect ratio with carousel */}
        <div
          className="relative aspect-[4/3] bg-black overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {photos.length > 0 ? (
            photos.map((src, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  idx === currentIdx ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={src}
                  alt={`${fullHeading} - ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                    isSold ? "grayscale opacity-60" : ""
                  }`}
                  unoptimized
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#0d1422]">
              <Bike className="w-8 h-8 sm:w-10 sm:h-10 text-[#00b2fe] mb-1" />
              <p className="text-[10px] font-bold text-gray-400 line-clamp-1">{fullHeading}</p>
            </div>
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />

          {/* Carousel Arrows if multiple photos */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white rounded-full p-1 sm:p-1.5 transition-all shadow-md backdrop-blur-sm active:scale-90"
                aria-label="Foto e mëparshme"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white rounded-full p-1 sm:p-1.5 transition-all shadow-md backdrop-blur-sm active:scale-90"
                aria-label="Foto tjetër"
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {/* Dots indicator (hidden on 3-col mobile) */}
              <div className="hidden sm:flex absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 items-center gap-1">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIdx(idx);
                    }}
                    className={`rounded-full transition-all ${
                      idx === currentIdx
                        ? "w-4 h-1.5 bg-[#00b2fe]"
                        : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
                    }`}
                    aria-label={`Foto ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top Badges */}
          <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex items-center gap-1 z-20">
            <span
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
                isSold
                  ? "bg-red-500/90 text-white border border-red-400/50"
                  : "bg-[#00b2fe] text-black font-['Outfit'] font-extrabold shadow-md"
              }`}
            >
              {isSold ? "Shitur" : "Në Shitje"}
            </span>

            {photos.length > 1 && (
              <span className="px-1 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/20 text-white text-[8px] sm:text-[9px] font-bold flex items-center gap-0.5">
                <ImageIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#00b2fe]" />
                <span>{currentIdx + 1}/{photos.length}</span>
              </span>
            )}
          </div>

          {/* Top Right Heart Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFav(!isFav);
            }}
            className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/20 hover:border-[#00b2fe] flex items-center justify-center transition-all z-20 active:scale-90"
            title="Ruaj te të preferuarat"
          >
            <Heart
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                isFav ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-400"
              }`}
            />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-2 sm:p-4 space-y-1 sm:space-y-2.5">
          {/* Title */}
          <h3 className="text-xs sm:text-base font-extrabold text-white font-['Outfit'] line-clamp-1 leading-snug group-hover:text-[#00b2fe] transition-colors">
            {fullHeading}
          </h3>

          {/* Specs Subline */}
          <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-gray-400 font-medium line-clamp-1">
            {(post.year || parsed.year) && (
              <span>{post.year || parsed.year}</span>
            )}
            {(post.engine || parsed.engine) && (
              <span>• {post.engine || parsed.engine}</span>
            )}
            {(post.mileageKm || parsed.mileage) && (
              <span className="hidden sm:inline">
                • {post.mileageKm ? `${post.mileageKm.toLocaleString()} km` : parsed.mileage}
              </span>
            )}
            <span className="hidden sm:inline">
              • {isSold ? "E Shitur" : "Gjendje Perfekte"}
            </span>
          </div>

          {/* Price & Deal Rating */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            <span className="text-xs sm:text-lg font-black text-white font-['Outfit']">
              {displayPrice}
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wide font-['Outfit']">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Çmim i Shkëlqyer</span>
            </span>
          </div>

          {/* Seller Row: Ride with Keijsi • Tiranë (Hidden on mobile 3-col) */}
          <div className="hidden sm:flex items-center gap-2.5 pt-2 border-t border-white/10 text-xs">
            <div className="w-7 h-7 rounded-full bg-[#00b2fe]/20 border border-[#00b2fe]/40 text-[#00b2fe] font-black text-[10px] flex items-center justify-center flex-shrink-0">
              RK
            </div>
            <div className="leading-tight overflow-hidden">
              <span className="text-white font-bold text-[11px] block truncate">
                Ride with Keijsi
              </span>
              <span className="text-gray-400 text-[10px] flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-[#00b2fe]" />
                Tiranë, Shqipëri
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Telefono & WhatsApp */}
      <div className="p-1.5 sm:p-3 border-t border-white/10 bg-white/[0.01] grid grid-cols-2 gap-1 sm:gap-2">
        <a
          href={`tel:${cleanPhone}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-[10px] sm:text-[11px] transition-all shadow-[0_0_12px_rgba(0,178,254,0.3)] active:scale-95"
          title="Telefono"
        >
          <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
          <span className="hidden sm:inline">Telefono</span>
        </a>

        <a
          href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
            `Përshëndetje, po ju shkruaj nga ridewithkeijsi.com lidhur me motorrin: ${fullHeading} (${displayPrice})`
          )}`}
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] sm:text-[11px] transition-all shadow-md active:scale-95"
          title="WhatsApp"
        >
          <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default function MotorraGrid({ posts }: MotorraGridProps) {
  const [selectedPost, setSelectedPost] = useState<MotorraPostItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  const handleSelectPost = (post: MotorraPostItem) => {
    setSelectedPost(post);
    setActivePhotoIndex(0);
    setShowDescription(false);
  };

  const handleClose = () => {
    setSelectedPost(null);
    setActivePhotoIndex(0);
  };

  const selectedPhotos = selectedPost ? getPhotoList(selectedPost) : [];

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotos.length <= 1) return;
    setActivePhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost, selectedPhotos.length]);

  if (!posts || posts.length === 0) return null;

  // Selected specs
  const parsed = selectedPost ? parseMotorcycleCaption(selectedPost.caption || "") : null;
  const title = selectedPost?.title || selectedPost?.model || parsed?.title || "Motorr";
  const brand = selectedPost?.brand || title.split(" ")[0] || "Motorr";
  const year = selectedPost?.year || parsed?.year;
  const price = selectedPost?.price ? `€${selectedPost.price.toLocaleString()}` : (parsed?.price || "Me Rezervim");
  const mileageKm = selectedPost?.mileageKm;
  const mileageMi = selectedPost?.mileageMi || (mileageKm ? Math.round(mileageKm * 0.621371) : null);
  const engine = selectedPost?.engine || parsed?.engine;
  const phone = selectedPost?.phone || parsed?.phone || "+355697738559";
  const rawPhone = phone.replace(/[^0-9+]/g, "");
  const cleanWhatsapp = (selectedPost?.whatsapp || phone).replace(/[^0-9]/g, "");
  const description = selectedPost?.description || selectedPost?.caption || "";

  return (
    <div className="space-y-4">
      {/* Cards Grid: 3 cols on mobile, 2 on tablet, 3 or 4 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5">
        {posts.map((post) => (
          <MotorraCardItem key={post.id} post={post} onSelect={handleSelectPost} />
        ))}
      </div>

      {/* Expanded Modal with Multi-Photo Gallery Carousel */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[440px] sm:max-w-xl max-h-[95vh] bg-[#090d15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title & Close */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#06090e] z-30">
              <div className="flex items-center gap-2 max-w-[75%]">
                <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white font-['Outfit'] uppercase tracking-wider truncate">
                  {title}
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

            {/* Media Box: Multi-photo Slider */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-black overflow-hidden flex-shrink-0 flex items-center justify-center select-none group/slider">
              {selectedPhotos.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedPhotos[activePhotoIndex]}
                    alt={`${title} - Foto ${activePhotoIndex + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 600px"
                    className="object-contain"
                    unoptimized
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <Bike className="w-12 h-12 text-gray-600" />
                </div>
              )}

              {/* Prev / Next Navigation Arrows */}
              {selectedPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90 z-20"
                    aria-label="Foto e mëparshme"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90 z-20"
                    aria-label="Foto tjetër"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Photo Counter Pill */}
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
                    📸 {activePhotoIndex + 1} / {selectedPhotos.length}
                  </div>

                  {/* Bottom Thumbnails Strip */}
                  <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 z-20 px-3 overflow-x-auto">
                    {selectedPhotos.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(idx); }}
                        className={`relative w-8 h-8 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          activePhotoIndex === idx
                            ? "border-[#00b2fe] scale-110 shadow-[0_0_10px_rgba(0,178,254,0.6)]"
                            : "border-white/30 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={photoUrl} alt="" fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Marketplace Info Drawer */}
            <div className="p-4 sm:p-5 bg-[#080d17] border-t border-white/10 space-y-3.5 overflow-y-auto max-h-[44vh]">
              {/* Title & Price Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-[#00b2fe] uppercase tracking-wider">
                      {brand}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                        selectedPost.status === "SOLD"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {selectedPost.status === "SOLD" ? "E Shitur ❌" : "Në Shitje ✅"}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] uppercase leading-snug">
                    {year ? `${year} ` : ""}{title}
                  </h3>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00b2fe]/20 to-[#00d2ff]/20 border border-[#00b2fe]/50 whitespace-nowrap shadow-md">
                  <span className="text-sm sm:text-base font-black text-[#00d2ff] font-['Outfit']">
                    {price}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-200">
                {year && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Calendar className="w-4 h-4 text-[#00b2fe]" />
                    <span>Viti: <strong className="text-white font-bold">{year}</strong></span>
                  </div>
                )}

                {engine && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Zap className="w-4 h-4 text-[#00b2fe]" />
                    <span>Motori: <strong className="text-white font-bold">{engine}</strong></span>
                  </div>
                )}

                {mileageKm ? (
                  <div className="col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-[#00b2fe]" />
                      <span>Kilometra:</span>
                    </div>
                    <span className="font-bold text-white">
                      {mileageKm.toLocaleString()} km
                      {mileageMi && <span className="text-gray-400 font-normal"> ({mileageMi.toLocaleString()} milje)</span>}
                    </span>
                  </div>
                ) : parsed?.mileage ? (
                  <div className="col-span-2 flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Gauge className="w-4 h-4 text-[#00b2fe]" />
                    <span>Kilometra: <strong className="text-white font-bold">{parsed.mileage}</strong></span>
                  </div>
                ) : null}
              </div>

              {/* Description */}
              {description && (
                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDescription(!showDescription)}
                    className="flex items-center justify-between w-full py-1 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#00b2fe]" />
                      {showDescription ? "Fshih përshkrimin" : "Shiko përshkrimin e plotë"}
                    </span>
                    <span className="text-[10px]">{showDescription ? "▲" : "▼"}</span>
                  </button>

                  {showDescription && (
                    <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-gray-300 leading-relaxed whitespace-pre-line select-text max-h-40 overflow-y-auto">
                      {description}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons: Call & WhatsApp */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${rawPhone}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,178,254,0.3)] min-h-[42px]"
                >
                  <Phone className="w-4 h-4 fill-black" />
                  <span>Telefono</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    `Përshëndetje, po ju shkruaj nga ridewithkeijsi.com lidhur me motorrin: ${title} (${price})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-xs transition-all shadow-md min-h-[42px]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
