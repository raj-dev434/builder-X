import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { DropIndicator, DragOverInfo } from '../canvas/DropIndicator';
import { useCanvasStore } from '../../store/canvasStore';
import { useTemplateStore } from '../../store/templateStore';
import { BlockTemplate, Block } from '../../schema/types';
import { Canvas } from '../canvas/Canvas';
import { BlockSpecificInspector } from '../inspector/BlockSpecificInspector';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { PreviewControlBar } from './PreviewBar';
import { GlobalStyles } from './GlobalStyles';
import { AssetManager } from '../assets/AssetManager';

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
  const [leftPanelMode, setLeftPanelMode] = useState<'blocks' | 'properties'>('blocks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverInfo, setDragOverInfo] = useState<DragOverInfo | null>(null);

  useEffect(() => {
    if (selectedBlockId) {
      setLeftPanelMode('properties');
    } else {
      setLeftPanelMode('blocks');
    }
  }, [selectedBlockId]);

  const handleToggleBlocks = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setLeftPanelMode('blocks');
    } else {
      setLeftPanelMode(prev => prev === 'blocks' ? 'properties' : 'blocks');
    }
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

    const blocks = useCanvasStore.getState().blocks;
    const { moveBlock, addBlock } = useCanvasStore.getState();

    // Identify drop target
    const overPos = findBlockPosition(blocks, over.id.toString());
    const targetBlock = useCanvasStore.getState().blocks.find(b => b.id === over.id) || overPos?.block;

    if (!targetBlock) {
      // Dropped on canvas background or invalid target -> Add to root
      if (data?.type === 'template') {
        addBlock(data.template.block, undefined, blocks.length);
      } else if (data?.type === 'block') {
        const activePos = findBlockPosition(blocks, active.id.toString());
        if (activePos) {
          moveBlock(active.id.toString(), '', blocks.length); // Move to root end
        }
      }
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

    // EXECUTE DROP
    if (data?.type === 'template') {
      // Dragging from sidebar
      if (!isEdgeDrop) {
        // Nest inside target
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
        if (!isEdgeDrop) {
          // Nest inside target
          // Prevent dropping into self or children (handled by DndContext mostly, but safety check)
          if (active.id !== targetBlock.id) {
            moveBlock(active.id.toString(), targetBlock.id, targetBlock.children ? targetBlock.children.length : 0);
          }
        } else {
          // Drop as sibling
          const parentId = overPos.parentId;
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
            componentsPanelOpen={isSidebarOpen}
          />
        )}

        <div className="flex-1 flex overflow-hidden">
          {!isPreviewMode && (
            <div
              className={`
                h-full 
                transition-all duration-300 ease-in-out 
                ${isSidebarOpen ? 'w-80' : 'w-0'}
                overflow-hidden
                shrink-0
              `}
            >
              <div className="w-80 h-full">
                {leftPanelMode === 'blocks' ? (
                  <div className="h-full bg-gray-800 border-r border-gray-700">
                    <Sidebar onClose={handleCloseSidebar} />
                  </div>
                ) : (
                  <div className="h-full">
                    <BlockSpecificInspector />
                  </div>
                )}
              </div>
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