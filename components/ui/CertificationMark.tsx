import Image from "next/image";
import { getCertificationPdf, type SiteCertification } from "@/lib/certifications";
import { cn } from "@/lib/utils";

interface CertificationMarkProps {
  cert: SiteCertification;
  imageWidth?: number;
  imageHeight?: number;
  imageClassName?: string;
  showLabel?: boolean;
  labelClassName?: string;
  className?: string;
}

export function CertificationMark({
  cert,
  imageWidth = 72,
  imageHeight = 32,
  imageClassName = "h-7 w-auto object-contain opacity-90",
  showLabel = false,
  labelClassName = "hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-700 xl:inline",
  className,
}: CertificationMarkProps) {
  const certificatePdf = getCertificationPdf(cert);

  const content = (
    <>
      <Image
        src={cert.image}
        alt={cert.name}
        width={imageWidth}
        height={imageHeight}
        className={imageClassName}
      />
      {showLabel && (
        <span className={labelClassName}>{cert.shortName}</span>
      )}
    </>
  );

  const wrapperClass = cn("flex items-center gap-2.5", className);

  if (certificatePdf) {
    return (
      <a
        href={certificatePdf}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          wrapperClass,
          "rounded-md transition-opacity duration-300 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
        )}
        aria-label={`Voir le certificat ${cert.name} (PDF)`}
        title={`Certificat ${cert.name} (PDF)`}
      >
        {content}
      </a>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
