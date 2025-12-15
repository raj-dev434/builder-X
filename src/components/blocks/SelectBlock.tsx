import React from 'react';
import { BaseBlock } from './BaseBlock';
import { SelectBlock as SelectBlockType } from '../../schema/types';

interface SelectBlockProps {
  block: SelectBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<SelectBlockType>) => void;
  onDelete: () => void;
}

export const SelectBlock: React.FC<SelectBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    options = [
      { value: 'option1', label: 'Option 1', selected: true },
      { value: 'option2', label: 'Option 2', selected: false },
      { value: 'option3', label: 'Option 3', selected: false }
    ],
    placeholder = 'Choose an option...',
    disabled = false,
    required = false,
    name = 'select',
    multiple = false,
    ...styleProps 
  } = block.props;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const updatedOptions = options.map(option => ({
      ...option,
      selected: option.value === selectedValue
    }));
    onUpdate({ props: { ...block.props, options: updatedOptions } });
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <select
        disabled={disabled}
        required={required}
        name={name}
        multiple={multiple}
        onChange={handleChange}
        style={{
          width: '100%',
          outline: 'none',
          fontFamily: 'inherit',
          ...styleProps
        }}
        onClick={(e) => {
          if (isSelected) {
            e.stopPropagation();
          }
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            selected={option.selected}
          >
            {option.label}
          </option>
        ))}
      </select>
    </BaseBlock>
  );
};
