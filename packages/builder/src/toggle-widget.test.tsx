import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderToggle(element: BuilderElement, extras: BuilderElement[] = []) {
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

function toggleBlock(html: string): string {
  const match = html.match(/<div class="npb-toggle[^"]*"[\s\S]*?<\/div>\s*<\/div>/);
  return match?.[0] ?? "";
}

function toggleRoot(html: string): string {
  const match = html.match(/<div class="npb-toggle[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

describe("toggle widget settings", () => {
  describe("widget registration", () => {
    it("should expose content and style controls", () => {
      const widget = getBuilderWidget("toggle");

      expect(widget?.defaultProps).toEqual({
        items: [
          { title: "Toggle Item #1", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          { title: "Toggle Item #2", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        ],
        titleTag: "div",
        spaceBetween: 0,
      });

      const contentSection = widget?.controls.find((section) => section.label === "Toggle" && section.tab === "content");
      const styleSection = widget?.controls.find((section) => section.label === "Toggle" && section.tab === "style");

      expect(contentSection?.controls.map((control) => control.key)).toEqual(["items", "titleTag"]);
      expect(styleSection?.controls.map((control) => control.key)).toEqual(["spaceBetween", "titleColor"]);
    });
  });

  describe("general props", () => {
    it("should render item titles and content with all panels collapsed by default", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = {
        items: [
          { title: "Overview", content: "Overview copy." },
          { title: "Details", content: "Details copy." },
        ],
      };

      const html = renderToggle(toggle);
      const block = toggleBlock(html);

      expect(html).toContain(`data-npb-id="${toggle.id}"`);
      expect(block).toContain('class="npb-toggle"');
      expect(html).toContain("Overview");
      expect(html).toContain("Details");
      expect(html).toContain("Overview copy.");
      expect(html).toContain("Details copy.");
      expect(html).not.toMatch(/npb-toggle-input[^>]*checked/);
    });

    it("should render checkbox inputs for each toggle item", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = {
        items: [
          { title: "One", content: "First" },
          { title: "Two", content: "Second" },
        ],
      };

      const html = renderToggle(toggle);

      expect(html).toContain(`id="${toggle.id}-toggle-0"`);
      expect(html).toContain(`id="${toggle.id}-toggle-1"`);
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('class="npb-toggle-input"');
    });

    it("should wire labels to toggle inputs", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = {
        items: [
          { title: "Alpha", content: "A" },
          { title: "Beta", content: "B" },
        ],
      };

      const html = renderToggle(toggle);

      expect(html).toContain(`for="${toggle.id}-toggle-0"`);
      expect(html).toContain(`for="${toggle.id}-toggle-1"`);
      expect(html).toContain('class="npb-toggle-header"');
      expect(html).toContain('class="npb-toggle-panel"');
      expect(html).toContain('class="npb-toggle-content"');
    });

    it("should render an empty shell when items are missing", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = { items: [] };

      const html = renderToggle(toggle);

      expect(html).toContain('class="npb-toggle npb-toggle-empty"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toContain("npb-toggle-header");
      expect(html).not.toContain("npb-toggle-panel");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const toggle = createBuilderElement("toggle");
      toggle.advanced = { cssId: "faq-toggle" };

      const html = renderToggle(toggle);

      expect(html).toContain('id="faq-toggle"');
      expect(html).toContain(`data-npb-id="${toggle.id}"`);
    });
  });

  describe("content props", () => {
    it("should render the configured title html tag", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = {
        titleTag: "h4",
        items: [{ title: "Question", content: "Answer" }],
      };

      const html = renderToggle(toggle);

      expect(html).toMatch(/<h4[^>]*>Question<\/h4>/);
    });
  });

  describe("style props", () => {
    it("should apply spaceBetween and titleColor via inline styles and css variables", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = {
        spaceBetween: 12,
        titleColor: "#6d5dfc",
        items: [{ title: "Styled", content: "Colored body" }],
      };

      const html = renderToggle(toggle);
      const root = toggleRoot(html);

      expect(root).toContain("--npb-toggle-title-color:#6d5dfc");
      expect(root).toMatch(/style="[^"]*gap:12/);
    });

    it("should coerce string spaceBetween values from serialized documents", () => {
      const toggle = createBuilderElement("toggle");
      toggle.props = {
        spaceBetween: "16",
        items: [{ title: "Spaced", content: "Body" }],
      };

      const html = renderToggle(toggle);

      expect(toggleRoot(html)).toMatch(/style="[^"]*gap:16/);
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

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
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

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
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

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
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

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
    it("should apply typography CSS to the toggle host", () => {
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

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
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

      expect(css).toContain("background-color:#ff6600");
      expect(css).toContain('background-image:url("https://cdn.example.com/bg.jpg")');
      expect(css).toContain("background-position:center top");
      expect(css).toContain("background-attachment:fixed");
      expect(css).toContain("background-repeat:no-repeat");
      expect(css).toContain("background-size:cover");
    });
  });

  describe("border settings", () => {
    it("should apply border width, color, style, and radius on the host", () => {
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
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

      const css = styleBlockFor(renderToggle(toggle), toggle.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile size overrides", () => {
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderToggle(toggle);

      expect(html).toContain(`[data-npb-id="${toggle.id}"]{width:600px;background-color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${toggle.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${toggle.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const toggle = createBuilderElement("toggle");
      toggle.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderToggle(toggle);
      const hover = hoverBlockFor(html, toggle.id);

      expect(styleBlockFor(html, toggle.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the toggle on selected breakpoints", () => {
      const toggle = createBuilderElement("toggle");
      toggle.advanced = { hideOnMobile: true };

      const html = renderToggle(toggle);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${toggle.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const toggle = createBuilderElement("toggle");
      toggle.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderToggle(toggle);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
