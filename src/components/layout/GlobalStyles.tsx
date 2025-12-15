import React from 'react';
import { useThemeStore } from '../../store/themeStore';

export const GlobalStyles: React.FC = () => {
  const { colors, typography, customCSS, customFonts } = useThemeStore();

  // Generate font imports
  const fontImports = customFonts
    .map(font => `@import url('${font.url}');`)
    .join('\n');

  const css = `
    ${fontImports}

    .canvas-root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      --color-background: ${colors.background};
      --color-text: ${colors.text};
      --color-success: ${colors.success};
      --color-warning: ${colors.warning};
      --color-error: ${colors.error};

      --font-heading: ${typography.headingFont};
      --font-body: ${typography.bodyFont};
      
      --h1-size: ${typography.h1Size};
      --h2-size: ${typography.h2Size};
      --h3-size: ${typography.h3Size};
      --body-size: ${typography.bodySize};
      
      font-family: var(--font-body);
      color: var(--color-text);
      background-color: var(--color-background);
    }

    .canvas-root h1, .canvas-root h2, .canvas-root h3, .canvas-root h4, .canvas-root h5, .canvas-root h6 {
      font-family: var(--font-heading);
      color: var(--color-text);
    }
    
    .canvas-root h1 { font-size: var(--h1-size); }
    .canvas-root h2 { font-size: var(--h2-size); }
    .canvas-root h3 { font-size: var(--h3-size); }

    /* Custom CSS */
    ${customCSS}
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};
