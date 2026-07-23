import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

const SAMPLE_SRC = "https://soundcloud.com/forss/flickermood";

function renderAudio(element: BuilderElement, extras: BuilderElement[] = []) {
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

function iframeTag(html: string): string {
  const match = html.match(/<iframe[^>]*\/?>/);
  return match?.[0] ?? "";
}

function iframeSrc(html: string): string {
  return iframeTag(html).match(/src="([^"]*)"/)?.[1] ?? "";
}

function iframeStyle(html: string): string {
  return iframeTag(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

function soundCloudParams(html: string): URLSearchParams {
  const src = iframeSrc(html).replace(/&amp;/g, "&");
  const query = src.split("?")[1] ?? "";
  return new URLSearchParams(query);
}

describe("audio widget settings", () => {
  describe("control wiring", () => {
    it("should expose every user-facing prop in the content controls", () => {
      const widget = getBuilderWidget("audio");
      const controlKeys = widget?.controls.flatMap((section) =>
        section.controls.map((control) => control.key),
      );

      expect(controlKeys).toEqual(
        expect.arrayContaining([
          "src",
          "visual",
          "autoplay",
          "buy",
          "like",
          "download",
          "share",
          "comments",
          "playCount",
          "username",
          "artwork",
          "height",
        ]),
      );
    });

    it("should ship SoundCloud defaults for every toggle", () => {
      expect(getBuilderWidget("audio")?.defaultProps).toEqual({
        src: "",
        visual: true,
        autoplay: false,
        buy: true,
        like: true,
        download: true,
        share: true,
        comments: true,
        playCount: true,
        username: true,
        artwork: true,
        height: 200,
      });
    });
  });

  describe("general props", () => {
    it("should render a SoundCloud iframe for a track URL", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };

      const html = renderAudio(audio);
      const params = soundCloudParams(html);

      expect(html).toContain(`data-npb-id="${audio.id}"`);
      expect(html).toContain('class="npb-audio"');
      expect(iframeTag(html)).toContain('title="SoundCloud"');
      expect(iframeTag(html)).toContain('loading="lazy"');
      expect(iframeTag(html)).toContain('allow="autoplay"');
      expect(params.get("url")).toBe(SAMPLE_SRC);
      expect(iframeSrc(html)).toContain("https://w.soundcloud.com/player/");
    });

    it("should render a placeholder when src is empty", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: "" };

      const html = renderAudio(audio);

      expect(html).toContain('class="npb-audio npb-audio-empty"');
      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add a SoundCloud link");
      expect(html).not.toContain("<iframe");
      expect(html).not.toMatch(/\ssrc=""/);
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };
      audio.advanced = { cssId: "hero-audio" };

      const html = renderAudio(audio);

      expect(html).toContain('id="hero-audio"');
      expect(html).toContain(`data-npb-id="${audio.id}"`);
    });
  });

  describe("SoundCloud player options", () => {
    it("should enable visual player by default", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };

      expect(soundCloudParams(renderAudio(audio)).get("visual")).toBe("true");
    });

    it("should disable visual player when turned off", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC, visual: false };

      expect(soundCloudParams(renderAudio(audio)).get("visual")).toBe("false");
    });

    it("should omit autoplay by default", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };

      expect(soundCloudParams(renderAudio(audio)).get("auto_play")).toBe("false");
    });

    it("should enable autoplay when requested", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC, autoplay: true };

      expect(soundCloudParams(renderAudio(audio)).get("auto_play")).toBe("true");
    });

    it.each([
      ["buy", "buying"],
      ["like", "liking"],
      ["download", "download"],
      ["share", "sharing"],
      ["comments", "show_comments"],
      ["playCount", "show_playcount"],
      ["username", "show_user"],
      ["artwork", "show_artwork"],
    ] as const)("should enable %s by default via %s", (prop, param) => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };

      expect(soundCloudParams(renderAudio(audio)).get(param)).toBe("true");
    });

    it.each([
      ["buy", "buying"],
      ["like", "liking"],
      ["download", "download"],
      ["share", "sharing"],
      ["comments", "show_comments"],
      ["playCount", "show_playcount"],
      ["username", "show_user"],
      ["artwork", "show_artwork"],
    ] as const)("should disable %s via %s when turned off", (prop, param) => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC, [prop]: false };

      expect(soundCloudParams(renderAudio(audio)).get(param)).toBe("false");
    });
  });

  describe("height", () => {
    it("should apply the default height on the iframe", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };

      expect(iframeStyle(renderAudio(audio))).toContain("height:200px");
      expect(iframeStyle(renderAudio(audio))).toContain("width:100%");
      expect(iframeStyle(renderAudio(audio))).toContain("border:0");
    });

    it("should apply a custom height from props", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC, height: 166 };

      expect(iframeStyle(renderAudio(audio))).toContain("height:166px");
    });

    it("should preserve custom height on the empty placeholder", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: "", height: 166 };

      const html = renderAudio(audio);

      expect(html).toContain('class="npb-audio npb-audio-empty"');
      expect(html).toMatch(/style="[^"]*height:166px/);
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS on the host wrapper", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };
      audio.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderAudio(audio), audio.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
      expect(css).toContain("padding-left:8px");
    });

    it("should apply border styles on the host wrapper", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };
      audio.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#334455",
            borderStyle: "solid",
          },
        },
      };

      const css = styleBlockFor(renderAudio(audio), audio.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#334455");
      expect(css).toContain("border-style:solid");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile spacing overrides", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };
      audio.styles = {
        desktop: { normal: { marginBottom: "32px" } },
        tablet: { normal: { marginBottom: "24px" } },
        mobile: { normal: { marginBottom: "16px" } },
      };

      const html = renderAudio(audio);

      expect(html).toContain(`[data-npb-id="${audio.id}"]{margin-bottom:32px`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${audio.id}"]{margin-bottom:24px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${audio.id}"]{margin-bottom:16px}}`,
      );
    });

    it("should hide the widget on selected breakpoints", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };
      audio.advanced = { hideOnMobile: true };

      const html = renderAudio(audio);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${audio.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const audio = createBuilderElement("audio");
      audio.props = { src: SAMPLE_SRC };
      audio.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 300,
      };

      const html = renderAudio(audio);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:300ms");
    });
  });
});
