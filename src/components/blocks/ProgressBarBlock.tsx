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
    title = 'Progress',
    showTitle = true,
    description = 'Current progress status',
    showDescription = true,
    showPercentage = true,
    showValue = true,
    style = 'line',
    thickness = '12px',
    progressColor = '#3b82f6',
    barBackgroundColor = 'rgba(0,0,0,0.1)',
    animated = true,
    striped = false,
    size = 'medium',
    variant = 'default'
  } = block.props;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getVariantColor = () => {
    switch (variant) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'info': return '#06b6d4';
      default: return progressColor;
    }
  };

  const activeColor = getVariantColor();
  const baseSize = size === 'small' ? '0.75rem' : size === 'large' ? '1.5rem' : '1rem';

  const renderLine = () => (
    <div className="w-full">
      <div 
        className="w-full rounded-full relative overflow-hidden transition-all duration-300"
        style={{ 
          height: thickness, 
          backgroundColor: barBackgroundColor 
        }}
      >
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative ${striped ? 'overflow-hidden' : ''}`}
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: activeColor,
            boxShadow: animated ? `0 0 10px ${activeColor}40` : 'none'
          }}
        >
          {striped && (
            <div 
              className="absolute inset-0 opacity-20 animate-[move-bg_1s_linear_infinite]"
              style={{
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.7) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.7) 75%, transparent 75%, transparent)',
                backgroundSize: '20px 20px'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderCircle = () => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: '120px', height: '120px' }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={barBackgroundColor}
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={activeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: animated ? `drop-shadow(0 0 4px ${activeColor}40)` : 'none' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
            {showPercentage && <span className="text-xl font-black" style={{ color: activeColor }}>{Math.round(percentage)}%</span>}
            {showValue && <span className="text-[10px] opacity-60">{value}/{max}</span>}
        </div>
      </div>
    );
  };

  const renderDash = () => {
    const segments = 10;
    const activeSegments = Math.round((percentage / 100) * segments);

    return (
      <div className="flex gap-1.5 w-full">
        {Array.from({ length: segments }).map((_, i) => (
          <div 
            key={i}
            className="flex-1 rounded-sm transition-all duration-500"
            style={{ 
              height: thickness,
              backgroundColor: i < activeSegments ? activeColor : barBackgroundColor,
              opacity: i < activeSegments ? 1 : 0.3,
              transform: i < activeSegments && animated ? 'scaleY(1.1)' : 'scaleY(1)',
              transitionDelay: `${i * 50}ms`
            }}
          />
        ))}
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
      <div className="flex flex-col items-center text-center p-2 w-full">
        {(showTitle || showDescription) && (
          <div className="mb-4 w-full">
            {showTitle && title && <h4 className="font-bold tracking-tight mb-1" style={{ fontSize: baseSize }}>{title}</h4>}
            {showDescription && description && <p className="text-xs opacity-60">{description}</p>}
          </div>
        )}

        <div className="w-full flex justify-center py-2">
            {style === 'line' && renderLine()}
            {style === 'circle' && renderCircle()}
            {style === 'dash' && renderDash()}
        </div>

        {style !== 'circle' && (showValue || showPercentage) && (
          <div className="w-full flex justify-between items-center mt-3 text-[11px] font-bold uppercase tracking-wider opacity-80">
            {showValue && <span>{value} / {max}</span>}
            {showPercentage && <span style={{ color: activeColor }}>{Math.round(percentage)}% complete</span>}
          </div>
        )}

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
