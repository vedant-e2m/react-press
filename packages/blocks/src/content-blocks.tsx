function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type RichTextProps = {
  html: string;
  className?: string;
};

/** Rich text block — renders formatted HTML content. */
export function RichText({ html, className }: RichTextProps) {
  if (!html?.trim()) {
    return (
      <div className={cn("mx-auto max-w-3xl px-6 py-8 text-zinc-400", className)}>
        Add rich text content…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-zinc mx-auto max-w-3xl px-6 py-8",
        "prose-headings:font-semibold prose-a:text-blue-600",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export type ShortcodeBlockProps = {
  content: string;
  className?: string;
};

/** Shortcode block — parses [shortcode] syntax into embeds. */
export function ShortcodeBlock({ content, className }: ShortcodeBlockProps) {
  // Inline shortcode rendering (no external dep in blocks package)
  const rendered = content
    .replace(/\[youtube\s+id=["']([^"']+)["']\]/gi, (_m, id) =>
      `<div class="aspect-video"><iframe src="https://www.youtube.com/embed/${id}" class="h-full w-full" loading="lazy" allowfullscreen></iframe></div>`,
    )
    .replace(/\[vimeo\s+id=["']([^"']+)["']\]/gi, (_m, id) =>
      `<div class="aspect-video"><iframe src="https://player.vimeo.com/video/${id}" class="h-full w-full" loading="lazy" allowfullscreen></iframe></div>`,
    )
    .replace(/\[button\s+href=["']([^"']+)["']\]([^\[]+)\[\/button\]/gi, (_m, href, label) =>
      `<a href="${href}" class="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-white no-underline">${label.trim()}</a>`,
    );

  return (
    <div
      className={cn("mx-auto max-w-3xl px-6 py-8", className)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

export type HtmlCodeProps = {
  html: string;
  displayMode?: "rendered" | "code";
  className?: string;
};

/** HTML/code block — preview rendered HTML or show source code. */
export function HtmlCode({ html, displayMode = "rendered", className }: HtmlCodeProps) {
  if (!html?.trim()) {
    return (
      <div className={cn("mx-auto max-w-3xl px-6 py-8 text-zinc-400", className)}>
        Enter HTML code…
      </div>
    );
  }

  if (displayMode === "code") {
    return (
      <pre
        className={cn(
          "mx-auto max-w-3xl overflow-x-auto rounded-lg bg-zinc-900 p-6 text-sm text-zinc-100",
          className,
        )}
      >
        <code>{html}</code>
      </pre>
    );
  }

  return (
    <div
      className={cn("mx-auto max-w-3xl px-6 py-8", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export type OEmbedProps = {
  url: string;
  caption?: string;
  className?: string;
};

function getOEmbedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const twitter = url.match(/twitter\.com\/\w+\/status\/(\d+)/);
  if (twitter) return `https://platform.twitter.com/embed/Tweet.html?id=${twitter[1]}`;
  return url;
}

/** oEmbed block — embeds YouTube, Vimeo, Twitter/X from URL. */
export function OEmbed({ url, caption, className }: OEmbedProps) {
  const embedUrl = getOEmbedUrl(url);

  return (
    <figure className={cn("mx-auto max-w-3xl px-6 py-8", className)}>
      {embedUrl ? (
        <div className="aspect-video overflow-hidden rounded-xl bg-zinc-100">
          <iframe
            src={embedUrl}
            title={caption ?? "Embedded content"}
            className="h-full w-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-zinc-300 text-zinc-400">
          Paste a YouTube, Vimeo, or Twitter URL
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">{caption}</figcaption>
      )}
    </figure>
  );
}
