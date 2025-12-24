import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextBlock as TextBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { TextFormattingToolbar } from '../canvas/TextFormattingToolbar';
import { useCanvasStore } from '../../store/canvasStore';

interface TextBlockProps {
  block: TextBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextBlockType>) => void;
  onDelete: () => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const isPreviewMode = useCanvasStore((state) => state.isPreviewMode);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.props.content);
  const [originalContent, setOriginalContent] = useState(block.props.content);
  const [showToolbar, setShowToolbar] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Update content when block props change
  useEffect(() => {
    setContent(block.props.content);
    setOriginalContent(block.props.content);
  }, [block.props.content]);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Set cursor to end of text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // Sanitize content to prevent XSS
  const sanitizeContent = useCallback((html: string): string => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }, []);

  const handleDoubleClick = () => {
    if (isSelected && !isPreviewMode) {
      setOriginalContent(content);
      setIsEditing(true);
    }
  };

  const handleSave = useCallback(() => {
    const sanitizedContent = sanitizeContent(content);
    setIsEditing(false);
    onUpdate({
      props: {
        ...block.props,
        content: sanitizedContent
      }
    });
  }, [content, block.props, onUpdate, sanitizeContent]);

  const handleCancel = useCallback(() => {
    setContent(originalContent);
    setIsEditing(false);
  }, [originalContent]);

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
    // Prevent event bubbling to avoid conflicts with drag and drop
    e.stopPropagation();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.textContent || '';
    setContent(newContent);
  };

  const handleFormat = (command: string) => {
    if (textRef.current) {
      document.execCommand(command, false);
      textRef.current.focus();
    }
  };

  const handleSelectionChange = () => {
    if (isEditing && textRef.current) {
      const selection = window.getSelection();
      const hasSelection = Boolean(selection && selection.toString().length > 0);
      setShowToolbar(hasSelection);
    }
  };

  // Get alignSelf from props to determine alignment behavior
  const alignSelf = block.props.alignSelf;

  // Calculate alignment styles using margin instead of alignSelf for better compatibility
  const getAlignmentStyles = (): React.CSSProperties => {
    if (!alignSelf || alignSelf === 'stretch') {
      return { width: '100%' };
    }

    // Use margin auto for alignment
    // If no explicit width is set, use a reasonable default (50%) to make alignment visible
    const styles: React.CSSProperties = {
      width: block.props.width || '50%',
      maxWidth: block.props.maxWidth || '100%',
      display: 'block'
    };

    if (alignSelf === 'flex-start') {
      styles.marginRight = 'auto';
      styles.marginLeft = '0';
    } else if (alignSelf === 'center') {
      styles.marginLeft = 'auto';
      styles.marginRight = 'auto';
    } else if (alignSelf === 'flex-end') {
      styles.marginLeft = 'auto';
      styles.marginRight = '0';
    }

    return styles;
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className=""
    >
      <div className="relative" style={getAlignmentStyles()}>
        {isEditing && (
          <TextFormattingToolbar
            isVisible={showToolbar}
            onFormat={handleFormat}
            onClose={() => setShowToolbar(false)}
          />
        )}

        {isEditing ? (
          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none w-full min-h-[1.5em] border border-primary-300 rounded px-2 py-1 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            style={{ font: 'inherit', color: 'inherit', textAlign: 'inherit' }}
            onInput={handleInput}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            role="textbox"
            aria-label="Edit text content"
            tabIndex={0}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p
            className="w-full cursor-pointer hover:bg-black/5 transition-colors"
            style={{ font: 'inherit', color: 'inherit', textAlign: 'inherit' }}
            onDoubleClick={handleDoubleClick}
            role="button"
            aria-label="Double-click to edit text"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDoubleClick();
              }
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </BaseBlock>
  );
};
