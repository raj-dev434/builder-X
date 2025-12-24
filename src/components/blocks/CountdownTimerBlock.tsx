import React, { useState, useEffect } from 'react';
import { BaseBlock } from './BaseBlock';
import { Block, CountdownTimerBlock as CountdownTimerBlockType } from '../../schema/types';

export const CountdownTimerBlock: React.FC<{
  block: CountdownTimerBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { 
    targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    title = 'Limited Time Offer',
    showTitle = true,
    description = 'Hurry up! This offer expires soon.',
    showDescription = true,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    format = 'card',
    accentColor = '#ef4444',
    labelColor = 'inherit',
    digitBgColor = 'rgba(0,0,0,0.1)',
    digitTextColor = 'inherit',
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

  const renderTimeUnit = (value: number, label: string, show: boolean) => {
    if (!show) return null;
    
    const formattedValue = value.toString().padStart(2, '0');

    if (format === 'card') {
      return (
        <div className="flex flex-col items-center min-w-[70px]">
          <div 
            className="w-full aspect-square flex items-center justify-center rounded-lg mb-1.5 shadow-sm border border-black/5"
            style={{ backgroundColor: digitBgColor, color: digitTextColor }}
          >
            <span className="text-3xl font-bold tabular-nums leading-none">{formattedValue}</span>
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest opacity-60" style={{ color: labelColor }}>
            {label}
          </span>
        </div>
      );
    }

    if (format === 'simple') {
      return (
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-4xl font-black tabular-nums leading-none tracking-tighter" style={{ color: accentColor }}>
            {formattedValue}
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider opacity-70 mt-1" style={{ color: labelColor }}>
            {label}
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold tabular-nums" style={{ color: accentColor }}>{formattedValue}</span>
        <span className="text-[10px] font-medium opacity-60 lowercase" style={{ color: labelColor }}>{label[0]}</span>
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
      className="w-full relative overflow-hidden"
    >
      <div className="flex flex-col items-center text-center p-2">
        {showTitle && title && (
          <h3 className="text-2xl font-black tracking-tight mb-2 leading-tight">
            {title}
          </h3>
        )}
        {showDescription && description && (
          <p className="text-sm opacity-80 mb-6 max-w-md">
            {description}
          </p>
        )}
        
        {isExpired ? (
          <div className="flex flex-col items-center py-4 px-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            <div className="text-xl font-bold mb-4" style={{ color: accentColor }}>{expiredMessage}</div>
            {expiredActionText && (
              <a
                href={expiredActionUrl}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
                style={{ backgroundColor: accentColor, color: '#fff' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {expiredActionText}
              </a>
            )}
          </div>
        ) : (
          <div className={`flex items-center justify-center ${format === 'minimal' ? 'space-x-4' : 'space-x-3 md:space-x-6'} animate-in fade-in slide-in-from-bottom-4 duration-700`}>
            {renderTimeUnit(timeLeft.days, 'Days', showDays)}
            {renderTimeUnit(timeLeft.hours, 'Hours', showHours)}
            {renderTimeUnit(timeLeft.minutes, 'Minutes', showMinutes)}
            {renderTimeUnit(timeLeft.seconds, 'Seconds', showSeconds)}
          </div>
        )}
      </div>
    </BaseBlock>
  );
};
