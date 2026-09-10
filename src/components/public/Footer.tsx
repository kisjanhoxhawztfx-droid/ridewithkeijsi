import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { YouTubeIcon, InstagramIcon, TikTokIcon, FacebookIcon, CrownIcon } from "@/components/ui/Icons";

interface FooterProps {
  socialLinks?: Array<{ platform: string; url: string; label: string }>;
  siteName?: string;
  tagline?: string;
  email?: string;
}

export default function Footer({
  socialLinks = [],
  siteName = "Ride with Keijsi",
  tagline = "Emisioni & Platforma Numër Një për Motorra dhe Motorsport në Shqipëri",
  email = "contact@ridewithkeijsi.com",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#030508] border-t border-white/10 relative overflow-hidden w-full">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#00b2fe]/60 to-transparent" />

      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 pb-8 sm:pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#00b2fe]/40 bg-black flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt={siteName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white font-['Outfit']">
                RIDE WITH <span className="text-[#00b2fe]">KEIJSI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed">
              {tagline}
            </p>
            <div className="flex items-center flex-wrap gap-2.5 pt-2">
              <a
                href="https://youtube.com/@RideWithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:border-red-500/40 hover:scale-105 transition-all"
                title="YouTube"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/ridewithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00b2fe] hover:bg-[#00b2fe]/20 hover:border-[#00b2fe]/40 hover:scale-105 transition-all"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@keijsi09"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:scale-105 transition-all"
                title="TikTok @keijsi09"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://web.facebook.com/people/Ride-With-Keijsi/61579447413922/#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 hover:bg-blue-600/20 hover:border-blue-500/40 hover:scale-105 transition-all"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00b2fe] hover:bg-[#00b2fe]/20 hover:border-[#00b2fe]/40 hover:scale-105 transition-all"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase font-['Outfit']">
              NAVIGIMI
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#00b2fe] transition-colors flex items-center gap-1 group py-1">
                  <span>Kreu</span>
                </Link>
              </li>
              <li>
                <Link href="/episodes" className="text-gray-400 hover:text-[#00b2fe] transition-colors flex items-center gap-1 group py-1">
                  <span>Ride with Keijsi (Episodet)</span>
                </Link>
              </li>
              <li>
                <Link href="/motorra" className="text-gray-400 hover:text-[#00b2fe] transition-colors flex items-center gap-1 group py-1">
                  <span>Motorra në Shitje</span>
                </Link>
              </li>
              <li>
                <Link href="/luxury" className="text-[#ffd700] hover:text-[#ffe066] transition-colors flex items-center gap-1.5 group py-1 font-bold">
                  <CrownIcon className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>Luxury Services (Makina VIP)</span>
                </Link>
              </li>
              <li>
                <Link href="/taxi" className="text-gray-400 hover:text-[#00b2fe] transition-colors flex items-center gap-1 group py-1">
                  <span>Taxi Keijsi 24/7</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#00b2fe] transition-colors flex items-center gap-1 group py-1">
                  <span>Kontakti & Reklamimi</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Business, Luxury & Taxi */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-[#ffd700] uppercase font-['Outfit'] flex items-center gap-1.5">
                <CrownIcon className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>LUXURY SERVICES</span>
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Makina luksoze, Limuzina & Maybach me shofer 24/7.
              </p>
              <a
                href="tel:+355697738559"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffd700] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+355 69 773 8559</span>
              </a>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase font-['Outfit']">
                SHËRBIMI I TAKSISË
              </h3>
              <Link
                href="/taxi"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#00b2fe] hover:text-[#00d2ff] group py-0.5"
              >
                <span>Porosit Taxi Keijsi 24/7</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-gray-500 gap-3 text-center sm:text-left">
          <div>
            © {currentYear} {siteName}. Të gjitha të drejtat të rezervuara.
          </div>
          <div className="text-gray-500 font-medium">
            Motorsport & Media Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
