import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderMenuAnchor(element: BuilderElement, extras: BuilderElement[] = []) {
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

function anchorSpan(html: string): string {
  const match = html.match(/<span[^>]*class="npb-anchor"[^>]*\/?>/);
  return match?.[0] ?? "";
}

function wrapperHost(html: string, id: string): string {
  const match = html.match(new RegExp(`<div[^>]*data-npb-id="${id}"[^>]*>`));
  return match?.[0] ?? "";
}

describe("menu-anchor widget settings", () => {
  describe("widget registration", () => {
    it("should expose the anchor id control with defaults", () => {
      const widget = getBuilderWidget("menu-anchor");
      const contentSection = widget?.controls.find((section) => section.label === "Menu Anchor");

      expect(widget?.defaultProps).toEqual({ id: "anchor" });
      expect(contentSection?.controls).toEqual([
        expect.objectContaining({
          key: "id",
          label: "The ID of Menu Anchor.",
          type: "text",
          defaultValue: "anchor",
        }),
      ]);
    });
  });

  describe("content props", () => {
    it("should render an invisible anchor span with the default id", () => {
      const anchor = createBuilderElement("menu-anchor");

      const html = renderMenuAnchor(anchor);
      const span = anchorSpan(html);

      expect(wrapperHost(html, anchor.id)).toContain(`data-npb-id="${anchor.id}"`);
      expect(span).toContain('id="anchor"');
      expect(span).toContain('class="npb-anchor"');
      expect(span).toContain('aria-hidden="true"');
      expect(html).not.toContain("Anchor:");
    });

    it("should render a custom anchor id from props", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.props = { id: "vendors" };

      const html = renderMenuAnchor(anchor);

      expect(anchorSpan(html)).toContain('id="vendors"');
    });

    it("should fall back to the default anchor id when id is empty", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.props = { id: "" };

      const html = renderMenuAnchor(anchor);

      expect(anchorSpan(html)).toContain('id="anchor"');
    });

    it("should fall back to the default anchor id when id is whitespace", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.props = { id: "   " };

      const html = renderMenuAnchor(anchor);

      expect(anchorSpan(html)).toContain('id="anchor"');
    });

    it("should apply css id from advanced settings onto the wrapper element", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.props = { id: "top" };
      anchor.advanced = { cssId: "page-top-anchor" };

      const html = renderMenuAnchor(anchor);

      expect(wrapperHost(html, anchor.id)).toContain('id="page-top-anchor"');
      expect(anchorSpan(html)).toContain('id="top"');
      expect(html).toContain(`data-npb-id="${anchor.id}"`);
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
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

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

      expect(css).toContain("width:320px");
      expect(css).toContain("height:180px");
      expect(css).toContain("min-width:120px");
      expect(css).toContain("min-height:80px");
      expect(css).toContain("max-width:640px");
      expect(css).toContain("max-height:400px");
      expect(css).toContain("overflow:hidden");
      expect(css).toContain("aspect-ratio:16 / 9");
    });
  });

  describe("layout settings", () => {
    it("should apply display, flex direction, justify, align, gap, and wrap", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "16px",
            flexWrap: "wrap",
          },
        },
      };

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

      expect(css).toContain("display:flex");
      expect(css).toContain("flex-direction:column");
      expect(css).toContain("justify-content:center");
      expect(css).toContain("align-items:flex-end");
      expect(css).toContain("gap:16px");
      expect(css).toContain("flex-wrap:wrap");
    });
  });

  describe("spacing settings", () => {
    it("should apply margin and padding on all sides", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
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

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

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
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
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

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

      expect(css).toContain("position:absolute");
      expect(css).toContain("top:10px");
      expect(css).toContain("right:20px");
      expect(css).toContain("bottom:30px");
      expect(css).toContain("left:40px");
      expect(css).toContain("z-index:5");
      expect(css).toContain("scroll-margin-top:64px");
    });
  });

  describe("background settings", () => {
    it("should apply classic background color and image settings", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
            backgroundColor: "#ff6600",
            backgroundImage: 'url("https://cdn.example.com/bg.jpg")',
            backgroundPosition: "center top",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
        },
      };

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

      expect(css).toContain("background-color:#ff6600");
      expect(css).toContain('background-image:url("https://cdn.example.com/bg.jpg")');
      expect(css).toContain("background-position:center top");
      expect(css).toContain("background-attachment:fixed");
      expect(css).toContain("background-repeat:no-repeat");
      expect(css).toContain("background-size:cover");
    });
  });

  describe("border settings", () => {
    it("should apply border width, color, style, and radius", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: {
            opacity: 0.75,
            boxShadow: "0 8px 24px #0000001a",
            mixBlendMode: "multiply",
            transform: "translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)",
            transition: "all 350ms ease",
          },
        },
      };

      const css = styleBlockFor(renderMenuAnchor(anchor), anchor.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile typography overrides", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: { normal: { fontSize: 18, color: "#111111" } },
        tablet: { normal: { fontSize: 16 } },
        mobile: { normal: { fontSize: 14, color: "#222222" } },
      };

      const html = renderMenuAnchor(anchor);

      expect(html).toContain(`[data-npb-id="${anchor.id}"]{font-size:18px;color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${anchor.id}"]{font-size:16px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${anchor.id}"]{font-size:14px;color:#222222}}`,
      );
    });

    it("should emit hover color styles", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.styles = {
        desktop: {
          normal: { color: "#333333" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
      };

      const html = renderMenuAnchor(anchor);
      const hover = hoverBlockFor(html, anchor.id);

      expect(styleBlockFor(html, anchor.id)).toContain("color:#333333");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
    });

    it("should hide the anchor wrapper on selected breakpoints", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.advanced = { hideOnMobile: true };

      const html = renderMenuAnchor(anchor);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${anchor.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const anchor = createBuilderElement("menu-anchor");
      anchor.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderMenuAnchor(anchor);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
