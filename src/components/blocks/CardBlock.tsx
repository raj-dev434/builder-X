import React from 'react';
import { BaseBlock } from './BaseBlock';
import { CardBlock as CardBlockType } from '../../schema/types';

interface CardBlockProps {
  block: CardBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<CardBlockType>) => void;
  onDelete: () => void;
}

export const CardBlock: React.FC<CardBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const { 
    title = 'Card Title',
    content = 'This is the card content. You can add any text or HTML here.',
    image,
    imageAlt = 'Card image',
    showImage = true,
    showTitle = true,
    showContent = true,
    imagePosition = 'top',
    textAlign = 'left',
    ...styleProps 
  } = block.props;

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ props: { ...block.props, title: newTitle } });
  };

  const handleContentChange = (newContent: string) => {
    onUpdate({ props: { ...block.props, content: newContent } });
  };

  const renderImage = () => {
    if (!showImage || !image) return null;
    
    return (
      <img
        src={image}
        alt={imageAlt}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '4px 4px 0 0',
          objectFit: 'cover'
        }}
      />
    );
  };

  const renderContent = () => (
    <div style={{ padding: '1rem' }}>
      {showTitle && (
        <h3
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
          style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            outline: 'none'
          }}
        >
          {title}
        </h3>
      )}
      {showContent && (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleContentChange(e.currentTarget.textContent || '')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
          style={{
            lineHeight: '1.5',
            outline: 'none'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={{
        textAlign,
        ...styleProps
      }}
    >
      <div
        style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          // Background handled by BaseBlock styleProps
        }}
      >
        {imagePosition === 'top' && renderImage()}
        {renderContent()}
        {imagePosition === 'bottom' && renderImage()}
      </div>
    </BaseBlock>
  );
};
