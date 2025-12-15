import React, { useRef } from 'react';
import { BaseBlock } from './BaseBlock';
import { ImageBoxBlock as ImageBoxBlockType } from '../../schema/types';

interface ImageBoxBlockProps {
  block: ImageBoxBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ImageBoxBlockType>) => void;
  onDelete: () => void;
}

export const ImageBoxBlock: React.FC<ImageBoxBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = React.useState(false);

  // Reset error when src changes
  React.useEffect(() => {
    setImageError(false);
  }, [block.props.src]);
  
  const { 
    src = 'https://via.placeholder.com/300x200',
    alt = 'Image Box',
    title = 'Image Title',
    description = 'Image description',
    width = '100%',
    height = 'auto',
    borderRadius = '4px',
    border = '1px solid #dee2e6',
    padding = '0',
    margin = '0',
    backgroundColor = '#ffffff',
    textAlign = 'center',
    showTitle = true,
    showDescription = true,
    overlay = false,
    overlayColor = 'rgba(0,0,0,0.5)',
    overlayOpacity = 0.5
  } = block.props;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        
        onUpdate({
          props: {
            ...block.props,
            src: imageUrl,
            alt: fileName || 'Uploaded image',
            title: fileName || 'Uploaded image'
          }
        });
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }
    
    event.target.value = '';
  };

  const handleImageClick = () => {
    if (isSelected && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full"
    >
      <div className="w-full">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
          disabled={!isSelected}
        />
        
        <div
          className={`relative overflow-hidden ${isSelected ? 'cursor-pointer' : ''}`}
          style={{
            width,
            height,
            backgroundColor,
            padding,
            margin,
            borderRadius,
            border,
            textAlign: textAlign as any
          }}
          onClick={handleImageClick}
        >
          {/* Image */}
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            onError={() => setImageError(true)}
          />

          {/* Error State */}
          {imageError && (
             <div className="absolute inset-0 z-20 bg-gray-100 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-red-300">
                <span className="text-3xl mb-2">⚠️</span>
                <p className="text-sm font-medium text-red-600 mb-1">Unable to load image</p>
                <p className="text-xs text-gray-500 break-all max-w-[200px]">{src}</p>
             </div>
          )}
          
          {/* Overlay - Hide if error */}
          {overlay && !imageError && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: overlayColor,
                opacity: overlayOpacity
              }}
            />
          )}
          
          {/* Title & Description - Hide if error */}
          {(showTitle || showDescription) && !imageError && (
            <div
              className="absolute bottom-0 left-0 right-0 p-4"
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white'
              }}
            >
              {showTitle && title && (
                <h3 className="m-0 mb-2 text-lg font-semibold">
                  {title}
                </h3>
              )}
              {showDescription && description && (
                <p className="m-0 text-sm opacity-90">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Upload indicator */}
          {isSelected && !src && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm text-gray-600">Click to upload image</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};