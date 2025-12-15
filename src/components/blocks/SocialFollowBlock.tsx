import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface SocialFollowBlockProps {
  id: string;
  type: 'social-follow';
  props: {
    platforms?: Array<{
      name: string;
      url: string;
      icon: string;
      color?: string;
    }>;
    layout?: 'horizontal' | 'vertical';
    iconSize?: string;
    spacing?: string;
    textAlign?: 'left' | 'center' | 'right';
    showLabels?: boolean;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

const defaultPlatforms = [
  { name: 'Facebook', url: '#', icon: '📘', color: '#1877f2' },
  { name: 'Twitter', url: '#', icon: '🐦', color: '#1da1f2' },
  { name: 'Instagram', url: '#', icon: '📷', color: '#e4405f' },
  { name: 'LinkedIn', url: '#', icon: '💼', color: '#0077b5' },
];

export const SocialFollowBlock: React.FC<{
  block: SocialFollowBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    platforms = defaultPlatforms,
    layout = 'horizontal',
    iconSize = '32px',
    spacing = '10px',
    textAlign = 'center',
    showLabels = true,
    backgroundColor = 'transparent',
    padding = '20px',
    borderRadius = '8px'
  } = block.props;

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    borderRadius,
    textAlign,
    width: '100%',
  };

  const socialContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    gap: spacing,
    justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="w-full"
    >
      <div style={containerStyle}>
        <div style={socialContainerStyle}>
          {platforms.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition-transform hover:scale-110"
              style={{
                color: platform.color,
                textDecoration: 'none',
                fontSize: iconSize,
                margin: '0 5px',
              }}
              aria-label={`Follow us on ${platform.name}`}
            >
              <span style={{ fontSize: iconSize, marginRight: showLabels ? '8px' : '0' }}>
                {platform.icon}
              </span>
              {showLabels && (
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {platform.name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </BaseBlock>
  );
};
