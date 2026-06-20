import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: {
    absolute:
      "Organisme de formation sécurité à Saint-Quentin-en-Yvelines (78) | LT Protect Formation",
  },
  description:
    "LT Protect Formation, organisme certifié Qualiopi à Voisins-le-Bretonneux (78). Spécialisé en formation sécurité incendie, sûreté et secourisme pour les Yvelines et l'Île-de-France. Formateurs issus du terrain.",
};

export default function QuiSommesNousPage() {
  return <AboutView />;
}
