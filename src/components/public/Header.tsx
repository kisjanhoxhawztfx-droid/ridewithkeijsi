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
  const [isStandalone, setIsStandalone] = useState(false);
  const pathname = usePathname();

  // Detect if running as standalone WebApp (PWA / Add to Home Screen)
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      setIsStandalone(Boolean(isStandaloneMode));
    };

    checkStandalone();
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handler = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    mediaQuery.addEventListener?.("change", handler);
    return () => mediaQuery.removeEventListener?.("change", handler);
  }, []);

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
      {/* 
        Fixed Top Header:
        - When running as standalone WebApp on mobile: Hidden completely because user navigates via the native-style bottom dock!
        - When regular web: Visible, sleek, perfectly structured.
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.95)] py-3 sm:py-5 lg:py-6 transition-all ${
          isStandalone ? "hidden md:block" : "block"
        }`}
      >
        <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex items-center justify-between">
          
          {/* LEFT: Mobile Hamburger Button & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-5">
            {/* Mobile Menu Toggle Button (Visible only on regular mobile web) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Hap Menunë e Navigimit"
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white active:scale-95 transition-all focus:outline-none flex items-center justify-center min-w-[42px] min-h-[42px] shadow-sm"
            >
              <Menu className="w-5 h-5 text-[#00b2fe]" />
            </button>

            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-4.5 group">
              <div className="relative w-11 h-11 sm:w-18 sm:h-18 lg:w-20 lg:h-20 overflow-hidden rounded-full border-[2px] sm:border-[2.5px] border-[#00b2fe] group-hover:shadow-[0_0_30px_rgba(0,178,254,0.8)] transition-all duration-300 bg-black flex-shrink-0 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="Ride with Keijsi"
                  fill
                  sizes="(max-width: 640px) 44px, 80px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-2xl lg:text-[26px] tracking-wider text-white flex items-center gap-1 font-['Outfit'] leading-tight">
                  RIDE WITH <span className="text-[#00b2fe] drop-shadow-[0_0_15px_rgba(0,178,254,0.8)]">KEIJSI</span>
                </span>
                <span className="text-[9px] sm:text-xs tracking-[0.25em] uppercase text-gray-400 font-bold hidden sm:inline-block mt-0.5">
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

      {/* Structural Spacer: Matches header height on web, collapses to 0 on standalone PWA mobile */}
      <div
        className={`w-full flex-shrink-0 transition-all ${
          isStandalone ? "h-0 md:h-24 lg:h-28" : "h-16 sm:h-24 lg:h-28"
        }`}
        aria-hidden="true"
      />

      {/* Mobile Side Drawer Menu (Opens from LEFT) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left Side Drawer - Compact & Perfectly Structured (~270px width) */}
          <div className="relative z-50 w-[72vw] max-w-[275px] h-full bg-[#070b12] border-r border-white/15 flex flex-col justify-between p-4 sm:p-5 shadow-[15px_0_50px_rgba(0,0,0,0.95)] animate-in slide-in-from-left duration-250 overflow-y-auto">
            
            <div className="space-y-4">
              {/* Drawer Top Bar: Brand + Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#00b2fe] bg-black shadow-md flex-shrink-0">
                    <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm tracking-wider text-white font-['Outfit'] leading-tight">
                      RIDE WITH <span className="text-[#00b2fe]">KEIJSI</span>
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      Menu
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Mbyll Menunë"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
                >
                  <X className="w-4 h-4 text-[#00b2fe]" />
                </button>
              </div>

              {/* Navigation Links - Spacious Touch Targets, Easy to Click */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1 font-['Outfit']">
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
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-['Outfit'] font-bold text-xs tracking-wide transition-all min-h-[44px] ${
                        isGold
                          ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-l-4 border-[#ffd700] text-[#ffd700] shadow-[inset_0_0_15px_rgba(255,215,0,0.15)]"
                          : isActive
                          ? "bg-gradient-to-r from-[#00b2fe]/25 to-transparent text-[#00b2fe] border-l-4 border-[#00b2fe] shadow-[inset_0_0_15px_rgba(0,178,254,0.1)]"
                          : "text-gray-200 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                          isGold
                            ? "bg-[#ffd700]/20 text-[#ffd700]"
                            : isActive
                            ? "bg-[#00b2fe]/20 text-[#00b2fe]"
                            : "bg-white/5 text-gray-400"
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={isGold ? "bg-gradient-to-r from-[#ffd700] to-[#f5d061] bg-clip-text text-transparent font-black" : ""}>
                          {link.name}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isGold ? "text-[#ffd700]" : "text-gray-500"}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Official Social Channels */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 font-['Outfit']">
                  KANALET ZYRTARE
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://youtube.com/@RideWithkeijsi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 text-[11px] font-bold font-['Outfit'] transition-all min-h-[38px]"
                  >
                    <YouTubeIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>YouTube</span>
                  </a>

                  <a
                    href="https://instagram.com/ridewithkeijsi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-pink-600/10 hover:bg-pink-600/20 border border-pink-600/30 text-pink-400 text-[11px] font-bold font-['Outfit'] transition-all min-h-[38px]"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 flex-shrink-0" />
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
