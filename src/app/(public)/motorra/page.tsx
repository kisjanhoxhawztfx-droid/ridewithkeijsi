import Link from "next/link";
import db from "@/lib/db";
import InstagramPostCard from "@/components/public/InstagramPostCard";
import { CheckCircle2, Bike, Sparkles, ShoppingBag, Archive } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export const revalidate = 60;

export default async function MotorraPage() {
  const [forSale, sold] = await Promise.all([
    db.instagramPost.findMany({
      where: { isVisible: true, category: "SHITET", status: "FOR_SALE" },
      orderBy: { postedAt: "desc" },
    }),
    db.instagramPost.findMany({
      where: { isVisible: true, category: "SHITET", status: "SOLD" },
      orderBy: { postedAt: "desc" },
    }),
  ]);

  const total = forSale.length + sold.length;

  return (
    <div className="pt-1 sm:pt-3 pb-20 sm:pb-28 w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 space-y-12 sm:space-y-16">

      {/* 1. Header Banner Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-pink-500/30 bg-gradient-to-b from-[#1a0f24] via-[#0e0816] to-[#050308] p-8 sm:p-14 shadow-2xl text-center space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-xs font-black text-pink-400 tracking-wider uppercase backdrop-blur-md">
            <InstagramIcon className="w-4 h-4 text-pink-400" />
            <span>AUTO-SYNC NGA @ridewithkeijsi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-[&apos;Outfit&apos;] uppercase leading-tight tracking-wide">
            MOTORRA <span className="text-[#00b2fe] drop-shadow-[0_0_20px_rgba(0,178,254,0.6)]">NË SHITJE</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Postimet me <strong className="text-pink-400">#shitet</strong> nga Instagram @ridewithkeijsi sinkronizohen automatikisht këtu. Kur motori shitet, lëviz vetë tek &quot;E Shitura&quot;.
          </p>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
              <strong className="text-white">{forSale.length}</strong> Në Shitje
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-gray-500" />
              <strong className="text-white">{sold.length}</strong> Të Shitura
            </span>
          </div>
        </div>
      </section>

      {/* 2. Motorrat Në Shitje */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <ShoppingBag className="w-4 h-4 text-pink-400" />
            <span>
              <strong className="text-white font-bold">{forSale.length}</strong> motorra në shitje
            </span>
          </div>
          <span className="text-xs text-pink-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Sinkronizuar me @ridewithkeijsi
          </span>
        </div>

        {forSale.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {forSale.map((post) => (
              <InstagramPostCard key={post.id} post={post} variant="motorra" />
            ))}
          </div>
        ) : (
          <div className="surface-card p-12 text-center max-w-md mx-auto space-y-4 rounded-3xl border border-white/10">
            <Sparkles className="w-10 h-10 text-pink-400 mx-auto opacity-70" />
            <h3 className="text-base font-bold text-white font-[&apos;Outfit&apos;]">Nuk ka motorra aktualisht</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Kur @ridewithkeijsi poston në Instagram me <strong>#shitet</strong>, motorri shfaqet automatikisht këtu.
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

      {/* 3. Motorrat E Shitura */}
      {sold.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <Archive className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-[&apos;Outfit&apos;]">
              Motorrat e Shitura ({sold.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {sold.map((post) => (
              <InstagramPostCard key={post.id} post={post} variant="motorra" />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
