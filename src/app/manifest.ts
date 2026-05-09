import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EventSphere — Планування заходів",
    short_name: "EventSphere",
    description:
      "Маркетплейс святкових послуг, щоденні бронювання, B2B платформа для івент-індустрії",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#C9A84C",
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
