"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error";

interface ToastState {
  message: string;
  tone: ToastTone;
}

interface AdminToastContextValue {
  toast: ToastState | null;
  showToast: (message: string, tone?: ToastTone) => void;
  clearToast: () => void;
}

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "success") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({ toast, showToast, clearToast }),
    [toast, showToast, clearToast],
  );

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex justify-center px-4">
          <div
            className={cn(
              adminStyles.surface,
              "px-4 py-3 text-sm font-medium shadow-md",
              toast.tone === "success"
                ? "border-emerald-200 text-emerald-900"
                : "border-red-200 text-red-900",
            )}
          >
            {toast.message}
          </div>
        </div>
      )}
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within AdminToastProvider");
  }
  return context;
}
