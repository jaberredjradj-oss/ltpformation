import { TRAINING_CATEGORIES } from "@/lib/constants";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FormationPreviewCard } from "./FormationPreviewCard";

const gridClass: Record<string, string> = {
  ssiap: "sm:col-span-2 xl:col-span-2",
  epi: "sm:col-span-2 xl:col-span-2",
};

export function CategoryPreview() {
  return (
    <Section variant="white" size="spacious" wash="gold">
      <SectionHeading
        eyebrow="Nos domaines"
        title="Découvrez nos formations"
        description="Sécurité incendie, secourisme, sûreté et prévention des risques — parcours certifiants encadrés par des experts du terrain."
        spacious
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
        {TRAINING_CATEGORIES.map((category, index) => (
          <FormationPreviewCard
            key={category.id}
            title={category.title}
            subtitle={category.subtitle}
            description={category.description}
            visual={category.visual}
            image={category.image}
            layout={category.layout}
            highlights={category.highlights}
            badge={category.badge}
            delay={index * 0.06}
            className={gridClass[category.id]}
          />
        ))}
      </div>

      <div className="mt-12 text-center md:mt-20">
        <Button href="/formations" variant="primary" className="w-full sm:w-auto">
          Voir toutes les formations
        </Button>
      </div>
    </Section>
  );
}
