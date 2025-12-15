import React from 'react';
import { BaseBlock } from './BaseBlock';
import { TextareaBlock as TextareaBlockType } from '../../schema/types';

interface TextareaBlockProps {
  block: TextareaBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextareaBlockType>) => void;
  onDelete: () => void;
}

export const TextareaBlock: React.FC<TextareaBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    placeholder = 'Enter your message...',
    value = '',
    rows = 4,
    cols = 50,
    disabled = false,
    required = false,
    name = 'textarea',
    maxLength,
    ...styleProps 
  } = block.props;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        placeholder={placeholder}
        value={value}
        rows={rows}
        cols={cols}
        disabled={disabled}
        required={required}
        name={name}
        maxLength={maxLength}
        onChange={handleChange}
        style={{
          width: '100%',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
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
