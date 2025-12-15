import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BlockTemplate } from "../schema/types";

interface RecentStore {
  recentTemplates: BlockTemplate[];
  addRecent: (template: BlockTemplate) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      recentTemplates: [],

      addRecent: (template) => {
        set((state) => {
          // Remove if already exists to move it to top
          const filtered = state.recentTemplates.filter(
            (t) => t.id !== template.id
          );
          // Add to front and limit to 5
          const newRecent = [template, ...filtered].slice(0, 10);
          return { recentTemplates: newRecent };
        });
      },

      clearRecent: () => {
        set({ recentTemplates: [] });
      },
    }),
    {
      name: "builderx-recent", // localStorage key
    }
  )
);
