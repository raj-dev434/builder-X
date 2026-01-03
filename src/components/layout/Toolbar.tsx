import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useAssetStore } from '../../store/assetStore';
import { ExportModal } from '../modals/ExportModal';
import { ImportModal } from '../modals/ImportModal';
import { TemplateModal } from '../modals/TemplateModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface ToolbarProps {
  onToggleComponents: () => void;
  componentsPanelOpen: boolean;
  onToggleLayers?: () => void;
  layersPanelOpen?: boolean;
  onToggleHistory?: () => void;
  historyPanelOpen?: boolean;
  onOpenPageSettings?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onToggleComponents,
  componentsPanelOpen,
  onToggleLayers,
  layersPanelOpen,
  onToggleHistory,
  historyPanelOpen,
  onOpenPageSettings
}) => {
  const {
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo,
    viewDevice,
    isPreviewMode,
    isFullscreen,
    setViewDevice,
    togglePreviewMode,
    toggleFullscreen,
    selectedBlockIds,
    deleteBlock,
    duplicateBlock,
    // Auto Save
    autoSave,
    toggleAutoSave,
    saveProject,
    isSaving,
    lastSaved,
    blocks // Subscribe to blocks changes
  } = useCanvasStore();
  const openAssetModal = useAssetStore((state) => state.openModal);

  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Auto-save logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (autoSave) {
      // Debounce save action
      timeoutId = setTimeout(() => {
        saveProject();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [blocks, autoSave]); // Listen to blocks changes

  // Click outside handler to close settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    if (showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  const handleSaveTemplate = () => {
    const blocks = useCanvasStore.getState().blocks;

    // Check if there are any blocks on the canvas
    if (blocks.length > 0) {
      const name = prompt('Enter template name:');
      if (name) {
        const { savedTemplates, updateTemplate, saveTemplate } = useCanvasStore.getState();
        const existingTemplate = savedTemplates.find(t => t.name === name);

        if (existingTemplate) {
          if (confirm(`Template "${name}" already exists. Do you want to overwrite it?`)) {
            updateTemplate(existingTemplate.id, name, blocks);
            alert(`Template "${name}" updated successfully!`);
          }
        } else {
          saveTemplate(name, blocks);
          alert(`Template "${name}" saved successfully with ${blocks.length} block(s)!`);
        }
      }
    } else {
      alert('Canvas is empty! Add blocks before saving a template.');
    }
  };

  // Keyboard shortcuts for undo/redo/copy/paste/delete/duplicate
  useKeyboardShortcuts([
    {
      key: 'z',
      ctrlKey: true,
      action: () => canUndo() && undo(),

      disabled: !canUndo()
    },
    {
      key: 'y',
      ctrlKey: true,
      action: () => canRedo() && redo(),
      disabled: !canRedo()
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      action: () => canRedo() && redo(),
      disabled: !canRedo()
    },
    {
      key: 'c',
      ctrlKey: true,
      action: () => {
        const selectedIds = useCanvasStore.getState().selectedBlockIds;
        if (selectedIds.length > 0) useCanvasStore.getState().copyBlock(selectedIds[0]);
      }
    },
    {
      key: 'x',
      ctrlKey: true,
      action: () => {
        const selectedIds = useCanvasStore.getState().selectedBlockIds;
        if (selectedIds.length > 0) {
          useCanvasStore.getState().copyBlock(selectedIds[0]);
          useCanvasStore.getState().deleteBlock(selectedIds[0]);
        }
      }
    },
    {
      key: 'v',
      ctrlKey: true,
      action: () => {
        const selectedIds = useCanvasStore.getState().selectedBlockIds;
        useCanvasStore.getState().pasteBlock(selectedIds.length > 0 ? selectedIds[0] : undefined);
      }
    },
    {
      key: 'Delete',
      action: () => {
        const selectedIds = useCanvasStore.getState().selectedBlockIds;
        selectedIds.forEach(id => useCanvasStore.getState().deleteBlock(id));
      }
    },

    {
      key: 'd',
      ctrlKey: true,
      preventDefault: true,
      action: () => {
        const selectedIds = useCanvasStore.getState().selectedBlockIds;
        selectedIds.forEach(id => useCanvasStore.getState().duplicateBlock(id));
      }
    }
  ]);

  return (
    <>
      <div
        className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between relative z-[50]"
        data-testid="grapejs-toolbar"
        role="toolbar"
        aria-label="Editor Toolbar"
      >
        {/* Left Section - Logo and Blocks Panel Toggle */}
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold text-gray-800" aria-label="BuilderX Logo">BuilderX</h1>

          {/* Add Block Toggle Button */}
          <button
            onClick={onToggleComponents}
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${componentsPanelOpen
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            title="Add Block"
            aria-label={componentsPanelOpen ? "Close block library" : "Open block library"}
            aria-expanded={componentsPanelOpen}
            aria-controls="js-sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {/* <span className="text-sm font-medium">Add block</span> */}
          </button>

          {/* Layers Toggle Button */}
          <button
            onClick={onToggleLayers}
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${layersPanelOpen
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            title="Layers"
            aria-label={layersPanelOpen ? "Close layers panel" : "Open layers panel"}
            aria-expanded={layersPanelOpen}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* <span className="text-sm font-medium">Layers</span> */}
          </button>

          {/* History Toggle Button */}
          <button
            onClick={onToggleHistory}
            className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${historyPanelOpen
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            title="History"
            aria-label={historyPanelOpen ? "Close history panel" : "Open history panel"}
            aria-expanded={historyPanelOpen}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {/* <span className="text-sm font-medium">History</span> */}
          </button>
        </div>

        {/* Center Section - Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Save Button */}
          <button
            onClick={() => saveProject()}
            disabled={isSaving}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${isSaving
              ? 'bg-gray-100 text-gray-500 cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
              }`}
            title="Save Project"
            aria-label="Save Project"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </>
            )}
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" role="separator"></div>

          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" role="separator"></div>

          <button
            onClick={() => selectedBlockIds.forEach(id => duplicateBlock(id))}
            disabled={selectedBlockIds.length === 0}
            className="p-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Duplicate Selected (Ctrl+D)"
            aria-label="Duplicate Selected Blocks"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </button>

          <button
            onClick={() => selectedBlockIds.forEach(id => deleteBlock(id))}
            disabled={selectedBlockIds.length === 0}
            className="p-2 text-sm bg-gray-100 hover:bg-red-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Delete Selected (Del)"
            aria-label="Delete Selected Blocks"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" role="separator"></div>

          {lastSaved && (
            <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded" role="status" aria-label="Save status">
              <span className="mr-1" aria-hidden="true">✓</span> Saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-md p-1" role="radiogroup" aria-label="Device View">
            <button
              onClick={() => setViewDevice('desktop')}
              className={`p-1.5 text-xs rounded transition-colors ${viewDevice === 'desktop'
                ? 'bg-white text-gray-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              title="Desktop View"
              role="radio"
              aria-checked={viewDevice === 'desktop'}
              aria-label="Desktop"
            >
              Desktop
            </button>
            <button
              onClick={() => setViewDevice('tablet')}
              className={`p-1.5 text-xs rounded transition-colors ${viewDevice === 'tablet'
                ? 'bg-white text-gray-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              title="Tablet View"
              role="radio"
              aria-checked={viewDevice === 'tablet'}
              aria-label="Tablet"
            >
              Tablet
            </button>
            <button
              onClick={() => setViewDevice('mobile')}
              className={`p-1.5 text-xs rounded transition-colors ${viewDevice === 'mobile'
                ? 'bg-white text-gray-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              title="Mobile View"
              role="radio"
              aria-checked={viewDevice === 'mobile'}
              aria-label="Mobile"
            >
              Mobile
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={togglePreviewMode}
              className={`p-2 text-sm rounded-md transition-colors ${isPreviewMode
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              title="Preview Mode"
              aria-label="Toggle Preview Mode"
              aria-pressed={isPreviewMode}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-2 text-sm rounded-md transition-colors ${isFullscreen
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              title="Fullscreen"
              aria-label="Toggle Fullscreen"
              aria-pressed={isFullscreen}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* Settings Button with Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={`p-2 text-sm rounded-md transition-colors ${showSettingsMenu
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              title="Settings"
              aria-label="Settings Menu"
              aria-haspopup="true"
              aria-expanded={showSettingsMenu}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Settings Dropdown Menu */}
            {showSettingsMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-[100]"
                style={{
                  animation: 'slideIn 200ms ease-out'
                }}
                role="menu"
                aria-orientation="vertical"
              >
                <style>{`
                  @keyframes slideIn {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>

                {/* Page Settings */}
                <button
                  onClick={() => {
                    if (onOpenPageSettings) onOpenPageSettings();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-lg group-hover:scale-110 transition-transform">⚙️</span>
                  </div>
                  <span className="flex-1">Page Settings</span>
                </button>

                <div className="border-t border-gray-200 my-1" role="separator"></div>

                {/* Auto Save Toggle */}
                <div
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  role="menuitem"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900" id="autosave-label">Auto Save</span>
                    <span className="text-xs text-gray-500">Save changes automatically</span>
                  </div>
                  <button
                    onClick={toggleAutoSave}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoSave ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    role="switch"
                    aria-checked={autoSave}
                    aria-labelledby="autosave-label"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autoSave ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200 my-1" role="separator"></div>

                {/* Import */}
                <button
                  onClick={() => {
                    setShowImportModal(true);
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <span className="flex-1">Import</span>
                </button>

                {/* Export */}
                <button
                  onClick={() => {
                    setShowExportModal(true);
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="flex-1">Export</span>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" role="separator"></div>

                {/* Load Template */}
                <button
                  onClick={() => {
                    setShowTemplateModal(true);
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                    <span className="text-lg group-hover:scale-110 transition-transform">📂</span>
                  </div>
                  <span className="flex-1">Load Template</span>
                </button>

                {/* Save Template */}
                <button
                  onClick={() => {
                    handleSaveTemplate();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                    <span className="text-lg group-hover:scale-110 transition-transform">💾</span>
                  </div>
                  <span className="flex-1">Save Template</span>
                </button>

                {/* Asset Manager */}
                <button
                  onClick={() => {
                    openAssetModal();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                    <span className="text-lg group-hover:scale-110 transition-transform">🖼️</span>
                  </div>
                  <span className="flex-1">Asset Manager</span>
                </button>


                {/* Clear Canvas */}
                <button
                  onClick={() => {
                    clearCanvas();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-150 flex items-center space-x-3 group"
                  role="menuitem"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5 group-hover:text-red-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <span className="flex-1">Canvas</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
      {showImportModal && (
        <ImportModal onClose={() => setShowImportModal(false)} />
      )}
      {showTemplateModal && (
        <TemplateModal onClose={() => setShowTemplateModal(false)} />
      )}

    </>
  );
};
