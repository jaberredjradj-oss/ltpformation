"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  tone?: "default" | "danger";
  disabled?: boolean;
}

export function AdminActionButton({
  label,
  onClick,
  href,
  tone = "default",
  disabled = false,
}: AdminActionButtonProps) {
  const className = tone === "danger" ? adminStyles.btnDangerOutline : adminStyles.btnSecondary;

  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }
    window.alert("Fonctionnalité à venir — Phase 2 admin.");
  }

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} disabled={disabled} className={className}>
      {label}
    </button>
  );
}
