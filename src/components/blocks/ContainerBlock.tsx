import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, ContainerBlock as ContainerBlockType } from '../../schema/types';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCanvasStore } from '../../store/canvasStore';

const GridPlaceholder: React.FC<{ parentId: string; index: number; }> = ({ parentId, index }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `grid-placeholder-${parentId}-${index}`,
    data: {
      type: 'GRID_CELL',
      parentId,
      index,
    },
  });

  const { setSidebarOpen, setLeftPanelMode, setInsertionTarget } = useUIStore();
  const { selectBlock } = useCanvasStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the container
    e.preventDefault();
    
    // Clear selection immediately to prevent Inspector flicker
    selectBlock(null);
    
    // Defer UI updates to next tick to ensure no race conditions with selection effects
    setTimeout(() => {
        setInsertionTarget({ parentId, gridIndex: index });
        setSidebarOpen(true);
        setLeftPanelMode('blocks');
    }, 0);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={`
        w-full h-full min-h-[100px] 
        border-2 border-dashed rounded-lg 
        flex items-center justify-center 
        transition-all duration-200 cursor-pointer
        ${isOver ? 'border-blue-500 bg-blue-500/10' : 'border-gray-300/30 bg-white/5 hover:border-gray-300/50 hover:bg-white/10'}
      `}
    >
      <Plus className={`w-6 h-6 ${isOver ? 'text-blue-500' : 'text-gray-500'}`} />
    </div>
  );
};
export const ContainerBlock: React.FC<{
  block: ContainerBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete, children }) => {
  const { props } = block;

  const containerStyle: React.CSSProperties = {
    // Dimensions
    width: props.width,
    minHeight: props.minHeight,
    maxWidth: props.maxWidth,
    overflow: props.overflow,
  
    // Style
    position: 'relative', // For overlay
  };
  
  if (props.contentWidth === 'boxed') {
      containerStyle.maxWidth = props.width || '1140px';
      containerStyle.marginLeft = 'auto';
      containerStyle.marginRight = 'auto';
  }

  // Calculate Grid Placeholders if layout is grid
  const renderGridPlaceholders = () => {
    if (props.containerLayout !== 'grid') return null;

    // Simple parsing for "repeat(N, 1fr)" syntax which our inspector produces
    // Also handles raw number if user manually entered it (though unlikely with current inspector)
    const getCount = (val?: string) => {
        if (!val) return 1;
        const match = val.match(/repeat\((\d+)/);
        if (match) return parseInt(match[1]);
        return 1;
    };

    const cols = getCount(props.gridTemplateColumns);
    const rows = getCount(props.gridTemplateRows);
    const totalSlots = cols * rows;
    
    // Count actual React children to know how many slots are filled
    // We need to check WHICH slots are filled to render placeholders in the gaps
    const occupiedIndices = new Set<number>();
    
    // 1. Explicit Indices
    block.children?.forEach((child: any) => {
        if (child.props?.gridIndex !== undefined) {
            occupiedIndices.add(child.props.gridIndex);
        }
    });

    // 2. Auto-flow Items (Implicit Indices)
    // If a child has NO gridIndex, it takes the first available slot
    block.children?.forEach((child: any) => {
        if (child.props?.gridIndex === undefined) {
             // Find first empty slot
             let slot = 0;
             while (occupiedIndices.has(slot)) {
                 slot++;
             }
             occupiedIndices.add(slot);
        }
    });

    return Array.from({ length: totalSlots }).map((_, i) => {
      // If slot is taken, don't show placeholder
      if (occupiedIndices.has(i)) return null;

      return (
        <GridPlaceholder 
          key={`placeholder-${i}`} 
          parentId={block.id} 
          index={i} 
        />
      );
    });
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className={`w-full group relative ${!children && !props.minHeight ? 'min-h-[120px]' : ''}`}
      style={containerStyle}
    >
      {props.backgroundOverlay && (
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{
             backgroundColor: props.backgroundOverlay,
             opacity: props.backgroundOverlayOpacity ?? 0.5,
             mixBlendMode: props.backgroundOverlayBlendMode as any || 'normal',
             borderRadius: 'inherit'
          }}
        />
      )}
      
      <div className="relative z-10 w-full h-full" style={{
         display: props.containerLayout === 'flex' ? 'flex' : (props.containerLayout === 'grid' ? 'grid' : 'block'),
         flexDirection: props.flexDirection,
         flexWrap: props.flexWrap,
         justifyContent: props.justifyContent,
         alignItems: props.alignItems,
         alignContent: props.alignContent,
         gap: props.gap || props.columnGap,
         rowGap: props.rowGap,
         columnGap: props.columnGap,
         
         // Grid
         gridTemplateColumns: props.gridTemplateColumns,
         gridTemplateRows: props.gridTemplateRows,
         gridAutoFlow: props.gridAutoFlow as any,
         justifyItems: props.justifyItems as any,
      }}>
        {props.containerLayout === 'grid' ? (
           // Grid Mode: Wrap children to apply manual positioning
           React.Children.map(children, (child, index) => {
              const childBlock = block.children?.[index];
              const gridIndex = childBlock?.props?.gridIndex;
              
              let style: React.CSSProperties = { display: 'contents' }; // Default to phantom wrapper
              
              if (gridIndex !== undefined && props.gridTemplateColumns) {
                 // Calculate Col/Row
                 const getCount = (val?: string) => {
                    if (!val) return 1;
                    // Try repeat syntax first
                    const match = val.match(/repeat\((\d+)/);
                    if (match) return parseInt(match[1]);
                    // Fallback to space-separated count (e.g. "1fr 1fr" -> 2)
                    return val.split(' ').length || 1;
                 };
                 const cols = getCount(props.gridTemplateColumns);
                 const col = (Number(gridIndex) % cols) + 1;
                 const row = Math.floor(Number(gridIndex) / cols) + 1;
                 
                 // Apply positioning to a div wrapper
                 // We use a div wrapper instead of display:contents to ensure the styles apply to the grid item
                 style = {
                    gridColumnStart: col,
                    gridRowStart: row,
                    // Ensure the wrapper fills the slot
                    width: '100%',
                    height: '100%',
                 };
              } else {
                 // No manual index, allow auto-flow via a simple wrapper that acts as the item
                  style = { width: '100%', height: '100%' };
              }

              return <div style={style}>{child}</div>;
           })
        ) : (
           // Flex/Block Mode: Render children directly
           children
        )}

        {renderGridPlaceholders()}
        
        {!children && props.containerLayout !== 'grid' && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300/20 rounded-lg bg-black/5 text-gray-400 transition-all hover:bg-black/10 hover:border-blue-500/30" style={{ minHeight: '120px' }}>
            <div className="w-12 h-12 rounded-full bg-blue-500/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <span className="text-2xl opacity-60">📦</span>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Container</p>
            <p className="text-[10px] text-gray-400/80">Drag and drop elements here</p>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
