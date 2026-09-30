"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Bike,
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
  Maximize2,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import {
  parseMotorcycleCaption,
  ParsedMotorcycle,
} from "@/lib/motorcycleParser";

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
 * Individual motorcycle card displaying photo gallery with cover, specs, and badges.
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
  const displayBrand = post.brand || displayTitle.split(" ")[0] || "Motorr";
  const displayYear = post.year || parsed.year;
  const displayPrice = post.price
    ? `€${post.price.toLocaleString()}`
    : (parsed.price || "Me Rezervim");

  const displayMileage = post.mileageKm
    ? `${post.mileageKm.toLocaleString()} km`
    : (parsed.mileage || null);

  const [imgSrc, setImgSrc] = useState<string>(primaryThumb);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImageError = () => {
    if (post.instagramId) {
      const rawGithub = `https://raw.githubusercontent.com/kisjanhoxhawztfx-droid/ridewithkeijsi/master/public/instagram/${post.instagramId}.jpg`;
      if (imgSrc !== rawGithub) {
        setImgSrc(rawGithub);
        return;
      }
    }
    setImgFailed(true);
  };

  return (
    <div
      onClick={() => onSelect(post)}
      className="group relative aspect-[9/13.5] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#131d2e] via-[#0c121d] to-[#06090f] border border-white/10 hover:border-[#00b2fe] cursor-pointer shadow-md hover:shadow-[0_0_22px_rgba(0,178,254,0.35)] transition-all duration-300 active:scale-95 flex flex-col justify-between"
    >
      {/* Thumbnail Image */}
      {imgSrc && !imgFailed ? (
        <Image
          src={imgSrc}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            isSold ? "grayscale opacity-60" : ""
          }`}
          onError={handleImageError}
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#162338] via-[#0e1624] to-[#070b13]">
          <div className="w-10 h-10 rounded-full bg-[#00b2fe]/20 border border-[#00b2fe]/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,178,254,0.3)]">
            <Bike className="w-5 h-5 text-[#00b2fe]" />
          </div>
          <p className="text-[10px] font-black text-white uppercase font-['Outfit'] line-clamp-2 px-1 leading-tight">
            {displayTitle}
          </p>
          {displayPrice && (
            <span className="mt-1 text-[9px] font-black text-[#00d2ff] bg-black/60 px-2 py-0.5 rounded border border-[#00b2fe]/30 font-['Outfit']">
              {displayPrice}
            </span>
          )}
        </div>
      )}

      {/* Gradient overlays for high contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

      {/* Top Row Badges: Status & Photos count */}
      <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 pointer-events-none z-10">
        <span
          className={`px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${
            isSold
              ? "bg-zinc-800/90 text-gray-400 border border-zinc-700"
              : "bg-[#00b2fe] text-black shadow-md font-['Outfit']"
          }`}
        >
          {isSold ? "E Shitur" : "Në Shitje"}
        </span>

        <div className="flex items-center gap-1">
          {photos.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white text-[8px] sm:text-[9px] font-bold flex items-center gap-1">
              <ImageIcon className="w-2.5 h-2.5 text-[#00b2fe]" />
              <span>{photos.length}</span>
            </span>
          )}
          {displayPrice && (
            <span className="px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-[#00b2fe]/40 text-[#00d2ff] text-[8px] sm:text-[9px] font-black font-['Outfit'] shadow-sm">
              {displayPrice}
            </span>
          )}
        </div>
      </div>

      {/* Center Image Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/30 group-hover:bg-[#00b2fe] group-hover:border-[#00b2fe] flex items-center justify-center text-white group-hover:text-black transition-all shadow-lg group-hover:scale-110">
          <ImageIcon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Bottom Info: Title & Specs */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 pointer-events-none z-10 space-y-0.5">
        <p className="text-[9px] sm:text-[11px] text-white font-black font-['Outfit'] uppercase line-clamp-1 leading-tight drop-shadow-md">
          {displayTitle}
        </p>
        <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-gray-300 font-semibold drop-shadow-sm truncate">
          {displayYear && <span>{displayYear}</span>}
          {displayYear && displayMileage && <span>•</span>}
          {displayMileage && <span>{displayMileage}</span>}
        </div>
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

  // Selected specs derivation
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
      {/* 1. COMPACT GRID: 3 COLUMNS ON MOBILE, 4 ON TABLET, 6 ON DESKTOP */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3.5">
        {posts.map((post) => (
          <MotorraCardItem key={post.id} post={post} onSelect={handleSelectPost} />
        ))}
      </div>

      {/* 2. EXPANDED MODAL WITH MULTI-PHOTO GALLERY CAROUSEL */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[420px] sm:max-w-lg max-h-[95vh] bg-[#090d15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.3)] flex flex-col"
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
                    sizes="(max-width: 640px) 100vw, 500px"
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

                  {/* Photo Counter Pill (e.g. 1 / 4) */}
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
                    {title}
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
