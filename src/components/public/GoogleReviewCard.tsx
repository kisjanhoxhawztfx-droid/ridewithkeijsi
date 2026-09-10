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
    <div className="rounded-2xl p-6 sm:p-7 border border-white/10 bg-gradient-to-b from-[#0f1422] via-[#090d16] to-[#04060a] flex flex-col justify-between h-full space-y-5 hover:border-[#00b2fe]/50 hover:shadow-[0_10px_35px_rgba(0,178,254,0.12)] transition-all duration-300">
      {/* Header: Author + Google Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {review.authorPhotoUrl ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/20 bg-black flex-shrink-0 shadow-md">
              <Image
                src={review.authorPhotoUrl}
                alt={review.authorName}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#00b2fe]/20 border border-[#00b2fe]/40 text-[#00b2fe] flex items-center justify-center font-extrabold text-sm font-['Outfit'] flex-shrink-0 shadow-md">
              {initials}
            </div>
          )}

          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-white font-['Outfit'] leading-tight">
              {review.authorName}
            </h4>
            <span className="text-xs text-gray-400">
              {review.relativeTimeDescription || new Date(review.publishedAt).toLocaleDateString("sq-AL")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 shadow-sm">
          <GoogleIcon className="w-3.5 h-3.5" />
          <span className="font-bold text-[10px] uppercase">Google</span>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1.5 text-yellow-400">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-white ml-1">{review.rating}.0</span>
      </div>

      {/* Review Text */}
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Verified Footer */}
      <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-green-400 font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Vlerësim i verifikuar nga klienti në Google</span>
      </div>
    </div>
  );
}
