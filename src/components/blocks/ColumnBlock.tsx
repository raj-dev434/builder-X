import React, { useState } from 'react';
import { ColumnBlock as ColumnBlockType, Block } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useCanvasStore } from '../../store/canvasStore';

interface ColumnBlockProps {
    block: ColumnBlockType;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<Block>) => void;
    onDelete: () => void;
    children?: React.ReactNode;
    depth?: number;
}

export const ColumnBlock: React.FC<ColumnBlockProps> = ({
    block,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    children,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { viewDevice } = useCanvasStore();
    const {
        flex = '1',
        minWidth = '250px',
        maxWidth,
        width,
        width_mobile,
        width_tablet,
        height,
        minHeight,
        maxHeight,
        display = 'flex',
        flexDirection = 'column',
        justifyContent,
        alignItems,
        gridTemplateColumns,
        gap = '0.5rem',
        padding = '1rem',
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        margin,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        backgroundColor,
        backgroundImage,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat,
        backgroundAttachment,
        borderRadius,
        border,
        borderWidth,
        borderColor,
        borderStyle,
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,
        boxShadow,
        overflow,
        overflowX,
        overflowY,
        opacity,
        zIndex,
        position,
        top,
        right,
        bottom,
        left,
    } = block.props;

    // Apply responsive width based on viewDevice
    // Default to 100% width on mobile for proper stacking
    let responsiveWidth = width;
    let responsiveFlex: string | undefined = flex;

    if (viewDevice === 'mobile') {
        responsiveWidth = width_mobile || '100%';
        responsiveFlex = width_mobile ? undefined : '0 0 100%';
    } else if (viewDevice === 'tablet') {
        // Default to 100% on tablet as well if not specified, 
        // effectively making columns stack on tablet unless overridden
        responsiveWidth = width_tablet || '100%';
        responsiveFlex = width_tablet ? undefined : '0 0 100%';
    }

    const style: React.CSSProperties = {
        flex: responsiveWidth ? undefined : responsiveFlex,
        minWidth: (viewDevice === 'mobile' || viewDevice === 'tablet' ? '100%' : minWidth) as string | undefined,
        maxWidth,
        width: responsiveWidth,
        height,
        minHeight,
        maxHeight,
        flexDirection,
        justifyContent,
        alignItems,
        gap,
        padding,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        margin,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        backgroundColor,
        backgroundImage,
        backgroundSize,
        backgroundPosition,
        backgroundRepeat,
        backgroundAttachment,
        borderRadius,
        border,
        borderWidth,
        borderColor,
        borderStyle: borderStyle as any,
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,
        boxShadow,
        overflow,
        overflowX,
        overflowY,
        opacity: opacity as number,
        zIndex: zIndex as number,
        position: position as any,
        top,
        right,
        bottom,
        left,
        display: 'flex', // Ensures the column itself behaves as a flex item usually
    };

    return (
        <BaseBlock
            block={block}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
            className="h-full"
            style={style}
        >
            <div
                className={`
          w-full h-full transition-all duration-200 min-h-[50px]
          ${isHovered ? 'ring-1 ring-blue-200 ring-inset' : ''}
        `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {children ? (
                    <div
                        className="w-full h-full"
                        style={{
                            display: display || 'flex',
                            width: '100%',
                            maxWidth: '100%',
                            gap,
                            flexDirection: (!display || display === 'flex') ? flexDirection : undefined,
                            justifyContent,
                            alignItems,
                            gridTemplateColumns: display === 'grid' ? gridTemplateColumns : undefined
                        }}
                    >
                        {children}
                    </div>
                ) : (
                    <div
                        className={`
              flex-1 flex flex-col items-center justify-center text-gray-400 
              rounded-lg border-2 border-dashed border-gray-200 h-full min-h-[50px] p-2 transition-all duration-200
              hover:border-gray-400 hover:bg-gray-50
            `}
                    >
                        <p className="text-xs">Column</p>
                    </div>
                )}
            </div>
        </BaseBlock>
    );
};
