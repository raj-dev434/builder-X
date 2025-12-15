import React from 'react';
import { BaseBlock } from './BaseBlock';
import { BadgeBlock as BadgeBlockType } from '../../schema/types';

interface BadgeBlockProps {
  block: BadgeBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<BadgeBlockType>) => void;
  onDelete: () => void;
}

export const BadgeBlock: React.FC<BadgeBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    text = 'Badge',
    size = 'medium',
    variant = 'solid',
    ...styleProps
  } = block.props;

  const [isEditing, setIsEditing] = React.useState(false);
  const textRef = React.useRef<HTMLElement>(null);
  const isPreviewMode = false; // Should ideally come from store

  const handleTextChange = (newText: string) => {
    onUpdate({ props: { ...block.props, text: newText } });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isSelected && !isPreviewMode) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsEditing(false);
    handleTextChange(e.currentTarget.textContent || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  };

  React.useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs px-2 py-0.5';
      case 'large':
        return 'text-base px-3 py-1';
      default: // medium
        return 'text-sm px-2.5 py-0.5';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'bg-transparent border border-blue-600 text-blue-600';
      case 'soft':
        return 'bg-blue-100 text-blue-800';
      default: // solid
        return 'bg-blue-600 text-white';
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
      <span
        ref={textRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center justify-center font-medium rounded-full outline-none transition-colors
          ${getSizeClasses()}
          ${getVariantClasses()}
        `}
        style={{
          cursor: isEditing ? 'text' : 'inherit',
          ...styleProps
        }}
      >
        {text}
      </span>
    </BaseBlock>
  );
};
