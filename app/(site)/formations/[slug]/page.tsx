import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormationDetailView } from "@/components/formations/FormationDetailView";
import { getAllFormationSlugs, getFormation } from "@/lib/formations/catalog";

interface FormationDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFormationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FormationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formation = getFormation(slug);

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
  const formation = getFormation(slug);

  if (!formation) {
    notFound();
  }

  return <FormationDetailView formation={formation} />;
}
