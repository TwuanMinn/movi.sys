import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id" | "createdAt">) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

let counter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  show(toast) {
    const id = `toast-${++counter}-${Date.now()}`;
    const newToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
      duration: toast.duration ?? 4000,
    };
    set((s) => ({ toasts: [...s.toasts, newToast].slice(-5) })); // max 5 stacked

    const dur = newToast.duration!;
    if (dur > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, dur);
    }
    return id;
  },

  dismiss(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  dismissAll() {
    set({ toasts: [] });
  },
}));

export const toast = {
  success: (message: string, opts?: Partial<Omit<Toast, "id" | "createdAt" | "type">>) =>
    useToastStore.getState().show({ type: "success", message, ...opts }),
  error: (message: string, opts?: Partial<Omit<Toast, "id" | "createdAt" | "type">>) =>
    useToastStore.getState().show({ type: "error", message, ...opts }),
  warning: (message: string, opts?: Partial<Omit<Toast, "id" | "createdAt" | "type">>) =>
    useToastStore.getState().show({ type: "warning", message, ...opts }),
  info: (message: string, opts?: Partial<Omit<Toast, "id" | "createdAt" | "type">>) =>
    useToastStore.getState().show({ type: "info", message, ...opts }),
};
