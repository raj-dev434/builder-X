import React from 'react';
import { useThemeStore, ThemeColors } from '../../store/themeStore';

interface ThemePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ThemePanel: React.FC<ThemePanelProps> = ({ isOpen, onClose }) => {
    const {
        colors, typography, customCSS, customFonts,
        setColors, setTypography, setCustomCSS,
        addCustomFont, removeCustomFont, resetTheme
    } = useThemeStore();

    const [newFontName, setNewFontName] = React.useState('');
    const [newFontUrl, setNewFontUrl] = React.useState('');

    const handleAddFont = () => {
        if (newFontName && newFontUrl) {
            addCustomFont({ name: newFontName, url: newFontUrl });
            setNewFontName('');
            setNewFontUrl('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />

            <div className="relative ml-auto w-80 bg-white shadow-xl flex flex-col h-full transform transition-transform duration-300">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Global Theme</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Usage Tip */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <span className="text-lg">💡</span>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">How to Use Theme Colors</h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    When editing any block, look for the <strong>🎨 Theme Colors</strong> palette above color pickers.
                                    Click any theme color swatch to apply it. Blocks using theme colors will automatically update when you change the theme!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colors Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Colors</h3>
                        <div className="space-y-3">
                            {Object.entries(colors).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <label className="text-sm text-gray-700 capitalize">{key}</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 font-mono">{value}</span>
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => setColors({ [key]: e.target.value } as Partial<ThemeColors>)}
                                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Typography Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Typography</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Heading Font</label>
                                <select
                                    value={typography.headingFont}
                                    onChange={(e) => setTypography({ headingFont: e.target.value })}
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Inter, sans-serif">Inter</option>
                                    <option value="'Roboto', sans-serif">Roboto</option>
                                    <option value="'Open Sans', sans-serif">Open Sans</option>
                                    <option value="'Playfair Display', serif">Playfair Display</option>
                                    <option value="'Montserrat', sans-serif">Montserrat</option>
                                    {customFonts.map(font => (
                                        <option key={font.name} value={`'${font.name}', sans-serif`}>{font.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Body Font</label>
                                <select
                                    value={typography.bodyFont}
                                    onChange={(e) => setTypography({ bodyFont: e.target.value })}
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Inter, sans-serif">Inter</option>
                                    <option value="'Roboto', sans-serif">Roboto</option>
                                    <option value="'Open Sans', sans-serif">Open Sans</option>
                                    <option value="'Lato', sans-serif">Lato</option>
                                    <option value="system-ui, sans-serif">System UI</option>
                                    {customFonts.map(font => (
                                        <option key={font.name} value={`'${font.name}', sans-serif`}>{font.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">H1 Size</label>
                                    <input
                                        type="text"
                                        value={typography.h1Size}
                                        onChange={(e) => setTypography({ h1Size: e.target.value })}
                                        className="w-full text-sm border-gray-300 rounded-md p-1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Body Size</label>
                                    <input
                                        type="text"
                                        value={typography.bodySize}
                                        onChange={(e) => setTypography({ bodySize: e.target.value })}
                                        className="w-full text-sm border-gray-300 rounded-md p-1"
                                    />
                                </div>
                            </div>

                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Font Management Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Custom Fonts</h3>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Font Name (e.g. Lobster)"
                                    value={newFontName}
                                    onChange={(e) => setNewFontName(e.target.value)}
                                    className="w-full text-sm border-gray-300 rounded-md p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Google Fonts URL"
                                    value={newFontUrl}
                                    onChange={(e) => setNewFontUrl(e.target.value)}
                                    className="w-full text-xs border-gray-300 rounded-md p-2"
                                />
                                <button
                                    onClick={handleAddFont}
                                    disabled={!newFontName || !newFontUrl}
                                    className="w-full py-1 px-3 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Add Font
                                </button>
                            </div>

                            {customFonts.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {customFonts.map((font, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                            <span className="truncate flex-1" title={font.url}>{font.name}</span>
                                            <button
                                                onClick={() => removeCustomFont(font.name)}
                                                className="text-red-500 hover:text-red-700 ml-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Custom CSS Section */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Custom CSS</h3>
                        <textarea
                            value={customCSS}
                            onChange={(e) => setCustomCSS(e.target.value)}
                            placeholder=".canvas-root { ... }"
                            className="w-full h-32 text-xs font-mono border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </section>

                    <hr className="border-gray-100" />

                    <button
                        onClick={resetTheme}
                        className="w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    );
};
