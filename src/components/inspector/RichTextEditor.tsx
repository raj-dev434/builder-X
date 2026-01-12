import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    Bold, Italic, Underline, List, ListOrdered,
    Link as LinkIcon, Image as ImageIcon,
    ChevronDown, Maximize2, Eraser,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Trash2, X
} from 'lucide-react';
import { useAssetStore } from '../../store/assetStore';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const CustomToolbar = ({ id, onAddMedia }: { id: string, onAddMedia: () => void }) => (
    <div id={id} className="flex flex-wrap items-center gap-1 p-1 bg-[#f8f9fa] border-b border-[#ddd] rounded-t-sm">
        {/* Header Dropdown */}
        <select className="ql-header bg-white border border-gray-300 rounded text-[11px] px-1 py-0.5 outline-none hover:bg-gray-50 transition-colors mr-1 h-6 min-w-[100px]" defaultValue="">
            <option value="">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
            <option value="code">Preformatted</option>
        </select>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button className="ql-bold p-1 hover:bg-gray-200 rounded">
            <Bold className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-italic p-1 hover:bg-gray-200 rounded">
            <Italic className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-underline p-1 hover:bg-gray-200 rounded">
            <Underline className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-strike p-1 hover:bg-gray-200 rounded">
            <span className="text-[11px] font-bold text-gray-700 line-through decoration-2">S</span>
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button className="ql-list p-1 hover:bg-gray-200 rounded" value="ordered">
            <ListOrdered className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-list p-1 hover:bg-gray-200 rounded" value="bullet">
            <List className="w-3.5 h-3.5 text-gray-700" />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button className="ql-align p-1 hover:bg-gray-200 rounded" value="">
            <AlignLeft className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-align p-1 hover:bg-gray-200 rounded" value="center">
            <AlignCenter className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-align p-1 hover:bg-gray-200 rounded" value="right">
            <AlignRight className="w-3.5 h-3.5 text-gray-700" />
        </button>
        <button className="ql-align p-1 hover:bg-gray-200 rounded" value="justify">
            <AlignJustify className="w-3.5 h-3.5 text-gray-700" />
        </button>

        <div className="w-[1px] h-4 bg-gray-300 mx-1" />

        <button className="ql-link p-1 hover:bg-gray-200 rounded">
            <LinkIcon className="w-3.5 h-3.5 text-gray-700" />
        </button>

        <button className="ql-clean p-1 hover:bg-gray-200 rounded" title="Clear Formatting">
            <Eraser className="w-3.5 h-3.5 text-gray-700" />
        </button>

        <button
            type="button"
            onClick={onAddMedia}
            className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors ml-auto"
        >
            <ImageIcon className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] font-bold text-gray-600 uppercase">Add Media</span>
        </button>
    </div>
);

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const [mode, setMode] = useState<'visual' | 'code'>('visual');
    const [htmlValue, setHtmlValue] = useState(value);
    const [selectedImage, setSelectedImage] = useState<{ element: HTMLImageElement; index: number } | null>(null);
    const openAssetModal = useAssetStore((state) => state.openModal);
    const toolbarId = React.useId().replace(/:/g, "");
    const toolbarSelector = `toolbar-${toolbarId}`;
    const quillRef = React.useRef<ReactQuill>(null);

    useEffect(() => {
        setHtmlValue(value);
    }, [value]);

    // Handle image selection/click for deletion
    useEffect(() => {
        if (mode !== 'visual' || !quillRef.current) return;

        const quill = quillRef.current.getEditor();
        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                const img = target as HTMLImageElement;
                const blot = (window as any).Quill.find(img);
                if (blot) {
                    const index = quill.getIndex(blot);
                    setSelectedImage({ element: img, index });
                }
            } else {
                setSelectedImage(null);
            }
        };

        const root = quill.root;
        root.addEventListener('click', handleImageClick);
        return () => root.removeEventListener('click', handleImageClick);
    }, [mode]);

    const modules = React.useMemo(() => ({
        toolbar: {
            container: `#${toolbarSelector}`,
        },
    }), [toolbarSelector]);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image', 'code', 'align'
    ];

    const handleAddMedia = () => {
        openAssetModal((url) => {
            const editor = quillRef.current?.getEditor();
            if (editor) {
                const range = editor.getSelection(true);
                editor.insertEmbed(range.index, 'image', url);
                editor.setSelection(range.index + 1, 0);
            }
        });
    };

    const handleDeleteImage = () => {
        if (selectedImage && quillRef.current) {
            const quill = quillRef.current.getEditor();
            quill.deleteText(selectedImage.index, 1);
            setSelectedImage(null);
        }
    };

    return (
        <div className="flex flex-col border border-[#ddd] rounded-sm bg-white overflow-hidden shadow-sm relative">
            {/* Floating Image Delete Button */}
            {selectedImage && mode === 'visual' && (
                <div
                    className="absolute z-[60] flex items-center gap-1 bg-white border border-red-200 rounded shadow-lg px-2 py-1 transition-all animate-in fade-in zoom-in duration-200"
                    style={{
                        top: Math.max(10, selectedImage.element.offsetTop - 40),
                        left: selectedImage.element.offsetLeft + (selectedImage.element.offsetWidth / 2) - 30,
                    }}
                >
                    <button
                        onClick={handleDeleteImage}
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-[10px] uppercase tracking-tighter"
                    >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Image</span>
                    </button>
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="text-gray-400 hover:text-gray-600 ml-1"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* Upper Toolbar / Tabs */}
            <div className="flex items-center justify-between bg-[#f1f3f4] px-1 border-b border-[#ddd]">
                <div className="flex gap-0.5 mt-1">
                    <button
                        onClick={() => setMode('visual')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-sm border-x border-t ${mode === 'visual' ? 'bg-white border-[#ddd] text-gray-900' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                    >
                        Visual
                    </button>
                    <button
                        onClick={() => setMode('code')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-sm border-x border-t ${mode === 'code' ? 'bg-white border-[#ddd] text-gray-900' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                    >
                        Code
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <Maximize2 className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-pointer mr-2" />
                </div>
            </div>

            {mode === 'visual' ? (
                <>
                    <CustomToolbar id={toolbarSelector} onAddMedia={handleAddMedia} />
                    <div className="quill-wrapper bg-white">
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={htmlValue}
                            onChange={onChange}
                            modules={modules}
                            formats={formats}
                            className="text-gray-900"
                        />
                    </div>
                </>
            ) : (
                <textarea
                    value={htmlValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full min-h-[240px] p-3 font-mono text-xs bg-[#1e1e1e] text-gray-300 outline-none resize-y"
                    placeholder="Enter HTML code here..."
                />
            )}

            {/* Footer / Element Path */}
            <div className="bg-[#f8f9fa] px-3 py-1.5 border-t border-[#eee] flex items-center justify-between">
                <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                    <span>Body</span>
                    <ChevronDown className="w-2 h-2" />
                    <span>P</span>
                </div>
                <div className="text-[9px] text-gray-400 font-mono">
                    {htmlValue.length} chars
                </div>
            </div>

            <style>{`
        .quill-wrapper .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
          font-size: 13px;
          height: auto !important;
        }
        .quill-wrapper .ql-editor {
          min-height: 150px;
          color: #333;
          padding: 12px;
          height: auto !important;
          overflow-y: visible !important;
        }
        .quill-wrapper .ql-editor.ql-blank::before {
          color: #aaa;
          font-style: normal;
          font-size: 13px;
        }
        .quill-wrapper .ql-editor p {
          margin-bottom: 1em;
        }
        .quill-wrapper .ql-editor ul {
          list-style-type: disc !important;
          padding-left: 1.5em !important;
          margin-bottom: 1em !important;
        }
        .quill-wrapper .ql-editor ol {
          list-style-type: decimal !important;
          padding-left: 1.5em !important;
          margin-bottom: 1em !important;
        }
        .quill-wrapper .ql-editor li {
          display: list-item !important;
        }
        .quill-wrapper .ql-editor .ql-align-center {
          text-align: center !important;
        }
        .quill-wrapper .ql-editor .ql-align-right {
          text-align: right !important;
        }
        .quill-wrapper .ql-editor .ql-align-justify {
          text-align: justify !important;
        }
      `}</style>
        </div>
    );
};
