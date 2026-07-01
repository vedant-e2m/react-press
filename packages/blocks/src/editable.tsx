import type { ReactNode } from "react";

/** Renders Puck inline-editor nodes or plain strings (edit vs preview). */
export function renderEditable(value: ReactNode): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return value;
}
