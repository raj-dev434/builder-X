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
        group cursor-move bg-[#15181b] hover:bg-[#1a1d21] border border-[#2d3237] hover:border-purple-500/30 rounded-sm p-3 transition-all duration-200 
        ${isDragging ? 'opacity-50 shadow-2xl scale-105 border-purple-500' : 'hover:shadow-lg hover:-translate-y-0.5'}
      `}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Add ${template.name} block`}
      aria-description="Draggable item. Drag or click to add."
      {...listeners}
      {...attributes}
      data-testid={`block-${template.id}`}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="text-xl group-hover:scale-110 transition-transform duration-200 text-gray-500 group-hover:text-purple-400" aria-hidden="true">
          {template.icon}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-200 leading-tight">
          {template.name}
        </div>
      </div>
    </div>
  );
};
