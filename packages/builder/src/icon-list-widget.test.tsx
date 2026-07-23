import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderIconList(element: BuilderElement, extras: BuilderElement[] = []) {
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

function iconListRoot(html: string): string {
  const match = html.match(/<ul class="npb-icon-list[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

function iconListRootStyle(html: string): string {
  return html.match(/<ul class="npb-icon-list[^"]*" style="([^"]*)"/)?.[1] ?? "";
}

function listItems(html: string): string[] {
  return html.match(/<li[^>]*>[\s\S]*?<\/li>/g) ?? [];
}

describe("icon-list widget settings", () => {
  describe("widget registration", () => {
    it("should expose content and style controls for every setting", () => {
      const widget = getBuilderWidget("icon-list");

      expect(widget?.defaultProps).toEqual({
        layout: "traditional",
        applyLinkOn: "full",
        spaceBetween: 0,
        align: "left",
        items: [
          { text: "List Item #1", icon: "✓", url: "" },
          { text: "List Item #2", icon: "✓", url: "" },
          { text: "List Item #3", icon: "✓", url: "" },
        ],
      });

      const iconListSection = widget?.controls.find((section) => section.label === "Icon List");
      const listSection = widget?.controls.find((section) => section.label === "List");
      const iconSection = widget?.controls.find((section) => section.label === "Icon");
      const textSection = widget?.controls.find((section) => section.label === "Text");

      expect(iconListSection?.controls.map((control) => control.key)).toEqual([
        "layout",
        "items",
        "applyLinkOn",
      ]);
      expect(listSection?.controls.map((control) => control.key)).toEqual([
        "spaceBetween",
        "align",
        "divider",
        "dividerStyle",
        "dividerColor",
        "dividerWeight",
      ]);
      expect(iconSection?.controls.map((control) => control.key)).toEqual([
        "iconColor",
        "iconSize",
        "iconGap",
      ]);
      expect(textSection?.controls.map((control) => control.key)).toEqual([
        "textColor",
        "textSize",
      ]);
    });
  });

  describe("content props", () => {
    it("should render default list items with icons and text", () => {
      const iconList = createBuilderElement("icon-list");

      const html = renderIconList(iconList);

      expect(html).toContain(`data-npb-id="${iconList.id}"`);
      expect(html).toContain('class="npb-icon-list npb-icon-list-traditional"');
      expect(html).toContain("List Item #1");
      expect(html).toContain("List Item #2");
      expect(html).toContain("List Item #3");
      expect(listItems(html)).toHaveLength(3);
    });

    it("should render custom repeater items", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        items: [
          { text: "Free Wi-Fi", icon: "📶", url: "#wifi" },
          { text: "Pet-friendly", icon: "🐾", url: "#pets" },
        ],
      };

      const html = renderIconList(iconList);

      expect(html).toContain("Free Wi-Fi");
      expect(html).toContain("Pet-friendly");
      expect(html).toContain("📶");
      expect(html).toContain("🐾");
      expect(listItems(html)).toHaveLength(2);
    });

    it("should fall back to the checkmark icon when item icon is omitted", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        items: [{ text: "No icon field", url: "" }],
      };

      const html = renderIconList(iconList);

      expect(html).toContain("No icon field");
      expect(html).toContain("✓");
    });

    it("should render an empty icon span when item icon is blank", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        items: [{ text: "Nav link", icon: "", url: "/vendors/" }],
      };

      const html = renderIconList(iconList);
      const item = listItems(html)[0] ?? "";

      expect(item).toContain("Nav link");
      expect(item).toMatch(/<span style="[^"]*"><\/span>/);
      expect(item).not.toContain("✓");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.advanced = { cssId: "amenities-list" };

      const html = renderIconList(iconList);

      expect(html).toContain('id="amenities-list"');
      expect(html).toContain(`data-npb-id="${iconList.id}"`);
    });
  });

  describe("layout props", () => {
    it("should use grid display for traditional layout", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = { layout: "traditional" };

      const html = renderIconList(iconList);

      expect(html).toContain("npb-icon-list-traditional");
      expect(iconListRootStyle(html)).toContain("display:grid");
    });

    it("should use flex display for inline layout", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = { layout: "inline", spaceBetween: 24 };

      const html = renderIconList(iconList);

      expect(html).toContain("npb-icon-list-inline");
      expect(iconListRootStyle(html)).toContain("display:flex");
      expect(iconListRootStyle(html)).toContain("gap:24");
    });

    it("should align list items within the root list", () => {
      const left = createBuilderElement("icon-list");
      left.props = { align: "left" };

      const center = createBuilderElement("icon-list");
      center.props = { align: "center" };

      const right = createBuilderElement("icon-list");
      right.props = { align: "right" };

      expect(iconListRootStyle(renderIconList(left))).toContain("justify-content:flex-start");
      expect(iconListRootStyle(renderIconList(center))).toContain("justify-content:center");
      expect(iconListRootStyle(renderIconList(right))).toContain("justify-content:flex-end");
    });

    it("should apply spaceBetween as the root list gap", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = { spaceBetween: 12 };

      expect(iconListRootStyle(renderIconList(iconList))).toContain("gap:12");
    });
  });

  describe("link props", () => {
    it("should wrap icon and text in a full-width anchor when applyLinkOn is full", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        applyLinkOn: "full",
        items: [{ text: "Linked item", icon: "→", url: "https://example.com/item" }],
      };

      const html = renderIconList(iconList);
      const item = listItems(html)[0] ?? "";

      expect(item).toContain('href="https://example.com/item"');
      expect(item).toMatch(/<a href="https:\/\/example.com\/item" style="[^"]*width:100%/);
      expect(item).toContain("Linked item");
      expect(item).toContain("→");
    });

    it("should link only the text when applyLinkOn is inline", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        applyLinkOn: "inline",
        items: [{ text: "Inline link", icon: "★", url: "https://example.com/inline" }],
      };

      const html = renderIconList(iconList);
      const item = listItems(html)[0] ?? "";

      expect(item).toMatch(/<span style="[^"]*">★<\/span>/);
      expect(item).toMatch(/<a href="https:\/\/example.com\/inline" style="[^"]*"><span>Inline link<\/span><\/a>/);
      expect(item).not.toMatch(/<a href="[^"]*">[\s\S]*★/);
    });

    it("should render items without anchors when url is empty", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        items: [{ text: "Plain item", icon: "•", url: "" }],
      };

      const html = renderIconList(iconList);
      const item = listItems(html)[0] ?? "";

      expect(item).not.toContain("<a ");
      expect(item).toContain("Plain item");
      expect(item).toContain("•");
    });
  });

  describe("divider props", () => {
    it("should omit dividers by default", () => {
      const iconList = createBuilderElement("icon-list");

      const item = listItems(renderIconList(iconList))[0] ?? "";

      expect(item).not.toContain("border-bottom");
    });

    it("should render divider borders with style, color, and weight", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        ...iconList.props,
        divider: true,
        dividerStyle: "dashed",
        dividerColor: "#e5e7eb",
        dividerWeight: 2,
      };

      const html = renderIconList(iconList);
      const item = listItems(html)[0] ?? "";

      expect(item).toContain("border-bottom:2px dashed #e5e7eb");
      expect(item).toContain("padding-bottom:8px");
    });

    it.each(["solid", "double", "dotted", "dashed"] as const)(
      "should support %s divider styles",
      (dividerStyle) => {
        const iconList = createBuilderElement("icon-list");
        iconList.props = { ...iconList.props, divider: true, dividerStyle };

        const item = listItems(renderIconList(iconList))[0] ?? "";

        expect(item).toContain(`border-bottom:1px ${dividerStyle}`);
      },
    );

    it("should fall back to the default divider color", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = { ...iconList.props, divider: true };

      const item = listItems(renderIconList(iconList))[0] ?? "";

      expect(item).toContain("border-bottom:1px solid #c2cbd2");
    });
  });

  describe("icon style props", () => {
    it("should apply icon color, size, and gap between icon and text", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        iconColor: "#6d5dfc",
        iconSize: 18,
        iconGap: 10,
        items: [{ text: "Styled icon", icon: "📶", url: "" }],
      };

      const html = renderIconList(iconList);
      const item = listItems(html)[0] ?? "";

      expect(item).toMatch(/<span style="[^"]*color:#6d5dfc/);
      expect(item).toMatch(/<span style="[^"]*font-size:18/);
      expect(item).toMatch(/<span style="[^"]*gap:10/);
    });
  });

  describe("text style props", () => {
    it("should apply text color and size on the root list", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.props = {
        textColor: "#374151",
        textSize: 15,
      };

      const style = iconListRootStyle(renderIconList(iconList));

      expect(style).toContain("color:#374151");
      expect(style).toContain("font-size:15");
    });
  });

  describe("shared style panel", () => {
    it("should apply margin on the host wrapper", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderIconList(iconList), iconList.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderIconList(iconList);

      expect(styleBlockFor(html, iconList.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, iconList.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the icon list on selected breakpoints", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.advanced = { hideOnMobile: true };

      const html = renderIconList(iconList);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${iconList.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const iconList = createBuilderElement("icon-list");
      iconList.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderIconList(iconList);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
