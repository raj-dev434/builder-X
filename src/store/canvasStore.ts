import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Block, CanvasState, HistoryItem, PageSettings } from "../schema/types";
import { generateId } from "../utils/idGenerator";

// Helper function to build block maps for O(1) lookups
const buildBlockMaps = (
  blocks: Block[],
  parentId: string | null = null
): {
  blockMap: Map<string, Block>;
  parentMap: Map<string, string | null>;
} => {
  const blockMap = new Map<string, Block>();
  const parentMap = new Map<string, string | null>();

  const traverse = (blockList: Block[], parent: string | null) => {
    blockList.forEach((block) => {
      blockMap.set(block.id, block);
      parentMap.set(block.id, parent);
      if (block.children && block.children.length > 0) {
        traverse(block.children, block.id);
      }
    });
  };

  traverse(blocks, parentId);
  return { blockMap, parentMap };
};

// Helper to get block by ID (O(1))
export const getBlockById = (
  blockMap: Map<string, Block>,
  id: string
): Block | null => {
  return blockMap.get(id) || null;
};

// Helper to get parent ID (O(1))
export const getParentId = (
  parentMap: Map<string, string | null>,
  id: string
): string | null => {
  return parentMap.get(id) || null;
};

// HistoryItem imported from schema/types

export interface CanvasStore extends CanvasState {
  // Performance optimization: hashmaps for O(1) lookups
  blockMap: Map<string, Block>;
  parentMap: Map<string, string | null>;

  hoveredBlockId: string | null;
  copiedBlock: Block | null;
  setBlocks: (blocks: Block[]) => void;
  addBlock: (
    block: Omit<Block, "id">,
    parentId?: string,
    index?: number
  ) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string | null, multi?: boolean) => void;
  moveBlock: (id: string, newParentId: string | null, index: number) => void;

  // History State
  history: HistoryItem[];

  undo: () => void;
  redo: () => void;
  jumpToHistory: (index: number) => void;
  saveToHistory: (action?: string) => void;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setDragging: (isDragging: boolean) => void;
  clearCanvas: () => void;
  loadCanvas: (blocks: Block[]) => void;

  duplicateBlock: (id: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;

  copyBlock: (id: string) => void;
  cutBlock: (id: string) => void;
  pasteBlock: (parentId?: string, index?: number) => void;
  setHoveredBlockId: (id: string | null) => void;

  viewDevice: string;
  isPreviewMode: boolean;
  isFullscreen: boolean;
  setViewDevice: (device: "desktop" | "tablet" | "mobile") => void;
  togglePreviewMode: () => void;
  toggleFullscreen: () => void;

  // Templates
  savedTemplates: { id: string; name: string; blocks: Block[] }[];
  saveTemplate: (name: string, blocks: Block[]) => void;
  updateTemplate: (id: string, name: string, blocks: Block[]) => void;
  deleteTemplate: (id: string) => void;
  loadTemplate: (templateId: string) => void;

  // Clean up
  maxHistorySize: number;
  setMaxHistorySize: (size: number) => void;

  // Auto Save & Persistence
  autoSave: boolean;
  lastSaved: number | null;
  isSaving: boolean;
  savedBlocks: Block[]; // Added for manual persistence
  toggleAutoSave: () => void;
  saveProject: () => Promise<void>;
  pageSettings: PageSettings;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
}

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      // Initial state
      blocks: [],
      blockMap: new Map(),
      parentMap: new Map(),
      savedTemplates: [],
      selectedBlockIds: [],
      history: [{ blocks: [], action: "Initial State", timestamp: Date.now() }],
      historyIndex: 0,
      isDragging: false,
      hoveredBlockId: null,
      copiedBlock: null,

      viewDevice: "desktop",
      isPreviewMode: false,
      isFullscreen: false,

      autoSave: false,
      lastSaved: null,
      isSaving: false,
      savedBlocks: [], // Init empty
      pageSettings: {
        backgroundColor: '#ffffff',
        gridColor: 'rgba(0,0,0,0.1)',
        showGrid: false,
        backgroundType: 'solid',
        gradientStart: '#ffffff',
        gradientEnd: '#d1d5db',
        gradientDirection: 'to bottom',
        gradientType: 'linear',
      },

      maxHistorySize: 50,

      // --- Meta Actions ---
      toggleAutoSave: () => set((state) => ({ autoSave: !state.autoSave })),

      saveProject: async () => {
        set({ isSaving: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Commit current blocks to savedBlocks
        set((state) => ({
          isSaving: false,
          lastSaved: Date.now(),
          savedBlocks: JSON.parse(JSON.stringify(state.blocks)),
        }));
      },

      updatePageSettings: (settings) => {
        set((state) => {
          const defaultSettings: PageSettings = {
            backgroundColor: '#ffffff',
            gridColor: 'rgba(0,0,0,0.1)',
            showGrid: false,
            backgroundType: 'solid',
            gradientStart: '#ffffff',
            gradientEnd: '#d1d5db',
            gradientDirection: 'to bottom',
            gradientType: 'linear',
          };
          // Merge: Defaults -> Existing State -> New Updates
          return {
            pageSettings: {
              ...defaultSettings,
              ...(state.pageSettings || {}),
              ...settings
            }
          };
        });
        get().saveToHistory("Update Page Settings");
      },

      // --- View Actions ---

      setViewDevice: (device) => {
        set({ viewDevice: device });
      },

      togglePreviewMode: () => {
        set((state) => ({
          isPreviewMode: !state.isPreviewMode,
        }));
        if (!get().isPreviewMode) {
          get().saveToHistory("Toggle Preview");
        }
      },

      toggleFullscreen: () => {
        const { isFullscreen } = get();
        set({ isFullscreen: !isFullscreen });
        if (!isFullscreen) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      },

      setHoveredBlockId: (id) => set({ hoveredBlockId: id }),

      setBlocks: (blocks) => {
        const { blockMap, parentMap } = buildBlockMaps(blocks);
        set({ blocks, blockMap, parentMap });
        get().saveToHistory("Set Blocks");
      },

      setDragging: (isDragging) => {
        set({ isDragging });
      },

      clearCanvas: () => {
        set({
          blocks: [],
          blockMap: new Map(),
          parentMap: new Map(),
          selectedBlockIds: [],
          history: [
            { blocks: [], action: "Clear Canvas", timestamp: Date.now() },
          ],
          historyIndex: 0,
        });
      },

      loadCanvas: (blocks) => {
        const { blockMap, parentMap } = buildBlockMaps(blocks);
        set({
          blocks,
          blockMap,
          parentMap,
          selectedBlockIds: [],
          history: [
            {
              blocks: JSON.parse(JSON.stringify(blocks)),
              action: "Load Canvas",
              timestamp: Date.now(),
            },
          ],
          historyIndex: 0,
        });
      },

      setMaxHistorySize: (size) => set({ maxHistorySize: size }),

      // --- Templates Actions ---

      saveTemplate: (name, blocks) => {
        set((state) => ({
          savedTemplates: [
            ...state.savedTemplates,
            {
              id: generateId(),
              name,
              blocks: JSON.parse(JSON.stringify(blocks)),
            },
          ],
        }));
      },

      updateTemplate: (id, name, blocks) => {
        set((state) => ({
          savedTemplates: state.savedTemplates.map((t) =>
            t.id === id
              ? { ...t, name, blocks: JSON.parse(JSON.stringify(blocks)) }
              : t
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          savedTemplates: state.savedTemplates.filter((t) => t.id !== id),
        }));
      },

      loadTemplate: (templateId) => {
        const template = get().savedTemplates.find((t) => t.id === templateId);
        if (template) {
          const regenerateIds = (blocks: Block[]): Block[] => {
            return blocks.map((b) => ({
              ...b,
              id: generateId(),
              children: b.children ? regenerateIds(b.children) : undefined,
            }));
          };

          const newBlocks = regenerateIds(
            JSON.parse(JSON.stringify(template.blocks))
          );

          set((state) => {
            const updatedBlocks = [...state.blocks, ...newBlocks];
            const { blockMap, parentMap } = buildBlockMaps(updatedBlocks);
            return {
              blocks: updatedBlocks,
              blockMap,
              parentMap,
              selectedBlockIds: newBlocks.map((b) => b.id),
            };
          });
          get().saveToHistory(`Load Template: ${template.name}`);
        }
      },

      // --- Block Actions ---

      addBlock: (
        block: Omit<Block, "id">,
        parentId?: string,
        index?: number
      ) => {
        const assignIds = (b: any): Block => {
          const newId = generateId();
          const children = b.children ? b.children.map(assignIds) : undefined;
          return { ...b, id: newId, children } as Block;
        };

        let newBlock = assignIds(block);

        if (!parentId) {
          // Add to root
          set((state) => {
            const newBlocks = [...state.blocks];
            if (
              typeof index === "number" &&
              index >= 0 &&
              index <= newBlocks.length
            ) {
              newBlocks.splice(index, 0, newBlock);
            } else {
              newBlocks.push(newBlock);
            }
            const { blockMap, parentMap } = buildBlockMaps(newBlocks);
            return {
              blocks: newBlocks,
              blockMap,
              parentMap,
              selectedBlockIds: [newBlock.id],
            };
          });
        } else {
          // Add to specific parent using hashmap (O(1))
          const { blockMap } = get();
          const parentBlock = blockMap.get(parentId);

          if (!parentBlock) {
            console.error(`Parent block ${parentId} not found`);
            return;
          }

          // Clone blocks tree and update the specific parent
          const cloneAndUpdate = (blocks: Block[]): Block[] => {
            return blocks.map((b) => {
              if (b.id === parentId) {
                const children = [...(b.children || [])];

                // For grid layouts: pad array with nulls if index is beyond current length
                // This allows blocks to be placed at specific grid positions (e.g., cell 5 in an empty grid)
                if (
                  typeof index === "number" &&
                  index >= 0 &&
                  index > children.length
                ) {
                  // Pad with nulls up to the desired index
                  while (children.length < index) {
                    children.push(null as any);
                  }
                  children.push(newBlock);
                } else if (
                  typeof index === "number" &&
                  index >= 0 &&
                  index <= children.length
                ) {
                  children.splice(index, 0, newBlock);
                } else {
                  children.push(newBlock);
                }
                return { ...b, children } as Block;
              }
              if (b.children) {
                return { ...b, children: cloneAndUpdate(b.children) } as Block;
              }
              return b;
            });
          };

          set((state) => {
            const newBlocks = cloneAndUpdate(state.blocks);
            const { blockMap, parentMap } = buildBlockMaps(newBlocks);
            return {
              blocks: newBlocks,
              blockMap,
              parentMap,
              selectedBlockIds: [newBlock.id],
            };
          });
        }
        get().saveToHistory(`Add ${block.type}`);
      },

      updateBlock: (id, updates) => {
        const { blockMap } = get();
        const block = blockMap.get(id);

        if (!block) {
          console.error(`Block ${id} not found`);
          return;
        }

        // Clone blocks tree and update the specific block
        const cloneAndUpdate = (blocks: Block[]): Block[] => {
          return blocks.map((b) => {
            if (b.id === id) {
              return { ...b, ...updates } as Block;
            }
            if (b.children) {
              return { ...b, children: cloneAndUpdate(b.children) } as Block;
            }
            return b;
          });
        };

        set((state) => {
          const newBlocks = cloneAndUpdate(state.blocks);
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          return { blocks: newBlocks, blockMap, parentMap };
        });
        get().saveToHistory(`Update ${block.type}`);
      },

      deleteBlock: (id) => {
        // Clone blocks tree and delete the specific block
        const deleteFromTree = (blocks: Block[]): Block[] => {
          return blocks.filter((block) => {
            if (block.id === id) return false;
            if (block.children) {
              block.children = deleteFromTree(block.children);
            }
            return true;
          });
        };

        set((state) => {
          const newBlocks = deleteFromTree(state.blocks);
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          return {
            blocks: newBlocks,
            blockMap,
            parentMap,
            selectedBlockIds: state.selectedBlockIds.filter(
              (selectedId) => selectedId !== id
            ),
          };
        });

        get().saveToHistory("Delete Block");
      },

      selectBlock: (id: string | null, multi: boolean = false) => {
        set((state) => {
          if (!id) return { selectedBlockIds: [] };
          if (multi) {
            const isSelected = state.selectedBlockIds.includes(id);
            return {
              selectedBlockIds: isSelected
                ? state.selectedBlockIds.filter((i) => i !== id)
                : [...state.selectedBlockIds, id],
            };
          }
          return { selectedBlockIds: [id] };
        });
      },

      moveBlock: (id, newParentId, index) => {
        let blockToMove: Block | null = null;
        const removeBlock = (blocks: Block[]): Block[] => {
          return blocks.filter((block) => {
            if (block.id === id) {
              blockToMove = block;
              return false;
            }
            if (block.children) {
              block.children = removeBlock(block.children);
            }
            return true;
          });
        };

        const blocksWithoutMoved = removeBlock(get().blocks);
        if (!blockToMove) return;

        if (!newParentId) {
          const newBlocks = [...blocksWithoutMoved];
          newBlocks.splice(index, 0, blockToMove!);
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          set({ blocks: newBlocks, blockMap, parentMap });
          get().saveToHistory("Move Block");
          return;
        }

        const addToNewParent = (blocks: Block[]): Block[] => {
          return blocks.map((block) => {
            if (block.id === newParentId) {
              const children = [...(block.children || [])];
              children.splice(index, 0, blockToMove!);
              return { ...block, children };
            }
            if (block.children) {
              return { ...block, children: addToNewParent(block.children) };
            }
            return block;
          });
        };

        const newBlocks = addToNewParent(blocksWithoutMoved);
        const { blockMap, parentMap } = buildBlockMaps(newBlocks);
        set({ blocks: newBlocks, blockMap, parentMap });
        get().saveToHistory("Move Block");
      },

      duplicateBlock: (id) => {
        const { blocks } = get();
        let newBlockId: string | null = null;

        const duplicateChildren = (children: Block[]): Block[] => {
          return children.map((child) => ({
            ...child,
            id: generateId(),
            children: child.children
              ? duplicateChildren(child.children)
              : undefined,
          }));
        };

        const findAndDuplicateBlock = (blockList: Block[]): Block[] => {
          for (let i = 0; i < blockList.length; i++) {
            const block = blockList[i];
            if (block.id === id) {
              newBlockId = generateId();
              const duplicatedBlock = {
                ...block,
                id: newBlockId,
                children: block.children
                  ? duplicateChildren(block.children)
                  : undefined,
              };
              const newBlocks = [...blockList];
              newBlocks.splice(i + 1, 0, duplicatedBlock);
              return newBlocks;
            }
            if (block.children) {
              const updatedChildren = findAndDuplicateBlock(block.children);
              if (updatedChildren !== block.children) {
                const newBlocks = [...blockList];
                newBlocks[i] = { ...block, children: updatedChildren };
                return newBlocks;
              }
            }
          }
          return blockList;
        };

        const newBlocks = findAndDuplicateBlock(blocks);
        if (newBlocks !== blocks) {
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          set((state) => ({
            blocks: newBlocks,
            blockMap,
            parentMap,
            selectedBlockIds: newBlockId
              ? [...state.selectedBlockIds, newBlockId]
              : state.selectedBlockIds,
          }));
          get().saveToHistory("Duplicate Block");
        }
      },

      moveBlockUp: (id) => {
        const { blocks } = get();
        const findAndMoveUp = (blockList: Block[]): Block[] => {
          for (let i = 1; i < blockList.length; i++) {
            const block = blockList[i];
            if (block.id === id) {
              const newBlocks = [...blockList];
              [newBlocks[i - 1], newBlocks[i]] = [
                newBlocks[i],
                newBlocks[i - 1],
              ];
              return newBlocks;
            }
            if (block.children) {
              const updatedChildren = findAndMoveUp(block.children);
              if (updatedChildren !== block.children) {
                const newBlocks = [...blockList];
                newBlocks[i] = { ...block, children: updatedChildren };
                return newBlocks;
              }
            }
          }
          return blockList;
        };
        const newBlocks = findAndMoveUp(blocks);
        if (newBlocks !== blocks) {
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          set({ blocks: newBlocks, blockMap, parentMap });
          get().saveToHistory("Move Block Up");
        }
      },

      moveBlockDown: (id) => {
        const { blocks } = get();
        const findAndMoveDown = (blockList: Block[]): Block[] => {
          for (let i = 0; i < blockList.length - 1; i++) {
            const block = blockList[i];
            if (block.id === id) {
              const newBlocks = [...blockList];
              [newBlocks[i], newBlocks[i + 1]] = [
                newBlocks[i + 1],
                newBlocks[i],
              ];
              return newBlocks;
            }
            if (block.children) {
              const updatedChildren = findAndMoveDown(block.children);
              if (updatedChildren !== block.children) {
                const newBlocks = [...blockList];
                newBlocks[i] = { ...block, children: updatedChildren };
                return newBlocks;
              }
            }
          }
          return blockList;
        };
        const newBlocks = findAndMoveDown(blocks);
        if (newBlocks !== blocks) {
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          set({ blocks: newBlocks, blockMap, parentMap });
          get().saveToHistory("Move Block Down");
        }
      },

      copyBlock: (id) => {
        const { blockMap } = get();
        const blockToCopy = blockMap.get(id);

        if (blockToCopy) {
          const startClone = (b: Block): Block => ({
            ...b,
            children: b.children ? b.children.map(startClone) : [],
          });
          set({ copiedBlock: startClone(blockToCopy) });
        }
      },

      cutBlock: (id) => {
        get().copyBlock(id);
        get().deleteBlock(id);
      },

      pasteBlock: (parentId, index) => {
        const { copiedBlock, blocks } = get();
        if (!copiedBlock) return;

        const regenerateIds = (block: Block): Block => ({
          ...block,
          id: generateId(),
          children: block.children ? block.children.map(regenerateIds) : [],
        });

        const newBlock = regenerateIds(copiedBlock);

        if (!parentId) {
          const newBlocks = [...blocks];
          if (typeof index === "number" && index >= 0) {
            newBlocks.splice(index, 0, newBlock);
          } else {
            newBlocks.push(newBlock);
          }
          const { blockMap, parentMap } = buildBlockMaps(newBlocks);
          set({
            blocks: newBlocks,
            blockMap,
            parentMap,
            selectedBlockIds: [newBlock.id],
          });
          get().saveToHistory("Paste Block");
          return;
        }

        const updateBlocksRec = (currentBlocks: Block[]): Block[] => {
          return currentBlocks.map((block) => {
            if (block.id === parentId) {
              const newChildren = block.children ? [...block.children] : [];
              if (typeof index === "number" && index >= 0) {
                newChildren.splice(index, 0, newBlock);
              } else {
                newChildren.push(newBlock);
              }
              return { ...block, children: newChildren };
            }
            if (block.children) {
              return { ...block, children: updateBlocksRec(block.children) };
            }
            return block;
          });
        };

        const newBlocks = updateBlocksRec(blocks);
        const { blockMap, parentMap } = buildBlockMaps(newBlocks);
        set({
          blocks: newBlocks,
          blockMap,
          parentMap,
          selectedBlockIds: [newBlock.id],
        });
        get().saveToHistory("Paste Block");
      },

      // --- History ---

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const restoredState = history[historyIndex - 1];
          const restoredBlocks = restoredState.blocks;
          const { blockMap, parentMap } = buildBlockMaps(restoredBlocks);
          set({
            blocks: restoredBlocks,
            blockMap,
            parentMap,
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const restoredState = history[historyIndex + 1];
          const restoredBlocks = restoredState.blocks;
          const { blockMap, parentMap } = buildBlockMaps(restoredBlocks);
          set({
            blocks: restoredBlocks,
            blockMap,
            parentMap,
            historyIndex: historyIndex + 1,
          });
        }
      },

      jumpToHistory: (index: number) => {
        const { history } = get();
        if (index >= 0 && index < history.length) {
          const restoredState = history[index];
          const restoredBlocks = restoredState.blocks;
          const { blockMap, parentMap } = buildBlockMaps(restoredBlocks);
          set({
            blocks: restoredBlocks,
            blockMap,
            parentMap,
            historyIndex: index,
          });
        }
      },

      saveToHistory: (action = "Action") => {
        const { blocks, history, historyIndex, maxHistorySize } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          blocks: JSON.parse(JSON.stringify(blocks)),
          action,
          timestamp: Date.now(),
        });

        if (newHistory.length > maxHistorySize) {
          const excess = newHistory.length - maxHistorySize;
          newHistory.splice(0, excess);
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      clearHistory: () => {
        const { blocks } = get();
        set({
          history: [
            {
              blocks: JSON.parse(JSON.stringify(blocks)),
              action: "Reset History",
              timestamp: Date.now(),
            },
          ],
          historyIndex: 0,
        });
      },

      canUndo: () => {
        const { historyIndex } = get();
        return historyIndex > 0;
      },

      canRedo: () => {
        const { history, historyIndex } = get();
        return historyIndex < history.length - 1;
      },
    }),
    {
      name: "builderx-canvas",
      partialize: (state) => ({
        savedBlocks: state.savedBlocks, // Persist ONLY manually saved blocks
        viewDevice: state.viewDevice,
        savedTemplates: state.savedTemplates,
        maxHistorySize: state.maxHistorySize,
        pageSettings: state.pageSettings, // Persist page settings (background, gradients, grid)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Hydrate blocks from savedBlocks
          if (state.savedBlocks) {
            state.blocks = JSON.parse(JSON.stringify(state.savedBlocks));
          }

          // Rebuild maps
          if (state.blocks) {
            const { blockMap, parentMap } = buildBlockMaps(state.blocks);
            state.blockMap = blockMap;
            state.parentMap = parentMap;

            // Initial history state matches saved state
            state.history = [
              {
                blocks: JSON.parse(JSON.stringify(state.blocks)),
                action: "Session Restored",
                timestamp: Date.now(),
              },
            ];
            state.historyIndex = 0;
          }

          // CRITICAL FIX: Ensure pageSettings are properly restored with defaults
          // If pageSettings don't exist or are incomplete, merge with defaults
          const defaultPageSettings: PageSettings = {
            backgroundColor: '#ffffff',
            gridColor: 'rgba(0,0,0,0.1)',
            showGrid: false,
            backgroundType: 'solid',
            gradientStart: '#ffffff',
            gradientEnd: '#d1d5db',
            gradientDirection: 'to bottom',
            gradientType: 'linear',
          };

          state.pageSettings = {
            ...defaultPageSettings,
            ...(state.pageSettings || {})
          };
        }
      },
    }
  )
);
