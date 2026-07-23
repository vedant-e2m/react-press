import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderReadMore(element: BuilderElement, extras: BuilderElement[] = []) {
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

function readMoreLink(html: string, id: string): string {
  const match = html.match(new RegExp(`<a[^>]*data-npb-id="${id}"[^>]*>[\\s\\S]*?</a>`));
  return match?.[0] ?? "";
}

describe("read-more widget settings", () => {
  describe("widget registration", () => {
    it("should expose text and link controls with defaults", () => {
      const widget = getBuilderWidget("read-more");
      const contentSection = widget?.controls.find((section) => section.label === "Read More");

      expect(widget?.defaultProps).toEqual({
        text: "Continue reading",
        link: "#more",
      });
      expect(contentSection?.controls).toEqual([
        expect.objectContaining({
          key: "text",
          label: "Read More Text",
          type: "text",
          defaultValue: "Continue reading",
        }),
        expect.objectContaining({ key: "link", label: "Link", type: "url" }),
      ]);
    });
  });

  describe("content props", () => {
    it("should render read-more text and link on the host anchor", () => {
      const readMore = createBuilderElement("read-more");
      readMore.props = {
        text: "Explore leasing options →",
        link: "#leasing",
      };

      const html = renderReadMore(readMore);
      const anchor = readMoreLink(html, readMore.id);

      expect(anchor).toContain(`data-npb-id="${readMore.id}"`);
      expect(anchor).toContain('class="npb-read-more"');
      expect(anchor).toContain('href="#leasing"');
      expect(anchor).toContain("Explore leasing options →");
    });

    it("should render default text and link from widget defaults", () => {
      const readMore = createBuilderElement("read-more");

      const html = renderReadMore(readMore);
      const anchor = readMoreLink(html, readMore.id);

      expect(anchor).toContain('href="#more"');
      expect(anchor).toContain("Continue reading");
    });

    it("should fall back to default link when link is empty", () => {
      const readMore = createBuilderElement("read-more");
      readMore.props = { text: "Keep reading", link: "" };

      const html = renderReadMore(readMore);

      expect(readMoreLink(html, readMore.id)).toContain('href="#more"');
    });

    it("should fall back to default text when text is empty", () => {
      const readMore = createBuilderElement("read-more");
      readMore.props = { text: "", link: "#section" };

      const html = renderReadMore(readMore);

      expect(readMoreLink(html, readMore.id)).toContain("Continue reading");
      expect(readMoreLink(html, readMore.id)).toContain('href="#section"');
    });

    it("should fall back to defaults when text and link are whitespace", () => {
      const readMore = createBuilderElement("read-more");
      readMore.props = { text: "   ", link: "  " };

      const html = renderReadMore(readMore);
      const anchor = readMoreLink(html, readMore.id);

      expect(anchor).toContain('href="#more"');
      expect(anchor).toContain("Continue reading");
    });

    it("should apply css id from advanced settings onto the host anchor", () => {
      const readMore = createBuilderElement("read-more");
      readMore.advanced = { cssId: "article-read-more" };

      const html = renderReadMore(readMore);

      expect(readMoreLink(html, readMore.id)).toContain('id="article-read-more"');
      expect(html).toContain(`data-npb-id="${readMore.id}"`);
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
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

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

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
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
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

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

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
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
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

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

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
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
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

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

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
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
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

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

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
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
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

      const css = styleBlockFor(renderReadMore(readMore), readMore.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile typography overrides", () => {
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
        desktop: { normal: { fontSize: 18, color: "#111111" } },
        tablet: { normal: { fontSize: 16 } },
        mobile: { normal: { fontSize: 14, color: "#222222" } },
      };

      const html = renderReadMore(readMore);

      expect(html).toContain(`[data-npb-id="${readMore.id}"]{font-size:18px;color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${readMore.id}"]{font-size:16px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${readMore.id}"]{font-size:14px;color:#222222}}`,
      );
    });

    it("should emit hover color styles", () => {
      const readMore = createBuilderElement("read-more");
      readMore.styles = {
        desktop: {
          normal: { color: "#333333" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
      };

      const html = renderReadMore(readMore);
      const hover = hoverBlockFor(html, readMore.id);

      expect(styleBlockFor(html, readMore.id)).toContain("color:#333333");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
    });

    it("should hide the read-more link on selected breakpoints", () => {
      const readMore = createBuilderElement("read-more");
      readMore.advanced = { hideOnMobile: true };

      const html = renderReadMore(readMore);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${readMore.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const readMore = createBuilderElement("read-more");
      readMore.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderReadMore(readMore);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
