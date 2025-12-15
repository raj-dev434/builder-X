import React, { useRef } from 'react';
import { BaseBlock } from './BaseBlock';
import { VideoBlock as VideoBlockType } from '../../schema/types';

interface VideoBlockProps {
  block: VideoBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<VideoBlockType>) => void;
  onDelete: () => void;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    src = '',
    poster = '',
    title = 'Video Title',
    description = 'Video description',
    width = '100%',
    height = 'auto',
    autoplay = false,
    muted = false,
    loop = false,
    controls = true,
    borderRadius = '8px',
    backgroundColor = 'transparent',
    padding = '0',
    margin = '0',
    textAlign = 'center',
    showTitle = true,
    showDescription = true
  } = block.props;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a video file (MP4, WebM, etc.)');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const videoUrl = e.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, "");

        onUpdate({
          props: {
            ...block.props,
            src: videoUrl,
            title: fileName || 'Uploaded video'
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

  const handleVideoClick = () => {
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
          accept="video/*"
          className="hidden"
          disabled={!isSelected}
        />

        <div
          className="relative"
          style={{
            backgroundColor,
            padding,
            margin,
            textAlign: textAlign as any,
            width: '100%',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {/* Title */}
          {showTitle && title && (
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              {title}
            </h3>
          )}

          {/* Video Container */}
          <div
            className={`relative overflow-hidden ${isSelected ? 'cursor-pointer' : ''}`}
            style={{
              width,
              height,
              borderRadius,
              backgroundColor: '#f8f9fa'
            }}
            onClick={handleVideoClick}
          >
            {src ? (
              (src.includes('youtube.com') || src.includes('youtu.be')) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={src.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/').split('&')[0]}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    borderRadius,
                    aspectRatio: '16/9'
                  }}
                />
              ) : (
                <video
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius
                  }}
                  poster={poster}
                  controls={controls}
                  autoPlay={autoplay}
                  muted={muted}
                  loop={loop}
                  preload="metadata"
                  aria-label={title}
                >
                  <source src={src} type="video/mp4" />
                  <source src={src} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-4xl mb-3">🎥</div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {isSelected ? 'Click to upload video' : 'No video'}
                  </p>
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Upload Video
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Upload indicator */}
            {isSelected && !src && (
              <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Upload
              </div>
            )}
          </div>

          {/* Description */}
          {showDescription && description && (
            <p className="mt-3 text-sm text-gray-600">
              {description}
            </p>
          )}

          {/* Video info when selected */}
          {isSelected && src && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <div className="flex justify-between">
                <span>🎥 {src.startsWith('data:') ? 'Local video' : 'External video'}</span>
                <span>{controls ? 'With controls' : 'Autoplay'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};