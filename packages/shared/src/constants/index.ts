export const APP_NAME = "NextPress";

export const PAGE_STATUSES = ["draft", "published", "scheduled", "trash"] as const;
export const POST_STATUSES = ["draft", "published", "trash"] as const;

export const DEFAULT_PUCK_DATA = {
  content: [],
  root: { props: { title: "" } },
};

/** Empty Gutenberg document used when creating a new page. */
export const DEFAULT_GUTENBERG_DATA = {
  editor: "gutenberg" as const,
  version: 1 as const,
  html: "",
  blocks: [] as [],
};
