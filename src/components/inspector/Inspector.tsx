import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Block } from '../../schema/types';
import { StyleEditor } from './StyleEditor';
import { ResponsiveEditor } from './ResponsiveEditor';
import { AnimationEditor } from './AnimationEditor';
import {
  SpacingGroup,
  DimensionsGroup,
  TypographyGroup,
  BackgroundGroup,
  BorderGroup,
  EffectsGroup,
  LayoutGroup
} from './CommonPropertyGroups';
import { useTemplateStore } from '../../store/templateStore';

export const Inspector: React.FC = () => {
  const {
    blocks,
    selectedBlockIds,
    updateBlock
  } = useCanvasStore();

  const { saveTemplate, savedTemplates, updateTemplate } = useTemplateStore();

  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'responsive' | 'animation'>('content');

  const selectedBlockId = selectedBlockIds[0];
  const selectedBlock = selectedBlockId
    ? findBlockById(blocks, selectedBlockId)
    : null;

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 h-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Properties</h2>
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">⚙️</div>
          <p>Select a block to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleSaveTemplate = () => {
    const name = window.prompt('Enter a name for this template:', 'My Custom Template');
    if (name) {
      const existingTemplate = savedTemplates.find(t => t.name === name);

      if (existingTemplate) {
        if (confirm(`Template "${name}" already exists. Do you want to update it?`)) {
          updateTemplate(existingTemplate.id, selectedBlock, name);
          alert('Template updated!');
        }
      } else {
        saveTemplate(selectedBlock, name);
        alert('Template saved!');
      }
    }
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'style', label: 'Style', icon: '🎨' },
    { id: 'responsive', label: 'Responsive', icon: '📱' },
    { id: 'animation', label: 'Animation', icon: '🎬' },
  ] as const;

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 h-full flex flex-col" data-testid="inspector">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedBlock.type} Properties
          </h2>
          <button
            onClick={handleSaveTemplate}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
            title="Save as Template"
          >
            <span>💾</span> Save
          </button>
        </div>

        <div className="flex border border-gray-300 rounded-md overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {renderPropertyFields(selectedBlock, updateBlock)}
          </div>
        )}

        {activeTab === 'style' && (
          <StyleEditor block={selectedBlock} onUpdate={(updates) => updateBlock(selectedBlock.id, updates)} />
        )}

        {activeTab === 'responsive' && (
          <ResponsiveEditor block={selectedBlock} onUpdate={(updates) => updateBlock(selectedBlock.id, updates)} />
        )}

        {activeTab === 'animation' && (
          <AnimationEditor block={selectedBlock} onUpdate={(updates) => updateBlock(selectedBlock.id, updates)} />
        )}
      </div>
    </div>
  );
};

function findBlockById(blocks: Block[], id: string): Block | null {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    }
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return null;
}

function renderPropertyFields(block: Block, updateBlock: (id: string, updates: Partial<Block>) => void) {
  const handlePropChange = (key: string, value: any) => {
    updateBlock(block.id, {
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  // Common renderer that can be used for any block
  const renderCommonProperties = () => (
    <>
      <DimensionsGroup block={block} onChange={handlePropChange} />
      <SpacingGroup block={block} onChange={handlePropChange} />
      <TypographyGroup block={block} onChange={handlePropChange} />
      <BackgroundGroup block={block} onChange={handlePropChange} />
      <BorderGroup block={block} onChange={handlePropChange} />
      <EffectsGroup block={block} onChange={handlePropChange} />
      <LayoutGroup block={block} onChange={handlePropChange} />
    </>
  );

  switch (block.type) {
    case 'text':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={block.props.content || ''}
              onChange={(e) => handlePropChange('content', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              rows={3}
            />
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'survey':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              rows={3}
            />
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'image':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Source
            </label>
            <input
              type="text"
              value={block.props.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={block.props.alt || ''}
              onChange={(e) => handlePropChange('alt', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="Image description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Object Fit
            </label>
            <select
              value={block.props.objectFit || 'cover'}
              onChange={(e) => handlePropChange('objectFit', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="scale-down">Scale Down</option>
              <option value="none">None</option>
            </select>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'button':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={block.props.text || ''}
              onChange={(e) => handlePropChange('text', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL
            </label>
            <input
              type="url"
              value={block.props.href || ''}
              onChange={(e) => handlePropChange('href', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://example.com"
            />
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'map':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={block.props.address || ''}
              onChange={(e) => handlePropChange('address', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. New York, NY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zoom Level ({block.props.zoom || 13})
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={block.props.zoom || 13}
              onChange={(e) => handlePropChange('zoom', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.props.interactive !== false}
              onChange={(e) => handlePropChange('interactive', e.target.checked)}
              id="map-interactive"
            />
            <label htmlFor="map-interactive" className="text-sm font-medium text-gray-700">
              Interactive
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.props.showMarker !== false}
              onChange={(e) => handlePropChange('showMarker', e.target.checked)}
              id="map-marker"
            />
            <label htmlFor="map-marker" className="text-sm font-medium text-gray-700">
              Show Marker
            </label>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'countdown-timer':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="datetime-local"
              value={block.props.targetDate ? new Date(block.props.targetDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => handlePropChange('targetDate', new Date(e.target.value).toISOString())}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="datetime-local"
              value={block.props.targetDate ? new Date(block.props.targetDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => handlePropChange('targetDate', new Date(e.target.value).toISOString())}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expired Message
            </label>
            <input
              type="text"
              value={block.props.expiredMessage || ''}
              onChange={(e) => handlePropChange('expiredMessage', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'progress-bar':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Value ({block.props.value || 0})
            </label>
            <input
              type="range"
              min="0"
              max={block.props.max || 100}
              value={block.props.value || 0}
              onChange={(e) => handlePropChange('value', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Value
            </label>
            <input
              type="number"
              value={block.props.max || 100}
              onChange={(e) => handlePropChange('max', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant
            </label>
            <select
              value={block.props.variant || 'default'}
              onChange={(e) => handlePropChange('variant', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
            >
              <option value="default">Default (Blue)</option>
              <option value="success">Success (Green)</option>
              <option value="warning">Warning (Orange)</option>
              <option value="danger">Danger (Red)</option>
              <option value="info">Info (Cyan)</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.props.striped !== false}
              onChange={(e) => handlePropChange('striped', e.target.checked)}
              id="progress-striped"
            />
            <label htmlFor="progress-striped" className="text-sm font-medium text-gray-700">
              Striped
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.props.animated !== false}
              onChange={(e) => handlePropChange('animated', e.target.checked)}
              id="progress-animated"
            />
            <label htmlFor="progress-animated" className="text-sm font-medium text-gray-700">
              Animated
            </label>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'code':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={block.props.language || 'javascript'}
              onChange={(e) => handlePropChange('language', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="text">Plain Text</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.props.showLineNumbers !== false}
              onChange={(e) => handlePropChange('showLineNumbers', e.target.checked)}
              id="code-linenumbers"
            />
            <label htmlFor="code-linenumbers" className="text-sm font-medium text-gray-700">
              Show Line Numbers
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={block.props.showCopyButton !== false}
              onChange={(e) => handlePropChange('showCopyButton', e.target.checked)}
              id="code-copy"
            />
            <label htmlFor="code-copy" className="text-sm font-medium text-gray-700">
              Show Copy Button
            </label>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'social-follow':
      const platforms = block.props.platforms || [];
      const updatePlatform = (index: number, key: string, value: string) => {
        const newPlatforms = [...platforms];
        newPlatforms[index] = { ...newPlatforms[index], [key]: value };
        handlePropChange('platforms', newPlatforms);
      };

      const removePlatform = (index: number) => {
        const newPlatforms = platforms.filter((_: any, i: number) => i !== index);
        handlePropChange('platforms', newPlatforms);
      };

      const addPlatform = () => {
        const newPlatforms = [...platforms, { name: 'New Platform', url: '#', icon: '🔗', color: '#333' }];
        handlePropChange('platforms', newPlatforms);
      };

      return (
        <>
          <div className="space-y-3 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Platforms</label>
            {platforms.map((p: any, i: number) => (
              <div key={i} className="p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{p.icon} {p.name}</span>
                  <button onClick={() => removePlatform(i)} className="text-red-500 hover:text-red-700">🗑️</button>
                </div>
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      const presets: Record<string, { icon: string, color: string, name: string }> = {
                        'Facebook': { icon: '📘', color: '#1877f2', name: 'Facebook' },
                        'Twitter': { icon: '🐦', color: '#1da1f2', name: 'Twitter' },
                        'Instagram': { icon: '📷', color: '#e4405f', name: 'Instagram' },
                        'LinkedIn': { icon: '💼', color: '#0077b5', name: 'LinkedIn' },
                        'YouTube': { icon: '▶️', color: '#ff0000', name: 'YouTube' },
                        'GitHub': { icon: '💻', color: '#333333', name: 'GitHub' },
                        'Custom': { icon: '🔗', color: '#333333', name: 'Link' }
                      };
                      const preset = presets[e.target.value];
                      if (preset) {
                        updatePlatform(i, 'name', preset.name);
                        updatePlatform(i, 'icon', preset.icon);
                        updatePlatform(i, 'color', preset.color);
                      }
                    }}
                    className="w-full p-1 text-xs border rounded mb-1"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Platform...</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Custom">Custom</option>
                  </select>

                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePlatform(i, 'name', e.target.value)}
                    className="w-full p-1 text-xs border rounded"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={p.url}
                    onChange={(e) => updatePlatform(i, 'url', e.target.value)}
                    className="w-full p-1 text-xs border rounded"
                    placeholder="URL"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={p.icon}
                      onChange={(e) => updatePlatform(i, 'icon', e.target.value)}
                      className="w-1/3 p-1 text-xs border rounded"
                      placeholder="Icon"
                    />
                    <input
                      type="color"
                      value={p.color || '#000000'}
                      onChange={(e) => updatePlatform(i, 'color', e.target.value)}
                      className="w-8 h-8 p-0 border-0 rounded overflow-hidden"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addPlatform}
              className="w-full py-2 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
            >
              + Add Platform
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={block.props.layout || 'horizontal'}
              onChange={(e) => handlePropChange('layout', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'testimonial':
      const testimonials = block.props.testimonials || [];

      // Migration helper: if no list but single props exist, show them as the first item visually
      // (Real migration happens when we save back to testimonials)
      const effectiveTestimonials = testimonials.length > 0 ? testimonials : [{
        quote: block.props.quote || 'Great product!',
        author: block.props.author || 'Jane Doe',
        title: block.props.title || 'CEO',
        company: block.props.company || 'Company',
        avatarUrl: block.props.avatarUrl || 'https://via.placeholder.com/80',
        rating: block.props.rating || 5
      }];

      const updateTestimonial = (index: number, key: string, value: any) => {
        const newTestimonials = [...effectiveTestimonials];
        newTestimonials[index] = { ...newTestimonials[index], [key]: value };
        handlePropChange('testimonials', newTestimonials);
      };

      const addTestimonial = () => {
        const newTestimonials = [...effectiveTestimonials, {
          quote: 'New testimonial',
          author: 'Name',
          title: 'Position',
          company: 'Company',
          avatarUrl: 'https://via.placeholder.com/80',
          rating: 5
        }];
        handlePropChange('testimonials', newTestimonials);
      };

      const removeTestimonial = (index: number) => {
        const newTestimonials = effectiveTestimonials.filter((_, i) => i !== index);
        handlePropChange('testimonials', newTestimonials);
      };

      return (
        <>
          <div className="space-y-4 mb-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Testimonials</label>
              <div className="space-x-2">
                <label className="inline-flex items-center text-xs">
                  <input type="checkbox" checked={block.props.autoplay} onChange={e => handlePropChange('autoplay', e.target.checked)} className="mr-1" /> Auto
                </label>
                <label className="inline-flex items-center text-xs">
                  <input type="checkbox" checked={block.props.showDots !== false} onChange={e => handlePropChange('showDots', e.target.checked)} className="mr-1" /> Dots
                </label>
              </div>
            </div>

            {effectiveTestimonials.map((item: any, i: number) => (
              <div key={i} className="p-3 border rounded bg-white">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">#{i + 1}</span>
                  {effectiveTestimonials.length > 1 && (
                    <button onClick={() => removeTestimonial(i)} className="text-red-500 hover:text-red-700">✕</button>
                  )}
                </div>
                <textarea
                  value={item.quote}
                  onChange={e => updateTestimonial(i, 'quote', e.target.value)}
                  className="w-full text-xs p-1 border rounded mb-2"
                  rows={2}
                  placeholder="Quote"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={item.author}
                    onChange={e => updateTestimonial(i, 'author', e.target.value)}
                    className="text-xs p-1 border rounded"
                    placeholder="Author"
                  />
                  <input
                    value={item.title}
                    onChange={e => updateTestimonial(i, 'title', e.target.value)}
                    className="text-xs p-1 border rounded"
                    placeholder="Title"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addTestimonial}
              className="w-full py-2 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
            >
              + Add Testimonial
            </button>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'section':
    case 'container':
    case 'row':
    case 'column':
    case 'card':
    case 'group':
      // Structural blocks mostly just need the common properties
      return renderCommonProperties();

    case 'divider':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thickness
            </label>
            <input
              type="text"
              value={block.props.height || '1px'}
              onChange={(e) => handlePropChange('height', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="1px"
            />
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'product':
      return (
        <>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={block.props.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={block.props.description || ''}
                onChange={(e) => handlePropChange('description', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  value={block.props.price || ''}
                  onChange={(e) => handlePropChange('price', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input
                  type="text"
                  value={block.props.originalPrice || ''}
                  onChange={(e) => handlePropChange('originalPrice', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <input
                  type="text"
                  value={block.props.currency || '$'}
                  onChange={(e) => handlePropChange('currency', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={block.props.imageUrl || ''}
                  onChange={(e) => handlePropChange('imageUrl', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={block.props.buttonText || 'Add to Cart'}
                onChange={(e) => handlePropChange('buttonText', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
              <select
                value={block.props.layout || 'vertical'}
                onChange={(e) => handlePropChange('layout', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </div>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'video':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              value={block.props.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="https://example.com/video.mp4"
            />
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <label className="flex items-center text-sm">
              <input type="checkbox" checked={block.props.autoplay} onChange={(e) => handlePropChange('autoplay', e.target.checked)} className="mr-2" />
              Autoplay
            </label>
            <label className="flex items-center text-sm">
              <input type="checkbox" checked={block.props.controls} onChange={(e) => handlePropChange('controls', e.target.checked)} className="mr-2" />
              Controls
            </label>
          </div>
          {renderCommonProperties()}
        </>
      );

    case 'video':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={block.props.poster || ''}
              onChange={(e) => handlePropChange('poster', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Video Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Video description"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="controls"
              checked={block.props.controls !== false}
              onChange={(e) => handlePropChange('controls', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="controls" className="text-sm font-medium text-gray-700">
              Show Controls
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoplay"
              checked={block.props.autoplay || false}
              onChange={(e) => handlePropChange('autoplay', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="autoplay" className="text-sm font-medium text-gray-700">
              Autoplay
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="loop"
              checked={block.props.loop || false}
              onChange={(e) => handlePropChange('loop', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="loop" className="text-sm font-medium text-gray-700">
              Loop
            </label>
          </div>
        </>
      );

    case 'code':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={block.props.language || 'html'}
              onChange={(e) => handlePropChange('language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="sql">SQL</option>
              <option value="text">Text</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Code Block"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <textarea
              value={block.props.code || ''}
              onChange={(e) => handlePropChange('code', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono"
              rows={6}
              placeholder="Enter your code here..."
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLineNumbers"
              checked={block.props.showLineNumbers !== false}
              onChange={(e) => handlePropChange('showLineNumbers', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showLineNumbers" className="text-sm font-medium text-gray-700">
              Show Line Numbers
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCopyButton"
              checked={block.props.showCopyButton !== false}
              onChange={(e) => handlePropChange('showCopyButton', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showCopyButton" className="text-sm font-medium text-gray-700">
              Show Copy Button
            </label>
          </div>
        </>
      );

    case 'group':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Group Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Group description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#f8f9fa'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Color
            </label>
            <input
              type="color"
              value={block.props.borderColor || '#e5e7eb'}
              onChange={(e) => handlePropChange('borderColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Style
            </label>
            <select
              value={block.props.borderStyle || 'solid'}
              onChange={(e) => handlePropChange('borderStyle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding
            </label>
            <input
              type="text"
              value={block.props.padding || '20px'}
              onChange={(e) => handlePropChange('padding', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="20px"
            />
          </div>
        </>
      );

    case 'survey':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Survey Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Survey description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Submit Text
            </label>
            <input
              type="text"
              value={block.props.submitText || 'Submit Survey'}
              onChange={(e) => handlePropChange('submitText', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Submit Survey"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#f8f9fa'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Color
            </label>
            <input
              type="color"
              value={block.props.buttonColor || '#007bff'}
              onChange={(e) => handlePropChange('buttonColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showProgress"
              checked={block.props.showProgress !== false}
              onChange={(e) => handlePropChange('showProgress', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showProgress" className="text-sm font-medium text-gray-700">
              Show Progress
            </label>
          </div>
        </>
      );

    case 'countdown-timer':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="datetime-local"
              value={block.props.targetDate ? new Date(block.props.targetDate).toISOString().slice(0, 16) : ''}
              onChange={(e) => handlePropChange('targetDate', new Date(e.target.value).toISOString())}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Limited Time Offer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Hurry up! This offer expires soon."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#1f2937'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color
            </label>
            <input
              type="color"
              value={block.props.accentColor || '#ef4444'}
              onChange={(e) => handlePropChange('accentColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={block.props.format || 'detailed'}
              onChange={(e) => handlePropChange('format', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="compact">Compact</option>
              <option value="detailed">Detailed</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showDays"
                checked={block.props.showDays !== false}
                onChange={(e) => handlePropChange('showDays', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showDays" className="text-sm font-medium text-gray-700">
                Show Days
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showHours"
                checked={block.props.showHours !== false}
                onChange={(e) => handlePropChange('showHours', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showHours" className="text-sm font-medium text-gray-700">
                Show Hours
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showMinutes"
                checked={block.props.showMinutes !== false}
                onChange={(e) => handlePropChange('showMinutes', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showMinutes" className="text-sm font-medium text-gray-700">
                Show Minutes
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showSeconds"
                checked={block.props.showSeconds !== false}
                onChange={(e) => handlePropChange('showSeconds', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showSeconds" className="text-sm font-medium text-gray-700">
                Show Seconds
              </label>
            </div>
          </div>
        </>
      );

    case 'progress-bar':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="number"
              value={block.props.value || 0}
              onChange={(e) => handlePropChange('value', parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              min="0"
              max={block.props.max || 100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Value
            </label>
            <input
              type="number"
              value={block.props.max || 100}
              onChange={(e) => handlePropChange('max', parseInt(e.target.value) || 100)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Progress"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Current progress status"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress Color
            </label>
            <input
              type="color"
              value={block.props.progressColor || '#3b82f6'}
              onChange={(e) => handlePropChange('progressColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant
            </label>
            <select
              value={block.props.variant || 'default'}
              onChange={(e) => handlePropChange('variant', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="default">Default</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={block.props.size || 'medium'}
              onChange={(e) => handlePropChange('size', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="animated"
                checked={block.props.animated !== false}
                onChange={(e) => handlePropChange('animated', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="animated" className="text-sm font-medium text-gray-700">
                Animated
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="striped"
                checked={block.props.striped || false}
                onChange={(e) => handlePropChange('striped', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="striped" className="text-sm font-medium text-gray-700">
                Striped
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPercentage"
                checked={block.props.showPercentage !== false}
                onChange={(e) => handlePropChange('showPercentage', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showPercentage" className="text-sm font-medium text-gray-700">
                Show Percentage
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showValue"
                checked={block.props.showValue !== false}
                onChange={(e) => handlePropChange('showValue', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showValue" className="text-sm font-medium text-gray-700">
                Show Value
              </label>
            </div>
          </div>
        </>
      );

    case 'product':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Product Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Product description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="text"
              value={block.props.price || ''}
              onChange={(e) => handlePropChange('price', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="99.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Price
            </label>
            <input
              type="text"
              value={block.props.originalPrice || ''}
              onChange={(e) => handlePropChange('originalPrice', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="149.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              value={block.props.currency || '$'}
              onChange={(e) => handlePropChange('currency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="$"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={block.props.imageUrl || ''}
              onChange={(e) => handlePropChange('imageUrl', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={block.props.buttonText || ''}
              onChange={(e) => handlePropChange('buttonText', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Buy Now"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button URL
            </label>
            <input
              type="url"
              value={block.props.buttonUrl || ''}
              onChange={(e) => handlePropChange('buttonUrl', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={block.props.layout || 'vertical'}
              onChange={(e) => handlePropChange('layout', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Color
            </label>
            <input
              type="color"
              value={block.props.buttonColor || '#3b82f6'}
              onChange={(e) => handlePropChange('buttonColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Color
            </label>
            <input
              type="color"
              value={block.props.priceColor || '#059669'}
              onChange={(e) => handlePropChange('priceColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showOriginalPrice"
                checked={block.props.showOriginalPrice !== false}
                onChange={(e) => handlePropChange('showOriginalPrice', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showOriginalPrice" className="text-sm font-medium text-gray-700">
                Show Original Price
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showButton"
                checked={block.props.showButton !== false}
                onChange={(e) => handlePropChange('showButton', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showButton" className="text-sm font-medium text-gray-700">
                Show Button
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showDescription"
                checked={block.props.showDescription !== false}
                onChange={(e) => handlePropChange('showDescription', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showDescription" className="text-sm font-medium text-gray-700">
                Show Description
              </label>
            </div>
          </div>
        </>
      );

    case 'promo-code':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Special Offer!"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Use this promo code to get an amazing discount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={block.props.code || ''}
              onChange={(e) => handlePropChange('code', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="SAVE20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount
            </label>
            <input
              type="text"
              value={block.props.discount || ''}
              onChange={(e) => handlePropChange('discount', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="20% OFF"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Until
            </label>
            <input
              type="date"
              value={block.props.validUntil || ''}
              onChange={(e) => handlePropChange('validUntil', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={block.props.buttonText || ''}
              onChange={(e) => handlePropChange('buttonText', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Copy Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={block.props.layout || 'vertical'}
              onChange={(e) => handlePropChange('layout', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Style
            </label>
            <select
              value={block.props.borderStyle || 'dashed'}
              onChange={(e) => handlePropChange('borderStyle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animation
            </label>
            <select
              value={block.props.animation || 'pulse'}
              onChange={(e) => handlePropChange('animation', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="none">None</option>
              <option value="pulse">Pulse</option>
              <option value="bounce">Bounce</option>
              <option value="shake">Shake</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#f8fafc'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Background Color
            </label>
            <input
              type="color"
              value={block.props.codeBackgroundColor || '#1e293b'}
              onChange={(e) => handlePropChange('codeBackgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Color
            </label>
            <input
              type="color"
              value={block.props.buttonColor || '#3b82f6'}
              onChange={(e) => handlePropChange('buttonColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCopyButton"
                checked={block.props.showCopyButton !== false}
                onChange={(e) => handlePropChange('showCopyButton', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showCopyButton" className="text-sm font-medium text-gray-700">
                Show Copy Button
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showValidUntil"
                checked={block.props.showValidUntil !== false}
                onChange={(e) => handlePropChange('showValidUntil', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showValidUntil" className="text-sm font-medium text-gray-700">
                Show Valid Until
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showDiscount"
                checked={block.props.showDiscount !== false}
                onChange={(e) => handlePropChange('showDiscount', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showDiscount" className="text-sm font-medium text-gray-700">
                Show Discount
              </label>
            </div>
          </div>
        </>
      );

    case 'price':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Pro Plan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={block.props.description || ''}
              onChange={(e) => handlePropChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
              placeholder="Perfect for growing businesses"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="text"
              value={block.props.price || ''}
              onChange={(e) => handlePropChange('price', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="29"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original Price
            </label>
            <input
              type="text"
              value={block.props.originalPrice || ''}
              onChange={(e) => handlePropChange('originalPrice', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="49"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <input
              type="text"
              value={block.props.currency || '$'}
              onChange={(e) => handlePropChange('currency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="$"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <input
              type="text"
              value={block.props.period || ''}
              onChange={(e) => handlePropChange('period', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="/month"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (one per line)
            </label>
            <textarea
              value={block.props.features?.join('\n') || ''}
              onChange={(e) => handlePropChange('features', e.target.value.split('\n').filter(f => f.trim()))}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={4}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={block.props.buttonText || ''}
              onChange={(e) => handlePropChange('buttonText', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Get Started"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button URL
            </label>
            <input
              type="url"
              value={block.props.buttonUrl || ''}
              onChange={(e) => handlePropChange('buttonUrl', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={block.props.layout || 'vertical'}
              onChange={(e) => handlePropChange('layout', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={block.props.size || 'medium'}
              onChange={(e) => handlePropChange('size', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color
            </label>
            <input
              type="color"
              value={block.props.accentColor || '#3b82f6'}
              onChange={(e) => handlePropChange('accentColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Color
            </label>
            <input
              type="color"
              value={block.props.buttonColor || '#3b82f6'}
              onChange={(e) => handlePropChange('buttonColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="popular"
                checked={block.props.popular || false}
                onChange={(e) => handlePropChange('popular', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                Popular Plan
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showOriginalPrice"
                checked={block.props.showOriginalPrice !== false}
                onChange={(e) => handlePropChange('showOriginalPrice', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showOriginalPrice" className="text-sm font-medium text-gray-700">
                Show Original Price
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showFeatures"
                checked={block.props.showFeatures !== false}
                onChange={(e) => handlePropChange('showFeatures', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showFeatures" className="text-sm font-medium text-gray-700">
                Show Features
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showButton"
                checked={block.props.showButton !== false}
                onChange={(e) => handlePropChange('showButton', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showButton" className="text-sm font-medium text-gray-700">
                Show Button
              </label>
            </div>
          </div>
        </>
      );

    case 'testimonial':
      return (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote
            </label>
            <textarea
              value={block.props.quote || ''}
              onChange={(e) => handlePropChange('quote', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="This product has completely transformed our workflow..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={block.props.author || ''}
              onChange={(e) => handlePropChange('author', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={block.props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="CEO"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={block.props.company || ''}
              onChange={(e) => handlePropChange('company', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              value={block.props.avatarUrl || ''}
              onChange={(e) => handlePropChange('avatarUrl', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <input
              type="number"
              value={block.props.rating || 0}
              onChange={(e) => handlePropChange('rating', parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout
            </label>
            <select
              value={block.props.layout || 'vertical'}
              onChange={(e) => handlePropChange('layout', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <select
              value={block.props.size || 'medium'}
              onChange={(e) => handlePropChange('size', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alignment
            </label>
            <select
              value={block.props.alignment || 'left'}
              onChange={(e) => handlePropChange('alignment', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={block.props.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quote Color
            </label>
            <input
              type="color"
              value={block.props.quoteColor || '#374151'}
              onChange={(e) => handlePropChange('quoteColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accent Color
            </label>
            <input
              type="color"
              value={block.props.accentColor || '#3b82f6'}
              onChange={(e) => handlePropChange('accentColor', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showAvatar"
                checked={block.props.showAvatar !== false}
                onChange={(e) => handlePropChange('showAvatar', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showAvatar" className="text-sm font-medium text-gray-700">
                Show Avatar
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showRating"
                checked={block.props.showRating !== false}
                onChange={(e) => handlePropChange('showRating', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showRating" className="text-sm font-medium text-gray-700">
                Show Rating
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTitle"
                checked={block.props.showTitle !== false}
                onChange={(e) => handlePropChange('showTitle', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showTitle" className="text-sm font-medium text-gray-700">
                Show Title
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCompany"
                checked={block.props.showCompany !== false}
                onChange={(e) => handlePropChange('showCompany', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showCompany" className="text-sm font-medium text-gray-700">
                Show Company
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showQuote"
                checked={block.props.showQuote !== false}
                onChange={(e) => handlePropChange('showQuote', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showQuote" className="text-sm font-medium text-gray-700">
                Show Quote
              </label>
            </div>
          </div>
        </>
      );

    // Fallback for all other blocks - ensure they at least get the common props
    default:
      return (
        <>
          <div className="p-2 mb-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            Generic properties enabled for {block.type}
          </div>
          {renderCommonProperties()}
        </>
      );
  }
}
