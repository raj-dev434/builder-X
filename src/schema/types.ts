import { ReactNode } from "react";

export interface BaseBlock {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Block[];
}

// In your schema/types.ts

export interface BaseStyleProps {
  // HTML Tag
  tag?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: string;
  fontFamily?: string;
  letterSpacing?: string;
  wordSpacing?: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "overline" | "line-through";
  fontStyle?: "normal" | "italic" | "oblique";
  textShadow?: string;

  hoverTextColor?: string;

  // Spacing
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Colors
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto" | "100%" | "100% 100%";
  backgroundPosition?: "left" | "center" | "right" | "top" | "bottom";
  backgroundRepeat?: "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment?: "scroll" | "fixed" | "local";
  borderColor?: string;

  // Background Type
  backgroundType?: "classic" | "gradient";

  // Gradient
  gradientType?: "linear" | "radial";
  gradientDirection?: string; // e.g. "45deg", "to right"
  gradientStart?: string;
  gradientEnd?: string;

  // Borders
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderWidth?: string;
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderStyle?:
  | "none"
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomRightRadius?: string;
  borderBottomLeftRadius?: string;

  // Effects
  boxShadow?: string;

  // Layout
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  overflowX?: "visible" | "hidden" | "scroll" | "auto";
  overflowY?: "visible" | "hidden" | "scroll" | "auto";
  display?:
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "none";
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  zIndex?: number;

  // Positioning
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  float?: "none" | "left" | "right";

  // Flexbox
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  flexGrow?: number;
  flexShrink?: number;
  gap?: string;
  rowGap?: string;

  // Additional
  opacity?: number;
  cursor?: "default" | "pointer" | "text" | "move" | "not-allowed";

  // Animation properties
  animation?: string;
  exitAnimation?: string;
  hoverAnimation?: string;
  customAnimation?: string;
  animationDuration?: string;
  animationDelay?: string;
  animationIterationCount?: string | number;
  animationDirection?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  animationTimingFunction?: string;
  animationFillMode?: "none" | "forwards" | "backwards" | "both";

  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
  backgroundOverlayBlendMode?: string;

  // ... (keeping existing gradient stuff)

  // Advanced / Effects
  transform?: string;
  transition?: string;

  // Responsive Visibility
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;

  // Accessibility
  ariaLabel?: string;
  titleAttribute?: string;

  // Advanced
  customCSS?: string;
  customClass?: string;
  customID?: string;

  // Responsive properties
  // ... (keep existing)

  // --- MASTER CSS PROPERTIES ---

  // Box Model Extended
  boxSizing?: "content-box" | "border-box";

  // Flexbox & Grid Item
  flexBasis?: string;
  justifySelf?: "auto" | "start" | "end" | "center" | "stretch";
  alignSelf?:
  | "auto"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline"
  | "stretch";
  placeSelf?: string;
  order?: number | string;
  gridColumn?: string;
  gridColumnStart?: string;
  gridColumnEnd?: string;
  gridRow?: string;
  gridRowStart?: string;
  gridRowEnd?: string;
  gridArea?: string;

  // Outline
  outline?: string;
  outlineWidth?: string;
  outlineStyle?:
  | "none"
  | "solid"
  | "dashed"
  | "dotted"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";
  outlineColor?: string;
  outlineOffset?: string;

  // Filters & Effects
  filter?: string; // blur(px) brightness(%) etc.
  backdropFilter?: string;
  mixBlendMode?: any;
  isolation?: "auto" | "isolate";

  // Interaction
  pointerEvents?:
  | "auto"
  | "none"
  | "visiblePainted"
  | "visibleFill"
  | "visibleStroke"
  | "visible"
  | "painted"
  | "fill"
  | "stroke"
  | "all"
  | "inherit";
  userSelect?: "auto" | "text" | "none" | "contain" | "all";
  caretColor?: string;
  accentColor?: string;

  // Scroll
  scrollBehavior?: "auto" | "smooth";
  scrollMargin?: string;
  scrollPadding?: string;
  scrollSnapType?: string;
  scrollSnapAlign?: "none" | "start" | "end" | "center";

  // Transform Extended
  transformOrigin?: string;
  transformStyle?: "flat" | "preserve-3d";
  perspective?: string;
  perspectiveOrigin?: string;
  backfaceVisibility?: "visible" | "hidden";

  // Transition
  transitionProperty?: string;
  transitionDuration?: string; // e.g. "0.3s"
  transitionTimingFunction?: string; // e.g. "ease-in-out"
  transitionDelay?: string;

  // Hover State Properties
  hover_scale?: number;
  hover_translateY?: string;
  hover_opacity?: number;
  hover_backgroundColor?: string;
  hover_color?: string;

  // Image / Media (Broad support)
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  aspectRatio?: string;

  // Mask
  mask?: string;
  maskImage?: string;
  maskMode?: string;
  maskRepeat?: string;
  maskPosition?: string;
  maskSize?: string;

  // Columns (Multi-column)
  columns?: string;
  columnCount?: string | number;
  columnGap?: string;
  columnRule?: string; // color style width
  columnWidth?: string;

  // Advanced
  willChange?: string;

  // Responsive properties

  fontSize_mobile?: string;
  fontSize_tablet?: string;
  fontSize_desktop?: string;
  padding_mobile?: string;
  padding_tablet?: string;
  padding_desktop?: string;
  margin_mobile?: string;
  margin_tablet?: string;
  margin_desktop?: string;
  width_mobile?: string;
  width_tablet?: string;
  width_desktop?: string;
  height_mobile?: string;
  height_tablet?: string;
  height_desktop?: string;
  textAlign_mobile?: "left" | "center" | "right" | "justify";
  textAlign_tablet?: "left" | "center" | "right" | "justify";
  textAlign_desktop?: "left" | "center" | "right" | "justify";
  display_mobile?:
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "none";
  display_tablet?:
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "none";
  display_desktop?:
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "none";
  flexDirection_mobile?: "row" | "column" | "row-reverse" | "column-reverse";
  flexDirection_tablet?: "row" | "column" | "row-reverse" | "column-reverse";
  flexDirection_desktop?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent_mobile?:
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
  justifyContent_tablet?:
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
  justifyContent_desktop?:
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
  alignItems_mobile?:
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";
  alignItems_tablet?:
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";
  alignItems_desktop?:
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";
}

export interface SectionBlock extends BaseBlock {
  type: "section";
  props: {
    // Layout
    contentWidth?: "container" | "full";
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: "cover" | "contain" | "auto" | "100%" | "100% 100%";
    backgroundPosition?: "top" | "center" | "bottom" | "left" | "right";
    backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    backgroundAttachment?: "scroll" | "fixed";
    backgroundOpacity?: number;

    // Overlay
    overlayColor?: string;
    overlayOpacity?: number;

    // Spacing
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    margin?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;

    // Dimensions
    minHeight?: string;
    maxWidth?: string;
    width?: string;

    // Borders
    border?: string;
    borderTop?: string;
    borderRight?: string;
    borderBottom?: string;
    borderLeft?: string;
    borderRadius?: string;

    // Effects
    boxShadow?: string;
    opacity?: number;

    // Responsive
    padding_mobile?: string;
    padding_tablet?: string;
    padding_desktop?: string;
    margin_mobile?: string;
    margin_tablet?: string;
    margin_desktop?: string;
  } & BaseStyleProps;
}

export interface RowBlock extends BaseBlock {
  type: "row";
  props: {
    // Layout
    gap?: string;
    justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    layoutType?: string;

    // Spacing
    padding?: string;
    margin?: string;

    // Dimensions
    minHeight?: string;
    height?: string;

    // Background
    backgroundColor?: string;

    // Borders
    border?: string;
    borderRadius?: string;

    // Responsive
    flexDirection_mobile?: "row" | "column" | "row-reverse" | "column-reverse";
    flexDirection_tablet?: "row" | "column" | "row-reverse" | "column-reverse";
    flexDirection_desktop?: "row" | "column" | "row-reverse" | "column-reverse";
    gap_mobile?: string;
    gap_tablet?: string;
    gap_desktop?: string;

    depth?: number;
  } & BaseStyleProps;
}

export interface ColumnBlock extends BaseBlock {
  type: "column";
  props: {
    // Layout
    flex?: string;
    gridTemplateColumns?: string; // Added for grid support
    width?: string;
    minWidth?: string;
    gap?: string;
    justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
    flexDirection?: "row" | "column";

    // Spacing
    padding?: string;
    margin?: string;

    // Background
    backgroundColor?: string;

    // Borders
    border?: string;
    borderRadius?: string;

    // Responsive
    width_mobile?: string;
    width_tablet?: string;
    width_desktop?: string;
    flex_mobile?: string;
    flex_tablet?: string;
    flex_desktop?: string;
    padding_mobile?: string;
    padding_tablet?: string;
    padding_desktop?: string;
  } & BaseStyleProps;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  props: {
    text?: ReactNode;
    // Content
    content: string;

    // Typography
    fontSize?: string;
    fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    textDecoration?: "none" | "underline" | "overline" | "line-through";
    fontStyle?: "normal" | "italic" | "oblique";
    color?: string;
    textShadow?: string;

    // Spacing
    padding?: string;
    margin?: string;

    // Background
    backgroundColor?: string;

    // Borders
    border?: string;
    borderRadius?: string;

    // Effects
    opacity?: number;

    // Responsive Typography
    fontSize_mobile?: string;
    fontSize_tablet?: string;
    fontSize_desktop?: string;
    textAlign_mobile?: "left" | "center" | "right" | "justify";
    textAlign_tablet?: "left" | "center" | "right" | "justify";
    textAlign_desktop?: "left" | "center" | "right" | "justify";
    lineHeight_mobile?: string;
    lineHeight_tablet?: string;
    lineHeight_desktop?: string;
  } & BaseStyleProps;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  props: {
    // Image Properties
    src: string;
    alt: string;
    title?: string;
    linkUrl?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    loading?: "lazy" | "eager";

    // Dimensions
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
    minWidth?: string;
    minHeight?: string;

    // Image Display
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
    objectPosition?: "top" | "center" | "bottom" | "left" | "right" | string;
    aspectRatio?: string;

    // Spacing
    padding?: string;
    margin?: string;

    // Borders & Effects
    boxShadow?: string;
    opacity?: number;
    filter?: string;

    // Hover Effects
    hoverTransform?: string;
    hoverOpacity?: number;
    hoverFilter?: string;

    // Responsive
    width_mobile?: string;
    width_tablet?: string;
    width_desktop?: string;
    height_mobile?: string;
    height_tablet?: string;
    height_desktop?: string;
    objectFit_mobile?: "cover" | "contain" | "fill" | "none" | "scale-down";
    objectFit_tablet?: "cover" | "contain" | "fill" | "none" | "scale-down";
    objectFit_desktop?: "cover" | "contain" | "fill" | "none" | "scale-down";
  } & BaseStyleProps;
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  props: {
    // Content
    text: string;
    href?: string;
    email?: string;
    phone?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "small" | "medium" | "large";
    target?: "_blank" | "_self" | "_parent" | "_top";
    rel?: string;
    linkType?: "url" | "email" | "phone";

    // Style
    textColor?: string;
    textAlign?: "left" | "center" | "right" | "justify";

    // Typography
    fontSize?: string;
    fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    textDecoration?: "none" | "underline" | "overline" | "line-through";
    color?: string;

    // Layout
    display?: "inline-block" | "block" | "flex" | "inline-flex";
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;

    // Spacing
    padding?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    margin?: string;

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: "cover" | "contain" | "auto";
    backgroundPosition?: "top" | "center" | "bottom" | "left" | "right";

    // Borders
    border?: string;
    borderTop?: string;
    borderRight?: string;
    borderBottom?: string;
    borderLeft?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";

    // Effects
    boxShadow?: string;
    opacity?: number;
    cursor?: "pointer" | "default" | "not-allowed";

    // Hover States
    hoverBackgroundColor?: string;
    hoverColor?: string;
    hoverBorderColor?: string;
    hoverBoxShadow?: string;
    hoverTransform?: string;
    hoverOpacity?: number;

    // Active States
    activeBackgroundColor?: string;
    activeColor?: string;
    activeTransform?: string;

    // Focus States
    focusOutline?: string;
    focusBoxShadow?: string;

    // Responsive
    fontSize_mobile?: string;
    fontSize_tablet?: string;
    fontSize_desktop?: string;
    padding_mobile?: string;
    padding_tablet?: string;
    padding_desktop?: string;
    width_mobile?: string;
    width_tablet?: string;
    width_desktop?: string;
  } & BaseStyleProps;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  props: {
    // Divider Properties
    height?: string;
    width?: string;
    color?: string;
    backgroundColor?: string;
    style?:
    | "solid"
    | "dashed"
    | "dotted"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset"
    | "undefined";
    thickness?: string;

    // Spacing
    margin?: string;
    marginTop?: string;
    marginBottom?: string;
    padding?: string;

    // Layout
    display?: "block" | "inline-block" | "flex";
    alignSelf?:
    | "auto"
    | "flex-start"
    | "flex-end"
    | "center"
    | "baseline"
    | "stretch";

    // Effects
    opacity?: number;
    boxShadow?: string;

    // Responsive
    height_mobile?: string;
    height_tablet?: string;
    height_desktop?: string;
    width_mobile?: string;
    width_tablet?: string;
    width_desktop?: string;
  } & BaseStyleProps;
}

export interface GridBlock extends BaseBlock {
  type: "grid";
  props: {
    // Grid specific
    gridTemplateColumns?: string;
    gap?: string;
    rowGap?: string;
    columnGap?: string;
    justifyItems?: "start" | "end" | "center" | "stretch";
    alignItems?: "start" | "end" | "center" | "stretch";

    // Responsive Grid
    gridTemplateColumns_desktop?: string;
    gridTemplateColumns_tablet?: string;
    gridTemplateColumns_mobile?: string;
    gap_desktop?: string;
    gap_tablet?: string;
    gap_mobile?: string;
    rowGap_desktop?: string;
    rowGap_tablet?: string;
    rowGap_mobile?: string;
    columnGap_desktop?: string;
    columnGap_tablet?: string;
    columnGap_mobile?: string;
  } & BaseStyleProps;
}

export interface FlexBoxBlock extends BaseBlock {
  type: "flex";
  props: {
    // Layout
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
    gap?: string;

    // Spacing
    padding?: string;
    margin?: string;

    // Dimensions
    width?: string;
    minHeight?: string;
    height?: string;

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;

    // Borders
    border?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;

    // Responsive
    flexDirection_mobile?: "row" | "column" | "row-reverse" | "column-reverse";
    flexDirection_tablet?: "row" | "column" | "row-reverse" | "column-reverse";
    flexDirection_desktop?: "row" | "column" | "row-reverse" | "column-reverse";

    justifyContent_mobile?: string;
    justifyContent_tablet?: string;

    alignItems_mobile?: string;
    alignItems_tablet?: string;

    gap_mobile?: string;
    gap_tablet?: string;
  } & BaseStyleProps;
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer";
  props: {
    height?: string;
    backgroundColor?: string;
    margin?: string;
    padding?: string;
    minHeight?: string;
    maxHeight?: string;
  } & BaseStyleProps;
}

export interface ContainerBlock extends BaseBlock {
  type: "container";
  props: {
    // Content settings
    contentWidth?: "container" | "full";
  } & BaseStyleProps;
}

export interface GroupBlock extends BaseBlock {
  type: "group";
  props: {
    title?: string;
    description?: string;
    showTitle?: boolean;
    showDescription?: boolean;
    textAlign?: "left" | "center" | "right";
  } & BaseStyleProps;
}

export interface SocialFollowBlock extends BaseBlock {
  type: "social-follow";
  props: {
    platforms?: Array<{
      name: string;
      url: string;
      label?: string;
      icon?: string;
      color?: string;
    }>;
    layout?: "horizontal" | "vertical";
    iconSize?: string;
    gap?: string;
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
    showLabels?: boolean;

    // Style Props
    shape?: "square" | "rounded" | "circle";
    view?: "official" | "custom";
    buttonStyle?: "solid" | "framed" | "minimal";
    hoverAnimation?: "none" | "grow" | "shrink" | "rotate" | "float";
    iconPrimaryColor?: string;
    iconSecondaryColor?: string;
    iconHoverPrimaryColor?: string;
    iconHoverSecondaryColor?: string;
  } & BaseStyleProps;
}

export interface FormBlock extends BaseBlock {
  type: "form";
  props: {
    title?: string;
    description?: string;
    fields?: Array<{
      id: string;
      type:
      | "text"
      | "email"
      | "tel"
      | "textarea"
      | "select"
      | "checkbox"
      | "radio";
      label: string;
      placeholder?: string;
      required?: boolean;
      options?: string[];
      validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        errorMessage?: string;
      };
    }>;
    submitText?: string;
    showTitle?: boolean;
    showDescription?: boolean;

    // Submission
    submitAction?: string;
    submitMethod?: "GET" | "POST";
    successMessage?: string;
    errorMessage?: string;
    webhookUrl?: string;
    redirectUrl?: string;

    // Field Styling
    inputTextColor?: string;
    inputBgColor?: string;
    inputBorderColor?: string;
    inputBorderRadius?: string;

    // Button Styling
    buttonColor?: string;
    buttonTextColor?: string;
    btnAlign?: "start" | "center" | "end" | "stretch";
  } & BaseStyleProps;
}

export interface VideoBlock extends BaseBlock {
  type: "video";
  props: {
    src?: string;
    poster?: string;
    title?: string;
    description?: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    showTitle?: boolean;
    showDescription?: boolean;
    // Standard styling props from BaseStyleProps will be used (width, height, aspect ratio, etc.)
  } & BaseStyleProps;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
  props: {
    code?: string;
    language?:
    | "html"
    | "css"
    | "javascript"
    | "json"
    | "xml"
    | "sql"
    | "text"
    | "typescript"
    | "python";
    title?: string;
    description?: string;
    showLineNumbers?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontFamily?: string;
    maxHeight?: string;
    showCopyButton?: boolean;
    wrapLines?: boolean;
  } & BaseStyleProps;
}

export interface SurveyBlock extends BaseBlock {
  type: "survey";
  props: {
    title?: string;
    description?: string;
    showTitle?: boolean;
    showDescription?: boolean;
    questions?: Array<{
      id: string;
      type: "single" | "multiple" | "text" | "rating" | "scale";
      question: string;
      options?: string[];
      required?: boolean;
      minRating?: number;
      maxRating?: number;
      scaleLabels?: {
        min: string;
        max: string;
      };
    }>;
    submitText?: string;
    showProgress?: boolean;
    buttonColor?: string;
    buttonTextColor?: string;
    accentColor?: string;
  } & BaseStyleProps;
}

export interface CountdownTimerBlock extends BaseBlock {
  type: "countdown-timer";
  props: {
    targetDate?: string;
    showTitle?: boolean;
    title?: string;
    showDescription?: boolean;
    description?: string;

    // Timer specific
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    format?: "card" | "simple" | "minimal";

    // Styling overrides
    accentColor?: string;
    labelColor?: string;
    digitBgColor?: string;
    digitTextColor?: string;

    // Expired state
    expiredMessage?: string;
    expiredActionText?: string;
    expiredActionUrl?: string;
  } & BaseStyleProps;
}

export interface ProgressBarBlock extends BaseBlock {
  type: "progress-bar";
  props: {
    value?: number;
    max?: number;
    title?: string;
    showTitle?: boolean;
    description?: string;
    showDescription?: boolean;
    showPercentage?: boolean;
    showValue?: boolean;

    // Progress style
    style?: "line" | "circle" | "dash";
    thickness?: string;
    progressColor?: string;
    barBackgroundColor?: string;

    // Animations & Effects
    animated?: boolean;
    striped?: boolean;
    size?: "small" | "medium" | "large";
    variant?: "default" | "success" | "warning" | "danger" | "info";
  } & BaseStyleProps;
}

export interface TableBlock extends BaseBlock {
  type: "table";
  props: {
    title?: string;
    description?: string;
    headers?: string[];
    data?: string[][];

    // Style specifics
    headerBackgroundColor?: string;
    headerTextColor?: string;
    rowBackgroundColor?: string;
    rowTextColor?: string;
    accentColor?: string;

    striped?: boolean;
    hover?: boolean;
    bordered?: boolean;
    size?: "small" | "medium" | "large";
  } & BaseStyleProps;
}

export interface ProductBlock extends BaseBlock {
  type: "product";
  props: {
    title?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    currency?: string;
    imageUrl?: string;
    imageAlt?: string;
    buttonText?: string;
    buttonUrl?: string;
    layout?: "vertical" | "horizontal";
    imagePosition?: "left" | "right" | "top";
    showOriginalPrice?: boolean;
    showButton?: boolean;
    showDescription?: boolean;
    discount?: string;
    rating?: number;
    reviewCount?: number;
    badge?: string;

    // Detailed Styling (specific to product parts)
    priceColor?: string;
    originalPriceColor?: string;
    badgeBgColor?: string;
    badgeTextColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
  } & BaseStyleProps;
}

export interface PromoCodeBlock extends BaseBlock {
  type: "promo-code";
  props: {
    title?: string;
    description?: string;
    code?: string;
    discount?: string;
    validUntil?: string;
    buttonText?: string;

    // Style specifics
    codeBackgroundColor?: string;
    codeTextColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;

    showCopyButton?: boolean;
    showValidUntil?: boolean;
    showDiscount?: boolean;
    animation?: "none" | "pulse" | "bounce" | "shake";
  } & BaseStyleProps;
}

export interface PriceBlock extends BaseBlock {
  type: "price";
  props: {
    title?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    currency?: string;
    period?: string;
    features?: string[];
    buttonText?: string;
    buttonUrl?: string;

    // Style specifics
    accentColor?: string;
    priceColor?: string;
    originalPriceColor?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    popular?: boolean;
    popularText?: string;
    popularColor?: string;

    layout?: "vertical" | "horizontal";
    size?: "small" | "medium" | "large";
    showOriginalPrice?: boolean;
    showFeatures?: boolean;
    showButton?: boolean;
    showPopular?: boolean;
  } & BaseStyleProps;
}

export interface TestimonialBlock extends BaseBlock {
  type: "testimonial";
  props: {
    quote?: string;
    author?: string;
    title?: string;
    company?: string;
    avatarUrl?: string;
    avatarAlt?: string;
    rating?: number;

    // list/carousel props
    testimonials?: Array<{
      quote: string;
      author: string;
      title: string;
      company: string;
      avatarUrl: string;
      avatarAlt?: string;
      rating: number;
    }>;
    autoplay?: boolean;
    autoplaySpeed?: number;
    showDots?: boolean;
    showArrows?: boolean;

    // Style specifics
    accentColor?: string;
    layout?: "vertical" | "horizontal" | "card";
    showAvatar?: boolean;
    showRating?: boolean;
    showTitle?: boolean;
    showCompany?: boolean;
    showQuote?: boolean;
    alignment?: "left" | "center" | "right";
  } & BaseStyleProps;
}

// New GrapeJS-style block interfaces
export interface NavbarBlock extends BaseBlock {
  type: "navbar";
  props: {
    brand?: string;
    brandUrl?: string;
    brandImage?: string;
    logoHeight?: string;
    links?: Array<{
      text: string;
      url: string;
      active?: boolean;
      newTab?: boolean;
    }>;

    // Style specifics
    hoverColor?: string;
    activeColor?: string;
    linkSpacing?: string;
    textColor?: string;
    shadow?: string;

    sticky?: boolean;
    transparent?: boolean;
    mobileMenu?: boolean;
  } & BaseStyleProps;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  props: {
    text?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
  } & BaseStyleProps;
}

export interface LinkBlock extends BaseBlock {
  type: "link";
  props: {
    text?: string;
    url?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    rel?: string;
    color?: string;
    textDecoration?: "none" | "underline" | "overline" | "line-through";
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: "left" | "center" | "right" | "justify";
    hoverColor?: string;
    hoverBackgroundColor?: string;
    hoverAnimation?: "none" | "grow" | "fade" | "underline";
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    borderRadius?: string;
    border?: string;
  } & BaseStyleProps;
}

export interface LinkBoxBlock extends BaseBlock {
  type: "link-box";
  props: {
    text?: string;
    url?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    textColor?: string;
    hoverBackgroundColor?: string;
  } & BaseStyleProps;
}

export interface ImageBoxBlock extends BaseBlock {
  type: "image-box";
  props: {
    src?: string;
    alt?: string;
    title?: string;
    description?: string;
    showTitle?: boolean;
    showDescription?: boolean;
    overlay?: boolean;
    overlayColor?: string;
    overlayOpacity?: number;
  } & BaseStyleProps;
}

export interface MapBlock extends BaseBlock {
  type: "map";
  props: {
    address?: string;
    latitude?: number;
    longitude?: number;
    zoom?: number;
    width?: string;
    height?: string;
    borderRadius?: string;
    border?: string;
    margin?: string;
    interactive?: boolean;
    showMarker?: boolean;
    markerTitle?: string;
    markerDescription?: string;
    overflow?: string;
    step?: number;
    mapType?: "roadmap" | "satellite" | "hybrid" | "terrain";
  } & BaseStyleProps;
}

export interface IconBlock extends BaseBlock {
  type: "icon";
  props: {
    // Content
    name?: string;
    view?: "default" | "stacked" | "framed";
    shape?: "circle" | "square" | "rounded";

    // Style
    size?: string;
    rotation?: number;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    border?: string;
    textAlign?: "left" | "center" | "right";

    // Responsive
    size_mobile?: string;
    size_desktop?: string;
    textAlign_mobile?: "left" | "center" | "right";
  } & BaseStyleProps;
}

export interface InputBlock extends BaseBlock {
  type: "input";
  props: {
    placeholder?: string;
    value?: string;
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
    disabled?: boolean;
    required?: boolean;
    name?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;

    // Style specifics
    textColor?: string;
    borderColor?: string;
  } & BaseStyleProps;
}

export interface LabelBlock extends BaseBlock {
  type: "label";
  props: {
    text?: string;
    for?: string;
    required?: boolean;
    color?: string;
  } & BaseStyleProps;
}

export interface ElementorHeadingBlock extends BaseBlock {
  type: "elementor-heading";
  props: {
    title: string;
    link?: string;
    linkTarget?: string;
    linkNoFollow?: boolean;
    size?: "small" | "medium" | "large" | "xl" | "xxl";
    htmlTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p";
    alignment?: "left" | "center" | "right" | "justify";

    // Style
    textColor?: string;
    typography?: string; // composite
    textStroke?: string;
    textShadow?: string;
    blendMode?: string;

    // Advanced standard props are inherited from BaseStyleProps
    // but Elementor has specific ones like Motion Effects, Background, Border, Mask
  } & BaseStyleProps;
}

export interface ChartBlock extends BaseBlock {
  type: "chart";
  props: {
    type?: "bar" | "line" | "pie" | "doughnut" | "polarArea" | "radar";
    data?: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
        borderWidth?: number;
      }>;
    };
    options?: object;
    width?: string;
    height?: string;
    backgroundColor?: string;
    padding?: string;
    borderRadius?: string;
    showLegend?: boolean;
  } & BaseStyleProps;
}

export interface CheckboxBlock extends BaseBlock {
  type: "checkbox";
  props: {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    size?: "small" | "medium" | "large";
    margin?: string;
    padding?: string;
  } & BaseStyleProps;
}

export interface RadioBlock extends BaseBlock {
  type: "radio";
  props: {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    value?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    margin?: string;
    padding?: string;
  } & BaseStyleProps;
}

export interface TextareaBlock extends BaseBlock {
  type: "textarea";
  props: {
    placeholder?: string;
    value?: string;
    rows?: number;
    cols?: number;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    maxLength?: number;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontFamily?: string;
    resize?: "none" | "both" | "horizontal" | "vertical";
  } & BaseStyleProps;
}

export interface SelectBlock extends BaseBlock {
  type: "select";
  props: {
    options?: Array<{
      value: string;
      label: string;
      selected?: boolean;
    }>;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    multiple?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontFamily?: string;
  } & BaseStyleProps;
}

export interface CardBlock extends BaseBlock {
  type: "card";
  props: {
    title?: string;
    content?: string;
    image?: string;
    imageAlt?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    boxShadow?: string;
    showImage?: boolean;
    showTitle?: boolean;
    showContent?: boolean;
    imagePosition?: "top" | "bottom" | "left" | "right";
    textAlign?: "left" | "center" | "right";
  } & BaseStyleProps;
}

export interface BadgeBlock extends BaseBlock {
  type: "badge";
  props: {
    text?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    size?: "small" | "medium" | "large";
    variant?: "solid" | "outline" | "soft";
  } & BaseStyleProps;
}

export interface AlertBlock extends BaseBlock {
  type: "alert";
  props: {
    text?: string;
    type?: "info" | "success" | "warning" | "error";
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    dismissible?: boolean;
    showIcon?: boolean;
    icon?: string;
  } & BaseStyleProps;
}

export interface ProgressBlock extends BaseBlock {
  type: "progress";
  props: {
    value?: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    backgroundColor?: string;
    progressColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    size?: "small" | "medium" | "large";
    animated?: boolean;
    striped?: boolean;
  } & BaseStyleProps;
}

export interface InvoiceBlock extends BaseBlock {
  type: "invoice";
  props: {
    // Invoice Header
    invoiceNumber?: string;
    invoiceDate?: string;
    dueDate?: string;
    status?: "draft" | "pending" | "paid" | "overdue" | "cancelled";

    // Company Details
    companyLogo?: string;
    companyName?: string;
    companyAddress?: string;

    // Client Details
    clientName?: string;
    clientAddress?: string;

    // Items (Stored as JSON string or handled via specific logic)
    items?: Array<{
      id: string;
      description: string;
      quantity: number;
      price: number;
    }>;

    // Totals
    currency?: string;
    taxRate?: number;
    discount?: number;
    notes?: string;

    // Styling
    backgroundColor?: string;
    headerBackgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    boxShadow?: string;
    fontFamily?: string;
  } & BaseStyleProps;
}

export type Block =
  | SectionBlock
  | RowBlock
  | FlexBoxBlock
  | GridBlock
  | TextBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | ContainerBlock
  | SocialFollowBlock
  | FormBlock
  | VideoBlock
  | CodeBlock
  | GroupBlock
  | SurveyBlock
  | CountdownTimerBlock
  | ProgressBarBlock
  | ProductBlock
  | PromoCodeBlock
  | PriceBlock
  | TestimonialBlock
  | NavbarBlock
  | HeadingBlock
  | LinkBlock
  | LinkBoxBlock
  | ImageBoxBlock
  | MapBlock
  | IconBlock
  | InputBlock
  | LabelBlock
  | CheckboxBlock
  | RadioBlock
  | TextareaBlock
  | SelectBlock
  | CardBlock
  | BadgeBlock
  | AlertBlock
  | ProgressBlock
  | ColumnBlock
  | InvoiceBlock
  | ElementorHeadingBlock;

export interface HistoryItem {
  blocks: Block[];
  action: string;
  timestamp: number;
}

export interface CanvasState {
  blocks: Block[];
  selectedBlockIds: string[];
  history: HistoryItem[];
  historyIndex: number;
  isDragging: boolean;
}

export interface BlockTemplate {
  id: string;
  name: string;
  icon: string;
  block: Omit<Block, "id">;
}

export const BLOCK_TEMPLATES: BlockTemplate[] = [
  {
    id: "section",
    name: "Section",
    icon: "📦",
    block: {
      type: "section",
      props: {
        backgroundColor: "#ffffff",
        padding: "2rem",
        minHeight: "200px",
      },
      children: [],
    },
  },
  {
    id: "row-basic",
    name: "Row",
    icon: "➡️",
    block: {
      type: "row",
      props: {
        gap: "1rem",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap",
      },
      children: [],
    },
  },

  {
    id: "text",
    name: "Text",
    icon: "📝",
    block: {
      type: "text",
      props: {
        content: "Click to edit text",
        fontSize: "16px",
        fontWeight: "normal",
        color: "#000000",
        textAlign: "left",
        lineHeight: "1.5",
      },
    },
  },
  {
    id: "image",
    name: "Image",
    icon: "🖼️",
    block: {
      type: "image",
      props: {
        src: "",
        alt: "Image",
        width: "100%",
        height: "auto",
        objectFit: "cover",
        borderRadius: "8px",
      },
    },
  },
  {
    id: "button",
    name: "Button",
    icon: "🔘",
    block: {
      type: "button",
      props: {
        text: "Click me",
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "6px",
        fontSize: "16px",
        fontWeight: "500",
        border: "none",
        hoverBackgroundColor: "#2563eb",
        hoverColor: "#ffffff",
      },
    },
  },
  {
    id: "divider",
    name: "Divider",
    icon: "➖",
    block: {
      type: "divider",
      props: {
        height: "1px",
        color: "#e5e7eb",
        style: "solid",
        width: "100%",
        margin: "20px 0",
      },
    },
  },
  {
    id: "spacer",
    name: "Spacer",
    icon: "⬜",
    block: {
      type: "spacer",
      props: {
        height: "20px",
        backgroundColor: "transparent",
        margin: "0",
        padding: "0",
      },
    },
  },
  {
    id: "container",
    name: "Container",
    icon: "📦",
    block: {
      type: "container",
      props: {
        backgroundColor: "#f8f9fa",
        padding: "20px",
        margin: "0",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        textAlign: "left",
      },
    },
  },
  {
    id: "social-follow",
    name: "Social Follow",
    icon: "👥",
    block: {
      type: "social-follow",
      props: {
        platforms: [
          { name: "Facebook", url: "#", icon: "📘", color: "#1877f2" },
          { name: "Twitter", url: "#", icon: "🐦", color: "#1da1f2" },
          { name: "Instagram", url: "#", icon: "📷", color: "#e4405f" },
          { name: "LinkedIn", url: "#", icon: "💼", color: "#0077b5" },
        ],
        layout: "horizontal",
        iconSize: "32px",
        gap: "10px",
        showLabels: true,
      },
    },
  },
  {
    id: "form",
    name: "Form",
    icon: "📋",
    block: {
      type: "form",
      props: {
        title: "Contact Us",
        description: "Get in touch with us",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Name",
            placeholder: "Enter your name",
            required: true,
          },
          {
            id: "email",
            type: "email",
            label: "Email",
            placeholder: "Enter your email",
            required: true,
          },
          {
            id: "message",
            type: "textarea",
            label: "Message",
            placeholder: "Enter your message",
            required: false,
          },
        ],
        submitText: "Submit",
        backgroundColor: "#f8f9fa",
        padding: "30px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        textAlign: "left",
        buttonColor: "#007bff",
        buttonTextColor: "#ffffff",
      },
    },
  },
  {
    id: "video",
    name: "Video",
    icon: "🎥",
    block: {
      type: "video",
      props: {
        src: "https://youtu.be/KgpnfT5bgLY?si=5cyVFC9UCWo-Fj_e",
        poster: "",
        title: "Product Demo",
        description: "Click to play video",
        width: "100%",
        height: "auto",
        autoplay: false,
        muted: true,
        loop: false,
        controls: true,
        borderRadius: "8px",
        backgroundColor: "transparent",
        padding: "0",
        margin: "0",
        textAlign: "center",
        showTitle: true,
        showDescription: true,
      },
    },
  },
  {
    id: "code",
    name: "Code",
    icon: "💻",
    block: {
      type: "code",
      props: {
        code: '<div class="example">\n  <h1>Hello World</h1>\n  <p>This is a sample HTML code block.</p>\n</div>',
        language: "html",
        title: "Code Block",
        description: "Custom HTML/CSS code",
        showLineNumbers: true,
        backgroundColor: "#1f2937",
        textColor: "#f9fafb",
        borderColor: "#374151",
        borderRadius: "8px",
        padding: "16px",
        margin: "0",
        fontSize: "14px",
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        maxHeight: "400px",
        showCopyButton: true,
        wrapLines: true,
      },
    },
  },
  {
    id: "group",
    name: "Group",
    icon: "📦",
    block: {
      type: "group",
      props: {
        title: "Group",
        description: "Logical grouping of elements",
        backgroundColor: "#f8f9fa",
        borderColor: "#e5e7eb",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "8px",
        padding: "20px",
        margin: "0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        minHeight: "100px",
        maxWidth: "100%",
        textAlign: "left",
        showTitle: true,
        showDescription: false,
      },
    },
  },
  {
    id: "survey",
    name: "Survey",
    icon: "📊",
    block: {
      type: "survey",
      props: {
        title: "Customer Survey",
        description: "Help us improve by sharing your feedback",
        showTitle: true,
        showDescription: true,
        questions: [
          {
            id: "q1",
            type: "single",
            question: "How satisfied are you with our service?",
            options: [
              "Very Satisfied",
              "Satisfied",
              "Neutral",
              "Dissatisfied",
              "Very Dissatisfied",
            ],
            required: true,
          },
          {
            id: "q2",
            type: "rating",
            question: "Rate our product quality",
            minRating: 1,
            maxRating: 5,
            required: true,
          },
          {
            id: "q3",
            type: "text",
            question: "Any additional comments?",
            required: false,
          },
        ],
        submitText: "Submit Survey",
        backgroundColor: "#f8f9fa",
        padding: "30px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        textAlign: "left",
        buttonColor: "#007bff",
        buttonTextColor: "#ffffff",
        showProgress: true,
      },
    },
  },
  {
    id: "countdown-timer",
    name: "Countdown Timer",
    icon: "⏰",
    block: {
      type: "countdown-timer",
      props: {
        targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        title: "Limited Time Offer",
        showTitle: true,
        description: "Hurry up! This offer expires soon.",
        showDescription: true,
        accentColor: "#ef4444",
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        format: "card",
        expiredMessage: "This offer has expired",
        expiredActionText: "View Other Offers",
        expiredActionUrl: "#",
      },
    },
  },
  {
    id: "progress-bar",
    name: "Progress Bar",
    icon: "📈",
    block: {
      type: "progress-bar",
      props: {
        value: 65,
        max: 100,
        title: "Progress",
        showTitle: true,
        description: "Current progress status",
        showDescription: true,
        showPercentage: true,
        showValue: true,
        progressColor: "#3b82f6",
        style: "line",
      },
    },
  },
  {
    id: "product",
    name: "Product",
    icon: "🛍️",
    block: {
      type: "product",
      props: {
        title: "Amazing Product",
        description: "This is an amazing product that will change your life",
        price: "99.99",
        originalPrice: "149.99",
        currency: "$",
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300&h=200",
        imageAlt: "Product Image",
        buttonText: "Buy Now",
        buttonUrl: "#",
        priceColor: "#059669",
        originalPriceColor: "#6b7280",
        layout: "vertical",
        imagePosition: "top",
        showOriginalPrice: true,
        showButton: true,
        showDescription: true,
        discount: "33% OFF",
        rating: 4.5,
        reviewCount: 128,
        badge: "NEW",
      },
    },
  },
  {
    id: "promo-code",
    name: "Promo Code",
    icon: "🎫",
    block: {
      type: "promo-code",
      props: {
        title: "Special Offer!",
        description: "Use this promo code to get an amazing discount",
        code: "SAVE20",
        discount: "20% OFF",
        validUntil: "2024-12-31",
        buttonText: "Copy Code",
        codeBackgroundColor: "#1e293b",
        codeTextColor: "#ffffff",
        buttonColor: "#3b82f6",
        showCopyButton: true,
        showValidUntil: true,
        showDiscount: true,
        animation: "pulse",
      },
    },
  },
  {
    id: "price",
    name: "Price",
    icon: "💰",
    block: {
      type: "price",
      props: {
        title: "Pro Plan",
        description: "Perfect for growing businesses",
        price: "29",
        originalPrice: "49",
        currency: "$",
        period: "/month",
        features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        buttonText: "Get Started",
        buttonUrl: "#",
        accentColor: "#3b82f6",
        popular: false,
        popularText: "Most Popular",
        popularColor: "#ef4444",
        layout: "vertical",
        size: "medium",
        showOriginalPrice: true,
        showFeatures: true,
        showButton: true,
        showPopular: false,
      },
    },
  },
  {
    id: "testimonial",
    name: "Testimonial",
    icon: "💬",
    block: {
      type: "testimonial",
      props: {
        quote:
          "This product has completely transformed our workflow. The results speak for themselves!",
        author: "John Doe",
        title: "CEO",
        company: "Acme Corp",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80&h=80",
        avatarAlt: "John Doe",
        rating: 5,
        accentColor: "#3b82f6",
        layout: "vertical",
        showAvatar: true,
        showRating: true,
        showTitle: true,
        showCompany: true,
        showQuote: true,
        alignment: "left",
      },
    },
  },
  // Layout Templates
  {
    id: "row",
    name: "Row",
    icon: "▭",
    block: {
      type: "row",
      props: {
        gap: "1rem",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "wrap",
        layoutType: "row",
      },
      children: [],
    },
  },
  {
    id: "column",
    name: "Column",
    icon: "▮",
    block: {
      type: "column",
      props: {
        flex: "1",
        minWidth: "0",
        padding: "1rem",
        flexDirection: "column",
        gap: "0.5rem",
      },
      children: [],
    },
  },

  {
    id: "flex",
    name: "Flex Box",
    icon: "Layout", // Using string name for mapped icon
    block: {
      type: "flex",
      props: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "nowrap",
        gap: "1rem",
        padding: "1rem",
        width: "100%",
        minHeight: "100px",
        backgroundColor: "transparent",
      },
      children: [],
    },
  },
  {
    id: "grid",
    name: "Grid",
    icon: "▦",
    block: {
      type: "grid",
      props: {
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      },
      children: [],
    },
  },

  // Multi-column layouts with mobile responsiveness
  {
    id: "2-column",
    name: "2 Columns",
    icon: "▮▮",
    block: {
      type: "row",
      props: {
        gap: "1rem",
        flexDirection: "row",
        flexDirection_mobile: "column", // Stack on mobile
        justifyContent: "flex-start",
        alignItems: "stretch",
        flexWrap: "nowrap",
        padding: "1rem",
        backgroundColor: "transparent",
        layoutType: "2-column",
      },
      // @ts-ignore - IDs are auto-generated when blocks are added to canvas
      children: [
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%", // Full width on mobile
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%", // Full width on mobile
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        },
      ],
    },
  },
  {
    id: "3-column",
    name: "3 Columns",
    icon: "▮▮▮",
    block: {
      type: "row",
      props: {
        gap: "1rem",
        flexDirection: "row",
        flexDirection_mobile: "column", // Stack on mobile
        justifyContent: "flex-start",
        alignItems: "stretch",
        flexWrap: "nowrap",
        padding: "1rem",
        backgroundColor: "transparent",
        layoutType: "3-column",
      },
      // @ts-ignore - IDs are auto-generated when blocks are added to canvas
      children: [
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%", // Full width on mobile
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%", // Full width on mobile
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%", // Full width on mobile
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        },
      ],
    },
  },
  {
    id: "4-column",
    name: "4 Columns",
    icon: "▮▮▮▮",
    block: {
      type: "row",
      props: {
        gap: "1rem",
        flexDirection: "row",
        flexDirection_mobile: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        flexWrap: "nowrap",
        padding: "1rem",
        backgroundColor: "transparent",
        layoutType: "4-column",
      },
      // @ts-ignore - IDs are auto-generated when blocks are added to canvas
      children: [
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "0",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        },
      ],
    },
  },
  {
    id: "5-column",
    name: "5 Columns",
    icon: "▮▮▮▮▮",
    block: {
      type: "row",
      props: {
        gap: "1rem",
        flexDirection: "row",
        flexDirection_mobile: "row", // Keep row on mobile for scrolling
        justifyContent: "center",
        alignItems: "stretch",
        flexWrap: "nowrap",
        padding: "1rem",
        backgroundColor: "transparent",
        layoutType: "5-column",
        overflowX: "auto",
      },
      // @ts-ignore - IDs are auto-generated when blocks are added to canvas
      children: [
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "150px",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "150px",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "150px",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "150px",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        } as any,
        {
          type: "column",
          props: {
            flex: "1",
            minWidth: "150px",
            minHeight: "150px",
            width_mobile: "100%",
            padding: "1.5rem",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.75rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          },
          children: [],
        },
      ],
    },
  },

  // New GrapeJS-style block templates
  // Basic Components
  {
    id: "navbar",
    name: "Navbar",
    icon: "🧭",
    block: {
      type: "navbar",
      props: {
        brand: "Brand",
        brandUrl: "#",
        links: [
          { text: "Home", url: "#", active: true },
          { text: "About", url: "#" },
          { text: "Contact", url: "#" },
        ],
        backgroundColor: "#ffffff",
        textColor: "#333333",
        padding: "1rem",
        sticky: false,
        transparent: false,
        mobileMenu: true,
      },
    },
  },
  {
    id: "heading",
    name: "Heading",
    icon: "📝",
    block: {
      type: "heading",
      props: {
        text: "Your Heading Here",
        level: 2,
        color: "#333333",
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "left",
        margin: "0 0 1rem 0",
        padding: "0",
      },
    },
  },
  {
    id: "link",
    name: "Link",
    icon: "🔗",
    block: {
      type: "link",
      props: {
        text: "Click here",
        url: "#",
        target: "_self",
        color: "#0066cc",
        textDecoration: "underline",
        fontSize: "1rem",
        fontWeight: "normal",
        hoverColor: "#004499",
      },
    },
  },
  {
    id: "link-box",
    name: "Link Box",
    icon: "📦",
    block: {
      type: "link-box",
      props: {
        text: "Link Box",
        url: "#",
        target: "_self",
        backgroundColor: "#f8f9fa",
        textColor: "#333333",
        borderColor: "#dee2e6",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "1rem",
        margin: "0",
        hoverBackgroundColor: "#e9ecef",
        hoverTextColor: "#333333",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    },
  },
  {
    id: "image-box",
    name: "Image Box",
    icon: "🖼️",
    block: {
      type: "image-box",
      props: {
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400",
        alt: "Placeholder image",
        title: "Image Title",
        description: "Image description goes here",
        width: "100%",
        height: "auto",
        borderRadius: "4px",
        border: "1px solid #dee2e6",
        padding: "1rem",
        margin: "0",
        backgroundColor: "#ffffff",
        textAlign: "center",
        showTitle: true,
        showDescription: true,
        overlay: false,
        overlayColor: "rgba(0,0,0,0.5)",
        overlayOpacity: 0.5,
      },
    },
  },
  {
    id: "map",
    name: "Map",
    icon: "🗺️",
    block: {
      type: "map",
      props: {
        address: "New York, NY",
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 13,
        width: "100%",
        height: "300px",
        borderRadius: "4px",
        border: "1px solid #dee2e6",
        margin: "0",
        interactive: true,
        showMarker: true,
        markerTitle: "Location",
        markerDescription: "This is a location marker",
      },
    },
  },
  {
    id: "icon",
    name: "Icon",
    icon: "⭐",
    block: {
      type: "icon",
      props: {
        name: "star",
        size: "24px",
        color: "#ffc107",
        backgroundColor: "transparent",
        borderRadius: "50%",
        padding: "8px",
        margin: "0",
        border: "none",
      },
    },
  },

  // Form Components
  {
    id: "input",
    name: "Input",
    icon: "📝",
    block: {
      type: "input",
      props: {
        placeholder: "Enter text...",
        value: "",
        type: "text",
        disabled: false,
        required: false,
        name: "input",
        maxLength: 255,
        backgroundColor: "#ffffff",
        textColor: "#333333",
        borderColor: "#ced4da",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "0.5rem",
        margin: "0",
        fontSize: "1rem",
        fontFamily: "inherit",
      },
    },
  },
  {
    id: "textarea",
    name: "Textarea",
    icon: "📄",
    block: {
      type: "textarea",
      props: {
        placeholder: "Enter your message...",
        value: "",
        rows: 4,
        cols: 50,
        disabled: false,
        required: false,
        name: "textarea",
        maxLength: 1000,
        backgroundColor: "#ffffff",
        textColor: "#333333",
        borderColor: "#ced4da",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "0.5rem",
        margin: "0",
        fontSize: "1rem",
        fontFamily: "inherit",
        resize: "vertical",
      },
    },
  },
  {
    id: "select",
    name: "Select",
    icon: "📋",
    block: {
      type: "select",
      props: {
        options: [
          { value: "option1", label: "Option 1", selected: true },
          { value: "option2", label: "Option 2", selected: false },
          { value: "option3", label: "Option 3", selected: false },
        ],
        placeholder: "Choose an option...",
        disabled: false,
        required: false,
        name: "select",
        multiple: false,
        backgroundColor: "#ffffff",
        textColor: "#333333",
        borderColor: "#ced4da",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "0.5rem",
        margin: "0",
        fontSize: "1rem",
        fontFamily: "inherit",
      },
    },
  },
  {
    id: "checkbox",
    name: "Checkbox",
    icon: "☑️",
    block: {
      type: "checkbox",
      props: {
        label: "Checkbox option",
        checked: false,
        disabled: false,
        required: false,
        name: "checkbox",
        value: "checkbox-value",
        color: "#007bff",
        backgroundColor: "#ffffff",
        borderColor: "#ced4da",
        borderRadius: "3px",
        size: "medium",
        margin: "0 0.5rem 0 0",
        padding: "0",
      },
    },
  },
  {
    id: "radio",
    name: "Radio",
    icon: "🔘",
    block: {
      type: "radio",
      props: {
        label: "Radio option",
        checked: false,
        disabled: false,
        required: false,
        name: "radio",
        value: "radio-value",
        color: "#007bff",
        backgroundColor: "#ffffff",
        borderColor: "#ced4da",
        margin: "0 0.5rem 0 0",
        padding: "0",
      },
    },
  },
  {
    id: "label",
    name: "Label",
    icon: "🏷️",
    block: {
      type: "label",
      props: {
        text: "Label text",
        for: "input-id",
        color: "#333333",
        fontSize: "1rem",
        fontWeight: "normal",
        margin: "0 0 0.5rem 0",
        padding: "0",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "0",
        required: false,
      },
    },
  },

  // Extra Components
  {
    id: "card",
    name: "Card",
    icon: "🃏",
    block: {
      type: "card",
      props: {
        title: "Card Title",
        content: "This is the card content. You can add any text or HTML here.",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400",
        imageAlt: "Card image",
        backgroundColor: "#ffffff",
        textColor: "#333333",
        borderColor: "#dee2e6",
        borderWidth: "1px",
        borderRadius: "8px",
        padding: "1.5rem",
        margin: "0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        showImage: true,
        showTitle: true,
        showContent: true,
        imagePosition: "top",
        textAlign: "left",
      },
    },
  },
  {
    id: "badge",
    name: "Badge",
    icon: "🏅",
    block: {
      type: "badge",
      props: {
        text: "Badge",
        color: "#ffffff",
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        borderWidth: "1px",
        borderRadius: "12px",
        padding: "0.25rem 0.5rem",
        margin: "0",
        fontSize: "0.875rem",
        fontWeight: "500",
        size: "medium",
        variant: "solid",
      },
    },
  },
  {
    id: "alert",
    name: "Alert",
    icon: "⚠️",
    block: {
      type: "alert",
      props: {
        text: "This is an alert message",
        type: "info",
        backgroundColor: "#d1ecf1",
        textColor: "#0c5460",
        borderColor: "#bee5eb",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "0.75rem 1rem",
        margin: "0",
        fontSize: "1rem",
        fontWeight: "normal",
        dismissible: true,
        showIcon: true,
        icon: "info",
      },
    },
  },
  {
    id: "progress",
    name: "Progress",
    icon: "📊",
    block: {
      type: "progress",
      props: {
        value: 50,
        max: 100,
        label: "Progress",
        showPercentage: true,
        backgroundColor: "#e9ecef",
        progressColor: "#007bff",
        textColor: "#333333",
        borderColor: "#dee2e6",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "0.5rem",
        margin: "0",
        size: "medium",
        animated: true,
        striped: false,
      },
    },
  },
  {
    id: "invoice",
    name: "Invoice",
    icon: "🧾",
    block: {
      type: "invoice",
      props: {
        invoiceNumber: "INV-001",
        invoiceDate: "2023-10-27",
        dueDate: "2023-11-27",
        status: "draft",
        companyName: "Your Company",
        companyAddress: "123 Business St, City, Country",
        clientName: "Client Name",
        clientAddress: "456 Client St, City, Country",
        items: [
          {
            id: "1",
            description: "Web Design Service",
            quantity: 1,
            price: 500,
          },
          { id: "2", description: "Hosting (1 Year)", quantity: 1, price: 120 },
        ],
        currency: "$",
        taxRate: 10,
        discount: 0,
        backgroundColor: "#ffffff",
        padding: "2rem",
        borderWidth: "1px",
        borderColor: "#e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  // Elementor Blocks
  {
    id: "elementor-heading",
    name: "Ele Heading",
    icon: "H",
    block: {
      type: "elementor-heading",
      props: {
        title: "Add Your Heading Text Here",
        htmlTag: "h2",
        alignment: "center",
        textColor: "#333333",
        fontSize: "2rem",
        fontWeight: "bold",
      },
    },
  },
];
