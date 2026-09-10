import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import MobileBottomNav from "@/components/public/MobileBottomNav";
import { getSiteSettings, getSocialLinks } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#05070a] text-white overflow-x-hidden">
      <Header socialLinks={socialLinks} />
      <main className="flex-1 w-full pb-16 md:pb-0">{children}</main>
      <Footer
        socialLinks={socialLinks}
        siteName={settings.site_name}
        tagline={settings.site_tagline}
        email={settings.contact_email}
      />
      <MobileBottomNav />
    </div>
  );
}
