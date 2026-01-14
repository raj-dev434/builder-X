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
    // New props
    showIcon = false,
    icon = '📝',
    iconPosition = 'left',
    showTooltip = false,
    tooltipText = '',
    helpText = '',
    requiredIndicator = '*',
    requiredColor = '#dc3545',
    layout = 'horizontal',
    ...styleProps
  } = block.props as any;

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

  const renderIcon = () => {
    if (!showIcon) return null;
    return (
      <span style={{
        marginRight: iconPosition === 'left' ? '0.5rem' : '0',
        marginLeft: iconPosition === 'right' ? '0.5rem' : '0',
        fontSize: '1rem',
        display: 'inline-flex',
        alignItems: 'center'
      }}>
        {icon}
      </span>
    );
  };

  const renderRequired = () => {
    if (!required) return null;
    return (
      <span style={{
        color: requiredColor,
        marginLeft: '0.25rem',
        fontWeight: 'bold',
        fontSize: '1.1em'
      }}>
        {requiredIndicator}
      </span>
    );
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <div style={{
        display: 'flex',
        flexDirection: layout === 'vertical' ? 'column' : 'row',
        gap: layout === 'vertical' ? '0.25rem' : '0',
        alignItems: layout === 'horizontal' ? 'center' : 'flex-start'
      }}>
        <label
          htmlFor={htmlFor}
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            cursor: 'pointer',
            ...styleProps
          }}
          title={showTooltip && tooltipText ? tooltipText : undefined}
        >
          {iconPosition === 'left' && renderIcon()}

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

          {renderRequired()}
          {iconPosition === 'right' && renderIcon()}

          {showTooltip && tooltipText && (
            <span style={{
              marginLeft: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280',
              cursor: 'help',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '1px solid #9ca3af',
              fontWeight: 'bold'
            }}>
              ?
            </span>
          )}
        </label>

        {helpText && (
          <span style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            fontStyle: 'italic',
            marginTop: layout === 'vertical' ? '0' : '0.125rem',
            marginLeft: layout === 'horizontal' ? '0.5rem' : '0'
          }}>
            {helpText}
          </span>
        )}
      </div>
    </BaseBlock>
  );
};
