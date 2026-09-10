import { getSiteSettings, getSocialLinks } from "@/lib/settings";
import { Mail, Phone, MapPin, Send, MessageCircle, Sparkles, User, MessageSquare, CheckCircle2, ShieldCheck } from "lucide-react";
import { YouTubeIcon, InstagramIcon } from "@/components/ui/Icons";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Kontakti — Ride with Keijsi",
  description: "Lidhuni me Keijsin për bashkëpunime, sponsorizime, reklamim në emision, shitje motorri ose shërbime të veçanta.",
};

export default async function ContactPage() {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);

  return (
    <div className="pt-1 sm:pt-3 pb-20 sm:pb-28 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-12 sm:space-y-16">
      {/* 1. Header Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-[#00b2fe]/35 bg-gradient-to-b from-[#0c1424] via-[#080d17] to-[#04060a] p-8 sm:p-14 shadow-2xl text-center space-y-5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00b2fe]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00b2fe]/15 border border-[#00b2fe]/30 text-xs font-black text-[#00d2ff] tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
            <MessageCircle className="w-4 h-4 text-[#00b2fe]" />
            <span>KONTAKTI & BASHKËPUNIMET ZYRTARE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-['Outfit'] uppercase leading-tight tracking-wide">
            LIDHUNI ME <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-white drop-shadow-[0_0_20px_rgba(0,178,254,0.6)]">KEIJSIN</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Keni një motorr ose makinë të veçantë për ta testuar në emision? Dëshironi të reklamoni biznesin tuaj, të porosisni shërbime apo të postoni në Motorra? Na shkruani!
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        {/* Left Column: Direct Info & Social Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Channel Card */}
          <div className="relative rounded-3xl p-6 sm:p-8 border border-white/15 bg-gradient-to-b from-[#0d1627]/95 via-[#070d18]/95 to-[#04070e]/95 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#00b2fe] bg-black flex-shrink-0 shadow-[0_0_15px_rgba(0,178,254,0.35)]">
                  <Image src="/logo.png" alt="Ride with Keijsi" fill sizes="56px" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base sm:text-lg font-extrabold text-white font-['Outfit']">Ride with Keijsi</h3>
                    <CheckCircle2 className="w-4 h-4 text-[#00b2fe]" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Motorsport & Media Platform</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#00b2fe]/15 text-[#00d2ff] border border-[#00b2fe]/30 uppercase tracking-wider">
                Zyrtar
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Email Box */}
              <a
                href={`mailto:${settings.contact_email}`}
                className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-[#00b2fe]/60 hover:bg-[#00b2fe]/[0.06] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(0,178,254,0.2)]"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00b2fe]/30 to-[#00b2fe]/10 border border-[#00b2fe]/40 flex items-center justify-center text-[#00d2ff] shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Email Zyrtar</span>
                    <span className="text-[10px] font-bold text-[#00b2fe]">Dërgo Email ↗</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#00d2ff] transition-colors mt-0.5">
                    {settings.contact_email || "contact@ridewithkeijsi.com"}
                  </div>
                </div>
              </a>

              {/* Phone / WhatsApp Box */}
              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-green-500/60 hover:bg-green-500/[0.06] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/30 to-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Telefon & WhatsApp</span>
                      <span className="text-[10px] font-bold text-green-400">Telefono ↗</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-green-400 transition-colors mt-0.5">
                      {settings.contact_phone}
                    </div>
                  </div>
                </a>
              )}

              {/* Location Box */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.02] border border-white/10 shadow-md">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Vendndodhja Kryesore</span>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {settings.contact_address || "Tiranë, Shqipëri"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels Showcase */}
          <div className="relative rounded-3xl p-6 sm:p-7 border border-white/15 bg-gradient-to-b from-[#0d1627]/95 via-[#070d18]/95 to-[#04070e]/95 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-xs font-black text-gray-300 uppercase tracking-widest font-['Outfit']">
                RRJETET SOCIALE ZYRTARE
              </h4>
              <span className="text-[10px] text-gray-400 font-bold">@RideWithKeijsi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* YouTube Card */}
              <a
                href="https://youtube.com/@RideWithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-red-600/15 to-white/[0.02] hover:bg-red-600/25 border border-red-600/35 hover:border-red-500 shadow-md hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-600/25 text-red-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                    <YouTubeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block uppercase tracking-wide">YouTube</span>
                    <span className="text-[10px] text-gray-400 font-medium">Abonohu Tani</span>
                  </div>
                </div>
                <span className="text-red-400 group-hover:translate-x-1 transition-transform font-bold">↗</span>
              </a>

              {/* Instagram Card */}
              <a
                href="https://instagram.com/ridewithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#00b2fe]/15 to-white/[0.02] hover:bg-[#00b2fe]/25 border border-[#00b2fe]/35 hover:border-[#00b2fe] shadow-md hover:shadow-[0_0_20px_rgba(0,178,254,0.3)] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#00b2fe]/25 text-[#00b2fe] group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,178,254,0.3)]">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block uppercase tracking-wide">Instagram</span>
                    <span className="text-[10px] text-gray-400 font-medium">Ndiqni Prapaskenat</span>
                  </div>
                </div>
                <span className="text-[#00b2fe] group-hover:translate-x-1 transition-transform font-bold">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Message Form */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl p-6 sm:p-10 border border-white/15 bg-gradient-to-b from-[#0d1627]/95 via-[#070d18]/95 to-[#04070e]/95 backdrop-blur-xl shadow-2xl space-y-7">
            <div className="space-y-2 pb-4 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00b2fe]/15 border border-[#00b2fe]/30 text-xs font-black text-[#00d2ff] tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#00b2fe]" />
                <span>FORMULARI I BASHKËPUNIMIT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                Dërgoni një Mesazh
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Përgjigjemi zakonisht brenda 24 orëve për çdo kërkesë bashkëpunimi, sponsorizimi, reklamimi apo sugjerimi.
              </p>
            </div>

            <form
              action={`mailto:${settings.contact_email || "contact@ridewithkeijsi.com"}`}
              method="GET"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-200 uppercase font-['Outfit'] tracking-wider">
                    <User className="w-3.5 h-3.5 text-[#00b2fe]" />
                    <span>Emri dhe Mbiemri *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="p.sh. Alban Berisha"
                    className="w-full bg-[#0a0f1d] border-2 border-white/15 hover:border-white/30 focus:border-[#00b2fe] focus:bg-[#0c1629] focus:ring-4 focus:ring-[#00b2fe]/20 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 font-medium transition-all outline-none shadow-inner"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-gray-200 uppercase font-['Outfit'] tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-[#00b2fe]" />
                    <span>Email Adresa Juaj *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@shembull.com"
                    className="w-full bg-[#0a0f1d] border-2 border-white/15 hover:border-white/30 focus:border-[#00b2fe] focus:bg-[#0c1629] focus:ring-4 focus:ring-[#00b2fe]/20 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 font-medium transition-all outline-none shadow-inner"
                  />
                </div>
              </div>

              {/* Request Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-200 uppercase font-['Outfit'] tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#00b2fe]" />
                  <span>Lloji i Kërkesës ose Bashkëpunimit</span>
                </label>
                <select className="w-full bg-[#0a0f1d] border-2 border-white/15 hover:border-white/30 focus:border-[#00b2fe] focus:bg-[#0c1629] focus:ring-4 focus:ring-[#00b2fe]/20 rounded-2xl px-5 py-4 text-sm text-white font-medium transition-all outline-none cursor-pointer shadow-inner">
                  <option className="bg-[#0a0f1d] text-white">Reklamim / Sponsorizim në Emision</option>
                  <option className="bg-[#0a0f1d] text-white">Postim Motorri në Shitje (Motorra Marketplace)</option>
                  <option className="bg-[#0a0f1d] text-white">Rezervim Makine Luksoze (Luxury Services)</option>
                  <option className="bg-[#0a0f1d] text-white">Porosi ose Bashkëpunim me Taxi Keijsi</option>
                  <option className="bg-[#0a0f1d] text-white">Sugjerim Makine / Motorri për Testim në Emision</option>
                  <option className="bg-[#0a0f1d] text-white">Kërkesë e Përgjithshme / Tjetër</option>
                </select>
              </div>

              {/* Message Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black text-gray-200 uppercase font-['Outfit'] tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5 text-[#00b2fe]" />
                  <span>Përshkrimi i Kërkesës Suaj *</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Përshkruani kërkesën tuaj me të gjitha detajet (modeli i mjetit, data e dëshiruar, ose propozimi i biznesit)..."
                  className="w-full bg-[#0a0f1d] border-2 border-white/15 hover:border-white/30 focus:border-[#00b2fe] focus:bg-[#0c1629] focus:ring-4 focus:ring-[#00b2fe]/20 rounded-2xl p-5 text-sm text-white placeholder-gray-500 font-medium transition-all outline-none resize-none shadow-inner"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-primary !from-[#00b2fe] !via-[#0092d6] !to-[#0074b7] hover:!from-[#00c5ff] hover:!to-[#008fe3] text-sm sm:text-base font-black !py-4.5 !px-8 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(0,178,254,0.5)] hover:shadow-[0_0_50px_rgba(0,178,254,0.7)] hover:scale-[1.01] transition-all uppercase tracking-wider text-white cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>Dërgo Mesazhin Direkt</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Të dhënat tuaja trajtohen me konfidencialitet të plotë profesional.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

