import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface ProgressBarBlockProps {
  id: string;
  type: 'progress-bar';
  props: {
    value?: number;
    max?: number;
    title?: string;
    description?: string;
    showPercentage?: boolean;
    showValue?: boolean;
    backgroundColor?: string;
    progressColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    height?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    animated?: boolean;
    striped?: boolean;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  };
}

export const ProgressBarBlock: React.FC<{
  block: ProgressBarBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    value = 65,
    max = 100,
    title = 'Progress',
    description = 'Current progress status',
    showPercentage = true,
    showValue = true,
    backgroundColor = '#f3f4f6',
    progressColor = '#3b82f6',
    textColor = '#1f2937',
    borderColor = '#e5e7eb',
    borderRadius = '8px',
    padding = '20px',
    margin = '0',
    height = '20px',
    fontSize = '16px',
    textAlign = 'left',
    animated = true,
    striped = false,
    size = 'medium',
    variant = 'default'
  } = block.props;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getVariantColor = (variant: string) => {
    switch (variant) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'info': return '#06b6d4';
      default: return progressColor;
    }
  };

  const getSizeHeight = (size: string) => {
    switch (size) {
      case 'small': return '8px';
      case 'large': return '32px';
      default: return height;
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding,
    margin,
    borderRadius,
    border: `1px solid ${borderColor}`,
    width: '100%',
  };

  const titleStyle: React.CSSProperties = {
    fontSize,
    fontWeight: '600',
    color: textColor,
    margin: '0 0 8px 0',
    textAlign,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 16px 0',
    textAlign,
  };

  const progressContainerStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius: '4px',
    height: getSizeHeight(size),
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '8px',
  };

  const progressBarStyle: React.CSSProperties = {
    backgroundColor: getVariantColor(variant),
    height: '100%',
    width: `${percentage}%`,
    borderRadius: '4px',
    transition: animated ? 'width 0.3s ease-in-out' : 'none',
    position: 'relative',
    overflow: 'hidden',
  };

  const stripedStyle: React.CSSProperties = striped ? {
    backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)',
    backgroundSize: '20px 20px',
    animation: animated ? 'progress-bar-stripes 1s linear infinite' : 'none',
  } : {};

  const valueStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: textColor,
    textAlign,
  };

  const percentageStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: getVariantColor(variant),
    textAlign,
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
      <div style={containerStyle}>
        {title && <h4 style={titleStyle}>{title}</h4>}
        {description && <p style={descriptionStyle}>{description}</p>}
        
        <div style={progressContainerStyle}>
          <div style={{ ...progressBarStyle, ...stripedStyle }}>
            {striped && animated && (
              <style>
                {`
                  @keyframes progress-bar-stripes {
                    0% { background-position: 0 0; }
                    100% { background-position: 20px 0; }
                  }
                `}
              </style>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {showValue && (
            <div style={valueStyle}>
              {value} / {max}
            </div>
          )}
          {showPercentage && (
            <div style={percentageStyle}>
              {Math.round(percentage)}%
            </div>
          )}
        </div>
        
        {!showValue && !showPercentage && (
          <div style={{ ...valueStyle, textAlign: 'center' }}>
            {Math.round(percentage)}% Complete
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
