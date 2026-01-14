import React from 'react';
import { BaseBlock } from './BaseBlock';
import { TextareaBlock as TextareaBlockType } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

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
    // Submit button props
    showSubmitButton = false,
    submitButtonText = 'Submit',
    submitButtonColor = '#3b82f6',
    submitButtonTextColor = '#ffffff',
    submitButtonAlignment = 'left',
    submitAction = 'alert',
    successMessage = 'Submitted successfully!',
    ...styleProps
  } = block.props as any;

  const { isPreviewMode } = useCanvasStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ props: { ...block.props, value: e.target.value } });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isPreviewMode) return; // Only work in preview mode

    // Validation
    if (required && !value) {
      alert('This field is required!');
      return;
    }

    // Submit actions
    if (submitAction === 'alert') {
      alert(successMessage || `Submitted: ${value}`);
    } else if (submitAction === 'console') {
      console.log(`Textarea "${name}" submitted:`, value);
      alert(successMessage);
    } else if (submitAction === 'clear') {
      onUpdate({ props: { ...block.props, value: '' } });
      alert(successMessage);
    }
  };

  const getButtonAlignment = () => {
    switch (submitButtonAlignment) {
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
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

        {showSubmitButton && (
          <div style={{ display: 'flex', justifyContent: getButtonAlignment() }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: submitButtonColor,
                color: submitButtonTextColor,
                padding: '10px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isPreviewMode ? 'pointer' : 'default',
                transition: 'filter 0.2s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (isPreviewMode) {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
              }}
              type="button"
            >
              {submitButtonText}
            </button>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
