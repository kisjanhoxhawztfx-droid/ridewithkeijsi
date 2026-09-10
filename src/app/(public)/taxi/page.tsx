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
    <div className="pt-1 sm:pt-3 pb-20 sm:pb-28 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION: Taxi Keijsi Header & Direct Call/WhatsApp Booking */}
      <section className="relative rounded-3xl overflow-hidden border border-[#00b2fe]/35 bg-gradient-to-b from-[#0c1424] via-[#070b14] to-[#04060a] p-8 sm:p-14 shadow-2xl">
        {/* Background glow accents */}
        <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-[#00b2fe]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          {/* Left Column: Headlines & Call/WhatsApp CTA */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00b2fe]/15 border border-[#00b2fe]/30 text-xs font-black text-[#00d2ff] tracking-wider uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
              <span>SHËRBIM TAKSIE 24/7</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">TIRANË & SHQIPËRI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] uppercase leading-tight tracking-wide">
              TAXI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-white drop-shadow-[0_0_20px_rgba(0,178,254,0.6)]">KEIJSI</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed font-normal max-w-xl">
              {settings.taxi_description || "Shërbim taksie i shpejtë, komod dhe profesional në Tiranë dhe në të gjithë Shqipërinë. Transferta aeroporti, udhëtime turistike dhe shërbim VIP 24 orë në 7 ditë të javës."}
            </p>

            {/* Direct Contact Buttons (Phone Call + WhatsApp Booking) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Call Now Button */}
              {settings.taxi_phone && (
                <a
                  href={`tel:${settings.taxi_phone}`}
                  className="btn-primary !from-[#00b2fe] !to-[#0077b6] text-xs sm:text-sm font-black !py-4 !px-8 shadow-[0_0_25px_rgba(0,178,254,0.45)] w-full sm:w-auto text-center flex items-center justify-center gap-2.5 min-h-[50px] hover:scale-105 transition-all"
                >
                  <Phone className="w-4 h-4 fill-current flex-shrink-0 animate-bounce" />
                  <span>Telefono Tani: {settings.taxi_phone}</span>
                </a>
              )}

              {/* WhatsApp Fast Booking Button */}
              {settings.taxi_whatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Përshëndetje Taxi Keijsi, dëshiroj të porosis një taksi.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !from-green-600 !to-emerald-700 hover:!from-green-500 hover:!to-emerald-600 text-xs sm:text-sm font-extrabold !py-4 !px-8 shadow-[0_0_25px_rgba(34,197,94,0.4)] w-full sm:w-auto text-center flex items-center justify-center gap-2.5 min-h-[50px]"
                >
                  <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Porosit në WhatsApp</span>
                </a>
              )}
            </div>

            {/* Micro Feature Tags */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#00b2fe]" />
                Shërbim 24/7 Pa Ndërprerje
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                Udhëtim i Sigurt & Korrekt
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-300 font-medium">
                <GoogleIcon className="w-3.5 h-3.5" />
                {averageRating} ★ Google Reviews
              </span>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 sm:p-8 border border-[#00b2fe]/35 shadow-[0_0_40px_rgba(0,178,254,0.15)] bg-gradient-to-b from-[#0e1728]/95 via-[#070c18]/95 to-[#04060b]/95 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#00b2fe]/20 text-[#00b2fe] shadow-[0_0_15px_rgba(0,178,254,0.3)]">
                    <Car className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider font-['Outfit']">
                    Pse të Zgjidhni Taxi Keijsi?
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#00b2fe]/15 text-[#00d2ff] border border-[#00b2fe]/30 uppercase tracking-wider">
                  24/7 VIP
                </span>
              </div>

              <div className="space-y-4">
                {/* Feature 1: Airport */}
                <div className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-[#00b2fe]/60 hover:bg-[#00b2fe]/[0.06] transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(0,178,254,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00b2fe]/30 to-[#00b2fe]/10 border border-[#00b2fe]/40 flex items-center justify-center text-[#00d2ff] shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white block font-['Outfit'] text-xs sm:text-sm uppercase tracking-wide group-hover:text-[#00d2ff] transition-colors">
                          Transferta në Aeroport (TIA)
                        </strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#00b2fe]/20 text-[#00b2fe] border border-[#00b2fe]/30 uppercase whitespace-nowrap">
                          Tarifë Fikse
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-gray-300 font-normal leading-relaxed mt-1.5">
                        Nisje dhe pritje në kohë me tabelë në Aeroportin e Rinasit me çmim fiks e transparent.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 2: Intercity */}
                <div className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-green-500/60 hover:bg-green-500/[0.06] transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/30 to-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white block font-['Outfit'] text-xs sm:text-sm uppercase tracking-wide group-hover:text-green-400 transition-colors">
                          Udhëtime Ndërqytetase
                        </strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 border border-green-500/30 uppercase whitespace-nowrap">
                          Gjithë Shqipëria
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-gray-300 font-normal leading-relaxed mt-1.5">
                        Tiranë - Durrës, Vlorë, Sarandë, Shkodër, Theth dhe çdo destinacion turistik me komoditet maksimal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature 3: Comfort & VIP */}
                <div className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-purple-500/60 hover:bg-purple-500/[0.06] transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white block font-['Outfit'] text-xs sm:text-sm uppercase tracking-wide group-hover:text-purple-400 transition-colors">
                          Komoditet & Pastërti VIP
                        </strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase whitespace-nowrap">
                          Standard 5★
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-gray-300 font-normal leading-relaxed mt-1.5">
                        Makina moderne të pastra, me kondicioner, hapësirë të madhe për bagazhe dhe shofer miqësor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 01: Instagram Showcase (@taxi_keijsi) */}
      <section className="surface-card p-6 sm:p-10 border border-white/10 space-y-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="section-badge !bg-pink-500/10 !border-pink-500/30 !text-pink-400">
                01. INSTAGRAM @TAXI_KEIJSI
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2.5">
              <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
              <span>Postimet nga @taxi_keijsi</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Momente, makina dhe njoftime zyrtare të shërbimit të taksisë nga llogaria në Instagram
            </p>
          </div>

          <a
            href="https://instagram.com/taxi_keijsi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pink-400 hover:text-pink-300 group transition-colors self-start sm:self-auto py-1"
          >
            <span>Ndiqni @taxi_keijsi</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Grid of Dedicated Taxi Posts */}
        {taxiPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {taxiPosts.map((post) => (
              <TaxiPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white/[0.02] rounded-2xl border border-white/5">
            <InstagramIcon className="w-8 h-8 text-pink-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs text-gray-400">Postimet nga @taxi_keijsi do të sinkronizohen së shpejti.</p>
          </div>
        )}
      </section>

      {/* 3. SECTION 02: Google Business Reviews */}
      <section className="surface-card p-6 sm:p-10 border border-white/10 space-y-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="section-badge !bg-yellow-500/10 !border-yellow-500/30 !text-yellow-400">
                02. GOOGLE BUSINESS REVIEWS
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white font-['Outfit'] flex items-center gap-2.5">
              <GoogleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Vlerësimet e Klientëve ({averageRating} ★)</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Përvojat e verifikuara të klientëve tanë në Google Business dhe Google Maps
            </p>
          </div>

          {/* Leave Review Button */}
          {settings.taxi_google_business_url && (
            <a
              href={settings.taxi_google_business_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !from-yellow-500 !to-amber-600 hover:!from-yellow-400 hover:!to-amber-500 !text-black font-extrabold text-xs !py-3 !px-6 shadow-lg shadow-amber-900/30 self-start sm:self-auto flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-black text-black" />
              <span>Lini një Review në Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Rating Summary Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0b1019] via-[#0d1626] to-[#0b1019] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/10 text-white">
              <GoogleIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  {averageRating}
                </span>
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Bazuar në vlerësimet e vërteta të udhëtarëve në Google Maps
              </p>
            </div>
          </div>

          {settings.taxi_google_business_url && (
            <a
              href={settings.taxi_google_business_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#00b2fe] hover:underline flex items-center gap-1.5"
            >
              <span>Shiko profilin në Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Grid of Reviews */}
        {taxiReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {taxiReviews.map((rev) => (
              <GoogleReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white/[0.02] rounded-2xl border border-white/5">
            <p className="text-xs text-gray-400">Nuk ka ende vlerësime të shfaqura.</p>
          </div>
        )}
      </section>
    </div>
  );
}
