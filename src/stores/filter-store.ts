import { create } from "zustand";

interface FilterState {
  genre: string;
  status: string;
  search: string;
  setGenre: (genre: string) => void;
  setStatus: (status: string) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  genre: "",
  status: "",
  search: "",
  setGenre: (genre) => set({ genre }),
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  clearFilters: () => set({ genre: "", status: "", search: "" }),
}));
