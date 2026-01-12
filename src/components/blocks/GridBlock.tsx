import React, { useState } from 'react';
import { Block, GridBlock as GridBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useCanvasStore } from '../../store/canvasStore';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
// Import BlockRenderer dynamically or directly. 
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
    const { viewDevice, updateBlock: globalUpdateBlock, deleteBlock: globalDeleteBlock, selectBlock: globalSelectBlock } = useCanvasStore();
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
                    className="w-full h-full"
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
                            {Array.from({ length: totalCells }).map((_, i) => {
                                // Find child that belongs to this cell (by gridIndex prop)
                                const childBlock = blockChildren.find((c) => c?.props?.gridIndex === i);
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
                                                onSelect={globalSelectBlock}
                                                onUpdate={globalUpdateBlock}
                                                onDelete={globalDeleteBlock}
                                                depth={0}
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
        disabled: hasChild,
        data: {
            type: 'GRID_CELL',
            parentId,
            index
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative flex flex-col items-stretch justify-center min-h-[100px] transition-all duration-300 rounded-lg ${showOutline
                ? hasChild
                    ? 'border border-blue-400/10 bg-transparent shadow-sm'
                    : 'border-2 border-dashed border-blue-400/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 hover:shadow-md'
                : hasChild
                    ? 'border border-transparent bg-transparent'
                    : 'border border-gray-300/5 bg-gray-500/5 hover:bg-gray-500/10 hover:shadow-sm'
                } ${isOver && !hasChild ? 'ring-2 ring-blue-500/50 bg-blue-500/15 scale-[0.99]' : ''
                }`}
        >
            {children ? (
                <div className="w-full h-full p-1 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-stretch">
                    {children}
                </div>
            ) : (
                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none self-center">
                    <div className="bg-blue-500/10 rounded-full px-3 py-1 border border-blue-500/20">
                        <p className="text-[10px] font-bold text-blue-400/70 tracking-tight">Cell {index + 1}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
