import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function FormationNotFound() {
  return (
    <section className="section-wash-surface py-20 md:py-28">
      <Container>
        <div className="refined-card mx-auto max-w-xl px-8 py-12 text-center md:px-12">
          <p className="section-eyebrow">Formation introuvable</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-navy-950">
            Cette formation n&apos;existe pas dans notre catalogue
          </h1>
          <p className="editorial-lead mx-auto mt-4 max-w-md">
            Le programme recherché n&apos;est pas disponible. Retournez au catalogue pour explorer
            l&apos;ensemble de nos formations certifiantes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/formations" variant="primary">
              Voir le catalogue
            </Button>
            <Link
              href="/contact"
              className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
