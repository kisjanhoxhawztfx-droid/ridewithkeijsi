import Link from "next/link";
import db from "@/lib/db";
import EpisodeCard from "@/components/public/EpisodeCard";
import InstagramPostCard from "@/components/public/InstagramPostCard";
import ForYouGrid from "@/components/public/ForYouGrid";
import { Tv, Search, Flame, Sparkles, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export const revalidate = 60;

interface EpisodesPageProps {
  searchParams: Promise<{
    search?: string;
    tab?: string;
  }>;
}

export default async function EpisodesPage({ searchParams }: EpisodesPageProps) {
  const { search, tab } = await searchParams;
  const activeTab = tab || "episodes";

  const whereClause: {
    isVisible: boolean;
    OR?: Array<{ title: { contains: string } } | { description: { contains: string } }>;
  } = {
    isVisible: true,
  };

  if (search && search.trim()) {
    whereClause.OR = [
      { title: { contains: search.trim() } },
      { description: { contains: search.trim() } },
    ];
  }

  const [episodes, forYouPosts] = await Promise.all([
    db.episode.findMany({
      where: whereClause,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    }),
    db.instagramPost.findMany({
      where: { isVisible: true, category: "EPISOD" },
      orderBy: { postedAt: "desc" },
    }),
  ]);



  return (
    <div className="pt-1 sm:pt-3 pb-20 sm:pb-28 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-8 sm:space-y-12">
      
      {/* 1. Header Banner Hero */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e1626] via-[#080d17] to-[#04060a] p-6 sm:p-10 lg:p-12 shadow-2xl text-center space-y-4 sm:space-y-5">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00b2fe]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00b2fe]/15 border border-[#00b2fe]/30 text-[11px] font-black text-[#00d2ff] tracking-wider uppercase backdrop-blur-md">
            <Tv className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>EMISIONI &amp; PODCASTI ZYRTAR</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] uppercase leading-tight tracking-wide">
            RIDE WITH <span className="text-[#00b2fe] drop-shadow-[0_0_20px_rgba(0,178,254,0.6)]">KEIJSI</span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Shikoni të gjitha episodet e plota me teste motorrash, makina sportive, udhëtime epike nëpër Shqipëri dhe intervista ekskluzive nga kanali zyrtar @RideWithkeijsi.
          </p>

          {/* Search Bar */}
          <div className="pt-4 pb-2 max-w-xl mx-auto">
            <form method="GET" className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="Kërko episode sipas titullit ose të ftuarit..."
                className="w-full bg-[#05080e] border border-white/20 focus:border-[#00b2fe] rounded-xl pl-11 pr-28 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(0,178,254,0.35)]"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#00b2fe] hover:bg-[#00d2ff] text-black font-extrabold text-xs rounded-lg transition-all shadow-md active:scale-95"
              >
                Kërko
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Butonat: Episodet / For You */}
      <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
        <Link
          href="/episodes"
          className={`group relative flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-extrabold transition-all duration-300 shadow-md active:scale-95 ${
            activeTab !== "foryou"
              ? "bg-[#00b2fe] text-black shadow-[0_0_24px_rgba(0,178,254,0.4)] border border-[#00d2ff]"
              : "bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/10 hover:border-white/25"
          }`}
        >
          <Tv className={`w-5 h-5 transition-transform group-hover:scale-110 ${
            activeTab !== "foryou" ? "text-black stroke-[2.5]" : "text-[#00b2fe]"
          }`} />
          <span>Episodet YouTube</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-black transition-colors ${
              activeTab !== "foryou"
                ? "bg-black/20 text-black"
                : "bg-white/10 text-gray-300 group-hover:bg-white/20"
            }`}
          >
            {episodes.length}
          </span>
        </Link>

        <Link
          href="/episodes?tab=foryou"
          className={`group relative flex items-center gap-3 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-sm sm:text-base font-extrabold transition-all duration-300 shadow-md active:scale-95 ${
            activeTab === "foryou"
              ? "bg-gradient-to-r from-[#00b2fe] to-[#0077b6] text-black shadow-[0_0_24px_rgba(0,178,254,0.45)] border border-[#00b2fe]"
              : "bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/10 hover:border-[#00b2fe]/40"
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${
            activeTab === "foryou" ? "fill-black text-black" : "text-[#00b2fe] fill-[#00b2fe]/20"
          }`} />
          <span>For You</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-black transition-colors ${
              activeTab === "foryou"
                ? "bg-black/25 text-black"
                : "bg-white/10 text-gray-300 group-hover:bg-white/20"
            }`}
          >
            {forYouPosts.length}
          </span>
          {forYouPosts.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activeTab === "foryou"
                  ? "bg-black text-[#00b2fe] shadow-sm"
                  : "bg-[#00b2fe]/20 text-[#00b2fe] border border-[#00b2fe]/30 animate-pulse"
              }`}
            >
              NEW
            </span>
          )}
        </Link>
      </div>

      {/* 3. Content based on active tab */}
      {activeTab !== "foryou" ? (
        /* Episodes Grid */
        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#00b2fe]" />
              <span>
                Duke shfaqur <strong className="text-white font-bold">{episodes.length}</strong> episode të plota
                {search ? ` për "${search}"` : ""}
              </span>
            </div>
            {search && (
              <Link href="/episodes" className="text-[#00b2fe] hover:underline font-bold self-start sm:self-auto">
                Pastro kërkimin
              </Link>
            )}
          </div>

          {episodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          ) : (
            <div className="surface-card p-12 text-center max-w-md mx-auto space-y-4 rounded-3xl border border-white/10">
              <Sparkles className="w-10 h-10 text-[#00b2fe] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white font-['Outfit']">Nuk u gjet asnjë episod</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Nuk ka episode që përputhen me kërkimin tuaj. Provoni me një fjalë tjetër kyçe.
              </p>
              <Link href="/episodes" className="btn-secondary text-xs inline-flex mt-2">
                Kthehu te të gjitha episodet
              </Link>
            </div>
          )}
        </section>
      ) : (
        /* For You Section — #episod posts from @ridewithkeijsi */
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <InstagramIcon className="w-4 h-4 text-[#00b2fe]" />
              <span>
                <strong className="text-white font-bold">{forYouPosts.length}</strong> postime nga @ridewithkeijsi me <strong className="text-[#00b2fe]">#episod</strong>
              </span>
            </div>
            <span className="text-xs text-[#00b2fe] font-bold">Kliko mbi një video për ta hapur</span>
          </div>

          {forYouPosts.length > 0 ? (
            <ForYouGrid posts={forYouPosts} />
          ) : (
            <div className="surface-card p-12 text-center max-w-md mx-auto space-y-4 rounded-3xl border border-white/10">
              <Heart className="w-10 h-10 text-[#00b2fe] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white font-[&apos;Outfit&apos;]">For You — Së Shpejti</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Kur @ridewithkeijsi poston në Instagram me <strong className="text-[#00b2fe]">#episod</strong>, postimet shfaqen automatikisht këtu.
              </p>
              <a
                href="https://instagram.com/ridewithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs inline-flex mt-2"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                Shiko @ridewithkeijsi
              </a>
            </div>
          )}
        </section>
      )}

    </div>
  );
}

