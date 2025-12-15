import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface GroupBlockProps {
  id: string;
  type: 'group';
  props: {
    title?: string;
    description?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
    borderRadius?: string;
    padding?: string;
    margin?: string;
    boxShadow?: string;
    minHeight?: string;
    maxWidth?: string;
    textAlign?: 'left' | 'center' | 'right';
    showTitle?: boolean;
    showDescription?: boolean;
    children?: React.ReactNode;
  };
}

export const GroupBlock: React.FC<{
  block: GroupBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete, children }) => {
  const { 
    title = 'Group',
    description = 'Logical grouping of elements',
    backgroundColor = '#f8f9fa',
    borderColor = '#e5e7eb',
    borderWidth = '1px',
    borderStyle = 'solid',
    borderRadius = '8px',
    padding = '20px',
    margin = '0',
    boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)',
    minHeight = '100px',
    maxWidth = '100%',
    textAlign = 'left',
    showTitle = true,
    showDescription = false
  } = block.props;

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    border: `${borderWidth} ${borderStyle} ${borderColor}`,
    borderRadius,
    padding,
    margin,
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
        role="group"
        aria-label={title || 'Content group'}
      >
        {showTitle && title && (
          <div style={{ 
            marginBottom: '12px', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#1f2937',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px'
          }}>
            {title}
          </div>
        )}
        
        {showDescription && description && (
          <div style={{ 
            marginBottom: '16px', 
            fontSize: '14px', 
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            {description}
          </div>
        )}
        
        {children || (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            color: '#9ca3af',
            fontSize: '14px',
            textAlign: 'center',
            border: '2px dashed #d1d5db',
            borderRadius: '6px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>Group Block</div>
            <div style={{ fontSize: '12px' }}>Add content inside this group</div>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
