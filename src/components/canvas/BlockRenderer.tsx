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
//import { FlexBoxBlock } from '../blocks/FlexBoxBlock';

import { DividerBlock } from '../blocks/DividerBlock';
import { SpacerBlock } from '../blocks/SpacerBlock';
import { ContainerBlock } from '../blocks/ContainerBlock';
import { SocialFollowBlock } from '../blocks/SocialFollowBlock';
import { FormBlock } from '../blocks/FormBlock';
import { VideoBlock } from '../blocks/VideoBlock';
import { CodeBlock } from '../blocks/CodeBlock';
import { GroupBlock } from '../blocks/GroupBlock';
import { GridBlock } from '../blocks/GridBlock';
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
  parentType?: string;
  isPreviewMode?: boolean;
}

// SortableContext is needed for the children to be sortable relative to each other
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { DropZone } from './DropZone';

const NestedBlockRenderer: React.FC<NestedBlockRendererProps> = ({
  children,
  onSelect,
  onUpdate,
  onDelete,
  depth,
  parentId,
  parentType,
  isPreviewMode
}) => {
  // Always render at least one DropZone for empty containers
  if (!children || children.length === 0) {
    return <div className="py-2"><DropZone parentId={parentId} index={0} show={true} /></div>;
  }

  // Determine if parent is a Grid to handle layout specificities
  // We use parentType passed directly to avoid store lookup issues
  const isGrid = parentType === 'grid';

  // Use rectSortingStrategy to support both lists and grids
  const strategy = rectSortingStrategy;

  return (
    <SortableContext items={children.map(c => c.id)} strategy={strategy}>
      {/* 
        Grid blocks handle their own layout internally with GridCells,
        so we don't render drop zones here - they have cell-level drops instead
      */}
      <div className={isGrid ? "contents" : "flex flex-col w-full"}>
        {children.map((childBlock, index) => (
          <React.Fragment key={childBlock.id}>
            {!isGrid && <DropZone parentId={parentId} index={index} />}

            <BlockRenderer
              block={childBlock}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onDelete={onDelete}
              depth={depth + 1}
              parentId={parentId}
              isPreviewMode={isPreviewMode}
            />
          </React.Fragment>
        ))}
        {/* Final Drop Zone */}
        {!isGrid && <DropZone parentId={parentId} index={children.length} />}
      </div>
    </SortableContext>
  );
};

// Main Block Renderer Component (Memoized)
export const BlockRenderer: React.FC<BlockRendererProps> = React.memo(({
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

  // Memoize handlers to prevent re-renders of children
  const handleSelect = React.useCallback((e?: React.MouseEvent) => {
    if (!isPreviewMode) {
      if (onSelect) {
        onSelect(block.id);
        return;
      }
      const multi = e ? (e.shiftKey || e.ctrlKey || e.metaKey) : false;
      selectBlock(block.id, multi);
    }
  }, [block.id, isPreviewMode, onSelect, selectBlock]);

  // Use store actions directly if possible, or memoize the prop wrapper
  const handleUpdate = React.useCallback((updates: Partial<Block>) => {
    onUpdate?.(block.id, updates);
  }, [block.id, onUpdate]);

  const handleDelete = React.useCallback(() => {
    onDelete?.(block.id);
  }, [block.id, onDelete]);

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
          parentType={block.type}
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
    const propsWithChildren = { ...commonProps, children } as any;

    switch (block.type) {
      case 'section':
        return <SectionBlock {...propsWithChildren} block={block as any} />;
      case 'row':
        return <RowBlock {...propsWithChildren} block={block as any} />;
      case 'column':
        return <ColumnBlock {...propsWithChildren} block={block as any} />;
      // case 'flex':
      //   return <FlexBoxBlock {...propsWithChildren} block={block as any} />;

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
      case 'grid':
        return <GridBlock {...propsWithChildren} block={block as any} />;
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
        // Fallback for unknown blocks - try to render basic
        return <div className="p-4 border border-red-300 bg-red-50 text-red-500">Unknown Block Type: {block.type}</div>;
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
  // Custom comparison check to really avoid re-renders during drag if nothing changed
}, (prev, next) => {
  return (
    prev.block === next.block && // Reference check usually enough if store is immutable
    prev.isSelected === next.isSelected &&
    prev.depth === next.depth &&
    prev.isPreviewMode === next.isPreviewMode
  );
});

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

  // Get user z-index
  const userZIndex = (block.props as any)?.zIndex;

  // Combine styles
  const finalStyle: React.CSSProperties = {
    ...style, // Drag transform/transitions
    ...(userZIndex !== undefined && userZIndex !== '' ? { zIndex: userZIndex } : {}),
  };

  // Check if this is a divider block to exclude from hover outline styling
  const isDividerBlock = block.type === 'divider';

  return (
    <div
      ref={setNodeRef}
      style={finalStyle}
      {...attributes}
      {...listeners}
      className={`
        relative 
        ${isSelected && !userZIndex ? 'z-10' : ''}
        ${!isPreviewMode && !isDividerBlock ? 'hover:outline hover:outline-1 hover:outline-blue-400 cursor-move' : !isPreviewMode && isDividerBlock ? 'cursor-move' : ''} 
        ${isOver && !isDragging && !isPreviewMode && !isDividerBlock ? 'ring-2 ring-blue-500 bg-blue-50/20 z-20' : ''}
        transition-all duration-200
        group
        ${isDragging ? 'opacity-30' : ''}
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