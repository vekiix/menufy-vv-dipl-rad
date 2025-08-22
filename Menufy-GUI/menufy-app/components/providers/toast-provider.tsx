"use client";

import { ReactNode, createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import errorToast from "../ui/error-toast";
import successToast from "../ui/success-toast";
import informationToast from "../ui/information-toast";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type: "success" | "error" | "info") => void;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    const id = ++toastId;
    setToasts((prev) => {
      const updated = [...prev, { id, message, type }];
      return updated.length > 5 ? updated.slice(1) : updated;
    });
    if(type != "info"){
      const timer = setTimeout(() => dismissToast(id), 5000);
      timers.current.set(id, timer);
    }
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  // Clear all timers on unmount
  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer));
      currentTimers.clear();
    };
  }, []);

  const contextValue = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) => {
  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = useCallback(() => setHovering(true), []);
  const handleMouseLeave = useCallback(() => setHovering(false), []);

  useEffect(() => {
    if (!hovering && toast.type != "info") {
      const timer = setTimeout(() => onDismiss(toast.id), 3000);
      return () => clearTimeout(timer);
    }
  }, [hovering, toast.id, onDismiss, toast.type]);

  const toastContent = useMemo(() => {
    switch (toast.type) {
      case "success":
        return successToast(toast.message, () => onDismiss(toast.id));
      case "error":
        return errorToast(toast.message, () => onDismiss(toast.id));
      case "info":
        return informationToast(toast.message, () => onDismiss(toast.id));
      default:
        return null;
    }
  }, [toast.type, toast.message, onDismiss, toast.id]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="transition-all duration-700 animate-slide-in"
    >
      {toastContent}
    </div>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};