import db from "@/lib/db";
import Link from "next/link";
import {
  Tv,
  Bike,
  Megaphone,
  MousePointerClick,
  Eye,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export const revalidate = 0; // Dynamic real-time metrics

export default async function AdminDashboardPage() {
  const [
    totalEpisodes,
    latestEpisode,
    totalMotorcycles,
    activeMotorcycles,
    totalAds,
    activeAds,
    adStats,
    youtubeLogs,
    instagramLogs,
  ] = await Promise.all([
    db.episode.count(),
    db.episode.findFirst({ orderBy: { publishedAt: "desc" } }),
    db.motorcycle.count(),
    db.motorcycle.count({ where: { status: "FOR_SALE", isVisible: true } }),
    db.advertisement.count(),
    db.advertisement.count({ where: { status: "ACTIVE" } }),
    db.advertisement.aggregate({
      _sum: { totalImpressions: true, totalClicks: true },
    }),
    db.syncLog.findMany({
      where: { platform: "YOUTUBE" },
      orderBy: { startedAt: "desc" },
      take: 3,
    }),
    db.syncLog.findMany({
      where: { platform: "INSTAGRAM" },
      orderBy: { startedAt: "desc" },
      take: 3,
    }),
  ]);

  const totalImpressions = adStats._sum.totalImpressions || 0;
  const totalClicks = adStats._sum.totalClicks || 0;
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00b2fe] animate-pulse" />
            <span className="text-xs font-bold text-[#00b2fe] uppercase tracking-wider font-['Outfit']">
              KONTROLLI QENDROR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Paneli i Administrimit
          </h1>
          <p className="text-xs text-gray-400">
            Mirësevini! Menaxhoni episodet e YouTube, motorrat nga Instagrami, dhe fushatat e reklamave.
          </p>
        </div>

        {/* Quick Action Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/episodes"
            className="btn-primary !py-2 !px-3.5 text-xs font-bold shadow-[0_0_15px_rgba(0,178,254,0.3)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkronizo YouTube</span>
          </Link>
          <Link
            href="/admin/ads"
            className="btn-secondary !py-2 !px-3.5 text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Krijo Reklamë</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Episodes */}
        <div className="surface-card p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Episodet YouTube</span>
            <div className="p-2 rounded-lg bg-red-600/10 text-red-500 border border-red-600/20">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-['Outfit']">{totalEpisodes}</div>
          <div className="text-[11px] text-gray-400 mt-2 truncate">
            Më i fundit: <span className="text-gray-300 font-semibold">{latestEpisode?.title || "Asnjë"}</span>
          </div>
        </div>

        {/* Motorra for Sale */}
        <div className="surface-card p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Motorra në Shitje</span>
            <div className="p-2 rounded-lg bg-pink-600/10 text-pink-400 border border-pink-600/20">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-['Outfit']">{activeMotorcycles}</div>
          <div className="text-[11px] text-gray-400 mt-2">
            Gjithsej në sistem: <span className="text-gray-300 font-semibold">{totalMotorcycles} motorra</span>
          </div>
        </div>

        {/* Active Advertisements */}
        <div className="surface-card p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reklama Aktive</span>
            <div className="p-2 rounded-lg bg-[#00b2fe]/10 text-[#00b2fe] border border-[#00b2fe]/20">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-['Outfit']">{activeAds}</div>
          <div className="text-[11px] text-gray-400 mt-2">
            Gjithsej fushata: <span className="text-gray-300 font-semibold">{totalAds}</span>
          </div>
        </div>

        {/* Ad Performance (Impressions & CTR) */}
        <div className="surface-card p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Performanca e Reklamave</span>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-['Outfit']">{totalClicks}</div>
          <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between">
            <span>{totalImpressions.toLocaleString()} shikime</span>
            <span className="text-green-400 font-bold">CTR: {ctr}%</span>
          </div>
        </div>
      </div>

      {/* Integration Status & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* YouTube API Connection Card */}
        <div className="surface-card p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/10 text-red-500 border border-red-600/30">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">Integrimi i YouTube</h3>
                <p className="text-[11px] text-gray-400">YouTube Data API v3 & Player Embed</p>
              </div>
            </div>

            <Link
              href="/admin/episodes"
              className="text-xs font-bold text-[#00b2fe] hover:underline flex items-center gap-1"
            >
              <span>Menaxho</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-gray-400">Gjendja e API:</span>
              <span className="font-semibold text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Aktiv & Gati
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-gray-400">Sinkronizimi i fundit:</span>
              <span className="font-semibold text-gray-300">
                {youtubeLogs[0] ? new Date(youtubeLogs[0].startedAt).toLocaleString("sq-AL") : "I suksesshëm"}
              </span>
            </div>
          </div>
        </div>

        {/* Instagram API Connection Card */}
        <div className="surface-card p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-600/10 text-pink-400 border border-pink-600/30">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Outfit']">Integrimi i Motorra (Instagram)</h3>
                <p className="text-[11px] text-gray-400">Meta / Instagram Graph API & Curation</p>
              </div>
            </div>

            <Link
              href="/admin/motorra"
              className="text-xs font-bold text-[#00b2fe] hover:underline flex items-center gap-1"
            >
              <span>Menaxho</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-gray-400">Gjendja e Motorra:</span>
              <span className="font-semibold text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Gati për Postime & Sinkronizim
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-gray-400">Llogaria e lidhur:</span>
              <span className="font-semibold text-pink-400">@ridewithkeijsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
