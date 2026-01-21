import React from 'react';
import { BaseBlock } from './BaseBlock';
import { HeadingBlock as HeadingBlockType } from '../../schema/types';

interface HeadingBlockProps {
  block: HeadingBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete
}) => {
  const {
    text: propText,
    title: propTitle,
    level: propLevel,
    htmlTag,
    ...styleProps
  } = block.props;

  const size = (styleProps as any).size; // Size prop from inspector

  const text = propText || propTitle || 'Your Heading Here';
  const level = propLevel || (htmlTag ? parseInt(htmlTag.replace('h', '')) : 2);

  // Determine font size based on size prop
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return { fontSize: '0.875rem', lineHeight: '1.25rem' };
      case 'medium':
        return { fontSize: '1.25rem', lineHeight: '1.75rem' };
      case 'large':
        return { fontSize: '2.25rem', lineHeight: '2.5rem' };
      case 'xl':
        return { fontSize: '3rem', lineHeight: '1' };
      case 'xxl':
        return { fontSize: '3.75rem', lineHeight: '1' };
      case 'default':
      default:
        // Default sizes based on heading level
        switch (level) {
          case 1: return { fontSize: '3rem', lineHeight: '1.1', fontWeight: '800' };
          case 2: return { fontSize: '2.25rem', lineHeight: '1.2', fontWeight: '700' };
          case 3: return { fontSize: '1.875rem', lineHeight: '1.3', fontWeight: '600' };
          case 4: return { fontSize: '1.5rem', lineHeight: '1.4', fontWeight: '600' };
          case 5: return { fontSize: '1.25rem', lineHeight: '1.5', fontWeight: '600' };
          case 6: return { fontSize: '1rem', lineHeight: '1.5', fontWeight: '600' };
          default: return { fontSize: '2.25rem', lineHeight: '1.2' };
        }
    }
  };



  const defaultStyles = getSizeStyles();

  // Ensure defaults are applied if styleProps has empty/falsy values for these properties
  // This prevents empty strings (from cleared inputs) from overriding the level-based defaults
  const finalStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    ...defaultStyles,
    ...styleProps,
    color: styleProps.color || 'inherit'
  };

  if (!styleProps.fontSize) finalStyle.fontSize = defaultStyles.fontSize;
  if (!styleProps.lineHeight) finalStyle.lineHeight = defaultStyles.lineHeight;
  if (!styleProps.fontWeight) finalStyle.fontWeight = defaultStyles.fontWeight;

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={finalStyle}
    >
      {text}
    </BaseBlock>
  );
};
