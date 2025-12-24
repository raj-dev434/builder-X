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
      // icon prop is deprecated in favor of name-based lookup, but kept for custom overrides if needed
      icon?: string; 
      color?: string;
    }>;
    layout?: 'horizontal' | 'vertical';
    iconSize?: string;
    gap?: string;
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
    showLabels?: boolean;
    // Style Props
    shape?: 'rounded' | 'square' | 'circle';
    view?: 'official' | 'custom';
    buttonStyle?: 'solid' | 'framed' | 'minimal';
    hoverAnimation?: 'none' | 'grow' | 'shrink' | 'rotate' | 'float';
    iconPrimaryColor?: string;
    iconSecondaryColor?: string;
  };
}

const defaultPlatforms = [
  { name: 'Facebook', url: '#' },
  { name: 'Twitter', url: '#' },
  { name: 'Instagram', url: '#' },
  { name: 'LinkedIn', url: '#' },
];

// SVG Icons Map
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  'Facebook': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="0" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  'Twitter': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="0" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
  'Instagram': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  'LinkedIn': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="0" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  'YouTube': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
  'GitHub': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  'TikTok': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>,
  'Dribbble': <svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-5.38c-3.72-3.85-8.2-5.37-13.48-3.09M2.93 12.93c5.85-2.22 13.91-1 18.14 0"></path></svg>
};

export const SocialFollowBlock: React.FC<{
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const props = block.props as any;
  const { 
    platforms = defaultPlatforms,
    layout = 'horizontal',
    iconSize = '16px',
    gap = '10px',
    justifyContent = 'center',
    showLabels = false,
    shape = 'rounded',
    view = 'official',
    buttonStyle = 'solid',
    hoverAnimation = 'none',
    iconPrimaryColor = '#3b82f6',
    iconSecondaryColor = '#ffffff',
    iconHoverPrimaryColor,
  } = props;

  // Official Brand Colors Map
  const BRAND_COLORS: Record<string, string> = {
      'Facebook': '#1877f2',
      'Twitter': '#1da1f2',
      'Instagram': '#e4405f',
      'LinkedIn': '#0077b5',
      'YouTube': '#ff0000',
      'GitHub': '#333333',
      'TikTok': '#000000',
      'Dribbble': '#ea4c89'
  };

  const getIconStyle = (platformName: string, color: string | undefined): React.CSSProperties => {
      const isCustom = view === 'custom';
      const brandColor = BRAND_COLORS[platformName] || color || '#555';
      const primary = isCustom ? iconPrimaryColor : brandColor;
      const secondary = isCustom ? iconSecondaryColor : '#ffffff';

      let baseStyle: React.CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: iconSize,
          width: buttonStyle === 'minimal' ? 'auto' : `calc(${iconSize} + 20px)`, 
          height: buttonStyle === 'minimal' ? 'auto' : `calc(${iconSize} + 20px)`,
          lineHeight: 1,
          padding: showLabels && buttonStyle !== 'minimal' ? '0 12px' : '0',
          borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '4px' : '0px',
      };

      if (showLabels && buttonStyle !== 'minimal') {
          baseStyle.width = 'auto';
      }

      switch (buttonStyle) {
          case 'solid':
              baseStyle.backgroundColor = primary;
              baseStyle.color = secondary;
              break;
          case 'framed':
              baseStyle.backgroundColor = 'transparent';
              baseStyle.border = `1px solid ${primary}`;
              baseStyle.color = primary;
              break;
          case 'minimal':
              baseStyle.backgroundColor = 'transparent';
              baseStyle.color = primary;
              break;
      }

      return baseStyle;
  };

  const getHref = (url: string) => {
      if (!url) return '#';
      if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
      return `https://${url}`;
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
      <div 
        style={{
          display: 'flex',
          flexDirection: layout === 'vertical' ? 'column' : 'row',
          gap: gap,
          justifyContent: justifyContent,
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
          {platforms.map((platform: any, index: number) => {
             const style = getIconStyle(platform.name, platform.color);
             const iconNode = SOCIAL_ICONS[platform.name] || <span>{platform.name[0]}</span>;
             const displayLabel = platform.label || platform.name;
             const hoverClass = hoverAnimation !== 'none' ? `hover-animate-${hoverAnimation}` : '';
             
             return (
                <a
                  key={index}
                  href={getHref(platform.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-icon-link ${hoverClass}`}
                  style={style}
                  aria-label={`Follow us on ${displayLabel}`}
                  onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      if (view === 'custom' && iconHoverPrimaryColor) {
                          if (buttonStyle === 'solid') target.style.backgroundColor = iconHoverPrimaryColor;
                          if (buttonStyle === 'framed') {
                              target.style.borderColor = iconHoverPrimaryColor;
                              target.style.color = iconHoverPrimaryColor;
                          }
                          if (buttonStyle === 'minimal') target.style.color = iconHoverPrimaryColor;
                      } else {
                          target.style.opacity = '0.8';
                      }
                  }}
                  onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      if (view === 'custom' && iconHoverPrimaryColor) {
                           if (buttonStyle === 'solid') target.style.backgroundColor = iconPrimaryColor;
                           if (buttonStyle === 'framed') {
                               target.style.borderColor = iconPrimaryColor;
                               target.style.color = iconPrimaryColor;
                           }
                           if (buttonStyle === 'minimal') target.style.color = iconPrimaryColor;
                      } else {
                          target.style.opacity = '1';
                      }
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: 'inherit' }}>
                    {iconNode}
                  </span>
                  {showLabels && (
                    <span style={{ marginLeft: '8px', fontSize: '0.85em', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {displayLabel}
                    </span>
                  )}
                </a>
             );
          })}
        <style>{`
            .hover-animate-grow:hover { transform: scale(1.1); }
            .hover-animate-shrink:hover { transform: scale(0.9); }
            .hover-animate-rotate:hover { transform: rotate(15deg); }
            .hover-animate-float:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        `}</style>
      </div>
    </BaseBlock>
  );
};
