import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mediflow-AI | Hospital Command Center",
    short_name: "Mediflow-AI",
    description: "AI-powered hospital operations platform — connect admissions, wards, theatres and CSSD into one intelligent command center.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071B34",
    theme_color: "#071B34",
    orientation: "any",
    categories: ["medical", "health", "productivity", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}

