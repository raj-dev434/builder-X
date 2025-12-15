import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { exportToHTML } from '../../exporters/htmlExporter';
import { exportToJSON } from '../../exporters/jsonExporter';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { blocks } = useCanvasStore();
  const [exportType, setExportType] = useState<'html' | 'json'>('html');
  const [exportedContent, setExportedContent] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportError('');

    try {
      if (exportType === 'html') {
        const html = exportToHTML(blocks);
        setExportedContent(html);
      } else {
        const json = exportToJSON(blocks);
        setExportedContent(json);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Export failed. Please try again.');
      setExportedContent('');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportedContent) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `builderx-export-${timestamp}.${exportType === 'html' ? 'html' : 'json'}`;

    const blob = new Blob([exportedContent], {
      type: exportType === 'html' ? 'text/html;charset=utf-8' : 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedContent);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  React.useEffect(() => {
    if (blocks.length > 0) {
      handleExport();
    }
  }, [exportType, blocks]);

  const handleExportTypeChange = (type: 'html' | 'json') => {
    setExportType(type);
    setExportError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]" data-testid="export-modal">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Export Page</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => handleExportTypeChange('html')}
              className={`px-4 py-2 rounded-md transition-colors ${exportType === 'html'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Export as HTML
            </button>
            <button
              onClick={() => handleExportTypeChange('json')}
              className={`px-4 py-2 rounded-md transition-colors ${exportType === 'json'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Export as JSON
            </button>
          </div>

          {exportError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{exportError}</p>
            </div>
          )}

          {isExporting && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-600 text-sm">Generating export...</p>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                {exportType === 'html' ? 'HTML Output' : 'JSON Schema'}
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  disabled={!exportedContent || isExporting}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!exportedContent || isExporting}
                  className="px-3 py-1 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={exportedContent}
              readOnly
              className="flex-1 p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-none min-h-[400px]"
              placeholder="Export content will appear here..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {exportType === 'html' ? (
              <div>
                <p className="mb-2">
                  <strong>HTML Export Features:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>CSP-safe with no external dependencies</li>
                  <li>Responsive design with mobile breakpoints</li>
                  <li>Semantic HTML5 markup</li>
                  <li>Inline styles for maximum compatibility</li>
                  <li>Rich text formatting preserved</li>
                  <li>Print-friendly styles included</li>
                </ul>
              </div>
            ) : (
              <div>
                <p className="mb-2">
                  <strong>JSON Schema Features:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Complete page structure representation</li>
                  <li>All block properties and styling</li>
                  <li>Nested layout hierarchy preserved</li>
                  <li>Can be used to recreate layouts programmatically</li>
                  <li>Compatible with BuilderX import functionality</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
