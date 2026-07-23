import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderDivider(element: BuilderElement, extras: BuilderElement[] = []) {
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

function dividerBlock(html: string): string {
  const match = html.match(/<div class="npb-divider[^"]*">[\s\S]*?<\/div>/);
  return match?.[0] ?? "";
}

function hrStyle(html: string): string {
  return dividerBlock(html).match(/<hr[^>]*style="([^"]*)"/)?.[1] ?? "";
}

describe("divider widget settings", () => {
  describe("general props", () => {
    it("should render a horizontal rule with default props", () => {
      const divider = createBuilderElement("divider");

      const html = renderDivider(divider);

      expect(html).toContain(`data-npb-id="${divider.id}"`);
      expect(html).toContain('class="npb-divider"');
      expect(html).toContain("<hr");
      expect(html).toContain("border-top:1px solid #d0d5dd");
      expect(html).toContain("width:100%");
      expect(html).toContain("margin-block:16");
      expect(html).toContain("margin-inline:auto");
    });

    it.each(["solid", "dashed", "dotted", "double"] as const)(
      "should apply %s line style",
      (style) => {
        const divider = createBuilderElement("divider");
        divider.props = { ...divider.props, style };

        const html = renderDivider(divider);

        expect(hrStyle(html)).toContain(`border-top:1px ${style} #d0d5dd`);
      },
    );

    it("should apply color, weight, width, and gap from props", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        style: "dashed",
        width: 80,
        weight: 3,
        gap: 24,
        color: "#112233",
      };

      const html = renderDivider(divider);
      const style = hrStyle(html);

      expect(style).toContain("border-top:3px dashed #112233");
      expect(style).toContain("width:80%");
      expect(style).toContain("margin-block:24");
    });

    it.each([
      ["left", "margin-left:0", "margin-right:auto"],
      ["center", "margin-inline:auto", ""],
      ["right", "margin-left:auto", "margin-right:0"],
    ] as const)("should align a plain divider to the %s", (align, first, second) => {
      const divider = createBuilderElement("divider");
      divider.props = { ...divider.props, align };

      const style = hrStyle(renderDivider(divider));

      expect(style).toContain(first);
      if (second) {
        expect(style).toContain(second);
      }
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const divider = createBuilderElement("divider");
      divider.advanced = { cssId: "section-break" };

      const html = renderDivider(divider);

      expect(html).toContain('id="section-break"');
      expect(html).toContain(`data-npb-id="${divider.id}"`);
    });
  });

  describe("content props", () => {
    it("should render divider text inline between two line segments", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        style: "dashed",
        width: 100,
        weight: 2,
        gap: 20,
        color: "#d1d5db",
        addElement: "text",
        text: "Section Break",
      };

      const html = renderDivider(divider);
      const block = dividerBlock(html);

      expect(block).toContain('class="npb-divider npb-divider-with-element"');
      expect(block).toContain('class="npb-divider-row"');
      expect(block).toContain('class="npb-divider-label"');
      expect(block).toContain("Section Break");
      expect(block.match(/<hr/g)?.length).toBe(2);
      expect(block).toMatch(/<hr[\s\S]*Section Break[\s\S]*<hr/);
    });

    it("should render divider icon inline between two line segments", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        addElement: "icon",
        icon: "✦",
      };

      const html = renderDivider(divider);
      const block = dividerBlock(html);

      expect(block).toContain("✦");
      expect(block.match(/<hr/g)?.length).toBe(2);
    });

    it("should fall back to the default icon when addElement is icon and icon is empty", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        addElement: "icon",
        icon: "",
      };

      const html = renderDivider(divider);

      expect(dividerBlock(html)).toContain("★");
    });

    it("should not render a label when addElement is none", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        addElement: "none",
        text: "Hidden",
        icon: "✦",
      };

      const html = renderDivider(divider);
      const block = dividerBlock(html);

      expect(block).not.toContain("npb-divider-with-element");
      expect(block).not.toContain("Hidden");
      expect(block).not.toContain("✦");
      expect(block.match(/<hr/g)?.length).toBe(1);
    });

    it("should align labeled divider rows using horizontal margins", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        addElement: "text",
        text: "Left label",
        align: "left",
        width: 70,
      };

      const html = renderDivider(divider);
      const rowStyle = dividerBlock(html).match(/npb-divider-row[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(rowStyle).toContain("width:70%");
      expect(rowStyle).toContain("margin-left:0");
      expect(rowStyle).toContain("margin-right:auto");
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const divider = createBuilderElement("divider");
      divider.styles = {
        desktop: {
          normal: {
            width: "320px",
            height: "48px",
            minWidth: "120px",
            minHeight: "24px",
            maxWidth: "640px",
            maxHeight: "80px",
            overflow: "hidden",
            aspectRatio: "16 / 9",
          },
        },
      };

      const css = styleBlockFor(renderDivider(divider), divider.id);

      expect(css).toContain("width:320px");
      expect(css).toContain("height:48px");
      expect(css).toContain("min-width:120px");
      expect(css).toContain("min-height:24px");
      expect(css).toContain("max-width:640px");
      expect(css).toContain("max-height:80px");
      expect(css).toContain("overflow:hidden");
      expect(css).toContain("aspect-ratio:16 / 9");
    });
  });

  describe("layout settings", () => {
    it("should apply display, flex direction, justify, align, gap, and wrap", () => {
      const divider = createBuilderElement("divider");
      divider.styles = {
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

      const css = styleBlockFor(renderDivider(divider), divider.id);

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
      const divider = createBuilderElement("divider");
      divider.styles = {
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

      const css = styleBlockFor(renderDivider(divider), divider.id);

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
      const divider = createBuilderElement("divider");
      divider.styles = {
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

      const css = styleBlockFor(renderDivider(divider), divider.id);

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
    it("should apply typography CSS to the divider wrapper", () => {
      const divider = createBuilderElement("divider");
      divider.props = {
        addElement: "text",
        text: "Styled label",
      };
      divider.styles = {
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

      const css = styleBlockFor(renderDivider(divider), divider.id);

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
      const divider = createBuilderElement("divider");
      divider.styles = {
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

      const css = styleBlockFor(renderDivider(divider), divider.id);

      expect(css).toContain("background-color:#ff6600");
      expect(css).toContain('background-image:url("https://cdn.example.com/bg.jpg")');
      expect(css).toContain("background-position:center top");
      expect(css).toContain("background-attachment:fixed");
      expect(css).toContain("background-repeat:no-repeat");
      expect(css).toContain("background-size:cover");
    });
  });

  describe("border settings", () => {
    it("should apply border width, color, style, and radius on the wrapper", () => {
      const divider = createBuilderElement("divider");
      divider.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderDivider(divider), divider.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const divider = createBuilderElement("divider");
      divider.styles = {
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

      const css = styleBlockFor(renderDivider(divider), divider.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile size overrides", () => {
      const divider = createBuilderElement("divider");
      divider.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderDivider(divider);

      expect(html).toContain(`[data-npb-id="${divider.id}"]{width:600px;background-color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${divider.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${divider.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const divider = createBuilderElement("divider");
      divider.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderDivider(divider);
      const hover = hoverBlockFor(html, divider.id);

      expect(styleBlockFor(html, divider.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the divider on selected breakpoints", () => {
      const divider = createBuilderElement("divider");
      divider.advanced = { hideOnMobile: true };

      const html = renderDivider(divider);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${divider.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const divider = createBuilderElement("divider");
      divider.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderDivider(divider);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
