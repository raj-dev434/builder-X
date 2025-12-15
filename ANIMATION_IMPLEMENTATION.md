# Animation System Implementation

## Overview
The animation system in this project is implemented using **Standard CSS3 Animations** (Keyframes), **NOT** HTML5 Canvas.

## Components Breakdown

### 1. Inspector UI (`src/components/inspector/AnimationEditor.tsx`)
- Provides a user interface for selecting animations.
- Options include:
  - **Entrance**: `fadeIn`, `slideInUp`, `zoomIn`, etc.
  - **Exit**: `fadeOut`, `slideOutDown`, etc.
  - **Hover**: `pulse`, `bounce`, `tada`, etc.
  - **Custom**: Allows manual entry of animation names and timing.
- Updates the `block.props` with animation configuration (e.g., `animation`, `animationDuration`, `animationDelay`).

### 2. Rendering Logic (`src/components/blocks/BaseBlock.tsx`)
- Reads the animation properties from the block's state.
- Uses helper functions to generate CSS classes and inline styles.
- **Classes**: Adds classes like `.animate-fadeIn` or `.hover:animate-pulse` to the block's wrapper `div`.
- **Styles**: Applies dynamic properties like `animationDuration`, `animationDelay`, `animationIterationCount` via inline styles (`style={{ ... }}`).

### 3. Animation Utilities (`src/utils/animations.ts`)
- **`animationStyles`**: A large string containing all the `@keyframes` definitions (e.g., `@keyframes fadeIn { ... }`) and utility classes (e.g., `.animate-fadeIn { animation: fadeIn ... }`).
- **`getAnimationClass(name, type)`**: Maps an animation name to its corresponding CSS class.
- **`getAnimationStyle(props)`**: specific properties (duration, delay, etc.) into a React `CSSProperties` object.
- **`injectAnimationStyles()`**: A function designed to inject the `animationStyles` string into the document `<head>` within a `<style>` tag.

## How it Works
1.  **User Selection**: User picks "Fade In" in the Inspector.
2.  **State Update**: `block.props.animation` is set to `'fadeIn'`.
3.  **Render**: `BaseBlock` sees this prop, calls `getAnimationClass('fadeIn', 'entrance')`.
4.  **DOM**: The block's `div` gets `class="... animate-fadeIn"`.
5.  **CSS**: The browser applies the `fadeIn` keyframe animation defined in the injected global styles.

## Important Note
The function `injectAnimationStyles` in `src/utils/animations.ts` must be executed (e.g., in `App.tsx` or `Layout.tsx` inside a `useEffect`) for the animations to be visible. If the keyframes are not present in the DOM, the classes will have no effect.
