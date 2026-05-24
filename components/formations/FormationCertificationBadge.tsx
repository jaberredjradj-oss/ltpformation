import {
  getCertificationCodeLabel,
  getCertificationCodeUrl,
} from "@/lib/formations/certification";
import { cn } from "@/lib/utils";

interface FormationCertificationBadgeProps {
  code: string;
  className?: string;
}

export function FormationCertificationBadge({
  code,
  className,
}: FormationCertificationBadgeProps) {
  const url = getCertificationCodeUrl(code);
  const label = getCertificationCodeLabel(code);
  const styles = cn(
    "max-w-full whitespace-normal rounded-full border border-navy-200/80 bg-white/95 px-3 py-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-navy-800 transition-colors duration-300",
    url && "hover:border-blue-300/70 hover:text-blue-700",
    className,
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles}
        title={`Consulter la fiche ${code} sur France Compétences`}
      >
        {code}
      </a>
    );
  }

  return (
    <span className={styles} title={label}>
      {code}
    </span>
  );
}
