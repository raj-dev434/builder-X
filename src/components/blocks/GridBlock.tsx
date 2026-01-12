import React, { useState } from 'react';
import { Block, GridBlock as GridBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useCanvasStore } from '../../store/canvasStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
// Import BlockRenderer dynamically or directly. 
// Note: Circular dependency is handled by runtime evaluation for function components usually.
import { BlockRenderer } from '../canvas/BlockRenderer';

export const GridBlock: React.FC<{
    block: GridBlockType;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<Block>) => void;
    onDelete: () => void;
    // We ignore the passed 'children' (NestedBlockRenderer) and use block.children directly
    children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { viewDevice } = useCanvasStore();
    const props = block.props as any;

    // Responsive Grid Helpers
    const getResponsiveValue = (desktop: any, tablet: any, mobile: any) => {
        if (viewDevice === 'mobile') return mobile || tablet || desktop;
        if (viewDevice === 'tablet') return tablet || desktop;
        return desktop;
    };

    // Auto-generate grid template from columns/rows count
    const columns = props.columns || 3;
    const rows = props.rows || 2;

    const gridTemplateColumns = props.gridTemplateColumns || `repeat(${columns}, 1fr)`;
    const gridTemplateRows = props.gridTemplateRows || `repeat(${rows}, auto)`;

    const gridStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: getResponsiveValue(gridTemplateColumns, props.gridTemplateColumns_tablet, props.gridTemplateColumns_mobile || '1fr'),
        gridTemplateRows: getResponsiveValue(gridTemplateRows, props.gridTemplateRows_tablet, props.gridTemplateRows_mobile),
        gap: props.gap || getResponsiveValue(props.gap, props.gap_tablet, props.gap_mobile),
        rowGap: getResponsiveValue(props.rowGap, props.rowGap_tablet, props.rowGap_mobile),
        columnGap: getResponsiveValue(props.columnGap, props.columnGap_tablet, props.columnGap_mobile),
        justifyItems: props.justifyItems || 'stretch',
        alignItems: props.alignItems || 'stretch',
        justifyContent: props.justifyContent,
        alignContent: props.alignContent,
        width: '100%',
    };

    // Grid outline for visual guidance - show cells by default
    const showOutline = props.showGridOutline !== false; // true by default

    // Prepare children from block data directly
    const blockChildren = block.children || [];
    const totalCells = columns * rows;

    return (
        <BaseBlock
            block={block}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
            style={{}}
            className={`w-full group ${blockChildren.length === 0 ? 'min-h-[120px]' : ''}`}
        >
            <div
                className={`w-full h-full transition-all duration-200 ${isHovered ? 'ring-1 ring-blue-200 ring-inset' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Content width wrapper */}
                <div
                    className="w-full"
                    style={{
                        maxWidth: props.contentWidth === 'boxed' ? (props.contentWidthValue || '1140px') : '100%',
                        margin: props.contentWidth === 'boxed' ? '0 auto' : undefined,
                    }}
                >
                    <SortableContext items={blockChildren.map(c => c.id)} strategy={rectSortingStrategy}>
                        <div
                            style={gridStyle}
                            className="relative"
                        >
                            {/* DEBUG LOGS */}
                            {(() => {
                                // console.log(`[GridBlock DEBUG] ID: ${block.id}, Children: ${blockChildren.length}`);
                                return null;
                            })()}
                            {/* Always show grid cells with light borders */}
                            {Array.from({ length: totalCells }).map((_, i) => {
                                // Find child that belongs to this cell (by gridIndex prop)
                                const childBlock = blockChildren.find((c) => {
                                    const cProps = c.props;
                                    return cProps?.gridIndex === i;
                                });
                                // Fallback logic currently disabled to force strict gridIndex usage which we set on drop

                                const hasValidChild = !!childBlock;

                                return (
                                    <GridCell
                                        key={i}
                                        index={i}
                                        parentId={block.id}
                                        hasChild={hasValidChild}
                                        showOutline={showOutline}
                                    >
                                        {hasValidChild && (
                                            <BlockRenderer
                                                block={childBlock}
                                                // Pass handlers - we might need to partially modify them or simple pass through
                                                // The BlockRenderer inside will handle selection logic via store if onSelect not passed
                                                // But we want standard behavior
                                                depth={0} // Depth relative to grid cell?
                                                parentId={block.id}
                                            />
                                        )}
                                    </GridCell>
                                );
                            })}
                        </div>
                    </SortableContext>
                </div>
            </div>
        </BaseBlock>
    );
};

// Grid Cell Component with Drop functionality
const GridCell: React.FC<{
    index: number;
    parentId: string;
    hasChild: boolean;
    showOutline: boolean;
    children?: React.ReactNode;
}> = ({ index, parentId, hasChild, showOutline, children }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `grid-cell-${parentId}-${index}`,
        disabled: hasChild, // Disable drop zone if cell already has content
        data: {
            type: 'GRID_CELL',
            parentId,
            index
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative flex items-center justify-center min-h-[80px] transition-all ${showOutline
                ? hasChild
                    ? 'border border-blue-400/20 bg-transparent' // Light blue border when has content
                    : 'border-2 border-dashed border-blue-400/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40' // Dashed when empty
                : hasChild
                    ? 'border border-gray-300/10 bg-transparent' // Very light gray when has content
                    : 'border border-gray-300/10 bg-gray-500/5 hover:bg-gray-500/10' // Subtle when empty
                } ${isOver && !hasChild ? 'ring-2 ring-green-500 bg-green-500/10' : ''
                } rounded`}
        >
            {children ? (
                <div className="w-full h-full">
                    {children}
                </div>
            ) : (
                <div className="text-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="text-[9px] text-gray-400">Cell {index + 1}</p>
                </div>
            )}
        </div>
    );
};
