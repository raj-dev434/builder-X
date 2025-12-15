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
  //onUpdate,
  onDelete
}) => {
  const { 
    name = 'star',
    size = '24px',
    color = '#ffc107',
    backgroundColor = 'transparent',
    borderRadius = '50%',
    padding = '8px',
    margin = '0',
    border = 'none',
    hoverColor = color,
    hoverBackgroundColor = 'rgba(255, 193, 7, 0.1)',
    clickable = false,
    url,
    target = '_self',
    fontSize = size
  } = block.props;

  const [isHovered, setIsHovered] = React.useState(false);

  // Enhanced icon mapping with more icons
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      // Basic
      star: '⭐',
      heart: '❤️',
      like: '👍',
      home: '🏠',
      user: '👤',
      settings: '⚙️',
      search: '🔍',
      menu: '☰',
      close: '✕',
      check: '✓',
      plus: '➕',
      minus: '➖',
      arrow: '→',
      phone: '📞',
      email: '📧',
      location: '📍',
      calendar: '📅',
      clock: '🕐',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      
      // Social
      facebook: '📘',
      twitter: '🐦',
      instagram: '📷',
      linkedin: '💼',
      youtube: '📺',
      github: '🐙',
      
      // Actions
      download: '📥',
      upload: '📤',
      share: '↗️',
      edit: '✏️',
      delete: '🗑️',
      save: '💾',
      print: '🖨️',
      
      // Media
      camera: '📸',
      video: '🎥',
      music: '🎵',
      mic: '🎤',
      
      // Weather
      sun: '☀️',
      cloud: '☁️',
      rain: '🌧️',
      snow: '❄️',
      
      // Objects
      lock: '🔒',
      unlock: '🔓',
      key: '🔑',
      bell: '🔔',
      gift: '🎁',
      bag: '👜'
    };
    return iconMap[iconName] || '⭐';
  };

  const iconStyle: React.CSSProperties = {
    fontSize: fontSize,
    color: isHovered && clickable ? hoverColor : color,
    backgroundColor: isHovered && clickable ? hoverBackgroundColor : backgroundColor,
    borderRadius,
    padding,
    margin,
    border,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    transition: 'all 0.2s ease',
    cursor: clickable ? 'pointer' : 'default',
    transform: isHovered && clickable ? 'scale(1.1)' : 'scale(1)',
    boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none'
  };

  const iconElement = (
    <div
      style={iconStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        if (isSelected) {
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      {getIcon(name)}
    </div>
  );

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="inline-block"
    >
      {clickable && url ? (
        <a
          href={url}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          onClick={(e) => {
            if (isSelected) {
              e.preventDefault();
              onSelect();
            }
          }}
          style={{ textDecoration: 'none' }}
        >
          {iconElement}
        </a>
      ) : (
        iconElement
      )}
      
      {/* Icon name label when selected */}
      {isSelected && (
        <div className="mt-2 text-xs text-center text-gray-600 bg-white/80 px-2 py-1 rounded">
          {name}
        </div>
      )}
    </BaseBlock>
  );
};