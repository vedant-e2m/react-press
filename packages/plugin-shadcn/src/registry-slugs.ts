const SUB_COMPONENT_SUFFIXES = [
  "Title",
  "Description",
  "Content",
  "Header",
  "Footer",
  "Trigger",
  "Item",
  "Group",
  "Reactions",
  "Avatar",
  "Action",
  "Actions",
  "Cancel",
  "Label",
  "Value",
  "Indicator",
  "Separator",
  "Viewport",
  "Overlay",
  "Portal",
  "Close",
  "List",
  "Caption",
  "Cell",
  "Head",
  "Row",
  "Body",
  "Scroller",
  "Provider",
  "Icon",
  "Image",
  "Fallback",
  "Input",
  "Anchor",
  "Empty",
  "Link",
  "Panel",
  "Handle",
  "Thumb",
  "Track",
  "Range",
  "Menu",
  "Sub",
  "Radio",
  "Checkbox",
  "Shortcut",
  "Chevron",
];

export function pascalToKebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/** Map a JSX tag to a shadcn registry slug (e.g. AlertTitle → alert, DropdownMenu → dropdown-menu). */
export function tagToRegistrySlug(tag: string): string {
  for (const suffix of SUB_COMPONENT_SUFFIXES) {
    if (tag.endsWith(suffix) && tag.length > suffix.length) {
      const root = tag.slice(0, -suffix.length);
      if (root.length > 0) {
        return pascalToKebab(root);
      }
    }
  }
  return pascalToKebab(tag);
}

export function extractJsxTags(sourceCode: string): string[] {
  const matches = sourceCode.match(/<([A-Z][A-Za-z0-9]*)/g) ?? [];
  return [...new Set(matches.map((match) => match.slice(1)))];
}

export function getRegistrySlugsForMissingTags(
  missingTags: string[],
  installedSlugs: string[],
): string[] {
  const installed = new Set(installedSlugs);
  const slugs = new Set<string>();

  for (const tag of missingTags) {
    const slug = tagToRegistrySlug(tag);
    if (!installed.has(slug)) {
      slugs.add(slug);
    }
  }

  return [...slugs];
}
