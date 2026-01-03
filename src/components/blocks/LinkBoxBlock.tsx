import React from 'react';
import { BaseBlock } from './BaseBlock';
import { LinkBoxBlock as LinkBoxBlockType } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

interface LinkBoxBlockProps {
  block: LinkBoxBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<LinkBoxBlockType>) => void;
  onDelete: () => void;
}

// Helper function to normalize URLs
const normalizeUrl = (url: string): string => {
  if (!url || url === '#') return url;

  // If URL already has a protocol, return as is
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) {
    return url;
  }

  // If URL starts with //, add https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  // Otherwise, add https://
  return `https://${url}`;
};

export const LinkBoxBlock: React.FC<LinkBoxBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    text = 'Link Box',
    url = '#',
    target = '_self',
    backgroundColor = '#f8f9fa',
    textColor = '#333333',
    borderColor = '#dee2e6',
    borderWidth = '1px',
    borderRadius = '4px',
    padding = '1rem',
    hoverBackgroundColor = '#e9ecef',
    hoverTextColor = '#333333',
    textAlign = 'center',
    boxShadow = '0 2px 4px rgba(0,0,0,0.1)',
    ...styleProps
  } = block.props;

  const { isPreviewMode } = useCanvasStore();

  const handleTextChange = (newText: string) => {
    onUpdate({ props: { ...block.props, text: newText } });
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <a
        href={normalizeUrl(url)}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        contentEditable={!isPreviewMode && isSelected}
        suppressContentEditableWarning
        onBlur={(e) => handleTextChange(e.currentTarget.textContent || '')}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        onClick={(e) => {
          // Allow link to work normally only in preview mode
          if (!isPreviewMode) {
            e.preventDefault();
          }
        }}
        style={{
          display: 'inline-block',
          backgroundColor,
          color: textColor,
          borderColor,
          borderWidth,
          borderStyle: 'solid',
          borderRadius,
          padding,
          textAlign,
          textDecoration: 'none',
          boxShadow,
          outline: 'none',
          transition: 'all 0.2s ease',
          ...styleProps
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !isPreviewMode) {
            e.currentTarget.style.backgroundColor = hoverBackgroundColor;
            e.currentTarget.style.color = hoverTextColor;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isPreviewMode) {
            e.currentTarget.style.backgroundColor = backgroundColor;
            e.currentTarget.style.color = textColor;
          }
        }}
      >
        {text}
      </a>
    </BaseBlock>
  );
};
