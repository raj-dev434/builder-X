import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

interface TemplateModalProps {
    onClose: () => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ onClose }) => {
    const { savedTemplates, loadTemplate, deleteTemplate } = useCanvasStore();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[80vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">Saved Templates</h2>

                <div className="flex-1 overflow-y-auto pr-2">
                    {savedTemplates.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No saved templates yet.</p>
                            <p className="text-sm mt-2">Select a block and click "Save Template" to create one.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedTemplates.map((template) => (
                                <div
                                    key={template.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors group relative"
                                >
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            loadTemplate(template.id);
                                            onClose();
                                        }}
                                    >
                                        <div className="font-medium text-gray-900 mb-2">{template.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {template.blocks.length} block(s)
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this template?')) {
                                                deleteTemplate(template.id);
                                            }
                                        }}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Template"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
