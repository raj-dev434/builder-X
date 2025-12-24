import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '../../store/canvasStore';
import { SelectionToolbar } from './SelectionToolbar';

export const CanvasHighlighter: React.FC = () => {
    const { hoveredBlockId, selectedBlockIds, isPreviewMode, isDragging, blocks } = useCanvasStore();
    const selectedBlockId = selectedBlockIds[0];

    const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
    const [selectRect, setSelectRect] = useState<DOMRect | null>(null);
    const [hoverLabel, setHoverLabel] = useState<string>('');
    const [selectLabel, setSelectLabel] = useState<string>('');

    // Update rects on selection/hover change, scroll, or resize
    useEffect(() => {
        const updateRects = () => {
            // Hover Element
            if (hoveredBlockId && !isPreviewMode && !isDragging) {
                const el = document.getElementById(hoveredBlockId);
                if (el) {
                    setHoverRect(el.getBoundingClientRect());
                    setHoverLabel(el.dataset.blockType || 'Block');
                } else {
                    setHoverRect(null);
                }
            } else {
                setHoverRect(null);
            }

            // Selected Element
            if (selectedBlockId && !isPreviewMode && !isDragging) {
                const el = document.getElementById(selectedBlockId);
                if (el) {
                    setSelectRect(el.getBoundingClientRect());
                    setSelectLabel(el.dataset.blockType || 'Block');
                } else {
                    setSelectRect(null);
                }
            } else {
                setSelectRect(null);
            }
        };

        updateRects();

        // Listen for scroll/resize to update positions
        window.addEventListener('scroll', updateRects, true);
        window.addEventListener('resize', updateRects);

        // Create a mutation observer to specific canvas changes if needed, 
        // but for now relying on re-renders and events might be enough.
        // However, blocks might resize themselves (e.g. typing text). 
        // A simple interval or specialized observer could help stability.
        const interval = setInterval(updateRects, 100);

        return () => {
            window.removeEventListener('scroll', updateRects, true);
            window.removeEventListener('resize', updateRects);
            clearInterval(interval);
        };
    }, [hoveredBlockId, selectedBlockId, isPreviewMode, isDragging, blocks]); // Depend on blocks to refresh if layout changes

    if (isPreviewMode) return null;

    return createPortal(
        <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden">
            {/* Hover Highlighter */}
            {hoverRect && hoveredBlockId !== selectedBlockId && (
                <div
                    className="absolute border border-blue-400 border-dashed pointer-events-none transition-all duration-75"
                    style={{
                        top: hoverRect.top,
                        left: hoverRect.left,
                        width: hoverRect.width,
                        height: hoverRect.height,
                    }}
                >
                    <div className="absolute -top-6 left-0 bg-blue-400 text-white text-xs px-2 py-0.5 rounded-t-sm">
                        {hoverLabel}
                    </div>
                </div>
            )}

            {/* Selection Highlighter */}
            {selectRect && (
                <div
                    className="absolute border-2 border-blue-600 pointer-events-none transition-all duration-75"
                    style={{
                        top: selectRect.top,
                        left: selectRect.left,
                        width: selectRect.width,
                        height: selectRect.height,
                    }}
                >
                    <div className="absolute -top-7 left-[-2px] bg-blue-600 text-white text-xs px-2 py-1 rounded-t-sm font-medium">
                        {selectLabel}
                    </div>

                    {/* Toolbar attached to selection - Ensure pointer events on toolbar only */}
                    <div className="absolute right-0 -top-10 pointer-events-auto">
                        <SelectionToolbar
                            blockId={selectedBlockId!}
                            onClose={() => useCanvasStore.getState().selectBlock(null)}
                            // We don't need absolute position here as it's relative to the highlighter box
                            style={{ position: 'static', transform: 'none' }}
                        />
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};
