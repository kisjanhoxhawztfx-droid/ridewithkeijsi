import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import TaxiPostCard from "@/components/public/TaxiPostCard";
import GoogleReviewCard from "@/components/public/GoogleReviewCard";
import { Phone, ExternalLink, Star, ShieldCheck, Plane, Clock, MapPin, Sparkles, Car } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, GoogleIcon } from "@/components/ui/Icons";

export const revalidate = 60;

export const metadata = {
  title: "Taxi Keijsi — Shërbim Taksie 24/7 në Tiranë & Aeroport",
  description: "Porositni Taxi Keijsi me telefon ose WhatsApp. Shërbim 24/7 i shpejtë, komod dhe i sigurt në Tiranë, Aeroportin e Rinasit (TIA) dhe në të gjithë Shqipërinë. Shikoni recensionet në Google Business.",
};

export default async function TaxiPage() {
  const [settings, taxiPosts, taxiReviews] = await Promise.all([
    getSiteSettings(),
    db.taxiPost.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    }),
    db.taxiReview.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    }),
  ]);

  const cleanWhatsapp = (settings.taxi_whatsapp || "").replace(/[^0-9]/g, "");

  // Calculate average rating
  const averageRating = taxiReviews.length > 0
    ? (taxiReviews.reduce((acc, r) => acc + r.rating, 0) / taxiReviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="pt-2 sm:pt-4 pb-28 sm:pb-36 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
      
      {/* 1. HERO SECTION: Taxi Keijsi Header & Compact CTA */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-400/30 bg-gradient-to-b from-[#111827] via-[#0b101b] to-[#04060b] p-4 sm:p-8 lg:p-10 shadow-2xl">
        {/* Subtle background glow accents */}
        <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5 sm:space-y-5 text-left max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-[10px] sm:text-[11px] font-black text-amber-400 tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SHËRBIM TAKSIE 24/7</span>
            <span className="text-amber-500/50">•</span>
            <span className="text-gray-200">TIRANË & SHQIPËRI</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] uppercase leading-tight tracking-tight">
            TAXI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.55)]">
              KEIJSI
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
            {settings.taxi_description || "Shërbim taksie i shpejtë, komod dhe profesional në Tiranë dhe në të gjithë Shqipërinë. Transferta aeroporti, udhëtime turistike dhe shërbim VIP 24 orë në 7 ditë të javës."}
          </p>

          {/* Compact CTA Buttons: 2-column grid on mobile, flex on desktop */}
          <div className="pt-1 grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full">
            {/* Call Now Button with taxi yellow styling (NO .btn-primary) */}
            {settings.taxi_phone && (
              <a
                href={`tel:${settings.taxi_phone}`}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-6 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:from-amber-300 hover:to-yellow-300 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                <Phone className="w-3.5 h-3.5 fill-black text-black flex-shrink-0" />
                <span className="truncate">Telefono Tani</span>
              </a>
            )}

            {/* WhatsApp Booking Button with emerald styling (NO .btn-primary) */}
            {settings.taxi_whatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Përshëndetje Taxi Keijsi, dëshiroj të porosis një taksi.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:from-emerald-400 hover:to-green-400 transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>
            )}
          </div>

          {/* Symmetrical 3-column micro feature tags */}
          <div className="pt-1.5 grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full">
            <div className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/10 py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] text-gray-300 font-semibold text-center">
              <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="truncate">24/7 Shërbim</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/10 py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] text-gray-300 font-semibold text-center">
              <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
              <span className="truncate">I Sigurt</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/10 py-1.5 px-2 rounded-xl text-[10px] sm:text-[11px] text-gray-300 font-semibold text-center">
              <GoogleIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{averageRating} ★ Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE TAXI KEIJSI (SPACIOUS 3-CARD GRID) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-400/15 text-amber-400">
              <Car className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider font-['Outfit']">
              Pse të Zgjidhni Taxi Keijsi?
            </h2>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/30 uppercase tracking-wider">
            24/7 VIP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: Airport */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0e1626]/90 to-[#070b13]/90 border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/[0.03] transition-all duration-300 shadow-md flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Plane className="w-4 h-4" />
                </div>
                <strong className="text-white text-xs sm:text-sm font-extrabold font-['Outfit'] uppercase tracking-wide truncate">
                  Transferta në Aeroport
                </strong>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-400 border border-amber-400/30 uppercase flex-shrink-0">
                Tarifë Fikse
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-300 font-normal leading-relaxed">
              Nisje dhe pritje në kohë me tabelë në Aeroportin e Rinasit (TIA) me çmim fiks e transparent.
            </p>
          </div>

          {/* Card 2: Intercity */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0e1626]/90 to-[#070b13]/90 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-400/[0.03] transition-all duration-300 shadow-md flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <strong className="text-white text-xs sm:text-sm font-extrabold font-['Outfit'] uppercase tracking-wide truncate">
                  Udhëtime Ndërqytetase
                </strong>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-400 border border-emerald-400/30 uppercase flex-shrink-0">
                Gjithë Shqipëria
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-300 font-normal leading-relaxed">
              Tiranë - Durrës, Vlorë, Sarandë, Shkodër, Theth dhe çdo destinacion tjetër me komoditet maksimal.
            </p>
          </div>

          {/* Card 3: VIP Comfort */}
          <div className="p-4 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0e1626]/90 to-[#070b13]/90 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/[0.03] transition-all duration-300 shadow-md flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <strong className="text-white text-xs sm:text-sm font-extrabold font-['Outfit'] uppercase tracking-wide truncate">
                  Komoditet & Pastërti VIP
                </strong>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 uppercase flex-shrink-0">
                Standard 5★
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-300 font-normal leading-relaxed">
              Makina moderne të pastra, me kondicioner, hapësirë bagazhesh dhe shofer miqësor e profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Glowing Pill Transition Divider */}
      <div className="flex items-center justify-center my-6 sm:my-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        <div className="mx-3 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] sm:text-xs font-black tracking-widest text-amber-400 uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-1.5">
          <InstagramIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>01. INSTAGRAM @TAXI_KEIJSI</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 via-transparent to-transparent" />
      </div>

      {/* 3. SECTION 01: Instagram Showcase (@taxi_keijsi) */}
      <section className="surface-card p-4 sm:p-7 border border-white/10 space-y-5 rounded-2xl sm:rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Postimet nga @taxi_keijsi</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400">
              Momente, makina dhe njoftime zyrtare të shërbimit të taksisë nga llogaria në Instagram
            </p>
          </div>

          <a
            href="https://instagram.com/taxi_keijsi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 group transition-colors self-start sm:self-auto py-1"
          >
            <span>Ndiqni @taxi_keijsi</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Grid of Dedicated Taxi Posts */}
        {taxiPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {taxiPosts.map((post) => (
              <TaxiPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white/[0.02] rounded-2xl border border-white/5">
            <InstagramIcon className="w-7 h-7 text-amber-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs text-gray-400">Postimet nga @taxi_keijsi do të sinkronizohen së shpejti.</p>
          </div>
        )}
      </section>

      {/* Glowing Pill Transition Divider */}
      <div className="flex items-center justify-center my-6 sm:my-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        <div className="mx-3 px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[10px] sm:text-xs font-black tracking-widest text-yellow-400 uppercase shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>02. GOOGLE BUSINESS REVIEWS</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/30 via-transparent to-transparent" />
      </div>

      {/* 4. SECTION 02: Google Business Reviews */}
      <section className="surface-card p-4 sm:p-7 border border-white/10 space-y-5 rounded-2xl sm:rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
              <GoogleIcon className="w-4 h-4 flex-shrink-0" />
              <span>Vlerësimet e Klientëve ({averageRating} ★)</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400">
              Përvojat e verifikuara të klientëve tanë në Google Business dhe Google Maps
            </p>
          </div>

          {/* Leave Review Button */}
          {settings.taxi_google_business_url && (
            <a
              href={settings.taxi_google_business_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md self-start sm:self-auto"
            >
              <Star className="w-3.5 h-3.5 fill-black text-black" />
              <span>Lini Review në Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Rating Summary Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0b1019] via-[#0d1626] to-[#0b1019] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 text-white flex-shrink-0">
              <GoogleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                  {averageRating}
                </span>
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                Bazuar në vlerësimet e vërteta të udhëtarëve në Google Maps
              </p>
            </div>
          </div>

          {settings.taxi_google_business_url && (
            <a
              href={settings.taxi_google_business_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Shiko profilin në Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Grid of Reviews */}
        {taxiReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {taxiReviews.map((rev) => (
              <GoogleReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white/[0.02] rounded-2xl border border-white/5">
            <p className="text-xs text-gray-400">Nuk ka ende vlerësime të shfaqura.</p>
          </div>
        )}
      </section>
    </div>
  );
}
