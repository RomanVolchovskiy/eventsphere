import type { Metadata, Viewport } from "next";
import "./globals.css";
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
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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
