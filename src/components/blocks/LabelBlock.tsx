import React from 'react';
import { BaseBlock } from './BaseBlock';
import { LabelBlock as LabelBlockType } from '../../schema/types';
import { useInlineEditing } from '../../hooks/useInlineEditing';

interface LabelBlockProps {
  block: LabelBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<LabelBlockType>) => void;
  onDelete: () => void;
}

export const LabelBlock: React.FC<LabelBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    text = 'Label text',
    for: htmlFor = 'input-id',
    required = false,
    ...styleProps
  } = block.props;

  const {
    textRef,
    isEditing,
    handleDoubleClick,
    handleBlur,
    handleKeyDown
  } = useInlineEditing<HTMLElement>({
    text,
    onUpdate: (newText) => onUpdate({ props: { ...block.props, text: newText } }),
    isSelected
  });

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <label
        htmlFor={htmlFor}
        style={{
          display: 'block',
          ...styleProps
        }}
      >
        <span
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            outline: 'none',
            cursor: isEditing ? 'text' : 'inherit'
          }}
        >
          {text}
        </span>
        {required && (
          <span style={{ color: '#dc3545', marginLeft: '0.25rem' }}>*</span>
        )}
      </label>
    </BaseBlock>
  );
};
