import React from 'react';
import { BaseBlock } from './BaseBlock';
import { CheckboxBlock as CheckboxBlockType } from '../../schema/types';

interface CheckboxBlockProps {
  block: CheckboxBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CheckboxBlockType>) => void;
  onDelete: () => void;
}

export const CheckboxBlock: React.FC<CheckboxBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    label = 'Checkbox option',
    checked = false,
    disabled = false,
    required = false,
    name = 'checkbox',
    value = 'checkbox-value',
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
          type="checkbox"
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
