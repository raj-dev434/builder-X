# Development Guide

This guide covers setting up the development environment, contributing to BuilderX, and understanding the codebase.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/smackcoders/fenzik/js-pagebuilder.git
   cd js-pagebuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Development Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
builderx/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── blocks/        # Block-specific components
│   │   ├── BlockRenderer.tsx
│   │   ├── Canvas.tsx
│   │   ├── Inspector.tsx
│   │   ├── Sidebar.tsx
│   │   └── Toolbar.tsx
│   ├── exporters/         # Export functionality
│   │   ├── htmlExporter.ts
│   │   └── jsonExporter.ts
│   ├── renderers/         # Rendering logic
│   ├── schema/            # Type definitions
│   │   └── types.ts
│   ├── store/             # State management
│   │   └── canvasStore.ts
│   ├── utils/             # Utility functions
│   │   └── idGenerator.ts
│   ├── App.tsx            # Main app component
│   ├── index.tsx          # Entry point
│   └── styles.css         # Global styles
├── docs/                  # Documentation
├── tests/                 # Test files
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── LICENSE
```

## Code Style

### TypeScript

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use explicit return types for public functions
- Avoid `any` type - use `unknown` or proper typing

```typescript
// Good
interface UserProps {
  name: string;
  age: number;
}

function getUser(id: string): Promise<UserProps> {
  // implementation
}

// Bad
function getUser(id: any): any {
  // implementation
}
```

### React

- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful component and prop names
- Keep components small and focused

```typescript
// Good
const TextBlock: React.FC<TextBlockProps> = ({ block, isSelected, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleUpdate = useCallback((content: string) => {
    onUpdate({ props: { ...block.props, content } });
  }, [block.props, onUpdate]);
  
  return (
    <div className="text-block">
      {/* component JSX */}
    </div>
  );
};

// Bad
function TextBlock(props) {
  let isEditing = false;
  // implementation
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Create custom components for repeated patterns
- Use CSS variables for theming
- Keep styles close to components

```css
/* Good - Component-specific styles */
.text-block {
  @apply relative group;
}

.text-block.selected {
  @apply ring-2 ring-primary-500;
}

/* Bad - Global styles for specific components */
.selected-block {
  /* styles */
}
```

## Adding New Features

### 1. New Block Type

To add a new block type:

1. **Define the type** in `src/schema/types.ts`:
   ```typescript
   interface CustomBlock extends BaseBlock {
     type: 'custom';
     props: {
       customProperty: string;
       anotherProperty?: number;
     };
   }
   ```

2. **Create the component** in `src/components/blocks/CustomBlock.tsx`:
   ```typescript
   import React from 'react';
   import { CustomBlock as CustomBlockType } from '../../schema/types';
   import { BaseBlock } from './BaseBlock';

   interface CustomBlockProps {
     block: CustomBlockType;
     isSelected: boolean;
     onSelect: () => void;
     onUpdate: (updates: Partial<CustomBlockType>) => void;
     onDelete: () => void;
   }

   export const CustomBlock: React.FC<CustomBlockProps> = ({
     block,
     isSelected,
     onSelect,
     onUpdate,
     onDelete
   }) => {
     return (
       <BaseBlock
         block={block}
         isSelected={isSelected}
         onSelect={onSelect}
         onDelete={onDelete}
       >
         <div className="custom-block">
           {block.props.customProperty}
         </div>
       </BaseBlock>
     );
   };
   ```

3. **Add to BlockRenderer** in `src/components/BlockRenderer.tsx`:
   ```typescript
   import { CustomBlock } from './blocks/CustomBlock';

   // In the switch statement
   case 'custom':
     return <CustomBlock {...commonProps} />;
   ```

4. **Add to templates** in `src/schema/types.ts`:
   ```typescript
   {
     id: 'custom',
     name: 'Custom Block',
     icon: '🎨',
     block: {
       type: 'custom',
       props: {
         customProperty: 'Default value',
         anotherProperty: 42
       }
     }
   }
   ```

5. **Update export functions** in `src/exporters/`:
   ```typescript
   // In htmlExporter.ts
   case 'custom':
     return renderCustomToHTML(block);
   ```

6. **Add property editor** in `src/components/Inspector.tsx`:
   ```typescript
   case 'custom':
     return (
       <>
         <div>
           <label>Custom Property</label>
           <input
             value={block.props.customProperty || ''}
             onChange={(e) => handlePropChange('customProperty', e.target.value)}
           />
         </div>
       </>
     );
   ```

### 2. New Export Format

To add a new export format:

1. **Create exporter** in `src/exporters/`:
   ```typescript
   import { Block } from '../schema/types';

   export function exportToCustomFormat(blocks: Block[]): string {
     // Implementation
     return customFormatString;
   }
   ```

2. **Add to ExportModal** in `src/components/ExportModal.tsx`:
   ```typescript
   const [exportType, setExportType] = useState<'html' | 'json' | 'custom'>('html');
   ```

3. **Update export logic**:
   ```typescript
   if (exportType === 'custom') {
     const custom = exportToCustomFormat(blocks);
     setExportedContent(custom);
   }
   ```

### 3. New Store Action

To add a new store action:

1. **Define the action** in `src/store/canvasStore.ts`:
   ```typescript
   interface CanvasStore extends CanvasState {
     // Existing actions...
     newAction: (param: string) => void;
   }

   export const useCanvasStore = create<CanvasStore>((set, get) => ({
     // Existing actions...
     newAction: (param) => {
       // Implementation
       set({ /* new state */ });
     }
   }));
   ```

2. **Use in components**:
   ```typescript
   const newAction = useCanvasStore(state => state.newAction);
   ```

## Testing

### Unit Tests

Create tests in `tests/` directory:

```typescript
// tests/components/TextBlock.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TextBlock } from '../../src/components/blocks/TextBlock';

describe('TextBlock', () => {
  it('renders text content', () => {
    const block = {
      id: '1',
      type: 'text',
      props: { content: 'Hello World' }
    };
    
    render(<TextBlock block={block} isSelected={false} onSelect={() => {}} onUpdate={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
  
  it('enters edit mode on double click', () => {
    // Test implementation
  });
});
```

### Integration Tests

Test component interactions:

```typescript
// tests/integration/Canvas.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from '../../src/components/Canvas';
import { useCanvasStore } from '../../src/store/canvasStore';

describe('Canvas Integration', () => {
  it('adds block on drop', () => {
    // Test drag and drop
  });
  
  it('selects block on click', () => {
    // Test selection
  });
});
```

### Store Tests

Test Zustand store actions:

```typescript
// tests/store/canvasStore.test.ts
import { useCanvasStore } from '../../src/store/canvasStore';

describe('Canvas Store', () => {
  it('adds block correctly', () => {
    const { getState } = useCanvasStore;
    
    getState().addBlock({
      type: 'text',
      props: { content: 'Test' }
    });
    
    expect(getState().blocks).toHaveLength(1);
  });
});
```

## Debugging

### Development Tools

1. **React DevTools** - Inspect component state and props
2. **Redux DevTools** - Debug Zustand store (with middleware)
3. **Browser DevTools** - Network, performance, console

### Debug Mode

Enable debug mode in development:

```typescript
// In App.tsx
if (process.env.NODE_ENV === 'development') {
  window.BuilderX = {
    store: useCanvasStore.getState(),
    debug: true
  };
}
```

### Logging

Use consistent logging:

```typescript
const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[BuilderX] ${message}`, data);
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[BuilderX] ${message}`, error);
  }
};
```

## Performance

### Optimization Techniques

1. **React.memo** for expensive components:
   ```typescript
   export const ExpensiveComponent = React.memo<Props>(({ data }) => {
     // Component implementation
   });
   ```

2. **useCallback** for stable function references:
   ```typescript
   const handleUpdate = useCallback((updates) => {
     updateBlock(id, updates);
   }, [id, updateBlock]);
   ```

3. **useMemo** for expensive calculations:
   ```typescript
   const processedData = useMemo(() => {
     return expensiveCalculation(data);
   }, [data]);
   ```

### Bundle Analysis

Analyze bundle size:

```bash
npm run build
npm run analyze
```

### Performance Monitoring

Monitor performance in production:

```typescript
// Performance monitoring
const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
```

## Deployment

### Build Process

1. **Production build**:
   ```bash
   npm run build
   ```

2. **Preview build**:
   ```bash
   npm run preview
   ```

3. **Deploy to server**:
   ```bash
   # Copy dist/ folder to web server
   rsync -av dist/ user@server:/var/www/builderx/
   ```

### Environment Variables

Configure for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:3001
VITE_DEBUG=true

# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

### Docker

Create Dockerfile for containerized deployment:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Contributing

### Pull Request Process

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** with tests
4. **Run tests**: `npm test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

### Code Review

- All code must be reviewed
- Tests must pass
- Documentation must be updated
- No breaking changes without discussion

### Issue Reporting

When reporting issues:

1. Use the issue template
2. Provide reproduction steps
3. Include browser/OS information
4. Add screenshots if applicable

### Feature Requests

For new features:

1. Check existing issues first
2. Describe the use case
3. Provide mockups if possible
4. Discuss implementation approach

## Release Process

### Versioning

We use semantic versioning (semver):

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### Release Steps

1. **Update version** in `package.json`
2. **Update CHANGELOG.md**
3. **Create release branch**
4. **Run full test suite**
5. **Build production bundle**
6. **Create Git tag**
7. **Publish to npm** (if applicable)
8. **Deploy to production**

### Changelog

Maintain `CHANGELOG.md` with:

- New features
- Bug fixes
- Breaking changes
- Migration notes

## Support

### Getting Help

- Check [documentation](./README.md)
- Search [existing issues](https://gitlab.com/smackcoders/fenzik/js-pagebuilder/-/issues)
- Join [Discord community](https://discord.gg/builderx)
- Contact [support@smackcoders.com](mailto:support@smackcoders.com)

### Community

- **Discord**: Real-time chat and support
- **GitLab Issues**: Bug reports and feature requests
- **GitLab Discussions**: General discussion and Q&A
- **Blog**: Tutorials and updates

### Commercial Support

For enterprise support:

- Priority bug fixes
- Custom feature development
- Training and consulting
- SLA guarantees

Contact [enterprise@smackcoders.com](mailto:enterprise@smackcoders.com) for details.
