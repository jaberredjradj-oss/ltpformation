import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { BuildMarker } from "@/components/BuildMarker";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { PUBLIC_BUILD_ID, PUBLIC_BUILD_TIME } from "@/lib/build-info";
import { SITE } from "@/lib/constants";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Centre de formation sécurité`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: "/ltprotectformationlogo-transparent.png",
    apple: "/ltprotectformationlogo-transparent.png",
  },
  other: {
    "build-id": PUBLIC_BUILD_ID,
    "build-time": PUBLIC_BUILD_TIME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakarta.variable} ${sourceSerif.variable}`}
      data-build-id={PUBLIC_BUILD_ID}
      data-build-time={PUBLIC_BUILD_TIME}
    >
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body className="min-h-screen bg-white font-sans text-navy-900 antialiased">
        {children}
        <BuildMarker />
        <MetaPixel />
      </body>
      <GoogleAnalytics gaId="G-VMCETEB9F5" />
    </html>
  );
}
