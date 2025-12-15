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
    flexWrap = 'wrap',
    flexDirection,
    flexDirection_mobile,
    flexDirection_tablet,
    overflowX
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
    gap,
    justifyContent,
    alignItems,
    flexWrap,
    flexDirection: responsiveFlexDirection,
    overflowX
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
        <div className="flex-1">
          {children ? (
            <div
              className="flex w-full h-full"
              style={{
                gap,
                justifyContent,
                alignItems,
                flexWrap,
                flexDirection: responsiveFlexDirection,
                overflowX
              }}
            >
              {children}
            </div>
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
    </BaseBlock>
  );
};