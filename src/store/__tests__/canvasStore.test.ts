import { renderHook, act } from "@testing-library/react";
import { useCanvasStore } from "../canvasStore";

// Mock the id generator
jest.mock("../../utils/idGenerator", () => ({
  generateId: jest.fn(() => "test-id-123"),
}));

describe("CanvasStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCanvasStore.getState().clearCanvas();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.blocks).toEqual([]);
      expect(result.current.selectedBlockIds).toEqual([]);
      expect(result.current.history).toEqual([[]]);
      expect(result.current.historyIndex).toBe(0);
      expect(result.current.isDragging).toBe(false);
    });
  });

  describe("addBlock", () => {
    it("should add a block to the root level", () => {
      const { result } = renderHook(() => useCanvasStore());
      const newBlock = {
        type: "text" as const,
        props: { content: "Test content" },
      };

      act(() => {
        result.current.addBlock(newBlock);
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.blocks[0].id).toBe("test-id-123");
      expect(result.current.blocks[0].type).toBe("text");
      expect(result.current.selectedBlockIds).toEqual(["test-id-123"]);
    });

    it("should add a block to a parent", () => {
      const { result } = renderHook(() => useCanvasStore());

      // First add a section block
      act(() => {
        result.current.addBlock({ type: "section", props: {} });
      });

      const sectionId = result.current.blocks[0].id;

      // Then add a text block to the section
      act(() => {
        result.current.addBlock(
          { type: "text", props: { content: "Test content" } },
          sectionId
        );
      });

      expect(result.current.blocks[0].children).toHaveLength(1);
      expect(result.current.blocks[0].children![0].type).toBe("text");
    });
  });

  describe("updateBlock", () => {
    it("should update a block", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({
          type: "text",
          props: { content: "Original" },
        });
      });

      const blockId = result.current.blocks[0].id;

      act(() => {
        result.current.updateBlock(blockId, {
          props: { content: "Updated content" },
        });
      });

      expect((result.current.blocks[0].props as any).content).toBe(
        "Updated content"
      );
    });
  });

  describe("deleteBlock", () => {
    it("should delete a block", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      const blockId = result.current.blocks[0].id;

      act(() => {
        result.current.deleteBlock(blockId);
      });

      expect(result.current.blocks).toHaveLength(0);
    });

    it("should clear selected block if it is deleted", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      const blockId = result.current.blocks[0].id;

      act(() => {
        result.current.deleteBlock(blockId);
      });

      expect(result.current.selectedBlockIds).toEqual([]);
    });
  });

  describe("selectBlock", () => {
    it("should select a block", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      const blockId = result.current.blocks[0].id;

      act(() => {
        result.current.selectBlock(blockId);
      });

      expect(result.current.selectedBlockIds).toEqual([blockId]);
    });

    it("should deselect a block", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      const blockId = result.current.blocks[0].id;

      act(() => {
        result.current.selectBlock(blockId);
        result.current.selectBlock(null);
      });

      expect(result.current.selectedBlockIds).toEqual([]);
    });
  });

  describe("History Management", () => {
    it("should save to history when adding a block", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      expect(result.current.history).toHaveLength(2);
      expect(result.current.historyIndex).toBe(1);
    });

    it("should undo correctly", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.blocks).toHaveLength(0);
      expect(result.current.historyIndex).toBe(0);
    });

    it("should redo correctly", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      act(() => {
        result.current.undo();
        result.current.redo();
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.historyIndex).toBe(1);
    });

    it("should not undo when at beginning of history", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.undo();
      });

      expect(result.current.blocks).toHaveLength(0);
      expect(result.current.historyIndex).toBe(0);
    });

    it("should not redo when at end of history", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.blocks).toHaveLength(1);
      expect(result.current.historyIndex).toBe(1);
    });

    it("should clear history when clearing canvas", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
        result.current.clearCanvas();
      });

      expect(result.current.blocks).toHaveLength(0);
      expect(result.current.history).toEqual([[]]);
      expect(result.current.historyIndex).toBe(0);
    });
    it("should respect maxHistorySize", () => {
      const { result } = renderHook(() => useCanvasStore());

      act(() => {
        result.current.setMaxHistorySize(2);
        // Initial state is 1 item: [[]]

        // Add item 1 -> History: [ [], [1] ] (size 2)
        result.current.addBlock({ type: "text", props: { content: "1" } });
      });

      expect(result.current.history).toHaveLength(2);

      // Add item 2 -> History: [ [1], [2] ] (size 2, [] removed)
      act(() => {
        result.current.addBlock({ type: "text", props: { content: "2" } });
      });

      expect(result.current.history).toHaveLength(2);
      expect((result.current.history[0] as any)[0].props.content).toBe("1");
      expect((result.current.history[1] as any)[0].props.content).toBe("2");
    });
  });

  describe("canUndo and canRedo", () => {
    it("should return correct values for undo/redo availability", () => {
      const { result } = renderHook(() => useCanvasStore());

      expect(result.current.canUndo()).toBe(false);
      expect(result.current.canRedo()).toBe(false);

      act(() => {
        result.current.addBlock({ type: "text", props: { content: "Test" } });
      });

      expect(result.current.canUndo()).toBe(true);
      expect(result.current.canRedo()).toBe(false);

      act(() => {
        result.current.undo();
      });

      expect(result.current.canUndo()).toBe(false);
      expect(result.current.canRedo()).toBe(true);
    });
  });
});
