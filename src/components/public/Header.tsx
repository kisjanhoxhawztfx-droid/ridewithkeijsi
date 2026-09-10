"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Home, Tv, Bike, MessageCircle, ChevronRight } from "lucide-react";
import { YouTubeIcon, InstagramIcon, TaxiIcon, CrownIcon } from "@/components/ui/Icons";

interface HeaderProps {
  socialLinks?: Array<{ platform: string; url: string; label: string }>;
}

export default function Header({ socialLinks = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "KREU", href: "/", icon: Home },
    { name: "RIDE WITH KEIJSI", href: "/episodes", icon: Tv },
    { name: "MOTORRA", href: "/motorra", icon: Bike },
    { name: "TAXI KEIJSI", href: "/taxi", icon: TaxiIcon },
    { name: "LUXURY SERVICES", href: "/luxury", icon: CrownIcon, isGold: true },
    { name: "KONTAKT", href: "/contact", icon: MessageCircle },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black border-b border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.95)] py-4 sm:py-5 lg:py-6">
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center justify-between">
          
          {/* LEFT: Mobile Hamburger Button (MAJTAS) & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mobile Menu Toggle Button (MAJTAS / LEFT) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Hap Menunë e Navigimit"
              className="md:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white active:scale-95 transition-all focus:outline-none flex items-center justify-center min-w-[48px] min-h-[48px]"
            >
              <Menu className="w-6 h-6 text-[#00b2fe]" />
            </button>

            {/* Brand Logo & Name (ZMADHUAR ME SHUMË) */}
            <Link href="/" className="flex items-center gap-3.5 sm:gap-4.5 group">
              <div className="relative w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 overflow-hidden rounded-full border-[2.5px] border-[#00b2fe] group-hover:shadow-[0_0_30px_rgba(0,178,254,0.8)] transition-all duration-300 bg-black flex-shrink-0 shadow-xl">
                <Image
                  src="/logo.png"
                  alt="Ride with Keijsi"
                  fill
                  sizes="(max-width: 640px) 56px, 80px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-2xl lg:text-[26px] tracking-wider text-white flex items-center gap-1.5 font-['Outfit'] leading-tight">
                  RIDE WITH <span className="text-[#00b2fe] drop-shadow-[0_0_15px_rgba(0,178,254,0.8)]">KEIJSI</span>
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gray-400 font-bold hidden sm:inline-block mt-0.5">
                  Motorsport & Media
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation (ZMADHUAR) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              
              if (link.isGold) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm sm:text-[15px] lg:text-[16px] font-black tracking-wider transition-all duration-200 relative py-1.5 font-['Outfit'] uppercase flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#ffd700] drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]"
                        : "text-[#ffd700]/95 hover:text-[#ffd700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.7)]"
                    }`}
                  >
                    <CrownIcon className="w-4.5 h-4.5 text-[#ffd700] fill-[#ffd700] animate-pulse" />
                    <span className="bg-gradient-to-r from-[#ffd700] via-[#ffe066] to-[#d4af37] bg-clip-text text-transparent font-black">
                      {link.name}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#ffd700] shadow-[0_0_10px_#ffd700] rounded-full" />
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm sm:text-[15px] lg:text-[16px] font-extrabold tracking-wider transition-all duration-200 relative py-1.5 font-['Outfit'] uppercase ${
                    isActive
                      ? "text-[#00b2fe] drop-shadow-[0_0_12px_rgba(0,178,254,0.8)]"
                      : "text-gray-200 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00b2fe] shadow-[0_0_10px_#00b2fe] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Official Social Channels (YouTube & Instagram Zmadhuar) */}
          <div className="flex items-center gap-3">
            {/* Desktop Socials */}
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-3.5 py-1.5 shadow-md transition-all">
              <a
                href="https://youtube.com/@RideWithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube @RideWithkeijsi"
                className="p-1.5 rounded-full hover:bg-red-600/20 hover:scale-115 transition-all text-red-500 flex items-center justify-center"
                title="Kanal Zyrtar në YouTube"
              >
                <YouTubeIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <div className="w-[1px] h-5 bg-white/20" />
              <a
                href="https://instagram.com/ridewithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @ridewithkeijsi"
                className="p-1.5 rounded-full hover:bg-pink-600/20 hover:scale-115 transition-all text-pink-500 flex items-center justify-center"
                title="Faqja Zyrtare në Instagram"
              >
                <InstagramIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </div>
          </div>

        </div>
      </header>

      {/* Structural Spacer: Perfectly matches enlarged fixed header with zero wasted black gap */}
      <div className="h-20 sm:h-24 lg:h-28 w-full flex-shrink-0" aria-hidden="true" />

      {/* Mobile Side Drawer Menu (Opens from LEFT) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left Side Drawer */}
          <div className="relative z-50 w-[85vw] max-w-sm h-full bg-[#05070a] border-r border-white/15 flex flex-col justify-between p-5 sm:p-6 shadow-[10px_0_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-left duration-300 overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Top Bar: Brand + Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#00b2fe] bg-black">
                    <Image src="/logo.png" alt="Logo" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-base tracking-wider text-white font-['Outfit']">
                      RIDE WITH <span className="text-[#00b2fe]">KEIJSI</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      Menu
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Mbyll Menunë"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
                >
                  <X className="w-5 h-5 text-[#00b2fe]" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1 font-['Outfit']">
                  NAVIGIMI
                </div>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  const isGold = link.isGold;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-xl font-['Outfit'] font-bold text-sm transition-all ${
                        isGold
                          ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700] shadow-[inset_0_0_15px_rgba(255,215,0,0.15)]"
                          : isActive
                          ? "bg-gradient-to-r from-[#00b2fe]/25 to-transparent text-[#00b2fe] border-l-4 border-[#00b2fe] shadow-[inset_0_0_15px_rgba(0,178,254,0.1)]"
                          : "text-gray-200 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isGold
                            ? "bg-[#ffd700]/20 text-[#ffd700]"
                            : isActive
                            ? "bg-[#00b2fe]/20 text-[#00b2fe]"
                            : "bg-white/5 text-gray-400"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={isGold ? "bg-gradient-to-r from-[#ffd700] to-[#f5d061] bg-clip-text text-transparent font-black" : ""}>
                          {link.name}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isGold ? "text-[#ffd700]" : "text-gray-500"}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Official Social Channels */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 font-['Outfit']">
                  KANALET ZYRTARE
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="https://youtube.com/@RideWithkeijsi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold font-['Outfit'] transition-all"
                  >
                    <YouTubeIcon className="w-4 h-4 flex-shrink-0" />
                    <span>YouTube</span>
                  </a>

                  <a
                    href="https://instagram.com/ridewithkeijsi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 border border-pink-600/30 text-pink-400 text-xs font-bold font-['Outfit'] transition-all"
                  >
                    <InstagramIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
