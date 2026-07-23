import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderSocialIcons(element: BuilderElement, extras: BuilderElement[] = []) {
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

function socialRoot(html: string): string {
  const match = html.match(/<div class="npb-social[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

function socialRootStyle(html: string): string {
  return socialRoot(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

function socialLinks(html: string): string[] {
  return html.match(/<a[^>]*aria-label="[^"]*"[^>]*>[\s\S]*?<\/a>/g) ?? [];
}

function linkStyle(html: string, index = 0): string {
  return socialLinks(html)[index]?.match(/style="([^"]*)"/)?.[1] ?? "";
}

describe("social-icons widget settings", () => {
  describe("widget registration", () => {
    it("should expose content and style controls for every setting", () => {
      const widget = getBuilderWidget("social-icons");

      expect(widget?.defaultProps).toEqual({
        items: [
          { network: "Facebook", icon: "f", url: "#" },
          { network: "X", icon: "𝕏", url: "#" },
          { network: "YouTube", icon: "▶", url: "#" },
        ],
        shape: "rounded",
        columns: "auto",
        align: "center",
        size: 25,
        spacing: 5,
        padding: 10,
      });

      const socialSection = widget?.controls.find((section) => section.label === "Social Icons");
      const iconSection = widget?.controls.find((section) => section.label === "Icon");

      expect(socialSection?.controls.map((control) => control.key)).toEqual([
        "items",
        "shape",
        "columns",
        "align",
      ]);
      expect(iconSection?.controls.map((control) => control.key)).toEqual([
        "size",
        "padding",
        "spacing",
        "primaryColor",
        "secondaryColor",
      ]);
    });
  });

  describe("content props", () => {
    it("should render default social links with icons and aria labels", () => {
      const socialIcons = createBuilderElement("social-icons");

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain(`data-npb-id="${socialIcons.id}"`);
      expect(html).toContain('class="npb-social npb-social-rounded"');
      expect(html).toContain('aria-label="Facebook"');
      expect(html).toContain('aria-label="X"');
      expect(html).toContain('aria-label="YouTube"');
      expect(html).toContain("f");
      expect(html).toContain("𝕏");
      expect(html).toContain("▶");
      expect(socialLinks(html)).toHaveLength(3);
    });

    it("should render custom repeater items with urls", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        items: [
          { network: "Instagram", icon: "IG", url: "https://instagram.com/publicmarket" },
          { network: "LinkedIn", icon: "in", url: "https://linkedin.com/company/publicmarket" },
        ],
      };

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain('href="https://instagram.com/publicmarket"');
      expect(html).toContain('href="https://linkedin.com/company/publicmarket"');
      expect(html).toContain('aria-label="Instagram"');
      expect(html).toContain('aria-label="LinkedIn"');
      expect(html).toContain("IG");
      expect(html).toContain("in");
      expect(socialLinks(html)).toHaveLength(2);
    });

    it("should fall back to the default icon glyph when item icon is omitted", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        items: [{ network: "Custom", url: "#custom" }],
      };

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain('aria-label="Custom"');
      expect(html).toContain("●");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.advanced = { cssId: "footer-social" };

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain('id="footer-social"');
      expect(html).toContain(`data-npb-id="${socialIcons.id}"`);
    });
  });

  describe("layout props", () => {
    it("should use auto-fit grid columns by default", () => {
      const socialIcons = createBuilderElement("social-icons");

      const style = socialRootStyle(renderSocialIcons(socialIcons));

      expect(style).toContain("display:grid");
      expect(style).toContain("repeat(auto-fit, minmax(40px, max-content))");
    });

    it.each(["1", "2", "3", "4", "5", "6"] as const)(
      "should use a fixed %s-column grid when columns is set",
      (columns) => {
        const socialIcons = createBuilderElement("social-icons");
        socialIcons.props = { columns };

        const style = socialRootStyle(renderSocialIcons(socialIcons));

        expect(style).toContain(`repeat(${columns}, max-content)`);
      },
    );

    it("should align the icon grid within the host wrapper", () => {
      const left = createBuilderElement("social-icons");
      left.props = { align: "left" };

      const center = createBuilderElement("social-icons");
      center.props = { align: "center" };

      const right = createBuilderElement("social-icons");
      right.props = { align: "right" };

      expect(socialRootStyle(renderSocialIcons(left))).toContain("justify-content:flex-start");
      expect(socialRootStyle(renderSocialIcons(center))).toContain("justify-content:center");
      expect(socialRootStyle(renderSocialIcons(right))).toContain("justify-content:flex-end");
    });

    it("should apply spacing as the grid gap", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = { spacing: 20 };

      expect(socialRootStyle(renderSocialIcons(socialIcons))).toContain("gap:20");
    });
  });

  describe("shape props", () => {
    it.each([
      ["square", "0"],
      ["rounded", "6"],
      ["circle", "50%"],
    ] as const)("should apply %s shape class and border radius", (shape, borderRadius) => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = { shape, items: [{ network: "Facebook", icon: "f", url: "#" }] };

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain(`npb-social-${shape}`);
      expect(linkStyle(html)).toContain(`border-radius:${borderRadius}`);
    });
  });

  describe("icon style props", () => {
    it("should size icons from size and padding", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        size: 18,
        padding: 0,
        items: [{ network: "Instagram", icon: "IG", url: "#" }],
      };

      const style = linkStyle(renderSocialIcons(socialIcons));

      expect(style).toContain("width:18");
      expect(style).toContain("height:18");
      expect(style).toContain("font-size:18");
    });

    it("should include padding in the icon box dimensions", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        size: 20,
        padding: 12,
        items: [{ network: "Facebook", icon: "f", url: "#" }],
      };

      const style = linkStyle(renderSocialIcons(socialIcons));

      expect(style).toContain("width:44");
      expect(style).toContain("height:44");
      expect(style).toContain("font-size:20");
    });

    it("should apply primary and secondary colors", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        primaryColor: "#ffffff",
        secondaryColor: "#6d5dfc",
        items: [{ network: "Facebook", icon: "f", url: "#" }],
      };

      const style = linkStyle(renderSocialIcons(socialIcons));

      expect(style).toContain("color:#ffffff");
      expect(style).toContain("background:#6d5dfc");
    });

    it("should accept legacy color prop as primary color fallback", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        color: "#fefefe",
        secondaryColor: "#112233",
        items: [{ network: "Facebook", icon: "f", url: "#" }],
      };

      const style = linkStyle(renderSocialIcons(socialIcons));

      expect(style).toContain("color:#fefefe");
      expect(style).toContain("background:#112233");
    });

    it("should fall back to default primary and secondary colors", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.props = {
        items: [{ network: "Facebook", icon: "f", url: "#" }],
      };

      const style = linkStyle(renderSocialIcons(socialIcons));

      expect(style).toContain("color:#fff");
      expect(style).toContain("background:#4054b2");
    });
  });

  describe("shared style panel", () => {
    it("should apply margin on the host wrapper", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderSocialIcons(socialIcons), socialIcons.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderSocialIcons(socialIcons);

      expect(styleBlockFor(html, socialIcons.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, socialIcons.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the social icons on selected breakpoints", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.advanced = { hideOnMobile: true };

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${socialIcons.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const socialIcons = createBuilderElement("social-icons");
      socialIcons.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderSocialIcons(socialIcons);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
