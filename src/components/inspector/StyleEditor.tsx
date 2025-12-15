import React, { useState } from 'react';
import { Block } from '../../schema/types';

interface StyleEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

interface StyleSection {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ block, onUpdate }) => {
  const [activeSection, setActiveSection] = useState('typography');

  // Background Mode State
  const [activeBgMode, setActiveBgMode] = useState<'solid' | 'gradient' | 'image'>('solid');

  // Gradient Configuration State (Local for builder)
  const [gradientConfig, setGradientConfig] = useState({
    type: 'linear',
    angle: 180,
    start: '#ffffff',
    end: '#000000'
  });

  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  // Type assertion to access style properties
  const styleProps = block.props as any;

  const typographySection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
        <select
          value={styleProps.fontFamily || 'inherit'}
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="inherit">Inherit</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="Helvetica, sans-serif">Helvetica</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Times New Roman, serif">Times New Roman</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
          <option value="Impact, sans-serif">Impact</option>
          <option value="Comic Sans MS, cursive">Comic Sans MS</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={styleProps.fontSize || ''}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            placeholder="16px"
          />
          <select
            value={styleProps.fontSize?.includes('rem') ? 'rem' : 'px'}
            onChange={(e) => {
              const currentSize = styleProps.fontSize || '16px';
              const numericValue = currentSize.replace(/[^\d.]/g, '');
              handleStyleChange('fontSize', `${numericValue}${e.target.value}`);
            }}
            className="w-16 p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="px">px</option>
            <option value="rem">rem</option>
            <option value="em">em</option>
            <option value="%">%</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
        <select
          value={styleProps.fontWeight || 'normal'}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
        <input
          type="text"
          value={styleProps.lineHeight || ''}
          onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="1.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing</label>
        <input
          type="text"
          value={styleProps.letterSpacing || ''}
          onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="0px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Transform</label>
        <select
          value={styleProps.textTransform || 'none'}
          onChange={(e) => handleStyleChange('textTransform', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Decoration</label>
        <select
          value={styleProps.textDecoration || 'none'}
          onChange={(e) => handleStyleChange('textDecoration', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="overline">Overline</option>
          <option value="line-through">Line Through</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
        <select
          value={styleProps.fontStyle || 'normal'}
          onChange={(e) => handleStyleChange('fontStyle', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="oblique">Oblique</option>
        </select>
      </div>
    </div>
  );

  const spacingSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Top</label>
            <input
              type="text"
              value={styleProps.paddingTop || ''}
              onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Right</label>
            <input
              type="text"
              value={styleProps.paddingRight || ''}
              onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bottom</label>
            <input
              type="text"
              value={styleProps.paddingBottom || ''}
              onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Left</label>
            <input
              type="text"
              value={styleProps.paddingLeft || ''}
              onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-xs text-gray-600 mb-1">All Sides</label>
          <input
            type="text"
            value={styleProps.padding || ''}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="0px"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Top</label>
            <input
              type="text"
              value={styleProps.marginTop || ''}
              onChange={(e) => handleStyleChange('marginTop', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Right</label>
            <input
              type="text"
              value={styleProps.marginRight || ''}
              onChange={(e) => handleStyleChange('marginRight', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Bottom</label>
            <input
              type="text"
              value={styleProps.marginBottom || ''}
              onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Left</label>
            <input
              type="text"
              value={styleProps.marginLeft || ''}
              onChange={(e) => handleStyleChange('marginLeft', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="0px"
            />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-xs text-gray-600 mb-1">All Sides</label>
          <input
            type="text"
            value={styleProps.margin || ''}
            onChange={(e) => handleStyleChange('margin', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            placeholder="0px"
          />
        </div>
      </div>
    </div>
  );

  const colorsSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={styleProps.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={styleProps.color || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            placeholder="#000000"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>

        {/* Background Type Selector */}
        <div className="flex bg-gray-100 p-1 rounded-md mb-3">
          {['solid', 'gradient', 'image'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveBgMode(type as any); // Update UI mode
                if (type === 'solid') {
                  handleStyleChange('backgroundImage', '');
                } else if (type === 'gradient' || type === 'image') {
                  handleStyleChange('backgroundColor', 'transparent');
                }
              }}
              // accessing bgMode from parent scope
              className={`flex-1 text-xs font-medium py-1 rounded capitalize ${(activeBgMode === type) ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {activeBgMode === 'solid' && (
          <div className="flex gap-2">
            <input
              type="color"
              value={styleProps.backgroundColor || '#ffffff'}
              onChange={(e) => {
                handleStyleChange('backgroundColor', e.target.value);
                handleStyleChange('backgroundImage', ''); // Clear gradient/image
              }}
              className="w-12 h-10 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={styleProps.backgroundColor || '#ffffff'}
              onChange={(e) => {
                handleStyleChange('backgroundColor', e.target.value);
                handleStyleChange('backgroundImage', '');
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              placeholder="#ffffff"
            />
          </div>
        )}

        {activeBgMode === 'gradient' && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                className="w-full p-1 text-sm border border-gray-300 rounded"
                onChange={(e) => {
                  const type = e.target.value;
                  setGradientConfig(prev => {
                    const next = { ...prev, type };
                    const val = next.type === 'radial'
                      ? `radial-gradient(circle, ${next.start}, ${next.end})`
                      : `linear-gradient(${next.angle}deg, ${next.start}, ${next.end})`;
                    handleStyleChange('backgroundImage', val);
                    return next;
                  });
                }}
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>

            {/* Simplified builder: always assumes 2 colors and angle if linear */}
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <input type="color" className="w-full h-8"
                  onChange={(e) => {
                    const start = e.target.value;
                    setGradientConfig(prev => {
                      const next = { ...prev, start };
                      const val = next.type === 'radial'
                        ? `radial-gradient(circle, ${next.start}, ${next.end})`
                        : `linear-gradient(${next.angle}deg, ${next.start}, ${next.end})`;
                      handleStyleChange('backgroundImage', val);
                      return next;
                    });
                  }}
                  value={gradientConfig.start}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input type="color" className="w-full h-8"
                  onChange={(e) => {
                    const endVal = e.target.value;
                    setGradientConfig(prev => {
                      const next = { ...prev, end: endVal };
                      const val = next.type === 'radial'
                        ? `radial-gradient(circle, ${next.start}, ${next.end})`
                        : `linear-gradient(${next.angle}deg, ${next.start}, ${next.end})`;
                      handleStyleChange('backgroundImage', val);
                      return next;
                    });
                  }}
                  value={gradientConfig.end}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Angle (deg)</label>
              <input type="range" min="0" max="360"
                value={gradientConfig.angle}
                onChange={(e) => {
                  const angle = parseInt(e.target.value);
                  setGradientConfig(prev => {
                    const next = { ...prev, angle };
                    const val = next.type === 'radial'
                      ? `radial-gradient(circle, ${next.start}, ${next.end})`
                      : `linear-gradient(${next.angle}deg, ${next.start}, ${next.end})`;
                    handleStyleChange('backgroundImage', val);
                    return next;
                  });
                }}
                className="w-full"
              />
              <div className="text-right text-xs text-gray-400">{gradientConfig.angle}°</div>
            </div>
          </div>
        )}

        {activeBgMode === 'image' && (
          <div className="space-y-2">
            <input
              type="text"
              value={styleProps.backgroundImage?.replace(/url\(['"]?(.+?)['"]?\)/, '$1') || ''}
              onChange={(e) => handleStyleChange('backgroundImage', `url('${e.target.value}')`)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Image URL (https://...)"
            />
            <div className="text-xs text-gray-500">
              <label className="flex items-center gap-2">
                <span>Size</span>
                <select
                  value={styleProps.backgroundSize || 'cover'}
                  onChange={e => handleStyleChange('backgroundSize', e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                </select>
              </label>
            </div>
          </div>
        )}

      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={styleProps.borderColor || '#000000'}
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={styleProps.borderColor || '#000000'}
            onChange={(e) => handleStyleChange('borderColor', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );

  const bordersSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
        <input
          type="text"
          value={styleProps.borderWidth || ''}
          onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="1px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Style</label>
        <select
          value={styleProps.borderStyle || 'solid'}
          onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
          <option value="groove">Groove</option>
          <option value="ridge">Ridge</option>
          <option value="inset">Inset</option>
          <option value="outset">Outset</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
        <input
          type="text"
          value={styleProps.borderRadius || ''}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="4px"
        />
      </div>
    </div>
  );

  const shadowsSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Box Shadow</label>
        <select
          value={styleProps.boxShadow || 'none'}
          onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="0 1px 2px 0 rgba(0, 0, 0, 0.05)">Small</option>
          <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">Medium</option>
          <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)">Large</option>
          <option value="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)">X-Large</option>
          <option value="inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)">Inner</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Shadow</label>
        <input
          type="text"
          value={styleProps.textShadow || ''}
          onChange={(e) => handleStyleChange('textShadow', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="1px 1px 2px rgba(0,0,0,0.5)"
        />
      </div>
    </div>
  );

  const layoutSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
        <input
          type="text"
          value={styleProps.width || ''}
          onChange={(e) => handleStyleChange('width', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="100%"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
        <input
          type="text"
          value={styleProps.height || ''}
          onChange={(e) => handleStyleChange('height', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="auto"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Width</label>
        <input
          type="text"
          value={styleProps.minWidth || ''}
          onChange={(e) => handleStyleChange('minWidth', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="0px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Width</label>
        <input
          type="text"
          value={styleProps.maxWidth || ''}
          onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Height</label>
        <input
          type="text"
          value={styleProps.minHeight || ''}
          onChange={(e) => handleStyleChange('minHeight', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="0px"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Height</label>
        <input
          type="text"
          value={styleProps.maxHeight || ''}
          onChange={(e) => handleStyleChange('maxHeight', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Display</label>
        <select
          value={styleProps.display || 'block'}
          onChange={(e) => handleStyleChange('display', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="block">Block</option>
          <option value="inline">Inline</option>
          <option value="inline-block">Inline Block</option>
          <option value="flex">Flex</option>
          <option value="inline-flex">Inline Flex</option>
          <option value="grid">Grid</option>
          <option value="inline-grid">Inline Grid</option>
          <option value="none">None</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
        <select
          value={styleProps.position || 'static'}
          onChange={(e) => handleStyleChange('position', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
        <input
          type="number"
          value={styleProps.zIndex || ''}
          onChange={(e) => handleStyleChange('zIndex', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="0"
        />
      </div>
    </div>
  );

  const sections: StyleSection[] = [
    { id: 'typography', title: 'Typography', icon: '🔤', component: typographySection },
    { id: 'spacing', title: 'Spacing', icon: '📏', component: spacingSection },
    { id: 'colors', title: 'Colors', icon: '🎨', component: colorsSection },
    { id: 'borders', title: 'Borders', icon: '🔲', component: bordersSection },
    { id: 'shadows', title: 'Shadows', icon: '🌫️', component: shadowsSection },
    { id: 'layout', title: 'Layout', icon: '📐', component: layoutSection },
  ];

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === section.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <span className="mr-1">{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sections.find(s => s.id === activeSection)?.component}
      </div>
    </div>
  );
};
