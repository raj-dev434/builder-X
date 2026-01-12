import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pipette } from 'lucide-react';
import { HSV, hexToRgb, rgbToHex, rgbToHsv, hsvToRgb } from '../../utils/colorUtils';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative cursor-pointer hover:border-blue-500 transition-colors"
          style={{ 
            backgroundColor: color,
            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: color }} />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#15181b] border border-[#2d3237] text-gray-300 text-xs px-2 py-1.5 rounded focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 outline-none"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50">
           <ColorPickerPanel color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

const ColorPickerPanel: React.FC<{ color: string; onChange: (color: string) => void }> = ({ color, onChange }) => {
  // Internal state in HSV for better manipulation
  const [hsv, setHsv] = useState<HSV>({ h: 0, s: 0, v: 100, a: 1 });
  const [isDraggingSat, setIsDraggingSat] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);

  const satRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external prop changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const newHsv = rgbToHsv(rgb);
      // Only update if significantly different to prevent loop/jitter
      // setHsv(newHsv); 
      // Simplified: Just set it. Optimization can be done if needed.
      setHsv(newHsv);
    }
  }, [color]);

  const handleColorChange = useCallback((newHsv: HSV) => {
    setHsv(newHsv);
    const rgb = hsvToRgb(newHsv);
    const hex = rgbToHex(rgb);
    onChange(hex);
  }, [onChange]);

  // Saturation / Brightness Box Logic
  const handleSatMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSat(true);
    handleSatMove(e);
  };

  const handleSatMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!satRef.current) return;
    const rect = satRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    handleColorChange({ ...hsv, s: x * 100, v: (1 - y) * 100 });
  }, [hsv, handleColorChange]);

  // Hue Slider Logic
  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    handleHueMove(e);
  };

  const handleHueMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    handleColorChange({ ...hsv, h: x * 360 });
  }, [hsv, handleColorChange]);

  // Alpha Slider Logic
  const handleAlphaMouseDown = (e: React.MouseEvent) => {
    setIsDraggingAlpha(true);
    handleAlphaMove(e);
  };

  const handleAlphaMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!alphaRef.current) return;
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    handleColorChange({ ...hsv, a: x });
  }, [hsv, handleColorChange]);


  // Global Mouse Up / Move
  useEffect(() => {
    const handleUp = () => {
      setIsDraggingSat(false);
      setIsDraggingHue(false);
      setIsDraggingAlpha(false);
    };

    const handleMove = (e: MouseEvent) => {
      if (isDraggingSat) handleSatMove(e);
      if (isDraggingHue) handleHueMove(e);
      if (isDraggingAlpha) handleAlphaMove(e);
    };

    if (isDraggingSat || isDraggingHue || isDraggingAlpha) {
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('mousemove', handleMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('mousemove', handleMove);
    };
  }, [isDraggingSat, isDraggingHue, isDraggingAlpha, handleSatMove, handleHueMove, handleAlphaMove]);


  // Helper for inline styles
  const hueColor = `hsl(${hsv.h}, 100%, 50%)`;
  const mainColor = color; // Current full color

  return (
    <div className="w-64 bg-[#1e2227] border border-[#3e444b] rounded-lg shadow-xl p-3 select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase">Color Picker</span>
        <div className="flex gap-2">
           {/* Tools like eyedropper could go here */}
           <Pipette className="w-3 h-3 text-gray-500 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Saturation / Brightness Box */}
      <div 
        ref={satRef}
        onMouseDown={handleSatMouseDown}
        className="w-full h-32 rounded mb-3 relative cursor-crosshair overflow-hidden"
        style={{ backgroundColor: hueColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        
        {/* Pointer */}
        <div 
          className="absolute w-3 h-3 rounded-full border-2 border-white shadow-sm -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ 
            left: `${hsv.s}%`, 
            top: `${100 - hsv.v}%`,
            backgroundColor: mainColor 
          }} 
        />
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-3">
        {/* Hue */}
        <div 
            ref={hueRef}
            onMouseDown={handleHueMouseDown}
            className="w-full h-2 rounded-full cursor-pointer relative" 
            style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
        >
            <div 
                className="absolute w-3 h-3 bg-white rounded-full shadow border border-gray-300 -translate-y-1/2 top-1/2 -translate-x-1/2 pointer-events-none"
                style={{ left: `${(hsv.h / 360) * 100}%` }}
            />
        </div>

        {/* Alpha */}
        <div 
            ref={alphaRef}
            onMouseDown={handleAlphaMouseDown}
            className="w-full h-2 rounded-full cursor-pointer relative"
             style={{ 
                background: `linear-gradient(to right, transparent, ${hueColor})`,
                backgroundImage: `linear-gradient(to right, transparent, ${hueColor}), linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                backgroundSize: '100% 100%, 6px 6px',
                backgroundColor: '#fff' // Fallback
             }}
        >
             <div 
                className="absolute w-3 h-3 bg-white rounded-full shadow border border-gray-300 -translate-y-1/2 top-1/2 -translate-x-1/2 pointer-events-none"
                style={{ left: `${hsv.a * 100}%` }}
            />
        </div>
      </div>

      {/* Inputs */}
      <div className="flex gap-2">
         <div className="flex-1">
            <input 
                type="text" 
                value={color} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#15181b] border border-[#2d3237] text-gray-300 text-[10px] px-2 py-1 rounded text-center font-mono uppercase focus:border-blue-500/50 outline-none" 
            />
         </div>
         <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase">
             <span>Hex</span>
         </div>
      </div>
    </div>
  );
};
