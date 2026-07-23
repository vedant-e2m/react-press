import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderImageBox(element: BuilderElement, extras: BuilderElement[] = []) {
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

function imageBoxRoot(html: string): string {
  const match = html.match(/<div class="npb-image-box"[^>]*>[\s\S]*<\/div>/);
  return match?.[0] ?? "";
}

function imageBoxRootStyle(html: string): string {
  return imageBoxRoot(html).match(/^<div[^>]*style="([^"]*)"/)?.[1] ?? "";
}

function imageMarkup(html: string): string {
  const match = html.match(/<img[^>]*>/);
  return match?.[0] ?? "";
}

function imageStyle(html: string): string {
  return imageMarkup(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

function placeholderMarkup(html: string): string {
  const match = html.match(/<div class="npb-placeholder"[^>]*>[\s\S]*?<\/div>/);
  return match?.[0] ?? "";
}

describe("image-box widget settings", () => {
  describe("content props", () => {
    it("should render image, title, and description", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/market.jpg",
        title: "Food Hall",
        description: "Curated local culinary experiences.",
      };

      const html = renderImageBox(imageBox);

      expect(html).toContain(`data-npb-id="${imageBox.id}"`);
      expect(html).toContain('class="npb-image-box"');
      expect(html).toContain('src="https://cdn.example.com/market.jpg"');
      expect(html).toContain("Food Hall");
      expect(html).toContain("Curated local culinary experiences.");
    });

    it("should render a placeholder when image is empty", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "", title: "No image", description: "Placeholder demo" };

      const html = renderImageBox(imageBox);

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Choose image");
      expect(html).not.toContain("<img");
    });

    it("should fall back to default title and description", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };

      const html = renderImageBox(imageBox);

      expect(html).toContain("This is the heading");
      expect(html).toContain("Lorem ipsum dolor sit amet");
    });

    it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
      "should render title with semantic %s tag",
      (titleTag) => {
        const imageBox = createBuilderElement("image-box");
        imageBox.props = {
          image: "https://cdn.example.com/photo.jpg",
          title: "Feature title",
          titleTag,
        };

        const html = renderImageBox(imageBox);

        expect(html).toContain(`<${titleTag}`);
        expect(html).toContain("Feature title");
      },
    );

    it("should wrap the image box in an anchor when link is set", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        title: "Linked box",
        link: "https://example.com/image-box",
      };

      const html = renderImageBox(imageBox);

      expect(html).toContain('href="https://example.com/image-box"');
      expect(html).toContain('class="npb-div-link"');
      expect(html).toMatch(
        /<a href="https:\/\/example.com\/image-box" class="npb-div-link">[\s\S]*<div class="npb-image-box/,
      );
      expect(html).toContain(`data-npb-id="${imageBox.id}"`);
    });

    it("should render without a link wrapper when link is empty", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        title: "Plain box",
        link: "",
      };

      const html = renderImageBox(imageBox);

      expect(html).not.toContain('class="npb-div-link"');
      expect(html).toContain('class="npb-image-box"');
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.advanced = { cssId: "feature-image-box" };

      const html = renderImageBox(imageBox);

      expect(html).toContain('id="feature-image-box"');
      expect(html).toContain(`data-npb-id="${imageBox.id}"`);
    });
  });

  describe("layout props", () => {
    it("should lay out image above content by default", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        imagePosition: "top",
      };

      const html = renderImageBox(imageBox);

      expect(imageBoxRootStyle(html)).toContain("flex-direction:column");
      expect(imageStyle(html)).toContain("order:0");
    });

    it("should lay out image beside content when position is left or right", () => {
      const left = createBuilderElement("image-box");
      left.props = {
        image: "https://cdn.example.com/photo.jpg",
        imagePosition: "left",
      };

      const right = createBuilderElement("image-box");
      right.props = {
        image: "https://cdn.example.com/photo.jpg",
        imagePosition: "right",
      };

      expect(imageBoxRootStyle(renderImageBox(left))).toContain("flex-direction:row");
      expect(imageStyle(renderImageBox(left))).toContain("order:0");
      expect(imageBoxRootStyle(renderImageBox(right))).toContain("flex-direction:row");
      expect(imageStyle(renderImageBox(right))).toContain("order:2");
    });

    it("should order the placeholder after content when image position is right", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "", imagePosition: "right" };

      const placeholderStyle = placeholderMarkup(renderImageBox(imageBox)).match(/style="([^"]*)"/)?.[1] ?? "";

      expect(placeholderStyle).toContain("order:2");
    });

    it("should align items vertically within the box", () => {
      const top = createBuilderElement("image-box");
      top.props = {
        image: "https://cdn.example.com/photo.jpg",
        imagePosition: "left",
        verticalAlign: "top",
      };

      const middle = createBuilderElement("image-box");
      middle.props = {
        image: "https://cdn.example.com/photo.jpg",
        imagePosition: "left",
        verticalAlign: "middle",
      };

      const bottom = createBuilderElement("image-box");
      bottom.props = {
        image: "https://cdn.example.com/photo.jpg",
        imagePosition: "left",
        verticalAlign: "bottom",
      };

      expect(imageBoxRootStyle(renderImageBox(top))).toContain("align-items:flex-start");
      expect(imageBoxRootStyle(renderImageBox(middle))).toContain("align-items:center");
      expect(imageBoxRootStyle(renderImageBox(bottom))).toContain("align-items:flex-end");
    });

    it("should align text within the box", () => {
      const left = createBuilderElement("image-box");
      left.props = { align: "left" };

      const center = createBuilderElement("image-box");
      center.props = { align: "center" };

      const right = createBuilderElement("image-box");
      right.props = { align: "right" };

      const justify = createBuilderElement("image-box");
      justify.props = { align: "justify" };

      expect(imageBoxRootStyle(renderImageBox(left))).toContain("text-align:left");
      expect(imageBoxRootStyle(renderImageBox(center))).toContain("text-align:center");
      expect(imageBoxRootStyle(renderImageBox(right))).toContain("text-align:right");
      expect(imageBoxRootStyle(renderImageBox(justify))).toContain("text-align:justify");
    });

    it("should apply image spacing and content spacing", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        imageSpacing: 24,
        contentSpacing: 8,
      };

      const html = renderImageBox(imageBox);
      const descriptionStyle = html.match(/<p style="([^"]*)"/)?.[1] ?? "";

      expect(imageBoxRootStyle(html)).toContain("gap:24");
      expect(descriptionStyle).toContain("margin-top:8");
    });
  });

  describe("image style props", () => {
    it("should apply width, height, object-fit, opacity, and border radius from props", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        imageWidth: 40,
        imageHeight: 160,
        objectFit: "contain",
        imageBorderRadius: 12,
        imageOpacity: 90,
      };

      const style = imageStyle(renderImageBox(imageBox));

      expect(style).toContain("width:40%");
      expect(style).toContain("height:160px");
      expect(style).toContain("object-fit:contain");
      expect(style).toContain("opacity:0.9");
      expect(style).toContain("border-radius:12px");
    });

    it("should default object-fit to cover", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };

      const style = imageStyle(renderImageBox(imageBox));

      expect(style).toContain("object-fit:cover");
    });

    it("should support fill object-fit mode", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        objectFit: "fill",
      };

      const style = imageStyle(renderImageBox(imageBox));

      expect(style).toContain("object-fit:fill");
    });

    it("should omit height when imageHeight is zero", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        imageHeight: 0,
      };

      const style = imageStyle(renderImageBox(imageBox));

      expect(style).not.toContain("height:");
    });

    it("should default image width to 100%", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };

      const style = imageStyle(renderImageBox(imageBox));

      expect(style).toContain("width:100%");
    });
  });

  describe("content style props", () => {
    it("should apply title and description typography colors and sizes", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = {
        image: "https://cdn.example.com/photo.jpg",
        title: "Styled title",
        description: "Styled description",
        titleTag: "h2",
        titleColor: "#112233",
        titleFontSize: 24,
        descriptionColor: "#445566",
        descriptionFontSize: 16,
      };

      const html = renderImageBox(imageBox);
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
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };
      imageBox.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderImageBox(imageBox), imageBox.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };
      imageBox.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderImageBox(imageBox);

      expect(styleBlockFor(html, imageBox.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, imageBox.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the image box on selected breakpoints", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };
      imageBox.advanced = { hideOnMobile: true };

      const html = renderImageBox(imageBox);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${imageBox.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const imageBox = createBuilderElement("image-box");
      imageBox.props = { image: "https://cdn.example.com/photo.jpg" };
      imageBox.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderImageBox(imageBox);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
