  import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Block } from '../../schema/types';

interface LayerItemProps {
  block: Block;
  level: number;
  selectedBlockIds: string[];
  onSelect: (id: string, multi: boolean) => void;
  onToggle: (id: string) => void;
  expanded: Set<string>;
}

const LayerItem: React.FC<LayerItemProps> = ({ 
  block, 
  level, 
  selectedBlockIds, 
  onSelect,
  onToggle,
  expanded
}) => {
  const isSelected = selectedBlockIds.includes(block.id);
  const isExpanded = expanded.has(block.id);
  const hasChildren = block.children && block.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(block.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id, e.ctrlKey || e.metaKey);
  };

  // Helper to get icon based on block type (simplified)
  const getIcon = (type: string) => {
    switch (type) {
      case 'section': return '▢';
      case 'row': return '▭';
      case 'column': return '▮';
      case 'text': return 'T';
      case 'image': return '🖼️';
      case 'button': return '▱';
      default: return '▪';
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center py-2 px-2 cursor-pointer hover:bg-gray-700 transition-colors ${
          isSelected ? 'bg-blue-600 text-white' : 'text-gray-300'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span 
          className={`w-4 h-4 flex items-center justify-center mr-1 text-gray-500 hover:text-gray-300 ${!hasChildren ? 'invisible' : ''}`}
          onClick={handleToggle}
        >
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className="mr-2 text-sm opacity-70">{getIcon(block.type)}</span>
        <span className="text-sm truncate select-none">{block.type}</span>
      </div>
      
      {isExpanded && hasChildren && block.children && (
        <div>
          {block.children.map(child => (
            <LayerItem 
              key={child.id} 
              block={child} 
              level={level + 1}
              selectedBlockIds={selectedBlockIds}
              onSelect={onSelect}
              onToggle={onToggle}
              expanded={expanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface LayersPanelProps {
  onClose: () => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ onClose }) => {
  const { blocks, selectedBlockIds, selectBlock } = useCanvasStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Auto-expand path to selected block
  React.useEffect(() => {
    if (selectedBlockIds.length > 0) {
      // Logic to find parents would be good here, but for now let's just ensure manual control
      // Or we could use the parentMap from store if exposed, but for now simple local state
    }
  }, [selectedBlockIds]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-200">Layers</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {blocks.length === 0 ? (
           <div className="text-center p-4 text-gray-500 text-sm">No blocks on canvas</div>
        ) : (
          blocks.map(block => (
            <LayerItem 
              key={block.id}
              block={block}
              level={0}
              selectedBlockIds={selectedBlockIds}
              onSelect={selectBlock}
              onToggle={toggleExpand}
              expanded={expanded}
            />
          ))
        )}
      </div>
    </div>
  );
};
