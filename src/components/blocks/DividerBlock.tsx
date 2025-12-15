import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface DividerBlockProps {
  id: string;
  type: 'divider';
  props: {
    height?: string;
    color?: string;
    style?: 'solid' | 'dashed' | 'dotted' | 'double';
    width?: string;
    margin?: string;
    padding?: string;
  };
}

export const DividerBlock: React.FC<{
  block: DividerBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { height = '1px', color = '#e5e7eb', style = 'solid', width = '100%', margin = '20px 0', padding = '0' } = block.props;

  const dividerStyle: React.CSSProperties = {
    height: '0',
    border: 'none',
    borderTop: `${height} ${style} ${color}`,
    width,
    margin,
    padding,
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
        style={dividerStyle}
        className="w-full"
        role="separator"
        aria-label="Content divider"
      />
    </BaseBlock>
  );
};
