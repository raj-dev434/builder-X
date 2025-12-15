import React from 'react';
import { BaseBlock } from './BaseBlock';
import { RadioBlock as RadioBlockType } from '../../schema/types';

interface RadioBlockProps {
  block: RadioBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<RadioBlockType>) => void;
  onDelete: () => void;
}

export const RadioBlock: React.FC<RadioBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    label = 'Radio option',
    checked = false,
    disabled = false,
    required = false,
    name = 'radio',
    value = 'radio-value',
    ...styleProps 
  } = block.props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ props: { ...block.props, checked: e.target.checked } });
  };

  const handleLabelChange = (newLabel: string) => {
    onUpdate({ props: { ...block.props, label: newLabel } });
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...styleProps
        }}
      >
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          onChange={handleChange}
          onClick={(e) => {
            if (isSelected) {
              e.stopPropagation();
            }
          }}
          style={{
            margin: 0,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
        />
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
            outline: 'none',
            opacity: disabled ? 0.6 : 1
          }}
        >
          {label}
        </span>
      </label>
    </BaseBlock>
  );
};
