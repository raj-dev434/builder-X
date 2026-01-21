import React, { useState, memo } from 'react';
import { Block } from '../../schema/types';
import { useAssetStore } from '../../store/assetStore';
import { useCanvasStore } from '../../store/canvasStore';

import {
  Layout, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Palette,
  MousePointer2, Link as LinkIcon, Image as ImageIcon,
  ChevronDown, Move, Maximize2, Sparkles,
  Square, Layout as LayoutIcon, Layers, Link2, Link2Off,
  Video, Map as MapIcon, Minus, GripHorizontal,
  CheckSquare, List, Settings, X, MousePointer2 as Pointer,
  Plus, Calendar, Lock, Trash2, RotateCcw, Code, MoveVertical,
  AlertCircle, Star, HelpCircle
} from 'lucide-react';
import { DEFAULT_FORM_FIELDS } from '../blocks/formConstants';

// ==========================================
// SHARED UTILITIES & COMPONENTS
// ==========================================

export const inputClasses = "w-full bg-[#15181b] hover:bg-[#1a1d21] text-gray-300 text-[11px] px-2.5 py-1.5 rounded-sm border border-[#2d3237] focus:border-blue-500/50 focus:bg-[#1a1d21] focus:ring-1 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-700";

export const PropertySection = memo(({
  title,
  icon: Icon,
  children,
  defaultOpen = false
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
  defaultOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#1e2227] last:border-b-0 bg-[#262a2e]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#2d3237] transition-all group"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" />}
          <span className="text-[11px] font-bold text-gray-300 group-hover:text-white uppercase tracking-wider">{title}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 py-3 space-y-3 bg-[#202328] border-t border-[#3e444b] shadow-inner animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
});

export const ControlGroup = memo(({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="w-1/3 flex items-center justify-between">
      <span className="text-[11px] font-medium text-gray-300 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex-1">{children}</div>
  </div>
));

// ==========================================
// UNIT CONTROL COMPONENT
// ==========================================

const DEFAULT_UNITS = ['px', '%', 'rem', 'em', 'vh', 'vw', 'auto'];

export const UnitControl = memo(({
  value,
  onChange,
  placeholder = 'auto',
  min,
  max,
  step = 1,
  units = DEFAULT_UNITS
}: {
  value: string | number | undefined;
  onChange: (val: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  units?: string[];
}) => {
  // Parse value
  const parse = (val: string | number | undefined): { num: string; unit: string } => {
    if (val === undefined || val === null || val === '') return { num: '', unit: units[0] };
    const str = String(val);
    if (str === 'auto' && units.includes('auto')) return { num: '', unit: 'auto' };

    // Improved regex to handle intermediate states like "12."
    const match = str.match(/^(-?[\d.]*)(.*)$/);
    if (match) {
      let num = match[1];
      let unit = match[2];

      // If no unit found OR unit is not allowed, use default (first one)
      if (!unit || !units.includes(unit)) {
        unit = units[0];
      }

      // If the unit part accidentally starts with a digit/dot (shouldn't happen with this regex but for safety)
      if (!unit && num.endsWith('.')) {
        // Keep the dot in num
      }

      return { num, unit };
    }
    return { num: '', unit: units[0] };
  };

  const { num, unit } = parse(value);

  const handleNumChange = (newNum: string) => {
    // Basic validation to allow empty, minus sign, digits, and single dot
    if (newNum !== '' && newNum !== '-' && !/^-?[\d.]*$/.test(newNum)) return;

    if (newNum === '' && unit === 'auto') {
      onChange('auto');
      return;
    }
    if (newNum === '') {
      onChange('');
      return;
    }

    // Optional validation for min/max while typing (only if it's a valid number)
    const val = parseFloat(newNum);
    if (!isNaN(val)) {
      if (min !== undefined && val < min) return;
      if (max !== undefined && val > max) return;
    }

    // Don't append unit if it's just a minus or ends with dot (intermediate state)
    if (newNum === '-' || newNum.endsWith('.')) {
      onChange(newNum); // Parent should probably handle this or it'll just stay as is
      return;
    }
    onChange(`${newNum}${unit === 'auto' ? 'px' : unit}`);
  };

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === 'auto') {
      onChange('auto');
    } else {
      onChange(`${num || '0'}${newUnit}`);
    }
  };

  const adjust = (delta: number) => {
    const currentNum = parseFloat(num) || 0;
    // Handle floating point precision issues
    const nextVal = (currentNum + delta).toFixed(currentNum % 1 === 0 && delta % 1 === 0 ? 0 : 1);
    handleNumChange(nextVal.replace(/\.0$/, ''));
  };

  return (
    <div className="flex items-center min-w-0 bg-[#15181b] hover:bg-[#1a1d21] rounded-sm border border-[#2d3237] focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/10 overflow-hidden h-7 transition-all group">
      <input
        type="text"
        inputMode="decimal"
        className="flex-1 w-full bg-transparent text-gray-300 text-[11px] px-2 outline-none appearance-none min-w-0 placeholder:text-gray-600 font-medium"
        value={num}
        onChange={(e) => handleNumChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') { e.preventDefault(); adjust(step); }
          if (e.key === 'ArrowDown') { e.preventDefault(); adjust(-step); }
        }}
        placeholder={unit === 'auto' ? 'auto' : placeholder}
      />
      <div className="flex items-center border-l border-[#2d3237] h-full shrink-0">
        <div className="relative h-full flex items-center">
          <select
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="bg-transparent text-[9px] text-gray-500 font-bold px-1.5 outline-none appearance-none hover:text-gray-300 cursor-pointer text-center h-full z-10"
            style={{ textAlignLast: 'center' }}
          >
            {units.map(u => <option key={u} value={u} className="bg-[#262a2e]">{u}</option>)}
          </select>
          {/* Tiny indicator if needed, but select usually fine */}
        </div>
        <div className="flex flex-col border-l border-[#2d3237] h-full w-4">
          <button onClick={() => adjust(step)} className="flex-1 hover:bg-[#32373d] flex items-center justify-center h-[13px] transition-colors focus:bg-[#3b82f6] focus:text-white group/btn">
            <ChevronDown className="w-2 h-2 rotate-180 text-gray-500 group-hover/btn:text-white" />
          </button>
          <button onClick={() => adjust(-step)} className="flex-1 hover:bg-[#32373d] flex items-center justify-center h-[13px] border-t border-[#2d3237] transition-colors focus:bg-[#3b82f6] focus:text-white group/btn">
            <ChevronDown className="w-2 h-2 text-gray-500 group-hover/btn:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
});

interface GroupProps {
  block: Block;
  onChange: (key: string | any, value?: any) => void;
  withoutSection?: boolean;
}



// ==========================================
// NUMBER CONTROL COMPONENT
// ==========================================

export const NumberControl = memo(({
  value,
  onChange,
  min = 1,
  max = 12,
  label = 'Count'
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) => {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center bg-[#15181b] border border-[#2d3237] rounded-sm overflow-hidden group focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/10 transition-all w-full">
      <button
        onClick={handleDecrement}
        className="px-2 py-1.5 bg-[#202328] hover:bg-[#2d3237] text-gray-400 hover:text-white border-r border-[#2d3237] transition-colors"
        disabled={value <= min}
      >
        <Minus size={12} />
      </button>

      <input
        type="number"
        className="flex-1 bg-transparent text-center text-[11px] font-bold text-gray-200 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value) || min;
          if (val >= min && val <= max) onChange(val);
        }}
        min={min}
        max={max}
      />

      {label && <span className="text-[9px] text-gray-500 mr-2 uppercase">{label}</span>}

      <button
        onClick={handleIncrement}
        className="px-2 py-1.5 bg-[#202328] hover:bg-[#2d3237] text-gray-400 hover:text-white border-l border-[#2d3237] transition-colors"
        disabled={value >= max}
      >
        <Plus size={12} />
      </button>
    </div>
  );
});

export const TextShadowControl = ({ value, onChange }: { value: string | undefined; onChange: (val: string) => void }) => {
  // Parse text-shadow: x y blur color
  // Default: 0px 0px 0px #000000
  const parseShadow = (str: string | undefined) => {
    if (!str || str === 'none') return { x: '0px', y: '0px', blur: '0px', color: '#000000' };

    // Regex ensuring we handle color (hex/rgba) and lengths
    // Simple parser assuming standard format: 2px 2px 4px #000000
    // Try to split by space but respect color function if possible (though simple hex is most common here)
    const parts = str.split(' ');
    // Needs robust parsing if we want to support everything, but for this builder:
    // We can enforce specific order in builder: x y blur color

    if (parts.length >= 4) {
      return {
        x: parts[0],
        y: parts[1],
        blur: parts[2],
        color: parts.slice(3).join(' ')
      };
    }
    return { x: '0px', y: '0px', blur: '0px', color: '#000000' };
  };

  const { x, y, blur, color } = parseShadow(value);

  const update = (key: string, newVal: string) => {
    const current = parseShadow(value);
    const updated = { ...current, [key]: newVal };
    onChange(`${updated.x} ${updated.y} ${updated.blur} ${updated.color}`);
  };

  return (
    <div className="mb-2">
      <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Text Shadow</label>
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[9px] text-gray-500 mb-0.5 block">X</label>
            <UnitControl value={x} onChange={(val) => update('x', val)} placeholder="0px" />
          </div>
          <div>
            <label className="text-[9px] text-gray-500 mb-0.5 block">Y</label>
            <UnitControl value={y} onChange={(val) => update('y', val)} placeholder="0px" />
          </div>
          <div>
            <label className="text-[9px] text-gray-500 mb-0.5 block">Blur</label>
            <UnitControl value={blur} onChange={(val) => update('blur', val)} placeholder="0px" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => update('color', e.target.value)}
            className="w-full h-6 rounded border border-[#3e444b] bg-transparent cursor-pointer p-0"
          />
          <input
            type="text"
            className={inputClasses}
            value={color}
            onChange={(e) => update('color', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const LinkedUnitInput = ({
  label,
  values,
  onChange,
  propBase,
  propSuffix = ''
}: {
  label: string;
  values: { top: string | undefined; right: string | undefined; bottom: string | undefined; left: string | undefined };
  onChange: (key: string | any, value?: any) => void;
  propBase?: string;
  propSuffix?: string;
}) => {
  const [isLinked, setIsLinked] = useState(true);
  const base = propBase || label.toLowerCase();

  const handleValueChange = (side: keyof typeof values, value: string) => {
    const sides = ["Top", "Right", "Bottom", "Left"] as const;
    if (isLinked) {
      const updates: any = {};
      sides.forEach(s => {
        updates[`${base}${s}${propSuffix}`] = value;
      });
      onChange(updates);
    } else {
      const sideKey = side.charAt(0).toUpperCase() + side.slice(1);
      onChange(`${base}${sideKey}${propSuffix}`, value);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-medium text-gray-300 uppercase tracking-wider">{label}</span>
        <button
          onClick={() => setIsLinked(!isLinked)}
          className={`p-1 rounded transition-colors ${isLinked ? "bg-[#3b82f6] text-white" : "text-gray-400 hover:text-white"}`}
          title={isLinked ? "Unlink values" : "Link values"}
        >
          {isLinked ? <Link2 className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <UnitControl
            key={side}
            value={values[side]}
            onChange={(val) => handleValueChange(side, val)}
            placeholder={side.charAt(0).toUpperCase() + side.slice(1)}
          />
        ))}
      </div>
    </div>
  );
};




export const SpacingGroup: React.FC<GroupProps> = ({ block, onChange, withoutSection }) => {
  const { props } = block;
  const handlePropChange = (key: string | any, value?: any) => onChange(key, value);

  const content = (
    <div className="space-y-4">
      <LinkedUnitInput
        label="Padding"
        values={{
          top: props.paddingTop,
          right: props.paddingRight,
          bottom: props.paddingBottom,
          left: props.paddingLeft
        }}
        onChange={handlePropChange}
      />
      <LinkedUnitInput
        label="Margin"
        values={{
          top: props.marginTop,
          right: props.marginRight,
          bottom: props.marginBottom,
          left: props.marginLeft
        }}
        onChange={handlePropChange}
      />
    </div>
  );

  if (withoutSection) return content;

  return (
    <PropertySection title="Spacing" icon={Layers}>
      {content}
    </PropertySection>
  );
};

export const BlockSettingsGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => onChange(k, v);

  return (
    <PropertySection title="Block Settings" icon={Settings}>
      <div className="space-y-4">
        <ControlGroup label="CSS ID">
          <input
            type="text"
            value={props.customId || ''}
            onChange={(e) => updateProp('customId', e.target.value)}
            className={inputClasses}
            placeholder="e.g. my-block"
          />
        </ControlGroup>
        <ControlGroup label="CSS Classes">
          <input
            type="text"
            value={props.customClass || ''}
            onChange={(e) => updateProp('customClass', e.target.value)}
            className={inputClasses}
            placeholder="class1 class2"
          />
        </ControlGroup>

        <div className="pt-2 border-t border-[#3e444b] space-y-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Protection</span>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center justify-between px-2 py-1.5 bg-[#1a1d21] rounded border border-[#2d3237] cursor-pointer group hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-gray-500 group-hover:text-blue-400" />
                <span className="text-[11px] text-gray-300">Locked</span>
              </div>
              <input
                type="checkbox"
                checked={props.isLocked || false}
                onChange={(e) => updateProp('isLocked', e.target.checked)}
                className="rounded border-[#2d3237] bg-transparent text-blue-500 focus:ring-0 w-3.5 h-3.5"
              />
            </label>
            <label className="flex items-center justify-between px-2 py-1.5 bg-[#1a1d21] rounded border border-[#2d3237] cursor-pointer group hover:border-red-500/30 transition-colors">
              <div className="flex items-center gap-2">
                <Trash2 className="w-3 h-3 text-gray-500 group-hover:text-red-400" />
                <span className="text-[11px] text-gray-300">Prevent Deletion</span>
              </div>
              <input
                type="checkbox"
                checked={props.preventDelete || false}
                onChange={(e) => updateProp('preventDelete', e.target.checked)}
                className="rounded border-[#2d3237] bg-transparent text-blue-500 focus:ring-0 w-3.5 h-3.5"
              />
            </label>
            <label className="flex items-center justify-between px-2 py-1.5 bg-[#1a1d21] rounded border border-[#2d3237] cursor-pointer group hover:border-orange-500/30 transition-colors">
              <div className="flex items-center gap-2">
                <MousePointer2 className="w-3 h-3 text-gray-500 group-hover:text-orange-400" />
                <span className="text-[11px] text-gray-300">Prevent Dragging</span>
              </div>
              <input
                type="checkbox"
                checked={props.preventDrag || false}
                onChange={(e) => updateProp('preventDrag', e.target.checked)}
                className="rounded border-[#2d3237] bg-transparent text-blue-500 focus:ring-0 w-3.5 h-3.5"
              />
            </label>
          </div>
        </div>
      </div>
    </PropertySection>
  );
};

export const DimensionsGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Dimensions" icon={Maximize2} defaultOpen={true}>
      <div className="space-y-3">
        <ControlGroup label="Width">
          <UnitControl
            value={props.width}
            onChange={(val) => onChange('width', val)}
            placeholder="auto"
          />
        </ControlGroup>
        <ControlGroup label="Height">
          <UnitControl
            value={props.height}
            onChange={(val) => onChange('height', val)}
            placeholder="auto"
          />
        </ControlGroup>
      </div>
    </PropertySection>
  );
};

export const TypographyGroup: React.FC<GroupProps & { title?: string }> = ({ block, onChange, title = "Typography" }) => {
  const { props } = block;
  return (
    <PropertySection title={title} icon={Type}>
      <ControlGroup label="Family">
        <select
          value={props.fontFamily || 'inherit'}
          onChange={(e) => onChange('fontFamily', e.target.value)}
          className={inputClasses}
        >
          <option value="inherit">Default</option>
          <optgroup label="Sans-Serif">
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, Arial, sans-serif">Helvetica</option>
            <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica Neue</option>
            <option value="Verdana, Geneva, sans-serif">Verdana</option>
            <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
          </optgroup>
          <optgroup label="Serif">
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
            <option value="Garamond, serif">Garamond</option>
          </optgroup>
          <optgroup label="Google Fonts">
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
          </optgroup>
        </select>
      </ControlGroup>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Size</label>
          <UnitControl
            value={props.fontSize}
            onChange={(val) => onChange('fontSize', val)}
            placeholder="16px"
          />
        </div>
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Weight</label>
          <select
            className={inputClasses}
            value={props.fontWeight || ''}
            onChange={(e) => onChange('fontWeight', e.target.value)}
          >
            <option value="">Default</option>
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
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Transform</label>
          <select
            className={inputClasses}
            value={props.textTransform || ''}
            onChange={(e) => onChange('textTransform', e.target.value)}
          >
            <option value="">Default</option>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="capitalize">Capitalize</option>
            <option value="none">Normal</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Style</label>
          <select
            className={inputClasses}
            value={props.fontStyle || ''}
            onChange={(e) => onChange('fontStyle', e.target.value)}
          >
            <option value="">Default</option>
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
            <option value="oblique">Oblique</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Decoration</label>
        <select
          className={inputClasses}
          value={props.textDecoration || ''}
          onChange={(e) => onChange('textDecoration', e.target.value)}
        >
          <option value="">Default</option>
          <option value="underline">Underline</option>
          <option value="overline">Overline</option>
          <option value="line-through">Line Through</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="mb-2">
        {/* <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Alignment</label>
        <div className="flex bg-[#1a1d21] rounded border border-[#3e444b] overflow-hidden">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
            { value: 'justify', icon: AlignJustify }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onChange('textAlign', option.value)}
              className={`flex-1 p-1.5 flex justify-center hover:bg-[#2d3237] transition-colors ${props.textAlign === option.value ? 'bg-[#3b82f6] text-white' : 'text-gray-400'}`}
              title={option.value.charAt(0).toUpperCase() + option.value.slice(1)}
            >
              <option.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div> */}
      </div>

      <TextShadowControl
        value={props.textShadow}
        onChange={(val) => onChange('textShadow', val)}
      />



      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Line Ht</label>
          <UnitControl
            value={props.lineHeight}
            onChange={(val) => onChange('lineHeight', val)}
            placeholder="1.5"
            step={0.1}
          />
        </div>
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Letter</label>
          <UnitControl
            value={props.letterSpacing}
            onChange={(val) => onChange('letterSpacing', val)}
            placeholder="0px"
          />
        </div>
        <div>
          <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Word</label>
          <UnitControl
            value={props.wordSpacing}
            onChange={(val) => onChange('wordSpacing', val)}
            placeholder="0px"
          />
        </div>
      </div>

      <ControlGroup label="Text Color">
        <div className="flex gap-1">
          <input
            type="color"
            value={props.color || '#ffffff'}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-8 h-8 p-0 border border-[#3e444b] rounded cursor-pointer bg-transparent"
          />
          <input
            type="text"
            className={inputClasses}
            value={props.color || '#ffffff'}
            onChange={(e) => onChange('color', e.target.value)}
          />
        </div>
      </ControlGroup>
    </PropertySection>
  );
};

export const BackgroundControl = ({ props, onChange }: { props: any, onChange: (key: string | any, value?: any) => void }) => {
  const isGradient = props.backgroundType === 'gradient';
  const openAssetModal = useAssetStore((state) => state.openModal);

  const presets = [
    { name: 'Sunset', colors: ['#667eea', '#764ba2'] },
    { name: 'Ocean', colors: ['#89f7fe', '#66a6ff'] },
    { name: 'Fire', colors: ['#fa709a', '#fee140'] },
    { name: 'Forest', colors: ['#0ba360', '#3cba92'] },
    { name: 'Purple', colors: ['#a8edea', '#fed6e3'] },
    { name: 'Warm', colors: ['#ff9a56', '#ff6a88'] },
    { name: 'Night', colors: ['#a18cd1', '#fbc2eb'] },
    { name: 'Spring', colors: ['#fad0c4', '#ffd1ff'] },
    { name: 'Peach', colors: ['#ffecd2', '#fcb69f'] },
    { name: 'Cool', colors: ['#4facfe', '#00f2fe'] },
  ];

  return (
    <div className="space-y-3">
      {/* Use Page Background Toggle */}
      <div className="flex items-center justify-between px-2 py-2 bg-[#1a1d21] rounded border border-[#3e444b]">
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Use Page Background</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={props.usePageBackground || false}
            onChange={(e) => onChange('usePageBackground', e.target.checked)}
          />
          <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {props.usePageBackground ? (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-center">
          <p className="text-[10px] text-blue-300">Using standard page background settings.</p>
        </div>
      ) : (
        <>

          <div className="flex gap-1 bg-[#1a1d21] p-1 rounded border border-[#3e444b]">
            <button
              onClick={() => onChange('backgroundType', 'solid')}
              className={`flex-1 py-1 text-[10px] font-medium uppercase tracking-wide rounded ${!isGradient ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Classic
            </button>
            <button
              onClick={() => onChange('backgroundType', 'gradient')}
              className={`flex-1 py-1 text-[10px] font-medium uppercase tracking-wide rounded ${isGradient ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Gradient
            </button>
          </div>

          {!isGradient ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-400 uppercase">Color</label>
                  <button
                    onClick={() => onChange('backgroundColor', '#ffffff')}
                    className="p-1 hover:bg-[#2d3237] rounded transition-colors text-gray-400 hover:text-white"
                    title="Reset to White"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input type="color" value={props.backgroundColor || '#transparent'} onChange={(e) => onChange('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-[#3e444b] bg-transparent cursor-pointer p-0" />
                  <input type="text" value={props.backgroundColor || 'transparent'} onChange={(e) => onChange('backgroundColor', e.target.value)} className={inputClasses} />
                </div>
              </div>

              <div className="space-y-2 border-t border-[#3e444b]/50 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-400 uppercase flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image</label>
                  {props.backgroundImage && <button onClick={() => onChange('backgroundImage', '')} className="text-[10px] text-red-400 hover:text-red-300">Remove</button>}
                </div>

                <div className="flex gap-2">
                  <input type="text" value={props.backgroundImage ? props.backgroundImage.replace('url(', '').replace(')', '') : ''} readOnly placeholder="No image selected" className={`${inputClasses} opacity-50 cursor-not-allowed`} />
                  <button onClick={() => openAssetModal((url) => onChange('backgroundImage', `url(${url})`))} className="px-3 py-1.5 bg-[#2d3237] hover:bg-[#3e444b] text-[10px] font-bold uppercase rounded border border-[#3e444b] shrink-0 transition-colors">Choose</button>
                </div>

                {props.backgroundImage && (
                  <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase mb-1 block">Position</label>
                      <select value={props.backgroundPosition || 'center'} onChange={(e) => onChange('backgroundPosition', e.target.value)} className={inputClasses}>
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase mb-1 block">Size</label>
                      <select value={props.backgroundSize || 'cover'} onChange={(e) => onChange('backgroundSize', e.target.value)} className={inputClasses}>
                        <option value="cover">Cover</option>
                        <option value="contain">Contain</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase mb-1 block">Type</label>
                    <select
                      value={props.gradientType || 'linear'}
                      onChange={(e) => onChange('gradientType', e.target.value)}
                      className="w-full bg-[#1a1d21] border border-[#3e444b] rounded text-xs text-gray-200 h-6 px-1"
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                    </select>
                  </div>
                  {(props.gradientType === 'linear' || !props.gradientType) && (
                    <div className="col-span-2">
                      <label className="text-[10px] text-gray-400 uppercase mb-1 block">Angle</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={props.gradientAngle || 90}
                          onChange={(e) => onChange('gradientAngle', parseFloat(e.target.value))}
                          className="flex-1 h-1.5 bg-[#1a1d21] rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex items-center gap-0.5 bg-[#1a1d21] border border-[#3e444b] rounded px-1 h-6 min-w-[3.5rem]">
                          <input
                            type="number"
                            value={props.gradientAngle || 90}
                            onChange={(e) => onChange('gradientAngle', parseFloat(e.target.value))}
                            className="w-full bg-transparent border-0 p-0 text-xs text-right text-gray-200 focus:ring-0"
                          />
                          <span className="text-[10px] text-gray-500">°</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 uppercase mb-1 block">Start Color</label>
                  <div className="flex gap-1">
                    <input type="color" value={props.gradientColor1 || '#667eea'} onChange={(e) => onChange('gradientColor1', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <input type="text" value={props.gradientColor1 || '#667eea'} onChange={(e) => onChange('gradientColor1', e.target.value)} className="flex-1 bg-[#1a1d21] border border-[#3e444b] rounded text-xs text-gray-200 h-6 px-1" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase mb-1 block">End Color</label>
                  <div className="flex gap-1">
                    <input type="color" value={props.gradientColor2 || '#764ba2'} onChange={(e) => onChange('gradientColor2', e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <input type="text" value={props.gradientColor2 || '#764ba2'} onChange={(e) => onChange('gradientColor2', e.target.value)} className="flex-1 bg-[#1a1d21] border border-[#3e444b] rounded text-xs text-gray-200 h-6 px-1" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase mb-1.5 block">Presets</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => onChange({ gradientColor1: preset.colors[0], gradientColor2: preset.colors[1], backgroundType: 'gradient' })}
                      className="w-full h-6 rounded-sm border border-[#3e444b] hover:border-blue-500 transition-all shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const BackgroundGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Background" icon={Palette}>
      <ControlGroup label="Type">
        <BackgroundControl props={props} onChange={onChange} />
      </ControlGroup>
    </PropertySection>
  );
};

export const BorderGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Border" icon={Square}>
      <ControlGroup label="Style">
        <select value={props.borderStyle || 'none'} onChange={(e) => onChange('borderStyle', e.target.value)} className={inputClasses}>
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
        </select>
      </ControlGroup>

      <LinkedUnitInput
        label="Width"
        propBase="border"
        propSuffix="Width"
        values={{
          top: props.borderTopWidth || props.borderWidth,
          right: props.borderRightWidth || props.borderWidth,
          bottom: props.borderBottomWidth || props.borderWidth,
          left: props.borderLeftWidth || props.borderWidth
        }}
        onChange={onChange}
      />

      <ControlGroup label="Radius">
        <UnitControl value={props.borderRadius} onChange={(val) => onChange('borderRadius', val)} placeholder="0px" />
      </ControlGroup>
      <ControlGroup label="Color">
        <div className="flex gap-2">
          <input type="color" value={props.borderColor || '#000000'} onChange={(e) => onChange('borderColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
          <input type="text" value={props.borderColor || ''} onChange={(e) => onChange('borderColor', e.target.value)} className={inputClasses} placeholder="Default" />
        </div>
      </ControlGroup>
    </PropertySection>
  );
};

export const EffectsGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Effects" icon={Sparkles}>
      <ControlGroup label="Opacity">
        <div className="flex items-center gap-2">
          <input type="range" min="0" max="1" step="0.1" value={props.opacity ?? 1} onChange={(e) => onChange('opacity', parseFloat(e.target.value))} className="flex-1" />
          <span className="text-[10px] text-gray-500 w-6">{props.opacity ?? 1}</span>
        </div>
      </ControlGroup>
    </PropertySection>
  );
};

export const LayoutGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Layout" icon={LayoutIcon}>
      <ControlGroup label="Display">
        <select value={props.display || 'block'} onChange={(e) => onChange('display', e.target.value)} className={inputClasses}>
          <option value="block">Block</option>
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
          <option value="none">None</option>
        </select>
      </ControlGroup>
    </PropertySection>
  );
};

export const FlexItemGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Flex/Grid Item" icon={LayoutIcon}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Grow</label>
            <input
              type="number"
              className={inputClasses}
              value={props.flexGrow ?? ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange('flexGrow', isNaN(val) ? undefined : val);
              }}
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Shrink</label>
            <input
              type="number"
              className={inputClasses}
              value={props.flexShrink ?? ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange('flexShrink', isNaN(val) ? undefined : val);
              }}
              placeholder="1"
            />
          </div>
          <div>
            <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Order</label>
            <input
              type="number"
              className={inputClasses}
              value={props.order ?? ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange('order', isNaN(val) ? undefined : val);
              }}
              placeholder="0"
            />
          </div>
        </div>
        <ControlGroup label="Basis">
          <UnitControl value={props.flexBasis} onChange={(val) => onChange('flexBasis', val)} placeholder="auto" />
        </ControlGroup>
        <ControlGroup label="Align Self">
          <div className="flex bg-[#1a1d21] rounded border border-[#3e444b] overflow-hidden mb-2">
            {[
              { value: 'auto', label: 'A', title: 'Auto' },
              { value: 'flex-start', icon: AlignLeft, title: 'Start' },
              { value: 'center', icon: AlignCenter, title: 'Center' },
              { value: 'flex-end', icon: AlignRight, title: 'End' },
              { value: 'stretch', icon: AlignJustify, title: 'Stretch' },
            ].map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => onChange('alignSelf', opt.value)}
                className={`flex-1 p-1.5 flex justify-center items-center hover:bg-[#2d3237] transition-colors ${props.alignSelf === opt.value ? 'bg-[#3b82f6] text-white' : 'text-gray-400'}`}
                title={opt.title}
              >
                {opt.icon ? <opt.icon className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{opt.label}</span>}
              </button>
            ))}
          </div>
          <select className={inputClasses} value={props.alignSelf || "auto"} onChange={(e) => onChange('alignSelf', e.target.value)}>
            <option value="auto">Auto</option>
            <option value="flex-start">Start</option>
            <option value="flex-end">End</option>
            <option value="center">Center</option>
            <option value="stretch">Stretch</option>
            <option value="baseline">Baseline</option>
          </select>
        </ControlGroup>
      </div>
    </PropertySection>
  );
};

export const OutlineGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Outline" icon={Square}>
      <ControlGroup label="Style">
        <select value={props.outlineStyle || 'none'} onChange={(e) => onChange('outlineStyle', e.target.value)} className={inputClasses}>
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
        </select>
      </ControlGroup>
      <div className="grid grid-cols-2 gap-2">
        <ControlGroup label="Width">
          <UnitControl value={props.outlineWidth} onChange={(val) => onChange('outlineWidth', val)} placeholder="0px" />
        </ControlGroup>
        <ControlGroup label="Offset">
          <UnitControl value={props.outlineOffset} onChange={(val) => onChange('outlineOffset', val)} placeholder="0px" />
        </ControlGroup>
      </div>
      <ControlGroup label="Color">
        <div className="flex gap-1">
          <input type="color" className="w-6 h-6 rounded border border-gray-600 bg-transparent" value={props.outlineColor || '#000000'} onChange={(e) => onChange('outlineColor', e.target.value)} />
          <input type="text" className={inputClasses} value={props.outlineColor || ''} onChange={(e) => onChange('outlineColor', e.target.value)} />
        </div>
      </ControlGroup>
    </PropertySection>
  );
};

export const FilterGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;

  // Helper to extract numeric value from filter string
  const getFilterValue = (name: string, defaultValue: number) => {
    const str = props.filter || '';
    const match = new RegExp(`${name}\\(([0-9.]+)`).exec(str);
    return match ? parseFloat(match[1]) : defaultValue;
  };

  const updateFilter = (name: string, val: number, unit: string = '') => {
    let str = props.filter || '';
    const regex = new RegExp(`${name}\\([^)]+\\)`);
    const newValue = `${name}(${val}${unit})`;

    if (regex.test(str)) {
      str = str.replace(regex, newValue);
    } else {
      str = `${str} ${newValue}`.trim();
    }
    onChange('filter', str);
  };

  return (
    <PropertySection title="Filters" icon={Sparkles}>
      <ControlGroup label="Blur (px)">
        <input
          type="range" min="0" max="20" step="0.5"
          value={getFilterValue('blur', 0)}
          onChange={(e) => updateFilter('blur', parseFloat(e.target.value), 'px')}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </ControlGroup>
      <ControlGroup label="Brightness (%)">
        <input
          type="range" min="0" max="200" step="10"
          value={getFilterValue('brightness', 1) * 100}
          onChange={(e) => updateFilter('brightness', parseFloat(e.target.value) / 100)}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </ControlGroup>
      <ControlGroup label="Contrast (%)">
        <input
          type="range" min="0" max="200" step="10"
          value={getFilterValue('contrast', 1) * 100}
          onChange={(e) => updateFilter('contrast', parseFloat(e.target.value) / 100)}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </ControlGroup>

      <ControlGroup label="Manual Filter">
        <input
          type="text"
          className={inputClasses}
          value={props.filter || ''}
          onChange={(e) => onChange('filter', e.target.value)}
          placeholder="blur(5px) brightness(0.5)"
        />
      </ControlGroup>
      <ControlGroup label="Backdrop">
        <input
          type="text"
          className={inputClasses}
          value={props.backdropFilter || ''}
          onChange={(e) => onChange('backdropFilter', e.target.value)}
          placeholder="blur(10px)"
        />
      </ControlGroup>
      <ControlGroup label="Blend Mode">
        <select className={inputClasses} value={props.mixBlendMode || 'normal'} onChange={(e) => onChange('mixBlendMode', e.target.value)}>
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
          <option value="darken">Darken</option>
          <option value="lighten">Lighten</option>
          <option value="color-dodge">Color Dodge</option>
          <option value="difference">Difference</option>
          <option value="exclusion">Exclusion</option>
          <option value="hue">Hue</option>
          <option value="saturation">Saturation</option>
          <option value="color">Color</option>
          <option value="luminosity">Luminosity</option>
        </select>
      </ControlGroup>
    </PropertySection>
  );
};

export const InteractionGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  return (
    <PropertySection title="Interaction" icon={MousePointer2}>
      <ControlGroup label="Cursor">
        <select className={inputClasses} value={props.cursor || 'auto'} onChange={(e) => onChange('cursor', e.target.value)}>
          <option value="auto">Auto</option>
          <option value="default">Default</option>
          <option value="pointer">Pointer</option>
          <option value="text">Text</option>
          <option value="move">Move</option>
          <option value="not-allowed">Not Allowed</option>
          <option value="crosshair">Crosshair</option>
          <option value="grab">Grab</option>
        </select>
      </ControlGroup>
      <ControlGroup label="Ptr Events">
        <select className={inputClasses} value={props.pointerEvents || 'auto'} onChange={(e) => onChange('pointerEvents', e.target.value)}>
          <option value="auto">Auto</option>
          <option value="none">None</option>
          <option value="all">All</option>
        </select>
      </ControlGroup>
      <ControlGroup label="Select">
        <select className={inputClasses} value={props.userSelect || 'auto'} onChange={(e) => onChange('userSelect', e.target.value)}>
          <option value="auto">Auto</option>
          <option value="none">None</option>
          <option value="text">Text</option>
          <option value="all">All</option>
        </select>
      </ControlGroup>
    </PropertySection>
  );
};

export const TransformGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;

  const getTransformValue = (name: string, defaultValue: number) => {
    const str = props.transform || '';
    // Look for name(value) or name(valueUnit)
    const regex = new RegExp(`${name}\\((-?[0-9.]+)([^)]*)\\)`);
    const match = regex.exec(str);
    return match ? parseFloat(match[1]) : defaultValue;
  };

  const updateTransform = (name: string, val: number, unit: string = '') => {
    let str = props.transform || '';
    const regex = new RegExp(`${name}\\([^)]+\\)`);
    const newValue = `${name}(${val}${unit})`;

    if (regex.test(str)) {
      str = str.replace(regex, newValue);
    } else {
      str = `${str} ${newValue}`.trim();
    }
    onChange('transform', str);
  };

  const renderSlider = (label: string, name: string, min: number, max: number, step: number, defaultValue: number, unit: string = '') => {
    const value = getTransformValue(name, defaultValue);
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-medium uppercase">{label}</span>
          <span className="text-[10px] text-blue-400 font-bold">{value}{unit}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => updateTransform(name, parseFloat(e.target.value), unit)}
            className="flex-1 h-1 bg-[#1a1d21] rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <button
            onClick={() => updateTransform(name, defaultValue, unit)}
            className="text-gray-600 hover:text-gray-400 p-0.5 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <PropertySection title="Transform" icon={Move}>
      <div className="space-y-4 pt-1">
        {/* Basic Transforms */}
        <div className="grid grid-cols-1 gap-4">
          {renderSlider("Scale", "scale", 0, 3, 0.01, 1)}
          {renderSlider("Rotate", "rotate", -180, 180, 1, 0, "deg")}
        </div>

        {/* Translation */}
        <div className="pt-3 border-t border-[#3e444b] space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Translate</span>
            <div className="h-[1px] flex-1 bg-[#3e444b]"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderSlider("Translate X", "translateX", -200, 200, 1, 0, "px")}
            {renderSlider("Translate Y", "translateY", -200, 200, 1, 0, "px")}
          </div>
        </div>

        {/* Skew */}
        <div className="pt-3 border-t border-[#3e444b] space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Skew</span>
            <div className="h-[1px] flex-1 bg-[#3e444b]"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {renderSlider("Skew X", "skewX", -45, 45, 1, 0, "deg")}
            {renderSlider("Skew Y", "skewY", -45, 45, 1, 0, "deg")}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t border-blue-500/20 space-y-3">
          <ControlGroup label="Origin">
            <input
              type="text"
              className={inputClasses}
              value={props.transformOrigin || ''}
              onChange={(e) => onChange('transformOrigin', e.target.value)}
              placeholder="center center"
            />
          </ControlGroup>
          <ControlGroup label="Manual">
            <input
              type="text"
              className={inputClasses}
              value={props.transform || ''}
              onChange={(e) => onChange('transform', e.target.value)}
              placeholder="rotate(45deg) scale(1.1)"
            />
          </ControlGroup>
        </div>
      </div>
    </PropertySection>
  );
};

export const TransitionGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;

  const applyPreset = (preset: { duration: string, timing: string }) => {
    onChange({
      transitionDuration: preset.duration,
      transitionTimingFunction: preset.timing
    });
  };

  return (
    <PropertySection title="Transition & Hover" icon={Sparkles}>
      <div className="mb-3 flex gap-2">
        {['Short', 'Medium', 'Long'].map(label => (
          <button
            key={label}
            onClick={() => {
              if (label === 'Short') applyPreset({ duration: '0.2s', timing: 'ease-out' });
              if (label === 'Medium') applyPreset({ duration: '0.5s', timing: 'ease' });
              if (label === 'Long') applyPreset({ duration: '1.0s', timing: 'ease-in-out' });
            }}
            className="flex-1 py-1 text-[10px] bg-[#1a1d21] border border-[#3e444b] rounded hover:border-blue-500 transition-colors text-gray-400 hover:text-white"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ControlGroup label="Duration">
          <UnitControl value={props.transitionDuration} onChange={(val) => onChange('transitionDuration', val)} placeholder="0.3s" step={0.1} units={['s', 'ms']} />
        </ControlGroup>
        <ControlGroup label="Delay">
          <UnitControl value={props.transitionDelay} onChange={(val) => onChange('transitionDelay', val)} placeholder="0s" step={0.1} units={['s', 'ms']} />
        </ControlGroup>
      </div>
      <ControlGroup label="Timing">
        <select className={inputClasses} value={props.transitionTimingFunction || 'ease'} onChange={(e) => onChange('transitionTimingFunction', e.target.value)}>
          <option value="ease">Ease</option>
          <option value="linear">Linear</option>
          <option value="ease-in">Ease In</option>
          <option value="ease-out">Ease Out</option>
          <option value="ease-in-out">Ease In Out</option>
        </select>
      </ControlGroup>

      {/* Hover State Controls */}
      <div className="mt-4 pt-4 border-t border-[#3e444b]">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Hover Effects</span>
          <div className="h-[1px] flex-1 bg-[#3e444b]"></div>
        </div>

        <ControlGroup label="Hover Scale">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.01"
              value={props.hover_scale || 1}
              onChange={(e) => onChange('hover_scale', parseFloat(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 w-8 text-right">{props.hover_scale || 1}x</span>
          </div>
        </ControlGroup>

        <ControlGroup label="Hover Lift (Y)">
          <UnitControl value={props.hover_translateY} onChange={(val) => onChange('hover_translateY', val)} placeholder="0px" />
        </ControlGroup>

        <ControlGroup label="Hover Opacity">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={props.hover_opacity !== undefined ? props.hover_opacity : 1}
              onChange={(e) => onChange('hover_opacity', parseFloat(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 w-8 text-right">{props.hover_opacity !== undefined ? props.hover_opacity : 1}</span>
          </div>
        </ControlGroup>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <ControlGroup label="Hover Bg">
            <div className="flex gap-1">
              <input type="color" className="w-6 h-6 rounded border border-gray-600 bg-transparent" value={props.hover_backgroundColor || '#000000'} onChange={(e) => onChange('hover_backgroundColor', e.target.value)} />
              <input type="text" className="flex-1 bg-transparent border-none text-[10px] text-gray-400 focus:ring-0 p-0" value={props.hover_backgroundColor || ''} onChange={(e) => onChange('hover_backgroundColor', e.target.value)} placeholder="None" />
            </div>
          </ControlGroup>
          <ControlGroup label="Hover Text">
            <div className="flex gap-1">
              <input type="color" className="w-6 h-6 rounded border border-gray-600 bg-transparent" value={props.hover_color || '#000000'} onChange={(e) => onChange('hover_color', e.target.value)} />
              <input type="text" className="flex-1 bg-transparent border-none text-[10px] text-gray-400 focus:ring-0 p-0" value={props.hover_color || ''} onChange={(e) => onChange('hover_color', e.target.value)} placeholder="None" />
            </div>
          </ControlGroup>
        </div>
      </div>
    </PropertySection>
  );
};

// ==========================================
// STYLE PROPERTIES COMPONENT
// ==========================================

export const StyleProperties: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void }> = ({ block, updateBlock }) => {
  const props = block.props as any;
  const updateProp = (key: string, value: any) => updateBlock(block.id, { props: { ...props, [key]: value } });
  const handleChange = (keyOrUpdates: string | any, value?: any) => {
    if (typeof keyOrUpdates === 'object' && keyOrUpdates !== null) {
      updateBlock(block.id, { props: { ...props, ...keyOrUpdates } });
    } else {
      updateProp(keyOrUpdates, value);
    }
  };

  return (
    <div className="space-y-0">


      <PropertySection title="Positioning" icon={Move}>
        <ControlGroup label="Position">
          <select value={props.position || 'static'} onChange={(e) => updateProp('position', e.target.value)} className={inputClasses}>
            <option value="static">Static</option>
            <option value="relative">Relative</option>
            <option value="absolute">Absolute</option>
            <option value="fixed">Fixed</option>
            <option value="sticky">Sticky</option>
          </select>
        </ControlGroup>
        <ControlGroup label="Z-Index"><input type="number" className={inputClasses} placeholder="auto" value={props.zIndex || ''} onChange={(e) => updateProp('zIndex', e.target.value)} /></ControlGroup>
        {(props.position === 'relative' || props.position === 'absolute' || props.position === 'fixed' || props.position === 'sticky') && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ControlGroup label="Top"><UnitControl value={props.top} onChange={(val) => updateProp('top', val)} /></ControlGroup>
            <ControlGroup label="Right"><UnitControl value={props.right} onChange={(val) => updateProp('right', val)} /></ControlGroup>
            <ControlGroup label="Bottom"><UnitControl value={props.bottom} onChange={(val) => updateProp('bottom', val)} /></ControlGroup>
            <ControlGroup label="Left"><UnitControl value={props.left} onChange={(val) => updateProp('left', val)} /></ControlGroup>
          </div>
        )}
      </PropertySection>

      <FlexItemGroup block={block} onChange={handleChange} />



      <OutlineGroup block={block} onChange={handleChange} />
      <FilterGroup block={block} onChange={handleChange} />
      <InteractionGroup block={block} onChange={handleChange} />
      <TransformGroup block={block} onChange={handleChange} />
      <TransitionGroup block={block} onChange={handleChange} />
    </div>
  );
};

// ==========================================
// ADVANCED PANEL COMPONENT
// ==========================================



export const AdvancedPanel: React.FC<{ block: Block; onUpdate: (updates: Partial<Block>) => void }> = ({ block, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const userProps = (block.props || {}) as any;

  const handleStyleChange = (keyOrUpdates: string | any, value?: any) => {
    const updates = typeof keyOrUpdates === 'string' ? { [keyOrUpdates]: value } : keyOrUpdates;
    onUpdate({ props: { ...((block.props || {}) as any), ...updates } } as any);
  };

  return (
    <div className="flex flex-col h-full bg-[#262a2e] text-gray-200 overflow-y-auto custom-scrollbar">
      <div className="border-b border-[#3e444b]">
        <button onClick={() => setShowBackground(!showBackground)} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#2d3237]">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBackground ? "" : "-rotate-90"}`} />
          <Palette className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold">Background</span>
        </button>
        {showBackground && (<div className="px-4 py-4 space-y-4 bg-[#262a2e]"><BackgroundControl props={userProps} onChange={handleStyleChange} /></div>)}
      </div>

      <div className="border-b border-[#3e444b]">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#2d3237]">
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
          <span className="text-sm font-bold">Layout</span>
        </button>
        {isOpen && (
          <div className="px-4 py-4 space-y-0 pb-6">
            <SpacingGroup block={block} onChange={handleStyleChange} withoutSection={true} />
            <div className="pt-4 space-y-4">
              <ControlGroup label="Block ID">
                <input
                  className={inputClasses}
                  value={userProps.htmlId || ''}
                  onChange={(e) => handleStyleChange("htmlId", e.target.value)}
                  placeholder="e.g. contact-section"
                />
              </ControlGroup>
              <div className="flex items-center gap-4 border-t border-[#3e444b] pt-4">
                <div className="w-1/3"><span className="text-[11px] font-medium text-gray-300 uppercase">Width</span></div>
                <div className="flex-1">
                  <select className={inputClasses} value={userProps.widthType || "default"} onChange={(e) => handleStyleChange("widthType", e.target.value)}>
                    <option value="default">Default</option>
                    <option value="full">Full Width</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              {userProps.widthType === 'custom' && (
                <ControlGroup label="Width">
                  <UnitControl value={userProps.width} onChange={(val) => handleStyleChange("width", val)} placeholder="auto" />
                </ControlGroup>
              )}
              <ControlGroup label="Height">
                <UnitControl value={userProps.height} onChange={(val) => handleStyleChange("height", val)} placeholder="auto" />
              </ControlGroup>
              <ControlGroup label="Box Sizing">
                <select className={inputClasses} value={userProps.boxSizing || 'border-box'} onChange={(e) => handleStyleChange("boxSizing", e.target.value)}>
                  <option value="content-box">Content Box</option>
                  <option value="border-box">Border Box</option>
                </select>
              </ControlGroup>
            </div>
          </div>
        )}
      </div>
      <StyleProperties block={block} updateBlock={(_, updates) => onUpdate(updates)} />
    </div>
  );
};

// ==========================================
// FLEX LAYOUT GROUP
// ==========================================

export const FlexLayoutGroup: React.FC<GroupProps> = ({ block, onChange }) => {
  const { props } = block;
  const updateProp = (k: string, v: any) => onChange(k, v);

  return (
    <PropertySection title="Flex Layout" icon={LayoutIcon}>
      <ControlGroup label="Direction">
        <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
          {['row', 'column', 'row-reverse', 'col-rev'].map((dir) => (
            <button
              key={dir}
              onClick={() => updateProp('flexDirection', dir === 'col-rev' ? 'column-reverse' : dir)}
              className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.flexDirection || 'row') === (dir === 'col-rev' ? 'column-reverse' : dir) ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              title={dir}
            >
              {dir === 'col-rev' ? 'Col-R' : dir === 'row-reverse' ? 'Row-R' : dir}
            </button>
          ))}
        </div>
      </ControlGroup>

      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] uppercase font-bold text-gray-400">Wrap Items</span>
        <select
          className={`${inputClasses} w-auto`}
          value={props.flexWrap || 'nowrap'}
          onChange={(e) => updateProp('flexWrap', e.target.value)}
        >
          <option value="nowrap">No Wrap</option>
          <option value="wrap">Wrap</option>
          <option value="wrap-reverse">Wrap Reverse</option>
        </select>
      </div>

      <ControlGroup label="Justify Content">
        <select className={inputClasses} value={props.justifyContent || 'flex-start'} onChange={(e) => updateProp('justifyContent', e.target.value)}>
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
          <option value="space-evenly">Space Evenly</option>
        </select>
      </ControlGroup>

      <ControlGroup label="Align Items">
        <select className={inputClasses} value={props.alignItems || 'stretch'} onChange={(e) => updateProp('alignItems', e.target.value)}>
          <option value="stretch">Stretch</option>
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="baseline">Baseline</option>
        </select>
      </ControlGroup>

      <ControlGroup label="Gap">
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={parseInt(props.gap || '0')}
            onChange={(e) => updateProp('gap', `${e.target.value}px`)}
            className="flex-1"
          />
          <UnitControl value={props.gap} onChange={(v) => updateProp('gap', v)} />
        </div>
      </ControlGroup>
    </PropertySection>
  );
};


export const StyleEditor: React.FC<{ block: Block; onUpdate: (updates: Partial<Block>) => void }> = ({ block, onUpdate }) => {
  const styleProps = block.props as any;
  const handleStyleChange = (keyOrUpdates: string | any, value?: any) => {
    if (typeof keyOrUpdates === 'object' && keyOrUpdates !== null) {
      onUpdate({ props: { ...block.props, ...keyOrUpdates } } as any);
    } else {
      onUpdate({ props: { ...block.props, [keyOrUpdates]: value } } as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#262a2e] text-gray-200">
      <TypographyGroup block={block} onChange={handleStyleChange} />
      <PropertySection title="Colors" icon={Palette}>
        <ControlGroup label="Background">
          <BackgroundControl props={styleProps} onChange={handleStyleChange} />
        </ControlGroup>
      </PropertySection>
      <BorderGroup block={block} onChange={handleStyleChange} />
    </div>
  );
};

// ==========================================
// INDIVIDUAL BLOCK INSPECTORS
// ==========================================

// --- ELEMENTOR HEADING ---
export const ElementorHeadingInspector: React.FC<{
  block: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  activeTab: 'content' | 'style' | 'advanced';
}> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;

  const updateProp = (keyOrUpdates: string | any, value?: any) => {
    const updates = typeof keyOrUpdates === 'string' ? { [keyOrUpdates]: value } : keyOrUpdates;
    updateBlock(block.id, {
      props: { ...props, ...updates }
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Title" icon={Type} defaultOpen={true}>
            <ControlGroup label="Title">
              <textarea
                value={props.text || props.title || ''}
                onChange={(e) => updateProp({ text: e.target.value, title: e.target.value })}
                className={`${inputClasses} min-h-[80px] resize-y`}
                rows={3}
                placeholder="Enter heading text..."
              />
            </ControlGroup>

            <ControlGroup label="Link">
              <div className="space-y-3 w-full">
                <input
                  type="text"
                  value={props.link || ''}
                  onChange={(e) => updateProp('link', e.target.value)}
                  className={inputClasses}
                  placeholder="Paste URL or type"
                />
                <div className="flex flex-col gap-2 pt-1 border-t border-[#3e444b] mt-2">
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={props.linkTarget === '_blank'}
                      onChange={(e) => updateProp('linkTarget', e.target.checked ? '_blank' : '')}
                      className="rounded border-[#3e444b] bg-transparent text-blue-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-gray-300 text-[11px]">Open in new window</span>
                  </label>
                </div>
              </div>
            </ControlGroup>

            <ControlGroup label="Size">
              <select
                value={props.size || 'default'}
                onChange={(e) => updateProp('size', e.target.value)}
                className={inputClasses}
              >
                <option value="default">Default</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">XL</option>
                <option value="xxl">XXL</option>
              </select>
            </ControlGroup>

            <ControlGroup label="HTML Tag">
              <select
                value={(() => {
                  if (props.level) return String(props.level);
                  if (props.htmlTag && props.htmlTag.startsWith('h')) {
                    return props.htmlTag.replace('h', '');
                  }
                  return "2";
                })()}
                onChange={(e) => {
                  const val = e.target.value;
                  updateProp({ level: parseInt(val, 10), htmlTag: `h${val}` });
                }}
                className={inputClasses}
              >
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option value="5">H5</option>
                <option value="6">H6</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded border border-[#3e444b] overflow-hidden w-max">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                  { value: 'justify', icon: AlignJustify }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProp('textAlign', option.value)}
                    className={`p-1.5 flex justify-center hover:bg-[#2d3237] transition-colors ${props.textAlign === option.value ? 'bg-[#3b82f6] text-white' : 'text-gray-400'}`}
                    title={option.value}
                  >
                    <option.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Text Color" icon={Palette}>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={props.color || props.textColor || '#333333'}
                  onChange={(e) => updateProp({ color: e.target.value, textColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={props.color || props.textColor || '#333333'}
                  onChange={(e) => updateProp({ color: e.target.value, textColor: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </ControlGroup>
          </PropertySection>

          <TypographyGroup block={block} onChange={updateProp} />

          <PropertySection title="Text Stroke" icon={Type}>
            <ControlGroup label="Stroke Width">
              <UnitControl value={props.WebkitTextStrokeWidth} onChange={(v) => updateProp('WebkitTextStrokeWidth', v)} placeholder="0px" />
            </ControlGroup>
            <ControlGroup label="Stroke Color">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={props.WebkitTextStrokeColor || '#000000'}
                  onChange={(e) => updateProp('WebkitTextStrokeColor', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={props.WebkitTextStrokeColor || ''}
                  onChange={(e) => updateProp('WebkitTextStrokeColor', e.target.value)}
                  className={inputClasses}
                  placeholder="#000"
                />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Text Shadow" icon={Type}>
            <ControlGroup label="Text Shadow">
              <input
                type="text"
                value={props.textShadow || ''}
                onChange={(e) => updateProp('textShadow', e.target.value)}
                className={inputClasses}
                placeholder="2px 2px 4px rgba(0,0,0,0.5)"
              />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Blend Mode" icon={Layers}>
            <ControlGroup label="Blend Mode">
              <select
                value={props.mixBlendMode || 'normal'}
                onChange={(e) => updateProp('mixBlendMode', e.target.value)}
                className={inputClasses}
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
              </select>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && (
        <AdvancedPanel block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />
      )}
    </div>
  );
};

// --- SECTION BLOCK ---
export const SectionBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Layout" icon={Layout} defaultOpen={true}>
            <ControlGroup label="Height">
              <select value={props.height === 'auto' ? 'auto' : props.height === '100vh' ? '100vh' : 'custom'} onChange={(e) => { if (e.target.value !== 'custom') updateProp('height', e.target.value); }} className={inputClasses}>
                <option value="auto">Auto</option><option value="100vh">Full Screen</option><option value="custom">Custom</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Content Width">
              <select value={props.contentWidth || 'container'} onChange={(e) => updateProp('contentWidth', e.target.value)} className={inputClasses}>
                <option value="container">Boxed</option><option value="full">Full Width</option>
              </select>
            </ControlGroup>
            <ControlGroup label="HTML Tag">
              <select
                value={props.htmlTag || 'section'}
                onChange={(e) => updateProp('htmlTag', e.target.value)}
                className={inputClasses}
              >
                <option value="section">section</option><option value="header">header</option><option value="footer">footer</option>
                <option value="main">main</option><option value="article">article</option><option value="aside">aside</option>
                <option value="div">div</option>
              </select>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Link" icon={LinkIcon}>
            <ControlGroup label="URL">
              <input
                type="text"
                className={inputClasses}
                value={props.link || ''}
                onChange={(e) => updateProp('link', e.target.value)}
                placeholder="https://..."
              />
            </ControlGroup>
          </PropertySection>

          <BlockSettingsGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'style' && (<><SpacingGroup block={block} onChange={updateProp} /><BackgroundGroup block={block} onChange={updateProp} /></>)}
      {activeTab === 'advanced' && (<AdvancedPanel block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />)}
    </div>
  );
};

// --- GENERIC PLACEHOLDER INSPECTORS FOR OTHERS ---
const GenericInspector: React.FC<{
  block: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  activeTab: 'content' | 'style' | 'advanced';
}> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <PropertySection title="Common Content" icon={Settings} defaultOpen={true}>
          <ControlGroup label="Title">
            <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} placeholder="Title" />
          </ControlGroup>
          <ControlGroup label="Text / Label">
            <textarea className={inputClasses} value={props.text || props.label || props.content || ''} onChange={(e) => updateProp(props.text !== undefined ? 'text' : props.label !== undefined ? 'label' : 'content', e.target.value)} rows={2} placeholder="Content text..." />
          </ControlGroup>
          <ControlGroup label="Description">
            <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={3} placeholder="Description..." />
          </ControlGroup>
          <ControlGroup label="Button Text">
            <input type="text" className={inputClasses} value={props.buttonText || ''} onChange={(e) => updateProp('buttonText', e.target.value)} placeholder="Click here" />
          </ControlGroup>
          <ControlGroup label="Link URL">
            <input type="text" className={inputClasses} value={(props.href || props.url || props.link) === '#' ? '' : (props.href || props.url || props.link || '')} onChange={(e) => updateProp(props.href !== undefined ? 'href' : props.url !== undefined ? 'url' : 'link', e.target.value)} placeholder="https://..." />
          </ControlGroup>
          <div className="pt-2 border-t border-[#3e444b] mt-2">
            <label className="text-[10px] text-gray-400 uppercase mb-2 block">Image Source</label>
            <div className="flex gap-2">
              <input type="text" value={props.src || props.image || ''} onChange={(e) => updateProp(props.src !== undefined ? 'src' : 'image', e.target.value)} className={inputClasses} placeholder="Image URL" />
            </div>
          </div>
        </PropertySection>
      )}

      {activeTab === 'content' && <BlockSettingsGroup block={block} onChange={updateProp} />}
      {activeTab === 'style' && (
        <div className="flex flex-col space-y-0">
          <PropertySection title="Quick Style" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Opacity">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={props.opacity ?? 1}
                onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1a1d21] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </ControlGroup>
          </PropertySection>
          <BackgroundGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
          <EffectsGroup block={block} onChange={updateProp} />
        </div>
      )}
      {activeTab === 'advanced' && (
        <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />
      )}
    </div>
  );
};

// --- FLEX BOX BLOCK ---
export const FlexBoxBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <FlexLayoutGroup block={block} onChange={updateProp} />
          <PropertySection title="Size" icon={Maximize2}>
            <ControlGroup label="Width">
              <UnitControl value={props.width} onChange={(v) => updateProp('width', v)} placeholder="100%" />
            </ControlGroup>
            <ControlGroup label="Min Height">
              <UnitControl value={props.minHeight} onChange={(v) => updateProp('minHeight', v)} placeholder="auto" />
            </ControlGroup>
            <ControlGroup label="Height">
              <UnitControl value={props.height} onChange={(v) => updateProp('height', v)} placeholder="auto" />
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <BackgroundGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
          <EffectsGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && (
        <AdvancedPanel block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />
      )}
    </div>
  );
};

export const ImageBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };
  const openAssetModal = useAssetStore((state) => state.openModal);

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Image" icon={ImageIcon} defaultOpen={true}>
            <div className="px-1 mb-4">
              <div
                onClick={() => openAssetModal((url) => updateProp('src', url))}
                className="group relative aspect-video bg-[#1a1d21] rounded border-2 border-dashed border-[#3e444b] hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2"
              >
                {props.src ? (
                  <>
                    <img src={props.src} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-gray-600 group-hover:text-blue-500/70" />
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Choose Image</span>
                  </>
                )}
              </div>
            </div>

            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b] w-max">
                {['flex-start', 'center', 'flex-end'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('alignSelf', align)}
                    className={`p-1.5 rounded-sm transition-colors ${props.alignSelf === align ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'}`}
                    title={align === 'flex-start' ? 'Left' : align === 'center' ? 'Center' : 'Right'}
                  >
                    {align === 'flex-start' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'flex-end' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </ControlGroup>

            <ControlGroup label="Alt Text">
              <input type="text" className={inputClasses} value={props.alt || ''} onChange={(e) => updateProp('alt', e.target.value)} placeholder="Description for accessibility" />
            </ControlGroup>
            <ControlGroup label="Title">
              <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} placeholder="ToolTip text" />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Link" icon={LinkIcon}>
            {/* Added Helper Text and Test Link Button */}
            <div className="px-1 mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <p className="text-[10px] text-blue-200 mb-2">
                Links are active in <span className="font-bold text-white">Preview Mode</span> only.
              </p>
              {props.linkUrl && props.linkUrl !== '#' && (
                <button
                  onClick={() => window.open(props.linkUrl, '_blank')}
                  className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
                >
                  Verify Link ↗
                </button>
              )}
            </div>

            <ControlGroup label="URL">
              <input type="text" className={inputClasses} value={props.linkUrl === '#' ? '' : (props.linkUrl || '')} onChange={(e) => updateProp('linkUrl', e.target.value)} placeholder="https://..." />
            </ControlGroup>
            <ControlGroup label="Target">
              <select className={inputClasses} value={props.target || '_self'} onChange={(e) => updateProp('target', e.target.value)}>
                <option value="_self">Same Window</option>
                <option value="_blank">New Window</option>
              </select>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Size" icon={Maximize2} defaultOpen={true}>
            <ControlGroup label="Width">
              <UnitControl value={props.width} onChange={(v) => updateProp('width', v)} placeholder="100%" />
            </ControlGroup>
            <ControlGroup label="Max Width">
              <UnitControl value={props.maxWidth} onChange={(v) => updateProp('maxWidth', v)} placeholder="100%" />
            </ControlGroup>
            <ControlGroup label="Height">
              <UnitControl value={props.height} onChange={(v) => updateProp('height', v)} placeholder="auto" />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Style" icon={Palette}>
            <ControlGroup label="Border Radius">
              <UnitControl value={props.borderRadius} onChange={(v) => updateProp('borderRadius', v)} placeholder="0px" />
            </ControlGroup>
            <ControlGroup label="Opacity">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={props.opacity ?? 1}
                onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1a1d21] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </ControlGroup>
          </PropertySection>

          <BorderGroup block={block} onChange={updateProp} />

          <PropertySection title="Shadow" icon={Sparkles}>
            <ControlGroup label="Box Shadow">
              <input type="text" className={inputClasses} value={props.boxShadow || ''} onChange={(e) => updateProp('boxShadow', e.target.value)} placeholder="0px 4px 6px rgba(0,0,0,0.1)" />
            </ControlGroup>
          </PropertySection>

          <SpacingGroup block={block} onChange={updateProp} />
        </>
      )}

      {activeTab === 'advanced' && (
        <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />
      )}
    </div>
  );
};

export const ButtonBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };
  const openAssetModal = useAssetStore((state) => state.openModal);

  const emojiIcons = [
    { name: 'star', label: 'Star ⭐' },
    { name: 'heart', label: 'Heart ❤️' },
    { name: 'like', label: 'Like 👍' },
    { name: 'home', label: 'Home 🏠' },
    { name: 'user', label: 'User 👤' },
    { name: 'settings', label: 'Settings ⚙️' },
    { name: 'search', label: 'Search 🔍' },
    { name: 'phone', label: 'Phone 📞' },
    { name: 'email', label: 'Email 📧' },
    { name: 'location', label: 'Location 📍' },
    { name: 'calendar', label: 'Calendar 📅' },
    { name: 'clock', label: 'Clock 🕐' },
    { name: 'info', label: 'Info ℹ️' },
    { name: 'warning', label: 'Warning ⚠️' },
    { name: 'error', label: 'Error ❌' },
    { name: 'success', label: 'Success ✅' },
    { name: 'facebook', label: 'Facebook 📘' },
    { name: 'twitter', label: 'Twitter 🐦' },
    { name: 'instagram', label: 'Instagram 📷' },
    { name: 'linkedin', label: 'LinkedIn 💼' },
    { name: 'youtube', label: 'YouTube 📺' },
    { name: 'github', label: 'GitHub 🐙' },
    { name: 'download', label: 'Download 📥' },
    { name: 'upload', label: 'Upload 📤' },
    { name: 'share', label: 'Share ↗️' },
    { name: 'edit', label: 'Edit ✏️' },
    { name: 'delete', label: 'Delete 🗑️' },
    { name: 'save', label: 'Save 💾' },
    { name: 'camera', label: 'Camera 📸' },
    { name: 'video', label: 'Video 🎥' },
    { name: 'sun', label: 'Sun ☀️' },
    { name: 'cloud', label: 'Cloud ☁️' },
    { name: 'lock', label: 'Lock 🔒' },
    { name: 'bell', label: 'Bell 🔔' },
    { name: 'gift', label: 'Gift 🎁' },
    { name: 'check', label: 'Check ✓' },
    { name: 'arrowRight', label: 'Arrow Right →' },
    { name: 'arrowLeft', label: 'Arrow Left ←' },
    { name: 'plus', label: 'Plus +' },
    { name: 'minus', label: 'Minus -' },
    { name: 'cart', label: 'Cart 🛒' },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Button" icon={MousePointer2} defaultOpen={true}>
            <ControlGroup label="Text">
              <input
                type="text"
                value={props.text || ''}
                onChange={(e) => updateProp('text', e.target.value)}
                className={inputClasses}
                placeholder="Button Text"
              />
            </ControlGroup>

            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['left', 'center', 'right', 'justify'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('textAlign', align)}
                    className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.textAlign || 'left') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {align === 'justify' ? 'Full' : align}
                  </button>
                ))}
              </div>
            </ControlGroup>

            <ControlGroup label="Size">
              <select className={inputClasses} value={props.size || 'medium'} onChange={(e) => updateProp('size', e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Icon">
              <select
                className={inputClasses}
                value={props.icon || ''}
                onChange={(e) => updateProp('icon', e.target.value)}
              >
                <option value="">None</option>
                {emojiIcons.map(icon => (
                  <option key={icon.name} value={icon.name}>{icon.label}</option>
                ))}
              </select>
            </ControlGroup>
            <ControlGroup label="External Icon">
              <div className="flex gap-1">
                <input
                  type="text"
                  className={inputClasses}
                  value={props.buttonIconUrl || ''}
                  onChange={(e) => updateProp('buttonIconUrl', e.target.value)}
                  placeholder="https://..."
                />
                <button
                  onClick={() => openAssetModal((url) => updateProp('buttonIconUrl', url))}
                  className="p-1.5 bg-[#1a1d21] border border-[#2d3237] rounded hover:border-blue-500/50 transition-colors"
                  title="Choose from assets"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-gray-400 font-bold" />
                </button>
              </div>
            </ControlGroup>
            <ControlGroup label="Icon Position">
              <select className={inputClasses} value={props.iconPosition || 'after'} onChange={(e) => updateProp('iconPosition', e.target.value)}>
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Icon Spacing">
              <UnitControl value={props.iconSpacing} onChange={(val) => updateProp('iconSpacing', val)} placeholder="5px" />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Link" icon={LinkIcon}>
            <ControlGroup label="Type">
              <select className={inputClasses} value={props.linkType || 'url'} onChange={(e) => updateProp('linkType', e.target.value)}>
                <option value="url">External URL</option>
                <option value="email">Email address</option>
                <option value="phone">Phone number</option>
              </select>
            </ControlGroup>

            {props.linkType === 'email' ? (
              <ControlGroup label="Email">
                <input type="email" className={inputClasses} value={props.email || ''} onChange={(e) => updateProp('email', e.target.value)} placeholder="hello@example.com" />
              </ControlGroup>
            ) : props.linkType === 'phone' ? (
              <ControlGroup label="Phone">
                <input type="tel" className={inputClasses} value={props.phone || ''} onChange={(e) => updateProp('phone', e.target.value)} placeholder="+1 234..." />
              </ControlGroup>
            ) : (
              <ControlGroup label="URL">
                <input type="text" className={inputClasses} value={props.href === '#' ? '' : (props.href || '')} onChange={(e) => updateProp('href', e.target.value)} placeholder="https://..." />
              </ControlGroup>
            )}

            <ControlGroup label="Target">
              <select className={inputClasses} value={props.target || '_self'} onChange={(e) => updateProp('target', e.target.value)}>
                <option value="_self">Same Window</option>
                <option value="_blank">New Window</option>
              </select>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <TypographyGroup block={block} onChange={updateProp} />
          <PropertySection title="Button Style" icon={Palette}>
            <ControlGroup label="Variant">
              <select className={inputClasses} value={props.variant || 'primary'} onChange={(e) => updateProp('variant', e.target.value)}>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
                <option value="danger">Danger</option>
              </select>
            </ControlGroup>
            <div className="pt-2 border-t border-[#3e444b] mt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-3 block">Button Background</span>
              <BackgroundControl
                props={{
                  ...props,
                  backgroundColor: props.buttonBackgroundColor,
                  backgroundImage: props.buttonBackgroundImage,
                  backgroundType: props.buttonBackgroundType,
                  gradientColor1: props.buttonGradientColor1,
                  gradientColor2: props.buttonGradientColor2,
                  gradientAngle: props.buttonGradientAngle,
                  gradientType: props.buttonGradientType,
                  usePageBackground: props.buttonUsePageBackground
                }}
                onChange={(key, value) => {
                  if (typeof key === 'object') {
                    const mapped: any = {};
                    Object.entries(key).forEach(([k, v]) => {
                      mapped[`button${k.charAt(0).toUpperCase()}${k.slice(1)}`] = v;
                    });
                    updateProp(mapped);
                  } else {
                    const mappedKey = `button${key.charAt(0).toUpperCase()}${key.slice(1)}`;
                    updateProp(mappedKey, value);
                  }
                }}
              />
            </div>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#ffffff'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} placeholder="Default" />
              </div>
            </ControlGroup>

            <div className="pt-2 border-t border-[#3e444b] mt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase mb-3 block">Button Border</span>
              <ControlGroup label="Style">
                <select
                  value={props.buttonBorderStyle || 'none'}
                  onChange={(e) => updateProp('buttonBorderStyle', e.target.value)}
                  className={inputClasses}
                >
                  <option value="none">None</option>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </ControlGroup>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Width</label>
                  <UnitControl value={props.buttonBorderWidth} onChange={(val) => updateProp('buttonBorderWidth', val)} placeholder="0px" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-400 mb-1 block uppercase tracking-wider">Radius</label>
                  <UnitControl value={props.buttonBorderRadius} onChange={(val) => updateProp('buttonBorderRadius', val)} placeholder="0px" />
                </div>
              </div>
              <ControlGroup label="Color" className="mt-2">
                <div className="flex gap-2">
                  <input type="color" value={props.buttonBorderColor || '#000000'} onChange={(e) => updateProp('buttonBorderColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.buttonBorderColor || ''} onChange={(e) => updateProp('buttonBorderColor', e.target.value)} className={inputClasses} placeholder="Default" />
                </div>
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Block Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BackgroundGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
          </PropertySection>

          <PropertySection title="Shadow" icon={Sparkles}>
            <ControlGroup label="Box Shadow">
              <input type="text" className={inputClasses} value={props.boxShadow || ''} onChange={(e) => updateProp('boxShadow', e.target.value)} placeholder="0px 4px 6px rgba(0,0,0,0.1)" />
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && (
        <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />
      )}
    </div>
  );
}; export const ImageBoxBlockInspector = GenericInspector;
// --- BATCH 1 INSPECTORS (Media & Decorative) ---

export const VideoBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Video" icon={Video} defaultOpen={true}>
            <ControlGroup label="Source URL">
              <input
                type="text"
                className={inputClasses}
                value={props.src || ''}
                onChange={(e) => updateProp('src', e.target.value)}
                placeholder="https://youtube.com/... or .mp4"
              />
            </ControlGroup>
            <ControlGroup label="Poster Image">
              <input
                type="text"
                className={inputClasses}
                value={props.poster || ''}
                onChange={(e) => updateProp('poster', e.target.value)}
                placeholder="Image URL"
              />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Playback Options" icon={Settings}>
            <div className="grid grid-cols-2 gap-3 px-1">
              {[
                { key: 'autoplay', label: 'Autoplay' },
                { key: 'loop', label: 'Loop' },
                { key: 'muted', label: 'Muted' },
                { key: 'controls', label: 'Controls' }
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={!!props[opt.key]}
                      onChange={(e) => updateProp(opt.key, e.target.checked)}
                    />
                    <div className={`w-7 h-4 rounded-full transition-colors ${props[opt.key] ? 'bg-blue-500' : 'bg-[#1a1d21] border border-[#3e444b]'}`} />
                    <div className={`absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${props[opt.key] ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 group-hover:text-gray-200">{opt.label}</span>
                </label>
              ))}
            </div>
          </PropertySection>

          <PropertySection title="Overlay Info" icon={Type}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
                <input type="checkbox" checked={!!props.showTitle} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
              </div>
              {props.showTitle && (
                <ControlGroup label="Title">
                  <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
                </ControlGroup>
              )}
              <div className="flex items-center justify-between px-1 border-t border-[#3e444b] pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
                <input type="checkbox" checked={!!props.showDescription} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
              </div>
              {props.showDescription && (
                <ControlGroup label="Description">
                  <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
                </ControlGroup>
              )}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Aspect Ratio" icon={Sparkles}>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '16:9 (HD)', value: '16/9' },
                { label: '4:3 (TV)', value: '4/3' },
                { label: '1:1 (Square)', value: '1/1' },
                { label: '21:9 (Ultrawide)', value: '21/9' }
              ].map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => updateProp('aspectRatio', ratio.value)}
                  className={`py-1.5 px-2 rounded-sm text-[9px] font-bold uppercase border transition-all ${(props.aspectRatio || '16/9') === ratio.value
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'bg-[#15181b] border-[#2d3237] text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <ControlGroup label="Custom Ratio">
                <input type="text" className={inputClasses} value={props.aspectRatio || ''} onChange={(e) => updateProp('aspectRatio', e.target.value)} placeholder="e.g. 16/9" />
              </ControlGroup>
            </div>
          </PropertySection>

          <DimensionsGroup block={block} onChange={updateProp} />

          <PropertySection title="Alignment" icon={AlignLeft}>
            <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateProp('textAlign', align)}
                  className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.textAlign || 'center') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </PropertySection>

          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
          <EffectsGroup block={block} onChange={updateProp} />
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const IconBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  const emojiIcons = [
    { name: 'star', label: 'Star ⭐' },
    { name: 'heart', label: 'Heart ❤️' },
    { name: 'like', label: 'Like 👍' },
    { name: 'home', label: 'Home 🏠' },
    { name: 'user', label: 'User 👤' },
    { name: 'settings', label: 'Settings ⚙️' },
    { name: 'search', label: 'Search 🔍' },
    { name: 'phone', label: 'Phone 📞' },
    { name: 'email', label: 'Email 📧' },
    { name: 'location', label: 'Location 📍' },
    { name: 'calendar', label: 'Calendar 📅' },
    { name: 'info', label: 'Info ℹ️' },
    { name: 'success', label: 'Success ✅' },
    { name: 'facebook', label: 'Facebook 📘' },
    { name: 'twitter', label: 'Twitter 🐦' },
    { name: 'instagram', label: 'Instagram 📷' },
    { name: 'youtube', label: 'YouTube 📺' },
    { name: 'github', label: 'GitHub 🐙' },
    { name: 'camera', label: 'Camera 📸' },
    { name: 'video', label: 'Video 🎥' },
    { name: 'sun', label: 'Sun ☀️' },
    { name: 'bell', label: 'Bell 🔔' },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Icon UI" icon={Sparkles} defaultOpen={true}>
            <ControlGroup label="Icon">
              <select
                className={inputClasses}
                value={props.name || 'star'}
                onChange={(e) => updateProp('name', e.target.value)}
              >
                {emojiIcons.map(icon => (
                  <option key={icon.name} value={icon.name}>{icon.label}</option>
                ))}
              </select>
            </ControlGroup>

            <ControlGroup label="View">
              <select className={inputClasses} value={props.view || 'default'} onChange={(e) => updateProp('view', e.target.value)}>
                <option value="default">Default</option>
                <option value="stacked">Stacked</option>
                <option value="framed">Framed</option>
              </select>
            </ControlGroup>

            {(props.view === 'stacked' || props.view === 'framed') && (
              <ControlGroup label="Shape">
                <select className={inputClasses} value={props.shape || 'circle'} onChange={(e) => updateProp('shape', e.target.value)}>
                  <option value="circle">Circle</option>
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                </select>
              </ControlGroup>
            )}

            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('textAlign', align)}
                    className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.textAlign || 'center') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Colours" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Primary Colour">
              <div className="flex gap-2">
                <input type="color" value={props.color || '#ffc107'} onChange={(e) => updateProp('color', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.color || ''} onChange={(e) => updateProp('color', e.target.value)} className={inputClasses} placeholder="#ffc107" />
              </div>
            </ControlGroup>

            {props.view === 'stacked' && (
              <ControlGroup label="Secondary Colour">
                <div className="flex gap-2">
                  <input type="color" value={props.backgroundColor || '#ffffff'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.backgroundColor || ''} onChange={(e) => updateProp('backgroundColor', e.target.value)} className={inputClasses} placeholder="#ffffff" />
                </div>
              </ControlGroup>
            )}
          </PropertySection>

          <PropertySection title="UI Styling" icon={Layout}>
            <ControlGroup label="Size">
              <UnitControl value={props.size} onChange={(v) => updateProp('size', v)} placeholder="48px" />
            </ControlGroup>

            <ControlGroup label="Rotation">
              <input
                type="range"
                min="0"
                max="360"
                value={props.rotation || 0}
                onChange={(e) => updateProp('rotation', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-[10px] text-gray-500 mt-1">{props.rotation || 0}°</div>
            </ControlGroup>
          </PropertySection>

          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const SpecificDividerInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  console.log('Rendering Custom DividerBlockInspector');
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Layout" icon={Minus} defaultOpen={true}>
            <ControlGroup label="Style">
              <select className={inputClasses} value={props.style || 'solid'} onChange={(e) => updateProp('style', e.target.value)}>
                <optgroup label="Line">
                  <option value="solid">Solid</option>
                  <option value="double">Double</option>
                  <option value="dotted">Dotted</option>
                  <option value="dashed">Dashed</option>
                  <option value="curly">Curly</option>
                  <option value="curved">Curved</option>
                  <option value="slashes">Slashes</option>
                  <option value="squared">Squared</option>
                  <option value="wavy">Wavy</option>
                  <option value="zigzag">Zigzag</option>
                </optgroup>
                <optgroup label="Pattern">
                  <option value="arrows">Arrows</option>
                  <option value="circles">Circles</option>
                  <option value="diamonds">Diamonds</option>
                  <option value="stars">Stars</option>
                  <option value="pluses">Pluses</option>
                  <option value="crosses">Crosses</option>
                </optgroup>
              </select>
            </ControlGroup>
            <ControlGroup label="Width">
              <UnitControl value={props.width} onChange={(v) => updateProp('width', v)} placeholder="100%" />
            </ControlGroup>
            {/* <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b] w-max">
                {['flex-start', 'center', 'flex-end'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('alignSelf', align)}
                    className={`p-1.5 rounded-sm transition-colors ${props.alignSelf === align ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {align === 'flex-start' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'flex-end' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </ControlGroup> */}
          </PropertySection>
        </>
      )}
      {activeTab === 'style' && (
        <>
          <PropertySection title="Look" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Color">
              <div className="flex gap-2">
                <input type="color" className="w-8 h-8 rounded cursor-pointer bg-transparent border border-gray-600" value={props.color || '#000000'} onChange={(e) => updateProp('color', e.target.value)} />
                <input type="text" className={inputClasses} value={props.color || '#000000'} onChange={(e) => updateProp('color', e.target.value)} />
              </div>
            </ControlGroup>
            <ControlGroup label="Thickness">
              <UnitControl value={props.thickness} onChange={(v) => updateProp('thickness', v)} placeholder="2px" />
            </ControlGroup>
            <ControlGroup label="Visual Gap">
              <UnitControl value={props.padding} onChange={(v) => updateProp('padding', v)} placeholder="10px" />
            </ControlGroup>
          </PropertySection>
          <SpacingGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const SpacerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Spacer" icon={GripHorizontal} defaultOpen={true}>
            <ControlGroup label="Height">
              <UnitControl value={props.height} onChange={(v) => updateProp('height', v)} placeholder="50px" />
            </ControlGroup>
          </PropertySection>
          <BlockSettingsGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'style' && (
        <PropertySection title="Background" icon={Palette}>
          <ControlGroup label="Color">
            <input type="color" className="w-8 h-8 rounded cursor-pointer bg-transparent border border-gray-600" value={props.backgroundColor || ''} onChange={(e) => updateProp('backgroundColor', e.target.value)} />
          </ControlGroup>
        </PropertySection>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const MapBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Map Config" icon={MapIcon} defaultOpen={true}>
            <ControlGroup label="Address">
              <input type="text" className={inputClasses} value={props.address || ''} onChange={(e) => updateProp('address', e.target.value)} placeholder="New York, NY" />
            </ControlGroup>
            <ControlGroup label="Zoom">
              <input type="range" min="1" max="20" className="w-full" value={props.zoom || 12} onChange={(e) => updateProp('zoom', parseInt(e.target.value))} />
              <div className="text-right text-xs text-gray-500">{props.zoom || 12}</div>
            </ControlGroup>
            <ControlGroup label="Type">
              <select className={inputClasses} value={props.mapType || 'roadmap'} onChange={(e) => updateProp('mapType', e.target.value)}>
                <option value="roadmap">Roadmap</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Scroll">
              <select
                className={inputClasses}
                value={props.interactionMode || 'always'}
                onChange={(e) => updateProp('interactionMode', e.target.value)}
              >
                <option value="always">Always Active</option>
                <option value="onClick">Click to Activate</option>
              </select>
            </ControlGroup>
            {props.interactionMode === 'onClick' && (
              <ControlGroup label="Button Text">
                <input
                  type="text"
                  className={inputClasses}
                  value={props.activationText || 'Click to interact'}
                  onChange={(e) => updateProp('activationText', e.target.value)}
                  placeholder="Click to interact"
                />
              </ControlGroup>
            )}
          </PropertySection>
          <BlockSettingsGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'style' && (
        <>
          <DimensionsGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const InputBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <PropertySection title="Input Settings" icon={Type} defaultOpen={true}>
          <ControlGroup label="Type">
            <select className={inputClasses} value={props.type || 'text'} onChange={(e) => updateProp('type', e.target.value)}>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
              <option value="tel">Telephone</option>
              <option value="url">URL</option>
              <option value="search">Search</option>
            </select>
          </ControlGroup>
          <ControlGroup label="Placeholder">
            <input type="text" className={inputClasses} value={props.placeholder || ''} onChange={(e) => updateProp('placeholder', e.target.value)} placeholder="Enter placeholder..." />
          </ControlGroup>
          <ControlGroup label="Name">
            <input type="text" className={inputClasses} value={props.name || ''} onChange={(e) => updateProp('name', e.target.value)} placeholder="field_name" />
          </ControlGroup>
          <div className="flex items-center space-x-2 px-1">
            <input type="checkbox" checked={!!props.required} onChange={(e) => updateProp('required', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
            <span className="text-xs text-gray-300">Required</span>
          </div>
        </PropertySection>
      )}
      {activeTab === 'style' && (
        <>
          <TypographyGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const TextareaBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Textarea" icon={Type} defaultOpen={true}>
            <ControlGroup label="Placeholder">
              <input type="text" className={inputClasses} value={props.placeholder || ''} onChange={(e) => updateProp('placeholder', e.target.value)} placeholder="Enter placeholder..." />
            </ControlGroup>
            <ControlGroup label="Rows">
              <input type="number" className={inputClasses} value={props.rows || 4} onChange={(e) => updateProp('rows', parseInt(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Name">
              <input type="text" className={inputClasses} value={props.name || ''} onChange={(e) => updateProp('name', e.target.value)} placeholder="field_name" />
            </ControlGroup>
            <div className="flex items-center space-x-2 px-1">
              <input type="checkbox" checked={!!props.required} onChange={(e) => updateProp('required', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
              <span className="text-xs text-gray-300">Required</span>
            </div>
          </PropertySection>

          <PropertySection title="Submit Button" icon={MousePointer2}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Submit Button</span>
                <input type="checkbox" checked={!!props.showSubmitButton} onChange={(e) => updateProp('showSubmitButton', e.target.checked)} className="rounded" />
              </div>

              {props.showSubmitButton && (
                <>
                  <ControlGroup label="Button Text">
                    <input type="text" className={inputClasses} value={props.submitButtonText || 'Submit'} onChange={(e) => updateProp('submitButtonText', e.target.value)} />
                  </ControlGroup>

                  <ControlGroup label="Button Color">
                    <div className="flex gap-2">
                      <input type="color" value={props.submitButtonColor || '#3b82f6'} onChange={(e) => updateProp('submitButtonColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                      <input type="text" value={props.submitButtonColor || ''} onChange={(e) => updateProp('submitButtonColor', e.target.value)} className={inputClasses} placeholder="#3b82f6" />
                    </div>
                  </ControlGroup>

                  <ControlGroup label="Text Color">
                    <div className="flex gap-2">
                      <input type="color" value={props.submitButtonTextColor || '#ffffff'} onChange={(e) => updateProp('submitButtonTextColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                      <input type="text" value={props.submitButtonTextColor || ''} onChange={(e) => updateProp('submitButtonTextColor', e.target.value)} className={inputClasses} placeholder="#ffffff" />
                    </div>
                  </ControlGroup>

                  <ControlGroup label="Alignment">
                    <select className={inputClasses} value={props.submitButtonAlignment || 'left'} onChange={(e) => updateProp('submitButtonAlignment', e.target.value)}>
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </ControlGroup>

                  <ControlGroup label="Submit Action">
                    <select className={inputClasses} value={props.submitAction || 'alert'} onChange={(e) => updateProp('submitAction', e.target.value)}>
                      <option value="alert">Show Alert</option>
                      <option value="console">Log to Console</option>
                      <option value="clear">Clear After Submit</option>
                    </select>
                  </ControlGroup>

                  <ControlGroup label="Success Message">
                    <input type="text" className={inputClasses} value={props.successMessage || 'Submitted successfully!'} onChange={(e) => updateProp('successMessage', e.target.value)} placeholder="Submitted successfully!" />
                  </ControlGroup>
                </>
              )}
            </div>
          </PropertySection>
        </>
      )}
      {activeTab === 'style' && (
        <>
          <TypographyGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const CheckboxBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <PropertySection title="Checkbox" icon={CheckSquare} defaultOpen={true}>
          <ControlGroup label="Label">
            <input type="text" className={inputClasses} value={props.label || ''} onChange={(e) => updateProp('label', e.target.value)} placeholder="Checkbox Label" />
          </ControlGroup>
          <ControlGroup label="Value">
            <input type="text" className={inputClasses} value={props.value || ''} onChange={(e) => updateProp('value', e.target.value)} placeholder="yes" />
          </ControlGroup>
          <ControlGroup label="Name">
            <input type="text" className={inputClasses} value={props.name || ''} onChange={(e) => updateProp('name', e.target.value)} placeholder="field_name" />
          </ControlGroup>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center space-x-2 px-1">
              <input type="checkbox" checked={!!props.checked} onChange={(e) => updateProp('checked', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
              <span className="text-xs text-gray-300">Checked</span>
            </label>
            <label className="flex items-center space-x-2 px-1">
              <input type="checkbox" checked={!!props.required} onChange={(e) => updateProp('required', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
              <span className="text-xs text-gray-300">Required</span>
            </label>
          </div>
        </PropertySection>
      )}
      {activeTab === 'style' && (
        <>
          <TypographyGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const RadioBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <PropertySection title="Radio Button" icon={CheckSquare} defaultOpen={true}>
          <ControlGroup label="Label">
            <input type="text" className={inputClasses} value={props.label || ''} onChange={(e) => updateProp('label', e.target.value)} placeholder="Radio Label" />
          </ControlGroup>
          <ControlGroup label="Value">
            <input type="text" className={inputClasses} value={props.value || ''} onChange={(e) => updateProp('value', e.target.value)} placeholder="option_1" />
          </ControlGroup>
          <ControlGroup label="Group Name">
            <input type="text" className={inputClasses} value={props.name || ''} onChange={(e) => updateProp('name', e.target.value)} placeholder="radio_group" />
          </ControlGroup>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <label className="flex items-center space-x-2 px-1">
              <input type="checkbox" checked={!!props.checked} onChange={(e) => updateProp('checked', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
              <span className="text-xs text-gray-300">Checked</span>
            </label>
            <label className="flex items-center space-x-2 px-1">
              <input type="checkbox" checked={!!props.required} onChange={(e) => updateProp('required', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
              <span className="text-xs text-gray-300">Required</span>
            </label>
          </div>
        </PropertySection>
      )}
      {activeTab === 'style' && (
        <>
          <TypographyGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const SelectBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  // Helper to convert options array to string
  const optionsToString = (opts: any[]) => opts?.map(o => `${o.value}:${o.label}`).join('\n') || '';

  // Helper to parse string to options array
  const stringToOptions = (str: string) => {
    return str.split('\n').map(line => {
      const parts = line.split(':');
      if (parts.length >= 2) return { value: parts[0].trim(), label: parts[1].trim() };
      return { value: line.trim(), label: line.trim() };
    }).filter(o => o.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <PropertySection title="Dropdown" icon={List} defaultOpen={true}>
          <ControlGroup label="Options">
            <textarea
              className={inputClasses}
              rows={5}
              defaultValue={optionsToString(props.options || [])}
              onBlur={(e) => updateProp('options', stringToOptions(e.target.value))}
              placeholder="value:Label (one per line)"
            />
            <p className="text-[10px] text-gray-500 mt-1">Format: value:Label</p>
          </ControlGroup>
          <ControlGroup label="Placeholder">
            <input type="text" className={inputClasses} value={props.placeholder || ''} onChange={(e) => updateProp('placeholder', e.target.value)} placeholder="Select option..." />
          </ControlGroup>
          <ControlGroup label="Name">
            <input type="text" className={inputClasses} value={props.name || ''} onChange={(e) => updateProp('name', e.target.value)} placeholder="field_name" />
          </ControlGroup>
          <div className="flex items-center space-x-2 px-1">
            <input type="checkbox" checked={!!props.required} onChange={(e) => updateProp('required', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
            <span className="text-xs text-gray-300">Required</span>
          </div>
        </PropertySection>
      )}
      {activeTab === 'style' && (
        <>
          <TypographyGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const LabelBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Label" icon={Type} defaultOpen={true}>
            <ControlGroup label="Text">
              <input type="text" className={inputClasses} value={props.text || ''} onChange={(e) => updateProp('text', e.target.value)} placeholder="Label Text" />
            </ControlGroup>
            <ControlGroup label="For ID">
              <input type="text" className={inputClasses} value={props.for || ''} onChange={(e) => updateProp('for', e.target.value)} placeholder="input_id" />
            </ControlGroup>
            <ControlGroup label="Layout">
              <select className={inputClasses} value={props.layout || 'horizontal'} onChange={(e) => updateProp('layout', e.target.value)}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Required Indicator" icon={AlertCircle}>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Required</span>
                <input
                  type="checkbox"
                  checked={props.required || false}
                  onChange={(e) => updateProp('required', e.target.checked)}
                  className="rounded border-[#2d3237] bg-transparent text-blue-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
              </div>

              {props.required && (
                <>
                  <ControlGroup label="Indicator">
                    <input type="text" className={inputClasses} value={props.requiredIndicator || '*'} onChange={(e) => updateProp('requiredIndicator', e.target.value)} placeholder="*" maxLength={3} />
                  </ControlGroup>
                  <ControlGroup label="Color">
                    <div className="flex gap-2">
                      <input type="color" value={props.requiredColor || '#dc3545'} onChange={(e) => updateProp('requiredColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                      <input type="text" value={props.requiredColor || ''} onChange={(e) => updateProp('requiredColor', e.target.value)} className={inputClasses} placeholder="#dc3545" />
                    </div>
                  </ControlGroup>
                </>
              )}
            </div>
          </PropertySection>

          <PropertySection title="Icon" icon={Star}>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Icon</span>
                <input type="checkbox" checked={!!props.showIcon} onChange={(e) => updateProp('showIcon', e.target.checked)} className="rounded" />
              </div>

              {props.showIcon && (
                <>
                  <ControlGroup label="Icon">
                    <input type="text" className={inputClasses} value={props.icon || '📝'} onChange={(e) => updateProp('icon', e.target.value)} placeholder="📝 or text" />
                  </ControlGroup>
                  <ControlGroup label="Position">
                    <select className={inputClasses} value={props.iconPosition || 'left'} onChange={(e) => updateProp('iconPosition', e.target.value)}>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </ControlGroup>
                </>
              )}
            </div>
          </PropertySection>

          <PropertySection title="Help & Tooltip" icon={HelpCircle}>
            <div className="space-y-3">
              <ControlGroup label="Help Text">
                <input type="text" className={inputClasses} value={props.helpText || ''} onChange={(e) => updateProp('helpText', e.target.value)} placeholder="Optional help text..." />
              </ControlGroup>

              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Tooltip</span>
                <input type="checkbox" checked={!!props.showTooltip} onChange={(e) => updateProp('showTooltip', e.target.checked)} className="rounded" />
              </div>

              {props.showTooltip && (
                <ControlGroup label="Tooltip Text">
                  <textarea className={`${inputClasses} min-h-[60px]`} value={props.tooltipText || ''} onChange={(e) => updateProp('tooltipText', e.target.value)} placeholder="Tooltip on hover..." />
                </ControlGroup>
              )}
            </div>
          </PropertySection>
        </>
      )}
      {activeTab === 'style' && (
        <>
          <DimensionsGroup block={block} onChange={updateProp} />
          <TypographyGroup block={block} onChange={updateProp} />
          <BackgroundGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
          <SpacingGroup block={block} onChange={updateProp} />
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

// --- BATCH 3 INSPECTORS (Structural & Complex) ---


export const FlexBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'style' && ( // Flex container is mostly about style/layout
        <>
          <FlexLayoutGroup block={block} onChange={updateProp} />
          <PropertySection title="Sizing" icon={Maximize2}>
            <DimensionsGroup block={block} onChange={updateProp} />
          </PropertySection>
          <PropertySection title="Appearance" icon={Palette} defaultOpen={true}>
            <TypographyGroup block={block} onChange={updateProp} />
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const ContainerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Layout" icon={LayoutIcon} defaultOpen={true}>
            <ControlGroup label="Content Width">
              <select
                className={inputClasses}
                value={props.contentWidth || 'boxed'}
                onChange={(e) => updateProp('contentWidth', e.target.value)}
              >
                <option value="boxed">Boxed</option>
                <option value="full">Full Width</option>
              </select>
            </ControlGroup>
            {props.contentWidth === 'boxed' && (
              <ControlGroup label="Width">
                <UnitControl value={props.width} onChange={(v) => updateProp('width', v)} />
              </ControlGroup>
            )}
            <ControlGroup label="Min Height">
              <UnitControl value={props.minHeight} onChange={(v) => updateProp('minHeight', v)} />
            </ControlGroup>
            <ControlGroup label="Max Width">
              <UnitControl value={props.maxWidth} onChange={(v) => updateProp('maxWidth', v)} />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Alignment" icon={AlignLeft}>
            <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
              {['left', 'center', 'right', 'justify'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateProp('textAlign', align)}
                  className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.textAlign || 'left') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Background" icon={Palette} defaultOpen={true}>
            <BackgroundControl props={props} onChange={updateProp} />
          </PropertySection>

          <PropertySection title="Spacing" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
          </PropertySection>

          <BorderGroup block={block} onChange={updateProp} />
          <EffectsGroup block={block} onChange={updateProp} />
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};


const ScopedTypographyGroup = ({ block, prefix, onChange, title }: { block: any, prefix: string, onChange: any, title: string }) => {
  const props = block.props;

  // Create a proxy block that maps prefixed props to standard props (e.g. titleFontSize -> fontSize)
  const proxyProps = {
    fontFamily: props[`${prefix}FontFamily`],
    fontSize: props[`${prefix}FontSize`],
    fontWeight: props[`${prefix}FontWeight`],
    color: props[`${prefix}Color`],
    textAlign: props[`${prefix}TextAlign`],
    lineHeight: props[`${prefix}LineHeight`],
    letterSpacing: props[`${prefix}LetterSpacing`],
    textTransform: props[`${prefix}TextTransform`],
    textDecoration: props[`${prefix}TextDecoration`],
    fontStyle: props[`${prefix}FontStyle`],
  };

  const proxyBlock = { ...block, props: proxyProps };

  const handleChange = (key: string, value: any) => {
    // Map standard prop back to prefixed prop (e.g. fontSize -> titleFontSize)
    const prefixedKey = `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}`;
    onChange(prefixedKey, value);
  };

  return <TypographyGroup block={proxyBlock} onChange={handleChange} title={title} />;
};

export const GroupBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Group Content" icon={Layers} defaultOpen={true}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
                <input type="checkbox" checked={!!props.showTitle} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
              </div>
              {props.showTitle && (
                <ControlGroup label="Title">
                  <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
                </ControlGroup>
              )}

              <div className="flex items-center justify-between px-1 border-t border-[#3e444b] pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
                <input type="checkbox" checked={!!props.showDescription} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
              </div>
              {props.showDescription && (
                <ControlGroup label="Description">
                  <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
                </ControlGroup>
              )}
            </div>
          </PropertySection>

          <PropertySection title="Alignment" icon={AlignLeft}>
            <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => updateProp('textAlign', align)}
                  className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.textAlign || 'left') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          {props.showTitle && (
            <ScopedTypographyGroup block={block} prefix="title" onChange={updateProp} title="Title Typography" />
          )}
          {props.showDescription && (
            <ScopedTypographyGroup block={block} prefix="description" onChange={updateProp} title="Description Typography" />
          )}

          <PropertySection title="Appearance" icon={Palette} defaultOpen={true}>
            <BackgroundControl props={props} onChange={updateProp} />
          </PropertySection>

          <PropertySection title="Box Style" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const SocialFollowBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  const platformsList = props.platforms || [];

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Social Platforms" icon={Layers} defaultOpen={true}>
            <div className="space-y-3">
              {platformsList.map((platform: any, index: number) => (
                <div key={index} className="p-3 bg-[#1a1d21] rounded border border-[#3e444b] space-y-2 group/item">
                  <div className="flex justify-between items-center bg-[#2a2e34] -m-3 p-2 mb-1 rounded-t border-b border-[#3e444b]">
                    <span className="text-[10px] uppercase font-bold text-blue-400">{platform.name || 'Platform'}</span>
                    <button
                      onClick={() => {
                        const newList = [...platformsList];
                        newList.splice(index, 1);
                        updateProp('platforms', newList);
                      }}
                      className="text-red-500 hover:text-red-400 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <ControlGroup label="Network">
                      <select
                        className={inputClasses}
                        value={platform.name}
                        onChange={(e) => {
                          const newList = [...platformsList];
                          newList[index] = { ...newList[index], name: e.target.value };
                          updateProp('platforms', newList);
                        }}
                      >
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="YouTube">YouTube</option>
                        <option value="GitHub">GitHub</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Dribbble">Dribbble</option>
                      </select>
                    </ControlGroup>
                    <ControlGroup label="Label">
                      <input
                        type="text"
                        className={inputClasses}
                        value={platform.label || ''}
                        placeholder={platform.name}
                        onChange={(e) => {
                          const newList = [...platformsList];
                          newList[index] = { ...newList[index], label: e.target.value };
                          updateProp('platforms', newList);
                        }}
                      />
                    </ControlGroup>
                  </div>
                  <ControlGroup label="Link URL">
                    <input
                      type="text"
                      className={inputClasses}
                      value={platform.url || ''}
                      onChange={(e) => {
                        const newList = [...platformsList];
                        newList[index] = { ...newList[index], url: e.target.value };
                        updateProp('platforms', newList);
                      }}
                    />
                  </ControlGroup>
                </div>
              ))}
              <button
                onClick={() => {
                  const newList = [...platformsList];
                  newList.push({ name: 'Facebook', url: '#', label: '' });
                  updateProp('platforms', newList);
                }}
                className="w-full py-2 bg-blue-500/10 border border-dashed border-blue-500/50 text-blue-400 rounded text-[10px] font-bold uppercase hover:bg-blue-500/20 transition-all focus:outline-none"
              >
                + Add Item
              </button>
            </div>
          </PropertySection>

          <PropertySection title="Layout Settings" icon={Layout}>
            <ControlGroup label="Shape">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['square', 'rounded', 'circle'].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateProp('shape', s)}
                    className={`flex-1 py-1 px-1 rounded-sm text-[9px] uppercase font-bold transition-all ${(props.shape || 'rounded') === s ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ControlGroup>
            <ControlGroup label="Layout">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['horizontal', 'vertical'].map((l) => (
                  <button
                    key={l}
                    onClick={() => updateProp('layout', l)}
                    className={`flex-1 py-1 px-1 rounded-sm text-[9px] uppercase font-bold transition-all ${(props.layout || 'horizontal') === l ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </ControlGroup>
            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['flex-start', 'center', 'flex-end', 'space-between'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('justifyContent', align)}
                    className={`flex-1 py-1 px-1 rounded-sm text-[9px] uppercase font-bold transition-all ${(props.justifyContent || 'center') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {align === 'flex-start' ? <AlignLeft size={12} /> :
                      align === 'center' ? <AlignCenter size={12} /> :
                        align === 'flex-end' ? <AlignRight size={12} /> :
                          <AlignJustify size={12} />}
                  </button>
                ))}
              </div>
            </ControlGroup>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Labels</span>
              <input type="checkbox" checked={!!props.showLabels} onChange={(e) => updateProp('showLabels', e.target.checked)} className="rounded" />
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Icon Style" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Size">
              <UnitControl value={props.iconSize || '16px'} onChange={(v) => updateProp('iconSize', v)} />
            </ControlGroup>
            <ControlGroup label="Gap">
              <UnitControl value={props.gap || '10px'} onChange={(v) => updateProp('gap', v)} />
            </ControlGroup>

            <div className="my-4 border-t border-[#3e444b] pt-4">
              <ControlGroup label="Color Mode">
                <select className={inputClasses} value={props.view || 'official'} onChange={(e) => updateProp('view', e.target.value)}>
                  <option value="official">Official Colors</option>
                  <option value="custom">Custom Colors</option>
                </select>
              </ControlGroup>

              {props.view === 'custom' && (
                <div className="space-y-2 mt-3 p-2 bg-[#1a1d21] rounded border border-[#2d3237]">
                  <ControlGroup label="Primary Color">
                    <div className="flex gap-2">
                      <input type="color" value={props.iconPrimaryColor || '#3b82f6'} onChange={(e) => updateProp('iconPrimaryColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                      <input type="text" value={props.iconPrimaryColor || ''} onChange={(e) => updateProp('iconPrimaryColor', e.target.value)} className={inputClasses} placeholder="#3b82f6" />
                    </div>
                  </ControlGroup>
                  <ControlGroup label="Secondary Color">
                    <div className="flex gap-2">
                      <input type="color" value={props.iconSecondaryColor || '#ffffff'} onChange={(e) => updateProp('iconSecondaryColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                      <input type="text" value={props.iconSecondaryColor || ''} onChange={(e) => updateProp('iconSecondaryColor', e.target.value)} className={inputClasses} placeholder="#ffffff" />
                    </div>
                  </ControlGroup>
                </div>
              )}
            </div>

            <ControlGroup label="Button Style">
              <select className={inputClasses} value={props.buttonStyle || 'solid'} onChange={(e) => updateProp('buttonStyle', e.target.value)}>
                <option value="solid">Solid</option>
                <option value="framed">Framed / Bordered</option>
                <option value="minimal">Minimal / Icon Only</option>
              </select>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Hover Effects" icon={Sparkles}>
            <ControlGroup label="Animation">
              <select className={inputClasses} value={props.hoverAnimation || 'none'} onChange={(e) => updateProp('hoverAnimation', e.target.value)}>
                <option value="none">None</option>
                <option value="grow">Grow</option>
                <option value="shrink">Shrink</option>
                <option value="rotate">Rotate</option>
                <option value="float">Float</option>
              </select>
            </ControlGroup>
            {props.view === 'custom' && (
              <ControlGroup label="Hover Color">
                <div className="flex gap-2">
                  <input type="color" value={props.iconHoverPrimaryColor || '#2563eb'} onChange={(e) => updateProp('iconHoverPrimaryColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.iconHoverPrimaryColor || ''} onChange={(e) => updateProp('iconHoverPrimaryColor', e.target.value)} className={inputClasses} placeholder="#2563eb" />
                </div>
              </ControlGroup>
            )}
          </PropertySection>

          <PropertySection title="Appearance" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const FormBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Form Header" icon={Type} defaultOpen={true}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
                <input type="checkbox" checked={props.showTitle !== false} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
              </div>
              {props.showTitle !== false && (
                <ControlGroup label="Title">
                  <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
                </ControlGroup>
              )}

              <div className="flex items-center justify-between px-1 border-t border-[#3e444b] pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
                <input type="checkbox" checked={props.showDescription !== false} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
              </div>
              {props.showDescription !== false && (
                <ControlGroup label="Description">
                  <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
                </ControlGroup>
              )}
            </div>
          </PropertySection>

          <PropertySection title="Form Fields" icon={Layers}>
            <div className="space-y-2">
              {(props.fields || DEFAULT_FORM_FIELDS).map((field: any, index: number) => (
                <div key={index} className="p-3 bg-[#1a1d21] rounded border border-[#3e444b] space-y-2 transition-all hover:border-[#4e555e]">
                  <div className="flex justify-between items-center bg-[#2a2e34] -m-3 p-2 mb-1 rounded-t border-b border-[#3e444b]">
                    <span className="text-[10px] uppercase font-bold text-blue-400">{field.type} Field</span>
                    <button onClick={() => {
                      const newFields = [...props.fields];
                      newFields.splice(index, 1);
                      updateProp('fields', newFields);
                    }} className="text-red-500 hover:text-red-400 p-1">
                      <X size={14} />
                    </button>
                  </div>
                  <ControlGroup label="Label">
                    <input type="text" className={inputClasses} value={field.label || ''} onChange={(e) => {
                      const newFields = [...props.fields];
                      newFields[index] = { ...newFields[index], label: e.target.value };
                      updateProp('fields', newFields);
                    }} />
                  </ControlGroup>
                  <label className="flex items-center space-x-2 px-1">
                    <input type="checkbox" checked={!!field.required} onChange={(e) => {
                      const newFields = [...props.fields];
                      newFields[index] = { ...newFields[index], required: e.target.checked };
                      updateProp('fields', newFields);
                    }} className="rounded bg-[#1a1d21] border-[#3e444b]" />
                    <span className="text-[10px] uppercase font-bold text-gray-500">Required</span>
                  </label>
                </div>
              ))}
              <button
                onClick={() => {
                  const newFields = [...(props.fields || [])];
                  newFields.push({ id: `field_${Date.now()}`, type: 'text', label: 'New Field', placeholder: '', required: false });
                  updateProp('fields', newFields);
                }}
                className="w-full py-2 bg-blue-500/10 border border-dashed border-blue-500/50 text-blue-400 rounded text-[10px] font-bold uppercase hover:bg-blue-500/20 transition-all focus:outline-none"
              >
                + Add Field
              </button>
            </div>
          </PropertySection>

          <PropertySection title="Submission" icon={Pointer}>
            <ControlGroup label="Action">
              <select className={inputClasses} value={props.submitAction || 'email'} onChange={(e) => updateProp('submitAction', e.target.value)}>
                <option value="email">Email</option>
                <option value="webhook">Webhook</option>
                <option value="redirect">Redirect</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Method">
              <select className={inputClasses} value={props.submitMethod || 'POST'} onChange={(e) => updateProp('submitMethod', e.target.value)}>
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </select>
            </ControlGroup>
            {(props.submitAction === 'email' || !props.submitAction) && (
              <>
                <ControlGroup label="Email To">
                  <input type="email" className={inputClasses} value={props.emailTo || ''} onChange={(e) => updateProp('emailTo', e.target.value)} placeholder="you@example.com" />
                </ControlGroup>
                <div className="flex items-center justify-between px-1 py-1">
                  <label className="text-xs text-gray-400">Use Gmail Web</label>
                  <input
                    type="checkbox"
                    checked={props.useGmail || false}
                    onChange={(e) => updateProp('useGmail', e.target.checked)}
                    className="accent-blue-500 bg-[#1a1d21] border-[#3e444b] rounded"
                  />
                </div>
              </>
            )}
            {props.submitAction === 'webhook' && (
              <ControlGroup label="Webhook URL">
                <input type="text" className={inputClasses} value={props.webhookUrl || ''} onChange={(e) => updateProp('webhookUrl', e.target.value)} placeholder="https://..." />
              </ControlGroup>
            )}
            {props.submitAction === 'redirect' && (
              <ControlGroup label="Redirect URL">
                <input type="text" className={inputClasses} value={props.redirectUrl || ''} onChange={(e) => updateProp('redirectUrl', e.target.value)} placeholder="https://..." />
              </ControlGroup>
            )}
            <ControlGroup label="Success Msg">
              <input type="text" className={inputClasses} value={props.successMessage || ''} onChange={(e) => updateProp('successMessage', e.target.value)} placeholder="Thank you!" />
            </ControlGroup>
            <ControlGroup label="Error Msg">
              <input type="text" className={inputClasses} value={props.errorMessage || ''} onChange={(e) => updateProp('errorMessage', e.target.value)} placeholder="Something went wrong" />
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="General Text" icon={Type} defaultOpen={true}>
            <TypographyGroup block={block} onChange={updateProp} />
          </PropertySection>

          <PropertySection title="Fields Style" icon={Type} defaultOpen={true}>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.inputTextColor || '#4b5563'} onChange={(e) => updateProp('inputTextColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.inputTextColor || ''} onChange={(e) => updateProp('inputTextColor', e.target.value)} className={inputClasses} placeholder="Default" />
              </div>
            </ControlGroup>
            <ControlGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={props.inputBgColor || '#ffffff'} onChange={(e) => updateProp('inputBgColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.inputBgColor || ''} onChange={(e) => updateProp('inputBgColor', e.target.value)} className={inputClasses} placeholder="Default" />
              </div>
            </ControlGroup>
            <ControlGroup label="Border Color">
              <div className="flex gap-2">
                <input type="color" value={props.inputBorderColor || '#d1d5db'} onChange={(e) => updateProp('inputBorderColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.inputBorderColor || ''} onChange={(e) => updateProp('inputBorderColor', e.target.value)} className={inputClasses} placeholder="Default" />
              </div>
            </ControlGroup>
            <ControlGroup label="Border Radius">
              <UnitControl value={props.inputBorderRadius} onChange={(v) => updateProp('inputBorderRadius', v)} />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Button Style" icon={Palette}>
            <ControlGroup label="Button Text">
              <input type="text" className={inputClasses} value={props.submitText || 'Submit'} onChange={(e) => updateProp('submitText', e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Color">
              <div className="flex gap-2">
                <input type="color" value={props.buttonColor || '#3b82f6'} onChange={(e) => updateProp('buttonColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.buttonColor || ''} onChange={(e) => updateProp('buttonColor', e.target.value)} className={inputClasses} placeholder="#3b82f6" />
              </div>
            </ControlGroup>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.buttonTextColor || '#ffffff'} onChange={(e) => updateProp('buttonTextColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.buttonTextColor || ''} onChange={(e) => updateProp('buttonTextColor', e.target.value)} className={inputClasses} placeholder="#ffffff" />
              </div>
            </ControlGroup>
            <ControlGroup label="Align">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['start', 'center', 'end', 'stretch'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('btnAlign', align)}
                    className={`flex-1 py-1 px-1 rounded-sm text-[9px] uppercase font-bold transition-all ${(props.btnAlign || 'start') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {align === 'start' ? 'Left' : align === 'end' ? 'Right' : align}
                  </button>
                ))}
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Form Appearance" icon={Maximize2}>
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const SurveyBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    const u = typeof k === 'string' ? { [k]: v } : k;
    updateBlock(block.id, { props: { ...props, ...u } });
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Survey Header" icon={Type} defaultOpen={true}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
                <input type="checkbox" checked={props.showTitle !== false} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
              </div>
              {props.showTitle !== false && (
                <ControlGroup label="Title">
                  <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
                </ControlGroup>
              )}

              <div className="flex items-center justify-between px-1 border-t border-[#3e444b] pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
                <input type="checkbox" checked={props.showDescription !== false} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
              </div>
              {props.showDescription !== false && (
                <ControlGroup label="Description">
                  <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
                </ControlGroup>
              )}

              <div className="flex items-center justify-between px-1 border-t border-[#3e444b] pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Progress Bar</span>
                <input type="checkbox" checked={props.showProgress !== false} onChange={(e) => updateProp('showProgress', e.target.checked)} className="rounded" />
              </div>
            </div>
          </PropertySection>

          <PropertySection title="Questions" icon={Layers}>
            <div className="space-y-3">
              {(props.questions || []).map((q: any, index: number) => (
                <div key={q.id || index} className="p-3 bg-[#1a1d21] rounded border border-[#3e444b] space-y-2 transition-all hover:border-[#4e555e]">
                  <div className="flex justify-between items-center bg-[#2a2e34] -m-3 p-2 mb-1 rounded-t border-b border-[#3e444b]">
                    <span className="text-[10px] uppercase font-bold text-blue-400">{q.type} Question</span>
                    <button onClick={() => {
                      const newQs = [...props.questions];
                      newQs.splice(index, 1);
                      updateProp('questions', newQs);
                    }} className="text-red-500 hover:text-red-400 p-1">
                      <X size={14} />
                    </button>
                  </div>
                  <ControlGroup label="Question">
                    <input type="text" className={inputClasses} value={q.question || ''} onChange={(e) => {
                      const newQs = [...props.questions];
                      newQs[index] = { ...newQs[index], question: e.target.value };
                      updateProp('questions', newQs);
                    }} />
                  </ControlGroup>

                  {['single', 'multiple'].includes(q.type) && (
                    <div className="pt-2 border-t border-[#3e444b] mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Options</label>
                      </div>
                      <div className="space-y-2">
                        {(q.options || []).map((opt: string, optIndex: number) => (
                          <div key={optIndex} className="flex gap-1">
                            <input
                              type="text"
                              className={inputClasses}
                              value={opt}
                              onChange={(e) => {
                                const newQs = [...props.questions];
                                const newOpts = [...(newQs[index].options || [])];
                                newOpts[optIndex] = e.target.value;
                                newQs[index] = { ...newQs[index], options: newOpts };
                                updateProp('questions', newQs);
                              }}
                            />
                            <button
                              onClick={() => {
                                const newQs = [...props.questions];
                                const newOpts = [...(newQs[index].options || [])];
                                newOpts.splice(optIndex, 1);
                                newQs[index] = { ...newQs[index], options: newOpts };
                                updateProp('questions', newQs);
                              }}
                              className="p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded transition-colors flex items-center justify-center h-full aspect-square"
                              title="Remove Option"
                            >
                              <Minus size={12} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newQs = [...props.questions];
                            const newOpts = [...(newQs[index].options || [])];
                            newOpts.push(`Option ${newOpts.length + 1}`);
                            newQs[index] = { ...newQs[index], options: newOpts };
                            updateProp('questions', newQs);
                          }}
                          className="w-full py-1.5 bg-[#202328] hover:bg-[#2d3237] text-[10px] text-blue-400 font-bold uppercase rounded border border-[#3e444b] transition-all hover:border-blue-500/30"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  const newQs = [...(props.questions || [])];
                  newQs.push({ id: `q_${Date.now()}`, type: 'single', question: 'New Question', options: ['Option 1', 'Option 2'], required: false });
                  updateProp('questions', newQs);
                }}
                className="w-full py-2 bg-blue-500/10 border border-dashed border-blue-500/50 text-blue-400 rounded text-[10px] font-bold uppercase hover:bg-blue-500/20 transition-all focus:outline-none"
              >
                + Add Question
              </button>
            </div>
          </PropertySection>

          <PropertySection title="Submit Button" icon={Pointer}>
            <ControlGroup label="Button Text">
              <input type="text" className={inputClasses} value={props.submitText || 'Submit Survey'} onChange={(e) => updateProp('submitText', e.target.value)} />
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Survey Style" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Accent Color">
              <div className="flex gap-2">
                <input type="color" value={props.accentColor || '#3b82f6'} onChange={(e) => updateProp('accentColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.accentColor || ''} onChange={(e) => updateProp('accentColor', e.target.value)} className={inputClasses} placeholder="#3b82f6" />
              </div>
            </ControlGroup>
            <ControlGroup label="Button Color">
              <div className="flex gap-2">
                <input type="color" value={props.buttonColor || '#3b82f6'} onChange={(e) => updateProp('buttonColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.buttonColor || ''} onChange={(e) => updateProp('buttonColor', e.target.value)} className={inputClasses} placeholder="#3b82f6" />
              </div>
            </ControlGroup>
            <ControlGroup label="Button Text">
              <div className="flex gap-2">
                <input type="color" value={props.buttonTextColor || '#ffffff'} onChange={(e) => updateProp('buttonTextColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.buttonTextColor || ''} onChange={(e) => updateProp('buttonTextColor', e.target.value)} className={inputClasses} placeholder="#ffffff" />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Survey Appearance" icon={Maximize2}>
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}
      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

// --- REUSE & LEGACY MAPPING ---
export const HeadingBlockInspector = ElementorHeadingInspector; // Unified Elementor-style heading for all
export const LinkBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Link Settings" icon={LinkIcon} defaultOpen={true}>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-xs text-blue-300">
                <p className="mb-2">Links are active in <strong>Preview Mode</strong> only.</p>
                {props.url && props.url !== '#' && (
                  <button
                    onClick={() => window.open(props.url, '_blank')}
                    className="flex items-center gap-1 text-blue-400 hover:text-white font-bold uppercase text-[10px] transition-colors"
                  >
                    Test Link ↗
                  </button>
                )}
              </div>
              <ControlGroup label="Text">
                <input
                  type="text"
                  className={inputClasses}
                  value={props.text || ''}
                  onChange={(e) => updateProp('text', e.target.value)}
                  placeholder="Click here"
                />
              </ControlGroup>
              <ControlGroup label="URL">
                <input
                  type="text"
                  className={inputClasses}
                  value={props.url === '#' ? '' : (props.url || '')}
                  onChange={(e) => updateProp('url', e.target.value)}
                  placeholder="https://example.com"
                />
              </ControlGroup>
              <ControlGroup label="Target">
                <select
                  className={inputClasses}
                  value={props.target || '_self'}
                  onChange={(e) => updateProp('target', e.target.value)}
                >
                  <option value="_self">Same Tab (_self)</option>
                  <option value="_blank">New Tab (_blank)</option>
                  <option value="_parent">Parent Frame (_parent)</option>
                  <option value="_top">Full Window (_top)</option>
                </select>
              </ControlGroup>
              {props.target === '_blank' && (
                <ControlGroup label="Rel">
                  <input
                    type="text"
                    className={inputClasses}
                    value={props.rel || ''}
                    onChange={(e) => updateProp('rel', e.target.value)}
                    placeholder="noopener noreferrer"
                  />
                </ControlGroup>
              )}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Typography" icon={Type} defaultOpen={true}>
            <TypographyGroup block={block} onChange={updateProp} withoutSection />
          </PropertySection>

          <PropertySection title="Colors" icon={Palette}>
            <div className="space-y-3">
              <div className="flex items-center gap-1 bg-[#1a1d21] p-1 rounded border border-[#3e444b] mb-3">
                <button className="flex-1 text-[10px] font-bold uppercase py-1 px-2 rounded bg-[#3b82f6] text-white">Normal</button>
                {/* Note: Tabs switch logic would need local state if we want real tabs. 
                        For simplicity, showing both or using a small state for this section? 
                    */}
              </div>

              <div className="space-y-3">
                <ControlGroup label="Text Color">
                  <div className="flex gap-2">
                    <input type="color" value={props.color || '#3b82f6'} onChange={(e) => updateProp('color', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                    <input type="text" value={props.color || ''} onChange={(e) => updateProp('color', e.target.value)} className={inputClasses} />
                  </div>
                </ControlGroup>
                <ControlGroup label="Background">
                  <div className="flex gap-2">
                    <input type="color" value={props.backgroundColor || '#transparent'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                    <input type="text" value={props.backgroundColor || 'transparent'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className={inputClasses} />
                  </div>
                </ControlGroup>
              </div>

              <div className="pt-3 border-t border-[#3e444b]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Hover State</span>
                <ControlGroup label="Text Color">
                  <div className="flex gap-2">
                    <input type="color" value={props.hoverColor || '#1d4ed8'} onChange={(e) => updateProp('hoverColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                    <input type="text" value={props.hoverColor || ''} onChange={(e) => updateProp('hoverColor', e.target.value)} className={inputClasses} />
                  </div>
                </ControlGroup>
                <ControlGroup label="Background">
                  <div className="flex gap-2">
                    <input type="color" value={props.hoverBackgroundColor || '#transparent'} onChange={(e) => updateProp('hoverBackgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                    <input type="text" value={props.hoverBackgroundColor || 'transparent'} onChange={(e) => updateProp('hoverBackgroundColor', e.target.value)} className={inputClasses} />
                  </div>
                </ControlGroup>
              </div>
            </div>
          </PropertySection>

          <PropertySection title="Appearance" icon={LayoutIcon}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
          </PropertySection>

          <PropertySection title="Effects" icon={Sparkles}>
            <ControlGroup label="Hover Anim">
              <select
                className={inputClasses}
                value={props.hoverAnimation || 'none'}
                onChange={(e) => updateProp('hoverAnimation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="grow">Grow</option>
                <option value="fade">Fade</option>
                <option value="underline">Underline</option>
              </select>
            </ControlGroup>
            <EffectsGroup block={block} onChange={updateProp} withoutSection />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const LinkBoxBlockInspector = GenericInspector;
export const CountdownTimerBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Timer Settings" icon={Calendar} defaultOpen={true}>
            <ControlGroup label="Target Date">
              <input
                type="datetime-local"
                className={inputClasses}
                value={props.targetDate ? new Date(props.targetDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => updateProp('targetDate', new Date(e.target.value).toISOString())}
              />
            </ControlGroup>
            <ControlGroup label="Format">
              <select className={inputClasses} value={props.format || 'card'} onChange={(e) => updateProp('format', e.target.value)}>
                <option value="card">Card / Blocks</option>
                <option value="simple">Simple / Bold</option>
                <option value="minimal">Minimal / Inline</option>
              </select>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Header Content" icon={Type}>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
              <input type="checkbox" checked={props.showTitle !== false} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
            </div>
            {props.showTitle !== false && (
              <ControlGroup label="Title">
                <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
              </ControlGroup>
            )}
            <div className="flex items-center justify-between px-1 mt-4 mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
              <input type="checkbox" checked={props.showDescription !== false} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
            </div>
            {props.showDescription !== false && (
              <ControlGroup label="Description">
                <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
              </ControlGroup>
            )}
          </PropertySection>

          <PropertySection title="Display Units" icon={Layers}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'Days', key: 'showDays' },
                { label: 'Hours', key: 'showHours' },
                { label: 'Minutes', key: 'showMinutes' },
                { label: 'Seconds', key: 'showSeconds' },
              ].map(unit => (
                <div key={unit.key} className="flex items-center justify-between py-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">{unit.label}</span>
                  <input type="checkbox" checked={props[unit.key] !== false} onChange={(e) => updateProp(unit.key, e.target.checked)} className="rounded" />
                </div>
              ))}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Timer Styling" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Accent Color">
              <div className="flex gap-2">
                <input type="color" value={props.accentColor || '#ef4444'} onChange={(e) => updateProp('accentColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.accentColor || ''} onChange={(e) => updateProp('accentColor', e.target.value)} className={inputClasses} placeholder="#ef4444" />
              </div>
            </ControlGroup>

            <ControlGroup label="Digit Bg">
              <div className="flex gap-2">
                <input type="color" value={props.digitBgColor || '#f3f4f6'} onChange={(e) => updateProp('digitBgColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.digitBgColor || ''} onChange={(e) => updateProp('digitBgColor', e.target.value)} className={inputClasses} placeholder="rgba(0,0,0,0.1)" />
              </div>
            </ControlGroup>

            <ControlGroup label="Digit Text">
              <div className="flex gap-2">
                <input type="color" value={props.digitTextColor || '#1f2937'} onChange={(e) => updateProp('digitTextColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.digitTextColor || ''} onChange={(e) => updateProp('digitTextColor', e.target.value)} className={inputClasses} placeholder="inherit" />
              </div>
            </ControlGroup>

            <ControlGroup label="Label Color">
              <div className="flex gap-2">
                <input type="color" value={props.labelColor || '#6b7280'} onChange={(e) => updateProp('labelColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.labelColor || ''} onChange={(e) => updateProp('labelColor', e.target.value)} className={inputClasses} placeholder="inherit" />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Expired State" icon={Sparkles}>
            <ControlGroup label="Message">
              <input type="text" className={inputClasses} value={props.expiredMessage || ''} onChange={(e) => updateProp('expiredMessage', e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Action Text">
              <input type="text" className={inputClasses} value={props.expiredActionText || ''} onChange={(e) => updateProp('expiredActionText', e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Action URL">
              <input type="text" className={inputClasses} value={props.expiredActionUrl || ''} onChange={(e) => updateProp('expiredActionUrl', e.target.value)} />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container Style" icon={Maximize2}>
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const ProgressBarBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Progress Settings" icon={Layers} defaultOpen={true}>
            <div className="space-y-4">
              <ControlGroup label="Value">
                <input type="number" className={inputClasses} value={props.value ?? 65} onChange={(e) => updateProp('value', Number(e.target.value))} />
              </ControlGroup>
              <ControlGroup label="Max Value">
                <input type="number" className={inputClasses} value={props.max ?? 100} onChange={(e) => updateProp('max', Number(e.target.value))} />
              </ControlGroup>
              <ControlGroup label="Style">
                <select className={inputClasses} value={props.style || 'line'} onChange={(e) => updateProp('style', e.target.value)}>
                  <option value="line">Straight Line</option>
                  <option value="circle">Circular</option>
                  <option value="dash">Dashed / Segments</option>
                </select>
              </ControlGroup>
              <ControlGroup label="Variant">
                <select className={inputClasses} value={props.variant || 'default'} onChange={(e) => updateProp('variant', e.target.value)}>
                  <option value="default">Default (Accent)</option>
                  <option value="success">Success (Green)</option>
                  <option value="warning">Warning (Orange)</option>
                  <option value="danger">Danger (Red)</option>
                  <option value="info">Info (Cyan)</option>
                </select>
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Labels" icon={Type}>
            <div className="flex items-center justify-between px-1 mb-4">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
              <input type="checkbox" checked={props.showTitle !== false} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
            </div>
            {props.showTitle !== false && (
              <ControlGroup label="Title">
                <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
              </ControlGroup>
            )}
            <div className="flex items-center justify-between px-1 mt-4 mb-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
              <input type="checkbox" checked={props.showDescription !== false} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
            </div>
            {props.showDescription !== false && (
              <ControlGroup label="Description">
                <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
              </ControlGroup>
            )}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show %</span>
                <input type="checkbox" checked={props.showPercentage !== false} onChange={(e) => updateProp('showPercentage', e.target.checked)} className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Value</span>
                <input type="checkbox" checked={props.showValue !== false} onChange={(e) => updateProp('showValue', e.target.checked)} className="rounded" />
              </div>
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Bar Appearance" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Thickness">
              <input type="text" className={inputClasses} value={props.thickness || '12px'} onChange={(e) => updateProp('thickness', e.target.value)} placeholder="e.g. 12px" />
            </ControlGroup>
            <ControlGroup label="Progress Color">
              <div className="flex gap-2">
                <input type="color" value={props.progressColor || '#3b82f6'} onChange={(e) => updateProp('progressColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.progressColor || ''} onChange={(e) => updateProp('progressColor', e.target.value)} className={inputClasses} placeholder="#3b82f6" />
              </div>
            </ControlGroup>
            <ControlGroup label="Track Bg">
              <div className="flex gap-2">
                <input type="color" value={props.barBackgroundColor || '#f3f4f6'} onChange={(e) => updateProp('barBackgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.barBackgroundColor || ''} onChange={(e) => updateProp('barBackgroundColor', e.target.value)} className={inputClasses} placeholder="rgba(0,0,0,0.1)" />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Effects" icon={Sparkles}>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Animated</span>
                <input type="checkbox" checked={props.animated !== false} onChange={(e) => updateProp('animated', e.target.checked)} className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400">Striped</span>
                <input type="checkbox" checked={props.striped === true} onChange={(e) => updateProp('striped', e.target.checked)} className="rounded" />
              </div>
            </div>
            <div className="mt-4">
              <ControlGroup label="Size Preset">
                <select className={inputClasses} value={props.size || 'medium'} onChange={(e) => updateProp('size', e.target.value)}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Container Style" icon={Maximize2}>
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const ProductBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  const [selectedOverrideIndex, setSelectedOverrideIndex] = React.useState<number>(0);

  const updateOverride = (index: number, field: string, value: any) => {
    const currentOverrides = props.overrides || {};
    const itemOverrides = currentOverrides[index] || {};

    const newOverrides = {
      ...currentOverrides,
      [index]: {
        ...itemOverrides,
        [field]: value
      }
    };
    updateProp('overrides', newOverrides);
  };

  const getOverride = (field: string) => {
    return props.overrides?.[selectedOverrideIndex]?.[field] || '';
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Source" icon={Link2} defaultOpen={true}>
            <ControlGroup label="Type">
              <select className={inputClasses} value={props.source || 'manual'} onChange={(e) => updateProp('source', e.target.value)}>
                <option value="manual">Manual Input</option>
                <option value="api">External API</option>
              </select>
            </ControlGroup>
            {props.source === 'api' && (
              <div className="space-y-3 mt-4 pt-4 border-t border-[#3e444b]">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2 mb-2">
                  <p className="text-[10px] text-blue-200">
                    Fetch product data from an external JSON API. The block will display the first item found.
                  </p>
                </div>
                <ControlGroup label="API URL">
                  <input type="text" className={inputClasses} value={props.apiUrl || ''} onChange={(e) => updateProp('apiUrl', e.target.value)} placeholder="https://dummyjson.com/products/1" />
                </ControlGroup>
                <ControlGroup label="Data Key">
                  <input type="text" className={inputClasses} value={props.apiDataPath || ''} onChange={(e) => updateProp('apiDataPath', e.target.value)} placeholder="Leave empty if root is object" />
                </ControlGroup>

                <div className="pt-2 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Field Key Mapping</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500">Title</label>
                      <input type="text" className={inputClasses} value={props.apiMapping?.title || ''} onChange={(e) => updateProp('apiMapping', { ...props.apiMapping, title: e.target.value })} placeholder="e.g. title" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500">Price</label>
                      <input type="text" className={inputClasses} value={props.apiMapping?.price || ''} onChange={(e) => updateProp('apiMapping', { ...props.apiMapping, price: e.target.value })} placeholder="e.g. price" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500">Image</label>
                      <input type="text" className={inputClasses} value={props.apiMapping?.image || ''} onChange={(e) => updateProp('apiMapping', { ...props.apiMapping, image: e.target.value })} placeholder="e.g. thumbnail" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500">Desc</label>
                      <input type="text" className={inputClasses} value={props.apiMapping?.description || ''} onChange={(e) => updateProp('apiMapping', { ...props.apiMapping, description: e.target.value })} placeholder="e.g. description" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {props.source === 'api' && (
              <PropertySection title="Advanced Settings" icon={LayoutIcon} defaultOpen={false}>
                <div className="space-y-4">
                  <ControlGroup label="Layout Type">
                    <select
                      className={inputClasses}
                      value={(() => {
                        if (props.enableScroll && props.scrollDirection === 'horizontal') return 'carousel';
                        if (props.enableScroll && props.scrollDirection === 'vertical') return 'list';
                        return props.displayMode === 'single' ? 'single' : 'grid';
                      })()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'single') {
                          updateBlock(block.id, { props: { ...props, displayMode: 'single', enableScroll: false } });
                        } else if (val === 'grid') {
                          updateBlock(block.id, { props: { ...props, displayMode: 'grid', enableScroll: false } });
                        } else if (val === 'carousel') {
                          updateBlock(block.id, { props: { ...props, displayMode: 'grid', enableScroll: true, scrollDirection: 'horizontal' } });
                        } else if (val === 'list') {
                          updateBlock(block.id, { props: { ...props, displayMode: 'grid', enableScroll: true, scrollDirection: 'vertical', gridColumns: 1 } });
                        }
                      }}
                    >
                      <option value="grid">Grid (Responsive)</option>
                      <option value="single">Single Item</option>
                      <option value="carousel">Carousel (Scroll Horizontal)</option>
                      <option value="list">List (Scroll Vertical)</option>
                    </select>
                  </ControlGroup>

                  {/* Dynamic Settings based on Layout Type */}
                  {props.displayMode === 'grid' && (
                    <>
                      <ControlGroup label="Items Limit">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          className={inputClasses}
                          value={props.itemsLimit === undefined ? '' : props.itemsLimit}
                          placeholder="6"
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (isNaN(val)) updateProp('itemsLimit', undefined);
                            else updateProp('itemsLimit', val);
                          }}
                        />
                      </ControlGroup>

                      <ControlGroup label="Card Layout">
                        <select className={inputClasses} value={props.layout || 'vertical'} onChange={(e) => updateProp('layout', e.target.value)}>
                          <option value="vertical">Vertical (Standard)</option>
                          <option value="horizontal">Horizontal (Side-by-Side)</option>
                        </select>
                      </ControlGroup>

                      {/* Grid Specific */}
                      {!props.enableScroll && (
                        <div className="space-y-3 pt-2">
                          <ControlGroup label="Grid Columns (Desktop)">
                            <input
                              type="range" min="1" max="6" step="1"
                              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              value={props.gridColumns || 3}
                              onChange={(e) => updateProp('gridColumns', parseInt(e.target.value))}
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                              <span>1</span><span>{props.gridColumns || 3}</span><span>6</span>
                            </div>
                          </ControlGroup>
                          <ControlGroup label="Grid Columns (Tablet)">
                            <input
                              type="range" min="1" max="4" step="1"
                              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              value={props.gridColumnsTablet || 2}
                              onChange={(e) => updateProp('gridColumnsTablet', parseInt(e.target.value))}
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                              <span>1</span><span>{props.gridColumnsTablet || 2}</span><span>4</span>
                            </div>
                          </ControlGroup>
                          <ControlGroup label="Grid Columns (Mobile)">
                            <input
                              type="range" min="1" max="3" step="1"
                              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              value={props.gridColumnsMobile || 1}
                              onChange={(e) => updateProp('gridColumnsMobile', parseInt(e.target.value))}
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                              <span>1</span><span>{props.gridColumnsMobile || 1}</span><span>3</span>
                            </div>
                          </ControlGroup>
                          <ControlGroup label="Gap">
                            <UnitControl value={props.gap || '1rem'} onChange={(v) => updateProp('gap', v)} />
                          </ControlGroup>
                        </div>
                      )}

                      {/* Carousel Specific */}
                      {props.enableScroll && props.scrollDirection === 'horizontal' && (
                        <div className="space-y-3 pt-2">
                          <ControlGroup label="Card Width">
                            <UnitControl value={props.cardWidth || '300px'} onChange={(v) => updateProp('cardWidth', v)} placeholder="300px" />
                          </ControlGroup>
                          <ControlGroup label="Gap">
                            <UnitControl value={props.gap || '1rem'} onChange={(v) => updateProp('gap', v)} />
                          </ControlGroup>
                        </div>
                      )}

                      {/* List Specific */}
                      {props.enableScroll && props.scrollDirection === 'vertical' && (
                        <div className="space-y-3 pt-2">
                          <ControlGroup label="Max Height">
                            <UnitControl value={props.containerHeight || '400px'} onChange={(v) => updateProp('containerHeight', v)} />
                          </ControlGroup>
                          <ControlGroup label="Gap">
                            <UnitControl value={props.gap || '1rem'} onChange={(v) => updateProp('gap', v)} />
                          </ControlGroup>
                          <ControlGroup label="Card Width">
                            <UnitControl value={props.cardWidth || '100%'} onChange={(v) => updateProp('cardWidth', v)} placeholder="100%" />
                          </ControlGroup>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </PropertySection>
            )}
          </PropertySection>

          {/* API OVERRIDES SECTION */}
          {props.source === 'api' && (
            <PropertySection title="Individual Item Editing" icon={Link2} defaultOpen={false}>
              <div className="space-y-4 p-1">
                <div className="bg-gray-800 p-2 rounded text-xs text-gray-400 mb-2">
                  Select an item by index to override its specific details given from the API.
                </div>

                <ControlGroup label="Select Item">
                  <select
                    className={inputClasses}
                    value={selectedOverrideIndex}
                    onChange={(e) => setSelectedOverrideIndex(parseInt(e.target.value))}
                  >
                    {[...Array(props.itemsLimit || 6)].map((_, i) => (
                      <option key={i} value={i}>Item {i + 1}</option>
                    ))}
                  </select>
                </ControlGroup>

                <div className="border-t border-gray-700 pt-3 mt-3 space-y-3">
                  <div className="font-bold text-xs text-blue-400 mb-2">Overrides for Item {selectedOverrideIndex + 1}</div>

                  <ControlGroup label="Override Title">
                    <input type="text" className={inputClasses} placeholder="(Keep Value)" value={getOverride('title')} onChange={(e) => updateOverride(selectedOverrideIndex, 'title', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Override Price">
                    <input type="text" className={inputClasses} placeholder="(Keep Value)" value={getOverride('price')} onChange={(e) => updateOverride(selectedOverrideIndex, 'price', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Override Desc">
                    <textarea rows={2} className={inputClasses} placeholder="(Keep Value)" value={getOverride('description')} onChange={(e) => updateOverride(selectedOverrideIndex, 'description', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Override Image">
                    <input type="text" className={inputClasses} placeholder="https://..." value={getOverride('imageUrl')} onChange={(e) => updateOverride(selectedOverrideIndex, 'imageUrl', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Btn Text">
                    <input type="text" className={inputClasses} placeholder="(Keep Value)" value={getOverride('buttonText')} onChange={(e) => updateOverride(selectedOverrideIndex, 'buttonText', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Btn URL">
                    <input type="text" className={inputClasses} placeholder="https://..." value={getOverride('buttonUrl')} onChange={(e) => updateOverride(selectedOverrideIndex, 'buttonUrl', e.target.value)} />
                  </ControlGroup>
                </div>
              </div>
            </PropertySection>
          )}

          {props.source !== 'api' && (
            <>
              <PropertySection title="Basic Info" icon={Type} defaultOpen={true}>
                <div className="space-y-4">
                  <ControlGroup label="Title">
                    <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Description">
                    <textarea className={`${inputClasses} min-h-[60px] resize-none`} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} />
                  </ControlGroup>
                </div>
              </PropertySection>
            </>
          )}


          {props.source !== 'api' && (
            <>
              <PropertySection title="Pricing" icon={Palette}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <ControlGroup label="Price">
                      <input type="text" className={inputClasses} value={props.price || ''} onChange={(e) => updateProp('price', e.target.value)} />
                    </ControlGroup>
                    <ControlGroup label="Curr">
                      <input type="text" className={inputClasses} value={props.currency || '$'} onChange={(e) => updateProp('currency', e.target.value)} />
                    </ControlGroup>
                  </div>
                  <ControlGroup label="Compare at">
                    <input type="text" className={inputClasses} value={props.originalPrice || ''} onChange={(e) => updateProp('originalPrice', e.target.value)} />
                  </ControlGroup>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Show Compare</span>
                    <input type="checkbox" checked={props.showOriginalPrice !== false} onChange={(e) => updateProp('showOriginalPrice', e.target.checked)} className="rounded" />
                  </div>
                </div>
              </PropertySection>

              <PropertySection title="Media & Layout" icon={LayoutIcon}>
                <div className="space-y-4">
                  <ControlGroup label="Image URL">
                    <input type="text" className={inputClasses} value={props.imageUrl || ''} onChange={(e) => updateProp('imageUrl', e.target.value)} />
                  </ControlGroup>
                  <ControlGroup label="Layout">
                    <select className={inputClasses} value={props.layout || 'vertical'} onChange={(e) => updateProp('layout', e.target.value)}>
                      <option value="vertical">Vertical Card</option>
                      <option value="horizontal">Horizontal Row</option>
                    </select>
                  </ControlGroup>
                  <ControlGroup label="Badge">
                    <input type="text" className={inputClasses} value={props.badge || ''} onChange={(e) => updateProp('badge', e.target.value)} placeholder="e.g. NEW" />
                  </ControlGroup>
                  <ControlGroup label="Discount Tag">
                    <input type="text" className={inputClasses} value={props.discount || ''} onChange={(e) => updateProp('discount', e.target.value)} placeholder="e.g. 20% OFF" />
                  </ControlGroup>
                </div>
              </PropertySection>
            </>
          )}

          <PropertySection title="Action Button" icon={MousePointer2}>
            <div className="space-y-4">
              <ControlGroup label="Text">
                <input type="text" className={inputClasses} value={props.buttonText || ''} onChange={(e) => updateProp('buttonText', e.target.value)} />
              </ControlGroup>
              <ControlGroup label="Link">
                <input type="text" className={inputClasses} value={props.buttonUrl || ''} onChange={(e) => updateProp('buttonUrl', e.target.value)} />
              </ControlGroup>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Button</span>
                <input type="checkbox" checked={props.showButton !== false} onChange={(e) => updateProp('showButton', e.target.checked)} className="rounded" />
              </div>
              <ControlGroup label="Button Width">
                <select className={inputClasses} value={props.buttonWidth || 'full'} onChange={(e) => updateProp('buttonWidth', e.target.value)}>
                  <option value="full">Full Width</option>
                  <option value="auto">Auto (Text Width)</option>
                </select>
              </ControlGroup>
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Colors" icon={Palette} defaultOpen={true}>
            <div className="space-y-3">
              <ControlGroup label="Price Color">
                <div className="flex gap-2">
                  <input type="color" value={props.priceColor || '#10b981'} onChange={(e) => updateProp('priceColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.priceColor || ''} onChange={(e) => updateProp('priceColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
              <ControlGroup label="Compare Color">
                <div className="flex gap-2">
                  <input type="color" value={props.originalPriceColor || '#9ca3af'} onChange={(e) => updateProp('originalPriceColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.originalPriceColor || ''} onChange={(e) => updateProp('originalPriceColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
              <ControlGroup label="Badge Bg">
                <div className="flex gap-2">
                  <input type="color" value={props.badgeBgColor || '#ef4444'} onChange={(e) => updateProp('badgeBgColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.badgeBgColor || ''} onChange={(e) => updateProp('badgeBgColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
              <ControlGroup label="Button Color">
                <div className="flex gap-2">
                  <input type="color" value={props.buttonColor || '#3b82f6'} onChange={(e) => updateProp('buttonColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.buttonColor || ''} onChange={(e) => updateProp('buttonColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Container Style" icon={Maximize2}>
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};

export const PromoCodeBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Offer Details" icon={Type} defaultOpen={true}>
            <ControlGroup label="Title">
              <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Description">
              <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Code Settings" icon={Settings}>
            <ControlGroup label="Promo Code">
              <input type="text" className={`${inputClasses} font-mono font-bold tracking-widest text-center uppercase`} value={props.code || 'SAVE20'} onChange={(e) => updateProp('code', e.target.value)} />
            </ControlGroup>
            <ControlGroup label="Discount Label">
              <input type="text" className={inputClasses} value={props.discount || '20% OFF'} onChange={(e) => updateProp('discount', e.target.value)} placeholder="e.g. 50% OFF" />
            </ControlGroup>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Discount Badge</span>
              <input type="checkbox" checked={props.showDiscount !== false} onChange={(e) => updateProp('showDiscount', e.target.checked)} className="rounded" />
            </div>

            <div className="mt-4 pt-4 border-t border-[#3e444b]"></div>

            <ControlGroup label="Valid Until">
              <input type="date" className={inputClasses} value={props.validUntil || ''} onChange={(e) => updateProp('validUntil', e.target.value)} />
            </ControlGroup>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Expiry</span>
              <input type="checkbox" checked={props.showValidUntil !== false} onChange={(e) => updateProp('showValidUntil', e.target.checked)} className="rounded" />
            </div>
          </PropertySection>

          <PropertySection title="Actions" icon={Pointer}>
            <ControlGroup label="Button Text">
              <input type="text" className={inputClasses} value={props.buttonText || 'Copy Code'} onChange={(e) => updateProp('buttonText', e.target.value)} />
            </ControlGroup>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Enable Copy Button</span>
              <input type="checkbox" checked={props.showCopyButton !== false} onChange={(e) => updateProp('showCopyButton', e.target.checked)} className="rounded" />
            </div>

            <div className="mt-4 pt-4 border-t border-[#3e444b]"></div>

            <ControlGroup label="Effect">
              <select
                className={inputClasses}
                value={props.animation || 'none'}
                onChange={(e) => updateProp('animation', e.target.value)}
              >
                <option value="none">None</option>
                <option value="pulse">Pulse</option>
                <option value="bounce">Bounce</option>
                <option value="shake">Shake</option>
                <option value="wobble">Wobble</option>
              </select>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Colors" icon={Palette} defaultOpen={true}>
            <BackgroundControl props={props} onChange={updateProp} />
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#1e293b'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Button Color">
              <div className="flex gap-2">
                <input type="color" value={props.buttonColor || '#3b82f6'} onChange={(e) => updateProp('buttonColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.buttonColor || ''} onChange={(e) => updateProp('buttonColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Code Styling" icon={Code}>
            <ControlGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={props.codeBackgroundColor || '#1e293b'} onChange={(e) => updateProp('codeBackgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.codeBackgroundColor || ''} onChange={(e) => updateProp('codeBackgroundColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.codeTextColor || '#ffffff'} onChange={(e) => updateProp('codeTextColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.codeTextColor || ''} onChange={(e) => updateProp('codeTextColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Border Style">
              <select className={inputClasses} value={props.borderStyle || 'dashed'} onChange={(e) => updateProp('borderStyle', e.target.value)}>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="none">None</option>
              </select>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const PriceBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(props.features || [])];
    newFeatures[index] = value;
    updateProp('features', newFeatures);
  };

  const addFeature = () => {
    updateProp('features', [...(props.features || []), 'New Feature']);
  };

  const removeFeature = (index: number) => {
    updateProp('features', (props.features || []).filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Pricing Detail" icon={Palette} defaultOpen={true}>
            <div className="space-y-4">
              <ControlGroup label="Plan Name">
                <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} />
              </ControlGroup>
              <ControlGroup label="Description">
                <textarea className={`${inputClasses} min-h-[60px] resize-none`} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} />
              </ControlGroup>
              <div className="grid grid-cols-2 gap-2">
                <ControlGroup label="Price">
                  <input type="text" className={inputClasses} value={props.price || ''} onChange={(e) => updateProp('price', e.target.value)} />
                </ControlGroup>
                <ControlGroup label="Period">
                  <input type="text" className={inputClasses} value={props.period || '/mo'} onChange={(e) => updateProp('period', e.target.value)} />
                </ControlGroup>
              </div>
              <ControlGroup label="Compare at">
                <input type="text" className={inputClasses} value={props.originalPrice || ''} onChange={(e) => updateProp('originalPrice', e.target.value)} />
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Features List" icon={List}>
            <div className="space-y-2">
              {(props.features || []).map((feature: string, index: number) => (
                <div key={index} className="flex gap-2 group/item">
                  <input
                    type="text"
                    className={inputClasses}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="p-1.5 bg-[#1a1d21] hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={addFeature}
                className="w-full py-1.5 px-3 bg-[#2d3237] hover:bg-[#3e444b] text-[10px] text-gray-300 font-bold uppercase tracking-wider rounded border border-[#3e444b] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3 text-blue-500" />
                Add Feature
              </button>
            </div>
          </PropertySection>

          <PropertySection title="Layout & Tag" icon={LayoutIcon}>
            <div className="space-y-4">
              <ControlGroup label="Layout">
                <select className={inputClasses} value={props.layout || 'vertical'} onChange={(e) => updateProp('layout', e.target.value)}>
                  <option value="vertical">Vertical</option>
                  <option value="horizontal">Horizontal</option>
                </select>
              </ControlGroup>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Popular Block</span>
                <input type="checkbox" checked={props.popular === true} onChange={(e) => updateProp('popular', e.target.checked)} className="rounded" />
              </div>
              {props.popular && (
                <ControlGroup label="Tag Text">
                  <input type="text" className={inputClasses} value={props.popularText || ''} onChange={(e) => updateProp('popularText', e.target.value)} />
                </ControlGroup>
              )}
            </div>
          </PropertySection>

          <PropertySection title="Action Button" icon={MousePointer2}>
            <div className="space-y-4">
              <ControlGroup label="Text">
                <input type="text" className={inputClasses} value={props.buttonText || ''} onChange={(e) => updateProp('buttonText', e.target.value)} />
              </ControlGroup>
              <ControlGroup label="Link">
                <input type="text" className={inputClasses} value={props.buttonUrl || ''} onChange={(e) => updateProp('buttonUrl', e.target.value)} />
              </ControlGroup>
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Colors" icon={Palette} defaultOpen={true}>
            <div className="space-y-3">
              <ControlGroup label="Accent Color">
                <div className="flex gap-2">
                  <input type="color" value={props.accentColor || '#3b82f6'} onChange={(e) => updateProp('accentColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.accentColor || ''} onChange={(e) => updateProp('accentColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
              <ControlGroup label="Tag Color">
                <div className="flex gap-2">
                  <input type="color" value={props.popularColor || '#ef4444'} onChange={(e) => updateProp('popularColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.popularColor || ''} onChange={(e) => updateProp('popularColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
              <ControlGroup label="Button Bg">
                <div className="flex gap-2">
                  <input type="color" value={props.buttonColor || '#3b82f6'} onChange={(e) => updateProp('buttonColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                  <input type="text" value={props.buttonColor || ''} onChange={(e) => updateProp('buttonColor', e.target.value)} className={inputClasses} />
                </div>
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Container Style" icon={Maximize2}>
            <BackgroundControl props={props} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const TestimonialBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | any, v?: any) => {
    if (typeof k === 'object' && k !== null) {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };
  const openAssetModal = useAssetStore((state) => state.openModal);

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Content" icon={Type} defaultOpen={true}>
            <div className="space-y-4">
              <ControlGroup label="Quote">
                <textarea className={inputClasses} value={props.quote || ''} onChange={(e) => updateProp('quote', e.target.value)} rows={4} placeholder="Enter testimonial text..." />
              </ControlGroup>
              <ControlGroup label="Author">
                <input type="text" className={inputClasses} value={props.author || ''} onChange={(e) => updateProp('author', e.target.value)} placeholder="John Doe" />
              </ControlGroup>
              <ControlGroup label="Role">
                <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} placeholder="CEO" />
              </ControlGroup>
              <ControlGroup label="Company">
                <input type="text" className={inputClasses} value={props.company || ''} onChange={(e) => updateProp('company', e.target.value)} placeholder="Acme Inc." />
              </ControlGroup>
              <ControlGroup label="Rating">
                <div className="flex items-center gap-2">
                  <input type="range" min="0" max="5" step="0.5" className="flex-1" value={props.rating || 5} onChange={(e) => updateProp('rating', Number(e.target.value))} />
                  <span className="text-xs w-8 text-right">{props.rating || 5}</span>
                </div>
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Layout & Alignment" icon={LayoutIcon}>
            {/* <ControlGroup label="Layout">
              <select className={inputClasses} value={props.layout || 'vertical'} onChange={(e) => updateProp('layout', e.target.value)}>
                <option value="vertical">Vertical (Stack)</option>
                <option value="horizontal">Horizontal (Side-by-side)</option>
              </select>
            </ControlGroup> */}
            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded border border-[#3e444b] overflow-hidden">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateProp('alignment', option.value)}
                    className={`flex-1 p-1.5 flex justify-center hover:bg-[#2d3237] transition-colors ${(props.alignment || 'left') === option.value ? 'bg-[#3b82f6] text-white' : 'text-gray-400'}`}
                    title={option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                  >
                    <option.icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Avatar" icon={ImageIcon}>
            <div className="bg-[#1a1d21] p-3 rounded border border-[#3e444b] text-center">
              {props.avatarUrl ? (
                <div className="relative group/avatar inline-block">
                  <img src={props.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#3e444b]" />
                  <button onClick={() => updateProp('avatarUrl', '')} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button onClick={() => openAssetModal((url) => updateProp('avatarUrl', url))} className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300">
                  + Upload Photo
                </button>
              )}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <div className="space-y-4 p-4">
          <TypographyGroup block={block} onChange={updateProp} />
          <DimensionsGroup block={block} onChange={updateProp} />
          <BackgroundGroup block={block} onChange={updateProp} />
          <BorderGroup block={block} onChange={updateProp} />
          <EffectsGroup block={block} onChange={updateProp} />
        </div>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const NavbarBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };
  const openAssetModal = useAssetStore((state) => state.openModal);
  const blocks = useCanvasStore((state) => state.blocks);

  // Helper to find all blocks with htmlId
  const getAnchorTargets = (blocks: Block[]): { id: string; htmlId: string; type: string }[] => {
    let targets: { id: string; htmlId: string; type: string }[] = [];
    blocks.forEach((b) => {
      if (b.props.htmlId) {
        targets.push({ id: b.id, htmlId: b.props.htmlId, type: b.type });
      }
      if (b.children) {
        targets = [...targets, ...getAnchorTargets(b.children)];
      }
    });
    return targets;
  };

  const anchorTargets = getAnchorTargets(blocks);

  const handleLinkChange = (index: number, key: string, value: any) => {
    const newLinks = [...(props.links || [])];
    newLinks[index] = { ...newLinks[index], [key]: value };
    updateProp('links', newLinks);
  };

  const addLink = () => {
    updateProp('links', [...(props.links || []), { text: 'New Link', url: '#' }]);
  };

  const removeLink = (index: number) => {
    updateProp('links', (props.links || []).filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Branding" icon={Sparkles} defaultOpen={true}>
            <ControlGroup label="Brand Text">
              <input type="text" className={inputClasses} value={props.brand || ''} onChange={(e) => updateProp('brand', e.target.value)} />
            </ControlGroup>
            {/* ... brand image ... */}
            <div className="bg-[#1a1d21] p-3 rounded border border-[#3e444b] text-center mt-2">
              {props.brandImage ? (
                <div className="relative group/logo inline-block">
                  <img src={props.brandImage} alt="Logo" className="h-10 w-auto mx-auto object-contain mb-2" />
                  <button onClick={() => updateProp('brandImage', '')} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/logo:opacity-100 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button onClick={() => openAssetModal((url) => updateProp('brandImage', url))} className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300">
                  + Upload Logo
                </button>
              )}
            </div>
            {props.brandImage && (
              <ControlGroup label="Logo Height">
                <UnitControl value={props.logoHeight} onChange={(v) => updateProp('logoHeight', v)} placeholder="2rem" />
              </ControlGroup>
            )}
          </PropertySection>

          <PropertySection title="Menu Links" icon={List}>
            <div className="space-y-3">
              {(props.links || []).map((link: any, index: number) => (
                <div key={index} className="bg-[#1a1d21] p-2 rounded border border-[#3e444b] space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className={`${inputClasses} flex-1 font-bold`}
                      value={link.text || ''}
                      onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                      placeholder="Link Text"
                    />
                    <button onClick={() => removeLink(index)} className="text-gray-500 hover:text-red-500 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      className={inputClasses}
                      value={link.url || ''}
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                      placeholder="https:// or #section-id"
                      list={`anchors-${index}`}
                    />
                    <datalist id={`anchors-${index}`}>
                      {anchorTargets.map((target) => (
                        <option key={target.id} value={`#${target.htmlId}`}>
                          Scroll to: {target.type} (#{target.htmlId})
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={!!link.newTab} onChange={(e) => handleLinkChange(index, 'newTab', e.target.checked)} className="rounded bg-[#2d3237]" />
                      New Tab
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={!!link.active} onChange={(e) => handleLinkChange(index, 'active', e.target.checked)} className="rounded bg-[#2d3237]" />
                      Active
                    </label>
                  </div>
                </div>
              ))}
              <button
                onClick={addLink}
                className="w-full py-1.5 px-3 bg-[#2d3237] hover:bg-[#3e444b] text-[10px] text-gray-300 font-bold uppercase tracking-wider rounded border border-[#3e444b] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3 text-blue-500" />
                Add Link
              </button>
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Layout" icon={LayoutIcon} defaultOpen={true}>
            <ControlGroup label="Link Spacing">
              <UnitControl value={props.linkSpacing} onChange={(v) => updateProp('linkSpacing', v)} placeholder="2rem" />
            </ControlGroup>
            <ControlGroup label="Padding">
              <UnitControl value={props.padding} onChange={(v) => updateProp('padding', v)} placeholder="1rem" />
            </ControlGroup>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Sticky Header</span>
                <input type="checkbox" checked={!!props.sticky} onChange={(e) => updateProp('sticky', e.target.checked)} className="rounded" />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Transparent Bg</span>
                <input type="checkbox" checked={!!props.transparent} onChange={(e) => updateProp('transparent', e.target.checked)} className="rounded" />
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Mobile Menu</span>
                <input type="checkbox" checked={props.mobileMenu !== false} onChange={(e) => updateProp('mobileMenu', e.target.checked)} className="rounded" />
              </div>
            </div>
          </PropertySection>

          <PropertySection title="Colors" icon={Palette}>
            <ControlGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={props.backgroundColor || '#ffffff'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.backgroundColor || ''} onChange={(e) => updateProp('backgroundColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#333333'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Hover Color">
              <div className="flex gap-2">
                <input type="color" value={props.hoverColor || '#3b82f6'} onChange={(e) => updateProp('hoverColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.hoverColor || ''} onChange={(e) => updateProp('hoverColor', e.target.value)} className={inputClasses} placeholder="Optional" />
              </div>
            </ControlGroup>
            <ControlGroup label="Active Color">
              <div className="flex gap-2">
                <input type="color" value={props.activeColor || '#3b82f6'} onChange={(e) => updateProp('activeColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.activeColor || ''} onChange={(e) => updateProp('activeColor', e.target.value)} className={inputClasses} placeholder="Optional" />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Typography" icon={Type}>
            <ControlGroup label="Font Size">
              <UnitControl value={props.fontSize} onChange={(v) => updateProp('fontSize', v)} placeholder="1rem" />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container" icon={Maximize2}>
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const CardBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };
  const openAssetModal = useAssetStore((state) => state.openModal);

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Image" icon={ImageIcon} defaultOpen={true}>
            <div className="bg-[#1a1d21] p-3 rounded border border-[#3e444b] text-center mb-3">
              {props.image ? (
                <div className="relative group/image inline-block">
                  <img src={props.image} alt="Card" className="h-24 w-auto mx-auto object-cover mb-2 border border-[#3e444b] rounded" />
                  <button onClick={() => updateProp('image', '')} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/image:opacity-100 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button onClick={() => openAssetModal((url) => updateProp('image', url))} className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300">
                  + Upload Image
                </button>
              )}
            </div>
            {props.image && (
              <ControlGroup label="Alt Text">
                <input type="text" className={inputClasses} value={props.imageAlt || ''} onChange={(e) => updateProp('imageAlt', e.target.value)} placeholder="Image description" />
              </ControlGroup>
            )}
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Image</span>
              <input type="checkbox" checked={props.showImage !== false} onChange={(e) => updateProp('showImage', e.target.checked)} className="rounded" />
            </div>
            {props.showImage !== false && props.image && (
              <>
                <ControlGroup label="Height">
                  <input
                    type="text"
                    className={inputClasses}
                    value={props.imageHeight || '200px'}
                    onChange={(e) => updateProp('imageHeight', e.target.value)}
                    placeholder="200px, 100%, auto"
                  />
                </ControlGroup>
                <ControlGroup label="Fit">
                  <select
                    className={inputClasses}
                    value={props.imageObjectFit || 'cover'}
                    onChange={(e) => updateProp('imageObjectFit', e.target.value)}
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="fill">Fill</option>
                    <option value="none">None</option>
                    <option value="scale-down">Scale Down</option>
                  </select>
                </ControlGroup>
              </>
            )}
          </PropertySection>

          <PropertySection title="Card Content" icon={Type}>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
                <input type="checkbox" checked={props.showTitle !== false} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
              </div>
              {props.showTitle !== false && (
                <ControlGroup label="Title">
                  <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} placeholder="Card Title" />
                </ControlGroup>
              )}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Show Content</span>
                <input type="checkbox" checked={props.showContent !== false} onChange={(e) => updateProp('showContent', e.target.checked)} className="rounded" />
              </div>
              {props.showContent !== false && (
                <ControlGroup label="Body">
                  <textarea className={inputClasses} value={props.content || ''} onChange={(e) => updateProp('content', e.target.value)} rows={4} placeholder="Card content..." />
                </ControlGroup>
              )}
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Layout" icon={LayoutIcon} defaultOpen={true}>
            <ControlGroup label="Alignment">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => updateProp('textAlign', align)}
                    className={`flex-1 py-1 px-2 rounded-sm text-[10px] uppercase font-bold transition-all ${(props.textAlign || 'left') === align ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </ControlGroup>
            {props.showImage !== false && (
              <ControlGroup label="Img Position">
                <select className={inputClasses} value={props.imagePosition || 'top'} onChange={(e) => updateProp('imagePosition', e.target.value)}>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </ControlGroup>
            )}
          </PropertySection>

          <PropertySection title="Colors" icon={Palette}>
            <ControlGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={props.backgroundColor || '#ffffff'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.backgroundColor || ''} onChange={(e) => updateProp('backgroundColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#333333'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const BadgeBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Content" icon={Type} defaultOpen={true}>
            <ControlGroup label="Badge Text">
              <input type="text" className={inputClasses} value={props.text || 'Badge'} onChange={(e) => updateProp('text', e.target.value)} />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Style" icon={LayoutIcon}>
            <ControlGroup label="Variant">
              <select className={inputClasses} value={props.variant || 'solid'} onChange={(e) => updateProp('variant', e.target.value)}>
                <option value="solid">Solid</option>
                <option value="outline">Outline</option>
                <option value="soft">Soft</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Size">
              <select className={inputClasses} value={props.size || 'medium'} onChange={(e) => updateProp('size', e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Custom Colors" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={props.backgroundColor || '#ffffff'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.backgroundColor || ''} onChange={(e) => updateProp('backgroundColor', e.target.value)} className={inputClasses} placeholder="Override variant" />
              </div>
            </ControlGroup>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#333333'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} placeholder="Override variant" />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Typography" icon={Type}>
            <ControlGroup label="Font Size">
              <UnitControl value={props.fontSize} onChange={(v) => updateProp('fontSize', v)} placeholder="Default" />
            </ControlGroup>
            <ControlGroup label="Font Weight">
              <select className={inputClasses} value={props.fontWeight || ''} onChange={(e) => updateProp('fontWeight', e.target.value)}>
                <option value="">Default</option>
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="bold">Bold</option>
              </select>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const AlertBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Alert Content" icon={Type} defaultOpen={true}>
            <ControlGroup label="Type">
              <select className={inputClasses} value={props.type || 'info'} onChange={(e) => updateProp('type', e.target.value)}>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Message">
              <textarea className={inputClasses} value={props.text || ''} onChange={(e) => updateProp('text', e.target.value)} rows={3} />
            </ControlGroup>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Icon</span>
              <input type="checkbox" checked={props.showIcon !== false} onChange={(e) => updateProp('showIcon', e.target.checked)} className="rounded" />
            </div>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Dismissible</span>
              <input type="checkbox" checked={props.dismissible !== false} onChange={(e) => updateProp('dismissible', e.target.checked)} className="rounded" />
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Custom Style" icon={Palette} defaultOpen={true}>
            <BackgroundControl props={props} onChange={updateProp} />
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#333333'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} placeholder="Override variant" />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const ProgressBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Progress Info" icon={Type} defaultOpen={true}>
            <ControlGroup label="Value">
              <div className="flex items-center gap-2">
                <input type="range" min="0" max={props.max || 100} value={props.value || 0} onChange={(e) => updateProp('value', parseInt(e.target.value))} className="flex-1" />
                <span className="text-xs w-8 text-right">{props.value || 0}</span>
              </div>
            </ControlGroup>
            <ControlGroup label="Max Value">
              <input type="number" className={inputClasses} value={props.max || 100} onChange={(e) => updateProp('max', parseInt(e.target.value))} />
            </ControlGroup>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Title</span>
              <input type="checkbox" checked={props.showTitle !== false} onChange={(e) => updateProp('showTitle', e.target.checked)} className="rounded" />
            </div>
            {props.showTitle !== false && (
              <ControlGroup label="Title">
                <input type="text" className={inputClasses} value={props.title || props.label || 'Progress'} onChange={(e) => updateProp('title', e.target.value)} />
              </ControlGroup>
            )}
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Description</span>
              <input type="checkbox" checked={props.showDescription === true} onChange={(e) => updateProp('showDescription', e.target.checked)} className="rounded" />
            </div>
            {props.showDescription && (
              <ControlGroup label="Description">
                <textarea className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} rows={2} />
              </ControlGroup>
            )}
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Percentage</span>
              <input type="checkbox" checked={props.showPercentage !== false} onChange={(e) => updateProp('showPercentage', e.target.checked)} className="rounded" />
            </div>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show X/Y Value</span>
              <input type="checkbox" checked={props.showValue === true} onChange={(e) => updateProp('showValue', e.target.checked)} className="rounded" />
            </div>
          </PropertySection>

          <PropertySection title="Style" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Type">
              <select className={inputClasses} value={props.style || 'line'} onChange={(e) => updateProp('style', e.target.value)}>
                <option value="line">Linear Bar</option>
                <option value="circle">Circular</option>
              </select>
            </ControlGroup>

            {(props.style === 'line' || !props.style) && (
              <>
                <ControlGroup label="Size">
                  <select className={inputClasses} value={props.size || 'medium'} onChange={(e) => updateProp('size', e.target.value)}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </ControlGroup>
                <div className="flex items-center justify-between px-1 mt-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Striped</span>
                  <input type="checkbox" checked={props.striped === true} onChange={(e) => updateProp('striped', e.target.checked)} className="rounded" />
                </div>
                <div className="flex items-center justify-between px-1 mt-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Animated</span>
                  <input type="checkbox" checked={props.animated !== false} onChange={(e) => updateProp('animated', e.target.checked)} className="rounded" />
                </div>
              </>
            )}

            <ControlGroup label="Thickness">
              <input type="text" className={inputClasses} value={props.thickness || ''} onChange={(e) => updateProp('thickness', e.target.value)} placeholder={props.style === 'circle' ? '120px' : 'Default'} />
            </ControlGroup>

            <ControlGroup label="Variant">
              <select className={inputClasses} value={props.variant || 'default'} onChange={(e) => updateProp('variant', e.target.value)}>
                <option value="default">Default (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Orange)</option>
                <option value="danger">Danger (Red)</option>
                <option value="info">Info (Blue)</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Custom Color">
              <div className="flex gap-2">
                <input type="color" value={props.progressColor || '#3b82f6'} onChange={(e) => updateProp('progressColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.progressColor || ''} onChange={(e) => updateProp('progressColor', e.target.value)} className={inputClasses} placeholder="Override variant" />
              </div>
            </ControlGroup>
            <ControlGroup label="Track Color">
              <div className="flex gap-2">
                <input type="color" value={props.barBackgroundColor || '#e9ecef'} onChange={(e) => updateProp('barBackgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.barBackgroundColor || ''} onChange={(e) => updateProp('barBackgroundColor', e.target.value)} className={inputClasses} placeholder="#e9ecef" />
              </div>
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const InvoiceBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string, v: any) => updateBlock(block.id, { props: { ...props, [k]: v } });
  const openAssetModal = useAssetStore((state) => state.openModal);

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState(JSON.stringify(props.items || [], null, 2));

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        setJsonError(null);
        updateProp('items', parsed);
      } else {
        setJsonError('Must be an array of items');
      }
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Invoice Details" icon={List} defaultOpen={true}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <ControlGroup label="Invoice #">
                  <input type="text" className={inputClasses} value={props.invoiceNumber || ''} onChange={(e) => updateProp('invoiceNumber', e.target.value)} />
                </ControlGroup>
                <ControlGroup label="Status">
                  <select className={inputClasses} value={props.status || 'draft'} onChange={(e) => updateProp('status', e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </ControlGroup>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ControlGroup label="Date">
                  <input type="date" className={inputClasses} value={props.invoiceDate || ''} onChange={(e) => updateProp('invoiceDate', e.target.value)} />
                </ControlGroup>
                <ControlGroup label="Due Date">
                  <input type="date" className={inputClasses} value={props.dueDate || ''} onChange={(e) => updateProp('dueDate', e.target.value)} />
                </ControlGroup>
              </div>
            </div>
          </PropertySection>

          <PropertySection title="Company Info" icon={Layers}>
            <div className="space-y-4">
              <div className="bg-[#1a1d21] p-3 rounded border border-[#3e444b] text-center">
                {props.companyLogo ? (
                  <div className="relative group/logo">
                    <img src={props.companyLogo} alt="Logo" className="h-12 w-auto mx-auto object-contain mb-2" />
                    <button onClick={() => updateProp('companyLogo', '')} className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/logo:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => openAssetModal((url) => updateProp('companyLogo', url))} className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300">
                    + Upload Logo
                  </button>
                )}
              </div>
              <ControlGroup label="Comp Name">
                <input type="text" className={inputClasses} value={props.companyName || ''} onChange={(e) => updateProp('companyName', e.target.value)} />
              </ControlGroup>
              <ControlGroup label="Address">
                <textarea className={inputClasses} value={props.companyAddress || ''} onChange={(e) => updateProp('companyAddress', e.target.value)} rows={3} />
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Client Info" icon={Layers}>
            <div className="space-y-4">
              <ControlGroup label="Client Name">
                <input type="text" className={inputClasses} value={props.clientName || ''} onChange={(e) => updateProp('clientName', e.target.value)} />
              </ControlGroup>
              <ControlGroup label="Address">
                <textarea className={inputClasses} value={props.clientAddress || ''} onChange={(e) => updateProp('clientAddress', e.target.value)} rows={3} />
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Items (JSON)" icon={Type}>
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 mb-1">Directly edit invoice items as JSON.</p>
              <textarea
                className={`${inputClasses} font-mono text-[10px]`}
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={10}
              />
              {jsonError && <p className="text-[10px] text-red-400">{jsonError}</p>}
            </div>
          </PropertySection>

          <PropertySection title="Financials" icon={Palette}>
            <div className="grid grid-cols-2 gap-2">
              <ControlGroup label="Currency">
                <input type="text" className={inputClasses} value={props.currency || '$'} onChange={(e) => updateProp('currency', e.target.value)} />
              </ControlGroup>
              <ControlGroup label="Tax Rate %">
                <input type="number" className={inputClasses} value={props.taxRate || 0} onChange={(e) => updateProp('taxRate', Number(e.target.value))} />
              </ControlGroup>
              <ControlGroup label="Discount">
                <input type="number" className={inputClasses} value={props.discount || 0} onChange={(e) => updateProp('discount', Number(e.target.value))} />
              </ControlGroup>
            </div>
          </PropertySection>

          <PropertySection title="Notes" icon={Type}>
            <ControlGroup label="Footer Notes">
              <textarea className={inputClasses} value={props.notes || ''} onChange={(e) => updateProp('notes', e.target.value)} rows={3} />
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Appearance" icon={Palette} defaultOpen={true}>
            <BackgroundControl props={props} onChange={updateProp} />
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#1f2937'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} placeholder="Inherit" />
              </div>
            </ControlGroup>
            <TypographyGroup block={block} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
export const CodeBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Code Content" icon={Code} defaultOpen={true}>
            <ControlGroup label="Language">
              <select
                className={inputClasses}
                value={props.language || 'html'}
                onChange={(e) => updateProp('language', e.target.value)}
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="json">JSON</option>
                <option value="python">Python</option>
                <option value="sql">SQL</option>
                <option value="text">Text</option>
              </select>
            </ControlGroup>

            <ControlGroup label="Code">
              <textarea
                className={`${inputClasses} font-mono`}
                value={props.code || ''}
                onChange={(e) => updateProp('code', e.target.value)}
                rows={10}
                placeholder="Enter your code here..."
                spellCheck={false}
              />
            </ControlGroup>

            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Show Line Numbers</span>
              <input type="checkbox" checked={props.showLineNumbers !== false} onChange={(e) => updateProp('showLineNumbers', e.target.checked)} className="rounded" />
            </div>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Wrap Lines</span>
              <input type="checkbox" checked={props.wrapLines !== false} onChange={(e) => updateProp('wrapLines', e.target.checked)} className="rounded" />
            </div>
            <div className="flex items-center justify-between px-1 mt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400">Copy Button</span>
              <input type="checkbox" checked={props.showCopyButton !== false} onChange={(e) => updateProp('showCopyButton', e.target.checked)} className="rounded" />
            </div>
          </PropertySection>

          <PropertySection title="Metadata" icon={Type}>
            <ControlGroup label="Title">
              <input type="text" className={inputClasses} value={props.title || ''} onChange={(e) => updateProp('title', e.target.value)} placeholder="File title..." />
            </ControlGroup>
            <ControlGroup label="Description">
              <input type="text" className={inputClasses} value={props.description || ''} onChange={(e) => updateProp('description', e.target.value)} placeholder="Brief description..." />
            </ControlGroup>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Style" icon={Palette} defaultOpen={true}>
            <ControlGroup label="Background">
              <div className="flex gap-2">
                <input type="color" value={props.backgroundColor || '#1f2937'} onChange={(e) => updateProp('backgroundColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.backgroundColor || ''} onChange={(e) => updateProp('backgroundColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
            <ControlGroup label="Text Color">
              <div className="flex gap-2">
                <input type="color" value={props.textColor || '#f9fafb'} onChange={(e) => updateProp('textColor', e.target.value)} className="w-8 h-8 rounded border border-gray-600 bg-transparent p-0" />
                <input type="text" value={props.textColor || ''} onChange={(e) => updateProp('textColor', e.target.value)} className={inputClasses} />
              </div>
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Typography" icon={Type}>
            <ControlGroup label="Font Size">
              <UnitControl value={props.fontSize} onChange={(v) => updateProp('fontSize', v)} placeholder="14px" />
            </ControlGroup>
            <ControlGroup label="Font Family">
              <select className={inputClasses} value={props.fontFamily} onChange={(e) => updateProp('fontFamily', e.target.value)}>
                <option value="Monaco, Consolas, 'Courier New', monospace">Monospace</option>
                <option value="Arial, sans-serif">Sans-serif</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Max Height">
              <UnitControl value={props.maxHeight} onChange={(v) => updateProp('maxHeight', v)} placeholder="400px" />
            </ControlGroup>
          </PropertySection>

          <PropertySection title="Container" icon={Maximize2}>
            <SpacingGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};




export const GridBlockInspector: React.FC<{ block: Block; updateBlock: (id: string, updates: Partial<Block>) => void; activeTab: 'content' | 'style' | 'advanced'; }> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const updateProp = (k: string | object, v?: any) => {
    if (typeof k === 'object') {
      updateBlock(block.id, { props: { ...props, ...k } });
    } else {
      updateBlock(block.id, { props: { ...props, [k]: v } });
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {activeTab === 'content' && (
        <>
          <PropertySection title="Grid Layout" icon={Layout} defaultOpen={true}>
            <div className="space-y-4">
              {/* Columns & Rows - STACKED */}
              <div className="flex flex-col space-y-3">
                <ControlGroup label="Columns">
                  <NumberControl
                    value={props.columns || 3}
                    onChange={(v) => updateProp('columns', v)}
                    min={1}
                    max={12}
                  />
                </ControlGroup>
                <ControlGroup label="Rows">
                  <NumberControl
                    value={props.rows || 2}
                    onChange={(v) => updateProp('rows', v)}
                    min={1}
                    max={12}
                  />
                </ControlGroup>
              </div>

              {/* Gaps */}
              <div className="pt-3 border-t border-[#3e444b]">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <ControlGroup label="Gap">
                    <UnitControl
                      value={props.gap}
                      onChange={(v) => updateProp('gap', v)}
                      placeholder="20px"
                    />
                  </ControlGroup>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ControlGroup label="Row Gap">
                    <UnitControl
                      value={props.rowGap}
                      onChange={(v) => updateProp('rowGap', v)}
                      placeholder="Auto"
                    />
                  </ControlGroup>
                  <ControlGroup label="Col Gap">
                    <UnitControl
                      value={props.columnGap}
                      onChange={(v) => updateProp('columnGap', v)}
                      placeholder="Auto"
                    />
                  </ControlGroup>
                </div>
              </div>
            </div>
          </PropertySection>

          <PropertySection title="Alignment" icon={MoveVertical} defaultOpen={true}>
            <div className="space-y-3">
              <ControlGroup label="Justify Items (Horizontal)">
                <select
                  className={inputClasses}
                  value={props.justifyItems || 'stretch'}
                  onChange={(e) => updateProp('justifyItems', e.target.value)}
                >
                  <option value="start">Start</option>
                  <option value="end">End</option>
                  <option value="center">Center</option>
                  <option value="stretch">Stretch</option>
                </select>
              </ControlGroup>
              <ControlGroup label="Align Items (Vertical)">
                <select
                  className={inputClasses}
                  value={props.alignItems || 'stretch'}
                  onChange={(e) => updateProp('alignItems', e.target.value)}
                >
                  <option value="start">Start</option>
                  <option value="end">End</option>
                  <option value="center">Center</option>
                  <option value="stretch">Stretch</option>
                </select>
              </ControlGroup>
              <div className="pt-2 border-t border-[#3e444b] mt-2 space-y-2">
                <ControlGroup label="Justify Content">
                  <select
                    className={inputClasses}
                    value={props.justifyContent || 'start'}
                    onChange={(e) => updateProp('justifyContent', e.target.value)}
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="center">Center</option>
                    <option value="stretch">Stretch</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                  </select>
                </ControlGroup>
                <ControlGroup label="Align Content">
                  <select
                    className={inputClasses}
                    value={props.alignContent || 'start'}
                    onChange={(e) => updateProp('alignContent', e.target.value)}
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="center">Center</option>
                    <option value="stretch">Stretch</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                  </select>
                </ControlGroup>
              </div>
            </div>
          </PropertySection>

          <PropertySection title="Visuals" icon={Maximize2}>
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-medium text-gray-300">Show Grid Outline</span>
              <input type="checkbox" checked={props.showGridOutline !== false} onChange={(e) => updateProp('showGridOutline', e.target.checked)} className="rounded bg-[#1a1d21] border-[#3e444b]" />
            </div>
          </PropertySection>

          <PropertySection title="Advanced Layout" icon={Settings}>
            <div className="space-y-3">
              <ControlGroup label="Template Cols">
                <input
                  type="text"
                  className={inputClasses}
                  value={props.gridTemplateColumns || ''}
                  onChange={(e) => updateProp('gridTemplateColumns', e.target.value)}
                  placeholder="e.g. 1fr 2fr 1fr"
                />
              </ControlGroup>
              <ControlGroup label="Template Rows">
                <input
                  type="text"
                  className={inputClasses}
                  value={props.gridTemplateRows || ''}
                  onChange={(e) => updateProp('gridTemplateRows', e.target.value)}
                  placeholder="e.g. auto auto"
                />
              </ControlGroup>
            </div>
          </PropertySection>
        </>
      )}

      {activeTab === 'style' && (
        <>
          <PropertySection title="Container" icon={Maximize2} defaultOpen={true}>
            <DimensionsGroup block={block} onChange={updateProp} />
            <SpacingGroup block={block} onChange={updateProp} />
            <BackgroundGroup block={block} onChange={updateProp} />
            <BorderGroup block={block} onChange={updateProp} />
            <EffectsGroup block={block} onChange={updateProp} />
          </PropertySection>
        </>
      )}

      {activeTab === 'advanced' && <AdvancedPanel block={block} onUpdate={(u) => updateBlock(block.id, u)} />}
    </div>
  );
};
