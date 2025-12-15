import React from 'react';
import { BaseBlock } from './BaseBlock';
import { LinkBlock as LinkBlockType } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

interface LinkBlockProps {
  block: LinkBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<LinkBlockType>) => void;
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

export const LinkBlock: React.FC<LinkBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    text = 'Click here',
    url = '#',
    target = '_self',
    ...styleProps
  } = block.props;

  const [isEditing, setIsEditing] = React.useState(false);
  const textRef = React.useRef<HTMLAnchorElement>(null);
  const { isPreviewMode } = useCanvasStore();

  const handleTextChange = (newText: string) => {
    onUpdate({ props: { ...block.props, text: newText } });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isSelected && !isPreviewMode) {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
    setIsEditing(false);
    handleTextChange(e.currentTarget.textContent || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  React.useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <a
        ref={textRef}
        href={normalizeUrl(url)}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          textDecoration: 'none',
          outline: 'none',
          cursor: isEditing ? 'text' : 'pointer',
          ...styleProps
        }}
        onClick={(e) => {
          // Allow link to work normally in preview mode
          if (!isPreviewMode && (isSelected || isEditing)) {
            e.preventDefault();
          }
        }}
      >
        {text}
      </a>
    </BaseBlock>
  );
};
