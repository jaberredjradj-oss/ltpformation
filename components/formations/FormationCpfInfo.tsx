import Image from "next/image";
import { CERTIFICATIONS } from "@/lib/constants";
import type { Formation } from "@/lib/formations/types";
import { cn } from "@/lib/utils";

const CPF_LOGO = CERTIFICATIONS.find((cert) => cert.id === "cpf")?.image ?? "/certifications/cpf.png";

interface FormationCpfInfoProps {
  formation: Formation;
  compact?: boolean;
}

export function FormationCpfInfo({ formation, compact }: FormationCpfInfoProps) {
  if (!formation.cpfEligible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        compact ? "py-1" : "rounded-xl border border-slate-200/80 bg-white/80 px-4 py-5",
      )}
    >
      <Image
        src={CPF_LOGO}
        alt="Compte personnel de formation (CPF)"
        width={compact ? 72 : 120}
        height={compact ? 36 : 60}
        className="h-auto w-auto max-w-full object-contain"
      />
    </div>
  );
}
