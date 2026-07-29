import type { MetadataRoute } from "next";

/**
 * PWA / installable web manifest. Icons are the branded NaqiJo emblem on the
 * brand navy; the same mark drives the favicon and apple-touch-icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NaqiJo — نقي الرابية",
    short_name: "NaqiJo",
    description:
      "Integrated home engineering — water purification, solar energy, kitchen finishing, waterproofing and maintenance.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E3A5C",
    theme_color: "#0E3A5C",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
