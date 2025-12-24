import React from 'react';
import { BaseBlock } from './BaseBlock';
import { AlertBlock as AlertBlockType } from '../../schema/types';
import { useInlineEditing } from '../../hooks/useInlineEditing';

interface AlertBlockProps {
  block: AlertBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<AlertBlockType>) => void;
  onDelete: () => void;
}

export const AlertBlock: React.FC<AlertBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    text = 'This is an alert message',
    type = 'info',
    dismissible = true,
    showIcon = true,
    icon,
  } = block.props;

  const {
    textRef,
    isEditing,
    handleDoubleClick,
    handleBlur,
    handleKeyDown
  } = useInlineEditing<HTMLDivElement>({
    text,
    onUpdate: (newText) => onUpdate({ props: { ...block.props, text: newText } }),
    isSelected
  });

  const getVariantClasses = () => {
    const isGradient = (block.props as any).backgroundType === 'gradient';
    if (isGradient) {
        switch (type) {
          case 'success': return 'text-green-800 border-green-200 bg-transparent';
          case 'warning': return 'text-yellow-800 border-yellow-200 bg-transparent';
          case 'error':   return 'text-red-800 border-red-200 bg-transparent';
          default:        return 'text-blue-800 border-blue-200 bg-transparent';
        }
    }

    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full"
    >
      <div
        className={`
          flex items-start gap-3 p-4 border rounded-md transition-colors
          ${getVariantClasses()}
        `}
        role="alert"
        onDoubleClick={handleDoubleClick}
      >
        {showIcon && (
          <span className="text-xl flex-shrink-0 select-none">
            {getIcon()}
          </span>
        )}

        <div
          ref={textRef}
          contentEditable={isEditing}
          suppressContentEditableWarning
          className="flex-1 outline-none min-w-[50px]"
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{ cursor: isEditing ? 'text' : 'inherit' }}
        >
          {text}
        </div>

        {dismissible && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex-shrink-0 text-xl leading-none opacity-50 hover:opacity-100 transition-opacity p-1 -mt-1 -mr-1"
            aria-label="Close alert"
            title="Remove alert block"
          >
            ×
          </button>
        )}
      </div>
    </BaseBlock>
  );
};
