import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderContainer(element: BuilderElement, extras: BuilderElement[] = []) {
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

function inlineStyleFor(html: string, id: string): string {
  const match = html.match(new RegExp(`data-npb-id="${id}"[^>]*style="([^"]*)"`));
  return match?.[1] ?? "";
}

describe("container widget settings", () => {
  describe("container layout props", () => {
    it("should render flexbox layout from containerLayout prop", () => {
      const container = createBuilderElement("container");
      container.props = {
        containerLayout: "flexbox",
        contentWidth: "full",
        width: 100,
        direction: "row",
        justify: "center",
        align: "center",
        gap: 24,
        wrap: "wrap",
        minHeight: 0,
      };

      const html = renderContainer(container);
      const inline = inlineStyleFor(html, container.id);

      expect(html).toContain(`data-npb-id="${container.id}"`);
      expect(html).toContain('class="npb-container"');
      expect(inline).toContain("display:flex");
      expect(inline).toContain("flex-direction:row");
      expect(inline).toContain("justify-content:center");
      expect(inline).toContain("align-items:center");
      expect(inline).toContain("flex-wrap:wrap");
      expect(inline).toContain("gap:24px");
      expect(inline).toContain("width:100%");
    });

    it("should render grid layout when containerLayout is grid", () => {
      const container = createBuilderElement("container");
      container.props = {
        containerLayout: "grid",
        contentWidth: "full",
        width: 100,
        justify: "center",
        align: "center",
        gap: 16,
        minHeight: 0,
        direction: "row",
        wrap: "nowrap",
      };

      const html = renderContainer(container);
      const inline = inlineStyleFor(html, container.id);

      expect(inline).toContain("display:grid");
      expect(inline).not.toContain("flex-direction");
      expect(inline).not.toContain("flex-wrap");
      expect(inline).toContain("justify-content:center");
      expect(inline).toContain("align-items:center");
      expect(inline).toContain("gap:16px");
    });

    it("should apply grid template columns from Advanced tab styles", () => {
      const container = createBuilderElement("container");
      container.props = { containerLayout: "grid", contentWidth: "full", width: 100, gap: 12, minHeight: 0, direction: "column", justify: "flex-start", align: "stretch", wrap: "nowrap" };
      container.styles = {
        desktop: {
          normal: {
            gridTemplateColumns: "1fr 1fr",
            paddingTop: 20,
            backgroundColor: "#ecfdf5",
          },
        },
      };

      const css = styleBlockFor(renderContainer(container), container.id);

      expect(css).toContain("grid-template-columns:1fr 1fr");
      expect(css).toContain("padding-top:20px");
      expect(css).toContain("background-color:#ecfdf5");
    });
  });

  describe("content width and size props", () => {
    it("should constrain boxed content width and center horizontally", () => {
      const container = createBuilderElement("container");
      container.props = {
        containerLayout: "flexbox",
        contentWidth: "boxed",
        width: 100,
        direction: "column",
        justify: "flex-start",
        align: "stretch",
        gap: 20,
        wrap: "nowrap",
        minHeight: 0,
      };

      const inline = inlineStyleFor(renderContainer(container), container.id);

      expect(inline).toContain("width:min(100%, var(--npb-content-width, 1200px))");
      expect(inline).toContain("margin-inline:auto");
    });

    it("should honor partial width percentage for full-width containers", () => {
      const container = createBuilderElement("container");
      container.props = {
        containerLayout: "flexbox",
        contentWidth: "full",
        width: 75,
        direction: "column",
        justify: "flex-start",
        align: "stretch",
        gap: 20,
        wrap: "nowrap",
        minHeight: 0,
      };

      const inline = inlineStyleFor(renderContainer(container), container.id);

      expect(inline).toContain("width:75%");
      expect(inline).not.toContain("margin-inline");
    });

    it("should apply minHeight from General props", () => {
      const container = createBuilderElement("container");
      container.props = {
        containerLayout: "flexbox",
        contentWidth: "full",
        width: 100,
        direction: "column",
        justify: "flex-start",
        align: "stretch",
        gap: 20,
        wrap: "nowrap",
        minHeight: 160,
      };

      const inline = inlineStyleFor(renderContainer(container), container.id);

      expect(inline).toContain("min-height:160px");
    });
  });

  describe("flex item props", () => {
    it("should apply direction, justify, align, gap, and wrap defaults", () => {
      const container = createBuilderElement("container");

      const inline = inlineStyleFor(renderContainer(container), container.id);

      expect(inline).toContain("flex-direction:column");
      expect(inline).toContain("justify-content:flex-start");
      expect(inline).toContain("align-items:stretch");
      expect(inline).toContain("flex-wrap:nowrap");
      expect(inline).toContain("gap:20px");
    });

    it("should make nested children direct flex items of the host", () => {
      const parent = createBuilderElement("container");
      parent.id = "flex-parent";
      parent.props = {
        containerLayout: "flexbox",
        contentWidth: "full",
        width: 100,
        direction: "row",
        justify: "flex-start",
        align: "stretch",
        gap: 12,
        wrap: "nowrap",
        minHeight: 0,
      };

      const childA = createBuilderElement("heading");
      childA.id = "child-a";
      childA.props = { text: "A", tag: "h3" };

      const childB = createBuilderElement("heading");
      childB.id = "child-b";
      childB.props = { text: "B", tag: "h3" };

      parent.children = [childA, childB];

      const html = renderContainer(parent);

      expect(inlineStyleFor(html, parent.id)).toContain("display:flex");
      expect(html).toMatch(
        /data-npb-id="flex-parent"[^>]*>[\s\S]*data-npb-id="child-a"[\s\S]*data-npb-id="child-b"/,
      );
      expect(html).not.toMatch(
        /data-npb-id="flex-parent"[^>]*>[\s\S]*<div[^>]*>[\s\S]*<div[^>]*>[\s\S]*data-npb-id="child-a"/,
      );
    });
  });

  describe("Advanced tab styles", () => {
    it("should apply spacing, background, and border via stylesheet rules", () => {
      const container = createBuilderElement("container");
      container.styles = {
        desktop: {
          normal: {
            paddingTop: 32,
            paddingBottom: 32,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: "#111827",
            borderRadius: 12,
          },
        },
      };

      const css = styleBlockFor(renderContainer(container), container.id);

      expect(css).toContain("padding-top:32px");
      expect(css).toContain("padding-bottom:32px");
      expect(css).toContain("padding-left:24px");
      expect(css).toContain("padding-right:24px");
      expect(css).toContain("background-color:#111827");
      expect(css).toContain("border-radius:12px");
    });

    it("should let General props override conflicting Advanced layout styles", () => {
      const container = createBuilderElement("container");
      container.props = { containerLayout: "flexbox", contentWidth: "full", width: 100, direction: "column", justify: "flex-start", align: "stretch", gap: 20, wrap: "nowrap", minHeight: 0 };
      container.styles = {
        desktop: { normal: { display: "grid", gridTemplateColumns: "2fr 1fr", flexDirection: "row" } },
      };

      const html = renderContainer(container);
      const inline = inlineStyleFor(html, container.id);
      const css = styleBlockFor(html, container.id);

      expect(inline).toContain("display:flex");
      expect(inline).toContain("flex-direction:column");
      expect(css).toContain("grid-template-columns:2fr 1fr");
    });

    it("should let direction prop override stylesheet flex-direction", () => {
      const container = createBuilderElement("container");
      container.props = { containerLayout: "flexbox", contentWidth: "full", width: 100, direction: "column", justify: "flex-start", align: "stretch", gap: 20, wrap: "nowrap", minHeight: 0 };
      container.styles = {
        desktop: { normal: { flexDirection: "row" } },
      };

      const html = renderContainer(container);
      const inline = inlineStyleFor(html, container.id);

      expect(inline).toContain("flex-direction:column");
    });

    it("should emit responsive size and background overrides", () => {
      const container = createBuilderElement("container");
      container.styles = {
        desktop: { normal: { width: "960px", backgroundColor: "#ffffff" } },
        tablet: { normal: { width: "720px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#f3f4f6" } },
      };

      const html = renderContainer(container);

      expect(html).toContain(`[data-npb-id="${container.id}"]{width:960px;background-color:#ffffff`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${container.id}"]{width:720px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${container.id}"]{width:100%;background-color:#f3f4f6}}`,
      );
    });

    it("should emit hover interaction styles", () => {
      const container = createBuilderElement("container");
      container.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000" },
        },
      };

      const html = renderContainer(container);

      expect(html).toContain(`[data-npb-id="${container.id}"]:hover{background-color:#000000}`);
    });
  });

  describe("advanced settings", () => {
    it("should apply css id from advanced settings onto the host element", () => {
      const container = createBuilderElement("container");
      container.advanced = { cssId: "hero-section" };

      const html = renderContainer(container);

      expect(html).toContain('id="hero-section"');
      expect(html).toContain(`data-npb-id="${container.id}"`);
    });

    it("should hide the container on selected breakpoints", () => {
      const container = createBuilderElement("container");
      container.advanced = { hideOnMobile: true };

      const html = renderContainer(container);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${container.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const container = createBuilderElement("container");
      container.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 150,
      };

      const html = renderContainer(container);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("animation-delay:150ms");
    });
  });
});
