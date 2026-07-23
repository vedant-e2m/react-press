import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderDiv(element: BuilderElement, extras: BuilderElement[] = []) {
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

describe("div-block widget settings", () => {
  describe("general props", () => {
    it("should render the selected semantic HTML tag", () => {
      const div = createBuilderElement("div-block");
      div.props = { tag: "section", link: "" };

      const html = renderDiv(div);

      expect(html).toContain(`data-npb-id="${div.id}"`);
      expect(html).toContain('<section');
      expect(html).toContain('class="npb-div-block"');
      expect(html).not.toMatch(/<div[^>]*class="npb-div-block"/);
    });

    it("should wrap the block in an anchor when link is set", () => {
      const div = createBuilderElement("div-block");
      div.props = { tag: "div", link: "https://example.com" };

      const html = renderDiv(div);

      expect(html).toContain('href="https://example.com"');
      expect(html).toContain('class="npb-div-link"');
      expect(html).toContain(`data-npb-id="${div.id}"`);
      expect(html).toContain('class="npb-div-block"');
    });

    it("should apply css id from advanced settings onto the host element", () => {
      const div = createBuilderElement("div-block");
      div.advanced = { cssId: "hero-band" };

      const html = renderDiv(div);

      expect(html).toContain(`id="hero-band"`);
      expect(html).toContain(`data-npb-id="${div.id}"`);
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
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

      const css = styleBlockFor(renderDiv(div), div.id);

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
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: {
            width: "100%",
            height: "50%",
            maxWidth: "80%",
          },
        },
      };

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("width:100%");
      expect(css).toContain("height:50%");
      expect(css).toContain("max-width:80%");
      expect(css).not.toContain("100%px");
      expect(css).not.toContain("50%px");
    });

    it("should accept numeric size values and serialize them with px", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: {
            width: 240,
            height: 120,
          },
        },
      };

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("width:240px");
      expect(css).toContain("height:120px");
    });
  });

  describe("layout settings", () => {
    it("should apply display, flex direction, justify, align, gap, and wrap", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
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

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("display:flex");
      expect(css).toContain("flex-direction:column");
      expect(css).toContain("justify-content:center");
      expect(css).toContain("align-items:flex-end");
      expect(css).toContain("gap:16px");
      expect(css).toContain("flex-wrap:wrap");
    });

    it("should apply flex child settings", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: {
            alignSelf: "center",
            order: 2,
            flexGrow: 1,
            flexShrink: 0,
            flex: "1 0 auto",
          },
        },
      };

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("align-self:center");
      expect(css).toContain("order:2");
      expect(css).toContain("flex-grow:1");
      expect(css).toContain("flex-shrink:0");
      expect(css).toContain("flex:1 0 auto");
    });

    it("should make nested children participate in the div flex layout", () => {
      const parent = createBuilderElement("div-block");
      parent.id = "flex-parent";
      parent.styles = {
        desktop: {
          normal: {
            display: "flex",
            flexDirection: "row",
            gap: "12px",
          },
        },
      };

      const childA = createBuilderElement("heading");
      childA.id = "child-a";
      childA.props = { text: "A", tag: "h3" };

      const childB = createBuilderElement("heading");
      childB.id = "child-b";
      childB.props = { text: "B", tag: "h3" };

      parent.children = [childA, childB];

      const html = renderDiv(parent);
      const css = styleBlockFor(html, parent.id);

      expect(css).toContain("display:flex");
      // Children must be flex items of the styled host, not buried under an extra box.
      expect(html).toMatch(
        /data-npb-id="flex-parent"[^>]*>[\s\S]*data-npb-id="child-a"[\s\S]*data-npb-id="child-b"/,
      );
      expect(html).not.toMatch(
        /data-npb-id="flex-parent"[^>]*>[\s\S]*<div class="npb-div-block">[\s\S]*data-npb-id="child-a"/,
      );
    });
  });

  describe("spacing settings", () => {
    it("should apply margin and padding on all sides", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
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

      const css = styleBlockFor(renderDiv(div), div.id);

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
      const div = createBuilderElement("div-block");
      div.styles = {
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

      const css = styleBlockFor(renderDiv(div), div.id);

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
    it("should apply typography CSS to the div wrapper", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: {
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

      const css = styleBlockFor(renderDiv(div), div.id);

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
      const div = createBuilderElement("div-block");
      div.styles = {
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

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("background-color:#ff6600");
      expect(css).toContain('background-image:url("https://cdn.example.com/bg.jpg")');
      expect(css).toContain("background-position:center top");
      expect(css).toContain("background-attachment:fixed");
      expect(css).toContain("background-repeat:no-repeat");
      expect(css).toContain("background-size:cover");
    });

    it("should apply gradient background image", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: {
            backgroundImage: "linear-gradient(135deg, #375efb, #8b5cf6)",
          },
        },
      };

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("background-image:linear-gradient(135deg, #375efb, #8b5cf6)");
    });
  });

  describe("border settings", () => {
    it("should apply border width, color, style, and radius", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
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

      const css = styleBlockFor(renderDiv(div), div.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile size overrides", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderDiv(div);

      expect(html).toContain(`[data-npb-id="${div.id}"]{width:600px;background-color:#111111}`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${div.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${div.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const div = createBuilderElement("div-block");
      div.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderDiv(div);
      const hover = hoverBlockFor(html, div.id);

      expect(styleBlockFor(html, div.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the div on selected breakpoints", () => {
      const div = createBuilderElement("div-block");
      div.advanced = { hideOnMobile: true };

      const html = renderDiv(div);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${div.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const div = createBuilderElement("div-block");
      div.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderDiv(div);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
