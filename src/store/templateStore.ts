import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Block, BlockTemplate } from "../schema/types";
import { generateId } from "../utils/idGenerator";

interface TemplateStore {
  savedTemplates: BlockTemplate[];
  saveTemplate: (block: Block, name: string) => void;
  updateTemplate: (id: string, block: Block, name: string) => void;
  deleteTemplate: (id: string) => void;
  initializeDefaultTemplates: () => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      savedTemplates: [],

      initializeDefaultTemplates: () => {
        // Placeholder for loading default templates if needed
      },

      saveTemplate: (block, name) => {
        // Create a deep copy of the block to detach it from the current canvas state
        // We probably want to regenerate IDs for the template structure so it's fresh?
        // Or keep them and regenerate on instantiation.
        // Best practice: Store as is, regenerate on instantiation (which logic already handles usually? No, addBlock logic usually takes a template).
        // Let's store a clean copy.

        const cleanBlock = JSON.parse(JSON.stringify(block));

        // Remove the top-level ID so it doesn't conflict if we were to strictly use it (though instantiation generates new ID)
        // Actually, BlockTemplate expects `block: Omit<Block, 'id'>`.
        const { id, ...blockData } = cleanBlock;

        const newTemplate: BlockTemplate = {
          id: `tpl_${generateId()}`,
          name: name,
          icon: "💾", // Custom icon for saved templates
          block: blockData,
        };

        set((state) => ({
          savedTemplates: [...state.savedTemplates, newTemplate],
        }));
      },

      updateTemplate: (id, block, name) => {
        const cleanBlock = JSON.parse(JSON.stringify(block));
        const { id: blockId, ...blockData } = cleanBlock;

        set((state) => ({
          savedTemplates: state.savedTemplates.map((t) =>
            t.id === id ? { ...t, name, block: blockData, icon: "💾" } : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          savedTemplates: state.savedTemplates.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "builderx-templates", // localStorage key
    }
  )
);
