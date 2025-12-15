import React from 'react';
import { BaseBlock } from './BaseBlock';
import { HeadingBlock as HeadingBlockType } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

interface HeadingBlockProps {
  block: HeadingBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<HeadingBlockType>) => void;
  onDelete: () => void;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const isPreviewMode = useCanvasStore((state) => state.isPreviewMode);
  const { text = 'Your Heading Here', level = 2, ...styleProps } = block.props;

  const [isEditing, setIsEditing] = React.useState(false);
  const textRef = React.useRef<HTMLElement>(null);

  const handleTextChange = (newText: string) => {
    onUpdate({ props: { ...block.props, text: newText } });
  };

  const handleDoubleClick = () => {
    if (isSelected && !isPreviewMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsEditing(false);
    handleTextChange(e.currentTarget.textContent || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  React.useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

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
        ref={textRef as any}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        style={{
          margin: 0,
          padding: 0,
          outline: 'none',
          cursor: isEditing ? 'text' : 'default',
          ...styleProps
        }}
      >
        {text}
      </HeadingTag>
    </BaseBlock>
  );
};
