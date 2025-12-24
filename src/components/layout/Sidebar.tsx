import React, { useState, useId, useEffect } from 'react';
import { 
  Search, X, Box, Layers, Star, Clock, 
  Type, FileText, Zap, PlusCircle, ChevronDown, 
  Layout as LayoutIcon
} from 'lucide-react';
import { BLOCK_TEMPLATES } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';
import { DraggableBlock } from '../canvas/DraggableBlock';
import { useTemplateStore } from '../../store/templateStore';
import { useRecentStore } from '../../store/recentStore';
import { useFavoriteStore } from '../../store/favoriteStore';

const COMPONENT_CATEGORIES: Record<string, string[]> = {
  'Favorites': [], // Dynamic content
  'Recent': [], // Dynamic content
  'Basic': ['section', 'divider', 'heading', 'text', 'image', 'link', 'link-box', 'image-box', 'map', 'icon', 'spacer'],
  'Layout': ['row', 'grid', 'column', '2-column', '3-column', '4-column', '5-column', 'container', 'group'],
  'Forms': ['form', 'input', 'textarea', 'select', 'checkbox', 'radio', 'label', 'button', 'survey'],
  'Invoice': ['invoice'],
  //'Elementor': ['elementor-heading'],
  'Extra': ['navbar', 'card', 'badge', 'alert', 'progress', 'video', 'code', 'social-follow', 'countdown-timer', 'progress-bar', 'product', 'product-3-cols', 'product-5-cols', 'promo-code', 'price', 'testimonial'],
};

const CATEGORY_ICONS: Record<string, any> = {
  'Favorites': Star,
  'Recent': Clock,
  'Basic': Box,
  'Layout': LayoutIcon,
  'Forms': Type,
  'Invoice': FileText,
  'Elementor': Zap,
  'Extra': PlusCircle,
  'Saved': Layers
};

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { addBlock, selectedBlockIds, blocks } = useCanvasStore();
  const selectedBlockId = selectedBlockIds[0];
  const { savedTemplates, deleteTemplate } = useTemplateStore();
  const { recentTemplates, addRecent } = useRecentStore();
  const { favoriteBlockIds, toggleFavorite, isFavorite } = useFavoriteStore();
  const searchInputId = useId();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(COMPONENT_CATEGORIES))
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const containerTypes = ['section', 'row', 'column', 'container', 'group', 'card', 'box'];

  const findBlockInfo = (blocks: any[], id: string, parentId: string | null = null): { block: any, parentId: string | null, index: number } | null => {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) return { block: blocks[i], parentId, index: i };
        if (blocks[i].children) {
            const found = findBlockInfo(blocks[i].children, id, blocks[i].id);
            if (found) return found;
        }
    }
    return null;
  };

  const handleClick = (template: typeof BLOCK_TEMPLATES[0]) => {
    addRecent(template);
    if (selectedBlockId) {
      const info = findBlockInfo(blocks, selectedBlockId);
      if (info) {
        const { block, parentId, index } = info;
        if (containerTypes.includes(block.type)) {
          addBlock(template.block, block.id, block.children ? block.children.length : 0);
        } else {
          addBlock(template.block, parentId || undefined, index + 1);
        }
        return;
      }
    }
    addBlock(template.block);
  };

  const getTemplatesByCategory = (category: string) => {
    let templates: typeof BLOCK_TEMPLATES = [];
    if (category === 'Saved') templates = savedTemplates;
    else if (category === 'Recent') templates = recentTemplates;
    else if (category === 'Favorites') templates = BLOCK_TEMPLATES.filter(t => favoriteBlockIds.includes(t.id));
    else {
      const categoryIds = COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES] || [];
      templates = BLOCK_TEMPLATES.filter(template => categoryIds.includes(template.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.id.toLowerCase().includes(query) ||
        template.block.type.toLowerCase().includes(query)
      );
    }
    return templates;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };

  const getCategoriesWithResults = () => {
    return Object.keys(COMPONENT_CATEGORIES).filter(category => getTemplatesByCategory(category).length > 0);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = getCategoriesWithResults();
      if (results.length > 0) setExpandedCategories(new Set(results));
    } else {
      setExpandedCategories(new Set(Object.keys(COMPONENT_CATEGORIES)));
    }
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col bg-[#1e2227] border-r border-[#3e444b] overflow-hidden" data-testid="js-sidebar">
      {/* Header */}
      <div className="flex flex-col bg-[#1e2227] border-b border-[#3e444b] shadow-sm relative z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 flex items-center justify-center shadow-lg text-white ring-1 ring-purple-500/50">
                <Box className="w-4 h-4" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">Components</span>
               <h2 className="text-sm font-bold text-gray-100 leading-none">Elements</h2>
             </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-md transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Premium Search */}
        <div className="px-4 pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-[#15181b] hover:bg-[#1a1d21] text-gray-300 text-[11px] rounded-sm border border-[#2d3237] focus:border-purple-500/50 focus:bg-[#1a1d21] focus:ring-1 focus:ring-purple-500/10 outline-none transition-all placeholder:text-gray-700"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Accordion */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {(() => {
          const categoriesWithResults = getCategoriesWithResults();
          if (searchQuery.trim() && categoriesWithResults.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <Search className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-xs font-medium uppercase tracking-widest">No results found</p>
              </div>
            );
          }

          const categoriesToShow = searchQuery.trim() ? categoriesWithResults : Object.keys(COMPONENT_CATEGORIES);

          return categoriesToShow.map((category) => {
            const isOpen = expandedCategories.has(category);
            const templates = getTemplatesByCategory(category);
            const Icon = CATEGORY_ICONS[category] || Box;

            if ((category === 'Recent' || category === 'Favorites') && templates.length === 0 && !searchQuery.trim()) return null;

            return (
              <div key={category} className="border-b border-[#1e2227] last:border-b-0">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#2d3237] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-200'}`}>{category}</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="grid grid-cols-2 gap-2">
                      {templates.map((template) => {
                        const isFav = isFavorite(template.id);
                        return (
                          <div key={template.id} className="relative group/item">
                            <DraggableBlock 
                                template={template} 
                                onClick={() => handleClick(template)} 
                                categoryId={category} 
                            />
                            {category !== 'Saved' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(template.id); }}
                                className={`absolute top-1 right-1 w-5 h-5 flex items-center justify-center transition-all z-10 shrink-0 ${isFav ? 'text-yellow-400' : 'text-gray-600 opacity-0 group-hover/item:opacity-100 hover:text-yellow-400'}`}
                              >
                                <Star className={`w-2.5 h-2.5 ${isFav ? 'fill-current' : ''}`} />
                              </button>
                            )}
                            {category === 'Saved' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}
                                className="absolute top-1 right-1 w-4 h-4 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all text-[10px] z-10"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};
