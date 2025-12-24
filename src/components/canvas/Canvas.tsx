import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useCanvasStore } from '../../store/canvasStore';
import { BlockRenderer } from './BlockRenderer';
import { Block } from '../../schema/types';
import { CanvasHighlighter } from './CanvasHighlighter';
import { DropZone } from './DropZone';

interface CanvasProps {
  isDragging?: boolean;
  isPreviewMode?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({ isDragging = false, isPreviewMode = false }) => {
  const {
    blocks,
    selectedBlockIds,
    selectBlock,
    updateBlock,
    deleteBlock,
    viewDevice
  } = useCanvasStore();

  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-drop-zone',
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging) {
      selectBlock(null);
    }
  };

  // Get block IDs for SortableContext
  const getBlockIds = (blocks: Block[]): string[] => {
    const ids: string[] = [];

    const collectIds = (blockList: Block[]) => {
      blockList.forEach(block => {
        ids.push(block.id);
        if (block.children && block.children.length > 0) {
          collectIds(block.children);
        }
      });
    };

    collectIds(blocks);
    return ids;
  };

  const allBlockIds = getBlockIds(blocks);

  // Cleanup any inline styles that might have been applied to canvas-root
  React.useEffect(() => {
    const canvasRoot = document.querySelector('.canvas-root') as HTMLElement;
    if (canvasRoot) {
      // Remove any inline background styles
      canvasRoot.style.backgroundColor = '';
      canvasRoot.style.backgroundImage = '';
      canvasRoot.style.backgroundSize = '';
      canvasRoot.style.backgroundPosition = '';
      canvasRoot.style.backgroundRepeat = '';
      canvasRoot.style.backgroundAttachment = '';
      canvasRoot.style.opacity = '';
    }
  }, []);

  return (
    <div className={`flex-1 overflow-auto ${isPreviewMode ? 'bg-white p-4' : 'bg-gray-100 p-4 md:p-8'}`}>
      {/* View Device Container */}
      <div
        className={`
          mx-auto transition-all duration-300 ease-in-out flex flex-col
          ${viewDevice === 'desktop'
            ? (isPreviewMode ? 'w-full min-h-full bg-white' : 'w-full min-h-[calc(100vh-100px)] bg-white shadow-md')
            : ''}
          ${viewDevice === 'tablet' ? 'w-[768px] min-h-[1024px] shadow-2xl bg-white my-8 overflow-hidden' : ''}
          ${viewDevice === 'mobile' ? 'w-[375px] min-h-[812px] shadow-2xl bg-white my-8 overflow-hidden' : ''}
        `}
      >
        <div
          ref={setNodeRef}
          className={`
            h-full w-full canvas-root
            ${!isPreviewMode ? 'border-2 border-dashed border-gray-400' : ''}
            ${isOver && !isPreviewMode ? 'border-blue-400 bg-blue-50 border-solid' : ''}
            relative flex-1
          `}
          onClick={handleCanvasClick}
        >
          {blocks.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <p className="text-lg font-medium">Start building your page</p>
                <p className="text-sm">Drag blocks from the sidebar to get started</p>
              </div>
              {/* Always active full-size drop zone for empty state */}
              <div className="absolute inset-0 z-10" />
            </div>
          ) : (
            <SortableContext
              items={allBlockIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col w-full h-full pb-24"> {/* Add padding bottom for easy dropping at end */}
                  {/* Root Level Drop Zones */}
                  {blocks.map((block, index) => (
                    <React.Fragment key={block.id}>
                        <DropZone parentId={null} index={index} />
                        <BlockRenderer
                            block={block}
                            isSelected={selectedBlockIds.includes(block.id)}
                            onSelect={selectBlock}
                            onUpdate={updateBlock}
                            onDelete={deleteBlock}
                            depth={0}
                            parentId={null}
                            isPreviewMode={isPreviewMode}
                        />
                    </React.Fragment>
                  ))}
                  <DropZone parentId={null} index={blocks.length} show={true} />
              </div>
            </SortableContext>
          )}

          {/* Drop Zone Highlight */}
          {isOver && (
            <div className="absolute inset-0 border-4 border-dashed border-blue-300 rounded-lg pointer-events-none"></div>
          )}
        </div>
        <CanvasHighlighter />
      </div>
    </div>
  );
};