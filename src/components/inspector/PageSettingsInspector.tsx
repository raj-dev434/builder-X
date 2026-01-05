import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { PropertySection, ControlGroup, inputClasses } from './BlockInspectors';
import { Palette, Layout, RotateCcw } from 'lucide-react';

export const PageSettingsInspector: React.FC = () => {
    const { pageSettings, updatePageSettings } = useCanvasStore();

    const handleChange = (key: string, value: any) => {
        updatePageSettings({ [key]: value });
    };

    return (
        <div className="flex flex-col h-full bg-[#262a2e] text-white">
            {/* Header */}
            <div className="flex flex-col bg-[#262a2e] border-b border-[#3e444b] shadow-sm relative z-10 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center shadow-lg text-white font-bold ring-1 ring-purple-500/50">
                        <Layout className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Settings</span>
                        <h2 className="text-sm font-bold text-gray-100 leading-none">Page Canvas</h2>
                    </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    Global settings for the entire page background and styles.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <PropertySection title="Background" icon={Palette} defaultOpen={true}>
                    <div className="flex bg-[#1a1d21] rounded border border-[#3e444b] p-0.5 mb-4 mx-4">
                        <button
                            onClick={() => handleChange('backgroundType', 'solid')}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-sm transition-colors ${(!pageSettings?.backgroundType || pageSettings.backgroundType === 'solid')
                                ? 'bg-[#3b82f6] text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Solid
                        </button>
                        <button
                            onClick={() => handleChange('backgroundType', 'gradient')}
                            className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-sm transition-colors ${pageSettings?.backgroundType === 'gradient'
                                ? 'bg-[#3b82f6] text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Gradient
                        </button>
                    </div>

                    {(!pageSettings?.backgroundType || pageSettings.backgroundType === 'solid') && (
                        <ControlGroup label="Color">
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-2 items-center">
                                    <div className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative shadow-sm shrink-0">
                                        <input
                                            type="color"
                                            value={pageSettings?.backgroundColor || '#ffffff'}
                                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none m-0"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        value={pageSettings?.backgroundColor || '#ffffff'}
                                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                        placeholder="#ffffff"
                                    />
                                    <button
                                        onClick={() => handleChange('backgroundColor', '#ffffff')}
                                        className="p-1.5 hover:bg-[#2d3237] rounded text-gray-400 hover:text-white transition-colors"
                                        title="Reset to White"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </ControlGroup>
                    )}

                    {pageSettings?.backgroundType === 'gradient' && (
                        <>
                            <ControlGroup label="Type">
                                <select
                                    className={inputClasses}
                                    value={pageSettings?.gradientType || 'linear'}
                                    onChange={(e) => handleChange('gradientType', e.target.value)}
                                >
                                    <option value="linear">Linear</option>
                                    <option value="radial">Radial</option>
                                </select>
                            </ControlGroup>

                            <ControlGroup label="Direction">
                                <select
                                    className={inputClasses}
                                    value={pageSettings?.gradientDirection || 'to bottom'}
                                    onChange={(e) => handleChange('gradientDirection', e.target.value)}
                                >
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="45deg">45 Deg</option>
                                    <option value="135deg">135 Deg</option>
                                </select>
                            </ControlGroup>

                            <ControlGroup label="Start Color">
                                <BufferedColorInput
                                    value={pageSettings?.gradientStart || '#ffffff'}
                                    onChange={(val) => handleChange('gradientStart', val)}
                                />
                            </ControlGroup>

                            <ControlGroup label="End Color">
                                <BufferedColorInput
                                    value={pageSettings?.gradientEnd || '#d1d5db'}
                                    onChange={(val) => handleChange('gradientEnd', val)}
                                />
                            </ControlGroup>

                            <div className="px-4 mb-4">
                                <button
                                    onClick={() => updatePageSettings({ gradientStart: '#ffffff', gradientEnd: '#ffffff' })}
                                    className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-medium text-gray-400 hover:text-white bg-[#2d3237] hover:bg-[#3e444b] rounded transition-colors border border-transparent hover:border-gray-600"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Reset Gradient to White</span>
                                </button>
                            </div>
                        </>
                    )}

                    <ControlGroup label="Image URL">
                        <input
                            type="text"
                            className={inputClasses}
                            placeholder="https://example.com/bg.jpg"
                            value={pageSettings?.backgroundImage || ''}
                            onChange={(e) => handleChange('backgroundImage', e.target.value)}
                        />
                    </ControlGroup>

                    {pageSettings?.backgroundImage && (
                        <>
                            <ControlGroup label="Size">
                                <select
                                    className={inputClasses}
                                    value={pageSettings?.backgroundSize || 'auto'}
                                    onChange={(e) => handleChange('backgroundSize', e.target.value)}
                                >
                                    <option value="auto">Auto</option>
                                    <option value="cover">Cover (Fill)</option>
                                    <option value="contain">Contain (Fit)</option>
                                    <option value="100% 100%">Stretch</option>
                                </select>
                            </ControlGroup>

                            <ControlGroup label="Position">
                                <select
                                    className={inputClasses}
                                    value={pageSettings?.backgroundPosition || 'center'}
                                    onChange={(e) => handleChange('backgroundPosition', e.target.value)}
                                >
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </ControlGroup>

                            <ControlGroup label="Repeat">
                                <select
                                    className={inputClasses}
                                    value={pageSettings?.backgroundRepeat || 'no-repeat'}
                                    onChange={(e) => handleChange('backgroundRepeat', e.target.value)}
                                >
                                    <option value="no-repeat">No Repeat</option>
                                    <option value="repeat">Repeat</option>
                                    <option value="repeat-x">Repeat X</option>
                                    <option value="repeat-y">Repeat Y</option>
                                </select>
                            </ControlGroup>

                            <ControlGroup label="Attachment">
                                <select
                                    className={inputClasses}
                                    value={pageSettings?.backgroundAttachment || 'scroll'}
                                    onChange={(e) => handleChange('backgroundAttachment', e.target.value)}
                                >
                                    <option value="scroll">Scroll</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                            </ControlGroup>
                        </>
                    )}
                </PropertySection>

                {/* <PropertySection title="Global Typography" icon={Type} defaultOpen={false}>
                    <ControlGroup label="Font Family">
                        <select
                            className={inputClasses}
                            value={pageSettings?.fontFamily || 'inherit'}
                            onChange={(e) => handleChange('fontFamily', e.target.value)}
                        >
                            <option value="inherit">Default</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                            <option value="'Courier New', monospace">Courier New</option>
                            <option value="Inter, sans-serif">Inter</option>
                            <option value="Roboto, sans-serif">Roboto</option>
                            <option value="'Open Sans', sans-serif">Open Sans</option>
                        </select>
                    </ControlGroup>
                </PropertySection>

                <PropertySection title="Grid Settings" icon={Grid} defaultOpen={false}>
                    <div className="flex items-center justify-between px-4 mb-3">
                        <label className="text-[11px] font-medium text-gray-300 uppercase tracking-wider">Show Grid</label>
                        <button
                            onClick={() => handleChange('showGrid', !pageSettings?.showGrid)}
                            className={`w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out ${pageSettings?.showGrid ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${pageSettings?.showGrid ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {pageSettings?.showGrid && (
                        <ControlGroup label="Grid Color">
                            <div className="flex gap-2 items-center">
                                <div className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative shadow-sm">
                                    <input
                                        type="color"
                                        value={pageSettings?.gridColor || 'rgba(0,0,0,0.1)'}
                                        onChange={(e) => handleChange('gridColor', e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none m-0"
                                    />
                                </div>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    value={pageSettings?.gridColor || 'rgba(0,0,0,0.1)'}
                                    onChange={(e) => handleChange('gridColor', e.target.value)}
                                />
                            </div>
                        </ControlGroup>
                    )}
                </PropertySection> */}
            </div>
        </div >
    );
};

const BufferedColorInput: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleApply = () => {
        onChange(localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded border border-gray-600 overflow-hidden relative shadow-sm shrink-0">
                    <input
                        type="color"
                        value={localValue}
                        onChange={(e) => {
                            setLocalValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-none m-0"
                    />
                </div>
                <div className="flex-1 flex gap-1">
                    <input
                        type="text"
                        className={`${inputClasses} flex-1 min-w-0`}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="#000000"
                    />
                    <button
                        onClick={handleApply}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold rounded transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};
