import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderGrid(element: BuilderElement, extras: BuilderElement[] = []) {
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

function hoverBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]:hover\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function inlineStyleFor(html: string, id: string): string {
  const match = html.match(new RegExp(`data-npb-id="${id}"[^>]*style="([^"]*)"`));
  return match?.[1] ?? "";
}

describe("grid widget settings", () => {
  describe("general props", () => {
    it("should render the selected semantic HTML tag as the layout host", () => {
      const grid = createBuilderElement("grid");
      grid.props = {
        tag: "section",
        columns: 3,
        rows: 1,
        gap: 16,
        justify: "stretch",
        align: "stretch",
      };

      const html = renderGrid(grid);

      expect(html).toContain(`data-npb-id="${grid.id}"`);
      expect(html).toContain("<section");
      expect(html).toContain('class="npb-grid"');
      expect(html).not.toMatch(/<div[^>]*class="npb-grid"/);
    });

    it("should apply css id from advanced settings onto the host element", () => {
      const grid = createBuilderElement("grid");
      grid.advanced = { cssId: "hero-grid" };

      const html = renderGrid(grid);

      expect(html).toContain('id="hero-grid"');
      expect(html).toContain(`data-npb-id="${grid.id}"`);
    });

    it("should not wrap the grid in an extra layout chrome div", () => {
      const grid = createBuilderElement("grid");
      grid.id = "solo-grid";

      const html = renderGrid(grid);

      expect(html).toMatch(/<(div|section|article)[^>]*data-npb-id="solo-grid"[^>]*class="npb-grid"/);
      expect(html).not.toMatch(
        /data-npb-id="solo-grid"[^>]*>[\s\S]*<div class="npb-grid"/,
      );
    });
  });

  describe("default grid layout", () => {
    it("should emit default display grid from element creation", () => {
      const grid = createBuilderElement("grid");

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("display:grid");
    });

    it("should apply default columns, rows, gap, justify, and align as inline styles on the host", () => {
      const grid = createBuilderElement("grid");

      const inline = inlineStyleFor(renderGrid(grid), grid.id);

      expect(inline).toContain("display:grid");
      expect(inline).toContain("grid-template-columns:repeat(3, minmax(0, 1fr))");
      expect(inline).toContain("grid-template-rows:repeat(1, minmax(0, auto))");
      expect(inline).toContain("gap:16px");
      expect(inline).toContain("justify-items:stretch");
      expect(inline).toContain("align-items:stretch");
    });
  });

  describe("grid layout props", () => {
    it("should apply columns, rows, gap, justify items, and align items", () => {
      const grid = createBuilderElement("grid");
      grid.props = {
        tag: "div",
        columns: 4,
        rows: 2,
        gap: 24,
        justify: "center",
        align: "end",
      };

      const inline = inlineStyleFor(renderGrid(grid), grid.id);

      expect(inline).toContain("display:grid");
      expect(inline).toContain("grid-template-columns:repeat(4, minmax(0, 1fr))");
      expect(inline).toContain("grid-template-rows:repeat(2, minmax(0, auto))");
      expect(inline).toContain("gap:24px");
      expect(inline).toContain("justify-items:center");
      expect(inline).toContain("align-items:end");
    });

    it("should apply start justify and align choices", () => {
      const grid = createBuilderElement("grid");
      grid.props = {
        tag: "div",
        columns: 2,
        rows: 1,
        gap: 8,
        justify: "start",
        align: "start",
      };

      const inline = inlineStyleFor(renderGrid(grid), grid.id);

      expect(inline).toContain("justify-items:start");
      expect(inline).toContain("align-items:start");
    });

    it("should make nested children direct grid items of the host", () => {
      const parent = createBuilderElement("grid");
      parent.id = "grid-parent";
      parent.props = {
        tag: "div",
        columns: 2,
        rows: 1,
        gap: 12,
        justify: "stretch",
        align: "stretch",
      };

      const childA = createBuilderElement("heading");
      childA.id = "child-a";
      childA.props = { text: "A", tag: "h3" };

      const childB = createBuilderElement("heading");
      childB.id = "child-b";
      childB.props = { text: "B", tag: "h3" };

      parent.children = [childA, childB];

      const html = renderGrid(parent);
      const inline = inlineStyleFor(html, parent.id);

      expect(inline).toContain("display:grid");
      expect(inline).toContain("grid-template-columns:repeat(2, minmax(0, 1fr))");
      expect(html).toMatch(
        /data-npb-id="grid-parent"[^>]*>[\s\S]*data-npb-id="child-a"[\s\S]*data-npb-id="child-b"/,
      );
      expect(html).not.toMatch(
        /data-npb-id="grid-parent"[^>]*>[\s\S]*<div class="npb-grid">[\s\S]*data-npb-id="child-a"/,
      );
      // Children must sit on the host — no nested layout chrome between host and kids.
      expect(html).toMatch(
        /data-npb-id="grid-parent"[^>]*class="npb-grid"[^>]*>[\s]*<(div|h[1-6]|section|p)/,
      );
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            width: "320px",
            height: "180px",
            minWidth: "120px",
            minHeight: "80px",
            maxWidth: "640px",
            maxHeight: "400px",
            overflow: "hidden",
            aspectRatio: "16 / 9",
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("width:320px");
      expect(css).toContain("height:180px");
      expect(css).toContain("min-width:120px");
      expect(css).toContain("min-height:80px");
      expect(css).toContain("max-width:640px");
      expect(css).toContain("max-height:400px");
      expect(css).toContain("overflow:hidden");
      expect(css).toContain("aspect-ratio:16 / 9");
    });

    it("should preserve percentage width and height without appending px", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            width: "100%",
            height: "50%",
            maxWidth: "80%",
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("width:100%");
      expect(css).toContain("height:50%");
      expect(css).toContain("max-width:80%");
      expect(css).not.toContain("100%px");
      expect(css).not.toContain("50%px");
    });

    it("should accept numeric size values and serialize them with px", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            width: 240,
            height: 120,
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("width:240px");
      expect(css).toContain("height:120px");
    });
  });

  describe("spacing settings", () => {
    it("should apply margin and padding on all sides", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            marginTop: "8px",
            marginRight: "12px",
            marginBottom: "16px",
            marginLeft: "20px",
            paddingTop: "4px",
            paddingRight: "6px",
            paddingBottom: "8px",
            paddingLeft: "10px",
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("margin-top:8px");
      expect(css).toContain("margin-right:12px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("margin-left:20px");
      expect(css).toContain("padding-top:4px");
      expect(css).toContain("padding-right:6px");
      expect(css).toContain("padding-bottom:8px");
      expect(css).toContain("padding-left:10px");
    });
  });

  describe("position settings", () => {
    it("should apply position, offsets, z-index, and scroll margin", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            position: "absolute",
            top: "10px",
            right: "20px",
            bottom: "30px",
            left: "40px",
            zIndex: 5,
            scrollMarginTop: "64px",
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("position:absolute");
      expect(css).toContain("top:10px");
      expect(css).toContain("right:20px");
      expect(css).toContain("bottom:30px");
      expect(css).toContain("left:40px");
      expect(css).toContain("z-index:5");
      expect(css).toContain("scroll-margin-top:64px");
    });
  });

  describe("typography settings", () => {
    it("should apply typography CSS to the grid host", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
            color: "#112233",
            lineHeight: 1.4,
            letterSpacing: 1,
            textTransform: "uppercase",
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("font-family:Georgia, serif");
      expect(css).toContain("font-weight:700");
      expect(css).toContain("font-size:18px");
      expect(css).toContain("text-align:center");
      expect(css).toContain("color:#112233");
      expect(css).toContain("line-height:1.4");
      expect(css).toContain("letter-spacing:1px");
      expect(css).toContain("text-transform:uppercase");
    });
  });

  describe("background settings", () => {
    it("should apply classic background color and image settings", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            backgroundColor: "#f8fafc",
            backgroundImage: "url(https://example.com/bg.jpg)",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("background-color:#f8fafc");
      expect(css).toContain("background-image:url(https://example.com/bg.jpg)");
      expect(css).toContain("background-position:center center");
      expect(css).toContain("background-repeat:no-repeat");
      expect(css).toContain("background-size:cover");
    });
  });

  describe("border settings", () => {
    it("should apply border width, style, color, and radius", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: "#334155",
            borderRadius: 12,
          },
        },
      };

      const css = styleBlockFor(renderGrid(grid), grid.id);

      expect(css).toContain("border-style:solid");
      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#334155");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("advanced settings", () => {
    it("should emit hover background styles", () => {
      const grid = createBuilderElement("grid");
      grid.styles = {
        desktop: {
          normal: { display: "grid", backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderGrid(grid);
      const hover = hoverBlockFor(html, grid.id);

      expect(styleBlockFor(html, grid.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the grid on selected breakpoints", () => {
      const grid = createBuilderElement("grid");
      grid.advanced = { hideOnMobile: true };

      const html = renderGrid(grid);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${grid.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const grid = createBuilderElement("grid");
      grid.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderGrid(grid);
      const inline = inlineStyleFor(html, grid.id);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(inline).toContain("animation-delay:250ms");
    });

    it("should apply Advanced tab grid template columns via stylesheet on the same host", () => {
      const grid = createBuilderElement("grid");
      grid.props = {
        tag: "div",
        columns: 3,
        rows: 1,
        gap: 16,
        justify: "stretch",
        align: "stretch",
      };
      grid.styles = {
        desktop: {
          normal: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            paddingTop: 20,
            backgroundColor: "#ecfdf5",
          },
        },
      };

      const html = renderGrid(grid);
      const css = styleBlockFor(html, grid.id);

      expect(css).toContain("grid-template-columns:2fr 1fr");
      expect(css).toContain("padding-top:20px");
      expect(css).toContain("background-color:#ecfdf5");
      expect(html).toMatch(/data-npb-id="[^"]+"[^>]*class="npb-grid"/);
    });
  });
});
