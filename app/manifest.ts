import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SARP LAB Management System",
    short_name: "SARP LAB",
    description: "Log in, find your assigned tests, and submit results from the field.",
    start_url: "/tech",
    display: "standalone",
    orientation: "portrait",
    background_color: "#5B193F",
    theme_color: "#5B193F",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
