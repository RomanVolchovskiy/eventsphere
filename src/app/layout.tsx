import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "EventSphere — Від ранкової кави до весілля мрії",
  description:
    "Глобальна цифрова екосистема для планування заходів. Маркетплейс святкових послуг, сервіс щоденного бронювання та платформа для розвитку івент-бізнесу.",
  keywords: "весілля, корпоратив, бронювання, організація заходів, EventSphere",
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
        </Providers>
      </body>
    </html>
  );
}
