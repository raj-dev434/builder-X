import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropZoneProps {
  parentId: string | null;
  index: number;
  show?: boolean;
}

// Memoized DropZone to prevent unnecessary re-renders
export const DropZone: React.FC<DropZoneProps> = React.memo(({ parentId, index, show }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${parentId || 'root'}-${index}`,
    data: {
      type: 'DROP_ZONE',
      parentId,
      index
    }
  });

  // Calculate dynamic classes based on state
  const baseClasses = "w-full transition-all duration-200 rounded-full";
  
  if (isOver) {
    return (
      <div 
        ref={setNodeRef} 
        className={`${baseClasses} h-2 bg-green-500 my-1 shadow-lg ring-2 ring-green-200 z-50 relative`}
      />
    );
  }

  // Expanded drop zone for easier targeting when dragging
  // We use padding (py-2) on a container or height on this invisible element to increase target area
  return (
    <div 
      ref={setNodeRef} 
      // h-4 (16px) invisible target area, but visually it collapses to 0 when not hovering/dragging
      // We use opacity-0 and -my-2 to make it invisible but 'meaty' for the mouse
      className={`
        ${baseClasses} 
        h-4 -my-2 z-10 relative 
        ${show ? 'bg-blue-100/30' : 'opacity-0'} 
        hover:opacity-100
      `}
    >
        {/* Visual guide line that appears on hover - Thinner and cleaner */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Optional: Add a small circle indicator at the start */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
});
