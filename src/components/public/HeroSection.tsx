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
    <section className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] flex items-center justify-center overflow-hidden w-full bg-[#05070a]">
      {/* =========================================================================
          BACKGROUND ANIMATION: STEALTH CAR & MOTORCYCLE WITH IGNITING HEADLIGHTS
          ========================================================================= */}
      <div className="absolute inset-0 select-none pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Base Stealth Silhouette (Darkened, mysterious black contours) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-car-bike.jpg"
            alt="Stealth Supercar and Superbike Silhouette"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.22] contrast-[1.3] saturate-[0.5]"
          />
        </div>

        {/* Layer 2: Headlights Ignition Layer (Smooth fade-in & startup pulse) */}
        <div className="absolute inset-0 z-[1] animate-headlights">
          <Image
            src="/hero-car-bike.jpg"
            alt="Illuminated Supercar and Superbike Headlights"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Layer 3: Realistic Lens Flares & Projector Glows synchronized with Headlights */}
        <div className="absolute inset-0 z-[2] animate-flare pointer-events-none">
          {/* Car Left Headlight Flare */}
          <div className="absolute left-[14.5%] top-[59%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white shadow-[0_0_20px_#00d2ff,0_0_40px_#00b2fe]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-52 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent blur-[0.5px]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-36 h-20 sm:h-36 rounded-full bg-[#00b2fe]/35 blur-2xl" />
          </div>

          {/* Car Right Headlight Flare */}
          <div className="absolute left-[40.5%] top-[58.5%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white shadow-[0_0_20px_#00d2ff,0_0_40px_#00b2fe]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-52 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent blur-[0.5px]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-36 h-20 sm:h-36 rounded-full bg-[#00b2fe]/35 blur-2xl" />
          </div>

          {/* Motorcycle Headlight Flare */}
          <div className="absolute left-[67.5%] top-[50.5%] -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white shadow-[0_0_25px_#00d2ff,0_0_50px_#00b2fe]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-60 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent blur-[0.5px]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 sm:w-44 h-24 sm:h-44 rounded-full bg-[#00b2fe]/40 blur-2xl" />
          </div>
        </div>

        {/* Layer 4: Volumetric Light Cones & Ground Reflections */}
        <div className="absolute inset-0 z-[2] animate-beam pointer-events-none">
          {/* Volumetric Beam from Car shooting outward */}
          <div className="absolute left-[2%] top-[54%] w-[32%] h-[35%] bg-gradient-to-br from-[#00d2ff]/20 via-[#00b2fe]/5 to-transparent blur-2xl transform -rotate-6" />

          {/* Volumetric Beam from Motorcycle shooting forward-left */}
          <div className="absolute left-[54%] top-[48%] w-[26%] h-[35%] bg-gradient-to-bl from-[#00d2ff]/25 via-[#00b2fe]/10 to-transparent blur-2xl transform rotate-6" />

          {/* Wet Floor Glow under Car */}
          <div className="absolute left-[12%] top-[68%] w-[34%] h-[26%] bg-gradient-to-b from-[#00d2ff]/25 via-[#00b2fe]/10 to-transparent blur-3xl rounded-full" />

          {/* Wet Floor Glow under Motorcycle */}
          <div className="absolute left-[58%] top-[66%] w-[28%] h-[28%] bg-gradient-to-b from-[#00d2ff]/30 via-[#00b2fe]/15 to-transparent blur-3xl rounded-full" />
        </div>

        {/* Layer 5: Atmospheric Ambient Fog & Radial Cyan Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] lg:w-[950px] h-[240px] sm:h-[380px] bg-[#00b2fe]/12 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none z-[3]" />

        {/* Layer 6: Seamless Dark Vignette Overlays (Blends 100% with black background) */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-[#05070a] via-[#05070a]/85 to-transparent z-[4]" />
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-[#05070a] via-[#05070a]/90 to-transparent z-[4]" />
        <div className="absolute inset-y-0 left-0 w-16 sm:w-36 bg-gradient-to-r from-[#05070a] to-transparent z-[4]" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-36 bg-gradient-to-l from-[#05070a] to-transparent z-[4]" />
        <div className="absolute inset-0 bg-radial from-black/65 via-black/35 to-transparent z-[4]" />
      </div>

      {/* =========================================================================
          FOREGROUND CONTENT: HERO TITLE & AESTHETIC SUMMARY
          ========================================================================= */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center py-12 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
          {/* Main Title with Cyan/White Glow */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Outfit'] uppercase leading-[1.1] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            RIDE WITH{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-[#ffffff] drop-shadow-[0_0_35px_rgba(0,178,254,0.7)]">
                KEIJSI
              </span>
            </span>
          </h1>

          {/* Shkrim i shkurtër estetik përmbledhës */}
          <div className="max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm lg:text-base text-gray-200/90 leading-relaxed font-normal p-3 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
