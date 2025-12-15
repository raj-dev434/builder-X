import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface SpacerBlockProps {
  id: string;
  type: 'spacer';
  props: {
    height?: string;
    backgroundColor?: string;
    margin?: string;
    padding?: string;
    minHeight?: string;
    maxHeight?: string;
  };
}

export const SpacerBlock: React.FC<{
  block: SpacerBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    height = '20px', 
    backgroundColor = 'transparent', 
    margin = '0', 
    padding = '0',
    minHeight = '10px',
    maxHeight = '200px'
  } = block.props;

  const spacerStyle: React.CSSProperties = {
    height,
    backgroundColor,
    margin,
    padding,
    minHeight,
    maxHeight,
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
        style={spacerStyle}
        className="w-full"
        role="presentation"
        aria-label={`Spacer: ${height} height`}
      />
    </BaseBlock>
  );
};
