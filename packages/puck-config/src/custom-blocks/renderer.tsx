"use client";

import type { CustomBlockField } from "@nextpress/shared";
import { useMemo } from "react";
import { renderCustomBlockTemplate } from "./template";

export interface CustomBlockRendererProps {
  template: string;
  fields: CustomBlockField[];
  values: Record<string, unknown>;
}

/**
 * Renders an editor-defined block by interpolating field values into its
 * admin-authored HTML template.
 *
 * Field values are HTML-escaped (see `renderCustomBlockTemplate`); the template
 * markup itself is authored by an authenticated CMS user, matching the trust
 * boundary of the built-in raw-HTML block.
 */
export function CustomBlockRenderer({ template, fields, values }: CustomBlockRendererProps) {
  const html = useMemo(
    () => renderCustomBlockTemplate(template, values, fields),
    [template, fields, values],
  );

  return <div className="np-custom-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
