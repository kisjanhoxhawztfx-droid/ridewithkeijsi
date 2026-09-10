import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim().replace(/^\uFEFF/, "");
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ride with Keijsi — Emisioni & Platforma Numër 1 për Motorra",
    template: "%s | Ride with Keijsi",
  },
  description:
    "Shikoni të gjitha episodet e plota të Ride with Keijsi, motorrat më të fundit në shitje nga Instagrami, dhe të rejat më të nxehta të motorsportit shqiptar.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ride with Keijsi",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Ride with Keijsi — Emisioni & Platforma e Motorrave",
    description:
      "Emisioni zyrtar me teste motorrash, makina sportive, dhe tregu i motorrave në shitje.",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Ride with Keijsi" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ride with Keijsi",
    description: "Emisioni zyrtar me teste motorrash dhe makina sportive.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sq"
      className={`${outfit.variable} ${plusJakartaSans.variable} dark`}
    >
      <body className="min-h-screen bg-[#05070a] text-white antialiased selection:bg-[#00b2fe] selection:text-black">
        {children}
      </body>
    </html>
  );
}
