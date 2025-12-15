import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface PriceBlockProps {
  id: string;
  type: 'price';
  props: {
    title?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    currency?: string;
    period?: string;
    features?: string[];
    buttonText?: string;
    buttonUrl?: string;
    buttonColor?: string;
    backgroundColor?: string;
    textColor?: string;
    priceColor?: string;
    originalPriceColor?: string;
    accentColor?: string;
    borderColor?: string;
    popular?: boolean;
    popularText?: string;
    popularColor?: string;
    layout?: 'vertical' | 'horizontal';
    size?: 'small' | 'medium' | 'large';
    showOriginalPrice?: boolean;
    showFeatures?: boolean;
    showButton?: boolean;
    showPopular?: boolean;
    padding?: string;
    borderRadius?: string;
    border?: string;
    shadow?: string;
  };
}

export const PriceBlock: React.FC<{
  block: PriceBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const {
    title = 'Basic Plan',
    description = 'Perfect for getting started',
    price = '29',
    originalPrice = '49',
    currency = '$',
    period = '/month',
    features = ['Feature 1', 'Feature 2', 'Feature 3'],
    buttonText = 'Get Started',
    buttonUrl = '#',
    buttonColor = '#3b82f6',
    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    priceColor = '#1f2937',
    originalPriceColor = '#6b7280',
    accentColor = '#3b82f6',
    popular = false,
    popularText = 'Most Popular',
    popularColor = '#ef4444',
    layout = 'vertical',
    size = 'medium',
    showOriginalPrice = true,
    showFeatures = true,
    showButton = true,
    showPopular = true,
    borderRadius = '12px',
    border = '1px solid #e5e7eb',
    shadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  } = block.props;


  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: '20px' },
          title: { fontSize: '1.25rem' },
          price: { fontSize: '2rem' },
          description: { fontSize: '0.875rem' }
        };
      case 'large':
        return {
          container: { padding: '48px' },
          title: { fontSize: '2rem' },
          price: { fontSize: '4rem' },
          description: { fontSize: '1.125rem' }
        };
      default: // medium
        return {
          container: { padding: '32px' },
          title: { fontSize: '1.5rem' },
          price: { fontSize: '3rem' },
          description: { fontSize: '1rem' }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding: sizeStyles.container.padding,
    borderRadius,
    border: popular ? `2px solid ${accentColor}` : border,
    boxShadow: popular ? `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` : shadow,
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
    gap: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const popularStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: popularColor,
    color: '#ffffff',
    padding: '8px 24px',
    borderRadius: '0 0 8px 8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    zIndex: 1
  };

  const priceStyle: React.CSSProperties = {
    color: priceColor,
    fontSize: sizeStyles.price.fontSize,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '8px'
  };

  const originalPriceStyle: React.CSSProperties = {
    color: originalPriceColor,
    textDecoration: 'line-through',
    fontSize: '1.5rem',
    fontWeight: 'normal'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: popular ? accentColor : buttonColor,
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'all 0.2s',
    width: '100%'
  };

  const featureStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    fontSize: '0.875rem'
  };

  const checkIconStyle: React.CSSProperties = {
    color: accentColor,
    fontSize: '1rem',
    fontWeight: 'bold'
  };

  return (
    <BaseBlock block={block} isSelected={isSelected} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete}>
      <div
        className={`builderx-price ${isSelected ? 'outline-dashed outline-2 outline-blue-500' : ''}`}
        style={containerStyle}
        onClick={onSelect}
        data-testid="price-block"
      >
        {popular && showPopular && (
          <div style={popularStyle}>
            {popularText}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: sizeStyles.title.fontSize, 
            fontWeight: '700', 
            marginBottom: '8px',
            color: popular ? accentColor : textColor
          }}>
            {title}
          </h3>
          
          <p style={{ 
            margin: 0, 
            fontSize: sizeStyles.description.fontSize, 
            opacity: 0.8, 
            marginBottom: '24px' 
          }}>
            {description}
          </p>

          <div style={priceStyle}>
            <span>{currency}{price}</span>
            <span style={{ fontSize: '1rem', opacity: 0.7 }}>{period}</span>
            {showOriginalPrice && originalPrice && (
              <span style={originalPriceStyle}>
                {currency}{originalPrice}
              </span>
            )}
          </div>

          {showFeatures && features.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              {features.map((feature, index) => (
                <div key={index} style={featureStyle}>
                  <span style={checkIconStyle}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showButton && (
          <a
            href={buttonUrl}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {buttonText}
          </a>
        )}
      </div>
    </BaseBlock>
  );
};
