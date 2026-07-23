import type { CSSProperties, JSX } from "react";
import type {
  BuilderBreakpoint,
  BuilderControl,
  BuilderControlSection,
  BuilderControlTab,
  BuilderElement,
  BuilderHostProps,
  BuilderWidget,
} from "./types";

const text = (key: string, label: string, defaultValue = ""): BuilderControl => ({
  key,
  label,
  type: "text",
  defaultValue,
});

const number = (key: string, label: string, defaultValue = 0): BuilderControl => ({
  key,
  label,
  type: "number",
  defaultValue,
});

const select = (
  key: string,
  label: string,
  options: Array<{ label: string; value: string }>,
  defaultValue: string,
): BuilderControl => ({ key, label, type: "select", options, defaultValue });

const image = (key: string, label: string): BuilderControl => ({
  key,
  label,
  type: "image",
});

const section = (
  label: string,
  controls: BuilderControl[],
  tab: BuilderControlTab = "content",
): BuilderControlSection => ({ label, tab, controls });
const content = (controls: BuilderControl[]) => [section("Content", controls, "general")];
const settings = (controls: BuilderControl[] = []) => [section("Settings", controls, "general")];

const htmlTagOptions = [
  { label: "div", value: "div" },
  { label: "section", value: "section" },
  { label: "article", value: "article" },
  { label: "aside", value: "aside" },
  { label: "header", value: "header" },
  { label: "footer", value: "footer" },
  { label: "main", value: "main" },
  { label: "nav", value: "nav" },
  { label: "span", value: "span" },
];
const value = (props: Record<string, unknown>, key: string, fallback = "") =>
  typeof props[key] === "string" ? props[key] : fallback;
const stringProp = (props: Record<string, unknown>, key: string, fallback = ""): string => {
  const raw = props[key];
  return typeof raw === "string" && raw.trim() !== "" ? raw : fallback;
};

const HTML_WIDGET_DEFAULT = '<div class="example">HTML Code</div>';

/** Strips script tags and inline event handlers from custom HTML blocks. */
function sanitizeWidgetHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}
const numeric = (props: Record<string, unknown>, key: string, fallback = 0) =>
  typeof props[key] === "number" ? props[key] : fallback;
const items = (props: Record<string, unknown>, key: string) =>
  Array.isArray(props[key]) ? (props[key] as Array<Record<string, unknown>>) : [];
const hasLinkedDescendant = (elements: BuilderElement[] = []): boolean => elements.some((child) => Boolean(child.props.link) || hasLinkedDescendant(child.children));

const aspectRatios: Record<string, string> = {
  "16:9": "56.25%",
  "21:9": "42.85%",
  "4:3": "75%",
  "1:1": "100%",
  "9:16": "177.77%",
};

/** Builds an HTML5 media fragment URL for start/end trim points. */
function buildVideoSrc(props: Record<string, unknown>): string {
  const src = value(props, "src");
  if (!src) {
    return "";
  }
  const start = numeric(props, "start", 0);
  const end = numeric(props, "end", 0);
  if (!start && !end) {
    return src;
  }
  const fragment = end ? `${start},${end}` : String(start);
  return `${src}#t=${fragment}`;
}

const headingTags = [
  ...["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => ({
    label: tag.toUpperCase(),
    value: tag,
  })),
  { label: "DIV", value: "div" },
  { label: "SPAN", value: "span" },
  { label: "P", value: "p" },
];

const headingSizePresets: Record<string, number> = {
  small: 18,
  medium: 28,
  large: 36,
  xl: 48,
  xxl: 64,
};

const headingTagDefaults: Record<string, number> = {
  h1: 48,
  h2: 36,
  h3: 28,
  h4: 22,
  h5: 18,
  h6: 14,
};

function headingHasStyleFontSize(element: BuilderElement): boolean {
  return elementStyleHas(element, "fontSize");
}

function elementStyleHas(element: BuilderElement, property: keyof CSSProperties): boolean {
  return ["desktop", "tablet", "mobile"].some((breakpoint) => {
    const styles = element.styles?.[breakpoint as keyof typeof element.styles]?.normal;
    const val = styles?.[property];
    return val !== undefined && val !== "";
  });
}

function elementStyleHasAtBreakpoint(
  element: BuilderElement,
  property: keyof CSSProperties,
  breakpoint: BuilderBreakpoint,
): boolean {
  const responsive = element.styles?.[breakpoint];
  if (!responsive) {
    return false;
  }
  return (["normal", "hover", "active", "focus"] as const).some((state) => {
    const val = responsive[state]?.[property];
    return val !== undefined && val !== "";
  });
}

function propNumber(props: Record<string, unknown>, key: string, fallback = 0): number {
  const raw = props[key];
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

const COUNTER_SEPARATOR_CHARS: Record<string, string> = {
  default: ",",
  dot: ".",
  space: " ",
  underline: "_",
  apostrophe: "'",
};

/** Formats a counter end value with the selected thousand separator. */
function formatCounterNumber(value: number, separator = "default"): string {
  const negative = value < 0;
  const digits = String(Math.abs(Math.trunc(value)));
  if (separator === "none") {
    return `${negative ? "-" : ""}${digits}`;
  }
  const sep = COUNTER_SEPARATOR_CHARS[separator] ?? COUNTER_SEPARATOR_CHARS.default;
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return `${negative ? "-" : ""}${formatted}`;
}

const FORM_INPUT_TYPES = new Set([
  "text",
  "email",
  "tel",
  "url",
  "number",
  "password",
  "date",
  "time",
  "search",
]);

/** Coerces serialized form-field required flags onto a boolean. */
function formFieldRequired(raw: unknown): boolean {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (typeof raw === "string") {
    return raw === "true" || raw === "1";
  }
  return Boolean(raw);
}

/** Builds a stable field name from the label with an index fallback. */
function formFieldName(label: string, index: number): string {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `field-${index + 1}`;
}

/** Parses select options from repeater field data. */
function formFieldOptions(field: Record<string, unknown>): string[] {
  if (Array.isArray(field.options)) {
    return field.options.map(String).filter(Boolean);
  }
  const raw = value(field, "options");
  if (!raw) {
    return [];
  }
  return raw.split(",").map((option) => option.trim()).filter(Boolean);
}

/** Renders a single form field control based on its configured type. */
function renderFormFieldControl(field: Record<string, unknown>, index: number): JSX.Element {
  const label = value(field, "label");
  const type = value(field, "type", "text");
  const name = formFieldName(label, index);
  const required = formFieldRequired(field.required);
  const placeholder = value(field, "placeholder");

  if (type === "textarea") {
    return (
      <textarea
        name={name}
        required={required}
        placeholder={placeholder || undefined}
      />
    );
  }

  if (type === "select") {
    const options = formFieldOptions(field);
    return (
      <select name={name} required={required}>
        <option value="">{placeholder || "Select…"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (type === "checkbox") {
    return <input type="checkbox" name={name} required={required} />;
  }

  const inputType = FORM_INPUT_TYPES.has(type) ? type : "text";
  return (
    <input
      type={inputType}
      name={name}
      required={required}
      placeholder={placeholder || undefined}
    />
  );
}

function counterTextAlign(align: string): CSSProperties["textAlign"] | undefined {
  if (align === "left" || align === "right" || align === "center") {
    return align;
  }
  return undefined;
}

function counterFlexJustify(align: string): CSSProperties["justifyContent"] {
  if (align === "left") {
    return "flex-start";
  }
  if (align === "right") {
    return "flex-end";
  }
  if (align === "stretch") {
    return "stretch";
  }
  return "center";
}

const SPACER_HEIGHT_PROP_KEYS: Record<BuilderBreakpoint, string> = {
  desktop: "height",
  tablet: "heightTablet",
  mobile: "heightMobile",
};

function spacerPropHeight(element: BuilderElement, breakpoint: BuilderBreakpoint): number | undefined {
  const key = SPACER_HEIGHT_PROP_KEYS[breakpoint];
  const raw = element.props[key];
  if (raw === undefined || raw === "") {
    return breakpoint === "desktop" ? propNumber(element.props, "height", 50) : undefined;
  }
  const value = propNumber(element.props, key, breakpoint === "desktop" ? 50 : 0);
  return value > 0 ? value : undefined;
}

function buildSpacerHostStyle(element: BuilderElement, hostProps?: BuilderHostProps): CSSProperties {
  const style: CSSProperties = { ...hostProps?.style };
  if (!elementStyleHasAtBreakpoint(element, "height", "desktop")) {
    style.height = spacerPropHeight(element, "desktop") ?? 50;
  }
  return style;
}

/** Emits tablet/mobile spacer heights from content props when the style panel has no height. */
export function spacerHeightRulesFor(element: BuilderElement): string {
  if (element.type !== "spacer") {
    return "";
  }

  const selector = `[data-npb-id="${element.id}"]`;
  const rules: string[] = [];
  const tablet = spacerPropHeight(element, "tablet");
  const mobile = spacerPropHeight(element, "mobile");

  if (tablet !== undefined && !elementStyleHasAtBreakpoint(element, "height", "tablet")) {
    rules.push(`@media(max-width:1024px){${selector}{height:${tablet}px}}`);
  }
  if (mobile !== undefined && !elementStyleHasAtBreakpoint(element, "height", "mobile")) {
    rules.push(`@media(max-width:767px){${selector}{height:${mobile}px}}`);
  }

  return rules.join("");
}

function headingHasStyleProperty(element: BuilderElement, property: keyof CSSProperties): boolean {
  return elementStyleHas(element, property);
}

/** Resolves image href from linkTo mode and custom link prop. */
function resolveImageHref(props: Record<string, unknown>): string {
  const linkTo = value(props, "linkTo", "none");
  const customLink = value(props, "link");
  if (linkTo === "file") {
    return value(props, "src");
  }
  if (linkTo === "custom") {
    return customLink;
  }
  return customLink;
}

/** Resolves caption text from captionType (custom or alt fallback). */
function resolveImageCaption(props: Record<string, unknown>): string {
  const captionType = value(props, "captionType", "custom");
  if (captionType === "alt") {
    return value(props, "alt");
  }
  return value(props, "caption");
}

/** Resolves gallery item caption from caption mode. */
function resolveGalleryCaption(image: Record<string, unknown>, captionMode: string): string {
  if (captionMode === "none") {
    return "";
  }
  if (captionMode === "title") {
    return value(image, "title");
  }
  if (captionMode === "description") {
    return value(image, "description");
  }
  if (captionMode === "caption") {
    return value(image, "caption");
  }
  return value(image, "alt");
}

/** Resolves gallery item href from linkTo mode. */
function resolveGalleryHref(linkTo: string, image: Record<string, unknown>): string {
  const src = value(image, "src");
  if (linkTo === "file") {
    return src;
  }
  if (linkTo === "custom" || linkTo === "attachment") {
    return value(image, "url");
  }
  return "";
}

/** Returns true when gallery lightbox is enabled. */
function isGalleryLightboxEnabled(lightbox: string): boolean {
  return lightbox !== "no";
}

/** Stable shuffle for gallery random order (deterministic per seed). */
function orderGalleryImages(
  images: Array<Record<string, unknown>>,
  orderBy: string,
  seed: string,
): Array<Record<string, unknown>> {
  if (orderBy !== "random" || images.length < 2) {
    return images;
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const copy = [...images];
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/** Merges widget prop defaults onto the img element; style panel rules emit via renderer. */
function buildImageInlineStyle(element: BuilderElement): CSSProperties {
  const props = element.props;
  const style: CSSProperties = {
    display: "block",
    maxWidth: "100%",
  };

  if (!elementStyleHas(element, "objectFit")) {
    style.objectFit = value(props, "objectFit", "cover") as CSSProperties["objectFit"];
  }

  if (!elementStyleHas(element, "borderRadius")) {
    const radius = numeric(props, "borderRadius", 0);
    if (radius) {
      style.borderRadius = radius;
    }
  }

  if (!elementStyleHas(element, "opacity")) {
    style.opacity = numeric(props, "opacity", 1);
  }

  if (!elementStyleHas(element, "width")) {
    const width = numeric(props, "width", 100);
    if (width) {
      style.width = `${width}%`;
    }
  }

  if (!elementStyleHas(element, "height")) {
    const height = numeric(props, "height", 0);
    if (height) {
      style.height = height;
    }
  }

  return style;
}

/** Resolves heading font size from style panel, size preset, or semantic tag defaults. */
function resolveHeadingFontSize(element: BuilderElement, tag: string): number | undefined {
  if (headingHasStyleFontSize(element)) {
    return undefined;
  }

  const size = value(element.props, "size", "default");
  if (size !== "default" && headingSizePresets[size]) {
    return headingSizePresets[size];
  }

  return headingTagDefaults[tag];
}

const BUTTON_TYPE_PRESETS: Record<string, { backgroundColor: string; color: string }> = {
  info: { backgroundColor: "#6d5dfc", color: "#ffffff" },
  success: { backgroundColor: "#10b981", color: "#ffffff" },
  warning: { backgroundColor: "#f59e0b", color: "#111827" },
  danger: { backgroundColor: "#ef4444", color: "#ffffff" },
  secondary: { backgroundColor: "#6b7280", color: "#ffffff" },
  outline: { backgroundColor: "transparent", color: "#6d5dfc" },
  link: { backgroundColor: "transparent", color: "#6d5dfc" },
};

/** Maps legacy size values from seed documents onto canonical class suffixes. */
function normalizeButtonSize(size: string): string {
  if (size === "small") return "sm";
  if (size === "medium") return "md";
  return size;
}

function elementUsesStyleProperty(element: BuilderElement, property: keyof CSSProperties): boolean {
  return (["desktop", "tablet", "mobile"] as const).some((breakpoint) => {
    const responsive = element.styles?.[breakpoint];
    if (!responsive) {
      return false;
    }
    return (
      responsive.normal?.[property] !== undefined
      || responsive.hover?.[property] !== undefined
      || responsive.active?.[property] !== undefined
      || responsive.focus?.[property] !== undefined
    );
  });
}

const alignOptions = ["left", "center", "right", "justify"].map((item) => ({
  label: item,
  value: item,
}));

const dividerAlignOptions = ["left", "center", "right"].map((item) => ({
  label: item,
  value: item,
}));

function dividerLineStyle(props: Record<string, unknown>): CSSProperties {
  const weight = numeric(props, "weight", 1);
  return {
    border: "none",
    borderTop: `${weight}px ${value(props, "style", "solid")} ${value(props, "color", "#d0d5dd")}`,
    height: 0,
    margin: 0,
  };
}

function dividerHorizontalMargins(align: string): CSSProperties {
  if (align === "left") {
    return { marginLeft: 0, marginRight: "auto" };
  }
  if (align === "right") {
    return { marginLeft: "auto", marginRight: 0 };
  }
  return { marginInline: "auto" };
}

const choices = (
  key: string,
  label: string,
  options: Array<{ label: string; value: string; icon: string }>,
  defaultValue: string,
): BuilderControl => ({ key, label, type: "choices", options, defaultValue });

const directionChoices = (defaultValue = "column") =>
  choices("direction", "Direction", [
    { label: "Row - horizontal", value: "row", icon: "→" },
    { label: "Column - vertical", value: "column", icon: "↓" },
    { label: "Reversed row", value: "row-reverse", icon: "←" },
    { label: "Reversed column", value: "column-reverse", icon: "↑" },
  ], defaultValue);

const justifyChoices = (extra = false) =>
  choices("justify", "Justify content", [
    { label: "Start", value: "flex-start", icon: "⇤" },
    { label: "Center", value: "center", icon: "↔" },
    { label: "End", value: "flex-end", icon: "⇥" },
    { label: "Space between", value: "space-between", icon: "⇆" },
    { label: "Space around", value: "space-around", icon: "⇋" },
    ...(extra ? [{ label: "Space evenly", value: "space-evenly", icon: "⇶" }] : []),
  ], "flex-start");

const alignChoices = (extra = false) =>
  choices("align", "Align items", [
    { label: "Start", value: "flex-start", icon: "⤒" },
    { label: "Center", value: "center", icon: "↕" },
    { label: "End", value: "flex-end", icon: "⤓" },
    { label: "Stretch", value: "stretch", icon: "⇳" },
    ...(extra ? [{ label: "Baseline", value: "baseline", icon: "⊥" }] : []),
  ], "stretch");

const wrapChoices = (reverse = false) =>
  choices("wrap", "Wrap", [
    { label: "No wrap", value: "nowrap", icon: "⇉" },
    { label: "Wrap", value: "wrap", icon: "↩" },
    ...(reverse ? [{ label: "Reversed wrap", value: "wrap-reverse", icon: "↪" }] : []),
  ], "nowrap");

function FlexContainer({
  element,
  children,
}: {
  element: { props: Record<string, unknown>; styles?: import("./types").ResponsiveStyles };
  children?: React.ReactNode;
}) {
  const styles = element.styles?.desktop?.normal ?? {};
  return (
    <div
      style={{
        display: (styles.display as string) || "flex",
        flexDirection: ((styles.flexDirection as string) || value(element.props, "direction", "column")) as CSSProperties["flexDirection"],
        flexWrap: ((styles.flexWrap as string) || value(element.props, "wrap", "nowrap")) as CSSProperties["flexWrap"],
        justifyContent: (styles.justifyContent as string) || value(element.props, "justify", "flex-start"),
        alignItems: (styles.alignItems as string) || value(element.props, "align", "stretch"),
        gap: styles.gap ?? (styles.columnGap || styles.rowGap ? undefined : numeric(element.props, "gap", 16)),
        columnGap: styles.columnGap,
        rowGap: styles.rowGap,
        minHeight: styles.minHeight || numeric(element.props, "minHeight", 0) || undefined,
        overflow: (styles.overflow as string) || value(element.props, "overflow", "visible") as "visible",
      }}
    >
      {children}
    </div>
  );
}

const BOXED_CONTENT_MAX = "var(--npb-content-width, 1200px)";

/** Inline layout from container General props (always wins over stylesheet defaults). */
function containerPropStyles(element: {
  props: Record<string, unknown>;
  styles?: import("./types").ResponsiveStyles;
}): CSSProperties {
  const props = element.props;
  const isGrid = value(props, "containerLayout", "flexbox") === "grid";
  const isBoxed = value(props, "contentWidth", "full") === "boxed";
  const widthPct = numeric(props, "width", 100);
  const result: CSSProperties = {};

  if (isBoxed) {
    result.width = `min(${widthPct}%, ${BOXED_CONTENT_MAX})`;
    result.marginInline = "auto";
  } else {
    result.width = `${widthPct}%`;
  }

  result.display = isGrid ? "grid" : "flex";

  if (!isGrid) {
    result.flexDirection = value(props, "direction", "column") as CSSProperties["flexDirection"];
    result.flexWrap = value(props, "wrap", "nowrap") as CSSProperties["flexWrap"];
  }

  result.justifyContent = value(props, "justify", "flex-start");
  result.alignItems = value(props, "align", "stretch");

  const gap = numeric(props, "gap", 20);
  if (gap) {
    result.gap = gap;
  }

  const minHeight = numeric(props, "minHeight", 0);
  if (minHeight) {
    result.minHeight = minHeight;
  }

  return result;
}

export const builderWidgets: BuilderWidget[] = [
  {
    type: "div-block",
    label: "Div block",
    category: "Atomic",
    icon: "▭",
    defaultProps: { tag: "div", link: "" },
    acceptsChildren: true,
    /** Styles (size/flex/bg) must sit on the real layout root, not an outer chrome wrapper. */
    rendersAsHost: true,
    controls: settings([
      select("tag", "HTML Tag", [
        { label: "Div", value: "div" },
        { label: "Section", value: "section" },
        { label: "Article", value: "article" },
        { label: "Aside", value: "aside" },
        { label: "Header", value: "header" },
        { label: "Footer", value: "footer" },
        { label: "Main", value: "main" },
        { label: "Nav", value: "nav" },
        { label: "Span", value: "span" },
      ], "div"),
      { key: "link", label: "Link", type: "url" },
    ]),
    render: ({ element, children, hostProps }) => {
      const Tag = value(element.props, "tag", "div") as keyof JSX.IntrinsicElements;
      const link = value(element.props, "link");
      const hostClassName = ["npb-div-block", hostProps?.className].filter(Boolean).join(" ") || undefined;

      if (!link) {
        return (
          <Tag
            id={hostProps?.id}
            data-npb-id={hostProps?.["data-npb-id"]}
            className={hostClassName ?? "npb-div-block"}
            style={hostProps?.style}
          >
            {children}
          </Tag>
        );
      }

      const inner = <Tag className="npb-div-block">{children}</Tag>;
      const linkClassName = ["npb-div-link", hostProps?.className].filter(Boolean).join(" ");
      if (hasLinkedDescendant(element.children)) {
        return (
          <div
            id={hostProps?.id}
            data-npb-id={hostProps?.["data-npb-id"]}
            className={linkClassName}
            style={hostProps?.style}
            data-href={link}
          >
            {inner}
          </div>
        );
      }
      return (
        <a
          href={link}
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={linkClassName}
          style={hostProps?.style}
        >
          {inner}
        </a>
      );
    },
  },
  {
    type: "flexbox",
    label: "Flexbox",
    category: "Atomic",
    icon: "▦",
    defaultProps: {
      contentWidth: "full",
      tag: "div",
      link: "",
    },
    acceptsChildren: true,
    /** Flex + size styles must target the real layout root so children are flex items. */
    rendersAsHost: true,
    controls: [
      section("Settings", [
        select("tag", "HTML Tag", [
          { label: "Div", value: "div" },
          { label: "Section", value: "section" },
          { label: "Article", value: "article" },
          { label: "Aside", value: "aside" },
          { label: "Header", value: "header" },
          { label: "Footer", value: "footer" },
          { label: "Main", value: "main" },
          { label: "Nav", value: "nav" },
          { label: "Span", value: "span" },
        ], "div"),
        { key: "link", label: "Link", type: "url" },
        select("contentWidth", "Content width", [
          { label: "Full width", value: "full" },
          { label: "Boxed", value: "boxed" },
        ], "full"),
      ], "general"),
    ],
    render: ({ element, children, hostProps }) => {
      const Tag = value(element.props, "tag", "div") as keyof JSX.IntrinsicElements;
      const link = value(element.props, "link");
      const isBoxed = value(element.props, "contentWidth", "full") === "boxed";
      const contentWidthStyle: CSSProperties = {
        width: isBoxed ? "min(100%, 1200px)" : "100%",
        marginInline: isBoxed ? "auto" : undefined,
      };
      const hostClassName = ["npb-flexbox", hostProps?.className].filter(Boolean).join(" ") || undefined;
      const mergedStyle = { ...contentWidthStyle, ...hostProps?.style };

      if (!link) {
        return (
          <Tag
            id={hostProps?.id}
            data-npb-id={hostProps?.["data-npb-id"]}
            className={hostClassName ?? "npb-flexbox"}
            style={mergedStyle}
          >
            {children}
          </Tag>
        );
      }

      const inner = <Tag className="npb-flexbox">{children}</Tag>;
      const linkClassName = ["npb-div-link", hostProps?.className].filter(Boolean).join(" ");
      if (hasLinkedDescendant(element.children)) {
        return (
          <div
            id={hostProps?.id}
            data-npb-id={hostProps?.["data-npb-id"]}
            className={linkClassName}
            style={mergedStyle}
            data-href={link}
          >
            {inner}
          </div>
        );
      }
      return (
        <a
          href={link}
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={linkClassName}
          style={mergedStyle}
        >
          {inner}
        </a>
      );
    },
  },
  {
    type: "container",
    label: "Container",
    category: "Layout",
    icon: "▱",
    defaultProps: {
      containerLayout: "flexbox",
      contentWidth: "full",
      width: 100,
      minHeight: 0,
      direction: "column",
      justify: "flex-start",
      align: "stretch",
      gap: 20,
      wrap: "nowrap",
    },
    acceptsChildren: true,
    /** Layout + styles must target one host so children participate in flex/grid. */
    rendersAsHost: true,
    controls: [
      section("Container", [
        choices("containerLayout", "Container Layout", [
          { label: "Flexbox", value: "flexbox", icon: "Flexbox" },
          { label: "Grid", value: "grid", icon: "Grid" },
        ], "flexbox"),
        choices("contentWidth", "Content Width", [
          { label: "Boxed", value: "boxed", icon: "Boxed" },
          { label: "Full Width", value: "full", icon: "Full Width" },
        ], "full"),
        number("width", "Width", 100),
        number("minHeight", "Min Height", 0),
      ], "general"),
      section("Items", [
        directionChoices("column"),
        justifyChoices(true),
        alignChoices(),
        number("gap", "Gaps", 20),
        wrapChoices(),
      ], "general"),
    ],
    render: ({ element, children, hostProps }) => {
      const hostClassName = ["npb-container", hostProps?.className].filter(Boolean).join(" ") || "npb-container";
      return (
        <div
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={hostClassName}
          style={{ ...hostProps?.style, ...containerPropStyles(element) }}
        >
          {children}
        </div>
      );
    },
  },
  {
    type: "grid",
    label: "Grid",
    category: "Layout",
    icon: "▦",
    defaultProps: {
      tag: "div",
      columns: 3,
      rows: 1,
      gap: 16,
      justify: "stretch",
      align: "stretch",
    },
    acceptsChildren: true,
    /** Layout + styles must target one host so children are real grid items. */
    rendersAsHost: true,
    controls: [
      ...settings([
        select("tag", "HTML Tag", htmlTagOptions, "div"),
      ]),
      section("Grid", [
        number("columns", "Columns", 3),
        number("rows", "Rows", 1),
        number("gap", "Gaps", 16),
        choices("justify", "Justify items", [
          { label: "Start", value: "start", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "end", icon: "⇥" },
          { label: "Stretch", value: "stretch", icon: "⇳" },
        ], "stretch"),
        choices("align", "Align items", [
          { label: "Start", value: "start", icon: "⤒" },
          { label: "Center", value: "center", icon: "↕" },
          { label: "End", value: "end", icon: "⤓" },
          { label: "Stretch", value: "stretch", icon: "⇳" },
        ], "stretch"),
      ], "style"),
    ],
    render: ({ element, children, hostProps }) => {
      const Tag = value(element.props, "tag", "div") as keyof JSX.IntrinsicElements;
      const hostClassName = ["npb-grid", hostProps?.className].filter(Boolean).join(" ") || "npb-grid";
      const gridStyle: CSSProperties = {
        display: "grid",
        gridTemplateColumns: `repeat(${numeric(element.props, "columns", 3)}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${numeric(element.props, "rows", 1)}, minmax(0, auto))`,
        gap: numeric(element.props, "gap", 16),
        justifyItems: value(element.props, "justify", "stretch") as CSSProperties["justifyItems"],
        alignItems: value(element.props, "align", "stretch") as CSSProperties["alignItems"],
      };
      return (
        <Tag
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={hostClassName}
          style={{ ...gridStyle, ...hostProps?.style }}
        >
          {children}
        </Tag>
      );
    },
  },
  {
    type: "heading",
    label: "Heading",
    category: "Atomic",
    icon: "H",
    defaultProps: {
      text: "This is a title",
      tag: "h2",
      link: "",
      size: "default",
      align: "left",
      color: "",
      fontFamily: "",
      fontWeight: 0,
      textShadow: "",
    },
    controls: [
      section("Content", [
        { ...text("text", "Title", "This is a title"), type: "textarea" },
      ], "general"),
      section("Settings", [
        select("tag", "Tag", headingTags.slice(0, 6), "h2"),
        { key: "link", label: "Link", type: "url" },
      ], "general"),
    ],
    render: ({ element }) => {
      const tag = value(element.props, "tag", "h2");
      const Tag = tag as keyof JSX.IntrinsicElements;
      const fontSize = resolveHeadingFontSize(element, tag);
      const inlineStyle: CSSProperties = {
        ...(elementStyleHas(element, "textAlign")
          ? {}
          : { textAlign: value(element.props, "align", "left") as CSSProperties["textAlign"] }),
        ...(fontSize !== undefined ? { fontSize } : {}),
        ...(elementStyleHas(element, "color")
          ? {}
          : { color: value(element.props, "color") || undefined }),
        ...(elementStyleHas(element, "fontFamily")
          ? {}
          : { fontFamily: value(element.props, "fontFamily") || undefined }),
        ...(elementStyleHas(element, "fontWeight")
          ? {}
          : { fontWeight: numeric(element.props, "fontWeight", 0) || undefined }),
        textShadow: value(element.props, "textShadow") || undefined,
      };
      const heading = (
        <Tag style={inlineStyle}>
          {value(element.props, "text", "Heading")}
        </Tag>
      );
      const link = value(element.props, "link");
      return link ? <a href={link}>{heading}</a> : heading;
    },
  },
  {
    type: "paragraph",
    label: "Paragraph",
    category: "Atomic",
    icon: "¶",
    defaultProps: {
      text: "Type your paragraph here",
      tag: "p",
      link: "",
      dropCap: false,
      columns: 1,
      columnGap: 16,
      align: "left",
      color: "",
      linkColor: "",
      fontSize: 0,
      lineHeight: 0,
    },
    /** Typography and layout styles must apply on the semantic tag, not an outer wrapper. */
    rendersAsHost: true,
    controls: [
      section("Content", [
        { ...text("text", "Paragraph", "Type your paragraph here"), type: "textarea" },
      ], "general"),
      section("Settings", [
        select("tag", "Tag", [
          { label: "p", value: "p" },
          { label: "div", value: "div" },
          { label: "span", value: "span" },
        ], "p"),
        { key: "link", label: "Link", type: "url" },
      ], "general"),
    ],
    render: ({ element, hostProps }) => {
      const Tag = value(element.props, "tag", "p") as keyof JSX.IntrinsicElements;
      const link = value(element.props, "link");
      const className = [
        element.props.dropCap ? "npb-drop-cap" : undefined,
        hostProps?.className,
      ].filter(Boolean).join(" ") || undefined;

      const body = (
        <Tag
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={className}
          style={{
            ...hostProps?.style,
            whiteSpace: "pre-wrap",
            textAlign: elementStyleHas(element, "textAlign")
              ? undefined
              : (value(element.props, "align", "left") as CSSProperties["textAlign"]),
            columnCount: Math.max(1, numeric(element.props, "columns", 1)),
            columnGap: numeric(element.props, "columnGap", 16),
            color: elementStyleHas(element, "color")
              ? undefined
              : (value(element.props, "color") || undefined),
            fontSize: elementStyleHas(element, "fontSize")
              ? undefined
              : (numeric(element.props, "fontSize", 0) || undefined),
            lineHeight: elementStyleHas(element, "lineHeight")
              ? undefined
              : (numeric(element.props, "lineHeight", 0) || undefined),
            "--npb-link-color": value(element.props, "linkColor") || undefined,
          } as CSSProperties}
        >
          {value(element.props, "text")}
        </Tag>
      );

      return link ? <a href={link}>{body}</a> : body;
    },
  },
  {
    type: "text-editor",
    label: "Text Editor",
    category: "Basic",
    icon: "¶",
    defaultProps: {
      text: "Add your text here.",
      dropCap: false,
      columns: 1,
      columnGap: 16,
      align: "left",
      color: "",
      linkColor: "",
      fontSize: 0,
      lineHeight: 0,
    },
    /** Typography and column layout must apply on the rich-text host, not an outer wrapper. */
    rendersAsHost: true,
    controls: [
      section("Content", [
        { ...text("text", "Text Editor", "Add your text here."), type: "richtext" },
        { key: "dropCap", label: "Drop Cap", type: "switch" },
        { key: "columns", label: "Columns", type: "range", min: 1, max: 10, defaultValue: 1 },
        number("columnGap", "Columns Gap", 16),
      ], "content"),
      section("Text Editor", [
        select("align", "Alignment", alignOptions, "left"),
        { key: "color", label: "Text Color", type: "color" },
        { key: "linkColor", label: "Link Color", type: "color" },
        number("fontSize", "Font Size"),
        number("lineHeight", "Line Height"),
      ], "style"),
    ],
    render: ({ element, hostProps }) => {
      const className = [
        element.props.dropCap ? "npb-drop-cap" : undefined,
        hostProps?.className,
      ].filter(Boolean).join(" ") || undefined;

      return (
        <div
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={className}
          style={{
            ...hostProps?.style,
            whiteSpace: "pre-wrap",
            textAlign: elementStyleHas(element, "textAlign")
              ? undefined
              : (value(element.props, "align", "left") as CSSProperties["textAlign"]),
            columnCount: Math.max(1, numeric(element.props, "columns", 1)),
            columnGap: numeric(element.props, "columnGap", 16),
            color: elementStyleHas(element, "color")
              ? undefined
              : (value(element.props, "color") || undefined),
            fontSize: elementStyleHas(element, "fontSize")
              ? undefined
              : (numeric(element.props, "fontSize", 0) || undefined),
            lineHeight: elementStyleHas(element, "lineHeight")
              ? undefined
              : (numeric(element.props, "lineHeight", 0) || undefined),
            "--npb-link-color": value(element.props, "linkColor") || undefined,
          } as CSSProperties}
          dangerouslySetInnerHTML={{ __html: value(element.props, "text") }}
        />
      );
    },
  },
  {
    type: "image",
    label: "Image",
    category: "Atomic",
    icon: "▧",
    defaultProps: {
      src: "",
      alt: "",
      caption: "",
      captionType: "custom",
      link: "",
      linkTo: "none",
      objectFit: "cover",
      align: "center",
      width: 100,
      height: 0,
      opacity: 1,
      borderRadius: 0,
    },
    /** Size/object-fit styles must target the img, not an outer chrome wrapper. */
    rendersAsHost: true,
    controls: [
      section("Content", [
        { key: "src", label: "Image", type: "image" },
        select("resolution", "Resolution", [
          { label: "Thumbnail", value: "thumbnail" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" },
          { label: "Full", value: "full" },
        ], "full"),
      ], "general"),
      section("Settings", [
        { key: "link", label: "Link", type: "url" },
      ], "general"),
    ],
    render: ({ element, hostProps }) => {
      const src = value(element.props, "src");
      const href = resolveImageHref(element.props);
      const captionText = resolveImageCaption(element.props);
      const align = value(element.props, "align", "center") as CSSProperties["textAlign"];
      const imgStyle = buildImageInlineStyle(element);

      const image = src ? (
        <img
          className="npb-image"
          src={src}
          alt={value(element.props, "alt")}
          style={imgStyle}
        />
      ) : (
        <div className="npb-placeholder">Choose image</div>
      );

      const linkedImage = href ? <a href={href}>{image}</a> : image;
      const hostClassName = ["npb-image-widget", hostProps?.className].filter(Boolean).join(" ") || undefined;

      return (
        <figure
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={hostClassName}
          style={{
            ...hostProps?.style,
            textAlign: elementStyleHas(element, "textAlign")
              ? undefined
              : align,
            margin: 0,
          }}
        >
          {linkedImage}
          {captionText ? <figcaption>{captionText}</figcaption> : null}
        </figure>
      );
    },
  },
  {
    type: "button",
    label: "Button",
    category: "Atomic",
    icon: "▣",
    /** Style/hover CSS must target the interactive anchor, not an outer wrapper. */
    rendersAsHost: true,
    defaultProps: {
      text: "Click here",
      url: "",
      align: "left",
      size: "md",
      buttonType: "info",
      icon: "",
      iconPosition: "before",
      buttonId: "",
      textColor: "#ffffff",
      backgroundColor: "#6d5dfc",
      borderRadius: 4,
      paddingX: 24,
      paddingY: 12,
      iconSpacing: 8,
    },
    controls: [
      section("Content", [
        { ...text("text", "Button text", "Click here"), type: "textarea" },
      ], "general"),
      section("Settings", [
        { key: "url", label: "Link", type: "url" },
      ], "general"),
      section("Button", [
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
        ], "left"),
        choices("size", "Size", [
          { label: "XS", value: "xs", icon: "XS" },
          { label: "SM", value: "sm", icon: "SM" },
          { label: "MD", value: "md", icon: "MD" },
          { label: "LG", value: "lg", icon: "LG" },
          { label: "XL", value: "xl", icon: "XL" },
        ], "md"),
        choices("buttonType", "Type", [
          { label: "Info", value: "info", icon: "Info" },
          { label: "Success", value: "success", icon: "Success" },
          { label: "Warning", value: "warning", icon: "Warning" },
          { label: "Danger", value: "danger", icon: "Danger" },
          { label: "Secondary", value: "secondary", icon: "Secondary" },
          { label: "Outline", value: "outline", icon: "Outline" },
          { label: "Link", value: "link", icon: "Link" },
        ], "info"),
        { key: "icon", label: "Icon", type: "icon" },
        choices("iconPosition", "Icon Position", [
          { label: "Before", value: "before", icon: "Before" },
          { label: "After", value: "after", icon: "After" },
        ], "before"),
      ], "style"),
      section("Colors", [
        { key: "backgroundColor", label: "Background", type: "color" },
        { key: "textColor", label: "Text", type: "color" },
        number("borderRadius", "Border Radius", 4),
      ], "style"),
      section("Spacing", [
        number("paddingX", "Horizontal Padding", 24),
        number("paddingY", "Vertical Padding", 12),
        number("iconSpacing", "Icon Spacing", 8),
      ], "style"),
    ],
    render: ({ element, hostProps }) => {
      const props = element.props;
      const icon = value(props, "icon");
      const before = value(props, "iconPosition", "before") === "before";
      const align = value(props, "align", "left") as "left" | "center" | "right";
      const buttonType = value(props, "buttonType", "info");
      const size = normalizeButtonSize(value(props, "size", "md"));
      const preset = BUTTON_TYPE_PRESETS[buttonType] ?? BUTTON_TYPE_PRESETS.info;
      const isOutline = buttonType === "outline";
      const isLink = buttonType === "link";
      const paddingY = numeric(props, "paddingY", 12);
      const paddingX = numeric(props, "paddingX", 24);
      const borderRadius = numeric(props, "borderRadius", isLink ? 0 : 4);
      const textColor = value(props, "textColor") || preset.color;
      const backgroundColor = value(props, "backgroundColor") || preset.backgroundColor;
      const usesStyleBackground = elementUsesStyleProperty(element, "backgroundColor");
      const usesStyleColor = elementUsesStyleProperty(element, "color");

      const buttonStyle: CSSProperties = {
        borderRadius: isLink ? 0 : borderRadius,
        gap: numeric(props, "iconSpacing", 8),
        padding: isLink ? `${paddingY}px ${paddingX}px` : `${paddingY}px ${paddingX}px`,
        ...(isOutline ? { border: `2px solid ${textColor}`, backgroundColor: "transparent" } : {}),
        ...(isLink ? { backgroundColor: "transparent", border: "none", textDecoration: "underline" } : {}),
        ...(!isOutline && !isLink && !usesStyleBackground ? { backgroundColor } : {}),
        ...(!usesStyleColor ? { color: textColor } : {}),
        ...hostProps?.style,
      };

      const buttonClassName = [
        "npb-button",
        `npb-button-${buttonType}`,
        `npb-button-${size}`,
        hostProps?.className,
      ].filter(Boolean).join(" ");

      return (
        <div className="npb-button-align" style={{ textAlign: align }}>
          <a
            id={hostProps?.id || value(props, "buttonId") || undefined}
            data-npb-id={hostProps?.["data-npb-id"]}
            className={buttonClassName}
            href={value(props, "url", "#") || "#"}
            style={buttonStyle}
          >
            {icon && before ? <span aria-hidden="true">{icon}</span> : null}
            {value(props, "text", "Click here")}
            {icon && !before ? <span aria-hidden="true">{icon}</span> : null}
          </a>
        </div>
      );
    },
  },
  {
    type: "video",
    label: "Video",
    category: "Atomic",
    icon: "▶",
    defaultProps: {
      src: "",
      start: 0,
      end: 0,
      poster: "",
      posterEnabled: false,
      posterResolution: "medium_large",
      autoplay: false,
      controls: true,
      loop: false,
      muted: false,
      playsInline: true,
      preload: "metadata",
      aspectRatio: "16:9",
      download: true,
    },
    controls: [
      section("Content", [
        { key: "src", label: "Video URL", type: "url" },
        number("start", "Start Time", 0),
        number("end", "End Time", 0),
        select("aspectRatio", "Aspect ratio", [
          { label: "16:9", value: "16:9" },
          { label: "21:9", value: "21:9" },
          { label: "4:3", value: "4:3" },
          { label: "1:1", value: "1:1" },
          { label: "9:16", value: "9:16" },
        ], "16:9"),
        select("preload", "Preload", [
          { label: "Metadata", value: "metadata" },
          { label: "Auto", value: "auto" },
          { label: "None", value: "none" },
        ], "metadata"),
        { key: "autoplay", label: "Autoplay", type: "switch" },
        { key: "controls", label: "Player controls", type: "switch" },
        { key: "loop", label: "Loop", type: "switch" },
        { key: "muted", label: "Mute", type: "switch" },
        { key: "playsInline", label: "Play inline", type: "switch" },
        { key: "download", label: "Download button", type: "switch" },
        { key: "posterEnabled", label: "Poster Image", type: "switch" },
        { key: "poster", label: "Image", type: "image" },
        select("posterResolution", "Resolution", [{ label: "Medium Large", value: "medium_large" }, { label: "Large", value: "large" }, { label: "Full", value: "full" }], "medium_large"),
      ], "general"),
      section("Settings", [], "general"),
    ],
    render: ({ element }) => {
      const aspect = value(element.props, "aspectRatio", "16:9");
      const paddingBottom = aspectRatios[aspect] ?? aspectRatios["16:9"];
      const src = buildVideoSrc(element.props);

      if (!src) {
        return (
          <div className="npb-video npb-video-empty" style={{ paddingBottom }}>
            <div className="npb-placeholder">Add a video URL</div>
          </div>
        );
      }

      const poster = element.props.posterEnabled
        ? value(element.props, "poster") || undefined
        : undefined;
      const preload = value(element.props, "preload", "metadata") as "auto" | "metadata" | "none";

      return (
        <div className="npb-video" style={{ paddingBottom }}>
          <video
            src={src}
            poster={poster}
            autoPlay={Boolean(element.props.autoplay)}
            controls={element.props.controls !== false}
            loop={Boolean(element.props.loop)}
            muted={Boolean(element.props.muted)}
            playsInline={element.props.playsInline !== false}
            preload={preload}
            controlsList={element.props.download === false ? "nodownload" : undefined}
          />
        </div>
      );
    },
  },
  {
    type: "youtube",
    label: "YouTube",
    category: "Atomic",
    icon: "▷",
    defaultProps: {
      videoUrl: "https://www.youtube.com/watch?v=XHOmBV4",
      videoId: "",
      title: "YouTube video",
      start: 0,
      end: 0,
      autoplay: false,
      mute: false,
      loop: false,
      lazyload: true,
      playerControls: true,
      captions: false,
      privacyMode: false,
      rel: true,
      aspectRatio: "16:9",
    },
    controls: [
      section("Content", [
        text("videoUrl", "YouTube URL", "https://www.youtube.com/watch?v=XHOmBV4"),
        text("title", "Title", "YouTube video"),
        number("start", "Start time", 0),
        number("end", "End time", 0),
        select("aspectRatio", "Aspect ratio", [
          { label: "16:9", value: "16:9" },
          { label: "21:9", value: "21:9" },
          { label: "4:3", value: "4:3" },
          { label: "1:1", value: "1:1" },
          { label: "9:16", value: "9:16" },
        ], "16:9"),
        { key: "autoplay", label: "Autoplay", type: "switch" },
        { key: "mute", label: "Mute", type: "switch" },
        { key: "loop", label: "Loop", type: "switch" },
        { key: "lazyload", label: "Lazy load", type: "switch" },
        { key: "playerControls", label: "Player controls", type: "switch" },
        { key: "captions", label: "Captions", type: "switch" },
        { key: "privacyMode", label: "Privacy mode", type: "switch" },
        { key: "rel", label: "Related videos", type: "switch" },
      ], "general"),
      section("Settings", [], "general"),
    ],
    render: ({ element }) => {
      const rawUrl = value(element.props, "videoUrl") || value(element.props, "videoId");
      const videoId = rawUrl.includes("watch?v=")
        ? rawUrl.split("watch?v=")[1]?.split("&")[0] ?? ""
        : rawUrl.split("/").pop()?.split("?")[0] ?? rawUrl;
      const params = new URLSearchParams();
      if (element.props.autoplay) params.set("autoplay", "1");
      if (element.props.mute) params.set("mute", "1");
      if (element.props.loop) { params.set("loop", "1"); params.set("playlist", videoId); }
      if (numeric(element.props, "start", 0)) params.set("start", String(numeric(element.props, "start", 0)));
      if (numeric(element.props, "end", 0)) params.set("end", String(numeric(element.props, "end", 0)));
      if (element.props.captions) params.set("cc_load_policy", "1");
      if (element.props.rel === false) params.set("rel", "0");
      if (element.props.playerControls === false) params.set("controls", "0");
      const host = element.props.privacyMode ? "www.youtube-nocookie.com" : "www.youtube.com";
      const aspect = value(element.props, "aspectRatio", "16:9");
      const paddingBottom = aspectRatios[aspect] ?? aspectRatios["16:9"];

      if (!videoId) {
        return (
          <div className="npb-video npb-video-empty" style={{ paddingBottom }}>
            <div className="npb-placeholder">Add a YouTube URL</div>
          </div>
        );
      }

      return (
        <div className="npb-video" style={{ paddingBottom }}>
          <iframe
            title={value(element.props, "title", "YouTube video")}
            loading={element.props.lazyload !== false ? "lazy" : "eager"}
            src={`https://${host}/embed/${encodeURIComponent(videoId)}?${params.toString()}`}
            allowFullScreen
          />
        </div>
      );
    },
  },
  {
    type: "divider",
    label: "Divider",
    category: "Atomic",
    icon: "―",
    defaultProps: { style: "solid", width: 100, weight: 1, gap: 16, color: "#d0d5dd", align: "center", addElement: "none", text: "", icon: "★" },
    controls: [
      section("Content", [
        select("style", "Style", ["solid", "double", "dotted", "dashed"].map((item) => ({ label: item, value: item })), "solid"),
        select("addElement", "Add element", [
          { label: "None", value: "none" },
          { label: "Text", value: "text" },
          { label: "Icon", value: "icon" },
        ], "none"),
        text("text", "Text"),
        text("icon", "Icon", "★"),
      ], "general"),
      section("Settings", [
        number("width", "Width", 100),
        number("weight", "Weight", 1),
        number("gap", "Gap", 16),
        { key: "color", label: "Color", type: "color" },
        select("align", "Alignment", dividerAlignOptions, "center"),
      ], "general"),
    ],
    render: ({ element }) => {
      const props = element.props;
      const align = value(props, "align", "center");
      const width = numeric(props, "width", 100);
      const gap = numeric(props, "gap", 16);
      const addElement = value(props, "addElement", "none");
      const lineStyle = dividerLineStyle(props);
      const label = addElement === "text"
        ? value(props, "text")
        : addElement === "icon"
          ? value(props, "icon", "★") || "★"
          : "";

      if (label) {
        return (
          <div className="npb-divider npb-divider-with-element">
            <div
              className="npb-divider-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: `${width}%`,
                marginBlock: gap,
                ...dividerHorizontalMargins(align),
              }}
            >
              <hr style={{ ...lineStyle, flex: 1 }} aria-hidden="true" />
              <span className="npb-divider-label">{label}</span>
              <hr style={{ ...lineStyle, flex: 1 }} aria-hidden="true" />
            </div>
          </div>
        );
      }

      return (
        <div className="npb-divider">
          <hr
            aria-hidden="true"
            style={{
              ...lineStyle,
              width: `${width}%`,
              marginBlock: gap,
              ...dividerHorizontalMargins(align),
            }}
          />
        </div>
      );
    },
  },
  {
    type: "spacer",
    label: "Spacer",
    category: "Basic",
    icon: "↕",
    defaultProps: { height: 50 },
    /** Space height must apply on the host so style-panel size rules do not fight an inner wrapper. */
    rendersAsHost: true,
    controls: content([{ key: "height", label: "Space", type: "range", min: 1, max: 500, defaultValue: 50, responsive: true }]),
    render: ({ element, hostProps }) => {
      const className = ["npb-spacer", hostProps?.className].filter(Boolean).join(" ") || "npb-spacer";
      return (
        <div
          aria-hidden="true"
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={className}
          style={buildSpacerHostStyle(element, hostProps)}
        />
      );
    },
  },
  {
    type: "svg",
    label: "SVG",
    category: "Atomic",
    icon: "◇",
    defaultProps: { src: "", title: "SVG image" },
    /** Size/object-fit styles must target the img, not an outer chrome wrapper. */
    rendersAsHost: true,
    controls: [
      section("Content", [
        { key: "src", label: "SVG", type: "url" },
      ], "general"),
      section("Settings", [
        text("title", "Title", "SVG image"),
      ], "general"),
    ],
    render: ({ element, hostProps }) => {
      const src = value(element.props, "src");
      const hostClassName = ["npb-svg-widget", hostProps?.className].filter(Boolean).join(" ") || undefined;

      return (
        <figure
          id={hostProps?.id}
          data-npb-id={hostProps?.["data-npb-id"]}
          className={hostClassName}
          style={{ ...hostProps?.style, margin: 0 }}
        >
          {src ? (
            <img
              className="npb-svg"
              src={src}
              alt={value(element.props, "title") || "SVG image"}
            />
          ) : (
            <div className="npb-placeholder">Add an SVG URL</div>
          )}
        </figure>
      );
    },
  },
  {
    type: "google-maps",
    label: "Google Maps",
    category: "General",
    icon: "⌖",
    defaultProps: { query: "London Eye, London, United Kingdom", zoom: 10, height: 300, blur: 0, brightness: 100, contrast: 100, saturate: 100, hue: 0 },
    controls: [
      section("Map", [
        text("query", "Location", "London Eye, London, United Kingdom"),
        { key: "zoom", label: "Zoom", type: "range", min: 1, max: 20, defaultValue: 10 },
        number("height", "Height", 300),
      ], "content"),
      section("Map", [
        { key: "blur", label: "Blur", type: "range", min: 0, max: 10, defaultValue: 0 },
        { key: "brightness", label: "Brightness", type: "range", min: 0, max: 200, defaultValue: 100 },
        { key: "contrast", label: "Contrast", type: "range", min: 0, max: 200, defaultValue: 100 },
        { key: "saturate", label: "Saturation", type: "range", min: 0, max: 200, defaultValue: 100 },
        { key: "hue", label: "Hue", type: "range", min: 0, max: 360, defaultValue: 0 },
      ], "style"),
    ],
    render: ({ element }) => {
      const query = value(element.props, "query").trim();
      const height = propNumber(element.props, "height", 300);
      const zoom = propNumber(element.props, "zoom", 10);
      const blur = propNumber(element.props, "blur", 0);
      const brightness = propNumber(element.props, "brightness", 100);
      const contrast = propNumber(element.props, "contrast", 100);
      const saturate = propNumber(element.props, "saturate", 100);
      const hue = propNumber(element.props, "hue", 0);

      if (!query) {
        return (
          <div className="npb-maps npb-maps-empty" style={{ height }}>
            <div className="npb-placeholder">Add a location</div>
          </div>
        );
      }

      return (
        <div className="npb-maps">
          <iframe
            title="Map"
            loading="lazy"
            style={{
              width: "100%",
              height,
              border: 0,
              filter: `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg)`,
            }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`}
          />
        </div>
      );
    },
  },
  {
    type: "alert",
    label: "Alert",
    category: "General",
    icon: "!",
    defaultProps: {
      alertType: "info",
      title: "This is an Alert",
      description: "I am a description. Click the dismiss button to remove this alert from view.",
      showDismiss: true,
      icon: "!",
    },
    controls: [
      section("Alert", [
        choices("alertType", "Type", [
          { label: "Info", value: "info", icon: "Info" },
          { label: "Success", value: "success", icon: "Success" },
          { label: "Warning", value: "warning", icon: "Warning" },
          { label: "Danger", value: "danger", icon: "Danger" },
        ], "info"),
        text("title", "Title", "This is an Alert"),
        { ...text("description", "Content", "I am a description."), type: "textarea" },
        { key: "showDismiss", label: "Dismiss Icon", type: "switch" },
        { key: "icon", label: "Icon", type: "icon" },
      ], "content"),
      section("Alert", [
        { key: "backgroundColor", label: "Background Color", type: "color" },
        { key: "borderColor", label: "Side Border Color", type: "color" },
        number("borderWidth", "Side Border Width", 5),
      ], "style"),
      section("Title", [
        { key: "titleColor", label: "Text Color", type: "color" },
        number("titleFontSize", "Size", 16),
        number("titleFontWeight", "Weight", 700),
      ], "style"),
      section("Description", [
        { key: "descriptionColor", label: "Text Color", type: "color" },
        number("descriptionFontSize", "Size", 14),
      ], "style"),
      section("Dismiss Icon", [
        number("dismissSize", "Size", 16),
        { key: "dismissColor", label: "Color", type: "color" },
      ], "style"),
    ],
    render: ({ element }) => {
      const type = value(element.props, "alertType", "info");
      const tones: Record<string, { bg: string; border: string }> = {
        info: { bg: "#e8f4fd", border: "#5bc0de" },
        success: { bg: "#e9f7ef", border: "#5cb85c" },
        warning: { bg: "#fcf8e3", border: "#f0ad4e" },
        danger: { bg: "#f8e8e8", border: "#d9534f" },
      };
      const tone = tones[type] ?? tones.info!;
      return (
        <div
          className={`npb-alert npb-alert-${type}`}
          style={{
            background: value(element.props, "backgroundColor") || tone.bg,
            borderLeft: `${propNumber(element.props, "borderWidth", 5)}px solid ${value(element.props, "borderColor") || tone.border}`,
            padding: "12px 16px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span aria-hidden="true">{value(element.props, "icon", "!")}</span>
          <div style={{ flex: 1 }}>
            <strong style={{
              color: value(element.props, "titleColor") || undefined,
              fontSize: propNumber(element.props, "titleFontSize", 16) || undefined,
              fontWeight: propNumber(element.props, "titleFontWeight", 700) || undefined,
            }}>{value(element.props, "title", "This is an Alert")}</strong>
            <p style={{
              margin: "4px 0 0",
              color: value(element.props, "descriptionColor") || undefined,
              fontSize: propNumber(element.props, "descriptionFontSize", 14) || undefined,
            }}>{value(element.props, "description", "I am a description. Click the dismiss button to remove this alert from view.")}</p>
          </div>
          {element.props.showDismiss !== false ? (
            <button
              type="button"
              aria-label="Dismiss"
              style={{
                fontSize: propNumber(element.props, "dismissSize", 16),
                color: value(element.props, "dismissColor") || undefined,
                background: "transparent",
                border: 0,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          ) : null}
        </div>
      );
    },
  },
  {
    type: "icon-box",
    label: "Icon Box",
    category: "General",
    icon: "★",
    defaultProps: {
      icon: "★",
      view: "default",
      title: "This is the heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      link: "",
      titleTag: "h3",
      iconPosition: "top",
      align: "center",
      verticalAlign: "top",
      iconSpacing: 15,
      contentSpacing: 0,
      iconSize: 40,
      iconRotate: 0,
      iconPadding: 0,
      shape: "circle",
    },
    controls: [
      section("Icon Box", [
        { key: "icon", label: "Icon", type: "icon" },
        choices("view", "View", [
          { label: "Default", value: "default", icon: "Default" },
          { label: "Stacked", value: "stacked", icon: "Stacked" },
          { label: "Framed", value: "framed", icon: "Framed" },
        ], "default"),
        choices("shape", "Shape", [
          { label: "Circle", value: "circle", icon: "Circle" },
          { label: "Square", value: "square", icon: "Square" },
        ], "circle"),
        text("title", "Title", "This is the heading"),
        { ...text("description", "Description"), type: "textarea" },
        { key: "link", label: "Link", type: "url" },
        select("titleTag", "Title HTML Tag", headingTags, "h3"),
      ], "content"),
      section("Box", [
        choices("iconPosition", "Icon Position", [
          { label: "Start", value: "left", icon: "Start" },
          { label: "End", value: "right", icon: "End" },
          { label: "Top", value: "top", icon: "Top" },
          { label: "Bottom", value: "bottom", icon: "Bottom" },
        ], "top"),
        choices("verticalAlign", "Vertical Alignment", [
          { label: "Top", value: "top", icon: "Top" },
          { label: "Middle", value: "middle", icon: "Middle" },
          { label: "Bottom", value: "bottom", icon: "Bottom" },
        ], "top"),
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
          { label: "Justified", value: "justify", icon: "☰" },
        ], "center"),
        number("iconSpacing", "Icon Spacing", 15),
        number("contentSpacing", "Content Spacing", 0),
      ], "style"),
      section("Icon", [
        { key: "primaryColor", label: "Primary Color", type: "color" },
        { key: "secondaryColor", label: "Secondary Color", type: "color" },
        number("iconSize", "Size", 40),
        number("iconPadding", "Padding", 0),
        number("iconRotate", "Rotate", 0),
        number("iconBorderWidth", "Border Width", 2),
        number("iconBorderRadius", "Border Radius", 50),
      ], "style"),
      section("Content", [
        { key: "titleColor", label: "Title Color", type: "color" },
        number("titleFontSize", "Title Size", 20),
        { key: "descriptionColor", label: "Description Color", type: "color" },
        number("descriptionFontSize", "Description Size", 14),
      ], "style"),
    ],
    render: ({ element }) => {
      const position = value(element.props, "iconPosition", "top");
      const Tag = value(element.props, "titleTag", "h3") as keyof JSX.IntrinsicElements;
      const view = value(element.props, "view", "default");
      const shape = value(element.props, "shape", "circle");
      const primary = value(element.props, "primaryColor") || "#4054b2";
      const secondary = value(element.props, "secondaryColor") || "#fff";
      const body = (
        <div
          className={`npb-icon-box npb-view-${view} npb-shape-${shape}`}
          style={{
            display: "flex",
            flexDirection: position === "top" || position === "bottom" ? "column" : "row",
            alignItems: value(element.props, "verticalAlign") === "middle" ? "center" : value(element.props, "verticalAlign") === "bottom" ? "flex-end" : "flex-start",
            textAlign: value(element.props, "align", "center") as "left" | "center" | "right",
            gap: numeric(element.props, "iconSpacing", 15),
          }}
        >
          <span
            className="npb-icon-box-icon"
            style={{
              order: position === "bottom" || position === "right" ? 2 : 0,
              fontSize: numeric(element.props, "iconSize", 40),
              padding: numeric(element.props, "iconPadding", 0),
              transform: `rotate(${numeric(element.props, "iconRotate", 0)}deg)`,
              color: view === "stacked" ? secondary : primary,
              background: view === "stacked" ? primary : undefined,
              border: view === "framed" ? `${numeric(element.props, "iconBorderWidth", 2)}px solid ${primary}` : undefined,
              borderRadius: shape === "square" ? numeric(element.props, "iconBorderRadius", 50) : "50%",
            }}
          >
            {value(element.props, "icon", "★")}
          </span>
          <div style={{ order: 1 }}>
            <Tag style={{ color: value(element.props, "titleColor") || undefined, fontSize: numeric(element.props, "titleFontSize", 20) || undefined }}>{value(element.props, "title", "This is the heading")}</Tag>
            <p style={{
              marginTop: numeric(element.props, "contentSpacing", 0),
              color: value(element.props, "descriptionColor") || undefined,
              fontSize: numeric(element.props, "descriptionFontSize", 14) || undefined,
            }}>{value(element.props, "description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.")}</p>
          </div>
        </div>
      );
      const link = value(element.props, "link");
      return link ? <a href={link} className="npb-div-link">{body}</a> : body;
    },
  },
  {
    type: "image-box",
    label: "Image Box",
    category: "General",
    icon: "▧",
    defaultProps: {
      image: "",
      title: "This is the heading",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      link: "",
      titleTag: "h3",
      imagePosition: "top",
      align: "center",
      verticalAlign: "top",
      imageSpacing: 15,
      contentSpacing: 0,
      imageWidth: 100,
      imageHeight: 0,
      objectFit: "cover",
      imageBorderRadius: 0,
      imageOpacity: 100,
    },
    controls: [
      section("Image Box", [
        { key: "image", label: "Choose Image", type: "image" },
        text("title", "Title", "This is the heading"),
        { ...text("description", "Description"), type: "textarea" },
        { key: "link", label: "Link", type: "url" },
        select("titleTag", "Title HTML Tag", headingTags, "h3"),
      ], "content"),
      section("Box", [
        choices("imagePosition", "Image Position", [
          { label: "Left", value: "left", icon: "Left" },
          { label: "Top", value: "top", icon: "Top" },
          { label: "Right", value: "right", icon: "Right" },
        ], "top"),
        choices("verticalAlign", "Vertical Alignment", [
          { label: "Top", value: "top", icon: "Top" },
          { label: "Middle", value: "middle", icon: "Middle" },
          { label: "Bottom", value: "bottom", icon: "Bottom" },
        ], "top"),
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
          { label: "Justified", value: "justify", icon: "☰" },
        ], "center"),
        number("imageSpacing", "Image Spacing", 15),
        number("contentSpacing", "Content Spacing", 0),
      ], "style"),
      section("Image", [
        { key: "imageWidth", label: "Width (%)", type: "range", min: 1, max: 100, defaultValue: 100 },
        number("imageHeight", "Height", 0),
        select("objectFit", "Object Fit", [
          { label: "Default", value: "fill" },
          { label: "Fill", value: "fill" },
          { label: "Cover", value: "cover" },
          { label: "Contain", value: "contain" },
        ], "cover"),
        number("imageBorderRadius", "Border Radius", 0),
        { key: "imageOpacity", label: "Opacity", type: "range", min: 0, max: 100, defaultValue: 100 },
      ], "style"),
      section("Content", [
        { key: "titleColor", label: "Title Color", type: "color" },
        number("titleFontSize", "Title Size", 20),
        { key: "descriptionColor", label: "Description Color", type: "color" },
        number("descriptionFontSize", "Description Size", 14),
      ], "style"),
    ],
    render: ({ element }) => {
      const position = value(element.props, "imagePosition", "top");
      const Tag = value(element.props, "titleTag", "h3") as keyof JSX.IntrinsicElements;
      const img = value(element.props, "image")
        ? (
          <img
            src={value(element.props, "image")}
            alt=""
            style={{
              maxWidth: "100%",
              width: `${numeric(element.props, "imageWidth", 100)}%`,
              height: numeric(element.props, "imageHeight", 0) || undefined,
              objectFit: value(element.props, "objectFit", "cover") as "cover",
              borderRadius: numeric(element.props, "imageBorderRadius", 0),
              opacity: numeric(element.props, "imageOpacity", 100) / 100,
              order: position === "right" ? 2 : 0,
            }}
          />
        )
        : <div className="npb-placeholder" style={{ order: position === "right" ? 2 : 0 }}>Choose image</div>;
      const body = (
        <div
          className="npb-image-box"
          style={{
            display: "flex",
            flexDirection: position === "top" ? "column" : "row",
            alignItems: value(element.props, "verticalAlign") === "middle" ? "center" : value(element.props, "verticalAlign") === "bottom" ? "flex-end" : "flex-start",
            gap: numeric(element.props, "imageSpacing", 15),
            textAlign: value(element.props, "align", "center") as CSSProperties["textAlign"],
          }}
        >
          {img}
          <div style={{ order: 1 }}>
            <Tag style={{ color: value(element.props, "titleColor") || undefined, fontSize: numeric(element.props, "titleFontSize", 20) || undefined }}>{value(element.props, "title", "This is the heading")}</Tag>
            <p style={{
              marginTop: numeric(element.props, "contentSpacing", 0),
              color: value(element.props, "descriptionColor") || undefined,
              fontSize: numeric(element.props, "descriptionFontSize", 14) || undefined,
            }}>{value(element.props, "description", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.")}</p>
          </div>
        </div>
      );
      const link = value(element.props, "link");
      return link ? <a href={link} className="npb-div-link">{body}</a> : body;
    },
  },
  {
    type: "testimonial",
    label: "Testimonial",
    category: "General",
    icon: "❝",
    defaultProps: {
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
      image: "",
      name: "John Doe",
      title: "Designer",
      link: "",
      imagePosition: "aside",
      align: "center",
    },
    controls: [
      section("Testimonial", [
        { ...text("content", "Content"), type: "textarea" },
        { key: "image", label: "Choose Image", type: "image" },
        text("name", "Name", "John Doe"),
        text("title", "Title", "Designer"),
        { key: "link", label: "Link", type: "url" },
        choices("imagePosition", "Image Position", [
          { label: "Aside", value: "aside", icon: "Aside" },
          { label: "Top", value: "top", icon: "Top" },
        ], "aside"),
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
        ], "center"),
      ], "content"),
      section("Content", [
        { key: "textColor", label: "Text Color", type: "color" },
        number("contentFontSize", "Size", 16),
      ], "style"),
      section("Image", [
        number("imageSize", "Size", 60),
        number("imageBorderRadius", "Border Radius", 50),
      ], "style"),
      section("Name", [
        { key: "nameColor", label: "Text Color", type: "color" },
        number("nameFontSize", "Size", 16),
      ], "style"),
      section("Title", [
        { key: "jobColor", label: "Text Color", type: "color" },
        number("jobFontSize", "Size", 14),
      ], "style"),
    ],
    render: ({ element }) => {
      const body = (
        <blockquote
          className="npb-testimonial"
          style={{
            display: "flex",
            flexDirection: value(element.props, "imagePosition", "aside") === "top" ? "column" : "row",
            gap: 16,
            textAlign: value(element.props, "align", "center") as "left" | "center" | "right",
            color: value(element.props, "textColor") || undefined,
            fontSize: numeric(element.props, "contentFontSize", 16) || undefined,
          }}
        >
          {value(element.props, "image") ? (
            <img
              src={value(element.props, "image")}
              alt={value(element.props, "name", "John Doe")}
              width={numeric(element.props, "imageSize", 60)}
              height={numeric(element.props, "imageSize", 60)}
              style={{ borderRadius: numeric(element.props, "imageBorderRadius", 50), objectFit: "cover" }}
            />
          ) : null}
          <div>
            <p>{value(element.props, "content", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.")}</p>
            <cite>
              <strong style={{ color: value(element.props, "nameColor") || undefined, fontSize: numeric(element.props, "nameFontSize", 16) || undefined }}>{value(element.props, "name", "John Doe")}</strong>
              {" "}
              <span style={{ color: value(element.props, "jobColor") || undefined, fontSize: numeric(element.props, "jobFontSize", 14) || undefined }}>{value(element.props, "title", "Designer")}</span>
            </cite>
          </div>
        </blockquote>
      );
      return value(element.props, "link") ? <a href={value(element.props, "link")} className="npb-div-link">{body}</a> : body;
    },
  },
  {
    type: "gallery",
    label: "Basic Gallery",
    category: "General",
    icon: "▦",
    defaultProps: {
      images: [],
      columns: "3",
      linkTo: "none",
      caption: "none",
      lightbox: "yes",
      orderBy: "default",
      spacing: 10,
      gap: "default",
      borderRadius: 0,
      captionColor: "",
      captionAlign: "center",
    },
    controls: [
      section("Basic Gallery", [
        { key: "images", label: "Add Images", type: "repeater" },
        choices("columns", "Columns", [1, 2, 3, 4, 5, 6].map((n) => ({ label: String(n), value: String(n), icon: String(n) })), "3"),
        select("caption", "Caption", [
          { label: "None", value: "none" },
          { label: "Attachment Caption", value: "caption" },
          { label: "Image Title", value: "title" },
          { label: "Image Description", value: "description" },
        ], "none"),
        select("linkTo", "Link", [
          { label: "None", value: "none" },
          { label: "Media File", value: "file" },
          { label: "Attachment Page", value: "attachment" },
          { label: "Custom URL", value: "custom" },
        ], "none"),
        select("lightbox", "Lightbox", [
          { label: "Default", value: "default" },
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], "yes"),
        select("orderBy", "Order By", [
          { label: "Default", value: "default" },
          { label: "Random", value: "random" },
        ], "default"),
      ], "content"),
      section("Images", [
        select("gap", "Gap", [
          { label: "Default", value: "default" },
          { label: "No Gap", value: "none" },
          { label: "Narrow", value: "narrow" },
          { label: "Extended", value: "extended" },
          { label: "Wide", value: "wide" },
          { label: "Custom", value: "custom" },
        ], "default"),
        number("spacing", "Custom Gap", 10),
        number("borderRadius", "Border Radius", 0),
        { key: "borderColor", label: "Border Color", type: "color" },
        number("borderWidth", "Border Width", 0),
      ], "style"),
      section("Caption", [
        choices("captionAlign", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
        ], "center"),
        { key: "captionColor", label: "Text Color", type: "color" },
        number("captionSpacing", "Spacing", 8),
      ], "style"),
    ],
    render: ({ element }) => {
      const gapMap: Record<string, number> = {
        none: 0,
        narrow: 5,
        default: 10,
        extended: 15,
        wide: 20,
        custom: numeric(element.props, "spacing", 10),
      };
      const gap = gapMap[value(element.props, "gap", "default")] ?? 10;
      const linkTo = value(element.props, "linkTo", "none");
      const lightbox = value(element.props, "lightbox", "yes");
      const captionMode = value(element.props, "caption", "none");
      const lightboxEnabled = isGalleryLightboxEnabled(lightbox);
      const galleryImages = orderGalleryImages(
        items(element.props, "images"),
        value(element.props, "orderBy", "default"),
        element.id,
      );

      return (
        <div
          className="npb-gallery"
          style={{
            display: "grid",
            gap,
            gridTemplateColumns: `repeat(${Number(value(element.props, "columns", "3")) || 3}, 1fr)`,
          }}
        >
          {galleryImages.map((image, index) => {
            const src = value(image, "src");
            const captionText = resolveGalleryCaption(image, captionMode);
            const href = resolveGalleryHref(linkTo, image);
            const img = (
              <img
                src={src}
                alt={value(image, "alt")}
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: numeric(element.props, "borderRadius", 0) || undefined,
                  border: numeric(element.props, "borderWidth", 0)
                    ? `${numeric(element.props, "borderWidth", 0)}px solid ${value(element.props, "borderColor") || "#c2cbd2"}`
                    : undefined,
                }}
              />
            );
            const linked = href || lightboxEnabled
              ? (
                  <a
                    href={href || src}
                    {...(lightboxEnabled ? { "data-npb-lightbox": "yes" } : {})}
                  >
                    {img}
                  </a>
                )
              : img;

            return (
              <figure key={`${src}-${index}`} style={{ margin: 0 }}>
                {linked}
                {captionText ? (
                  <figcaption
                    style={{
                      textAlign: value(element.props, "captionAlign", "center") as CSSProperties["textAlign"],
                      color: value(element.props, "captionColor") || undefined,
                      marginTop: numeric(element.props, "captionSpacing", 8),
                    }}
                  >
                    {captionText}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      );
    },
  },
  {
    type: "carousel",
    label: "Image Carousel",
    category: "General",
    icon: "▤",
    defaultProps: {
      images: [],
      slidesToShow: "1",
      slidesToScroll: "1",
      navigation: "both",
      imageSpacing: 20,
      carouselName: "",
      imageStretch: "yes",
      linkTo: "none",
      lightbox: "yes",
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 5000,
      infinite: true,
      effect: "slide",
      speed: 500,
      direction: "ltr",
      arrowSize: 20,
      arrowColor: "",
      dotSize: 8,
      dotColor: "",
      activeDotColor: "",
      borderRadius: 0,
    },
    controls: [
      section("Image Carousel", [
        text("carouselName", "Carousel Name", ""),
        { key: "images", label: "Add Images", type: "repeater" },
        choices("slidesToShow", "Slides to Show", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ label: String(n), value: String(n), icon: String(n) })), "1"),
        choices("slidesToScroll", "Slides to Scroll", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ label: String(n), value: String(n), icon: String(n) })), "1"),
        select("imageStretch", "Image Stretch", [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], "yes"),
        select("navigation", "Navigation", [
          { label: "Arrows and Dots", value: "both" },
          { label: "Arrows", value: "arrows" },
          { label: "Dots", value: "dots" },
          { label: "None", value: "none" },
        ], "both"),
        select("linkTo", "Link", [
          { label: "None", value: "none" },
          { label: "Media File", value: "file" },
          { label: "Custom URL", value: "custom" },
        ], "none"),
        select("lightbox", "Lightbox", [
          { label: "Default", value: "default" },
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ], "yes"),
      ], "content"),
      section("Additional Options", [
        { key: "autoplay", label: "Autoplay", type: "switch" },
        { key: "pauseOnHover", label: "Pause on Hover", type: "switch" },
        number("autoplaySpeed", "Autoplay Speed", 5000),
        { key: "infinite", label: "Infinite Loop", type: "switch" },
        select("effect", "Effect", [
          { label: "Slide", value: "slide" },
          { label: "Fade", value: "fade" },
        ], "slide"),
        number("speed", "Animation Speed", 500),
        select("direction", "Direction", [
          { label: "Left", value: "ltr" },
          { label: "Right", value: "rtl" },
        ], "ltr"),
      ], "content"),
      section("Navigation", [
        number("arrowSize", "Arrows Size", 20),
        { key: "arrowColor", label: "Arrows Color", type: "color" },
        number("dotSize", "Dots Size", 8),
        { key: "dotColor", label: "Dots Color", type: "color" },
        { key: "activeDotColor", label: "Active Dot Color", type: "color" },
      ], "style"),
      section("Image", [
        number("imageSpacing", "Image Spacing", 20),
        number("borderRadius", "Border Radius", 0),
      ], "style"),
    ],
    render: ({ element }) => {
      const nav = value(element.props, "navigation", "both");
      const linkTo = value(element.props, "linkTo", "none");
      const lightbox = value(element.props, "lightbox", "yes");
      const lightboxEnabled = isGalleryLightboxEnabled(lightbox);
      const slidesToShow = Math.max(1, Number(value(element.props, "slidesToShow", "1")) || 1);
      const effect = value(element.props, "effect", "slide");
      const carouselName = value(element.props, "carouselName");
      const carouselImages = items(element.props, "images");

      if (carouselImages.length === 0) {
        return (
          <div className="npb-carousel npb-carousel-empty" style={{ position: "relative" }}>
            <div className="npb-placeholder">Add carousel images</div>
          </div>
        );
      }

      return (
        <div
          className={`npb-carousel npb-carousel-${effect}`}
          style={{ position: "relative" }}
          data-npb-carousel={element.id}
          data-slides-to-show={slidesToShow}
          data-slides-to-scroll={value(element.props, "slidesToScroll", "1")}
          data-autoplay-speed={numeric(element.props, "autoplaySpeed", 5000)}
          data-speed={numeric(element.props, "speed", 500)}
          {...(element.props.autoplay ? { "data-autoplay": "yes" } : {})}
          {...(element.props.pauseOnHover !== false ? { "data-pause-on-hover": "yes" } : {})}
          {...(element.props.infinite !== false ? { "data-infinite": "yes" } : {})}
          {...(carouselName ? { "aria-label": carouselName } : {})}
        >
          <div style={{ display: "flex", gap: numeric(element.props, "imageSpacing", 20), overflow: "auto", direction: value(element.props, "direction", "ltr") as "ltr" | "rtl" }}>
            {carouselImages.map((image, index) => {
              const src = value(image, "src");
              const href = resolveGalleryHref(linkTo, image);
              const img = (
                <img
                  src={src}
                  alt={value(image, "alt")}
                  style={{
                    width: value(element.props, "imageStretch") === "no" ? "auto" : `${100 / slidesToShow}%`,
                    flex: "0 0 auto",
                    borderRadius: numeric(element.props, "borderRadius", 0) || undefined,
                    objectFit: "cover",
                  }}
                />
              );

              if (href || lightboxEnabled) {
                return (
                  <a
                    key={`${src}-${index}`}
                    href={href || src}
                    {...(lightboxEnabled ? { "data-npb-lightbox": "yes" } : {})}
                  >
                    {img}
                  </a>
                );
              }

              return (
                <span key={`${src}-${index}`} style={{ flex: "0 0 auto" }}>
                  {img}
                </span>
              );
            })}
          </div>
          {nav === "both" || nav === "arrows" ? (
            <div className="npb-carousel-arrows" style={{ color: value(element.props, "arrowColor") || undefined, fontSize: numeric(element.props, "arrowSize", 20) }}>
              <button type="button" aria-label="Previous">‹</button>
              <button type="button" aria-label="Next">›</button>
            </div>
          ) : null}
          {nav === "both" || nav === "dots" ? (
            <div className="npb-carousel-dots" style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
              {carouselImages.map((_, index) => (
                <span
                  key={index}
                  style={{
                    width: numeric(element.props, "dotSize", 8),
                    height: numeric(element.props, "dotSize", 8),
                    borderRadius: "50%",
                    background: index === 0
                      ? (value(element.props, "activeDotColor") || "#4054b2")
                      : (value(element.props, "dotColor") || "#c2cbd2"),
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      );
    },
  },
  {
    type: "icon-list",
    label: "Icon List",
    category: "General",
    icon: "☷",
    defaultProps: {
      layout: "traditional",
      applyLinkOn: "full",
      spaceBetween: 0,
      align: "left",
      items: [
        { text: "List Item #1", icon: "✓", url: "" },
        { text: "List Item #2", icon: "✓", url: "" },
        { text: "List Item #3", icon: "✓", url: "" },
      ],
    },
    controls: [
      section("Icon List", [
        choices("layout", "Layout", [
          { label: "Default", value: "traditional", icon: "Default" },
          { label: "Inline", value: "inline", icon: "Inline" },
        ], "traditional"),
        { key: "items", label: "Items", type: "repeater" },
        choices("applyLinkOn", "Apply Link On", [
          { label: "Full Width", value: "full", icon: "Full Width" },
          { label: "Inline", value: "inline", icon: "Inline" },
        ], "full"),
      ], "content"),
      section("List", [
        number("spaceBetween", "Space Between", 0),
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
        ], "left"),
        { key: "divider", label: "Divider", type: "switch" },
        select("dividerStyle", "Style", [
          { label: "Solid", value: "solid" },
          { label: "Double", value: "double" },
          { label: "Dotted", value: "dotted" },
          { label: "Dashed", value: "dashed" },
        ], "solid"),
        { key: "dividerColor", label: "Color", type: "color" },
        number("dividerWeight", "Weight", 1),
      ], "style"),
      section("Icon", [
        { key: "iconColor", label: "Color", type: "color" },
        number("iconSize", "Size", 14),
        number("iconGap", "Gap", 5),
      ], "style"),
      section("Text", [
        { key: "textColor", label: "Color", type: "color" },
        number("textSize", "Size", 14),
      ], "style"),
    ],
    render: ({ element }) => {
      const layout = value(element.props, "layout", "traditional");
      const applyLinkOn = value(element.props, "applyLinkOn", "full");
      const iconGap = numeric(element.props, "iconGap", 5);
      const iconStyle: CSSProperties = {
        color: value(element.props, "iconColor") || undefined,
        fontSize: numeric(element.props, "iconSize", 14),
      };
      const rowStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: iconGap,
      };
      const linkStyle: CSSProperties = {
        color: "inherit",
        textDecoration: "none",
      };

      return (
        <ul
          className={`npb-icon-list npb-icon-list-${layout}`}
          style={{
            display: layout === "inline" ? "flex" : "grid",
            gap: numeric(element.props, "spaceBetween", 0),
            justifyContent: value(element.props, "align", "left") === "center"
              ? "center"
              : value(element.props, "align") === "right"
                ? "flex-end"
                : "flex-start",
            listStyle: "none",
            padding: 0,
            margin: 0,
            color: value(element.props, "textColor") || undefined,
            fontSize: numeric(element.props, "textSize", 14) || undefined,
          }}
        >
          {items(element.props, "items").map((item, index) => {
            const url = value(item, "url");
            const iconEl = <span style={iconStyle}>{value(item, "icon", "✓")}</span>;
            const textEl = <span>{value(item, "text")}</span>;
            let content: JSX.Element;

            if (url && applyLinkOn === "inline") {
              content = (
                <span style={rowStyle}>
                  {iconEl}
                  <a href={url} style={linkStyle}>{textEl}</a>
                </span>
              );
            } else if (url) {
              content = (
                <a href={url} style={{ ...linkStyle, ...rowStyle, flex: 1, width: "100%" }}>
                  {iconEl}
                  {textEl}
                </a>
              );
            } else {
              content = (
                <span style={rowStyle}>
                  {iconEl}
                  {textEl}
                </span>
              );
            }

            return (
              <li
                key={`${value(item, "text")}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: element.props.divider
                    ? `${numeric(element.props, "dividerWeight", 1)}px ${value(element.props, "dividerStyle", "solid")} ${value(element.props, "dividerColor") || "#c2cbd2"}`
                    : undefined,
                  paddingBottom: element.props.divider ? 8 : undefined,
                }}
              >
                {content}
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    type: "counter",
    label: "Counter",
    category: "General",
    icon: "123",
    defaultProps: {
      start: 0,
      end: 100,
      prefix: "",
      suffix: "",
      duration: 2000,
      separator: "default",
      title: "Cool Number",
      titleTag: "div",
      titlePosition: "after",
      numberAlign: "center",
    },
    controls: [
      section("Counter", [
        number("start", "Starting Number", 0),
        number("end", "Ending Number", 100),
        text("prefix", "Number Prefix"),
        text("suffix", "Number Suffix"),
        number("duration", "Animation Duration (ms)", 2000),
        select("separator", "Thousand Separator", [
          { label: "Default", value: "default" },
          { label: "Dot", value: "dot" },
          { label: "Space", value: "space" },
          { label: "Underline", value: "underline" },
          { label: "Apostrophe", value: "apostrophe" },
          { label: "None", value: "none" },
        ], "default"),
        text("title", "Title", "Cool Number"),
        select("titleTag", "Title HTML Tag", headingTags, "div"),
      ], "content"),
      section("Counter", [
        choices("titlePosition", "Title Position", [
          { label: "Before", value: "before", icon: "Before" },
          { label: "After", value: "after", icon: "After" },
          { label: "Start", value: "start", icon: "Start" },
          { label: "End", value: "end", icon: "End" },
        ], "after"),
        choices("numberAlign", "Number Position", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
          { label: "Stretch", value: "stretch", icon: "☰" },
        ], "center"),
        number("titleGap", "Title Gap", 0),
        number("numberGap", "Number Gap", 0),
      ], "style"),
      section("Number", [
        { key: "numberColor", label: "Text Color", type: "color" },
        number("numberFontSize", "Size", 48),
      ], "style"),
      section("Title", [
        { key: "titleColor", label: "Text Color", type: "color" },
        number("titleFontSize", "Size", 16),
      ], "style"),
    ],
    render: ({ element }) => {
      const Tag = value(element.props, "titleTag", "div") as keyof JSX.IntrinsicElements;
      const titlePosition = value(element.props, "titlePosition", "after");
      const numberAlign = value(element.props, "numberAlign", "center");
      const isFlexLayout = titlePosition === "start" || titlePosition === "end";
      const titleGap = propNumber(element.props, "titleGap", 0);
      const numberGap = propNumber(element.props, "numberGap", 0);
      const endValue = propNumber(element.props, "end", 100);
      const formattedNumber = formatCounterNumber(
        endValue,
        value(element.props, "separator", "default"),
      );
      const titleBefore = titlePosition === "before" || titlePosition === "start";
      const titleNode = (
        <Tag style={{
          color: value(element.props, "titleColor") || undefined,
          fontSize: propNumber(element.props, "titleFontSize", 16) || undefined,
          marginBlock: !isFlexLayout && titleGap ? titleGap : undefined,
        }}
        >
          {value(element.props, "title")}
        </Tag>
      );
      const numberNode = (
        <strong style={{
          color: value(element.props, "numberColor") || undefined,
          fontSize: propNumber(element.props, "numberFontSize", 48) || undefined,
          display: "inline-block",
          marginInline: numberGap || undefined,
          width: numberAlign === "stretch" ? "100%" : undefined,
          textAlign: numberAlign === "stretch" ? "center" : undefined,
        }}
        >
          {value(element.props, "prefix")}{formattedNumber}{value(element.props, "suffix")}
        </strong>
      );
      return (
        <div
          className="npb-counter"
          data-npb-counter-start={propNumber(element.props, "start", 0)}
          data-npb-counter-end={endValue}
          data-npb-counter-duration={propNumber(element.props, "duration", 2000)}
          style={{
            textAlign: !isFlexLayout ? counterTextAlign(numberAlign) : undefined,
            display: isFlexLayout ? "flex" : "block",
            alignItems: numberAlign === "stretch" ? "stretch" : "center",
            justifyContent: isFlexLayout ? counterFlexJustify(numberAlign) : undefined,
            gap: isFlexLayout && titleGap ? titleGap : undefined,
            flexDirection: titlePosition === "end" ? "row-reverse" : "row",
            width: numberAlign === "stretch" ? "100%" : undefined,
          }}
        >
          {titleBefore ? titleNode : null}
          {numberNode}
          {!titleBefore ? titleNode : null}
        </div>
      );
    },
  },
  {
    type: "progress",
    label: "Progress Bar",
    category: "General",
    icon: "▰",
    defaultProps: {
      title: "My Skill",
      titleTag: "span",
      displayTitle: true,
      progressType: "default",
      value: 50,
      displayPercentage: true,
      innerText: "",
      barHeight: 10,
      borderRadius: 0,
    },
    controls: [
      section("Progress Bar", [
        text("title", "Title", "My Skill"),
        select("titleTag", "Title HTML Tag", headingTags, "span"),
        { key: "displayTitle", label: "Display Title", type: "switch" },
        select("progressType", "Type", [
          { label: "Default", value: "default" },
          { label: "Info", value: "info" },
          { label: "Success", value: "success" },
          { label: "Warning", value: "warning" },
          { label: "Danger", value: "danger" },
        ], "default"),
        { key: "value", label: "Percentage", type: "range", min: 0, max: 100, defaultValue: 50 },
        { key: "displayPercentage", label: "Display Percentage", type: "switch" },
        text("innerText", "Inner Text"),
      ], "content"),
      section("Progress Bar", [
        { key: "titleColor", label: "Title Color", type: "color" },
        { key: "percentageColor", label: "Percentage Color", type: "color" },
        { key: "barColor", label: "Color", type: "color" },
        { key: "barBackground", label: "Background Color", type: "color" },
        number("barHeight", "Height", 10),
        number("borderRadius", "Border Radius", 0),
        { key: "innerTextColor", label: "Inner Text Color", type: "color" },
      ], "style"),
    ],
    render: ({ element }) => {
      const Tag = value(element.props, "titleTag", "span") as keyof JSX.IntrinsicElements;
      const typeColors: Record<string, string> = {
        default: "#61ce70",
        info: "#5bc0de",
        success: "#5cb85c",
        warning: "#f0ad4e",
        danger: "#d9534f",
      };
      const percent = propNumber(element.props, "value", 50);
      const barColor = value(element.props, "barColor") || typeColors[value(element.props, "progressType", "default")] || "#61ce70";
      return (
        <div className="npb-progress">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            {element.props.displayTitle !== false ? (
              <Tag style={{ color: value(element.props, "titleColor") || undefined }}>{value(element.props, "title")}</Tag>
            ) : <span />}
            {element.props.displayPercentage !== false ? (
              <span style={{ color: value(element.props, "percentageColor") || undefined }}>{percent}%</span>
            ) : null}
          </div>
          <div
            style={{
              position: "relative",
              height: propNumber(element.props, "barHeight", 10),
              borderRadius: propNumber(element.props, "borderRadius", 0),
              background: value(element.props, "barBackground") || "#eee",
              overflow: "hidden",
            }}
          >
            <i
              style={{
                display: "block",
                height: "100%",
                width: `${percent}%`,
                background: barColor,
              }}
            />
            {value(element.props, "innerText") ? (
              <b style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: value(element.props, "innerTextColor") || "#fff", fontSize: 11 }}>
                {value(element.props, "innerText")}
              </b>
            ) : null}
          </div>
        </div>
      );
    },
  },
  {
    type: "rating",
    label: "Star Rating",
    category: "General",
    icon: "★★★★★",
    defaultProps: { rating: 5, scale: 5, title: "Rating", align: "center", size: 20 },
    controls: [
      section("Star Rating", [
        number("rating", "Rating", 5),
        number("scale", "Scale", 5),
        text("title", "Title", "Rating"),
      ], "content"),
      section("Stars", [
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
        ], "center"),
        { key: "starColor", label: "Color", type: "color" },
        { key: "unmarkedColor", label: "Unmarked Color", type: "color" },
        number("size", "Size", 20),
      ], "style"),
    ],
    render: ({ element }) => {
      const scale = Math.max(0, propNumber(element.props, "scale", 5));
      const rating = Math.min(Math.max(0, propNumber(element.props, "rating", 5)), scale);
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating - fullStars >= 0.5;
      const emptyStars = Math.max(0, scale - fullStars - (hasHalfStar ? 1 : 0));
      const starColor = value(element.props, "starColor") || "#f0ad4e";
      const unmarkedColor = value(element.props, "unmarkedColor") || "#ccd6df";
      const align = value(element.props, "align", "center");
      return (
        <span
          className="npb-rating"
          role="img"
          aria-label={value(element.props, "title", "Rating")}
          style={{
            display: "inline-flex",
            gap: 2,
            fontSize: propNumber(element.props, "size", 20),
            justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
            width: "100%",
          }}
        >
          {fullStars > 0 ? (
            <span style={{ color: starColor }} aria-hidden="true">{"★".repeat(fullStars)}</span>
          ) : null}
          {hasHalfStar ? (
            <span
              aria-hidden="true"
              style={{ position: "relative", display: "inline-block", lineHeight: 1, color: unmarkedColor }}
            >
              ★
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "50%",
                  overflow: "hidden",
                  color: starColor,
                }}
              >
                ★
              </span>
            </span>
          ) : null}
          {emptyStars > 0 ? (
            <span style={{ color: unmarkedColor }} aria-hidden="true">{"★".repeat(emptyStars)}</span>
          ) : null}
        </span>
      );
    },
  },
  {
    type: "icon",
    label: "Icon",
    category: "General",
    icon: "★",
    defaultProps: { icon: "★", view: "default", shape: "circle", link: "", align: "center", size: 50, rotate: 0, padding: 0, fitToSize: false, borderWidth: 2, borderRadius: 50 },
    controls: [
      section("Icon", [
        { key: "icon", label: "Icon", type: "icon" },
        choices("view", "View", [
          { label: "Default", value: "default", icon: "Default" },
          { label: "Stacked", value: "stacked", icon: "Stacked" },
          { label: "Framed", value: "framed", icon: "Framed" },
        ], "default"),
        choices("shape", "Shape", [
          { label: "Circle", value: "circle", icon: "Circle" },
          { label: "Square", value: "square", icon: "Square" },
        ], "circle"),
        { key: "link", label: "Link", type: "url" },
      ], "content"),
      section("Icon", [
        choices("align", "Alignment", [
          { label: "Start", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "right", icon: "⇥" },
        ], "center"),
        { key: "primaryColor", label: "Primary Color", type: "color" },
        { key: "secondaryColor", label: "Secondary Color", type: "color" },
        number("size", "Size", 50),
        { key: "fitToSize", label: "Fit to Size", type: "switch" },
        number("padding", "Padding", 0),
        number("rotate", "Rotate", 0),
        number("borderWidth", "Border Width", 2),
        number("borderRadius", "Border Radius", 50),
      ], "style"),
    ],
    render: ({ element }) => {
      const view = value(element.props, "view", "default");
      const shape = value(element.props, "shape", "circle");
      const primary = value(element.props, "primaryColor") || "#4054b2";
      const secondary = value(element.props, "secondaryColor") || "#fff";
      const size = numeric(element.props, "size", 50);
      const padding = numeric(element.props, "padding", 0);
      const fitToSize = Boolean(element.props.fitToSize);
      const fitBoxSize = size + padding * 2;
      const node = (
        <span
          className={`npb-icon npb-view-${view} npb-shape-${shape}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size,
            padding,
            color: view === "stacked" ? secondary : primary,
            background: view === "stacked" ? primary : undefined,
            border: view === "framed" ? `${numeric(element.props, "borderWidth", 2)}px solid ${primary}` : undefined,
            borderRadius: shape === "square" ? numeric(element.props, "borderRadius", 50) : "50%",
            transform: `rotate(${numeric(element.props, "rotate", 0)}deg)`,
            ...(fitToSize ? { width: fitBoxSize, height: fitBoxSize } : {}),
          }}
        >
          {value(element.props, "icon", "★")}
        </span>
      );
      return (
        <div style={{ textAlign: value(element.props, "align", "center") as "left" | "center" | "right" }}>
          {value(element.props, "link") ? <a href={value(element.props, "link")}>{node}</a> : node}
        </div>
      );
    },
  },
  {
    type: "social-icons",
    label: "Social Icons",
    category: "General",
    icon: "●",
    defaultProps: {
      items: [
        { network: "Facebook", icon: "f", url: "#" },
        { network: "X", icon: "𝕏", url: "#" },
        { network: "YouTube", icon: "▶", url: "#" },
      ],
      shape: "rounded",
      columns: "auto",
      align: "center",
      size: 25,
      spacing: 5,
      padding: 10,
    },
    controls: [
      section("Social Icons", [
        { key: "items", label: "Social Icons", type: "repeater" },
        choices("shape", "Shape", [
          { label: "Square", value: "square", icon: "Square" },
          { label: "Rounded", value: "rounded", icon: "Rounded" },
          { label: "Circle", value: "circle", icon: "Circle" },
        ], "rounded"),
        choices("columns", "Columns", [
          { label: "Auto", value: "auto", icon: "Auto" },
          ...[1, 2, 3, 4, 5, 6].map((n) => ({ label: String(n), value: String(n), icon: String(n) })),
        ], "auto"),
        choices("align", "Alignment", [
          { label: "Left", value: "left", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "Right", value: "right", icon: "⇥" },
        ], "center"),
      ], "content"),
      section("Icon", [
        number("size", "Size", 25),
        number("padding", "Padding", 10),
        number("spacing", "Spacing", 5),
        { key: "primaryColor", label: "Primary Color", type: "color" },
        { key: "secondaryColor", label: "Secondary Color", type: "color" },
      ], "style"),
    ],
    render: ({ element }) => {
      const shape = value(element.props, "shape", "rounded");
      const columns = value(element.props, "columns", "auto");
      const align = value(element.props, "align", "center");
      const size = numeric(element.props, "size", 25);
      const padding = numeric(element.props, "padding", 10);
      const spacing = numeric(element.props, "spacing", 5);
      const primaryColor = value(element.props, "primaryColor") || value(element.props, "color") || "#fff";
      const secondaryColor = value(element.props, "secondaryColor") || "#4054b2";
      const boxSize = size + padding * 2;

      return (
        <div
          className={`npb-social npb-social-${shape}`}
          style={{
            display: "grid",
            gridTemplateColumns: columns === "auto"
              ? "repeat(auto-fit, minmax(40px, max-content))"
              : `repeat(${Number(columns) || 3}, max-content)`,
            gap: spacing,
            justifyContent: align === "right" ? "flex-end" : align === "left" ? "flex-start" : "center",
          }}
        >
          {items(element.props, "items").map((item, index) => (
            <a
              key={`${value(item, "network")}-${index}`}
              href={value(item, "url", "#")}
              aria-label={value(item, "network")}
              style={{
                display: "grid",
                placeItems: "center",
                width: boxSize,
                height: boxSize,
                fontSize: size,
                color: primaryColor,
                background: secondaryColor,
                borderRadius: shape === "circle" ? "50%" : shape === "square" ? 0 : 6,
                textDecoration: "none",
              }}
            >
              {value(item, "icon", "●")}
            </a>
          ))}
        </div>
      );
    },
  },
  {
    type: "accordion",
    label: "Accordion",
    category: "General",
    icon: "⌄",
    defaultProps: {
      items: [
        { title: "Accordion Item #1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
        { title: "Accordion Item #2", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
        { title: "Accordion Item #3", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
      ],
      itemPosition: "stretch",
      iconPosition: "end",
      expandIcon: "▼",
      collapseIcon: "▲",
      titleTag: "div",
      faqSchema: false,
      defaultState: "expanded_first",
      maxExpanded: "one",
      animationDuration: 400,
      spaceBetween: 0,
      distanceFromContent: 0,
    },
    controls: [
      section("Layout", [
        { key: "items", label: "Items", type: "repeater" },
        choices("itemPosition", "Item Position", [
          { label: "Start", value: "start", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "end", icon: "⇥" },
          { label: "Stretch", value: "stretch", icon: "☰" },
        ], "stretch"),
        choices("iconPosition", "Icon Position", [
          { label: "Start", value: "start", icon: "Start" },
          { label: "End", value: "end", icon: "End" },
        ], "end"),
        text("expandIcon", "Expand Icon", "▼"),
        text("collapseIcon", "Collapse Icon", "▲"),
        select("titleTag", "Title HTML Tag", headingTags, "div"),
        { key: "faqSchema", label: "FAQ Schema", type: "switch" },
      ], "content"),
      section("Interactions", [
        select("defaultState", "Default State", [
          { label: "All collapsed", value: "collapsed" },
          { label: "First expanded", value: "expanded_first" },
          { label: "All expanded", value: "expanded_all" },
        ], "expanded_first"),
        select("maxExpanded", "Max Items Expanded", [
          { label: "One", value: "one" },
          { label: "Multiple", value: "multiple" },
        ], "one"),
        number("animationDuration", "Animation Duration", 400),
      ], "content"),
      section("Accordion", [
        number("spaceBetween", "Space between Items", 0),
        number("distanceFromContent", "Distance from content", 0),
        { key: "titleBackground", label: "Background Color", type: "color" },
      ], "style"),
      section("Header", [
        { key: "titleColor", label: "Title Color", type: "color" },
        { key: "activeTitleColor", label: "Active Title Color", type: "color" },
        number("titleFontSize", "Title Size", 16),
        number("iconSize", "Icon Size", 14),
        { key: "iconColor", label: "Icon Color", type: "color" },
      ], "style"),
      section("Content", [
        { key: "contentBackground", label: "Background Color", type: "color" },
        { key: "contentColor", label: "Content Color", type: "color" },
        number("contentFontSize", "Content Size", 14),
      ], "style"),
    ],
    render: ({ element }) => {
      const accordionItems = items(element.props, "items");
      const defaultState = value(element.props, "defaultState", "expanded_first");
      const maxExpanded = value(element.props, "maxExpanded", "one");
      const singleExpanded = maxExpanded === "one";
      const itemPosition = value(element.props, "itemPosition", "stretch");
      const iconPosition = value(element.props, "iconPosition", "end");
      const titleTag = value(element.props, "titleTag", "div") as keyof JSX.IntrinsicElements;
      const titleColor = value(element.props, "titleColor");
      const activeTitleColor = value(element.props, "activeTitleColor");
      const titleBackground = value(element.props, "titleBackground");
      const expandIcon = value(element.props, "expandIcon", "▼");
      const collapseIcon = value(element.props, "collapseIcon", "▲");
      const animationDuration = numeric(element.props, "animationDuration", 400);
      const spaceBetween = numeric(element.props, "spaceBetween", 0);
      const distanceFromContent = numeric(element.props, "distanceFromContent", 0);
      const titleFontSize = numeric(element.props, "titleFontSize", 16);
      const iconSize = numeric(element.props, "iconSize", 14);
      const iconColor = value(element.props, "iconColor");
      const contentColor = value(element.props, "contentColor");
      const contentBackground = value(element.props, "contentBackground");
      const contentFontSize = numeric(element.props, "contentFontSize", 14);
      const faqSchema = Boolean(element.props.faqSchema);

      const isInitiallyOpen = (index: number) => {
        if (defaultState === "collapsed") {
          return false;
        }
        if (defaultState === "expanded_first") {
          return index === 0;
        }
        if (defaultState === "expanded_all") {
          return singleExpanded ? index === 0 : true;
        }
        return index === 0;
      };

      const headerJustify =
        itemPosition === "center"
          ? "center"
          : itemPosition === "end"
            ? "flex-end"
            : itemPosition === "start"
              ? "flex-start"
              : "space-between";

      if (!accordionItems.length) {
        return <div className="npb-accordion-widget npb-accordion-empty" aria-hidden="true" />;
      }

      const faqJson =
        faqSchema &&
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: accordionItems.map((item) => ({
            "@type": "Question",
            name: value(item, "title"),
            acceptedAnswer: {
              "@type": "Answer",
              text: value(item, "content"),
            },
          })),
        });

      return (
        <div
          className={`npb-accordion-widget${singleExpanded ? " npb-accordion-one" : " npb-accordion-multiple"}`}
          data-npb-accordion={element.id}
          style={{
            display: "grid",
            gap: spaceBetween,
            ["--npb-accordion-duration" as string]: `${animationDuration}ms`,
            ...(titleColor ? { ["--npb-accordion-title-color" as string]: titleColor } : {}),
            ...(activeTitleColor ? { ["--npb-accordion-active-color" as string]: activeTitleColor } : {}),
          }}
        >
          {accordionItems.map((item, index) => {
            const inputId = `${element.id}-acc-${index}`;
            const initiallyOpen = isInitiallyOpen(index);
            return (
              <div
                key={`${value(item, "title")}-${index}`}
                className="npb-accordion-item"
                style={{ background: titleBackground || undefined }}
              >
                <input
                  type={singleExpanded ? "radio" : "checkbox"}
                  name={singleExpanded ? `npb-accordion-${element.id}` : undefined}
                  id={inputId}
                  className="npb-accordion-input"
                  defaultChecked={initiallyOpen}
                />
                <label
                  htmlFor={inputId}
                  className="npb-accordion-header"
                  style={{
                    display: "flex",
                    flexDirection: iconPosition === "start" ? "row-reverse" : "row",
                    alignItems: "center",
                    justifyContent: headerJustify,
                    gap: 8,
                    fontSize: titleFontSize || undefined,
                    cursor: "pointer",
                  }}
                >
                  {(() => {
                    const Tag = titleTag;
                    return (
                      <Tag style={itemPosition === "stretch" ? { flex: 1 } : undefined}>{value(item, "title")}</Tag>
                    );
                  })()}
                  <span
                    className="npb-accordion-icon"
                    style={{ fontSize: iconSize, color: iconColor || undefined, flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <span className="npb-accordion-icon-expand">{expandIcon}</span>
                    <span className="npb-accordion-icon-collapse">{collapseIcon}</span>
                  </span>
                </label>
                <div className="npb-accordion-panel">
                  <div
                    className="npb-accordion-content"
                    style={{
                      marginTop: distanceFromContent,
                      color: contentColor || undefined,
                      background: contentBackground || undefined,
                      fontSize: contentFontSize || undefined,
                    }}
                  >
                    {value(item, "content")}
                  </div>
                </div>
              </div>
            );
          })}
          {faqJson ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJson }} />
          ) : null}
        </div>
      );
    },
  },
  {
    type: "toggle",
    label: "Toggle",
    category: "General",
    icon: "⌄",
    defaultProps: {
      items: [
        { title: "Toggle Item #1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { title: "Toggle Item #2", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      ],
      titleTag: "div",
      spaceBetween: 0,
    },
    controls: [
      section("Toggle", [
        { key: "items", label: "Items", type: "repeater" },
        select("titleTag", "Title HTML Tag", headingTags, "div"),
      ], "content"),
      section("Toggle", [
        number("spaceBetween", "Space Between", 0),
        { key: "titleColor", label: "Title Color", type: "color" },
      ], "style"),
    ],
    render: ({ element }) => {
      const toggleItems = items(element.props, "items");
      const titleTag = value(element.props, "titleTag", "div") as keyof JSX.IntrinsicElements;
      const titleColor = value(element.props, "titleColor");
      const spaceBetween = propNumber(element.props, "spaceBetween", 0);

      if (!toggleItems.length) {
        return <div className="npb-toggle npb-toggle-empty" aria-hidden="true" />;
      }

      return (
        <div
          className="npb-toggle"
          data-npb-toggle={element.id}
          style={{
            display: "grid",
            gap: spaceBetween,
            ...(titleColor ? { ["--npb-toggle-title-color" as string]: titleColor } : {}),
          }}
        >
          {toggleItems.map((item, index) => {
            const inputId = `${element.id}-toggle-${index}`;
            const Tag = titleTag;
            return (
              <div key={`${value(item, "title")}-${index}`} className="npb-toggle-item">
                <input type="checkbox" id={inputId} className="npb-toggle-input" />
                <label htmlFor={inputId} className="npb-toggle-header">
                  <Tag>{value(item, "title")}</Tag>
                </label>
                <div className="npb-toggle-panel">
                  <div className="npb-toggle-content">{value(item, "content")}</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    type: "tabs",
    label: "Tabs",
    category: "Atomic",
    icon: "▥",
    defaultProps: {
      items: [
        { title: "Tab #1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
        { title: "Tab #2", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
        { title: "Tab #3", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
      ],
      direction: "horizontal",
      align: "start",
    },
    controls: [
      section("Content", [
        { key: "items", label: "Tabs Items", type: "repeater" },
        choices("direction", "Direction", [
          { label: "Horizontal", value: "horizontal", icon: "↔" },
          { label: "Vertical", value: "vertical", icon: "↕" },
        ], "horizontal"),
      ], "general"),
      section("Settings", [
        choices("align", "Alignment", [
          { label: "Start", value: "start", icon: "⇤" },
          { label: "Center", value: "center", icon: "↔" },
          { label: "End", value: "end", icon: "⇥" },
          { label: "Stretch", value: "stretch", icon: "☰" },
        ], "start"),
      ], "general"),
      section("Tabs", [
        { key: "titleColor", label: "Title Color", type: "color" },
        { key: "activeTitleColor", label: "Active Title Color", type: "color" },
        { key: "contentColor", label: "Content Color", type: "color" },
        number("titleSpacing", "Title Spacing", 10),
      ], "style"),
    ],
    render: ({ element }) => {
      const direction = value(element.props, "direction", "horizontal");
      const vertical = direction === "vertical";
      const tabItems = items(element.props, "items");
      const align = value(element.props, "align", "start");
      const stretch = align === "stretch";
      const activeColor = value(element.props, "activeTitleColor") || "#4054b2";
      const titleColor = value(element.props, "titleColor");
      const contentColor = value(element.props, "contentColor");
      const titleSpacing = numeric(element.props, "titleSpacing", 10);

      if (!tabItems.length) {
        return (
          <div
            className={`npb-tabs npb-tabs-empty npb-tabs-${direction}`}
            aria-hidden="true"
          />
        );
      }

      const navStyle: CSSProperties = {
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        gap: 8,
        justifyContent: align === "center" ? "center" : align === "end" ? "flex-end" : stretch ? "stretch" : "flex-start",
        width: !vertical && stretch ? "100%" : undefined,
        alignItems: vertical && stretch ? "stretch" : undefined,
      };
      const labelStyle: CSSProperties = stretch
        ? { flex: 1, textAlign: "center" }
        : {};

      return (
        <div
          className={`npb-tabs npb-tabs-${direction}`}
          data-npb-tabs={element.id}
          style={{
            display: "flex",
            flexDirection: vertical ? "row" : "column",
            gap: titleSpacing,
            ["--npb-tabs-active-color" as string]: activeColor,
            ...(titleColor ? { ["--npb-tabs-title-color" as string]: titleColor } : {}),
          }}
        >
          {tabItems.map((_, index) => (
            <input
              key={`input-${index}`}
              type="radio"
              name={`npb-tabs-${element.id}`}
              id={`${element.id}-tab-${index}`}
              className="npb-tabs-input"
              defaultChecked={index === 0}
            />
          ))}
          <div className="npb-tabs-nav" style={navStyle} role="tablist">
            {tabItems.map((item, index) => (
              <label
                key={`${value(item, "title")}-${index}`}
                htmlFor={`${element.id}-tab-${index}`}
                className="npb-tabs-label"
                style={labelStyle}
                role="tab"
              >
                {value(item, "title")}
              </label>
            ))}
          </div>
          <div
            className="npb-tabs-panels"
            style={{ color: contentColor || undefined, flex: 1 }}
          >
            {tabItems.map((item, index) => (
              <div
                key={`${value(item, "title")}-${index}-panel`}
                className="npb-tabs-panel"
                role="tabpanel"
              >
                {value(item, "content")}
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    type: "audio",
    label: "SoundCloud",
    category: "General",
    icon: "♫",
    defaultProps: { src: "", visual: true, autoplay: false, buy: true, like: true, download: true, share: true, comments: true, playCount: true, username: true, artwork: true, height: 200 },
    controls: [
      section("SoundCloud", [
        { key: "src", label: "Link", type: "url" },
        { key: "visual", label: "Visual Player", type: "switch" },
      ], "content"),
      section("Additional Options", [
        { key: "autoplay", label: "Autoplay", type: "switch" },
        { key: "buy", label: "Buy Button", type: "switch" },
        { key: "like", label: "Like Button", type: "switch" },
        { key: "download", label: "Download Button", type: "switch" },
        { key: "share", label: "Share Button", type: "switch" },
        { key: "comments", label: "Comments", type: "switch" },
        { key: "playCount", label: "Play Counts", type: "switch" },
        { key: "username", label: "Username", type: "switch" },
        { key: "artwork", label: "Artwork", type: "switch" },
      ], "content"),
      section("SoundCloud", [
        number("height", "Height", 200),
      ], "style"),
    ],
    render: ({ element }) => {
      const src = value(element.props, "src");
      const height = numeric(element.props, "height", 200);

      if (!src) {
        return (
          <div className="npb-audio npb-audio-empty" style={{ height }}>
            <div className="npb-placeholder">Add a SoundCloud link</div>
          </div>
        );
      }

      const params = new URLSearchParams({
        url: src,
        visual: String(element.props.visual !== false),
        auto_play: String(Boolean(element.props.autoplay)),
        buying: String(element.props.buy !== false),
        liking: String(element.props.like !== false),
        download: String(element.props.download !== false),
        sharing: String(element.props.share !== false),
        show_comments: String(element.props.comments !== false),
        show_playcount: String(element.props.playCount !== false),
        show_user: String(element.props.username !== false),
        show_artwork: String(element.props.artwork !== false),
      });

      return (
        <div className="npb-audio">
          <iframe
            title="SoundCloud"
            loading="lazy"
            allow="autoplay"
            style={{ width: "100%", height, border: 0 }}
            src={`https://w.soundcloud.com/player/?${params.toString()}`}
          />
        </div>
      );
    },
  },
  {
    type: "form",
    label: "Form",
    category: "Interactive",
    icon: "✉",
    defaultProps: { fields: [{ label: "Name", type: "text", required: true }, { label: "Email", type: "email", required: true }], buttonText: "Send" },
    controls: content([{ key: "fields", label: "Form Fields", type: "repeater" }, text("buttonText", "Button Text", "Send")]),
    render: ({ element }) => (
      <form className="npb-form">
        {items(element.props, "fields").map((field, index) => (
          <label key={`${value(field, "label")}-${index}`}>
            {value(field, "label")}
            {renderFormFieldControl(field, index)}
          </label>
        ))}
        <button type="submit">{value(element.props, "buttonText") || "Send"}</button>
      </form>
    ),
  },
  {
    type: "html",
    label: "HTML",
    category: "General",
    icon: "</>",
    defaultProps: { html: HTML_WIDGET_DEFAULT },
    rendersAsHost: true,
    controls: [
      section("HTML Code", [
        { key: "html", label: "HTML Code", type: "textarea" },
      ], "content"),
    ],
    render: ({ element, hostProps }) => (
      <div
        id={hostProps?.id}
        data-npb-id={hostProps?.["data-npb-id"]}
        className={["npb-html", hostProps?.className].filter(Boolean).join(" ") || undefined}
        style={hostProps?.style}
        dangerouslySetInnerHTML={{
          __html: sanitizeWidgetHtml(stringProp(element.props, "html", HTML_WIDGET_DEFAULT)),
        }}
      />
    ),
  },
  {
    type: "menu-anchor",
    label: "Menu Anchor",
    category: "General",
    icon: "⚓",
    defaultProps: { id: "anchor" },
    controls: [
      section("Menu Anchor", [
        text("id", "The ID of Menu Anchor.", "anchor"),
      ], "content"),
    ],
    render: ({ element }) => {
      const anchorId = stringProp(element.props, "id", "anchor");
      return <span id={anchorId} className="npb-anchor" aria-hidden="true" />;
    },
  },
  {
    type: "read-more",
    label: "Read More",
    category: "General",
    icon: "…",
    defaultProps: { text: "Continue reading", link: "#more" },
    rendersAsHost: true,
    controls: [
      section("Read More", [
        text("text", "Read More Text", "Continue reading"),
        { key: "link", label: "Link", type: "url" },
      ], "content"),
    ],
    render: ({ element, hostProps }) => (
      <a
        id={hostProps?.id}
        data-npb-id={hostProps?.["data-npb-id"]}
        className={["npb-read-more", hostProps?.className].filter(Boolean).join(" ") || undefined}
        style={hostProps?.style}
        href={stringProp(element.props, "link", "#more")}
      >
        {stringProp(element.props, "text", "Continue reading")}
      </a>
    ),
  },
  {
    type: "shortcode",
    label: "Shortcode",
    category: "WordPress",
    icon: "[]",
    defaultProps: { code: "[shortcode]" },
    controls: content([text("code", "Enter your shortcode", "[shortcode]")]),
    render: ({ element }) => <code>{stringProp(element.props, "code", "[shortcode]")}</code>,
  },
  {
    type: "wordpress",
    label: "WordPress",
    category: "WordPress",
    icon: "W",
    defaultProps: { widget: "", title: "WordPress Widget" },
    controls: content([text("widget", "Widget ID"), text("title", "Title", "WordPress Widget")]),
    render: ({ element }) => <div className="npb-placeholder">{value(element.props, "title", "WordPress Widget")}</div>,
  },
  {
    type: "text-path",
    label: "Text Path",
    category: "General",
    icon: "〰",
    defaultProps: { text: "Add Your Curvy Text Here", pathType: "wave", link: "", align: "center", direction: "default", showPath: false },
    controls: [
      section("Text Path", [
        text("text", "Text", "Add Your Curvy Text Here"),
        select("pathType", "Path Type", [
          { label: "Wave", value: "wave" },
          { label: "Arc", value: "arc" },
          { label: "Circle", value: "circle" },
        ], "wave"),
        { key: "link", label: "Link", type: "url" },
        choices("align", "Alignment", [
          { label: "Start", value: "start", icon: "☰" },
          { label: "Center", value: "center", icon: "☰" },
          { label: "End", value: "end", icon: "☰" },
        ], "center"),
        select("direction", "Text Direction", [{ label: "Default", value: "default" }, { label: "Reversed", value: "reversed" }], "default"),
        { key: "showPath", label: "Show Path", type: "switch" },
      ], "content"),
    ],
    render: ({ element }) => {
      const type = value(element.props, "pathType", "wave");
      const forwardPath = type === "arc" ? "M 40 145 Q 300 -20 560 145" : type === "circle" ? "M 150 90 a 150 72 0 1 1 300 0 a 150 72 0 1 1 -300 0" : "M 20 95 Q 95 25 170 95 T 320 95 T 470 95 T 620 95";
      const reversePath = type === "arc" ? "M 560 145 Q 300 -20 40 145" : type === "circle" ? "M 450 90 a 150 72 0 1 0 -300 0 a 150 72 0 1 0 300 0" : "M 620 95 Q 545 25 470 95 T 320 95 T 170 95 T 20 95";
      const path = value(element.props, "direction", "default") === "reversed" ? reversePath : forwardPath;
      const pathId = `npb-text-path-${element.id}`;
      const label = stringProp(element.props, "text", "Add Your Curvy Text Here");
      const link = stringProp(element.props, "link");
      const startOffset = value(element.props, "align", "center") === "start" ? "0%" : value(element.props, "align") === "end" ? "100%" : "50%";
      const anchor = value(element.props, "align", "center") === "start" ? "start" : value(element.props, "align") === "end" ? "end" : "middle";
      const textPath = <textPath href={`#${pathId}`} startOffset={startOffset} textAnchor={anchor}>{label}</textPath>;
      const text = <text fontSize="26" fontWeight="600">{link ? <a href={link}>{textPath}</a> : textPath}</text>;
      return <svg className="npb-text-path" viewBox="0 0 640 180" role="img" aria-label={label}><defs><path id={pathId} d={path} /></defs>{element.props.showPath ? <path d={path} fill="none" stroke="currentColor" opacity=".25" /> : null}{text}</svg>;
    },
  },
  {
    type: "sidebar",
    label: "Sidebar",
    category: "General",
    icon: "▤",
    defaultProps: { sidebar: "" },
    controls: [section("Sidebar", [select("sidebar", "Choose Sidebar", [{ label: "No sidebars were found", value: "" }], "")], "content")],
    render: () => <div className="npb-placeholder">No sidebars are available in this site.</div>,
  },
  {
    type: "wp-image",
    label: "Image",
    category: "WordPress",
    icon: "▧",
    defaultProps: { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", alt: "", link: "" },
    controls: [section("Content", [image("src", "Choose Image"), text("alt", "Alt Text"), { key: "link", label: "Link", type: "url" }], "general"), section("Settings", [], "general")],
    render: ({ element }) => {
      const src = value(element.props, "src");
      const link = value(element.props, "link");
      const image = <img className="npb-image" src={src} alt={value(element.props, "alt")} />;
      return link ? <a href={link}>{image}</a> : image;
    },
  },
  {
    type: "wp-video",
    label: "Video",
    category: "WordPress",
    icon: "▶",
    defaultProps: { src: "", poster: "", autoplay: false, loop: false },
    controls: [section("Content", [{ key: "src", label: "Video URL", type: "url" }, { key: "poster", label: "Poster", type: "image" }, { key: "autoplay", label: "Autoplay", type: "switch" }, { key: "loop", label: "Loop", type: "switch" }], "general"), section("Settings", [], "general")],
    render: ({ element }) => {
      const src = value(element.props, "src");
      if (!src) {
        return <div className="npb-placeholder">Add a video URL</div>;
      }
      const poster = value(element.props, "poster") || undefined;
      return (
        <video
          className="npb-native-video"
          src={src}
          poster={poster}
          controls
          autoPlay={Boolean(element.props.autoplay)}
          loop={Boolean(element.props.loop)}
        />
      );
    },
  },
  {
    type: "wp-block",
    label: "Block",
    category: "WordPress",
    icon: "▦",
    defaultProps: { title: "WordPress Block" },
    controls: [section("Content", [text("title", "Block", "WordPress Block")], "general"), section("Settings", [], "general")],
    render: ({ element }) => <div className="npb-placeholder">{value(element.props, "title", "WordPress Block")}</div>,
  },
  ...[
    ["search", "Search"],
    ["minimalist", "Minimalist", "Link In Bio"],
    ["pages", "Pages"],
    ["calendar", "Calendar"],
    ["archives", "Archives"],
    ["recent-posts", "Recent Posts"],
    ["recent-comments", "Recent Comments"],
    ["rss", "RSS"],
    ["tag-cloud", "Tag Cloud"],
    ["navigation-menu", "Navigation Menu"],
    ["custom-html", "Custom HTML"],
    ["block", "Block"],
  ].map(([type, label, category = "WordPress"]): BuilderWidget => ({
    type,
    label,
    category: category as BuilderWidget["category"],
    icon: "W",
    defaultProps: { title: label },
    controls: [
      section("Content", [text("title", "Title", label)], "general"),
      ...settings([]),
    ],
    render: ({ element }) => <div className="npb-placeholder">{value(element.props, "title", label)}</div>,
  })),
];

/** Finds a registered widget by its stable document type. */
export function getBuilderWidget(type: string): BuilderWidget | undefined {
  return builderWidgets.find((widget) => widget.type === type);
}
