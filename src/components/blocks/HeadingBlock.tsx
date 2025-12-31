import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BaseBlock } from './BaseBlock';
import { HeadingBlock as HeadingBlockType } from '../../schema/types';
import { TextFormattingToolbar } from '../canvas/TextFormattingToolbar';
import { useCanvasStore } from '../../store/canvasStore';

interface HeadingBlockProps {
  block: HeadingBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<HeadingBlockType>) => void;
  onDelete: () => void;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const isPreviewMode = useCanvasStore((state) => state.isPreviewMode);
  const { text = 'Your Heading Here', level = 2, ...styleProps } = block.props;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(text);
  const [originalContent, setOriginalContent] = useState(text);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const savedSelection = useRef<Range | null>(null);

  useEffect(() => {
    setContent(text);
    setOriginalContent(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && textRef.current && !showLinkInput) {
      textRef.current.focus();
      if (!savedSelection.current) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(textRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [isEditing, showLinkInput]);

  const sanitizeContent = useCallback((html: string): string => {
    // Allow basic HTML like <b>, <i>, <a>
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
    // Use current content from ref if possible to ensure latest edits
    const currentContent = textRef.current ? textRef.current.innerHTML : content;
    const sanitizedContent = sanitizeContent(currentContent);
    setIsEditing(false);
    setShowLinkInput(false);
    savedSelection.current = null;
    onUpdate({ props: { ...block.props, text: sanitizedContent } });
  }, [content, block.props, onUpdate, sanitizeContent]);

  const handleCancel = useCallback(() => {
    setContent(originalContent);
    setIsEditing(false);
    setShowLinkInput(false);
    savedSelection.current = null;
  }, [originalContent]);

  const handleBlur = (e: React.FocusEvent) => {
    if (showLinkInput) return;
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      e.stopPropagation();
      saveSelection();
      setShowLinkInput(true);
      setShowToolbar(true);
    }
    e.stopPropagation();
  };

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
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
    if (textRef.current) setContent(textRef.current.innerHTML);
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

  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <div
        className="relative w-full heading-content"
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

        <HeadingTag
          ref={textRef as any}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onDoubleClick={handleDoubleClick}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          style={{
            margin: 0,
            padding: 0,
            outline: 'none',
            cursor: isEditing ? 'text' : 'pointer',
            // Force styles to ensure they apply to the editable element
            ...styleProps,
            // Ensure links inside are colored correctly if not overridden
            color: styleProps.color || 'inherit'
          }}
          // Use props.customClass if needed
          className={`${isEditing ? 'border border-blue-400 min-h-[1em] rounded px-1 -mx-1' : ''}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <style>{`
        .heading-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        .heading-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </BaseBlock>
  );
};
