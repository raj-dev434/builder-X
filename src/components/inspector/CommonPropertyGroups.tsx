import React from 'react';
import { Block } from '../../schema/types';

interface GroupProps {
    block: Block;
    onChange: (key: string, value: any) => void;
}

// Helper for section headers
const GroupHeader: React.FC<{ title: string; isOpen?: boolean; onToggle?: () => void }> = ({ title }) => (
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 pb-1 border-b border-gray-100">
        {title}
    </div>
);

// Helper for input fields
const InputField: React.FC<{
    label: string;
    value: any;
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
    className?: string;
}> = ({ label, value, onChange, type = "text", placeholder, className = "" }) => (
    <div className={className}>
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            placeholder={placeholder}
        />
    </div>
);

const SelectField: React.FC<{
    label: string;
    value: any;
    onChange: (val: string) => void;
    options: { label: string; value: string }[];
    className?: string;
}> = ({ label, value, onChange, options, className = "" }) => (
    <div className={className}>
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const ColorField: React.FC<{
    label: string;
    value: any;
    onChange: (val: string) => void;
}> = ({ label, value, onChange }) => (
    <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1">{label}</label>
        <div className="flex items-center border border-gray-200 rounded p-1">
            <input
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none p-0 mr-2"
            />
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 text-xs outline-none"
                placeholder="#000000"
            />
        </div>
    </div>
);


export const SpacingGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Spacing" />
            <div className="grid grid-cols-2 gap-2 mb-2">
                <InputField label="Padding" value={block.props.padding} onChange={(v) => onChange('padding', v)} placeholder="10px" />
                <InputField label="Margin" value={block.props.margin} onChange={(v) => onChange('margin', v)} placeholder="0px" />
            </div>
            {/* Advanced toggle could go here for Top/Right/Bottom/Left specific control */}
        </div>
    );
};

export const DimensionsGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Dimensions" />
            <div className="grid grid-cols-2 gap-2 mb-2">
                <InputField label="Width" value={block.props.width} onChange={(v) => onChange('width', v)} placeholder="100%" />
                <InputField label="Height" value={block.props.height} onChange={(v) => onChange('height', v)} placeholder="auto" />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <InputField label="Min Height" value={block.props.minHeight} onChange={(v) => onChange('minHeight', v)} placeholder="0px" />
                <InputField label="Max Width" value={block.props.maxWidth} onChange={(v) => onChange('maxWidth', v)} placeholder="none" />
            </div>
        </div>
    );
};

export const TypographyGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Typography" />
            <div className="grid grid-cols-2 gap-2 mb-2">
                <InputField label="Font Size" value={block.props.fontSize} onChange={(v) => onChange('fontSize', v)} placeholder="16px" />
                <SelectField
                    label="Font Weight"
                    value={block.props.fontWeight}
                    onChange={(v) => onChange('fontWeight', v)}
                    options={[
                        { label: 'Normal', value: 'normal' },
                        { label: 'Bold', value: 'bold' },
                        { label: 'Light', value: '300' },
                        { label: 'Medium', value: '500' },
                        { label: 'Heavy', value: '900' },
                    ]}
                />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <SelectField
                    label="Align"
                    value={block.props.textAlign}
                    onChange={(v) => onChange('textAlign', v)}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Center', value: 'center' },
                        { label: 'Right', value: 'right' },
                        { label: 'Justify', value: 'justify' },
                    ]}
                />
                <ColorField label="Color" value={block.props.color} onChange={(v) => onChange('color', v)} />
            </div>
        </div>
    );
};

export const BackgroundGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Background" />
            <ColorField label="Background Color" value={block.props.backgroundColor} onChange={(v) => onChange('backgroundColor', v)} />
            <InputField label="Image URL" value={block.props.backgroundImage} onChange={(v) => onChange('backgroundImage', v)} placeholder="https://..." />
            {block.props.backgroundImage && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <SelectField
                        label="Size"
                        value={block.props.backgroundSize}
                        onChange={(v) => onChange('backgroundSize', v)}
                        options={[
                            { label: 'Cover', value: 'cover' },
                            { label: 'Contain', value: 'contain' },
                            { label: 'Auto', value: 'auto' },
                        ]}
                    />
                    <SelectField
                        label="Position"
                        value={block.props.backgroundPosition}
                        onChange={(v) => onChange('backgroundPosition', v)}
                        options={[
                            { label: 'Center', value: 'center' },
                            { label: 'Top', value: 'top' },
                            { label: 'Bottom', value: 'bottom' },
                        ]}
                    />
                </div>
            )}
        </div>
    );
};

export const BorderGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Border" />
            <div className="grid grid-cols-2 gap-2 mb-2">
                <InputField label="Radius" value={block.props.borderRadius} onChange={(v) => onChange('borderRadius', v)} placeholder="4px" />
                <InputField label="Width" value={block.props.borderWidth} onChange={(v) => onChange('borderWidth', v)} placeholder="1px" />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="Style"
                    value={block.props.borderStyle}
                    onChange={(v) => onChange('borderStyle', v)}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Solid', value: 'solid' },
                        { label: 'Dashed', value: 'dashed' },
                        { label: 'Dotted', value: 'dotted' },
                    ]}
                />
                <ColorField label="Color" value={block.props.borderColor} onChange={(v) => onChange('borderColor', v)} />
            </div>
            {/* Simple combined border input fallback if used */}
            <InputField label="Shorthand (e.g. 1px solid red)" value={block.props.border} onChange={(v) => onChange('border', v)} />
        </div>
    );
};

export const EffectsGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Effects" />
            <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">Opacity: {block.props.opacity ?? 1}</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={block.props.opacity !== undefined ? block.props.opacity : 1}
                    onChange={(e) => onChange('opacity', parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>
            {/* <InputField label="Box Shadow" value={block.props.boxShadow} onChange={(v) => onChange('boxShadow', v)} placeholder="none" /> */}
            <SelectField
                label="Box Shadow"
                value={block.props.boxShadow}
                onChange={(v) => onChange('boxShadow', v)}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
                    { label: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
                    { label: 'Large', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
                    { label: 'X-Large', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
                    { label: 'Inner', value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' },
                ]}
            />
        </div>
    );
};

export const LayoutGroup: React.FC<GroupProps> = ({ block, onChange }) => {
    return (
        <div>
            <GroupHeader title="Layout Behavior" />
            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="Display"
                    value={block.props.display}
                    onChange={(v) => onChange('display', v)}
                    options={[
                        { label: 'Block', value: 'block' },
                        { label: 'Flex', value: 'flex' },
                        { label: 'Grid', value: 'grid' },
                        { label: 'Inline-Block', value: 'inline-block' },
                        { label: 'None', value: 'none' },
                    ]}
                />
                <SelectField
                    label="Overflow"
                    value={block.props.overflow}
                    onChange={(v) => onChange('overflow', v)}
                    options={[
                        { label: 'Visible', value: 'visible' },
                        { label: 'Hidden', value: 'hidden' },
                        { label: 'Scroll', value: 'scroll' },
                        { label: 'Auto', value: 'auto' },
                    ]}
                />
            </div>
            {block.props.display === 'flex' && (
                <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded">
                    <SelectField
                        label="Direction"
                        value={block.props.flexDirection}
                        onChange={(v) => onChange('flexDirection', v)}
                        options={[
                            { label: 'Row', value: 'row' },
                            { label: 'Column', value: 'column' },
                        ]}
                    />
                    <SelectField
                        label="Wrap"
                        value={block.props.flexWrap}
                        onChange={(v) => onChange('flexWrap', v)}
                        options={[
                            { label: 'No Wrap', value: 'nowrap' },
                            { label: 'Wrap', value: 'wrap' },
                            { label: 'Wrap Reverse', value: 'wrap-reverse' },
                        ]}
                    />
                    <SelectField
                        label="Justify"
                        value={block.props.justifyContent}
                        onChange={(v) => onChange('justifyContent', v)}
                        options={[
                            { label: 'Start', value: 'flex-start' },
                            { label: 'Center', value: 'center' },
                            { label: 'End', value: 'flex-end' },
                            { label: 'Between', value: 'space-between' },
                        ]}
                    />
                    <SelectField
                        label="Align"
                        value={block.props.alignItems}
                        onChange={(v) => onChange('alignItems', v)}
                        options={[
                            { label: 'Start', value: 'flex-start' },
                            { label: 'Center', value: 'center' },
                            { label: 'End', value: 'flex-end' },
                            { label: 'Stretch', value: 'stretch' },
                        ]}
                    />
                </div>
            )}
        </div>
    );
};
