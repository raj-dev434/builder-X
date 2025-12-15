# BuilderX – Professional Embeddable Page Builder

BuilderX is a comprehensive, production-ready visual page builder designed to be embeddable in any platform — WordPress, Laravel, Ghost, or static HTML. It provides full WYSIWYG editing with export capabilities to **clean HTML** and **JSON layout schemas**, with zero CORS or CSP violations.

---

## 🚀 Features

### 🧱 **Comprehensive Block Library (50+ Blocks)**
- **Basic Components**: Text, Heading, Image, Button, Link, Icon, Map, Divider, Spacer
- **Layout Components**: 1-5 column layouts, Rows, Columns, Containers, Sections
- **Form Components**: Input, Textarea, Select, Checkbox, Radio, Label, Form, Survey
- **Advanced Components**: Navbar, Card, Badge, Alert, Progress, Video, Code, Social Follow
- **E-commerce Components**: Product, Price, Promo Code, Testimonial
- **Interactive Components**: Countdown Timer, Progress Bar

### 🎨 **Advanced Styling & Design**
- **Real-time Property Inspector**: Typography, Dimensions, Colors, Borders, Shadows
- **Responsive Design**: Mobile, Tablet, Desktop breakpoint support
- **CSS Animations**: Entrance, exit, hover animations with full customization
- **Flexbox & Grid**: Complete layout control with visual editors
- **Inline Editing**: Direct content editing with rich text support

### 🔧 **Professional Editor Experience**
- **Contextual Selection Toolbar**: Duplicate, Move Up/Down, Delete, Drag operations
- **Drag & Drop Interface**: Intuitive block placement with visual feedback
- **Search & Filter**: Find blocks quickly with real-time search
- **Undo/Redo System**: Full history management with 50+ action history
- **Keyboard Shortcuts**: Efficient editing with keyboard navigation

### 💾 **Export & Integration**
- **Clean HTML Export**: CSP-safe HTML with inline styles
- **JSON Schema Export**: Complete layout structure for programmatic use
- **XSS Protection**: Sanitized content and safe HTML generation
- **Zero Dependencies**: Self-contained with no external scripts
- **Embeddable**: Works in WordPress, Laravel, Ghost, and any web environment

---

## 🧠 Architecture

### **Technology Stack**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand for lightweight, performant state
- **Drag & Drop**: @dnd-kit for accessible, touch-friendly interactions
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Jest + React Testing Library + Cypress E2E
- **Styling**: Tailwind CSS with custom design system

### **Core Architecture**
- **Block-Based System**: Every element is a typed block with properties
- **JSON-First Schema**: Complete layout representation in JSON format
- **Component-Driven**: React components for all block types
- **Type-Safe**: Full TypeScript coverage with strict typing
- **Modular Design**: Pluggable architecture for easy extension

---

## 📦 Project Structure

```
/builderx
│
├── /src
│   ├── /components
│   │   ├── /blocks          → 50+ block components (Text, Image, Form, etc.)
│   │   ├── Canvas.tsx       → Main editing canvas
│   │   ├── JSLayout.tsx     → Main layout component
│   │   ├── JSSidebar.tsx    → Block library sidebar
│   │   ├── JSToolbar.tsx    → Top toolbar
│   │   ├── SelectionToolbar.tsx → Contextual action toolbar
│   │   └── DarkInspectorComplete.tsx → Property inspector
│   ├── /store
│   │   └── canvasStore.ts   → Zustand state management
│   ├── /schema
│   │   └── types.ts         → TypeScript interfaces & block templates
│   ├── /exporters
│   │   ├── htmlExporter.ts  → Clean HTML generation
│   │   └── jsonExporter.ts  → JSON schema export
│   ├── /utils
│   │   ├── animations.ts    → CSS animation utilities
│   │   └── idGenerator.ts   → Unique ID generation
│   └── App.tsx              → Main application
├── /docs                    → Comprehensive documentation
├── /cypress                 → E2E tests
└── package.json             → Dependencies & scripts
```

---

## 📤 Export Output

### JSON Schema Export
Complete layout structure with all properties and styling:

```json
{
  "id": "section-1",
  "type": "section",
  "props": {
    "backgroundColor": "#ffffff",
    "padding": "2rem",
    "textAlign": "center"
  },
  "children": [
    {
      "id": "row-1",
      "type": "row",
      "props": {
        "gap": "1rem",
        "justifyContent": "center",
        "alignItems": "center"
      },
      "children": [
        {
          "id": "column-1",
          "type": "column",
          "props": {
            "width": "50%",
            "flex": "1"
          },
          "children": [
            {
              "id": "heading-1",
              "type": "heading",
              "props": {
                "text": "Welcome to BuilderX",
                "level": 1,
                "color": "#333333",
                "fontSize": "2.5rem",
                "fontWeight": "bold"
              }
            },
            {
              "id": "text-1",
              "type": "text",
              "props": {
                "content": "Build beautiful pages with our drag-and-drop editor",
                "color": "#666666",
                "fontSize": "1.2rem"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Clean HTML Export
CSP-safe HTML with inline styles:

```html
<section id="section-1" style="background-color: #ffffff; padding: 2rem; text-align: center;">
  <div id="row-1" style="display: flex; gap: 1rem; justify-content: center; align-items: center;">
    <div id="column-1" style="width: 50%; flex: 1;">
      <h1 id="heading-1" style="color: #333333; font-size: 2.5rem; font-weight: bold; margin: 0;">
        Welcome to BuilderX
      </h1>
      <p id="text-1" style="color: #666666; font-size: 1.2rem; margin: 1rem 0 0 0;">
        Build beautiful pages with our drag-and-drop editor
      </p>
    </div>
  </div>
</section>
```

---

## 🧩 Integration Support

- **WordPress Plugin**: via shortcode + iframe embed
- **Laravel Extension**: Blade component + JSON save
- **Ghost CMS**: Handlebars partial
- **HTML Pages**: Single `div` embed

All outputs can be safely used in your CMS with no external script or styling dependencies.

---

## 🛠️ Development

### Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **Package Manager**: npm, yarn, or pnpm
- **Modern Browser**: Chrome, Firefox, Safari, Edge (latest versions)

### Quick Start

```bash
# Clone the repository
git clone https://gitlab.com/smackcoders/fenzik/js-pagebuilder.git
cd js-pagebuilder

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

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

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Jest Testing**: Unit and integration tests
- **Cypress E2E**: End-to-end testing
- **Vite Build**: Fast, optimized production builds

---

## 📜 License

**MIT License** – Open source and free to use in commercial projects.

---

## 💡 Roadmap

### ✅ **Completed Features**
- [x] Comprehensive block library (50+ blocks)
- [x] Drag & drop interface with @dnd-kit
- [x] Real-time property inspector
- [x] Contextual selection toolbar
- [x] JSON schema engine
- [x] Clean HTML export with XSS protection
- [x] Undo/redo system with history
- [x] Responsive design support
- [x] CSS animations system
- [x] TypeScript implementation
- [x] Testing suite (Jest + Cypress)

### 🚧 **In Progress**
- [ ] Advanced form validation
- [ ] Custom CSS editor
- [ ] Block templates library
- [ ] Import/export functionality

### 🔮 **Future Features**
- [ ] WordPress plugin integration
- [ ] Laravel package
- [ ] Ghost CMS integration
- [ ] Plugin/widget API
- [ ] Live collaboration (CRDT)
- [ ] Advanced animations
- [ ] Theme system
- [ ] Multi-language support

---

## 📋 TODO & Known Issues

### 🚨 **Critical Issues to Fix**

#### **Block Functionality Issues**
- [ ] **Form Validation**: Form blocks lack proper validation logic
- [ ] **Image Upload**: Image blocks only accept URLs, no file upload functionality
- [ ] **Map Integration**: Map blocks are placeholder only, need actual map integration
- [ ] **Video Embedding**: Video blocks need proper embed code handling
- [ ] **Code Syntax Highlighting**: Code blocks lack syntax highlighting
- [ ] **Social Media Links**: Social follow blocks need actual social media integration
- [ ] **Countdown Timer**: Timer blocks need actual countdown functionality
- [ ] **Progress Bar**: Progress blocks need dynamic value updates
- [ ] **Product Display**: Product blocks need e-commerce integration
- [ ] **Testimonial Carousel**: Testimonial blocks need carousel functionality

#### **Editor Experience Issues**
- [ ] **Keyboard Shortcuts**: Many keyboard shortcuts are not implemented
- [ ] **Copy/Paste**: No copy-paste functionality for blocks
- [ ] **Multi-select**: Cannot select multiple blocks at once
- [ ] **Block Templates**: No save/load custom block templates
- [ ] **Undo/Redo Limits**: History is limited to 50 actions, should be configurable
- [ ] **Auto-save**: No automatic saving functionality
- [ ] **Import/Export**: No import functionality for JSON layouts
- [ ] **Responsive Preview**: No responsive preview mode in editor

#### **Styling & Design Issues**
- [ ] **Custom CSS Editor**: No way to add custom CSS
- [ ] **Theme System**: No theme switching or custom themes
- [ ] **Color Picker**: Basic color picker, needs advanced color tools
- [ ] **Font Management**: No font family management or custom fonts
- [ ] **Gradient Support**: No gradient background support
- [ ] **Border Radius**: Limited border radius options
- [ ] **Box Shadow**: Basic shadow options, needs advanced shadow editor
- [ ] **Animation Timeline**: No visual animation timeline editor

### 🔧 **Technical Debt & Improvements**

#### **Performance Issues**
- [ ] **Large Layouts**: Performance degrades with complex layouts
- [ ] **Memory Leaks**: Potential memory leaks in long editing sessions
- [ ] **Bundle Size**: Large bundle size, needs code splitting
- [ ] **Rendering Optimization**: Blocks re-render unnecessarily
- [ ] **History Management**: History takes up too much memory

#### **Code Quality Issues**
- [ ] **TypeScript Coverage**: Some components lack proper TypeScript types
- [ ] **Error Handling**: Inconsistent error handling across components
- [ ] **Testing Coverage**: Low test coverage for new block components
- [ ] **Documentation**: API documentation is incomplete
- [ ] **Code Duplication**: Some block components have duplicated code

#### **Accessibility Issues**
- [ ] **Screen Reader Support**: Limited screen reader compatibility
- [ ] **Keyboard Navigation**: Incomplete keyboard navigation
- [ ] **ARIA Labels**: Missing ARIA labels on many components
- [ ] **Focus Management**: Poor focus management in editor
- [ ] **Color Contrast**: Some UI elements have poor color contrast

### 🎯 **Missing Core Features**

#### **Block Management**
- [ ] **Block Library**: No organized block library with categories
- [ ] **Block Search**: Search functionality is basic, needs advanced filtering
- [ ] **Block Favorites**: No way to mark blocks as favorites
- [ ] **Block History**: No history of recently used blocks
- [ ] **Block Duplication**: Duplicate function exists but needs improvement
- [ ] **Block Grouping**: No way to group related blocks
- [ ] **Block Locking**: No way to lock blocks from editing

#### **Layout & Design**
- [ ] **Grid System**: No CSS Grid support
- [ ] **Flexbox Visual Editor**: No visual flexbox editor
- [ ] **Spacing Tools**: Limited spacing tools (margin/padding)
- [ ] **Alignment Tools**: Basic alignment, needs advanced options
- [ ] **Z-Index Management**: No visual z-index management
- [ ] **Positioning Tools**: Limited positioning options
- [ ] **Overflow Handling**: No overflow property controls

#### **Content Management**
- [ ] **Rich Text Editor**: Basic text editing, needs rich text features
- [ ] **Media Library**: No media library for images/videos
- [ ] **Asset Management**: No asset organization system
- [ ] **Content Templates**: No content templates or snippets
- [ ] **Bulk Operations**: No bulk edit functionality
- [ ] **Content Search**: No search within content
- [ ] **Content Validation**: No content validation rules

### 🔌 **Integration & Export Issues**

#### **Export Limitations**
- [ ] **CSS Optimization**: Exported CSS is not optimized
- [ ] **Image Optimization**: No image optimization in export
- [ ] **Minification**: No HTML/CSS minification
- [ ] **CDN Support**: No CDN integration for assets
- [ ] **Multiple Formats**: Only HTML/JSON export, need more formats
- [ ] **Export Templates**: No export templates or presets

#### **Platform Integration**
- [ ] **WordPress Plugin**: No WordPress plugin implementation
- [ ] **Laravel Package**: No Laravel package
- [ ] **Ghost Integration**: No Ghost CMS integration
- [ ] **API Endpoints**: No REST API for integration
- [ ] **Webhook Support**: No webhook system
- [ ] **Authentication**: No user authentication system

### 🧪 **Testing & Quality Assurance**

#### **Testing Gaps**
- [ ] **E2E Tests**: Limited end-to-end test coverage
- [ ] **Integration Tests**: Missing integration tests for complex workflows
- [ ] **Performance Tests**: No performance testing
- [ ] **Accessibility Tests**: No accessibility testing
- [ ] **Cross-browser Tests**: Limited cross-browser testing
- [ ] **Mobile Tests**: No mobile-specific testing

#### **Quality Assurance**
- [ ] **Code Review Process**: No formal code review process
- [ ] **CI/CD Pipeline**: No continuous integration pipeline
- [ ] **Automated Testing**: No automated testing in CI
- [ ] **Performance Monitoring**: No performance monitoring
- [ ] **Error Tracking**: No error tracking system
- [ ] **Analytics**: No usage analytics

### 📚 **Documentation & Support**

#### **Documentation Gaps**
- [ ] **User Manual**: No comprehensive user manual
- [ ] **Video Tutorials**: No video tutorials
- [ ] **API Documentation**: Incomplete API documentation
- [ ] **Integration Guides**: Missing integration guides
- [ ] **Troubleshooting**: No troubleshooting guide
- [ ] **FAQ**: No frequently asked questions

#### **Developer Experience**
- [ ] **Plugin API**: No plugin development API
- [ ] **Custom Blocks**: No guide for creating custom blocks
- [ ] **Theming Guide**: No theming documentation
- [ ] **Migration Guide**: No migration documentation
- [ ] **Changelog**: No detailed changelog
- [ ] **Release Notes**: No release notes

### 🎨 **UI/UX Improvements**

#### **User Interface**
- [ ] **Dark Mode**: No dark mode support
- [ ] **Customizable UI**: No UI customization options
- [ ] **Toolbar Customization**: No toolbar customization
- [ ] **Panel Management**: No panel resizing/docking
- [ ] **Workspace Layouts**: No saved workspace layouts
- [ ] **Quick Actions**: No quick action shortcuts

#### **User Experience**
- [ ] **Onboarding**: No user onboarding flow
- [ ] **Help System**: No contextual help system
- [ ] **Tooltips**: Limited tooltip coverage
- [ ] **Loading States**: Poor loading state management
- [ ] **Error Messages**: Unclear error messages
- [ ] **Success Feedback**: Limited success feedback

### 🔒 **Security & Privacy**

#### **Security Issues**
- [ ] **XSS Prevention**: Basic XSS prevention, needs enhancement
- [ ] **CSRF Protection**: No CSRF protection
- [ ] **Input Sanitization**: Incomplete input sanitization
- [ ] **File Upload Security**: No secure file upload handling
- [ ] **Content Security Policy**: No CSP implementation
- [ ] **Data Validation**: Insufficient data validation

#### **Privacy Concerns**
- [ ] **Data Collection**: No privacy policy for data collection
- [ ] **User Consent**: No user consent management
- [ ] **Data Retention**: No data retention policies
- [ ] **GDPR Compliance**: No GDPR compliance features
- [ ] **Data Export**: No user data export functionality
- [ ] **Data Deletion**: No data deletion functionality

---

## 🤝 Credits

Built by [Fenzik Joseph](https://smackcoders.com)  
Inspired by Elementor, Webflow, GrapesJS, Editor.js  
Powered by React, Tailwind, Zustand

---