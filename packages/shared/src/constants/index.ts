export const APP_NAME = "NextPress";

export const PAGE_STATUSES = ["draft", "published", "scheduled", "trash"] as const;
export const POST_STATUSES = ["draft", "published", "trash"] as const;

export const DEFAULT_PUCK_DATA = {
  content: [],
  root: { props: { title: "" } },
};
