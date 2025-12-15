import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, ContainerBlock as ContainerBlockType } from '../../schema/types';

// Removed local interface to avoid duplication and type mismatches

export const ContainerBlock: React.FC<{
  block: ContainerBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete, children }) => {
  const {
    backgroundColor = 'transparent',
    padding = '20px',
    margin = '0',
    borderRadius = '0px',
    border = 'none',
    boxShadow = 'none',
    minHeight = 'auto',
    maxWidth = '100%',
    textAlign = 'left',
    backgroundImage,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
  } = block.props;

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    // Support both raw URLs (legacy) and valid CSS (gradients/url-wrapped)
    backgroundImage: backgroundImage?.match(/^(url|linear-gradient|radial-gradient)/)
      ? backgroundImage
      : backgroundImage
        ? `url('${backgroundImage}')`
        : undefined,
    backgroundSize: backgroundSize as any,
    backgroundPosition: backgroundPosition as any,
    backgroundRepeat: backgroundRepeat as any,
    padding,
    margin,
    borderRadius,
    border,
    boxShadow,
    minHeight,
    maxWidth,
    textAlign,
    width: '100%',
    display: 'block',
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="w-full"
    >
      <div
        style={containerStyle}
        className="w-full"
        role="region"
        aria-label="Content container"
      >
        {children || (
          <div className="text-gray-400 text-center py-8">
            <div className="text-2xl mb-2">📦</div>
            <p>Container Block</p>
            <p className="text-sm">Add content inside this container</p>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
