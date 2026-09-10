"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Tv,
  Bike,
  Megaphone,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
  Car,
  Crown,
} from "lucide-react";
import { CrownIcon } from "@/components/ui/Icons";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {
        router.replace("/admin/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#00b2fe] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-gray-400 font-['Outfit'] tracking-wider uppercase">
            Po ngarkohet Paneli...
          </span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Përmbledhja", href: "/admin", icon: LayoutDashboard },
    { name: "YouTube / Episodet", href: "/admin/episodes", icon: Tv },
    { name: "Motorra në Shitje", href: "/admin/motorra", icon: Bike },
    { name: "Instagram Auto-Sync", href: "/admin/instagram", icon: ExternalLink },
    { name: "Luxury Services 👑", href: "/admin/luxury", icon: Crown, isGold: true },
    { name: "Taxi Keijsi 24/7", href: "/admin/taxi", icon: Car },
    { name: "Reklamat & Sponsorët", href: "/admin/ads", icon: Megaphone },
    { name: "Seksionet e Faqes", href: "/admin/sections", icon: Layers },
    { name: "Cilësimet & Branding", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0a0f16] border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#00b2fe] bg-black">
            <Image src="/logo.png" alt="Logo" fill sizes="32px" className="object-cover" />
          </div>
          <span className="font-extrabold text-sm font-['Outfit'] text-white">
            ADMIN <span className="text-[#00b2fe]">PANEL</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#080c13] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#00b2fe] bg-black">
              <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wider font-['Outfit'] text-white">
                RIDE WITH <span className="text-[#00b2fe]">KEIJSI</span>
              </div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                Paneli i Administrimit
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    item.isGold
                      ? isActive
                        ? "bg-[#ffd700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] font-black"
                        : "text-[#ffd700] hover:bg-[#ffd700]/10"
                      : isActive
                      ? "bg-[#00b2fe] text-black shadow-[0_0_15px_rgba(0,178,254,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            <span>Shiko Faqen Publike</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#00b2fe]" />
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">{user?.username || "Admin"}</span>
              <span className="text-[10px] text-gray-500">{user?.email || "admin@ridewithkeijsi.com"}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              title="Dil nga Sistemi"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-h-screen bg-[#05070a] p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
