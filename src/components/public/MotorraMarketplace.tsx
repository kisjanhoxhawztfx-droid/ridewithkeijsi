"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Bike,
  Heart,
  CheckCircle2,
  Calendar,
  Gauge,
  Zap,
  Phone,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ArrowUpDown,
  ShoppingBag,
  Archive,
  Star,
  MapPin,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { MotorraPostItem } from "./MotorraGrid";

interface MotorraMarketplaceProps {
  posts: MotorraPostItem[];
}

const CATEGORY_TABS = [
  "Të Gjithë",
  "Maxi-Scooter",
  "Sport & Naked",
  "Touring & Adventure",
  "Cruiser",
  "ATV & Quad",
];

function getPhotoList(post: MotorraPostItem): string[] {
  if (post.images && Array.isArray(post.images) && post.images.length > 0) {
    return post.images.filter(Boolean);
  }
  if (post.imageUrl) return [post.imageUrl];
  if (post.thumbnailUrl) return [post.thumbnailUrl];
  if (post.instagramId) return [`/api/instagram-image?id=${post.instagramId}`];
  return [];
}

export default function MotorraMarketplace({ posts }: MotorraMarketplaceProps) {
  // Filters state
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("Të Gjithë");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "FOR_SALE" | "SOLD">("ALL");
  const [selectedBrand, setSelectedBrand] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "KM_ASC">("NEWEST");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Favorites state (local storage or in-memory)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Modal state
  const [selectedPost, setSelectedPost] = useState<MotorraPostItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Distinct Brands with count (only real motorcycle brands, no SHITUR or phone numbers)
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      const rawBrand = (p.brand || p.title?.split(" ")[0] || "").trim();
      if (!rawBrand) return;
      // Strictly exclude any non-brand labels like "SHITUR", "+355", pure numbers or "Tjetër"
      if (
        /shitur/i.test(rawBrand) ||
        rawBrand.startsWith("+") ||
        /^\d+$/.test(rawBrand) ||
        rawBrand.toLowerCase() === "tjetër"
      ) {
        return;
      }
      counts[rawBrand] = (counts[rawBrand] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // Distinct Years with count
  const yearCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.year) {
        counts[String(p.year)] = (counts[String(p.year)] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [posts]);

  // Filtered & sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Status filter
    if (statusFilter === "FOR_SALE") {
      result = result.filter((p) => p.status === "FOR_SALE");
    } else if (statusFilter === "SOLD") {
      result = result.filter((p) => p.status === "SOLD");
    }

    // Brand filter
    if (selectedBrand !== "ALL") {
      result = result.filter((p) => {
        const b = (p.brand || p.title?.split(" ")[0] || "").toLowerCase();
        return b === selectedBrand.toLowerCase();
      });
    }

    // Year filter
    if (selectedYear !== "ALL") {
      result = result.filter((p) => String(p.year) === selectedYear);
    }

    // Category Tabs filter
    if (selectedCategoryTab !== "Të Gjithë") {
      result = result.filter((p) => {
        const text = `${p.title || ""} ${p.model || ""} ${p.description || ""}`.toLowerCase();
        if (selectedCategoryTab === "Maxi-Scooter") {
          return text.includes("tmax") || text.includes("x-adv") || text.includes("integra") || text.includes("beverly") || text.includes("sh 300") || text.includes("scooter") || text.includes("sr3") || text.includes("c 650");
        }
        if (selectedCategoryTab === "Sport & Naked") {
          return text.includes("cbr") || text.includes("er-6n") || text.includes("fazer") || text.includes("ninja") || text.includes("duke") || text.includes("1000rr");
        }
        if (selectedCategoryTab === "Touring & Adventure") {
          return text.includes("gs") || text.includes("tracer") || text.includes("africa twin") || text.includes("adventure") || text.includes("nc 700");
        }
        if (selectedCategoryTab === "Cruiser") {
          return text.includes("harley") || text.includes("dragstar") || text.includes("glide");
        }
        if (selectedCategoryTab === "ATV & Quad") {
          return text.includes("cfmoto") || text.includes("spy") || text.includes("quad") || text.includes("atv");
        }
        return true;
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const t = (p.title || "").toLowerCase();
        const b = (p.brand || "").toLowerCase();
        const d = (p.description || "").toLowerCase();
        return t.includes(q) || b.includes(q) || d.includes(q);
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "PRICE_ASC") {
        return (a.price || 9999999) - (b.price || 9999999);
      }
      if (sortBy === "PRICE_DESC") {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === "KM_ASC") {
        return (a.mileageKm || 9999999) - (b.mileageKm || 9999999);
      }
      // NEWEST
      const timeB = new Date(b.publishedAt || b.postedAt || 0).getTime();
      const timeA = new Date(a.publishedAt || a.postedAt || 0).getTime();
      return timeB - timeA;
    });

    return result;
  }, [posts, statusFilter, selectedBrand, selectedYear, selectedCategoryTab, searchQuery, sortBy]);

  const forSaleTotal = posts.filter((p) => p.status === "FOR_SALE").length;
  const soldTotal = posts.filter((p) => p.status === "SOLD").length;

  const handleOpenModal = (post: MotorraPostItem) => {
    setSelectedPost(post);
    setActivePhotoIndex(0);
    setShowDescription(false);
  };

  const selectedPhotos = selectedPost ? getPhotoList(selectedPost) : [];

  return (
    <div className="space-y-6">
      {/* 1. Top Category Tabs Header (BicycleBlueBook style) */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedCategoryTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryTab === tab
                  ? "bg-[#00b2fe] text-black shadow-[0_0_15px_rgba(0,178,254,0.4)]"
                  : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Search & Sort Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kërko motorra sipas emrit, markës, modelit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080d16] border border-white/15 focus:border-[#00b2fe] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden btn-secondary !py-2.5 !px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>Filtra</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#080d16] border border-white/15 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#00b2fe]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-gray-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="NEWEST" className="bg-[#080d16] text-white">Më të fundit</option>
              <option value="PRICE_ASC" className="bg-[#080d16] text-white">Çmimi: Nga më i ulëti</option>
              <option value="PRICE_DESC" className="bg-[#080d16] text-white">Çmimi: Nga më i larti</option>
              <option value="KM_ASC" className="bg-[#080d16] text-white">Kilometra: Më pak km</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Marketplace Layout: Left Sidebar Filters + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* === LEFT SIDEBAR FILTERS (BicycleBlueBook Style) === */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? "block" : "hidden"
          } surface-card p-5 rounded-2xl border border-white/10 space-y-6 lg:sticky lg:top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#00b2fe]" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit']">
                Filtra Kërkimi
              </h3>
            </div>
            {(selectedBrand !== "ALL" || selectedYear !== "ALL" || statusFilter !== "ALL" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBrand("ALL");
                  setSelectedYear("ALL");
                  setStatusFilter("ALL");
                  setSearchQuery("");
                }}
                className="text-[11px] text-[#00b2fe] hover:underline font-bold"
              >
                Pastro
              </button>
            )}
          </div>

          {/* Status Filter (Seller Type style in screenshot) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider font-['Outfit']">
              Statusi
            </h4>
            <div className="space-y-1.5 text-xs text-gray-300">
              <label
                onClick={() => setStatusFilter("ALL")}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === "ALL" ? "bg-[#00b2fe]/15 text-[#00d2ff] font-bold border border-[#00b2fe]/30" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    statusFilter === "ALL" ? "border-[#00b2fe] bg-[#00b2fe]" : "border-gray-500"
                  }`}>
                    {statusFilter === "ALL" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                  <span>Të Gjithë</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono font-bold">{posts.length}</span>
              </label>

              <label
                onClick={() => setStatusFilter("FOR_SALE")}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === "FOR_SALE" ? "bg-green-500/15 text-green-400 font-bold border border-green-500/30" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    statusFilter === "FOR_SALE" ? "border-green-400 bg-green-400" : "border-gray-500"
                  }`}>
                    {statusFilter === "FOR_SALE" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                  <span>Në Shitje ✅</span>
                </div>
                <span className="text-[11px] text-green-400 font-mono font-bold">{forSaleTotal}</span>
              </label>

              <label
                onClick={() => setStatusFilter("SOLD")}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  statusFilter === "SOLD" ? "bg-zinc-700/30 text-gray-300 font-bold border border-zinc-600" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    statusFilter === "SOLD" ? "border-zinc-400 bg-zinc-400" : "border-gray-500"
                  }`}>
                    {statusFilter === "SOLD" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                  <span>Të Shitura ❌</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono font-bold">{soldTotal}</span>
              </label>
            </div>
          </div>

          {/* Brand & Family Filter */}
          <div className="space-y-2.5 pt-3 border-t border-white/10">
            <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider font-['Outfit']">
              Marka (Brand)
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              <button
                onClick={() => setSelectedBrand("ALL")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                  selectedBrand === "ALL" ? "bg-[#00b2fe]/20 text-[#00d2ff] font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Të gjitha markat</span>
                <span className="text-[10px] text-gray-500">{posts.length}</span>
              </button>
              {brandCounts.map(([b, count]) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(selectedBrand === b ? "ALL" : b)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                    selectedBrand.toLowerCase() === b.toLowerCase()
                      ? "bg-[#00b2fe]/20 text-[#00d2ff] font-bold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{b}</span>
                  <span className="text-[10px] text-gray-500">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          {yearCounts.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-white/10">
              <h4 className="text-xs font-black text-gray-300 uppercase tracking-wider font-['Outfit']">
                Viti i Prodhimit
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedYear("ALL")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    selectedYear === "ALL"
                      ? "bg-[#00b2fe] text-black"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  Çdo Vit
                </button>
                {yearCounts.map(([y]) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(selectedYear === y ? "ALL" : y)}
                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                      selectedYear === y
                        ? "bg-[#00b2fe] text-black"
                        : "bg-white/5 text-gray-300 hover:text-white border border-white/10"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#00b2fe]/10 via-transparent to-transparent border border-[#00b2fe]/30 space-y-2">
            <span className="text-[10px] font-black text-[#00d2ff] uppercase tracking-wider font-['Outfit']">
              Keni motorr për të shitur?
            </span>
            <p className="text-[11px] text-gray-300 leading-snug">
              Silleni tek ne dhe e shesim menjëherë me ekspozim tek mijëra ndjekës.
            </p>
            <a
              href="tel:+355697738559"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00b2fe] hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>+355 69 773 8559</span>
            </a>
          </div>
        </aside>

        {/* === RIGHT PRODUCT CARDS GRID (BicycleBlueBook Format) === */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span>
              Po shfaqen <strong className="text-white font-bold">{filteredPosts.length}</strong> motorra
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="surface-card p-12 text-center rounded-2xl border border-white/10 space-y-3">
              <Bike className="w-10 h-10 text-gray-600 mx-auto" />
              <h3 className="text-sm font-bold text-white font-['Outfit']">Nuk u gjet asnjë motorr me këto filtra</h3>
              <p className="text-xs text-gray-400">Provoni të ndryshoni filtrat ose kërkoni një emër tjetër.</p>
              <button
                onClick={() => {
                  setSelectedBrand("ALL");
                  setSelectedYear("ALL");
                  setStatusFilter("ALL");
                  setSelectedCategoryTab("Të Gjithë");
                  setSearchQuery("");
                }}
                className="btn-secondary !py-2 !px-4 text-xs font-bold mt-2"
              >
                Pastro të gjitha filtrat
              </button>
            </div>
          ) : (
            /* Responsive Grid: 1 col on small mobile, 2 on tablet, 3 on desktop */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredPosts.map((post) => {
                const photos = getPhotoList(post);
                const isSold = post.status === "SOLD";
                const isFav = !!favorites[post.id];

                const displayTitle = post.title || post.model || "Motorr";
                const displayYear = post.year ? `${post.year}` : "";
                const fullHeading = displayYear && !displayTitle.includes(displayYear)
                  ? `${displayYear} ${displayTitle}`
                  : displayTitle;

                const displayPrice = post.price
                  ? `€${post.price.toLocaleString()}`
                  : "Me Rezervim";

                const specsLine = [
                  post.year ? `Viti ${post.year}` : null,
                  post.engine ? `${post.engine}` : null,
                  post.mileageKm ? `${post.mileageKm.toLocaleString()} km` : null,
                  post.mileageMi ? `${post.mileageMi.toLocaleString()} mi` : null,
                  isSold ? "E Shitur" : "Gjendje Perfekte",
                ].filter(Boolean).join(" • ");

                const cleanPhone = (post.phone || "+355697738559").replace(/[^0-9+]/g, "");
                const cleanWa = (post.whatsapp || post.phone || "+355697738559").replace(/[^0-9]/g, "");

                return (
                  <div
                    key={post.id}
                    onClick={() => handleOpenModal(post)}
                    className="group bg-[#080d17] border border-white/10 hover:border-[#00b2fe] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(0,178,254,0.25)] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* 1. Photo Area (Landscape 4:3 style like screenshot) */}
                      <div className="relative aspect-[4/3] bg-black overflow-hidden">
                        {photos[0] ? (
                          <Image
                            src={photos[0]}
                            alt={fullHeading}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                              isSold ? "grayscale opacity-60" : ""
                            }`}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                            <Bike className="w-12 h-12 text-gray-600" />
                          </div>
                        )}

                        {/* Top Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Left: Status & Multi-photo Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              isSold
                                ? "bg-red-500/90 text-white border border-red-400/50"
                                : "bg-[#00b2fe] text-black font-['Outfit'] font-extrabold shadow-md"
                            }`}
                          >
                            {isSold ? "E Shitur" : "Në Shitje"}
                          </span>

                          {photos.length > 1 && (
                            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5 text-[#00b2fe]" />
                              <span>{photos.length} foto</span>
                            </span>
                          )}
                        </div>

                        {/* Top Right: Heart / Favorite Button (Just like in screenshot!) */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(post.id, e)}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/65 backdrop-blur-md border border-white/20 hover:border-[#00b2fe] flex items-center justify-center transition-all z-10 active:scale-90"
                          title="Ruaj te të preferuarat"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFav ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-400"
                            }`}
                          />
                        </button>
                      </div>

                      {/* 2. Card Content Area (BicycleBlueBook typography & layout) */}
                      <div className="p-4 space-y-2.5">
                        {/* Title: 2024 Yamaha TMAX 560 */}
                        <h3 className="text-sm sm:text-base font-extrabold text-white font-['Outfit'] line-clamp-1 leading-snug group-hover:text-[#00b2fe] transition-colors">
                          {fullHeading}
                        </h3>

                        {/* Specs Subline: Viti & Cilindrata highlighted */}
                        <div className="flex items-center gap-1.5 text-[11px] font-medium line-clamp-1 flex-wrap">
                          {post.year && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px] tracking-wide">
                              <Calendar className="w-2.5 h-2.5 text-[#00b2fe]" />
                              Viti {post.year}
                            </span>
                          )}
                          {post.engine && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#00b2fe]/15 text-[#00d2ff] font-bold text-[10px] tracking-wide">
                              <Zap className="w-2.5 h-2.5 text-[#00b2fe]" />
                              {post.engine}
                            </span>
                          )}
                          {post.mileageKm && (
                            <span className="text-gray-300 text-[11px]">
                              • {post.mileageKm.toLocaleString()} km
                            </span>
                          )}
                          {post.mileageMi && (
                            <span className="text-gray-500 text-[11px]">
                              ({post.mileageMi.toLocaleString()} mi)
                            </span>
                          )}
                          <span className="text-gray-400 text-[11px]">
                            • {isSold ? "E Shitur" : "Gjendje Perfekte"}
                          </span>
                        </div>

                        {/* Price & Deal Rating Pill (Like '$1,000 Good deal' in screenshot) */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                            {displayPrice}
                          </span>

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-wide font-['Outfit']">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Çmim i Shkëlqyer</span>
                          </span>
                        </div>

                        {/* Seller Row (Like 'PS Private seller Okemos, MI' in screenshot) */}
                        <div className="flex items-center gap-2.5 pt-2 border-t border-white/10 text-xs">
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

                    {/* 3. Action Buttons Row (Buy now / Call / WhatsApp) */}
                    <div className="p-3 border-t border-white/10 bg-white/[0.01] grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-[11px] transition-all shadow-[0_0_12px_rgba(0,178,254,0.3)] active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5 fill-black" />
                        <span>Telefono</span>
                      </a>

                      <a
                        href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                          `Përshëndetje, po ju shkruaj nga ridewithkeijsi.com lidhur me motorrin: ${fullHeading} (${displayPrice})`
                        )}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] transition-all shadow-md active:scale-95"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. EXPANDED MODAL (WHEN A CARD IS CLICKED) */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative w-full max-w-[440px] sm:max-w-xl max-h-[95vh] bg-[#090d15] border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(0,178,254,0.3)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#06090e] z-30">
              <div className="flex items-center gap-2 max-w-[75%]">
                <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse flex-shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white font-['Outfit'] uppercase tracking-wider truncate">
                  {selectedPost.title || selectedPost.model || "Motorr"}
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

            {/* Gallery Slider */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-black overflow-hidden flex-shrink-0 flex items-center justify-center select-none group/slider">
              {selectedPhotos.length > 0 ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedPhotos[activePhotoIndex]}
                    alt={`${selectedPost.title || "Motorr"} - Foto ${activePhotoIndex + 1}`}
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

              {/* Prev / Next Buttons */}
              {selectedPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev - 1 + selectedPhotos.length) % selectedPhotos.length);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90 z-20"
                    aria-label="Foto e mëparshme"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev + 1) % selectedPhotos.length);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-[#00b2fe] hover:text-black text-white border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90 z-20"
                    aria-label="Foto tjetër"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Counter Pill */}
                  <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
                    📸 {activePhotoIndex + 1} / {selectedPhotos.length}
                  </div>

                  {/* Thumbnail Bar */}
                  <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 z-20 px-3 overflow-x-auto">
                    {selectedPhotos.map((url, idx) => (
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
                        <Image src={url} alt="" fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Marketplace Details */}
            <div className="p-4 sm:p-5 bg-[#080d17] border-t border-white/10 space-y-3.5 overflow-y-auto max-h-[44vh]">
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-extrabold text-[#00b2fe] uppercase tracking-wider block">
                    {selectedPost.brand || "Motorr"}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit'] uppercase leading-snug">
                    {selectedPost.year ? `${selectedPost.year} ` : ""}{selectedPost.title || selectedPost.model}
                  </h3>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00b2fe]/20 to-[#00d2ff]/20 border border-[#00b2fe]/50 whitespace-nowrap shadow-md">
                  <span className="text-sm sm:text-base font-black text-[#00d2ff] font-['Outfit']">
                    {selectedPost.price ? `€${selectedPost.price.toLocaleString()}` : "Me Rezervim"}
                  </span>
                </div>
              </div>

              {/* Specs Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-200">
                {selectedPost.year && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Calendar className="w-4 h-4 text-[#00b2fe]" />
                    <span>Viti: <strong className="text-white font-bold">{selectedPost.year}</strong></span>
                  </div>
                )}

                {selectedPost.engine && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <Zap className="w-4 h-4 text-[#00b2fe]" />
                    <span>Motori: <strong className="text-white font-bold">{selectedPost.engine}</strong></span>
                  </div>
                )}

                {selectedPost.mileageKm && (
                  <div className="col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-[#00b2fe]" />
                      <span>Kilometra:</span>
                    </div>
                    <span className="font-bold text-white">
                      {selectedPost.mileageKm.toLocaleString()} km
                      {selectedPost.mileageMi && <span className="text-gray-400 font-normal"> ({selectedPost.mileageMi.toLocaleString()} milje)</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Full Description */}
              {(selectedPost.description || selectedPost.caption) && (
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
                      {selectedPost.description || selectedPost.caption}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${(selectedPost.phone || "+355697738559").replace(/[^0-9+]/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(0,178,254,0.3)] min-h-[42px]"
                >
                  <Phone className="w-4 h-4 fill-black" />
                  <span>Telefono</span>
                </a>

                <a
                  href={`https://wa.me/${(selectedPost.whatsapp || selectedPost.phone || "+355697738559").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Përshëndetje, po ju shkruaj nga ridewithkeijsi.com lidhur me motorrin: ${selectedPost.title || selectedPost.model}`
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
