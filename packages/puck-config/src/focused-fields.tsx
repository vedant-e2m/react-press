import type { ReactNode } from "react";

export const LAYOUT_FIELD_KEYS = new Set<string>([
  "maxWidth",
  "marginTop",
  "marginBottom",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "offsetX",
  "offsetY",
  "className",
  "blockId",
  "borderRadius",
  "borderWidth",
  "borderColor",
]);

const BLOCK_SETTING_KEYS = new Set<string>([
  "theme",
  "alignment",
  "columns",
  "sticky",
  "variant",
  "rounded",
  "overlayOpacity",
  "fontSize",
  "padding",
  "height",
  "style",
  "objectFit",
  "minHeight",
  "width",
  "overlayColor",
]);

/**
 * Block-level colors that belong in the Colors section.
 * Per-element colors (titleColor, etc.) live under their element section instead.
 * highlightColor is intentionally excluded — it belongs with the Highlight element.
 */
const BLOCK_COLOR_KEYS = new Set<string>([
  "backgroundColor",
  "textColor",
  "accentColor",
  "linkColor",
  "buttonColor",
  "overlayColor",
]);

/** Maps anchor fields to related style/link fields not matched by camelCase prefixes. */
const ELEMENT_RELATED_FIELDS: Record<string, string[]> = {
  buttonLabel: ["buttonColor", "buttonTextColor", "buttonHref"],
  ctaLabel: ["ctaHref"],
  highlight: ["highlightColor"],
  titleHighlight: ["highlightColor", "titleHighlightColor"],
  brandLabel: ["textColor", "accentColor", "brandHref"],
  linkLabel: ["linkColor", "linkUrl"],
  label: ["backgroundColor", "textColor", "url", "width", "alignment"],
};

/** Human-readable labels for editable child elements. */
export const ELEMENT_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle",
  description: "Description",
  content: "Content",
  highlight: "Highlight",
  titleHighlight: "Highlight",
  titleSuffix: "Title suffix",
  buttonLabel: "Button",
  ctaLabel: "CTA",
  brandLabel: "Brand",
  linkLabel: "Link",
  label: "Label",
  copyright: "Copyright",
  personName: "Person name",
  personRole: "Person role",
};

export type SidebarSection = {
  id: string;
  title: string;
  description?: string;
  fieldNames: string[];
};

/** Strip inline suffix Puck adds for rich text fields. */
export function normalizeFocusedFieldName(focus: string | null | undefined): string | null {
  if (!focus) return null;
  return focus.replace(/::inline$/, "").split("[")[0]?.split(".")[0] ?? null;
}

function getCtaColorExtras(allKeys: string[]): string[] {
  if (allKeys.includes("buttonColor")) {
    return ["buttonColor", ...(allKeys.includes("buttonTextColor") ? ["buttonTextColor"] : [])];
  }
  if (allKeys.includes("linkColor") && allKeys.includes("accentColor")) {
    return ["linkColor"];
  }
  if (allKeys.includes("accentColor")) return ["accentColor"];
  if (allKeys.includes("linkColor")) return ["linkColor"];
  return [];
}

/** Longer element anchors that extend a shorter prefix (e.g. titleHighlight under title). */
function getLongerAnchors(focus: string, allKeys: string[]): string[] {
  return allKeys.filter((key) => {
    if (key === focus || key.length <= focus.length || !key.startsWith(focus)) return false;
    const suffix = key.slice(focus.length);
    if (!/^[A-Z]/.test(suffix)) return false;
    return key in ELEMENT_FIELD_LABELS;
  });
}

export function getRelatedFieldKeys(focus: string, allKeys: string[]): string[] {
  const longerAnchors = getLongerAnchors(focus, allKeys);

  const prefixMatches = allKeys.filter((key) => {
    if (key === focus) return false;
    if (!key.startsWith(focus)) return false;
    const suffix = key.slice(focus.length);
    if (suffix.length === 0 || !/^[A-Z]/.test(suffix)) return false;
    const ownedByLongerAnchor = longerAnchors.some(
      (anchor) => key === anchor || key.startsWith(anchor),
    );
    return !ownedByLongerAnchor;
  });

  let extras = ELEMENT_RELATED_FIELDS[focus] ?? [];
  if (focus === "ctaLabel") {
    extras = [...getCtaColorExtras(allKeys), "ctaHref"];
  }

  return [...new Set([...prefixMatches, ...extras])].filter((key) => allKeys.includes(key));
}

/** Find the element anchor when focus is on a related field (e.g. primaryCtaHref → primaryCtaLabel). */
export function resolveElementAnchor(focus: string, allKeys: string[]): string | null {
  if (getRelatedFieldKeys(focus, allKeys).length > 0) return focus;

  const reverseMatches: string[] = [];
  for (const key of allKeys) {
    if (getRelatedFieldKeys(key, allKeys).includes(focus)) {
      reverseMatches.push(key);
    }
  }
  if (reverseMatches.length > 0) {
    const preferred =
      reverseMatches.find((key) => key.endsWith("Label")) ??
      reverseMatches.find((key) => !key.includes("Color")) ??
      reverseMatches[0];
    return preferred ?? null;
  }

  for (const key of allKeys) {
    if (key === focus) continue;
    if (focus.startsWith(key) && /^[A-Z]/.test(focus.slice(key.length))) {
      return key;
    }
  }

  return null;
}

export function getElementGroupFieldNames(anchor: string, allKeys: string[]): string[] {
  return [anchor, ...getRelatedFieldKeys(anchor, allKeys)].filter((key) => allKeys.includes(key));
}

export function getElementFieldLabel(fieldName: string): string {
  return (
    ELEMENT_FIELD_LABELS[fieldName] ??
    fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim()
  );
}

function getElementAnchors(allKeys: string[]): string[] {
  const anchors = allKeys.filter((key) => {
    if (LAYOUT_FIELD_KEYS.has(key) || BLOCK_SETTING_KEYS.has(key)) return false;
    if (BLOCK_COLOR_KEYS.has(key)) return false;
    if (getRelatedFieldKeys(key, allKeys).length > 0) return true;
    return key in ELEMENT_FIELD_LABELS;
  });

  return [...new Set(anchors)];
}

function buildBlockLevelSections(unclaimed: string[]): SidebarSection[] {
  const content: string[] = [];
  const settings: string[] = [];
  const colors: string[] = [];
  const layout: string[] = [];

  for (const key of unclaimed) {
    if (LAYOUT_FIELD_KEYS.has(key)) {
      layout.push(key);
    } else if (BLOCK_COLOR_KEYS.has(key)) {
      colors.push(key);
    } else if (BLOCK_SETTING_KEYS.has(key)) {
      settings.push(key);
    } else {
      content.push(key);
    }
  }

  const sections: SidebarSection[] = [];
  if (content.length > 0) {
    sections.push({ id: "block-content", title: "Content", fieldNames: content });
  }
  if (settings.length > 0) {
    sections.push({ id: "block-settings", title: "Block settings", fieldNames: settings });
  }
  if (colors.length > 0) {
    sections.push({
      id: "block-colors",
      title: "Colors",
      description: "Block background and shared accents. Text colors are under each text element above.",
      fieldNames: colors,
    });
  }
  if (layout.length > 0) {
    sections.push({
      id: "block-layout",
      title: "Spacing & position",
      description: "Margin, padding, width, border, and position. Values apply as soon as you type.",
      fieldNames: layout,
    });
  }
  return sections;
}

/**
 * Organizes all block fields into sidebar sections: one collapsed section per editable
 * element, then block-level groups for everything else.
 */
export function buildSidebarSections(fieldNames: string[]): SidebarSection[] {
  const anchors = getElementAnchors(fieldNames);
  const claimed = new Set<string>();

  const elementSections: SidebarSection[] = anchors.map((anchor) => {
    const names = getElementGroupFieldNames(anchor, fieldNames);
    names.forEach((name) => claimed.add(name));
    return {
      id: `element-${anchor}`,
      title: getElementFieldLabel(anchor),
      fieldNames: names,
    };
  });

  const unclaimed = fieldNames.filter((name) => !claimed.has(name));
  return [...elementSections, ...buildBlockLevelSections(unclaimed)];
}

let suppressSelectionClear = 0;

type SetUiAction = { type: "setUi"; ui: object };

export function dispatchElementFocus<A extends SetUiAction>(
  dispatch: (action: A) => void,
  ui: object,
) {
  suppressSelectionClear += 1;
  dispatch({ type: "setUi", ui } as A);
  setTimeout(() => {
    suppressSelectionClear = Math.max(0, suppressSelectionClear - 1);
  }, 0);
}

export function shouldClearFocusOnSelectionChange(): boolean {
  return suppressSelectionClear === 0;
}

export function focusElementField<A extends SetUiAction>(
  dispatch: (action: A) => void,
  fieldName: string,
) {
  dispatchElementFocus(dispatch, { field: { focus: fieldName } });
}

export function clearElementFieldFocus<A extends SetUiAction>(dispatch: (action: A) => void) {
  dispatch({
    type: "setUi",
    ui: { field: { focus: null } },
  } as A);
}

export function CollapsibleFieldSection({
  title,
  description,
  children,
  open,
  onToggle,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <details
      open={open}
      className="group rounded-lg border border-zinc-200 bg-white"
      data-testid="field-section"
      data-section-title={title}
    >
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 marker:content-none [&::-webkit-details-marker]:hidden"
        onClick={(event) => {
          event.preventDefault();
          onToggle();
        }}
      >
        <span className="text-sm font-medium text-zinc-800">{title}</span>
        <span className="text-xs text-zinc-400 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="border-t border-zinc-100 px-3 py-3 max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain">
        {description ? (
          <p className="mb-3 text-xs leading-relaxed text-zinc-500">{description}</p>
        ) : null}
        <div className="space-y-3">{children}</div>
      </div>
    </details>
  );
}
