import React from 'react';
import { BaseBlock } from './BaseBlock';
import { ProgressBlock as ProgressBlockType } from '../../schema/types';

interface ProgressBlockProps {
  block: ProgressBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ProgressBlockType>) => void;
  onDelete: () => void;
}

export const ProgressBlock: React.FC<ProgressBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    value = 50,
    max = 100,
    title = 'Progress', // Unified with label
    label, // Backward compatibility
    showTitle = true,
    showPercentage = true,
    showValue = false,
    description,
    showDescription = false,
    size = 'medium',
    animated = true,
    striped = false,
    style = 'line',
    thickness,
    variant = 'default',
    progressColor,
    barBackgroundColor,
    ...styleProps
  } = block.props as any;

  const displayTitle = title || label;

  const handleValueChange = (newValue: number) => {
    onUpdate({ props: { ...block.props, value: newValue } });
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ props: { ...block.props, title: newTitle, label: newTitle } as any });
  };

  const percentage = Math.round((value / max) * 100);

  // Variant Colors
  const getVariantColor = () => {
    if (progressColor) return progressColor;
    switch (variant) {
      case 'success': return '#22c55e'; // green-500
      case 'warning': return '#f59e0b'; // amber-500
      case 'danger': return '#ef4444'; // red-500
      case 'info': return '#3b82f6'; // blue-500
      default: return '#3b82f6'; // blue-500 (default)
    }
  };

  const themeColor = getVariantColor();
  const trackColor = barBackgroundColor || '#e9ecef';

  const getSizeStyles = () => {
    if (thickness) return { height: thickness }; // Custom thickness overrides size presets for line

    switch (size) {
      case 'small': return { height: '0.5rem', fontSize: '0.75rem' };
      case 'large': return { height: '1.5rem', fontSize: '1rem' };
      default: return { height: '1rem', fontSize: '0.875rem' };
    }
  };

  const renderLineProgress = () => (
    <div
      style={{
        width: '100%',
        backgroundColor: trackColor,
        borderRadius: '9999px', // Rounded pill shape usually looks better
        overflow: 'hidden',
        ...getSizeStyles()
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: themeColor,
          transition: animated ? 'width 0.3s ease' : 'none',
          backgroundImage: striped
            ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)'
            : 'none',
          backgroundSize: striped ? '1rem 1rem' : 'auto',
          animation: (striped && animated) ? 'progress-bar-stripes 1s linear infinite' : 'none'
        }}
      />
      {/* Add keyframes for stripe animation globally or via styled-components implies style tag here */}
      {(striped && animated) && (
        <style>{`
          @keyframes progress-bar-stripes {
            from { background-position: 1rem 0; }
            to { background-position: 0 0; }
          }
        `}</style>
      )}
    </div>
  );

  const renderCircleProgress = () => {
    const sizeMap = { small: 80, medium: 120, large: 160 };
    const circleSize = parseInt(thickness?.replace('px', '') || '') || sizeMap[size as keyof typeof sizeMap] || 120;
    const strokeWidth = circleSize / 10;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: circleSize, height: circleSize, margin: '0 auto' }}>
        <svg
          width={circleSize}
          height={circleSize}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Indicator */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke={themeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column'
        }}>
          {showPercentage && <span style={{ fontSize: circleSize * 0.2, fontWeight: 'bold', color: styleProps.color }}>{percentage}%</span>}
          {showValue && <span style={{ fontSize: circleSize * 0.15, color: '#666' }}>{value}/{max}</span>}
        </div>
      </div>
    );
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      style={styleProps}
    >
      <div style={{ width: '100%' }}>
        {/* Header: Title & Value (for Line style) */}
        {(showTitle && displayTitle) && style !== 'circle' && (
          <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
              style={{ fontWeight: '500', outline: 'none' }}
            >
              {displayTitle}
            </span>
            <div className="text-sm text-gray-500">
              {showPercentage && <span>{percentage}%</span>}
              {showValue && <span style={{ marginLeft: '8px' }}>({value}/{max})</span>}
            </div>
          </div>
        )}

        {/* Progress Display */}
        {style === 'circle' ? renderCircleProgress() : renderLineProgress()}

        {/* Header: Title (for Circle style - centered below or above, but let's put it below for now) */}
        {(showTitle && displayTitle) && style === 'circle' && (
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontWeight: '500' }}>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
              style={{ outline: 'none' }}
            >{displayTitle}</span>
          </div>
        )}

        {/* Description */}
        {showDescription && description && (
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', textAlign: style === 'circle' ? 'center' : 'left' }}>
            {description}
          </p>
        )}

        {/* Editor Controls */}
        {isSelected && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '4px', color: '#6b7280' }}>Adjust Value: {value}</label>
            <input
              type="range"
              min="0"
              max={max}
              value={value}
              onChange={(e) => handleValueChange(parseInt(e.target.value))}
              style={{ width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
