import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import { GoogleIcon } from "@/components/ui/Icons";

export interface TaxiReviewData {
  id: string;
  authorName: string;
  authorPhotoUrl?: string | null;
  rating: number;
  text: string;
  relativeTimeDescription?: string | null;
  publishedAt: Date | string;
  source?: string;
}

interface GoogleReviewCardProps {
  review: TaxiReviewData;
}

export default function GoogleReviewCard({ review }: GoogleReviewCardProps) {
  const initials = review.authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl p-4 sm:p-6 border border-white/10 bg-gradient-to-b from-[#0f1422] via-[#090d16] to-[#04060a] flex flex-col justify-between h-full space-y-3.5 hover:border-amber-400/40 hover:shadow-[0_8px_30px_rgba(245,158,11,0.1)] transition-all duration-300">
      {/* Header: Author + Google Badge */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {review.authorPhotoUrl ? (
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 bg-black flex-shrink-0 shadow-sm">
              <Image
                src={review.authorPhotoUrl}
                alt={review.authorName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-extrabold text-xs sm:text-sm font-['Outfit'] flex-shrink-0 shadow-sm">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-extrabold text-white font-['Outfit'] leading-tight truncate">
              {review.authorName}
            </h4>
            <span className="text-[10px] sm:text-xs text-gray-400">
              {review.relativeTimeDescription || new Date(review.publishedAt).toLocaleDateString("sq-AL")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-300 shadow-sm flex-shrink-0">
          <GoogleIcon className="w-3 h-3" />
          <span className="font-bold uppercase tracking-wider">Google</span>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1.5 text-yellow-400">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-white ml-1">{review.rating}.0</span>
      </div>

      {/* Review Text */}
      <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed italic flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Verified Footer */}
      <div className="pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-400 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">Vlerësim i verifikuar nga klienti në Google</span>
      </div>
    </div>
  );
}
