import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderButton(element: BuilderElement, extras: BuilderElement[] = []) {
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

function buttonMarkup(html: string, id: string): string {
  const match = html.match(new RegExp(`<a[^>]*data-npb-id="${id}"[^>]*>[\\s\\S]*?</a>`));
  return match?.[0] ?? "";
}

describe("button widget settings", () => {
  describe("general props", () => {
    it("should render button text and link on the interactive host", () => {
      const button = createBuilderElement("button");
      button.props = {
        text: "Order now",
        url: "https://example.com/order",
      };

      const html = renderButton(button);
      const anchor = buttonMarkup(html, button.id);

      expect(anchor).toContain(`data-npb-id="${button.id}"`);
      expect(anchor).toContain('href="https://example.com/order"');
      expect(anchor).toContain("Order now");
      expect(anchor).toContain('class="npb-button npb-button-info npb-button-md"');
    });

    it("should fall back to # when link is empty", () => {
      const button = createBuilderElement("button");
      button.props = { text: "Click", url: "" };

      const html = renderButton(button);

      expect(buttonMarkup(html, button.id)).toContain('href="#"');
    });

    it("should apply css id from advanced settings onto the anchor host", () => {
      const button = createBuilderElement("button");
      button.advanced = { cssId: "cta-button" };

      const html = renderButton(button);

      expect(buttonMarkup(html, button.id)).toContain('id="cta-button"');
    });

    it("should fall back to buttonId prop when advanced css id is absent", () => {
      const button = createBuilderElement("button");
      button.props = { buttonId: "legacy-btn-id", text: "Go", url: "#" };

      const html = renderButton(button);

      expect(buttonMarkup(html, button.id)).toContain('id="legacy-btn-id"');
    });
  });

  describe("style props", () => {
    it("should align the button within its wrapper", () => {
      const button = createBuilderElement("button");
      button.props = { text: "Centered", url: "#", align: "center" };

      const html = renderButton(button);

      expect(html).toContain('class="npb-button-align"');
      expect(html).toMatch(/npb-button-align[^>]*style="[^"]*text-align:center/);
    });

    it("should apply size and type variant classes", () => {
      const button = createBuilderElement("button");
      button.props = {
        text: "Large success",
        url: "#",
        size: "lg",
        buttonType: "success",
      };

      const html = renderButton(button);

      expect(buttonMarkup(html, button.id)).toContain("npb-button-success npb-button-lg");
    });

    it("should normalize legacy size values onto canonical classes", () => {
      const button = createBuilderElement("button");
      button.props = { text: "Small", url: "#", size: "small" };

      const html = renderButton(button);

      expect(buttonMarkup(html, button.id)).toContain("npb-button-sm");
    });

    it("should render icon before and after text", () => {
      const before = createBuilderElement("button");
      before.props = {
        text: "Next",
        url: "#",
        icon: "→",
        iconPosition: "before",
      };

      const after = createBuilderElement("button");
      after.props = {
        text: "Next",
        url: "#",
        icon: "→",
        iconPosition: "after",
      };

      const beforeHtml = buttonMarkup(renderButton(before), before.id);
      const afterHtml = buttonMarkup(renderButton(after), after.id);

      expect(beforeHtml).toMatch(/<span[^>]*>→<\/span>Next/);
      expect(afterHtml).toMatch(/Next<span[^>]*>→<\/span>/);
    });

    it("should apply custom colors, radius, padding, and icon spacing", () => {
      const button = createBuilderElement("button");
      button.props = {
        text: "Styled",
        url: "#",
        backgroundColor: "#112233",
        textColor: "#eeddcc",
        borderRadius: 12,
        paddingX: 40,
        paddingY: 18,
        iconSpacing: 14,
        icon: "★",
      };

      const html = renderButton(button);
      const style = buttonMarkup(html, button.id).match(/style="([^"]*)"/)?.[1] ?? "";

      expect(style).toContain("background-color:#112233");
      expect(style).toContain("color:#eeddcc");
      expect(style).toContain("border-radius:12");
      expect(style).toContain("padding:18px 40px");
      expect(style).toContain("gap:14");
    });

    it("should render outline and link type variants", () => {
      const outline = createBuilderElement("button");
      outline.props = {
        text: "Outline",
        url: "#",
        buttonType: "outline",
        textColor: "#6d5dfc",
      };

      const link = createBuilderElement("button");
      link.props = {
        text: "Text link",
        url: "#",
        buttonType: "link",
        textColor: "#6d5dfc",
      };

      const outlineStyle = buttonMarkup(renderButton(outline), outline.id).match(/style="([^"]*)"/)?.[1] ?? "";
      const linkStyle = buttonMarkup(renderButton(link), link.id).match(/style="([^"]*)"/)?.[1] ?? "";

      expect(outlineStyle).toContain("background-color:transparent");
      expect(outlineStyle).toContain("border:2px solid #6d5dfc");
      expect(linkStyle).toContain("background-color:transparent");
      expect(linkStyle).toContain("text-decoration:underline");
    });
  });

  describe("shared style panel", () => {
    it("should apply typography CSS to the button host", () => {
      const button = createBuilderElement("button");
      button.styles = {
        desktop: {
          normal: {
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 1,
            textTransform: "uppercase",
          },
        },
      };

      const css = styleBlockFor(renderButton(button), button.id);

      expect(css).toContain("font-family:Georgia, serif");
      expect(css).toContain("font-weight:700");
      expect(css).toContain("font-size:18px");
      expect(css).toContain("letter-spacing:1px");
      expect(css).toContain("text-transform:uppercase");
    });

    it("should apply border settings from the style panel", () => {
      const button = createBuilderElement("button");
      button.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
          },
        },
      };

      const css = styleBlockFor(renderButton(button), button.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
    });

    it("should defer prop background and text colors when style panel sets them", () => {
      const button = createBuilderElement("button");
      button.props = {
        text: "Styled",
        url: "#",
        backgroundColor: "#112233",
        textColor: "#ffffff",
      };
      button.styles = {
        desktop: {
          normal: {
            backgroundColor: "#ff6600",
            color: "#001122",
          },
        },
      };

      const html = renderButton(button);
      const inlineStyle = buttonMarkup(html, button.id).match(/style="([^"]*)"/)?.[1] ?? "";
      const css = styleBlockFor(html, button.id);

      expect(inlineStyle).not.toContain("background-color:#112233");
      expect(inlineStyle).not.toContain("color:#ffffff");
      expect(css).toContain("background-color:#ff6600");
      expect(css).toContain("color:#001122");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile typography overrides", () => {
      const button = createBuilderElement("button");
      button.styles = {
        desktop: { normal: { fontSize: 18 } },
        tablet: { normal: { fontSize: 16 } },
        mobile: { normal: { fontSize: 14 } },
      };

      const html = renderButton(button);

      expect(html).toContain(`[data-npb-id="${button.id}"]{font-size:18px`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${button.id}"]{font-size:16px}}`);
      expect(html).toContain(`@media(max-width:767px){[data-npb-id="${button.id}"]{font-size:14px}}`);
    });

    it("should emit hover background and text styles on the button host", () => {
      const button = createBuilderElement("button");
      button.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff", color: "#111111" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderButton(button);
      const hover = hoverBlockFor(html, button.id);

      expect(styleBlockFor(html, button.id)).toContain("background-color:#ffffff");
      expect(styleBlockFor(html, button.id)).toContain("color:#111111");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the button on selected breakpoints", () => {
      const button = createBuilderElement("button");
      button.advanced = { hideOnMobile: true };

      const html = renderButton(button);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${button.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the button host", () => {
      const button = createBuilderElement("button");
      button.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderButton(button);
      const anchor = buttonMarkup(html, button.id);

      expect(anchor).toContain("npb-animate");
      expect(anchor).toContain("npb-animate-fadeInUp");
      expect(anchor).toContain("npb-animate-fast");
      expect(anchor).toContain("animation-delay:250ms");
    });
  });
});
