import React, { useState } from 'react';
import { ElementorHeadingBlock as ElementorHeadingBlockType } from '../../../schema/types';

interface ElementorHeadingBlockProps {
  block: ElementorHeadingBlockType;
  isSelected?: boolean;
  onSelect?: (e?: React.MouseEvent) => void;
  onUpdate?: (updates: any) => void;
}

export const ElementorHeadingBlock: React.FC<ElementorHeadingBlockProps> = ({
  block,
  isSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const props = block.props as any;

  const {
    // Content
    title,
    link,
    linkTarget,
    linkNoFollow,
    htmlTag = 'h2',
    alignment,
    size, // 'small' | 'medium' ...

    // Style - Typography
    textColor, // User might use 'color' from TypographyGroup
    color,     // fallback or primary
    hoverTextColor,
    fontSize,
    fontWeight,
    textTransform,
    fontStyle,
    textDecoration,
    lineHeight,
    letterSpacing,
    wordSpacing,
    textShadow,
    // Blend Mode (Text) - using mixBlendMode to match inspector
    mixBlendMode,

    // Generic Styles (Container)
    // We explicitly map these to ensure they are applied
  } = props;

  const Tag = htmlTag as keyof JSX.IntrinsicElements;

  // Resolve Text Color
  const finalTextColor = isHovered && hoverTextColor
    ? hoverTextColor
    : (textColor || color); // prefer textColor if specific, else generic color

  // Container Style (Wrapper)
  const containerStyle: React.CSSProperties = {
    // Layout
    display: props.display,
    width: props.width,
    height: props.height,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    overflow: props.overflow,
    position: props.position as any,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
    zIndex: props.zIndex,

    // Spacing
    margin: props.margin,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    padding: props.padding,
    paddingTop: props.paddingTop,
    paddingRight: props.paddingRight,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,

    // Background
    backgroundColor: props.backgroundColor,
    backgroundImage: props.backgroundImage,
    backgroundSize: props.backgroundSize,
    backgroundPosition: props.backgroundPosition,
    backgroundRepeat: props.backgroundRepeat,
    // Gradient would require handling backgroundType='gradient' and constructing `background: linear-gradient(...)`
    // For now assuming existing logic or standard CSS.

    // Border
    border: props.border,
    borderWidth: props.borderWidth,
    borderStyle: props.borderStyle,
    borderColor: props.borderColor,
    borderRadius: props.borderRadius,
    borderTopWidth: props.borderTopWidth,
    borderRightWidth: props.borderRightWidth, // etc... simplified for brevity, if specific are present they override
    borderTopLeftRadius: props.borderTopLeftRadius,
    // We could map all, but React style supports camelCase keys.

    // Effects
    opacity: props.opacity,
    boxShadow: props.boxShadow,
    transform: props.transform,
    transition: props.transition,
    // Note: mixBlendMode is applied to the text element, not container

    // Elementor Specific
    textAlign: alignment,

    // CSS ID/Class are applied to className/id attributes, not style
  };

  // Specific Border Overrides if individual props exist (because 'border' shorthand might not cover them)
  if (props.borderTopWidth) containerStyle.borderTopWidth = props.borderTopWidth;
  if (props.borderRightWidth) containerStyle.borderRightWidth = props.borderRightWidth;
  if (props.borderBottomWidth) containerStyle.borderBottomWidth = props.borderBottomWidth;
  if (props.borderLeftWidth) containerStyle.borderLeftWidth = props.borderLeftWidth;

  if (props.borderTopLeftRadius) containerStyle.borderTopLeftRadius = props.borderTopLeftRadius;
  if (props.borderTopRightRadius) containerStyle.borderTopRightRadius = props.borderTopRightRadius;
  if (props.borderBottomLeftRadius) containerStyle.borderBottomLeftRadius = props.borderBottomLeftRadius;
  if (props.borderBottomRightRadius) containerStyle.borderBottomRightRadius = props.borderBottomRightRadius;


  // Title Style
  const titleStyle: React.CSSProperties = {
    color: finalTextColor,
    fontSize,
    fontWeight: fontWeight as any,
    textTransform: textTransform as any,
    fontStyle: fontStyle as any,
    textDecoration: textDecoration as any,
    lineHeight,
    letterSpacing,
    wordSpacing,
    textShadow,
    mixBlendMode: mixBlendMode as any, // Apply blend mode to text

    // Reset browser defaults
    margin: 0,
    padding: 0,
    width: '100%',

    // Transitions for hover
    transition: 'color 0.3s ease'
  };

  const linkAttributes = link ? {
    href: link,
    target: linkTarget,
    rel: linkNoFollow ? 'nofollow' : undefined
  } : {};

  // Overlay Style
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: props.backgroundOverlay, // Assuming simple color string for now
    opacity: props.backgroundOverlayOpacity || 1,
    mixBlendMode: props.backgroundOverlayBlendMode as any,
    pointerEvents: 'none',
    zIndex: 0
  };

  return (
    <div
      id={props.customID}
      className={`elementor-element elementor-widget elementor-widget-heading ${props.customClass || ''} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={containerStyle}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={props.titleAttribute}
      aria-label={props.ariaLabel}
    >
      {props.backgroundOverlay && (
        <div className="elementor-background-overlay" style={overlayStyle}></div>
      )}

      <div className="elementor-widget-container" style={{ position: 'relative', zIndex: 1 }}>
        {link ? (
          <a {...linkAttributes} style={{ textDecoration: 'none' }}>
            <Tag className={`elementor-heading-title elementor-size-${size || 'medium'}`} style={titleStyle}>
              {title}
            </Tag>
          </a>
        ) : (
          <Tag className={`elementor-heading-title elementor-size-${size || 'medium'}`} style={titleStyle}>
            {title}
          </Tag>
        )}
      </div>
    </div>
  );
};
