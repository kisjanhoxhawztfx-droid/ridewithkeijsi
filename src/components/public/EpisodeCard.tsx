import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Eye, Calendar, ArrowUpRight } from "lucide-react";

export interface EpisodeData {
  id: string;
  youtubeVideoId: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  duration?: string | null;
  viewCount?: number | null;
  publishedAt: Date | string;
  isFeatured?: boolean;
}

interface EpisodeCardProps {
  episode: EpisodeData;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const publishedDate = new Date(episode.publishedAt).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e1420] via-[#090d15] to-[#040609] hover:border-[#00b2fe]/60 hover:shadow-[0_15px_40px_rgba(0,178,254,0.2)] transition-all duration-300 flex flex-col justify-between">
      {/* Thumbnail Container */}
      <Link href={`/episodes/${episode.slug}`} className="relative aspect-video w-full overflow-hidden block bg-black">
        <Image
          src={episode.thumbnailUrl}
          alt={episode.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1420] via-transparent to-black/30 group-hover:opacity-75 transition-opacity" />

        {/* Duration Badge */}
        {episode.duration && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/15 shadow-md">
            <Clock className="w-3.5 h-3.5 text-[#00b2fe]" />
            <span>{episode.duration}</span>
          </div>
        )}

        {/* Featured Tag */}
        {episode.isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#00b2fe] text-black font-black text-[10px] tracking-wider uppercase shadow-lg font-['Outfit']">
            I Zgjedhur
          </div>
        )}

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#00b2fe] text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,178,254,0.9)]">
            <Play className="w-6 h-6 fill-white translate-x-0.5" />
          </div>
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00b2fe]" />
              <span>{publishedDate}</span>
            </div>
            {typeof episode.viewCount === "number" && episode.viewCount > 0 && (
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span>{episode.viewCount.toLocaleString()} shikime</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/episodes/${episode.slug}`}>
            <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-[#00b2fe] transition-colors line-clamp-2 leading-snug font-['Outfit']">
              {episode.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
        </div>

        {/* CTA Link Button */}
        <div className="pt-2 border-t border-white/10 mt-auto">
          <Link
            href={`/episodes/${episode.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#00b2fe] hover:text-black text-[#00b2fe] text-xs font-black border border-[#00b2fe]/30 hover:border-[#00b2fe] transition-all duration-200 min-h-[42px] group/btn"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Shiko Episodin</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
