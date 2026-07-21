"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
} from "react";
import {
  addBuilderElement,
  cloneBuilderElement,
  createBuilderElement,
  duplicateBuilderElement,
  findBuilderElement,
  insertBuilderElementAfter,
  moveBuilderElement,
  removeBuilderElement,
  updateBuilderElement,
} from "./document";
import { BuilderRenderer } from "./renderer";
import type {
  BuilderBreakpoint,
  BuilderControl,
  BuilderControlSection,
  BuilderDocument,
  BuilderElement,
  BuilderElementAdvanced,
  BuilderStyleState,
  BuilderWidget,
  EntranceAnimation,
} from "./types";
import { builderWidgets, getBuilderWidget } from "./widgets";

type InspectorTab = "general" | "style" | "interactions";

type EditorIconName =
  | "logo"
  | "plus"
  | "sparkles"
  | "document"
  | "settings"
  | "history"
  | "droplet"
  | "undo"
  | "redo"
  | "desktop"
  | "tablet"
  | "mobile"
  | "rocket"
  | "bell"
  | "search"
  | "structure"
  | "preview"
  | "chevron";

function EditorIcon({ name, size = 16 }: { name: EditorIconName; size?: number }) {
  const paths: Record<EditorIconName, import("react").ReactNode> = {
    logo: <><path d="M4 3.5h16v17H4z" /><path d="M8 7v10M11.5 7h5M11.5 12h5M11.5 17h5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    sparkles: <><path d="m12 3 1.2 3.2L16.5 8l-3.3 1.8L12 13l-1.2-3.2L7.5 8l3.3-1.8L12 3Z" /><path d="m18.5 14 .8 2.1 2.2.9-2.2 1-.8 2-.8-2-2.2-1 2.2-.9.8-2.1Z" /><path d="m5 13 .7 1.8 1.8.7-1.8.8L5 18l-.7-1.7-1.8-.8 1.8-.7L5 13Z" /></>,
    document: <><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v4h4M9 11h6M9 15h6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    history: <><path d="M3.5 12a8.5 8.5 0 1 0 2-5.5L3 9" /><path d="M3 4v5h5M12 7v5l3 2" /></>,
    droplet: <path d="M12 2S6 9.1 6 14a6 6 0 0 0 12 0c0-4.9-6-12-6-12Z" />,
    undo: <path d="m9 7-5 5 5 5M5 12h8a6 6 0 0 1 6 6" />,
    redo: <path d="m15 7 5 5-5 5M19 12h-8a6 6 0 0 0-6 6" />,
    desktop: <><rect x="3" y="4" width="18" height="13" rx="1" /><path d="M8 21h8M12 17v4" /></>,
    tablet: <><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M10 18.5h4" /></>,
    mobile: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M10.5 5h3M11 19h2" /></>,
    rocket: <><path d="M14 5c2.5-2.5 5.5-2 5.5-2s.5 3-2 5.5l-5.3 5.3-4-4L14 5Z" /><path d="M8.2 9.8 5 10l-2 2 4.5 1M12.2 13.8 12 17l-2 2-1-4.5M14.8 7.2h.01" /><path d="M6 17c-1 0-2 1-2 3 2 0 3-1 3-2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 5 5" /></>,
    structure: <><rect x="4" y="3" width="16" height="5" rx="1" /><rect x="4" y="16" width="7" height="5" rx="1" /><rect x="13" y="16" width="7" height="5" rx="1" /><path d="M12 8v4M7.5 12h9M7.5 12v4M16.5 12v4" /></>,
    preview: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
  };
  return (
    <svg className="npb-editor-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</g>
    </svg>
  );
}

function controlTabMatches(sectionTab: BuilderControlSection["tab"] | undefined, inspectorTab: InspectorTab): boolean {
  const tab = sectionTab ?? "content";
  if (inspectorTab === "general") {
    return tab === "content" || tab === "general";
  }
  if (inspectorTab === "interactions") {
    return tab === "advanced" || tab === "interactions";
  }
  return tab === "style";
}

function inspectorTabLabels(category: BuilderWidget["category"] | undefined): Array<[InspectorTab, string]> {
  if (category === "Atomic") {
    return [
      ["general", "General"],
      ["style", "Style"],
      ["interactions", "Interactions"],
    ];
  }
  return [
    ["general", "Content"],
    ["style", "Style"],
    ["interactions", "Advanced"],
  ];
}

function ProCrown() {
  return (
    <svg className="npb-crown" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 7l4 4 5-6 5 6 4-4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      />
    </svg>
  );
}

function AccordionSection({
  title,
  defaultOpen = false,
  pro = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  pro?: boolean;
  children: import("react").ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`npb-accordion${open ? " open" : ""}`}>
      <button type="button" className="npb-accordion-toggle" onClick={() => setOpen((value) => !value)}>
        <span>{title}</span>
        <span className="npb-accordion-meta">
          {pro ? <ProCrown /> : null}
          <span className={`npb-accordion-chevron${open ? " open" : ""}`}>⌄</span>
        </span>
      </button>
      {open ? <div className="npb-accordion-body">{children}</div> : null}
    </section>
  );
}

function ClassesField({
  classes,
  cssClasses,
  onChange,
}: {
  classes: string[];
  cssClasses?: string;
  onChange(next: { classes: string[]; cssClasses: string }): void;
}) {
  const [draft, setDraft] = useState("");
  const chips = [
    ...classes.map((id) => ({ id, label: id, kind: "global" as const })),
    ...(cssClasses ? cssClasses.split(/\s+/).filter(Boolean).map((name) => ({ id: name, label: name, kind: "local" as const })) : []),
  ];
  const displayChips = chips.length
    ? chips
    : [{ id: "local", label: "local", kind: "local" as const }];

  const addClass = () => {
    const name = draft.trim();
    if (!name) return;
    onChange({
      classes,
      cssClasses: [cssClasses, name].filter(Boolean).join(" ").trim(),
    });
    setDraft("");
  };

  return (
    <div className="npb-classes-field">
      <div className="npb-classes-head">
        <span className="npb-field-label">Classes</span>
        <button type="button" className="npb-icon-button" aria-label="Manage classes">⌸</button>
      </div>
      <div className="npb-classes-input">
        {displayChips.map((chip) => (
          <span key={`${chip.kind}-${chip.id}`} className={`npb-class-chip npb-class-chip-${chip.kind}`}>
            <span className="npb-class-chip-icon" aria-hidden="true">{chip.kind === "local" ? "⌖" : "◆"}</span>
            {chip.label}
            <span className="npb-class-chip-menu" aria-hidden="true">⋮</span>
          </span>
        ))}
        <input
          placeholder="Type class name"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addClass();
            }
          }}
        />
      </div>
    </div>
  );
}

interface BuilderEditorProps {
  document: BuilderDocument;
  title: string;
  status: string;
  onSave(document: BuilderDocument): Promise<void>;
  onPublish?(document: BuilderDocument): Promise<void>;
  templates?: BuilderTemplate[];
  onSaveTemplate?(name: string, document: BuilderDocument): Promise<void>;
  backHref?: string;
}

export interface BuilderTemplate {
  id: string;
  name: string;
  kind: "section" | "page";
  document: BuilderDocument;
}

interface HistoryState {
  past: BuilderDocument[];
  present: BuilderDocument;
  future: BuilderDocument[];
}

const viewportWidths: Record<BuilderBreakpoint, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 390,
};

function Control({
  control,
  value,
  onChange,
  layout = "stack",
}: {
  control: BuilderControl;
  value: unknown;
  onChange(value: unknown): void;
  layout?: "stack" | "row";
}) {
  const id = `npb-control-${control.key}`;
  const common = { id, value: String(value ?? control.defaultValue ?? "") };
  const row = layout === "row";

  if (control.type === "switch") {
    return (
      <label className="npb-control npb-control-switch npb-control-row">
        <span>{control.label}</span>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
      </label>
    );
  }

  if (control.type === "url" && row) {
    const open = Boolean(value);
    return (
      <div className="npb-control npb-control-row">
        <span>{control.label}</span>
        {open ? (
          <input
            id={id}
            type="url"
            value={String(value ?? "")}
            placeholder="https://"
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <button type="button" className="npb-icon-button" aria-label={`Add ${control.label}`} onClick={() => onChange("#")}>+</button>
        )}
      </div>
    );
  }

  if (control.type === "select") {
    return (
      <label className={`npb-control${row ? " npb-control-row" : ""}`}>
        <span>{control.label}</span>
        <select {...common} onChange={(event) => onChange(event.target.value)}>
          {control.options?.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (control.type === "choices") {
    const current = String(value ?? control.defaultValue ?? "");
    return (
      <div className="npb-control npb-control-row">
        <span>{control.label}</span>
        <div className="npb-choices" role="group" aria-label={control.label}>
          {control.options?.map((option) => (
            <button
              key={option.value}
              type="button"
              className={current === option.value ? "active" : ""}
              title={option.label}
              aria-label={option.label}
              onClick={() => onChange(option.value)}
            >
              {option.icon ?? option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (control.type === "repeater") {
    const rows = Array.isArray(value) ? (value as Array<Record<string, unknown>>) : [];
    return (
      <div className="npb-control npb-repeater">
        <div className="npb-repeater-head">
          <span>{control.label}</span>
          <button
            type="button"
            className="npb-icon-button"
            onClick={() => onChange([...rows, {
              title: `Item #${rows.length + 1}`,
              text: `List Item #${rows.length + 1}`,
              content: "Add item content.",
              icon: "✓",
              url: "",
              src: "",
              alt: "",
              network: "Facebook",
            }])}
          >
            + Add Item
          </button>
        </div>
        {rows.map((row, index) => (
          <div key={index} className="npb-repeater-item">
            <div className="npb-repeater-item-head">
              <strong>{String(row.title ?? row.text ?? row.network ?? `Item #${index + 1}`)}</strong>
              <button
                type="button"
                className="npb-icon-button"
                aria-label="Remove item"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
            {("title" in row || "text" in row || true) ? (
              <label className="npb-control npb-control-row">
                <span>{("text" in row && !("title" in row)) ? "Text" : "Title"}</span>
                <input
                  value={String(row.title ?? row.text ?? "")}
                  onChange={(event) => {
                    const next = [...rows];
                    const key = "title" in row || !("text" in row) ? "title" : "text";
                    next[index] = { ...row, [key]: event.target.value };
                    if (key === "title" && "text" in row) next[index] = { ...next[index], text: event.target.value };
                    onChange(next);
                  }}
                />
              </label>
            ) : null}
            {"content" in row || control.key === "items" ? (
              <label className="npb-control">
                <span>Content</span>
                <textarea
                  rows={3}
                  value={String(row.content ?? "")}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, content: event.target.value };
                    onChange(next);
                  }}
                />
              </label>
            ) : null}
            {"icon" in row ? (
              <label className="npb-control npb-control-row">
                <span>Icon</span>
                <input
                  value={String(row.icon ?? "")}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, icon: event.target.value };
                    onChange(next);
                  }}
                />
              </label>
            ) : null}
            {"url" in row || "link" in row ? (
              <label className="npb-control npb-control-row">
                <span>Link</span>
                <input
                  type="url"
                  value={String(row.url ?? row.link ?? "")}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, url: event.target.value };
                    onChange(next);
                  }}
                />
              </label>
            ) : null}
            {"network" in row ? (
              <label className="npb-control npb-control-row">
                <span>Network</span>
                <input
                  value={String(row.network ?? "")}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, network: event.target.value };
                    onChange(next);
                  }}
                />
              </label>
            ) : null}
            {"src" in row ? (
              <label className="npb-control npb-control-row">
                <span>Image</span>
                <input
                  type="url"
                  value={String(row.src ?? "")}
                  onChange={(event) => {
                    const next = [...rows];
                    next[index] = { ...row, src: event.target.value };
                    onChange(next);
                  }}
                />
              </label>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (control.type === "textarea" || control.type === "richtext") {
    return (
      <label className="npb-control">
        <span>{control.label}</span>
        <textarea
          id={id}
          value={String(value ?? control.defaultValue ?? "")}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  if (control.type === "range") {
    const rangeValue = typeof value === "number" ? value : Number(control.defaultValue ?? 0);
    return (
      <label className="npb-control">
        <span>{control.label} <output>{rangeValue}</output></span>
        <input
          id={id}
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={rangeValue}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
    );
  }

  const inputType = control.type === "number"
    ? "number"
    : control.type === "color"
      ? "color"
      : control.type === "url" || control.type === "image"
        ? "url"
        : "text";

  return (
    <label className={`npb-control${row ? " npb-control-row" : ""}`}>
      <span>{control.label}</span>
      <input
        {...common}
        type={inputType}
        min={control.min}
        max={control.max}
        step={control.step}
        onChange={(event) =>
          onChange(control.type === "number" ? Number(event.target.value) : event.target.value)
        }
      />
    </label>
  );
}

function parseUnitValue(raw: unknown): string {
  if (raw === undefined || raw === null || raw === "") return "";
  return String(raw).replace(/px$/i, "");
}

function SpacingBox({
  label,
  values,
  onChange,
}: {
  label: string;
  values: { top?: unknown; right?: unknown; bottom?: unknown; left?: unknown };
  onChange(side: "top" | "right" | "bottom" | "left", value: string): void;
}) {
  const [linked, setLinked] = useState(true);
  const sides = [
    ["top", "Top"],
    ["right", "Right"],
    ["bottom", "Bottom"],
    ["left", "Left"],
  ] as const;

  return (
    <div className="npb-spacing-box">
      <div className="npb-spacing-head">
        <span>{label}</span>
        <button
          type="button"
          className={`npb-link-toggle${linked ? " active" : ""}`}
          aria-label={linked ? "Unlink values" : "Link values"}
          onClick={() => setLinked((value) => !value)}
        >
          ⛓
        </button>
      </div>
      <div className="npb-spacing-grid">
        {sides.map(([side, sideLabel]) => (
          <label key={side} className="npb-spacing-cell">
            <span className="npb-spacing-side">{sideLabel}</span>
            <input
              inputMode="numeric"
              value={parseUnitValue(values[side])}
              placeholder=""
              onChange={(event) => {
                const next = event.target.value;
                if (linked) {
                  onChange("top", next);
                  onChange("right", next);
                  onChange("bottom", next);
                  onChange("left", next);
                } else {
                  onChange(side, next);
                }
              }}
            />
            <span className="npb-unit">PX</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function TypographyStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="npb-typography">
      <label className="npb-control">
        <span>Font family</span>
        <select
          value={String(styles.fontFamily ?? "")}
          onChange={(event) => onChange("fontFamily", event.target.value)}
        >
          <option value="">Default</option>
          <option value="Roboto, sans-serif">Roboto</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Arial, sans-serif">Arial</option>
        </select>
      </label>
      <label className="npb-control">
        <span>Font weight</span>
        <select
          value={String(styles.fontWeight ?? "")}
          onChange={(event) => onChange("fontWeight", event.target.value)}
        >
          <option value="">Default</option>
          {["100", "200", "300", "400", "500", "600", "700", "800", "900"].map((weight) => (
            <option key={weight} value={weight}>{weight}</option>
          ))}
        </select>
      </label>
      <label className="npb-control npb-control-unit">
        <span>Font size</span>
        <div className="npb-unit-input">
          <input
            type="number"
            value={parseUnitValue(styles.fontSize)}
            onChange={(event) => onChange("fontSize", event.target.value ? Number(event.target.value) : "")}
          />
          <span className="npb-unit">PX</span>
        </div>
      </label>
      <div className="npb-control">
        <span>Text align</span>
        <div className="npb-align-group">
          {([
            ["left", "⬅"],
            ["center", "☰"],
            ["right", "➡"],
            ["justify", "☰"],
          ] as const).map(([align, icon]) => (
            <button
              key={align}
              type="button"
              className={styles.textAlign === align ? "active" : ""}
              onClick={() => onChange("textAlign", align)}
              title={align}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <label className="npb-control npb-control-color-row">
        <span>Text color</span>
        <div className="npb-color-input">
          <input
            type="color"
            value={String(styles.color ?? "#000000")}
            onChange={(event) => onChange("color", event.target.value)}
          />
          <input
            type="text"
            value={String(styles.color ?? "")}
            placeholder=""
            onChange={(event) => onChange("color", event.target.value)}
          />
        </div>
      </label>
      {showMore ? (
        <>
          <label className="npb-control npb-control-unit">
            <span>Line height</span>
            <div className="npb-unit-input">
              <input
                type="number"
                value={parseUnitValue(styles.lineHeight)}
                onChange={(event) => onChange("lineHeight", event.target.value ? Number(event.target.value) : "")}
              />
              <span className="npb-unit">PX</span>
            </div>
          </label>
          <label className="npb-control npb-control-unit">
            <span>Letter spacing</span>
            <div className="npb-unit-input">
              <input
                type="number"
                value={parseUnitValue(styles.letterSpacing)}
                onChange={(event) => onChange("letterSpacing", event.target.value ? Number(event.target.value) : "")}
              />
              <span className="npb-unit">PX</span>
            </div>
          </label>
          <label className="npb-control npb-control-unit">
            <span>Word spacing</span>
            <div className="npb-unit-input">
              <input type="number" value={parseUnitValue(styles.wordSpacing)} onChange={(event) => onChange("wordSpacing", event.target.value ? Number(event.target.value) : "")} />
              <span className="npb-unit">PX</span>
            </div>
          </label>
          <label className="npb-control npb-control-row"><span>Text transform</span><select value={String(styles.textTransform ?? "none")} onChange={(event) => onChange("textTransform", event.target.value)}><option value="none">Default</option><option value="uppercase">Uppercase</option><option value="lowercase">Lowercase</option><option value="capitalize">Capitalize</option></select></label>
          <label className="npb-control npb-control-row"><span>Text decoration</span><select value={String(styles.textDecoration ?? "none")} onChange={(event) => onChange("textDecoration", event.target.value)}><option value="none">None</option><option value="underline">Underline</option><option value="line-through">Line through</option></select></label>
          <label className="npb-control npb-control-row"><span>Font style</span><select value={String(styles.fontStyle ?? "normal")} onChange={(event) => onChange("fontStyle", event.target.value)}><option value="normal">Normal</option><option value="italic">Italic</option></select></label>
        </>
      ) : null}
      <button type="button" className="npb-show-more" onClick={() => setShowMore((value) => !value)}>
        {showMore ? "Show less" : "Show more"} <span>⌄</span>
      </button>
    </div>
  );
}

function StyleControl({
  label,
  property,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  property: keyof CSSProperties;
  value: unknown;
  type?: "text" | "number" | "color";
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  if (type === "color") {
    return (
      <label className="npb-control npb-control-color-row">
        <span>{label}</span>
        <div className="npb-color-input">
          <input
            type="color"
            value={String(value ?? "#000000")}
            onChange={(event) => onChange(property, event.target.value)}
          />
          <input
            type="text"
            value={String(value ?? "")}
            onChange={(event) => onChange(property, event.target.value)}
          />
        </div>
      </label>
    );
  }

  return (
    <label className="npb-control npb-control-row">
      <span>{label}</span>
      <input
        type={type}
        value={String(value ?? "")}
        onChange={(event) =>
          onChange(property, type === "number" ? Number(event.target.value) : event.target.value)
        }
      />
    </label>
  );
}

function ElementTree({
  elements,
  selectedId,
  onSelect,
  depth = 0,
}: {
  elements: BuilderElement[];
  selectedId: string | null;
  onSelect(id: string): void;
  depth?: number;
}) {
  return elements.map((element) => (
    <div key={element.id}>
      <button
        type="button"
        className={element.id === selectedId ? "selected" : ""}
        style={{ paddingLeft: 12 + depth * 14 }}
        onClick={() => onSelect(element.id)}
      >
        {getBuilderWidget(element.type)?.icon} {getBuilderWidget(element.type)?.label ?? element.type}
      </button>
      {element.children?.length ? (
        <ElementTree
          elements={element.children}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ) : null}
    </div>
  ));
}

function EditorElement({
  element,
  selectedId,
  breakpoint,
  onSelect,
  onAdd,
  onMove,
  onAddAfter,
  onDelete,
  onEmptyAdd,
  onContextMenu,
}: {
  element: BuilderElement;
  selectedId: string | null;
  breakpoint: BuilderBreakpoint;
  onSelect(id: string): void;
  onAdd(type: string, parentId?: string): void;
  onMove(id: string, parentId?: string): void;
  onAddAfter(id: string): void;
  onDelete(id: string): void;
  onEmptyAdd(id: string): void;
  onContextMenu(id: string, x: number, y: number): void;
}) {
  const widget = getBuilderWidget(element.type);
  if (!widget) {
    return null;
  }
  const styles = {
    ...(element.styles?.desktop?.normal ?? {}),
    ...(breakpoint !== "desktop" ? element.styles?.[breakpoint]?.normal ?? {} : {}),
  };
  const children = element.children?.map((child) => (
    <EditorElement
      key={child.id}
      element={child}
      selectedId={selectedId}
      breakpoint={breakpoint}
      onSelect={onSelect}
      onAdd={onAdd}
      onMove={onMove}
      onAddAfter={onAddAfter}
      onDelete={onDelete}
      onEmptyAdd={onEmptyAdd}
      onContextMenu={onContextMenu}
    />
  ));
  const isContainer = Boolean(widget.acceptsChildren);

  return (
    <div
      className={`npb-editor-element${selectedId === element.id ? " selected" : ""}${isContainer ? " npb-editor-container" : " npb-editor-widget"}`}
      style={styles}
      draggable
      onDragStart={(event) => {
        event.stopPropagation();
        event.dataTransfer.setData("application/x-npb-element", element.id);
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(element.id);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(element.id);
        onContextMenu(element.id, event.clientX, event.clientY);
      }}
      onDragOver={isContainer ? (event) => event.preventDefault() : undefined}
      onDrop={isContainer ? (event) => {
        event.preventDefault();
        event.stopPropagation();
        const type = event.dataTransfer.getData("application/x-npb-widget");
        const existingId = event.dataTransfer.getData("application/x-npb-element");
        if (type) onAdd(type, element.id);
        if (existingId) onMove(existingId, element.id);
      } : undefined}
    >
      <ul
        className={`npb-element-settings${isContainer ? " npb-element-settings-container" : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        {isContainer ? (
          <>
            <li>
              <button
                type="button"
                title={`Add ${widget.label}`}
                aria-label={`Add ${widget.label}`}
                onClick={() => onAddAfter(element.id)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path fill="currentColor" d="M5.25 5.25V1h1.5v4.25H11v1.5H6.75V11h-1.5V6.75H1v-1.5z" /></svg>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="npb-element-drag"
                title={`Edit ${widget.label}`}
                aria-label={`Edit ${widget.label}`}
                onClick={() => onSelect(element.id)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><g fill="currentColor"><circle cx="3.5" cy="2" r="1.15" /><circle cx="8.5" cy="2" r="1.15" /><circle cx="3.5" cy="6" r="1.15" /><circle cx="8.5" cy="6" r="1.15" /><circle cx="3.5" cy="10" r="1.15" /><circle cx="8.5" cy="10" r="1.15" /></g></svg>
              </button>
            </li>
            <li>
              <button
                type="button"
                title={`Delete ${widget.label}`}
                aria-label={`Delete ${widget.label}`}
                onClick={() => onDelete(element.id)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path fill="currentColor" d="M2.05 1 6 4.94 9.95 1 11 2.06 7.06 6 11 9.94 9.95 11 6 7.06 2.05 11 1 9.94 4.94 6 1 2.06z" /></svg>
              </button>
            </li>
          </>
        ) : (
          <li>
            <button
              type="button"
              title={`Edit ${widget.label}`}
              aria-label={`Edit ${widget.label}`}
              onClick={() => onSelect(element.id)}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M11.9 1.2a1.7 1.7 0 0 1 2.4 0l.5.5a1.7 1.7 0 0 1 0 2.4L6.6 12.3l-3.5 1 1-3.5zM10.9 3.6l1.5 1.5 1.2-1.2-1.5-1.5z" /></svg>
            </button>
          </li>
        )}
      </ul>
      {widget.render({ element, children })}
      {isContainer && !element.children?.length ? (
        <div
          className="npb-empty-view"
          onClick={(event) => {
            event.stopPropagation();
            onEmptyAdd(element.id);
          }}
        >
          <button type="button" aria-label="Add element">+</button>
          <span>Drag widget here</span>
        </div>
      ) : null}
    </div>
  );
}

interface ContextMenuItem {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  pro?: boolean;
  separatorBefore?: boolean;
  onSelect?(): void;
}

function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose(): void;
}) {
  useEffect(() => {
    const close = () => onClose();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("click", close);
    window.addEventListener("contextmenu", close);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("contextmenu", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const style: CSSProperties = {
    left: Math.min(x, typeof window !== "undefined" ? window.innerWidth - 220 : x),
    top: Math.min(y, typeof window !== "undefined" ? window.innerHeight - items.length * 30 - 40 : y),
  };

  return (
    <div className="npb-context-menu" style={style} onClick={(event) => event.stopPropagation()}>
      {items.map((item) => (
        <div key={item.label} className="npb-context-menu-group">
          {item.separatorBefore ? <hr /> : null}
          <button
            type="button"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.onSelect?.();
              onClose();
            }}
          >
            <span>{item.label}{item.pro ? <ProCrown /> : null}</span>
            {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
          </button>
        </div>
      ))}
    </div>
  );
}

interface StructurePreset {
  id: string;
  label: string;
  arrow?: "column" | "row";
  columns?: number[];
  grid?: [number, number];
}

const structurePresets: StructurePreset[] = [
  { id: "c100", label: "Direction Column", arrow: "column" },
  { id: "r100", label: "Direction Row", arrow: "row" },
  { id: "50-50", label: "2 Columns", columns: [50, 50] },
  { id: "33-33-33", label: "3 Columns", columns: [33.33, 33.33, 33.33] },
  { id: "25-25-25-25", label: "4 Columns", columns: [25, 25, 25, 25] },
  { id: "66-33", label: "Two thirds, one third", columns: [66.66, 33.33] },
  { id: "33-66", label: "One third, two thirds", columns: [33.33, 66.66] },
  { id: "grid-2x2", label: "Grid 2 by 2", grid: [2, 2] },
];

function PresetPreview({ preset }: { preset: StructurePreset }) {
  const GAP = 2;
  if (preset.arrow) {
    return (
      <svg viewBox="0 0 89 44" aria-hidden="true">
        <rect width="89" height="44" className="npb-preset-bg" />
        <path
          className="npb-preset-glyph"
          d={preset.arrow === "column"
            ? "M44.5 14v13m0 0-5-5m5 5 5-5"
            : "M36 22h17m0 0-5-5m5 5-5 5"}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (preset.grid) {
    const [cols, rows] = preset.grid;
    const cellWidth = (89 - GAP * (cols - 1)) / cols;
    const cellHeight = (44 - GAP * (rows - 1)) / rows;
    return (
      <svg viewBox="0 0 89 44" aria-hidden="true">
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              className="npb-preset-cell"
              x={col * (cellWidth + GAP)}
              y={row * (cellHeight + GAP)}
              width={cellWidth}
              height={cellHeight}
            />
          )),
        )}
      </svg>
    );
  }
  const widths = preset.columns ?? [];
  const totalGap = GAP * (widths.length - 1);
  let offset = 0;
  return (
    <svg viewBox="0 0 89 44" aria-hidden="true">
      {widths.map((width, index) => {
        const cellWidth = ((89 - totalGap) * width) / 100;
        const x = offset;
        offset += cellWidth + GAP;
        return <rect key={index} className="npb-preset-cell" x={x} y="0" width={cellWidth} height="44" />;
      })}
    </svg>
  );
}

/** Builds the element tree for one "Select your Structure" preset. */
export function createStructureElement(preset: StructurePreset): BuilderElement {
  if (preset.grid) {
    const [columns, rows] = preset.grid;
    const grid = createBuilderElement("grid");
    grid.props = { ...grid.props, columns, rows };
    grid.children = Array.from({ length: columns * rows }, () => createBuilderElement("div-block"));
    return grid;
  }
  const container = createBuilderElement("flexbox");
  if (preset.arrow === "row") {
    container.props = { ...container.props, direction: "row" };
  }
  if (preset.columns) {
    container.props = { ...container.props, direction: "row" };
    container.children = preset.columns.map((width) => {
      const column = createBuilderElement("flexbox");
      column.styles = { desktop: { normal: { width: `${width}%` } } };
      return column;
    });
  }
  return container;
}

function AddSectionArea({
  onAddPreset,
  onDropWidget,
}: {
  onAddPreset(preset: StructurePreset): void;
  onDropWidget(type: string): void;
}) {
  const [picking, setPicking] = useState(false);

  if (picking) {
    return (
      <div className="npb-select-preset">
        <button type="button" className="npb-select-preset-close" aria-label="Close" onClick={() => setPicking(false)}>×</button>
        <div className="npb-select-preset-title">Select your Structure</div>
        <div className="npb-select-preset-list">
          {structurePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() => {
                onAddPreset(preset);
                setPicking(false);
              }}
            >
              <PresetPreview preset={preset} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="npb-add-section"
      role="button"
      tabIndex={0}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const type = event.dataTransfer.getData("application/x-npb-widget");
        if (type) onDropWidget(type);
      }}
    >
      <button type="button" className="npb-add-section-button" aria-label="Add new container" onClick={() => setPicking(true)}>+</button>
      <div className="npb-add-section-title">Drag widget here</div>
    </div>
  );
}

function WidgetLibrary({ onAdd }: { onAdd(type: string): void }) {
  const [search, setSearch] = useState("");
  const [libraryTab, setLibraryTab] = useState<"widgets" | "components" | "globals">("widgets");
  const matchingWidgets = builderWidgets.filter((widget) =>
    widget.label.toLowerCase().includes(search.toLowerCase()),
  );

  const proWidgets = [
    "Search", "Posts", "Portfolio", "Menu", "Form", "Loop Grid", "Loop Carousel", "Gallery",
    "Animated Headline", "Price List", "Price Table", "Flip Box", "Call to Action", "Media Carousel",
    "Carousel", "Off-Canvas", "Countdown", "Share Buttons", "Blockquote", "Lottie", "Hotspot",
    "PayPal Button", "Code Highlight", "Video Playlist", "Template", "Stripe Button", "Progress Tracker",
    "Nav Menu", "Table of Contents", "Login", "Slides", "Testimonial Carousel", "Reviews",
    "Facebook Button", "Facebook Comments", "Facebook Embed", "Facebook Page",
  ];
  const librarySections: Array<{
    title: string;
    categories?: BuilderWidget["category"][];
    lockedWidgets?: string[];
  }> = [
    { title: "Atomic Elements", categories: ["Atomic"] },
    { title: "Atomic Form", lockedWidgets: ["Atomic Form", "Input", "Label", "Text area", "Submit button", "Checkbox"] },
    { title: "Layout", categories: ["Layout"] },
    { title: "Basic", categories: ["Basic"] },
    { title: "Pro", lockedWidgets: proWidgets },
    { title: "General", categories: ["General", "Media", "Interactive"] },
    { title: "Link In Bio", categories: ["Link In Bio"] },
    { title: "WordPress", categories: ["WordPress"] },
  ];

  return (
    <>
      <div className="npb-elements-title">Elements</div>
      <div className="npb-panel-tabs">
        {(["widgets", "components", "globals"] as const).map((item) => (
          <button key={item} type="button" className={libraryTab === item ? "active" : ""} onClick={() => setLibraryTab(item)}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      {libraryTab === "widgets" ? (
        <>
          <div className="npb-search">
            <span className="npb-search-icon" aria-hidden="true">⌕</span>
            <input
              aria-label="Search widgets"
              placeholder="Search Widget..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="npb-widget-library">
            {librarySections.map(({ title, categories, lockedWidgets }) => {
              const sectionWidgets = categories ? matchingWidgets.filter((widget) => categories.includes(widget.category)) : [];
              const matchingLocked = (lockedWidgets ?? []).filter((label) => label.toLowerCase().includes(search.toLowerCase()));
              if (!sectionWidgets.length && !matchingLocked.length) return null;
              return (
                <section key={title}>
                  <h3>
                    <span>{title}</span>
                    {title === "Atomic Elements" ? <span className="npb-new-badge">New</span> : null}
                    {lockedWidgets ? <span className="npb-section-upgrade"><ProCrown /> Upgrade</span> : null}
                  </h3>
                  <div className="npb-widget-grid">
                    {sectionWidgets.map((widget) => (
                      <button
                        key={widget.type}
                        type="button"
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("application/x-npb-widget", widget.type)}
                        onClick={() => onAdd(widget.type)}
                      >
                        {widget.category === "Atomic" ? <i className="npb-atomic-mark" aria-hidden="true" /> : null}
                        <b>{widget.icon}</b>
                        <span>{widget.label}</span>
                      </button>
                    ))}
                    {matchingLocked.map((label) => (
                      <button key={label} type="button" className="npb-locked-widget" title={`${label} — Elementor Pro`} disabled>
                        <i className="npb-widget-lock"><ProCrown /></i>
                        <b>{label === "Form" || label.includes("Button") ? "▣" : "◇"}</b>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <p className="npb-panel-empty">{libraryTab === "components" ? "Components panel" : "Globals panel"} — coming soon</p>
      )}
      <div className="npb-panel-footer">
        <ProCrown /> Access all Pro widgets. <a href="#">Upgrade Now</a>
      </div>
    </>
  );
}

function DocumentSettings({
  document,
  onChange,
  onBack,
}: {
  document: BuilderDocument;
  onChange(document: BuilderDocument): void;
  onBack(): void;
}) {
  const [settingsTab, setSettingsTab] = useState<"settings" | "style" | "advanced">("settings");
  const setSetting = (key: keyof BuilderDocument["settings"], value: string | number) => {
    onChange({ ...document, settings: { ...document.settings, [key]: value } });
  };
  const setGlobal = (group: "colors" | "fonts", key: string, value: string) => {
    onChange({
      ...document,
      globals: {
        ...document.globals,
        [group]: { ...document.globals[group], [key]: value },
      },
    });
  };

  return (
    <>
      <div className="npb-panel-heading">
        <strong>Page Settings</strong>
        <button type="button" className="npb-panel-close" onClick={onBack} aria-label="Close Page Settings">×</button>
      </div>
      <div className="npb-inspector-tabs">
        {(["settings", "style", "advanced"] as const).map((item) => (
          <button key={item} type="button" className={settingsTab === item ? "active" : ""} onClick={() => setSettingsTab(item)}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      <div className="npb-controls">
        {settingsTab === "settings" ? (
          <>
            <label className="npb-control">
              <span>Title</span>
              <input value={document.settings.title ?? ""} onChange={(event) => setSetting("title", event.target.value)} />
            </label>
            <StyleControl label="Content width" property="width" type="number" value={document.settings.contentWidth} onChange={(_, value) => setSetting("contentWidth", value)} />
          </>
        ) : null}
        {settingsTab === "style" ? (
          <>
            <StyleControl label="Background" property="backgroundColor" type="color" value={document.settings.backgroundColor} onChange={(_, value) => setSetting("backgroundColor", value)} />
            <StyleControl label="Text color" property="color" type="color" value={document.settings.textColor} onChange={(_, value) => setSetting("textColor", value)} />
            <h3>Global colors</h3>
            {Object.entries(document.globals.colors).map(([key, color]) => (
              <label key={key} className="npb-control npb-control-color-row">
                <span>{key}</span>
                <input type="color" value={color} onChange={(event) => setGlobal("colors", key, event.target.value)} />
              </label>
            ))}
            <h3>Global fonts</h3>
            {Object.entries(document.globals.fonts).map(([key, font]) => (
              <label key={key} className="npb-control">
                <span>{key}</span>
                <input value={font} onChange={(event) => setGlobal("fonts", key, event.target.value)} />
              </label>
            ))}
          </>
        ) : null}
        {settingsTab === "advanced" ? (
          <label className="npb-control">
            <span>Custom CSS</span>
            <textarea rows={10} value={document.settings.customCss ?? ""} onChange={(event) => setSetting("customCss", event.target.value)} placeholder="Add page-level CSS" />
          </label>
        ) : null}
      </div>
    </>
  );
}

function HistoryPanel({
  history,
  onRestore,
  onBack,
}: {
  history: HistoryState;
  onRestore(index: number): void;
  onBack(): void;
}) {
  const [historyTab, setHistoryTab] = useState<"actions" | "revisions">("actions");
  const entries = [...history.past, history.present];
  return (
    <>
      <div className="npb-panel-heading">
        <strong>History</strong>
        <button type="button" className="npb-panel-close" onClick={onBack} aria-label="Close History">×</button>
      </div>
      <div className="npb-inspector-tabs">
        <button type="button" className={historyTab === "actions" ? "active" : ""} onClick={() => setHistoryTab("actions")}>Actions</button>
        <button type="button" className={historyTab === "revisions" ? "active" : ""} onClick={() => setHistoryTab("revisions")}>Revisions</button>
      </div>
      {historyTab === "actions" ? (
        <div className="npb-history-list">
          {entries.map((entry, index) => {
            const widgetCount = entry.content.length;
            const current = index === entries.length - 1;
            return (
              <button
                key={`${index}-${widgetCount}`}
                type="button"
                className={current ? "active" : ""}
                disabled={current}
                onClick={() => onRestore(index)}
              >
                <span className="npb-history-dot" />
                <span>
                  <strong>{current ? "Current state" : `Edit ${index + 1}`}</strong>
                  <small>{widgetCount} top-level element{widgetCount === 1 ? "" : "s"}</small>
                </span>
              </button>
            );
          })}
          {!history.past.length ? <p className="npb-panel-empty">Your editing actions will appear here.</p> : null}
        </div>
      ) : <p className="npb-panel-empty">Saved revisions will appear after this page is updated.</p>}
    </>
  );
}

function TemplateLibrary({
  templates,
  onInsert,
  onSave,
}: {
  templates: BuilderTemplate[];
  onInsert(template: BuilderTemplate): void;
  onSave(name: string): void;
}) {
  const [name, setName] = useState("");
  return (
    <>
      <div className="npb-panel-heading"><strong>Templates</strong></div>
      <div className="npb-template-save">
        <input placeholder="Template name" value={name} onChange={(event) => setName(event.target.value)} />
        <button type="button" disabled={!name.trim()} onClick={() => {
          onSave(name.trim());
          setName("");
        }}>Save page</button>
      </div>
      <div className="npb-template-list">
        {templates.length ? templates.map((template) => (
          <button key={template.id} type="button" onClick={() => onInsert(template)}>
            <strong>{template.name}</strong>
            <span>{template.kind}</span>
          </button>
        )) : <p>No saved templates yet.</p>}
      </div>
    </>
  );
}

const styleAccordions: Array<{
  title: string;
  kind?: "layout" | "spacing" | "size" | "position" | "typography" | "background" | "border" | "effects" | "custom";
  controls: Array<[string, keyof CSSProperties, "text" | "number" | "color"]>;
}> = [
  { title: "Layout", kind: "layout", controls: [] },
  { title: "Spacing", kind: "spacing", controls: [] },
  { title: "Size", kind: "size", controls: [] },
  { title: "Position", kind: "position", controls: [] },
  { title: "Typography", kind: "typography", controls: [] },
  { title: "Background", kind: "background", controls: [] },
  { title: "Border", kind: "border", controls: [] },
  { title: "Effects", kind: "effects", controls: [] },
  { title: "Custom CSS", kind: "custom", controls: [] },
];

function SharedStyleGroupContent({
  group,
  styles,
  onChange,
}: {
  group: (typeof styleAccordions)[number];
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  if (group.kind === "layout") return <LayoutStyle styles={styles} onChange={onChange} />;
  if (group.kind === "spacing") return <>
    <SpacingBox label="Margin" values={{ top: styles.marginTop, right: styles.marginRight, bottom: styles.marginBottom, left: styles.marginLeft }} onChange={(side, value) => onChange(({ top: "marginTop", right: "marginRight", bottom: "marginBottom", left: "marginLeft" } as const)[side], value ? `${value}px` : "")} />
    <SpacingBox label="Padding" values={{ top: styles.paddingTop, right: styles.paddingRight, bottom: styles.paddingBottom, left: styles.paddingLeft }} onChange={(side, value) => onChange(({ top: "paddingTop", right: "paddingRight", bottom: "paddingBottom", left: "paddingLeft" } as const)[side], value ? `${value}px` : "")} />
  </>;
  if (group.kind === "size") return <SizeStyle styles={styles} onChange={onChange} />;
  if (group.kind === "position") return <PositionStyle styles={styles} onChange={onChange} />;
  if (group.kind === "typography") return <TypographyStyle styles={styles} onChange={onChange} />;
  if (group.kind === "background") return <BackgroundStyle styles={styles} onChange={onChange} />;
  if (group.kind === "border") return <BorderStyle styles={styles} onChange={onChange} />;
  if (group.kind === "effects") return <EffectsStyle styles={styles} onChange={onChange} />;
  if (group.kind === "custom") return <p className="npb-panel-empty">Upgrade to edit custom CSS per element.</p>;
  return <>{group.controls.map(([label, property, type]) => <StyleControl key={property} label={label} property={property} type={type} value={styles[property]} onChange={onChange} />)}</>;
}

function InteractionStylePanel({
  state,
  onState,
  styles,
  onStyle,
  advanced,
  onAdvanced,
}: {
  state: BuilderStyleState;
  onState(state: BuilderStyleState): void;
  styles: CSSProperties;
  onStyle(property: keyof CSSProperties, value: string | number): void;
  advanced: BuilderElementAdvanced;
  onAdvanced(next: BuilderElementAdvanced): void;
}) {
  return <div className="npb-controls npb-style-panel">
    <div className="npb-style-state" role="tablist" aria-label="Interaction state">
      {(["hover", "active", "focus"] as BuilderStyleState[]).map((item) => <button key={item} type="button" className={state === item ? "active" : ""} onClick={() => onState(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
    </div>
    <p className="npb-interaction-copy">Set styles for the selected interaction state. They are generated as CSS on the published page.</p>
    {styleAccordions.filter((group) => group.kind !== "custom").map((group) => <AccordionSection key={group.title} title={group.title} defaultOpen={group.title === "Layout"}><SharedStyleGroupContent group={group} styles={styles} onChange={onStyle} /></AccordionSection>)}
    <InteractionsPanel advanced={advanced} onAdvanced={onAdvanced} />
  </div>;
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
  text = false,
  stack = false,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string; icon?: string }>;
  onChange(value: string): void;
  text?: boolean;
  stack?: boolean;
}) {
  return (
    <div className={`npb-control npb-control-row${stack ? " npb-control-stack" : ""}`}>
      <span>{label}</span>
      <div className={`npb-choices${text ? " npb-choices-text" : ""}`} role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "active" : ""}
            title={option.label}
            aria-label={option.label}
            onClick={() => onChange(option.value)}
          >
            {option.icon ?? option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function UnitField({
  label,
  value,
  onChange,
  placeholder = "",
  unit = "PX",
}: {
  label: string;
  value: unknown;
  onChange(value: string): void;
  placeholder?: string;
  unit?: string;
}) {
  return (
    <label className="npb-unit-field">
      <span className="npb-unit-field-label">{label}</span>
      <span className="npb-unit-field-input">
        <input
          inputMode="numeric"
          value={parseUnitValue(value)}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value === "" ? "" : `${event.target.value}px`)}
        />
        <span className="npb-unit">{unit}</span>
      </span>
    </label>
  );
}

/** Elementor-style Layout accordion: Display + flex container + flex child. */
function LayoutStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  const display = String(styles.display ?? "block");
  const isFlex = display === "flex" || display === "inline-flex";
  const [gapsLinked, setGapsLinked] = useState(true);
  const [orderEditing, setOrderEditing] = useState(false);
  const [flexEditing, setFlexEditing] = useState(false);
  const columnGap = parseUnitValue(styles.columnGap ?? styles.gap);
  const rowGap = parseUnitValue(styles.rowGap ?? styles.gap);

  const setGap = (axis: "column" | "row", next: string) => {
    if (gapsLinked) {
      onChange("gap", next);
      onChange("columnGap", next);
      onChange("rowGap", next);
      return;
    }
    if (axis === "column") onChange("columnGap", next);
    else onChange("rowGap", next);
  };

  return (
    <div className="npb-layout-style">
      <ChoiceGroup
        label="Display"
        value={display}
        onChange={(next) => onChange("display", next)}
        text
        stack
        options={[
          { label: "Block", value: "block", icon: "Block" },
          { label: "Flex", value: "flex", icon: "Flex" },
          { label: "Inline block", value: "inline-block", icon: "In-blk" },
          { label: "Inline flex", value: "inline-flex", icon: "In-flx" },
          { label: "More display options", value: "flow-root", icon: "⌄" },
        ]}
      />
      {isFlex ? (
        <>
          <ChoiceGroup
            label="Direction"
            value={String(styles.flexDirection ?? "row")}
            onChange={(next) => onChange("flexDirection", next)}
            options={[
              { label: "Row - horizontal", value: "row", icon: "→" },
              { label: "Column - vertical", value: "column", icon: "↓" },
              { label: "Row - reversed", value: "row-reverse", icon: "←" },
              { label: "Column - reversed", value: "column-reverse", icon: "↑" },
            ]}
          />
          <ChoiceGroup
            label="Justify content"
            value={String(styles.justifyContent ?? "flex-start")}
            onChange={(next) => onChange("justifyContent", next)}
            options={[
              { label: "Start", value: "flex-start", icon: "⇤" },
              { label: "Center", value: "center", icon: "↔" },
              { label: "End", value: "flex-end", icon: "⇥" },
              { label: "Space Between", value: "space-between", icon: "⇆" },
              { label: "Space Around", value: "space-around", icon: "⇋" },
              { label: "Space Evenly", value: "space-evenly", icon: "☰" },
            ]}
          />
          <ChoiceGroup
            label="Align items"
            value={String(styles.alignItems ?? "stretch")}
            onChange={(next) => onChange("alignItems", next)}
            options={[
              { label: "Start", value: "flex-start", icon: "⤒" },
              { label: "Center", value: "center", icon: "↕" },
              { label: "End", value: "flex-end", icon: "⤓" },
              { label: "Stretch", value: "stretch", icon: "⇳" },
            ]}
          />
          <div className="npb-gaps">
            <div className="npb-spacing-head">
              <span>Gaps</span>
              <button
                type="button"
                className={`npb-link-toggle${gapsLinked ? " active" : ""}`}
                aria-label={gapsLinked ? "Unlink values" : "Link values"}
                onClick={() => setGapsLinked((value) => !value)}
              >
                ⛓
              </button>
            </div>
            <div className="npb-gaps-grid">
              <UnitField label="Column" value={columnGap} onChange={(next) => setGap("column", next)} />
              <UnitField label="Row" value={rowGap} onChange={(next) => setGap("row", next)} />
            </div>
          </div>
          <ChoiceGroup
            label="Wrap"
            value={String(styles.flexWrap ?? "nowrap")}
            onChange={(next) => onChange("flexWrap", next)}
            options={[
              { label: "No wrap", value: "nowrap", icon: "⇉" },
              { label: "Wrap", value: "wrap", icon: "↩" },
              { label: "Wrap reverse", value: "wrap-reverse", icon: "↪" },
            ]}
          />
        </>
      ) : null}
      <div className="npb-flex-child">
        <div className="npb-subheading">Flex child</div>
        <ChoiceGroup
          label="Align self"
          value={String(styles.alignSelf === "auto" ? "flex-start" : styles.alignSelf ?? "flex-start")}
          onChange={(next) => onChange("alignSelf", next)}
          options={[
              { label: "Start", value: "flex-start", icon: "⤒" },
            { label: "Center", value: "center", icon: "↕" },
            { label: "End", value: "flex-end", icon: "⤓" },
            { label: "Stretch", value: "stretch", icon: "⇳" },
          ]}
        />
        <div className="npb-control npb-control-row npb-action-row">
          <span>Order</span>
          {orderEditing ? <input className="npb-input-compact" type="number" value={styles.order === undefined || styles.order === "" ? "" : Number(styles.order)} onChange={(event) => onChange("order", event.target.value === "" ? "" : Number(event.target.value))} /> : null}
          <div className="npb-mini-actions">
            <button type="button" aria-label="Move order up" title="Move up" onClick={() => onChange("order", Number(styles.order ?? 0) - 1)}>↑</button>
            <button type="button" aria-label="Move order down" title="Move down" onClick={() => onChange("order", Number(styles.order ?? 0) + 1)}>↓</button>
            <button type="button" aria-label="Edit order" title="Edit" className={orderEditing ? "active" : ""} onClick={() => setOrderEditing((open) => !open)}>⌕</button>
          </div>
        </div>
        <div className="npb-control npb-control-row npb-action-row">
          <span>Flex Size</span>
          {flexEditing ? <input className="npb-input-compact" value={String(styles.flex ?? "")} placeholder="0 1 auto" onChange={(event) => onChange("flex", event.target.value)} /> : null}
          <div className="npb-mini-actions">
            <button type="button" aria-label="Grow flex" title="Grow" onClick={() => onChange("flexGrow", Number(styles.flexGrow ?? 0) + 1)}>↔</button>
            <button type="button" aria-label="Shrink flex" title="Shrink" onClick={() => onChange("flexShrink", Number(styles.flexShrink ?? 1) + 1)}>↔</button>
            <button type="button" aria-label="Edit flex size" title="Edit" className={flexEditing ? "active" : ""} onClick={() => setFlexEditing((open) => !open)}>⌕</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Elementor-style Size accordion with unit fields and overflow. */
function SizeStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="npb-size-style">
      <div className="npb-size-grid">
        <UnitField label="Width" value={styles.width} onChange={(next) => onChange("width", next)} />
        <UnitField label="Height" value={styles.height} onChange={(next) => onChange("height", next)} />
        <UnitField label="Min width" value={styles.minWidth} onChange={(next) => onChange("minWidth", next)} />
        <UnitField label="Min height" value={styles.minHeight} onChange={(next) => onChange("minHeight", next)} />
        <UnitField label="Max width" value={styles.maxWidth} onChange={(next) => onChange("maxWidth", next)} />
        <UnitField label="Max height" value={styles.maxHeight} onChange={(next) => onChange("maxHeight", next)} />
      </div>
      <ChoiceGroup
        label="Overflow"
        value={String(styles.overflow ?? "visible")}
        onChange={(next) => onChange("overflow", next)}
        options={[
          { label: "Visible", value: "visible", icon: "◉" },
          { label: "Hidden", value: "hidden", icon: "▣" },
          { label: "Auto", value: "auto", icon: "⇅" },
        ]}
      />
      {showMore ? (
        <UnitField label="Aspect ratio" value={styles.aspectRatio} onChange={(next) => onChange("aspectRatio", next.replace(/px$/i, ""))} />
      ) : null}
      <button type="button" className="npb-show-more" onClick={() => setShowMore((value) => !value)}>
        {showMore ? "Show less" : "Show more"} <span>⌄</span>
      </button>
    </div>
  );
}

/** Elementor-style Position accordion. */
function PositionStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  const position = String(styles.position ?? "static");
  const offset = position !== "static";
  return (
    <div className="npb-position-style">
      <label className="npb-control npb-control-row">
        <span>Position</span>
        <select
          value={position}
          onChange={(event) => onChange("position", event.target.value)}
        >
          {["static", "relative", "absolute", "fixed", "sticky"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      {offset ? (
        <div className="npb-size-grid">
          <UnitField label="Top" value={styles.top} onChange={(next) => onChange("top", next)} />
          <UnitField label="Right" value={styles.right} onChange={(next) => onChange("right", next)} />
          <UnitField label="Bottom" value={styles.bottom} onChange={(next) => onChange("bottom", next)} />
          <UnitField label="Left" value={styles.left} onChange={(next) => onChange("left", next)} />
        </div>
      ) : null}
      <label className="npb-control npb-control-row">
        <span>Z-index</span>
        <input
          className="npb-input-compact"
          type="number"
          value={styles.zIndex === undefined || styles.zIndex === "" ? "" : Number(styles.zIndex)}
          onChange={(event) => onChange("zIndex", event.target.value === "" ? "" : Number(event.target.value))}
        />
      </label>
      <UnitField
        label="Anchor offset"
        value={(styles as Record<string, unknown>).scrollMarginTop}
        onChange={(next) => onChange("scrollMarginTop", next)}
      />
    </div>
  );
}

/** Elementor-style Border accordion. */
function BorderStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  return (
    <div className="npb-border-style">
      <UnitField label="Border width" value={styles.borderWidth} onChange={(next) => onChange("borderWidth", next)} />
      <label className="npb-control npb-control-color-row">
        <span>Border color</span>
        <div className="npb-color-input">
          <input
            type="color"
            value={String(styles.borderColor ?? "#000000")}
            onChange={(event) => onChange("borderColor", event.target.value)}
          />
          <input
            type="text"
            value={String(styles.borderColor ?? "")}
            onChange={(event) => onChange("borderColor", event.target.value)}
          />
        </div>
      </label>
      <label className="npb-control npb-control-row">
        <span>Border type</span>
        <select
          value={String(styles.borderStyle ?? "none")}
          onChange={(event) => onChange("borderStyle", event.target.value)}
        >
          {["none", "solid", "dashed", "dotted", "double", "groove", "ridge"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <UnitField label="Border radius" value={styles.borderRadius} onChange={(next) => onChange("borderRadius", next)} />
    </div>
  );
}

/** Elementor-style background group. Values are plain CSS so they render on
 * the public page as well as in the canvas. */
function BackgroundStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  const mode = String(styles.backgroundImage ?? "").includes("gradient(") ? "gradient" : "classic";
  return (
    <div className="npb-background-style">
      <ChoiceGroup
        label="Background type"
        value={mode}
        onChange={(next) => {
          if (next === "classic" && String(styles.backgroundImage ?? "").includes("gradient(")) onChange("backgroundImage", "");
          if (next === "gradient" && !String(styles.backgroundImage ?? "").includes("gradient(")) onChange("backgroundImage", "linear-gradient(135deg, #375efb, #8b5cf6)");
        }}
        text
        stack
        options={[{ label: "Classic", value: "classic", icon: "Classic" }, { label: "Gradient", value: "gradient", icon: "Gradient" }]}
      />
      <StyleControl label="Color" property="backgroundColor" type="color" value={styles.backgroundColor} onChange={onChange} />
      {mode === "gradient" ? (
        <label className="npb-control npb-control-row"><span>Gradient</span><input className="npb-input-compact" placeholder="linear-gradient(135deg, #000, #fff)" value={String(styles.backgroundImage ?? "")} onChange={(event) => onChange("backgroundImage", event.target.value)} /></label>
      ) : (
        <>
          <label className="npb-control npb-control-row"><span>Image URL</span><input className="npb-input-compact" placeholder="https://…" value={String(styles.backgroundImage ?? "").replace(/^url\(["']?/, "").replace(/["']?\)$/, "")} onChange={(event) => onChange("backgroundImage", event.target.value ? `url("${event.target.value}")` : "")} /></label>
          <label className="npb-control npb-control-row"><span>Position</span><select value={String(styles.backgroundPosition ?? "center center")} onChange={(event) => onChange("backgroundPosition", event.target.value)}><option value="center center">Center center</option><option value="center top">Center top</option><option value="center bottom">Center bottom</option><option value="left center">Left center</option><option value="right center">Right center</option></select></label>
          <label className="npb-control npb-control-row"><span>Attachment</span><select value={String(styles.backgroundAttachment ?? "scroll")} onChange={(event) => onChange("backgroundAttachment", event.target.value)}><option value="scroll">Scroll</option><option value="fixed">Fixed</option></select></label>
          <label className="npb-control npb-control-row"><span>Repeat</span><select value={String(styles.backgroundRepeat ?? "no-repeat")} onChange={(event) => onChange("backgroundRepeat", event.target.value)}><option value="no-repeat">No repeat</option><option value="repeat">Repeat</option><option value="repeat-x">Repeat X</option><option value="repeat-y">Repeat Y</option></select></label>
          <label className="npb-control npb-control-row"><span>Size</span><select value={String(styles.backgroundSize ?? "cover")} onChange={(event) => onChange("backgroundSize", event.target.value)}><option value="cover">Cover</option><option value="contain">Contain</option><option value="auto">Auto</option></select></label>
        </>
      )}
    </div>
  );
}

/** A compact equivalent of Elementor's Effects accordion. Every field writes CSS
 * directly, so it remains useful on the rendered page instead of being UI-only. */
function EffectsStyle({
  styles,
  onChange,
}: {
  styles: CSSProperties;
  onChange(property: keyof CSSProperties, value: string | number): void;
}) {
  const transform = String(styles.transform ?? "");
  const numberInTransform = (name: string, fallback: number) => {
    const match = transform.match(new RegExp(`${name}\\((-?[\\d.]+)`));
    return match?.[1] ?? String(fallback);
  };
  const setTransform = (part: "translateX" | "translateY" | "rotate" | "scale" | "skewX", raw: string) => {
    const values = {
      translateX: numberInTransform("translateX", 0),
      translateY: numberInTransform("translateY", 0),
      rotate: numberInTransform("rotate", 0),
      scale: numberInTransform("scale", 1),
      skewX: numberInTransform("skewX", 0),
      [part]: raw === "" ? (part === "scale" ? "1" : "0") : raw,
    };
    onChange("transform", `translateX(${values.translateX}px) translateY(${values.translateY}px) rotate(${values.rotate}deg) skewX(${values.skewX}deg) scale(${values.scale})`);
  };

  return (
    <div className="npb-effects-style">
      <label className="npb-control npb-control-row">
        <span>Blend mode</span>
        <select value={String(styles.mixBlendMode ?? "normal")} onChange={(event) => onChange("mixBlendMode", event.target.value)}>
          {["normal", "multiply", "screen", "overlay", "darken", "lighten", "color", "luminosity"].map((mode) => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </label>
      <label className="npb-control npb-control-unit">
        <span>Opacity</span>
        <div className="npb-unit-input">
          <input type="number" min="0" max="100" value={styles.opacity === undefined ? "" : Math.round(Number(styles.opacity) * 100)} onChange={(event) => onChange("opacity", event.target.value === "" ? "" : Number(event.target.value) / 100)} />
          <span className="npb-unit">%</span>
        </div>
      </label>
      <label className="npb-control npb-control-row">
        <span>Box shadow</span>
        <input className="npb-input-compact" placeholder="0 8px 24px #0000001a" value={String(styles.boxShadow ?? "")} onChange={(event) => onChange("boxShadow", event.target.value)} />
      </label>
      <div className="npb-effect-transform">
        <div className="npb-subheading">Transform</div>
        <div className="npb-size-grid">
          <UnitField label="Move X" value={numberInTransform("translateX", 0)} onChange={(value) => setTransform("translateX", parseUnitValue(value))} />
          <UnitField label="Move Y" value={numberInTransform("translateY", 0)} onChange={(value) => setTransform("translateY", parseUnitValue(value))} />
          <UnitField label="Rotate" unit="DEG" value={numberInTransform("rotate", 0)} onChange={(value) => setTransform("rotate", parseUnitValue(value))} />
          <UnitField label="Skew X" unit="DEG" value={numberInTransform("skewX", 0)} onChange={(value) => setTransform("skewX", parseUnitValue(value))} />
          <label className="npb-unit-field"><span className="npb-unit-field-label">Scale</span><span className="npb-unit-field-input"><input inputMode="decimal" value={numberInTransform("scale", 1)} onChange={(event) => setTransform("scale", event.target.value)} /><span className="npb-unit">×</span></span></label>
        </div>
      </div>
      <ChoiceGroup label="Flip" value={transform.includes("scaleX(-1)") ? "horizontal" : transform.includes("scaleY(-1)") ? "vertical" : "none"} onChange={(next) => onChange("transform", `${transform.replace(/\s*scale[XY]\(-1\)/g, "")}${next === "horizontal" ? " scaleX(-1)" : next === "vertical" ? " scaleY(-1)" : ""}`.trim())} options={[{ label: "None", value: "none", icon: "—" }, { label: "Horizontal", value: "horizontal", icon: "↔" }, { label: "Vertical", value: "vertical", icon: "↕" }]} />
      <label className="npb-control npb-control-row">
        <span>Transition</span>
        <select value={String(styles.transition ?? "")} onChange={(event) => onChange("transition", event.target.value)}>
          <option value="">None</option>
          <option value="all 200ms ease">Fast</option>
          <option value="all 350ms ease">Normal</option>
          <option value="all 600ms ease">Slow</option>
        </select>
      </label>
    </div>
  );
}

function SettingsExtras({
  advanced,
  onAdvanced,
}: {
  advanced: BuilderElementAdvanced;
  onAdvanced(next: BuilderElementAdvanced): void;
}) {
  const set = <K extends keyof BuilderElementAdvanced>(key: K, value: BuilderElementAdvanced[K]) => {
    onAdvanced({ ...advanced, [key]: value });
  };

  return (
    <>
      <label className="npb-control npb-control-row">
        <span>ID</span>
        <input className="npb-input-compact" value={advanced.cssId ?? ""} onChange={(event) => set("cssId", event.target.value)} />
      </label>
      <div className="npb-control npb-control-pro-row">
        <span>Attributes</span>
        <ProCrown />
        <button type="button" className="npb-icon-button" aria-label="Add attribute">+</button>
      </div>
      <div className="npb-control npb-control-pro-row">
        <span>Display Conditions</span>
        <ProCrown />
        <button type="button" className="npb-icon-button" aria-label="Display conditions">⎇</button>
      </div>
    </>
  );
}

function GeneralPanel({
  element,
  widgetSections,
  advanced,
  onProp,
  onAdvanced,
  classic = false,
}: {
  element: BuilderElement;
  widgetSections: BuilderControlSection[];
  advanced: BuilderElementAdvanced;
  onProp(key: string, value: unknown): void;
  onAdvanced(next: BuilderElementAdvanced): void;
  classic?: boolean;
}) {
  const hasSettings = widgetSections.some((section) => section.label === "Settings");

  return (
    <div className="npb-controls">
      {widgetSections.map((section) => {
        const isSettings = section.label === "Settings";
        return (
          <AccordionSection key={section.label} title={section.label} defaultOpen>
            {section.controls.map((control) => (
              <Control
                key={control.key}
                control={control}
                value={element.props[control.key]}
                onChange={(next) => onProp(control.key, next)}
                layout={isSettings || classic ? "row" : "stack"}
              />
            ))}
            {isSettings && !classic ? <SettingsExtras advanced={advanced} onAdvanced={onAdvanced} /> : null}
          </AccordionSection>
        );
      })}
      {!hasSettings && !classic ? (
        <AccordionSection title="Settings" defaultOpen>
          <SettingsExtras advanced={advanced} onAdvanced={onAdvanced} />
        </AccordionSection>
      ) : null}
    </div>
  );
}

function InteractionsPanel({
  advanced,
  onAdvanced,
}: {
  advanced: BuilderElementAdvanced;
  onAdvanced(next: BuilderElementAdvanced): void;
}) {
  const set = <K extends keyof BuilderElementAdvanced>(key: K, value: BuilderElementAdvanced[K]) => {
    onAdvanced({ ...advanced, [key]: value });
  };

  return (
    <div className="npb-controls">
      <AccordionSection title="Responsive" defaultOpen>
        {([
          ["hideOnDesktop", "Hide on desktop"],
          ["hideOnTablet", "Hide on tablet"],
          ["hideOnMobile", "Hide on mobile"],
        ] as const).map(([key, label]) => (
          <label key={key} className="npb-control npb-control-switch">
            <span>{label}</span>
            <input type="checkbox" checked={Boolean(advanced[key])} onChange={(event) => set(key, event.target.checked)} />
          </label>
        ))}
      </AccordionSection>
      <AccordionSection title="Motion Effects" defaultOpen>
        <div className="npb-control npb-control-pro-row"><span>Scrolling Effects</span><ProCrown /><button type="button" className="npb-icon-button" aria-label="Scrolling effects">+</button></div>
        <div className="npb-control npb-control-pro-row"><span>Mouse Effects</span><ProCrown /><button type="button" className="npb-icon-button" aria-label="Mouse effects">+</button></div>
        <div className="npb-control npb-control-pro-row"><span>Sticky</span><ProCrown /><button type="button" className="npb-icon-button" aria-label="Sticky settings">+</button></div>
        <label className="npb-control">
          <span>Animation</span>
          <select
            value={advanced.entranceAnimation ?? "none"}
            onChange={(event) => set("entranceAnimation", event.target.value as EntranceAnimation)}
          >
            {["none", "fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight", "zoomIn", "bounceIn"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="npb-control">
          <span>Duration</span>
          <select
            value={advanced.animationDuration ?? "normal"}
            onChange={(event) => set("animationDuration", event.target.value as "slow" | "normal" | "fast")}
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </label>
        <label className="npb-control">
          <span>Delay (ms)</span>
          <input type="number" min={0} value={advanced.animationDelay ?? 0} onChange={(event) => set("animationDelay", Number(event.target.value))} />
        </label>
      </AccordionSection>
    </div>
  );
}

function Inspector({
  element,
  tab,
  breakpoint,
  styleState,
  onTab,
  onStyleState,
  onProp,
  onStyle,
  onAdvanced,
  onBack,
  onDelete: _onDelete,
  onDuplicate: _onDuplicate,
  onCopy: _onCopy,
  onPaste: _onPaste,
  onCopyStyle: _onCopyStyle,
  onPasteStyle: _onPasteStyle,
}: {
  element: BuilderElement;
  tab: InspectorTab;
  breakpoint: BuilderBreakpoint;
  styleState: BuilderStyleState;
  onTab(tab: InspectorTab): void;
  onStyleState(state: BuilderStyleState): void;
  onProp(key: string, value: unknown): void;
  onStyle(property: keyof CSSProperties, value: string | number): void;
  onAdvanced(next: BuilderElementAdvanced): void;
  onBack(): void;
  onDelete(): void;
  onDuplicate(): void;
  onCopy(): void;
  onPaste(): void;
  onCopyStyle(): void;
  onPasteStyle(): void;
}) {
  const widget = getBuilderWidget(element.type);
  const currentStyles = element.styles?.[breakpoint]?.[styleState] ?? {};
  const interactionState = styleState === "normal" ? "hover" : styleState;
  const interactionStyles = element.styles?.[breakpoint]?.[interactionState] ?? {};
  const widgetSections = widget?.controls.filter((section) => controlTabMatches(section.tab, tab)) ?? [];
  const advanced = element.advanced ?? {};
  const isAtomic = widget?.category === "Atomic";
  const tabs = inspectorTabLabels(widget?.category);

  return (
    <>
      <div className="npb-panel-heading">
        <strong>Edit {widget?.label ?? element.type}</strong>
        <button type="button" className="npb-panel-close" onClick={onBack} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M7 5.6 11.6 1 13 2.4 8.4 7 13 11.6 11.6 13 7 8.4 2.4 13 1 11.6 5.6 7 1 2.4 2.4 1z" /></svg>
        </button>
      </div>
      <div className="npb-inspector-tabs">
        {tabs.map(([item, label]) => (
          <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => onTab(item)}>
            {label}
          </button>
        ))}
      </div>
      {tab === "general" ? (
        <GeneralPanel
          element={element}
          widgetSections={widgetSections}
          advanced={advanced}
          onProp={onProp}
          onAdvanced={onAdvanced}
          classic={!isAtomic}
        />
      ) : null}
      {tab === "style" ? (
        <div className="npb-controls npb-style-panel">
          {isAtomic ? (
            <ClassesField
              classes={element.classes ?? []}
              cssClasses={advanced.cssClasses}
              onChange={({ classes, cssClasses }) => onAdvanced({ ...advanced, cssClasses })}
            />
          ) : null}
          {widgetSections.map((section) => (
            <AccordionSection key={section.label} title={section.label} defaultOpen={section.label === "Layout" || !isAtomic}>
              {section.controls.map((control) => (
                <Control
                  key={control.key}
                  control={control}
                  value={element.props[control.key]}
                  onChange={(next) => onProp(control.key, next)}
                  layout="row"
                />
              ))}
            </AccordionSection>
          ))}
          {isAtomic
            ? styleAccordions.map((group) => {
              if (widgetSections.some((section) => section.label === group.title)) {
                return null;
              }
              return (
              <AccordionSection key={group.title} title={group.title} pro={group.kind === "custom"}>
                {group.kind === "layout" ? (
                  <LayoutStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "spacing" ? (
                  <>
                    <SpacingBox
                      label="Margin"
                      values={{
                        top: currentStyles.marginTop,
                        right: currentStyles.marginRight,
                        bottom: currentStyles.marginBottom,
                        left: currentStyles.marginLeft,
                      }}
                      onChange={(side, value) => {
                        const prop = ({ top: "marginTop", right: "marginRight", bottom: "marginBottom", left: "marginLeft" } as const)[side];
                        onStyle(prop, value === "" ? "" : `${value}px`);
                      }}
                    />
                    <SpacingBox
                      label="Padding"
                      values={{
                        top: currentStyles.paddingTop ?? 10,
                        right: currentStyles.paddingRight ?? 10,
                        bottom: currentStyles.paddingBottom ?? 10,
                        left: currentStyles.paddingLeft ?? 10,
                      }}
                      onChange={(side, value) => {
                        const prop = ({ top: "paddingTop", right: "paddingRight", bottom: "paddingBottom", left: "paddingLeft" } as const)[side];
                        onStyle(prop, value === "" ? "" : `${value}px`);
                      }}
                    />
                  </>
                ) : null}
                {group.kind === "size" ? (
                  <SizeStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "position" ? (
                  <PositionStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "typography" ? (
                  <TypographyStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "background" ? (
                  <BackgroundStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "border" ? (
                  <BorderStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "effects" ? (
                  <EffectsStyle styles={currentStyles} onChange={onStyle} />
                ) : null}
                {group.kind === "custom" ? (
                  <p className="npb-panel-empty">Upgrade to edit custom CSS per element.</p>
                ) : null}
                {!group.kind && group.controls.length
                  ? group.controls.map(([label, property, type]) => (
                    <StyleControl
                      key={property}
                      label={label}
                      property={property}
                      type={type}
                      value={currentStyles[property]}
                      onChange={onStyle}
                    />
                  ))
                  : null}
              </AccordionSection>
              );
            })
            : null}
          {!isAtomic && !widgetSections.length ? (
            <p className="npb-panel-empty">No style controls for this widget yet.</p>
          ) : null}
        </div>
      ) : null}
      {tab === "interactions" ? (
        isAtomic ? (
          <InteractionStylePanel
            state={interactionState}
            onState={onStyleState}
            styles={interactionStyles}
            onStyle={onStyle}
            advanced={advanced}
            onAdvanced={onAdvanced}
          />
        ) : (
          <div className="npb-controls npb-style-panel">
            {styleAccordions.map((group) => (
              <AccordionSection key={group.title} title={group.title === "Custom CSS" ? "Custom CSS" : group.title} pro={group.kind === "custom"} defaultOpen={group.title === "Layout" || group.title === "Spacing"}>
                <SharedStyleGroupContent group={group} styles={currentStyles} onChange={onStyle} />
              </AccordionSection>
            ))}
            <AccordionSection title="Mask" pro>
              <p className="npb-panel-empty">Masking is an Elementor Pro feature.</p>
            </AccordionSection>
            <InteractionsPanel advanced={advanced} onAdvanced={onAdvanced} />
            <AccordionSection title="Attributes" pro>
              <p className="npb-panel-empty">Custom attributes are an Elementor Pro feature.</p>
            </AccordionSection>
            <AccordionSection title="CSS ID & Classes" defaultOpen>
              <SettingsExtras advanced={advanced} onAdvanced={onAdvanced} />
            </AccordionSection>
          </div>
        )
      ) : null}
      <div className="npb-panel-footer">
        <ProCrown /> Access all Pro widgets. <a href="#">Upgrade Now</a>
      </div>
    </>
  );
}

/** Full visual editor for native NextPress builder documents. */
export function BuilderEditor({
  document,
  title,
  status,
  onSave,
  onPublish,
  templates = [],
  onSaveTemplate,
  backHref = "/admin/pages",
}: BuilderEditorProps) {
  const [history, setHistory] = useState<HistoryState>({ past: [], present: document, future: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<BuilderBreakpoint>("desktop");
  const [tab, setTab] = useState<InspectorTab>("general");
  const [styleState, setStyleState] = useState<BuilderStyleState>("normal");
  const [panel, setPanel] = useState<"widgets" | "settings" | "templates" | "history">("widgets");
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [copiedStyles, setCopiedStyles] = useState<BuilderElement["styles"]>();
  const [clipboard, setClipboard] = useState<BuilderElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [insertTarget, setInsertTarget] = useState<string | null>(null);
  const initialDocument = useRef(document);
  const selected = useMemo(
    () => selectedId ? findBuilderElement(history.present.content, selectedId) : undefined,
    [history.present.content, selectedId],
  );

  const commit = useCallback((next: BuilderDocument) => {
    setHistory((current) => ({
      past: [...current.past.slice(-49), current.present],
      present: next,
      future: [],
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) setTab("general");
  }, []);

  const addWidget = useCallback((type: string, parentId?: string) => {
    const element = createBuilderElement(type);
    const target = parentId ?? insertTarget ?? undefined;
    commit(addBuilderElement(history.present, element, target));
    setInsertTarget(null);
    selectElement(element.id);
  }, [commit, history.present, insertTarget, selectElement]);

  const addSiblingAfter = useCallback((id: string) => {
    const source = findBuilderElement(history.present.content, id);
    if (!source) return;
    const element = createBuilderElement(source.type);
    commit(insertBuilderElementAfter(history.present, element, id));
    selectElement(element.id);
  }, [commit, history.present, selectElement]);

  const deleteElement = useCallback((id: string) => {
    commit(removeBuilderElement(history.present, id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  }, [commit, history.present, selectedId]);

  const startInsertInto = useCallback((id: string) => {
    setInsertTarget(id);
    setSelectedId(null);
    setPanel("widgets");
  }, []);

  const updateSelected = useCallback((update: (element: BuilderElement) => BuilderElement) => {
    if (selectedId) {
      commit(updateBuilderElement(history.present, selectedId, update));
    }
  }, [commit, history.present, selectedId]);

  const updateStyle = useCallback((property: keyof CSSProperties, nextValue: string | number) => {
    updateSelected((element) => {
      const breakpointStyles = element.styles?.[breakpoint] ?? {};
      const stateStyles = { ...(breakpointStyles[styleState] ?? {}) } as Record<string, unknown>;
      if (nextValue === "") {
        delete stateStyles[property];
      } else {
        stateStyles[property] = nextValue;
      }
      return {
        ...element,
        styles: {
          ...element.styles,
          [breakpoint]: {
            ...breakpointStyles,
            [styleState]: stateStyles as CSSProperties,
          },
        },
      };
    });
  }, [breakpoint, styleState, updateSelected]);

  const undo = () => setHistory((current) => {
    const previous = current.past.at(-1);
    return previous
      ? { past: current.past.slice(0, -1), present: previous, future: [current.present, ...current.future] }
      : current;
  });
  const redo = () => setHistory((current) => {
    const next = current.future[0];
    return next
      ? { past: [...current.past, current.present], present: next, future: current.future.slice(1) }
      : current;
  });

  const restoreHistory = (index: number) => setHistory((current) => {
    const timeline = [...current.past, current.present];
    const restored = timeline[index];
    if (!restored || index === timeline.length - 1) return current;
    return {
      past: timeline.slice(0, index),
      present: restored,
      future: [...timeline.slice(index + 1), ...current.future],
    };
  });

  const save = async (publish = false) => {
    setSaving(true);
    setSaveMessage("");
    try {
      if (publish && onPublish) {
        await onPublish(history.present);
      } else {
        await onSave(history.present);
      }
      setSaveMessage(publish ? "Published" : "Saved");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/x-npb-widget");
    if (type) {
      addWidget(type);
    }
    const existingId = event.dataTransfer.getData("application/x-npb-element");
    if (existingId) {
      commit(moveBuilderElement(history.present, existingId));
    }
  };

  useEffect(() => {
    if (history.present === initialDocument.current) {
      return;
    }
    const timeout = window.setTimeout(() => {
      void onSave(history.present).then(
        () => setSaveMessage("Autosaved"),
        () => setSaveMessage("Autosave failed"),
      );
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [history.present, onSave]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable=true]")) {
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        event.shiftKey ? redo() : undo();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c" && selectedId) {
        event.preventDefault();
        const element = findBuilderElement(history.present.content, selectedId);
        if (element) {
          setClipboard(structuredClone(element));
        }
      }
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "v" && selectedId && copiedStyles) {
        event.preventDefault();
        commit(updateBuilderElement(history.present, selectedId, (element) => ({
          ...element,
          styles: structuredClone(copiedStyles),
        })));
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "v" && clipboard) {
        event.preventDefault();
        const pasted = cloneBuilderElement(clipboard);
        commit(selectedId
          ? insertBuilderElementAfter(history.present, pasted, selectedId)
          : addBuilderElement(history.present, pasted));
        setSelectedId(pasted.id);
        setTab("general");
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "i") {
        event.preventDefault();
        setNavigatorOpen((open) => !open);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d" && selectedId) {
        event.preventDefault();
        commit(duplicateBuilderElement(history.present, selectedId));
      }
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        commit(removeBuilderElement(history.present, selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  });

  const buildContextMenuItems = (id: string): ContextMenuItem[] => {
    const element = findBuilderElement(history.present.content, id);
    if (!element) return [];
    const label = getBuilderWidget(element.type)?.label ?? element.type;
    const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);
    const mod = isMac ? "⌘+" : "Ctrl+";
    return [
      {
        label: `Edit ${label}`,
        onSelect: () => selectElement(id),
      },
      {
        label: "Duplicate",
        shortcut: `${mod}D`,
        separatorBefore: true,
        onSelect: () => commit(duplicateBuilderElement(history.present, id)),
      },
      {
        label: "Copy",
        shortcut: `${mod}C`,
        onSelect: () => setClipboard(structuredClone(element)),
      },
      {
        label: "Paste",
        shortcut: `${mod}V`,
        disabled: !clipboard,
        onSelect: () => {
          if (!clipboard) return;
          const pasted = cloneBuilderElement(clipboard);
          commit(insertBuilderElementAfter(history.present, pasted, id));
          selectElement(pasted.id);
        },
      },
      {
        label: "Paste style",
        shortcut: `${mod}⇧+V`,
        disabled: !copiedStyles,
        onSelect: () => {
          if (!copiedStyles) return;
          commit(updateBuilderElement(history.present, id, (item) => ({
            ...item,
            styles: structuredClone(copiedStyles),
          })));
        },
      },
      { label: "Paste interactions", disabled: true },
      { label: "Paste from other site", disabled: true },
      {
        label: "Reset style",
        onSelect: () => commit(updateBuilderElement(history.present, id, (item) => ({
          ...item,
          styles: { desktop: { normal: {} } },
        }))),
      },
      { label: "Create component", pro: true, separatorBefore: true, disabled: true },
      {
        label: "Save as a template",
        onSelect: () => {
          setSelectedId(null);
          setPanel("templates");
        },
      },
      {
        label: "Structure",
        shortcut: `${mod}I`,
        separatorBefore: true,
        onSelect: () => setNavigatorOpen(true),
      },
      {
        label: "Delete",
        shortcut: "⌦",
        onSelect: () => deleteElement(id),
      },
    ];
  };

  if (preview) {
    return (
      <div className="npb-preview">
        <button type="button" onClick={() => setPreview(false)}>Exit preview</button>
        <BuilderRenderer document={history.present} />
      </div>
    );
  }

  return (
    <div className="npb-editor">
      <header className="npb-topbar">
        <div className="npb-topbar-left">
          <div className="npb-toolbar-popover-wrap">
            <button type="button" className={mainMenuOpen ? "active" : ""} onClick={() => setMainMenuOpen((open) => !open)} title="Elementor menu" aria-label="Elementor menu"><EditorIcon name="logo" size={20} /></button>
            {mainMenuOpen ? (
              <div className="npb-toolbar-menu npb-main-menu">
                <button type="button" onClick={() => { setPanel("settings"); setSelectedId(null); setMainMenuOpen(false); }}><span><EditorIcon name="settings" /> Site Settings</span></button>
                <button type="button" onClick={() => { setPanel("templates"); setSelectedId(null); setMainMenuOpen(false); }}><span>▦ Theme Builder</span></button>
                <button type="button" onClick={() => { setShortcutsOpen(true); setMainMenuOpen(false); }}><span>⌨ Keyboard Shortcuts</span></button>
                <a href={backHref}><span>↗ Exit to WordPress</span></a>
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => { setPanel("widgets"); setSelectedId(null); }} title="Add Element" aria-label="Add Element"><EditorIcon name="plus" /></button>
          <button type="button" title="Angie" aria-label="Angie"><EditorIcon name="sparkles" /></button>
          <button type="button" className={panel === "settings" && !selected ? "active" : ""} onClick={() => { setPanel("settings"); setSelectedId(null); }} title="Post Settings" aria-label="Post Settings"><EditorIcon name="document" /></button>
          <button type="button" className={panel === "history" && !selected ? "active" : ""} onClick={() => { setPanel("history"); setSelectedId(null); }} title="History" aria-label="History"><EditorIcon name="history" /></button>
          <button type="button" title="Design System" aria-label="Design System" onClick={() => { setPanel("settings"); setSelectedId(null); }}><EditorIcon name="droplet" /></button>
          <span className="npb-toolbar-divider" />
          <button type="button" disabled={!history.past.length} onClick={undo} title="Undo" aria-label="Undo"><EditorIcon name="undo" /></button>
          <button type="button" disabled={!history.future.length} onClick={redo} title="Redo" aria-label="Redo"><EditorIcon name="redo" /></button>
        </div>
        <div className="npb-topbar-center">
          <button type="button" className="npb-page-title-button" title="Page options">
            <span className="npb-topbar-title">{title}</span><EditorIcon name="chevron" size={14} />
          </button>
          <span className="npb-topbar-status">{status}</span>
          <div className="npb-devices">
            {([
              ["desktop", "desktop"],
              ["tablet", "tablet"],
              ["mobile", "mobile"],
            ] as const).map(([item, icon]) => (
              <button key={item} type="button" className={breakpoint === item ? "active" : ""} onClick={() => setBreakpoint(item)} title={`${item} view`} aria-label={`${item} view`}><EditorIcon name={icon} /></button>
            ))}
          </div>
        </div>
        <div className="npb-topbar-right">
          <button type="button" title="Checklist" aria-label="Checklist"><EditorIcon name="rocket" /></button>
          <button type="button" title="What's New" aria-label="What's New"><EditorIcon name="bell" /></button>
          <button type="button" title="Finder" aria-label="Finder" onClick={() => { setPanel("widgets"); setSelectedId(null); }}><EditorIcon name="search" /></button>
          <button type="button" className={navigatorOpen ? "active" : ""} onClick={() => setNavigatorOpen((open) => !open)} title="Structure" aria-label="Structure"><EditorIcon name="structure" /></button>
          <button type="button" onClick={() => setPreview(true)} title="Preview" aria-label="Preview"><EditorIcon name="preview" /></button>
          <div className="npb-publish-group">
            <button type="button" className="npb-publish" disabled={saving} onClick={() => void save(true)}>{saving ? "Publishing…" : status === "published" ? "Update" : "Publish"}</button>
            <button type="button" className="npb-publish-options" aria-label="Publish options" onClick={() => setPublishMenuOpen((open) => !open)}><EditorIcon name="chevron" size={14} /></button>
            {publishMenuOpen ? (
              <div className="npb-toolbar-menu npb-publish-menu">
                <button type="button" onClick={() => { void save(false); setPublishMenuOpen(false); }}><span>Save Draft</span><small>⌘S</small></button>
                <button type="button" disabled={!onSaveTemplate} onClick={() => { setPanel("templates"); setSelectedId(null); setPublishMenuOpen(false); }}><span>Save as Template</span></button>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div className="npb-workspace">
        <aside className="npb-sidebar">
          {selected ? (
            <Inspector
              element={selected}
              tab={tab}
              breakpoint={breakpoint}
              styleState={styleState}
              onTab={setTab}
              onStyleState={setStyleState}
              onProp={(key, nextValue) => updateSelected((element) => ({ ...element, props: { ...element.props, [key]: nextValue } }))}
              onStyle={updateStyle}
              onAdvanced={(advanced) => updateSelected((element) => ({ ...element, advanced }))}
              onBack={() => setSelectedId(null)}
              onDelete={() => {
                commit(removeBuilderElement(history.present, selected.id));
                setSelectedId(null);
              }}
              onDuplicate={() => commit(duplicateBuilderElement(history.present, selected.id))}
              onCopy={() => setClipboard(structuredClone(selected))}
              onPaste={() => {
                if (clipboard) {
                  const pasted = cloneBuilderElement(clipboard);
                  commit(addBuilderElement(history.present, pasted));
                  selectElement(pasted.id);
                }
              }}
              onCopyStyle={() => setCopiedStyles(structuredClone(selected.styles))}
              onPasteStyle={() => {
                if (copiedStyles) {
                  updateSelected((element) => ({ ...element, styles: structuredClone(copiedStyles) }));
                }
              }}
            />
          ) : panel === "settings" ? (
            <DocumentSettings document={history.present} onChange={commit} onBack={() => setPanel("widgets")} />
          ) : panel === "history" ? (
            <HistoryPanel history={history} onRestore={restoreHistory} onBack={() => setPanel("widgets")} />
          ) : panel === "templates" ? (
            <TemplateLibrary
              templates={templates}
              onInsert={(template) => commit(
                template.kind === "page"
                  ? structuredClone(template.document)
                  : {
                      ...history.present,
                      content: [
                        ...history.present.content,
                        ...structuredClone(template.document.content),
                      ],
                    },
              )}
              onSave={(name) => {
                if (onSaveTemplate) {
                  void onSaveTemplate(name, history.present);
                }
              }}
            />
          ) : (
            <WidgetLibrary onAdd={addWidget} />
          )}
        </aside>
        {navigatorOpen ? (
          <aside className="npb-navigator">
            <header><strong>Navigator</strong><button type="button" onClick={() => setNavigatorOpen(false)}>×</button></header>
            <ElementTree elements={history.present.content} selectedId={selectedId} onSelect={selectElement} />
          </aside>
        ) : null}
        <div className="npb-stage" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          <div className={`npb-canvas npb-${breakpoint}`} style={{ width: viewportWidths[breakpoint] }}>
            {history.present.content.map((element) => (
              <EditorElement
                key={element.id}
                element={element}
                selectedId={selectedId}
                breakpoint={breakpoint}
                onSelect={selectElement}
                onAdd={addWidget}
                onMove={(id, parentId) => commit(moveBuilderElement(history.present, id, parentId))}
                onAddAfter={addSiblingAfter}
                onDelete={deleteElement}
                onEmptyAdd={startInsertInto}
                onContextMenu={(id, x, y) => setContextMenu({ id, x, y })}
              />
            ))}
            <AddSectionArea
              onAddPreset={(preset) => {
                const element = createStructureElement(preset);
                commit(addBuilderElement(history.present, element));
                selectElement(element.id);
              }}
              onDropWidget={(type) => addWidget(type)}
            />
          </div>
        </div>
      </div>
      {contextMenu ? (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={buildContextMenuItems(contextMenu.id)}
          onClose={() => setContextMenu(null)}
        />
      ) : null}
      {shortcutsOpen ? (
        <div className="npb-modal-backdrop" role="presentation" onMouseDown={() => setShortcutsOpen(false)}>
          <section className="npb-shortcuts-modal" role="dialog" aria-modal="true" aria-labelledby="npb-shortcuts-title" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <strong id="npb-shortcuts-title">Keyboard Shortcuts</strong>
              <button type="button" onClick={() => setShortcutsOpen(false)} aria-label="Close Keyboard Shortcuts">×</button>
            </header>
            <div className="npb-shortcut-list">
              {[
                ["Undo", "⌘ Z"],
                ["Redo", "⌘ ⇧ Z"],
                ["Save", "⌘ S"],
                ["Copy", "⌘ C"],
                ["Paste", "⌘ V"],
                ["Paste Style", "⌘ ⇧ V"],
                ["Duplicate", "⌘ D"],
                ["Structure", "⌘ I"],
                ["Delete", "⌫"],
              ].map(([label, shortcut]) => <div key={label}><span>{label}</span><kbd>{shortcut}</kbd></div>)}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
