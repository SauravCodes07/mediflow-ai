import { Navbar } from "../components/marketing/Navbar";
import { ResourcesSection } from "../components/marketing/ResourcesSection";
import { Footer } from "../components/marketing/Footer";

export const metadata = {
  title: "Mediflow-AI | Operational Intelligence & Clinical Resources",
  description: "Explore hospital operational guides, clinical workflow insights, OT capacity optimization, and CSSD sterilization standards.",
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#071B34] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full pt-6">
        <ResourcesSection />
      </main>
      <Footer />
    </div>
  );
}
