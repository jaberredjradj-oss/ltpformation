import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface EmptyPageProps {
  title: string;
  description: string;
}

export function EmptyPage({ title, description }: EmptyPageProps) {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white p-10 text-center shadow-[0_8px_40px_rgba(11,31,58,0.08)] md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            Page en construction
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-body-strong leading-relaxed">{description}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" variant="primary">
              Retour à l&apos;accueil
            </Button>
            <Link
              href="/contact"
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
