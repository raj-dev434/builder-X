import React, { useState, useEffect, useRef } from 'react';
import { BaseBlock } from './BaseBlock';
import { Block } from '../../schema/types';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup';

export interface CodeBlockProps {
  id: string;
  type: 'code';
  props: {
    code?: string;
    language?: 'html' | 'css' | 'javascript' | 'json' | 'xml' | 'sql' | 'text' | 'typescript' | 'python';
    title?: string;
    description?: string;
    showLineNumbers?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontFamily?: string;
    maxHeight?: string;
    showCopyButton?: boolean;
    wrapLines?: boolean;
  };
}

export const CodeBlock: React.FC<{
  block: CodeBlockProps;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}> = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
  const {
    code = '<div class="example">\n  <h1>Hello World</h1>\n  <p>This is a sample HTML code block.</p>\n</div>',
    language = 'html',
    title = 'Code Block',
    description = 'Custom HTML/CSS code',
    showLineNumbers = true,
    backgroundColor = '#1f2937',
    textColor = '#f9fafb',
    borderColor = '#374151',
    borderRadius = '8px',
    padding = '16px',
    margin = '0',
    fontSize = '14px',
    fontFamily = 'Monaco, Consolas, "Courier New", monospace',
    maxHeight = '400px',
    showCopyButton = true,
    wrapLines = true
  } = block.props;

  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const containerStyle: React.CSSProperties = {
    margin,
    width: '100%',
  };

  const codeContainerStyle: React.CSSProperties = {
    backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius,
    padding,
    fontFamily,
    fontSize,
    color: textColor,
    maxHeight,
    overflow: 'auto',
    position: 'relative',
  };

  const codeStyle: React.CSSProperties = {
    margin: 0,
    whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
    wordBreak: wrapLines ? 'break-word' : 'normal',
    lineHeight: '1.5',
    backgroundColor: 'transparent',
    border: 'none',
    textShadow: 'none', // Reset prism shadow if needed
  };

  const handleCopy = async () => {
    try {
      if (code) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="w-full"
    >
      <div style={containerStyle}>
        {(title || description) && (
          <div className="mb-2">
            {title && <h3 className="text-sm font-bold text-gray-800">{title}</h3>}
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>
        )}

        <div style={codeContainerStyle} className={showLineNumbers ? 'line-numbers' : ''}>
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded shadow transition-colors z-10"
              title="Copy code"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          <pre style={{ margin: 0, background: 'transparent' }}>
            <code
              ref={codeRef}
              className={`language-${language}`}
              style={codeStyle}
            >
              {code}
            </code>
          </pre>
        </div>
      </div>
    </BaseBlock>
  );
};
