import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Football Analyzer",
    short_name: "Analyzer",
    description: "Analiza fudbalskih utakmica i statističke procene.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f8",
    theme_color: "#101a2e",
    lang: "sr",
    orientation: "any",
    icons: [
      { src: "/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/app-icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
