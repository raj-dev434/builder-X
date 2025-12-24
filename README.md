# BuilderX 

BuilderX is a powerful, embeddable visual page builder for React applications. It offers a comprehensive drag-and-drop experience, ensuring pixel-perfect design with a robust set of features for developers and end-users.

---

## 🚀 Key Features

### 🛠️ Core Functionality
*   **Layers Manager**: A dedicated "Layers" panel that tracks every block deployed on the canvas, allowing for easy navigation and management of complex layouts.
*   **Settings & Asset Management**: A centralized settings area where users can:
    *   **Manage Assets**: Upload and store images or files.
    *   **Templates**: Save your current layout as a template and load previously saved templates instantly.
*   **Import / Export**:
    *   **Export**: Fully fixed export functionality supporting both **clean HTML** and **JSON Schema**.
    *   **Import**: Users can now import existing HTML or JSON code directly into the builder to resume editing or migrate layouts.

### 📱 Fully Responsive
*   **Universal Device Support**: Every single block has been optimized for **Desktop**, **Tablet**, and **Mobile** views.
*   **Responsive Canvas**: The editing canvas accurately reflects changes across all breakpoints, ensuring designs look great on any device.

### 🎨 Advanced Styling & Architecture
*   **DRY Architecture**: The codebase has been refactored to follow the **DRY (Don't Repeat Yourself)** pattern.
*   **Shared Advanced Tab**: The "Advanced" tab (containing Margin, Padding, Z-Index, Transitions, etc.) is now a shared component used across **all blocks**. This ensures consistency and makes maintenance effortless.
*   **Transitions & Hover Effects**: Integrated support for hover states (Scale, Lift, Opacity, Colors) and CSS transitions directly within the inspector.

---

## 📁 File Structure

```
/js-pagebuilder-main
├── /dist                   # Build output
├── /src
│   ├── /components
│   │   ├── /blocks         # 50+ Individual Block Components
│   │   ├── /canvas         # Drag & Drop Canvas Logic
│   │   ├── /inspector      # Property Panels & Shared Advanced Inspector
│   │   ├── /layout         # Sidebar, Toolbar, Layers Panel
│   ├── /store              # Zustand State Management
│   ├── /schema             # TypeScript Types & Block Definitions
│   ├── /exporters          # HTML & JSON Export Logic
│   ├── /utils              # Helper Functions
│   ├── App.tsx             # Main Entry Point
├── /docs                   # Documentation
├── /cypress                # E2E Tests
└── package.json            # Dependencies
```

---

## 🏁 Getting Started

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---.

## 📄 License
MIT License ,this project is owned by smackcoders
