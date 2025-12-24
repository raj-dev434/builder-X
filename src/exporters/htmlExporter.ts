import { Block } from "../schema/types";

export function exportToHTML(blocks: Block[]): string {
  const html = blocks.map((block) => renderBlockToHTML(block)).join("\n");

  // CSP: Allow self, unsafe-inline for styles/scripts (needed for current architecture), prevent object usage.
  // We allow data: for images as user might use data URIs.
  const csp =
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https: data:; object-src 'none'; base-uri 'self'; form-action 'self' https:;";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="BuilderX Page Builder">
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
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
    case "section":
      return renderSectionToHTML(block);
    case "row":
      return renderRowToHTML(block);
    case "text":
      return renderTextToHTML(block);
    case "image":
      return renderImageToHTML(block);
    case "button":
      return renderButtonToHTML(block);
    case "divider":
      return renderDividerToHTML(block);
    case "spacer":
      return renderSpacerToHTML(block);
    case "container":
      return renderContainerToHTML(block);
    case "social-follow":
      return renderSocialFollowToHTML(block);
    case "form":
      return renderFormToHTML(block);
    case "video":
      return renderVideoToHTML(block);
    case "code":
      return renderCodeToHTML(block);
    case "group":
      return renderGroupToHTML(block);
    case "survey":
      return renderSurveyToHTML(block);
    case "countdown-timer":
      return renderCountdownTimerToHTML(block);
    case "progress-bar":
      return renderProgressBarToHTML(block);
    case "product":
    case "promo-code":
    case "price":
    case "testimonial":
      // Reuse group logic for containers that are yet fully implemented or just return group
      return renderGroupToHTML({ ...block, type: "group" });
    default:
      return "";
  }
}

// Helper: Robust HTML Escaping
function escapeHtml(str: string | undefined | null): string {
  if (str === undefined || str === null) return "";
  const s = String(str);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildStyleString(styles: Record<string, any>): string {
  const validStyles = Object.entries(styles)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([key, value]) => {
      // Sanitize value to prevent CSS injection (basic check)
      const safeValue = String(value).replace(/[";\\]/g, "");
      return `${camelToKebab(key)}: ${safeValue}`;
    })
    .join("; ");

  return validStyles;
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function renderDividerToHTML(block: any): string {
  const { height, color, style, width, margin, padding } = block.props;
  const dividerStyle = buildStyleString({
    height,
    backgroundColor: color,
    border: "none",
    borderTop: `${height || "1px"} ${style || "solid"} ${color || "#000"}`,
    width,
    margin,
    padding,
    display: "block",
  });

  return `<hr class="builderx-divider"${
    dividerStyle ? ` style="${dividerStyle}"` : ""
  } />`;
}

function renderSpacerToHTML(block: any): string {
  const { height, backgroundColor, margin, padding, minHeight, maxHeight } =
    block.props;
  const spacerStyle = buildStyleString({
    height,
    backgroundColor,
    margin,
    padding,
    minHeight,
    maxHeight,
    width: "100%",
    display: "block",
  });

  return `<div class="builderx-spacer"${
    spacerStyle ? ` style="${spacerStyle}"` : ""
  }></div>`;
}

function renderContainerToHTML(block: any): string {
  const {
    backgroundColor,
    padding,
    margin,
    borderRadius,
    border,
    boxShadow,
    minHeight,
    maxWidth,
    textAlign,
  } = block.props;
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
    width: "100%",
    display: "block",
  });

  const children =
    block.children?.map((child: Block) => renderBlockToHTML(child)).join("") ||
    "";

  return `<div class="builderx-container"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
${children}
</div>`;
}

function renderSocialFollowToHTML(block: any): string {
  const {
    platforms,
    layout,
    iconSize,
    spacing,
    textAlign,
    showLabels,
    backgroundColor,
    padding,
    borderRadius,
  } = block.props;

  const containerStyle = buildStyleString({
    backgroundColor,
    padding,
    borderRadius,
    textAlign,
    width: "100%",
  });

  const socialContainerStyle = buildStyleString({
    display: "flex",
    flexDirection: layout === "vertical" ? "column" : "row",
    gap: spacing,
    justifyContent:
      textAlign === "center"
        ? "center"
        : textAlign === "right"
        ? "flex-end"
        : "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  });

  const socialLinks =
    platforms
      ?.map((platform: any) => {
        const linkStyle = buildStyleString({
          color: platform.color,
          textDecoration: "none",
          fontSize: iconSize,
          margin: "0 5px",
        });

        const safeUrl = escapeHtml(platform.url);

        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">
      <span style="font-size: ${escapeHtml(iconSize)}; margin-right: ${
          showLabels ? "8px" : "0"
        };">
        ${showLabels ? escapeHtml(platform.name).charAt(0) : ""} 
      </span>
      ${
        showLabels
          ? `<span style="font-size: 14px; font-weight: 500;">${escapeHtml(
              platform.name
            )}</span>`
          : ""
      }
    </a>`;
      })
      .join("") || "";

  return `<div class="builderx-social-follow"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
    <div style="${socialContainerStyle}">
      ${socialLinks}
    </div>
  </div>`;
}

function renderFormToHTML(block: any): string {
  const {
    title,
    description,
    fields,
    submitText,
    backgroundColor,
    padding,
    borderRadius,
    border,
    textAlign,
    buttonColor,
    buttonTextColor,
    buttonPadding,
    buttonBorderRadius,
  } = block.props;

  const containerStyle = buildStyleString({
    backgroundColor,
    padding,
    borderRadius,
    border,
    textAlign,
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  });

  const buttonStyle = buildStyleString({
    backgroundColor: buttonColor,
    color: buttonTextColor,
    padding: buttonPadding,
    borderRadius: buttonBorderRadius,
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    width: "100%",
    marginTop: "20px",
  });

  const formFields =
    fields
      ?.map((field: any) => {
        const fieldId = `field_${escapeHtml(field.id)}`;
        const labelStyle = buildStyleString({
          display: "block",
          marginBottom: "5px",
          fontWeight: "500",
          fontSize: "14px",
          color: "#374151",
        });

        const inputStyle = buildStyleString({
          width: "100%",
          padding: "12px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "16px",
          fontFamily: "inherit",
        });

        let inputElement = "";
        const safePlaceholder = escapeHtml(field.placeholder || "");
        const requiredAttr = field.required ? "required" : "";

        if (field.type === "textarea") {
          inputElement = `<textarea id="${fieldId}" placeholder="${safePlaceholder}" ${requiredAttr} style="${inputStyle}; resize: vertical; min-height: 100px;"></textarea>`;
        } else if (field.type === "select") {
          const options =
            field.options
              ?.map(
                (option: string) =>
                  `<option value="${escapeHtml(option)}">${escapeHtml(
                    option
                  )}</option>`
              )
              .join("") || "";
          inputElement = `<select id="${fieldId}" ${requiredAttr} style="${inputStyle}">
        <option value="">${safePlaceholder || "Select an option"}</option>
        ${options}
      </select>`;
        } else if (field.type === "checkbox" || field.type === "radio") {
          inputElement = `<div style="display: flex; align-items: center;">
        <input type="${escapeHtml(
          field.type
        )}" id="${fieldId}" style="margin-right: 8px;" />
        <label for="${fieldId}" style="margin: 0; font-weight: normal;">${escapeHtml(
            field.label
          )}</label>
      </div>`;
        } else {
          inputElement = `<input type="${escapeHtml(
            field.type
          )}" id="${fieldId}" placeholder="${safePlaceholder}" ${requiredAttr} style="${inputStyle}" />`;
        }

        return `<div style="margin-bottom: 20px;">
      <label for="${fieldId}" style="${labelStyle}">
        ${escapeHtml(field.label)}
        ${field.required ? '<span style="color: #ef4444;"> *</span>' : ""}
      </label>
      ${inputElement}
    </div>`;
      })
      .join("") || "";

  return `<div class="builderx-form"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
    <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">${escapeHtml(
      title || "Contact Us"
    )}</h3>
    ${
      description
        ? `<p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px;">${escapeHtml(
            description
          )}</p>`
        : ""
    }
    <form action="${escapeHtml(block.props.action || "")}" method="${escapeHtml(
    block.props.method || "POST"
  )}">
      ${formFields}
      <button type="submit" style="${buttonStyle}">${escapeHtml(
    submitText || "Submit"
  )}</button>
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
    marginLeft: "auto",
    marginRight: "auto",
  });

  const children =
    block.children?.map((child: Block) => renderBlockToHTML(child)).join("") ||
    "";

  return `<section class="builderx-section"${style ? ` style="${style}"` : ""}>
${children}
</section>`;
}

function renderRowToHTML(block: any): string {
  const { gap, justifyContent, alignItems, wrap, padding, margin } =
    block.props;
  const style = buildStyleString({
    gap,
    justifyContent,
    alignItems,
    flexWrap: wrap ? "wrap" : "nowrap",
    padding,
    margin,
  });

  const children =
    block.children?.map((child: Block) => renderBlockToHTML(child)).join("") ||
    "";

  return `<div class="builderx-row"${style ? ` style="${style}"` : ""}>
${children}
</div>`;
}

function renderTextToHTML(block: any): string {
  const {
    content,
    fontSize,
    fontWeight,
    color,
    textAlign,
    lineHeight,
    fontFamily,
    padding,
    margin,
  } = block.props;
  const style = buildStyleString({
    fontSize,
    fontWeight,
    color,
    textAlign,
    lineHeight,
    fontFamily,
    padding,
    margin,
  });

  const safeContent = sanitizeRichText(content || "");

  return `<div class="builderx-text"${
    style ? ` style="${style}"` : ""
  }>${safeContent}</div>`;
}

function renderImageToHTML(block: any): string {
  const { src, alt, width, height, objectFit, borderRadius, padding, margin } =
    block.props;
  const style = buildStyleString({
    width,
    height,
    objectFit,
    borderRadius,
    padding,
    margin,
  });

  const safeSrc = escapeHtml(src || "");
  const safeAlt = escapeHtml(alt || "");

  return `<img class="builderx-image" src="${safeSrc}" alt="${safeAlt}"${
    style ? ` style="${style}"` : ""
  } loading="lazy" />`;
}

function renderButtonToHTML(block: any): string {
  const {
    text,
    href,
    backgroundColor,
    color,
    padding,
    borderRadius,
    fontSize,
    fontWeight,
    border,
    margin,
  } = block.props;
  const style = buildStyleString({
    backgroundColor,
    color,
    padding,
    borderRadius,
    fontSize,
    fontWeight,
    border,
    margin,
  });

  const safeText = escapeHtml(text || "");
  let safeHref = escapeHtml(href || "");

  // Prevent javascript: protocol
  if (safeHref.trim().toLowerCase().startsWith("javascript:")) {
    safeHref = "#";
  }

  if (href) {
    return `<a href="${safeHref}" class="builderx-button"${
      style ? ` style="${style}"` : ""
    } target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  }

  return `<button class="builderx-button"${
    style ? ` style="${style}"` : ""
  } type="button">${safeText}</button>`;
}

function sanitizeRichText(html: string): string {
  // Limited sanitization - robust enough for basic text
  const div = document.createElement("div");
  div.innerHTML = html;

  const allowedTags = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
  ];
  const allowedAttributes = ["style", "class"];

  function sanitizeNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.textContent || "");
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();

      if (allowedTags.includes(tagName)) {
        let result = `<${tagName}`;

        for (const attr of allowedAttributes) {
          const value = element.getAttribute(attr);
          if (value) {
            // CSS styles can be complex, simply escaping might break valid CSS but prevents tag injection
            result += ` ${attr}="${escapeHtml(value)}"`;
          }
        }

        result += ">";
        for (const child of Array.from(element.childNodes)) {
          result += sanitizeNode(child);
        }
        result += `</${tagName}>`;
        return result;
      } else {
        // Return text content of disallowed tags
        let result = "";
        for (const child of Array.from(element.childNodes)) {
          result += sanitizeNode(child);
        }
        return result;
      }
    }
    return "";
  }

  let result = "";
  for (const child of Array.from(div.childNodes)) {
    result += sanitizeNode(child);
  }
  return result;
}

function renderVideoToHTML(block: any): string {
  const {
    src,
    poster,
    title,
    description,
    width,
    height,
    borderRadius,
    backgroundColor,
    padding,
    margin,
    textAlign,
    showTitle,
    showDescription,
  } = block.props;

  const videoStyle = buildStyleString({
    width: width || "100%",
    height: height || "auto",
    borderRadius,
    backgroundColor,
    padding,
    margin,
    textAlign,
  });

  const safeSrc = escapeHtml(src);
  const safePoster = escapeHtml(poster);
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  // TODO: Add controls, autoplay params safely if needed

  const titleHtml =
    showTitle !== false && title
      ? `<h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">${safeTitle}</h3>`
      : "";
  const descriptionHtml =
    showDescription !== false && description
      ? `<p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">${safeDesc}</p>`
      : "";

  return `<div class="builderx-video"${
    videoStyle ? ` style="${videoStyle}"` : ""
  }>
    ${titleHtml}
    ${descriptionHtml}
    <video src="${safeSrc}" poster="${safePoster}" controls style="max-width: 100%; height: auto;">
      Your browser does not support the video tag.
    </video>
  </div>`;
}

function renderCodeToHTML(block: any): string {
  const {
    code,
    language,
    title,
    description,
    backgroundColor,
    textColor,
    borderColor,
    borderRadius,
    padding,
    margin,
    fontSize,
    fontFamily,
    maxHeight,
  } = block.props;

  const containerStyle = buildStyleString({
    backgroundColor: backgroundColor || "#1f2937",
    color: textColor || "#f9fafb",
    border: `1px solid ${borderColor || "#374151"}`,
    borderRadius: borderRadius || "8px",
    padding: padding || "16px",
    margin: margin || "0",
    maxHeight: maxHeight || "400px",
    overflow: "auto",
    fontFamily: fontFamily || 'Monaco, Consolas, "Courier New", monospace',
    fontSize: fontSize || "14px",
    lineHeight: "1.5",
  });

  const safeCode = escapeHtml(code);
  const safeLang = escapeHtml(language);
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  const titleHtml = title
    ? `<h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #f9fafb;">${safeTitle}</h3>`
    : "";
  const descriptionHtml = description
    ? `<p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">${safeDesc}</p>`
    : "";

  return `<div class="builderx-code"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
    ${titleHtml}
    ${descriptionHtml}
    <pre><code class="language-${safeLang}">${safeCode}</code></pre>
  </div>`;
}

function renderGroupToHTML(block: any): string {
  const {
    title,
    description,
    backgroundColor,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    padding,
    margin,
    boxShadow,
    minHeight,
    maxWidth,
    textAlign,
    showTitle,
    showDescription,
  } = block.props;

  const containerStyle = buildStyleString({
    backgroundColor,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    padding,
    margin,
    boxShadow,
    minHeight,
    maxWidth,
    textAlign,
  });

  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  const titleHtml =
    showTitle !== false && title
      ? `<h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">${safeTitle}</h3>`
      : "";
  const descriptionHtml =
    showDescription !== false && description
      ? `<p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">${safeDesc}</p>`
      : "";

  // Render children! Groups have children.
  const children =
    block.children?.map((child: Block) => renderBlockToHTML(child)).join("") ||
    "";

  return `<div class="builderx-group"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
    ${titleHtml}
    ${descriptionHtml}
    ${children}
  </div>`;
}

function renderSurveyToHTML(block: any): string {
  return renderFormToHTML(block);
}

function renderCountdownTimerToHTML(block: any): string {
  const {
    title,
    description,
    backgroundColor,
    textColor,
    padding,
    borderRadius,
    border,
    textAlign,
  } = block.props;
  const containerStyle = buildStyleString({
    backgroundColor,
    color: textColor,
    padding,
    borderRadius,
    border,
    textAlign,
  });
  return `<div class="builderx-countdown-timer"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      <div>Timer pending (Active in Live View)</div>
    </div>`;
}

function renderProgressBarToHTML(block: any): string {
  const { value, max, title, backgroundColor } = block.props;
  const containerStyle = buildStyleString({ backgroundColor, padding: "20px" });
  const percent = (value / max) * 100;
  return `<div class="builderx-progress"${
    containerStyle ? ` style="${containerStyle}"` : ""
  }>
        <h3>${escapeHtml(title)}</h3>
        <div style="background: #e5e7eb; height: 16px; border-radius: 8px; overflow: hidden;">
            <div style="background: blue; width: ${percent}%; height: 100%;"></div>
        </div>
     </div>`;
}
