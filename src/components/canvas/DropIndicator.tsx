import React from 'react';

export interface DragOverInfo {
    type: 'sibling' | 'nest' | null;
    position: 'top' | 'bottom' | 'inside';
    rect: {
        top: number;
        left: number;
        width: number;
        height: number;
    } | null;
}

interface DropIndicatorProps {
    info: DragOverInfo | null;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ info }) => {
    if (!info || !info.rect || !info.type) return null;

    const { rect, position, type } = info;

    // Style for the indicator
    const style: React.CSSProperties = {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1000,
        transition: 'all 0.1s ease-out',
    };

    // Nesting indicator (Green Box)
    if (type === 'nest') {
        return (
            <div
                style={{
                    ...style,
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    border: '2px solid #22c55e', // Green-500
                    backgroundColor: 'rgba(34, 197, 94, 0.1)', // Green-500 with opacity
                    borderRadius: '4px',
                }}
            />
        );
    }

    // Sibling indicator (Green Line)
    if (type === 'sibling') {
        const lineWidth = 4;
        const circleSize = 8;

        // Calculate line position
        const top = position === 'top' ? rect.top : (rect.top + rect.height);

        return (
            <div
                style={{
                    ...style,
                    top: top - (lineWidth / 2),
                    left: rect.left,
                    width: rect.width,
                    height: lineWidth,
                }}
            >
                {/* Main Line */}
                <div className="w-full h-full bg-green-500 shadow-sm relative">
                    {/* Left Circle Endpoint */}
                    <div
                        className="absolute bg-green-500 rounded-full border-2 border-white"
                        style={{
                            width: circleSize,
                            height: circleSize,
                            top: -(circleSize - lineWidth) / 2,
                            left: -circleSize / 2,
                        }}
                    />
                    {/* Right Circle Endpoint */}
                    <div
                        className="absolute bg-green-500 rounded-full border-2 border-white"
                        style={{
                            width: circleSize,
                            height: circleSize,
                            top: -(circleSize - lineWidth) / 2,
                            right: -circleSize / 2,
                        }}
                    />
                </div>
            </div>
        );
    }

    return null;
};
