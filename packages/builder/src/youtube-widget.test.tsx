import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

const SAMPLE_WATCH_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const SAMPLE_VIDEO_ID = "dQw4w9WgXcQ";

function renderYoutube(element: BuilderElement, extras: BuilderElement[] = []) {
  const document = {
    ...EMPTY_BUILDER_DOCUMENT,
    content: [element, ...extras],
  };
  return renderToStaticMarkup(<BuilderRenderer document={document} />);
}

function styleBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function videoWrapperStyle(html: string): string {
  const match = html.match(/class="npb-video[^"]*" style="([^"]*)"/);
  return match?.[1] ?? "";
}

function iframeTag(html: string): string {
  const match = html.match(/<iframe[^>]*\/?>/);
  return match?.[0] ?? "";
}

function iframeSrc(html: string): string {
  return iframeTag(html).match(/src="([^"]*)"/)?.[1] ?? "";
}

describe("youtube widget settings", () => {
  describe("control wiring", () => {
    it("should expose every user-facing prop in the content controls", () => {
      const widget = getBuilderWidget("youtube");
      const controlKeys = widget?.controls.flatMap((section) =>
        section.controls.map((control) => control.key),
      );

      expect(controlKeys).toEqual(
        expect.arrayContaining([
          "videoUrl",
          "title",
          "start",
          "end",
          "aspectRatio",
          "autoplay",
          "mute",
          "loop",
          "lazyload",
          "playerControls",
          "captions",
          "privacyMode",
          "rel",
        ]),
      );
    });
  });

  describe("general props", () => {
    it("should render an embed iframe for a watch URL", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = {
        videoUrl: SAMPLE_WATCH_URL,
        title: "Sample clip",
      };

      const html = renderYoutube(youtube);
      const src = decodeURIComponent(iframeSrc(html));

      expect(html).toContain(`data-npb-id="${youtube.id}"`);
      expect(html).toContain('class="npb-video"');
      expect(src).toContain("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(iframeTag(html)).toContain('title="Sample clip"');
      expect(iframeTag(html)).toContain("allowFullScreen");
    });

    it("should render a placeholder when the video URL and id are empty", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: "", videoId: "" };

      const html = renderYoutube(youtube);

      expect(html).toContain('class="npb-video npb-video-empty"');
      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add a YouTube URL");
      expect(html).not.toContain("<iframe");
    });

    it.each([
      ["watch URL", SAMPLE_WATCH_URL, SAMPLE_VIDEO_ID],
      ["youtu.be URL", "https://youtu.be/dQw4w9WgXcQ", SAMPLE_VIDEO_ID],
      ["embed URL", "https://www.youtube.com/embed/dQw4w9WgXcQ", SAMPLE_VIDEO_ID],
      ["shorts URL", "https://www.youtube.com/shorts/dQw4w9WgXcQ", SAMPLE_VIDEO_ID],
    ] as const)("should parse a %s", (_label, videoUrl, videoId) => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl };

      const src = decodeURIComponent(iframeSrc(renderYoutube(youtube)));

      expect(src).toContain(`/embed/${videoId}`);
    });

    it("should fall back to videoId when videoUrl is empty", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: "", videoId: SAMPLE_VIDEO_ID };

      const src = decodeURIComponent(iframeSrc(renderYoutube(youtube)));

      expect(src).toContain(`/embed/${SAMPLE_VIDEO_ID}`);
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };
      youtube.advanced = { cssId: "hero-youtube" };

      const html = renderYoutube(youtube);

      expect(html).toContain('id="hero-youtube"');
      expect(html).toContain(`data-npb-id="${youtube.id}"`);
    });
  });

  describe("playback props", () => {
    it("should omit optional query params by default", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };

      const src = iframeSrc(renderYoutube(youtube));

      expect(src).not.toContain("autoplay=");
      expect(src).not.toContain("mute=");
      expect(src).not.toContain("loop=");
      expect(src).not.toContain("start=");
      expect(src).not.toContain("end=");
      expect(src).not.toContain("cc_load_policy=");
      expect(src).not.toContain("rel=0");
      expect(src).not.toContain("controls=0");
    });

    it("should append autoplay, mute, loop, start, end, captions, and rel params when enabled", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = {
        videoUrl: SAMPLE_WATCH_URL,
        autoplay: true,
        mute: true,
        loop: true,
        start: 10,
        end: 120,
        captions: true,
        rel: false,
      };

      const src = decodeURIComponent(iframeSrc(renderYoutube(youtube)));

      expect(src).toContain("autoplay=1");
      expect(src).toContain("mute=1");
      expect(src).toContain("loop=1");
      expect(src).toContain(`playlist=${SAMPLE_VIDEO_ID}`);
      expect(src).toContain("start=10");
      expect(src).toContain("end=120");
      expect(src).toContain("cc_load_policy=1");
      expect(src).toContain("rel=0");
    });

    it("should hide player controls when disabled", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = {
        videoUrl: SAMPLE_WATCH_URL,
        playerControls: false,
      };

      const src = iframeSrc(renderYoutube(youtube));

      expect(src).toContain("controls=0");
    });

    it("should use the nocookie host when privacy mode is enabled", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = {
        videoUrl: SAMPLE_WATCH_URL,
        privacyMode: true,
      };

      const src = iframeSrc(renderYoutube(youtube));

      expect(src).toContain("https://www.youtube-nocookie.com/embed/");
      expect(src).not.toContain("www.youtube.com/embed/");
    });

    it("should lazy-load the iframe by default", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };

      expect(iframeTag(renderYoutube(youtube))).toContain('loading="lazy"');
    });

    it("should eager-load the iframe when lazy load is disabled", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL, lazyload: false };

      expect(iframeTag(renderYoutube(youtube))).toContain('loading="eager"');
    });
  });

  describe("aspect ratio", () => {
    it.each([
      ["16:9", "56.25%"],
      ["21:9", "42.85%"],
      ["4:3", "75%"],
      ["1:1", "100%"],
      ["9:16", "177.77%"],
    ] as const)("should apply %s padding-bottom on the wrapper", (aspectRatio, padding) => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL, aspectRatio };

      const html = renderYoutube(youtube);

      expect(videoWrapperStyle(html)).toContain(`padding-bottom:${padding}`);
    });

    it("should fall back to 16:9 padding for unknown aspect ratios", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL, aspectRatio: "invalid" };

      expect(videoWrapperStyle(renderYoutube(youtube))).toContain("padding-bottom:56.25%");
    });

    it("should preserve aspect ratio padding on the empty placeholder", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: "", videoId: "", aspectRatio: "4:3" };

      const html = renderYoutube(youtube);

      expect(html).toContain('class="npb-video npb-video-empty"');
      expect(videoWrapperStyle(html)).toContain("padding-bottom:75%");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS on the host wrapper", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };
      youtube.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderYoutube(youtube), youtube.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
      expect(css).toContain("padding-left:8px");
    });

    it("should apply border styles on the host wrapper", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };
      youtube.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#334455",
            borderStyle: "solid",
          },
        },
      };

      const css = styleBlockFor(renderYoutube(youtube), youtube.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#334455");
      expect(css).toContain("border-style:solid");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile spacing overrides", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };
      youtube.styles = {
        desktop: { normal: { marginBottom: "32px" } },
        tablet: { normal: { marginBottom: "24px" } },
        mobile: { normal: { marginBottom: "16px" } },
      };

      const html = renderYoutube(youtube);

      expect(html).toContain(`[data-npb-id="${youtube.id}"]{margin-bottom:32px`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${youtube.id}"]{margin-bottom:24px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${youtube.id}"]{margin-bottom:16px}}`,
      );
    });

    it("should hide the widget on selected breakpoints", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };
      youtube.advanced = { hideOnMobile: true };

      const html = renderYoutube(youtube);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${youtube.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const youtube = createBuilderElement("youtube");
      youtube.props = { videoUrl: SAMPLE_WATCH_URL };
      youtube.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 300,
      };

      const html = renderYoutube(youtube);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:300ms");
    });
  });
});
