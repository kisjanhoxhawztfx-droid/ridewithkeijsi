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
    <div className="group relative rounded-2xl p-2.5 sm:p-3 bg-[#0a0f19] border border-white/15 hover:border-[#00b2fe] shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_35px_rgba(0,178,254,0.25)] transition-all duration-300 flex flex-col justify-between">
      {/* Framed Thumbnail Container */}
      <Link href={`/episodes/${episode.slug}`} className="relative aspect-video w-full rounded-xl overflow-hidden block bg-black border border-white/5">
        <Image
          src={episode.thumbnailUrl}
          alt={episode.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:opacity-75 transition-opacity" />

        {/* Duration Badge */}
        {episode.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/15 shadow-md">
            <Clock className="w-3 h-3 text-[#00b2fe]" />
            <span>{episode.duration}</span>
          </div>
        )}

        {/* Featured Tag */}
        {episode.isFeatured && (
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#00b2fe] text-black font-black text-[9px] tracking-wider uppercase shadow-lg font-['Outfit']">
            I Zgjedhur
          </div>
        )}

        {/* Center Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 pointer-events-none">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00b2fe] text-black flex items-center justify-center shadow-[0_0_25px_rgba(0,178,254,0.9)]">
            <Play className="w-5 h-5 fill-black translate-x-0.5" />
          </div>
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5 pt-1">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#00b2fe]" />
              <span>{publishedDate}</span>
            </div>
            {typeof episode.viewCount === "number" && episode.viewCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-gray-500" />
                <span>{episode.viewCount.toLocaleString()} shikime</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link href={`/episodes/${episode.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00b2fe] transition-colors line-clamp-2 leading-snug font-['Outfit']">
              {episode.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
        </div>

        {/* Compact CTA Button */}
        <div className="pt-2 border-t border-white/10 mt-auto">
          <Link
            href={`/episodes/${episode.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#00b2fe]/10 hover:bg-[#00b2fe] hover:text-black text-[#00b2fe] text-xs font-bold border border-[#00b2fe]/25 hover:border-[#00b2fe] transition-all duration-200 min-h-[34px] group/btn"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Shiko Videon</span>
            <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
