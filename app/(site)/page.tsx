import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Certifications } from "@/components/home/Certifications";
import { Stats2025 } from "@/components/home/Stats2025";
import { AboutPreview } from "@/components/home/AboutPreview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { GoogleReviewsSection } from "@/components/reviews/GoogleReviewsSection";

export const metadata: Metadata = {
  title: {
    absolute:
      "Centre de formation Sécurité, SSIAP & Secourisme à Voisins-le-Bretonneux (78) | LT Protect Formation",
  },
  description:
    "Centre de formation agréé à Voisins-le-Bretonneux, au cœur de Saint-Quentin-en-Yvelines (78). Formations SSIAP, CQP APS, SST, habilitations électriques. Financement CPF. Certifié Qualiopi.",
};

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
