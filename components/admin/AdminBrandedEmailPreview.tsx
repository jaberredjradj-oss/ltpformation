"use client";

import { useEffect, useMemo, useState } from "react";
import { buildBrandedEmail } from "@/lib/email/layout";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

interface AdminBrandedEmailPreviewProps {
  subject: string;
  message: string;
  className?: string;
}

export function AdminBrandedEmailPreview({
  subject,
  message,
  className,
}: AdminBrandedEmailPreviewProps) {
  const [logoBaseUrl, setLogoBaseUrl] = useState<string | undefined>();

  useEffect(() => {
    setLogoBaseUrl(window.location.origin);
  }, []);

  const previewHtml = useMemo(() => {
    const body = message.trim() || "Votre message apparaîtra ici.";
    return buildBrandedEmail(body, { logoBaseUrl }).html;
  }, [message, logoBaseUrl]);

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className={adminStyles.label}>Aperçu de l&apos;email envoyé</p>
        <span className="text-[11px] text-slate-500">Mise en page finale</span>
      </div>

      {subject.trim() && (
        <p className="mb-2 truncate rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          <span className="font-semibold text-slate-900">Objet :</span> {subject}
        </p>
      )}

      <div className="min-h-[320px] flex-1 overflow-hidden rounded-lg border border-slate-200 bg-[#eef1f6] shadow-inner">
        <iframe
          title="Aperçu email LT Protect Formation"
          srcDoc={previewHtml}
          className="h-full min-h-[320px] w-full border-0 bg-[#eef1f6]"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
