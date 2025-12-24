import React from 'react';
import { Block, GridBlock as GridBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useCanvasStore } from '../../store/canvasStore';

export const GridBlock: React.FC<{
  block: GridBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete, children }) => {
  const { viewDevice } = useCanvasStore();
  const props = block.props as any;

  // Responsive Grid Helpers
  const getResponsiveValue = (desktop: any, tablet: any, mobile: any) => {
    if (viewDevice === 'mobile') return mobile || tablet || desktop;
    if (viewDevice === 'tablet') return tablet || desktop;
    return desktop;
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getResponsiveValue(props.gridTemplateColumns, props.gridTemplateColumns_tablet, props.gridTemplateColumns_mobile) || 'repeat(3, 1fr)',
    gridTemplateRows: getResponsiveValue(props.gridTemplateRows, props.gridTemplateRows_tablet, props.gridTemplateRows_mobile) || 'auto',
    gap: getResponsiveValue(props.gap, props.gap_tablet, props.gap_mobile),
    rowGap: getResponsiveValue(props.rowGap, props.rowGap_tablet, props.rowGap_mobile),
    columnGap: getResponsiveValue(props.columnGap, props.columnGap_tablet, props.columnGap_mobile),
    justifyItems: props.justifyItems || 'stretch',
    alignItems: props.alignItems || 'stretch',
    justifyContent: props.justifyContent,
    alignContent: props.alignContent,
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      style={gridStyle}
      className={`w-full group ${!children ? 'min-h-[120px]' : ''}`}
    >
      {children || (
        <div className="flex flex-col items-center justify-center h-full min-h-[120px] border-2 border-dashed border-gray-300/20 rounded-lg bg-black/5 text-gray-400 p-8 transition-all hover:bg-black/10 hover:border-blue-500/30">
          <div className="w-12 h-12 rounded-full bg-blue-500/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <span className="text-2xl opacity-60">🏁</span>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Grid Layout</p>
          <p className="text-[10px] text-gray-400/80 text-center">Place elements in a responsive grid</p>
        </div>
      )}
    </BaseBlock>
  );
};
