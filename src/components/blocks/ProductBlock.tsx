import React from 'react';
import { BaseBlock } from './BaseBlock';
import { ProductBlock as ProductBlockType, Block } from '../../schema/types';

export const ProductBlock: React.FC<{
  block: ProductBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const {
    title = 'Product Name',
    description = 'Product description goes here',
    price = '$99.99',
    originalPrice = '$149.99',
    currency = '$',
    imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=200',
    imageAlt = 'Product Image',
    buttonText = 'Buy Now',
    buttonUrl = '#',
    buttonColor = '#3b82f6',
    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    priceColor = '#059669',
    originalPriceColor = '#6b7280',
    layout = 'vertical',
    showOriginalPrice = true,
    showButton = true,
    showDescription = true,
    discount = '33% OFF',
    rating = 4.5,
    reviewCount = 128,
    badge = 'NEW',
    badgeColor = '#ef4444',
    padding = '20px',
    borderRadius = '8px',
    border = '1px solid #e5e7eb',
    shadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  } = block.props;


  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding,
    borderRadius,
    border,
    boxShadow: shadow,
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden',
    minWidth: '280px',
    maxWidth: '100%',
    width: block.props.width || 'auto',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  };

  const imageStyle: React.CSSProperties = {
    width: layout === 'horizontal' ? '120px' : '100%',
    height: layout === 'horizontal' ? '120px' : '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const priceStyle: React.CSSProperties = {
    color: priceColor,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const originalPriceStyle: React.CSSProperties = {
    color: originalPriceColor,
    textDecoration: 'line-through',
    fontSize: '1rem'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'background-color 0.2s'
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: badgeColor,
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    zIndex: 1
  };

  return (
    <BaseBlock block={block} isSelected={isSelected} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete}>
      <div
        className={`builderx-product ${isSelected ? 'outline-dashed outline-2 outline-blue-500' : ''}`}
        style={containerStyle}
        onClick={onSelect}
        data-testid="product-block"
      >
        {badge && (
          <div style={badgeStyle}>
            {badge}
          </div>
        )}

        {imageUrl && (
          <div style={{ position: 'relative' }}>
            <img
              src={imageUrl}
              alt={imageAlt}
              style={imageStyle}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
              }}
            />
            {discount && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {discount}
              </div>
            )}
          </div>
        )}

        <div style={contentStyle}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            {title}
          </h3>

          {showDescription && (
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>
              {description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={priceStyle}>
              {currency}{price}
              {showOriginalPrice && originalPrice && (
                <span style={originalPriceStyle}>
                  {currency}{originalPrice}
                </span>
              )}
            </div>
          </div>

          {rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ display: 'flex' }}>
                {renderStars(rating)}
              </div>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                ({reviewCount} reviews)
              </span>
            </div>
          )}

          {showButton && (
            <a
              href={buttonUrl}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};
