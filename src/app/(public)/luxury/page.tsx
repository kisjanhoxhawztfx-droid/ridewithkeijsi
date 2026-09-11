import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import LuxuryCard from "@/components/public/LuxuryCard";
import { Phone, Shield, Sparkles, HeartHandshake, Plane, Award, CheckCircle2, ChevronRight, Gem } from "lucide-react";
import { WhatsAppIcon, CrownIcon } from "@/components/ui/Icons";

export const revalidate = 60;

export const metadata = {
  title: "LUXURY SERVICES — Makina Luksoze, Limuzina, Maybach, Rolls-Royce me Qira",
  description: "Shërbime ekskluzive me qira për makina luksoze, limuzina, furgona Maybach VIP, Rolls-Royce dhe Bentley me shofer personal 24/7 në Tiranë dhe në të gjithë Shqipërinë. Rezervoni tani me telefon ose WhatsApp.",
};

export default async function LuxuryPage() {
  const [settings, vehicles] = await Promise.all([
    getSiteSettings(),
    db.luxuryVehicle.findMany({
      where: { isVisible: true },
      orderBy: [{ isFeatured: "desc" }, { orderIndex: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const phone = settings.luxury_phone || "+355697738559";
  const whatsapp = settings.luxury_whatsapp || "+355697738559";
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, "");

  return (
    <div className="pt-2 sm:pt-4 pb-24 sm:pb-36 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-10 sm:space-y-16">
      
      {/* 1. HERO SECTION: Luxury Gold Crown Header */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-gradient-to-b from-[#161d2e] via-[#0e131e] to-[#05070a] p-5 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
        {/* Ambient Gold Glows */}
        <div className="absolute -top-28 -left-28 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-[#ffd700]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column: Headlines & Call/WhatsApp CTA */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Gold Crown Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-[#ffd700]/50 text-[11px] font-black text-[#ffd700] tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <CrownIcon className="w-4 h-4 text-[#ffd700] fill-[#ffd700] animate-pulse" />
              <span>EKSKLUZIVITET & PRESTIGJ VIP</span>
              <span className="text-[#ffd700]/50">•</span>
              <span className="text-gray-300 font-bold">24/7 ME SHOFER</span>
            </div>

            {/* Gold Gradient Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] uppercase leading-tight tracking-wide flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-2">
                <CrownIcon className="w-7 h-7 sm:w-10 sm:h-10 text-[#ffd700] drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]" />
                <span>LUXURY</span>
              </span>
              <span className="bg-gradient-to-r from-[#ffd700] via-[#ffe066] to-[#d4af37] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]">
                SERVICES
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed font-normal max-w-xl">
              Shërbime me qira për makina luksoze, limuzina ceremoniale, furgona Maybach VIP, Rolls-Royce dhe Bentley me shofer personal të trajnuar. Përvoja më prestigjioze e udhëtimit në Shqipëri.
            </p>

            {/* Direct Contact Buttons (Phone Call + WhatsApp Booking) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Call Now Button */}
              <a
                href={`tel:${phone}`}
                className="btn-primary !from-[#ffd700] !to-[#b8860b] hover:!from-[#ffe033] hover:!to-[#d4af37] !text-black text-xs sm:text-sm font-black !py-3 !px-6 shadow-[0_0_30px_rgba(255,215,0,0.45)] w-full sm:w-auto text-center flex items-center justify-center gap-2 min-h-[46px] hover:scale-105 transition-all"
              >
                <Phone className="w-3.5 h-3.5 fill-black text-black flex-shrink-0 animate-bounce" />
                <span>Telefono Tani: {phone}</span>
              </a>

              {/* WhatsApp Fast Booking Button */}
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Përshëndetje Luxury Services, dëshiroj të kërkoj informacion dhe rezervim për makinat luksoze.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !from-green-600 !to-emerald-700 hover:!from-green-500 hover:!to-emerald-600 text-xs sm:text-sm font-extrabold !py-3 !px-6 shadow-[0_0_25px_rgba(34,197,94,0.4)] w-full sm:w-auto text-center flex items-center justify-center gap-2 min-h-[46px]"
              >
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                <span>Porosit në WhatsApp</span>
              </a>
            </div>

            {/* Feature Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-2.5 text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 bg-white/5 border border-[#ffd700]/35 px-3 py-1 rounded-full text-gray-300 font-medium">
                <CrownIcon className="w-3 h-3 text-[#ffd700]" />
                Flotë Premium e Zgjedhur
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 font-medium">
                <Shield className="w-3 h-3 text-green-400" />
                Shofer Personal me Kostum
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Konfidencialitet Absolut
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature Box */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-5 sm:p-7 border border-[#ffd700]/40 shadow-[0_0_45px_rgba(255,215,0,0.18)] bg-gradient-to-b from-[#181308]/95 via-[#0e0c06]/95 to-[#050402]/95 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#ffd700]/20">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-[#ffd700]/20 text-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.35)]">
                    <CrownIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#ffe57f] to-white uppercase tracking-wider font-['Outfit']">
                    Kategoritë Kryesore të Flotës
                  </h3>
                </div>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40 uppercase tracking-wider shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                  VIP Elite
                </span>
              </div>

              <div className="space-y-3">
                {/* Category 1: Rolls-Royce & Bentley */}
                <div className="group relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#ffd700]/[0.09] to-white/[0.02] border border-[#ffd700]/30 hover:border-[#ffd700]/80 hover:bg-[#ffd700]/[0.15] transition-all duration-300 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffd700]/35 to-[#ffd700]/10 border border-[#ffd700]/50 flex items-center justify-center text-[#ffd700] shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                      <CrownIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white block font-['Outfit'] text-xs sm:text-sm uppercase tracking-wide group-hover:text-[#ffd700] transition-colors">
                          Rolls-Royce & Bentley
                        </strong>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#ffd700]/25 text-[#ffd700] border border-[#ffd700]/40 uppercase whitespace-nowrap">
                          Ultra Luxury
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-200 font-normal leading-relaxed mt-1">
                        Phantom, Ghost, Flying Spur — niveli më i lartë i madhështisë, stilit dhe prestigjit botëror.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category 2: Maybach VIP Vans */}
                <div className="group relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/[0.09] to-white/[0.02] border border-amber-500/30 hover:border-amber-400/80 hover:bg-amber-500/[0.15] transition-all duration-300 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/35 to-amber-500/10 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white block font-['Outfit'] text-xs sm:text-sm uppercase tracking-wide group-hover:text-amber-400 transition-colors">
                          Furgona Maybach VIP
                        </strong>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/25 text-amber-400 border border-amber-500/40 uppercase whitespace-nowrap">
                          Mobile Lounge
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-200 font-normal leading-relaxed mt-1">
                        Sallon privat ekzekutiv me Smart TV 4K, sedilje masazhi, minibar, Wi-Fi dhe ambient pune.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category 3: Limuzina & SUV Presidencialë */}
                <div className="group relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-yellow-500/[0.09] to-white/[0.02] border border-yellow-500/30 hover:border-yellow-400/80 hover:bg-yellow-500/[0.15] transition-all duration-300 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/35 to-yellow-500/10 border border-yellow-500/50 flex items-center justify-center text-yellow-400 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white block font-['Outfit'] text-xs sm:text-sm uppercase tracking-wide group-hover:text-yellow-400 transition-colors">
                          Limuzina & SUV Presidencialë
                        </strong>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-yellow-500/25 text-yellow-400 border border-yellow-500/40 uppercase whitespace-nowrap">
                          Eskortë & Siguri
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-200 font-normal leading-relaxed mt-1">
                        Mercedes S-Class, Stretch Limousine për evente, Cadillac Escalade me siguri maksimale.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent" />

      {/* 2. FLEET SHOWCASE: Luxury Cars Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="section-badge !bg-amber-500/10 !border-[#ffd700]/40 !text-[#ffd700]">
                👑 FLOTA LUKSOZE
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2.5">
              <CrownIcon className="w-5 h-5 text-[#ffd700]" />
              <span>Zgjidhni Makinën Tuaj të Preferuar</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-400">
              Të gjitha mjetet janë në gjendje perfekte, të dezinfektuara dhe të disponueshme menjëherë me shofer personal.
            </p>
          </div>

          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#ffd700] hover:underline py-1"
          >
            <Phone className="w-4 h-4" />
            <span>Kërkoni Ofertë të Personalizuar</span>
          </a>
        </div>

        {/* Grid of Vehicles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {vehicles.map((vehicle) => (
            <LuxuryCard
              key={vehicle.id}
              vehicle={vehicle}
              contactPhone={phone}
              contactWhatsapp={whatsapp}
            />
          ))}
        </div>
      </section>

      {/* Visual Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />

      {/* 3. VIP SPECIALIZED SERVICES (REFINED & SPACIOUS) */}
      <section className="surface-card p-5 sm:p-8 lg:p-10 border border-[#ffd700]/25 space-y-6 bg-gradient-to-br from-[#0c111a] via-[#070a10] to-[#040609] rounded-2xl sm:rounded-3xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[10px] sm:text-[11px] font-bold text-[#ffd700]">
            <CrownIcon className="w-3.5 h-3.5" />
            <span>SHËRBIME PREMIUM TË DEDIKUARA</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white font-['Outfit']">
            Përvoja VIP për Çdo Event & Rast të Veçantë
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
            Ne kujdesemi për çdo detaj të transportit tuaj me përpikmëri, finesë dhe stil të pashoq.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Card 1: Dasma */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-[#ffd700]/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 flex items-center justify-center text-[#ffd700] shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">Dasma & Ceremoni VIP</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Hyrje madhështore e çiftit me Rolls-Royce, Bentley ose Limuzinë të dekoruar bukur me shofer me kostum formal.
            </p>
          </div>

          {/* Card 2: Airport Transfer */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-blue-400/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">Transferta VIP Rinas (TIA)</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Pritje me tabelë të personalizuar në dalje të aeroportit, ndihmë me valixhet dhe transferim me Maybach ose S-Class.
            </p>
          </div>

          {/* Card 3: Diplomatic Escort */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-green-400/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">Eskortë & Siguri VIP</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Transport i mbrojtur me SUV presidencialë (Escalade / Range Rover) dhe shoferë me përvojë në siguri të lartë.
            </p>
          </div>

          {/* Card 4: Business Meetings */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 hover:border-purple-400/40 hover:bg-white/[0.07] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-sm">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white font-['Outfit']">Zyre e Lëvizshme në Rrugë</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Furgoni Maybach ju ofron Wi-Fi 5G, Smart TV, tavolina pune dhe izolim zëri për të punuar gjatë udhëtimit.
            </p>
          </div>
        </div>
      </section>

      {/* 4. INSTANT CONTACT CTA (COMPACT, REFINED & SEPARATED WITH BREATHING ROOM) */}
      <div className="w-full flex justify-center items-center pt-6 sm:pt-10 pb-4">
        <section className="relative rounded-2xl overflow-hidden border border-[#ffd700]/30 bg-gradient-to-r from-[#140f04] via-[#090702] to-[#140f04] p-5 sm:p-6 max-w-xl sm:max-w-2xl w-full mx-auto shadow-[0_0_30px_rgba(255,215,0,0.1)] text-center space-y-3">
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[10px] font-black uppercase tracking-wider text-[#ffd700]">
              <CrownIcon className="w-3 h-3 fill-[#ffd700]" />
              <span>REZERVIM I MENJËHERSHËM</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Dëshironi të Rezervoni një Makinë Luksoze?
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              Na kontaktoni drejtpërdrejt në telefon ose WhatsApp për ofertë të personalizuar dhe konfirmim të menjëhershëm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2.5 pt-1">
            <a
              href={`tel:${phone}`}
              className="btn-primary !from-[#ffd700] !to-[#b8860b] !text-black font-extrabold text-xs !py-2.5 !px-5 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.35)] flex items-center gap-2 w-full sm:w-auto justify-center hover:scale-105 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-black text-black" />
              <span>Telefono: {phone}</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Përshëndetje Luxury Services, dëshiroj të rezervoj një makinë luksoze.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !from-green-600 !to-emerald-700 text-xs font-bold !py-2.5 !px-5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2 w-full sm:w-auto justify-center hover:scale-105 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Porosit në WhatsApp</span>
            </a>
          </div>
        </section>
      </div>

    </div>
  );
}
