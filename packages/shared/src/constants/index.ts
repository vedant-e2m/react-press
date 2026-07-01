export const APP_NAME = "NextPress";

export const PAGE_STATUSES = ["draft", "published", "scheduled"] as const;
export const POST_STATUSES = ["draft", "published"] as const;

export const DEFAULT_PUCK_DATA = {
  content: [],
  root: { props: { title: "" } },
};
