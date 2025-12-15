import React, { useState } from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface PromoCodeBlockProps {
  id: string;
  type: 'promo-code';
  props: {
    title?: string;
    description?: string;
    code?: string;
    discount?: string;
    validUntil?: string;
    buttonText?: string;
    backgroundColor?: string;
    textColor?: string;
    codeBackgroundColor?: string;
    codeTextColor?: string;
    buttonColor?: string;
    borderColor?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
    layout?: 'vertical' | 'horizontal';
    showCopyButton?: boolean;
    showValidUntil?: boolean;
    showDiscount?: boolean;
    padding?: string;
    borderRadius?: string;
    shadow?: string;
    animation?: 'none' | 'pulse' | 'bounce' | 'shake';
  };
}

export const PromoCodeBlock: React.FC<{
  block: PromoCodeBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const {
    title = 'Special Offer!',
    description = 'Use this promo code to get an amazing discount',
    code = 'SAVE20',
    discount = '20% OFF',
    validUntil = '2024-12-31',
    buttonText = 'Copy Code',
    backgroundColor = '#f8fafc',
    textColor = '#1e293b',
    codeBackgroundColor = '#1e293b',
    codeTextColor = '#ffffff',
    buttonColor = '#3b82f6',
    borderColor = '#e2e8f0',
    borderStyle = 'dashed',
    layout = 'vertical',
    showCopyButton = true,
    showValidUntil = true,
    showDiscount = true,
    padding = '24px',
    borderRadius = '12px',
    shadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    animation = 'pulse'
  } = block.props;

  const [copied, setCopied] = useState(false);


  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'shake':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding,
    borderRadius,
    border: `${borderStyle} 2px ${borderColor}`,
    boxShadow: shadow,
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden'
  };

  const codeStyle: React.CSSProperties = {
    backgroundColor: codeBackgroundColor,
    color: codeTextColor,
    padding: '12px 16px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textAlign: 'center',
    border: '2px dashed rgba(255, 255, 255, 0.3)',
    position: 'relative',
    flex: layout === 'horizontal' ? 1 : 'none'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonColor,
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    flex: layout === 'horizontal' ? 'none' : 1
  };

  const discountStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    transform: 'rotate(15deg)'
  };

  return (
    <BaseBlock block={block} isSelected={isSelected} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete}>
      <div
        className={`builderx-promo-code ${isSelected ? 'outline-dashed outline-2 outline-blue-500' : ''} ${getAnimationClass()}`}
        style={containerStyle}
        onClick={onSelect}
        data-testid="promo-code-block"
      >
        {showDiscount && discount && (
          <div style={discountStyle}>
            {discount}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
            {title}
          </h3>
          
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8, marginBottom: '16px' }}>
            {description}
          </p>

          {showValidUntil && validUntil && (
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, marginBottom: '16px' }}>
              Valid until: {new Date(validUntil).toLocaleDateString()}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
          <div style={codeStyle}>
            {code}
          </div>

          {showCopyButton && (
            <button
              style={buttonStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleCopyCode();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {copied ? '✓ Copied!' : buttonText}
            </button>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};
