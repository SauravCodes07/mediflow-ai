import { Navbar } from "./components/marketing/Navbar";
import { Hero } from "./components/marketing/Hero";
import { DepartmentGrid } from "./components/marketing/DepartmentGrid";
import { WhySection } from "./components/marketing/WhySection";
import { TrustSection } from "./components/marketing/TrustSection";
import { Footer } from "./components/marketing/Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <DepartmentGrid />
      <WhySection />
      <TrustSection />
      <Footer />
    </div>
  );
}
