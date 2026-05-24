"use client";

import { adminStyles } from "@/components/admin/admin-styles";

interface AdminActionButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
}

export function AdminActionButton({ label, onClick, href }: AdminActionButtonProps) {
  function handleClick() {
    if (onClick) {
      onClick();
      return;
    }
    window.alert("Fonctionnalité à venir — Phase 2 admin.");
  }

  if (href) {
    return (
      <a href={href} className={adminStyles.btnSecondary}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={handleClick} className={adminStyles.btnSecondary}>
      {label}
    </button>
  );
}
