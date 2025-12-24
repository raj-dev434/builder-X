import React, { useRef } from 'react';
import { Block } from '../../schema/types';
import { getAnimationClass, getAnimationStyle } from '../../utils/animations';
import { useCanvasStore } from '../../store/canvasStore';

interface BaseBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate?: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseBlock: React.FC<BaseBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  children,
  className = '',
  style = {}
}) => {
  const blockRef = useRef<HTMLElement>(null);
  const { isPreviewMode, setHoveredBlockId } = useCanvasStore();



  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    e.stopPropagation();
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isPreviewMode) return;
    if (e.key === 'Delete' && isSelected) {
      if (styleProps.isLocked || styleProps.preventDelete) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      onDelete();
    }
  };



  // Get animation classes and styles
  const styleProps = block.props as any;
  const entranceAnimation = getAnimationClass(styleProps.animation, 'entrance');
  const exitAnimation = getAnimationClass(styleProps.exitAnimation, 'exit');
  const hoverAnimation = getAnimationClass(styleProps.hoverAnimation, 'hover');
  const animationStyle = getAnimationStyle(styleProps);

  // Responsive Styles Logic
  const { viewDevice } = useCanvasStore();

  // Properties that support responsive overrides
  const responsiveProperties = [
    'width', 'height', 'padding', 'margin', 'fontSize',
    'display', 'flexDirection', 'justifyContent', 'alignItems',
    'textAlign', 'position', 'top', 'bottom', 'left', 'right'
  ];

  const responsiveStyle: React.CSSProperties = {};

  // Global responsive defaults
  if (viewDevice === 'mobile' || viewDevice === 'tablet') {
    // Prevent any block from overflowing the viewport width on small screens
    responsiveStyle.maxWidth = '100%';
    responsiveStyle.boxSizing = 'border-box';
  }

  if (viewDevice !== 'desktop') {
    responsiveProperties.forEach(prop => {
      // Check for specific override e.g. padding_mobile
      const overrideKey = `${prop}_${viewDevice}`;
      if (styleProps[overrideKey] !== undefined && styleProps[overrideKey] !== '') {
        (responsiveStyle as any)[prop] = styleProps[overrideKey];
      }
    });
  }

  // Extract CSS properties from block.props
  const cssProperties: React.CSSProperties = {};

  // Dimensions
  if (styleProps.widthType === 'full') {
    cssProperties.width = '100%';
  } else if (styleProps.width) {
    cssProperties.width = styleProps.width;
  }

  if (styleProps.maxWidth) cssProperties.maxWidth = styleProps.maxWidth;
  if (styleProps.minWidth) cssProperties.minWidth = styleProps.minWidth;
  if (styleProps.height) cssProperties.height = styleProps.height;
  if (styleProps.maxHeight) cssProperties.maxHeight = styleProps.maxHeight;
  if (styleProps.minHeight) cssProperties.minHeight = styleProps.minHeight;

  // Positioning
  if (styleProps.position) cssProperties.position = styleProps.position as any;
  if (styleProps.top) cssProperties.top = styleProps.top;
  if (styleProps.right) cssProperties.right = styleProps.right;
  if (styleProps.bottom) cssProperties.bottom = styleProps.bottom;
  if (styleProps.left) cssProperties.left = styleProps.left;
  if (styleProps.zIndex) cssProperties.zIndex = styleProps.zIndex;

  // Spacing - Padding
  if (styleProps.padding) cssProperties.padding = styleProps.padding;
  if (styleProps.paddingTop) cssProperties.paddingTop = styleProps.paddingTop;
  if (styleProps.paddingRight) cssProperties.paddingRight = styleProps.paddingRight;
  if (styleProps.paddingBottom) cssProperties.paddingBottom = styleProps.paddingBottom;
  if (styleProps.paddingLeft) cssProperties.paddingLeft = styleProps.paddingLeft;

  // Spacing - Margin
  if (styleProps.margin) cssProperties.margin = styleProps.margin;
  if (styleProps.marginTop) cssProperties.marginTop = styleProps.marginTop;
  if (styleProps.marginRight) cssProperties.marginRight = styleProps.marginRight;
  if (styleProps.marginBottom) cssProperties.marginBottom = styleProps.marginBottom;
  if (styleProps.marginLeft) cssProperties.marginLeft = styleProps.marginLeft;

  // Border
  if (styleProps.border) cssProperties.border = styleProps.border;
  if (styleProps.borderWidth) cssProperties.borderWidth = styleProps.borderWidth;
  if (styleProps.borderTopWidth) cssProperties.borderTopWidth = styleProps.borderTopWidth;
  if (styleProps.borderRightWidth) cssProperties.borderRightWidth = styleProps.borderRightWidth;
  if (styleProps.borderBottomWidth) cssProperties.borderBottomWidth = styleProps.borderBottomWidth;
  if (styleProps.borderLeftWidth) cssProperties.borderLeftWidth = styleProps.borderLeftWidth;
  if (styleProps.borderStyle) cssProperties.borderStyle = styleProps.borderStyle as any;
  if (styleProps.borderColor) cssProperties.borderColor = styleProps.borderColor;
  if (styleProps.borderRadius) cssProperties.borderRadius = styleProps.borderRadius;
  if (styleProps.borderTopLeftRadius) cssProperties.borderTopLeftRadius = styleProps.borderTopLeftRadius;
  if (styleProps.borderTopRightRadius) cssProperties.borderTopRightRadius = styleProps.borderTopRightRadius;
  if (styleProps.borderBottomLeftRadius) cssProperties.borderBottomLeftRadius = styleProps.borderBottomLeftRadius;
  if (styleProps.borderBottomRightRadius) cssProperties.borderBottomRightRadius = styleProps.borderBottomRightRadius;

  // Display & Layout
  if (styleProps.display) cssProperties.display = styleProps.display as any;
  if (styleProps.overflow) cssProperties.overflow = styleProps.overflow as any;
  if (styleProps.opacity) cssProperties.opacity = styleProps.opacity;

  // Typography (from StyleEditor)
  if (styleProps.fontFamily) cssProperties.fontFamily = styleProps.fontFamily;
  if (styleProps.fontSize) cssProperties.fontSize = styleProps.fontSize;
  if (styleProps.fontWeight) cssProperties.fontWeight = styleProps.fontWeight;
  if (styleProps.lineHeight) cssProperties.lineHeight = styleProps.lineHeight;
  if (styleProps.letterSpacing) cssProperties.letterSpacing = styleProps.letterSpacing;
  if (styleProps.textAlign) cssProperties.textAlign = styleProps.textAlign as any;
  if (styleProps.color || styleProps.textColor) cssProperties.color = styleProps.color || styleProps.textColor;
  if (styleProps.textTransform) cssProperties.textTransform = styleProps.textTransform as any;
  if (styleProps.textDecoration) cssProperties.textDecoration = styleProps.textDecoration as any;
  if (styleProps.fontStyle) cssProperties.fontStyle = styleProps.fontStyle as any;
  if (styleProps.textShadow) cssProperties.textShadow = styleProps.textShadow;
  if (styleProps.isolation) cssProperties.isolation = styleProps.isolation as any;

  // Background - Handle both solid and gradient
  if (styleProps.backgroundType === 'gradient') {
    // Generate gradient CSS
    const color1 = styleProps.gradientColor1 || '#667eea';
    const color2 = styleProps.gradientColor2 || '#764ba2';
    const angle = styleProps.gradientAngle || 90;
    const gradientType = styleProps.gradientType || 'linear';

    if (gradientType === 'linear') {
      cssProperties.backgroundImage = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
    } else {
      cssProperties.backgroundImage = `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`;
    }
  } else {
    // Solid background color
    if (styleProps.backgroundColor) cssProperties.backgroundColor = styleProps.backgroundColor;
  }

  // Additional background properties
  if (styleProps.backgroundImage && styleProps.backgroundType !== 'gradient') {
    cssProperties.backgroundImage = styleProps.backgroundImage;
  }
  if (styleProps.backgroundSize) cssProperties.backgroundSize = styleProps.backgroundSize;
  if (styleProps.backgroundPosition) cssProperties.backgroundPosition = styleProps.backgroundPosition;

  // Effects
  if (styleProps.boxShadow) cssProperties.boxShadow = styleProps.boxShadow;

  // --- NEW MASTER CSS PROPERTIES ---

  // Box Sizing
  if (styleProps.boxSizing) cssProperties.boxSizing = styleProps.boxSizing as any;

  // Flexbox Item
  if (styleProps.flexGrow !== undefined) cssProperties.flexGrow = styleProps.flexGrow;
  if (styleProps.flexShrink !== undefined) cssProperties.flexShrink = styleProps.flexShrink;
  if (styleProps.flexBasis) cssProperties.flexBasis = styleProps.flexBasis;
  if (styleProps.order !== undefined) cssProperties.order = styleProps.order;
  if (styleProps.alignSelf) cssProperties.alignSelf = styleProps.alignSelf as any;
  if (styleProps.justifySelf) cssProperties.justifySelf = styleProps.justifySelf as any;
  if (styleProps.placeSelf) cssProperties.placeSelf = styleProps.placeSelf as any;

  // Outline
  if (styleProps.outlineStyle) cssProperties.outlineStyle = styleProps.outlineStyle as any;
  if (styleProps.outlineWidth) cssProperties.outlineWidth = styleProps.outlineWidth;
  if (styleProps.outlineColor) cssProperties.outlineColor = styleProps.outlineColor;
  if (styleProps.outlineOffset) cssProperties.outlineOffset = styleProps.outlineOffset;

  // Filters
  if (styleProps.filter) cssProperties.filter = styleProps.filter;
  if (styleProps.backdropFilter) cssProperties.backdropFilter = styleProps.backdropFilter;
  if (styleProps.mixBlendMode) cssProperties.mixBlendMode = styleProps.mixBlendMode as any;

  // Interaction
  if (styleProps.cursor) cssProperties.cursor = styleProps.cursor as any;
  if (styleProps.pointerEvents) cssProperties.pointerEvents = styleProps.pointerEvents as any;
  if (styleProps.userSelect) cssProperties.userSelect = styleProps.userSelect as any;

  // Transform
  if (styleProps.transform) cssProperties.transform = styleProps.transform;
  if (styleProps.transformOrigin) cssProperties.transformOrigin = styleProps.transformOrigin;

  // Transition
  if (styleProps.transitionProperty) cssProperties.transitionProperty = styleProps.transitionProperty;
  if (styleProps.transitionDuration) cssProperties.transitionDuration = styleProps.transitionDuration;
  if (styleProps.transitionTimingFunction) cssProperties.transitionTimingFunction = styleProps.transitionTimingFunction;
  if (styleProps.transitionDelay) cssProperties.transitionDelay = styleProps.transitionDelay;

  const combinedStyle = {
    ...style,
    ...cssProperties,
    ...animationStyle,
    ...responsiveStyle
  };

  /* 
     Handle Custom CSS 
     We wrap it in a logic to replace 'selector' with the unique class if we wanted, 
     but for now we just inject it. 
     To prevent global pollution, users should be careful, or we could scope it.
  */
  const customCSS = styleProps.customCSS;

  // --- HOVER STATE IMPLEMENTATION ---
  // Generate a unique class for this block to scope hover styles
  const uniqueClass = `builder-block-${block.id}`;

  let hoverCSS = '';
  // Check if any hover properties are set
  if (styleProps.hover_scale || styleProps.hover_translateY || styleProps.hover_opacity !== undefined || styleProps.hover_backgroundColor || styleProps.hover_color) {
    const transformParts = [];
    // Combine existing transform with hover transform if needed, but for now we basically override or append
    // If we want to support existing transform + hover, we'd need more complex logic. 
    // Simplified: We assume hover transform replaces or appends to base. 
    // For best UX in this simple builder, let's just use the hover values as the target state.

    if (styleProps.hover_scale) transformParts.push(`scale(${styleProps.hover_scale})`);
    if (styleProps.hover_translateY) transformParts.push(`translateY(${styleProps.hover_translateY})`);

    // Note: We use !important to ensure these override inline styles when hovering
    const transformRule = transformParts.length > 0 ? `transform: ${transformParts.join(' ')} !important;` : '';
    const opacityRule = styleProps.hover_opacity !== undefined ? `opacity: ${styleProps.hover_opacity} !important;` : '';
    const bgRule = styleProps.hover_backgroundColor ? `background-color: ${styleProps.hover_backgroundColor} !important;` : '';
    const colorRule = styleProps.hover_color ? `color: ${styleProps.hover_color} !important;` : '';

    hoverCSS = `
        .${uniqueClass}:hover {
            ${transformRule}
            ${opacityRule}
            ${bgRule}
            ${colorRule}
            z-index: 50; /* Slight lift in z-index to ensure visibility */
        }
      `;
  }

  const combinedClassName = `
    relative
    ${uniqueClass}
    ${entranceAnimation}
    ${exitAnimation}
    ${hoverAnimation}
    ${className}
    ${styleProps.customClass || ''}
    ${styleProps.isLocked ? 'locked-block' : ''}
  `.trim();

  // Tag
  const Tag = (styleProps.htmlTag || styleProps.tag || 'div') as React.ElementType;

  return (
    <>
      {(customCSS || hoverCSS) && (
        <style>
          {customCSS || ''}
          {hoverCSS}
        </style>
      )}
      <Tag
        ref={blockRef}
        id={styleProps.customId || styleProps.customID || block.id}
        data-block-type={block.type}
        data-locked={styleProps.isLocked}
        className={combinedClassName}
        style={combinedStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (!isPreviewMode) setHoveredBlockId(block.id);
        }}
        onMouseLeave={() => {
          if (!isPreviewMode) setHoveredBlockId(null);
        }}
        tabIndex={isPreviewMode ? -1 : 0}
      >
        {/* Block content */}
        {children}
      </Tag>
    </>
  );
};
