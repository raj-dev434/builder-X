import React from 'react';
import { BaseBlock } from './BaseBlock';
import { IconBlock as IconBlockType } from '../../schema/types';

interface IconBlockProps {
  block: IconBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<IconBlockType>) => void;
  onDelete: () => void;
}

export const IconBlock: React.FC<IconBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete
}) => {
  const { 
    name = 'star',
    size = '48px',
    view = 'default',
    shape = 'circle',
    color = '#ffc107',
    backgroundColor = '#ffffff',
    rotation = 0,
    textAlign = 'center'
  } = block.props;

  // Curated Emoji Mapping
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      star: '⭐', heart: '❤️', like: '👍', home: '🏠', user: '👤', settings: '⚙️', search: '🔍',
      phone: '📞', email: '📧', location: '📍', calendar: '📅', clock: '🕐', info: 'ℹ️',
      warning: '⚠️', error: '❌', success: '✅', facebook: '📘', twitter: '🐦', instagram: '📷',
      linkedin: '💼', youtube: '📺', github: '🐙', download: '📥', upload: '📤', share: '↗️',
      edit: '✏️', delete: '🗑️', save: '💾', camera: '📸', video: '🎥', sun: '☀️', cloud: '☁️',
      lock: '🔒', bell: '🔔', gift: '🎁'
    };
    return iconMap[iconName] || '⭐';
  };

  const isStacked = view === 'stacked';
  const isFramed = view === 'framed';

  const getIconWrapperStyle = (): React.CSSProperties => {
    let paddingValue = '0px';
    let borderRadiusValue = '0px';
    let borderValue = 'none';
    let bgValue = 'transparent';
    let colorValue = color;

    if (isStacked) {
      bgValue = color;
      colorValue = backgroundColor;
      paddingValue = '0.8em';
    } else if (isFramed) {
      bgValue = 'transparent';
      colorValue = color;
      borderValue = `3px solid ${color}`;
      paddingValue = '0.8em';
    }

    if (shape === 'circle') borderRadiusValue = '50%';
    if (shape === 'rounded') borderRadiusValue = '8px';

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: bgValue,
      color: colorValue,
      padding: paddingValue,
      borderRadius: borderRadiusValue,
      border: borderValue,
      transform: `rotate(${rotation}deg)`,
      transition: 'all 0.3s ease',
      fontSize: size,
      lineHeight: 1,
    };
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className={`w-full flex ${textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex flex-col items-center">
        <div style={getIconWrapperStyle()}>
          {getIcon(name)}
        </div>
        
        {isSelected && (
          <div className="mt-2 text-[10px] text-gray-500 bg-[#1a1d21] px-2 py-0.5 rounded border border-[#2d3237]">
            {name}
          </div>
        )}
      </div>
    </BaseBlock>
  );
};