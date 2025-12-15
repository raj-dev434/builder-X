import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockTemplate } from '../../schema/types';

interface DraggableBlockProps {
  template: BlockTemplate;
  onClick: () => void;
  categoryId?: string;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({ template, onClick, categoryId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `template-${template.id}${categoryId ? `-${categoryId}` : ''}`,
    data: {
      type: 'template',
      template,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group cursor-move bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 rounded-lg p-2 transition-all duration-200 group-hover:shadow-sm
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Add ${template.name} block`}
      aria-description="Draggable item. Press Enter to add to canvas, or drag to reorder."
      {...listeners}
      {...attributes}
      data-testid={`block-${template.id}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-200 text-gray-300" aria-hidden="true">
          {template.icon}
        </div>
        <div className="text-xs font-medium text-gray-300 group-hover:text-white leading-tight">
          {template.name}
        </div>
      </div>
    </div>
  );
};
