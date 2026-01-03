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
    viewDevice,
    pageSettings
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

  // Construct background style
  // Default values to ensure robustness against malformed/legacy state
  const gridColor = pageSettings?.gridColor ?? 'rgba(0,0,0,0.1)';
  const showGrid = pageSettings?.showGrid ?? false;
  const backgroundType = pageSettings?.backgroundType ?? 'solid';
  const bgColor = pageSettings?.backgroundColor ?? '#ffffff';

  // Base Background Image (User Image OR Gradient)
  let baseBackgroundImage = 'none';

  if (pageSettings?.backgroundImage) {
    baseBackgroundImage = `url(${pageSettings.backgroundImage})`;
  } else if (backgroundType === 'gradient') {
    const type = pageSettings?.gradientType === 'radial' ? 'radial-gradient' : 'linear-gradient';
    const direction = pageSettings?.gradientType === 'radial' ? 'circle' : (pageSettings?.gradientDirection ?? 'to bottom');
    const start = pageSettings?.gradientStart ?? '#ffffff';
    const end = pageSettings?.gradientEnd ?? '#d1d5db';

    baseBackgroundImage = `${type}(${direction}, ${start}, ${end})`;
  }

  // Final Background Image string (combining Grid + Base)
  let finalBackgroundImage = baseBackgroundImage;

  if (showGrid) {
    const gridPattern = `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`;

    // Combine: Grid Pattern > Base (Image/Gradient)
    // Note: If base is 'none', we just use gridPattern. 
    // The transparency in gridPattern allows backgroundColor to show through.
    if (baseBackgroundImage !== 'none') {
      finalBackgroundImage = `${gridPattern}, ${baseBackgroundImage}`;
    } else {
      finalBackgroundImage = gridPattern;
    }
  }

  const pageStyle: React.CSSProperties = {
    // Always set background color as the base layer.
    // If Gradient is active, the gradient (if opaque) covers it. 
    // If Grid is active (transparent), color shows through.
    backgroundColor: bgColor,

    // Only set background image if we have one (Grid, User Image, or Gradient)
    backgroundImage: finalBackgroundImage !== 'none' ? finalBackgroundImage : undefined,

    backgroundSize: showGrid ? `20px 20px, ${pageSettings?.backgroundSize || 'auto'}` : pageSettings?.backgroundSize,
    backgroundPosition: showGrid ? `0 0, ${pageSettings?.backgroundPosition || 'center'}` : (pageSettings?.backgroundPosition as any),
    backgroundRepeat: showGrid ? `repeat, ${pageSettings?.backgroundRepeat || 'no-repeat'}` : (pageSettings?.backgroundRepeat as any),
    backgroundAttachment: showGrid ? `scroll, ${pageSettings?.backgroundAttachment || 'scroll'}` : (pageSettings?.backgroundAttachment as any),
    fontFamily: pageSettings?.fontFamily,
  };

  return (
    <div className={`flex-1 overflow-auto ${isPreviewMode ? 'bg-white p-4' : 'bg-gray-100 p-4 md:p-8'}`}>
      {/* View Device Container */}
      <div
        className={`
          mx-auto transition-all duration-300 ease-in-out flex flex-col
          ${viewDevice === 'desktop'
            ? (isPreviewMode ? 'w-full min-h-full' : 'w-full min-h-[calc(100vh-100px)] shadow-md')
            : ''}
          ${viewDevice === 'tablet' ? 'w-[768px] min-h-[1024px] shadow-2xl my-8 overflow-hidden' : ''}
          ${viewDevice === 'mobile' ? 'w-[375px] min-h-[812px] shadow-2xl my-8 overflow-hidden' : ''}
        `}
        style={pageStyle}
        data-testid="canvas-background-layer"
      >
        <div
          ref={setNodeRef}
          className={`
            h-full w-full canvas-root bg-transparent
            ${!isPreviewMode ? 'border-2 border-dashed border-gray-400' : ''}
            ${isOver && !isPreviewMode ? 'border-blue-400 !bg-blue-50 border-solid' : ''}
            relative flex-1
          `}
          style={{ backgroundColor: 'transparent' }}
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