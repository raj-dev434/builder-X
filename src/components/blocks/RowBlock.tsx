import React, { useState } from 'react';
import { RowBlock as RowBlockType, Block } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useCanvasStore } from '../../store/canvasStore';


interface RowBlockProps {
  block: RowBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  depth?: number;
}

export const RowBlock: React.FC<RowBlockProps> = ({
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
    alignContent,
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
  // Default to column on mobile for better stacking
  let responsiveFlexDirection = flexDirection || 'row';
  if (viewDevice === 'mobile') {
    responsiveFlexDirection = flexDirection_mobile || 'column';
  } else if (viewDevice === 'tablet') {
    responsiveFlexDirection = flexDirection_tablet || 'row';
  }

  const style: React.CSSProperties = {
    display: 'flex',
    // Removed inner layout props from outer wrapper to prevent conflicts
    // gap, justifyContent, alignItems, alignContent, flexWrap, flexDirection 
    // are handled by the inner div.

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
        {/* Row Header */}


        {/* Row Content */}
        {/* Row Content */}
        <div
          className="flex-1 w-full"
          style={{
            maxWidth: block.props.contentWidth === 'boxed' ? (block.props.contentWidthValue || '1140px') : '100%',
            margin: block.props.contentWidth === 'boxed' ? '0 auto' : undefined,
            width: '100%'
          }}
        >
          <div className="flex w-full h-full" style={{
            gap,
            justifyContent,
            alignItems,
            alignContent,
            flexWrap,
            flexDirection: responsiveFlexDirection,
            minHeight // Ensure minHeight is passed to the inner flex container if needed, or keep it on wrapper
          }}>
            {children ? (
              <React.Fragment>
                {children}
              </React.Fragment>
            ) : (
              <div
                className={`
            flex-1 flex flex-col items-center justify-center text-gray-400 
            rounded-lg border-2 border-dashed border-gray-300 min-h-[60px] p-4 m-2 transition-all duration-200
            hover:border-gray-400 hover:bg-gray-50
          `}
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm font-medium mb-1">Empty Row</p>
                <p className="text-xs">Drop columns or blocks here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseBlock>
  );
};