"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...props, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function Toaster() {
  const context = React.useContext(ToastContext);
  if (!context) return null;

  const { toasts, dismiss } = context;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "w-80 rounded-lg border p-4 shadow-lg",
            t.variant === "destructive" && "border-red-200 bg-red-50",
            t.variant === "success" && "border-green-200 bg-green-50",
            t.variant === "default" && "border-[#E2E8F0] bg-white"
          )}
        >
          <div className="flex justify-between gap-2">
            <div>
              {t.title && (
                <p className="text-sm font-semibold text-[#0F172A]">{t.title}</p>
              )}
              {t.description && (
                <p className="text-sm text-[#64748B]">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-[#94A3B8] hover:text-[#64748B]"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
