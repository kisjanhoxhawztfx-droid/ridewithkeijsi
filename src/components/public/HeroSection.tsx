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
    <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 overflow-hidden w-full">
      {/* Background ambient lighting and subtle radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] lg:w-[900px] h-[220px] sm:h-[320px] bg-[#00b2fe]/10 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[200px] sm:w-[350px] h-[180px] sm:h-[240px] bg-[#00d2ff]/5 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Outfit'] uppercase leading-[1.15]">
            RIDE WITH{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b2fe] via-[#00d2ff] to-[#ffffff] drop-shadow-[0_0_25px_rgba(0,178,254,0.5)]">
                KEIJSI
              </span>
            </span>
          </h1>

          {/* Shkrim i shkurtër estetik përmbledhës */}
          <p className="text-xs sm:text-sm lg:text-base text-gray-300/90 leading-relaxed font-normal max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
