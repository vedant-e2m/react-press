import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { BuilderElement } from "./types";
import { getBuilderWidget } from "./widgets";

/** WordPress compatibility widgets that intentionally render placeholder markup. */
const PLACEHOLDER_WIDGET_TYPES = [
  "wordpress",
  "sidebar",
  "wp-block",
  "search",
  "minimalist",
  "pages",
  "calendar",
  "archives",
  "recent-posts",
  "recent-comments",
  "rss",
  "tag-cloud",
  "navigation-menu",
  "custom-html",
  "block",
] as const;

/** WordPress widgets with real media renderers (not title-only placeholders). */
const REAL_RENDER_WP_WIDGET_TYPES = ["wp-image", "wp-video"] as const;

const ALL_WP_COMPAT_TYPES = [...PLACEHOLDER_WIDGET_TYPES, ...REAL_RENDER_WP_WIDGET_TYPES] as const;

function renderWidget(type: string, props: Record<string, unknown> = {}): string {
  const widget = getBuilderWidget(type);
  if (!widget) {
    throw new Error(`Widget not registered: ${type}`);
  }
  const element: BuilderElement = {
    id: `test-${type}`,
    type,
    props: { ...structuredClone(widget.defaultProps), ...props },
  };
  return renderToStaticMarkup(widget.render({ element, children: null }));
}

function videoTag(html: string): string {
  return html.match(/<video[^>]*\/?>/)?.[0] ?? "";
}

describe("WordPress / placeholder widgets", () => {
  describe("registration", () => {
    it.each(ALL_WP_COMPAT_TYPES)("should register the %s widget", (type) => {
      const widget = getBuilderWidget(type);
      expect(widget).toBeDefined();
      expect(widget?.type).toBe(type);
      expect(widget?.render).toBeTypeOf("function");
    });
  });

  describe("placeholder stubs", () => {
    it.each(PLACEHOLDER_WIDGET_TYPES.filter((type) => type !== "sidebar"))(
      "should render an npb-placeholder for %s",
      (type) => {
        const html = renderWidget(type);

        expect(html).toContain('class="npb-placeholder"');
        expect(html).not.toContain("<img");
        expect(html).not.toContain("<video");
      },
    );

    it("should render the sidebar availability message", () => {
      const html = renderWidget("sidebar");

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("No sidebars are available in this site.");
    });

    it("should render the wordpress widget title from props", () => {
      const html = renderWidget("wordpress", { title: "Legacy Widget Area" });

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Legacy Widget Area");
    });

    it("should render generated stub titles from props", () => {
      const html = renderWidget("calendar", { title: "Events Calendar" });

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Events Calendar");
    });
  });

  describe("wp-image real renderer", () => {
    const SAMPLE_SRC = "https://cdn.example.com/wp-photo.jpg";

    it("should render src and alt on the img element", () => {
      const html = renderWidget("wp-image", {
        src: SAMPLE_SRC,
        alt: "WordPress media",
        link: "",
      });

      expect(html).toContain('class="npb-image"');
      expect(html).toContain(`src="${SAMPLE_SRC}"`);
      expect(html).toContain('alt="WordPress media"');
      expect(html).not.toContain('class="npb-placeholder"');
    });

    it("should wrap the image in an anchor when link is set", () => {
      const html = renderWidget("wp-image", {
        src: SAMPLE_SRC,
        alt: "Linked WP image",
        link: "https://example.com/gallery",
      });

      expect(html).toContain('href="https://example.com/gallery"');
      expect(html).toMatch(/<a href="https:\/\/example.com\/gallery">[\s\S]*<img/);
    });

    it("should not wrap the image when link is empty", () => {
      const html = renderWidget("wp-image", {
        src: SAMPLE_SRC,
        alt: "Plain image",
        link: "",
      });

      expect(html).not.toContain("<a ");
      expect(html).toContain("<img");
    });
  });

  describe("wp-video real renderer", () => {
    const SAMPLE_SRC = "https://cdn.example.com/wp-clip.mp4";
    const SAMPLE_POSTER = "https://cdn.example.com/wp-poster.jpg";

    it("should render a placeholder when src is empty", () => {
      const html = renderWidget("wp-video", { src: "" });

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add a video URL");
      expect(html).not.toContain("<video");
      expect(html).not.toMatch(/\ssrc=""/);
    });

    it("should render src on the video element", () => {
      const html = renderWidget("wp-video", { src: SAMPLE_SRC });

      expect(videoTag(html)).toContain(`src="${SAMPLE_SRC}"`);
      expect(videoTag(html)).toContain("controls");
      expect(html).not.toContain('class="npb-placeholder"');
    });

    it("should render poster when provided", () => {
      const html = renderWidget("wp-video", {
        src: SAMPLE_SRC,
        poster: SAMPLE_POSTER,
      });

      expect(videoTag(html)).toContain(`poster="${SAMPLE_POSTER}"`);
    });

    it("should omit poster when poster url is empty", () => {
      const html = renderWidget("wp-video", {
        src: SAMPLE_SRC,
        poster: "",
      });

      expect(videoTag(html)).not.toContain("poster=");
    });

    it("should render autoplay and loop when enabled", () => {
      const html = renderWidget("wp-video", {
        src: SAMPLE_SRC,
        autoplay: true,
        loop: true,
      });
      const tag = videoTag(html);

      expect(tag).toContain("autoPlay");
      expect(tag).toContain("loop");
    });

    it("should omit autoplay and loop when disabled", () => {
      const html = renderWidget("wp-video", {
        src: SAMPLE_SRC,
        autoplay: false,
        loop: false,
      });
      const tag = videoTag(html);

      expect(tag).not.toContain("autoPlay");
      expect(tag).not.toContain("loop");
    });
  });
});
