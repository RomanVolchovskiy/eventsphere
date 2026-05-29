import type { Metadata, Viewport } from "next";
import { Manrope, Caprasimo, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import PWAInstall from "@/components/PWAInstall";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const caprasimo = Caprasimo({
  subsets: ["latin"],
  variable: "--font-caprasimo",
  weight: "400",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  subsets: ["latin", "cyrillic"],
  variable: "--font-fraunces",
  weight: "variable",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ЄСвято — Хай святкують всі",
  description:
    "Платформа святкування 2026. Маркетплейс святкових послуг, AI Smart Match, конструктор події та жива мапа свят України.",
  keywords: "весілля, корпоратив, бронювання, організація заходів, ЄСвято",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ЄСвято",
  },
  applicationName: "ЄСвято",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={`${manrope.variable} ${caprasimo.variable} ${jetbrains.variable} ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--body)" }}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <PWAInstall />
        </Providers>
      </body>
    </html>
  );
}
