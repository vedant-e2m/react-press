import type { CustomBlockField } from "@nextpress/shared";

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape a value so editor-entered content can't inject markup. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char] ?? char);
}

/** A placeholder name is truthy when it has a meaningful, non-empty value. */
function isTruthy(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (value === false) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function stringifyValue(value: unknown): string {
  if (value === undefined || value === null || value === false) return "";
  if (value === true) return "true";
  return String(value);
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Render a custom-block template.
 *
 * Supported syntax (a safe subset of mustache):
 * - `{{name}}`            interpolate a field value (HTML-escaped unless the field is richtext)
 * - `{{#name}}…{{/name}}` render the inner block only when `name` has a value
 * - `{{^name}}…{{/name}}` render the inner block only when `name` is empty
 */
export function renderCustomBlockTemplate(
  template: string,
  values: Record<string, unknown>,
  fields: CustomBlockField[],
): string {
  const richTextNames = new Set(
    fields.filter((field) => field.type === "richtext").map((field) => field.name),
  );

  let output = template;

  for (const field of fields) {
    const token = escapeRegExp(field.name);
    const present = isTruthy(values[field.name]);

    const sectionRe = new RegExp(`\\{\\{#${token}\\}\\}([\\s\\S]*?)\\{\\{/${token}\\}\\}`, "g");
    output = output.replace(sectionRe, (_match, inner: string) => (present ? inner : ""));

    const invertedRe = new RegExp(`\\{\\{\\^${token}\\}\\}([\\s\\S]*?)\\{\\{/${token}\\}\\}`, "g");
    output = output.replace(invertedRe, (_match, inner: string) => (present ? "" : inner));
  }

  for (const field of fields) {
    const token = escapeRegExp(field.name);
    const valueRe = new RegExp(`\\{\\{${token}\\}\\}`, "g");
    const raw = stringifyValue(values[field.name]);
    const replacement = richTextNames.has(field.name) ? raw : escapeHtml(raw);
    output = output.replace(valueRe, replacement);
  }

  return output;
}
