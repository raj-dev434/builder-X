import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoriteStore {
  favoriteBlockIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favoriteBlockIds: [],

      toggleFavorite: (id) => {
        set((state) => {
          const exists = state.favoriteBlockIds.includes(id);
          if (exists) {
            return {
              favoriteBlockIds: state.favoriteBlockIds.filter(
                (fid) => fid !== id
              ),
            };
          } else {
            return {
              favoriteBlockIds: [...state.favoriteBlockIds, id],
            };
          }
        });
      },

      isFavorite: (id) => {
        return get().favoriteBlockIds.includes(id);
      },

      clearFavorites: () => {
        set({ favoriteBlockIds: [] });
      },
    }),
    {
      name: "builderx-favorites", // localStorage key
    }
  )
);
