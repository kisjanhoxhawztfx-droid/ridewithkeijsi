import Image from "next/image";
import { ExternalLink, Calendar } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export interface TaxiPostData {
  id: string;
  instagramMediaId?: string | null;
  permalink: string;
  mediaType: string;
  thumbnailUrl: string;
  caption: string;
  isFeatured?: boolean;
  publishedAt: Date | string;
}

interface TaxiPostCardProps {
  post: TaxiPostData;
}

export default function TaxiPostCard({ post }: TaxiPostCardProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative rounded-2xl p-2.5 sm:p-3 bg-[#0a0f19] border border-amber-400/20 hover:border-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between">
      {/* Framed Media Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/5">
        <Image
          src={post.thumbnailUrl}
          alt={post.caption || "Taxi Keijsi Post"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[9px] tracking-wider uppercase backdrop-blur-md shadow-md font-['Outfit']">
            🚖 @taxi_keijsi
          </span>

          <div className="p-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/30 text-amber-400 shadow-md">
            <InstagramIcon className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{publishedDate}</span>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-2 leading-relaxed">
            {post.caption}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 mt-auto">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-400/15 hover:bg-amber-400 hover:text-black text-amber-400 text-xs font-bold border border-amber-400/30 transition-all min-h-[34px] group/btn"
          >
            <InstagramIcon className="w-3 h-3 text-current" />
            <span>Shiko në Instagram</span>
            <ExternalLink className="w-3 h-3 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
