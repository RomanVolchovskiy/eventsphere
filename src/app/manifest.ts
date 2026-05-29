import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ЄСвято — Планування заходів",
    short_name: "ЄСвято",
    description:
      "Маркетплейс святкових послуг, щоденні бронювання, B2B платформа для івент-індустрії",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#C8102E",
    orientation: "portrait",
    lang: "uk",
    categories: ["business", "lifestyle", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
