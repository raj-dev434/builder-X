import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, ProgressBarBlock as ProgressBarBlockType } from '../../schema/types';

export const ProgressBarBlock: React.FC<{
  block: ProgressBarBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    value = 65,
    max = 100,
    title = 'My Skill',
    titleTag = 'p',
    showTitle = true,
    description = 'Web Designer',
    showDescription = false,
    showPercentage = true,
    style = 'line',
    height = '20px',
    borderRadius = '4px',
    progressColor = '#6EC1E4',
    barBackgroundColor = '#3b3e44',
    animated = false,
    striped = false,
    innerText = '',
    titleColor,
    percentageColor,
    innerTextColor = '#ffffff',
    variant = 'default',
  } = block.props;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const TitleTag = titleTag as React.ElementType;

  const VARIANT_COLORS: Record<string, string> = {
    default: progressColor, // Fallback to custom color
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    info: '#3b82f6',
  };

  const activeColor = (variant && variant !== 'default') ? VARIANT_COLORS[variant] : progressColor;

  const renderLine = () => (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        {showTitle && title && (
          <TitleTag 
            className="font-bold text-sm tracking-wide"
            style={{ color: titleColor }}
          >
            {title}
          </TitleTag>
        )}
        {showPercentage && (
             <span className="text-sm font-bold" style={{ color: percentageColor || '#fff' }}>
               {Math.round(percentage)}%
             </span>
        )}
      </div>

      <div 
        className="w-full relative overflow-hidden transition-all duration-300"
        style={{ 
          height: height, 
          backgroundColor: barBackgroundColor,
          borderRadius: borderRadius
        }}
      >
        <div 
          className={`h-full transition-all duration-1000 ease-out relative flex items-center justify-end pr-2 ${striped ? 'overflow-hidden' : ''}`}
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: activeColor,
            borderRadius: borderRadius,
            boxShadow: animated ? `0 0 10px ${activeColor}40` : 'none'
          }}
        >
          {innerText && (
             <span className="text-[10px] font-bold whitespace-nowrap z-10 relative" style={{ color: innerTextColor }}>
               {innerText}
             </span>
          )}

          {striped && (
            <div 
              className="absolute inset-0 opacity-20 animate-[move-bg_1s_linear_infinite]"
              style={{
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.7) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.7) 75%, transparent 75%, transparent)',
                backgroundSize: '20px 20px'
              }}
            />
          )}
          
          {animated && !striped && (
             <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </div>
      </div>
      
      {showDescription && description && (
         <div className="mt-1 text-xs opacity-60">
            {description}
         </div>
      )}
    </div>
  );

  const renderCircle = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    // Get scoped typography styles
    const getTypographyStyle = (prefix: string) => {
      const p = block.props as any;
      return {
        fontSize: p[`${prefix}FontSize`],
        fontWeight: p[`${prefix}FontWeight`],
        fontFamily: p[`${prefix}FontFamily`],
        fontStyle: p[`${prefix}FontStyle`],
        textTransform: p[`${prefix}TextTransform`] as any,
        textDecoration: p[`${prefix}TextDecoration`],
        lineHeight: p[`${prefix}LineHeight`],
        letterSpacing: p[`${prefix}LetterSpacing`],
      };
    };

    const circleSize = (block.props as any).circleSize || '128px';

    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative flex items-center justify-center p-4">
          <svg 
            className={`transform -rotate-90 ${animated ? 'animate-[spin_3s_linear_infinite]' : ''}`}
            style={{ width: circleSize, height: circleSize }}
            viewBox="0 0 128 128"
          >
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={barBackgroundColor}
              strokeWidth={parseInt(String(height).replace('px','')) || 8}
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={activeColor}
              strokeWidth={parseInt(String(height).replace('px','')) || 8}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center pointer-events-none">
               {showTitle && (
                 <TitleTag 
                   className="font-bold text-sm mb-1 text-center"
                   style={{ 
                     color: titleColor,
                     ...getTypographyStyle('title')
                   }}
                 >
                   {title}
                 </TitleTag>
               )}
               {showPercentage && (
                 <span 
                    className="text-xl font-black" 
                    style={{ 
                      color: percentageColor || activeColor,
                      ...getTypographyStyle('percentage')
                    }}
                 >
                   {Math.round(percentage)}%
                 </span>
               )}
               {innerText && (
                  <span 
                    className="text-[10px] font-bold text-gray-400 mt-0.5" 
                    style={{ 
                      color: innerTextColor,
                      ...getTypographyStyle('innerText')
                    }}
                  >
                    {innerText}
                  </span>
               )}
          </div>
        </div>
        
        {showDescription && description && (
           <div className="mt-1 text-xs opacity-60 text-center max-w-[200px]">
              {description}
           </div>
        )}
      </div>
    );
  };

  const renderDash = () => {
    const totalSegments = 10;
    const activeSegments = Math.round((percentage / 100) * totalSegments);
    
    return (
      <div className="w-full">
         <div className="flex justify-between items-end mb-2">
            {showTitle && title && (
               <TitleTag 
                  className="font-bold text-sm tracking-wide"
                  style={{ color: titleColor }}
               >
                  {title}
               </TitleTag>
            )}
            {showPercentage && (
               <span className="text-sm font-bold" style={{ color: percentageColor || '#fff' }}>
                  {Math.round(percentage)}%
               </span>
            )}
         </div>
         <div className="flex w-full gap-1">
            {[...Array(totalSegments)].map((_, i) => (
               <div 
                  key={i}
                  className={`flex-1 transition-all duration-300 relative overflow-hidden ${animated && i < activeSegments ? 'animate-pulse' : ''}`}
                  style={{ 
                     height: height,
                     backgroundColor: i < activeSegments ? activeColor : barBackgroundColor,
                     borderRadius: borderRadius
                  }}
               >
                  {striped && i < activeSegments && (
                    <div 
                      className="absolute inset-0 opacity-20 animate-[move-bg_1s_linear_infinite]"
                      style={{
                        backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.7) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.7) 75%, transparent 75%, transparent)',
                        backgroundSize: '10px 10px'
                      }}
                    />
                  )}
               </div>
            ))}
         </div>
         
         {innerText && (
            <div className="mt-1 text-[10px] font-bold text-right" style={{ color: innerTextColor }}>
               {innerText}
            </div>
         )}

          {showDescription && description && (
            <div className="mt-0.5 text-xs opacity-60">
                {description}
            </div>
          )}
      </div>
    );
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="w-full"
    >
      <div className="w-full p-2">
         {style === 'line' && renderLine()}
         {style === 'circle' && renderCircle()}
         {style === 'dash' && renderDash()}

        <style>
          {`
            @keyframes move-bg {
              0% { background-position: 0 0; }
              100% { background-position: 20px 0; }
            }
          `}
        </style>
      </div>
    </BaseBlock>
  );
};
