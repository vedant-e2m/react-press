import type { CSSProperties, JSX } from "react";
import type { BuilderControl, BuilderControlSection, BuilderControlTab, BuilderElement, BuilderWidget } from "./types";

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
const numeric = (props: Record<string, unknown>, key: string, fallback = 0) =>
  typeof props[key] === "number" ? props[key] : fallback;
const items = (props: Record<string, unknown>, key: string) =>
  Array.isArray(props[key]) ? (props[key] as Array<Record<string, unknown>>) : [];
const hasLinkedDescendant = (elements: BuilderElement[] = []): boolean => elements.some((child) => Boolean(child.props.link) || hasLinkedDescendant(child.children));

const headingTags = [
  ...["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => ({
    label: tag.toUpperCase(),
    value: tag,
  })),
  { label: "DIV", value: "div" },
  { label: "SPAN", value: "span" },
  { label: "P", value: "p" },
];

const alignOptions = ["left", "center", "right", "justify"].map((item) => ({
  label: item,
  value: item,
}));

const flexOptions = (key: string, label: string, options: string[], defaultValue: string) =>
  select(key, label, options.map((item) => ({ label: item, value: item })), defaultValue);

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

export const builderWidgets: BuilderWidget[] = [
  {
    type: "div-block",
    label: "Div block",
    category: "Atomic",
    icon: "▭",
    defaultProps: { tag: "div", link: "" },
    acceptsChildren: true,
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
    render: ({ element, children }) => {
      const Tag = value(element.props, "tag", "div") as keyof JSX.IntrinsicElements;
      const link = value(element.props, "link");
      const body = <Tag className="npb-div-block">{children}</Tag>;
      if (!link) return body;
      return hasLinkedDescendant(element.children) ? <div className="npb-div-link" data-href={link}>{body}</div> : <a href={link} className="npb-div-link">{body}</a>;
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
    render: ({ element, children }) => (
      <div
        className="npb-flexbox"
        style={{
          width: value(element.props, "contentWidth", "full") === "boxed" ? "min(100%, 1200px)" : "100%",
          marginInline: value(element.props, "contentWidth", "full") === "boxed" ? "auto" : undefined,
        }}
      >
        {(() => {
          const Tag = value(element.props, "tag", "div") as keyof JSX.IntrinsicElements;
          const link = value(element.props, "link");
          const body = <Tag className="npb-flex-inner"><FlexContainer element={element}>{children}</FlexContainer></Tag>;
          if (!link) return body;
          return hasLinkedDescendant(element.children) ? <div className="npb-div-link" data-href={link}>{body}</div> : <a href={link} className="npb-div-link">{body}</a>;
        })()}
      </div>
    ),
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
    render: ({ element, children }) => <FlexContainer element={element}>{children}</FlexContainer>,
  },
  {
    type: "grid",
    label: "Grid",
    category: "Layout",
    icon: "▦",
    defaultProps: {
      columns: 3,
      rows: 1,
      gap: 16,
      justify: "stretch",
      align: "stretch",
    },
    acceptsChildren: true,
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
    render: ({ element, children }) => (
      <div
        className="npb-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numeric(element.props, "columns", 3)}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${numeric(element.props, "rows", 1)}, minmax(0, auto))`,
          gap: numeric(element.props, "gap", 16),
          justifyItems: value(element.props, "justify", "stretch"),
          alignItems: value(element.props, "align", "stretch"),
        }}
      >
        {children}
      </div>
    ),
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
      const Tag = value(element.props, "tag", "h2") as keyof JSX.IntrinsicElements;
      const sizes: Record<string, number> = {
        small: 18,
        medium: 28,
        large: 36,
        xl: 48,
        xxl: 64,
      };
      const size = value(element.props, "size", "default");
      const heading = (
        <Tag style={{
          textAlign: value(element.props, "align", "left") as "left",
          fontSize: sizes[size],
          color: value(element.props, "color") || undefined,
          fontFamily: value(element.props, "fontFamily") || undefined,
          fontWeight: numeric(element.props, "fontWeight", 0) || undefined,
          textShadow: value(element.props, "textShadow") || undefined,
        }}
        >
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
    render: ({ element }) => {
      const Tag = value(element.props, "tag", "p") as keyof JSX.IntrinsicElements;
      return (
        <Tag
          className={element.props.dropCap ? "npb-drop-cap" : undefined}
          style={{
            whiteSpace: "pre-wrap",
            textAlign: value(element.props, "align", "left") as "left",
            columnCount: Math.max(1, numeric(element.props, "columns", 1)),
            columnGap: numeric(element.props, "columnGap", 16),
            color: value(element.props, "color") || undefined,
            fontSize: numeric(element.props, "fontSize", 0) || undefined,
            lineHeight: numeric(element.props, "lineHeight", 0) || undefined,
            "--npb-link-color": value(element.props, "linkColor") || undefined,
          } as CSSProperties}
        >
          {value(element.props, "text")}
        </Tag>
      );
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
    render: ({ element }) => (
      <div
        className={element.props.dropCap ? "npb-drop-cap" : undefined}
        style={{
          whiteSpace: "pre-wrap",
          textAlign: value(element.props, "align", "left") as "left",
          columnCount: Math.max(1, numeric(element.props, "columns", 1)),
          columnGap: numeric(element.props, "columnGap", 16),
          color: value(element.props, "color") || undefined,
          fontSize: numeric(element.props, "fontSize", 0) || undefined,
          lineHeight: numeric(element.props, "lineHeight", 0) || undefined,
          "--npb-link-color": value(element.props, "linkColor") || undefined,
        } as CSSProperties}
        dangerouslySetInnerHTML={{ __html: value(element.props, "text") }}
      />
    ),
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
    render: ({ element }) => {
      const src = value(element.props, "src");
      const href = value(element.props, "link");
      const image = src ? (
        <img
          src={src}
          alt={value(element.props, "alt")}
          style={{
            borderRadius: numeric(element.props, "borderRadius", 0) || undefined,
            height: numeric(element.props, "height", 0) || undefined,
            objectFit: value(element.props, "objectFit", "cover") as "cover",
            opacity: numeric(element.props, "opacity", 1),
            width: `${numeric(element.props, "width", 100)}%`,
          }}
        />
      ) : (
        <div className="npb-placeholder">Choose image</div>
      );
      return (
        <figure style={{ textAlign: value(element.props, "align", "center") as "center" }}>
          {href ? <a href={href}>{image}</a> : image}
        </figure>
      );
    },
  },
  {
    type: "button",
    label: "Button",
    category: "Atomic",
    icon: "▣",
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
    ],
    render: ({ element }) => {
      const icon = value(element.props, "icon");
      const before = value(element.props, "iconPosition", "before") === "before";
      return (
        <div style={{ textAlign: value(element.props, "align", "left") as "left" }}>
          <a
            id={value(element.props, "buttonId") || undefined}
            className={`npb-button npb-button-${value(element.props, "buttonType", "info")} npb-button-${value(element.props, "size", "md")}`}
            href={value(element.props, "url", "#") || "#"}
            style={{
              backgroundColor: value(element.props, "backgroundColor", "#6d5dfc"),
              borderRadius: numeric(element.props, "borderRadius", 4),
              color: value(element.props, "textColor", "#ffffff"),
              gap: numeric(element.props, "iconSpacing", 8),
              padding: `${numeric(element.props, "paddingY", 12)}px ${numeric(element.props, "paddingX", 24)}px`,
            }}
          >
            {icon && before ? <span aria-hidden="true">{icon}</span> : null}
            {value(element.props, "text", "Click here")}
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
      const ratios: Record<string, string> = {
        "16:9": "56.25%",
        "21:9": "42.85%",
        "4:3": "75%",
        "1:1": "100%",
        "9:16": "177.77%",
      };
      return (
        <div className="npb-video" style={{ paddingBottom: ratios[value(element.props, "aspectRatio", "16:9")] }}>
          <video
            src={`${value(element.props, "src")}${numeric(element.props, "start", 0) || numeric(element.props, "end", 0) ? `#t=${numeric(element.props, "start", 0)}${numeric(element.props, "end", 0) ? `,${numeric(element.props, "end", 0)}` : ""}` : ""}`}
            poster={element.props.posterEnabled ? value(element.props, "poster") : undefined}
            autoPlay={Boolean(element.props.autoplay)}
            controls={element.props.controls !== false}
            loop={Boolean(element.props.loop)}
            muted={Boolean(element.props.muted)}
            playsInline={element.props.playsInline !== false}
            preload={value(element.props, "preload", "metadata")}
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
        number("start", "Start time", 0),
        number("end", "End time", 0),
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
      if (!element.props.rel) params.set("rel", "0");
      if (element.props.playerControls === false) params.set("controls", "0");
      const host = element.props.privacyMode ? "www.youtube-nocookie.com" : "www.youtube.com";
      const ratios: Record<string, string> = { "16:9": "56.25%", "21:9": "42.85%", "4:3": "75%", "1:1": "100%" };
      return (
        <div className="npb-video" style={{ paddingBottom: ratios[value(element.props, "aspectRatio", "16:9")] }}>
          <iframe
            title={value(element.props, "title", "YouTube video")}
            loading={element.props.lazyload ? "lazy" : "eager"}
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
      section("Settings", [], "general"),
    ],
    render: ({ element }) => (
      <div className="npb-divider" style={{ textAlign: value(element.props, "align", "center") as "center" }}>
        <hr style={{
          borderStyle: value(element.props, "style", "solid"),
          borderColor: value(element.props, "color", "#d0d5dd"),
          width: `${numeric(element.props, "width", 100)}%`,
          borderWidth: numeric(element.props, "weight", 1),
          marginBlock: numeric(element.props, "gap", 16),
          marginInline: "auto",
        }}
        />
        {value(element.props, "addElement") === "text" ? <span>{value(element.props, "text")}</span> : null}
        {value(element.props, "addElement") === "icon" ? <span>{value(element.props, "icon", "★")}</span> : null}
      </div>
    ),
  },
  {
    type: "spacer",
    label: "Spacer",
    category: "Basic",
    icon: "↕",
    defaultProps: { height: 50 },
    controls: content([{ key: "height", label: "Space", type: "range", min: 1, max: 500, defaultValue: 50, responsive: true }]),
    render: ({ element }) => <div aria-hidden="true" style={{ height: numeric(element.props, "height", 50) }} />,
  },
  {
    type: "svg",
    label: "SVG",
    category: "Atomic",
    icon: "◇",
    defaultProps: { src: "", title: "SVG image" },
    controls: [
      section("Content", [
        { key: "src", label: "SVG", type: "url" },
      ], "general"),
      section("Settings", [], "general"),
    ],
    render: ({ element }) => <img src={value(element.props, "src")} alt={value(element.props, "title", "SVG image")} />,
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
    render: ({ element }) => (
      <iframe
        title="Map"
        loading="lazy"
        style={{
          width: "100%",
          height: numeric(element.props, "height", 300),
          border: 0,
          filter: `blur(${numeric(element.props, "blur", 0)}px) brightness(${numeric(element.props, "brightness", 100)}%) contrast(${numeric(element.props, "contrast", 100)}%) saturate(${numeric(element.props, "saturate", 100)}%) hue-rotate(${numeric(element.props, "hue", 0)}deg)`,
        }}
        src={`https://www.google.com/maps?q=${encodeURIComponent(value(element.props, "query"))}&z=${numeric(element.props, "zoom", 10)}&output=embed`}
      />
    ),
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
            borderLeft: `${numeric(element.props, "borderWidth", 5)}px solid ${value(element.props, "borderColor") || tone.border}`,
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
              fontSize: numeric(element.props, "titleFontSize", 16) || undefined,
              fontWeight: numeric(element.props, "titleFontWeight", 700) || undefined,
            }}>{value(element.props, "title")}</strong>
            <p style={{
              margin: "4px 0 0",
              color: value(element.props, "descriptionColor") || undefined,
              fontSize: numeric(element.props, "descriptionFontSize", 14) || undefined,
            }}>{value(element.props, "description")}</p>
          </div>
          {element.props.showDismiss !== false ? (
            <button
              type="button"
              aria-label="Dismiss"
              style={{
                fontSize: numeric(element.props, "dismissSize", 16),
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
              borderRadius: shape === "square" ? numeric(element.props, "iconBorderRadius", 0) : "50%",
            }}
          >
            {value(element.props, "icon", "★")}
          </span>
          <div style={{ order: 1 }}>
            <Tag style={{ color: value(element.props, "titleColor") || undefined, fontSize: numeric(element.props, "titleFontSize", 20) || undefined }}>{value(element.props, "title")}</Tag>
            <p style={{
              marginTop: numeric(element.props, "contentSpacing", 0),
              color: value(element.props, "descriptionColor") || undefined,
              fontSize: numeric(element.props, "descriptionFontSize", 14) || undefined,
            }}>{value(element.props, "description")}</p>
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
            textAlign: value(element.props, "align", "center") as "left" | "center" | "right",
          }}
        >
          {img}
          <div style={{ order: 1 }}>
            <Tag style={{ color: value(element.props, "titleColor") || undefined, fontSize: numeric(element.props, "titleFontSize", 20) || undefined }}>{value(element.props, "title")}</Tag>
            <p style={{
              marginTop: numeric(element.props, "contentSpacing", 0),
              color: value(element.props, "descriptionColor") || undefined,
              fontSize: numeric(element.props, "descriptionFontSize", 14) || undefined,
            }}>{value(element.props, "description")}</p>
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
              alt=""
              width={numeric(element.props, "imageSize", 60)}
              height={numeric(element.props, "imageSize", 60)}
              style={{ borderRadius: numeric(element.props, "imageBorderRadius", 50), objectFit: "cover" }}
            />
          ) : null}
          <div>
            <p>{value(element.props, "content")}</p>
            <cite>
              <strong style={{ color: value(element.props, "nameColor") || undefined, fontSize: numeric(element.props, "nameFontSize", 16) || undefined }}>{value(element.props, "name")}</strong>
              {" "}
              <span style={{ color: value(element.props, "jobColor") || undefined, fontSize: numeric(element.props, "jobFontSize", 14) || undefined }}>{value(element.props, "title")}</span>
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
      const gapMap: Record<string, number> = { none: 0, narrow: 5, default: 10, extended: 15, wide: 20, custom: numeric(element.props, "spacing", 10) };
      const gap = gapMap[value(element.props, "gap", "default")] ?? 10;
      return (
        <div
          className="npb-gallery"
          style={{
            display: "grid",
            gap,
            gridTemplateColumns: `repeat(${Number(value(element.props, "columns", "3")) || 3}, 1fr)`,
          }}
        >
          {items(element.props, "images").map((image, index) => {
            const src = value(image, "src");
            const captionMode = value(element.props, "caption", "none");
            const captionText = captionMode === "none" ? "" : value(image, captionMode === "title" ? "title" : captionMode === "description" ? "description" : "alt");
            const img = (
              <img
                src={src}
                alt={value(image, "alt")}
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: numeric(element.props, "borderRadius", 0),
                  border: numeric(element.props, "borderWidth", 0)
                    ? `${numeric(element.props, "borderWidth", 0)}px solid ${value(element.props, "borderColor") || "#c2cbd2"}`
                    : undefined,
                }}
              />
            );
            const linked = value(element.props, "linkTo") === "file" || value(element.props, "linkTo") === "custom"
              ? <a href={value(image, "url") || src}>{img}</a>
              : img;
            return (
              <figure key={`${src}-${index}`} style={{ margin: 0 }}>
                {linked}
                {captionText ? (
                  <figcaption style={{
                    textAlign: value(element.props, "captionAlign", "center") as "center",
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
      return (
        <div className="npb-carousel" style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: numeric(element.props, "imageSpacing", 20), overflow: "auto", direction: value(element.props, "direction", "ltr") as "ltr" }}>
            {items(element.props, "images").map((image, index) => (
              <img
                key={`${value(image, "src")}-${index}`}
                src={value(image, "src")}
                alt={value(image, "alt")}
                style={{
                  width: value(element.props, "imageStretch") === "no" ? "auto" : `${100 / (Number(value(element.props, "slidesToShow", "1")) || 1)}%`,
                  flex: "0 0 auto",
                  borderRadius: numeric(element.props, "borderRadius", 0),
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
          {nav === "both" || nav === "arrows" ? (
            <div className="npb-carousel-arrows" style={{ color: value(element.props, "arrowColor") || undefined, fontSize: numeric(element.props, "arrowSize", 20) }}>
              <button type="button" aria-label="Previous">‹</button>
              <button type="button" aria-label="Next">›</button>
            </div>
          ) : null}
          {nav === "both" || nav === "dots" ? (
            <div className="npb-carousel-dots" style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10 }}>
              {items(element.props, "images").slice(0, 5).map((_, index) => (
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
    render: ({ element }) => (
      <ul
        className={`npb-icon-list npb-icon-list-${value(element.props, "layout", "traditional")}`}
        style={{
          display: value(element.props, "layout") === "inline" ? "flex" : "grid",
          gap: numeric(element.props, "spaceBetween", 0),
          justifyContent: value(element.props, "align", "left") === "center" ? "center" : value(element.props, "align") === "right" ? "flex-end" : "flex-start",
          listStyle: "none",
          padding: 0,
          margin: 0,
          color: value(element.props, "textColor") || undefined,
          fontSize: numeric(element.props, "textSize", 14) || undefined,
        }}
      >
        {items(element.props, "items").map((item, index) => {
          const row = (
            <>
              <span style={{
                color: value(element.props, "iconColor") || undefined,
                fontSize: numeric(element.props, "iconSize", 14),
                marginInlineEnd: numeric(element.props, "iconGap", 5),
              }}
              >
                {value(item, "icon", "✓")}
              </span>
              <span>{value(item, "text")}</span>
            </>
          );
          return (
            <li
              key={`${value(item, "text")}-${index}`}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                borderBottom: element.props.divider
                  ? `${numeric(element.props, "dividerWeight", 1)}px ${value(element.props, "dividerStyle", "solid")} ${value(element.props, "dividerColor") || "#c2cbd2"}`
                  : undefined,
                paddingBottom: element.props.divider ? 8 : undefined,
              }}
            >
              {value(item, "url") ? <a href={value(item, "url")}>{row}</a> : row}
            </li>
          );
        })}
      </ul>
    ),
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
      const titleNode = (
        <Tag style={{
          color: value(element.props, "titleColor") || undefined,
          fontSize: numeric(element.props, "titleFontSize", 16) || undefined,
          marginBlock: numeric(element.props, "titleGap", 0) || undefined,
        }}
        >
          {value(element.props, "title")}
        </Tag>
      );
      const numberNode = (
        <strong style={{
          color: value(element.props, "numberColor") || undefined,
          fontSize: numeric(element.props, "numberFontSize", 48) || undefined,
          display: "inline-block",
          marginInline: numeric(element.props, "numberGap", 0) || undefined,
        }}
        >
          {value(element.props, "prefix")}{numeric(element.props, "end", 100)}{value(element.props, "suffix")}
        </strong>
      );
      const position = value(element.props, "titlePosition", "after");
      const before = position === "before" || position === "start";
      return (
        <div
          className="npb-counter"
          style={{
            textAlign: value(element.props, "numberAlign", "center") as "left" | "center" | "right",
            display: position === "start" || position === "end" ? "flex" : "block",
            alignItems: "center",
            justifyContent: value(element.props, "numberAlign") === "left" ? "flex-start" : value(element.props, "numberAlign") === "right" ? "flex-end" : "center",
            gap: numeric(element.props, "titleGap", 0),
            flexDirection: position === "end" ? "row-reverse" : "row",
          }}
        >
          {before ? titleNode : null}
          {numberNode}
          {!before ? titleNode : null}
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
      const barColor = value(element.props, "barColor") || typeColors[value(element.props, "progressType", "default")] || "#61ce70";
      return (
        <div className="npb-progress">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            {element.props.displayTitle !== false ? (
              <Tag style={{ color: value(element.props, "titleColor") || undefined }}>{value(element.props, "title")}</Tag>
            ) : <span />}
            {element.props.displayPercentage !== false ? (
              <span style={{ color: value(element.props, "percentageColor") || undefined }}>{numeric(element.props, "value", 50)}%</span>
            ) : null}
          </div>
          <div
            style={{
              position: "relative",
              height: numeric(element.props, "barHeight", 10),
              borderRadius: numeric(element.props, "borderRadius", 0),
              background: value(element.props, "barBackground") || "#eee",
              overflow: "hidden",
            }}
          >
            <i
              style={{
                display: "block",
                height: "100%",
                width: `${numeric(element.props, "value", 50)}%`,
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
      const rating = Math.min(numeric(element.props, "rating", 5), numeric(element.props, "scale", 5));
      const scale = numeric(element.props, "scale", 5);
      return (
        <span
          role="img"
          aria-label={value(element.props, "title", "Rating")}
          style={{
            display: "inline-flex",
            gap: 2,
            fontSize: numeric(element.props, "size", 20),
            justifyContent: value(element.props, "align") === "right" ? "flex-end" : value(element.props, "align") === "center" ? "center" : "flex-start",
            width: "100%",
          }}
        >
          <span style={{ color: value(element.props, "starColor") || "#f0ad4e" }}>{"★".repeat(rating)}</span>
          <span style={{ color: value(element.props, "unmarkedColor") || "#ccd6df" }}>{"★".repeat(Math.max(0, scale - rating))}</span>
        </span>
      );
    },
  },
  {
    type: "icon",
    label: "Icon",
    category: "General",
    icon: "★",
    defaultProps: { icon: "★", view: "default", shape: "circle", link: "", align: "center", size: 50, rotate: 0, padding: 0, fitToSize: false },
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
      const node = (
        <span
          className={`npb-icon npb-view-${view} npb-shape-${shape}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: numeric(element.props, "size", 50),
            padding: numeric(element.props, "padding", 0),
            color: view === "stacked" ? secondary : primary,
            background: view === "stacked" ? primary : undefined,
            border: view === "framed" ? `${numeric(element.props, "borderWidth", 2)}px solid ${primary}` : undefined,
            borderRadius: shape === "square" ? numeric(element.props, "borderRadius", 0) : "50%",
            transform: `rotate(${numeric(element.props, "rotate", 0)}deg)`,
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
        { key: "color", label: "Primary Color", type: "color" },
        { key: "secondaryColor", label: "Secondary Color", type: "color" },
      ], "style"),
    ],
    render: ({ element }) => (
      <div
        className={`npb-social npb-social-${value(element.props, "shape", "rounded")}`}
        style={{
          display: "grid",
          gridTemplateColumns: value(element.props, "columns") === "auto"
            ? "repeat(auto-fit, minmax(40px, max-content))"
            : `repeat(${Number(value(element.props, "columns", "auto")) || 3}, max-content)`,
          gap: numeric(element.props, "spacing", 5),
          justifyContent: value(element.props, "align") === "right" ? "flex-end" : value(element.props, "align") === "left" ? "flex-start" : "center",
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
              width: numeric(element.props, "size", 25) + numeric(element.props, "padding", 10) * 2,
              height: numeric(element.props, "size", 25) + numeric(element.props, "padding", 10) * 2,
              fontSize: numeric(element.props, "size", 25),
              color: value(element.props, "color") || "#fff",
              background: value(element.props, "secondaryColor") || "#4054b2",
              borderRadius: value(element.props, "shape") === "circle" ? "50%" : value(element.props, "shape") === "square" ? 0 : 6,
            }}
          >
            {value(item, "icon", "●")}
          </a>
        ))}
      </div>
    ),
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
    render: ({ element }) => (
      <div className="npb-accordion-widget" style={{ display: "grid", gap: numeric(element.props, "spaceBetween", 0) }}>
        {items(element.props, "items").map((item, index) => {
          const Tag = value(element.props, "titleTag", "div") as keyof JSX.IntrinsicElements;
          const state = value(element.props, "defaultState", "expanded_first");
          const open = state === "expanded_all" || (state === "expanded_first" && index === 0);
          return (
            <details
              key={`${value(item, "title")}-${index}`}
              open={open}
              style={{ background: value(element.props, "titleBackground") || undefined }}
            >
              <summary style={{
                display: "flex",
                flexDirection: value(element.props, "iconPosition") === "start" ? "row-reverse" : "row",
                justifyContent: "space-between",
                gap: 8,
                color: open
                  ? (value(element.props, "activeTitleColor") || value(element.props, "titleColor") || undefined)
                  : (value(element.props, "titleColor") || undefined),
                fontSize: numeric(element.props, "titleFontSize", 16) || undefined,
              }}
              >
                <Tag>{value(item, "title")}</Tag>
                <span style={{ fontSize: numeric(element.props, "iconSize", 14), color: value(element.props, "iconColor") || undefined }}>
                  {open ? value(element.props, "collapseIcon", "▲") : value(element.props, "expandIcon", "▼")}
                </span>
              </summary>
              <p style={{
                marginTop: numeric(element.props, "distanceFromContent", 0),
                color: value(element.props, "contentColor") || undefined,
                background: value(element.props, "contentBackground") || undefined,
                fontSize: numeric(element.props, "contentFontSize", 14) || undefined,
              }}
              >
                {value(item, "content")}
              </p>
            </details>
          );
        })}
      </div>
    ),
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
    render: ({ element }) => (
      <div className="npb-toggle" style={{ display: "grid", gap: numeric(element.props, "spaceBetween", 0) }}>
        {items(element.props, "items").map((item, index) => {
          const Tag = value(element.props, "titleTag", "div") as keyof JSX.IntrinsicElements;
          return (
            <details key={`${value(item, "title")}-${index}`}>
              <summary style={{ color: value(element.props, "titleColor") || undefined }}><Tag>{value(item, "title")}</Tag></summary>
              <p>{value(item, "content")}</p>
            </details>
          );
        })}
      </div>
    ),
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
      const vertical = value(element.props, "direction") === "vertical";
      return (
        <div
          className={`npb-tabs npb-tabs-${value(element.props, "direction", "horizontal")}`}
          style={{ display: "flex", flexDirection: vertical ? "row" : "column", gap: numeric(element.props, "titleSpacing", 10) }}
        >
          <div style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            gap: 8,
            justifyContent: value(element.props, "align") === "center" ? "center" : value(element.props, "align") === "end" ? "flex-end" : "flex-start",
          }}
          >
            {items(element.props, "items").map((item, index) => (
              <button
                key={`${value(item, "title")}-${index}`}
                type="button"
                style={{
                  color: index === 0
                    ? (value(element.props, "activeTitleColor") || "#4054b2")
                    : (value(element.props, "titleColor") || undefined),
                  border: 0,
                  background: "transparent",
                  borderBottom: !vertical && index === 0 ? "2px solid #4054b2" : undefined,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                {value(item, "title")}
              </button>
            ))}
          </div>
          <div style={{ color: value(element.props, "contentColor") || undefined, flex: 1 }}>
            {value(items(element.props, "items")[0] ?? {}, "content")}
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
      if (!src) return <div className="npb-placeholder">Add a SoundCloud link</div>;
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
        <iframe
          title="SoundCloud"
          loading="lazy"
          allow="autoplay"
          style={{ width: "100%", height: numeric(element.props, "height", 200), border: 0 }}
          src={`https://w.soundcloud.com/player/?${params.toString()}`}
        />
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
    render: ({ element }) => <form className="npb-form">{items(element.props, "fields").map((field, index) => <label key={`${value(field, "label")}-${index}`}>{value(field, "label")}<input type={value(field, "type", "text")} required={Boolean(field.required)} /></label>)}<button type="submit">{value(element.props, "buttonText", "Send")}</button></form>,
  },
  {
    type: "html",
    label: "HTML",
    category: "General",
    icon: "</>",
    defaultProps: { html: "<div class=\"example\">HTML Code</div>" },
    controls: [
      section("HTML Code", [
        { key: "html", label: "HTML Code", type: "textarea" },
      ], "content"),
    ],
    render: ({ element }) => <div className="npb-html" dangerouslySetInnerHTML={{ __html: value(element.props, "html") }} />,
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
    render: ({ element }) => <span id={value(element.props, "id", "anchor")} className="npb-anchor">Anchor: #{value(element.props, "id", "anchor")}</span>,
  },
  {
    type: "read-more",
    label: "Read More",
    category: "General",
    icon: "…",
    defaultProps: { text: "Continue reading", link: "#more" },
    controls: [
      section("Read More", [
        text("text", "Read More Text", "Continue reading"),
        { key: "link", label: "Link", type: "url" },
      ], "content"),
    ],
    render: ({ element }) => <a href={value(element.props, "link", "#more")}>{value(element.props, "text", "Continue reading")}</a>,
  },
  {
    type: "shortcode",
    label: "Shortcode",
    category: "WordPress",
    icon: "[]",
    defaultProps: { code: "[shortcode]" },
    controls: content([text("code", "Enter your shortcode", "[shortcode]")]),
    render: ({ element }) => <code>{value(element.props, "code", "[shortcode]")}</code>,
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
      const startOffset = value(element.props, "align", "center") === "start" ? "0%" : value(element.props, "align") === "end" ? "100%" : "50%";
      const anchor = value(element.props, "align", "center") === "start" ? "start" : value(element.props, "align") === "end" ? "end" : "middle";
      const textPath = <textPath href={`#${pathId}`} startOffset={startOffset} textAnchor={anchor}>{value(element.props, "text")}</textPath>;
      return <svg className="npb-text-path" viewBox="0 0 640 180" role="img" aria-label={value(element.props, "text")}><defs><path id={pathId} d={path} /></defs>{element.props.showPath ? <path d={path} fill="none" stroke="currentColor" opacity=".25" /> : null}<text fontSize="26" fontWeight="600">{value(element.props, "link") ? <a href={value(element.props, "link")}>{textPath}</a> : textPath}</text></svg>;
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
    render: ({ element }) => <img className="npb-image" src={value(element.props, "src")} alt={value(element.props, "alt")} />,
  },
  {
    type: "wp-video",
    label: "Video",
    category: "WordPress",
    icon: "▶",
    defaultProps: { src: "", poster: "", autoplay: false, loop: false },
    controls: [section("Content", [{ key: "src", label: "Video URL", type: "url" }, { key: "poster", label: "Poster", type: "image" }, { key: "autoplay", label: "Autoplay", type: "switch" }, { key: "loop", label: "Loop", type: "switch" }], "general"), section("Settings", [], "general")],
    render: ({ element }) => value(element.props, "src") ? <video className="npb-native-video" src={value(element.props, "src")} poster={value(element.props, "poster")} controls autoPlay={Boolean(element.props.autoplay)} loop={Boolean(element.props.loop)} /> : <div className="npb-placeholder">Add a video URL</div>,
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
