import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderHeading(element: BuilderElement, extras: BuilderElement[] = []) {
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

function headingTag(html: string, tag: string): string | null {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match?.[0] ?? null;
}

describe("heading widget settings", () => {
  describe("general props", () => {
    it("should render heading text content", () => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Section title", tag: "h3" };

      const html = renderHeading(heading);

      expect(html).toContain("Section title");
      expect(html).toContain(`data-npb-id="${heading.id}"`);
    });

    it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
      "should render semantic %s tag",
      (tag) => {
        const heading = createBuilderElement("heading");
        heading.props = { text: "Title", tag };

        const html = renderHeading(heading);

        expect(html).toContain(`<${tag}`);
        expect(html).toContain("Title");
      },
    );

    it("should wrap the heading in an anchor when link is set", () => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Linked title", tag: "h2", link: "https://example.com" };

      const html = renderHeading(heading);

      expect(html).toContain('href="https://example.com"');
      expect(html).toContain("<h2");
      expect(html).toContain("Linked title");
      expect(html).toMatch(
        new RegExp(`data-npb-id="${heading.id}"[^>]*>[\\s\\S]*<a href="https://example.com">`),
      );
    });

    it("should apply css id from advanced settings onto the wrapper", () => {
      const heading = createBuilderElement("heading");
      heading.advanced = { cssId: "hero-title" };

      const html = renderHeading(heading);

      expect(html).toContain('id="hero-title"');
      expect(html).toContain(`data-npb-id="${heading.id}"`);
    });
  });

  describe("size preset and tag defaults", () => {
    it("should apply tag default font sizes when no preset or style font size is set", () => {
      const h1 = createBuilderElement("heading");
      h1.props = { text: "Level one", tag: "h1" };

      const h6 = createBuilderElement("heading");
      h6.props = { text: "Level six", tag: "h6" };

      expect(renderHeading(h1)).toMatch(/<h1[^>]*style="[^"]*font-size:48px/);
      expect(renderHeading(h6)).toMatch(/<h6[^>]*style="[^"]*font-size:14px/);
    });

    it.each([
      ["small", 18],
      ["medium", 28],
      ["large", 36],
      ["xl", 48],
      ["xxl", 64],
    ] as const)("should apply %s size preset as inline font size", (size, px) => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Preset", tag: "h2", size };

      const html = renderHeading(heading);

      expect(html).toMatch(new RegExp(`<h2[^>]*style="[^"]*font-size:${px}px`));
    });

    it("should prefer style panel font size over size preset and tag defaults", () => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Styled", tag: "h1", size: "xxl" };
      heading.styles = { desktop: { normal: { fontSize: 56 } } };

      const html = renderHeading(heading);
      const css = styleBlockFor(html, heading.id);

      expect(css).toContain("font-size:56px");
      expect(html).not.toMatch(/<h1[^>]*style="[^"]*font-size/);
    });

    it("should apply size preset when style font size is cleared", () => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Preset wins", tag: "h3", size: "large" };
      heading.styles = { desktop: { normal: { fontSize: "" } } };

      const html = renderHeading(heading);

      expect(html).toMatch(/<h3[^>]*style="[^"]*font-size:36px/);
      expect(styleBlockFor(html, heading.id)).not.toContain("font-size:");
    });
  });

  describe("typography props", () => {
    it("should apply align, color, font family, weight, and text shadow from props", () => {
      const heading = createBuilderElement("heading");
      heading.props = {
        text: "Styled title",
        tag: "h2",
        align: "center",
        color: "#112233",
        fontFamily: "Georgia, serif",
        fontWeight: 700,
        textShadow: "0 2px 8px rgba(0,0,0,0.12)",
      };

      const html = renderHeading(heading);
      const tagHtml = headingTag(html, "h2") ?? "";

      expect(tagHtml).toContain("text-align:center");
      expect(tagHtml).toContain("color:#112233");
      expect(tagHtml).toContain("font-family:Georgia, serif");
      expect(tagHtml).toContain("font-weight:700");
      expect(tagHtml).toContain("text-shadow:0 2px 8px rgba(0,0,0,0.12)");
    });

    it("should prefer style panel typography over legacy props", () => {
      const heading = createBuilderElement("heading");
      heading.props = {
        text: "Override",
        tag: "h2",
        align: "left",
        color: "#111111",
        fontFamily: "Arial, sans-serif",
        fontWeight: 400,
      };
      heading.styles = {
        desktop: {
          normal: {
            textAlign: "right",
            color: "#ff0000",
            fontFamily: "Georgia, serif",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: 2,
            textTransform: "uppercase",
          },
        },
      };

      const html = renderHeading(heading);
      const css = styleBlockFor(html, heading.id);
      const tagHtml = headingTag(html, "h2") ?? "";

      expect(css).toContain("text-align:right");
      expect(css).toContain("color:#ff0000");
      expect(css).toContain("font-family:Georgia, serif");
      expect(css).toContain("font-weight:800");
      expect(css).toContain("line-height:1.2");
      expect(css).toContain("letter-spacing:2px");
      expect(css).toContain("text-transform:uppercase");
      expect(tagHtml).not.toContain("text-align:left");
      expect(tagHtml).not.toContain("color:#111111");
      expect(tagHtml).not.toContain("font-family:Arial");
      expect(tagHtml).not.toContain("font-weight:400");
      expect(tagHtml).toMatch(/font-size:36px/);
    });

    it("should inherit wrapper typography instead of duplicating font size on the tag", () => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Hero title", tag: "h1" };
      heading.styles = {
        desktop: { normal: { fontSize: 72, lineHeight: 1.08 } },
        mobile: { normal: { fontSize: 42 } },
      };

      const html = renderHeading(heading);

      expect(html).toContain("<h1");
      expect(html).toMatch(/font-size:72px/);
      expect(html).toMatch(/font-size:42px/);
      expect(html).not.toMatch(/<h1[^>]*style="[^"]*font-size/);
    });

    it("should keep linked headings inheriting wrapper typography", () => {
      const heading = createBuilderElement("heading");
      heading.props = { text: "Linked title", tag: "h2", link: "#section" };
      heading.styles = {
        desktop: {
          normal: {
            fontSize: 40,
            color: "#334455",
            fontWeight: 700,
            textAlign: "center",
          },
        },
      };

      const html = renderHeading(heading);
      const css = styleBlockFor(html, heading.id);
      const tagHtml = headingTag(html, "h2") ?? "";

      expect(html).toContain('<a href="#section">');
      expect(css).toContain("font-size:40px");
      expect(css).toContain("color:#334455");
      expect(css).toContain("font-weight:700");
      expect(css).toContain("text-align:center");
      expect(tagHtml).not.toMatch(/font-size:/);
      expect(tagHtml).not.toContain("color:#");
      expect(tagHtml).not.toContain("font-weight:");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS to the heading wrapper", () => {
      const heading = createBuilderElement("heading");
      heading.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "16px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderHeading(heading), heading.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:8px");
    });

    it("should apply layout and size CSS to the heading wrapper", () => {
      const heading = createBuilderElement("heading");
      heading.styles = {
        desktop: {
          normal: {
            display: "inline-block",
            width: "320px",
            maxWidth: "100%",
          },
        },
      };

      const css = styleBlockFor(renderHeading(heading), heading.id);

      expect(css).toContain("display:inline-block");
      expect(css).toContain("width:320px");
      expect(css).toContain("max-width:100%");
    });

    it("should apply background, border, and effects CSS to the heading wrapper", () => {
      const heading = createBuilderElement("heading");
      heading.styles = {
        desktop: {
          normal: {
            backgroundColor: "#f3f4f6",
            borderWidth: "1px",
            borderColor: "#d1d5db",
            borderStyle: "solid",
            borderRadius: "8px",
            opacity: 0.9,
            boxShadow: "0 4px 12px #0000001a",
          },
        },
      };

      const css = styleBlockFor(renderHeading(heading), heading.id);

      expect(css).toContain("background-color:#f3f4f6");
      expect(css).toContain("border-width:1px");
      expect(css).toContain("border-color:#d1d5db");
      expect(css).toContain("border-style:solid");
      expect(css).toContain("border-radius:8px");
      expect(css).toContain("opacity:0.9");
      expect(css).toContain("box-shadow:0 4px 12px #0000001a");
    });

    it("should emit responsive and hover styles on the wrapper", () => {
      const heading = createBuilderElement("heading");
      heading.styles = {
        desktop: {
          normal: { color: "#111111" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
        mobile: { normal: { fontSize: 24 } },
      };

      const html = renderHeading(heading);
      const hover = hoverBlockFor(html, heading.id);

      expect(styleBlockFor(html, heading.id)).toContain("color:#111111");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${heading.id}"]{font-size:24px}}`,
      );
    });

    it("should hide the heading on selected breakpoints", () => {
      const heading = createBuilderElement("heading");
      heading.advanced = { hideOnMobile: true };

      const html = renderHeading(heading);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${heading.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the wrapper", () => {
      const heading = createBuilderElement("heading");
      heading.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 200,
      };

      const html = renderHeading(heading);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:200ms");
    });
  });
});
