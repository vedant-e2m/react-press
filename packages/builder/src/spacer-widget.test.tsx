import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderSpacer(element: BuilderElement, extras: BuilderElement[] = []) {
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

function spacerHost(html: string, id: string): string {
  const match = html.match(new RegExp(`<div[^>]*data-npb-id="${id}"[^>]*>`));
  return match?.[0] ?? "";
}

describe("spacer widget settings", () => {
  describe("widget registration", () => {
    it("should expose the Space height control with responsive support", () => {
      const widget = getBuilderWidget("spacer");
      const contentSection = widget?.controls.find((section) => section.label === "Content");

      expect(widget?.defaultProps).toEqual({ height: 50 });
      expect(contentSection?.controls).toEqual([
        expect.objectContaining({
          key: "height",
          label: "Space",
          type: "range",
          min: 1,
          max: 500,
          defaultValue: 50,
          responsive: true,
        }),
      ]);
    });
  });

  describe("content props", () => {
    it("should apply the default Space height on the host element", () => {
      const spacer = createBuilderElement("spacer");

      const html = renderSpacer(spacer);

      expect(spacerHost(html, spacer.id)).toContain('class="npb-spacer"');
      expect(spacerHost(html, spacer.id)).toContain('aria-hidden="true"');
      expect(inlineStyleFor(html, spacer.id)).toContain("height:50px");
      expect(html).toContain(`data-npb-id="${spacer.id}"`);
      expect(html).not.toMatch(/<div[^>]*><div aria-hidden="true"/);
    });

    it("should apply a custom Space height from props", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 120 };

      const html = renderSpacer(spacer);

      expect(inlineStyleFor(html, spacer.id)).toContain("height:120px");
    });

    it("should coerce string height values from serialized documents", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: "80" };

      const html = renderSpacer(spacer);

      expect(inlineStyleFor(html, spacer.id)).toContain("height:80px");
    });

    it("should apply css id from advanced settings onto the host element", () => {
      const spacer = createBuilderElement("spacer");
      spacer.advanced = { cssId: "section-gap" };

      const html = renderSpacer(spacer);

      expect(spacerHost(html, spacer.id)).toContain('id="section-gap"');
      expect(html).toContain(`data-npb-id="${spacer.id}"`);
    });
  });

  describe("responsive Space heights", () => {
    it("should emit tablet and mobile height overrides from content props", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 100, heightTablet: 72, heightMobile: 40 };

      const html = renderSpacer(spacer);

      expect(inlineStyleFor(html, spacer.id)).toContain("height:100px");
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${spacer.id}"]{height:72px}}`);
      expect(html).toContain(`@media(max-width:767px){[data-npb-id="${spacer.id}"]{height:40px}}`);
    });

    it("should prefer style-panel height over responsive content props per breakpoint", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 100, heightTablet: 72, heightMobile: 40 };
      spacer.styles = {
        desktop: { normal: { height: 160 } },
        tablet: { normal: { height: 96 } },
        mobile: { normal: { height: 48 } },
      };

      const html = renderSpacer(spacer);
      const css = styleBlockFor(html, spacer.id);

      expect(inlineStyleFor(html, spacer.id)).not.toContain("height:");
      expect(css).toContain("height:160px");
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${spacer.id}"]{height:96px}}`);
      expect(html).toContain(`@media(max-width:767px){[data-npb-id="${spacer.id}"]{height:48px}}`);
      expect(html).not.toContain("height:72px");
      expect(html).not.toContain("height:40px");
    });

    it("should still apply mobile content height when the style panel has no mobile override", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 100, heightMobile: 40 };
      spacer.styles = {
        desktop: { normal: { height: 160 } },
        tablet: { normal: { height: 96 } },
      };

      const html = renderSpacer(spacer);

      expect(html).toContain(`@media(max-width:767px){[data-npb-id="${spacer.id}"]{height:40px}}`);
    });
  });

  describe("style panel size settings", () => {
    it("should prefer style-panel height over the Space prop on desktop", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 50 };
      spacer.styles = { desktop: { normal: { height: 200 } } };

      const html = renderSpacer(spacer);
      const css = styleBlockFor(html, spacer.id);

      expect(inlineStyleFor(html, spacer.id)).not.toContain("height:");
      expect(css).toContain("height:200px");
    });

    it("should apply width, min/max size, overflow, and aspect-ratio from the style panel", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 50 };
      spacer.styles = {
        desktop: {
          normal: {
            width: "320px",
            minHeight: "80px",
            maxHeight: "400px",
            overflow: "hidden",
            aspectRatio: "16 / 9",
          },
        },
      };

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

      expect(css).toContain("width:320px");
      expect(css).toContain("min-height:80px");
      expect(css).toContain("max-height:400px");
      expect(css).toContain("overflow:hidden");
      expect(css).toContain("aspect-ratio:16 / 9");
    });

    it("should preserve percentage width without appending px", () => {
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
        desktop: {
          normal: {
            width: "100%",
            maxWidth: "80%",
          },
        },
      };

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

      expect(css).toContain("width:100%");
      expect(css).toContain("max-width:80%");
      expect(css).not.toContain("100%px");
    });
  });

  describe("layout settings", () => {
    it("should apply display, flex direction, justify, align, gap, and wrap", () => {
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
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

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

      expect(css).toContain("display:flex");
      expect(css).toContain("flex-direction:column");
      expect(css).toContain("justify-content:center");
      expect(css).toContain("align-items:flex-end");
      expect(css).toContain("gap:16px");
      expect(css).toContain("flex-wrap:wrap");
    });
  });

  describe("spacing settings", () => {
    it("should apply margin and padding alongside the Space height", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 64 };
      spacer.styles = {
        desktop: {
          normal: {
            marginTop: "8px",
            marginBottom: "16px",
            paddingLeft: "10px",
          },
        },
      };

      const html = renderSpacer(spacer);
      const css = styleBlockFor(html, spacer.id);

      expect(inlineStyleFor(html, spacer.id)).toContain("height:64px");
      expect(css).toContain("margin-top:8px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:10px");
      expect(css).not.toContain("height:");
    });
  });

  describe("position settings", () => {
    it("should apply position, offsets, z-index, and scroll margin", () => {
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
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

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

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
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
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

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

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
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
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

      const css = styleBlockFor(renderSpacer(spacer), spacer.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile style-panel size overrides", () => {
      const spacer = createBuilderElement("spacer");
      spacer.props = { height: 50 };
      spacer.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderSpacer(spacer);

      expect(html).toContain(`[data-npb-id="${spacer.id}"]{width:600px;background-color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${spacer.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${spacer.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const spacer = createBuilderElement("spacer");
      spacer.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000" },
        },
      };

      const html = renderSpacer(spacer);
      const hover = hoverBlockFor(html, spacer.id);

      expect(styleBlockFor(html, spacer.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
    });

    it("should hide the spacer on selected breakpoints", () => {
      const spacer = createBuilderElement("spacer");
      spacer.advanced = { hideOnMobile: true };

      const html = renderSpacer(spacer);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${spacer.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const spacer = createBuilderElement("spacer");
      spacer.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderSpacer(spacer);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
