import { Hero } from "@/components/home/Hero";
import { Certifications } from "@/components/home/Certifications";
import { Stats2025 } from "@/components/home/Stats2025";
import { CategoryPreview } from "@/components/home/CategoryPreview";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ContactPreview } from "@/components/home/ContactPreview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <div className="section-flow">
      <Hero />
      <Certifications />
      <Stats2025 />
      <WhyChooseUs />
      <CategoryPreview />
      <AboutPreview />
      <ContactPreview />
    </div>
  );
}
