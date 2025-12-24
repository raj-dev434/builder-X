import React, { useState } from 'react';
import { BaseBlock } from './BaseBlock';
import { PriceBlock as PriceBlockType, Block } from '../../schema/types';

export const PriceBlock: React.FC<{
  block: PriceBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const {
    title = 'Pro Plan',
    description = 'Advanced features for scaling teams.',
    price = '49',
    originalPrice = '99',
    currency = '$',
    period = '/mo',
    features = ['Priority Support', 'Custom Domains', 'Unlimited Storage', 'API Access'],
    buttonText = 'Choose Plan',
    buttonUrl = '#',
    
    // Style specifics
    accentColor = '#3b82f6',
    buttonColor = '#3b82f6',
    buttonTextColor = '#ffffff',
    popular = true,
    popularText = 'MOST POPULAR',
    popularColor = '#ef4444',
    
    layout = 'vertical',
    showOriginalPrice = true,
    showFeatures = true,
    showButton = true,
    showPopular = true
  } = block.props;

  const [isHovered, setIsHovered] = useState(false);

  const isHorizontal = layout === 'horizontal';

  return (
    <BaseBlock 
      block={block} 
      isSelected={isSelected} 
      onSelect={onSelect} 
      onUpdate={onUpdate} 
      onDelete={onDelete}
      className="group"
    >
      <div 
        className={`relative flex ${isHorizontal ? 'flex-row' : 'flex-col'} w-full transition-all duration-300 ${popular ? 'ring-2' : ''} ${isHovered ? 'scale-[1.02] shadow-2xl' : 'scale-100 shadow-xl'}`}
        style={{ outlineColor: popular ? accentColor : 'transparent', backgroundColor: 'transparent' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {popular && showPopular && (
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl z-20"
            style={{ backgroundColor: popularColor, color: '#ffffff' }}
          >
            {popularText}
          </div>
        )}

        <div className={`p-8 flex-1 flex flex-col ${isHorizontal ? 'justify-between items-center' : ''}`}>
          <div className={`${isHorizontal ? 'text-left' : 'text-center'} mb-6`}>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: popular ? accentColor : 'inherit' }}>
              {title}
            </h3>
            <p className="text-sm opacity-60 leading-relaxed max-w-[240px] mx-auto">
              {description}
            </p>
          </div>

          <div className={`${isHorizontal ? 'text-center px-8 border-x border-gray-100 dark:border-gray-800' : 'text-center mb-8'}`}>
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-[3.5rem] font-black leading-none tracking-tighter" style={{ color: block.props.priceColor || 'inherit' }}>
                {currency}{price}
              </span>
              <span className="text-lg font-bold opacity-40 uppercase">{period}</span>
            </div>
            
            {showOriginalPrice && originalPrice && (
              <div className="text-sm font-bold opacity-30 line-through italic">
                {currency}{originalPrice}
              </div>
            )}
          </div>

          <div className="flex-1">
            {showFeatures && features && features.length > 0 && (
              <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <svg className="w-4 h-4" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="opacity-80">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showButton && (
            <div className="mt-auto w-full">
              <a
                href={buttonUrl}
                className="inline-flex items-center justify-center w-full py-4 rounded-xl font-black text-sm transition-all hover:scale-[1.02] hover:shadow-xl active:scale-100 shadow-md"
                style={{ backgroundColor: popular ? accentColor : buttonColor, color: buttonTextColor }}
                onClick={(e) => e.stopPropagation()}
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </BaseBlock>
  );
};
