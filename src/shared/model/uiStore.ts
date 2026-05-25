import { create } from "zustand";

interface UIState {
  isAiHistoryOpen: boolean;
  toggleAiHistory: () => void;
  openAiHistory: () => void;
  closeAiHistory: () => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAiHistoryOpen: true,
  toggleAiHistory: () =>
    set((state) => ({ isAiHistoryOpen: !state.isAiHistoryOpen })),
  openAiHistory: () => set({ isAiHistoryOpen: true }),
  closeAiHistory: () => set({ isAiHistoryOpen: false }),
  isSidebarOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
