import React, { useState, useRef } from 'react';
import { useAssetStore } from '../../store/assetStore';
import { X, Upload, Image as ImageIcon, Trash2, Search } from 'lucide-react';

export const AssetManager: React.FC = () => {
  const { 
    isOpen, 
    closeModal, 
    assets, 
    addAsset, 
    removeAsset,
    onSelectCallback 
  } = useAssetStore((state) => ({
    isOpen: state.isModalOpen,
    closeModal: state.closeModal,
    assets: state.assets,
    addAsset: state.addAsset,
    removeAsset: state.removeAsset,
    onSelectCallback: state.onSelectCallback
  }));

  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        addAsset({
          url: result,
          name: file.name,
          type: file.type,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    });

    setActiveTab('library');
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Asset Manager
          </h2>
          <button 
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'library' 
                ? 'bg-white border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('library')}
          >
            Library
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload' 
                ? 'bg-white border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50/50 p-6">
          {activeTab === 'library' ? (
            <div className="h-full flex flex-col">
              {/* Search Bar */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto">
                {filteredAssets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                    <p>No assets found</p>
                    <button 
                      onClick={() => setActiveTab('upload')}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Upload some images
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                      <div 
                        key={asset.id}
                        className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer aspect-square"
                        onClick={() => {
                          if (onSelectCallback) {
                            onSelectCallback(asset.url);
                            closeModal();
                          }
                        }}
                      >
                        <img 
                          src={asset.url} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-2">
                          <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                            <p className="text-white text-xs truncate mb-1">{asset.name}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-white/70 text-[10px]">{formatSize(asset.size)}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if(confirm('Delete this asset?')) removeAsset(asset.id);
                                }}
                                className="p-1 hover:bg-white/20 rounded text-white/70 hover:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Checked indicator if this would act as a picker (optional visual cue) */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                               Select
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div 
              className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Upload className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Click or Drop Images Here
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm text-center">
                Supports JPG, PNG, GIF, WEBP. Images will be saved to your local library.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Select Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t text-xs text-gray-400 text-center">
          Assets are stored locally in your browser. Clearing cache will remove them.
        </div>
      </div>
    </div>
  );
};
