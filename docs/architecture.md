# BuilderX Architecture

This document explains the technical architecture and design decisions behind BuilderX.

## Overview

BuilderX is built with a modern React stack focusing on:
- **Performance** - Optimized rendering and state management
- **Modularity** - Clean separation of concerns
- **Extensibility** - Easy to add new block types and features
- **Safety** - CSP-compliant with no external dependencies

## Technology Stack

### Core Technologies
- **React 18** - UI framework with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### State Management
- **Zustand** - Lightweight state management
- **Immutable updates** - Predictable state changes
- **History management** - Built-in undo/redo functionality

### Drag & Drop
- **@dnd-kit** - Accessible drag and drop library
- **Custom implementation** - Optimized for our use case

## Project Structure

```
src/
├── components/          # UI Components
│   ├── blocks/         # Block-specific components
│   ├── BlockRenderer.tsx
│   ├── Canvas.tsx
│   ├── Inspector.tsx
│   ├── Sidebar.tsx
│   └── Toolbar.tsx
├── exporters/          # Export functionality
│   ├── htmlExporter.ts
│   └── jsonExporter.ts
├── renderers/          # Rendering logic
├── schema/             # Type definitions
│   └── types.ts
├── store/              # State management
│   └── canvasStore.ts
├── utils/              # Utility functions
│   └── idGenerator.ts
├── App.tsx
├── index.tsx
└── styles.css
```

## Core Architecture

### Block System

BuilderX uses a hierarchical block system where each block has:

```typescript
interface BaseBlock {
  id: string;           // Unique identifier
  type: string;         // Block type (text, image, etc.)
  props: Record<string, any>;  // Configurable properties
  children?: Block[];   // Nested blocks
}
```

#### Block Types
- **Container Blocks**: Section, Row, Column (can contain other blocks)
- **Content Blocks**: Text, Image, Button (leaf nodes)

### State Management

The application state is managed by Zustand with the following structure:

```typescript
interface CanvasState {
  blocks: Block[];              // The page structure
  selectedBlockId: string | null;  // Currently selected block
  history: Block[][];           // Undo/redo history
  historyIndex: number;         // Current history position
  isDragging: boolean;          // Drag state
}
```

#### Key Actions
- `addBlock` - Add new block to canvas
- `updateBlock` - Modify block properties
- `deleteBlock` - Remove block from canvas
- `selectBlock` - Change selection
- `undo/redo` - History navigation

### Rendering Pipeline

1. **Block Definition** - Blocks are defined in `schema/types.ts`
2. **Component Mapping** - `BlockRenderer` maps types to components
3. **Property Binding** - Props are passed to components
4. **Event Handling** - User interactions update state
5. **Re-rendering** - Zustand triggers component updates

### Export System

#### HTML Export
- Generates clean, semantic HTML
- Inline styles for CSP compliance
- Responsive design with CSS Grid/Flexbox
- No external dependencies

#### JSON Export
- Complete block structure
- Version information
- Timestamp metadata
- Import/export compatibility

## Design Patterns

### Component Composition
- **BaseBlock** - Common functionality for all blocks
- **Specialized Blocks** - Type-specific implementations
- **Renderer Pattern** - Dynamic component selection

### State Management
- **Immutable Updates** - All state changes create new objects
- **Command Pattern** - Actions are encapsulated and reversible
- **Observer Pattern** - Components react to state changes

### Event Handling
- **Event Delegation** - Efficient event handling
- **Stop Propagation** - Prevent unwanted event bubbling
- **Keyboard Support** - Full accessibility

## Performance Considerations

### Rendering Optimization
- **React.memo** - Prevent unnecessary re-renders
- **useCallback** - Stable function references
- **Virtual Scrolling** - For large block lists (future)

### State Optimization
- **Shallow Comparison** - Efficient state updates
- **History Limiting** - Prevent memory leaks
- **Lazy Loading** - Load components on demand

### Bundle Optimization
- **Code Splitting** - Separate vendor and app code
- **Tree Shaking** - Remove unused code
- **Minification** - Compress production builds

## Security Considerations

### CSP Compliance
- **No Inline Scripts** - All JavaScript is external
- **No Eval** - No dynamic code execution
- **Safe HTML** - Escaped content in exports

### XSS Prevention
- **Content Escaping** - All user content is escaped
- **Safe URLs** - Validated image sources
- **No Script Injection** - No dynamic script loading

## Extensibility

### Adding New Block Types
1. Define block type in `schema/types.ts`
2. Create component in `components/blocks/`
3. Add to `BlockRenderer` switch statement
4. Update export functions
5. Add to `BLOCK_TEMPLATES` array

### Custom Properties
- Extend block props interfaces
- Add property editors in `Inspector`
- Update export functions
- Add validation if needed

### Plugin System (Future)
- Block plugin architecture
- Custom property editors
- Third-party integrations
- Theme system

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Utility functions
- Export functions

### Integration Tests
- User interactions
- Drag and drop
- Export/import cycle
- Cross-browser compatibility

### E2E Tests
- Complete user workflows
- Performance benchmarks
- Accessibility compliance

## Future Enhancements

### Planned Features
- **Advanced Layouts** - CSS Grid support
- **Animation System** - Transitions and effects
- **Template Library** - Pre-built page templates
- **Collaboration** - Real-time editing
- **Plugin API** - Third-party extensions

### Technical Improvements
- **Performance** - Virtual scrolling, lazy loading
- **Accessibility** - Screen reader support
- **Mobile** - Touch-optimized interface
- **Offline** - Service worker support
