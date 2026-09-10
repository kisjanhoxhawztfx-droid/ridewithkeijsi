import Link from "next/link";
import { Play, Flame, ChevronRight, Sparkles } from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";
import { EpisodeData } from "./EpisodeCard";

interface HeroSectionProps {
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  featuredEpisode?: EpisodeData | null;
  totalEpisodes?: number;
  totalMotorcycles?: number;
}

export default function HeroSection({
  heroTitle = "RIDE WITH KEIJSI",
  heroSubtitle = "Eksploroni botën e shpejtësisë, rrugës dhe motorrave me Keijsin. Episode ekskluzive, rishikime makinash & motorrash, dhe motorrat më të mirë në treg.",
  ctaText = "Shiko Episodin e Fundit",
  ctaLink = "/episodes",
  secondaryCtaText = "Motorra në Shitje",
  secondaryCtaLink = "/motorra",
  featuredEpisode,
  totalEpisodes = 7,
  totalMotorcycles = 4,
}: HeroSectionProps) {
  return (
    <section className="relative pt-1 sm:pt-3 pb-16 sm:pb-24 overflow-hidden w-full">
      {/* Background ambient lighting and subtle radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[400px] bg-[#00b2fe]/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-5 w-[200px] sm:w-[400px] h-[200px] sm:h-[300px] bg-[#00d2ff]/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center justify-between">
          {/* Left Column: Headlines & Call to Action (Spostuar lehtë në qendër) */}
          <div className="lg:col-span-6 space-y-6 text-left max-w-xl">
            {/* Dynamic Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00b2fe] shadow-[0_0_8px_#00b2fe] animate-pulse" />
              <span className="text-[#00d2ff] font-bold">EMISIONI NUMËR 1</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300">Motorsport & Media</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-['Outfit'] uppercase leading-[1.2]">
              RIDE WITH{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-[#ffffff] drop-shadow-[0_0_20px_rgba(0,178,254,0.45)]">
                  KEIJSI
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300/90 leading-relaxed font-normal">
              {heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5">
              <Link
                href={featuredEpisode ? `/episodes/${featuredEpisode.slug}` : ctaLink}
                className="btn-primary group !py-3.5 sm:!py-4 !px-7 sm:!px-9 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(0,178,254,0.4)] w-full sm:w-auto text-center"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform flex-shrink-0" />
                <span>{ctaText}</span>
              </Link>

              <Link
                href={secondaryCtaLink}
                className="btn-secondary !py-3.5 sm:!py-4 !px-6 sm:!px-8 text-xs sm:text-sm font-bold group w-full sm:w-auto text-center justify-center"
              >
                <span>{secondaryCtaText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#00b2fe]" />
              </Link>
            </div>

            {/* Stats Row */}
            <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-4 sm:gap-6 border-t border-white/10 max-w-lg">
              <div className="p-3 sm:p-0 rounded-xl sm:rounded-none bg-white/[0.02] sm:bg-transparent">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  {totalEpisodes}+
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Episode YouTube</div>
              </div>

              <div className="p-3 sm:p-0 rounded-xl sm:rounded-none bg-white/[0.02] sm:bg-transparent">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#00b2fe] font-['Outfit']">
                  {totalMotorcycles}+
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Motorra në Shitje</div>
              </div>

              <div className="p-3 sm:p-0 rounded-xl sm:rounded-none bg-white/[0.02] sm:bg-transparent">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                  100%
                </div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Pasion & Motorsport</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Episode Player Facade (Spostuar lehtë në qendër) */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0 max-w-xl lg:max-w-none ml-auto w-full">
            <div className="relative">
              {/* Outer decorative glow frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00b2fe]/30 to-purple-600/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

              <div className="relative">
                {featuredEpisode ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#00b2fe]" />
                        <span className="text-xs font-bold text-[#00d2ff] uppercase tracking-wider font-['Outfit']">
                          EPISODI I FUNDIT
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">
                        {featuredEpisode.duration || "Full HD"}
                      </span>
                    </div>

                    <YouTubePlayer
                      videoId={featuredEpisode.youtubeVideoId}
                      title={featuredEpisode.title}
                      thumbnailUrl={featuredEpisode.thumbnailUrl}
                    />

                    <div className="px-1 pt-1">
                      <Link
                        href={`/episodes/${featuredEpisode.slug}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#00b2fe] transition-colors line-clamp-1 font-['Outfit']"
                      >
                        {featuredEpisode.title}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl bg-[#0b0f16] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 text-[#00b2fe]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 font-['Outfit']">
                      Episodi i Ri Së Shpejti
                    </h3>
                    <p className="text-xs text-gray-400 max-w-xs">
                      Lidheni kanalin e YouTube në panelin admin për të shfaqur videot automatikisht.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
