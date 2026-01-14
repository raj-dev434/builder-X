import React from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';

export interface DividerBlockProps {
  id: string;
  type: 'divider';
  props: {
    thickness?: string;
    color?: string;
    style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'wavy' | 'zigzag' | 'curly' | 'curved' | 'slashes' | 'squared' | 'arrows' | 'pluses' | 'crosses' | 'circles' | 'diamonds' | 'stars';
    width?: string;
    margin?: string;
    padding?: string;
  };
}

export const DividerBlock: React.FC<{
  block: DividerBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const { thickness = '2px', color = '#e5e7eb', style = 'solid', width = '100%' } = block.props;

  const strokeWidth = parseInt(thickness.replace('px', '')) || 2;

  const renderDividerLine = () => {
    switch (style) {
      // Standard CSS borders
      case 'solid':
      case 'dashed':
      case 'dotted':
      case 'double': {
        return (
          <div
            style={{
              width: '100%',
              height: 0,
              border: 'none',
              borderTop: `${/\d$/.test(thickness) ? `${thickness}px` : thickness} ${style} ${color}`
            }}
          />
        );
      }

      // SVG Pattern: Wavy
      case 'wavy': {
        const patternId = `wavy-${block.id}`;
        return (
          <svg width="100%" height="24" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="20" height="16" patternUnits="userSpaceOnUse">
                <path d="M0,8 Q5,16 10,8 T20,8" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
              </pattern>
            </defs>
            <rect width="100%" height="16" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Zigzag
      case 'zigzag': {
        const patternId = `zigzag-${block.id}`;
        return (
          <svg width="100%" height="24" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="20" height="16" patternUnits="userSpaceOnUse">
                <path d="M0,8 L5,0 L10,8 L15,16 L20,8" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="square" />
              </pattern>
            </defs>
            <rect width="100%" height="16" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Curly
      case 'curly': {
        const patternId = `curly-${block.id}`;
        return (
          <svg width="100%" height="28" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="20" height="24" patternUnits="userSpaceOnUse">
                <path d="M0,12 Q5,24 10,12 T20,12" fill="none" stroke={color} strokeWidth={strokeWidth} />
              </pattern>
            </defs>
            <rect width="100%" height="24" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Curved
      case 'curved': {
        const patternId = `curved-${block.id}`;
        return (
          <svg width="100%" height="32" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="40" height="28" patternUnits="userSpaceOnUse">
                <path d="M0,14 Q10,0 20,14 T40,14" fill="none" stroke={color} strokeWidth={strokeWidth} />
              </pattern>
            </defs>
            <rect width="100%" height="28" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Slashes
      case 'slashes': {
        const patternId = `slashes-${block.id}`;
        return (
          <svg width="100%" height="12" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,10 L10,0" fill="none" stroke={color} strokeWidth={strokeWidth} />
              </pattern>
            </defs>
            <rect width="100%" height="10" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Squared
      case 'squared': {
        const patternId = `squared-${block.id}`;
        return (
          <svg width="100%" height="12" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 H5 V0 H10 V10 H15 V5 H20" fill="none" stroke={color} strokeWidth={strokeWidth} />
              </pattern>
            </defs>
            <rect width="100%" height="10" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Arrows
      case 'arrows': {
        const patternId = `arrows-${block.id}`;
        return (
          <svg width="100%" height="12" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="15" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,0 L7.5,5 L0,10" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
              </pattern>
            </defs>
            <rect width="100%" height="10" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Pluses
      case 'pluses': {
        const patternId = `pluses-${block.id}`;
        return (
          <svg width="100%" height="12" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
                <path d="M5,5 H15 M10,0 V10" fill="none" stroke={color} strokeWidth={strokeWidth} />
              </pattern>
            </defs>
            <rect width="100%" height="10" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Crosses
      case 'crosses': {
        const patternId = `crosses-${block.id}`;
        return (
          <svg width="100%" height="12" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="15" height="10" patternUnits="userSpaceOnUse">
                <path d="M2.5,0 L12.5,10 M2.5,10 L12.5,0" fill="none" stroke={color} strokeWidth={strokeWidth} />
              </pattern>
            </defs>
            <rect width="100%" height="10" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Circles
      case 'circles': {
        const patternId = `circles-${block.id}`;
        return (
          <svg width="100%" height="17" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <circle cx="7.5" cy="7.5" r="3" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="15" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Diamonds
      case 'diamonds': {
        const patternId = `diamonds-${block.id}`;
        return (
          <svg width="100%" height="17" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M7.5,2.5 L12.5,7.5 L7.5,12.5 L2.5,7.5 Z" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="15" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      // SVG Pattern: Stars
      case 'stars': {
        const patternId = `stars-${block.id}`;
        return (
          <svg width="100%" height="22" style={{ display: 'block' }}>
            <defs>
              <pattern id={patternId} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="20" fill={`url(#${patternId})`} />
          </svg>
        );
      }

      default:
        return (
          <div
            style={{
              width: '100%',
              height: 0,
              borderTop: `2px solid ${color}`
            }}
          />
        );
    }
  };

  // Clear all border/outline properties - be very aggressive
  const blockWithoutBorders = {
    ...block,
    props: {
      ...block.props,
      border: 'none',
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderWidth: '0',
      borderTopWidth: '0',
      borderBottomWidth: '0',
      borderLeftWidth: '0',
      borderRightWidth: '0',
      borderStyle: 'none',
      borderColor: 'transparent',
      outline: 'none',
      outlineWidth: '0',
      outlineStyle: 'none',
      outlineColor: 'transparent',
      boxShadow: 'none'
    }
  };

  return (
    <>
      <style>{`
        [data-block-type="divider"],
        [data-block-type="divider"] > *,
        [data-block-type="divider"] * {
          border: none !important;
          border-top: none !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          border-width: 0 !important;
          outline: none !important;
          outline-width: 0 !important;
          box-shadow: none !important;
        }
        /* Override any potential BaseBlock borders */
        div[data-block-type="divider"].relative {
          border: none !important;
          outline: none !important;
        }
      `}</style>
      <BaseBlock
        block={blockWithoutBorders as any}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onDelete={onDelete}
        className="w-full cursor-pointer"
        style={{
          width: width,
          border: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderWidth: 0,
          outline: 'none',
          outlineWidth: 0,
          boxShadow: 'none',
          background: 'transparent',
          padding: '20px 0'
        }}
      >
        {/* Render the divider line directly without extra wrappers */}
        {/* Key forces re-render when style changes */}
        <div key={`${style}-${color}-${thickness}`}>
          {renderDividerLine()}
        </div>
      </BaseBlock>
    </>
  );
};
