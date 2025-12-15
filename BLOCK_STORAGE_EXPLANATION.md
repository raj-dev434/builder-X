# Block Storage in Memory (Zustand)

## Core Concept: One Single Tree of Blocks
The entire page layout is stored deeply within a **single array** of root blocks in the `useCanvasStore` (Zustand).

```typescript
// The store state
interface CanvasStore {
  blocks: Block[]; // <-- The "Source of Truth"
  blockMap: Map<string, Block>; // Optimization
  parentMap: Map<string, string | null>; // Optimization
  // ...
}
```

## 1. The Data Structure (Recursive Tree)
Each block is a JavaScript Object that can contain other blocks (children). This creates a recursive tree structure.

**Visual Representation:**
```text
Canvas (Root Array)
├── Section Block (id: "sec-1")
│   └── Row Block (id: "row-1")
│       ├── Column Block (id: "col-1")
│       │   └── Heading Block (id: "head-1")
│       └── Column Block (id: "col-2")
│           └── Image Block (id: "img-1")
└── Section Block (id: "sec-2")
    ...
```

**Code Representation (Block Interface):**
Every block adheres to the `BaseBlock` interface (or specific extensions of it):

```typescript
interface Block {
  id: string;          // Unique Identifier (e.g., "17f8a9b2")
  type: string;        // "section", "button", "text", etc.
  props: {             // Key-value storage for all settings
    backgroundColor: "red",
    padding: "20px",
    text: "Hello World",
    animation: "fadeIn" // <-- Stored here as a string
    // ...
  };
  children?: Block[];  // Recursive array of child blocks
}
```

## 2. Fast Access Optimization (HashMaps)
While the `blocks` array is the *truth*, traversing a deep tree to find a specific block ID is slow (O(n)).
To fix this, the store maintains two **HashMaps** that represent a "flat" view of the tree. These are rebuilt whenever the tree changes.

1.  **`blockMap`**: `Map<string, Block>`
    *   *Key*: Block ID
    *   *Value*: Reference to the Block object itself.
    *   *Usage*: Instantly retrieve block data by ID without searching.

2.  **`parentMap`**: `Map<string, string | null>`
    *   *Key*: Block ID
    *   *Value*: ID of the parent block (or null if root).
    *   *Usage*: Instantly find who the parent is (needed for deletion/moving).

## 3. How Updates Work
Since Zustand state must be immutable, we cannot just say `block.props.color = 'blue'`.
When you update a block (e.g., change color):

1.  **Clone**: The store creates a deep copy of the `blocks` array (or path to the modified node).
2.  **Modify**: The specific target block in the copied tree is updated.
3.  **Set**: The new tree replaces the old `blocks` in the store.
4.  **Rebuild Maps**: `blockMap` and `parentMap` are regenerated from this new tree.

## 4. History (Undo/Redo)
The store keeps an array of *snapshots* of the `blocks` tree:
`history: [TreeSnapshot1, TreeSnapshot2, ...]`

*   **Undo**: Replaces the current `blocks` with the previous snapshot.
*   **Redo**: Replaces `blocks` with the next snapshot.

## 5. Persistence (LocalStorage)
The store uses `persist` middleware.
*   It saves the `savedBlocks` array to the browser's **LocalStorage** under the key `builderx-canvas`.
*   On page reload, it reads this JSON string, parses it back into the object tree, and rebuilds the HashMaps.
