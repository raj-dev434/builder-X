import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Block } from '../../schema/types';


//In this module we written an common generic property functionality which we implemented that in Blockspecific inspector



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

export const DarkInspectorComplete: React.FC = () => {
  const {
    blocks,
    selectedBlockIds,
    updateBlock
  } = useCanvasStore();

  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['general']));

  const selectedBlockId = selectedBlockIds[0];
  const selectedBlock = selectedBlockId
    ? findBlockById(blocks, selectedBlockId)
    : null;

  const styleProps = selectedBlock?.props as any;

  const toggleSection = (section: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 h-full flex flex-col" data-testid="dark-inspector">
        {/* Header - Icons removed */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {/* Empty header - icons removed */}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">⚙️</div>
            <p>Select a block to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'dimension', label: 'Dimension', icon: '📏' },
    { id: 'typography', label: 'Typography', icon: '🔤' },
    { id: 'decorations', label: 'Decorations', icon: '🎨' },
    { id: 'extra', label: 'Extra', icon: '➕' },
    { id: 'flex', label: 'Flex', icon: '📐' },
  ];

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 h-full flex flex-col" data-testid="dark-inspector">
      {/* Header - Icons removed */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {/* Empty header - icons removed */}
        </div>
      </div>

      {/* Classes Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-300">Classes</span>
          <select className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600">
            <option>- State -</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-purple-600 text-white px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            container-width
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selected Element */}
      <div className="p-4 border-b border-gray-700">
        <span className="text-sm text-gray-300">Selected: {selectedBlock.type} #{selectedBlock.id.slice(0, 5)}</span>
      </div>

      {/* Property Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const isOpen = openSections.has(section.id);

          return (
            <div key={section.id} className="border-b border-gray-700">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{section.label}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4">
                  {section.id === 'general' && (
                    <div className="space-y-3">
                      {/* Float */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Float</label>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { float: 'none' } as any)}
                            className={`p-1 rounded text-xs ${styleProps?.float === 'none' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >×</button>
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { float: 'left' } as any)}
                            className={`p-1 rounded text-xs ${styleProps.float === 'left' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >|</button>
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { float: 'right' } as any)}
                            className={`p-1 rounded text-xs ${styleProps.float === 'right' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >|</button>
                        </div>
                      </div>

                      {/* Display */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Display</label>
                        <select
                          value={styleProps.display || 'block'}
                          onChange={(e) => updateBlock(selectedBlock.id, { display: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="block">block</option>
                          <option value="inline">inline</option>
                          <option value="inline-block">inline-block</option>
                          <option value="flex">flex</option>
                          <option value="grid">grid</option>
                          <option value="none">none</option>
                        </select>
                      </div>

                      {/* Position */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Position</label>
                        <select
                          value={styleProps.position || 'static'}
                          onChange={(e) => updateBlock(selectedBlock.id, { position: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="static">static</option>
                          <option value="relative">relative</option>
                          <option value="absolute">absolute</option>
                          <option value="fixed">fixed</option>
                          <option value="sticky">sticky</option>
                        </select>
                      </div>

                      {/* Top */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Top</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.top || 'auto'}
                            onChange={(e) => updateBlock(selectedBlock.id, { top: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { top: 'auto' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                          <div className="flex flex-col">
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.top) || 0;
                                updateBlock(selectedBlock.id, { top: `${current + 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▲</button>
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.top) || 0;
                                updateBlock(selectedBlock.id, { top: `${current - 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▼</button>
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Right</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.right || 'auto'}
                            onChange={(e) => updateBlock(selectedBlock.id, { right: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { right: 'auto' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                          <div className="flex flex-col">
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.right) || 0;
                                updateBlock(selectedBlock.id, { right: `${current + 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▲</button>
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.right) || 0;
                                updateBlock(selectedBlock.id, { right: `${current - 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▼</button>
                          </div>
                        </div>
                      </div>

                      {/* Left */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Left</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.left || 'auto'}
                            onChange={(e) => updateBlock(selectedBlock.id, { left: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { left: 'auto' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                          <div className="flex flex-col">
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.left) || 0;
                                updateBlock(selectedBlock.id, { left: `${current + 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▲</button>
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.left) || 0;
                                updateBlock(selectedBlock.id, { left: `${current - 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▼</button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Bottom</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.bottom || 'auto'}
                            onChange={(e) => updateBlock(selectedBlock.id, { bottom: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { bottom: 'auto' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                          <div className="flex flex-col">
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.bottom) || 0;
                                updateBlock(selectedBlock.id, { bottom: `${current + 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▲</button>
                            <button
                              onClick={() => {
                                const current = parseInt(styleProps.bottom) || 0;
                                updateBlock(selectedBlock.id, { bottom: `${current - 1}px` } as any);
                              }}
                              className="bg-gray-700 text-gray-300 p-0.5 rounded text-xs hover:bg-gray-600"
                            >▼</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'dimension' && (
                    <div className="space-y-3">
                      {/* Width */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Width</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.width || 'auto'}
                            onChange={(e) => updateBlock(selectedBlock.id, { width: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { width: 'auto' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                        </div>
                      </div>

                      {/* Height */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Height</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.height || 'auto'}
                            onChange={(e) => updateBlock(selectedBlock.id, { height: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { height: 'auto' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                        </div>
                      </div>

                      {/* Min Width */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Min Width</label>
                        <input
                          type="text"
                          value={styleProps.minWidth || ''}
                          onChange={(e) => updateBlock(selectedBlock.id, { minWidth: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Max Width */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Max Width</label>
                        <input
                          type="text"
                          value={styleProps.maxWidth || ''}
                          onChange={(e) => updateBlock(selectedBlock.id, { maxWidth: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Min Height */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Min Height</label>
                        <input
                          type="text"
                          value={styleProps.minHeight || ''}
                          onChange={(e) => updateBlock(selectedBlock.id, { minHeight: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Max Height */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Max Height</label>
                        <input
                          type="text"
                          value={styleProps.maxHeight || ''}
                          onChange={(e) => updateBlock(selectedBlock.id, { maxHeight: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  {section.id === 'typography' && (
                    <div className="space-y-3">
                      {/* Font Family */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Font Family</label>
                        <select
                          value={styleProps.fontFamily || 'inherit'}
                          onChange={(e) => updateBlock(selectedBlock.id, { fontFamily: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="inherit">inherit</option>
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="Helvetica, sans-serif">Helvetica</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Times New Roman, serif">Times New Roman</option>
                          <option value="Courier New, monospace">Courier New</option>
                        </select>
                      </div>

                      {/* Font Size */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={styleProps.fontSize || '16px'}
                            onChange={(e) => updateBlock(selectedBlock.id, { fontSize: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { fontSize: '16px' } as any)}
                            className="bg-gray-700 text-gray-300 p-1 rounded text-xs hover:bg-gray-600"
                          >-</button>
                        </div>
                      </div>

                      {/* Font Weight */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Font Weight</label>
                        <select
                          value={styleProps.fontWeight || 'normal'}
                          onChange={(e) => updateBlock(selectedBlock.id, { fontWeight: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="normal">normal</option>
                          <option value="bold">bold</option>
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

                      {/* Line Height */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Line Height</label>
                        <input
                          type="text"
                          value={styleProps.lineHeight || '1.5'}
                          onChange={(e) => updateBlock(selectedBlock.id, { lineHeight: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Text Align */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Text Align</label>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { textAlign: 'left' } as any)}
                            className={`p-1 rounded text-xs ${styleProps.textAlign === 'left' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >L</button>
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { textAlign: 'center' } as any)}
                            className={`p-1 rounded text-xs ${styleProps.textAlign === 'center' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >C</button>
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { textAlign: 'right' } as any)}
                            className={`p-1 rounded text-xs ${styleProps.textAlign === 'right' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >R</button>
                          <button
                            onClick={() => updateBlock(selectedBlock.id, { textAlign: 'justify' } as any)}
                            className={`p-1 rounded text-xs ${styleProps.textAlign === 'justify' ? 'bg-gray-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >J</button>
                        </div>
                      </div>

                      {/* Color */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Color</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="color"
                            value={styleProps.color || '#000000'}
                            onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value } as any)}
                            className="w-8 h-6 rounded border border-gray-600"
                          />
                          <input
                            type="text"
                            value={styleProps.color || '#000000'}
                            onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === 'decorations' && (
                    <div className="space-y-3">
                      {/* Background Color */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Background Color</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="color"
                            value={styleProps.backgroundColor || '#ffffff'}
                            onChange={(e) => updateBlock(selectedBlock.id, { backgroundColor: e.target.value } as any)}
                            className="w-8 h-6 rounded border border-gray-600"
                          />
                          <input
                            type="text"
                            value={styleProps.backgroundColor || '#ffffff'}
                            onChange={(e) => updateBlock(selectedBlock.id, { backgroundColor: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                        </div>
                      </div>

                      {/* Border Width */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Border Width</label>
                        <input
                          type="text"
                          value={styleProps.borderWidth || '0px'}
                          onChange={(e) => updateBlock(selectedBlock.id, { borderWidth: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Border Style */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Border Style</label>
                        <select
                          value={styleProps.borderStyle || 'none'}
                          onChange={(e) => updateBlock(selectedBlock.id, { borderStyle: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="none">none</option>
                          <option value="solid">solid</option>
                          <option value="dashed">dashed</option>
                          <option value="dotted">dotted</option>
                          <option value="double">double</option>
                        </select>
                      </div>

                      {/* Border Color */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Border Color</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="color"
                            value={styleProps.borderColor || '#000000'}
                            onChange={(e) => updateBlock(selectedBlock.id, { borderColor: e.target.value } as any)}
                            className="w-8 h-6 rounded border border-gray-600"
                          />
                          <input
                            type="text"
                            value={styleProps.borderColor || '#000000'}
                            onChange={(e) => updateBlock(selectedBlock.id, { borderColor: e.target.value } as any)}
                            className="flex-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          />
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Border Radius</label>
                        <input
                          type="text"
                          value={styleProps.borderRadius || '0px'}
                          onChange={(e) => updateBlock(selectedBlock.id, { borderRadius: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Box Shadow */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Box Shadow</label>
                        <input
                          type="text"
                          value={styleProps.boxShadow || ''}
                          onChange={(e) => updateBlock(selectedBlock.id, { boxShadow: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                          placeholder="0 2px 4px rgba(0,0,0,0.1)"
                        />
                      </div>
                    </div>
                  )}

                  {section.id === 'extra' && (
                    <div className="space-y-3">
                      {/* Padding */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Padding</label>
                        <input
                          type="text"
                          value={styleProps.padding || '0px'}
                          onChange={(e) => updateBlock(selectedBlock.id, { padding: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Margin */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Margin</label>
                        <input
                          type="text"
                          value={styleProps.margin || '0px'}
                          onChange={(e) => updateBlock(selectedBlock.id, { margin: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Z-Index */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Z-Index</label>
                        <input
                          type="number"
                          value={styleProps.zIndex || 0}
                          onChange={(e) => updateBlock(selectedBlock.id, { zIndex: parseInt(e.target.value) || 0 } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Opacity */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Opacity</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={styleProps.opacity || 1}
                          onChange={(e) => updateBlock(selectedBlock.id, { opacity: parseFloat(e.target.value) } as any)}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-400">{styleProps.opacity || 1}</span>
                      </div>

                      {/* Cursor */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Cursor</label>
                        <select
                          value={styleProps.cursor || 'default'}
                          onChange={(e) => updateBlock(selectedBlock.id, { cursor: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="default">default</option>
                          <option value="pointer">pointer</option>
                          <option value="text">text</option>
                          <option value="move">move</option>
                          <option value="not-allowed">not-allowed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {section.id === 'flex' && (
                    <div className="space-y-3">
                      {/* Flex Direction */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Flex Direction</label>
                        <select
                          value={styleProps.flexDirection || 'row'}
                          onChange={(e) => updateBlock(selectedBlock.id, { flexDirection: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="row">row</option>
                          <option value="column">column</option>
                          <option value="row-reverse">row-reverse</option>
                          <option value="column-reverse">column-reverse</option>
                        </select>
                      </div>

                      {/* Justify Content */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Justify Content</label>
                        <select
                          value={styleProps.justifyContent || 'flex-start'}
                          onChange={(e) => updateBlock(selectedBlock.id, { justifyContent: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="flex-start">flex-start</option>
                          <option value="flex-end">flex-end</option>
                          <option value="center">center</option>
                          <option value="space-between">space-between</option>
                          <option value="space-around">space-around</option>
                          <option value="space-evenly">space-evenly</option>
                        </select>
                      </div>

                      {/* Align Items */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Align Items</label>
                        <select
                          value={styleProps.alignItems || 'stretch'}
                          onChange={(e) => updateBlock(selectedBlock.id, { alignItems: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="stretch">stretch</option>
                          <option value="flex-start">flex-start</option>
                          <option value="flex-end">flex-end</option>
                          <option value="center">center</option>
                          <option value="baseline">baseline</option>
                        </select>
                      </div>

                      {/* Flex Wrap */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Flex Wrap</label>
                        <select
                          value={styleProps.flexWrap || 'nowrap'}
                          onChange={(e) => updateBlock(selectedBlock.id, { flexWrap: e.target.value } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        >
                          <option value="nowrap">nowrap</option>
                          <option value="wrap">wrap</option>
                          <option value="wrap-reverse">wrap-reverse</option>
                        </select>
                      </div>

                      {/* Flex Grow */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Flex Grow</label>
                        <input
                          type="number"
                          value={styleProps.flexGrow || 0}
                          onChange={(e) => updateBlock(selectedBlock.id, { flexGrow: parseFloat(e.target.value) || 0 } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>

                      {/* Flex Shrink */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Flex Shrink</label>
                        <input
                          type="number"
                          value={styleProps.flexShrink || 1}
                          onChange={(e) => updateBlock(selectedBlock.id, { flexShrink: parseFloat(e.target.value) || 1 } as any)}
                          className="w-full bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
