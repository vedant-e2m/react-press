import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

const SAMPLE_QUERY = "5959 Shellmound St, Emeryville, CA 94608";

function renderMaps(element: BuilderElement, extras: BuilderElement[] = []) {
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

function mapsWrapper(html: string): string {
  const match = html.match(/<div class="npb-maps[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

function mapsWrapperStyle(html: string): string {
  return mapsWrapper(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

describe("google-maps widget settings", () => {
  describe("control wiring", () => {
    it("should expose default props and every map control", () => {
      const widget = getBuilderWidget("google-maps");

      expect(widget?.defaultProps).toEqual({
        query: "London Eye, London, United Kingdom",
        zoom: 10,
        height: 300,
        blur: 0,
        brightness: 100,
        contrast: 100,
        saturate: 100,
        hue: 0,
      });

      const contentSection = widget?.controls.find(
        (section) => section.label === "Map" && section.tab === "content",
      );
      const styleSection = widget?.controls.find(
        (section) => section.label === "Map" && section.tab === "style",
      );

      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "query",
        "zoom",
        "height",
      ]);
      expect(styleSection?.controls.map((control) => control.key)).toEqual([
        "blur",
        "brightness",
        "contrast",
        "saturate",
        "hue",
      ]);
    });
  });

  describe("content props", () => {
    it("should render an embed iframe for a location query", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY, zoom: 15, height: 280 };

      const html = renderMaps(maps);
      const src = decodeURIComponent(iframeSrc(html));

      expect(html).toContain(`data-npb-id="${maps.id}"`);
      expect(html).toContain('class="npb-maps"');
      expect(iframeTag(html)).toContain('title="Map"');
      expect(iframeTag(html)).toContain('loading="lazy"');
      expect(src).toContain("https://www.google.com/maps?q=");
      expect(src).toContain(SAMPLE_QUERY);
      expect(src).toContain("z=15");
      expect(src).toContain("output=embed");
    });

    it("should render a placeholder when query is empty", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: "" };

      const html = renderMaps(maps);

      expect(html).toContain('class="npb-maps npb-maps-empty"');
      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add a location");
      expect(html).not.toContain("<iframe");
      expect(html).not.toMatch(/\ssrc=""/);
    });

    it("should render a placeholder when query is whitespace only", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: "   " };

      const html = renderMaps(maps);

      expect(html).toContain('class="npb-maps npb-maps-empty"');
      expect(html).not.toContain("<iframe");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };
      maps.advanced = { cssId: "market-map" };

      const html = renderMaps(maps);

      expect(html).toContain('id="market-map"');
      expect(html).toContain(`data-npb-id="${maps.id}"`);
    });
  });

  describe("zoom and height", () => {
    it("should apply default zoom and height on the iframe", () => {
      const maps = createBuilderElement("google-maps");

      const html = renderMaps(maps);
      const src = decodeURIComponent(iframeSrc(html));

      expect(src).toContain("z=10");
      expect(iframeStyle(html)).toContain("height:300px");
      expect(iframeStyle(html)).toContain("width:100%");
      expect(iframeStyle(html)).toContain("border:0");
    });

    it("should apply custom zoom and height from props", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY, zoom: 18, height: 420 };

      const html = renderMaps(maps);

      expect(decodeURIComponent(iframeSrc(html))).toContain("z=18");
      expect(iframeStyle(html)).toContain("height:420px");
    });

    it("should coerce string zoom and height from serialized documents", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY, zoom: "12", height: "360" };

      const html = renderMaps(maps);

      expect(decodeURIComponent(iframeSrc(html))).toContain("z=12");
      expect(iframeStyle(html)).toContain("height:360px");
    });

    it("should preserve custom height on the empty placeholder", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: "", height: 166 };

      const html = renderMaps(maps);

      expect(html).toContain('class="npb-maps npb-maps-empty"');
      expect(mapsWrapperStyle(html)).toContain("height:166px");
    });
  });

  describe("filter props", () => {
    it("should apply default filter values on the iframe", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };

      const style = iframeStyle(renderMaps(maps));

      expect(style).toContain("blur(0px)");
      expect(style).toContain("brightness(100%)");
      expect(style).toContain("contrast(100%)");
      expect(style).toContain("saturate(100%)");
      expect(style).toContain("hue-rotate(0deg)");
    });

    it("should apply custom blur, brightness, contrast, saturate, and hue", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = {
        query: SAMPLE_QUERY,
        blur: 2,
        brightness: 105,
        contrast: 110,
        saturate: 120,
        hue: 10,
      };

      const style = iframeStyle(renderMaps(maps));

      expect(style).toContain("blur(2px)");
      expect(style).toContain("brightness(105%)");
      expect(style).toContain("contrast(110%)");
      expect(style).toContain("saturate(120%)");
      expect(style).toContain("hue-rotate(10deg)");
    });

    it("should coerce string filter values from serialized documents", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = {
        query: SAMPLE_QUERY,
        blur: "3",
        brightness: "90",
        contrast: "80",
        saturate: "70",
        hue: "45",
      };

      const style = iframeStyle(renderMaps(maps));

      expect(style).toContain("blur(3px)");
      expect(style).toContain("brightness(90%)");
      expect(style).toContain("contrast(80%)");
      expect(style).toContain("saturate(70%)");
      expect(style).toContain("hue-rotate(45deg)");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS on the host wrapper", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };
      maps.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderMaps(maps), maps.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
      expect(css).toContain("padding-left:8px");
    });

    it("should apply border styles on the host wrapper", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };
      maps.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#334455",
            borderStyle: "solid",
          },
        },
      };

      const css = styleBlockFor(renderMaps(maps), maps.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#334455");
      expect(css).toContain("border-style:solid");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile spacing overrides", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };
      maps.styles = {
        desktop: { normal: { marginBottom: "32px" } },
        tablet: { normal: { marginBottom: "24px" } },
        mobile: { normal: { marginBottom: "16px" } },
      };

      const html = renderMaps(maps);

      expect(html).toContain(`[data-npb-id="${maps.id}"]{margin-bottom:32px`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${maps.id}"]{margin-bottom:24px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${maps.id}"]{margin-bottom:16px}}`,
      );
    });

    it("should hide the widget on selected breakpoints", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };
      maps.advanced = { hideOnMobile: true };

      const html = renderMaps(maps);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${maps.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const maps = createBuilderElement("google-maps");
      maps.props = { query: SAMPLE_QUERY };
      maps.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 300,
      };

      const html = renderMaps(maps);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:300ms");
    });
  });
});
