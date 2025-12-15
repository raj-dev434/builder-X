import React, { useState, useEffect } from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface TestimonialItem {
  quote: string;
  author: string;
  title: string;
  company: string;
  avatarUrl: string;
  avatarAlt?: string;
  rating: number;
}

export interface TestimonialBlockProps {
  id: string;
  type: 'testimonial';
  props: {
    // Single mode props (legacy/default)
    quote?: string;
    author?: string;
    title?: string;
    company?: string;
    avatarUrl?: string;
    avatarAlt?: string;
    rating?: number;

    // List mode props
    testimonials?: TestimonialItem[];

    // Style props
    backgroundColor?: string;
    textColor?: string;
    quoteColor?: string;
    authorColor?: string;
    accentColor?: string;
    borderColor?: string;
    layout?: 'vertical' | 'horizontal' | 'card';
    size?: 'small' | 'medium' | 'large';
    showAvatar?: boolean;
    showRating?: boolean;
    showTitle?: boolean;
    showCompany?: boolean;
    showQuote?: boolean;
    padding?: string;
    borderRadius?: string;
    border?: string;
    shadow?: string;
    alignment?: 'left' | 'center' | 'right';

    // Carousel props
    autoplay?: boolean;
    autoplaySpeed?: number;
    showDots?: boolean;
    showArrows?: boolean;
  };
}

export const TestimonialBlock: React.FC<{
  block: TestimonialBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const {
    // defaults for single item
    quote = 'This product has completely transformed our workflow. The results speak for themselves!',
    author = 'John Doe',
    title = 'CEO',
    company = 'Acme Corp',
    avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80',
    avatarAlt = 'John Doe',
    rating = 5,

    testimonials = [],

    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    quoteColor = '#374151',
    authorColor = '#1f2937',
    accentColor = '#3b82f6',
    borderColor = '#e5e7eb',
    layout = 'vertical',
    size = 'medium',
    showAvatar = true,
    showRating = true,
    showTitle = true,
    showCompany = true,
    showQuote = true,
    borderRadius = '12px',
    border = '1px solid #e5e7eb',
    shadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    alignment = 'left',

    autoplay = false,
    autoplaySpeed = 5000,
    showDots = true,
    showArrows = true,
  } = block.props;

  // Merge single props into a list if testimonials is empty, or use testimonials if present
  const items: TestimonialItem[] = testimonials.length > 0 ? testimonials : [
    { quote, author, title, company, avatarUrl, avatarAlt, rating }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoplay && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoplaySpeed);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplaySpeed, items.length]);

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentItem = items[currentIndex];

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: '20px' },
          quote: { fontSize: '1rem' },
          author: { fontSize: '0.875rem' },
          title: { fontSize: '0.75rem' },
          avatar: { width: '40px', height: '40px' }
        };
      case 'large':
        return {
          container: { padding: '48px' },
          quote: { fontSize: '1.5rem' },
          author: { fontSize: '1.125rem' },
          title: { fontSize: '1rem' },
          avatar: { width: '80px', height: '80px' }
        };
      default: // medium
        return {
          container: { padding: '32px' },
          quote: { fontSize: '1.125rem' },
          author: { fontSize: '1rem' },
          title: { fontSize: '0.875rem' },
          avatar: { width: '60px', height: '60px' }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i < count ? '#fbbf24' : '#d1d5db',
            fontSize: '1.2rem'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getAlignmentStyles = () => {
    switch (alignment) {
      case 'center':
        return { textAlign: 'center' as const };
      case 'right':
        return { textAlign: 'right' as const };
      default:
        return { textAlign: 'left' as const };
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding: sizeStyles.container.padding,
    borderRadius,
    border,
    boxShadow: shadow,
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'flex-start' : 'stretch',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
    minWidth: '250px',
    ...getAlignmentStyles()
  };

  const quoteStyle: React.CSSProperties = {
    color: quoteColor,
    fontSize: sizeStyles.quote.fontSize,
    fontStyle: 'italic',
    lineHeight: '1.6',
    margin: 0,
    position: 'relative',
    flex: 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  const authorStyle: React.CSSProperties = {
    color: authorColor,
    fontSize: sizeStyles.author.fontSize,
    fontWeight: '600',
    margin: 0
  };

  const titleStyle: React.CSSProperties = {
    color: authorColor,
    fontSize: sizeStyles.title.fontSize,
    opacity: 0.7,
    margin: 0
  };

  const avatarStyle: React.CSSProperties = {
    width: sizeStyles.avatar.width,
    height: sizeStyles.avatar.height,
    borderRadius: '50%',
    objectFit: 'cover',
    border: `2px solid ${borderColor}`,
    flexShrink: 0
  };

  const ratingStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2px',
    marginTop: '8px',
    justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start'
  };

  const quoteMarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    fontSize: '4rem',
    color: accentColor,
    opacity: 0.2,
    fontFamily: 'serif',
    lineHeight: 1
  };

  return (
    <BaseBlock block={block} isSelected={isSelected} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete}>
      <div
        className={`builderx-testimonial ${isSelected ? 'outline-dashed outline-2 outline-blue-500' : ''}`}
        style={containerStyle}
        onClick={onSelect}
        data-testid="testimonial-block"
      >
        {items.length > 1 && showArrows && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10"
            >
              ❮
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-700 hover:bg-gray-50 z-10"
            >
              ❯
            </button>
          </>
        )}

        {showQuote && (
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={quoteMarkStyle}>"</div>
            <p style={quoteStyle}>
              {currentItem.quote}
            </p>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          alignItems: layout === 'horizontal' ? 'center' : 'stretch',
          gap: '12px',
          flexShrink: 0
        }}>
          {showAvatar && (
            <img
              src={currentItem.avatarUrl}
              alt={currentItem.avatarAlt || currentItem.author}
              style={avatarStyle}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/80x80?text=JD';
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <h4 style={authorStyle}>
              {currentItem.author}
            </h4>

            {showTitle && currentItem.title && (
              <p style={titleStyle}>
                {currentItem.title}
              </p>
            )}

            {showCompany && currentItem.company && (
              <p style={titleStyle}>
                {currentItem.company}
              </p>
            )}

            {showRating && currentItem.rating > 0 && (
              <div style={ratingStyle}>
                {renderStars(currentItem.rating)}
              </div>
            )}
          </div>
        </div>

        {items.length > 1 && showDots && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
