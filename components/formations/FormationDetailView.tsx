"use client";

import type { Formation } from "@/lib/formations/types";
import { FormationContactBand } from "@/components/formations/FormationContactBand";
import { FormationCertificationBadge } from "@/components/formations/FormationCertificationBadge";
import { FormationCpfInfo } from "@/components/formations/FormationCpfInfo";
import { FormationDetailHero } from "@/components/formations/FormationDetailHero";
import { FormationDetailSection } from "@/components/formations/FormationDetailSection";
import { FormationMetaValue } from "@/components/formations/FormationMetaValue";
import { FormationProgramme } from "@/components/formations/FormationProgramme";
import { FormationCTA } from "@/components/formations/FormationCTA";
import { FormationPdfCard } from "@/components/formations/FormationPdfCard";
import { FormationSectionGroup } from "@/components/formations/FormationSectionGroup";
import { Container } from "@/components/ui/Container";

interface FormationDetailViewProps {
  formation: Formation;
}

const SECTION_LINKS = [
  { id: "apercu", label: "Aperçu" },
  { id: "objectifs", label: "Objectifs" },
  { id: "programme", label: "Programme" },
  { id: "informations", label: "Informations pratiques" },
  { id: "certification", label: "Certification" },
  { id: "accessibilite", label: "Accessibilité" },
];

export function FormationDetailView({ formation }: FormationDetailViewProps) {
  const isStub = formation.contentStatus === "stub";

  return (
    <>
      <FormationDetailHero formation={formation} />

      <section className="section-wash-surface pb-12 md:pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-4">
                <div className="refined-card min-w-0 space-y-5 p-4 sm:p-5 md:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Informations clés
                  </p>
                  <div className="space-y-4 text-sm">
                    <FormationMetaValue label="Catégorie" value={formation.categoryLabel} valueClassName="text-sm font-semibold text-body-strong" />
                    <FormationMetaValue label="Type" value={formation.typeLabel} valueClassName="text-sm font-semibold text-body-strong" />
                    <FormationMetaValue label="Durée" value={formation.durationLabel} valueClassName="text-sm font-semibold text-body-strong" />
                    <FormationMetaValue label="Tarif" value={formation.price.label} valueClassName="text-sm font-semibold text-body-strong" />
                    {formation.certificationCode && (
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                          Certification
                        </p>
                        <div className="mt-2">
                          <FormationCertificationBadge code={formation.certificationCode} />
                        </div>
                      </div>
                    )}
                  </div>
                  <FormationCpfInfo formation={formation} />
                  <FormationCTA formation={formation} layout="stack" />
                </div>

                <FormationPdfCard formation={formation} />

                <nav className="refined-card hidden p-4 md:p-5 lg:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Sommaire
                  </p>
                  <ul className="mt-3 space-y-2">
                    {SECTION_LINKS.map((link) => (
                      <li key={link.id}>
                        <a
                          href={`#${link.id}`}
                          className="text-sm font-medium text-body-strong transition-colors hover:text-blue-600"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>

            <div className="space-y-10 md:space-y-14">
              <FormationSectionGroup
                id="apercu"
                eyebrow="Vue d'ensemble"
                title="Présentation et public concerné"
                description="Les informations essentielles pour comprendre le cadre, le public visé et les prérequis de la formation."
              >
                <FormationDetailSection
                  title="Présentation"
                  content={formation.presentation}
                  pending={isStub}
                />
                <FormationDetailSection
                  title="Public concerné"
                  items={formation.publicConcerned}
                  pending={isStub}
                />
                <FormationDetailSection
                  title="Pré-requis"
                  items={formation.prerequisites}
                  pending={isStub}
                />
              </FormationSectionGroup>

              <FormationSectionGroup
                id="objectifs"
                eyebrow="Pédagogie"
                title="Objectifs de la formation"
              >
                <FormationDetailSection
                  title="Objectifs"
                  items={formation.objectives}
                  pending={isStub}
                />
              </FormationSectionGroup>

              <FormationSectionGroup
                id="programme"
                eyebrow="Programme"
                title="Contenu et modules"
                description="Répartition officielle des modules et volumes horaires tels que définis dans le programme certifié."
              >
                <FormationProgramme programme={formation.programme} pending={isStub} />
              </FormationSectionGroup>

              <FormationSectionGroup
                id="informations"
                eyebrow="Organisation"
                title="Informations pratiques"
                description="Modalités d'inscription, évaluation, moyens pédagogiques et encadrement."
              >
                <FormationDetailSection
                  title="Modalités d'inscription"
                  items={formation.registration}
                  pending={isStub}
                />
                {formation.cpfEligible && (
                  <FormationCpfInfo formation={formation} />
                )}
                <FormationDetailSection
                  title="Évaluation"
                  items={formation.evaluation}
                  pending={isStub}
                />
                <FormationDetailSection
                  title="Équipe pédagogique"
                  items={formation.pedagogicalTeam}
                  pending={isStub}
                />
                <FormationDetailSection
                  title="Moyens pédagogiques"
                  items={formation.pedagogicalMeans}
                  pending={isStub}
                />
                <FormationDetailSection
                  title="Suivi et évaluation"
                  items={formation.followUp}
                  pending={isStub}
                />
              </FormationSectionGroup>

              <FormationSectionGroup
                id="certification"
                eyebrow="Certification"
                title="Certification et débouchés"
              >
                <FormationDetailSection
                  title="Certifications et labels"
                  items={formation.certifications}
                  pending={isStub}
                />
                <FormationDetailSection
                  title="Débouchés et évolution"
                  items={formation.careerOutcomes}
                  pending={isStub}
                />
              </FormationSectionGroup>

              <FormationSectionGroup
                id="accessibilite"
                eyebrow="Inclusion"
                title="Accessibilité handicap"
              >
                <FormationDetailSection
                  title="Accessibilité et aménagements"
                  content={formation.accessibility}
                  pending={isStub}
                />
              </FormationSectionGroup>
            </div>
          </div>
        </Container>
      </section>

      <FormationContactBand formation={formation} />
    </>
  );
}
