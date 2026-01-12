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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);

  // Update content when block props change
  useEffect(() => {
    setContent(block.props.content);
    setOriginalContent(block.props.content);
  }, [block.props.content]);

  useEffect(() => {
    if (isEditing && textRef.current && !showLinkInput) {
      textRef.current.focus();
      if (!savedSelection.current) {
        // Set cursor to end of text only if NO saved selection (initial edit)
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(textRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [isEditing, showLinkInput]);

  // Sanitize content to prevent XSS
  // simplified for now to allow HTML formatting
  const sanitizeContent = useCallback((html: string): string => {
    // Basic protection against script tags
    return html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");
  }, []);

  const handleDoubleClick = () => {
    if (isSelected && !isPreviewMode) {
      setOriginalContent(content);
      setIsEditing(true);
      setShowLinkInput(false);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedSelection.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  };

  const handleSave = useCallback(() => {
    const sanitizedContent = sanitizeContent(content);
    setIsEditing(false);
    setShowLinkInput(false);
    savedSelection.current = null;
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
    setShowLinkInput(false);
    savedSelection.current = null;
  }, [originalContent]);

  const handleBlur = (e: React.FocusEvent) => {
    // If moving focus to the link input (or anything inside the toolbar), don't stop editing
    if (showLinkInput) return;

    // Check if the new focus target is inside the component
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (showLinkInput) {
        setShowLinkInput(false);
        restoreSelection();
      } else {
        handleCancel();
      }
    }

    // Ctrl+K for Link
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      e.stopPropagation(); // Stop global handlers
      saveSelection();
      setShowLinkInput(true);
      setShowToolbar(true);
    }

    // Prevent event bubbling to avoid conflicts with drag and drop
    e.stopPropagation();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML || '';
    setContent(newContent);
  };

  const handleFormat = (command: string) => {
    if (command === 'link') {
      saveSelection();
      setShowLinkInput(true);
      return;
    }

    if (textRef.current) {
      document.execCommand(command, false);
      textRef.current.focus();
    }
  };

  const handleApplyLink = (url: string) => {
    restoreSelection();
    if (url) {
      document.execCommand('createLink', false, url);
    } else {
      document.execCommand('unlink');
    }
    setShowLinkInput(false);
    // Sync content
    if (textRef.current) {
      setContent(textRef.current.innerHTML);
    }
  };

  const handleCancelLink = () => {
    setShowLinkInput(false);
    restoreSelection();
  };

  const handleSelectionChange = () => {
    if (isEditing && textRef.current && !showLinkInput) {
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
      <div
        className="relative"
        style={getAlignmentStyles()}
        onMouseDown={isEditing ? (e) => e.stopPropagation() : undefined}
        onPointerDown={isEditing ? (e) => e.stopPropagation() : undefined}
      >
        {isEditing && (
          <TextFormattingToolbar
            isVisible={showToolbar}
            onFormat={handleFormat}
            onClose={() => setShowToolbar(false)}
            showLinkInput={showLinkInput}
            onApplyLink={handleApplyLink}
            onCancelLink={handleCancelLink}
          />
        )}

        {isEditing ? (
          <div
            ref={textRef}
            contentEditable
            suppressContentEditableWarning
            className="text-content outline-none w-full min-h-[1.5em] border border-primary-300 rounded px-2 py-1 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
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
          <div
            className="text-content w-full cursor-pointer hover:bg-black/5 transition-colors min-h-[1.5em]"
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
          >
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <span className="text-gray-300 italic select-none">start typing...</span>
            )}
          </div>
        )}
      </div>
      <style>{`
        .text-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .text-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </BaseBlock >
  );
};
