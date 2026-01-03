import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, GroupBlock as GroupBlockType } from '../../schema/types';

export const GroupBlock: React.FC<{
  block: GroupBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete, children }) => {
  const {
    title = 'Group',
    description = '',
    showTitle = true,
    showDescription = false
  } = block.props;

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className={`w-full group ${!children ? 'min-h-[120px]' : ''}`}
    >
      <div className="w-full">
        {(showTitle || showDescription) && (
          <div className="mb-4 border-b border-gray-100/10 pb-3">
            {showTitle && title && (
              <h3
                className="text-lg font-semibold tracking-tight"
                style={{
                  fontFamily: block.props.titleFontFamily,
                  fontSize: block.props.titleFontSize,
                  fontWeight: block.props.titleFontWeight,
                  color: block.props.titleColor,
                  textAlign: block.props.titleTextAlign as any,
                  lineHeight: block.props.titleLineHeight,
                  letterSpacing: block.props.titleLetterSpacing,
                  textTransform: block.props.titleTextTransform as any,
                  textDecoration: block.props.titleTextDecoration as any,
                  fontStyle: block.props.titleFontStyle as any,
                }}
              >
                {title}
              </h3>
            )}
            {showDescription && description && (
              <p
                className="text-xs mt-1 font-medium opacity-70"
                style={{
                  fontFamily: block.props.descriptionFontFamily,
                  fontSize: block.props.descriptionFontSize,
                  fontWeight: block.props.descriptionFontWeight,
                  color: block.props.descriptionColor,
                  textAlign: block.props.descriptionTextAlign as any,
                  lineHeight: block.props.descriptionLineHeight,
                  letterSpacing: block.props.descriptionLetterSpacing,
                  textTransform: block.props.descriptionTextTransform as any,
                  textDecoration: block.props.descriptionTextDecoration as any,
                  fontStyle: block.props.descriptionFontStyle as any,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div className="w-full">
          {children || (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300/20 rounded-lg bg-black/5 text-gray-400 min-h-[120px] transition-all hover:bg-black/10 hover:border-blue-500/30">
              <div className="w-12 h-12 rounded-full bg-blue-500/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <span className="text-2xl opacity-60">📦</span>
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Group Content</p>
              <p className="text-[10px] text-gray-400/80 text-center">Combine and style elements as a single unit</p>
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};
