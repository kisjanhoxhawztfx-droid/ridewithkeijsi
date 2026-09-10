import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import { getSiteSettings, getCustomSections, getLuxuryVehicles } from "@/lib/settings";
import HeroSection from "@/components/public/HeroSection";
import EpisodeCard from "@/components/public/EpisodeCard";
import MotorraCard from "@/components/public/MotorraCard";
import TaxiPostCard from "@/components/public/TaxiPostCard";
import LuxuryCard from "@/components/public/LuxuryCard";
import InstagramPostCard from "@/components/public/InstagramPostCard";
import { ChevronRight, Sparkles, Tv, Bike, Users, Phone, Star, Car, Shield, Heart } from "lucide-react";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon, GoogleIcon, CrownIcon } from "@/components/ui/Icons";

export const revalidate = 60;

export default async function HomePage() {
  const [
    settings,
    sections,
    episodes,
    motorcycles,
    taxiPosts,
    taxiReviews,
    luxuryVehicles,
    totalEpisodesCount,
    totalBikesCount,
    forYouPosts,
    motorraForSale,
  ] = await Promise.all([
    getSiteSettings(),
    getCustomSections(),
    db.episode.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 4,
    }),
    db.motorcycle.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 4,
    }),
    db.taxiPost.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 3,
    }),
    db.taxiReview.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 3,
    }),
    getLuxuryVehicles(3),
    db.episode.count({ where: { isVisible: true } }),
    db.motorcycle.count({ where: { isVisible: true } }),
    db.instagramPost.findMany({
      where: { isVisible: true, category: "EPISOD" },
      orderBy: { postedAt: "desc" },
      take: 3,
    }),
    db.instagramPost.findMany({
      where: { isVisible: true, category: "SHITET", status: "FOR_SALE" },
      orderBy: { postedAt: "desc" },
      take: 4,
    }),
  ]);



  const featuredEpisode = episodes.find((e) => e.isFeatured) || episodes[0] || null;
  const recentEpisodes = episodes.filter((e) => e.id !== featuredEpisode?.id).slice(0, 3);

  const cleanTaxiWhatsapp = (settings.taxi_whatsapp || "").replace(/[^0-9]/g, "");
  const luxuryPhone = settings.luxury_phone || "+355697738559";
  const luxuryWhatsapp = settings.luxury_whatsapp || "+355697738559";
  const cleanLuxuryWhatsapp = luxuryWhatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="space-y-16 sm:space-y-28 lg:space-y-36 pb-20 sm:pb-32 w-full">
      {/* 1. Cinematic Hero Section */}
      <HeroSection
        heroTitle={settings.hero_title}
        heroSubtitle={settings.hero_subtitle}
        ctaText={settings.hero_cta_text}
        ctaLink={settings.hero_cta_link}
        secondaryCtaText={settings.hero_secondary_cta_text}
        secondaryCtaLink={settings.hero_secondary_cta_link}
        featuredEpisode={featuredEpisode}
        totalEpisodes={totalEpisodesCount}
        totalMotorcycles={totalBikesCount}
      />

      {/* 2. Section 01: Ride with Keijsi (Episodes) */}
      <section className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="surface-card p-6 sm:p-10 lg:p-12 border border-white/10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="section-badge">01. EMISIONI ZYRTAR</span>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2.5">
                <Tv className="w-5 h-5 text-[#00b2fe]" />
                <span>Episodet më të Fundit</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Xhiro ekskluzive, teste motorrash dhe intervista nga YouTube @RideWithkeijsi
              </p>
            </div>

            <Link
              href="/episodes"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00b2fe] hover:text-[#00d2ff] group transition-colors self-start sm:self-auto py-1"
            >
              <span>Shiko të gjitha ({totalEpisodesCount})</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of Episodes */}
          {recentEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {recentEpisodes.map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white/[0.02] rounded-xl border border-white/5">
              <Sparkles className="w-8 h-8 text-[#00b2fe] mx-auto mb-2" />
              <p className="text-xs text-gray-400">Episodet e reja do të sinkronizohen së shpejti.</p>
            </div>
          )}

          {/* For You Sub-section */}
          {forYouPosts.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00b2fe]/10 border border-[#00b2fe]/30 text-[10px] font-black text-[#00b2fe] uppercase tracking-wider">
                    <Heart className="w-3 h-3 text-[#00b2fe]" />
                    FOR YOU
                  </span>
                  <span className="text-xs text-gray-500">Nga @ridewithkeijsi me #episod</span>
                </div>
                <Link
                  href="/episodes?tab=foryou"
                  className="text-xs font-bold text-[#00b2fe] hover:text-[#00d2ff] flex items-center gap-1 transition-colors"
                >
                  Shiko të gjitha <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl">
                {forYouPosts.map((post) => (
                  <InstagramPostCard key={post.id} post={post} variant="foryou" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Section 02: Motorra (Marketplace / Instagram) */}
      <section className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="surface-card p-6 sm:p-10 lg:p-12 border border-white/10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="section-badge !bg-[#00b2fe]/10 !border-[#00b2fe]/30 !text-[#00b2fe]">
                  02. MARKETPLACE
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2.5">
                <Bike className="w-5 h-5 text-[#00b2fe]" />
                <span>Motorra në Shitje</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400">
                Auto-sync nga @ridewithkeijsi — postimet me #shitet shfaqen automatikisht
              </p>
            </div>

            <Link
              href="/motorra"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#00b2fe] hover:text-[#00d2ff] group transition-colors self-start sm:self-auto py-1"
            >
              <span>Eksploro të gjithë ({motorraForSale.length})</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid of Motorra Cards from Instagram */}
          {motorraForSale.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {motorraForSale.map((post) => (
                <InstagramPostCard key={post.id} post={post} variant="motorra" />

              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white/[0.02] rounded-xl border border-white/5">
              <InstagramIcon className="w-8 h-8 text-[#00b2fe] mx-auto mb-2" />
              <p className="text-xs text-gray-400">Nuk ka motorra për momentin.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Section 03: 👑 LUXURY SERVICES (NEW) */}
      <section className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-gradient-to-br from-[#141b27] via-[#0c1017] to-[#05070a] p-6 sm:p-12 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-10">
          {/* Ambient Gold Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Section Top Header & Direct Booking */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-[#ffd700]/50 text-[11px] font-black text-[#ffd700] uppercase tracking-wider">
                  <CrownIcon className="w-3.5 h-3.5 text-[#ffd700] fill-[#ffd700]" />
                  03. SHËRBIME ME QIRA VIP
                </span>
                <span className="text-xs text-[#ffd700] font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                  24/7 me Shofer Personal
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Outfit'] flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2 text-white">
                  <CrownIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                  <span>LUXURY</span>
                </span>
                <span className="bg-gradient-to-r from-[#ffd700] via-[#ffe066] to-[#d4af37] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                  SERVICES
                </span>
              </h2>

              <p className="text-[11px] sm:text-xs text-gray-300/90 max-w-2xl leading-relaxed">
                Makina luksoze, limuzina ceremoniale, furgona Maybach VIP, Rolls-Royce dhe Bentley me qira me shofer personal për dasma, transferta aeroporti dhe evente VIP.
              </p>
            </div>

            {/* Direct Contact Buttons (Phone + WhatsApp) */}
            <div className="flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <a
                href={`tel:${luxuryPhone}`}
                className="btn-primary !from-[#ffd700] !to-[#b8860b] hover:!from-[#ffe033] hover:!to-[#d4af37] !text-black text-xs font-black !py-2.5 !px-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
              >
                <Phone className="w-3.5 h-3.5 fill-black text-black" />
                <span>{luxuryPhone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanLuxuryWhatsapp}?text=${encodeURIComponent("Përshëndetje Luxury Services, dëshiroj të rezervoj një makinë luksoze.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !from-green-600 !to-emerald-700 hover:!from-green-500 hover:!to-emerald-600 text-xs font-bold !py-2.5 !px-4 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp VIP</span>
              </a>

              <Link
                href="/luxury"
                className="btn-secondary text-xs font-bold !py-2.5 !px-4 flex items-center justify-center gap-1.5 hover:!border-[#ffd700] hover:text-[#ffd700]"
              >
                <span>Flota</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#ffd700]" />
              </Link>
            </div>
          </div>

          {/* Luxury Vehicles Grid Preview */}
          {luxuryVehicles.length > 0 && (
            <div className="pt-4 border-t border-white/10 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5">
                  <CrownIcon className="w-3.5 h-3.5 text-[#ffd700]" />
                  FLOTA E PREZANTUAR (ROLLS-ROYCE, BENTLEY, MAYBACH, LIMUZINA)
                </span>
                <Link href="/luxury" className="text-xs font-bold text-[#ffd700] hover:underline">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {luxuryVehicles.map((vehicle) => (
                  <LuxuryCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    contactPhone={luxuryPhone}
                    contactWhatsapp={luxuryWhatsapp}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Section 04: TAXI KEIJSI Showcase */}
      <section className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#00b2fe]/30 bg-gradient-to-br from-[#09111e] via-[#070b12] to-[#04070c] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="section-badge !bg-amber-500/10 !border-amber-500/30 !text-amber-400">
                  04. SHËRBIM TAKSIE 24/7
                </span>
                <span className="text-[11px] text-yellow-400 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  5.0 Google Reviews
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                Taxi <span className="text-[#00b2fe]">Keijsi</span> — Udhëtoni me Siguri & Komoditet
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-300 max-w-xl">
                Shërbim taksie 24/7 në Tiranë, transferta në Aeroportin e Rinasit (TIA) dhe udhëtime në çdo qytet të Shqipërisë me makina moderne.
              </p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              {settings.taxi_phone && (
                <a
                  href={`tel:${settings.taxi_phone}`}
                  className="btn-primary text-xs font-bold !py-3 !px-5 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>{settings.taxi_phone}</span>
                </a>
              )}

              {settings.taxi_whatsapp && (
                <a
                  href={`https://wa.me/${cleanTaxiWhatsapp}?text=${encodeURIComponent("Përshëndetje Taxi Keijsi, dëshiroj të porosis një taksi.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !from-green-600 !to-emerald-700 hover:!from-green-500 hover:!to-emerald-600 text-xs font-bold !py-3 !px-5 flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Porosit në WhatsApp</span>
                </a>
              )}

              <Link
                href="/taxi"
                className="btn-secondary text-xs font-bold !py-3 !px-5 flex items-center gap-1.5"
              >
                <span>Faqja e Taksisë</span>
                <ChevronRight className="w-4 h-4 text-[#00b2fe]" />
              </Link>
            </div>
          </div>

          {/* Taxi Instagram Posts Preview */}
          {taxiPosts.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-amber-400" />
                  POSTIMET NGA @TAXI_KEIJSI
                </span>
                <Link href="/taxi" className="text-xs font-bold text-amber-400 hover:underline">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {taxiPosts.map((post) => (
                  <TaxiPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Section 05: Community & Social Channels */}
      <section className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#080d17] via-[#0d1424] to-[#080d17] p-6 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#00b2fe]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <span className="section-badge">05. KOMUNITETI</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Outfit'] leading-tight">
                Bashkohuni me Komunitetin e <span className="text-[#00b2fe]">Ride with Keijsi</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
                Ndiqni kanalin zyrtar në YouTube @RideWithkeijsi për premierat e çdo episodi dhe bëhuni pjesë e bisedave në Instagram & TikTok për të rejat më të fundit.
              </p>
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://youtube.com/@RideWithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !from-red-600 !to-red-700 hover:!from-red-500 hover:!to-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-xs font-bold text-center justify-center min-h-[42px]"
              >
                <YouTubeIcon className="w-4 h-4" />
                <span>YouTube</span>
              </a>

              <a
                href="https://instagram.com/ridewithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs font-bold hover:!border-[#00b2fe] hover:text-[#00b2fe] text-center justify-center min-h-[42px]"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <a
                href="https://tiktok.com/@keijsi09"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs font-bold hover:!border-cyan-500 hover:text-cyan-400 text-center justify-center min-h-[42px]"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok</span>
              </a>

              <a
                href="https://web.facebook.com/people/Ride-With-Keijsi/61579447413922/#"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs font-bold hover:!border-blue-500 hover:text-blue-400 text-center justify-center min-h-[42px]"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
