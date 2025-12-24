import React, { useState } from 'react';
import { FlexBoxBlock as FlexBoxBlockType, Block } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useCanvasStore } from '../../store/canvasStore';

interface FlexBoxBlockProps {
  block: FlexBoxBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  depth?: number;
}

export const FlexBoxBlock: React.FC<FlexBoxBlockProps> = ({
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
    gap = '1rem',
    justifyContent,
    alignItems,
    flexWrap = 'wrap',
    flexDirection,
    flexDirection_mobile,
    flexDirection_tablet,
    overflowX,
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
    borderStyle,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    boxShadow,
    overflow,
    overflowY,
    opacity,
    zIndex,
    position,
    top,
    right,
    bottom,
    left,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
  } = block.props;

  // Apply responsive flexDirection based on viewDevice
  let responsiveFlexDirection = flexDirection || 'row';
  if (viewDevice === 'mobile') {
    responsiveFlexDirection = flexDirection_mobile || flexDirection || 'column';
  } else if (viewDevice === 'tablet') {
    responsiveFlexDirection = flexDirection_tablet || flexDirection || 'row';
  }

  const style: React.CSSProperties = {
    display: 'flex',
    gap,
    justifyContent,
    alignItems,
    flexWrap,
    flexDirection: responsiveFlexDirection,
    overflowX,
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
    backgroundSize: backgroundSize as any,
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
    overflowY,
    opacity: opacity as number,
    zIndex: zIndex as number,
    position: position as any,
    top,
    right,
    bottom,
    left,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="w-full"
      style={style}
    >
      <div
        className={`
          flex w-full transition-all duration-200
          ${isHovered ? 'ring-1 ring-blue-200 ring-inset' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-1 w-full h-full min-h-[50px]">
           {children ? (
             <React.Fragment>
               {children}
             </React.Fragment>
           ) : (
             <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded text-gray-400 text-sm">
               Flex Box Container
             </div>
           )}
        </div>
      </div>
    </BaseBlock>
  );
};
