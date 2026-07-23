import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderProgress(element: BuilderElement, extras: BuilderElement[] = []) {
  const document = {
    ...EMPTY_BUILDER_DOCUMENT,
    content: [element, ...extras],
  };
  return renderToStaticMarkup(<BuilderRenderer document={document} />);
}

function renderProgressWidget(element: BuilderElement): string {
  const widget = getBuilderWidget("progress")!;
  return renderToStaticMarkup(widget.render({ element, children: null }));
}

function styleBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function hoverBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\]:hover\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function progressBlock(html: string): string {
  const match = html.match(/<div class="npb-progress">[\s\S]*?<\/div>\s*<\/div>/);
  return match?.[0] ?? "";
}

function barTrackStyle(html: string): string {
  return progressBlock(html).match(/<div style="position:relative[^"]*"/)?.[0]?.match(/style="([^"]*)"/)?.[1] ?? "";
}

function barFillStyle(html: string): string {
  return progressBlock(html).match(/<i style="([^"]*)"/)?.[1] ?? "";
}

describe("progress widget settings", () => {
  describe("widget registration", () => {
    it("should expose content and style controls with defaults", () => {
      const widget = getBuilderWidget("progress");
      const contentSection = widget?.controls.find(
        (section) => section.label === "Progress Bar" && section.tab === "content",
      );
      const styleSection = widget?.controls.find(
        (section) => section.label === "Progress Bar" && section.tab === "style",
      );

      expect(widget?.defaultProps).toEqual({
        title: "My Skill",
        titleTag: "span",
        displayTitle: true,
        progressType: "default",
        value: 50,
        displayPercentage: true,
        innerText: "",
        barHeight: 10,
        borderRadius: 0,
      });

      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "title",
        "titleTag",
        "displayTitle",
        "progressType",
        "value",
        "displayPercentage",
        "innerText",
      ]);

      expect(styleSection?.controls.map((control) => control.key)).toEqual([
        "titleColor",
        "percentageColor",
        "barColor",
        "barBackground",
        "barHeight",
        "borderRadius",
        "innerTextColor",
      ]);
    });
  });

  describe("content props", () => {
    it("should render title, percentage, and bar with default props", () => {
      const progress = createBuilderElement("progress");

      const html = renderProgress(progress);
      const block = progressBlock(html);

      expect(html).toContain(`data-npb-id="${progress.id}"`);
      expect(block).toContain('class="npb-progress"');
      expect(block).toContain("My Skill");
      expect(block).toContain("50%");
      expect(barFillStyle(html)).toContain("width:50%");
      expect(barFillStyle(html)).toContain("background:#61ce70");
      expect(barTrackStyle(html)).toContain("height:10px");
      expect(barTrackStyle(html)).toContain("background:#eee");
    });

    it.each([
      ["default", "#61ce70"],
      ["info", "#5bc0de"],
      ["success", "#5cb85c"],
      ["warning", "#f0ad4e"],
      ["danger", "#d9534f"],
    ] as const)("should apply %s progress type color when barColor is unset", (progressType, color) => {
      const progress = createBuilderElement("progress");
      progress.props = { progressType };

      const html = renderProgressWidget(progress);

      expect(barFillStyle(html)).toContain(`background:${color}`);
    });

    it.each(["h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "p"] as const)(
      "should render title with semantic %s tag",
      (titleTag) => {
        const progress = createBuilderElement("progress");
        progress.props = { title: "Skill level", titleTag };

        const html = renderProgress(progress);

        expect(html).toContain(`<${titleTag}`);
        expect(html).toContain("Skill level");
      },
    );

    it("should hide the title when displayTitle is false", () => {
      const progress = createBuilderElement("progress");
      progress.props = { displayTitle: false, title: "Hidden title" };

      const html = renderProgress(progress);
      const block = progressBlock(html);

      expect(block).not.toContain("Hidden title");
      expect(block).toContain("50%");
    });

    it("should hide the percentage label when displayPercentage is false", () => {
      const progress = createBuilderElement("progress");
      progress.props = { displayPercentage: false, value: 75 };

      const html = renderProgress(progress);
      const block = progressBlock(html);

      expect(block).not.toMatch(/<span[^>]*>75%<\/span>/);
      expect(barFillStyle(html)).toContain("width:75%");
    });

    it("should render inner text centered on the bar track", () => {
      const progress = createBuilderElement("progress");
      progress.props = {
        innerText: "Nearly Full",
        innerTextColor: "#ffffff",
        value: 92,
      };

      const html = renderProgress(progress);
      const inner = progressBlock(html).match(/<b style="([^"]*)">Nearly Full<\/b>/)?.[1] ?? "";

      expect(inner).toContain("place-items:center");
      expect(inner).toContain("color:#ffffff");
      expect(html).toContain("Nearly Full");
    });

    it("should not render inner text when empty", () => {
      const progress = createBuilderElement("progress");
      progress.props = { innerText: "" };

      const html = renderProgress(progress);

      expect(progressBlock(html)).not.toContain("<b");
    });

    it("should coerce string percentage and dimension props from serialized documents", () => {
      const progress = createBuilderElement("progress");
      progress.props = {
        value: "82",
        barHeight: "14",
        borderRadius: "8",
      };

      const html = renderProgress(progress);

      expect(html).toContain("82%");
      expect(barFillStyle(html)).toContain("width:82%");
      expect(barTrackStyle(html)).toContain("height:14px");
      expect(barTrackStyle(html)).toContain("border-radius:8px");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const progress = createBuilderElement("progress");
      progress.advanced = { cssId: "occupancy-bar" };

      const html = renderProgress(progress);

      expect(html).toContain('id="occupancy-bar"');
      expect(html).toContain(`data-npb-id="${progress.id}"`);
    });
  });

  describe("style props", () => {
    it("should apply custom title, percentage, bar, and track colors", () => {
      const progress = createBuilderElement("progress");
      progress.props = {
        title: "Custom bar",
        titleColor: "#111827",
        percentageColor: "#059669",
        barColor: "#10b981",
        barBackground: "#e5e7eb",
        progressType: "warning",
      };

      const html = renderProgress(progress);
      const block = progressBlock(html);

      expect(block).toContain('color:#111827');
      expect(block).toContain('color:#059669');
      expect(barFillStyle(html)).toContain("background:#10b981");
      expect(barTrackStyle(html)).toContain("background:#e5e7eb");
    });

    it("should prefer barColor over progress type palette", () => {
      const progress = createBuilderElement("progress");
      progress.props = {
        progressType: "danger",
        barColor: "#336699",
      };

      const html = renderProgressWidget(progress);

      expect(barFillStyle(html)).toContain("background:#336699");
      expect(barFillStyle(html)).not.toContain("#d9534f");
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio on the wrapper", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
        desktop: {
          normal: {
            width: "320px",
            height: "48px",
            minWidth: "120px",
            minHeight: "24px",
            maxWidth: "640px",
            maxHeight: "80px",
            overflow: "hidden",
            aspectRatio: "16 / 9",
          },
        },
      };

      const css = styleBlockFor(renderProgress(progress), progress.id);

      expect(css).toContain("width:320px");
      expect(css).toContain("height:48px");
      expect(css).toContain("min-width:120px");
      expect(css).toContain("min-height:24px");
      expect(css).toContain("max-width:640px");
      expect(css).toContain("max-height:80px");
      expect(css).toContain("overflow:hidden");
      expect(css).toContain("aspect-ratio:16 / 9");
    });
  });

  describe("layout settings", () => {
    it("should apply display, flex direction, justify, align, gap, and wrap", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
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

      const css = styleBlockFor(renderProgress(progress), progress.id);

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
      const progress = createBuilderElement("progress");
      progress.styles = {
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

      const css = styleBlockFor(renderProgress(progress), progress.id);

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
      const progress = createBuilderElement("progress");
      progress.styles = {
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

      const css = styleBlockFor(renderProgress(progress), progress.id);

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
    it("should apply typography CSS to the progress wrapper", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
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

      const css = styleBlockFor(renderProgress(progress), progress.id);

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
      const progress = createBuilderElement("progress");
      progress.styles = {
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

      const css = styleBlockFor(renderProgress(progress), progress.id);

      expect(css).toContain("background-color:#ff6600");
      expect(css).toContain('background-image:url("https://cdn.example.com/bg.jpg")');
      expect(css).toContain("background-position:center top");
      expect(css).toContain("background-attachment:fixed");
      expect(css).toContain("background-repeat:no-repeat");
      expect(css).toContain("background-size:cover");
    });
  });

  describe("border settings", () => {
    it("should apply border width, color, style, and radius on the wrapper", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderProgress(progress), progress.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
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

      const css = styleBlockFor(renderProgress(progress), progress.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile size overrides", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderProgress(progress);

      expect(html).toContain(`[data-npb-id="${progress.id}"]{width:600px;background-color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${progress.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${progress.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const progress = createBuilderElement("progress");
      progress.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderProgress(progress);
      const hover = hoverBlockFor(html, progress.id);

      expect(styleBlockFor(html, progress.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the progress bar on selected breakpoints", () => {
      const progress = createBuilderElement("progress");
      progress.advanced = { hideOnMobile: true };

      const html = renderProgress(progress);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${progress.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const progress = createBuilderElement("progress");
      progress.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderProgress(progress);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
