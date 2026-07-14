/** Build Strapi v5 populate query params (comma-separated populate is invalid in v5). */
export function strapiPopulate(...fields: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  for (const field of fields) {
    params[`populate[${field}]`] = "true";
  }
  return params;
}
