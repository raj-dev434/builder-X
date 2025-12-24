import React from 'react';
import { Block } from '../../schema/types';
import {
  PropertySection,
  ControlGroup,
  UnitControl,
  inputClasses,
  SpacingGroup,
  DimensionsGroup,
  BackgroundGroup,
  BorderGroup,
  EffectsGroup,
  LayoutGroup,
  TypographyGroup,
  AdvancedPanel
} from './BlockInspectors';
import { AlignLeft, AlignCenter, AlignRight, RotateCcw, X } from 'lucide-react';

interface InspectorProps {
  block: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  activeTab: 'content' | 'style' | 'advanced';
}

// Helper to handle both single key-value and object updates
const createUpdateHandler = (block: Block, updateBlock: (id: string, updates: Partial<Block>) => void) => {
  return (key: string | Record<string, any>, value?: any) => {
    const props = block.props || {};
    if (typeof key === 'object') {
      updateBlock(block.id, { props: { ...props, ...key } });
    } else {
      updateBlock(block.id, { props: { ...props, [key]: value } });
    }
  };
};

export const RowBlockInspector: React.FC<InspectorProps> = ({ block, updateBlock, activeTab }) => {
  const handleUpdate = createUpdateHandler(block, updateBlock);

  if (activeTab === 'content') {
    return (
      <div className="space-y-4 p-4">
        <LayoutGroup block={block} onChange={handleUpdate} />
      </div>
    );
  }

  if (activeTab === 'style') {
    return (
      <div className="space-y-4 p-4">
        <DimensionsGroup block={block} onChange={handleUpdate} />
        <SpacingGroup block={block} onChange={handleUpdate} />
        <BackgroundGroup block={block} onChange={handleUpdate} />
        <BorderGroup block={block} onChange={handleUpdate} />
        <EffectsGroup block={block} onChange={handleUpdate} />
      </div>
    );
  }

  if (activeTab === 'advanced') {
    return <AdvancedPanel block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />;
  }

  return null;
};

export const ColumnBlockInspector: React.FC<InspectorProps> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const handleUpdate = createUpdateHandler(block, updateBlock);

  if (activeTab === 'content') {
    return (
      <div className="space-y-4 p-4">
        <PropertySection title="Column Layout" icon={AlignLeft} defaultOpen={true}>
          <ControlGroup label="Width">
            <UnitControl
              value={props.width}
              onChange={(val) => handleUpdate('width', val)}
              placeholder="auto"
            />
          </ControlGroup>
          <ControlGroup label="Flex">
            <UnitControl
              value={props.flex}
              onChange={(val) => handleUpdate('flex', val)}
              placeholder="1"
            />
          </ControlGroup>
        </PropertySection>
        <LayoutGroup block={block} onChange={handleUpdate} />
      </div>
    );
  }

  if (activeTab === 'style') {
    return (
      <div className="space-y-4 p-4">
        <SpacingGroup block={block} onChange={handleUpdate} />
        <BackgroundGroup block={block} onChange={handleUpdate} />
        <BorderGroup block={block} onChange={handleUpdate} />
        <EffectsGroup block={block} onChange={handleUpdate} />
      </div>
    );
  }

  if (activeTab === 'advanced') {
    return <AdvancedPanel block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />;
  }

  return null;
};

export const TextBlockInspector: React.FC<InspectorProps> = ({ block, updateBlock, activeTab }) => {
  const props = block.props as any;
  const handleUpdate = createUpdateHandler(block, updateBlock);

  // Helper functions for formatting detection and toggling
  const hasFormatting = (tag: string): boolean => {
    const content = props.content || '';
    const regex = new RegExp(`<${tag}[^>]*>`, 'i');
    return regex.test(content);
  };

  const toggleFormatting = (tag: string, closingTag?: string) => {
    const content = props.content || 'Sample Text';
    const close = closingTag || tag;
    const openRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
    const closeRegex = new RegExp(`</${close}>`, 'gi');

    if (hasFormatting(tag)) {
      // Remove formatting
      const newContent = content.replace(openRegex, '').replace(closeRegex, '');
      handleUpdate('content', newContent);
    } else {
      // Add formatting
      const newContent = `<${tag}>${content}</${close}>`;
      handleUpdate('content', newContent);
    }
  };

  const clearAllFormatting = () => {
    const content = props.content || '';
    // Strip all HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    handleUpdate('content', plainText);
  };

  if (activeTab === 'content') {
    return (
      <div className="space-y-4 p-4">
        <PropertySection title="Text Content" icon={AlignLeft} defaultOpen={true}>
          <div className="space-y-2">
            <label className="text-[11px] font-medium text-gray-300 uppercase tracking-wider">Content</label>
            <textarea
              value={props.content || 'Sample Text'}
              onChange={(e) => handleUpdate('content', e.target.value)}
              className={`${inputClasses} h-24 resize-y w-full`}
            />
          </div>

          <ControlGroup label="Alignment">
            <div className="flex items-center gap-2">
              <div className="flex bg-[#1a1d21] rounded p-0.5 border border-[#3e444b]">
                {['flex-start', 'center', 'flex-end'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleUpdate('alignSelf', align)}
                    className={`p-1.5 rounded-sm transition-colors ${props.alignSelf === align ? 'bg-[#3b82f6] text-white' : 'text-gray-400 hover:text-white'}`}
                    title={align === 'flex-start' ? 'Left' : align === 'center' ? 'Center' : 'Right'}
                  >
                    {align === 'flex-start' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'flex-end' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleUpdate('alignSelf', undefined)}
                className="p-1.5 bg-[#15181b] hover:bg-[#1a1d21] text-gray-400 hover:text-white border border-[#2d3237] rounded-sm transition-colors"
                title="Reset Alignment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </ControlGroup>
        </PropertySection>

        <PropertySection title="Text Formatting" icon={AlignLeft}>
          <div className="space-y-3">
            <ControlGroup label="Text Style">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => toggleFormatting('strong')}
                  className={`px-2 py-1.5 text-xs font-bold border border-[#2d3237] rounded-sm transition-colors ${hasFormatting('strong')
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#15181b] hover:bg-[#1a1d21] text-gray-300'
                    }`}
                  title="Bold (Toggle)"
                >
                  B
                </button>
                <button
                  onClick={() => toggleFormatting('em')}
                  className={`px-2 py-1.5 text-xs italic border border-[#2d3237] rounded-sm transition-colors ${hasFormatting('em')
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#15181b] hover:bg-[#1a1d21] text-gray-300'
                    }`}
                  title="Italic (Toggle)"
                >
                  I
                </button>
                <button
                  onClick={() => toggleFormatting('u')}
                  className={`px-2 py-1.5 text-xs underline border border-[#2d3237] rounded-sm transition-colors ${hasFormatting('u')
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#15181b] hover:bg-[#1a1d21] text-gray-300'
                    }`}
                  title="Underline (Toggle)"
                >
                  U
                </button>
                <button
                  onClick={() => toggleFormatting('s')}
                  className={`px-2 py-1.5 text-xs line-through border border-[#2d3237] rounded-sm transition-colors ${hasFormatting('s')
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#15181b] hover:bg-[#1a1d21] text-gray-300'
                    }`}
                  title="Strikethrough (Toggle)"
                >
                  S
                </button>
              </div>
            </ControlGroup>

            <ControlGroup label="Lists">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const content = props.content || 'Sample Text';
                    if (hasFormatting('ul')) {
                      const newContent = content.replace(/<\/?ul[^>]*>/gi, '').replace(/<\/?li[^>]*>/gi, '');
                      handleUpdate('content', newContent);
                    } else {
                      const newContent = `<ul><li>${content}</li></ul>`;
                      handleUpdate('content', newContent);
                    }
                  }}
                  className={`px-2 py-1.5 text-xs border border-[#2d3237] rounded-sm transition-colors ${hasFormatting('ul')
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#15181b] hover:bg-[#1a1d21] text-gray-300'
                    }`}
                  title="Bullet List (Toggle)"
                >
                  • List
                </button>
                <button
                  onClick={() => {
                    const content = props.content || 'Sample Text';
                    if (hasFormatting('ol')) {
                      const newContent = content.replace(/<\/?ol[^>]*>/gi, '').replace(/<\/?li[^>]*>/gi, '');
                      handleUpdate('content', newContent);
                    } else {
                      const newContent = `<ol><li>${content}</li></ol>`;
                      handleUpdate('content', newContent);
                    }
                  }}
                  className={`px-2 py-1.5 text-xs border border-[#2d3237] rounded-sm transition-colors ${hasFormatting('ol')
                      ? 'bg-[#3b82f6] text-white'
                      : 'bg-[#15181b] hover:bg-[#1a1d21] text-gray-300'
                    }`}
                  title="Numbered List (Toggle)"
                >
                  1. List
                </button>
              </div>
            </ControlGroup>

            <div className="pt-2 border-t border-[#3e444b]">
              <button
                onClick={clearAllFormatting}
                className="w-full px-3 py-2 text-xs font-medium bg-[#15181b] hover:bg-[#1a1d21] text-gray-300 hover:text-white border border-[#2d3237] rounded-sm transition-colors flex items-center justify-center gap-2"
                title="Remove all formatting"
              >
                <X className="w-3.5 h-3.5" />
                Clear All Formatting
              </button>
            </div>
          </div>
        </PropertySection>
      </div>
    );
  }

  if (activeTab === 'style') {
    return (
      <div className="space-y-4 p-4">
        <TypographyGroup block={block} onChange={handleUpdate} />
        <SpacingGroup block={block} onChange={handleUpdate} />
        <DimensionsGroup block={block} onChange={handleUpdate} />
        <BackgroundGroup block={block} onChange={handleUpdate} />
        <BorderGroup block={block} onChange={handleUpdate} />
        <EffectsGroup block={block} onChange={handleUpdate} />
      </div>
    );
  }

  if (activeTab === 'advanced') {
    return <AdvancedPanel block={block} onUpdate={(updates) => updateBlock(block.id, updates)} />;
  }

  return null;
};
