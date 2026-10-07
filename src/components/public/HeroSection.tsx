import Image from "next/image";

interface HeroSectionProps {
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  featuredEpisode?: any;
  totalEpisodes?: number;
  totalMotorcycles?: number;
}

export default function HeroSection({
  heroTitle = "RIDE WITH KEIJSI",
  heroSubtitle = "Destinacioni juaj kryesor për shitblerje motorrash cilësorë, shërbim taksi komod 24/7, makina dhe shërbime luksoze VIP me qira, si dhe pasionin e botës së motorsportit me Ride with Keijsi.",
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#05070a] pt-0 sm:pt-2 pb-0 sm:pb-2">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* 1. Header Text: Compact, crystal-clear, sits cleanly ABOVE the vehicles */}
        <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2 z-20 mb-2 sm:mb-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Outfit'] uppercase leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
            RIDE WITH{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-[#ffffff] drop-shadow-[0_0_30px_rgba(0,178,254,0.85)]">
                KEIJSI
              </span>
            </span>
          </h1>

          <p className="text-[11px] sm:text-xs lg:text-sm text-gray-300/90 leading-relaxed font-normal max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] px-2">
            {heroSubtitle}
          </p>
        </div>

        {/* 2. Automotive Animation Stage: Car & Motorcycle with igniting headlights */}
        <div className="relative w-full max-w-[380px] sm:max-w-[680px] lg:max-w-[800px] aspect-[16/9] sm:aspect-[21/9] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
          {/* Base Stealth Layer (Sharper, clear car & motorcycle details in the dark) */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-car-bike.jpg"
              alt="Stealth Supercar and Superbike"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              className="object-cover object-center filter brightness-[0.45] contrast-[1.25] saturate-[0.7]"
            />
          </div>

          {/* Headlights Ignition Layer (Smooth fade-in & pulsing glow) */}
          <div className="absolute inset-0 z-[1] animate-headlights pointer-events-none">
            <Image
              src="/hero-car-bike.jpg"
              alt="Illuminated Headlights"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              className="object-cover object-center filter brightness-[1.15] contrast-[1.1]"
            />
          </div>

          {/* Realistic Lens Flares on Headlights */}
          <div className="absolute inset-0 z-[2] animate-flare pointer-events-none">
            {/* Car Left Headlight Flare */}
            <div className="absolute left-[14.5%] top-[59%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-white shadow-[0_0_20px_#00d2ff,0_0_35px_#00b2fe]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
            </div>

            {/* Car Right Headlight Flare */}
            <div className="absolute left-[40.5%] top-[58.5%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-white shadow-[0_0_20px_#00d2ff,0_0_35px_#00b2fe]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
            </div>

            {/* Motorcycle Headlight Flare */}
            <div className="absolute left-[67.5%] top-[50.5%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 sm:w-4.5 h-3 sm:h-4.5 rounded-full bg-white shadow-[0_0_25px_#00d2ff,0_0_45px_#00b2fe]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-44 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
            </div>
          </div>

          {/* Volumetric Beams & Floor Reflections */}
          <div className="absolute inset-0 z-[2] animate-beam pointer-events-none">
            <div className="absolute left-[1%] top-[54%] w-[32%] h-[35%] bg-gradient-to-br from-[#00d2ff]/25 to-transparent blur-xl" />
            <div className="absolute left-[54%] top-[48%] w-[26%] h-[35%] bg-gradient-to-bl from-[#00d2ff]/30 to-transparent blur-xl" />
            <div className="absolute left-[12%] top-[68%] w-[34%] h-[26%] bg-[#00d2ff]/25 blur-2xl rounded-full" />
            <div className="absolute left-[58%] top-[66%] w-[28%] h-[28%] bg-[#00d2ff]/30 blur-2xl rounded-full" />
          </div>

          {/* Soft Edge Vignettes for seamless blend with surrounding dark background */}
          <div className="absolute inset-x-0 top-0 h-8 sm:h-14 bg-gradient-to-b from-[#05070a] to-transparent z-[3]" />
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#05070a] to-transparent z-[3]" />
          <div className="absolute inset-y-0 left-0 w-6 sm:w-12 bg-gradient-to-r from-[#05070a] to-transparent z-[3]" />
          <div className="absolute inset-y-0 right-0 w-6 sm:w-12 bg-gradient-to-l from-[#05070a] to-transparent z-[3]" />
        </div>
      </div>
    </section>
  );
}
