import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { DropIndicator, DragOverInfo } from '../canvas/DropIndicator';
import { useCanvasStore } from '../../store/canvasStore';
import { useTemplateStore } from '../../store/templateStore';
import { BlockTemplate, Block } from '../../schema/types';
import { Canvas } from '../canvas/Canvas';
import { Inspector } from '../inspector/Inspector';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { PreviewControlBar } from './PreviewBar';
import { GlobalStyles } from './GlobalStyles';
import { AssetManager } from '../assets/AssetManager';

import { PageSettingsInspector } from '../inspector/PageSettingsInspector';
import { LayersPanel } from './LayersPanel';
import { HistoryPanel } from './HistoryPanel';

export const Layout: React.FC = () => {
  const { selectedBlockIds, isPreviewMode } = useCanvasStore();
  const { initializeDefaultTemplates } = useTemplateStore();
  const selectedBlockId = selectedBlockIds[0];

  useEffect(() => {
    initializeDefaultTemplates();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [activeTemplate, setActiveTemplate] = useState<BlockTemplate | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [leftPanelMode, setLeftPanelMode] = useState<'blocks' | 'properties' | 'layers' | 'history' | 'settings'>('blocks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverInfo, setDragOverInfo] = useState<DragOverInfo | null>(null);

  // Resizable Sidebar State
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingSidebar) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      document.body.style.cursor = 'default';
    };

    if (isResizingSidebar) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizingSidebar]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  };


  useEffect(() => {
    if (selectedBlockId) {
      if (leftPanelMode !== 'layers' && leftPanelMode !== 'history') {
        setLeftPanelMode('properties');
        if (!isSidebarOpen) setIsSidebarOpen(true);
      }
    }
  }, [selectedBlockId]);

  const handleToggleBlocks = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setLeftPanelMode('blocks');
    } else if (leftPanelMode === 'blocks') {
      setIsSidebarOpen(false);
    } else {
      setLeftPanelMode('blocks');
    }
  };

  const handleToggleLayers = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setLeftPanelMode('layers');
    } else if (leftPanelMode === 'layers') {
      setIsSidebarOpen(false);
    } else {
      setLeftPanelMode('layers');
    }
  };

  const handleToggleHistory = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setLeftPanelMode('history');
    } else if (leftPanelMode === 'history') {
      setIsSidebarOpen(false);
    } else {
      setLeftPanelMode('history');
    }
  };

  const handleOpenSettings = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
    setLeftPanelMode('settings');
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    setIsDragging(true);

    if (data?.type === 'template') {
      setActiveTemplate(data.template);
    } else if (data?.type === 'block') {
      setActiveBlock(data.block);
    }
  };

  // Helper to find block position in the tree
  const findBlockPosition = (blocks: Block[], id: string, parentId: string | null = null): { block: Block; index: number; parentId: string | null } | null => {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].id === id) {
        return { block: blocks[i], index: i, parentId };
      }
      if (blocks[i].children) {
        const found = findBlockPosition(blocks[i].children!, id, blocks[i].id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setDragOverInfo(null);
      return;
    }

    // If over a DropZone, let the DropZone component handle the visual feedback (green line)
    // We can clear our generic drag indicator
    if (over.data.current?.type === 'DROP_ZONE') {
      setDragOverInfo(null);
      return;
    }

    const overNode = over.data.current?.sortable?.node || document.getElementById(over.id.toString());
    const overRect = overNode?.getBoundingClientRect();

    if (!overRect) {
      return;
    }

    // Universal nesting logic
    const { top, bottom, height } = overRect;

    // Use cursor position if possible, otherwise fallback to center
    // This fixes issues when dragging tall blocks over short blocks
    let pointerY = 0;
    if (active.rect.current?.translated) {
      pointerY = active.rect.current.translated.top + (active.rect.current.translated.height / 2);
    }

    // Check event.activatorEvent instead of active.activatorEvent
    if (event.activatorEvent) {
      // Try multiple properties as dnd-kit can attach different event types
      const evt = event.activatorEvent as any;
      if (typeof evt.clientY === 'number') pointerY = evt.clientY;
      else if (typeof evt.y === 'number') pointerY = evt.y;
      // For touch events
      else if (evt.touches?.[0]?.clientY) pointerY = evt.touches[0].clientY;
    }

    const threshold = Math.min(height * 0.3, 30); // Increased threshold to 30% or 30px
    const distTop = Math.abs(pointerY - top);
    const distBottom = Math.abs(pointerY - bottom);

    // Default to sibling/bottom
    let type: 'sibling' | 'nest' = 'sibling';
    let position: 'top' | 'bottom' | 'inside' = 'bottom';

    if (distTop < threshold) {
      position = 'top';
    } else if (distBottom < threshold) {
      position = 'bottom';
    } else {
      // Middle area - attempt to nest
      type = 'nest';
      position = 'inside';
    }

    setDragOverInfo({
      type,
      position,
      rect: {
        top: overRect.top,
        left: overRect.left,
        width: overRect.width,
        height: overRect.height
      }
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDragOverInfo(null);
    setIsDragging(false);
    setActiveTemplate(null);
    setActiveBlock(null);

    const { active, over } = event;
    if (!over) return;
    const data = active.data.current;

    if (over.data.current?.type === 'GRID_CELL') {
      const { parentId, index: dropIndex } = over.data.current;
      const { moveBlock, addBlock, updateBlock } = useCanvasStore.getState();

      if (data?.type === 'template') {
        // Adding new block from sidebar into grid cell
        // We add it to the END of the children list (or 0), but with the correct gridIndex prop
        const newBlock = {
          ...data.template.block,
          props: {
            ...data.template.block.props,
            gridIndex: dropIndex
          }
        };
        addBlock(newBlock, parentId || undefined);
      } else if (data?.type === 'block') {
        // Moving existing block to grid cell
        if (active.id === over.id) return;

        // const activePos = findBlockPosition(blocks, active.id.toString());
        // We don't care about the array index for grids, just append content
        const targetParent = useCanvasStore.getState().blockMap.get(parentId);
        const targetIndex = targetParent?.children?.length || 0;

        moveBlock(active.id.toString(), parentId, targetIndex);

        // CRITICAL: Update the gridIndex prop to position it correctly in the grid
        // We do this immediately after the move
        setTimeout(() => {
          updateBlock(active.id.toString(), {
            props: {
              ...(active.data.current?.block?.props || {}),
              gridIndex: dropIndex
            }
          });
        }, 0);
      }
      return;
    }

    // Check if we dropped on a DropZone
    if (over.data.current?.type === 'DROP_ZONE') {
      const { parentId, index: dropIndex } = over.data.current;
      const blocks = useCanvasStore.getState().blocks;
      const { moveBlock, addBlock } = useCanvasStore.getState();

      if (data?.type === 'template') {
        // Adding new block from sidebar - straightforward insert
        addBlock(data.template.block, parentId || undefined, dropIndex);
      } else if (data?.type === 'block') {
        // Moving existing block
        // Check for self-drop (shouldn't happen with valid zones but safety first)
        if (active.id === over.id) return;

        const activePos = findBlockPosition(blocks, active.id.toString());
        if (activePos) {
          let finalIndex = dropIndex;

          // CRITICAL FIX: Block Loss / Misplacement
          // When moving a block DOWN within the SAME container:
          // The removal of the block (at 'oldIndex') shifts all subsequent items up by 1.
          // So a drop at 'newIndex' (which was calculated based on the list WITH the item)
          // actually needs to target 'newIndex - 1'.
          if (activePos.parentId === parentId && activePos.index < dropIndex) {
            finalIndex -= 1;
          }

          // Prevent unnecessary moves (dropping exactly where it started)
          if (activePos.parentId === parentId && activePos.index === finalIndex) {
            return;
          }

          moveBlock(active.id.toString(), parentId, finalIndex);
        }
      }
      return;
    }

    // Fallback to legacy logic for dropping directly on blocks (nesting)
    const blocks = useCanvasStore.getState().blocks;
    const { moveBlock, addBlock } = useCanvasStore.getState();

    // Identify drop target
    const overPos = findBlockPosition(blocks, over.id.toString());
    const targetBlock = useCanvasStore.getState().blocks.find(b => b.id === over.id) || overPos?.block;

    if (!targetBlock) {
      return;
    }

    // Determine drop position type (Edge vs Inside)
    let isEdgeDrop = false;
    let edgePos: 'top' | 'bottom' = 'bottom';

    if (over.rect) {
      let pointerY = 0;
      if (event.activatorEvent) {
        const evt = event.activatorEvent as any;
        if (typeof evt.clientY === 'number') pointerY = evt.clientY;
        else if (typeof evt.y === 'number') pointerY = evt.y;
        else if (evt.touches?.[0]?.clientY) pointerY = evt.touches[0].clientY;
        else if (active.rect.current?.translated) {
          pointerY = active.rect.current.translated.top + (active.rect.current.translated.height / 2);
        }
      } else if (active.rect.current?.translated) {
        pointerY = active.rect.current.translated.top + (active.rect.current.translated.height / 2);
      }

      const overRect = over.rect;
      const threshold = Math.min(overRect.height * 0.3, 30);
      const distTop = Math.abs(pointerY - overRect.top);
      const distBottom = Math.abs(pointerY - overRect.bottom);

      if (distTop < threshold) {
        isEdgeDrop = true;
        edgePos = 'top';
      } else if (distBottom < threshold) {
        isEdgeDrop = true;
        edgePos = 'bottom';
      }
    }

    // List of block types that can accept children (Containers)
    const CONTAINER_TYPES = ['section', 'row', 'column', 'container', 'form', 'group', 'div', 'body', 'grid'];
    const isContainer = targetBlock && CONTAINER_TYPES.includes(targetBlock.type);

    // EXECUTE DROP
    if (data?.type === 'template') {
      // Dragging from sidebar
      if (!isEdgeDrop && isContainer) {
        // Nest inside target (only if container)
        addBlock(data.template.block, targetBlock.id, targetBlock.children ? targetBlock.children.length : 0);
      } else {
        // Drop as sibling
        const parentId = overPos?.parentId;
        const index = overPos ? (edgePos === 'top' ? overPos.index : overPos.index + 1) : blocks.length;
        addBlock(data.template.block, parentId || undefined, index);
      }
    } else if (data?.type === 'block') {
      // Reordering existing block
      const activePos = findBlockPosition(blocks, active.id.toString());
      if (activePos && overPos) {
        // If dropping precisely on an edge of a block (not a DropZone, but the block itself via 'edgeDrop'),
        // we want to place it as a sibling.
        if (!isEdgeDrop && isContainer) {
          // Nesting logic
          if (active.id !== targetBlock.id) {
            moveBlock(active.id.toString(), targetBlock.id, targetBlock.children ? targetBlock.children.length : 0);
          }
        } else {
          // Sibling logic
          const parentId = overPos.parentId; // This defaults to the target's parent. 
          let index = overPos.index;
          if (edgePos === 'bottom') index += 1;

          // Adjust index if moving within same parent and moving down
          if (parentId === activePos.parentId && activePos.index < index) {
            index -= 1;
          }

          moveBlock(active.id.toString(), parentId || '', index);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-100" data-testid="js-layout">
        <DropIndicator info={dragOverInfo} />
        <GlobalStyles />
        {isPreviewMode ? (
          <PreviewControlBar />
        ) : (
          <Toolbar
            onToggleComponents={handleToggleBlocks}
            onToggleLayers={handleToggleLayers}
            onToggleHistory={handleToggleHistory}
            onOpenPageSettings={handleOpenSettings}
            componentsPanelOpen={isSidebarOpen && leftPanelMode === 'blocks'}
            layersPanelOpen={isSidebarOpen && leftPanelMode === 'layers'}
            historyPanelOpen={isSidebarOpen && leftPanelMode === 'history'}
          />
        )}

        <div className="flex-1 flex overflow-hidden">
          {!isPreviewMode && (
            <div
              className={`
                  h-full 
                  transition-all duration-300 ease-in-out 
                  overflow-visible
                  shrink-0
                  relative
                  flex
                  z-[50]
                `}
              style={{ width: isSidebarOpen ? sidebarWidth : 0 }}
            >
              <div className="h-full overflow-hidden" style={{ width: sidebarWidth }}>
                {leftPanelMode === 'blocks' ? (
                  <div className="h-full bg-gray-800 border-r border-gray-700">
                    <Sidebar onClose={handleCloseSidebar} />
                  </div>
                ) : leftPanelMode === 'layers' ? (
                  <div className="h-full bg-gray-800 border-r border-gray-700">
                    <LayersPanel onClose={handleCloseSidebar} />
                  </div>
                ) : leftPanelMode === 'history' ? (
                  <HistoryPanel onClose={handleCloseSidebar} />
                ) : leftPanelMode === 'settings' ? (
                  <div className="h-full">
                    <PageSettingsInspector />
                  </div>
                ) : (
                  <div className="h-full">
                    <Inspector />
                  </div>
                )}
              </div>

              {/* Resizer Handle */}
              {isSidebarOpen && (
                <div
                  className={`w-1 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors z-50 absolute right-0 top-0 translate-x-1/2`}
                  onMouseDown={startResizing}
                />
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <Canvas isDragging={isDragging} isPreviewMode={isPreviewMode} />
          </div>
        </div>
      </div>

      <DragOverlay zIndex={10000}>
        {activeTemplate ? (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl w-32 h-24 opacity-90 cursor-grabbing">
            <span className="text-3xl mb-2 text-gray-200">{activeTemplate.icon}</span>
            <span className="text-sm font-medium text-gray-100 text-center leading-tight">{activeTemplate.name}</span>
          </div>
        ) : activeBlock ? (
          <div className="p-2 bg-white border-2 border-blue-500 rounded shadow-lg opacity-90 cursor-grabbing">
            <div className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded uppercase tracking-wider">
              {activeBlock.type}
            </div>
          </div>
        ) : null}
      </DragOverlay>
      <AssetManager />
    </DndContext>
  );
};