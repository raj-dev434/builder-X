# Getting Started with BuilderX

This comprehensive guide will help you set up and start using BuilderX, the professional embeddable page builder.

## 🚀 Installation

### Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **Package Manager**: npm, yarn, or pnpm
- **Modern Browser**: Chrome, Firefox, Safari, Edge (latest versions)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://gitlab.com/smackcoders/fenzik/js-pagebuilder.git
   cd js-pagebuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (Vite default port)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run cypress:open # Open Cypress E2E tests
npm run lint         # Run ESLint
```

## 🎯 Basic Usage

### Creating Your First Page

1. **Add a Section**
   - Drag the "Section" block from the left sidebar to the canvas
   - Sections provide the main container for your content
   - Configure background, padding, and spacing in the properties panel

2. **Add Layout Structure**
   - Choose from pre-built layouts: 1-column, 2-columns, 3-columns, etc.
   - Or drag individual "Row" and "Column" blocks for custom layouts
   - Layout blocks automatically generate the proper column structure

3. **Add Content Blocks**
   - **Basic**: Text, Heading, Image, Button, Link, Icon, Map
   - **Forms**: Input, Textarea, Select, Checkbox, Radio, Label
   - **Advanced**: Card, Badge, Alert, Progress, Navbar
   - **E-commerce**: Product, Price, Promo Code, Testimonial

4. **Edit and Style**
   - **Click blocks** to select and see the contextual toolbar
   - **Use the properties panel** to modify styling and behavior
   - **Inline editing** for text content (double-click or select)
   - **Real-time preview** of all changes

5. **Export Your Page**
   - Click the "Export" button in the toolbar
   - Choose between **HTML** (with inline styles) or **JSON** (schema)
   - Copy or download the generated code

### 🧱 Block Categories

#### **Basic Components**
- **Text**: Rich text content with inline editing
- **Heading**: H1-H6 headings with typography controls
- **Image**: Image display with responsive options
- **Button**: Interactive buttons with hover effects
- **Link**: Text links with target and styling options
- **Icon**: Icon display with size and color controls
- **Map**: Embedded maps (Google Maps, etc.)
- **Divider**: Visual separators with styling
- **Spacer**: Flexible spacing elements

#### **Layout Components**
- **Section**: Main container with background and spacing
- **Row**: Horizontal flex container
- **Column**: Vertical flex container
- **Container**: Content wrapper with max-width
- **Group**: Logical grouping of blocks
- **Pre-built Layouts**: 1-5 column layouts with various ratios

#### **Form Components**
- **Form**: Form container with validation
- **Input**: Text input fields with types
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Checkbox inputs with labels
- **Radio**: Radio button groups
- **Label**: Form labels
- **Survey**: Survey/questionnaire blocks

#### **Advanced Components**
- **Navbar**: Navigation bars with links
- **Card**: Content cards with image, title, description
- **Badge**: Status badges and labels
- **Alert**: Alert messages with types
- **Progress**: Progress bars and indicators
- **Video**: Video embeds and players
- **Code**: Code blocks with syntax highlighting
- **Social Follow**: Social media links

#### **E-commerce Components**
- **Product**: Product display blocks
- **Price**: Price display with formatting
- **Promo Code**: Promotional code blocks
- **Testimonial**: Customer testimonials
- **Countdown Timer**: Time-limited offers
- **Progress Bar**: Progress indicators

## ⌨️ Keyboard Shortcuts

### **Block Operations**
- `Delete` - Delete selected block
- `Escape` - Deselect current block
- `Tab` - Navigate between blocks
- `Enter` - Edit text content inline

### **History Management**
- `Ctrl+Z` / `Cmd+Z` - Undo last action
- `Ctrl+Y` / `Cmd+Y` - Redo last action
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` - Redo (alternative)

### **Selection Toolbar Actions**
- `Ctrl+D` / `Cmd+D` - Duplicate selected block
- `Ctrl+↑` / `Cmd+↑` - Move block up
- `Ctrl+↓` / `Cmd+↓` - Move block down

## 🎨 Interface Overview

### **Left Panel - Block Library**
- **Search Bar**: Find blocks quickly by name or type
- **Categories**: Organized block categories (Basic, Layout, Forms, Extra)
- **Accordion**: Expandable categories with all blocks visible by default
- **Drag & Drop**: Drag blocks to canvas for placement

### **Canvas - Main Editing Area**
- **Visual Editor**: See your page as you build it
- **Selection Indicators**: Blue borders show selected blocks
- **Contextual Toolbar**: Appears above selected blocks with actions
- **Drop Zones**: Visual feedback for valid drop locations

### **Properties Panel - Inspector**
- **Real-time Editing**: Changes appear instantly on canvas
- **Organized Sections**: General, Dimensions, Typography, Decorations, Extra, Flex
- **Responsive Controls**: Mobile, tablet, desktop breakpoint settings
- **Animation Settings**: Entrance, exit, and hover animations

## 💡 Tips and Best Practices

### **1. Start with Structure**
- Always begin with **Section → Row → Column** layout
- Use pre-built layouts for common structures (2-column, 3-column, etc.)
- This provides a solid foundation for responsive design

### **2. Use the Selection System**
- **Click blocks** to select and see the contextual toolbar
- **Use the properties panel** for detailed styling
- **Inline editing** for quick text changes
- **Visual feedback** shows what's selected

### **3. Leverage the Block Library**
- **Search functionality** helps find blocks quickly
- **Categories** organize blocks by purpose
- **Pre-built layouts** save time on common structures
- **All categories open** by default for easy browsing

### **4. Style with the Inspector**
- **Real-time preview** of all changes
- **Organized sections** make properties easy to find
- **Responsive design** with breakpoint-specific settings
- **Animation controls** for enhanced user experience

### **5. Export and Save**
- **Export regularly** to avoid losing progress
- **JSON export** allows importing and continuing later
- **HTML export** provides clean, production-ready code
- **Both formats** are CSP-safe with no external dependencies

### **6. Test Responsiveness**
- Use browser dev tools to test different screen sizes
- Layout blocks automatically adapt to smaller screens
- Responsive properties allow fine-tuning for each breakpoint

## 🔧 Advanced Features

### **Contextual Selection Toolbar**
When you select any block, a blue toolbar appears above it with:
- **Move Up/Down**: Reorder blocks in the hierarchy
- **Duplicate**: Create copies of blocks
- **Delete**: Remove blocks with confirmation
- **Move/Drag**: Visual indicator for drag operations

### **Nested Drag & Drop**
- **Layout blocks** (rows, columns) act as containers
- **Drop blocks** into containers for nested structures
- **Visual feedback** shows valid drop zones
- **Automatic positioning** within containers

### **Animation System**
- **Entrance animations**: Fade in, slide in, zoom in, etc.
- **Exit animations**: Fade out, slide out, zoom out, etc.
- **Hover animations**: Scale, rotate, color changes
- **Custom animations**: Define your own CSS animations

### **Export Options**
- **HTML Export**: Clean, CSP-safe HTML with inline styles
- **JSON Export**: Complete schema for programmatic use
- **XSS Protection**: Sanitized content and safe HTML generation
- **Zero Dependencies**: Self-contained output

## 🚀 Next Steps

- [Architecture Guide](./architecture.md) - Learn about the technical architecture
- [Integration Guide](./integration.md) - Embed BuilderX in your application
- [API Reference](./api-reference.md) - Detailed API documentation
- [Development Guide](./development.md) - Contributing and extending BuilderX
