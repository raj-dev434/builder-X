import { create } from "zustand";

type LeftPanelMode =
  | "blocks"
  | "properties"
  | "layers"
  | "history"
  | "settings";

interface UIState {
  isSidebarOpen: boolean;
  leftPanelMode: LeftPanelMode;
  sidebarWidth: number;

  insertionTarget: {
    parentId: string;
    index?: number;
    gridIndex?: number;
  } | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setLeftPanelMode: (mode: LeftPanelMode) => void;
  setSidebarWidth: (width: number) => void;
  setInsertionTarget: (
    target: { parentId: string; index?: number; gridIndex?: number } | null
  ) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  leftPanelMode: "blocks",
  sidebarWidth: 360,

  insertionTarget: null,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setLeftPanelMode: (mode) => set({ leftPanelMode: mode }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setInsertionTarget: (target) => set({ insertionTarget: target }),
}));
