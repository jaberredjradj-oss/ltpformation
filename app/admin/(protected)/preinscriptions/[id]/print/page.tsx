"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function PreinscriptionPrintPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    if (!id) return;

    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.src = `/admin/preinscriptions/${id}/sheet`;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    };

    document.body.appendChild(frame);
    return () => {
      document.body.removeChild(frame);
    };
  }, [id]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-sm text-body-strong">Préparation de l&apos;impression…</p>
    </div>
  );
}
