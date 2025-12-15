import React, { useState, useId } from 'react';
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
  'Layout': ['row', 'column', '2-column', '3-column', '4-column', '5-column', 'container', 'group'],
  'Forms': ['form', 'input', 'textarea', 'select', 'checkbox', 'radio', 'label', 'button', 'survey'],
  'Invoice': ['invoice'],
  'Extra': ['navbar', 'card', 'badge', 'alert', 'progress', 'video', 'code', 'social-follow', 'countdown-timer', 'progress-bar', 'product', 'product-3-cols', 'product-5-cols', 'promo-code', 'price', 'testimonial'],
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
    new Set(Object.keys(COMPONENT_CATEGORIES)) // All categories open by default
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const containerTypes = ['section', 'row', 'column', 'container', 'group', 'card', 'box'];

  const findBlockInfo = (blocks: any[], id: string, parentId: string | null = null): { block: any, parentId: string | null, index: number } | null => {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].id === id) {
        return { block: blocks[i], parentId, index: i };
      }
      if (blocks[i].children) {
        const found = findBlockInfo(blocks[i].children, id, blocks[i].id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleClick = (template: typeof BLOCK_TEMPLATES[0]) => {
    // Add to recent
    addRecent(template);

    if (selectedBlockId) {
      const info = findBlockInfo(blocks, selectedBlockId);
      if (info) {
        const { block, parentId, index } = info;
        // If selected is a container, add inside at the end
        if (containerTypes.includes(block.type)) {
          const targetIndex = block.children ? block.children.length : 0;
          addBlock(template.block, block.id, targetIndex);
        } else {
          // Add as sibling after
          addBlock(template.block, parentId || undefined, index + 1);
        }
        return;
      }
    }
    // Fallback: Add to end of root
    addBlock(template.block);
  };

  const getTemplatesByCategory = (category: string) => {
    let templates: typeof BLOCK_TEMPLATES = [];

    if (category === 'Saved') {
      templates = savedTemplates;
    } else if (category === 'Recent') {
      templates = recentTemplates;
    } else if (category === 'Favorites') {
      templates = BLOCK_TEMPLATES.filter(t => favoriteBlockIds.includes(t.id));
    } else {
      const categoryIds = COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES] || [];
      templates = BLOCK_TEMPLATES.filter(template => categoryIds.includes(template.id));
    }

    // Filter by search query if provided
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
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Get all categories that have matching templates
  const getCategoriesWithResults = () => {
    return Object.keys(COMPONENT_CATEGORIES).filter(category => {
      const templates = getTemplatesByCategory(category);
      return templates.length > 0;
    });
  };

  // Auto-open categories with search results when searching
  React.useEffect(() => {
    if (searchQuery.trim()) {
      const categoriesWithResults = getCategoriesWithResults();
      if (categoriesWithResults.length > 0) {
        // Open all categories with results when searching
        setExpandedCategories(new Set(categoriesWithResults));
      }
    } else {
      // Keep all categories open when not searching
      setExpandedCategories(new Set(Object.keys(COMPONENT_CATEGORIES)));
    }
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col bg-gray-800" data-testid="js-sidebar" role="complementary" aria-label="Component Sidebar">
      {/* Header with Blocks title and controls */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-200" id="sidebar-title">Blocks</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        {/* Search Input */}
        <div className="relative">
          <label htmlFor={searchInputId} className="sr-only">Search components</label>
          <input
            id={searchInputId}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pr-8 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            role="searchbox"
            aria-label="Search components"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              title="Clear search"
              aria-label="Clear search"
              >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Components Accordion */}
      <div className="flex-1 overflow-y-auto" role="list" aria-labelledby="sidebar-title">
        {(() => {
          const categoriesWithResults = getCategoriesWithResults();

          // Show "No results" message if searching and no results found
          if (searchQuery.trim() && categoriesWithResults.length === 0) {
            return (
              <div className="flex items-center justify-center h-32 text-gray-400" role="status" aria-live="polite">
                <div className="text-center">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-sm">No blocks found</p>
                  <p className="text-xs text-gray-500">Try a different search term</p>
                </div>
              </div>
            );
          }

          // Show categories with results (filtered by search if applicable)
          const categoriesToShow = searchQuery.trim() ? categoriesWithResults : Object.keys(COMPONENT_CATEGORIES);

          return categoriesToShow.map((category) => {
            const isOpen = expandedCategories.has(category);
            const templates = getTemplatesByCategory(category);
            const categoryId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
            const contentId = `content-${category.toLowerCase().replace(/\s+/g, '-')}`;

            // Skip categories with no results when searching
            if (searchQuery.trim() && templates.length === 0) {
              if (category === 'Recent' || category === 'Favorites') return null;
            }

            // Hide dynamic categories if empty and not searching
            if ((category === 'Recent' || category === 'Favorites') && templates.length === 0 && !searchQuery.trim()) {
              return null;
            }

            return (
              <div key={category} className="border-b border-gray-700">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${isOpen ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  id={categoryId}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${isOpen ? 'text-white' : 'text-gray-300'
                      }`}>{category}</span>
                    {searchQuery.trim() && (
                      <span className="text-xs text-gray-500 bg-gray-600 px-2 py-1 rounded">
                        {templates.length}
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Category Content */}
                {isOpen && (
                  <div 
                    className="px-4 pb-4" 
                    id={contentId} 
                    role="region" 
                    aria-labelledby={categoryId}
                  >
                    <div className="grid grid-cols-2 gap-2" role="list">
                      {templates.map((template) => {
                        const isFav = isFavorite(template.id);
                        return (
                          <div key={template.id} className="relative group" role="listitem">
                            <DraggableBlock
                              template={template}
                              onClick={() => handleClick(template)}
                              categoryId={category}
                            />
                            
                            {/* Favorite Button (Star) */}
                            {/* Don't show for Saved templates as they are custom */}
                            {category !== 'Saved' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(template.id);
                                }}
                                className={`absolute top-1 right-1 w-5 h-5 flex items-center justify-center transition-all ${
                                  isFav 
                                    ? 'text-yellow-400 opacity-100' 
                                    : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-yellow-200'
                                }`}
                                title={isFav ? "Remove from favorites" : "Add to favorites"}
                                aria-label={isFav ? `Remove ${template.name} from favorites` : `Add ${template.name} to favorites`}
                                aria-pressed={isFav}
                              >
                                {isFav ? '★' : '☆'}
                              </button>
                            )}
  
                            {/* Delete button for Saved Templates */}
                            {category === 'Saved' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTemplate(template.id);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                title="Delete template"
                                aria-label={`Delete template ${template.name}`}
                              >
                                ×
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
