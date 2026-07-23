import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderRating(element: BuilderElement, extras: BuilderElement[] = []) {
  const document = {
    ...EMPTY_BUILDER_DOCUMENT,
    content: [element, ...extras],
  };
  return renderToStaticMarkup(<BuilderRenderer document={document} />);
}

function renderRatingWidget(element: BuilderElement): string {
  const widget = getBuilderWidget("rating")!;
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

function ratingRoot(html: string): string {
  const open = html.match(/<span class="npb-rating"[^>]*>/);
  if (!open || open.index === undefined) {
    return "";
  }

  const start = open.index;
  let depth = 0;
  const tagRe = /<\/?span\b[^>]*>/g;
  tagRe.lastIndex = start;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(html)) !== null) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(start, tagRe.lastIndex);
      }
    } else {
      depth += 1;
    }
  }

  return "";
}

function ratingRootStyle(html: string): string {
  return ratingRoot(html).match(/^<span[^>]*style="([^"]*)"/)?.[1] ?? "";
}

function starsWithColor(html: string, color: string): number {
  const root = ratingRoot(html);
  const escaped = color.replace("#", "\\#");
  let total = 0;
  const fullRe = new RegExp(`<span style="color:${escaped}" aria-hidden="true">(★+)</span>`, "g");
  for (const match of root.matchAll(fullRe)) {
    total += match[1].length;
  }
  if (root.includes(`color:${color}`) && root.includes("width:50%")) {
    total += 0.5;
  }
  return total;
}

function unmarkedStars(html: string, color: string): number {
  const root = ratingRoot(html);
  const escaped = color.replace("#", "\\#");
  const re = new RegExp(`<span style="color:${escaped}" aria-hidden="true">(★+)</span>`, "g");
  let total = 0;
  for (const match of root.matchAll(re)) {
    total += match[1].length;
  }
  return total;
}

describe("rating widget settings", () => {
  describe("widget registration", () => {
    it("should expose content and style controls with defaults", () => {
      const widget = getBuilderWidget("rating");
      const contentSection = widget?.controls.find(
        (section) => section.label === "Star Rating" && section.tab === "content",
      );
      const styleSection = widget?.controls.find(
        (section) => section.label === "Stars" && section.tab === "style",
      );

      expect(widget?.defaultProps).toEqual({
        rating: 5,
        scale: 5,
        title: "Rating",
        align: "center",
        size: 20,
      });

      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "rating",
        "scale",
        "title",
      ]);

      expect(styleSection?.controls.map((control) => control.key)).toEqual([
        "align",
        "starColor",
        "unmarkedColor",
        "size",
      ]);
    });
  });

  describe("content props", () => {
    it("should render a full scale with default props", () => {
      const rating = createBuilderElement("rating");

      const html = renderRating(rating);
      const root = ratingRoot(html);

      expect(html).toContain(`data-npb-id="${rating.id}"`);
      expect(root).toContain('class="npb-rating"');
      expect(root).toContain('role="img"');
      expect(root).toContain('aria-label="Rating"');
      expect(starsWithColor(html, "#f0ad4e")).toBe(5);
      expect(ratingRootStyle(html)).toContain("font-size:20");
      expect(ratingRootStyle(html)).toContain("justify-content:center");
    });

    it("should render partial ratings against the configured scale", () => {
      const rating = createBuilderElement("rating");
      rating.props = { rating: 3, scale: 5, title: "Product score" };

      const html = renderRatingWidget(rating);
      const root = ratingRoot(html);

      expect(root).toContain('aria-label="Product score"');
      expect(starsWithColor(html, "#f0ad4e")).toBe(3);
      expect(unmarkedStars(html, "#ccd6df")).toBe(2);
    });

    it("should render a half star for fractional ratings", () => {
      const rating = createBuilderElement("rating");
      rating.props = {
        rating: 4.5,
        scale: 5,
        title: "Visitor Rating",
        starColor: "#f59e0b",
        unmarkedColor: "#e5e7eb",
        size: 28,
      };

      const html = renderRatingWidget(rating);
      const root = ratingRoot(html);

      expect(starsWithColor(html, "#f59e0b")).toBe(4.5);
      expect(unmarkedStars(html, "#e5e7eb")).toBe(0);
      expect(root).toContain("width:50%");
      expect(root).toContain("color:#f59e0b");
      expect(root).toContain("color:#e5e7eb");
      expect(ratingRootStyle(html)).toContain("font-size:28");
    });

    it("should clamp rating to the scale and ignore negative values", () => {
      const overScale = createBuilderElement("rating");
      overScale.props = { rating: 8, scale: 5 };

      const underZero = createBuilderElement("rating");
      underZero.props = { rating: -2, scale: 5 };

      expect(starsWithColor(renderRatingWidget(overScale), "#f0ad4e")).toBe(5);
      expect(starsWithColor(renderRatingWidget(underZero), "#f0ad4e")).toBe(0);
      expect(unmarkedStars(renderRatingWidget(underZero), "#ccd6df")).toBe(5);
    });

    it("should coerce string rating, scale, and size props from serialized documents", () => {
      const rating = createBuilderElement("rating");
      rating.props = {
        rating: "4.5",
        scale: "5",
        size: "24",
        title: "Average",
      };

      const html = renderRatingWidget(rating);

      expect(starsWithColor(html, "#f0ad4e")).toBe(4.5);
      expect(ratingRootStyle(html)).toContain("font-size:24");
      expect(ratingRoot(html)).toContain('aria-label="Average"');
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const rating = createBuilderElement("rating");
      rating.advanced = { cssId: "review-stars" };

      const html = renderRating(rating);

      expect(html).toContain('id="review-stars"');
      expect(html).toContain(`data-npb-id="${rating.id}"`);
    });
  });

  describe("style props", () => {
    it.each([
      ["left", "justify-content:flex-start"],
      ["center", "justify-content:center"],
      ["right", "justify-content:flex-end"],
    ] as const)("should align stars to the %s", (align, expected) => {
      const rating = createBuilderElement("rating");
      rating.props = { align };

      expect(ratingRootStyle(renderRatingWidget(rating))).toContain(expected);
    });

    it("should apply custom star and unmarked colors", () => {
      const rating = createBuilderElement("rating");
      rating.props = {
        rating: 2,
        scale: 4,
        starColor: "#eab308",
        unmarkedColor: "#d1d5db",
      };

      const root = ratingRoot(renderRatingWidget(rating));

      expect(starsWithColor(root, "#eab308")).toBe(2);
      expect(unmarkedStars(root, "#d1d5db")).toBe(2);
    });

    it("should fall back to default palette colors when colors are unset", () => {
      const rating = createBuilderElement("rating");
      rating.props = { rating: 1, scale: 2 };

      const root = ratingRoot(renderRatingWidget(rating));

      expect(starsWithColor(root, "#f0ad4e")).toBe(1);
      expect(unmarkedStars(root, "#ccd6df")).toBe(1);
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS to the host wrapper", () => {
      const rating = createBuilderElement("rating");
      rating.styles = {
        desktop: {
          normal: {
            marginTop: "8px",
            marginBottom: "12px",
            paddingLeft: "6px",
          },
        },
      };

      const css = styleBlockFor(renderRating(rating), rating.id);

      expect(css).toContain("margin-top:8px");
      expect(css).toContain("margin-bottom:12px");
      expect(css).toContain("padding-left:6px");
    });

    it("should apply layout and size CSS to the host wrapper", () => {
      const rating = createBuilderElement("rating");
      rating.styles = {
        desktop: {
          normal: {
            display: "inline-block",
            width: "240px",
            maxWidth: "100%",
          },
        },
      };

      const css = styleBlockFor(renderRating(rating), rating.id);

      expect(css).toContain("display:inline-block");
      expect(css).toContain("width:240px");
      expect(css).toContain("max-width:100%");
    });

    it("should apply background, border, and effects CSS to the host wrapper", () => {
      const rating = createBuilderElement("rating");
      rating.styles = {
        desktop: {
          normal: {
            backgroundColor: "#fff7ed",
            borderWidth: "1px",
            borderColor: "#fdba74",
            borderStyle: "solid",
            borderRadius: "8px",
            opacity: 0.95,
            boxShadow: "0 4px 12px #0000001a",
          },
        },
      };

      const css = styleBlockFor(renderRating(rating), rating.id);

      expect(css).toContain("background-color:#fff7ed");
      expect(css).toContain("border-width:1px");
      expect(css).toContain("border-color:#fdba74");
      expect(css).toContain("border-style:solid");
      expect(css).toContain("border-radius:8px");
      expect(css).toContain("opacity:0.95");
      expect(css).toContain("box-shadow:0 4px 12px #0000001a");
    });

    it("should emit responsive and hover styles on the host wrapper", () => {
      const rating = createBuilderElement("rating");
      rating.styles = {
        desktop: {
          normal: { color: "#111111" },
          hover: { color: "#ffffff", backgroundColor: "#000000" },
        },
        mobile: { normal: { fontSize: 18 } },
      };

      const html = renderRating(rating);
      const hover = hoverBlockFor(html, rating.id);

      expect(styleBlockFor(html, rating.id)).toContain("color:#111111");
      expect(hover).toContain("color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${rating.id}"]{font-size:18px}}`,
      );
    });

    it("should hide the rating on selected breakpoints", () => {
      const rating = createBuilderElement("rating");
      rating.advanced = { hideOnMobile: true };

      const html = renderRating(rating);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${rating.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const rating = createBuilderElement("rating");
      rating.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 150,
      };

      const html = renderRating(rating);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:150ms");
    });
  });
});
