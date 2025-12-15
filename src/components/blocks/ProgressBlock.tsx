import React from 'react';
import { BaseBlock } from './BaseBlock';
import { ProgressBlock as ProgressBlockType } from '../../schema/types';

interface ProgressBlockProps {
  block: ProgressBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ProgressBlockType>) => void;
  onDelete: () => void;
}

export const ProgressBlock: React.FC<ProgressBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    value = 50,
    max = 100,
    label = 'Progress',
    showPercentage = true,
    size = 'medium',
    animated = true,
    striped = false,
    ...styleProps 
  } = block.props;

  const handleValueChange = (newValue: number) => {
    onUpdate({ props: { ...block.props, value: newValue } });
  };

  const handleLabelChange = (newLabel: string) => {
    onUpdate({ props: { ...block.props, label: newLabel } });
  };

  const percentage = Math.round((value / max) * 100);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { height: '0.5rem', fontSize: '0.75rem' };
      case 'large':
        return { height: '1.5rem', fontSize: '1rem' };
      default:
        return { height: '1rem', fontSize: '0.875rem' };
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <div style={{ width: '100%' }}>
        {(label || showPercentage) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}
          >
            {label && (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleLabelChange(e.currentTarget.textContent || '')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                style={{
                  fontSize: getSizeStyles().fontSize,
                  fontWeight: '500',
                  outline: 'none'
                }}
              >
                {label}
              </span>
            )}
            {showPercentage && (
              <span style={{ fontSize: getSizeStyles().fontSize, fontWeight: '500' }}>
                {percentage}%
              </span>
            )}
          </div>
        )}
        <div
          style={{
            width: '100%',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden',
            ...getSizeStyles()
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: animated ? 'width 0.3s ease' : 'none',
              backgroundImage: striped 
                ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)'
                : 'none',
              backgroundSize: striped ? '1rem 1rem' : 'auto'
            }}
          />
        </div>
        {isSelected && (
          <div style={{ marginTop: '0.5rem' }}>
            <input
              type="range"
              min="0"
              max={max}
              value={value}
              onChange={(e) => handleValueChange(parseInt(e.target.value))}
              style={{ width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
