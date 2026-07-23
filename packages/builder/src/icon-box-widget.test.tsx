import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderIconBox(element: BuilderElement, extras: BuilderElement[] = []) {
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

function iconBoxRoot(html: string): string {
  const match = html.match(/<div class="npb-icon-box[^"]*"[^>]*>[\s\S]*<\/div>/);
  return match?.[0] ?? "";
}

function iconBoxRootStyle(html: string): string {
  return iconBoxRoot(html).match(/^<div[^>]*style="([^"]*)"/)?.[1] ?? "";
}

function iconSpan(html: string): string {
  const match = html.match(/<span class="npb-icon-box-icon"[^>]*>[\s\S]*?<\/span>/);
  return match?.[0] ?? "";
}

function iconSpanStyle(html: string): string {
  return iconSpan(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

describe("icon-box widget settings", () => {
  describe("content props", () => {
    it("should render icon, title, and description", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        icon: "🍽",
        title: "Food Hall",
        description: "Curated local culinary experiences.",
      };

      const html = renderIconBox(iconBox);

      expect(html).toContain(`data-npb-id="${iconBox.id}"`);
      expect(html).toContain('class="npb-icon-box npb-view-default npb-shape-circle"');
      expect(html).toContain("🍽");
      expect(html).toContain("Food Hall");
      expect(html).toContain("Curated local culinary experiences.");
    });

    it("should fall back to default icon, title, and description", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {};

      const html = renderIconBox(iconBox);

      expect(html).toContain("★");
      expect(html).toContain("This is the heading");
      expect(html).toContain("Lorem ipsum dolor sit amet");
    });

    it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
      "should render title with semantic %s tag",
      (titleTag) => {
        const iconBox = createBuilderElement("icon-box");
        iconBox.props = { title: "Feature title", titleTag };

        const html = renderIconBox(iconBox);

        expect(html).toContain(`<${titleTag}`);
        expect(html).toContain("Feature title");
      },
    );

    it("should wrap the icon box in an anchor when link is set", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        icon: "→",
        title: "Linked box",
        link: "https://example.com/icon-box",
      };

      const html = renderIconBox(iconBox);

      expect(html).toContain('href="https://example.com/icon-box"');
      expect(html).toContain('class="npb-div-link"');
      expect(html).toMatch(
        /<a href="https:\/\/example.com\/icon-box" class="npb-div-link">[\s\S]*<div class="npb-icon-box/,
      );
      expect(html).toContain(`data-npb-id="${iconBox.id}"`);
    });

    it("should render without a link wrapper when link is empty", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "→", title: "Plain box", link: "" };

      const html = renderIconBox(iconBox);

      expect(html).not.toContain('class="npb-div-link"');
      expect(html).toContain('class="npb-icon-box');
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.advanced = { cssId: "feature-icon-box" };

      const html = renderIconBox(iconBox);

      expect(html).toContain('id="feature-icon-box"');
      expect(html).toContain(`data-npb-id="${iconBox.id}"`);
    });
  });

  describe("view and shape props", () => {
    it("should apply default view and circle shape classes", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "★" };

      const html = renderIconBox(iconBox);

      expect(html).toContain("npb-view-default");
      expect(html).toContain("npb-shape-circle");
    });

    it("should apply stacked view with primary background and secondary icon color", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        icon: "▦",
        view: "stacked",
        primaryColor: "#6d5dfc",
        secondaryColor: "#fff",
      };

      const html = renderIconBox(iconBox);
      const style = iconSpanStyle(html);

      expect(html).toContain("npb-view-stacked");
      expect(style).toContain("color:#fff");
      expect(style).toContain("background:#6d5dfc");
    });

    it("should apply framed view with a primary-color border", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        icon: "▭",
        view: "framed",
        primaryColor: "#7c3aed",
        iconBorderWidth: 3,
      };

      const html = renderIconBox(iconBox);
      const style = iconSpanStyle(html);

      expect(html).toContain("npb-view-framed");
      expect(style).toContain("color:#7c3aed");
      expect(style).toContain("border:3px solid #7c3aed");
    });

    it("should use a circular radius for circle shape", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "★", shape: "circle" };

      const style = iconSpanStyle(renderIconBox(iconBox));

      expect(style).toContain("border-radius:50%");
    });

    it("should apply square shape class and configurable border radius", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        icon: "▭",
        shape: "square",
        iconBorderRadius: 8,
      };

      const html = renderIconBox(iconBox);
      const style = iconSpanStyle(html);

      expect(html).toContain("npb-shape-square");
      expect(style).toContain("border-radius:8");
    });

    it("should default square border radius to the control default", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "▭", shape: "square" };

      const style = iconSpanStyle(renderIconBox(iconBox));

      expect(style).toContain("border-radius:50");
    });

    it("should fall back to default primary and secondary colors", () => {
      const defaultView = createBuilderElement("icon-box");
      defaultView.props = { icon: "★", view: "default" };

      const stacked = createBuilderElement("icon-box");
      stacked.props = { icon: "★", view: "stacked" };

      const defaultStyle = iconSpanStyle(renderIconBox(defaultView));
      const stackedStyle = iconSpanStyle(renderIconBox(stacked));

      expect(defaultStyle).toContain("color:#4054b2");
      expect(stackedStyle).toContain("color:#fff");
      expect(stackedStyle).toContain("background:#4054b2");
    });
  });

  describe("layout props", () => {
    it("should lay out icon above content by default", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { iconPosition: "top" };

      const style = iconBoxRootStyle(renderIconBox(iconBox));

      expect(style).toContain("flex-direction:column");
      expect(iconSpanStyle(renderIconBox(iconBox))).toContain("order:0");
    });

    it("should lay out icon below content when position is bottom", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { iconPosition: "bottom" };

      const html = renderIconBox(iconBox);
      const style = iconBoxRootStyle(html);

      expect(style).toContain("flex-direction:column");
      expect(iconSpanStyle(html)).toContain("order:2");
    });

    it("should lay out icon beside content when position is left or right", () => {
      const left = createBuilderElement("icon-box");
      left.props = { iconPosition: "left" };

      const right = createBuilderElement("icon-box");
      right.props = { iconPosition: "right" };

      expect(iconBoxRootStyle(renderIconBox(left))).toContain("flex-direction:row");
      expect(iconSpanStyle(renderIconBox(left))).toContain("order:0");
      expect(iconBoxRootStyle(renderIconBox(right))).toContain("flex-direction:row");
      expect(iconSpanStyle(renderIconBox(right))).toContain("order:2");
    });

    it("should align items vertically within the box", () => {
      const top = createBuilderElement("icon-box");
      top.props = { iconPosition: "left", verticalAlign: "top" };

      const middle = createBuilderElement("icon-box");
      middle.props = { iconPosition: "left", verticalAlign: "middle" };

      const bottom = createBuilderElement("icon-box");
      bottom.props = { iconPosition: "left", verticalAlign: "bottom" };

      expect(iconBoxRootStyle(renderIconBox(top))).toContain("align-items:flex-start");
      expect(iconBoxRootStyle(renderIconBox(middle))).toContain("align-items:center");
      expect(iconBoxRootStyle(renderIconBox(bottom))).toContain("align-items:flex-end");
    });

    it("should align text within the box", () => {
      const left = createBuilderElement("icon-box");
      left.props = { align: "left" };

      const center = createBuilderElement("icon-box");
      center.props = { align: "center" };

      const right = createBuilderElement("icon-box");
      right.props = { align: "right" };

      const justify = createBuilderElement("icon-box");
      justify.props = { align: "justify" };

      expect(iconBoxRootStyle(renderIconBox(left))).toContain("text-align:left");
      expect(iconBoxRootStyle(renderIconBox(center))).toContain("text-align:center");
      expect(iconBoxRootStyle(renderIconBox(right))).toContain("text-align:right");
      expect(iconBoxRootStyle(renderIconBox(justify))).toContain("text-align:justify");
    });

    it("should apply icon spacing and content spacing", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        iconSpacing: 24,
        contentSpacing: 8,
      };

      const html = renderIconBox(iconBox);
      const rootStyle = iconBoxRootStyle(html);
      const descriptionStyle = html.match(/<p style="([^"]*)"/)?.[1] ?? "";

      expect(rootStyle).toContain("gap:24");
      expect(descriptionStyle).toContain("margin-top:8");
    });
  });

  describe("icon style props", () => {
    it("should apply icon size, padding, and rotation", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        icon: "★",
        iconSize: 36,
        iconPadding: 6,
        iconRotate: 15,
      };

      const style = iconSpanStyle(renderIconBox(iconBox));

      expect(style).toContain("font-size:36");
      expect(style).toContain("padding:6");
      expect(style).toContain("transform:rotate(15deg)");
    });
  });

  describe("content style props", () => {
    it("should apply title and description typography colors and sizes", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = {
        title: "Styled title",
        description: "Styled description",
        titleTag: "h2",
        titleColor: "#112233",
        titleFontSize: 24,
        descriptionColor: "#445566",
        descriptionFontSize: 16,
      };

      const html = renderIconBox(iconBox);
      const titleStyle = html.match(/<h2 style="([^"]*)"/)?.[1] ?? "";
      const descriptionStyle = html.match(/<p style="([^"]*)"/)?.[1] ?? "";

      expect(titleStyle).toContain("color:#112233");
      expect(titleStyle).toContain("font-size:24");
      expect(descriptionStyle).toContain("color:#445566");
      expect(descriptionStyle).toContain("font-size:16");
    });
  });

  describe("shared style panel", () => {
    it("should apply margin on the host wrapper", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "★" };
      iconBox.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderIconBox(iconBox), iconBox.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "★" };
      iconBox.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderIconBox(iconBox);

      expect(styleBlockFor(html, iconBox.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, iconBox.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the icon box on selected breakpoints", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "★" };
      iconBox.advanced = { hideOnMobile: true };

      const html = renderIconBox(iconBox);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${iconBox.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const iconBox = createBuilderElement("icon-box");
      iconBox.props = { icon: "★" };
      iconBox.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderIconBox(iconBox);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
