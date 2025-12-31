import React, { useState } from 'react';

interface TextFormattingToolbarProps {
  isVisible: boolean;
  onFormat: (command: string, value?: string) => void;
  onClose: () => void;
  showLinkInput?: boolean;
  onApplyLink?: (url: string) => void;
  onCancelLink?: () => void;
}

export const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({
  isVisible,
  onFormat,
  onClose,
  showLinkInput = false,
  onApplyLink,
  onCancelLink
}) => {
  const [url, setUrl] = useState('');

  if (!isVisible) return null;

  const formatButtons = [
    { command: 'bold', label: 'B', title: 'Bold (Ctrl+B)' },
    { command: 'italic', label: 'I', title: 'Italic (Ctrl+I)' },
    { command: 'underline', label: 'U', title: 'Underline (Ctrl+U)' },
    { command: 'strikeThrough', label: 'S', title: 'Strikethrough' },
    { command: 'insertUnorderedList', label: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', label: '1.', title: 'Numbered List' },
    { command: 'justifyLeft', label: '⬅', title: 'Align Left' },
    { command: 'justifyCenter', label: '↔', title: 'Align Center' },
    { command: 'justifyRight', label: '➡', title: 'Align Right' },
    { command: 'justifyFull', label: '⬌', title: 'Justify' },
    { command: 'link', label: '🔗', title: 'Insert Link (Ctrl+K)' },
  ];

  const handleFormat = (command: string) => {
    onFormat(command);
  };

  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (onApplyLink) {
      onApplyLink(url);
      setUrl('');
    }
  };

  if (showLinkInput) {
    return (
      <div className="absolute top-0 left-0 transform -translate-y-full bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center space-x-1 z-50">
        <form onSubmit={handleApplyLink} className="flex items-center space-x-1">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL..."
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button
            type="submit"
            className="px-2 py-1 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => {
              setUrl('');
              if (onCancelLink) onCancelLink();
            }}
            className="px-2 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 transform -translate-y-full bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex items-center space-x-1 z-50">
      {formatButtons.map((button) => (
        <button
          key={button.command}
          type="button"
          className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          title={button.title}
          onMouseDown={(e) => {
            e.preventDefault();
            handleFormat(button.command);
          }}
        >
          {button.label}
        </button>
      ))}
      <button
        type="button"
        className="px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        title="Close toolbar"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};
