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
    <section className="relative w-full overflow-hidden bg-[#05070a] pt-1 sm:pt-3 pb-1 sm:pb-3">
      <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-6 relative z-10 flex flex-col items-center">
        {/* Cinematic Stage: Car & Motorcycle Animation as the true Background with Text Overlayed On Top */}
        <div className="relative w-full max-w-[1080px] aspect-[16/10] sm:aspect-[21/9] min-h-[260px] sm:min-h-[360px] lg:min-h-[440px] rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(0,178,254,0.12)] flex flex-col justify-start items-center p-3 sm:p-6 lg:p-8 bg-[#040609]">
          
          {/* Base Stealth Vehicle Layer (Sharp and high-contrast, unoptimized for crispness) */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-car-bike.jpg"
              alt="Stealth Supercar and Superbike"
              fill
              priority
              unoptimized
              className="object-cover object-bottom sm:object-center filter brightness-[0.55] contrast-[1.25] saturate-[0.8]"
            />
          </div>

          {/* Headlights Ignition Layer (Smooth fade-in & pulsing glow) */}
          <div className="absolute inset-0 z-[1] animate-headlights pointer-events-none">
            <Image
              src="/hero-car-bike.jpg"
              alt="Illuminated Headlights"
              fill
              priority
              unoptimized
              className="object-cover object-bottom sm:object-center filter brightness-[1.2] contrast-[1.15]"
            />
          </div>

          {/* Realistic Lens Flares on Headlights */}
          <div className="absolute inset-0 z-[2] animate-flare pointer-events-none">
            {/* Car Left Headlight Flare */}
            <div className="absolute left-[14.5%] top-[60%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-white shadow-[0_0_20px_#00d2ff,0_0_35px_#00b2fe]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
            </div>

            {/* Car Right Headlight Flare */}
            <div className="absolute left-[40.5%] top-[59.5%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 sm:w-4 h-2.5 sm:h-4 rounded-full bg-white shadow-[0_0_20px_#00d2ff,0_0_35px_#00b2fe]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-36 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
            </div>

            {/* Motorcycle Headlight Flare */}
            <div className="absolute left-[67.5%] top-[51.5%] -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 sm:w-4.5 h-3 sm:h-4.5 rounded-full bg-white shadow-[0_0_25px_#00d2ff,0_0_45px_#00b2fe]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-44 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
            </div>
          </div>

          {/* Volumetric Floor Glow (Kept to the ground, off vehicle bodies to preserve sharpness) */}
          <div className="absolute inset-0 z-[2] animate-beam pointer-events-none">
            <div className="absolute left-[10%] bottom-[4%] w-[34%] h-[20%] bg-[#00d2ff]/20 blur-2xl rounded-full" />
            <div className="absolute left-[56%] bottom-[4%] w-[28%] h-[22%] bg-[#00d2ff]/25 blur-2xl rounded-full" />
          </div>

          {/* Dark Gradient Overlay for Maximum Text Legibility */}
          <div className="absolute inset-x-0 top-0 h-40 sm:h-56 bg-gradient-to-b from-[#05070a]/95 via-[#05070a]/70 to-transparent z-[3] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-8 sm:h-14 bg-gradient-to-t from-[#05070a]/90 to-transparent z-[3] pointer-events-none" />

          {/* Header Text: Overlayed directly ON TOP of the animated background */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2 pt-1 sm:pt-3 px-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Outfit'] uppercase leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              RIDE WITH{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-[#ffffff] drop-shadow-[0_0_35px_rgba(0,178,254,0.95)]">
                  KEIJSI
                </span>
              </span>
            </h1>

            <p className="text-[11px] sm:text-xs lg:text-sm text-gray-200/95 leading-relaxed font-normal max-w-xl mx-auto drop-shadow-[0_2px_15px_rgba(0,0,0,1)] px-2">
              {heroSubtitle}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
