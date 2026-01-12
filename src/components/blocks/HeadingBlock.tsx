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
      case 'large':
        return { fontSize: '2.25rem', lineHeight: '2.5rem' };
      case 'xl':
        return { fontSize: '3rem', lineHeight: '1' };
      case 'xxl':
        return { fontSize: '3.75rem', lineHeight: '1' };
      case 'medium':
      case 'default':
      default:
        return { fontSize: '1.5rem', lineHeight: '2rem' };
    }
  };

  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <HeadingTag
        style={{
          margin: 0,
          padding: 0,
          ...getSizeStyles(),
          ...styleProps,
          color: styleProps.color || 'inherit'
        }}
        onClick={onSelect}
      >
        {text}
      </HeadingTag>
    </BaseBlock>
  );
};
