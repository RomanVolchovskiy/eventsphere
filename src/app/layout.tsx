import type { Metadata, Viewport } from "next";
import { Caprasimo, Fraunces, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

// next/font сам хостить шрифти — жодного запиту до fonts.googleapis.com.
// Увага: Fraunces і Caprasimo не мають кирилиці (лише latin/latin-ext),
// тож український текст на них падає у фолбек із globals.css.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const caprasimo = Caprasimo({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  variable: "--font-caprasimo",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-jetbrains",
});
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import PWAInstall from "@/components/PWAInstall";

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
    <html
      lang="uk"
      className={`${fraunces.variable} ${caprasimo.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col">
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
