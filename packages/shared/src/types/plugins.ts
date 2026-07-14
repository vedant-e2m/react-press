export interface PluginRecord {
  id: string;
  pluginId: string;
  providerId: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  version?: string | null;
  installedRegistrySlugs?: string[] | null;
}

export interface PluginComponentFieldOption {
  label: string;
  value: string | boolean | number;
}

export interface PluginComponentField {
  type: "text" | "textarea" | "radio" | "select";
  label: string;
  contentEditable?: boolean;
  options?: PluginComponentFieldOption[];
}

export interface PluginComponentRecord {
  id: string;
  pluginId: string;
  puckType: string;
  label: string;
  baseComponent: string;
  fields: Record<string, PluginComponentField>;
  defaultProps: Record<string, unknown>;
  sourceCode?: string | null;
}

export interface PluginCatalogItem {
  pluginId: string;
  name: string;
  description: string;
  version: string;
}

/** Field types an editor can attach to a custom block (no code). */
export type CustomBlockFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "color"
  | "image"
  | "url"
  | "select";

export interface CustomBlockFieldOption {
  label: string;
  value: string;
}

export interface CustomBlockField {
  /** Placeholder key used in the template, e.g. `title` -> `{{title}}`. */
  name: string;
  label: string;
  type: CustomBlockFieldType;
  /** Only used when type === "select". */
  options?: CustomBlockFieldOption[];
  defaultValue?: string | number | boolean;
}

/** Editor-defined block/section, stored in the CMS and rendered generically. */
export interface CustomBlockRecord {
  id: string;
  /** Unique Puck component type, e.g. `CustomBlock-hero-banner`. */
  puckType: string;
  label: string;
  category: string;
  fields: CustomBlockField[];
  /** HTML template with `{{fieldName}}` placeholders and `{{#name}}…{{/name}}` sections. */
  template: string;
}

export interface CreateCustomBlockInput {
  puckType: string;
  label: string;
  category?: string;
  fields: CustomBlockField[];
  template: string;
}
