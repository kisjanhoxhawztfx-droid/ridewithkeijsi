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
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e1422] via-[#080c14] to-[#04060a] hover:border-[#00b2fe]/60 hover:shadow-[0_15px_40px_rgba(0,178,254,0.18)] transition-all duration-300 flex flex-col justify-between">
      {/* Media Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
        <Image
          src={post.thumbnailUrl}
          alt={post.caption || "Taxi Keijsi Post"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-[#00b2fe] text-black font-black text-[10px] tracking-wider uppercase backdrop-blur-md shadow-md font-['Outfit']">
            🚖 @taxi_keijsi
          </span>

          <div className="p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/30 text-amber-400 shadow-md">
            <InstagramIcon className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{publishedDate}</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed">
            {post.caption}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 mt-auto">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black shadow-lg shadow-amber-900/30 transition-all min-h-[42px] group/btn"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-black" />
            <span>Shiko në Instagram</span>
            <ExternalLink className="w-3 h-3 text-black opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
