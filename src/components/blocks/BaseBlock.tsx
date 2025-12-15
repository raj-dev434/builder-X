import React, { useRef } from 'react';
import { Block } from '../../schema/types';
import { getAnimationClass, getAnimationStyle } from '../../utils/animations';
import { useCanvasStore } from '../../store/canvasStore';

interface BaseBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate?: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseBlock: React.FC<BaseBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  children,
  className = '',
  style = {}
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const { isPreviewMode, setHoveredBlockId } = useCanvasStore();



  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isPreviewMode) return;
    if (e.key === 'Delete' && isSelected) {
      e.preventDefault();
      onDelete();
    }
  };



  // Get animation classes and styles
  const styleProps = block.props as any;
  const entranceAnimation = getAnimationClass(styleProps.animation, 'entrance');
  const exitAnimation = getAnimationClass(styleProps.exitAnimation, 'exit');
  const hoverAnimation = getAnimationClass(styleProps.hoverAnimation, 'hover');
  const animationStyle = getAnimationStyle(styleProps);

  // Responsive Styles Logic
  const { viewDevice } = useCanvasStore();

  // Properties that support responsive overrides
  const responsiveProperties = [
    'width', 'height', 'padding', 'margin', 'fontSize',
    'display', 'flexDirection', 'justifyContent', 'alignItems',
    'textAlign', 'position', 'top', 'bottom', 'left', 'right'
  ];

  const responsiveStyle: React.CSSProperties = {};

  // Global responsive defaults
  if (viewDevice === 'mobile' || viewDevice === 'tablet') {
    // Prevent any block from overflowing the viewport width on small screens
    responsiveStyle.maxWidth = '100%';
    responsiveStyle.boxSizing = 'border-box';
  }

  if (viewDevice !== 'desktop') {
    responsiveProperties.forEach(prop => {
      // Check for specific override e.g. padding_mobile
      const overrideKey = `${prop}_${viewDevice}`;
      if (styleProps[overrideKey] !== undefined && styleProps[overrideKey] !== '') {
        (responsiveStyle as any)[prop] = styleProps[overrideKey];
      }
    });
  }

  const combinedStyle = {
    ...style,
    ...animationStyle,
    ...responsiveStyle
  };

  const combinedClassName = `
    relative
    ${entranceAnimation}
    ${exitAnimation}
    ${hoverAnimation}
    ${className}
  `.trim();

  return (
    <>
      <div
        ref={blockRef}
        id={block.id}
        data-block-type={block.type}
        className={combinedClassName}
        style={combinedStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (!isPreviewMode) setHoveredBlockId(block.id);
        }}
        onMouseLeave={() => {
          if (!isPreviewMode) setHoveredBlockId(null);
        }}
        tabIndex={isPreviewMode ? -1 : 0}
      >
        {/* Block content */}
        {children}
      </div>
    </>
  );
};
