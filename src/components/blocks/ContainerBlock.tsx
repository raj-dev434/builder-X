import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, ContainerBlock as ContainerBlockType } from '../../schema/types';

export const ContainerBlock: React.FC<{
  block: ContainerBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete, children }) => {
  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className={`w-full group ${!children ? 'min-h-[120px]' : ''}`}
    >
      {children || (
        <div className="flex flex-col items-center justify-center h-full min-h-[120px] border-2 border-dashed border-gray-300/20 rounded-lg bg-black/5 text-gray-400 p-8 transition-all hover:bg-black/10 hover:border-blue-500/30">
          <div className="w-12 h-12 rounded-full bg-blue-500/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <span className="text-2xl opacity-60">📦</span>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Container</p>
          <p className="text-[10px] text-gray-400/80">Drag and drop elements here</p>
        </div>
      )}
    </BaseBlock>
  );
};
