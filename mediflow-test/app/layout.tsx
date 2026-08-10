import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mediflow-AI — Unified Hospital Operations",
  description:
    "Mediflow-AI unifies admissions, wards, OT, CSSD and analytics into one real-time hospital operations platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
