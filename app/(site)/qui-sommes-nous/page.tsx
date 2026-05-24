import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "Qui sommes-nous",
  description:
    "Découvrez LT Protect Formation : centre certifié à Voisins-le-Bretonneux, pédagogie opérationnelle, salles professionnelles et formateurs experts.",
};

export default function QuiSommesNousPage() {
  return <AboutView />;
}
