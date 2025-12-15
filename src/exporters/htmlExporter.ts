import { Block } from '../schema/types';

export function exportToHTML(blocks: Block[]): string {
  const html = blocks.map(block => renderBlockToHTML(block)).join('\n');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="BuilderX Page Builder">
    <title>BuilderX Export</title>
    <style>
        /* Reset and base styles */
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            font-size: 16px;
            line-height: 1.6;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Layout components */
        .builderx-section {
            width: 100%;
            display: block;
        }
        
        .builderx-row {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
        }
        

        
        /* Content components */
        .builderx-text {
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }
        
        .builderx-image {
            max-width: 100%;
            height: auto;
            display: block;
        }
        
        .builderx-button {
            display: inline-block;
            text-decoration: none;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
            text-align: center;
            white-space: nowrap;
        }
        
        .builderx-button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        .builderx-button:active {
            transform: translateY(0);
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            .builderx-row {
                flex-direction: column;
            }
            

        }
        
        @media (max-width: 480px) {
            html {
                font-size: 14px;
            }
        }
        
        /* Print styles */
        @media print {
            .builderx-section {
                page-break-inside: avoid;
            }
            
            .builderx-button {
                border: 1px solid #000;
            }
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;
}

function renderBlockToHTML(block: Block): string {
  switch (block.type) {
    case 'section':
      return renderSectionToHTML(block);
    case 'row':
      return renderRowToHTML(block);

    case 'text':
      return renderTextToHTML(block);
    case 'image':
      return renderImageToHTML(block);
    case 'button':
      return renderButtonToHTML(block);
    case 'divider':
      return renderDividerToHTML(block);
    case 'spacer':
      return renderSpacerToHTML(block);
    case 'container':
      return renderContainerToHTML(block);
    case 'social-follow':
      return renderSocialFollowToHTML(block);
    case 'form':
      return renderFormToHTML(block);
    case 'video':
      return renderVideoToHTML(block);
    case 'code':
      return renderCodeToHTML(block);
    case 'group':
      return renderGroupToHTML(block);
    case 'survey':
      return renderSurveyToHTML(block);
    case 'countdown-timer':
      return renderCountdownTimerToHTML(block);
    case 'progress-bar':
      return renderProgressBarToHTML(block);
    case 'product':
      return renderProductToHTML(block);
    case 'promo-code':
      return renderPromoCodeToHTML(block);
    case 'price':
      return renderPriceToHTML(block);
    case 'testimonial':
      return renderTestimonialToHTML(block);
    default:
      return '';
  }
}

function renderDividerToHTML(block: any): string {
  const { height, color, style, width, margin, padding } = block.props;
  const dividerStyle = buildStyleString({
    height,
    backgroundColor: color,
    border: 'none',
    borderTop: `${height} ${style} ${color}`,
    width,
    margin,
    padding,
    display: 'block'
  });
  
  return `<hr class="builderx-divider"${dividerStyle ? ` style="${dividerStyle}"` : ''} />`;
}

function renderSpacerToHTML(block: any): string {
  const { height, backgroundColor, margin, padding, minHeight, maxHeight } = block.props;
  const spacerStyle = buildStyleString({
    height,
    backgroundColor,
    margin,
    padding,
    minHeight,
    maxHeight,
    width: '100%',
    display: 'block'
  });
  
  return `<div class="builderx-spacer"${spacerStyle ? ` style="${spacerStyle}"` : ''}></div>`;
}

function renderContainerToHTML(block: any): string {
  const { backgroundColor, padding, margin, borderRadius, border, boxShadow, minHeight, maxWidth, textAlign } = block.props;
  const containerStyle = buildStyleString({
    backgroundColor,
    padding,
    margin,
    borderRadius,
    border,
    boxShadow,
    minHeight,
    maxWidth,
    textAlign,
    width: '100%',
    display: 'block'
  });
  
  const children = block.children?.map((child: Block) => renderBlockToHTML(child)).join('') || '';
  
  return `<div class="builderx-container"${containerStyle ? ` style="${containerStyle}"` : ''}>
${children}
</div>`;
}

function renderSocialFollowToHTML(block: any): string {
  const { platforms, layout, iconSize, spacing, textAlign, showLabels, backgroundColor, padding, borderRadius } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor,
    padding,
    borderRadius,
    textAlign,
    width: '100%'
  });
  
  const socialContainerStyle = buildStyleString({
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    gap: spacing,
    justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  });
  
  const socialLinks = platforms?.map((platform: any) => {
    const linkStyle = buildStyleString({
      color: platform.color,
      textDecoration: 'none',
      fontSize: iconSize,
      margin: '0 5px'
    });
    
    return `<a href="${platform.url}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">
      <span style="font-size: ${iconSize}; margin-right: ${showLabels ? '8px' : '0'};">
        ${platform.icon}
      </span>
      ${showLabels ? `<span style="font-size: 14px; font-weight: 500;">${platform.name}</span>` : ''}
    </a>`;
  }).join('') || '';
  
  return `<div class="builderx-social-follow"${containerStyle ? ` style="${containerStyle}"` : ''}>
    <div style="${socialContainerStyle}">
      ${socialLinks}
    </div>
  </div>`;
}

function renderFormToHTML(block: any): string {
  const { title, description, fields, submitText, backgroundColor, padding, borderRadius, border, textAlign, buttonColor, buttonTextColor, buttonPadding, buttonBorderRadius } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor,
    padding,
    borderRadius,
    border,
    textAlign,
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  });
  
  const buttonStyle = buildStyleString({
    backgroundColor: buttonColor,
    color: buttonTextColor,
    padding: buttonPadding,
    borderRadius: buttonBorderRadius,
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    width: '100%',
    marginTop: '20px'
  });
  
  const formFields = fields?.map((field: any) => {
    const fieldId = `field_${field.id}`;
    const labelStyle = buildStyleString({
      display: 'block',
      marginBottom: '5px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#374151'
    });
    
    const inputStyle = buildStyleString({
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '16px',
      fontFamily: 'inherit'
    });
    
    let inputElement = '';
    
    if (field.type === 'textarea') {
      inputElement = `<textarea id="${fieldId}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="${inputStyle}; resize: vertical; min-height: 100px;"></textarea>`;
    } else if (field.type === 'select') {
      const options = field.options?.map((option: string) => `<option value="${option}">${option}</option>`).join('') || '';
      inputElement = `<select id="${fieldId}" ${field.required ? 'required' : ''} style="${inputStyle}">
        <option value="">${field.placeholder || 'Select an option'}</option>
        ${options}
      </select>`;
    } else if (field.type === 'checkbox' || field.type === 'radio') {
      inputElement = `<div style="display: flex; align-items: center;">
        <input type="${field.type}" id="${fieldId}" style="margin-right: 8px;" />
        <label for="${fieldId}" style="margin: 0; font-weight: normal;">${field.label}</label>
      </div>`;
    } else {
      inputElement = `<input type="${field.type}" id="${fieldId}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="${inputStyle}" />`;
    }
    
    return `<div style="margin-bottom: 20px;">
      <label for="${fieldId}" style="${labelStyle}">
        ${field.label}
        ${field.required ? '<span style="color: #ef4444;"> *</span>' : ''}
      </label>
      ${inputElement}
    </div>`;
  }).join('') || '';
  
  return `<div class="builderx-form"${containerStyle ? ` style="${containerStyle}"` : ''}>
    <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">${title || 'Contact Us'}</h3>
    ${description ? `<p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px;">${description}</p>` : ''}
    <form>
      ${formFields}
      <button type="submit" style="${buttonStyle}">${submitText || 'Submit'}</button>
    </form>
  </div>`;
}

function renderSectionToHTML(block: any): string {
  const { backgroundColor, padding, margin, minHeight, maxWidth } = block.props;
  const style = buildStyleString({
    backgroundColor,
    padding,
    margin,
    minHeight,
    maxWidth,
    marginLeft: 'auto',
    marginRight: 'auto'
  });
  
  const children = block.children?.map((child: Block) => renderBlockToHTML(child)).join('') || '';
  
  return `<section class="builderx-section"${style ? ` style="${style}"` : ''}>
${children}
</section>`;
}

function renderRowToHTML(block: any): string {
  const { gap, justifyContent, alignItems, wrap, padding, margin } = block.props;
  const style = buildStyleString({
    gap,
    justifyContent,
    alignItems,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    padding,
    margin
  });
  
  const children = block.children?.map((child: Block) => renderBlockToHTML(child)).join('') || '';
  
  return `<div class="builderx-row"${style ? ` style="${style}"` : ''}>
${children}
</div>`;
}



function renderTextToHTML(block: any): string {
  const { content, fontSize, fontWeight, color, textAlign, lineHeight, fontFamily, padding, margin } = block.props;
  const style = buildStyleString({
    fontSize,
    fontWeight,
    color,
    textAlign,
    lineHeight,
    fontFamily,
    padding,
    margin
  });
  
  // Preserve rich text formatting while escaping dangerous content
  const safeContent = sanitizeRichText(content || '');
  
  return `<div class="builderx-text"${style ? ` style="${style}"` : ''}>${safeContent}</div>`;
}

function renderImageToHTML(block: any): string {
  const { src, alt, width, height, objectFit, borderRadius, padding, margin } = block.props;
  const style = buildStyleString({
    width,
    height,
    objectFit,
    borderRadius,
    padding,
    margin
  });
  
  const safeSrc = escapeHtml(src || '');
  const safeAlt = escapeHtml(alt || '');
  
  return `<img class="builderx-image" src="${safeSrc}" alt="${safeAlt}"${style ? ` style="${style}"` : ''} loading="lazy" />`;
}

function renderButtonToHTML(block: any): string {
  const { text, href, backgroundColor, color, padding, borderRadius, fontSize, fontWeight, border, margin } = block.props;
  const style = buildStyleString({
    backgroundColor,
    color,
    padding,
    borderRadius,
    fontSize,
    fontWeight,
    border,
    margin
  });
  
  const safeText = escapeHtml(text || '');
  const safeHref = escapeHtml(href || '');
  
  if (href) {
    return `<a href="${safeHref}" class="builderx-button"${style ? ` style="${style}"` : ''} target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  }
  
  return `<button class="builderx-button"${style ? ` style="${style}"` : ''} type="button">${safeText}</button>`;
}

function buildStyleString(styles: Record<string, any>): string {
  const validStyles = Object.entries(styles)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
  
  return validStyles;
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function sanitizeRichText(html: string): string {
  // Create a temporary div to parse the HTML
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Define allowed tags and attributes
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allowedAttributes = ['style'];
  
  // Recursively sanitize the content
  function sanitizeNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.textContent || '');
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      if (allowedTags.includes(tagName)) {
        let result = `<${tagName}`;
        
        // Add allowed attributes
        for (const attr of allowedAttributes) {
          const value = element.getAttribute(attr);
          if (value) {
            result += ` ${attr}="${escapeHtml(value)}"`;
          }
        }
        
        result += '>';
        
        // Process child nodes
        for (const child of Array.from(element.childNodes)) {
          result += sanitizeNode(child);
        }
        
        result += `</${tagName}>`;
        return result;
      } else {
        // For disallowed tags, just return the text content
        return escapeHtml(element.textContent || '');
      }
    }
    
    return '';
  }
  
  // Process all child nodes
  let result = '';
  for (const child of Array.from(div.childNodes)) {
    result += sanitizeNode(child);
  }
  
  return result;
}

// Video Block HTML Renderer
function renderVideoToHTML(block: any): string {
  const { src, poster, title, description, width, height, autoplay, muted, loop, controls, borderRadius, backgroundColor, padding, margin, textAlign, showTitle, showDescription } = block.props;
  
  const videoStyle = buildStyleString({
    width: width || '100%',
    height: height || 'auto',
    borderRadius: borderRadius || '8px',
    backgroundColor: backgroundColor || 'transparent',
    padding: padding || '0',
    margin: margin || '0',
    textAlign: textAlign || 'center'
  });

  const videoAttributes = [
    src ? `src="${escapeHtml(src)}"` : '',
    poster ? `poster="${escapeHtml(poster)}"` : '',
    controls !== false ? 'controls' : '',
    autoplay ? 'autoplay' : '',
    muted ? 'muted' : '',
    loop ? 'loop' : '',
    'preload="metadata"'
  ].filter(Boolean).join(' ');

  const titleHtml = showTitle !== false && title ? `<h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = showDescription !== false && description ? `<p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">${escapeHtml(description)}</p>` : '';

  return `<div class="builderx-video"${videoStyle ? ` style="${videoStyle}"` : ''}>
    ${titleHtml}
    ${descriptionHtml}
    <video ${videoAttributes} style="max-width: 100%; height: auto;">
      Your browser does not support the video tag.
    </video>
  </div>`;
}

// Code Block HTML Renderer
function renderCodeToHTML(block: any): string {
  const { code, language, title, description, backgroundColor, textColor, borderColor, borderRadius, padding, margin, fontSize, fontFamily, maxHeight, showCopyButton, wrapLines } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#1f2937',
    color: textColor || '#f9fafb',
    border: `1px solid ${borderColor || '#374151'}`,
    borderRadius: borderRadius || '8px',
    padding: padding || '16px',
    margin: margin || '0',
    maxHeight: maxHeight || '400px',
    overflow: 'auto',
    fontFamily: fontFamily || 'Monaco, Consolas, "Courier New", monospace',
    fontSize: fontSize || '14px',
    lineHeight: '1.5'
  });

  const titleHtml = title ? `<h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #f9fafb;">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = description ? `<p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">${escapeHtml(description)}</p>` : '';
  
  const codeStyle = buildStyleString({
    whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
    overflow: 'auto',
    margin: '0',
    padding: '0',
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit'
  });

  const copyButtonHtml = showCopyButton !== false ? `
    <button onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent)" 
            style="position: absolute; top: 10px; right: 10px; background: #374151; color: #f9fafb; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
      Copy
    </button>
  ` : '';

  return `<div class="builderx-code"${containerStyle ? ` style="${containerStyle}; position: relative;"` : ''}>
    ${titleHtml}
    ${descriptionHtml}
    ${copyButtonHtml}
    <pre><code class="language-${language || 'text'}"${codeStyle ? ` style="${codeStyle}"` : ''}>${escapeHtml(code || '')}</code></pre>
  </div>`;
}

// Group Block HTML Renderer
function renderGroupToHTML(block: any): string {
  const { title, description, backgroundColor, borderColor, borderWidth, borderStyle, borderRadius, padding, margin, boxShadow, minHeight, maxWidth, textAlign, showTitle, showDescription } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#f8f9fa',
    borderColor: borderColor || '#e5e7eb',
    borderWidth: borderWidth || '1px',
    borderStyle: borderStyle || 'solid',
    borderRadius: borderRadius || '8px',
    padding: padding || '20px',
    margin: margin || '0',
    boxShadow: boxShadow || '0 1px 3px rgba(0, 0, 0, 0.1)',
    minHeight: minHeight || '100px',
    maxWidth: maxWidth || '100%',
    textAlign: textAlign || 'left'
  });

  const titleHtml = showTitle !== false && title ? `<h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = showDescription !== false && description ? `<p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">${escapeHtml(description)}</p>` : '';

  return `<div class="builderx-group"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${titleHtml}
    ${descriptionHtml}
  </div>`;
}

// Survey Block HTML Renderer
function renderSurveyToHTML(block: any): string {
  const { title, description, questions, submitText, backgroundColor, padding, borderRadius, border, textAlign, buttonColor, buttonTextColor, buttonPadding, buttonBorderRadius } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#f8f9fa',
    padding: padding || '30px',
    borderRadius: borderRadius || '8px',
    border: border || '1px solid #e5e7eb',
    textAlign: textAlign || 'left'
  });

  const buttonStyle = buildStyleString({
    backgroundColor: buttonColor || '#007bff',
    color: buttonTextColor || '#ffffff',
    padding: buttonPadding || '12px 24px',
    borderRadius: buttonBorderRadius || '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '20px'
  });

  const titleHtml = title ? `<h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = description ? `<p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px;">${escapeHtml(description)}</p>` : '';

  const questionsHtml = questions?.map((question: any, index: number) => {
    const questionId = `q_${question.id || index}`;
    let questionHtml = `<div style="margin-bottom: 20px;">
      <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
        ${escapeHtml(question.question)}
        ${question.required ? '<span style="color: #ef4444;"> *</span>' : ''}
      </label>`;

    if (question.type === 'single' || question.type === 'multiple') {
      const inputType = question.type === 'single' ? 'radio' : 'checkbox';
      questionHtml += question.options?.map((option: string) => `
        <label style="display: flex; align-items: center; margin-bottom: 5px; font-weight: normal;">
          <input type="${inputType}" name="${questionId}" value="${escapeHtml(option)}" style="margin-right: 8px;" ${question.required ? 'required' : ''} />
          ${escapeHtml(option)}
        </label>
      `).join('') || '';
    } else if (question.type === 'rating') {
      const min = question.minRating || 1;
      const max = question.maxRating || 5;
      questionHtml += `<div style="display: flex; gap: 5px;">
        ${Array.from({ length: max - min + 1 }, (_, i) => i + min).map(star => `
          <input type="radio" name="${questionId}" value="${star}" style="display: none;" id="${questionId}_${star}" ${question.required ? 'required' : ''} />
          <label for="${questionId}_${star}" style="cursor: pointer; font-size: 24px; color: #d1d5db;">★</label>
        `).join('')}
      </div>`;
    } else if (question.type === 'text') {
      questionHtml += `<textarea name="${questionId}" placeholder="Your answer..." style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; resize: vertical; min-height: 80px;" ${question.required ? 'required' : ''}></textarea>`;
    }

    questionHtml += '</div>';
    return questionHtml;
  }).join('') || '';

  return `<div class="builderx-survey"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${titleHtml}
    ${descriptionHtml}
    <form>
      ${questionsHtml}
      <button type="submit"${buttonStyle ? ` style="${buttonStyle}"` : ''}>${escapeHtml(submitText || 'Submit Survey')}</button>
    </form>
  </div>`;
}

// Countdown Timer Block HTML Renderer
function renderCountdownTimerToHTML(block: any): string {
  const { targetDate, title, description, backgroundColor, textColor, padding, borderRadius, border, textAlign, showDays, showHours, showMinutes, showSeconds, expiredMessage, expiredActionText, expiredActionUrl } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#1f2937',
    color: textColor || '#ffffff',
    padding: padding || '30px',
    borderRadius: borderRadius || '12px',
    border: border || 'none',
    textAlign: textAlign || 'center'
  });

  const titleHtml = title ? `<h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = description ? `<p style="margin: 0 0 20px 0; color: #d1d5db; font-size: 16px;">${escapeHtml(description)}</p>` : '';

  const timerId = `timer_${Date.now()}`;
  const timerHtml = `
    <div id="${timerId}" style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
      ${showDays !== false ? '<div class="timer-unit"><span class="timer-value" data-unit="days">00</span><span class="timer-label">Days</span></div>' : ''}
      ${showHours !== false ? '<div class="timer-unit"><span class="timer-value" data-unit="hours">00</span><span class="timer-label">Hours</span></div>' : ''}
      ${showMinutes !== false ? '<div class="timer-unit"><span class="timer-value" data-unit="minutes">00</span><span class="timer-label">Minutes</span></div>' : ''}
      ${showSeconds !== false ? '<div class="timer-unit"><span class="timer-value" data-unit="seconds">00</span><span class="timer-label">Seconds</span></div>' : ''}
    </div>
  `;

  const script = targetDate ? `
    <script>
      (function() {
        const targetDate = new Date('${targetDate}').getTime();
        const timer = document.getElementById('${timerId}');
        
        function updateTimer() {
          const now = new Date().getTime();
          const distance = targetDate - now;
          
          if (distance < 0) {
            timer.innerHTML = '<p style="color: #ef4444; font-size: 18px; font-weight: 600;">${escapeHtml(expiredMessage || 'This offer has expired')}</p>';
            ${expiredActionText && expiredActionUrl ? `
            timer.innerHTML += '<a href="${escapeHtml(expiredActionUrl)}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px;">${escapeHtml(expiredActionText)}</a>';
            ` : ''}
            return;
          }
          
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
          const daysEl = timer.querySelector('[data-unit="days"]');
          const hoursEl = timer.querySelector('[data-unit="hours"]');
          const minutesEl = timer.querySelector('[data-unit="minutes"]');
          const secondsEl = timer.querySelector('[data-unit="seconds"]');
          
          if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
          if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
          if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
          if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
      })();
    </script>
  ` : '';

  return `<div class="builderx-countdown-timer"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${titleHtml}
    ${descriptionHtml}
    ${timerHtml}
    ${script}
  </div>`;
}

// Progress Bar Block HTML Renderer
function renderProgressBarToHTML(block: any): string {
  const { value, max, title, description, showPercentage, showValue, backgroundColor, progressColor, textColor, borderColor, borderRadius, padding, margin, height, textAlign, animated, striped, size } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#f3f4f6',
    padding: padding || '20px',
    margin: margin || '0',
    textAlign: textAlign || 'left'
  });

  const progressBarHeight = height || (size === 'small' ? '8px' : size === 'large' ? '24px' : '16px');
  const progressBarStyle = buildStyleString({
    width: '100%',
    height: progressBarHeight,
    backgroundColor: '#e5e7eb',
    borderRadius: borderRadius || '8px',
    overflow: 'hidden',
    border: `1px solid ${borderColor || '#d1d5db'}`
  });

  const progressFillStyle = buildStyleString({
    height: '100%',
    width: `${Math.min(100, Math.max(0, (value || 0) / (max || 100) * 100))}%`,
    backgroundColor: progressColor || '#3b82f6',
    transition: animated !== false ? 'width 0.3s ease' : 'none',
    backgroundImage: striped ? 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)' : 'none',
    backgroundSize: striped ? '1rem 1rem' : 'auto'
  });

  const titleHtml = title ? `<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: ${textColor || '#1f2937'};">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = description ? `<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">${escapeHtml(description)}</p>` : '';

  const valueText = showValue !== false ? `${value || 0}/${max || 100}` : '';
  const percentageText = showPercentage !== false ? `${Math.round((value || 0) / (max || 100) * 100)}%` : '';
  const valueHtml = (valueText || percentageText) ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: ${textColor || '#1f2937'};">
    <span>${valueText}</span>
    <span>${percentageText}</span>
  </div>` : '';

  return `<div class="builderx-progress-bar"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${titleHtml}
    ${descriptionHtml}
    ${valueHtml}
    <div${progressBarStyle ? ` style="${progressBarStyle}"` : ''}>
      <div${progressFillStyle ? ` style="${progressFillStyle}"` : ''}></div>
    </div>
  </div>`;
}

// Product Block HTML Renderer
function renderProductToHTML(block: any): string {
  const { title, description, price, originalPrice, currency, imageUrl, imageAlt, buttonText, buttonUrl, buttonColor, backgroundColor, textColor, priceColor, originalPriceColor, layout, showOriginalPrice, showButton, showDescription, discount, rating, reviewCount, badge, badgeColor, padding, borderRadius, border, shadow } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#ffffff',
    color: textColor || '#1f2937',
    padding: padding || '20px',
    borderRadius: borderRadius || '8px',
    border: border || '1px solid #e5e7eb',
    boxShadow: shadow || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden'
  });

  const imageStyle = buildStyleString({
    width: layout === 'horizontal' ? '120px' : '100%',
    height: layout === 'horizontal' ? '120px' : '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: '0'
  });

  const buttonStyle = buildStyleString({
    backgroundColor: buttonColor || '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'background-color 0.2s'
  });

  const badgeHtml = badge ? `<div style="position: absolute; top: 8px; right: 8px; background-color: ${badgeColor || '#ef4444'}; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 1;">${escapeHtml(badge)}</div>` : '';
  
  const imageHtml = imageUrl ? `
    <div style="position: relative;">
      <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(imageAlt || 'Product Image')}"${imageStyle ? ` style="${imageStyle}"` : ''} onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'" />
      ${discount ? `<div style="position: absolute; top: 8px; left: 8px; background-color: #ef4444; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">${escapeHtml(discount)}</div>` : ''}
    </div>
  ` : '';

  const ratingHtml = rating > 0 ? `
    <div style="display: flex; align-items: center; gap: 4px; margin-top: 8px;">
      <div style="display: flex;">
        ${Array.from({ length: 5 }, (_, i) => `<span style="color: ${i < Math.floor(rating) ? '#fbbf24' : '#d1d5db'}; font-size: 16px;">★</span>`).join('')}
      </div>
      <span style="font-size: 14px; color: #6b7280;">(${reviewCount || 0} reviews)</span>
    </div>
  ` : '';

  const priceHtml = `
    <div style="color: ${priceColor || '#059669'}; font-size: 24px; font-weight: bold; display: flex; align-items: center; gap: 8px;">
      ${currency || '$'}${escapeHtml(price || '99.99')}
      ${showOriginalPrice !== false && originalPrice ? `<span style="color: ${originalPriceColor || '#6b7280'}; text-decoration: line-through; font-size: 16px;">${currency || '$'}${escapeHtml(originalPrice)}</span>` : ''}
    </div>
  `;

  const buttonHtml = showButton !== false && buttonText ? `
    <a href="${escapeHtml(buttonUrl || '#')}"${buttonStyle ? ` style="${buttonStyle}"` : ''}>${escapeHtml(buttonText)}</a>
  ` : '';

  return `<div class="builderx-product"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${badgeHtml}
    ${imageHtml}
    <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
      <h3 style="margin: 0; font-size: 20px; font-weight: 600;">${escapeHtml(title || 'Product Name')}</h3>
      ${showDescription !== false && description ? `<p style="margin: 0; font-size: 14px; color: #6b7280;">${escapeHtml(description)}</p>` : ''}
      ${priceHtml}
      ${ratingHtml}
      ${buttonHtml}
    </div>
  </div>`;
}

// Promo Code Block HTML Renderer
function renderPromoCodeToHTML(block: any): string {
  const { title, description, code, discount, validUntil, buttonText, backgroundColor, textColor, codeBackgroundColor, codeTextColor, buttonColor, borderColor, borderStyle, layout, showCopyButton, showValidUntil, showDiscount, padding, borderRadius, shadow } = block.props;
  
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#f8fafc',
    color: textColor || '#1e293b',
    padding: padding || '24px',
    borderRadius: borderRadius || '12px',
    border: `${borderStyle || 'dashed'} 2px ${borderColor || '#e2e8f0'}`,
    boxShadow: shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
    gap: '16px',
    position: 'relative',
    overflow: 'hidden'
  });

  const codeStyle = buildStyleString({
    backgroundColor: codeBackgroundColor || '#1e293b',
    color: codeTextColor || '#ffffff',
    padding: '12px 16px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '20px',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textAlign: 'center',
    border: '2px dashed rgba(255, 255, 255, 0.3)',
    position: 'relative',
    flex: layout === 'horizontal' ? '1' : 'none'
  });

  const buttonStyle = buildStyleString({
    backgroundColor: buttonColor || '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    flex: layout === 'horizontal' ? 'none' : '1'
  });

  const discountHtml = showDiscount !== false && discount ? `
    <div style="position: absolute; top: -8px; right: -8px; background-color: #ef4444; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; transform: rotate(15deg);">${escapeHtml(discount)}</div>
  ` : '';

  const copyButtonHtml = showCopyButton !== false ? `
    <button onclick="navigator.clipboard.writeText('${escapeHtml(code || '')}'); this.textContent='✓ Copied!'; setTimeout(() => this.textContent='${escapeHtml(buttonText || 'Copy Code')}', 2000);"${buttonStyle ? ` style="${buttonStyle}"` : ''}>${escapeHtml(buttonText || 'Copy Code')}</button>
  ` : '';

  return `<div class="builderx-promo-code"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${discountHtml}
    <div style="flex: 1;">
      <h3 style="margin: 0; font-size: 24px; font-weight: 700; margin-bottom: 8px;">${escapeHtml(title || 'Special Offer!')}</h3>
      <p style="margin: 0; font-size: 14px; color: #6b7280; margin-bottom: 16px;">${escapeHtml(description || 'Use this promo code to get an amazing discount')}</p>
      ${showValidUntil !== false && validUntil ? `<p style="margin: 0; font-size: 12px; color: #9ca3af; margin-bottom: 16px;">Valid until: ${new Date(validUntil).toLocaleDateString()}</p>` : ''}
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px; align-items: stretch;">
      <div${codeStyle ? ` style="${codeStyle}"` : ''}>${escapeHtml(code || 'SAVE20')}</div>
      ${copyButtonHtml}
    </div>
  </div>`;
}

// Price Block HTML Renderer
function renderPriceToHTML(block: any): string {
  const { title, description, price, originalPrice, currency, period, features, buttonText, buttonUrl, buttonColor, backgroundColor, textColor, priceColor, originalPriceColor, accentColor, popular, popularText, popularColor, layout, size, showOriginalPrice, showFeatures, showButton, showPopular, borderRadius, border, shadow } = block.props;
  
  const containerPadding = size === 'small' ? '20px' : size === 'large' ? '48px' : '32px';
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#ffffff',
    color: textColor || '#1f2937',
    padding: containerPadding,
    borderRadius: borderRadius || '12px',
    border: popular ? `2px solid ${accentColor || '#3b82f6'}` : border || '1px solid #e5e7eb',
    boxShadow: popular ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'center' : 'stretch',
    gap: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  });

  const popularHtml = popular && showPopular !== false ? `
    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); background-color: ${popularColor || '#ef4444'}; color: #ffffff; padding: 8px 24px; border-radius: 0 0 8px 8px; font-size: 14px; font-weight: 600; z-index: 1;">${escapeHtml(popularText || 'Most Popular')}</div>
  ` : '';

  const priceSize = size === 'small' ? '32px' : size === 'large' ? '64px' : '48px';
  const priceHtml = `
    <div style="color: ${priceColor || '#1f2937'}; font-size: ${priceSize}; font-weight: bold; display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;">
      <span>${currency || '$'}${escapeHtml(price || '29')}</span>
      <span style="font-size: 16px; color: #6b7280;">${escapeHtml(period || '/month')}</span>
      ${showOriginalPrice !== false && originalPrice ? `<span style="color: ${originalPriceColor || '#6b7280'}; text-decoration: line-through; font-size: 24px; font-weight: normal;">${currency || '$'}${escapeHtml(originalPrice)}</span>` : ''}
    </div>
  `;

  const featuresHtml = showFeatures !== false && features?.length > 0 ? `
    <div style="margin-top: 24px;">
      ${features.map((feature: string) => `
        <div style="display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 14px;">
          <span style="color: ${accentColor || '#3b82f6'}; font-size: 16px; font-weight: bold;">✓</span>
          <span>${escapeHtml(feature)}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  const buttonStyle = buildStyleString({
    backgroundColor: popular ? accentColor || '#3b82f6' : buttonColor || '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'all 0.2s',
    width: '100%'
  });

  const buttonHtml = showButton !== false && buttonText ? `
    <a href="${escapeHtml(buttonUrl || '#')}"${buttonStyle ? ` style="${buttonStyle}"` : ''}>${escapeHtml(buttonText)}</a>
  ` : '';

  const titleSize = size === 'small' ? '20px' : size === 'large' ? '32px' : '24px';
  const titleHtml = title ? `<h3 style="margin: 0; font-size: ${titleSize}; font-weight: 700; margin-bottom: 8px; color: ${popular ? accentColor || '#3b82f6' : textColor || '#1f2937'};">${escapeHtml(title)}</h3>` : '';
  const descriptionHtml = description ? `<p style="margin: 0; font-size: ${size === 'small' ? '14px' : size === 'large' ? '18px' : '16px'}; color: #6b7280; margin-bottom: 24px;">${escapeHtml(description)}</p>` : '';

  return `<div class="builderx-price"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${popularHtml}
    <div style="flex: 1;">
      ${titleHtml}
      ${descriptionHtml}
      ${priceHtml}
      ${featuresHtml}
    </div>
    ${buttonHtml}
  </div>`;
}

// Testimonial Block HTML Renderer
function renderTestimonialToHTML(block: any): string {
  const { quote, author, title, company, avatarUrl, avatarAlt, rating, backgroundColor, textColor, quoteColor, authorColor, accentColor, borderColor, layout, size, showAvatar, showRating, showTitle, showCompany, showQuote, borderRadius, border, shadow, alignment } = block.props;
  
  const containerPadding = size === 'small' ? '20px' : size === 'large' ? '48px' : '32px';
  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || '#ffffff',
    color: textColor || '#1f2937',
    padding: containerPadding,
    borderRadius: borderRadius || '12px',
    border: border || '1px solid #e5e7eb',
    boxShadow: shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    alignItems: layout === 'horizontal' ? 'flex-start' : 'stretch',
    gap: '20px',
    position: 'relative',
    overflow: 'hidden',
    textAlign: alignment || 'left'
  });

  const avatarSize = size === 'small' ? '40px' : size === 'large' ? '80px' : '60px';
  const avatarHtml = showAvatar !== false && avatarUrl ? `
    <img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(avatarAlt || author || 'Avatar')}" style="width: ${avatarSize}; height: ${avatarSize}; border-radius: 50%; object-fit: cover; border: 2px solid ${borderColor || '#e5e7eb'}; flex-shrink: 0;" onerror="this.src='https://via.placeholder.com/80x80?text=JD'" />
  ` : '';

  const quoteSize = size === 'small' ? '16px' : size === 'large' ? '24px' : '18px';
  const quoteHtml = showQuote !== false && quote ? `
    <div style="position: relative; flex: 1;">
      <div style="position: absolute; top: -10px; left: -10px; font-size: 64px; color: ${accentColor || '#3b82f6'}; opacity: 0.2; font-family: serif; line-height: 1;">"</div>
      <p style="color: ${quoteColor || '#374151'}; font-size: ${quoteSize}; font-style: italic; line-height: 1.6; margin: 0; position: relative; flex: 1;">${escapeHtml(quote)}</p>
    </div>
  ` : '';

  const ratingHtml = showRating !== false && rating > 0 ? `
    <div style="display: flex; gap: 2px; margin-top: 8px;">
      ${Array.from({ length: 5 }, (_, i) => `<span style="color: ${i < rating ? '#fbbf24' : '#d1d5db'}; font-size: 20px;">★</span>`).join('')}
    </div>
  ` : '';

  const authorSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
  const titleSize = size === 'small' ? '12px' : size === 'large' ? '16px' : '14px';
  const authorHtml = `
    <div style="flex: 1;">
      <h4 style="color: ${authorColor || '#1f2937'}; font-size: ${authorSize}; font-weight: 600; margin: 0;">${escapeHtml(author || 'John Doe')}</h4>
      ${showTitle !== false && title ? `<p style="color: ${authorColor || '#1f2937'}; font-size: ${titleSize}; opacity: 0.7; margin: 0;">${escapeHtml(title)}</p>` : ''}
      ${showCompany !== false && company ? `<p style="color: ${authorColor || '#1f2937'}; font-size: ${titleSize}; opacity: 0.7; margin: 0;">${escapeHtml(company)}</p>` : ''}
      ${ratingHtml}
    </div>
  `;

  return `<div class="builderx-testimonial"${containerStyle ? ` style="${containerStyle}"` : ''}>
    ${quoteHtml}
    <div style="display: flex; flex-direction: ${layout === 'horizontal' ? 'row' : 'column'}; align-items: ${layout === 'horizontal' ? 'center' : 'stretch'}; gap: 12px; flex-shrink: 0;">
      ${avatarHtml}
      ${authorHtml}
    </div>
  </div>`;
}
