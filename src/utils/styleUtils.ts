
import { BaseStyleProps } from '../schema/types';

export const getStandardStyles = (props: BaseStyleProps): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Spacing
    if (props.padding) styles.padding = props.padding;
    if (props.paddingTop) styles.paddingTop = props.paddingTop;
    if (props.paddingBottom) styles.paddingBottom = props.paddingBottom;
    if (props.paddingLeft) styles.paddingLeft = props.paddingLeft;
    if (props.paddingRight) styles.paddingRight = props.paddingRight;

    if (props.margin) styles.margin = props.margin;
    if (props.marginTop) styles.marginTop = props.marginTop;
    if (props.marginBottom) styles.marginBottom = props.marginBottom;
    if (props.marginLeft) styles.marginLeft = props.marginLeft;
    if (props.marginRight) styles.marginRight = props.marginRight;

    // Border
    if (props.borderWidth) styles.borderWidth = props.borderWidth;
    if (props.borderStyle) styles.borderStyle = props.borderStyle;
    if (props.borderColor) styles.borderColor = props.borderColor;
    if (props.borderRadius) styles.borderRadius = props.borderRadius;

    // Effects
    if (props.boxShadow) styles.boxShadow = props.boxShadow;
    if (props.opacity) styles.opacity = props.opacity;

    return styles;
};

export const getBackgroundStyles = (props: BaseStyleProps): React.CSSProperties => {
    const styles: React.CSSProperties = {};

    // Background Color or Gradient
    if (props.backgroundType === 'gradient') {
        const type = props.gradientType || 'linear';
        const angle = props.gradientAngle || 90;
        const color1 = props.gradientColor1 || '#667eea';
        const color2 = props.gradientColor2 || '#764ba2';

        if (type === 'linear') {
            styles.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        } else {
            styles.backgroundImage = `radial-gradient(circle, ${color1}, ${color2})`;
        }
    } else if (props.backgroundColor) {
        styles.backgroundColor = props.backgroundColor;
    }

    // Background Image (if not using gradient, or can overlay)
    // Note: CSS allows multiple background images. If we want image + gradient, logic would be more complex.
    // For now, let's assume image overrides or sits on top if specified, BUT standard behavior usually implies one or the other 
    // depending on the UI toggles. However, the UI (BackgroundControl) seems to nest Image UNDER 'Classic' type, 
    // so it implies Image + Solid Color (fallback). 
    // If 'gradient' is selected, the UI hides the image controls (based on my read of BlockInspectors.tsx).
    // So if backgroundType is NOT gradient, we check for image.

    if (props.backgroundType !== 'gradient' && props.backgroundImage) {
        // Fix double url() wrapping
        const urlValue = props.backgroundImage.trim();
        if (urlValue.startsWith('url(')) {
            styles.backgroundImage = urlValue;
        } else {
            styles.backgroundImage = `url(${urlValue})`;
        }
    }

    if (props.backgroundSize) styles.backgroundSize = props.backgroundSize;
    if (props.backgroundPosition) styles.backgroundPosition = props.backgroundPosition;
    if (props.backgroundRepeat) styles.backgroundRepeat = props.backgroundRepeat;
    if (props.backgroundAttachment) styles.backgroundAttachment = props.backgroundAttachment;
    return styles;
};

export const getTypographyStyles = (props: BaseStyleProps): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    if (props.fontFamily && props.fontFamily !== 'inherit') styles.fontFamily = props.fontFamily;
    if (props.fontSize) styles.fontSize = props.fontSize;
    if (props.fontWeight) styles.fontWeight = props.fontWeight;
    if (props.lineHeight) styles.lineHeight = props.lineHeight;
    if (props.letterSpacing) styles.letterSpacing = props.letterSpacing;
    if (props.color) styles.color = props.color;
    if (props.textAlign) styles.textAlign = props.textAlign as any;
    if (props.textTransform) styles.textTransform = props.textTransform as any;
    if (props.textDecoration) styles.textDecoration = props.textDecoration;
    if (props.fontStyle) styles.fontStyle = props.fontStyle;
    return styles;
};
