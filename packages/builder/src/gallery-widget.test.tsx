import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";
import { getBuilderWidget } from "./widgets";

const SAMPLE_IMAGES = [
  {
    src: "https://cdn.example.com/a.jpg",
    alt: "Photo A",
    title: "Title A",
    description: "Description A",
    caption: "Caption A",
    url: "https://example.com/a",
  },
  {
    src: "https://cdn.example.com/b.jpg",
    alt: "Photo B",
    title: "Title B",
    description: "Description B",
    caption: "Caption B",
    url: "https://example.com/b",
  },
  {
    src: "https://cdn.example.com/c.jpg",
    alt: "Photo C",
    title: "Title C",
    description: "Description C",
    caption: "Caption C",
    url: "https://example.com/c",
  },
];

function renderGallery(element: BuilderElement, extras: BuilderElement[] = []) {
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

function galleryInlineStyle(html: string): string {
  const match = html.match(/class="npb-gallery" style="([^"]*)"/);
  return match?.[1] ?? "";
}

function galleryMarkup(html: string): string {
  const match = html.match(/class="npb-gallery"[\s\S]*?<\/div>/);
  return match?.[0] ?? html;
}

function imageSrcOrder(html: string): string[] {
  return [...galleryMarkup(html).matchAll(/<img[^>]*src="([^"]+)"/g)].map((match) => match[1]);
}

function anchorHrefs(html: string): string[] {
  return [...galleryMarkup(html).matchAll(/<a[^>]*href="([^"]+)"/g)].map((match) => match[1]);
}

function renderGalleryWidget(element: BuilderElement): string {
  const widget = getBuilderWidget("gallery")!;
  return renderToStaticMarkup(widget.render({ element, children: null }));
}

function galleryWithImages(overrides: Record<string, unknown> = {}): BuilderElement {
  const gallery = createBuilderElement("gallery");
  gallery.props = {
    images: SAMPLE_IMAGES,
    columns: "3",
    linkTo: "none",
    caption: "none",
    lightbox: "yes",
    orderBy: "default",
    spacing: 10,
    gap: "default",
    borderRadius: 0,
    captionColor: "",
    captionAlign: "center",
    ...overrides,
  };
  return gallery;
}

describe("gallery widget settings", () => {
  describe("general props", () => {
    it("should render images in a grid gallery container", () => {
      const gallery = galleryWithImages();

      const html = renderGallery(gallery);

      expect(html).toContain(`data-npb-id="${gallery.id}"`);
      expect(html).toContain('class="npb-gallery"');
      expect(html).toContain('src="https://cdn.example.com/a.jpg"');
      expect(html).toContain('src="https://cdn.example.com/b.jpg"');
      expect(html).toContain('src="https://cdn.example.com/c.jpg"');
      expect(html).toContain('alt="Photo A"');
    });

    it("should render an empty gallery when images is empty", () => {
      const gallery = galleryWithImages({ images: [] });

      const html = renderGallery(gallery);

      expect(html).toContain('class="npb-gallery"');
      expect(html).not.toContain("<img");
      expect(html).not.toContain("<figure");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const gallery = galleryWithImages();
      gallery.advanced = { cssId: "vendor-gallery" };

      const html = renderGallery(gallery);

      expect(html).toContain('id="vendor-gallery"');
      expect(html).toContain(`data-npb-id="${gallery.id}"`);
    });
  });

  describe("columns", () => {
    it.each([1, 2, 3, 4, 5, 6] as const)("should render %s grid columns", (columns) => {
      const gallery = galleryWithImages({ columns: String(columns) });

      const html = renderGallery(gallery);

      expect(galleryInlineStyle(html)).toContain(`grid-template-columns:repeat(${columns}, 1fr)`);
    });

    it("should fall back to three columns for invalid column values", () => {
      const gallery = galleryWithImages({ columns: "0" });

      const html = renderGallery(gallery);

      expect(galleryInlineStyle(html)).toContain("grid-template-columns:repeat(3, 1fr)");
    });
  });

  describe("caption modes", () => {
    it("should omit figcaption when caption is none", () => {
      const gallery = galleryWithImages({ caption: "none" });

      const html = renderGallery(gallery);

      expect(html).not.toContain("<figcaption");
    });

    it("should render attachment caption text when caption mode is caption", () => {
      const gallery = galleryWithImages({ caption: "caption" });

      const html = renderGallery(gallery);

      expect(html).toContain(">Caption A</figcaption>");
      expect(html).not.toContain(">Photo A</figcaption>");
    });

    it("should render image title when caption mode is title", () => {
      const gallery = galleryWithImages({ caption: "title" });

      const html = renderGallery(gallery);

      expect(html).toContain(">Title A</figcaption>");
    });

    it("should render image description when caption mode is description", () => {
      const gallery = galleryWithImages({ caption: "description" });

      const html = renderGallery(gallery);

      expect(html).toContain(">Description A</figcaption>");
    });
  });

  describe("caption styling", () => {
    it("should apply caption alignment, color, and spacing", () => {
      const gallery = galleryWithImages({
        caption: "title",
        captionAlign: "right",
        captionColor: "#374151",
        captionSpacing: 12,
      });

      const html = renderGallery(gallery);

      expect(html).toContain("text-align:right");
      expect(html).toContain("color:#374151");
      expect(html).toContain("margin-top:12px");
    });
  });

  describe("linkTo", () => {
    it("should not wrap images in anchors when linkTo is none and lightbox is off", () => {
      const gallery = galleryWithImages({ linkTo: "none", lightbox: "no" });

      const html = renderGallery(gallery);

      expect(html).not.toContain("<a ");
      expect(html).toContain("<img");
    });

    it("should link to the media file when linkTo is file", () => {
      const gallery = galleryWithImages({ linkTo: "file", lightbox: "no" });

      const html = renderGallery(gallery);

      expect(html).toContain('href="https://cdn.example.com/a.jpg"');
      expect(html).not.toContain('href="https://example.com/a"');
    });

    it("should link to the custom url when linkTo is custom", () => {
      const gallery = galleryWithImages({ linkTo: "custom", lightbox: "no" });

      const html = renderGallery(gallery);

      expect(anchorHrefs(html)).toEqual([
        "https://example.com/a",
        "https://example.com/b",
        "https://example.com/c",
      ]);
    });

    it("should link to the attachment page url when linkTo is attachment", () => {
      const gallery = galleryWithImages({ linkTo: "attachment", lightbox: "no" });

      const html = renderGallery(gallery);

      expect(html).toContain('href="https://example.com/a"');
    });
  });

  describe("lightbox", () => {
    it.each(["yes", "default"] as const)(
      "should emit data-npb-lightbox when lightbox is %s",
      (lightbox) => {
        const gallery = galleryWithImages({ linkTo: "none", lightbox });

        const html = renderGallery(gallery);

        expect(html).toContain('data-npb-lightbox="yes"');
        expect(html).toContain('href="https://cdn.example.com/a.jpg"');
      },
    );

    it("should omit data-npb-lightbox when lightbox is no", () => {
      const gallery = galleryWithImages({ linkTo: "file", lightbox: "no" });

      const html = renderGallery(gallery);

      expect(html).toContain('href="https://cdn.example.com/a.jpg"');
      expect(html).not.toContain("data-npb-lightbox");
    });
  });

  describe("orderBy", () => {
    it("should preserve image order when orderBy is default", () => {
      const gallery = galleryWithImages({ orderBy: "default" });

      const html = renderGallery(gallery);

      expect(imageSrcOrder(html)).toEqual([
        "https://cdn.example.com/a.jpg",
        "https://cdn.example.com/b.jpg",
        "https://cdn.example.com/c.jpg",
      ]);
    });

    it("should shuffle images deterministically when orderBy is random", () => {
      const gallery = galleryWithImages({ orderBy: "random" });
      gallery.id = "gallery-random-seed";

      const first = renderGalleryWidget(gallery);
      const second = renderGalleryWidget(gallery);

      const shuffled = imageSrcOrder(first);
      expect(shuffled).not.toEqual([
        "https://cdn.example.com/a.jpg",
        "https://cdn.example.com/b.jpg",
        "https://cdn.example.com/c.jpg",
      ]);
      expect([...shuffled].sort()).toEqual([
        "https://cdn.example.com/a.jpg",
        "https://cdn.example.com/b.jpg",
        "https://cdn.example.com/c.jpg",
      ]);
      expect(imageSrcOrder(second)).toEqual(shuffled);
    });
  });

  describe("gap and spacing", () => {
    it.each([
      ["default", 10],
      ["none", 0],
      ["narrow", 5],
      ["extended", 15],
      ["wide", 20],
    ] as const)("should apply %s gap preset as %spx", (gap, expected) => {
      const gallery = galleryWithImages({ gap });

      const html = renderGallery(gallery);

      expect(galleryInlineStyle(html)).toContain(`gap:${expected}`);
    });

    it("should apply custom spacing when gap is custom", () => {
      const gallery = galleryWithImages({ gap: "custom", spacing: 14 });

      const html = renderGallery(gallery);

      expect(galleryInlineStyle(html)).toContain("gap:14");
    });
  });

  describe("image border styling", () => {
    it("should apply border radius on gallery images", () => {
      const gallery = galleryWithImages({ borderRadius: 8 });

      const html = renderGallery(gallery);

      expect(html).toContain("border-radius:8");
    });

    it("should apply border width and color on gallery images", () => {
      const gallery = galleryWithImages({
        borderWidth: 2,
        borderColor: "#d1d5db",
      });

      const html = renderGallery(gallery);

      expect(html).toContain("border:2px solid #d1d5db");
    });

    it("should omit border when border width is zero", () => {
      const gallery = galleryWithImages({ borderWidth: 0, borderColor: "#d1d5db" });

      const html = renderGallery(gallery);

      expect(html).not.toContain("border:");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS on the host wrapper", () => {
      const gallery = galleryWithImages();
      gallery.styles = {
        desktop: {
          normal: {
            marginTop: "16px",
            marginBottom: "32px",
            paddingLeft: "12px",
          },
        },
      };

      const css = styleBlockFor(renderGallery(gallery), gallery.id);

      expect(css).toContain("margin-top:16px");
      expect(css).toContain("margin-bottom:32px");
      expect(css).toContain("padding-left:12px");
    });

    it("should apply border styles on the host wrapper", () => {
      const gallery = galleryWithImages();
      gallery.styles = {
        desktop: {
          normal: {
            borderWidth: "1px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
          },
        },
      };

      const css = styleBlockFor(renderGallery(gallery), gallery.id);

      expect(css).toContain("border-width:1px");
      expect(css).toContain("border-color:#e5e7eb");
      expect(css).toContain("border-style:solid");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile spacing overrides", () => {
      const gallery = galleryWithImages();
      gallery.styles = {
        desktop: { normal: { marginBottom: "40px" } },
        tablet: { normal: { marginBottom: "28px" } },
        mobile: { normal: { marginBottom: "16px" } },
      };

      const html = renderGallery(gallery);

      expect(html).toContain(`[data-npb-id="${gallery.id}"]{margin-bottom:40px`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${gallery.id}"]{margin-bottom:28px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${gallery.id}"]{margin-bottom:16px}}`,
      );
    });

    it("should hide the gallery on selected breakpoints", () => {
      const gallery = galleryWithImages();
      gallery.advanced = { hideOnMobile: true };

      const html = renderGallery(gallery);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${gallery.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const gallery = galleryWithImages();
      gallery.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 200,
      };

      const html = renderGallery(gallery);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:200ms");
    });
  });
});
