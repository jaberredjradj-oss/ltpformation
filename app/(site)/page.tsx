import { Hero } from "@/components/home/Hero";
import { Certifications } from "@/components/home/Certifications";
import { Stats2025 } from "@/components/home/Stats2025";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GoogleReviewsSection } from "@/components/reviews/GoogleReviewsSection";

export default function HomePage() {
  return (
    <div className="section-flow">
      <Hero />
      <Certifications />
      <AboutPreview />
      <Stats2025 />
      <WhyChooseUs />
      <GoogleReviewsSection />
    </div>
  );
}
