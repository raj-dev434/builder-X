import React, { useState } from 'react';
import { Block } from '../../schema/types';

interface ResponsiveEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';


export const ResponsiveEditor: React.FC<ResponsiveEditorProps> = ({ block, onUpdate }) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('desktop');

  const handleStyleChange = (key: string, value: any) => {
    // For desktop, we use the base property. For others, we append the breakpoint name.
    const responsiveKey = activeBreakpoint === 'desktop' ? key : `${key}_${activeBreakpoint}`;
    onUpdate({
      props: {
        ...block.props,
        [responsiveKey]: value
      }
    } as any);
  };

  // Type assertion to access style properties
  const styleProps = block.props as any;

  const getCurrentValue = (key: string) => {
    const responsiveKey = activeBreakpoint === 'desktop' ? key : `${key}_${activeBreakpoint}`;
    // Fallback logic: if specific breakpoint value doesn't exist, fall back to base (desktop) value
    return styleProps[responsiveKey] !== undefined ? styleProps[responsiveKey] : (styleProps[key] || '');
  };

  const breakpoints = [
    { id: 'mobile', label: 'Mobile', icon: '📱', width: '375px' },
    { id: 'tablet', label: 'Tablet', icon: '📱', width: '768px' },
    { id: 'desktop', label: 'Desktop', icon: '💻', width: '1200px' },
  ] as const;

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Responsive Design</label>
        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          {breakpoints.map((breakpoint) => (
            <button
              key={breakpoint.id}
              onClick={() => setActiveBreakpoint(breakpoint.id as Breakpoint)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeBreakpoint === breakpoint.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="mr-1">{breakpoint.icon}</span>
              {breakpoint.label}
              <div className="text-xs opacity-75">{breakpoint.width}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Simplified for user request: "width, hight only changeable" */}

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input
            type="text"
            value={getCurrentValue('width')}
            onChange={(e) => handleStyleChange('width', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="e.g. 100% or 300px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <input
            type="text"
            value={getCurrentValue('height')}
            onChange={(e) => handleStyleChange('height', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="e.g. auto or 200px"
          />
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <button
            type="button"
            className="text-xs text-blue-600 font-medium flex items-center hover:text-blue-800"
            onClick={(e) => {
              const next = e.currentTarget.nextElementSibling;
              if (next) next.classList.toggle('hidden');
            }}
          >
            <span>Show Advanced Layout</span>
            <span className="ml-1">▼</span>
          </button>
          <div className="hidden space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display</label>
              <select
                value={getCurrentValue('display')}
                onChange={(e) => handleStyleChange('display', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="block">Block</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="flex">Flex</option>
                <option value="none">None (Hide)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
              <input
                type="text"
                value={getCurrentValue('padding')}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="16px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
              <input
                type="text"
                value={getCurrentValue('margin')}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                placeholder="0px"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <div className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> Set different values for each breakpoint to create responsive designs.
          The styles will automatically apply based on screen size.
        </div>
      </div>
    </div>
  );
};
