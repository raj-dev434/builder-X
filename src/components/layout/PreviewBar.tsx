import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const PreviewControlBar: React.FC = () => {
    const {
        viewDevice,
        setViewDevice,
        togglePreviewMode
    } = useCanvasStore();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Preview Settings"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    )}
                    {!isOpen && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-48 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">View Mode</p>
                        <div className="flex justify-between items-center gap-1 mt-1">
                            <button
                                onClick={() => setViewDevice('desktop')}
                                className={`flex-1 p-2 rounded transition-colors flex justify-center ${viewDevice === 'desktop' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                title="Desktop"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewDevice('tablet')}
                                className={`flex-1 p-2 rounded transition-colors flex justify-center ${viewDevice === 'tablet' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                title="Tablet"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewDevice('mobile')}
                                className={`flex-1 p-2 rounded transition-colors flex justify-center ${viewDevice === 'mobile' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                title="Mobile"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-2">
                        <button
                            onClick={togglePreviewMode}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-md transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Exit Preview</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
