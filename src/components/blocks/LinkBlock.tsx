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
    rel,
    // Typography
    fontFamily,
    fontSize,
    fontWeight,
    textDecoration,
    textAlign,
    // Colors
    color = '#3b82f6',
    backgroundColor,
    hoverColor,
    hoverBackgroundColor,
    // Box Model
    padding,
    margin,
    border,
    borderRadius,
    // Animation
    hoverAnimation,
    ...otherProps
  } = block.props;

  const [isEditing, setIsEditing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
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
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // Separate styles for wrapper (BaseBlock) and link element
  const linkStyle: React.CSSProperties = {
    fontFamily,
    fontSize,
    fontWeight: fontWeight as any,
    textDecoration,
    textAlign: textAlign as any,
    color: isHovered && hoverColor ? hoverColor : color,
    backgroundColor: isHovered && hoverBackgroundColor ? hoverBackgroundColor : backgroundColor,
    padding,
    border,
    borderRadius,
    display: 'inline-block', // allows padding/dims
    cursor: isEditing ? 'text' : 'pointer',
    outline: 'none',
    transition: 'all 0.3s ease',
    ...otherProps // any other specific styles
  };

  // Wrapper handles positioning and margins
  const wrapperStyle: React.CSSProperties = {
     margin,
     // We don't want to double-apply padding/bg if they are meant for the link "button" look
     // BaseBlock handles layout/positioning mainly.
  };
  
  // Animation Class
  const getAnimationClass = () => {
      if (!hoverAnimation || hoverAnimation === 'none') return '';
      switch (hoverAnimation) {
          case 'grow': return 'hover:scale-105';
          case 'fade': return 'hover:opacity-75';
          case 'underline': return 'hover:underline'; // simple fallback, typically slide underline needs custom css
          default: return '';
      }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={wrapperStyle}
    >
      <a
        ref={textRef}
        href={normalizeUrl(url)}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`transition-all duration-300 ${getAnimationClass()}`}
        style={linkStyle}
        onClick={(e) => {
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
