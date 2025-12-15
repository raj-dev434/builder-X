# BuilderX Documentation

Welcome to BuilderX, a comprehensive, production-ready embeddable page builder built with React, TypeScript, Tailwind CSS, and Zustand.

## 📚 Table of Contents

- [Getting Started](./getting-started.md) - Installation and basic usage
- [Architecture](./architecture.md) - Technical architecture and design patterns
- [API Reference](./api-reference.md) - Complete API documentation
- [Integration Guide](./integration.md) - Embedding in different platforms
- [Development Guide](./development.md) - Contributing and extending BuilderX
- [Contributing](./contributing.md) - Guidelines for contributors

## 🚀 Quick Start

```bash
# Clone and install
git clone https://gitlab.com/smackcoders/fenzik/js-pagebuilder.git
cd js-pagebuilder
npm install

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## ✨ Key Features

### 🧱 **Comprehensive Block Library**
- **50+ Block Types**: Text, Images, Forms, Layouts, E-commerce, Interactive
- **Drag & Drop**: Intuitive block placement with visual feedback
- **Nested Layouts**: Support for complex nested structures
- **Search & Filter**: Find blocks quickly with real-time search

### 🎨 **Advanced Styling**
- **Property Inspector**: Real-time editing of all block properties
- **Responsive Design**: Mobile, tablet, desktop breakpoint support
- **CSS Animations**: Entrance, exit, hover animations
- **Flexbox & Grid**: Complete layout control
- **Typography**: Full font and text styling options

### 🔧 **Professional Editor**
- **Contextual Toolbar**: Duplicate, move, delete operations
- **Inline Editing**: Direct content editing with rich text
- **Undo/Redo**: Full history management (50+ actions)
- **Keyboard Shortcuts**: Efficient editing workflow
- **Selection System**: Visual feedback and block management

### 💾 **Export & Integration**
- **Clean HTML**: CSP-safe HTML with inline styles
- **JSON Schema**: Complete layout structure export
- **XSS Protection**: Sanitized content generation
- **Zero Dependencies**: Self-contained output
- **Platform Agnostic**: Works in any web environment

## 🏗️ Core Concepts

### **Blocks**
Every element in BuilderX is a "block" with:
- **Type**: Defines behavior (text, image, button, form, etc.)
- **Props**: Configurable properties (styling, content, behavior)
- **Children**: Nested blocks for complex layouts
- **ID**: Unique identifier for selection and manipulation

### **Canvas**
The main editing area where:
- Blocks are visually arranged
- Drag & drop operations occur
- Selection and editing take place
- Real-time preview is shown

### **Inspector**
The property panel that provides:
- Real-time property editing
- Style controls (typography, spacing, colors)
- Layout options (flexbox, grid, positioning)
- Animation settings
- Responsive breakpoint controls

### **Selection System**
Advanced selection management:
- Visual selection indicators
- Contextual action toolbar
- Multi-block operations
- Keyboard navigation support

### **Export System**
Two export formats:
- **HTML**: Clean, CSP-safe HTML with inline styles
- **JSON**: Complete schema for programmatic use

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Zustand**: Lightweight state management
- **@dnd-kit**: Accessible drag & drop interactions
- **Vite**: Fast build tool and development server
- **Jest + Cypress**: Comprehensive testing suite

## 📜 License

MIT License - See [LICENSE](../LICENSE) for details.
