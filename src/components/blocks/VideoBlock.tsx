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
    title = '',
    description = '',
    autoplay = false,
    muted = false,
    loop = false,
    controls = true,
    showTitle = false,
    showDescription = false
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
        onUpdate({
          props: {
            ...block.props,
            src: videoUrl,
            title: file.name.replace(/\.[^/.]+$/, "")
          }
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
    }
    event.target.value = '';
  };

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

  // Simple aspect ratio parser
  const getAspectRatioStyle = () => {
    const ratio = block.props.aspectRatio || '16/9';
    return { aspectRatio: ratio };
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full h-full"
    >
      <div className="w-full h-full flex flex-col">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          className="hidden"
        />

        {showTitle && title && (
          <h3 className="mb-3 text-lg font-semibold text-gray-800" style={{ textAlign: block.props.textAlign as any }}>
            {title}
          </h3>
        )}

        <div
          className={`relative overflow-hidden bg-black/5 group ${isSelected ? 'cursor-pointer' : ''}`}
          style={{
            ...getAspectRatioStyle(),
            borderRadius: block.props.borderRadius || '0px'
          }}
          onClick={() => isSelected && !src && fileInputRef.current?.click()}
        >
          {src ? (
            isYouTube ? (
              <iframe
                className="w-full h-full border-0 absolute inset-0"
                src={src.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/').split('&')[0]}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className="w-full h-full object-cover block absolute inset-0"
                poster={poster}
                controls={controls}
                autoPlay={autoplay}
                muted={muted}
                loop={loop}
                preload="metadata"
              >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl text-blue-500">🎥</span>
              </div>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                {isSelected ? 'Click to Upload Video' : 'No Video Selected'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports MP4, WebM or YouTube links</p>
            </div>
          )}
        </div>

        {showDescription && description && (
          <p className="mt-3 text-sm text-gray-600" style={{ textAlign: block.props.textAlign as any }}>
            {description}
          </p>
        )}
      </div>
    </BaseBlock>
  );
};