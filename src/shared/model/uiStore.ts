import { create } from "zustand";

interface UIState {
  isAiHistoryOpen: boolean;
  toggleAiHistory: () => void;
  openAiHistory: () => void;
  closeAiHistory: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAiHistoryOpen: true,
  toggleAiHistory: () =>
    set((state) => ({ isAiHistoryOpen: !state.isAiHistoryOpen })),
  openAiHistory: () => set({ isAiHistoryOpen: true }),
  closeAiHistory: () => set({ isAiHistoryOpen: false }),
}));
