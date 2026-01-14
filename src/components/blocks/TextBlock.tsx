import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextBlock as TextBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { TextFormattingToolbar } from '../canvas/TextFormattingToolbar';
import { useCanvasStore } from '../../store/canvasStore';
import { Trash2, X } from 'lucide-react';

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
  const [selectedImage, setSelectedImage] = useState<{ element: HTMLImageElement } | null>(null);
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

  // Handle image clicks in edit mode
  useEffect(() => {
    if (!isEditing || !textRef.current) {
      setSelectedImage(null);
      return;
    }

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        setSelectedImage({ element: target as HTMLImageElement });
        e.stopPropagation();
      } else {
        setSelectedImage(null);
      }
    };

    const el = textRef.current;
    el.addEventListener('click', handleImageClick);
    return () => el.removeEventListener('click', handleImageClick);
  }, [isEditing]);

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
    setSelectedImage(null);
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
    setSelectedImage(null);
    savedSelection.current = null;
  }, [originalContent]);

  const handleBlur = (e: React.FocusEvent) => {
    // If clicking the delete image button, don't blur/save yet
    if ((e.relatedTarget as HTMLElement)?.closest('.delete-image-btn')) return;

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

  const handleDeleteImage = () => {
    if (selectedImage && textRef.current) {
      selectedImage.element.remove();
      setContent(textRef.current.innerHTML);
      setSelectedImage(null);
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
      width: block.props.width || 'fit-content',
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

    // Add text alignment
    styles.textAlign = block.props.textAlign || 'inherit';

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
          <div className="z-50">
            <TextFormattingToolbar
              isVisible={showToolbar}
              onFormat={handleFormat}
              onClose={() => setShowToolbar(false)}
              showLinkInput={showLinkInput}
              onApplyLink={handleApplyLink}
              onCancelLink={handleCancelLink}
            />

            {/* Inline Image Delete Button */}
            {selectedImage && (
              <div
                className="absolute z-[60] flex items-center gap-1 bg-white border border-red-200 rounded shadow-lg px-2 py-1 transition-all animate-in fade-in zoom-in duration-200"
                style={{
                  top: Math.max(-40, selectedImage.element.offsetTop - 45),
                  left: selectedImage.element.offsetLeft + (selectedImage.element.offsetWidth / 2) - 45,
                }}
              >
                <button
                  onClick={handleDeleteImage}
                  className="delete-image-btn flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-[10px] uppercase tracking-tighter"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Image</span>
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
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
            data-text-align={block.props.textAlign || 'left'}
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
            data-text-align={block.props.textAlign || 'left'}
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
        .text-content b, .text-content strong {
          font-weight: bold !important;
        }
        .text-content i, .text-content em {
          font-style: italic !important;
        }
        .text-content u {
          text-decoration: underline !important;
        }
        .text-content s, .text-content strike, .text-content del {
          text-decoration: line-through !important;
        }
        .text-content pre {
          background-color: #f4f4f4 !important;
          padding: 0.5rem !important;
          border-radius: 4px !important;
          font-family: monospace !important;
          white-space: pre-wrap !important;
          margin-bottom: 1rem !important;
        }
        .text-content ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .text-content ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-bottom: 1rem !important;
        }
        .text-content li {
          margin-bottom: 0.25rem !important;
          display: list-item !important;
        }
        .text-content[data-text-align="center"] ul,
        .text-content[data-text-align="center"] ol,
        .text-content[data-text-align="right"] ul,
        .text-content[data-text-align="right"] ol {
           list-style-position: inside !important;
        }
        .text-content .ql-align-center {
          text-align: center !important;
        }
        .text-content .ql-align-right {
          text-align: right !important;
        }
        .text-content .ql-align-justify {
          text-align: justify !important;
        }
        .text-content img {
            max-width: 100%;
            height: auto;
            display: inline-block;
            cursor: pointer;
            transition: outline 0.1s;
        }
        .text-content img:hover {
            outline: 2px solid #3b82f6;
        }
      `}</style>
    </BaseBlock >
  );
};
