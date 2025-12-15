import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const HistoryIndicator: React.FC = () => {
  const { history, historyIndex, canUndo, canRedo } = useCanvasStore();

  const totalSteps = history.length;
  const currentStep = historyIndex + 1;

  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500">
      <div className="flex items-center space-x-1">
        <span className="font-medium">History:</span>
        <span>{currentStep}/{totalSteps}</span>
      </div>

      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${canUndo() ? 'bg-green-500' : 'bg-gray-300'}`} title="Can undo" />
        <div className={`w-2 h-2 rounded-full ${canRedo() ? 'bg-green-500' : 'bg-gray-300'}`} title="Can redo" />
      </div>
    </div>
  );
};
