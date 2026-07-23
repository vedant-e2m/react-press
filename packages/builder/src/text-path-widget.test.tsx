import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

const WAVE_FORWARD = "M 20 95 Q 95 25 170 95 T 320 95 T 470 95 T 620 95";
const WAVE_REVERSE = "M 620 95 Q 545 25 470 95 T 320 95 T 170 95 T 20 95";
const ARC_FORWARD = "M 40 145 Q 300 -20 560 145";
const ARC_REVERSE = "M 560 145 Q 300 -20 40 145";
const CIRCLE_FORWARD = "M 150 90 a 150 72 0 1 1 300 0 a 150 72 0 1 1 -300 0";
const CIRCLE_REVERSE = "M 450 90 a 150 72 0 1 0 -300 0 a 150 72 0 1 0 300 0";

function renderTextPath(element: BuilderElement, extras: BuilderElement[] = []) {
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

function pathDef(html: string, id: string): string {
  const match = html.match(new RegExp(`id="npb-text-path-${id}" d="([^"]*)"`));
  return match?.[1] ?? "";
}

function textPathAttrs(html: string): string {
  const match = html.match(/<textPath[^>]*>/);
  return match?.[0] ?? "";
}

describe("text-path widget settings", () => {
  describe("widget registration", () => {
    it("should expose all text path controls with defaults", () => {
      const widget = getBuilderWidget("text-path");

      expect(widget?.defaultProps).toEqual({
        text: "Add Your Curvy Text Here",
        pathType: "wave",
        link: "",
        align: "center",
        direction: "default",
        showPath: false,
      });

      const section = widget?.controls.find((group) => group.label === "Text Path");
      expect(section?.controls.map((control) => control.key)).toEqual([
        "text",
        "pathType",
        "link",
        "align",
        "direction",
        "showPath",
      ]);
    });
  });

  describe("content props", () => {
    it("should render curved text on the default wave path", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = {
        text: "Curvy Text Path Widget",
        pathType: "wave",
        align: "center",
        direction: "default",
        showPath: false,
        link: "",
      };

      const html = renderTextPath(textPath);

      expect(html).toContain(`data-npb-id="${textPath.id}"`);
      expect(html).toContain('class="npb-text-path"');
      expect(html).toContain('viewBox="0 0 640 180"');
      expect(html).toContain("Curvy Text Path Widget");
      expect(pathDef(html, textPath.id)).toBe(WAVE_FORWARD);
      expect(textPathAttrs(html)).toContain('startOffset="50%"');
      expect(textPathAttrs(html)).toContain('text-anchor="middle"');
      expect(html).toContain('aria-label="Curvy Text Path Widget"');
    });

    it.each([
      ["wave", WAVE_FORWARD, WAVE_REVERSE],
      ["arc", ARC_FORWARD, ARC_REVERSE],
      ["circle", CIRCLE_FORWARD, CIRCLE_REVERSE],
    ] as const)("should render %s path geometry for forward and reversed directions", (pathType, forward, reverse) => {
      const forwardEl = createBuilderElement("text-path");
      forwardEl.props = { pathType, direction: "default" };

      const reverseEl = createBuilderElement("text-path");
      reverseEl.props = { pathType, direction: "reversed" };

      expect(pathDef(renderTextPath(forwardEl), forwardEl.id)).toBe(forward);
      expect(pathDef(renderTextPath(reverseEl), reverseEl.id)).toBe(reverse);
    });

    it.each([
      ["start", "0%", "start"],
      ["center", "50%", "middle"],
      ["end", "100%", "end"],
    ] as const)("should align text to %s", (align, startOffset, textAnchor) => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { align };

      const attrs = textPathAttrs(renderTextPath(textPath));

      expect(attrs).toContain(`startOffset="${startOffset}"`);
      expect(attrs).toContain(`text-anchor="${textAnchor}"`);
    });

    it("should render a visible guide path when showPath is enabled", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { showPath: true, pathType: "wave" };

      const html = renderTextPath(textPath);

      expect(html).toMatch(/<path d="[^"]+" fill="none" stroke="currentColor" opacity="\.25"/);
    });

    it("should omit the guide path when showPath is disabled", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { showPath: false, pathType: "wave" };

      const html = renderTextPath(textPath);

      expect(html).not.toMatch(/stroke="currentColor" opacity="\.25"/);
    });

    it("should wrap the text path in a link when link is set", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = {
        text: "Linked curve",
        link: "#text-path",
      };

      const html = renderTextPath(textPath);

      expect(html).toContain('href="#text-path"');
      expect(html).toContain("Linked curve");
      expect(html).toMatch(/<a href="#text-path">[\s\S]*<textPath/);
    });

    it("should not render a link when link is empty", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { text: "Plain curve", link: "" };

      const html = renderTextPath(textPath);

      expect(html).not.toContain("<a ");
      expect(html).toContain("Plain curve");
    });

    it("should fall back to the default label when text is empty", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { text: "" };

      const html = renderTextPath(textPath);

      expect(html).toContain("Add Your Curvy Text Here");
      expect(html).toContain('aria-label="Add Your Curvy Text Here"');
    });

    it("should fall back to the default label when text is whitespace", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { text: "   " };

      const html = renderTextPath(textPath);

      expect(html).toContain("Add Your Curvy Text Here");
    });

    it("should not render a link when link is whitespace", () => {
      const textPath = createBuilderElement("text-path");
      textPath.props = { text: "Plain curve", link: "   " };

      const html = renderTextPath(textPath);

      expect(html).not.toContain("<a ");
    });

    it("should apply css id from advanced settings onto the wrapper", () => {
      const textPath = createBuilderElement("text-path");
      textPath.advanced = { cssId: "hero-curve" };

      const html = renderTextPath(textPath);

      expect(html).toContain('id="hero-curve"');
      expect(html).toContain(`data-npb-id="${textPath.id}"`);
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS to the text path wrapper", () => {
      const textPath = createBuilderElement("text-path");
      textPath.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "16px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderTextPath(textPath), textPath.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:8px");
    });

    it("should emit responsive and hover styles on the wrapper", () => {
      const textPath = createBuilderElement("text-path");
      textPath.styles = {
        desktop: {
          normal: { color: "#111111" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
        mobile: { normal: { fontSize: 14 } },
      };

      const html = renderTextPath(textPath);
      const hover = hoverBlockFor(html, textPath.id);

      expect(styleBlockFor(html, textPath.id)).toContain("color:#111111");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${textPath.id}"]{font-size:14px}}`,
      );
    });

    it("should hide the text path on selected breakpoints", () => {
      const textPath = createBuilderElement("text-path");
      textPath.advanced = { hideOnMobile: true };

      const html = renderTextPath(textPath);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${textPath.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the wrapper", () => {
      const textPath = createBuilderElement("text-path");
      textPath.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 200,
      };

      const html = renderTextPath(textPath);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:200ms");
    });
  });
});
