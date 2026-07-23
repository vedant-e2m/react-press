import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderIcon(element: BuilderElement) {
  const document = {
    ...EMPTY_BUILDER_DOCUMENT,
    content: [element],
  };
  return renderToStaticMarkup(<BuilderRenderer document={document} />);
}

function styleBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function hoverBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]\\:hover\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function iconSpan(html: string): string {
  const match = html.match(/<span class="npb-icon[^"]*"[^>]*>[\s\S]*?<\/span>/);
  return match?.[0] ?? "";
}

function iconSpanStyle(html: string): string {
  return iconSpan(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

describe("icon widget settings", () => {
  describe("content props", () => {
    it("should render the selected icon glyph on the host wrapper", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "⚡" };

      const html = renderIcon(icon);

      expect(html).toContain(`data-npb-id="${icon.id}"`);
      expect(html).toContain('class="npb-icon npb-view-default npb-shape-circle"');
      expect(html).toContain("⚡");
    });

    it("should fall back to the default star icon", () => {
      const icon = createBuilderElement("icon");
      icon.props = {};

      const html = renderIcon(icon);

      expect(html).toContain("★");
    });

    it("should wrap the icon in an anchor when link is set", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "→", link: "https://example.com/icons" };

      const html = renderIcon(icon);

      expect(html).toContain('href="https://example.com/icons"');
      expect(html).toMatch(/<a href="https:\/\/example.com\/icons">[\s\S]*<span class="npb-icon/);
    });

    it("should render without a link wrapper when link is empty", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "→", link: "" };

      const html = renderIcon(icon);

      expect(html).not.toContain("<a ");
      expect(html).toContain('class="npb-icon');
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const icon = createBuilderElement("icon");
      icon.advanced = { cssId: "feature-icon" };

      const html = renderIcon(icon);

      expect(html).toContain('id="feature-icon"');
      expect(html).toContain(`data-npb-id="${icon.id}"`);
    });
  });

  describe("view and shape props", () => {
    it("should apply default view and circle shape classes", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "★" };

      const html = renderIcon(icon);

      expect(html).toContain("npb-view-default");
      expect(html).toContain("npb-shape-circle");
    });

    it("should apply stacked view with primary background and secondary icon color", () => {
      const icon = createBuilderElement("icon");
      icon.props = {
        icon: "▦",
        view: "stacked",
        primaryColor: "#6d5dfc",
        secondaryColor: "#fff",
      };

      const style = iconSpanStyle(renderIcon(icon));

      expect(iconSpan(renderIcon(icon))).toContain("npb-view-stacked");
      expect(style).toContain("color:#fff");
      expect(style).toContain("background:#6d5dfc");
    });

    it("should apply framed view with a primary-color border", () => {
      const icon = createBuilderElement("icon");
      icon.props = {
        icon: "▭",
        view: "framed",
        primaryColor: "#7c3aed",
        borderWidth: 3,
      };

      const style = iconSpanStyle(renderIcon(icon));

      expect(iconSpan(renderIcon(icon))).toContain("npb-view-framed");
      expect(style).toContain("color:#7c3aed");
      expect(style).toContain("border:3px solid #7c3aed");
    });

    it("should use a circular radius for circle shape", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "★", shape: "circle" };

      const style = iconSpanStyle(renderIcon(icon));

      expect(style).toContain("border-radius:50%");
    });

    it("should apply square shape class and configurable border radius", () => {
      const icon = createBuilderElement("icon");
      icon.props = {
        icon: "▭",
        shape: "square",
        borderRadius: 8,
      };

      const html = renderIcon(icon);
      const style = iconSpanStyle(html);

      expect(html).toContain("npb-shape-square");
      expect(style).toContain("border-radius:8");
    });

    it("should default square border radius to the control default", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "▭", shape: "square" };

      const style = iconSpanStyle(renderIcon(icon));

      expect(style).toContain("border-radius:50");
    });
  });

  describe("style props", () => {
    it("should align the icon within its wrapper", () => {
      const left = createBuilderElement("icon");
      left.props = { icon: "★", align: "left" };

      const center = createBuilderElement("icon");
      center.props = { icon: "★", align: "center" };

      const right = createBuilderElement("icon");
      right.props = { icon: "★", align: "right" };

      expect(renderIcon(left)).toMatch(/text-align:left/);
      expect(renderIcon(center)).toMatch(/text-align:center/);
      expect(renderIcon(right)).toMatch(/text-align:right/);
    });

    it("should apply size, padding, and rotation", () => {
      const icon = createBuilderElement("icon");
      icon.props = {
        icon: "★",
        size: 36,
        padding: 6,
        rotate: 15,
      };

      const style = iconSpanStyle(renderIcon(icon));

      expect(style).toContain("font-size:36");
      expect(style).toContain("padding:6");
      expect(style).toContain("transform:rotate(15deg)");
    });

    it("should size the icon box when fitToSize is enabled", () => {
      const icon = createBuilderElement("icon");
      icon.props = {
        icon: "▦",
        view: "stacked",
        size: 36,
        padding: 6,
        fitToSize: true,
      };

      const style = iconSpanStyle(renderIcon(icon));

      expect(style).toContain("width:48");
      expect(style).toContain("height:48");
    });

    it("should not force box dimensions when fitToSize is disabled", () => {
      const icon = createBuilderElement("icon");
      icon.props = {
        icon: "▦",
        view: "stacked",
        size: 36,
        padding: 6,
        fitToSize: false,
      };

      const style = iconSpanStyle(renderIcon(icon));

      expect(style).not.toContain("width:");
      expect(style).not.toContain("height:");
    });

    it("should fall back to default primary and secondary colors", () => {
      const defaultView = createBuilderElement("icon");
      defaultView.props = { icon: "★", view: "default" };

      const stacked = createBuilderElement("icon");
      stacked.props = { icon: "★", view: "stacked" };

      const defaultStyle = iconSpanStyle(renderIcon(defaultView));
      const stackedStyle = iconSpanStyle(renderIcon(stacked));

      expect(defaultStyle).toContain("color:#4054b2");
      expect(stackedStyle).toContain("color:#fff");
      expect(stackedStyle).toContain("background:#4054b2");
    });
  });

  describe("shared style panel", () => {
    it("should apply margin on the host wrapper", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "★" };
      icon.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderIcon(icon), icon.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "★" };
      icon.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderIcon(icon);

      expect(styleBlockFor(html, icon.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, icon.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the icon on selected breakpoints", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "★" };
      icon.advanced = { hideOnMobile: true };

      const html = renderIcon(icon);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${icon.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const icon = createBuilderElement("icon");
      icon.props = { icon: "★" };
      icon.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderIcon(icon);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
