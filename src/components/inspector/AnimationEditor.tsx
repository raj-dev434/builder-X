import React, { useState } from 'react';
import { Block } from '../../schema/types';

interface AnimationEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const AnimationEditor: React.FC<AnimationEditorProps> = ({ block, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'entrance' | 'exit' | 'hover' | 'custom'>('entrance');

  const handleStyleChange = (key: string, value: any) => {
    onUpdate({
      props: {
        ...block.props,
        [key]: value
      }
    } as any);
  };

  // Type assertion to access style properties
  const styleProps = block.props as any;

  const entranceAnimations = [
    { value: 'fadeIn', label: 'Fade In', description: 'Element fades in smoothly' },
    { value: 'slideInUp', label: 'Slide In Up', description: 'Element slides up from bottom' },
    { value: 'slideInDown', label: 'Slide In Down', description: 'Element slides down from top' },
    { value: 'slideInLeft', label: 'Slide In Left', description: 'Element slides in from left' },
    { value: 'slideInRight', label: 'Slide In Right', description: 'Element slides in from right' },
    { value: 'zoomIn', label: 'Zoom In', description: 'Element scales up from center' },
    { value: 'bounceIn', label: 'Bounce In', description: 'Element bounces into view' },
    { value: 'rotateIn', label: 'Rotate In', description: 'Element rotates while fading in' },
    { value: 'flipInX', label: 'Flip In X', description: 'Element flips on X axis' },
    { value: 'flipInY', label: 'Flip In Y', description: 'Element flips on Y axis' },
  ];

  const exitAnimations = [
    { value: 'fadeOut', label: 'Fade Out', description: 'Element fades out smoothly' },
    { value: 'slideOutUp', label: 'Slide Out Up', description: 'Element slides up and out' },
    { value: 'slideOutDown', label: 'Slide Out Down', description: 'Element slides down and out' },
    { value: 'slideOutLeft', label: 'Slide Out Left', description: 'Element slides out to left' },
    { value: 'slideOutRight', label: 'Slide Out Right', description: 'Element slides out to right' },
    { value: 'zoomOut', label: 'Zoom Out', description: 'Element scales down to center' },
    { value: 'bounceOut', label: 'Bounce Out', description: 'Element bounces out of view' },
    { value: 'rotateOut', label: 'Rotate Out', description: 'Element rotates while fading out' },
    { value: 'flipOutX', label: 'Flip Out X', description: 'Element flips out on X axis' },
    { value: 'flipOutY', label: 'Flip Out Y', description: 'Element flips out on Y axis' },
  ];

  const hoverAnimations = [
    { value: 'pulse', label: 'Pulse', description: 'Element pulses on hover' },
    { value: 'bounce', label: 'Bounce', description: 'Element bounces on hover' },
    { value: 'shake', label: 'Shake', description: 'Element shakes on hover' },
    { value: 'wobble', label: 'Wobble', description: 'Element wobbles on hover' },
    { value: 'tada', label: 'Tada', description: 'Element celebrates on hover' },
    { value: 'jello', label: 'Jello', description: 'Element jiggles like jello' },
    { value: 'heartbeat', label: 'Heartbeat', description: 'Element beats like a heart' },
    { value: 'rubberBand', label: 'Rubber Band', description: 'Element stretches like rubber' },
    { value: 'swing', label: 'Swing', description: 'Element swings on hover' },
    { value: 'wobble', label: 'Wobble', description: 'Element wobbles on hover' },
  ];

  const renderAnimationGrid = (animations: typeof entranceAnimations) => (
    <div className="grid grid-cols-1 gap-2">
      {animations.map((animation) => (
        <button
          key={animation.value}
          onClick={() => {
            const key = activeTab === 'entrance' ? 'animation' :
              activeTab === 'exit' ? 'exitAnimation' :
                activeTab === 'hover' ? 'hoverAnimation' : 'customAnimation';
            handleStyleChange(key, animation.value);
          }}
          className={`p-3 text-left border rounded-md transition-colors ${(activeTab === 'entrance' && styleProps.animation === animation.value) ||
              (activeTab === 'exit' && styleProps.exitAnimation === animation.value) ||
              (activeTab === 'hover' && styleProps.hoverAnimation === animation.value) ||
              (activeTab === 'custom' && styleProps.customAnimation === animation.value)
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
        >
          <div className="font-medium text-sm">{animation.label}</div>
          <div className="text-xs text-gray-600 mt-1">{animation.description}</div>
        </button>
      ))}
    </div>
  );

  const renderCustomAnimation = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Animation Name</label>
        <input
          type="text"
          value={styleProps.customAnimation || ''}
          onChange={(e) => handleStyleChange('customAnimation', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          placeholder="myCustomAnimation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={styleProps.animationDuration || ''}
            onChange={(e) => handleStyleChange('animationDuration', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            placeholder="1"
          />
          <select
            value={styleProps.animationDuration?.includes('ms') ? 'ms' : 's'}
            onChange={(e) => {
              const currentDuration = styleProps.animationDuration || '1s';
              const numericValue = currentDuration.replace(/[^\d.]/g, '');
              handleStyleChange('animationDuration', `${numericValue}${e.target.value}`);
            }}
            className="w-16 p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="s">s</option>
            <option value="ms">ms</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Delay</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={styleProps.animationDelay || ''}
            onChange={(e) => handleStyleChange('animationDelay', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
            placeholder="0"
          />
          <select
            value={styleProps.animationDelay?.includes('ms') ? 'ms' : 's'}
            onChange={(e) => {
              const currentDelay = styleProps.animationDelay || '0s';
              const numericValue = currentDelay.replace(/[^\d.]/g, '');
              handleStyleChange('animationDelay', `${numericValue}${e.target.value}`);
            }}
            className="w-16 p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="s">s</option>
            <option value="ms">ms</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Iteration Count</label>
        <select
          value={styleProps.animationIterationCount || '1'}
          onChange={(e) => handleStyleChange('animationIterationCount', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="infinite">Infinite</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
        <select
          value={styleProps.animationDirection || 'normal'}
          onChange={(e) => handleStyleChange('animationDirection', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="normal">Normal</option>
          <option value="reverse">Reverse</option>
          <option value="alternate">Alternate</option>
          <option value="alternate-reverse">Alternate Reverse</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timing Function</label>
        <select
          value={styleProps.animationTimingFunction || 'ease'}
          onChange={(e) => handleStyleChange('animationTimingFunction', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="ease">Ease</option>
          <option value="linear">Linear</option>
          <option value="ease-in">Ease In</option>
          <option value="ease-out">Ease Out</option>
          <option value="ease-in-out">Ease In Out</option>
          <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</option>
          <option value="cubic-bezier(0.25, 0.46, 0.45, 0.94)">Ease Out Quart</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fill Mode</label>
        <select
          value={styleProps.animationFillMode || 'none'}
          onChange={(e) => handleStyleChange('animationFillMode', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="forwards">Forwards</option>
          <option value="backwards">Backwards</option>
          <option value="both">Both</option>
        </select>
      </div>
    </div>
  );

  const tabs = [
    { id: 'entrance', label: 'Entrance', icon: '🎬' },
    { id: 'exit', label: 'Exit', icon: '🚪' },
    { id: 'hover', label: 'Hover', icon: '👆' },
    { id: 'custom', label: 'Custom', icon: '⚙️' },
  ] as const;

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'entrance' && renderAnimationGrid(entranceAnimations)}
        {activeTab === 'exit' && renderAnimationGrid(exitAnimations)}
        {activeTab === 'hover' && renderAnimationGrid(hoverAnimations)}
        {activeTab === 'custom' && renderCustomAnimation()}
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-md">
        <div className="text-sm text-green-800">
          <strong>🎭 Preview:</strong> Animations will be applied when the element comes into view or on hover.
          Use the preview mode to see animations in action.
        </div>
      </div>
    </div>
  );
};
