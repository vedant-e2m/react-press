/**
 * Rewrites a media or asset URL to use the configured CDN origin.
 * Falls back to the original URL when no CDN is configured.
 * Pass `cdnBase` from your app's env (e.g. process.env.CDN_URL).
 */
export function resolveCdnUrl(url: string, cdnBase?: string | null): string {
  if (!url) return url;
  const cdn = (cdnBase ?? "").replace(/\/$/, "");
  if (!cdn) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      return `${cdn}${parsed.pathname}${parsed.search}`;
    } catch {
      return url;
    }
  }
  return `${cdn}${url.startsWith("/") ? url : `/${url}`}`;
}
