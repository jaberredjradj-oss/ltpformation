import { SITE } from "@/lib/constants";
import type { Formation } from "@/lib/formations/types";
import { FormationCTA } from "@/components/formations/FormationCTA";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { Container } from "@/components/ui/Container";

interface FormationContactBandProps {
  formation: Formation;
}

export function FormationContactBand({ formation }: FormationContactBandProps) {
  return (
    <section className="section-wash-blue pb-16 pt-4 md:pb-20">
      <Container>
        <div className="refined-card overflow-hidden">
          <div className="gradient-bar-animated" />
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <p className="section-eyebrow">Contact & inscription</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-navy-950">
                Vous souhaitez vous inscrire à {formation.shortTitle} ?
              </h2>
              <p className="editorial-lead mt-4 max-w-lg">
                Notre équipe vous accompagne pour valider les prérequis, construire votre parcours
                et répondre à toutes vos questions administratives.
              </p>

              <div className="mt-6 space-y-3 text-sm text-body-strong">
                <p>
                  <span className="font-semibold text-navy-950">Téléphone :</span> {SITE.phone}
                </p>
                <p>
                  <span className="font-semibold text-navy-950">Email :</span> {SITE.email}
                </p>
                <p>
                  <span className="font-semibold text-navy-950">Adresse :</span> {SITE.address.full}
                </p>
              </div>

              <div className="mt-8">
                <FormationCTA formation={formation} />
              </div>
            </div>

            <div className="border-t border-slate-100 p-6 md:p-8 lg:border-l lg:border-t-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                Nous trouver
              </p>
              <GoogleMapEmbed className="mt-4" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
