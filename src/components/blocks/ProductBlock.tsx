import React, { useState } from 'react';
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
    source = 'manual',
    apiUrl,
    apiDataPath,
    apiMapping,

    // Default values used as fallbacks or initial state
    title: initialTitle = 'Premium Product',
    description: initialDescription = 'Experience the best quality with our latest collection.',
    price: initialPrice = '99.99',
    originalPrice: initialOriginalPrice = '149.99',
    currency = '$',
    imageUrl: initialImageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=200',
    imageAlt = 'Product Image',
    buttonText = 'Add to Cart',
    buttonUrl = '#',
    layout = 'vertical',
    showOriginalPrice = true,
    showButton = true,
    showDescription = true,
    discount = '30% OFF',
    rating = 4.8,
    reviewCount = 120,
    badge = 'BESTSELLER',

    // Styling
    priceColor = '#10b981',
    originalPriceColor = '#9ca3af',
    badgeBgColor = '#ef4444',
    badgeTextColor = '#ffffff',
    buttonColor = '#3b82f6',
    buttonTextColor = '#ffffff'
  } = block.props;

  const [isHovered, setIsHovered] = useState(false);

  // API State
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (source === 'api' && apiUrl) {
      setLoading(true);
      setError(null);
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          let targetData = data;
          // Traverse data path if provided (e.g. "data.products")
          if (apiDataPath) {
            const pathParts = apiDataPath.split('.');
            for (const part of pathParts) {
              targetData = targetData?.[part];
            }
          }

          // If array, take first item for now (simple product block)
          if (Array.isArray(targetData)) {
            setApiData(targetData[0]);
          } else {
            setApiData(targetData);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch product data", err);
          setError("Failed to load product data");
          setLoading(false);
        });
    } else {
      setApiData(null);
    }
  }, [source, apiUrl, apiDataPath]);

  // Determine final values (Map API data or use manual props)
  const title = (source === 'api' && apiData) ? (apiData[apiMapping?.title || 'title'] || initialTitle) : initialTitle;
  const description = (source === 'api' && apiData) ? (apiData[apiMapping?.description || 'description'] || initialDescription) : initialDescription;
  const price = (source === 'api' && apiData) ? (apiData[apiMapping?.price || 'price'] || initialPrice) : initialPrice;
  const imageUrl = (source === 'api' && apiData) ? (apiData[apiMapping?.image || 'image'] || apiData[apiMapping?.image || 'thumbnail'] || initialImageUrl) : initialImageUrl;
  const originalPrice = initialOriginalPrice; // Usually API might not have this, allow fallback or mapping if needed


  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400 text-xs">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.floor(rating) ? '★' : '☆'}</span>
        ))}
        {reviewCount > 0 && <span className="text-gray-400 ml-1 text-[10px]">({reviewCount})</span>}
      </div>
    );
  };

  const isHorizontal = layout === 'horizontal';

  if (loading) {
    return (
      <BaseBlock block={block} isSelected={isSelected} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete}>
        <div className="flex items-center justify-center p-8 bg-gray-50/10 rounded animate-pulse">
          <span className="text-sm font-medium text-gray-400">Loading product data...</span>
        </div>
      </BaseBlock>
    );
  }

  if (error) {
    return (
      <BaseBlock block={block} isSelected={isSelected} onSelect={onSelect} onUpdate={onUpdate} onDelete={onDelete}>
        <div className="flex items-center justify-center p-8 bg-red-500/10 rounded border border-red-500/20">
          <span className="text-sm font-bold text-red-500">{error}</span>
        </div>
      </BaseBlock>
    );
  }

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
        className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} w-full overflow-hidden transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden ${isHorizontal ? 'w-1/3 min-w-[120px]' : 'w-full aspect-[4/3]'}`}
        >
          {badge && (
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter z-10 shadow-lg"
              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
            >
              {badge}
            </div>
          )}
          {discount && isHovered && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold z-10 animate-in fade-in slide-in-from-left-2">
              {discount}
            </div>
          )}
          <img
            src={imageUrl}
            alt={imageAlt}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Product';
            }}
          />
        </div>

        {/* Content Section */}
        <div className={`flex-1 flex flex-col p-4 ${isHorizontal ? 'justify-center' : ''}`}>
          <div className="mb-2">
            <h3 className="text-lg font-black leading-tight tracking-tight group-hover:text-blue-500 transition-colors">
              {title}
            </h3>
            {rating > 0 && renderStars(rating)}
          </div>

          {showDescription && description && (
            <p className="text-sm opacity-60 line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black" style={{ color: priceColor }}>
                {currency}{price}
              </span>
              {showOriginalPrice && originalPrice && (
                <span className="text-sm line-through opacity-40 italic" style={{ color: originalPriceColor }}>
                  {currency}{originalPrice}
                </span>
              )}
            </div>

            {showButton && (
              <a
                href={buttonUrl}
                className="inline-flex items-center justify-center w-full py-2.5 rounded-lg font-bold text-sm transition-all hover:translate-y-[-2px] active:translate-y-[0] shadow-md hover:shadow-lg"
                style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                onClick={(e) => e.stopPropagation()}
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </BaseBlock>
  );
};

