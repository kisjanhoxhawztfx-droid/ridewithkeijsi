import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import db from "@/lib/db";
import YouTubePlayer from "@/components/public/YouTubePlayer";
import EpisodeCard from "@/components/public/EpisodeCard";
import { getSiteSettings } from "@/lib/settings";
import { Calendar, Clock, Eye, Share2, ArrowLeft, ExternalLink } from "lucide-react";
import { YouTubeIcon } from "@/components/ui/Icons";

export const revalidate = 60;

interface EpisodeDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EpisodeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await db.episode.findUnique({
    where: { slug },
  });

  if (!episode) {
    return { title: "Episodi nuk u gjet — Ride with Keijsi" };
  }

  return {
    title: `${episode.title} — Ride with Keijsi`,
    description: episode.description.substring(0, 160),
    openGraph: {
      title: episode.title,
      description: episode.description.substring(0, 160),
      images: [{ url: episode.thumbnailUrl }],
      type: "video.episode",
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title,
      description: episode.description.substring(0, 160),
      images: [episode.thumbnailUrl],
    },
  };
}

export default async function EpisodeDetailPage({ params }: EpisodeDetailPageProps) {
  const { slug } = await params;

  const episode = await db.episode.findUnique({
    where: { slug },
  });

  if (!episode || !episode.isVisible) {
    notFound();
  }

  const [relatedEpisodes, settings] = await Promise.all([
    db.episode.findMany({
      where: {
        isVisible: true,
        id: { not: episode.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    getSiteSettings(),
  ]);

  const publishedDate = new Date(episode.publishedAt).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Schema.org VideoObject JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: episode.title,
    description: episode.description,
    thumbnailUrl: [episode.thumbnailUrl],
    uploadDate: episode.publishedAt.toISOString(),
    embedUrl: `https://www.youtube.com/embed/${episode.youtubeVideoId.replace(/_demo\d+/, "")}`,
    contentUrl: episode.videoUrl,
  };

  return (
    <div className="pt-2 sm:pt-4 pb-20 sm:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/episodes"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-gray-400 hover:text-[#00b2fe] transition-colors py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-[#00b2fe]/40"
        >
          <ArrowLeft className="w-4 h-4 text-[#00b2fe]" />
          <span>Kthehu te të gjitha episodet</span>
        </Link>
      </div>

      {/* Main Video Embed Section */}
      <div className="space-y-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
          <YouTubePlayer
            videoId={episode.youtubeVideoId}
            title={episode.title}
            thumbnailUrl={episode.thumbnailUrl}
          />
        </div>

        {/* Video Header Info */}
        <div className="space-y-4 border-b border-white/10 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-[#00b2fe]" />
                {publishedDate}
              </span>
              {episode.duration && (
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-[#00b2fe]" />
                  {episode.duration}
                </span>
              )}
              {typeof episode.viewCount === "number" && episode.viewCount > 0 && (
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <Eye className="w-3.5 h-3.5 text-[#00b2fe]" />
                  {episode.viewCount.toLocaleString()} shikime
                </span>
              )}
            </div>

            {/* Direct YouTube Action */}
            <div className="flex items-center gap-3">
              <a
                href={episode.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !from-red-600 !to-red-700 hover:!from-red-500 hover:!to-red-600 text-xs sm:text-sm font-bold !py-2.5 !px-5 shadow-lg shadow-red-900/30 w-full sm:w-auto text-center flex items-center gap-2"
              >
                <YouTubeIcon className="w-4 h-4" />
                <span>Shiko në YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit'] leading-tight">
            {episode.title}
          </h1>
        </div>

        {/* Description Section & Share */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider font-['Outfit']">
              PËRSHKRIMI I EPISODIT
            </h2>
            <div className="surface-card p-6 sm:p-8 text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line border border-white/10 rounded-2xl">
              {episode.description || "Nuk ka përshkrim shtesë për këtë episod."}
            </div>

            {episode.tags && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {episode.tags.split(",").map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-medium"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Share & Socials */}
          <div className="lg:col-span-4 space-y-5 sm:space-y-6">
            <div className="surface-card p-6 space-y-4 border border-white/10 rounded-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#00b2fe]" />
                <span>SHPËRNDAJE EPISODIN</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${episode.title} - https://ridewithkeijsi.com/episodes/${episode.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-2.5 text-center text-green-400 hover:text-green-300 font-bold"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ridewithkeijsi.com/episodes/${episode.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-2.5 text-center text-blue-400 hover:text-blue-300 font-bold"
                >
                  Facebook
                </a>
              </div>
            </div>

            {/* Subscribe Box */}
            <div className="surface-card p-6 space-y-4 bg-gradient-to-br from-[#0c121e] to-[#06090e] border border-[#00b2fe]/30 rounded-2xl">
              <h4 className="text-sm font-bold text-white font-['Outfit']">
                Mos humbisni asnjë episod!
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Abonohuni në kanalin zyrtar të YouTube @RideWithkeijsi për t&apos;u njoftuar menjëherë sapo publikohet një episod i ri.
              </p>
              <a
                href="https://youtube.com/@ridewithkeijsi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary text-xs !py-3 !from-red-600 !to-red-700 font-bold"
              >
                <YouTubeIcon className="w-4 h-4" />
                <span>Abonohu Falas</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Episodes */}
      {relatedEpisodes.length > 0 && (
        <section className="pt-8 sm:pt-12 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-extrabold text-white font-['Outfit']">
              Episode të Tjera të Sugjeruara
            </h2>
            <Link
              href="/episodes"
              className="text-xs sm:text-sm font-bold text-[#00b2fe] hover:underline"
            >
              Shiko të Gjitha
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedEpisodes.map((rel) => (
              <EpisodeCard key={rel.id} episode={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
