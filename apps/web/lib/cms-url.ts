import { existsSync } from "fs";

function runningInDocker(): boolean {
  return process.env.RUNNING_IN_DOCKER === "true" || existsSync("/.dockerenv");
}

/** CMS base URL for server-side API calls. */
export function resolveCmsUrl(override?: string): string {
  const raw =
    override ??
    process.env.CMS_URL ??
    process.env.STRAPI_URL ??
    process.env.NEXT_PUBLIC_STRAPI_URL ??
    "http://localhost:1337";

  // Host dev: map Compose service names to localhost. Inside Docker, keep service hostnames.
  if (process.env.NODE_ENV !== "production" && !runningInDocker()) {
    return raw.replace("://strapi:", "://localhost:");
  }

  return raw;
}
