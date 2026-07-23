import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

const SAMPLE_SRC = "https://cdn.example.com/clip.mp4";
const SAMPLE_POSTER = "https://cdn.example.com/poster.jpg";

function renderVideo(element: BuilderElement, extras: BuilderElement[] = []) {
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

function videoTag(html: string): string {
  const match = html.match(/<video[^>]*\/?>/);
  return match?.[0] ?? "";
}

describe("video widget settings", () => {
  describe("general props", () => {
    it("should render src on the video element", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };

      const html = renderVideo(video);

      expect(html).toContain(`data-npb-id="${video.id}"`);
      expect(html).toContain('class="npb-video"');
      expect(videoTag(html)).toContain(`src="${SAMPLE_SRC}"`);
    });

    it("should render a placeholder when src is empty", () => {
      const video = createBuilderElement("video");
      video.props = { src: "" };

      const html = renderVideo(video);

      expect(html).toContain('class="npb-video npb-video-empty"');
      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add a video URL");
      expect(html).not.toContain("<video");
      expect(html).not.toMatch(/\ssrc=""/);
    });

    it("should append a media fragment when start and end trim points are set", () => {
      const video = createBuilderElement("video");
      video.props = {
        src: SAMPLE_SRC,
        start: 0,
        end: 5,
      };

      const html = renderVideo(video);

      expect(videoTag(html)).toContain(`${SAMPLE_SRC}#t=0,5`);
    });

    it("should append a start-only media fragment when only start is set", () => {
      const video = createBuilderElement("video");
      video.props = {
        src: SAMPLE_SRC,
        start: 12,
        end: 0,
      };

      const html = renderVideo(video);

      expect(videoTag(html)).toContain(`${SAMPLE_SRC}#t=12`);
    });

    it("should omit the media fragment when start and end are zero", () => {
      const video = createBuilderElement("video");
      video.props = {
        src: SAMPLE_SRC,
        start: 0,
        end: 0,
      };

      const html = renderVideo(video);

      expect(videoTag(html)).toContain(`src="${SAMPLE_SRC}"`);
      expect(videoTag(html)).not.toContain("#t=");
    });

    it("should render poster only when posterEnabled is true", () => {
      const enabled = createBuilderElement("video");
      enabled.props = {
        src: SAMPLE_SRC,
        posterEnabled: true,
        poster: SAMPLE_POSTER,
      };

      const disabled = createBuilderElement("video");
      disabled.props = {
        src: SAMPLE_SRC,
        posterEnabled: false,
        poster: SAMPLE_POSTER,
      };

      const enabledHtml = renderVideo(enabled);
      const disabledHtml = renderVideo(disabled);

      expect(videoTag(enabledHtml)).toContain(`poster="${SAMPLE_POSTER}"`);
      expect(videoTag(disabledHtml)).not.toContain("poster=");
    });

    it("should omit poster when posterEnabled is true but poster url is empty", () => {
      const video = createBuilderElement("video");
      video.props = {
        src: SAMPLE_SRC,
        posterEnabled: true,
        poster: "",
      };

      const html = renderVideo(video);

      expect(videoTag(html)).not.toContain("poster=");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };
      video.advanced = { cssId: "hero-video" };

      const html = renderVideo(video);

      expect(html).toContain('id="hero-video"');
      expect(html).toContain(`data-npb-id="${video.id}"`);
    });
  });

  describe("playback props", () => {
    it("should enable controls by default", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };

      const html = renderVideo(video);

      expect(videoTag(html)).toContain("controls");
    });

    it("should omit controls when disabled", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC, controls: false };

      const html = renderVideo(video);

      expect(videoTag(html)).not.toContain("controls");
    });

    it("should render autoplay, loop, and muted when enabled", () => {
      const video = createBuilderElement("video");
      video.props = {
        src: SAMPLE_SRC,
        autoplay: true,
        loop: true,
        muted: true,
      };

      const html = renderVideo(video);
      const tag = videoTag(html);

      expect(tag).toContain("autoPlay");
      expect(tag).toContain("loop");
      expect(tag).toContain("muted");
    });

    it("should omit loop and muted when disabled", () => {
      const video = createBuilderElement("video");
      video.props = {
        src: SAMPLE_SRC,
        loop: false,
        muted: false,
      };

      const html = renderVideo(video);
      const tag = videoTag(html);

      expect(tag).not.toContain("loop");
      expect(tag).not.toContain("muted");
    });

    it("should play inline by default", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };

      const html = renderVideo(video);

      expect(videoTag(html)).toContain("playsInline");
    });

    it("should omit playsInline when disabled", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC, playsInline: false };

      const html = renderVideo(video);

      expect(videoTag(html)).not.toContain("playsInline");
    });

    it.each(["metadata", "auto", "none"] as const)(
      "should render preload=%s",
      (preload) => {
        const video = createBuilderElement("video");
        video.props = { src: SAMPLE_SRC, preload };

        const html = renderVideo(video);

        expect(videoTag(html)).toContain(`preload="${preload}"`);
      },
    );

    it("should hide the download button when download is disabled", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC, download: false };

      const html = renderVideo(video);

      expect(videoTag(html)).toContain('controlsList="nodownload"');
    });

    it("should allow download by default", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC, download: true };

      const html = renderVideo(video);

      expect(videoTag(html)).not.toContain("controlsList");
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
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC, aspectRatio };

      const html = renderVideo(video);

      expect(videoWrapperStyle(html)).toContain(`padding-bottom:${padding}`);
    });

    it("should fall back to 16:9 padding for unknown aspect ratios", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC, aspectRatio: "invalid" };

      const html = renderVideo(video);

      expect(videoWrapperStyle(html)).toContain("padding-bottom:56.25%");
    });

    it("should preserve aspect ratio padding on the empty placeholder", () => {
      const video = createBuilderElement("video");
      video.props = { src: "", aspectRatio: "4:3" };

      const html = renderVideo(video);

      expect(html).toContain('class="npb-video npb-video-empty"');
      expect(videoWrapperStyle(html)).toContain("padding-bottom:75%");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS on the host wrapper", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };
      video.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderVideo(video), video.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
      expect(css).toContain("padding-left:8px");
    });

    it("should apply border styles on the host wrapper", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };
      video.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#334455",
            borderStyle: "solid",
          },
        },
      };

      const css = styleBlockFor(renderVideo(video), video.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#334455");
      expect(css).toContain("border-style:solid");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile spacing overrides", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };
      video.styles = {
        desktop: { normal: { marginBottom: "32px" } },
        tablet: { normal: { marginBottom: "24px" } },
        mobile: { normal: { marginBottom: "16px" } },
      };

      const html = renderVideo(video);

      expect(html).toContain(`[data-npb-id="${video.id}"]{margin-bottom:32px`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${video.id}"]{margin-bottom:24px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${video.id}"]{margin-bottom:16px}}`,
      );
    });

    it("should hide the video on selected breakpoints", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };
      video.advanced = { hideOnMobile: true };

      const html = renderVideo(video);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${video.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const video = createBuilderElement("video");
      video.props = { src: SAMPLE_SRC };
      video.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 300,
      };

      const html = renderVideo(video);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:300ms");
    });
  });
});
