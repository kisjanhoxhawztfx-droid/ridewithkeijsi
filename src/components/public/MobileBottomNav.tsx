"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tv, Bike, Car, Crown, MessageCircle } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Navigation tabs designed for mobile thumbs like Instagram / TikTok
  const navItems = [
    {
      label: "Kreu",
      href: "/",
      icon: Home,
      exact: true,
    },
    {
      label: "Episodet",
      href: "/episodes",
      icon: Tv,
    },
    {
      label: "Motorra",
      href: "/motorra",
      icon: Bike,
    },
    {
      label: "Taxi 24/7",
      href: "/taxi",
      icon: Car,
    },
    {
      label: "Luxury",
      href: "/luxury",
      icon: Crown,
      isGold: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/95 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.85)] px-2 pt-1.5 pb-safe"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 8px), 8px)" }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          if (item.isGold) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 group active:scale-90"
              >
                {/* Active Glow Ambient */}
                {isActive && (
                  <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent rounded-full shadow-[0_0_12px_#ffd700]" />
                )}
                
                <div
                  className={`relative p-1 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-[#ffd700] scale-110 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
                      : "text-amber-300/70 group-hover:text-[#ffd700]"
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ffd700]" />
                  )}
                </div>

                <span
                  className={`text-[10px] font-extrabold tracking-wider font-['Outfit'] mt-0.5 transition-colors ${
                    isActive
                      ? "text-[#ffd700]"
                      : "text-amber-200/60 group-hover:text-amber-200"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 group active:scale-90"
            >
              {/* Active Indicator Top Notch */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-transparent via-[#00b2fe] to-transparent rounded-full shadow-[0_0_12px_#00b2fe]" />
              )}

              <div
                className={`relative p-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-[#00b2fe] scale-110 drop-shadow-[0_0_12px_rgba(0,178,254,0.9)]"
                    : "text-gray-400 group-hover:text-gray-200"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00b2fe]" />
                )}
              </div>

              <span
                className={`text-[10px] font-extrabold tracking-wider font-['Outfit'] mt-0.5 transition-colors ${
                  isActive
                    ? "text-[#00b2fe]"
                    : "text-gray-400 group-hover:text-gray-200"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
