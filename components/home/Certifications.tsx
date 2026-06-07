import { CERTIFICATIONS } from "@/lib/constants";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificationCard } from "./CertificationCard";

export function Certifications() {
  return (
    <Section variant="surface" id="certifications" size="compact" wash="surface">
      <SectionHeading
        eyebrow="Conformité & qualité"
        title="Certifications et éligibilités"
        description="Un organisme certifié Qualiopi et reconnu, dont les formations sont finançables (CPF, OPCO) et répondent à toutes les exigences réglementaires en vigueur."
        className="heading-accent-glow"
      />

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {CERTIFICATIONS.map((cert, index) => (
          <CertificationCard
            key={cert.id}
            name={cert.name}
            shortName={cert.shortName}
            description={cert.description}
            image={cert.image}
            points={cert.points}
            delay={index * 0.06}
          />
        ))}
      </div>
    </Section>
  );
}
