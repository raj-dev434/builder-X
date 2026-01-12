import React from 'react';
import { BaseBlock } from './BaseBlock';
import { MapBlock as MapBlockType } from '../../schema/types';
import { useCanvasStore } from '../../store/canvasStore';

interface MapBlockProps {
  block: MapBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<MapBlockType>) => void;
  onDelete: () => void;
}

export const MapBlock: React.FC<MapBlockProps> = ({
  block,
  isSelected,
  onSelect,
  // onUpdate,
  onDelete
}) => {
  const {
    address = 'New York, NY',
    latitude = 40.7128,
    longitude = -74.0060,
    zoom = 13,
    width = '100%',
    height = '300px',
    borderRadius = '4px',
    border = '1px solid #dee2e6',
    margin = '0',
    padding = '0',
    interactive = true,
    showMarker = true,
    markerTitle = 'Location',
    //  markerDescription = 'This is a location marker',
    overflow = 'hidden',
    mapType = 'roadmap', // roadmap, satellite, hybrid, terrain
    interactionMode = 'always',
    activationText = 'Click to interact',
    ...styleProps
  } = block.props;

  const { isPreviewMode } = useCanvasStore();
  const [isInteracting, setIsInteracting] = React.useState(false);

  // Generate Google Maps embed URL
  const getMapUrl = () => {
    if (interactive) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=${mapType === 'satellite' ? 'k' : mapType === 'hybrid' ? 'h' : mapType === 'terrain' ? 'p' : 'm'}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
    }
    return null;
  };

  const mapUrl = getMapUrl();

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
      className="w-full"
      style={styleProps}
    >
      <div className="w-full">
        <div
          className="relative"
          style={{
            width,
            height,
            borderRadius,
            border,
            margin,
            padding,
            overflow
          }}
          onMouseLeave={() => {
            if (interactionMode === 'onClick') setIsInteracting(false);
          }}
        >
          {interactive && mapUrl ? (
            <>
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  borderRadius,
                  // Disable pointer events when not in preview mode or when selected to allow block selection
                  // Also disable if interaction mode is 'onClick' and not yet interacting
                  pointerEvents: (!isPreviewMode || isSelected)
                    ? 'none'
                    : (interactionMode === 'onClick' && !isInteracting ? 'none' : 'auto')
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map: ${address}`}
              />

              {/* Interaction Mode Overlay (scrolling protection) */}
              {isPreviewMode && !isSelected && interactionMode === 'onClick' && !isInteracting && (
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors cursor-pointer group"
                  onClick={() => setIsInteracting(true)}
                >
                  <button className="bg-white shadow-lg text-gray-800 px-4 py-2 rounded font-medium text-sm transform group-hover:scale-105 transition-transform pointer-events-none">
                    {activationText}
                  </button>
                </div>
              )}

              {showMarker && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
                    📍 {markerTitle}
                  </div>
                </div>
              )}

              {/* Overlay to enable clicking when not in preview mode */}
              {!isPreviewMode && (
                <div
                  className="absolute inset-0"
                  style={{
                    pointerEvents: 'auto',
                    background: isSelected ? 'transparent' : 'transparent'
                  }}
                  onClick={onSelect}
                />
              )}
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"
              style={{ borderRadius }}
            >
              <div className="text-4xl mb-3">🗺️</div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {address}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </div>
                <div className="text-xs text-gray-500">
                  Zoom: {zoom} • {interactive ? 'Interactive' : 'Static'} • {mapType}
                </div>
              </div>
              {showMarker && (
                <div className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                  📍 Marker: {markerTitle}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map info when selected */}
        {isSelected && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <div className="flex justify-between">
              <span>📍 {address}</span>
              <span>Zoom: {zoom} • {mapType}</span>
            </div>
          </div>
        )}
      </div>
    </BaseBlock>
  );
};