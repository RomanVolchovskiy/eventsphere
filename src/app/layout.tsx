import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import PWAInstall from "@/components/PWAInstall";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "EventSphere — Від ранкової кави до весілля мрії",
  description:
    "Глобальна цифрова екосистема для планування заходів. Маркетплейс святкових послуг, сервіс щоденного бронювання та платформа для розвитку івент-бізнесу.",
  keywords: "весілля, корпоратив, бронювання, організація заходів, EventSphere",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EventSphere",
  },
  applicationName: "EventSphere",
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
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
