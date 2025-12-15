import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Asset {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: number;
}

interface AssetStore {
  assets: Asset[];
  isModalOpen: boolean;
  onSelectCallback: ((url: string) => void) | null;

  // Actions
  addAsset: (asset: Omit<Asset, "id" | "createdAt">) => void;
  removeAsset: (id: string) => void;
  openModal: (onSelect?: (url: string) => void) => void;
  closeModal: () => void;
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set) => ({
      assets: [],
      isModalOpen: false,
      onSelectCallback: null,

      addAsset: (assetData) =>
        set((state) => ({
          assets: [
            {
              ...assetData,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
            ...state.assets,
          ],
        })),

      removeAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        })),

      openModal: (callback) =>
        set({
          isModalOpen: true,
          onSelectCallback: callback || null,
        }),

      closeModal: () =>
        set({
          isModalOpen: false,
          onSelectCallback: null,
        }),
    }),
    {
      name: "pagebuilder-assets", // unique name
      partialize: (state) => ({ assets: state.assets }), // Only persist assets
    }
  )
);
