import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';

import { importFromJSON } from '../../exporters/jsonExporter';

interface ImportModalProps {
    onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
    const { loadCanvas } = useCanvasStore();
    const [jsonContent, setJsonContent] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleImport = () => {
        setError('');

        if (!jsonContent.trim()) {
            setError('Please enter JSON content');
            return;
        }

        try {
            const blocks = importFromJSON(jsonContent);
            loadCanvas(blocks);
            setSuccess(true);

            // Close after a short delay to show success state
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err) {
            console.error('Import error:', err);
            setError(err instanceof Error ? err.message : 'Invalid JSON format');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Import Layout</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-green-600 text-sm">Layout imported successfully!</p>
                        </div>
                    )}

                    <div className="flex-1 flex flex-col space-y-4">
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const content = e.target?.result as string;
                                            setJsonContent(content);
                                            setError('');
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm font-medium text-gray-700">Click to upload JSON file</p>
                            <p className="text-xs text-gray-500">or drag and drop</p>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-sm text-gray-500">OR</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Paste JSON Configuration
                            </label>
                            <textarea
                                value={jsonContent}
                                onChange={(e) => setJsonContent(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-md font-mono text-sm bg-gray-50 resize-vertical min-h-[200px]"
                                placeholder='[{"id":"...", "type":"section", ...}]'
                                disabled={success}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={success}
                        className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Import Layout
                    </button>
                </div>
            </div>
        </div>
    );
};
