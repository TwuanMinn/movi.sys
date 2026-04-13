import { create } from "zustand";

type Theme = "dark" | "light" | "system";

interface UIState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  activeModal: string | null;
  notificationCount: number;
  theme: Theme;
  _hydrated: boolean;
  hydrate: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setNotificationCount: (count: number) => void;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Defaults — safe for SSR (no localStorage access)
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeModal: null,
  notificationCount: 0,
  theme: "dark",
  _hydrated: false,

  // Called once on client mount to sync from localStorage
  hydrate: () =>
    set(() => {
      const sidebar = localStorage.getItem("cineforge-sidebar") === "true";
      const theme = (localStorage.getItem("cineforge-theme") as Theme) ?? "dark";
      return { sidebarCollapsed: sidebar, theme, _hydrated: true };
    }),

  toggleSidebar: () =>
    set((state) => {
      const next = !state.sidebarCollapsed;
      localStorage.setItem("cineforge-sidebar", String(next));
      return { sidebarCollapsed: next };
    }),
  setSidebarCollapsed: (collapsed) => {
    localStorage.setItem("cineforge-sidebar", String(collapsed));
    set({ sidebarCollapsed: collapsed });
  },
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setNotificationCount: (count) => set({ notificationCount: count }),
  setTheme: (theme) => {
    localStorage.setItem("cineforge-theme", theme);
    set({ theme });
  },
}));
