import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { Block } from '../../schema/types';
import {
  Edit2,
  Palette,
  Settings,
  RotateCcw
} from 'lucide-react';

// All inspectors consolidated in one file
import {
  // Shared Components (now exported)
  AdvancedPanel,
  StyleEditor,

  // Standardized (Tab-aware) Inspectors
  SectionBlockInspector,
  // Row/Column/Text moved to StandardInspectors
  ImageBlockInspector,
  ButtonBlockInspector,
  // Legacy Inspectors
  ImageBoxBlockInspector,

  MapBlockInspector,
  IconBlockInspector,
  VideoBlockInspector,
  FormBlockInspector,
  SurveyBlockInspector,
  SocialFollowBlockInspector,
  SpecificDividerInspector,
  SpacerBlockInspector,
  ContainerBlockInspector,
  CodeBlockInspector,
  HeadingBlockInspector,
  LinkBlockInspector,
  LinkBoxBlockInspector,
  InputBlockInspector,
  TextareaBlockInspector,
  SelectBlockInspector,
  CheckboxBlockInspector,
  RadioBlockInspector,
  CountdownTimerBlockInspector,
  ProgressBarBlockInspector,
  ProductBlockInspector,
  PromoCodeBlockInspector,
  PriceBlockInspector,
  TestimonialBlockInspector,
  NavbarBlockInspector,
  FlexBlockInspector,
  CardBlockInspector,
  BadgeBlockInspector,
  AlertBlockInspector,
  LabelBlockInspector,
  ProgressBlockInspector,
  InvoiceBlockInspector,
  GroupBlockInspector,
  GridBlockInspector,
  ElementorHeadingInspector
} from './BlockInspectors';

import {
  RowBlockInspector,
  ColumnBlockInspector,
  TextBlockInspector
} from './StandardInspectors';

export const Inspector: React.FC = () => {
  const {
    blocks,
    selectedBlockIds,
    updateBlock
  } = useCanvasStore();


  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced' | 'responsive' | 'animation'>('content');

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


  const tabs = [
    { id: 'content', label: 'Content', icon: <Edit2 className="w-4 h-4" /> },
    { id: 'style', label: 'Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings className="w-4 h-4" /> },
  ] as const;

  const getBlockTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // List of blocks that have fully modularized inspectors handling all tabs
  const modularBlocks = ['section', 'row', 'column', 'text', 'image', 'button', 'divider', 'heading', 'testimonial', 'navbar', 'card', 'badge', 'alert', 'code', 'promo-code', 'flex'];
  const isModular = modularBlocks.includes(selectedBlock.type);

  return (
    <div className="w-80 h-full flex flex-col bg-[#262a2e] text-white border-l border-[#3e444b] select-none" data-testid="inspector">
      {/* Header */}
      <div className="flex flex-col bg-[#262a2e] border-b border-[#3e444b] shadow-sm relative z-10">
        <div className="flex items-center justify-between px-4 py-3 bg-[#1e2227]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg text-white font-bold ring-1 ring-blue-500/50">
              <Edit2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Editing</span>
              <h2 className="text-sm font-bold text-gray-100 leading-none">
                {getBlockTitle(selectedBlock.type)}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset this block to defaults?')) {
                  updateBlock(selectedBlock.id, { props: {} });
                }
              }}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-[#32373d] transition-all"
              title="Reset to Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="flex px-1 pt-1 bg-[#1e2227]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 relative group transition-colors ${activeTab === tab.id
                ? 'text-white bg-[#262a2e] rounded-t-md'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#262a2e]/50 rounded-t-lg'
                }`}
            >
              <div className={`flex items-center gap-2 ${activeTab === tab.id ? 'transform -translate-y-0.5' : ''} transition-transform`}>
                {React.cloneElement(tab.icon as any, {
                  className: `w-3.5 h-3.5 ${activeTab === tab.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}`
                })}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === tab.id ? 'text-gray-200' : 'text-gray-500 group-hover:text-gray-400'}`}>
                  {tab.label}
                </span>
              </div>
              {/* Active Indicator Line */}
              {activeTab === tab.id && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#262a2e]">
        {/* For modular blocks, delegate entirely to the inspector */}
        {isModular && (
          <div className="p-0">
            {renderPropertyFields(selectedBlock, updateBlock, activeTab as any)}
          </div>
        )}

        {/* For legacy blocks, use hybrid approach */}
        {!isModular && (
          <>
            {activeTab === 'content' && (
              <div className="p-0">
                {renderPropertyFields(selectedBlock, updateBlock, 'content')}
              </div>
            )}

            {activeTab === 'style' && (
              <StyleEditor block={selectedBlock} onUpdate={(updates) => updateBlock(selectedBlock.id, updates)} />
            )}

            {activeTab === 'advanced' && (
              <AdvancedPanel block={selectedBlock} onUpdate={(updates) => updateBlock(selectedBlock.id, updates)} />
            )}
          </>
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

function renderPropertyFields(
  block: Block,
  updateBlock: (id: string, updates: Partial<Block>) => void,
  activeTab: 'content' | 'style' | 'advanced'
) {
  switch (block.type) {
    // Modular Inspectors (Tab-aware)
    case 'section':
      return <SectionBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'row':
      return <RowBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'column':
      return <ColumnBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'text':
      return <TextBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'image':
      return <ImageBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'button':
      return <ButtonBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;

    // Legacy Inspectors (Now tab-aware)
    case 'progress':
      return <ProgressBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'promo-code':
      return <PromoCodeBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'code':
      return <CodeBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'map':
      return <MapBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'divider':
      return <SpecificDividerInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'spacer':
      return <SpacerBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'heading':
      return <HeadingBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'link':
      return <LinkBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'link-box':
      return <LinkBoxBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'input':
      return <InputBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'textarea':
      return <TextareaBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'select':
      return <SelectBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'checkbox':
      return <CheckboxBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'radio':
      return <RadioBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'flex':
      return <FlexBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'label':
      return <LabelBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'image-box':
      return <ImageBoxBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'icon':
      return <IconBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'form':
      return <FormBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'survey':
      return <SurveyBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'social-follow':
      return <SocialFollowBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'video':
      return <VideoBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'countdown-timer':
      return <CountdownTimerBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'progress-bar':
      return <ProgressBarBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'product':
      return <ProductBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'testimonial':
      return <TestimonialBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'price':
      return <PriceBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'navbar':
      return <NavbarBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'invoice':
      return <InvoiceBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'card':
      return <CardBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'badge':
      return <BadgeBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'alert':
      return <AlertBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'container':
      return <ContainerBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'group':
      return <GroupBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'grid':
      return <GridBlockInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    case 'elementor-heading':
      return <ElementorHeadingInspector block={block} updateBlock={updateBlock} activeTab={activeTab} />;
    default:
      return (
        <div className="p-4">
          <p className="text-gray-400">Settings for {(block as any).type} are not yet integrated.</p>
        </div>
      );
  }
}
