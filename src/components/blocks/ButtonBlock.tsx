import React from 'react';
import { ButtonBlock as ButtonBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useInlineEditing } from '../../hooks/useInlineEditing';

interface ButtonBlockProps {
  block: ButtonBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ButtonBlockType>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  children
}) => {
  // Removed isPreviewMode as it is handled in useInlineEditing, and selection logic handles the rest.
  // Icon Helper (Reused logic from IconBlock)
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      star: '⭐', heart: '❤️', like: '👍', home: '🏠', user: '👤', settings: '⚙️', search: '🔍',
      phone: '📞', email: '📧', location: '📍', calendar: '📅', clock: '🕐', info: 'ℹ️',
      warning: '⚠️', error: '❌', success: '✅', facebook: '📘', twitter: '🐦', instagram: '📷',
      linkedin: '💼', youtube: '📺', github: '🐙', download: '📥', upload: '📤', share: '↗️',
      edit: '✏️', delete: '🗑️', save: '💾', camera: '📸', video: '🎥', sun: '☀️', cloud: '☁️',
      lock: '🔒', bell: '🔔', gift: '🎁', check: '✓', arrowRight: '→', arrowLeft: '←',
      plus: '+', minus: '-', cart: '🛒'
    };
    // If not in map, just return the name if it's 1-2 chars (like emoji) or a default
    if (iconMap[iconName]) return iconMap[iconName];
    // If user typed an emoji directly, let it pass. If it's a long name, show ?
    return iconName.length <= 2 ? iconName : '⭐';
  };

  const {
    text = 'Button',
    icon,
    iconPosition = 'after',
    iconSpacing = '8px',
    href,
    linkType, // destructure needed for getHref
    variant = 'primary',
    size = 'medium',
    email,
    phone,
    ...styleProps
  } = block.props;

  const {
    textRef,
    isEditing,
    handleDoubleClick,
    handleBlur,
    handleKeyDown
  } = useInlineEditing<HTMLElement>({
    text,
    onUpdate: (newText) => onUpdate({ props: { ...block.props, text: newText } }),
    isSelected
  });

  const getVariantClasses = () => {
    // If custom colors are provided, we skip the variant's background/text classes
    const hasCustomBg = !!block.props.backgroundColor;
    const hasCustomColor = !!block.props.textColor || !!block.props.color;

    if (hasCustomBg || hasCustomColor) {
      return 'transition-all duration-200 transform active:scale-95 outline-none font-medium rounded-lg';
    }

    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 font-medium rounded-lg transition-all duration-200 transform active:scale-95 outline-none';
      case 'outline':
        return 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-medium rounded-lg transition-all duration-200 transform active:scale-95 outline-none';
      case 'ghost':
        return 'bg-transparent text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-all duration-200 transform active:scale-95 outline-none';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 font-medium rounded-lg transition-all duration-200 transform active:scale-95 outline-none';
      default: // primary
        return 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg font-medium rounded-lg transition-all duration-200 transform active:scale-95 outline-none';
    }
  };

  const getSizeClasses = () => {
    // If custom padding is provided, we skip the size's padding classes
    if (block.props.padding || block.props.paddingTop || block.props.paddingBottom) {
      return '';
    }
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-xs';
      case 'large':
        return 'px-8 py-3 text-lg';
      default: // medium
        return 'px-5 py-2.5 text-sm';
    }
  };

  // Determine the link destination
  const getHref = () => {
    const { linkType = 'url' } = block.props;

    if (linkType === 'email' && email) return `mailto:${email}`;
    if (linkType === 'phone' && phone) return `tel:${phone}`;
    if (linkType === 'url' && href) return href;

    // Fallback for legacy data where linkType might not be set
    if (!block.props.linkType) {
      if (href) return href;
      if (email) return `mailto:${email}`;
      if (phone) return `tel:${phone}`;
    }

    return undefined;
  };

  const linkUrl = getHref();
  const Component = linkUrl ? 'a' : 'button';

  // Override text color if provided
  const finalStyle: React.CSSProperties = {
    ...styleProps,
    color: (block.props.textColor || block.props.color) || undefined,
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className={`w-full ${block.props.textAlign === 'center' ? 'flex justify-center' : block.props.textAlign === 'right' ? 'flex justify-end' : ''}`}
    >
      <div className="w-full">
        <Component
          href={linkUrl}
          target={block.props.target || (linkUrl ? "_blank" : undefined)}
          rel={block.props.rel || (linkUrl ? "noopener noreferrer" : undefined)}
          className={`
            inline-flex items-center justify-center
            ${getVariantClasses()}
            ${getSizeClasses()}
          `}
          style={finalStyle}
          onClick={(e) => {
            if (isSelected) e.preventDefault(); // Prevent link navigation when selected
          }}
          onDoubleClick={handleDoubleClick}
        >
          <div className="flex items-center justify-center">
            {/* Icon Before */}
            {icon && iconPosition === 'before' && (
              <span style={{ marginRight: iconSpacing, fontSize: '1.2em', lineHeight: 1 }}>
                {getIcon(icon)}
              </span>
            )}

            <span
              ref={textRef}
              contentEditable={isEditing}
              suppressContentEditableWarning
              className="outline-none min-w-[20px] text-center"
              style={{ cursor: isEditing ? 'text' : 'inherit' }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            >
              {text}
            </span>
            {children}

            {/* Icon After */}
            {icon && iconPosition !== 'before' && (
              <span style={{ marginLeft: iconSpacing, fontSize: '1.2em', lineHeight: 1 }}>
                {getIcon(icon)}
              </span>
            )}
          </div>
        </Component>
      </div>
    </BaseBlock>
  );
};
