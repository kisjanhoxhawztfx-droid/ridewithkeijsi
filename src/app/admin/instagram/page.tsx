import db from "@/lib/db";
import { InstagramAdminActions } from "@/components/admin/InstagramAdminActions";
import { InstagramSyncButton } from "@/components/admin/InstagramSyncButton";
import { InstagramIcon } from "@/components/ui/Icons";
import { CheckCircle2, Archive, RefreshCw, ShoppingBag, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInstagramPage() {
  const [forSalePosts, soldPosts, forYouPosts, recentLogs] = await Promise.all([
    db.instagramPost.findMany({
      where: { category: "SHITET", status: "FOR_SALE" },
      orderBy: { postedAt: "desc" },
    }),
    db.instagramPost.findMany({
      where: { category: "SHITET", status: "SOLD" },
      orderBy: { postedAt: "desc" },
    }),
    db.instagramPost.findMany({
      where: { category: "EPISOD" },
      orderBy: { postedAt: "desc" },
    }),
    db.syncLog.findMany({
      where: { platform: { in: ["INSTAGRAM_WEBHOOK", "INSTAGRAM_RAPIDAPI", "INSTAGRAM"] } },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
  ]);

  const allPosts = [...forSalePosts, ...soldPosts, ...forYouPosts];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <InstagramIcon className="w-6 h-6 text-pink-400" />
            Instagram Auto-Sync (@ridewithkeijsi)
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sinkronizim automatik me RapidAPI ose Webhook Make.com
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <InstagramSyncButton />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-pink-400 text-xs font-black uppercase">
            <ShoppingBag className="w-4 h-4" /> Motorra Ne Shitje
          </div>
          <div className="text-3xl font-extrabold text-white">{forSalePosts.length}</div>
        </div>
        <div className="bg-gray-500/10 border border-gray-500/30 rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase">
            <Archive className="w-4 h-4" /> Motorra Te Shitura
          </div>
          <div className="text-3xl font-extrabold text-white">{soldPosts.length}</div>
        </div>
        <div className="bg-[#00b2fe]/10 border border-[#00b2fe]/30 rounded-2xl p-5 space-y-1">
          <div className="flex items-center gap-2 text-[#00b2fe] text-xs font-black uppercase">
            <Heart className="w-4 h-4" /> For You (#episod)
          </div>
          <div className="text-3xl font-extrabold text-white">{forYouPosts.length}</div>
        </div>
      </div>

      {/* Webhook Info */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Make.com Webhook URL
        </h3>
        <div className="font-mono text-xs bg-black/30 px-4 py-3 rounded-xl text-green-400 border border-white/10">
          POST https://faqjayte.com/api/instagram-webhook
        </div>
        <p className="text-xs text-gray-400">
          Secret: <code className="text-amber-400">ridewithkeijsi_secret_2024</code>&nbsp;|&nbsp;
          Fields: <code className="text-gray-300">instagramId, caption, mediaUrl, thumbnailUrl, permalink, mediaType, postedAt, secret</code>
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Caption me <strong className="text-pink-400">#shitet</strong> &rarr; Motorra Ne Shitje</p>
          <p>Caption me <strong className="text-[#00b2fe]">#episod</strong> &rarr; For You</p>
          <p>Caption ndryshon &rarr; &quot;Shitur&quot; &rarr; Motorra E Shitura (automatikisht)</p>
        </div>
      </div>

      {/* Posts List */}
      {allPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Te Gjitha Postimet ({allPosts.length})</h2>
          <div className="space-y-3">
            {allPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-4"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {post.thumbnailUrl || post.mediaUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnailUrl || post.mediaUrl || ""}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <InstagramIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        post.category === "SHITET"
                          ? post.status === "SOLD"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-pink-500/20 text-pink-400"
                          : "bg-[#00b2fe]/20 text-[#00b2fe]"
                      }`}
                    >
                      {post.category === "SHITET"
                        ? post.status === "SOLD"
                          ? "E SHITUR"
                          : "#SHITET"
                        : "#EPISOD — FOR YOU"}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {new Date(post.postedAt).toLocaleDateString("sq-AL")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2">{post.caption}</p>
                </div>

                {/* Actions */}
                <InstagramAdminActions post={post} />
              </div>
            ))}
          </div>
        </div>
      )}

      {allPosts.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <InstagramIcon className="w-12 h-12 text-pink-400 opacity-30 mx-auto" />
          <p className="text-gray-400 text-sm">Asnje postim i sinkronizuar ende.</p>
          <p className="text-gray-600 text-xs">
            Konfiguro Make.com per te derguar postimet e @keijsi09 te webhook-u i mesiperm.
          </p>
        </div>
      )}

      {/* Sync Log */}
      {recentLogs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Logi i Fundit Sync</h2>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className={`flex items-start gap-3 text-xs px-4 py-3 rounded-xl border ${
                  log.status === "SUCCESS"
                    ? "bg-green-500/5 border-green-500/20 text-green-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{log.message || log.errorDetail || log.status}</p>
                  <p className="text-gray-600 mt-0.5">{new Date(log.startedAt).toLocaleString("sq-AL")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
