import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

interface HistoryPanelProps {
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose }) => {
  const { history, historyIndex, jumpToHistory } = useCanvasStore();

  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-200">History</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {history.map((item, index) => {
          const isActive = index === historyIndex;
          return (
             <div 
               key={index}
               onClick={() => jumpToHistory(index)}
               className={`flex flex-col p-3 rounded cursor-pointer transition-colors border ${
                 isActive 
                   ? 'bg-blue-600 border-blue-500 text-white' 
                   : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
               }`}
             >
                <div className="flex justify-between items-center">
                   <span className="font-medium text-sm">{item.action}</span>
                   {isActive && (
                      <span className="text-xs bg-blue-500 px-1.5 py-0.5 rounded text-white font-bold">Current</span>
                   )}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-blue-200' : 'text-gray-500'}`}>
                   {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
             </div>
          );
        })}
      </div>
    </div>
  );
};
