import React from 'react';
import { ButtonBlock as ButtonBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useInlineEditing } from '../../hooks/useInlineEditing';

interface ButtonBlockProps {
  block: ButtonBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ButtonBlockType>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  children
}) => {
  // Removed isPreviewMode as it is handled in useInlineEditing, and selection logic handles the rest.
  const {
    text = 'Button',
    href,
    variant = 'primary',
    size = 'medium',
    email,
    phone,
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

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700';
      case 'outline':
        return 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50';
      case 'ghost':
        return 'bg-transparent text-primary-600 hover:bg-primary-50';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600';
      default: // primary
        return 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-xs';
      case 'large':
        return 'px-8 py-3 text-lg';
      default: // medium
        return 'px-5 py-2.5 text-sm';
    }
  };

  // Determine the link destination
  const getHref = () => {
    if (href) return href;
    if (email) return `mailto:${email}`;
    if (phone) return `tel:${phone}`;
    return undefined;
  };

  const linkUrl = getHref();
  const Component = linkUrl ? 'a' : 'button';

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full"
    >
      <div className="flex justify-start w-full">
        <Component
          href={linkUrl}
          target={linkUrl ? "_blank" : undefined}
          rel={linkUrl ? "noopener noreferrer" : undefined}
          className={`
            inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform active:scale-95 outline-none
            ${getVariantClasses()}
            ${getSizeClasses()}
          `}
          style={styleProps}
          onClick={(e) => {
            if (isSelected) e.preventDefault(); // Prevent link navigation when selected
          }}
          onDoubleClick={handleDoubleClick}
        >
          <div className="flex items-center gap-2">
            <span
              ref={textRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              className="outline-none min-w-[20px] text-center"
              style={{ cursor: isEditing ? 'text' : 'inherit' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            >
              {text}
            </span>
            {children}
          </div>
        </Component>
      </div>
    </BaseBlock>
  );
};
