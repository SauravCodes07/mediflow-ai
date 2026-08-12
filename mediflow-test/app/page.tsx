import { Navbar } from "./components/marketing/Navbar";
import { Hero } from "./components/marketing/Hero";
import { TrustSection } from "./components/marketing/TrustSection";
import { FeaturesSection } from "./components/marketing/FeaturesSection";
import { DepartmentGrid } from "./components/marketing/DepartmentGrid";
import { WhySection } from "./components/marketing/WhySection";
import { AnalyticsSection } from "./components/marketing/AnalyticsSection";
import { ResourcesSection } from "./components/marketing/ResourcesSection";
import { PricingSection } from "./components/marketing/PricingSection";
import { AboutSection } from "./components/marketing/AboutSection";
import { Footer } from "./components/marketing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#071B34] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <TrustSection />
        <FeaturesSection />
        <DepartmentGrid />
        <WhySection />
        <AnalyticsSection />
        <ResourcesSection />
        <PricingSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
