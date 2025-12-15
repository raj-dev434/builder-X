// BlockRenderer.tsx - Add this component inside the same file
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Block } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

import { TextBlock } from '../blocks/TextBlock';
import { ImageBlock } from '../blocks/ImageBlock';
import { ButtonBlock } from '../blocks/ButtonBlock';
import { SectionBlock } from '../blocks/SectionBlock';
import { RowBlock } from '../blocks/RowBlock';
import { ColumnBlock } from '../blocks/ColumnBlock';

import { DividerBlock } from '../blocks/DividerBlock';
import { SpacerBlock } from '../blocks/SpacerBlock';
import { ContainerBlock } from '../blocks/ContainerBlock';
import { SocialFollowBlock } from '../blocks/SocialFollowBlock';
import { FormBlock } from '../blocks/FormBlock';
import { VideoBlock } from '../blocks/VideoBlock';
import { CodeBlock } from '../blocks/CodeBlock';
import { GroupBlock } from '../blocks/GroupBlock';
import { SurveyBlock } from '../blocks/SurveyBlock';
import { CountdownTimerBlock } from '../blocks/CountdownTimerBlock';
import { ProgressBarBlock } from '../blocks/ProgressBarBlock';
import { ProductBlock } from '../blocks/ProductBlock';
import { PromoCodeBlock } from '../blocks/PromoCodeBlock';
import { PriceBlock } from '../blocks/PriceBlock';
import { TestimonialBlock } from '../blocks/TestimonialBlock';
import { HeadingBlock } from '../blocks/HeadingBlock';
import { LinkBlock } from '../blocks/LinkBlock';
import { InputBlock } from '../blocks/InputBlock';
import { CardBlock } from '../blocks/CardBlock';
import { BadgeBlock } from '../blocks/BadgeBlock';
import { AlertBlock } from '../blocks/AlertBlock';
import { ProgressBlock } from '../blocks/ProgressBlock';
import { MapBlock } from '../blocks/MapBlock';
import { IconBlock } from '../blocks/IconBlock';
import { TextareaBlock } from '../blocks/TextareaBlock';
import { SelectBlock } from '../blocks/SelectBlock';
import { CheckboxBlock } from '../blocks/CheckboxBlock';
import { RadioBlock } from '../blocks/RadioBlock';
import { LabelBlock } from '../blocks/LabelBlock';
import { LinkBoxBlock } from '../blocks/LinkBoxBlock';
import { ImageBoxBlock } from '../blocks/ImageBoxBlock';
import { NavbarBlock } from '../blocks/NavbarBlock';
import { InvoiceBlock } from '../blocks/InvoiceBlock';


interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Block>) => void;
  onDelete?: (id: string) => void;
  depth?: number;
  parentId?: string | null;
  isPreviewMode?: boolean;
}

// ADD THIS COMPONENT - Nested Block Renderer
interface NestedBlockRendererProps {
  children: Block[];
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Block>) => void;
  onDelete?: (id: string) => void;
  depth: number;
  parentId: string | null;
  isPreviewMode?: boolean;
}

// SortableContext is needed for the children to be sortable relative to each other
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const NestedBlockRenderer: React.FC<NestedBlockRendererProps> = ({
  children,
  onSelect,
  onUpdate,
  onDelete,
  depth,
  parentId,
  isPreviewMode
}) => {
  if (!children || children.length === 0) return null;

  // We need to determine if this is a horizontal (Row) or vertical (Column/Section) list
  // Ideally, we'd check the parent's type, but for now, we'll assume vertical unless it's a row.
  // Actually, getting the parent block instance to check its type would be better.
  // For now, let's use verticalListSortingStrategy as a default safe bet for DndKit 
  // or checks passing parent block type into props. 

  const strategy = verticalListSortingStrategy;

  return (
    <SortableContext items={children.map(c => c.id)} strategy={strategy}>
      {children.map((childBlock) => (
        <BlockRenderer
          key={childBlock.id}
          block={childBlock}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          depth={depth + 1}
          parentId={parentId}
          isPreviewMode={isPreviewMode}
        />
      ))}
    </SortableContext>
  );
};

// Main Block Renderer Component
export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  onSelect,
  onUpdate,
  onDelete,
  depth = 0,
  parentId = null,
  isPreviewMode = false
}) => {
  const selectedBlockIds = useCanvasStore((state) => state.selectedBlockIds);
  const selectBlock = useCanvasStore((state) => state.selectBlock);
  const isBlockSelected = selectedBlockIds.includes(block.id);

  const handleSelect = (e?: React.MouseEvent) => {
    if (!isPreviewMode) {
      // If props onSelect is provided (legacy), call it
      if (onSelect) {
        onSelect(block.id);
        return;
      }

      // Otherwise use store directly
      const multi = e ? (e.shiftKey || e.ctrlKey || e.metaKey) : false;
      selectBlock(block.id, multi);
    }
  };

  const handleUpdate = (updates: Partial<Block>) => {
    onUpdate?.(block.id, updates);
  };

  const handleDelete = () => {
    onDelete?.(block.id);
  };

  const commonProps = {
    block,
    isSelected: isBlockSelected,
    onSelect: handleSelect,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    depth
  };

  // Render children if this block has them
  const renderChildren = () => {
    if (block.children && block.children.length > 0) {
      return (
        <NestedBlockRenderer
          children={block.children}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          depth={depth}
          parentId={block.id}
          isPreviewMode={isPreviewMode}
        />
      );
    }
    return null;
  };

  // Render the specific block component
  const renderBlockComponent = () => {
    const children = renderChildren();

    // Cast strict props to any to allow passing 'children' deeply without typing errors in build
    // This assumes specific blocks will update their interfaces to accept children
    const propsWithChildren = { ...commonProps, children } as any;

    switch (block.type) {
      case 'section':
        return <SectionBlock {...propsWithChildren} block={block as any} />;
      case 'row':
        return <RowBlock {...propsWithChildren} block={block as any} />;
      case 'column':
        return <ColumnBlock {...propsWithChildren} block={block as any} />;

      case 'text':
        return <TextBlock {...propsWithChildren} block={block as any} />;
      case 'image':
        return <ImageBlock {...propsWithChildren} block={block as any} />;
      case 'button':
        return <ButtonBlock {...propsWithChildren} block={block as any} />;
      case 'divider':
        return <DividerBlock {...propsWithChildren} block={block as any} />;
      case 'spacer':
        return <SpacerBlock {...propsWithChildren} block={block as any} />;
      case 'container':
        return <ContainerBlock {...propsWithChildren} block={block as any} />;
      case 'social-follow':
        return <SocialFollowBlock {...propsWithChildren} block={block as any} />;
      case 'form':
        return <FormBlock {...propsWithChildren} block={block as any} />;
      case 'video':
        return <VideoBlock {...propsWithChildren} block={block as any} />;
      case 'code':
        return <CodeBlock {...propsWithChildren} block={block as any} />;
      case 'group':
        return <GroupBlock {...propsWithChildren} block={block as any} />;
      case 'survey':
        return <SurveyBlock {...propsWithChildren} block={block as any} />;
      case 'countdown-timer':
        return <CountdownTimerBlock {...propsWithChildren} block={block as any} />;
      case 'progress-bar':
        return <ProgressBarBlock {...propsWithChildren} block={block as any} />;
      case 'product':
        return <ProductBlock {...propsWithChildren} block={block as any} />;
      case 'promo-code':
        return <PromoCodeBlock {...propsWithChildren} block={block as any} />;
      case 'price':
        return <PriceBlock {...propsWithChildren} block={block as any} />;
      case 'testimonial':
        return <TestimonialBlock {...propsWithChildren} block={block as any} />;
      case 'heading':
        return <HeadingBlock {...propsWithChildren} block={block as any} />;
      case 'link':
        return <LinkBlock {...propsWithChildren} block={block as any} />;
      case 'input':
        return <InputBlock {...propsWithChildren} block={block as any} />;
      case 'card':
        return <CardBlock {...propsWithChildren} block={block as any} />;
      case 'badge':
        return <BadgeBlock {...propsWithChildren} block={block as any} />;
      case 'alert':
        return <AlertBlock {...propsWithChildren} block={block as any} />;
      case 'progress':
        return <ProgressBlock {...propsWithChildren} block={block as any} />;
      case 'map':
        return <MapBlock {...propsWithChildren} block={block as any} />;
      case 'icon':
        return <IconBlock {...propsWithChildren} block={block as any} />;
      case 'textarea':
        return <TextareaBlock {...propsWithChildren} block={block as any} />;
      case 'select':
        return <SelectBlock {...propsWithChildren} block={block as any} />;
      case 'checkbox':
        return <CheckboxBlock {...propsWithChildren} block={block as any} />;
      case 'radio':
        return <RadioBlock {...propsWithChildren} block={block as any} />;
      case 'label':
        return <LabelBlock {...propsWithChildren} block={block as any} />;
      case 'link-box':
        return <LinkBoxBlock {...propsWithChildren} block={block as any} />;
      case 'image-box':
        return <ImageBoxBlock {...propsWithChildren} block={block as any} />;
      case 'navbar':
        return <NavbarBlock {...propsWithChildren} block={block as any} />;
      case 'invoice':
        return <InvoiceBlock {...propsWithChildren} block={block as any} />;
      default:
        return <div className="p-4 border border-red-300 bg-red-50">
          Unknown block type: {(block as any).type}
        </div>;
    }
  };

  return (
    <SortableBlockWrapper
      block={block}
      isSelected={!isPreviewMode && isBlockSelected}
      depth={depth}
      parentId={parentId}
      isPreviewMode={isPreviewMode}
    >
      {renderBlockComponent()}
    </SortableBlockWrapper>
  );
};

// SortableWrapper Component
const SortableBlockWrapper: React.FC<{
  block: Block;
  children: React.ReactNode;
  isSelected?: boolean;
  depth?: number;
  parentId?: string | null;
  isPreviewMode?: boolean;
}> = ({ block, children, isSelected, depth = 0, parentId, isPreviewMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.id,
    disabled: isPreviewMode,
    data: {
      type: 'block',
      block,
      depth,
      parentId
    }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: block.id,
    disabled: isPreviewMode,
    data: {
      type: block.type, // Pass specific type so we can filter if needed
      blockId: block.id,
      parentId
    }
  });

  // Compose refs
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    transition,
    opacity: isDragging ? 0.5 : 1,
  } : { transition };

  // Calculate left margin based on depth
  const leftMargin = depth > 0 ? depth * 16 : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative 
        ${isSelected ? 'z-10' : ''}
        ${!isPreviewMode ? 'hover:shadow-md cursor-move' : ''} 
        ${isOver && !isDragging && !isPreviewMode ? 'ring-2 ring-green-400 ring-offset-2 bg-green-50/10' : ''}
        transition-all duration-200
        group
        ${isDragging ? 'z-50' : ''}
      `}
    >
      {/* BLOCK CONTENT */}
      <div
        className="block-content pointer-events-auto"
        style={{ marginLeft: `${leftMargin}px` }}
      >
        {children}
      </div>
    </div>
  );
};