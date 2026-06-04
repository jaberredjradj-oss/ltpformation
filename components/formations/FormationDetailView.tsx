"use client";

import type { Formation } from "@/lib/formations/types";
import { FormationContactBand } from "@/components/formations/FormationContactBand";
import { FormationCertificationBadge } from "@/components/formations/FormationCertificationBadge";
import { FormationCpfInfo } from "@/components/formations/FormationCpfInfo";
import { FormationDetailHero } from "@/components/formations/FormationDetailHero";
import { FormationDetailSection } from "@/components/formations/FormationDetailSection";
import { FormationProgramme } from "@/components/formations/FormationProgramme";
import { FormationCTA } from "@/components/formations/FormationCTA";
import { FormationPdfCard } from "@/components/formations/FormationPdfCard";
import {
  FORMATION_PEDAGOGICAL_MODE,
  formatFormationDurationHours,
  formatFormationPriceEuro,
} from "@/lib/formations/display";
import { FormationMetaValue } from "@/components/formations/FormationMetaValue";
import { Container } from "@/components/ui/Container";

interface FormationDetailViewProps {
  formation: Formation;
}

const SECTION_LINKS = [
  { id: "description", label: "Description" },
  { id: "contenu", label: "Contenu de la formation" },
  { id: "objectifs", label: "Objectifs de la formation" },
  { id: "public", label: "Public visé" },
  { id: "prerequis", label: "Prérequis" },
  { id: "modalites-pedagogiques", label: "Modalités pédagogiques" },
  { id: "formateur", label: "Profil du formateur" },
  { id: "moyens", label: "Moyens et supports pédagogiques" },
  { id: "evaluation", label: "Modalités d'évaluation et de suivi" },
  { id: "admission", label: "Informations sur l'admission" },
  { id: "accessibilite", label: "Informations sur l'accessibilité" },
] as const;

function mergeEvaluationAndFollowUp(formation: Formation): string[] {
  return [...formation.evaluation, ...formation.followUp];
}

export function FormationDetailView({ formation }: FormationDetailViewProps) {
  const isStub = formation.contentStatus === "stub";
  const durationHours = formatFormationDurationHours(formation.durationHours);
  const priceLabel = formatFormationPriceEuro(formation);

  return (
    <>
      <FormationDetailHero formation={formation} />

      <section className="section-wash-surface pb-12 md:pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-10 xl:gap-12">
            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-4">
                <div className="refined-card min-w-0 space-y-4 p-4 sm:p-5 md:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Informations clés
                  </p>
                  <div className="space-y-3.5 text-sm">
                    <FormationMetaValue
                      label="Catégorie"
                      value={formation.categoryLabel}
                      valueClassName="text-sm font-semibold text-body-strong"
                    />
                    <FormationMetaValue
                      label="Modalité pédagogique"
                      value={FORMATION_PEDAGOGICAL_MODE}
                      valueClassName="text-sm font-semibold text-body-strong"
                    />
                    <FormationMetaValue
                      label="Durée"
                      value={durationHours}
                      valueClassName="text-sm font-semibold tabular-nums text-body-strong"
                    />
                    <FormationMetaValue
                      label="Tarif"
                      value={priceLabel}
                      valueClassName="text-sm font-semibold tabular-nums text-blue-600"
                    />
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
                  {formation.cpfEligible && <FormationCpfInfo formation={formation} />}
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

            <div className="min-w-0 space-y-5 md:space-y-6">
              <FormationDetailSection
                id="description"
                title="Description"
                content={formation.presentation}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationProgramme
                id="contenu"
                programme={formation.programme}
                pending={isStub}
                title="Contenu de la formation"
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="objectifs"
                title="Objectifs de la formation"
                items={formation.objectives}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="public"
                title="Public visé"
                items={formation.publicConcerned}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="prerequis"
                title="Prérequis"
                items={formation.prerequisites}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="modalites-pedagogiques"
                title="Modalités pédagogiques"
                content={FORMATION_PEDAGOGICAL_MODE}
                pending={false}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="formateur"
                title="Profil du formateur"
                items={formation.pedagogicalTeam}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="moyens"
                title="Moyens et supports pédagogiques"
                items={formation.pedagogicalMeans}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="evaluation"
                title="Modalités d'évaluation et de suivi"
                items={mergeEvaluationAndFollowUp(formation)}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="admission"
                title="Informations sur l'admission"
                items={formation.registration}
                pending={isStub}
                className="scroll-mt-28"
              />

              <FormationDetailSection
                id="accessibilite"
                title="Informations sur l'accessibilité"
                content={formation.accessibility}
                pending={isStub}
                className="scroll-mt-28"
              />

              {formation.careerOutcomes.length > 0 && (
                <FormationDetailSection
                  title="Débouchés et évolution"
                  items={formation.careerOutcomes}
                  pending={isStub}
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      <FormationContactBand formation={formation} />
    </>
  );
}
