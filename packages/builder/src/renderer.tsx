import type { CSSProperties } from "react";
import type {
  BuilderDocument,
  BuilderElement,
  BuilderGlobalClass,
  BuilderStyleState,
  ResponsiveStyles,
} from "./types";
import { getBuilderWidget, spacerHeightRulesFor } from "./widgets";

const unitlessProperties = new Set([
  "fontWeight",
  "lineHeight",
  "opacity",
  "order",
  "zIndex",
  "flex",
  "flexGrow",
  "flexShrink",
]);

const styleStates: Array<{ state: BuilderStyleState; suffix: string }> = [
  { state: "normal", suffix: "" },
  { state: "hover", suffix: ":hover" },
  { state: "active", suffix: ":active" },
  { state: "focus", suffix: ":focus" },
];

function cssName(property: string): string {
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function safeCssValue(value: unknown): string | null {
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value !== "string" || /<\/style|javascript:/i.test(value)) {
    return null;
  }
  return value;
}

function serializeDeclarations(styles?: CSSProperties): string {
  if (!styles) {
    return "";
  }

  return Object.entries(styles)
    .map(([property, rawValue]) => {
      const value = safeCssValue(rawValue);
      if (value === null || value === "") {
        return "";
      }
      const suffix = typeof rawValue === "number" && !unitlessProperties.has(property) ? "px" : "";
      return `${cssName(property)}:${value}${suffix}`;
    })
    .filter(Boolean)
    .join(";");
}

function stateRules(selector: string, styles?: Partial<Record<BuilderStyleState, CSSProperties>>): string {
  return styleStates
    .map(({ state, suffix }) => {
      const declarations = serializeDeclarations(styles?.[state]);
      return declarations ? `${selector}${suffix}{${declarations}}` : "";
    })
    .join("");
}

const imageMediaStyleKeys = new Set([
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "objectFit",
  "borderRadius",
  "opacity",
  "boxShadow",
  "borderWidth",
  "borderColor",
  "borderStyle",
  "aspectRatio",
]);

function filterStyleRecord(
  styles: CSSProperties | undefined,
  keys: Set<string>,
  mode: "include" | "exclude",
): CSSProperties | undefined {
  if (!styles) {
    return undefined;
  }

  const entries = Object.entries(styles).filter(([property, rawValue]) => {
    if (rawValue === undefined || rawValue === "") {
      return false;
    }
    const included = keys.has(property);
    return mode === "include" ? included : !included;
  });

  return entries.length ? Object.fromEntries(entries) : undefined;
}

function filterResponsiveStyles(
  styles: ResponsiveStyles = {},
  keys: Set<string>,
  mode: "include" | "exclude",
): ResponsiveStyles {
  const filterBreakpoint = (
    breakpoint?: Partial<Record<BuilderStyleState, CSSProperties>>,
  ): Partial<Record<BuilderStyleState, CSSProperties>> | undefined => {
    if (!breakpoint) {
      return undefined;
    }

    const next: Partial<Record<BuilderStyleState, CSSProperties>> = {};
    for (const [state, stateStyles] of Object.entries(breakpoint)) {
      const filtered = filterStyleRecord(stateStyles, keys, mode);
      if (filtered) {
        next[state as BuilderStyleState] = filtered;
      }
    }

    return Object.keys(next).length ? next : undefined;
  };

  return {
    desktop: filterBreakpoint(styles.desktop),
    tablet: filterBreakpoint(styles.tablet),
    mobile: filterBreakpoint(styles.mobile),
  };
}

function imgMediaRule(id: string, imgClass: string, styles: ResponsiveStyles = {}): string {
  const selector = `[data-npb-id="${id}"] img.${imgClass}`;
  return [
    stateRules(selector, styles.desktop),
    `@media(max-width:1024px){${stateRules(selector, styles.tablet)}}`,
    `@media(max-width:767px){${stateRules(selector, styles.mobile)}}`,
  ].join("");
}

function imageMediaRule(id: string, styles: ResponsiveStyles = {}): string {
  return imgMediaRule(id, "npb-image", styles);
}

function svgMediaRule(id: string, styles: ResponsiveStyles = {}): string {
  return imgMediaRule(id, "npb-svg", styles);
}

function elementRule(id: string, styles: ResponsiveStyles = {}, advanced?: BuilderElement["advanced"]): string {
  const selector = `[data-npb-id="${id}"]`;
  const visibility = [
    advanced?.hideOnDesktop ? `${selector}{display:none!important}` : "",
    advanced?.hideOnTablet ? `@media(max-width:1024px){${selector}{display:none!important}}` : "",
    advanced?.hideOnMobile ? `@media(max-width:767px){${selector}{display:none!important}}` : "",
    advanced?.hideOnDesktop && !advanced.hideOnTablet
      ? `@media(max-width:1024px){${selector}{display:revert!important}}`
      : "",
    advanced?.hideOnDesktop && !advanced.hideOnMobile
      ? `@media(max-width:767px){${selector}{display:revert!important}}`
      : "",
  ].join("");

  return [
    stateRules(selector, styles.desktop),
    `@media(max-width:1024px){${stateRules(selector, styles.tablet)}}`,
    `@media(max-width:767px){${stateRules(selector, styles.mobile)}}`,
    visibility,
  ].join("");
}

function classRule(globalClass: BuilderGlobalClass): string {
  return elementRule(`class-${globalClass.id}`, globalClass.styles)
    .split(`[data-npb-id="class-${globalClass.id}"]`)
    .join(`.npb-class-${globalClass.id}`);
}

function collectRules(elements: BuilderElement[]): string {
  return elements
    .flatMap((element) => {
      const isImage = element.type === "image";
      const isSvg = element.type === "svg";
      const splitsImgStyles = isImage || isSvg;
      const hostStyles = splitsImgStyles
        ? filterResponsiveStyles(element.styles, imageMediaStyleKeys, "exclude")
        : element.styles;
      const imgStyles = splitsImgStyles
        ? filterResponsiveStyles(element.styles, imageMediaStyleKeys, "include")
        : undefined;

      return [
        elementRule(element.id, hostStyles, element.advanced),
        imgStyles
          ? isImage
            ? imageMediaRule(element.id, imgStyles)
            : svgMediaRule(element.id, imgStyles)
          : "",
        spacerHeightRulesFor(element),
        collectRules(element.children ?? []),
      ];
    })
    .join("");
}

function animationClass(element: BuilderElement): string {
  const animation = element.advanced?.entranceAnimation;
  if (!animation || animation === "none") {
    return "";
  }
  const duration = element.advanced?.animationDuration ?? "normal";
  return `npb-animate npb-animate-${animation} npb-animate-${duration}`;
}

function BuilderNode({ element }: { element: BuilderElement }) {
  const widget = getBuilderWidget(element.type);
  if (!widget) {
    return null;
  }

  const children = element.children?.map((child) => (
    <BuilderNode key={child.id} element={child} />
  ));
  const classNames = [
    ...(element.classes?.map((id) => `npb-class-${id}`) ?? []),
    element.advanced?.cssClasses,
    animationClass(element),
  ]
    .filter(Boolean)
    .join(" ");

  const hostProps = {
    id: element.advanced?.cssId || undefined,
    "data-npb-id": element.id,
    className: classNames || undefined,
    style: element.advanced?.animationDelay
      ? { animationDelay: `${element.advanced.animationDelay}ms` }
      : undefined,
  };

  if (widget.rendersAsHost) {
    return widget.render({ element, children, hostProps });
  }

  return (
    <div
      id={hostProps.id}
      data-npb-id={hostProps["data-npb-id"]}
      className={hostProps.className}
      style={hostProps.style}
    >
      {widget.render({ element, children })}
    </div>
  );
}

/** Renders a native NextPress builder document on the public site. */
export function BuilderRenderer({ document }: { document: BuilderDocument }) {
  const rules = [
    collectRules(document.content),
    document.globals.classes.map(classRule).join(""),
    document.settings.customCss ?? "",
  ].join("");

  return (
    <main
      className="npb-page"
      style={{
        backgroundColor: document.settings.backgroundColor,
        color: document.settings.textColor,
        width: "100%",
        maxWidth: "none",
        marginInline: "auto",
        ["--npb-content-width" as string]: document.settings.contentWidth
          ? `${document.settings.contentWidth}px`
          : undefined,
      }}
    >
      {rules ? <style>{rules}</style> : null}
      {document.content.map((element) => (
        <BuilderNode key={element.id} element={element} />
      ))}
    </main>
  );
}
