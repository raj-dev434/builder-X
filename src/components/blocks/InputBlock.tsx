import React from 'react';
import { BaseBlock } from './BaseBlock';
import { InputBlock as InputBlockType } from '../../schema/types';

interface InputBlockProps {
  block: InputBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<InputBlockType>) => void;
  onDelete: () => void;
}

export const InputBlock: React.FC<InputBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    placeholder = 'Enter text...',
    value = '',
    type = 'text',
    disabled = false,
    required = false,
    name = 'input',
    maxLength,
    ...styleProps 
  } = block.props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ props: { ...block.props, value: e.target.value } });
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required={required}
        name={name}
        maxLength={maxLength}
        onChange={handleChange}
        style={{
          width: '100%',
          outline: 'none',
          ...styleProps
        }}
        onClick={(e) => {
          if (isSelected) {
            e.stopPropagation();
          }
        }}
      />
    </BaseBlock>
  );
};
