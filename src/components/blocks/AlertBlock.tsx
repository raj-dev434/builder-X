import React, { useEffect } from 'react';
import { BaseBlock } from './BaseBlock';
import { AlertBlock as AlertBlockType } from '../../schema/types';
import { useInlineEditing } from '../../hooks/useInlineEditing';
import { ArrowRight, X, Info, CheckCircle, AlertTriangle, XCircle, Bell, Star, Flag } from 'lucide-react';

interface AlertBlockProps {
  block: AlertBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<AlertBlockType>) => void;
  onDelete: () => void;
}

export const AlertBlock: React.FC<AlertBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}) => {
  const {
    text = 'This is an alert message',
    type = 'info',
    dismissible = true,
    autoDismiss = false,
    dismissDuration = 5000,
    showIcon = true,
    icon,
    title,
    showTitle = true,
    actionLabel,
    actionLink,
    accentBorder = false,
    iconType = 'default',
    shadow = 'sm',
    textAlign = 'left',
  } = block.props;

  const {
    textRef,
    isEditing,
    handleDoubleClick,
    handleBlur,
    handleKeyDown
  } = useInlineEditing<HTMLDivElement>({
    text,
    onUpdate: (newText) => onUpdate({ props: { ...block.props, text: newText } }),
    isSelected
  });

  // Auto Dismiss Logic
  useEffect(() => {
    if (autoDismiss && !isSelected) {
       const timer = setTimeout(() => {
       }, dismissDuration);
       return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissDuration, isSelected]);

  const getVariantStyles = () => {
    const isGradient = (block.props as any).backgroundType === 'gradient';
    const base = accentBorder ? 'border-l-4' : 'border';
    
    if (isGradient) {
       return `${base} border-opacity-50`; 
    }

    switch (type) {
      case 'success':
        return `${base} bg-green-50 text-green-900 border-green-500`;
      case 'warning':
        return `${base} bg-yellow-50 text-yellow-900 border-yellow-500`;
      case 'error':
        return `${base} bg-red-50 text-red-900 border-red-500`;
      default:
        return `${base} bg-blue-50 text-blue-900 border-blue-500`;
    }
  };

  const getShadowClass = () => {
    switch (shadow) {
      case 'none': return 'shadow-none';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      default: return 'shadow-sm';
    }
  };



  const getIcon = () => {
    if (icon) return <span className="text-xl">{icon}</span>;

    const iconClass = "w-5 h-5 flex-shrink-0 mt-0.5";

    // Custom Icon Selection
    if (iconType && iconType !== 'default') {
       switch (iconType) {
         case 'info': return <Info className={iconClass} />;
         case 'check': return <CheckCircle className={iconClass} />;
         case 'warning': return <AlertTriangle className={iconClass} />;
         case 'error': return <XCircle className={iconClass} />;
         case 'bell': return <Bell className={iconClass} />;
         case 'star': return <Star className={iconClass} />;
         case 'flag': return <Flag className={iconClass} />;
       }
    }
    
    // Default Fallback based on Type
    switch (type) {
      case 'success': return <CheckCircle className={iconClass} />;
      case 'warning': return <AlertTriangle className={iconClass} />;
      case 'error':   return <XCircle className={iconClass} />;
      default:        return <Info className={iconClass} />;
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full"
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-md transition-all
          ${getVariantStyles()}
          ${getShadowClass()}
        `}
        role="alert"
        onDoubleClick={handleDoubleClick}
      >
        {showIcon && getIcon()}

        <div className={`flex-1 min-w-0 text-${textAlign}`}>
          {showTitle && title && (
            <h5 className="font-bold mb-1 leading-tight">{title}</h5>
          )}
          
          <div
            ref={textRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            className="outline-none text-sm opacity-90 leading-relaxed"
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{ cursor: isEditing ? 'text' : 'inherit' }}
          >
            {text}
          </div>

          {actionLabel && (
             <a 
               href={actionLink || '#'} 
               className={`inline-flex items-center gap-1 mt-3 text-xs font-bold uppercase tracking-wider opacity-80 hover:opacity-100 hover:underline ${textAlign === 'right' ? 'flex-row-reverse' : ''}`}
               onClick={(e) => e.stopPropagation()}
             >
               {actionLabel} <ArrowRight size={12} />
             </a>
          )}
        </div>

        {dismissible && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex-shrink-0 p-1 opacity-40 hover:opacity-100 transition-opacity rounded hover:bg-black/5"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </BaseBlock>
  );
};
