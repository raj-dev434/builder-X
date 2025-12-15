# API Reference

Complete API documentation for BuilderX components, functions, and integrations.

## Core Types

### Block Types

```typescript
interface BaseBlock {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Block[];
}

interface SectionBlock extends BaseBlock {
  type: 'section';
  props: {
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    minHeight?: string;
  };
}

interface RowBlock extends BaseBlock {
  type: 'row';
  props: {
    gap?: string;
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    wrap?: boolean;
  };
}

interface ColumnBlock extends BaseBlock {
  type: 'column';
  props: {
    width?: string;
    flex?: string;
    gap?: string;
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  };
}

interface TextBlock extends BaseBlock {
  type: 'text';
  props: {
    content: string;
    fontSize?: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: string;
    fontFamily?: string;
  };
}

interface ImageBlock extends BaseBlock {
  type: 'image';
  props: {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    borderRadius?: string;
  };
}

interface ButtonBlock extends BaseBlock {
  type: 'button';
  props: {
    text: string;
    href?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    border?: string;
    hoverBackgroundColor?: string;
    hoverColor?: string;
  };
}

type Block = SectionBlock | RowBlock | ColumnBlock | TextBlock | ImageBlock | ButtonBlock;
```

### Canvas State

```typescript
interface CanvasState {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  historyIndex: number;
  isDragging: boolean;
}
```

## Store API

### useCanvasStore

The main Zustand store for managing canvas state.

```typescript
const {
  // State
  blocks,
  selectedBlockId,
  history,
  historyIndex,
  isDragging,
  
  // Actions
  addBlock,
  updateBlock,
  deleteBlock,
  selectBlock,
  moveBlock,
  undo,
  redo,
  saveToHistory,
  setDragging,
  clearCanvas,
  loadCanvas
} = useCanvasStore();
```

#### Actions

##### addBlock(block, parentId?)

Adds a new block to the canvas.

```typescript
addBlock(block: Omit<Block, 'id'>, parentId?: string): void
```

**Parameters:**
- `block` - Block definition without ID
- `parentId` - Optional parent block ID for nesting

**Example:**
```typescript
addBlock({
  type: 'text',
  props: {
    content: 'Hello World',
    fontSize: '16px',
    color: '#000000'
  }
});
```

##### updateBlock(id, updates)

Updates an existing block's properties.

```typescript
updateBlock(id: string, updates: Partial<Block>): void
```

**Parameters:**
- `id` - Block ID to update
- `updates` - Partial block object with changes

**Example:**
```typescript
updateBlock('block-123', {
  props: {
    content: 'Updated text',
    color: '#ff0000'
  }
});
```

##### deleteBlock(id)

Removes a block from the canvas.

```typescript
deleteBlock(id: string): void
```

**Parameters:**
- `id` - Block ID to delete

##### selectBlock(id)

Selects a block for editing.

```typescript
selectBlock(id: string | null): void
```

**Parameters:**
- `id` - Block ID to select, or null to deselect

##### moveBlock(id, newParentId, index)

Moves a block to a new parent and position.

```typescript
moveBlock(id: string, newParentId: string, index: number): void
```

**Parameters:**
- `id` - Block ID to move
- `newParentId` - New parent block ID
- `index` - Position within parent's children

##### undo()

Reverts to the previous state.

```typescript
undo(): void
```

##### redo()

Advances to the next state.

```typescript
redo(): void
```

##### clearCanvas()

Removes all blocks from the canvas.

```typescript
clearCanvas(): void
```

##### loadCanvas(blocks)

Loads a new set of blocks into the canvas.

```typescript
loadCanvas(blocks: Block[]): void
```

**Parameters:**
- `blocks` - Array of blocks to load

## Export API

### HTML Export

```typescript
import { exportToHTML } from './exporters/htmlExporter';

const html: string = exportToHTML(blocks);
```

**Returns:** Complete HTML document with inline styles

**Example Output:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BuilderX Export</title>
    <style>
        /* Inline styles for CSP compliance */
    </style>
</head>
<body>
    <section style="background-color: #ffffff; padding: 2rem;">
        <div class="row" style="display: flex; gap: 1rem;">
            <div class="column" style="flex: 1;">
                <p style="font-size: 16px; color: #000000;">Hello World</p>
            </div>
        </div>
    </section>
</body>
</html>
```

### JSON Export

```typescript
import { exportToJSON } from './exporters/jsonExporter';

const json: string = exportToJSON(blocks);
```

**Returns:** JSON string with schema and metadata

**Example Output:**
```json
{
  "version": "1.0.0",
  "generated": "2024-01-15T10:30:00.000Z",
  "blocks": [
    {
      "type": "section",
      "props": {
        "backgroundColor": "#ffffff",
        "padding": "2rem"
      },
      "children": [
        {
          "type": "row",
          "props": {
            "gap": "1rem"
          },
          "children": [
            {
              "type": "column",
              "props": {
                "flex": "1"
              },
              "children": [
                {
                  "type": "text",
                  "props": {
                    "content": "Hello World",
                    "fontSize": "16px",
                    "color": "#000000"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### JSON Import

```typescript
import { importFromJSON } from './exporters/jsonExporter';

const blocks: Block[] = importFromJSON(jsonString);
```

**Parameters:**
- `jsonString` - JSON string from export

**Returns:** Array of blocks with generated IDs

**Throws:** Error if JSON is invalid

## Component API

### BlockRenderer

Renders blocks based on their type.

```typescript
interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Block>) => void;
  onDelete?: (id: string) => void;
}

<BlockRenderer
  block={block}
  isSelected={selectedBlockId === block.id}
  onSelect={selectBlock}
  onUpdate={updateBlock}
  onDelete={deleteBlock}
/>
```

### BaseBlock

Base component for all block types.

```typescript
interface BaseBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

## Utility Functions

### ID Generation

```typescript
import { generateId, generateIdWithPrefix } from './utils/idGenerator';

const id: string = generateId(); // "a1b2c3d4e"
const prefixedId: string = generateIdWithPrefix('block'); // "block_a1b2c3d4e"
```

## Event System

### Built-in Events

BuilderX emits events for various actions:

```typescript
// Block events
BuilderX.on('block-added', (block: Block) => {});
BuilderX.on('block-updated', (block: Block) => {});
BuilderX.on('block-deleted', (blockId: string) => {});
BuilderX.on('block-selected', (blockId: string | null) => {});

// Canvas events
BuilderX.on('canvas-cleared', () => {});
BuilderX.on('canvas-loaded', (blocks: Block[]) => {});

// History events
BuilderX.on('undo', () => {});
BuilderX.on('redo', () => {});

// Export events
BuilderX.on('export-html', (html: string) => {});
BuilderX.on('export-json', (json: string) => {});
```

### Custom Events

You can emit custom events:

```typescript
BuilderX.emit('custom-event', { data: 'value' });
```

## Configuration

### BuilderX Options

```typescript
interface BuilderXOptions {
  container: string | HTMLElement;
  initialData?: Block[];
  theme?: 'light' | 'dark';
  locale?: string;
  debug?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  onSave?: (data: { html: string; json: string }) => void;
  onExport?: (type: 'html' | 'json', content: string) => void;
  onBlockSelect?: (blockId: string | null) => void;
  onBlockUpdate?: (block: Block) => void;
  onBlockDelete?: (blockId: string) => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
}

BuilderX.init(options: BuilderXOptions);
```

### Block Templates

```typescript
interface BlockTemplate {
  id: string;
  name: string;
  icon: string;
  block: Omit<Block, 'id'>;
}

// Add custom template
BuilderX.addTemplate({
  id: 'custom-block',
  name: 'Custom Block',
  icon: '🎨',
  block: {
    type: 'custom-block',
    props: {
      customProperty: 'default-value'
    }
  }
});
```

## Error Handling

### Common Errors

```typescript
// Invalid block type
try {
  addBlock({ type: 'invalid-type', props: {} });
} catch (error) {
  console.error('Invalid block type:', error.message);
}

// JSON import error
try {
  const blocks = importFromJSON(invalidJson);
} catch (error) {
  console.error('Import failed:', error.message);
}
```

### Error Types

```typescript
class BuilderXError extends Error {
  constructor(message: string, code: string) {
    super(message);
    this.name = 'BuilderXError';
    this.code = code;
  }
}

// Error codes
const ERROR_CODES = {
  INVALID_BLOCK_TYPE: 'INVALID_BLOCK_TYPE',
  INVALID_JSON: 'INVALID_JSON',
  BLOCK_NOT_FOUND: 'BLOCK_NOT_FOUND',
  INVALID_PARENT: 'INVALID_PARENT'
};
```

## Performance API

### Optimization Methods

```typescript
// Enable performance mode
BuilderX.setPerformanceMode(true);

// Batch updates
BuilderX.batch(() => {
  addBlock(block1);
  addBlock(block2);
  updateBlock(block3.id, updates);
});

// Debounced updates
BuilderX.setDebounceDelay(300); // 300ms
```

### Memory Management

```typescript
// Clear history to free memory
BuilderX.clearHistory();

// Limit history size
BuilderX.setHistoryLimit(50);

// Get memory usage
const usage = BuilderX.getMemoryUsage();
console.log('Memory usage:', usage);
```

## Browser Support

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Feature Detection

```typescript
// Check if BuilderX is supported
if (BuilderX.isSupported()) {
  BuilderX.init(options);
} else {
  console.warn('BuilderX is not supported in this browser');
}

// Check specific features
if (BuilderX.supports('drag-drop')) {
  // Enable drag and drop
}

if (BuilderX.supports('export')) {
  // Enable export functionality
}
```

## TypeScript Support

BuilderX is written in TypeScript and provides full type definitions:

```typescript
// Import types
import type { Block, CanvasState, BuilderXOptions } from '@builderx/types';

// Type-safe block creation
const textBlock: TextBlock = {
  id: 'text-1',
  type: 'text',
  props: {
    content: 'Hello World',
    fontSize: '16px',
    color: '#000000'
  }
};
```

## Migration Guide

### Version 1.0 to 1.1

```typescript
// Old API
BuilderX.createBlock('text', { content: 'Hello' });

// New API
addBlock({
  type: 'text',
  props: { content: 'Hello' }
});
```

### Breaking Changes

- Block creation API changed
- Event names updated
- Export format modified

See [CHANGELOG.md](../CHANGELOG.md) for complete migration details.
