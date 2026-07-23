import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderCounter(element: BuilderElement, extras: BuilderElement[] = []) {
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

function counterBlock(html: string): string {
  const match = html.match(/<div class="npb-counter"[^>]*>[\s\S]*<\/div>\s*(?=<\/div>)/);
  return match?.[0] ?? "";
}

function counterRootStyle(html: string): string {
  return counterBlock(html).match(/^<div[^>]*style="([^"]*)"/)?.[1] ?? "";
}

function numberNode(html: string): string {
  const match = counterInner(html).match(/<strong[^>]*>[\s\S]*?<\/strong>/);
  return match?.[0] ?? "";
}

function numberStyle(html: string): string {
  return numberNode(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

function counterInner(html: string): string {
  const block = counterBlock(html);
  return block.replace(/^<div class="npb-counter"[^>]*>/, "").replace(/<\/div>\s*$/, "");
}

function titleNode(html: string, tag = "div"): string {
  const match = counterInner(html).match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`));
  return match?.[0] ?? "";
}

function titleStyle(html: string, tag = "div"): string {
  return titleNode(html, tag).match(/style="([^"]*)"/)?.[1] ?? "";
}

describe("counter widget settings", () => {
  describe("widget registration", () => {
    it("should expose default props and every counter control", () => {
      const widget = getBuilderWidget("counter");

      expect(widget?.defaultProps).toEqual({
        start: 0,
        end: 100,
        prefix: "",
        suffix: "",
        duration: 2000,
        separator: "default",
        title: "Cool Number",
        titleTag: "div",
        titlePosition: "after",
        numberAlign: "center",
      });

      const contentSection = widget?.controls.find(
        (section) => section.label === "Counter" && section.tab === "content",
      );
      const layoutSection = widget?.controls.find(
        (section) => section.label === "Counter" && section.tab === "style",
      );
      const numberSection = widget?.controls.find((section) => section.label === "Number");
      const titleSection = widget?.controls.find((section) => section.label === "Title");

      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "start",
        "end",
        "prefix",
        "suffix",
        "duration",
        "separator",
        "title",
        "titleTag",
      ]);
      expect(layoutSection?.controls.map((control) => control.key)).toEqual([
        "titlePosition",
        "numberAlign",
        "titleGap",
        "numberGap",
      ]);
      expect(numberSection?.controls.map((control) => control.key)).toEqual([
        "numberColor",
        "numberFontSize",
      ]);
      expect(titleSection?.controls.map((control) => control.key)).toEqual([
        "titleColor",
        "titleFontSize",
      ]);
    });
  });

  describe("content props", () => {
    it("should render end value with prefix, suffix, and title defaults", () => {
      const counter = createBuilderElement("counter");

      const html = renderCounter(counter);

      expect(html).toContain(`data-npb-id="${counter.id}"`);
      expect(html).toContain('class="npb-counter"');
      expect(numberNode(html)).toContain("100");
      expect(titleNode(html)).toContain("Cool Number");
      expect(html).toContain('data-npb-counter-start="0"');
      expect(html).toContain('data-npb-counter-end="100"');
      expect(html).toContain('data-npb-counter-duration="2000"');
    });

    it("should render prefix and suffix around the formatted end value", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        end: 40,
        prefix: "~",
        suffix: "+",
        title: "Vendors",
      };

      const html = renderCounter(counter);

      expect(numberNode(html)).toContain("~40+");
      expect(titleNode(html)).toContain("Vendors");
    });

    it("should coerce string end values from serialized documents", () => {
      const counter = createBuilderElement("counter");
      counter.props = { end: "2500", suffix: "K", separator: "none" };

      const html = renderCounter(counter);

      expect(numberNode(html)).toContain("2500K");
      expect(html).toContain('data-npb-counter-end="2500"');
    });

    it.each([
      ["default", "1,200"],
      ["dot", "1.200"],
      ["space", "1 200"],
      ["underline", "1_200"],
      ["none", "1200"],
    ] as const)("should format thousands with %s separator", (separator, expected) => {
      const counter = createBuilderElement("counter");
      counter.props = { end: 1200, separator };

      const html = renderCounter(counter);

      expect(numberNode(html)).toContain(expected);
    });

    it("should format thousands with apostrophe separator", () => {
      const counter = createBuilderElement("counter");
      counter.props = { end: 1200, separator: "apostrophe" };

      const html = renderCounter(counter);

      expect(html).toMatch(/1(&#x27;|'|&#39;)200/);
    });

    it("should expose animation props as data attributes", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        start: 10,
        end: 500,
        duration: 3500,
      };

      const html = renderCounter(counter);

      expect(html).toContain('data-npb-counter-start="10"');
      expect(html).toContain('data-npb-counter-end="500"');
      expect(html).toContain('data-npb-counter-duration="3500"');
    });

    it.each(["h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "p"] as const)(
      "should render title with semantic %s tag",
      (titleTag) => {
        const counter = createBuilderElement("counter");
        counter.props = { title: "Metric label", titleTag };

        const html = renderCounter(counter);

        expect(html).toContain(`<${titleTag}`);
        expect(titleNode(html, titleTag)).toContain("Metric label");
      },
    );

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const counter = createBuilderElement("counter");
      counter.advanced = { cssId: "vendor-count" };

      const html = renderCounter(counter);

      expect(html).toContain('id="vendor-count"');
      expect(html).toContain(`data-npb-id="${counter.id}"`);
    });
  });

  describe("layout props", () => {
    it("should stack title after the number in block layout by default", () => {
      const counter = createBuilderElement("counter");
      counter.props = { title: "After title", titlePosition: "after" };

      const html = renderCounter(counter);
      const block = counterBlock(html);

      expect(counterRootStyle(html)).toContain("text-align:center");
      expect(counterRootStyle(html)).toContain("display:block");
      expect(block).toMatch(/<strong[\s\S]*After title/);
    });

    it("should stack title before the number in block layout", () => {
      const counter = createBuilderElement("counter");
      counter.props = { title: "Before title", titlePosition: "before" };

      const html = renderCounter(counter);
      const block = counterBlock(html);

      expect(block).toMatch(/Before title[\s\S]*<strong/);
    });

    it("should lay out title and number horizontally for start position", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        title: "Start title",
        titlePosition: "start",
        titleGap: 12,
        numberAlign: "left",
      };

      const html = renderCounter(counter);
      const block = counterBlock(html);
      const rootStyle = counterRootStyle(html);
      const title = titleStyle(html);

      expect(rootStyle).toContain("display:flex");
      expect(rootStyle).toContain("justify-content:flex-start");
      expect(rootStyle).toContain("gap:12");
      expect(rootStyle).not.toContain("text-align:");
      expect(title).not.toContain("margin-block:");
      expect(block).toMatch(/Start title[\s\S]*<strong/);
    });

    it("should reverse flex direction for end position", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        title: "End title",
        titlePosition: "end",
        titleGap: 8,
        numberAlign: "right",
      };

      const html = renderCounter(counter);
      const rootStyle = counterRootStyle(html);

      expect(rootStyle).toContain("display:flex");
      expect(rootStyle).toContain("flex-direction:row-reverse");
      expect(rootStyle).toContain("justify-content:flex-end");
      expect(rootStyle).toContain("gap:8");
    });

    it.each([
      ["left", "text-align:left"],
      ["center", "text-align:center"],
      ["right", "text-align:right"],
    ] as const)("should align block layout numbers to the %s", (numberAlign, expected) => {
      const counter = createBuilderElement("counter");
      counter.props = { titlePosition: "after", numberAlign };

      expect(counterRootStyle(renderCounter(counter))).toContain(expected);
    });

    it("should stretch the number across the full width", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        end: 15,
        suffix: " yrs",
        title: "Community Hub",
        titlePosition: "start",
        numberAlign: "stretch",
      };

      const html = renderCounter(counter);
      const rootStyle = counterRootStyle(html);
      const strongStyle = numberStyle(html);

      expect(rootStyle).toContain("width:100%");
      expect(rootStyle).toContain("align-items:stretch");
      expect(rootStyle).toContain("justify-content:stretch");
      expect(strongStyle).toContain("width:100%");
      expect(strongStyle).toContain("text-align:center");
      expect(rootStyle).not.toContain("text-align:stretch");
    });

    it("should apply title gap with margin in block layout", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        title: "Gap title",
        titlePosition: "before",
        titleGap: 8,
      };

      const html = renderCounter(counter);

      expect(titleStyle(html)).toContain("margin-block:8");
      expect(counterRootStyle(html)).not.toContain("gap:");
    });

    it("should apply number gap as inline margin on the strong element", () => {
      const counter = createBuilderElement("counter");
      counter.props = { numberGap: 4 };

      expect(numberStyle(renderCounter(counter))).toContain("margin-inline:4");
    });
  });

  describe("number and title style props", () => {
    it("should apply number color and font size", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        numberColor: "#6d5dfc",
        numberFontSize: 56,
      };

      const style = numberStyle(renderCounter(counter));

      expect(style).toContain("color:#6d5dfc");
      expect(style).toContain("font-size:56");
    });

    it("should apply title color and font size", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        title: "Annual Visitors",
        titleTag: "h4",
        titleColor: "#6b7280",
        titleFontSize: 18,
      };

      const style = titleStyle(renderCounter(counter), "h4");

      expect(style).toContain("color:#6b7280");
      expect(style).toContain("font-size:18");
    });

    it("should coerce string font sizes from serialized documents", () => {
      const counter = createBuilderElement("counter");
      counter.props = {
        numberFontSize: "64",
        titleFontSize: "20",
      };

      const html = renderCounter(counter);

      expect(numberStyle(html)).toContain("font-size:64");
      expect(titleStyle(html)).toContain("font-size:20");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS to the host wrapper", () => {
      const counter = createBuilderElement("counter");
      counter.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "16px",
            paddingLeft: "8px",
          },
        },
      };

      const css = styleBlockFor(renderCounter(counter), counter.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:8px");
    });

    it("should apply layout and size CSS to the host wrapper", () => {
      const counter = createBuilderElement("counter");
      counter.styles = {
        desktop: {
          normal: {
            display: "inline-block",
            width: "320px",
            maxWidth: "100%",
          },
        },
      };

      const css = styleBlockFor(renderCounter(counter), counter.id);

      expect(css).toContain("display:inline-block");
      expect(css).toContain("width:320px");
      expect(css).toContain("max-width:100%");
    });

    it("should apply background, border, and effects CSS to the host wrapper", () => {
      const counter = createBuilderElement("counter");
      counter.styles = {
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

      const css = styleBlockFor(renderCounter(counter), counter.id);

      expect(css).toContain("background-color:#f3f4f6");
      expect(css).toContain("border-width:1px");
      expect(css).toContain("border-color:#d1d5db");
      expect(css).toContain("border-style:solid");
      expect(css).toContain("border-radius:8px");
      expect(css).toContain("opacity:0.9");
      expect(css).toContain("box-shadow:0 4px 12px #0000001a");
    });

    it("should emit responsive and hover styles on the host wrapper", () => {
      const counter = createBuilderElement("counter");
      counter.styles = {
        desktop: {
          normal: { color: "#111111" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
        mobile: { normal: { fontSize: 24 } },
      };

      const html = renderCounter(counter);
      const hover = hoverBlockFor(html, counter.id);

      expect(styleBlockFor(html, counter.id)).toContain("color:#111111");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${counter.id}"]{font-size:24px}}`,
      );
    });

    it("should hide the counter on selected breakpoints", () => {
      const counter = createBuilderElement("counter");
      counter.advanced = { hideOnMobile: true };

      const html = renderCounter(counter);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${counter.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const counter = createBuilderElement("counter");
      counter.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 200,
      };

      const html = renderCounter(counter);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:200ms");
    });
  });
});
