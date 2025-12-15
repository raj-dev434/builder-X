import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useThemeStore } from '../../store/themeStore';
import { useAssetStore } from '../../store/assetStore';
import { Block } from '../../schema/types';


const findBlockById = (blocks: Block[], id: string): Block | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return null;
};

interface PropertyInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  type?: 'text' | 'number' | 'color' | 'select' | 'range' | 'textarea';
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  options,
  min,
  max,
  step,
  placeholder
}) => {
  const { colors } = useThemeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const themeColorMap: { name: string; cssVar: string; color: string; emoji: string }[] = [
    { name: 'Primary', cssVar: 'var(--color-primary)', color: colors.primary, emoji: '🔵' },
    { name: 'Secondary', cssVar: 'var(--color-secondary)', color: colors.secondary, emoji: '⚪' },
    { name: 'Accent', cssVar: 'var(--color-accent)', color: colors.accent, emoji: '💜' },
    { name: 'Success', cssVar: 'var(--color-success)', color: colors.success, emoji: '✅' },
    { name: 'Warning', cssVar: 'var(--color-warning)', color: colors.warning, emoji: '⚠️' },
    { name: 'Error', cssVar: 'var(--color-error)', color: colors.error, emoji: '❌' },
    { name: 'Background', cssVar: 'var(--color-background)', color: colors.background, emoji: '⬜' },
    { name: 'Text', cssVar: 'var(--color-text)', color: colors.text, emoji: '📝' },
  ];

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>

      {/* Theme Color Palette for color inputs */}
      {type === 'color' && (
        <div className="mb-2">
          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <span>🎨 Theme Colors</span>
          </div>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {themeColorMap.map(({ name, cssVar, color, emoji }) => (
              <button
                key={cssVar}
                type="button"
                onClick={() => onChange(cssVar)}
                className={`h-8 rounded border-2 transition-all hover:scale-105 ${value === cssVar ? 'border-blue-400 ring-2 ring-blue-400' : 'border-gray-600'
                  }`}
                style={{ backgroundColor: color }}
                title={`${emoji} ${name} (Theme)`}
              >
                {value === cssVar && <span className="text-white text-xs">✓</span>}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mb-1">Custom Color</div>
        </div>
      )}

      {type === 'select' && options ? (
        <select
          value={value || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : type === 'range' ? (
        <div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value || 0}
            onChange={handleChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-xs text-gray-400 mt-1">{value || 0}</div>
        </div>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

const SectionBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const openAssetModal = useAssetStore((state) => state.openModal);
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Appearance</h3>

        <PropertyInput
          label="Background Color"
          value={props.backgroundColor}
          onChange={(value) => updateProp('backgroundColor', value)}
          type="color"
        />

        <div className="pt-2 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">Background Image</label>

          <div className="flex space-x-2 items-end">
            <div className="flex-1">
              <PropertyInput
                label="Image URL"
                value={props.backgroundImage}
                onChange={(value) => updateProp('backgroundImage', value)}
                type="text"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="mb-3">
              <button
                className="w-full bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md flex items-center justify-center transition-colors border border-gray-600 h-[38px]"
                title="Select from Asset Library"
                onClick={() => openAssetModal((url) => updateProp('backgroundImage', url))}
              >
                <span className="text-xl leading-none mr-2">🖼️</span>
                <span className="text-sm">Select Image</span>
              </button>
            </div>
          </div>

          {props.backgroundImage && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <PropertyInput
                label="Size"
                value={props.backgroundSize}
                onChange={(value) => updateProp('backgroundSize', value)}
                type="select"
                options={[
                  { value: 'cover', label: 'Cover' },
                  { value: 'contain', label: 'Contain' },
                  { value: 'auto', label: 'Auto' },
                  { value: '100% 100%', label: 'Stretch' }
                ]}
              />
              <PropertyInput
                label="Position"
                value={props.backgroundPosition}
                onChange={(value) => updateProp('backgroundPosition', value)}
                type="select"
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                  { value: 'top left', label: 'Top Left' },
                  { value: 'top right', label: 'Top Right' },
                  { value: 'bottom left', label: 'Bottom Left' },
                  { value: 'bottom right', label: 'Bottom Right' }
                ]}
              />
              <PropertyInput
                label="Repeat"
                value={props.backgroundRepeat}
                onChange={(value) => updateProp('backgroundRepeat', value)}
                type="select"
                options={[
                  { value: 'no-repeat', label: 'No Repeat' },
                  { value: 'repeat', label: 'Repeat' },
                  { value: 'repeat-x', label: 'Repeat X' },
                  { value: 'repeat-y', label: 'Repeat Y' }
                ]}
              />
              <PropertyInput
                label="Attachment"
                value={props.backgroundAttachment}
                onChange={(value) => updateProp('backgroundAttachment', value)}
                type="select"
                options={[
                  { value: 'scroll', label: 'Scroll' },
                  { value: 'fixed', label: 'Fixed (Parallax)' },
                ]}
              />
              <div className="col-span-2 mt-1">
                <PropertyInput
                  label="Image Opacity"
                  value={props.backgroundOpacity ?? 1}
                  onChange={(value) => updateProp('backgroundOpacity', Number(value))}
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">Overlay</label>
          <PropertyInput
            label="Overlay Color"
            value={props.overlayColor}
            onChange={(value) => updateProp('overlayColor', value)}
            type="color"
          />
          <PropertyInput
            label="Overlay Opacity"
            value={props.overlayOpacity}
            onChange={(value) => updateProp('overlayOpacity', value)}
            type="range"
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        <div className="pt-2 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">Global Effects</label>
          <PropertyInput
            label="Global Opacity"
            value={props.opacity}
            onChange={(value) => updateProp('opacity', value)}
            type="range"
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Layout</h3>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
            placeholder="2rem"
          />
          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
            placeholder="0"
          />
        </div>

        <PropertyInput
          label="Min Height"
          value={props.minHeight}
          onChange={(value) => updateProp('minHeight', value)}
          type="text"
          placeholder="100px"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Border & Shadow</h3>
        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="select"
            options={[
              { value: '0', label: 'None' },
              { value: '2px', label: 'Small' },
              { value: '4px', label: 'Medium' },
              { value: '8px', label: 'Large' },
              { value: '16px', label: 'Extra Large' },
              { value: '9999px', label: 'Full (Round)' }
            ]}
          />
          <PropertyInput
            label="Box Shadow"
            value={props.boxShadow}
            onChange={(value) => updateProp('boxShadow', value)}
            type="select"
            options={[
              { value: 'none', label: 'None' },
              { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', label: 'Small' },
              { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', label: 'Medium' },
              { value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', label: 'Large' },
              { value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', label: 'Extra Large' }
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Border Width"
            value={props.borderWidth}
            onChange={(value) => updateProp('borderWidth', value)}
            type="select"
            options={[
              { value: '0', label: '0' },
              { value: '1px', label: '1px' },
              { value: '2px', label: '2px' },
              { value: '4px', label: '4px' },
              { value: '8px', label: '8px' }
            ]}
          />
          <PropertyInput
            label="Border Style"
            value={props.borderStyle || 'none'}
            onChange={(value) => updateProp('borderStyle', value)}
            type="select"
            options={[
              { value: 'none', label: 'None' },
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'double', label: 'Double' }
            ]}
          />
        </div>

        <PropertyInput
          label="Border Color"
          value={props.borderColor || '#000000'}
          onChange={(value) => updateProp('borderColor', value)}
          type="color"
        />
      </div>
    </div>
  );
};

const ColumnBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Layout & Flex</h3>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Flex"
            value={props.flex}
            onChange={(value) => updateProp('flex', value)}
            type="text"
            placeholder="1"
          />
          <PropertyInput
            label="Flex Direction"
            value={props.flexDirection}
            onChange={(value) => updateProp('flexDirection', value)}
            type="select"
            options={[
              { value: 'column', label: 'Column' },
              { value: 'row', label: 'Row' },
              { value: 'column-reverse', label: 'Column Reverse' },
              { value: 'row-reverse', label: 'Row Reverse' }
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Justify Content"
            value={props.justifyContent}
            onChange={(value) => updateProp('justifyContent', value)}
            type="select"
            options={[
              { value: 'flex-start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'End' },
              { value: 'space-between', label: 'Space Between' },
              { value: 'space-around', label: 'Space Around' },
              { value: 'space-evenly', label: 'Space Evenly' }
            ]}
          />
          <PropertyInput
            label="Align Items"
            value={props.alignItems}
            onChange={(value) => updateProp('alignItems', value)}
            type="select"
            options={[
              { value: 'stretch', label: 'Stretch' },
              { value: 'flex-start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'End' },
              { value: 'baseline', label: 'Baseline' }
            ]}
          />
        </div>

        <PropertyInput
          label="Gap"
          value={props.gap}
          onChange={(value) => updateProp('gap', value)}
          type="text"
          placeholder="0.5rem"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Dimensions</h3>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Width"
            value={props.width}
            onChange={(value) => updateProp('width', value)}
            type="text"
            placeholder="auto"
          />
          <PropertyInput
            label="Height"
            value={props.height}
            onChange={(value) => updateProp('height', value)}
            type="text"
            placeholder="auto"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Min Width"
            value={props.minWidth}
            onChange={(value) => updateProp('minWidth', value)}
            type="text"
            placeholder="0"
          />
          <PropertyInput
            label="Max Width"
            value={props.maxWidth}
            onChange={(value) => updateProp('maxWidth', value)}
            type="text"
            placeholder="none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Min Height"
            value={props.minHeight}
            onChange={(value) => updateProp('minHeight', value)}
            type="text"
            placeholder="0"
          />
          <PropertyInput
            label="Max Height"
            value={props.maxHeight}
            onChange={(value) => updateProp('maxHeight', value)}
            type="text"
            placeholder="none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Spacing</h3>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
            placeholder="1rem"
          />
          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Appearance</h3>

        <PropertyInput
          label="Background Color"
          value={props.backgroundColor}
          onChange={(value) => updateProp('backgroundColor', value)}
          type="color"
        />

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
            placeholder="0"
          />
          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
            placeholder="none"
          />
        </div>

        <PropertyInput
          label="Box Shadow"
          value={props.boxShadow}
          onChange={(value) => updateProp('boxShadow', value)}
          type="text"
          placeholder="none"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Overflow</h3>

        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="Overflow X"
            value={props.overflowX}
            onChange={(value) => updateProp('overflowX', value)}
            type="select"
            options={[
              { value: 'visible', label: 'Visible' },
              { value: 'hidden', label: 'Hidden' },
              { value: 'scroll', label: 'Scroll' },
              { value: 'auto', label: 'Auto' }
            ]}
          />
          <PropertyInput
            label="Overflow Y"
            value={props.overflowY}
            onChange={(value) => updateProp('overflowY', value)}
            type="select"
            options={[
              { value: 'visible', label: 'Visible' },
              { value: 'hidden', label: 'Hidden' },
              { value: 'scroll', label: 'Scroll' },
              { value: 'auto', label: 'Auto' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const TextBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Text Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Content"
            value={props.content}
            onChange={(value) => updateProp('content', value)}
            type="text"
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Weight"
            value={props.fontWeight}
            onChange={(value) => updateProp('fontWeight', value)}
            type="select"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Bold' },
              { value: '100', label: '100' },
              { value: '200', label: '200' },
              { value: '300', label: '300' },
              { value: '400', label: '400' },
              { value: '500', label: '500' },
              { value: '600', label: '600' },
              { value: '700', label: '700' },
              { value: '800', label: '800' },
              { value: '900', label: '900' }
            ]}
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="select"
            options={[
              { value: 'Inter, sans-serif', label: 'Inter' },
              { value: "'Roboto', sans-serif", label: 'Roboto' },
              { value: "'Open Sans', sans-serif", label: 'Open Sans' },
              { value: "'Lato', sans-serif", label: 'Lato' },
              { value: "'Montserrat', sans-serif", label: 'Montserrat' },
              { value: "'Poppins', sans-serif", label: 'Poppins' },
              { value: "'Playfair Display', serif", label: 'Playfair Display' },
              { value: "'Merriweather', serif", label: 'Merriweather' },
              { value: "'Courier New', monospace", label: 'Courier New' },
              { value: 'Arial, sans-serif', label: 'Arial' },
              { value: "'Times New Roman', serif", label: 'Times New Roman' }
            ]}
          />

          <PropertyInput
            label="Line Height"
            value={props.lineHeight}
            onChange={(value) => updateProp('lineHeight', value)}
            type="text"
          />

          <PropertyInput
            label="Letter Spacing"
            value={props.letterSpacing}
            onChange={(value) => updateProp('letterSpacing', value)}
            type="text"
          />

          <PropertyInput
            label="Text Align"
            value={props.textAlign}
            onChange={(value) => updateProp('textAlign', value)}
            type="select"
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' }
            ]}
          />

          <PropertyInput
            label="Text Transform"
            value={props.textTransform}
            onChange={(value) => updateProp('textTransform', value)}
            type="select"
            options={[
              { value: 'none', label: 'None' },
              { value: 'uppercase', label: 'Uppercase' },
              { value: 'lowercase', label: 'Lowercase' },
              { value: 'capitalize', label: 'Capitalize' }
            ]}
          />

          <PropertyInput
            label="Text Decoration"
            value={props.textDecoration}
            onChange={(value) => updateProp('textDecoration', value)}
            type="select"
            options={[
              { value: 'none', label: 'None' },
              { value: 'underline', label: 'Underline' },
              { value: 'overline', label: 'Overline' },
              { value: 'line-through', label: 'Line Through' }
            ]}
          />

          <PropertyInput
            label="Font Style"
            value={props.fontStyle}
            onChange={(value) => updateProp('fontStyle', value)}
            type="select"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'italic', label: 'Italic' },
              { value: 'oblique', label: 'Oblique' }
            ]}
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Text Shadow"
            value={props.textShadow}
            onChange={(value) => updateProp('textShadow', value)}
            type="text"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />

          <PropertyInput
            label="Opacity"
            value={props.opacity}
            onChange={(value) => updateProp('opacity', value)}
            type="range"
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
};

const ImageBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const openAssetModal = useAssetStore((state) => state.openModal);
  
  // ALWAYS use block.props directly
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };



  // Keep props variable for JSX only (it will re-render when block updates)
  const props = block.props as any;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Image Properties</h3>

        {/* Upload Section */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Image</h4>
            <div className="flex gap-2">
               {props.src && (
              <button
                onClick={() => updateProp('src', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
            </div>
           
          </div>

          {/* New URL Input */}
           <div className="mb-3">
            <PropertyInput
              label="Image URL"
              value={props.src}
              onChange={(value) => updateProp('src', value)}
              type="text"
              placeholder="https://example.com/image.jpg"
            />
            <div className="text-xs text-gray-400 mt-1">
              Must be a direct link to an image file (ending in .jpg, .png, etc.)
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4">
            {props.src ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-md">
                  <img
                    src={props.src}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {props.src.length > 30 ? props.src.substring(0, 30) + '...' : props.src}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm text-gray-400">No image</p>
              </div>
            )}

            <button
              onClick={() => openAssetModal((url) => updateProp('src', url))}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md w-full"
            >
              Select from Library
            </button>
          </div>
        </div>

        {/* Image Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Width"
              value={props.width}
              onChange={(value) => updateProp('width', value)}
              type="text"
              placeholder="100%"
            />

            <PropertyInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProp('height', value)}
              type="text"
              placeholder="auto"
            />
          </div>

          <PropertyInput
            label="Alt Text"
            value={props.alt}
            onChange={(value) => updateProp('alt', value)}
            type="text"
            placeholder="Image description"
          />

          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Image title"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Object Fit"
              value={props.objectFit}
              onChange={(value) => updateProp('objectFit', value)}
              type="select"
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'fill', label: 'Fill' },
                { value: 'none', label: 'None' },
                { value: 'scale-down', label: 'Scale Down' }
              ]}
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="0px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Opacity"
              value={props.opacity || 1}
              onChange={(value) => updateProp('opacity', value)}
              type="range"
              min={0}
              max={1}
              step={0.1}
            />

            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                Value: {props.opacity || 1}
              </div>
            </div>
          </div>

          <PropertyInput
            label="Box Shadow"
            value={props.boxShadow}
            onChange={(value) => updateProp('boxShadow', value)}
            type="text"
            placeholder="0 2px 4px rgba(0,0,0,0.1)"
          />

          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Advanced</h4>
            <div className="grid grid-cols-2 gap-4">
              <PropertyInput
                label="Object Position"
                value={props.objectPosition}
                onChange={(value) => updateProp('objectPosition', value)}
                type="select"
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' }
                ]}
              />

              <PropertyInput
                label="Aspect Ratio"
                value={props.aspectRatio}
                onChange={(value) => updateProp('aspectRatio', value)}
                type="text"
                placeholder="16/9"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <PropertyInput
                label="Max Width"
                value={props.maxWidth}
                onChange={(value) => updateProp('maxWidth', value)}
                type="text"
                placeholder="100%"
              />

              <PropertyInput
                label="Max Height"
                value={props.maxHeight}
                onChange={(value) => updateProp('maxHeight', value)}
                type="text"
                placeholder="auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageBoxBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const openAssetModal = useAssetStore((state) => state.openModal);

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };



  const props = block.props as any;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Image Box Properties</h3>

        {/* Upload Section */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Image</h4>
            {props.src && (
              <button
                onClick={() => updateProp('src', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          <div className="mb-3">
            <PropertyInput
              label="Image URL"
              value={props.src}
              onChange={(value) => updateProp('src', value)}
              type="text"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4">
            {props.src ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 overflow-hidden rounded-md">
                  <img
                    src={props.src}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {props.src.length > 30 ? props.src.substring(0, 30) + '...' : props.src}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🖼️</div>
                <p className="text-sm text-gray-400">No image</p>
              </div>
            )}

            <button
              onClick={() => openAssetModal((url) => updateProp('src', url))}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md w-full"
            >
              Select from Library
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Image title"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Image description"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Title"
              value={props.showTitle}
              onChange={(value) => updateProp('showTitle', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Description"
              value={props.showDescription}
              onChange={(value) => updateProp('showDescription', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Overlay */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Overlay</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Enable Overlay"
              value={props.overlay}
              onChange={(value) => updateProp('overlay', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Overlay Opacity"
              value={props.overlayOpacity || 0.5}
              onChange={(value) => updateProp('overlayOpacity', value)}
              type="range"
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          {props.overlay && (
            <div className="mt-3">
              <PropertyInput
                label="Overlay Color"
                value={props.overlayColor}
                onChange={(value) => updateProp('overlayColor', value)}
                type="color"
              />
            </div>
          )}
        </div>

        {/* Display */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Display</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Width"
              value={props.width}
              onChange={(value) => updateProp('width', value)}
              type="text"
              placeholder="100%"
            />

            <PropertyInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProp('height', value)}
              type="text"
              placeholder="auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="4px"
            />

            <PropertyInput
              label="Text Align"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MapBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Map Properties</h3>

        {/* Location Section */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Location</h4>

          <div className="space-y-4">
            <PropertyInput
              label="Address"
              value={props.address}
              onChange={(value) => updateProp('address', value)}
              type="text"
              placeholder="Enter address or location"
            />

            <div className="grid grid-cols-2 gap-4">
              <PropertyInput
                label="Latitude"
                value={props.latitude}
                onChange={(value) => updateProp('latitude', Number(value))}
                type="number"
              />

              <PropertyInput
                label="Longitude"
                value={props.longitude}
                onChange={(value) => updateProp('longitude', Number(value))}
                type="number"
              />
            </div>

            <PropertyInput
              label="Zoom Level"
              value={props.zoom || 13}
              onChange={(value) => updateProp('zoom', Number(value))}
              type="range"
              min={1}
              max={20}
              step={1}
            />
            <div className="text-xs text-gray-400 text-center">
              Zoom: {props.zoom || 13}
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300">Display</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Width"
              value={props.width}
              onChange={(value) => updateProp('width', value)}
              type="text"
              placeholder="100%"
            />

            <PropertyInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProp('height', value)}
              type="text"
              placeholder="300px"
            />
          </div>

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
            placeholder="4px"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Interactive Map"
              value={props.interactive}
              onChange={(value) => updateProp('interactive', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Map Type"
              value={props.mapType || 'roadmap'}
              onChange={(value) => updateProp('mapType', value)}
              type="select"
              options={[
                { value: 'roadmap', label: 'Roadmap' },
                { value: 'satellite', label: 'Satellite' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'terrain', label: 'Terrain' }
              ]}
            />
          </div>
        </div>

        {/* Marker Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Marker</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Marker"
              value={props.showMarker}
              onChange={(value) => updateProp('showMarker', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Marker Color"
              value={props.markerColor || '#dc3545'}
              onChange={(value) => updateProp('markerColor', value)}
              type="color"
            />
          </div>

          {props.showMarker && (
            <div className="space-y-3 mt-3">
              <PropertyInput
                label="Marker Title"
                value={props.markerTitle}
                onChange={(value) => updateProp('markerTitle', value)}
                type="text"
                placeholder="Location name"
              />

              <PropertyInput
                label="Marker Description"
                value={props.markerDescription}
                onChange={(value) => updateProp('markerDescription', value)}
                type="text"
                placeholder="Location description"
              />
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Advanced</h4>

          <div className="space-y-3">
            <PropertyInput
              label="API Key"
              value={props.apiKey}
              onChange={(value) => updateProp('apiKey', value)}
              type="text"
              placeholder="Optional: Google Maps API key"
            />

            <div className="text-xs text-gray-400">
              Note: For production use, add your Google Maps API key for better performance
            </div>

            <PropertyInput
              label="Overflow"
              value={props.overflow}
              onChange={(value) => updateProp('overflow', value)}
              type="select"
              options={[
                { value: 'hidden', label: 'Hidden' },
                { value: 'visible', label: 'Visible' },
                { value: 'auto', label: 'Auto' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const IconBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  // Icon options for the select dropdown
  const iconOptions = [
    // Basic
    { value: 'star', label: '⭐ Star' },
    { value: 'heart', label: '❤️ Heart' },
    { value: 'like', label: '👍 Like' },
    { value: 'home', label: '🏠 Home' },
    { value: 'user', label: '👤 User' },
    { value: 'settings', label: '⚙️ Settings' },
    { value: 'search', label: '🔍 Search' },
    { value: 'menu', label: '☰ Menu' },
    { value: 'close', label: '✕ Close' },
    { value: 'check', label: '✓ Check' },

    // Social
    { value: 'facebook', label: '📘 Facebook' },
    { value: 'twitter', label: '🐦 Twitter' },
    { value: 'instagram', label: '📷 Instagram' },
    { value: 'linkedin', label: '💼 LinkedIn' },

    // Actions
    { value: 'download', label: '📥 Download' },
    { value: 'upload', label: '📤 Upload' },
    { value: 'share', label: '↗️ Share' },
    { value: 'edit', label: '✏️ Edit' },
    { value: 'delete', label: '🗑️ Delete' },

    // Media
    { value: 'camera', label: '📸 Camera' },
    { value: 'video', label: '🎥 Video' },
    { value: 'music', label: '🎵 Music' },

    // Objects
    { value: 'lock', label: '🔒 Lock' },
    { value: 'key', label: '🔑 Key' },
    { value: 'bell', label: '🔔 Bell' },
    { value: 'gift', label: '🎁 Gift' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Icon Properties</h3>

        {/* Icon Preview */}
        <div className="mb-6 p-6 bg-gray-900/50 rounded-lg flex flex-col items-center justify-center">
          <div
            style={{
              fontSize: props.fontSize || props.size || '48px',
              color: props.color || '#ffc107',
              backgroundColor: props.backgroundColor || 'transparent',
              borderRadius: props.borderRadius || '50%',
              padding: props.padding || '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              marginBottom: '16px'
            }}
          >
            {(() => {
              const iconMap: Record<string, string> = {
                star: '⭐', heart: '❤️', like: '👍', home: '🏠', user: '👤',
                settings: '⚙️', search: '🔍', menu: '☰', close: '✕', check: '✓',
                facebook: '📘', twitter: '🐦', instagram: '📷', linkedin: '💼'
              };
              return iconMap[props.name || 'star'] || '⭐';
            })()}
          </div>
          <div className="text-center">
            <div className="text-gray-300 font-medium capitalize">
              {props.name || 'star'} Icon
            </div>
            <div className="text-sm text-gray-400">
              {props.size || '24px'} • {props.color || '#ffc107'}
            </div>
          </div>
        </div>

        {/* Icon Selection */}
        <div className="space-y-4">
          <PropertyInput
            label="Icon Type"
            value={props.name}
            onChange={(value) => updateProp('name', value)}
            type="select"
            options={iconOptions}
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Size"
              value={props.size}
              onChange={(value) => updateProp('size', value)}
              type="text"
              placeholder="24px"
            />

            <PropertyInput
              label="Color"
              value={props.color}
              onChange={(value) => updateProp('color', value)}
              type="color"
            />
          </div>

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="50%"
            />

            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="8px"
            />
          </div>
        </div>

        {/* Link Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Link</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Clickable"
              value={props.clickable}
              onChange={(value) => updateProp('clickable', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Target"
              value={props.target}
              onChange={(value) => updateProp('target', value)}
              type="select"
              options={[
                { value: '_self', label: 'Same Tab' },
                { value: '_blank', label: 'New Tab' }
              ]}
            />
          </div>

          {props.clickable && (
            <div className="mt-3">
              <PropertyInput
                label="Link URL"
                value={props.url}
                onChange={(value) => updateProp('url', value)}
                type="text"
                placeholder="https://example.com"
              />
            </div>
          )}
        </div>

        {/* Hover Effects */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Hover Effects</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Hover Color"
              value={props.hoverColor}
              onChange={(value) => updateProp('hoverColor', value)}
              type="color"
            />

            <PropertyInput
              label="Hover Background"
              value={props.hoverBackgroundColor}
              onChange={(value) => updateProp('hoverBackgroundColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Border Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Border</h4>

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
            placeholder="1px solid #ddd"
          />
        </div>
      </div>
    </div>
  );
};
const VideoBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {


  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };



  const props = block.props as any;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Video Properties</h3>

        {/* Video Source */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Video Source</h4>
            {props.src && (
              <button
                onClick={() => updateProp('src', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove Video
              </button>
            )}
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4">
            {props.src ? (
              <div className="text-center">
                <div className="w-24 h-16 mx-auto mb-3 overflow-hidden rounded-md bg-gray-800 flex items-center justify-center">
                  <div className="text-2xl">🎥</div>
                </div>
                <p className="text-xs text-gray-400 truncate max-w-full">
                  {props.src.length > 30 ? props.src.substring(0, 30) + '...' : props.src}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎥</div>
                <p className="text-sm text-gray-400">No video URL provided</p>
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2 text-center">
               Enter a video URL below
            </div>
          </div>

          {props.src && (
            <div className="mt-3">
              <PropertyInput
                label="Video URL"
                value={props.src}
                onChange={(value) => updateProp('src', value)}
                type="text"
                placeholder="https://example.com/video.mp4"
              />
            </div>
          )}
        </div>

        {/* Video Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Video Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Video Title"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Video description"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Title"
              value={props.showTitle}
              onChange={(value) => updateProp('showTitle', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Description"
              value={props.showDescription}
              onChange={(value) => updateProp('showDescription', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Player Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Player Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Controls"
              value={props.controls}
              onChange={(value) => updateProp('controls', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Autoplay"
              value={props.autoplay}
              onChange={(value) => updateProp('autoplay', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Loop Video"
              value={props.loop}
              onChange={(value) => updateProp('loop', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Start Muted"
              value={props.muted}
              onChange={(value) => updateProp('muted', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Thumbnail Image"
              value={props.poster}
              onChange={(value) => updateProp('poster', value)}
              type="text"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
        </div>

        {/* Display Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Display</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Width"
              value={props.width}
              onChange={(value) => updateProp('width', value)}
              type="text"
              placeholder="100%"
            />

            <PropertyInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProp('height', value)}
              type="text"
              placeholder="auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />

            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />
          </div>
        </div>

        {/* Video Info */}
        {props.src && (
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Video Info</h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-gray-900/30 rounded">
                <div className="text-sm font-medium text-white">
                  {props.src.startsWith('data:') ? 'Local' : 'External'}
                </div>
                <div className="text-xs text-gray-400">Source</div>
              </div>

              <div className="p-2 bg-gray-900/30 rounded">
                <div className="text-sm font-medium text-white">
                  {props.controls ? 'Controls' : 'Autoplay'}
                </div>
                <div className="text-xs text-gray-400">Player Mode</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const FormBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;
  const fields = props.fields || [];

  const handleFieldUpdate = (index: number, fieldUpdates: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...fieldUpdates };
    updateProp('fields', updatedFields);
  };

  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter text',
      required: false
    };
    updateProp('fields', [...fields, newField]);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_: any, i: number) => i !== index);
    updateProp('fields', updatedFields);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Form Properties</h3>

        {/* Form Header */}
        <div className="space-y-4 mb-6">
          <PropertyInput
            label="Form Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Contact Us"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Get in touch with us"
          />
        </div>

        {/* Form Fields Management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Form Fields ({fields.length})</h4>
            <button
              onClick={addField}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              + Add Field
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {fields.map((field: any, index: number) => (
              <div key={field.id} className="p-3 bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-300">
                    {field.label || `Field ${index + 1}`}
                  </div>
                  <button
                    onClick={() => removeField(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleFieldUpdate(index, { label: e.target.value })}
                      placeholder="Field Label"
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    />

                    <select
                      value={field.type}
                      onChange={(e) => handleFieldUpdate(index, { type: e.target.value })}
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => handleFieldUpdate(index, { placeholder: e.target.value })}
                    placeholder="Placeholder text"
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                  />

                  {/* Validation Settings for text fields */}
                  {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                    <div className="pt-2 border-t border-gray-700">
                      <div className="text-xs font-medium text-gray-400 mb-2">Validation</div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          value={field.validation?.pattern || ''}
                          onChange={(e) => handleFieldUpdate(index, {
                            validation: { ...field.validation, pattern: e.target.value }
                          })}
                          placeholder="Regex Pattern"
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                          title="Regular expression for validation (e.g. ^[0-9]+$)"
                        />
                        <input
                          type="number"
                          value={field.validation?.minLength || ''}
                          onChange={(e) => handleFieldUpdate(index, {
                            validation: { ...field.validation, minLength: parseInt(e.target.value) || undefined }
                          })}
                          placeholder="Min Length"
                          className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={field.validation?.errorMessage || ''}
                        onChange={(e) => handleFieldUpdate(index, {
                          validation: { ...field.validation, errorMessage: e.target.value }
                        })}
                        placeholder="Custom Error Message"
                        className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={field.required || false}
                        onChange={(e) => handleFieldUpdate(index, { required: e.target.checked })}
                        className="mr-2"
                      />
                      Required
                    </label>

                    {(field.type === 'select' || field.type === 'radio') && (
                      <button
                        onClick={() => {
                          const options = field.options || [];
                          handleFieldUpdate(index, { options: [...options, `Option ${options.length + 1}`] });
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  {field.options && field.options.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {field.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...field.options];
                              newOptions[optIndex] = e.target.value;
                              handleFieldUpdate(index, { options: newOptions });
                            }}
                            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                          />
                          <button
                            onClick={() => {
                              const newOptions = field.options.filter((_: string, i: number) => i !== optIndex);
                              handleFieldUpdate(index, { options: newOptions });
                            }}
                            className="ml-2 text-xs text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                No fields added. Click "Add Field" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Submit Button</h4>

          <PropertyInput
            label="Button Text"
            value={props.submitText}
            onChange={(value) => updateProp('submitText', value)}
            type="text"
            placeholder="Submit"
          />

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Button Color"
              value={props.buttonColor}
              onChange={(value) => updateProp('buttonColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.buttonTextColor}
              onChange={(value) => updateProp('buttonTextColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Button Padding"
              value={props.buttonPadding}
              onChange={(value) => updateProp('buttonPadding', value)}
              type="text"
              placeholder="12px 24px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.buttonBorderRadius}
              onChange={(value) => updateProp('buttonBorderRadius', value)}
              type="text"
              placeholder="6px"
            />
          </div>
        </div>

        {/* Form Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Form Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="30px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #e5e7eb"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
const SurveyBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;
  const questions = props.questions || [];

  const handleQuestionUpdate = (index: number, questionUpdates: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...questionUpdates };
    updateProp('questions', updatedQuestions);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      type: 'single',
      question: 'New Question',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3']
    };
    updateProp('questions', [...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_: any, i: number) => i !== index);
    updateProp('questions', updatedQuestions);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: `${questionToDuplicate.id}_copy_${Date.now()}`
    };
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index + 1, 0, duplicatedQuestion);
    updateProp('questions', updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const options = question.options || [];
    const newOptions = [...options, `Option ${options.length + 1}`];
    handleQuestionUpdate(questionIndex, { options: newOptions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = question.options.filter((_: string, i: number) => i !== optionIndex);
    handleQuestionUpdate(questionIndex, { options: newOptions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = questions[questionIndex];
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    handleQuestionUpdate(questionIndex, { options: newOptions });
  };

  const questionTypeOptions = [
    { value: 'single', label: 'Single Choice' },
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'text', label: 'Text Answer' },
    { value: 'rating', label: 'Rating Scale' },
    { value: 'scale', label: 'Custom Scale' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Survey Properties</h3>

        {/* Survey Header */}
        <div className="space-y-4 mb-6">
          <PropertyInput
            label="Survey Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Customer Survey"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Help us improve by sharing your feedback"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Progress Bar"
              value={props.showProgress}
              onChange={(value) => updateProp('showProgress', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />
          </div>
        </div>

        {/* Questions Management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Questions ({questions.length})</h4>
            <button
              onClick={addQuestion}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              + Add Question
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {questions.map((question: any, index: number) => (
              <div key={question.id} className="p-4 bg-gray-900/50 rounded-lg">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-xs font-medium text-gray-300 bg-gray-800 px-2 py-1 rounded">
                      Q{index + 1}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {question.type}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => duplicateQuestion(index)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                      title="Duplicate"
                    >
                      ⎘
                    </button>
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-xs text-red-400 hover:text-red-300"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Question Content */}
                <div className="space-y-3">
                  {/* Question Text */}
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionUpdate(index, { question: e.target.value })}
                    placeholder="Enter your question"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                  />

                  {/* Question Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Question Type</label>
                      <select
                        value={question.type}
                        onChange={(e) => handleQuestionUpdate(index, { type: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                      >
                        {questionTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center text-xs text-gray-400">
                        <input
                          type="checkbox"
                          checked={question.required || false}
                          onChange={(e) => handleQuestionUpdate(index, { required: e.target.checked })}
                          className="mr-2"
                        />
                        Required
                      </label>
                    </div>
                  </div>

                  {/* Options for Single/Multiple Choice */}
                  {(question.type === 'single' || question.type === 'multiple') && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-gray-400">Options</label>
                        <button
                          onClick={() => addOption(index)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="space-y-2">
                        {question.options?.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, optIndex, e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                            <button
                              onClick={() => removeOption(index, optIndex)}
                              className="ml-2 text-xs text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {(!question.options || question.options.length === 0) && (
                          <div className="text-center py-2 text-xs text-gray-500">
                            No options added. Click "Add Option" to add choices.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rating Scale Settings */}
                  {(question.type === 'rating' || question.type === 'scale') && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Min Rating</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={question.minRating || 1}
                          onChange={(e) => handleQuestionUpdate(index, { minRating: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Max Rating</label>
                        <input
                          type="number"
                          min="2"
                          max="10"
                          value={question.maxRating || 5}
                          onChange={(e) => handleQuestionUpdate(index, { maxRating: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                        />
                      </div>

                      {/* Scale Labels */}
                      {question.type === 'scale' && (
                        <>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Min Label</label>
                            <input
                              type="text"
                              value={question.scaleLabels?.min || ''}
                              onChange={(e) => handleQuestionUpdate(index, {
                                scaleLabels: {
                                  ...question.scaleLabels,
                                  min: e.target.value
                                }
                              })}
                              placeholder="Poor"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Max Label</label>
                            <input
                              type="text"
                              value={question.scaleLabels?.max || ''}
                              onChange={(e) => handleQuestionUpdate(index, {
                                scaleLabels: {
                                  ...question.scaleLabels,
                                  max: e.target.value
                                }
                              })}
                              placeholder="Excellent"
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <div className="text-2xl mb-2">📝</div>
                <p>No questions added yet.</p>
                <p className="text-xs mt-1">Click "Add Question" to create your survey.</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Submit Button</h4>

          <PropertyInput
            label="Button Text"
            value={props.submitText}
            onChange={(value) => updateProp('submitText', value)}
            type="text"
            placeholder="Submit Survey"
          />

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Button Color"
              value={props.buttonColor}
              onChange={(value) => updateProp('buttonColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.buttonTextColor}
              onChange={(value) => updateProp('buttonTextColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Button Padding"
              value={props.buttonPadding}
              onChange={(value) => updateProp('buttonPadding', value)}
              type="text"
              placeholder="12px 24px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.buttonBorderRadius}
              onChange={(value) => updateProp('buttonBorderRadius', value)}
              type="text"
              placeholder="6px"
            />
          </div>
        </div>

        {/* Survey Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Survey Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Progress Bar Color"
              value={props.progressColor || props.buttonColor}
              onChange={(value) => updateProp('progressColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="30px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #e5e7eb"
            />
          </div>
        </div>

        {/* Survey Stats */}
        {questions.length > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Survey Stats</h4>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-900/30 rounded">
                <div className="text-xl font-semibold text-white">{questions.length}</div>
                <div className="text-xs text-gray-400">Total Questions</div>
              </div>

              <div className="p-3 bg-gray-900/30 rounded">
                <div className="text-xl font-semibold text-white">
                  {questions.filter((q: any) => q.required).length}
                </div>
                <div className="text-xs text-gray-400">Required</div>
              </div>

              <div className="p-3 bg-gray-900/30 rounded">
                <div className="text-xl font-semibold text-white">
                  {questions.filter((q: any) => q.type === 'text').length}
                </div>
                <div className="text-xs text-gray-400">Text Answers</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SocialFollowBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;
  const platforms = props.platforms || [];

  const handlePlatformUpdate = (index: number, platformUpdates: any) => {
    const updatedPlatforms = [...platforms];
    updatedPlatforms[index] = { ...updatedPlatforms[index], ...platformUpdates };
    updateProp('platforms', updatedPlatforms);
  };

  const addPlatform = () => {
    const newPlatform = {
      name: 'New Platform',
      url: '#',
      icon: '🔗',
      color: '#6b7280'
    };
    updateProp('platforms', [...platforms, newPlatform]);
  };

  const removePlatform = (index: number) => {
    const updatedPlatforms = platforms.filter((_: any, i: number) => i !== index);
    updateProp('platforms', updatedPlatforms);
  };

  const movePlatform = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updatedPlatforms = [...platforms];
      [updatedPlatforms[index], updatedPlatforms[index - 1]] = [updatedPlatforms[index - 1], updatedPlatforms[index]];
      updateProp('platforms', updatedPlatforms);
    } else if (direction === 'down' && index < platforms.length - 1) {
      const updatedPlatforms = [...platforms];
      [updatedPlatforms[index], updatedPlatforms[index + 1]] = [updatedPlatforms[index + 1], updatedPlatforms[index]];
      updateProp('platforms', updatedPlatforms);
    }
  };

  const platformIcons = [
    { value: '📘', label: 'Facebook' },
    { value: '🐦', label: 'Twitter' },
    { value: '📷', label: 'Instagram' },
    { value: '💼', label: 'LinkedIn' },
    { value: '📺', label: 'YouTube' },
    { value: '🐙', label: 'GitHub' },
    { value: '📱', label: 'TikTok' },
    { value: '📌', label: 'Pinterest' },
    { value: '💬', label: 'WhatsApp' },
    { value: '📞', label: 'Telegram' },
    { value: '🔗', label: 'Link' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Social Media Properties</h3>

        {/* Platforms Management */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Platforms ({platforms.length})</h4>
            <button
              onClick={addPlatform}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              + Add Platform
            </button>
          </div>

          <div className="space-y-3">
            {platforms.map((platform: any, index: number) => (
              <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-sm font-medium text-gray-300">{platform.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => movePlatform(index, 'up')}
                      disabled={index === 0}
                      className={`text-xs ${index === 0 ? 'text-gray-600' : 'text-blue-400 hover:text-blue-300'}`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => movePlatform(index, 'down')}
                      disabled={index === platforms.length - 1}
                      className={`text-xs ${index === platforms.length - 1 ? 'text-gray-600' : 'text-blue-400 hover:text-blue-300'}`}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removePlatform(index)}
                      className="text-xs text-red-400 hover:text-red-300"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={platform.name}
                      onChange={(e) => handlePlatformUpdate(index, { name: e.target.value })}
                      placeholder="Platform name"
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    />

                    <select
                      value={platform.icon}
                      onChange={(e) => handlePlatformUpdate(index, { icon: e.target.value })}
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    >
                      {platformIcons.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label} {icon.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={platform.url}
                    onChange={(e) => handlePlatformUpdate(index, { url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Color:</span>
                    <input
                      type="color"
                      value={platform.color || '#6b7280'}
                      onChange={(e) => handlePlatformUpdate(index, { color: e.target.value })}
                      className="h-6 w-12 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}

            {platforms.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <div className="text-2xl mb-2">👥</div>
                <p>No social platforms added.</p>
                <p className="text-xs mt-1">Click "Add Platform" to add social media links.</p>
              </div>
            )}
          </div>
        </div>

        {/* Layout Settings */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Layout</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Layout Direction"
              value={props.layout}
              onChange={(value) => updateProp('layout', value)}
              type="select"
              options={[
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
              ]}
            />

            <PropertyInput
              label="Icon Size"
              value={props.iconSize}
              onChange={(value) => updateProp('iconSize', value)}
              type="text"
              placeholder="32px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Spacing"
              value={props.spacing}
              onChange={(value) => updateProp('spacing', value)}
              type="text"
              placeholder="10px"
            />

            <PropertyInput
              label="Show Labels"
              value={props.showLabels}
              onChange={(value) => updateProp('showLabels', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="20px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>
        </div>

        {/* Preview */}
        {platforms.length > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>

            <div
              className="p-4 bg-gray-900/30 rounded-lg"
              style={{
                backgroundColor: props.backgroundColor || 'transparent',
                padding: props.padding || '20px',
                borderRadius: props.borderRadius || '8px',
                textAlign: props.textAlign || 'center' as any
              }}
            >
              <div
                className="flex gap-2 justify-center flex-wrap"
                style={{
                  flexDirection: props.layout === 'vertical' ? 'column' : 'row',
                  gap: props.spacing || '10px',
                  alignItems: 'center'
                }}
              >
                {platforms.slice(0, 3).map((platform: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded bg-gray-800/50"
                    style={{ color: platform.color || '#6b7280' }}
                  >
                    <span style={{ fontSize: props.iconSize || '24px' }}>
                      {platform.icon}
                    </span>
                    {props.showLabels && (
                      <span className="ml-2 text-sm text-white">
                        {platform.name}
                      </span>
                    )}
                  </div>
                ))}
                {platforms.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{platforms.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DividerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3">Divider Properties</h3>

      <div className="space-y-3">
        {/* Divider Style */}
        <PropertyInput
          label="Style"
          value={props.style || 'solid'}
          onChange={(value) => updateProp('style', value)}
          type="select"
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'double', label: 'Double' }
          ]}
        />

        {/* Height/Thickness */}
        <PropertyInput
          label="Height (Thickness)"
          value={props.height || '1px'}
          onChange={(value) => updateProp('height', value)}
          type="text"
          placeholder="1px"
        />

        {/* Color */}
        <PropertyInput
          label="Color"
          value={props.color || '#e5e7eb'}
          onChange={(value) => updateProp('color', value)}
          type="color"
        />

        {/* Width */}
        <PropertyInput
          label="Width"
          value={props.width || '100%'}
          onChange={(value) => updateProp('width', value)}
          type="text"
          placeholder="100%"
        />

        {/* Margin */}
        <PropertyInput
          label="Margin"
          value={props.margin || '20px 0'}
          onChange={(value) => updateProp('margin', value)}
          type="text"
          placeholder="20px 0"
        />

        {/* Padding */}
        <PropertyInput
          label="Padding"
          value={props.padding || '0'}
          onChange={(value) => updateProp('padding', value)}
          type="text"
          placeholder="0"
        />
      </div>
    </div>
  );
};

const SpacerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3">Spacer Properties</h3>

      <div className="space-y-3">
        {/* Height */}
        <PropertyInput
          label="Height"
          value={props.height || '20px'}
          onChange={(value) => updateProp('height', value)}
          type="text"
          placeholder="20px"
        />

        {/* Background Color */}
        <PropertyInput
          label="Background Color"
          value={props.backgroundColor || 'transparent'}
          onChange={(value) => updateProp('backgroundColor', value)}
          type="color"
        />

        {/* Margin */}
        <PropertyInput
          label="Margin"
          value={props.margin || '0'}
          onChange={(value) => updateProp('margin', value)}
          type="text"
          placeholder="0"
        />

        {/* Padding */}
        <PropertyInput
          label="Padding"
          value={props.padding || '0'}
          onChange={(value) => updateProp('padding', value)}
          type="text"
          placeholder="0"
        />

        {/* Min Height */}
        <PropertyInput
          label="Min Height"
          value={props.minHeight || '10px'}
          onChange={(value) => updateProp('minHeight', value)}
          type="text"
          placeholder="10px"
        />

        {/* Max Height */}
        <PropertyInput
          label="Max Height"
          value={props.maxHeight || '200px'}
          onChange={(value) => updateProp('maxHeight', value)}
          type="text"
          placeholder="200px"
        />
      </div>
    </div>
  );
};

const ButtonBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    const newProps = { ...props, [key]: value };

    // Clear conflicting properties when switching link types
    if (key === 'linkType') {
      if (value === 'url') {
        delete newProps.email;
        delete newProps.phone;
      } else if (value === 'email') {
        delete newProps.href;
        delete newProps.phone;
      } else if (value === 'phone') {
        delete newProps.href;
        delete newProps.email;
      }
      // Don't actually save 'linkType' to the block props as it's a UI helper
      delete newProps.linkType;
    }

    updateBlock(block.id, {
      props: newProps
    });
  };

  // Determine current link type for UI
  const currentLinkType = props.email ? 'email' : (props.phone ? 'phone' : 'url');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Button Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Button Text"
            value={props.text}
            onChange={(value) => updateProp('text', value)}
            type="text"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Variant"
              value={props.variant || 'primary'}
              onChange={(value) => updateProp('variant', value)}
              type="select"
              options={[
                { value: 'primary', label: 'Primary' },
                { value: 'secondary', label: 'Secondary' },
                { value: 'outline', label: 'Outline' },
                { value: 'ghost', label: 'Ghost' },
                { value: 'danger', label: 'Danger' }
              ]}
            />

            <PropertyInput
              label="Size"
              value={props.size || 'medium'}
              onChange={(value) => updateProp('size', value)}
              type="select"
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
            />
          </div>

          <PropertyInput
            label="Action Type"
            value={currentLinkType}
            onChange={(value) => updateProp('linkType', value)}
            type="select"
            options={[
              { value: 'url', label: 'Link URL' },
              { value: 'email', label: 'Email Address' },
              { value: 'phone', label: 'Phone Number' }
            ]}
          />

          {currentLinkType === 'url' && (
            <>
              <PropertyInput
                label="Link URL"
                value={props.href}
                onChange={(value) => updateProp('href', value)}
                type="text"
                placeholder="https://"
              />
              <PropertyInput
                label="Target"
                value={props.target}
                onChange={(value) => updateProp('target', value)}
                type="select"
                options={[
                  { value: '_self', label: 'Same Window' },
                  { value: '_blank', label: 'New Window' },
                  { value: '_parent', label: 'Parent Frame' },
                  { value: '_top', label: 'Top Frame' }
                ]}
              />
            </>
          )}

          {currentLinkType === 'email' && (
            <PropertyInput
              label="Email Address"
              value={props.email}
              onChange={(value) => updateProp('email', value)}
              type="text"
              placeholder="name@example.com"
            />
          )}

          {currentLinkType === 'phone' && (
            <PropertyInput
              label="Phone Number"
              value={props.phone}
              onChange={(value) => updateProp('phone', value)}
              type="text"
              placeholder="+1 234 567 8900"
            />
          )}

          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Style</h4>

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
            />

            <PropertyInput
              label="Font Weight"
              value={props.fontWeight}
              onChange={(value) => updateProp('fontWeight', value)}
              type="select"
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' }
              ]}
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <PropertyInput
                label="Text Color"
                value={props.color}
                onChange={(value) => updateProp('color', value)}
                type="color"
              />

              <PropertyInput
                label="Background"
                value={props.backgroundColor}
                onChange={(value) => updateProp('backgroundColor', value)}
                type="color"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <PropertyInput
                label="Padding"
                value={props.padding}
                onChange={(value) => updateProp('padding', value)}
                type="text"
              />

              <PropertyInput
                label="Radius"
                value={props.borderRadius}
                onChange={(value) => updateProp('borderRadius', value)}
                type="text"
              />
            </div>

            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <PropertyInput
                label="Hover Text"
                value={props.hoverColor}
                onChange={(value) => updateProp('hoverColor', value)}
                type="color"
              />

              <PropertyInput
                label="Hover Bg"
                value={props.hoverBackgroundColor}
                onChange={(value) => updateProp('hoverBackgroundColor', value)}
                type="color"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

const ContainerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Container Properties</h3>

        {/* Background */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">🎨 Background</h4>

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Background Image URL"
            value={props.backgroundImage}
            onChange={(value) => updateProp('backgroundImage', value)}
            type="text"
            placeholder="https://example.com/image.jpg or linear-gradient(...)"
          />

          {props.backgroundImage && (
            <>
              <PropertyInput
                label="Background Size"
                value={props.backgroundSize}
                onChange={(value) => updateProp('backgroundSize', value)}
                type="select"
                options={[
                  { value: 'cover', label: 'Cover' },
                  { value: 'contain', label: 'Contain' },
                  { value: 'auto', label: 'Auto' },
                  { value: '100%', label: '100%' },
                  { value: '100% 100%', label: '100% 100%' }
                ]}
              />

              <PropertyInput
                label="Background Position"
                value={props.backgroundPosition}
                onChange={(value) => updateProp('backgroundPosition', value)}
                type="text"
                placeholder="center center"
              />

              <PropertyInput
                label="Background Repeat"
                value={props.backgroundRepeat}
                onChange={(value) => updateProp('backgroundRepeat', value)}
                type="select"
                options={[
                  { value: 'no-repeat', label: 'No Repeat' },
                  { value: 'repeat', label: 'Repeat' },
                  { value: 'repeat-x', label: 'Repeat X' },
                  { value: 'repeat-y', label: 'Repeat Y' }
                ]}
              />
            </>
          )}
        </div>

        {/* Layout */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">📐 Layout</h4>

          <div className="grid grid-cols-2 gap-3">
            <PropertyInput
              label="Max Width"
              value={props.maxWidth}
              onChange={(value) => updateProp('maxWidth', value)}
              type="text"
              placeholder="100%"
            />

            <PropertyInput
              label="Min Height"
              value={props.minHeight}
              onChange={(value) => updateProp('minHeight', value)}
              type="text"
              placeholder="auto"
            />
          </div>

          <PropertyInput
            label="Text Align"
            value={props.textAlign}
            onChange={(value) => updateProp('textAlign', value)}
            type="select"
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' }
            ]}
          />
        </div>

        {/* Spacing */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">📏 Spacing</h4>

          <div className="grid grid-cols-2 gap-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="20px"
            />

            <PropertyInput
              label="Margin"
              value={props.margin}
              onChange={(value) => updateProp('margin', value)}
              type="text"
              placeholder="0"
            />
          </div>
        </div>

        {/* Border & Effects */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">✨ Border & Effects</h4>

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
            placeholder="none"
          />

          <div className="grid grid-cols-2 gap-3">
            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="0px"
            />

            <PropertyInput
              label="Box Shadow"
              value={props.boxShadow}
              onChange={(value) => updateProp('boxShadow', value)}
              type="text"
              placeholder="none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RowBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Row Properties</h3>

        {/* Layout Direction */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">📐 Layout Direction</h4>

          <PropertyInput
            label="Desktop Direction"
            value={props.flexDirection || 'row'}
            onChange={(value) => updateProp('flexDirection', value)}
            type="select"
            options={[
              { value: 'row', label: 'Row (Horizontal)' },
              { value: 'column', label: 'Column (Vertical)' },
              { value: 'row-reverse', label: 'Row Reverse' },
              { value: 'column-reverse', label: 'Column Reverse' }
            ]}
          />

          <PropertyInput
            label="Tablet Direction"
            value={props.flexDirection_tablet || 'row'}
            onChange={(value) => updateProp('flexDirection_tablet', value)}
            type="select"
            options={[
              { value: 'row', label: 'Row (Horizontal)' },
              { value: 'column', label: 'Column (Vertical)' },
              { value: 'row-reverse', label: 'Row Reverse' },
              { value: 'column-reverse', label: 'Column Reverse' }
            ]}
          />

          <PropertyInput
            label="Mobile Direction"
            value={props.flexDirection_mobile || 'column'}
            onChange={(value) => updateProp('flexDirection_mobile', value)}
            type="select"
            options={[
              { value: 'column', label: 'Column (Vertical - Recommended)' },
              { value: 'row', label: 'Row (Horizontal)' },
              { value: 'row-reverse', label: 'Row Reverse' },
              { value: 'column-reverse', label: 'Column Reverse' }
            ]}
          />
        </div>

        {/* Alignment */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">🎯 Alignment</h4>

          <PropertyInput
            label="Justify Content"
            value={props.justifyContent}
            onChange={(value) => updateProp('justifyContent', value)}
            type="select"
            options={[
              { value: 'flex-start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'End' },
              { value: 'space-between', label: 'Space Between' },
              { value: 'space-around', label: 'Space Around' },
              { value: 'space-evenly', label: 'Space Evenly' }
            ]}
          />

          <PropertyInput
            label="Align Items"
            value={props.alignItems}
            onChange={(value) => updateProp('alignItems', value)}
            type="select"
            options={[
              { value: 'stretch', label: 'Stretch' },
              { value: 'flex-start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'End' },
              { value: 'baseline', label: 'Baseline' }
            ]}
          />

          <PropertyInput
            label="Flex Wrap"
            value={props.flexWrap || 'wrap'}
            onChange={(value) => updateProp('flexWrap', value)}
            type="select"
            options={[
              { value: 'wrap', label: 'Wrap' },
              { value: 'nowrap', label: 'No Wrap' },
              { value: 'wrap-reverse', label: 'Wrap Reverse' }
            ]}
          />
        </div>

        {/* Spacing */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">📏 Spacing</h4>

          <PropertyInput
            label="Gap (Desktop)"
            value={props.gap || '1rem'}
            onChange={(value) => updateProp('gap', value)}
            type="text"
            placeholder="1rem"
          />

          <PropertyInput
            label="Gap (Tablet)"
            value={props.gap_tablet}
            onChange={(value) => updateProp('gap_tablet', value)}
            type="text"
            placeholder="1rem"
          />

          <PropertyInput
            label="Gap (Mobile)"
            value={props.gap_mobile}
            onChange={(value) => updateProp('gap_mobile', value)}
            type="text"
            placeholder="1rem"
          />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="0"
            />

            <PropertyInput
              label="Margin"
              value={props.margin}
              onChange={(value) => updateProp('margin', value)}
              type="text"
              placeholder="0"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">🎨 Styling</h4>

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <div className="grid grid-cols-2 gap-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="none"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="0"
            />
          </div>

          <PropertyInput
            label="Min Height"
            value={props.minHeight}
            onChange={(value) => updateProp('minHeight', value)}
            type="text"
            placeholder="auto"
          />
        </div>
      </div>
    </div>
  );
};


const CodeBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  const handleCodeChange = (newCode: string) => {
    updateProp('code', newCode);
  };

  const languageOptions = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'json', label: 'JSON' },
    { value: 'xml', label: 'XML' },
    { value: 'sql', label: 'SQL' },
    { value: 'text', label: 'Plain Text' }
  ];

  const themeOptions = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'solarized', label: 'Solarized' },
    { value: 'monokai', label: 'Monokai' }
  ];

  const getThemeColors = (theme: string) => {
    const themes: Record<string, { bg: string; text: string; border: string }> = {
      dark: { bg: '#1f2937', text: '#f9fafb', border: '#374151' },
      light: { bg: '#ffffff', text: '#1f2937', border: '#d1d5db' },
      solarized: { bg: '#002b36', text: '#839496', border: '#073642' },
      monokai: { bg: '#272822', text: '#f8f8f2', border: '#3e3d32' }
    };
    return themes[theme] || themes.dark;
  };

  const applyTheme = (theme: string) => {
    const colors = getThemeColors(theme);
    updateBlock(block.id, {
      props: {
        ...block.props,
        backgroundColor: colors.bg,
        textColor: colors.text,
        borderColor: colors.border
      }
    } as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Code Block Properties</h3>

        {/* Code Editor */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Code Content</h4>
            <div className="text-xs text-gray-400">
              {props.code?.split('\n').length || 0} lines
            </div>
          </div>

          <textarea
            value={props.code || ''}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="Enter your code here..."
            className="w-full h-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm font-mono resize-none"
            spellCheck="false"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Supports HTML, CSS, JS, JSON, SQL, etc.
            </div>
            <button
              onClick={() => handleCodeChange('')}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear Code
            </button>
          </div>
        </div>

        {/* Language & Settings */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Language & Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Language"
              value={props.language}
              onChange={(value) => updateProp('language', value)}
              type="select"
              options={languageOptions}
            />

            <div>
              <label className="block text-xs text-gray-400 mb-1">Preset Theme</label>
              <select
                value=""
                onChange={(e) => applyTheme(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value="">Select theme...</option>
                {themeOptions.map((theme) => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Show Line Numbers"
              value={props.showLineNumbers}
              onChange={(value) => updateProp('showLineNumbers', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Copy Button"
              value={props.showCopyButton}
              onChange={(value) => updateProp('showCopyButton', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Wrap Lines"
              value={props.wrapLines}
              onChange={(value) => updateProp('wrapLines', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="14px"
            />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Code Block"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Code description"
          />
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-3 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />

            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Display Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Display</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Max Height"
              value={props.maxHeight}
              onChange={(value) => updateProp('maxHeight', value)}
              type="text"
              placeholder="400px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="16px"
            />

            <PropertyInput
              label="Margin"
              value={props.margin}
              onChange={(value) => updateProp('margin', value)}
              type="text"
              placeholder="0"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Font Family"
              value={props.fontFamily}
              onChange={(value) => updateProp('fontFamily', value)}
              type="text"
              placeholder="monospace"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>

          <div className="p-3 bg-gray-900/30 rounded-lg">
            <div className="text-xs text-gray-400 mb-2">Current Settings:</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-800/50 rounded">
                <div className="text-sm font-medium text-white capitalize">
                  {props.language || 'html'}
                </div>
                <div className="text-xs text-gray-400">Language</div>
              </div>

              <div className="p-2 bg-gray-800/50 rounded">
                <div className="text-sm font-medium text-white">
                  {props.showLineNumbers ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-400">Line Numbers</div>
              </div>

              <div className="p-2 bg-gray-800/50 rounded">
                <div className="text-sm font-medium text-white">
                  {props.showCopyButton ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-400">Copy Button</div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">
              Lines: {props.code?.split('\n').length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeadingBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Heading Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Heading Text"
            value={props.text}
            onChange={(value) => updateProp('text', value)}
            type="text"
          />

          <PropertyInput
            label="Heading Level"
            value={props.level}
            onChange={(value) => updateProp('level', value)}
            type="select"
            options={[
              { value: 1, label: 'H1' },
              { value: 2, label: 'H2' },
              { value: 3, label: 'H3' },
              { value: 4, label: 'H4' },
              { value: 5, label: 'H5' },
              { value: 6, label: 'H6' }
            ]}
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Weight"
            value={props.fontWeight}
            onChange={(value) => updateProp('fontWeight', value)}
            type="select"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Bold' },
              { value: '500', label: 'Medium' },
              { value: '600', label: 'Semi Bold' },
              { value: '700', label: 'Bold' },
              { value: '800', label: 'Extra Bold' },
              { value: '900', label: 'Black' }
            ]}
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Line Height"
            value={props.lineHeight}
            onChange={(value) => updateProp('lineHeight', value)}
            type="text"
          />

          <PropertyInput
            label="Letter Spacing"
            value={props.letterSpacing}
            onChange={(value) => updateProp('letterSpacing', value)}
            type="text"
          />

          <PropertyInput
            label="Text Align"
            value={props.textAlign}
            onChange={(value) => updateProp('textAlign', value)}
            type="select"
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' }
            ]}
          />

          <PropertyInput
            label="Text Transform"
            value={props.textTransform}
            onChange={(value) => updateProp('textTransform', value)}
            type="select"
            options={[
              { value: 'none', label: 'None' },
              { value: 'uppercase', label: 'Uppercase' },
              { value: 'lowercase', label: 'Lowercase' },
              { value: 'capitalize', label: 'Capitalize' }
            ]}
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Text Shadow"
            value={props.textShadow}
            onChange={(value) => updateProp('textShadow', value)}
            type="text"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const LinkBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Link Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Link Text"
            value={props.text}
            onChange={(value) => updateProp('text', value)}
            type="text"
          />

          <PropertyInput
            label="URL"
            value={props.url}
            onChange={(value) => updateProp('url', value)}
            type="text"
          />

          <PropertyInput
            label="Target"
            value={props.target}
            onChange={(value) => updateProp('target', value)}
            type="select"
            options={[
              { value: '_self', label: 'Same Window' },
              { value: '_blank', label: 'New Window' },
              { value: '_parent', label: 'Parent Frame' },
              { value: '_top', label: 'Top Frame' }
            ]}
          />

          <PropertyInput
            label="Rel"
            value={props.rel}
            onChange={(value) => updateProp('rel', value)}
            type="text"
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Weight"
            value={props.fontWeight}
            onChange={(value) => updateProp('fontWeight', value)}
            type="select"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Bold' },
              { value: '500', label: 'Medium' },
              { value: '600', label: 'Semi Bold' },
              { value: '700', label: 'Bold' }
            ]}
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Text Align"
            value={props.textAlign}
            onChange={(value) => updateProp('textAlign', value)}
            type="select"
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' }
            ]}
          />

          <PropertyInput
            label="Text Decoration"
            value={props.textDecoration}
            onChange={(value) => updateProp('textDecoration', value)}
            type="select"
            options={[
              { value: 'none', label: 'None' },
              { value: 'underline', label: 'Underline' },
              { value: 'overline', label: 'Overline' },
              { value: 'line-through', label: 'Line Through' }
            ]}
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Hover Color"
            value={props.hoverColor}
            onChange={(value) => updateProp('hoverColor', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Hover Background Color"
            value={props.hoverBackgroundColor}
            onChange={(value) => updateProp('hoverBackgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const LinkBoxBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">LinkBox Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Link Text"
            value={props.text}
            onChange={(value) => updateProp('text', value)}
            type="text"
          />

          <PropertyInput
            label="URL"
            value={props.url}
            onChange={(value) => updateProp('url', value)}
            type="text"
            placeholder="https://example.com"
          />

          <PropertyInput
            label="Target"
            value={props.target}
            onChange={(value) => updateProp('target', value)}
            type="select"
            options={[
              { value: '_self', label: 'Same Window' },
              { value: '_blank', label: 'New Window' },
              { value: '_parent', label: 'Parent Frame' },
              { value: '_top', label: 'Top Frame' }
            ]}
          />

          <PropertyInput
            label="Text Align"
            value={props.textAlign}
            onChange={(value) => updateProp('textAlign', value)}
            type="select"
            options={[
              { value: 'left', label: 'Left' },
              { value: 'center', label: 'Center' },
              { value: 'right', label: 'Right' },
              { value: 'justify', label: 'Justify' }
            ]}
          />

          <div className="pt-3 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />

            <PropertyInput
              label="Hover Background Color"
              value={props.hoverBackgroundColor}
              onChange={(value) => updateProp('hoverBackgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Hover Text Color"
              value={props.hoverTextColor}
              onChange={(value) => updateProp('hoverTextColor', value)}
              type="color"
            />
          </div>

          <div className="pt-3 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Border</h4>

            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />

            <PropertyInput
              label="Border Width"
              value={props.borderWidth}
              onChange={(value) => updateProp('borderWidth', value)}
              type="text"
              placeholder="1px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="4px"
            />
          </div>

          <div className="pt-3 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Spacing & Effects</h4>

            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="1rem"
            />

            <PropertyInput
              label="Margin"
              value={props.margin}
              onChange={(value) => updateProp('margin', value)}
              type="text"
              placeholder="0"
            />

            <PropertyInput
              label="Box Shadow"
              value={props.boxShadow}
              onChange={(value) => updateProp('boxShadow', value)}
              type="text"
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>

          <div className="pt-3 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Typography</h4>

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="16px"
            />

            <PropertyInput
              label="Font Weight"
              value={props.fontWeight}
              onChange={(value) => updateProp('fontWeight', value)}
              type="select"
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Bold' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: '700', label: 'Bold' },
                { value: '800', label: 'Extra Bold' }
              ]}
            />

            <PropertyInput
              label="Font Family"
              value={props.fontFamily}
              onChange={(value) => updateProp('fontFamily', value)}
              type="text"
              placeholder="Arial, sans-serif"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Input Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Input Type"
            value={props.type}
            onChange={(value) => updateProp('type', value)}
            type="select"
            options={[
              { value: 'text', label: 'Text' },
              { value: 'email', label: 'Email' },
              { value: 'password', label: 'Password' },
              { value: 'number', label: 'Number' },
              { value: 'tel', label: 'Telephone' },
              { value: 'url', label: 'URL' },
              { value: 'search', label: 'Search' },
              { value: 'date', label: 'Date' },
              { value: 'time', label: 'Time' },
              { value: 'datetime-local', label: 'Date Time Local' }
            ]}
          />

          <PropertyInput
            label="Placeholder"
            value={props.placeholder}
            onChange={(value) => updateProp('placeholder', value)}
            type="text"
          />

          <PropertyInput
            label="Value"
            value={props.value}
            onChange={(value) => updateProp('value', value)}
            type="text"
          />

          <PropertyInput
            label="Name"
            value={props.name}
            onChange={(value) => updateProp('name', value)}
            type="text"
          />

          <PropertyInput
            label="Required"
            value={props.required}
            onChange={(value) => updateProp('required', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Disabled"
            value={props.disabled}
            onChange={(value) => updateProp('disabled', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Width"
            value={props.width}
            onChange={(value) => updateProp('width', value)}
            type="text"
          />

          <PropertyInput
            label="Height"
            value={props.height}
            onChange={(value) => updateProp('height', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const TextareaBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Textarea Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Placeholder"
            value={props.placeholder}
            onChange={(value) => updateProp('placeholder', value)}
            type="text"
          />

          <PropertyInput
            label="Value"
            value={props.value}
            onChange={(value) => updateProp('value', value)}
            type="text"
          />

          <PropertyInput
            label="Name"
            value={props.name}
            onChange={(value) => updateProp('name', value)}
            type="text"
          />

          <PropertyInput
            label="Rows"
            value={props.rows}
            onChange={(value) => updateProp('rows', value)}
            type="number"
          />

          <PropertyInput
            label="Cols"
            value={props.cols}
            onChange={(value) => updateProp('cols', value)}
            type="number"
          />

          <PropertyInput
            label="Required"
            value={props.required}
            onChange={(value) => updateProp('required', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Disabled"
            value={props.disabled}
            onChange={(value) => updateProp('disabled', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Width"
            value={props.width}
            onChange={(value) => updateProp('width', value)}
            type="text"
          />

          <PropertyInput
            label="Height"
            value={props.height}
            onChange={(value) => updateProp('height', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const SelectBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Select Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Name"
            value={props.name}
            onChange={(value) => updateProp('name', value)}
            type="text"
          />

          <PropertyInput
            label="Required"
            value={props.required}
            onChange={(value) => updateProp('required', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Disabled"
            value={props.disabled}
            onChange={(value) => updateProp('disabled', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Multiple"
            value={props.multiple}
            onChange={(value) => updateProp('multiple', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Width"
            value={props.width}
            onChange={(value) => updateProp('width', value)}
            type="text"
          />

          <PropertyInput
            label="Height"
            value={props.height}
            onChange={(value) => updateProp('height', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const CheckboxBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Checkbox Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Label"
            value={props.label}
            onChange={(value) => updateProp('label', value)}
            type="text"
          />

          <PropertyInput
            label="Name"
            value={props.name}
            onChange={(value) => updateProp('name', value)}
            type="text"
          />

          <PropertyInput
            label="Value"
            value={props.value}
            onChange={(value) => updateProp('value', value)}
            type="text"
          />

          <PropertyInput
            label="Checked"
            value={props.checked}
            onChange={(value) => updateProp('checked', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Required"
            value={props.required}
            onChange={(value) => updateProp('required', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Disabled"
            value={props.disabled}
            onChange={(value) => updateProp('disabled', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const RadioBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Radio Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Label"
            value={props.label}
            onChange={(value) => updateProp('label', value)}
            type="text"
          />

          <PropertyInput
            label="Name"
            value={props.name}
            onChange={(value) => updateProp('name', value)}
            type="text"
          />

          <PropertyInput
            label="Value"
            value={props.value}
            onChange={(value) => updateProp('value', value)}
            type="text"
          />

          <PropertyInput
            label="Checked"
            value={props.checked}
            onChange={(value) => updateProp('checked', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Required"
            value={props.required}
            onChange={(value) => updateProp('required', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Disabled"
            value={props.disabled}
            onChange={(value) => updateProp('disabled', value)}
            type="select"
            options={[
              { value: false, label: 'No' },
              { value: true, label: 'Yes' }
            ]}
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const CountdownTimerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  const handleTargetDateChange = (dateString: string) => {
    try {
      // Ensure we have a valid date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        updateProp('targetDate', date.toISOString());
      }
    } catch (error) {
      console.error('Invalid date:', error);
    }
  };

  const getTimeUntilTarget = () => {
    try {
      const targetDate = new Date(props.targetDate || new Date(Date.now() + 24 * 60 * 60 * 1000));
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, expired: false };
    } catch (error) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };
    }
  };

  const timeLeft = getTimeUntilTarget();
  const isExpired = timeLeft.expired;

  const formatOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'minimal', label: 'Minimal' }
  ];

  const presetOptions = [
    { label: '24 hours from now', value: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
    { label: '7 days from now', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    { label: '30 days from now', value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    { label: 'End of month', value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString() },
    { label: 'End of year', value: new Date(new Date().getFullYear(), 11, 31).toISOString() }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Countdown Timer Properties</h3>

        {/* Timer Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-gray-300 mb-2">Timer Preview</div>
            <div className="flex justify-center gap-3">
              {props.showDays && (
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{timeLeft.days}</div>
                  <div className="text-xs text-gray-400">Days</div>
                </div>
              )}
              {props.showHours && (
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-400">Hours</div>
                </div>
              )}
              {props.showMinutes && (
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-400">Minutes</div>
                </div>
              )}
              {props.showSeconds && (
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{timeLeft.seconds}</div>
                  <div className="text-xs text-gray-400">Seconds</div>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {isExpired ? '⏰ Timer expired' : `⏳ Time left: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
            </div>
          </div>
        </div>

        {/* Timer Settings */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Timer Settings</h4>

          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Target Date & Time</label>
            <input
              type="datetime-local"
              value={props.targetDate ? new Date(props.targetDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleTargetDateChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {presetOptions.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handleTargetDateChange(preset.value)}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <PropertyInput
            label="Timer Format"
            value={props.format}
            onChange={(value) => updateProp('format', value)}
            type="select"
            options={formatOptions}
          />

          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-2">Show Time Units</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={props.showDays}
                  onChange={(e) => updateProp('showDays', e.target.checked)}
                  className="mr-2"
                />
                Days
              </label>
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={props.showHours}
                  onChange={(e) => updateProp('showHours', e.target.checked)}
                  className="mr-2"
                />
                Hours
              </label>
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={props.showMinutes}
                  onChange={(e) => updateProp('showMinutes', e.target.checked)}
                  className="mr-2"
                />
                Minutes
              </label>
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={props.showSeconds}
                  onChange={(e) => updateProp('showSeconds', e.target.checked)}
                  className="mr-2"
                />
                Seconds
              </label>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Limited Time Offer"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Hurry up! This offer expires soon."
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="inherit"
            />
          </div>
        </div>

        {/* Expired State */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Expired State</h4>

          <PropertyInput
            label="Expired Message"
            value={props.expiredMessage}
            onChange={(value) => updateProp('expiredMessage', value)}
            type="text"
            placeholder="This offer has expired"
          />

          <PropertyInput
            label="Action Button Text"
            value={props.expiredActionText}
            onChange={(value) => updateProp('expiredActionText', value)}
            type="text"
            placeholder="View Other Offers"
          />

          <PropertyInput
            label="Action Button URL"
            value={props.expiredActionUrl}
            onChange={(value) => updateProp('expiredActionUrl', value)}
            type="text"
            placeholder="#"
          />
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-3 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />

            <PropertyInput
              label="Accent Color"
              value={props.accentColor}
              onChange={(value) => updateProp('accentColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="30px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="12px"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="none"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Font Weight"
              value={props.fontWeight}
              onChange={(value) => updateProp('fontWeight', value)}
              type="text"
              placeholder="bold"
            />
          </div>
        </div>

        {/* Timer Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Timer Info</h4>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {isExpired ? 'Expired' : 'Active'}
              </div>
              <div className="text-xs text-gray-400">Status</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.format || 'detailed'}
              </div>
              <div className="text-xs text-gray-400">Format</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Target: {props.targetDate ? new Date(props.targetDate).toLocaleString() : 'Not set'}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressBarBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;
  const percentage = Math.min(Math.max(((props.value || 0) / (props.max || 100)) * 100, 0), 100);

  const variantColors = {
    default: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4'
  };

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const variantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'danger', label: 'Danger' },
    { value: 'info', label: 'Info' }
  ];

  const applyVariant = (variant: string) => {
    updateProp('progressColor', variantColors[variant as keyof typeof variantColors] || variantColors.default);
    updateProp('variant', variant);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Progress Bar Properties</h3>

        {/* Progress Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-gray-300 mb-3">Live Preview</div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div
                className="w-full rounded overflow-hidden"
                style={{
                  backgroundColor: props.backgroundColor || '#f3f4f6',
                  height: props.size === 'small' ? '8px' : props.size === 'large' ? '32px' : props.height || '20px',
                  borderRadius: props.borderRadius || '4px'
                }}
              >
                <div
                  style={{
                    backgroundColor: variantColors[props.variant as keyof typeof variantColors] || props.progressColor || '#3b82f6',
                    width: `${percentage}%`,
                    height: '100%',
                    borderRadius: props.borderRadius || '4px'
                  }}
                />
              </div>

              {/* Progress Info */}
              <div className="mt-2 flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  {props.value || 0} / {props.max || 100}
                </div>
                <div className="text-sm font-medium text-white">
                  {Math.round(percentage)}%
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-800/50 rounded">
                <div className="text-sm font-medium text-white">{Math.round(percentage)}%</div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>

              <div className="p-2 bg-gray-800/50 rounded">
                <div className="text-sm font-medium text-white capitalize">{props.variant || 'default'}</div>
                <div className="text-xs text-gray-400">Variant</div>
              </div>

              <div className="p-2 bg-gray-800/50 rounded">
                <div className="text-sm font-medium text-white capitalize">{props.size || 'medium'}</div>
                <div className="text-xs text-gray-400">Size</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Settings */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Progress Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Current Value</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max={props.max || 100}
                  value={props.value || 0}
                  onChange={(e) => updateProp('value', parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="ml-3 text-sm text-white w-12">
                  {props.value || 0}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Max Value</label>
              <input
                type="number"
                min="1"
                value={props.max || 100}
                onChange={(e) => updateProp('max', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Size"
              value={props.size}
              onChange={(value) => updateProp('size', value)}
              type="select"
              options={sizeOptions}
            />

            <PropertyInput
              label="Display Variant"
              value={props.variant}
              onChange={(value) => applyVariant(value)}
              type="select"
              options={variantOptions}
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Percentage"
              value={props.showPercentage}
              onChange={(value) => updateProp('showPercentage', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Values"
              value={props.showValue}
              onChange={(value) => updateProp('showValue', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Progress"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Current progress status"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
              ]}
            />

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="16px"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Progress Color"
              value={props.progressColor}
              onChange={(value) => updateProp('progressColor', value)}
              type="color"
            />

            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />

            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Effects */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Effects</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Animated"
              value={props.animated}
              onChange={(value) => updateProp('animated', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Striped"
              value={props.striped}
              onChange={(value) => updateProp('striped', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProp('height', value)}
              type="text"
              placeholder="20px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="20px"
            />

            <PropertyInput
              label="Margin"
              value={props.margin}
              onChange={(value) => updateProp('margin', value)}
              type="text"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, "");

        updateBlock(block.id, {
          props: {
            ...block.props,
            imageUrl: imageUrl,
            imageAlt: fileName || 'Product image',
            title: fileName || 'Product'
          }
        } as any);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }

    event.target.value = '';
  };

  const props = block.props as any;

  const layoutOptions = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' }
  ];

  const badgeOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'SALE', label: 'Sale' },
    { value: 'HOT', label: 'Hot' },
    { value: 'BEST', label: 'Best Seller' },
    { value: '', label: 'None' }
  ];

  const badgeColors = {
    'NEW': '#ef4444',
    'SALE': '#10b981',
    'HOT': '#f59e0b',
    'BEST': '#8b5cf6',
    '': '#6b7280'
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Product Properties</h3>

        {/* Product Image */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Product Image</h4>
            {props.imageUrl && (
              <button
                onClick={() => updateProp('imageUrl', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          <div className="mb-3">
            <PropertyInput
              label="Image URL"
              value={props.imageUrl}
              onChange={(value) => updateProp('imageUrl', value)}
              type="text"
              placeholder="https://example.com/product.jpg"
            />
          </div>

          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4">
            {props.imageUrl ? (
              <div className="text-center">
                <div className="w-32 h-24 mx-auto mb-3 overflow-hidden rounded-md">
                  <img
                    src={props.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {props.imageAlt || 'Product image'}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🛍️</div>
                <p className="text-sm text-gray-400">No product image</p>
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
            >
              {props.imageUrl ? 'Change Image' : 'Upload Image'}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Product Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Product Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Product Name"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Product description goes here"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Description"
              value={props.showDescription}
              onChange={(value) => updateProp('showDescription', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Layout"
              value={props.layout}
              onChange={(value) => updateProp('layout', value)}
              type="select"
              options={layoutOptions}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Pricing</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Price"
              value={props.price}
              onChange={(value) => updateProp('price', value)}
              type="text"
              placeholder="$99.99"
            />

            <PropertyInput
              label="Currency"
              value={props.currency}
              onChange={(value) => updateProp('currency', value)}
              type="text"
              placeholder="$"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Original Price"
              value={props.originalPrice}
              onChange={(value) => updateProp('originalPrice', value)}
              type="text"
              placeholder="$149.99"
            />

            <PropertyInput
              label="Show Original Price"
              value={props.showOriginalPrice}
              onChange={(value) => updateProp('showOriginalPrice', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Discount Label"
              value={props.discount}
              onChange={(value) => updateProp('discount', value)}
              type="text"
              placeholder="33% OFF"
            />
          </div>
        </div>

        {/* Ratings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Ratings</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Rating (0-5)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={props.rating || 0}
                onChange={(e) => updateProp('rating', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                {props.rating || 0} stars
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Review Count</label>
              <input
                type="number"
                min="0"
                value={props.reviewCount || 0}
                onChange={(e) => updateProp('reviewCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Badge</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Badge Type</label>
              <select
                value={props.badge || ''}
                onChange={(e) => {
                  updateProp('badge', e.target.value);
                  if (e.target.value in badgeColors) {
                    updateProp('badgeColor', badgeColors[e.target.value as keyof typeof badgeColors]);
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                {badgeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <PropertyInput
              label="Badge Color"
              value={props.badgeColor}
              onChange={(value) => updateProp('badgeColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Buy Button */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Buy Button</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Button"
              value={props.showButton}
              onChange={(value) => updateProp('showButton', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Button Color"
              value={props.buttonColor}
              onChange={(value) => updateProp('buttonColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Button Text"
              value={props.buttonText}
              onChange={(value) => updateProp('buttonText', value)}
              type="text"
              placeholder="Buy Now"
            />

            <PropertyInput
              label="Button URL"
              value={props.buttonUrl}
              onChange={(value) => updateProp('buttonUrl', value)}
              type="text"
              placeholder="#"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Price Color"
              value={props.priceColor}
              onChange={(value) => updateProp('priceColor', value)}
              type="color"
            />

            <PropertyInput
              label="Original Price Color"
              value={props.originalPriceColor}
              onChange={(value) => updateProp('originalPriceColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="20px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #e5e7eb"
            />

            <PropertyInput
              label="Shadow"
              value={props.shadow}
              onChange={(value) => updateProp('shadow', value)}
              type="text"
              placeholder="0 1px 3px rgba(0,0,0,0.1)"
            />
          </div>
        </div>

        {/* Product Preview */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Product Info</h4>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.layout || 'vertical'}
              </div>
              <div className="text-xs text-gray-400">Layout</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.rating || 0}★
              </div>
              <div className="text-xs text-gray-400">Rating</div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            {props.badge && (
              <span className="inline-block px-2 py-1 rounded text-white mr-2" style={{ backgroundColor: props.badgeColor }}>
                {props.badge}
              </span>
            )}
            {props.discount && (
              <span className="inline-block px-2 py-1 bg-red-500 text-white rounded">
                {props.discount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const PromoCodeBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateProp('code', code);
  };

  const borderStyleOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' }
  ];

  const layoutOptions = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' }
  ];

  const animationOptions = [
    { value: 'none', label: 'None' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'bounce', label: 'Bounce' }
  ];

  const discountOptions = [
    { value: '10% OFF', label: '10% Off' },
    { value: '20% OFF', label: '20% Off' },
    { value: '30% OFF', label: '30% Off' },
    { value: '50% OFF', label: '50% Off' },
    { value: 'FREE', label: 'Free' }
  ];

  const getValidUntilDate = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    return {
      'Next week': nextWeek.toISOString().split('T')[0],
      'Next month': nextMonth.toISOString().split('T')[0],
      'Next year': nextYear.toISOString().split('T')[0],
      'End of year': new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0]
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Promo Code Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-gray-300 mb-2">Preview</div>
            <div className="inline-block px-4 py-2 rounded-md font-mono text-lg font-bold text-white bg-gray-800">
              {props.code || 'SAVE20'}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Code length: {props.code?.length || 0} characters
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Promo Code</h4>
            <button
              onClick={generateRandomCode}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
            >
              Generate
            </button>
          </div>

          <input
            type="text"
            value={props.code || ''}
            onChange={(e) => updateProp('code', e.target.value.toUpperCase())}
            placeholder="SAVE20"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-lg font-mono text-center"
            maxLength={20}
          />

          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <div>Use letters & numbers only</div>
            <div>{props.code?.length || 0}/20</div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Special Offer!"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Use this promo code to get an amazing discount"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Discount"
              value={props.discount}
              onChange={(value) => updateProp('discount', value)}
              type="text"
              placeholder="20% OFF"
            />

            <div>
              <label className="block text-xs text-gray-400 mb-1">Quick Discounts</label>
              <select
                value=""
                onChange={(e) => e.target.value && updateProp('discount', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value="">Select preset...</option>
                {discountOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Layout"
              value={props.layout}
              onChange={(value) => updateProp('layout', value)}
              type="select"
              options={layoutOptions}
            />

            <PropertyInput
              label="Animation"
              value={props.animation}
              onChange={(value) => updateProp('animation', value)}
              type="select"
              options={animationOptions}
            />
          </div>
        </div>

        {/* Validity */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Validity</h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Valid Until</label>
              <input
                type="date"
                value={props.validUntil ? props.validUntil.split('T')[0] : ''}
                onChange={(e) => updateProp('validUntil', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Quick Dates</label>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    updateProp('validUntil', e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value="">Select preset...</option>
                {Object.entries(getValidUntilDate()).map(([label, date]) => (
                  <option key={label} value={date}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Show Valid Until"
              value={props.showValidUntil}
              onChange={(value) => updateProp('showValidUntil', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Discount"
              value={props.showDiscount}
              onChange={(value) => updateProp('showDiscount', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Copy Button */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Copy Button</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Button Text"
              value={props.buttonText}
              onChange={(value) => updateProp('buttonText', value)}
              type="text"
              placeholder="Copy Code"
            />

            <PropertyInput
              label="Show Copy Button"
              value={props.showCopyButton}
              onChange={(value) => updateProp('showCopyButton', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Code Background"
              value={props.codeBackgroundColor}
              onChange={(value) => updateProp('codeBackgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Code Text Color"
              value={props.codeTextColor}
              onChange={(value) => updateProp('codeTextColor', value)}
              type="color"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Button Color"
              value={props.buttonColor}
              onChange={(value) => updateProp('buttonColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Border */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Border</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Border Style"
              value={props.borderStyle}
              onChange={(value) => updateProp('borderStyle', value)}
              type="select"
              options={borderStyleOptions}
            />

            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="24px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="12px"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Shadow"
              value={props.shadow}
              onChange={(value) => updateProp('shadow', value)}
              type="text"
              placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Promo Code Info</h4>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.layout || 'vertical'}
              </div>
              <div className="text-xs text-gray-400">Layout</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.animation || 'none'}
              </div>
              <div className="text-xs text-gray-400">Animation</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            {props.validUntil && (
              <div>
                📅 Valid until: {new Date(props.validUntil).toLocaleDateString()}
              </div>
            )}
            {props.discount && (
              <div className="mt-1">
                🎯 Discount: {props.discount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  // const discountOptions = [
  //   { value: '10% OFF', label: '10% Off' },
  //   { value: '20% OFF', label: '20% Off' },
  //   { value: '30% OFF', label: '30% Off' },
  //   { value: '50% OFF', label: '50% Off' },
  //   { value: 'FREE', label: 'Free' }
  // ];

  const layoutOptions = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' }
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  // Quick preset features
  const featurePresets = {
    basic: ['Feature 1', 'Feature 2', 'Feature 3'],
    professional: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Priority Support'],
    enterprise: ['All Features', 'Unlimited Users', 'Custom Solutions', '24/7 Support', 'Training']
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Price Card Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-gray-300 mb-2">Preview</div>
            <div className="inline-block px-4 py-2 rounded-lg font-bold text-xl text-white bg-gray-800">
              {props.currency || '$'}{props.price || '29'}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {props.period || '/month'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Title"
            value={props.title}
            onChange={(value) => updateProp('title', value)}
            type="text"
            placeholder="Basic Plan"
          />

          <PropertyInput
            label="Description"
            value={props.description}
            onChange={(value) => updateProp('description', value)}
            type="text"
            placeholder="Perfect for getting started"
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Price"
              value={props.price}
              onChange={(value) => updateProp('price', value)}
              type="text"
              placeholder="29"
            />

            <PropertyInput
              label="Currency"
              value={props.currency}
              onChange={(value) => updateProp('currency', value)}
              type="text"
              placeholder="$"
            />
          </div>

          <PropertyInput
            label="Period"
            value={props.period}
            onChange={(value) => updateProp('period', value)}
            type="text"
            placeholder="/month"
          />
        </div>

        {/* Features */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Features</h4>

          <div className="flex justify-between mb-3">
            <PropertyInput
              label="Show Features"
              value={props.showFeatures}
              onChange={(value) => updateProp('showFeatures', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <div>
              <label className="block text-xs text-gray-400 mb-1">Feature Presets</label>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && featurePresets[e.target.value as keyof typeof featurePresets]) {
                    updateProp('features', featurePresets[e.target.value as keyof typeof featurePresets]);
                  }
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value="">Select preset...</option>
                <option value="basic">Basic Plan Features</option>
                <option value="professional">Professional Features</option>
                <option value="enterprise">Enterprise Features</option>
              </select>
            </div>
          </div>

          {props.showFeatures && (
            <div className="mt-3">
              <label className="block text-sm text-gray-300 mb-2">Feature List (one per line)</label>
              <textarea
                value={Array.isArray(props.features) ? props.features.join('\n') : ''}
                onChange={(e) => updateProp('features', e.target.value.split('\n').filter(f => f.trim()))}
                rows={4}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              />
            </div>
          )}
        </div>

        {/* Button */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Action Button</h4>

          <div className="mb-3">
            <PropertyInput
              label="Show Button"
              value={props.showButton}
              onChange={(value) => updateProp('showButton', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          {props.showButton && (
            <>
              <PropertyInput
                label="Button Text"
                value={props.buttonText}
                onChange={(value) => updateProp('buttonText', value)}
                type="text"
                placeholder="Get Started"
              />

              <PropertyInput
                label="Button URL"
                value={props.buttonUrl}
                onChange={(value) => updateProp('buttonUrl', value)}
                type="text"
                placeholder="#"
              />
            </>
          )}
        </div>

        {/* Popular Badge */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Popular Badge</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Popular Plan"
              value={props.popular}
              onChange={(value) => updateProp('popular', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Badge"
              value={props.showPopular}
              onChange={(value) => updateProp('showPopular', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          {props.popular && props.showPopular && (
            <div className="mt-3">
              <PropertyInput
                label="Badge Text"
                value={props.popularText}
                onChange={(value) => updateProp('popularText', value)}
                type="text"
                placeholder="Most Popular"
              />
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Price Color"
              value={props.priceColor}
              onChange={(value) => updateProp('priceColor', value)}
              type="color"
            />

            <PropertyInput
              label="Button Color"
              value={props.buttonColor}
              onChange={(value) => updateProp('buttonColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Accent Color"
              value={props.accentColor}
              onChange={(value) => updateProp('accentColor', value)}
              type="color"
            />

            <PropertyInput
              label="Popular Badge Color"
              value={props.popularColor}
              onChange={(value) => updateProp('popularColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Layout & Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Layout & Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Layout"
              value={props.layout}
              onChange={(value) => updateProp('layout', value)}
              type="select"
              options={layoutOptions}
            />

            <PropertyInput
              label="Size"
              value={props.size}
              onChange={(value) => updateProp('size', value)}
              type="select"
              options={sizeOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="32px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="12px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Shadow"
              value={props.shadow}
              onChange={(value) => updateProp('shadow', value)}
              type="text"
              placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            />

            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #e5e7eb"
            />
          </div>
        </div>

        {/* Display Options */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Display Options</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Original Price"
              value={props.showOriginalPrice}
              onChange={(value) => updateProp('showOriginalPrice', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Original Price"
              value={props.originalPrice}
              onChange={(value) => updateProp('originalPrice', value)}
              type="text"
              placeholder="49"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Price Card Info</h4>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.layout || 'vertical'}
              </div>
              <div className="text-xs text-gray-400">Layout</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.size || 'medium'}
              </div>
              <div className="text-xs text-gray-400">Size</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            {props.popular && (
              <div className="mb-1">
                🏆 This is a popular plan
              </div>
            )}
            {Array.isArray(props.features) && props.features.length > 0 && (
              <div>
                📋 {props.features.length} features included
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const TestimonialBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        const avatarAlt = file.name.replace(/\.[^/.]+$/, "");

        updateBlock(block.id, {
          props: {
            ...block.props,
            avatarUrl: avatarUrl,
            avatarAlt: avatarAlt || 'Avatar'
          }
        } as any);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }

    event.target.value = '';
  };

  const props = block.props as any;

  const layoutOptions = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'card', label: 'Card Style' }
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const alignmentOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];

  const testimonialPresets = {
    customer1: {
      quote: 'This product has completely transformed our workflow. The results speak for themselves!',
      author: 'John Doe',
      title: 'CEO',
      company: 'Acme Corp'
    },
    customer2: {
      quote: 'Outstanding service and amazing results. Highly recommended!',
      author: 'Jane Smith',
      title: 'Marketing Director',
      company: 'Tech Innovations'
    },
    customer3: {
      quote: 'Best decision we made this year. ROI exceeded all expectations.',
      author: 'Robert Johnson',
      title: 'Operations Manager',
      company: 'Global Solutions'
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Testimonial Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-gray-300 mb-2">Preview</div>
            <div className="flex items-center justify-center mb-2">
              {props.rating && props.showRating && (
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-xl"
                      style={{
                        color: i < (props.rating || 0) ? '#fbbf24' : '#d1d5db'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-300">
              {props.author || 'John Doe'}
            </div>
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Quote"
            value={props.quote}
            onChange={(value) => updateProp('quote', value)}
            type="text"
            placeholder="This product has completely transformed our workflow..."
          />

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Author"
              value={props.author}
              onChange={(value) => updateProp('author', value)}
              type="text"
              placeholder="John Doe"
            />

            <PropertyInput
              label="Rating (0-5)"
              value={props.rating || 5}
              onChange={(value) => updateProp('rating', Number(value))}
              type="range"
              min={0}
              max={5}
              step={0.5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Title/Role"
              value={props.title}
              onChange={(value) => updateProp('title', value)}
              type="text"
              placeholder="CEO"
            />

            <PropertyInput
              label="Company"
              value={props.company}
              onChange={(value) => updateProp('company', value)}
              type="text"
              placeholder="Acme Corp"
            />
          </div>

          {/* Presets */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(testimonialPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    updateProp('quote', preset.quote);
                    updateProp('author', preset.author);
                    updateProp('title', preset.title);
                    updateProp('company', preset.company);
                  }}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {key.replace('customer', 'Customer ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Avatar</h4>

          <div className="flex items-center justify-between mb-3">
            <PropertyInput
              label="Show Avatar"
              value={props.showAvatar}
              onChange={(value) => updateProp('showAvatar', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            {props.avatarUrl && (
              <button
                onClick={() => updateProp('avatarUrl', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove Avatar
              </button>
            )}
          </div>

          {props.showAvatar && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4">
              {props.avatarUrl ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 overflow-hidden rounded-full">
                    <img
                      src={props.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {props.avatarAlt || 'Avatar'}
                  </p>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="text-2xl mb-1">👤</div>
                  <p className="text-sm text-gray-400">No avatar</p>
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
              >
                {props.avatarUrl ? 'Change Avatar' : 'Upload Avatar'}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {props.showAvatar && (
            <div className="mt-3">
              <PropertyInput
                label="Avatar URL"
                value={props.avatarUrl}
                onChange={(value) => updateProp('avatarUrl', value)}
                type="text"
                placeholder="https://example.com/avatar.jpg"
              />

              <PropertyInput
                label="Avatar Alt Text"
                value={props.avatarAlt}
                onChange={(value) => updateProp('avatarAlt', value)}
                type="text"
                placeholder="John Doe's avatar"
              />
            </div>
          )}
        </div>

        {/* Display Options */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Display Options</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Layout"
              value={props.layout}
              onChange={(value) => updateProp('layout', value)}
              type="select"
              options={layoutOptions}
            />

            <PropertyInput
              label="Size"
              value={props.size}
              onChange={(value) => updateProp('size', value)}
              type="select"
              options={sizeOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Alignment"
              value={props.alignment}
              onChange={(value) => updateProp('alignment', value)}
              type="select"
              options={alignmentOptions}
            />

            <div className="grid grid-cols-2 gap-2">
              <PropertyInput
                label="Show Rating"
                value={props.showRating}
                onChange={(value) => updateProp('showRating', value)}
                type="select"
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' }
                ]}
              />

              <PropertyInput
                label="Show Quote"
                value={props.showQuote}
                onChange={(value) => updateProp('showQuote', value)}
                type="select"
                options={[
                  { value: true, label: 'Yes' },
                  { value: false, label: 'No' }
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Show Title"
              value={props.showTitle}
              onChange={(value) => updateProp('showTitle', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Company"
              value={props.showCompany}
              onChange={(value) => updateProp('showCompany', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Quote Color"
              value={props.quoteColor}
              onChange={(value) => updateProp('quoteColor', value)}
              type="color"
            />

            <PropertyInput
              label="Author Color"
              value={props.authorColor}
              onChange={(value) => updateProp('authorColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Accent Color"
              value={props.accentColor}
              onChange={(value) => updateProp('accentColor', value)}
              type="color"
            />

            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="32px"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="12px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #e5e7eb"
            />

            <PropertyInput
              label="Shadow"
              value={props.shadow}
              onChange={(value) => updateProp('shadow', value)}
              type="text"
              placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>

        {/* Testimonial Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Testimonial Info</h4>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.layout || 'vertical'}
              </div>
              <div className="text-xs text-gray-400">Layout</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.size || 'medium'}
              </div>
              <div className="text-xs text-gray-400">Size</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.alignment || 'left'}
              </div>
              <div className="text-xs text-gray-400">Alignment</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            {props.rating && (
              <div className="mb-1">
                ⭐ Rating: {props.rating}/5
              </div>
            )}
            {props.showAvatar && props.avatarUrl && (
              <div>
                👤 Avatar: {props.avatarUrl.substring(0, 20)}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavbarBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;

        updateBlock(block.id, {
          props: {
            ...block.props,
            brandImage: imageUrl,
            brand: file.name.replace(/\.[^/.]+$/, "")
          }
        } as any);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }

    event.target.value = '';
  };

  const props = block.props as any;
  const links = props.links || [];

  const handleLinkUpdate = (index: number, linkUpdates: any) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...updatedLinks[index], ...linkUpdates };
    updateProp('links', updatedLinks);
  };

  const addLink = () => {
    const newLink = {
      text: `Link ${links.length + 1}`,
      url: '#',
      active: false
    };
    updateProp('links', [...links, newLink]);
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_: any, i: number) => i !== index);
    updateProp('links', updatedLinks);
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updatedLinks = [...links];
      [updatedLinks[index], updatedLinks[index - 1]] = [updatedLinks[index - 1], updatedLinks[index]];
      updateProp('links', updatedLinks);
    } else if (direction === 'down' && index < links.length - 1) {
      const updatedLinks = [...links];
      [updatedLinks[index], updatedLinks[index + 1]] = [updatedLinks[index + 1], updatedLinks[index]];
      updateProp('links', updatedLinks);
    }
  };

  const presetLinks = {
    basic: [
      { text: 'Home', url: '#', active: true },
      { text: 'About', url: '#' },
      { text: 'Services', url: '#' },
      { text: 'Contact', url: '#' }
    ],
    ecommerce: [
      { text: 'Home', url: '#', active: true },
      { text: 'Shop', url: '#' },
      { text: 'Categories', url: '#' },
      { text: 'Deals', url: '#' },
      { text: 'Cart', url: '#' }
    ],
    portfolio: [
      { text: 'Home', url: '#', active: true },
      { text: 'Portfolio', url: '#' },
      { text: 'About', url: '#' },
      { text: 'Services', url: '#' },
      { text: 'Contact', url: '#' }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Navbar Properties</h3>

        {/* Brand Section */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Brand</h4>

          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              {props.brandImage ? (
                <div className="w-16 h-16 mx-auto mb-2 overflow-hidden rounded-lg">
                  <img
                    src={props.brandImage}
                    alt="Logo Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🏢</span>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
              >
                {props.brandImage ? 'Change Logo' : 'Upload Logo'}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {props.brandImage && (
              <button
                onClick={() => updateProp('brandImage', '')}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
              >
                Remove Logo
              </button>
            )}
          </div>

          <div className="mb-3">
            <PropertyInput
              label="Logo URL"
              value={props.brandImage}
              onChange={(value) => updateProp('brandImage', value)}
              type="text"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <PropertyInput
            label="Brand Name"
            value={props.brand}
            onChange={(value) => updateProp('brand', value)}
            type="text"
            placeholder="Your Brand"
          />

          <PropertyInput
            label="Brand URL"
            value={props.brandUrl}
            onChange={(value) => updateProp('brandUrl', value)}
            type="text"
            placeholder="#"
          />
        </div>

        {/* Navigation Links */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Navigation Links ({links.length})</h4>
            <div className="flex gap-2">
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && presetLinks[e.target.value as keyof typeof presetLinks]) {
                    updateProp('links', presetLinks[e.target.value as keyof typeof presetLinks]);
                  }
                }}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-xs"
              >
                <option value="">Presets...</option>
                <option value="basic">Basic Navigation</option>
                <option value="ecommerce">E-commerce</option>
                <option value="portfolio">Portfolio</option>
              </select>

              <button
                onClick={addLink}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
              >
                + Add Link
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {links.map((link: any, index: number) => (
              <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-300">{index + 1}</span>
                    <div className="text-sm text-gray-300">{link.text}</div>
                    {link.active && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                      className={`text-xs ${index === 0 ? 'text-gray-600' : 'text-blue-400 hover:text-blue-300'}`}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveLink(index, 'down')}
                      disabled={index === links.length - 1}
                      className={`text-xs ${index === links.length - 1 ? 'text-gray-600' : 'text-blue-400 hover:text-blue-300'}`}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeLink(index)}
                      className="text-xs text-red-400 hover:text-red-300"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) => handleLinkUpdate(index, { text: e.target.value })}
                      placeholder="Link Text"
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    />

                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleLinkUpdate(index, { url: e.target.value })}
                      placeholder="URL"
                      className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={link.active || false}
                        onChange={(e) => handleLinkUpdate(index, { active: e.target.checked })}
                        className="mr-2"
                      />
                      Active Page
                    </label>

                    <label className="flex items-center text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={link.newTab || false}
                        onChange={(e) => handleLinkUpdate(index, { newTab: e.target.checked })}
                        className="mr-2"
                      />
                      Open in New Tab
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {links.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                <div className="text-2xl mb-2">🔗</div>
                <p>No navigation links added.</p>
                <p className="text-xs mt-1">Click "Add Link" to create navigation items.</p>
              </div>
            )}
          </div>
        </div>

        {/* Navbar Settings */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Navbar Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Sticky Navbar"
              value={props.sticky}
              onChange={(value) => updateProp('sticky', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Transparent Background"
              value={props.transparent}
              onChange={(value) => updateProp('transparent', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Mobile Menu"
              value={props.mobileMenu}
              onChange={(value) => updateProp('mobileMenu', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="1rem"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Logo Height"
              value={props.logoHeight}
              onChange={(value) => updateProp('logoHeight', value)}
              type="text"
              placeholder="2rem"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.textColor}
              onChange={(value) => updateProp('textColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Hover Color"
              value={props.hoverColor}
              onChange={(value) => updateProp('hoverColor', value)}
              type="color"
            />

            <PropertyInput
              label="Active Color"
              value={props.activeColor}
              onChange={(value) => updateProp('activeColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Link Spacing"
              value={props.linkSpacing}
              onChange={(value) => updateProp('linkSpacing', value)}
              type="text"
              placeholder="2rem"
            />

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="1rem"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #e5e7eb"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="0"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Shadow"
              value={props.shadow}
              onChange={(value) => updateProp('shadow', value)}
              type="text"
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>
        </div>

        {/* Navbar Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Navbar Info</h4>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">{links.length}</div>
              <div className="text-xs text-gray-400">Links</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.sticky ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-400">Sticky</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.mobileMenu ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-400">Mobile Menu</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            {props.brandImage && (
              <div>
                🖼️ Logo: {props.brandImage.substring(0, 20)}...
              </div>
            )}
            {links.find((link: any) => link.active) && (
              <div className="mt-1">
                ✅ Active page: {links.find((link: any) => link.active)?.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CardBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const imageAlt = file.name.replace(/\.[^/.]+$/, "");

        updateBlock(block.id, {
          props: {
            ...block.props,
            image: imageUrl,
            imageAlt: imageAlt || 'Card image'
          }
        } as any);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    }

    event.target.value = '';
  };

  const props = block.props as any;

  const imagePositionOptions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
  ];

  const textAlignOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
    { value: 'justify', label: 'Justify' }
  ];

  const cardPresets = {
    basic: {
      title: 'Card Title',
      content: 'This is the card content. You can add any text or HTML here.',
      showImage: false,
      showTitle: true,
      showContent: true
    },
    imageCard: {
      title: 'Image Card',
      content: 'A card with a beautiful image.',
      showImage: true,
      showTitle: true,
      showContent: true,
      imagePosition: 'top'
    },
    simple: {
      title: '',
      content: 'Simple card with content only.',
      showImage: false,
      showTitle: false,
      showContent: true
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Card Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-300 mb-2">Card Preview</div>
            <div className="inline-block max-w-xs p-4 bg-gray-800 rounded-lg">
              {props.showImage && props.image && (
                <div className="w-20 h-16 mx-auto mb-3 overflow-hidden rounded-md">
                  <img
                    src={props.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {props.showTitle && (
                <div className="text-sm font-medium text-white mb-1 truncate">
                  {props.title?.substring(0, 20) || 'Card Title'}...
                </div>
              )}
              {props.showContent && (
                <div className="text-xs text-gray-400 truncate">
                  {props.content?.substring(0, 30) || 'Card content'}...
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {props.textAlign || 'left'} aligned
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <PropertyInput
              label="Show Title"
              value={props.showTitle}
              onChange={(value) => updateProp('showTitle', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Show Content"
              value={props.showContent}
              onChange={(value) => updateProp('showContent', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>

          {props.showTitle && (
            <PropertyInput
              label="Title"
              value={props.title}
              onChange={(value) => updateProp('title', value)}
              type="text"
              placeholder="Card Title"
            />
          )}

          {props.showContent && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Content</label>
              <textarea
                value={props.content || ''}
                onChange={(e) => updateProp('content', e.target.value)}
                rows={3}
                placeholder="This is the card content. You can add any text or HTML here."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              />
            </div>
          )}

          {/* Presets */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(cardPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    Object.entries(preset).forEach(([propKey, propValue]) => {
                      updateProp(propKey, propValue);
                    });
                  }}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1).replace('Card', ' Card')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Image</h4>

          <div className="flex items-center justify-between mb-3">
            <PropertyInput
              label="Show Image"
              value={props.showImage}
              onChange={(value) => updateProp('showImage', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            {props.image && (
              <button
                onClick={() => updateProp('image', '')}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove Image
              </button>
            )}
          </div>

          {props.showImage && (
            <>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-4 mb-3">
                {props.image ? (
                  <div className="text-center">
                    <div className="w-24 h-20 mx-auto mb-3 overflow-hidden rounded-md">
                      <img
                        src={props.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {props.imageAlt || 'Card image'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🖼️</div>
                    <p className="text-sm text-gray-400">No image</p>
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                >
                  {props.image ? 'Change Image' : 'Upload Image'}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-3">
                <PropertyInput
                  label="Image URL"
                  value={props.image}
                  onChange={(value) => updateProp('image', value)}
                  type="text"
                  placeholder="https://example.com/image.jpg"
                />

                <PropertyInput
                  label="Image Alt Text"
                  value={props.imageAlt}
                  onChange={(value) => updateProp('imageAlt', value)}
                  type="text"
                  placeholder="Card image description"
                />

                <PropertyInput
                  label="Image Position"
                  value={props.imagePosition}
                  onChange={(value) => updateProp('imagePosition', value)}
                  type="select"
                  options={imagePositionOptions}
                />
              </div>
            </>
          )}
        </div>

        {/* Layout & Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Layout & Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Text Alignment"
              value={props.textAlign}
              onChange={(value) => updateProp('textAlign', value)}
              type="select"
              options={textAlignOptions}
            />

            <PropertyInput
              label="Image Fit"
              value={props.objectFit}
              onChange={(value) => updateProp('objectFit', value)}
              type="select"
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'fill', label: 'Fill' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="1rem"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="8px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border"
              value={props.border}
              onChange={(value) => updateProp('border', value)}
              type="text"
              placeholder="1px solid #dee2e6"
            />

            <PropertyInput
              label="Shadow"
              value={props.boxShadow}
              onChange={(value) => updateProp('boxShadow', value)}
              type="text"
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.color}
              onChange={(value) => updateProp('color', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Title Color"
              value={props.titleColor}
              onChange={(value) => updateProp('titleColor', value)}
              type="color"
            />

            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Card Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Card Info</h4>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.imagePosition || 'top'}
              </div>
              <div className="text-xs text-gray-400">Image Position</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.showImage ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-400">Has Image</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.textAlign || 'left'}
              </div>
              <div className="text-xs text-gray-400">Alignment</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            {props.image && (
              <div className="mb-1">
                🖼️ Image: {props.image.substring(0, 20)}...
              </div>
            )}
            <div>
              📝 Content length: {props.content?.length || 0} characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BadgeBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const variantOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'outline', label: 'Outline' },
    { value: 'soft', label: 'Soft' }
  ];

  const colorPresets = {
    primary: { color: '#ffffff', backgroundColor: '#007bff' },
    secondary: { color: '#ffffff', backgroundColor: '#6c757d' },
    success: { color: '#ffffff', backgroundColor: '#28a745' },
    warning: { color: '#212529', backgroundColor: '#ffc107' },
    danger: { color: '#ffffff', backgroundColor: '#dc3545' },
    info: { color: '#ffffff', backgroundColor: '#17a2b8' },
    light: { color: '#212529', backgroundColor: '#f8f9fa' },
    dark: { color: '#ffffff', backgroundColor: '#343a40' }
  };

  const badgePresets = {
    new: { text: 'NEW', color: '#ffffff', backgroundColor: '#28a745' },
    sale: { text: 'SALE', color: '#ffffff', backgroundColor: '#dc3545' },
    hot: { text: 'HOT', color: '#212529', backgroundColor: '#ffc107' },
    bestseller: { text: 'BESTSELLER', color: '#ffffff', backgroundColor: '#6f42c1' },
    limited: { text: 'LIMITED', color: '#ffffff', backgroundColor: '#fd7e14' }
  };

  const applyPreset = (presetKey: keyof typeof badgePresets) => {
    const preset = badgePresets[presetKey];
    updateProp('text', preset.text);
    updateProp('color', preset.color);
    updateProp('backgroundColor', preset.backgroundColor);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Badge Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-300 mb-3">Badge Preview</div>
            <div className="inline-block">
              <span
                style={{
                  display: 'inline-block',
                  borderRadius: props.borderRadius || '12px',
                  fontWeight: props.fontWeight || '500',
                  fontSize: props.size === 'small' ? '0.75rem' :
                    props.size === 'large' ? '1rem' : '0.875rem',
                  padding: props.size === 'small' ? '0.125rem 0.375rem' :
                    props.size === 'large' ? '0.5rem 0.75rem' : '0.25rem 0.5rem',
                  color: props.color || '#ffffff',
                  backgroundColor: props.backgroundColor || '#007bff',
                  border: props.variant === 'outline' ? `1px solid ${props.color || '#007bff'}` : 'none',
                  background: props.variant === 'soft' ?
                    `rgba(${parseInt(props.backgroundColor?.slice(1, 3) || '0', 16)}, ${parseInt(props.backgroundColor?.slice(3, 5) || '123', 16)}, ${parseInt(props.backgroundColor?.slice(5, 7) || '255', 16)}, 0.1)` :
                    props.backgroundColor || '#007bff'
                }}
              >
                {props.text || 'Badge'}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400 capitalize">
              {props.size || 'medium'} • {props.variant || 'solid'}
            </div>
          </div>
        </div>

        {/* Badge Content */}
        <div className="space-y-4">
          <PropertyInput
            label="Badge Text"
            value={props.text}
            onChange={(value) => updateProp('text', value)}
            type="text"
            placeholder="Badge"
          />

          {/* Quick Presets */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(badgePresets).map(([key,]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof badgePresets)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Badge Style */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Style</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Size"
              value={props.size}
              onChange={(value) => updateProp('size', value)}
              type="select"
              options={sizeOptions}
            />

            <PropertyInput
              label="Variant"
              value={props.variant}
              onChange={(value) => updateProp('variant', value)}
              type="select"
              options={variantOptions}
            />
          </div>

          {/* Color Presets */}
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1">Color Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(colorPresets).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => {
                    updateProp('color', colors.color);
                    updateProp('backgroundColor', colors.backgroundColor);
                  }}
                  className="h-8 rounded flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: colors.backgroundColor,
                    color: colors.color
                  }}
                  title={name.charAt(0).toUpperCase() + name.slice(1)}
                >
                  {name.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.color}
              onChange={(value) => updateProp('color', value)}
              type="color"
            />
          </div>

          {props.variant === 'outline' && (
            <div className="mt-3">
              <PropertyInput
                label="Border Color"
                value={props.borderColor}
                onChange={(value) => updateProp('borderColor', value)}
                type="color"
              />
            </div>
          )}
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="12px"
            />

            <PropertyInput
              label="Font Weight"
              value={props.fontWeight}
              onChange={(value) => updateProp('fontWeight', value)}
              type="select"
              options={[
                { value: 'normal', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: 'bold', label: 'Bold' },
                { value: '700', label: 'Bold' },
                { value: '800', label: 'Extra Bold' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="0.875rem"
            />

            <PropertyInput
              label="Letter Spacing"
              value={props.letterSpacing}
              onChange={(value) => updateProp('letterSpacing', value)}
              type="text"
              placeholder="normal"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Text Transform"
              value={props.textTransform}
              onChange={(value) => updateProp('textTransform', value)}
              type="select"
              options={[
                { value: 'none', label: 'None' },
                { value: 'uppercase', label: 'Uppercase' },
                { value: 'lowercase', label: 'Lowercase' },
                { value: 'capitalize', label: 'Capitalize' }
              ]}
            />
          </div>
        </div>

        {/* Effects */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Effects</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Shadow"
              value={props.boxShadow}
              onChange={(value) => updateProp('boxShadow', value)}
              type="text"
              placeholder="0 1px 2px rgba(0,0,0,0.1)"
            />

            <PropertyInput
              label="Opacity"
              value={props.opacity || 1}
              onChange={(value) => updateProp('opacity', value)}
              type="range"
              min={0}
              max={1}
              step={0.1}
            />
          </div>
        </div>

        {/* Badge Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Badge Info</h4>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.size || 'medium'}
              </div>
              <div className="text-xs text-gray-400">Size</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.variant || 'solid'}
              </div>
              <div className="text-xs text-gray-400">Variant</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <div className="mb-1">
              📏 Text length: {props.text?.length || 0} characters
            </div>
            <div>
              🎨 Colors: {props.backgroundColor?.toUpperCase() || '#007BFF'} / {props.color?.toUpperCase() || '#FFFFFF'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;

  const typeOptions = [
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  const iconOptions = [
    { value: 'ℹ️', label: 'Info' },
    { value: '✅', label: 'Success' },
    { value: '⚠️', label: 'Warning' },
    { value: '❌', label: 'Error' },
    { value: '🔔', label: 'Bell' },
    { value: '💡', label: 'Lightbulb' },
    { value: '📢', label: 'Megaphone' },
    { value: '🔔', label: 'Notification' },
    { value: '👁️', label: 'Eye' },
    { value: '🚨', label: 'Siren' },
    { value: '', label: 'Custom Icon' }
  ];

  const alertPresets = {
    info: {
      text: 'This is an informational message.',
      type: 'info',
      icon: 'ℹ️',
      backgroundColor: '#d1ecf1',
      color: '#0c5460'
    },
    success: {
      text: 'Success! Your action was completed successfully.',
      type: 'success',
      icon: '✅',
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    warning: {
      text: 'Warning: Please be careful with this action.',
      type: 'warning',
      icon: '⚠️',
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    error: {
      text: 'Error: Something went wrong. Please try again.',
      type: 'error',
      icon: '❌',
      backgroundColor: '#f8d7da',
      color: '#721c24'
    }
  };

  const applyPreset = (presetKey: keyof typeof alertPresets) => {
    const preset = alertPresets[presetKey];
    Object.entries(preset).forEach(([key, value]) => {
      updateProp(key, value);
    });
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' };
      case 'warning':
        return { backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeaa7' };
      case 'error':
        return { backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' };
      default:
        return { backgroundColor: '#d1ecf1', color: '#0c5460', borderColor: '#bee5eb' };
    }
  };

  const getIcon = () => {
    if (props.icon) return props.icon;
    switch (props.type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Alert Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-gray-300 mb-2">Alert Preview</div>
            <div
              className="inline-block p-3 rounded border"
              style={{
                ...getTypeStyles(props.type || 'info'),
                borderStyle: 'solid',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                maxWidth: '100%'
              }}
            >
              {props.showIcon && (
                <span className="text-lg flex-shrink-0">
                  {getIcon()}
                </span>
              )}
              <div className="text-sm">
                {props.text?.substring(0, 40) || 'This is an alert message'}...
              </div>
              {props.dismissible && (
                <button className="text-lg ml-2 flex-shrink-0">×</button>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400 capitalize">
              {props.type || 'info'} alert
            </div>
          </div>
        </div>

        {/* Alert Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Alert Message</label>
            <textarea
              value={props.text || ''}
              onChange={(e) => updateProp('text', e.target.value)}
              rows={3}
              placeholder="This is an alert message..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(alertPresets).map(([key,]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof alertPresets)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Type */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Alert Type</h4>

          <PropertyInput
            label="Alert Type"
            value={props.type}
            onChange={(value) => updateProp('type', value)}
            type="select"
            options={typeOptions}
          />

          {/* Type Colors Preview */}
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1">Type Colors</label>
            <div className="grid grid-cols-4 gap-2">
              {typeOptions.map((typeOption) => (
                <button
                  key={typeOption.value}
                  onClick={() => updateProp('type', typeOption.value)}
                  className="h-8 rounded flex items-center justify-center text-xs font-medium"
                  style={getTypeStyles(typeOption.value)}
                  title={typeOption.label}
                >
                  {typeOption.label.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Icon Settings */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Icon Settings</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Show Icon"
              value={props.showIcon}
              onChange={(value) => updateProp('showIcon', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <div>
              <label className="block text-xs text-gray-400 mb-1">Icon</label>
              <select
                value={props.icon || ''}
                onChange={(e) => updateProp('icon', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
              >
                <option value="">Auto (based on type)</option>
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {props.showIcon && props.icon && (
            <div className="mt-3">
              <PropertyInput
                label="Custom Icon"
                value={props.icon}
                onChange={(value) => updateProp('icon', value)}
                type="text"
                placeholder="Enter emoji or icon code"
              />
            </div>
          )}
        </div>

        {/* Behavior */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Behavior</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Dismissible"
              value={props.dismissible}
              onChange={(value) => updateProp('dismissible', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Auto Close (seconds)"
              value={props.autoClose}
              onChange={(value) => updateProp('autoClose', Number(value))}
              type="number"
              placeholder="0 (disabled)"
            //min="0"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />

            <PropertyInput
              label="Text Color"
              value={props.color}
              onChange={(value) => updateProp('color', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border Color"
              value={props.borderColor}
              onChange={(value) => updateProp('borderColor', value)}
              type="color"
            />

            <PropertyInput
              label="Icon Color"
              value={props.iconColor}
              onChange={(value) => updateProp('iconColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Padding"
              value={props.padding}
              onChange={(value) => updateProp('padding', value)}
              type="text"
              placeholder="0.75rem 1rem"
            />

            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="4px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Border Width"
              value={props.borderWidth}
              onChange={(value) => updateProp('borderWidth', value)}
              type="text"
              placeholder="1px"
            />

            <PropertyInput
              label="Icon Size"
              value={props.iconSize}
              onChange={(value) => updateProp('iconSize', value)}
              type="text"
              placeholder="1.2em"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="1rem"
            />
          </div>
        </div>

        {/* Alert Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Alert Info</h4>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white capitalize">
                {props.type || 'info'}
              </div>
              <div className="text-xs text-gray-400">Type</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.dismissible ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-400">Dismissible</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">
                {props.showIcon ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-gray-400">Has Icon</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <div className="mb-1">
              📝 Message length: {props.text?.length || 0} characters
            </div>
            {props.icon && (
              <div>
                🎯 Icon: {getIcon()}
              </div>
            )}
            {props.autoClose && props.autoClose > 0 && (
              <div className="mt-1">
                ⏱️ Auto closes in {props.autoClose}s
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LabelBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Label Properties</h3>

        <div className="space-y-3">
          <PropertyInput
            label="Label Text"
            value={props.text}
            onChange={(value) => updateProp('text', value)}
            type="text"
          />

          <PropertyInput
            label="For"
            value={props.for}
            onChange={(value) => updateProp('for', value)}
            type="text"
          />

          <PropertyInput
            label="Font Size"
            value={props.fontSize}
            onChange={(value) => updateProp('fontSize', value)}
            type="text"
          />

          <PropertyInput
            label="Font Weight"
            value={props.fontWeight}
            onChange={(value) => updateProp('fontWeight', value)}
            type="select"
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'bold', label: 'Bold' },
              { value: '500', label: 'Medium' },
              { value: '600', label: 'Semi Bold' },
              { value: '700', label: 'Bold' }
            ]}
          />

          <PropertyInput
            label="Font Family"
            value={props.fontFamily}
            onChange={(value) => updateProp('fontFamily', value)}
            type="text"
          />

          <PropertyInput
            label="Color"
            value={props.color}
            onChange={(value) => updateProp('color', value)}
            type="color"
          />

          <PropertyInput
            label="Background Color"
            value={props.backgroundColor}
            onChange={(value) => updateProp('backgroundColor', value)}
            type="color"
          />

          <PropertyInput
            label="Padding"
            value={props.padding}
            onChange={(value) => updateProp('padding', value)}
            type="text"
          />

          <PropertyInput
            label="Margin"
            value={props.margin}
            onChange={(value) => updateProp('margin', value)}
            type="text"
          />

          <PropertyInput
            label="Border"
            value={props.border}
            onChange={(value) => updateProp('border', value)}
            type="text"
          />

          <PropertyInput
            label="Border Radius"
            value={props.borderRadius}
            onChange={(value) => updateProp('borderRadius', value)}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

const ProgressBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  const props = block.props as any;
  const value = props.value || 50;
  const max = props.max || 100;
  const percentage = Math.round((value / max) * 100);

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const colorPresets = {
    blue: { color: '#ffffff', backgroundColor: '#007bff', progressColor: '#007bff' },
    green: { color: '#ffffff', backgroundColor: '#28a745', progressColor: '#28a745' },
    orange: { color: '#212529', backgroundColor: '#fd7e14', progressColor: '#fd7e14' },
    red: { color: '#ffffff', backgroundColor: '#dc3545', progressColor: '#dc3545' },
    purple: { color: '#ffffff', backgroundColor: '#6f42c1', progressColor: '#6f42c1' },
    teal: { color: '#ffffff', backgroundColor: '#20c997', progressColor: '#20c997' }
  };

  const progressPresets = {
    loading: { value: 75, animated: true, striped: true, label: 'Loading...' },
    completion: { value: 100, animated: false, striped: false, label: 'Complete' },
    upload: { value: 42, animated: true, striped: false, label: 'Uploading...' },
    download: { value: 68, animated: true, striped: true, label: 'Downloading...' }
  };

  const applyPreset = (presetKey: keyof typeof progressPresets) => {
    const preset = progressPresets[presetKey];
    Object.entries(preset).forEach(([key, value]) => {
      updateProp(key, value);
    });
  };

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'small': return { height: '0.5rem', fontSize: '0.75rem' };
      case 'large': return { height: '1.5rem', fontSize: '1rem' };
      default: return { height: '1rem', fontSize: '0.875rem' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Progress Bar Properties</h3>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-300 mb-3">Progress Preview</div>

            {/* Label & Percentage */}
            {(props.label || props.showPercentage) && (
              <div className="flex justify-between items-center mb-2">
                {props.label && (
                  <div className="text-sm text-gray-300">{props.label || 'Progress'}</div>
                )}
                {props.showPercentage && (
                  <div className="text-sm font-medium text-white">{percentage}%</div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            <div
              className="w-full bg-gray-800 rounded overflow-hidden"
              style={{ height: getSizeStyles(props.size || 'medium').height }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: props.progressColor || '#007bff',
                  backgroundImage: props.striped
                    ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)'
                    : 'none',
                  backgroundSize: props.striped ? '1rem 1rem' : 'auto'
                }}
              />
            </div>

            <div className="mt-2 text-xs text-gray-400">
              {value}/{max} • {props.size || 'medium'} • {percentage}%
            </div>
          </div>
        </div>

        {/* Progress Settings */}
        <div className="space-y-4">
          <PropertyInput
            label="Label"
            value={props.label}
            onChange={(value) => updateProp('label', value)}
            type="text"
            placeholder="Progress"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Current Value</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={value}
                  onChange={(e) => updateProp('value', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-white w-12">{value}</span>
              </div>
            </div>

            <PropertyInput
              label="Max Value"
              value={max}
              onChange={(value) => updateProp('max', parseInt(value))}
              type="number"
              placeholder="100"
            //min="1"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(progressPresets).map(([key,]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof progressPresets)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Options */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Display Options</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Size"
              value={props.size}
              onChange={(value) => updateProp('size', value)}
              type="select"
              options={sizeOptions}
            />

            <PropertyInput
              label="Show Percentage"
              value={props.showPercentage}
              onChange={(value) => updateProp('showPercentage', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Effects */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Effects</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Animated"
              value={props.animated}
              onChange={(value) => updateProp('animated', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />

            <PropertyInput
              label="Striped"
              value={props.striped}
              onChange={(value) => updateProp('striped', value)}
              type="select"
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' }
              ]}
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Colors</h4>

          {/* Color Presets */}
          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Color Presets</label>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(colorPresets).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => {
                    updateProp('progressColor', colors.progressColor);
                    updateProp('color', colors.color);
                  }}
                  className="h-8 rounded flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: colors.progressColor,
                    color: colors.color
                  }}
                  title={name.charAt(0).toUpperCase() + name.slice(1)}
                >
                  {name.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Progress Color"
              value={props.progressColor}
              onChange={(value) => updateProp('progressColor', value)}
              type="color"
            />

            <PropertyInput
              label="Background Color"
              value={props.backgroundColor}
              onChange={(value) => updateProp('backgroundColor', value)}
              type="color"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Label Color"
              value={props.labelColor}
              onChange={(value) => updateProp('labelColor', value)}
              type="color"
            />

            <PropertyInput
              label="Percentage Color"
              value={props.percentageColor}
              onChange={(value) => updateProp('percentageColor', value)}
              type="color"
            />
          </div>
        </div>

        {/* Styling */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Styling</h4>

          <div className="grid grid-cols-2 gap-4">
            <PropertyInput
              label="Border Radius"
              value={props.borderRadius}
              onChange={(value) => updateProp('borderRadius', value)}
              type="text"
              placeholder="4px"
            />

            <PropertyInput
              label="Font Size"
              value={props.fontSize}
              onChange={(value) => updateProp('fontSize', value)}
              type="text"
              placeholder="0.875rem"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <PropertyInput
              label="Height"
              value={props.height}
              onChange={(value) => updateProp('height', value)}
              type="text"
              placeholder="1rem"
            />

            <PropertyInput
              label="Width"
              value={props.width}
              onChange={(value) => updateProp('width', value)}
              type="text"
              placeholder="100%"
            />
          </div>

          <div className="mt-3">
            <PropertyInput
              label="Font Weight"
              value={props.fontWeight}
              onChange={(value) => updateProp('fontWeight', value)}
              type="select"
              options={[
                { value: 'normal', label: 'Normal' },
                { value: '500', label: 'Medium' },
                { value: '600', label: 'Semi Bold' },
                { value: 'bold', label: 'Bold' }
              ]}
            />
          </div>
        </div>

        {/* Progress Info */}
        <div className="pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Progress Info</h4>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">{value}</div>
              <div className="text-xs text-gray-400">Current</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">{max}</div>
              <div className="text-xs text-gray-400">Max</div>
            </div>

            <div className="p-2 bg-gray-900/30 rounded">
              <div className="text-sm font-medium text-white">{percentage}%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            <div className="mb-1">
              📏 Size: {props.size || 'medium'}
            </div>
            <div className="flex items-center justify-between">
              <div>🎨 {props.progressColor?.toUpperCase() || '#007BFF'}</div>
              <div>
                {props.animated && '✨'}
                {props.striped && '🎨'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;

  // Helper to extract clean data object for JSON view
  const getData = () => ({
    invoiceNumber: props.invoiceNumber,
    invoiceDate: props.invoiceDate,
    dueDate: props.dueDate,
    status: props.status,
    companyName: props.companyName,
    companyAddress: props.companyAddress,
    clientName: props.clientName,
    clientAddress: props.clientAddress,
    items: props.items || [],
    currency: props.currency,
    taxRate: props.taxRate,
    discount: props.discount,
    notes: props.notes
  });

  const [jsonText, setJsonText] = React.useState(JSON.stringify(getData(), null, 2));

  // Sync JSON display when props change via UI
  React.useEffect(() => {
    setJsonText(JSON.stringify(getData(), null, 2));
  }, [
    props.invoiceNumber, props.invoiceDate, props.dueDate, props.status,
    props.companyName, props.companyAddress,
    props.clientName, props.clientAddress,
    props.items, props.currency, props.taxRate, props.discount, props.notes
  ]);

  const updateProp = (key: string, value: any) => {
    updateBlock(block.id, {
      props: { ...props, [key]: value }
    });
  };

  const handleJsonUpdate = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed === 'object' && parsed !== null) {
        // Merge parsed data into props
        updateBlock(block.id, {
          props: { ...props, ...parsed }
        });
      } else {
        alert('JSON must be an object containing invoice data');
      }
    } catch (err) {
      alert('Invalid JSON format');
    }
  };

  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <PropertyInput label="Number" value={props.invoiceNumber} onChange={(v) => updateProp('invoiceNumber', v)} type="text" />
          <PropertyInput label="Status" value={props.status} onChange={(v) => updateProp('status', v)} type="select"
            options={[
              { value: 'draft', label: 'Draft' }, { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <PropertyInput label="Date" value={props.invoiceDate} onChange={(v) => updateProp('invoiceDate', v)} type="text" />
          <PropertyInput label="Due Date" value={props.dueDate} onChange={(v) => updateProp('dueDate', v)} type="text" />
        </div>
      </div>

      {/* Company Info */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company Info</h3>
        <PropertyInput label="Name" value={props.companyName} onChange={(v) => updateProp('companyName', v)} type="text" />
        <PropertyInput label="Address" value={props.companyAddress} onChange={(v) => updateProp('companyAddress', v)} type="textarea" />
      </div>

      {/* Client Info */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Client Info</h3>
        <PropertyInput label="Name" value={props.clientName} onChange={(v) => updateProp('clientName', v)} type="text" />
        <PropertyInput label="Address" value={props.clientAddress} onChange={(v) => updateProp('clientAddress', v)} type="textarea" />
      </div>

      {/* Financials */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Financials</h3>
        <div className="grid grid-cols-3 gap-2">
          <PropertyInput label="Currency" value={props.currency} onChange={(v) => updateProp('currency', v)} type="text" />
          <PropertyInput label="Tax %" value={props.taxRate} onChange={(v) => updateProp('taxRate', Number(v))} type="number" />
          <PropertyInput label="Discount" value={props.discount} onChange={(v) => updateProp('discount', Number(v))} type="number" />
        </div>
      </div>

      {/* Full Data JSON */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Full Invoice Data (JSON)</h3>
        <p className="text-xs text-gray-500 mb-2">Edit items, addresses, and details in bulk.</p>
        <textarea
          className="w-full h-48 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder="{ ... }"
        />
        <button
          onClick={handleJsonUpdate}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Update All Data
        </button>
      </div>

      {/* Styles */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Styles</h3>
        <div className="grid grid-cols-2 gap-2">
          <PropertyInput label="Bg Color" value={props.backgroundColor} onChange={(v) => updateProp('backgroundColor', v)} type="color" />
          <PropertyInput label="Padding" value={props.padding} onChange={(v) => updateProp('padding', v)} type="text" />
        </div>
      </div>
    </div>
  );
};

export const BlockSpecificInspector: React.FC = () => {
  const {
    blocks,
    selectedBlockIds,
    updateBlock
  } = useCanvasStore();



  const selectedBlockId = selectedBlockIds[0];
  const selectedBlock = selectedBlockId
    ? findBlockById(blocks, selectedBlockId)
    : null;

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 h-full flex flex-col" data-testid="block-specific-inspector">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Properties</h2>
        </div>
        <div className="flex-1 p-4">
          <p className="text-gray-400 text-center">Select a block to edit its properties</p>
        </div>
      </div>
    );
  }

  const renderBlockInspector = () => {
    switch (selectedBlock.type) {
      case 'progress':
        return <ProgressBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'section':
        return <SectionBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'row':
        return <RowBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'promo-code':
        return <PromoCodeBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'code':
        return <CodeBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'map':
        return <MapBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'text':
        return <TextBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'image':
        return <ImageBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'button':
        return <ButtonBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'divider':
        return <DividerBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'spacer':
        return <SpacerBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'heading':
        return <HeadingBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'link':
        return <LinkBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'link-box':
        return <LinkBoxBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'input':
        return <InputBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'textarea':
        return <TextareaBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'select':
        return <SelectBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'checkbox':
        return <CheckboxBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'radio':
        return <RadioBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'label':
        return <LabelBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'image-box':
        return <ImageBoxBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'icon':
        return <IconBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'form':
        return <FormBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'survey':
        return <SurveyBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'social-follow':
        return <SocialFollowBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'video':
        return <VideoBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'countdown-timer':
        return <CountdownTimerBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'progress-bar':
        return <ProgressBarBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'product':
        return <ProductBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'testimonial':
        return <TestimonialBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'price':
        return <PriceBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'navbar':
        return <NavbarBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'invoice':
        return <InvoiceBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'card':
        return <CardBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'badge':
        return <BadgeBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'alert':
        return <AlertBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'column':
        return <ColumnBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      case 'container':
        return <ContainerBlockInspector block={selectedBlock} updateBlock={updateBlock} />;
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Generic Properties</h3>
            <p className="text-gray-400">Specific properties for {selectedBlock.type} blocks are not yet implemented.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 h-full flex flex-col" data-testid="block-specific-inspector">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Properties</h2>
        <p className="text-sm text-gray-400 capitalize">{selectedBlock.type} Block</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {renderBlockInspector()}
      </div>
    </div>
  );
};
