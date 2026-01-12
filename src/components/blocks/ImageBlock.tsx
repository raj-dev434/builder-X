import React, { useState } from 'react';
import { ImageBlock as ImageBlockType } from '../../schema/types';
import { BaseBlock } from './BaseBlock';
import { useAssetStore } from '../../store/assetStore';
import { useCanvasStore } from '../../store/canvasStore';

interface ImageBlockProps {
  block: ImageBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ImageBlockType>) => void;
  onDelete: () => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const openAssetModal = useAssetStore((state) => state.openModal);
  const { isPreviewMode } = useCanvasStore();

  // Reset uploading state when src changes (e.g. from inspector or new upload)
  React.useEffect(() => {
    if (block.props.src) {
      setIsUploading(false);
    }
  }, [block.props.src]);

  // Destructure props with defaults
  const {
    src = '',
    alt = 'Image',
    objectFit = 'cover',
    borderRadius = '0px',
    aspectRatio,
    objectPosition = 'center',
    linkUrl,
    title,
  } = block.props;

  // Convert size values
  const getSizeValue = (value: string | undefined) => {
    if (!value || value === 'auto') return 'auto';
    if (value.includes('%') || value.includes('px') ||
      value.includes('rem') || value.includes('em')) return value;
    return `${value}px`;
  };

  const internalImageStyle: React.CSSProperties = {
    objectFit: objectFit as any,
    objectPosition: objectPosition,
    aspectRatio: aspectRatio,
    width: '100%',
    height: '100%',
    display: 'block',
  };

  const handleImageClick = () => {
    if (isSelected) {
      // Instead of clicking file input, open library
      openAssetModal((url) => onUpdate({ props: { ...block.props, src: url } }));
    }
  };

  // Removed processFile and handleFileUpload functions as they are no longer needed for direct uploads


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isSelected) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (isSelected) {
      // Direct drag and drop support dropped in favor of Asset Manager for now, 
      // or we could hook it up to uploading to asset manager.
      // For now, let's just ignore it or prompt to use library.
      alert("Please upload images via the Asset Manager");
    }
  };

  // Improved placeholder when no image
  const renderPlaceholder = () => (
    <div className={`
      w-full h-full min-h-[200px] bg-gray-50 border-2 border-dashed 
      flex flex-col items-center justify-center p-6 text-center transition-colors
      ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
    `}>
      <div className="text-4xl mb-4 opacity-50">🖼️</div>
      <p className="text-gray-600 font-medium mb-2">
        {isDraggingOver ? 'Drop image here' : 'Select or drop an image'}
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm font-medium hover:bg-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          openAssetModal((url) => onUpdate({ props: { ...block.props, src: url } }));
        }}
      >
        Select from Library
      </button>
      {uploadError && (
        <p className="mt-2 text-red-500 text-xs bg-red-50 px-2 py-1 rounded">
          {uploadError}
        </p>
      )}
    </div>
  );

  // Get alignSelf from props to determine alignment behavior
  const alignSelf = block.props.alignSelf;

  // Calculate alignment styles using margin for better compatibility
  // Works regardless of whether parent is flex, grid, or block
  const getAlignmentStyles = (): React.CSSProperties => {
    const align = alignSelf;

    const styles: React.CSSProperties = {
      width: block.props.width || 'auto',
      maxWidth: block.props.maxWidth || '100%',
      height: block.props.height || 'auto',
      display: 'block',
      // Use margin-based alignment (works in any layout context)
      marginLeft: align === 'center' ? 'auto' : align === 'flex-end' ? 'auto' : '0',
      marginRight: align === 'center' ? 'auto' : align === 'flex-start' ? 'auto' : '0',
    };

    return styles;
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className=""
    >
      <div
        className="relative"
        style={getAlignmentStyles()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Hidden file input */}


        {/* Main Content */}
        <div
          className={`relative ${isSelected ? 'cursor-pointer' : ''}`}
          onClick={handleImageClick}
          style={{
            borderRadius: getSizeValue(borderRadius),
            overflow: 'hidden',
          }}
        >
          {/* State: Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 z-20 bg-white/80 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm font-medium text-blue-600">Uploading...</p>
              </div>
            </div>
          )}

          {/* State: Empty or Error */}
          {!src ? (
            renderPlaceholder()
          ) : (
            <div className="relative group">
              {/* Drag Overlay Effect */}
              {isDraggingOver && (
                <div className="absolute inset-0 z-10 bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-white font-bold backdrop-blur-[2px]">
                  Drop to replace
                </div>
              )}

              {/* Actual Image (Wrapped in Link if exists) */}
              {linkUrl ? (
                <a
                  href={linkUrl}
                  target={block.props.target || "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isPreviewMode) e.preventDefault();
                  }}
                  className="block w-full h-full"
                >
                  <img
                    src={src}
                    alt={alt}
                    title={title}
                    style={internalImageStyle}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      setUploadError('Failed to load image');
                    }}
                  />
                </a>
              ) : (
                <img
                  src={src}
                  alt={alt}
                  title={title}
                  style={internalImageStyle}
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                    setUploadError('Failed to load image');
                  }}
                />
              )}

              {uploadError && src && !isUploading && (
                <div className="absolute inset-0 z-10 bg-gray-100 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
                  <span className="text-2xl mb-2">⚠️</span>
                  <span className="text-sm font-medium text-red-500">{uploadError || 'Unable to load image'}</span>
                </div>
              )}

              {/* Hover Actions (when selected) */}
              {isSelected && !isDraggingOver && !isUploading && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded backdrop-blur-sm z-20">
                  <button
                    className="text-white text-xs px-2 py-1 hover:bg-white/20 rounded ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAssetModal((url) => onUpdate({ props: { ...block.props, src: url } }));
                    }}
                  >
                    Change Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};