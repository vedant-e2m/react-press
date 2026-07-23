import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderImage(element: BuilderElement) {
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

function imgStyleBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\] img\\.npb-image\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

function hoverImgBlockFor(html: string, id: string): string {
  const match = html.match(new RegExp(`\\[data-npb-id="${id}"\\] img\\.npb-image:hover\\{([^}]*)\\}`));
  return match?.[1] ?? "";
}

describe("image widget settings", () => {
  describe("general props", () => {
    it("should render src and alt on the img element", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Market hall",
      };

      const html = renderImage(image);

      expect(html).toContain(`data-npb-id="${image.id}"`);
      expect(html).toContain('<figure');
      expect(html).toContain('class="npb-image"');
      expect(html).toContain('src="https://cdn.example.com/photo.jpg"');
      expect(html).toContain('alt="Market hall"');
    });

    it("should render a placeholder when src is empty", () => {
      const image = createBuilderElement("image");
      image.props = { src: "", alt: "" };

      const html = renderImage(image);

      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Choose image");
      expect(html).not.toContain("<img");
    });

    it("should render a custom caption in figcaption", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Alt text",
        caption: "The food hall at dusk",
        captionType: "custom",
      };

      const html = renderImage(image);

      expect(html).toContain("<figcaption>The food hall at dusk</figcaption>");
    });

    it("should render alt text as caption when captionType is alt", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Alt caption",
        caption: "Ignored custom caption",
        captionType: "alt",
      };

      const html = renderImage(image);

      expect(html).toContain("<figcaption>Alt caption</figcaption>");
      expect(html).not.toContain("Ignored custom caption");
    });

    it("should wrap the image in an anchor for a custom link", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Linked image",
        link: "https://example.com/gallery",
        linkTo: "custom",
      };

      const html = renderImage(image);

      expect(html).toContain('href="https://example.com/gallery"');
      expect(html).toMatch(/<a href="https:\/\/example.com\/gallery">[\s\S]*<img/);
      expect(html).not.toContain("<figcaption");
    });

    it("should link to the media file when linkTo is file", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Linked file",
        linkTo: "file",
      };

      const html = renderImage(image);

      expect(html).toContain('href="https://cdn.example.com/photo.jpg"');
    });

    it("should still link when only link is set without linkTo custom mode", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Legacy link",
        link: "#gallery",
        linkTo: "none",
      };

      const html = renderImage(image);

      expect(html).toContain('href="#gallery"');
    });

    it("should apply css id from advanced settings onto the figure host", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.advanced = { cssId: "hero-photo" };

      const html = renderImage(image);

      expect(html).toContain('id="hero-photo"');
      expect(html).toContain(`data-npb-id="${image.id}"`);
    });
  });

  describe("widget prop sizing and fit", () => {
    it("should apply width, height, object-fit, opacity, and border radius from props", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "",
        width: 75,
        height: 280,
        objectFit: "contain",
        opacity: 0.85,
        borderRadius: 12,
        align: "right",
      };

      const html = renderImage(image);

      expect(html).toMatch(/width:75%/);
      expect(html).toMatch(/height:280px/);
      expect(html).toMatch(/object-fit:contain/);
      expect(html).toMatch(/opacity:0\.85/);
      expect(html).toMatch(/border-radius:12px/);
      expect(html).toMatch(/text-align:right/);
    });

    it("should default object-fit to cover", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "",
      };

      const html = renderImage(image);

      expect(html).toMatch(/object-fit:cover/);
    });
  });

  describe("style panel size settings", () => {
    it("should apply style-panel width, height, and object-fit on the img selector", () => {
      const image = createBuilderElement("image");
      image.props = {
        src: "https://cdn.example.com/photo.jpg",
        alt: "Vendor photo",
        objectFit: "cover",
      };
      image.styles = {
        desktop: {
          normal: {
            width: "100%",
            height: 261,
            objectFit: "cover",
            borderRadius: 7,
            marginBottom: 30,
          },
        },
      };

      const html = renderImage(image);
      const imgCss = imgStyleBlockFor(html, image.id);
      const hostCss = styleBlockFor(html, image.id);

      expect(imgCss).toContain("width:100%");
      expect(imgCss).toContain("height:261px");
      expect(imgCss).toContain("object-fit:cover");
      expect(imgCss).toContain("border-radius:7px");
      expect(hostCss).toContain("margin-bottom:30px");
      expect(hostCss).not.toContain("object-fit:cover");
    });

    it("should preserve percentage width without appending px", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.styles = {
        desktop: {
          normal: {
            width: "80%",
            maxWidth: "640px",
          },
        },
      };

      const html = renderImage(image);
      const imgCss = imgStyleBlockFor(html, image.id);

      expect(imgCss).toContain("width:80%");
      expect(imgCss).toContain("max-width:640px");
      expect(imgCss).not.toContain("80%px");
    });

    it("should emit tablet and mobile img size overrides", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.styles = {
        desktop: { normal: { width: "600px", height: 400 } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", height: 240 } },
      };

      const html = renderImage(image);

      expect(html).toContain(`[data-npb-id="${image.id}"] img.npb-image{width:600px;height:400px}`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${image.id}"] img.npb-image{width:400px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${image.id}"] img.npb-image{width:100%;height:240px}}`,
      );
    });
  });

  describe("style panel spacing and layout", () => {
    it("should apply margin and padding on the figure host", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.styles = {
        desktop: {
          normal: {
            marginTop: "8px",
            marginBottom: "16px",
            paddingLeft: "10px",
          },
        },
      };

      const css = styleBlockFor(renderImage(image), image.id);

      expect(css).toContain("margin-top:8px");
      expect(css).toContain("margin-bottom:16px");
      expect(css).toContain("padding-left:10px");
    });
  });

  describe("style panel border and effects", () => {
    it("should apply border styles on the img selector", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            boxShadow: "0 8px 24px #0000001a",
          },
        },
      };

      const imgCss = imgStyleBlockFor(renderImage(image), image.id);

      expect(imgCss).toContain("border-width:2px");
      expect(imgCss).toContain("border-color:#00aa55");
      expect(imgCss).toContain("border-style:dashed");
      expect(imgCss).toContain("box-shadow:0 8px 24px #0000001a");
    });

    it("should emit hover opacity on the img selector", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.7 },
        },
      };

      const html = renderImage(image);

      expect(imgStyleBlockFor(html, image.id)).toContain("opacity:1");
      expect(hoverImgBlockFor(html, image.id)).toContain("opacity:0.7");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the image on selected breakpoints", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.advanced = { hideOnMobile: true };

      const html = renderImage(image);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${image.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the figure host", () => {
      const image = createBuilderElement("image");
      image.props = { src: "https://cdn.example.com/photo.jpg", alt: "" };
      image.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderImage(image);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
