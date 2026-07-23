import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderTextEditor(element: BuilderElement, extras: BuilderElement[] = []) {
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

function textEditorHost(html: string, id: string): string {
  const match = html.match(new RegExp(`<div[^>]*data-npb-id="${id}"[^>]*>`));
  return match?.[0] ?? "";
}

describe("text-editor widget settings", () => {
  describe("general props", () => {
    it("should render rich text HTML content on the host element", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: "<p><strong>Rich text</strong> with <em>markup</em></p>",
      };

      const html = renderTextEditor(editor);

      expect(html).toContain("<strong>Rich text</strong>");
      expect(html).toContain("<em>markup</em>");
      expect(textEditorHost(html, editor.id)).toContain(`data-npb-id="${editor.id}"`);
    });

    it("should render links inside rich text content", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: '<p>Visit <a href="https://example.com/docs">our docs</a></p>',
      };

      const html = renderTextEditor(editor);

      expect(html).toContain('href="https://example.com/docs"');
      expect(html).toContain("our docs");
    });

    it("should apply css id from advanced settings onto the host element", () => {
      const editor = createBuilderElement("text-editor");
      editor.advanced = { cssId: "article-body" };

      const html = renderTextEditor(editor);

      expect(textEditorHost(html, editor.id)).toContain('id="article-body"');
      expect(html).toContain(`data-npb-id="${editor.id}"`);
    });
  });

  describe("content props", () => {
    it("should apply align, color, font size, and line height from props", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: "<p>Styled rich text</p>",
        align: "center",
        color: "#445566",
        fontSize: 18,
        lineHeight: 1.6,
      };

      const html = renderTextEditor(editor);
      const host = textEditorHost(html, editor.id);

      expect(host).toMatch(/text-align:center/);
      expect(host).toMatch(/color:#445566/);
      expect(host).toMatch(/font-size:18px/);
      expect(host).toMatch(/line-height:1.6/);
    });

    it("should apply drop cap class when enabled", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: "<p>Drop cap demo</p>",
        dropCap: true,
      };

      const html = renderTextEditor(editor);

      expect(textEditorHost(html, editor.id)).toContain('class="npb-drop-cap"');
    });

    it("should apply multi-column layout from props", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: "<p>Column layout text</p>",
        columns: 2,
        columnGap: 24,
      };

      const html = renderTextEditor(editor);
      const host = textEditorHost(html, editor.id);

      expect(host).toMatch(/column-count:2/);
      expect(host).toMatch(/column-gap:24px/);
    });

    it("should expose link color as a CSS custom property", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: '<p>Link color <a href="#">demo</a></p>',
        linkColor: "#6d5dfc",
      };

      const html = renderTextEditor(editor);

      expect(textEditorHost(html, editor.id)).toMatch(/--npb-link-color:#6d5dfc/);
    });

    it("should preserve pre-wrap whitespace on the host", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: "<p>Line one</p><p>Line two</p>",
      };

      const html = renderTextEditor(editor);

      expect(textEditorHost(html, editor.id)).toMatch(/white-space:pre-wrap/);
    });
  });

  describe("typography inheritance", () => {
    it("should inherit typography from generated CSS when set in the style panel", () => {
      const editor = createBuilderElement("text-editor");
      editor.props = {
        ...editor.props,
        text: "<p>Inherited typography</p>",
        align: "left",
        color: "#000000",
        fontSize: 14,
        lineHeight: 1.4,
      };
      editor.styles = {
        desktop: {
          normal: {
            fontSize: 20,
            lineHeight: 1.8,
            color: "#112233",
            textAlign: "center",
            fontFamily: "Georgia, serif",
          },
        },
      };

      const html = renderTextEditor(editor);
      const css = styleBlockFor(html, editor.id);
      const host = textEditorHost(html, editor.id);

      expect(css).toContain("font-size:20px");
      expect(css).toContain("line-height:1.8");
      expect(css).toContain("color:#112233");
      expect(css).toContain("text-align:center");
      expect(css).toContain("font-family:Georgia, serif");
      expect(host).not.toMatch(/font-size:14px/);
      expect(host).not.toMatch(/color:#000000/);
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const editor = createBuilderElement("text-editor");
      editor.styles = {
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

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

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
      const editor = createBuilderElement("text-editor");
      editor.styles = {
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

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

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
      const editor = createBuilderElement("text-editor");
      editor.styles = {
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

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

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
      const editor = createBuilderElement("text-editor");
      editor.styles = {
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

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

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
      const editor = createBuilderElement("text-editor");
      editor.styles = {
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

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

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
      const editor = createBuilderElement("text-editor");
      editor.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const editor = createBuilderElement("text-editor");
      editor.styles = {
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

      const css = styleBlockFor(renderTextEditor(editor), editor.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile typography overrides", () => {
      const editor = createBuilderElement("text-editor");
      editor.styles = {
        desktop: { normal: { fontSize: 18, color: "#111111" } },
        tablet: { normal: { fontSize: 16 } },
        mobile: { normal: { fontSize: 14, color: "#222222" } },
      };

      const html = renderTextEditor(editor);

      expect(html).toContain(`[data-npb-id="${editor.id}"]{font-size:18px;color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${editor.id}"]{font-size:16px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${editor.id}"]{font-size:14px;color:#222222}}`,
      );
    });

    it("should emit hover color styles", () => {
      const editor = createBuilderElement("text-editor");
      editor.styles = {
        desktop: {
          normal: { color: "#333333" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
      };

      const html = renderTextEditor(editor);
      const hover = hoverBlockFor(html, editor.id);

      expect(styleBlockFor(html, editor.id)).toContain("color:#333333");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
    });

    it("should hide the text editor on selected breakpoints", () => {
      const editor = createBuilderElement("text-editor");
      editor.advanced = { hideOnMobile: true };

      const html = renderTextEditor(editor);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${editor.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const editor = createBuilderElement("text-editor");
      editor.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderTextEditor(editor);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toMatch(/animation-delay:250ms/);
    });
  });
});
