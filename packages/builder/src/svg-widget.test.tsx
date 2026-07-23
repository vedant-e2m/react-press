import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

const SAMPLE_SRC = "https://cdn.example.com/icon.svg";

function renderSvg(element: BuilderElement, extras: BuilderElement[] = []) {
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

function imgStyleBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\] img\\.npb-svg\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function hoverImgBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\] img\\.npb-svg:hover\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

describe("svg widget settings", () => {
  describe("widget registration", () => {
    it("should expose src and title controls with defaults", () => {
      const widget = getBuilderWidget("svg");

      expect(widget?.defaultProps).toEqual({ src: "", title: "SVG image" });
      expect(widget?.controls).toEqual([
        expect.objectContaining({
          label: "Content",
          controls: [
            expect.objectContaining({ key: "src", label: "SVG", type: "url" }),
          ],
        }),
        expect.objectContaining({
          label: "Settings",
          controls: [
            expect.objectContaining({ key: "title", label: "Title", type: "text", defaultValue: "SVG image" }),
          ],
        }),
      ]);
    });
  });

  describe("content props", () => {
    it("should render src and title alt text on the img element", () => {
      const svg = createBuilderElement("svg");
      svg.props = {
        src: SAMPLE_SRC,
        title: "Bookmark icon",
      };

      const html = renderSvg(svg);

      expect(html).toContain(`data-npb-id="${svg.id}"`);
      expect(html).toContain('<figure');
      expect(html).toContain('class="npb-svg-widget"');
      expect(html).toContain('class="npb-svg"');
      expect(html).toContain(`src="${SAMPLE_SRC}"`);
      expect(html).toContain('alt="Bookmark icon"');
    });

    it("should fall back to the default title for alt text", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "" };

      const html = renderSvg(svg);

      expect(html).toContain('alt="SVG image"');
    });

    it("should render a placeholder when src is empty", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: "", title: "SVG image" };

      const html = renderSvg(svg);

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add an SVG URL");
      expect(html).not.toContain("<img");
      expect(html).not.toMatch(/\ssrc=""/);
    });

    it("should apply css id from advanced settings onto the figure host", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Logo" };
      svg.advanced = { cssId: "site-logo" };

      const html = renderSvg(svg);

      expect(html).toContain('id="site-logo"');
      expect(html).toContain(`data-npb-id="${svg.id}"`);
    });
  });

  describe("style panel size settings", () => {
    it("should apply style-panel width, height, and object-fit on the img selector", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.styles = {
        desktop: {
          normal: {
            width: "100%",
            height: 120,
            objectFit: "contain",
            borderRadius: 8,
            marginBottom: 24,
          },
        },
      };

      const html = renderSvg(svg);
      const imgCss = imgStyleBlockFor(html, svg.id);
      const hostCss = styleBlockFor(html, svg.id);

      expect(imgCss).toContain("width:100%");
      expect(imgCss).toContain("height:120px");
      expect(imgCss).toContain("object-fit:contain");
      expect(imgCss).toContain("border-radius:8px");
      expect(hostCss).toContain("margin-bottom:24px");
      expect(hostCss).not.toContain("object-fit:contain");
    });

    it("should preserve percentage width without appending px", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.styles = {
        desktop: {
          normal: {
            width: "80%",
            maxWidth: "320px",
          },
        },
      };

      const html = renderSvg(svg);
      const imgCss = imgStyleBlockFor(html, svg.id);

      expect(imgCss).toContain("width:80%");
      expect(imgCss).toContain("max-width:320px");
      expect(imgCss).not.toContain("80%px");
    });

    it("should emit tablet and mobile img size overrides", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.styles = {
        desktop: { normal: { width: "200px", height: 200 } },
        tablet: { normal: { width: "160px" } },
        mobile: { normal: { width: "100%", height: 120 } },
      };

      const html = renderSvg(svg);

      expect(html).toContain(`[data-npb-id="${svg.id}"] img.npb-svg{width:200px;height:200px}`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${svg.id}"] img.npb-svg{width:160px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${svg.id}"] img.npb-svg{width:100%;height:120px}}`,
      );
    });
  });

  describe("style panel spacing and layout", () => {
    it("should apply margin and padding on the figure host", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.styles = {
        desktop: {
          normal: {
            marginTop: "8px",
            marginBottom: "16px",
            paddingLeft: "10px",
          },
        },
      };

      const css = styleBlockFor(renderSvg(svg), svg.id);

      expect(css).toContain("margin-top:8px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:10px");
    });
  });

  describe("style panel border and effects", () => {
    it("should apply border styles on the img selector", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            boxShadow: "0 8px 24px #0000001a",
          },
        },
      };

      const imgCss = imgStyleBlockFor(renderSvg(svg), svg.id);

      expect(imgCss).toContain("border-width:2px");
      expect(imgCss).toContain("border-color:#00aa55");
      expect(imgCss).toContain("border-style:dashed");
      expect(imgCss).toContain("box-shadow:0 8px 24px #0000001a");
    });

    it("should emit hover opacity on the img selector", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.7 },
        },
      };

      const html = renderSvg(svg);

      expect(imgStyleBlockFor(html, svg.id)).toContain("opacity:1");
      expect(hoverImgBlockFor(html, svg.id)).toContain("opacity:0.7");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the svg on selected breakpoints", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.advanced = { hideOnMobile: true };

      const html = renderSvg(svg);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${svg.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the figure host", () => {
      const svg = createBuilderElement("svg");
      svg.props = { src: SAMPLE_SRC, title: "Icon" };
      svg.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderSvg(svg);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
