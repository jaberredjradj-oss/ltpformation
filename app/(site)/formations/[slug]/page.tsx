import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormationDetailView } from "@/components/formations/FormationDetailView";
import { getAllFormationSlugs } from "@/lib/formations/catalog";
import { loadFormation } from "@/lib/repositories/formations";

interface FormationDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Revalidate every 5 minutes; admin mutations will also revalidate on-demand.
export const revalidate = 300;

export async function generateStaticParams() {
  // Prerender the static catalog slugs at build time so every existing URL
  // keeps its SSG behavior and SEO. New DB-only slugs render on-demand (ISR)
  // because `dynamicParams` defaults to true.
  return getAllFormationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FormationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formation = await loadFormation(slug);

  if (!formation) {
    return { title: "Formation introuvable" };
  }

  return {
    title: formation.title,
    description: formation.summary,
  };
}

export default async function FormationDetailPage({ params }: FormationDetailPageProps) {
  const { slug } = await params;
  const formation = await loadFormation(slug);

  if (!formation) {
    notFound();
  }

  return <FormationDetailView formation={formation} />;
}
