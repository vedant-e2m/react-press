import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderShortcode(element: BuilderElement, extras: BuilderElement[] = []) {
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

describe("shortcode widget settings", () => {
  describe("widget registration", () => {
    it("should expose the code control with default shortcode", () => {
      const widget = getBuilderWidget("shortcode");

      expect(widget?.defaultProps).toEqual({ code: "[shortcode]" });
      expect(widget?.controls).toEqual([
        expect.objectContaining({
          label: "Content",
          controls: [
            expect.objectContaining({
              key: "code",
              label: "Enter your shortcode",
              type: "text",
              defaultValue: "[shortcode]",
            }),
          ],
        }),
      ]);
    });
  });

  describe("content props", () => {
    it("should render shortcode text inside a code element", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.props = { code: '[gallery ids="1,2,3"]' };

      const html = renderShortcode(shortcode);

      expect(html).toContain(`data-npb-id="${shortcode.id}"`);
      expect(html).toContain("<code");
      expect(html).toContain("[gallery ids=&quot;1,2,3&quot;]");
    });

    it("should fall back to the default shortcode when code is empty", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.props = { code: "" };

      const html = renderShortcode(shortcode);

      expect(html).toContain("<code");
      expect(html).toContain("[shortcode]");
    });

    it("should fall back to the default shortcode when code is whitespace", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.props = { code: "   " };

      const html = renderShortcode(shortcode);

      expect(html).toContain("[shortcode]");
    });

    it("should preserve shortcode attribute syntax literally", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.props = { code: '[public_market_vendors limit="6"]' };

      const html = renderShortcode(shortcode);

      expect(html).toContain("[public_market_vendors limit=&quot;6&quot;]");
    });

    it("should apply css id from advanced settings onto the wrapper", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.advanced = { cssId: "vendor-shortcode" };

      const html = renderShortcode(shortcode);

      expect(html).toContain('id="vendor-shortcode"');
      expect(html).toContain(`data-npb-id="${shortcode.id}"`);
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS to the shortcode wrapper", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "16px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderShortcode(shortcode), shortcode.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:8px");
    });

    it("should emit responsive and hover styles on the wrapper", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.styles = {
        desktop: {
          normal: { color: "#111111" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
        mobile: { normal: { fontSize: 14 } },
      };

      const html = renderShortcode(shortcode);
      const hover = hoverBlockFor(html, shortcode.id);

      expect(styleBlockFor(html, shortcode.id)).toContain("color:#111111");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${shortcode.id}"]{font-size:14px}}`,
      );
    });

    it("should hide the shortcode on selected breakpoints", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.advanced = { hideOnMobile: true };

      const html = renderShortcode(shortcode);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${shortcode.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the wrapper", () => {
      const shortcode = createBuilderElement("shortcode");
      shortcode.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 200,
      };

      const html = renderShortcode(shortcode);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:200ms");
    });
  });
});
