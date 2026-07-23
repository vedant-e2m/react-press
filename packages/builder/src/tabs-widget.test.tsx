import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderTabs(element: BuilderElement, extras: BuilderElement[] = []) {
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

function tabsBlock(html: string): string {
  const match = html.match(/<div class="npb-tabs[^"]*"[\s\S]*?<\/div>\s*<\/div>/);
  return match?.[0] ?? "";
}

function tabsRoot(html: string): string {
  const match = html.match(/<div class="npb-tabs npb-tabs-[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

describe("tabs widget settings", () => {
  describe("widget registration", () => {
    it("should expose content, settings, and style controls", () => {
      const widget = getBuilderWidget("tabs");

      expect(widget?.defaultProps).toEqual({
        items: [
          {
            title: "Tab #1",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
          },
          {
            title: "Tab #2",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
          },
          {
            title: "Tab #3",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
          },
        ],
        direction: "horizontal",
        align: "start",
      });

      const contentSection = widget?.controls.find((section) => section.label === "Content");
      const settingsSection = widget?.controls.find((section) => section.label === "Settings");
      const tabsStyleSection = widget?.controls.find((section) => section.label === "Tabs");

      expect(contentSection?.controls.map((control) => control.key)).toEqual(["items", "direction"]);
      expect(settingsSection?.controls.map((control) => control.key)).toEqual(["align"]);
      expect(tabsStyleSection?.controls.map((control) => control.key)).toEqual([
        "titleColor",
        "activeTitleColor",
        "contentColor",
        "titleSpacing",
      ]);
    });
  });

  describe("general props", () => {
    it("should render tab labels and first panel content by default", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        items: [
          { title: "Overview", content: "Overview copy." },
          { title: "Details", content: "Details copy." },
        ],
      };

      const html = renderTabs(tabs);
      const block = tabsBlock(html);

      expect(html).toContain(`data-npb-id="${tabs.id}"`);
      expect(block).toContain('class="npb-tabs npb-tabs-horizontal"');
      expect(block).toContain("Overview");
      expect(block).toContain("Details");
      expect(block).toContain("Overview copy.");
      expect(block).toContain("Details copy.");
      expect(block).toContain('role="tablist"');
      expect(block).toContain('role="tabpanel"');
    });

    it("should render radio inputs for each tab with the first checked", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        items: [
          { title: "One", content: "First" },
          { title: "Two", content: "Second" },
        ],
      };

      const html = renderTabs(tabs);

      expect(html).toContain(`name="npb-tabs-${tabs.id}"`);
      expect(html).toContain(`id="${tabs.id}-tab-0"`);
      expect(html).toContain(`id="${tabs.id}-tab-1"`);
      expect(html).toMatch(new RegExp(`id="${tabs.id}-tab-0"[^>]*checked`));
      expect(html).not.toMatch(new RegExp(`id="${tabs.id}-tab-1"[^>]*checked`));
    });

    it("should wire labels to their tab inputs", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        items: [
          { title: "Alpha", content: "A" },
          { title: "Beta", content: "B" },
        ],
      };

      const html = renderTabs(tabs);

      expect(html).toContain(`for="${tabs.id}-tab-0"`);
      expect(html).toContain(`for="${tabs.id}-tab-1"`);
      expect(html).toContain('class="npb-tabs-label"');
    });

    it("should render an empty shell when items are missing", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = { items: [] };

      const html = renderTabs(tabs);

      expect(html).toContain('class="npb-tabs npb-tabs-empty npb-tabs-horizontal"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toContain("npb-tabs-label");
      expect(html).not.toContain("npb-tabs-panel");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const tabs = createBuilderElement("tabs");
      tabs.advanced = { cssId: "feature-tabs" };

      const html = renderTabs(tabs);

      expect(html).toContain('id="feature-tabs"');
      expect(html).toContain(`data-npb-id="${tabs.id}"`);
    });
  });

  describe("layout props", () => {
    it("should apply horizontal direction and column outer layout", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        direction: "horizontal",
        items: [{ title: "Tab", content: "Body" }],
      };

      const html = renderTabs(tabs);
      const root = tabsRoot(html);

      expect(root).toContain("npb-tabs-horizontal");
      expect(root).toMatch(/style="[^"]*flex-direction:column/);
    });

    it("should apply vertical direction and row outer layout", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        direction: "vertical",
        items: [{ title: "Tab", content: "Body" }],
      };

      const html = renderTabs(tabs);
      const root = tabsRoot(html);

      expect(root).toContain("npb-tabs-vertical");
      expect(root).toMatch(/style="[^"]*flex-direction:row/);
    });

    it.each([
      ["start", "justify-content:flex-start"],
      ["center", "justify-content:center"],
      ["end", "justify-content:flex-end"],
      ["stretch", "justify-content:stretch"],
    ] as const)("should align tab labels to %s", (align, expected) => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        align,
        items: [
          { title: "Left", content: "A" },
          { title: "Right", content: "B" },
        ],
      };

      const html = renderTabs(tabs);
      const navStyle = tabsBlock(html).match(/npb-tabs-nav[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(navStyle).toContain(expected);
    });

    it("should stretch horizontal tab labels across the nav width", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        direction: "horizontal",
        align: "stretch",
        items: [
          { title: "One", content: "A" },
          { title: "Two", content: "B" },
        ],
      };

      const html = renderTabs(tabs);
      const block = tabsBlock(html);
      const navStyle = block.match(/npb-tabs-nav[^>]*style="([^"]*)"/)?.[1] ?? "";
      const labelStyle = block.match(/npb-tabs-label[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(navStyle).toContain("width:100%");
      expect(labelStyle).toContain("flex:1");
      expect(labelStyle).toContain("text-align:center");
    });
  });

  describe("style props", () => {
    it("should apply title, active, and content colors via CSS variables and inline styles", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        titleColor: "#6b7280",
        activeTitleColor: "#6d5dfc",
        contentColor: "#374151",
        titleSpacing: 16,
        items: [{ title: "Styled", content: "Colored body" }],
      };

      const html = renderTabs(tabs);
      const root = tabsRoot(html);
      const panelsStyle = tabsBlock(html).match(/npb-tabs-panels[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(root).toContain("--npb-tabs-active-color:#6d5dfc");
      expect(root).toContain("--npb-tabs-title-color:#6b7280");
      expect(root).toMatch(/style="[^"]*gap:16/);
      expect(panelsStyle).toContain("color:#374151");
    });

    it("should fall back to the default active color when activeTitleColor is absent", () => {
      const tabs = createBuilderElement("tabs");
      tabs.props = {
        items: [{ title: "Default", content: "Body" }],
      };

      const html = renderTabs(tabs);

      expect(tabsRoot(html)).toContain("--npb-tabs-active-color:#4054b2");
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

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
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

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
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

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
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

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
    it("should apply typography CSS to the tabs host", () => {
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

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
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

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
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
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

      const css = styleBlockFor(renderTabs(tabs), tabs.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile size overrides", () => {
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderTabs(tabs);

      expect(html).toContain(`[data-npb-id="${tabs.id}"]{width:600px;background-color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${tabs.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${tabs.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const tabs = createBuilderElement("tabs");
      tabs.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderTabs(tabs);
      const hover = hoverBlockFor(html, tabs.id);

      expect(styleBlockFor(html, tabs.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the tabs on selected breakpoints", () => {
      const tabs = createBuilderElement("tabs");
      tabs.advanced = { hideOnMobile: true };

      const html = renderTabs(tabs);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${tabs.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const tabs = createBuilderElement("tabs");
      tabs.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderTabs(tabs);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
