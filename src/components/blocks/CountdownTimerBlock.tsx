import React, { useState, useEffect } from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface CountdownTimerBlockProps {
  id: string;
  type: 'countdown-timer';
  props: {
    targetDate?: string;
    title?: string;
    description?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    textAlign?: 'left' | 'center' | 'right';
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    format?: 'compact' | 'detailed' | 'minimal';
    fontSize?: string;
    fontWeight?: string;
    expiredMessage?: string;
    expiredActionText?: string;
    expiredActionUrl?: string;
  };
}

export const CountdownTimerBlock: React.FC<{
  block: CountdownTimerBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    title = 'Limited Time Offer',
    description = 'Hurry up! This offer expires soon.',
    backgroundColor = '#1f2937',
    textColor = '#ffffff',
    accentColor = '#ef4444',
    padding = '30px',
    borderRadius = '12px',
    border = 'none',
    textAlign = 'center',
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    format = 'detailed',
    expiredMessage = 'This offer has expired',
    expiredActionText = 'View Other Offers',
    expiredActionUrl = '#'
  } = block.props;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, total: difference });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding,
    borderRadius,
    border,
    textAlign,
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 10px 0',
    color: textColor,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    margin: '0 0 20px 0',
    color: textColor,
    opacity: 0.9,
  };

  const timerContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: format === 'compact' ? '8px' : '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const timeUnitStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: format === 'compact' ? '60px' : '80px',
  };

  const timeValueStyle: React.CSSProperties = {
    fontSize: format === 'compact' ? '24px' : '36px',
    fontWeight: '700',
    color: accentColor,
    lineHeight: 1,
    marginBottom: '4px',
  };

  const timeLabelStyle: React.CSSProperties = {
    fontSize: format === 'compact' ? '12px' : '14px',
    fontWeight: '500',
    color: textColor,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const expiredStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: accentColor,
    marginBottom: '16px',
  };

  const actionButtonStyle: React.CSSProperties = {
    backgroundColor: accentColor,
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const renderTimeUnit = (value: number, label: string, show: boolean) => {
    if (!show) return null;
    
    return (
      <div style={timeUnitStyle}>
        <div style={timeValueStyle}>
          {value.toString().padStart(2, '0')}
        </div>
        <div style={timeLabelStyle}>
          {label}
        </div>
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
      <div style={containerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        {description && <p style={descriptionStyle}>{description}</p>}
        
        {isExpired ? (
          <div>
            <div style={expiredStyle}>{expiredMessage}</div>
            {expiredActionText && (
              <a
                href={expiredActionUrl}
                style={actionButtonStyle}
                target="_blank"
                rel="noopener noreferrer"
              >
                {expiredActionText}
              </a>
            )}
          </div>
        ) : (
          <div style={timerContainerStyle}>
            {renderTimeUnit(timeLeft.days, 'Days', showDays)}
            {renderTimeUnit(timeLeft.hours, 'Hours', showHours)}
            {renderTimeUnit(timeLeft.minutes, 'Minutes', showMinutes)}
            {renderTimeUnit(timeLeft.seconds, 'Seconds', showSeconds)}
          </div>
        )}
        
        {format === 'minimal' && !isExpired && (
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {timeLeft.hours > 0 && `${timeLeft.hours}h `}
            {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
            {timeLeft.seconds > 0 && `${timeLeft.seconds}s`}
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
