import React, { useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';

interface UseInlineEditingProps {
  text: string;
  onUpdate: (newText: string) => void;
  isSelected: boolean;
  tagName?: string; // Optional: restrict which tags can trigger edit if needed (not strictly necessary here but good for future)
}

export const useInlineEditing = <T extends HTMLElement>({
  text,
  onUpdate,
  isSelected
}: UseInlineEditingProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<T>(null);
  const isPreviewMode = useCanvasStore((state) => state.isPreviewMode);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isSelected && !isPreviewMode) {
      e.stopPropagation();
      e.preventDefault();
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
        // Use textContent to get the plain text, falback to empty string
        const newText = textRef.current.textContent || '';
        // Only update if changes were made to avoid unnecessary renders/updates
        if (newText !== text) {
            onUpdate(newText);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<T>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      // Cancel editing, revert text
      e.preventDefault();
      setIsEditing(false);
      if (textRef.current) {
        textRef.current.textContent = text;
      }
    }
  };

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Select all text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false); // Place cursor at end
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  return {
    isEditing,
    textRef,
    handleDoubleClick,
    handleBlur,
    handleKeyDown
  };
};
