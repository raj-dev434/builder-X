import React, { useState } from 'react';
import { BaseBlock } from './BaseBlock';
import { ProductBlock as ProductBlockType, Block } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

export const getProductGridCSS = (blockId: string, props: any, viewDevice: string) => {
  const {
    gap = '1rem',
    gridColumns = 3,
    gridColumnsTablet = 2,
    gridColumnsMobile = 1,
    cardWidth = '300px',
    enableScroll = false,
    scrollDirection = 'horizontal',
    containerHeight = '400px',
    layout = 'vertical',
  } = props;

  const gridClassName = `product-grid-${blockId}`;
  let cssRules = '';
  // Editor View Helpers
  // Editor View Helpers

  if (enableScroll && scrollDirection === 'horizontal') {
    // CAROUSEL MODE - Horizontal Scrolling
    cssRules = `
        .${gridClassName} {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: ${gap || '1rem'};
          padding-bottom: 1rem;
          /* Firefox Scrollbar */
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }
        
        .${gridClassName} .product-card {
          width: ${cardWidth || '300px'};
          min-width: ${cardWidth || '300px'};
          flex-shrink: 0;
          flex-direction: ${layout === 'horizontal' ? 'row' : 'column'};
        }
        
        ${layout === 'horizontal' ? `
          .${gridClassName} .product-card-image {
            width: 40%;
            min-width: 120px;
            aspect-ratio: auto;
          }
          .${gridClassName} .product-card-content {
            width: 60%;
          }
        ` : `
          .${gridClassName} .product-card-image {
            width: 100%;
            aspect-ratio: 4/3;
          }
        `}
        
        /* Mobile/Tablet Support */
        @media (max-width: 1024px) {
           .${gridClassName} .product-card {
             width: ${cardWidth || '260px'} !important; 
             min-width: ${cardWidth || '260px'} !important;
           }
        }

        @media (max-width: 768px) {
            .${gridClassName} .product-card {
               /* Default small size for mobile as requested */
               width: 220px !important; 
               min-width: 220px !important;
               flex-direction: column !important; /* Stack vertical on phone for small card */
            }
            .${gridClassName} .product-card-image {
                width: 100% !important;
                aspect-ratio: 4/3 !important;
            }
        }
        
        /* Webkit Scrollbar */
        .${gridClassName}::-webkit-scrollbar {
          height: 10px; /* Force visible height */
        }
        .${gridClassName}::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        .${gridClassName}::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
          border: 2px solid #f1f1f1;
        }
        .${gridClassName}::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `;

    // Editor Overrides for Carousel
    if (viewDevice === 'mobile') {
      cssRules += `
            .${gridClassName} .product-card {
               width: 220px !important; 
               min-width: 220px !important;
               flex-direction: column !important;
            }
            .${gridClassName} .product-card-image {
                width: 100% !important;
                aspect-ratio: 4/3 !important;
            }
          `;
    }

  } else if (enableScroll && scrollDirection === 'vertical') {
    // VERTICAL LIST MODE - Vertical Scrolling
    cssRules = `
        .${gridClassName} {
          display: grid;
          grid-template-columns: 1fr;
          overflow-y: auto;
          max-height: ${containerHeight || '400px'};
          gap: ${gap || '1rem'};
        }
        
        .${gridClassName} .product-card {
          flex-direction: ${layout === 'horizontal' ? 'row' : 'column'};
        }
        
        ${layout === 'horizontal' ? `
          .${gridClassName} .product-card-image {
            width: 40%;
            min-width: 120px;
            aspect-ratio: auto;
          }
        ` : `
          .${gridClassName} .product-card-image {
            width: 100%;
            aspect-ratio: 4/3;
          }
        `}
        
        .${gridClassName}::-webkit-scrollbar {
          width: 8px;
        }
        .${gridClassName}::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .${gridClassName}::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
      `;

    // Editor Overrides for Vertical List
    if (viewDevice === 'mobile') {
      cssRules += `
            .${gridClassName} .product-card {
                flex-direction: column !important;
            }
            .${gridClassName} .product-card-image {
                width: 100% !important;
                aspect-ratio: 4/3 !important;
            }
         `;
    }
  } else {
    // STANDARD GRID MODE - Simple Responsive (3/2/1 columns)

    const baseStyles = `
        /* Base: Mobile First - 1 column */
        .${gridClassName} {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: ${gap || '1rem'};
        }
        
        .${gridClassName} .product-card {
          flex-direction: ${layout === 'horizontal' ? 'row' : 'column'};
        }
        
        ${layout === 'horizontal' ? `
          .${gridClassName} .product-card-image {
            width: 40%;
            min-width: 120px;
            aspect-ratio: auto;
          }
        ` : `
          .${gridClassName} .product-card-image {
            width: 100%;
            aspect-ratio: 4/3;
          }
        `}
      `;

    // Responsive Rules based on Props

    // Default (Desktop)
    const baseGrid = `
        .${gridClassName} {
          grid-template-columns: repeat(${gridColumns}, 1fr) !important;
        }
      `;

    // Tablet Override
    const tabletGrid = `
         @media (max-width: 1024px) {
            .${gridClassName} {
              grid-template-columns: repeat(${gridColumnsTablet}, 1fr) !important;
            }
         }
      `;

    // Mobile Override
    const mobileGrid = `
          @media (max-width: 768px) {
            .${gridClassName} {
              grid-template-columns: repeat(${gridColumnsMobile}, 1fr) !important;
            }
            .${gridClassName} .product-card {
                flex-direction: column !important;
            }
          }
      `;

    cssRules = baseStyles + baseGrid + tabletGrid + mobileGrid;

    // Editor Override: Force view if inside editor (viewDevice is passed)
    if (viewDevice === 'tablet') {
      cssRules += `
          .${gridClassName} {
            grid-template-columns: repeat(${gridColumnsTablet}, 1fr) !important;
          }
        `;
    } else if (viewDevice === 'mobile') {
      cssRules += `
          .${gridClassName} {
            grid-template-columns: repeat(${gridColumnsMobile}, 1fr) !important;
          }
           .${gridClassName} .product-card {
                flex-direction: column !important;
            }
        `;
    }
  }
  return cssRules;
}

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

    // Layout
    displayMode = 'single',
    itemsLimit = 6,
    gap = '1rem',
    gridColumns = 3,
    gridColumnsTablet = 2,
    gridColumnsMobile = 1,

    // Sizing & Scroll
    cardWidth = '300px',
    enableScroll = false,
    scrollDirection = 'horizontal',
    containerHeight = '400px',

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
    buttonWidth = 'full',
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

  const viewDevice = useCanvasStore((state) => state.viewDevice);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

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
          if (apiDataPath) {
            const pathParts = apiDataPath.split('.');
            for (const part of pathParts) {
              targetData = targetData?.[part];
            }
          }
          setApiData(targetData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch product data", err);
          setError("Failed to load data");
          setLoading(false);
        });
    } else {
      setApiData(null);
    }
  }, [source, apiUrl, apiDataPath]);

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

  // Helper to render a single Product Card
  const renderCard = (data: any = null, index: number = 0) => {
    const isApi = source === 'api' && data;

    const currentTitle = isApi ? (data[apiMapping?.title || 'title'] || initialTitle) : initialTitle;
    const currentDesc = isApi ? (data[apiMapping?.description || 'description'] || initialDescription) : initialDescription;
    const currentPrice = isApi ? (data[apiMapping?.price || 'price'] || initialPrice) : initialPrice;
    const currentImage = isApi ? (data[apiMapping?.image || 'image'] || data[apiMapping?.image || 'thumbnail'] || initialImageUrl) : initialImageUrl;
    const originalPrice = initialOriginalPrice;

    const isCardHovered = hoveredIndex === index;

    return (
      <div
        key={index}
        className="product-card flex overflow-hidden transition-all duration-300 bg-transparent relative group/card"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(-1)}
      >
        {/* Image Section */}
        <div className="product-card-image relative overflow-hidden rounded-md">
          {badge && (
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter z-10 shadow-lg"
              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
            >
              {badge}
            </div>
          )}
          {discount && isCardHovered && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold z-10 animate-in fade-in slide-in-from-left-2">
              {discount}
            </div>
          )}
          <img
            src={currentImage}
            alt={imageAlt || currentTitle}
            className={`w-full h-full object-cover transition-transform duration-700 ${isCardHovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Product';
            }}
          />
        </div>

        {/* Content Section */}
        <div className="product-card-content flex-1 flex flex-col p-4">
          <div className="mb-2">
            <h3 className="text-lg font-black leading-tight tracking-tight group-hover/card:text-blue-500 transition-colors">
              {currentTitle}
            </h3>
            {rating > 0 && renderStars(rating)}
          </div>

          {showDescription && currentDesc && (
            <p className="text-sm opacity-60 line-clamp-2 mb-4 leading-relaxed">
              {currentDesc}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black" style={{ color: priceColor }}>
                {currency}{currentPrice}
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
                className={`inline-flex items-center justify-center py-2.5 rounded-lg font-bold text-sm transition-all hover:translate-y-[-2px] active:translate-y-[0] shadow-md hover:shadow-lg ${buttonWidth === 'full' ? 'w-full' : 'w-auto px-6'}`}
                style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                onClick={(e) => e.stopPropagation()}
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

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

  // --- GRID LOOP RENDERING ---
  if (source === 'api' && displayMode === 'grid' && Array.isArray(apiData)) {
    const items = apiData.slice(0, itemsLimit || 6);
    const gridClassName = `product-grid-${block.id}`;

    const cssRules = getProductGridCSS(block.id, {
      itemsLimit, gap, gridColumns, gridColumnsTablet, gridColumnsMobile,
      cardWidth, enableScroll, scrollDirection, containerHeight, layout
    }, viewDevice);

    return (
      <>
        <style>{cssRules}</style>
        <BaseBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onDelete={onDelete}
          className={gridClassName}
        >
          {items.map((item: any, index: number) => {
            // Apply Overrides if present
            const override = block.props.overrides ? block.props.overrides[index] : {};
            const finalItem = { ...item, ...override };
            return renderCard(finalItem, index);
          })}
        </BaseBlock>
      </>
    );
  }

  // --- SINGLE RENDERING (Default/Manual/Fallback) ---
  let singleData = null;
  if (source === 'api') {
    singleData = Array.isArray(apiData) ? apiData[0] : apiData;
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
      {renderCard(singleData, 0)}
    </BaseBlock>
  );
};
