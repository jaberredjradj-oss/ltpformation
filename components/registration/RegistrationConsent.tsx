import Link from "next/link";
import type { RegistrationIntent } from "@/lib/registration/types";
import { PRIVACY_POLICY_PATH } from "@/lib/constants";
import { FormCheckbox } from "@/components/ui/FormCheckbox";

interface RegistrationConsentProps {
  intent: RegistrationIntent;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

const CONSENT_SCOPE: Record<RegistrationIntent, string> = {
  devis: "ma demande de devis",
  preinscription: "ma pré-inscription",
};

export function RegistrationConsent({
  intent,
  checked,
  onChange,
  error,
}: RegistrationConsentProps) {
  return (
    <div className="space-y-3 border-t border-slate-100 pt-6">
      <FormCheckbox
        id="consent"
        name="consent"
        checked={checked}
        onChange={onChange}
        error={error}
      >
        J&apos;accepte que mes données soient utilisées dans le cadre de{" "}
        {CONSENT_SCOPE[intent]} conformément à la{" "}
        <Link
          href={PRIVACY_POLICY_PATH}
          className="font-semibold text-blue-600 underline decoration-blue-300/60 underline-offset-2 transition-colors hover:text-blue-700"
        >
          politique de confidentialité
        </Link>
        .
      </FormCheckbox>

      <p className="text-xs leading-relaxed text-lead-strong">
        Vos informations sont traitées de manière confidentielle par LT Protect Formation,
        uniquement pour répondre à votre demande. Vous disposez d&apos;un droit d&apos;accès,
        de rectification et de suppression en nous contactant.
      </p>
    </div>
  );
}
