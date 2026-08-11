import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mediflow-AI Enterprise Hospital SaaS",
    short_name: "Mediflow-AI",
    description: "Enterprise Clinical Intelligence & Hospital Command Center Platform",
    start_url: "/",
    display: "standalone",
    background_color: "#071B34",
    theme_color: "#071B34",
    orientation: "any",
    icons: [
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
        purpose: "maskable",
      },
    ],
  };
}
