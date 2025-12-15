import React from 'react';
import { SectionBlock as SectionBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';

interface SectionBlockProps {
  block: SectionBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<SectionBlockType>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  children
}) => {
  // Extract style properties
  const {
    backgroundColor = '#ffffff',
    padding = '2rem',
    margin = '0',
    minHeight = '100px',
    width = '100%',
    backgroundImage,
    backgroundSize = 'cover',
    backgroundPosition = 'center',
    backgroundRepeat = 'no-repeat',
    backgroundAttachment = 'scroll',
    backgroundOpacity = 1,
    overlayColor,
    overlayOpacity = 0,
    border,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    boxShadow,
    opacity,
  } = block.props;

  // 1. Container Style (Layout dimensions & basic appearance)
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    minHeight,
    margin,
    border,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    boxShadow, // Box shadow applies to the outer container
    opacity,   // Global opacity
    overflow: 'hidden', // Ensures background/overlay doesn't retain out of border radius
    display: 'flex', // Better for content alignment
    flexDirection: 'column',
    backgroundColor // Base background color (behind image)
  };

  // 2. Background Image Style (Absolute Layer)
  const backgroundLayerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    backgroundAttachment,
    opacity: backgroundOpacity,
    zIndex: 0,
    pointerEvents: 'none' // Click-through
  };

  // 3. Overlay Style (Absolute Layer)
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
    zIndex: 1, // Above background, below content
    pointerEvents: 'none' // Click-through
  };

  // 4. Content Style (Relative Layer)
  const contentStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    zIndex: 2, // Above overlay
    padding,
  };

  // Handle section click
  const handleSectionClick = (e: React.MouseEvent) => {
    // Select if clicking the container itself (or background layers via bubbling, though they are pointer-events-none usually, but div catches it)
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.section-bg-layer')) {
      onSelect();
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={(updates) => onUpdate(updates as Partial<SectionBlockType>)}
      onDelete={onDelete}
      className="w-full"
    >
      <div
        style={containerStyle}
        onClick={handleSectionClick}
        className="section-container"
      >
        {/* Background Layer */}
        {backgroundImage && <div style={backgroundLayerStyle} className="section-bg-layer" />}

        {/* Overlay Layer */}
        {(overlayOpacity > 0 || overlayColor) && <div style={overlayStyle} className="section-overlay-layer" />}

        {/* Content Layer */}
        <div style={contentStyle}>
          {children ? (
            // Keep content wrapper simpler
            <div>
              {children}
            </div>
          ) : (
            <div
              className={`
                flex items-center justify-center p-8 text-gray-400 
                border-2 border-dashed border-gray-300/50 rounded-lg
                bg-gray-50/50 backdrop-blur-sm
              `}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              Click to select section or drop blocks here
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};