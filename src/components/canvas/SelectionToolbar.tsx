import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

interface SelectionToolbarProps {
  blockId: string;
  position?: { x: number; y: number };
  onClose: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  blockId,
  position,
  onClose,
  style,
  className
}) => {
  const { duplicateBlock, moveBlockUp, moveBlockDown, deleteBlock } = useCanvasStore();

  const handleDuplicate = () => {
    duplicateBlock(blockId);
    onClose();
  };

  const handleMoveUp = () => {
    moveBlockUp(blockId);
  };

  const handleMoveDown = () => {
    moveBlockDown(blockId);
  };

  const handleDelete = () => {
    deleteBlock(blockId);
    onClose();
  };

  const defaultStyle: React.CSSProperties = position ? {
    left: position.x,
    top: position.y - 50,
    transform: 'translateX(-50%)',
    position: 'absolute'
  } : {};

  return (
    <div
      className={`bg-blue-500 text-white rounded-lg shadow-lg p-1 flex items-center gap-1 ${className || ''}`}
      style={{
        ...defaultStyle,
        ...style
      }}
    >
      {/* Move Up */}
      <button
        onClick={handleMoveUp}
        className="p-1 hover:bg-blue-600 rounded transition-colors"
        title="Move Up"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Move Down */}
      <button
        onClick={handleMoveDown}
        className="p-1 hover:bg-blue-600 rounded transition-colors"
        title="Move Down"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* Duplicate */}
      <button
        onClick={handleDuplicate}
        className="p-1 hover:bg-blue-600 rounded transition-colors"
        title="Duplicate"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="p-1 hover:bg-red-600 rounded transition-colors"
        title="Delete"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};
