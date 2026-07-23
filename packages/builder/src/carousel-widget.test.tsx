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
    url: "https://example.com/a",
  },
  {
    src: "https://cdn.example.com/b.jpg",
    alt: "Photo B",
    url: "https://example.com/b",
  },
  {
    src: "https://cdn.example.com/c.jpg",
    alt: "Photo C",
    url: "https://example.com/c",
  },
  {
    src: "https://cdn.example.com/d.jpg",
    alt: "Photo D",
    url: "https://example.com/d",
  },
  {
    src: "https://cdn.example.com/e.jpg",
    alt: "Photo E",
    url: "https://example.com/e",
  },
  {
    src: "https://cdn.example.com/f.jpg",
    alt: "Photo F",
    url: "https://example.com/f",
  },
];

function renderCarousel(element: BuilderElement, extras: BuilderElement[] = []) {
  const document = {
    ...EMPTY_BUILDER_DOCUMENT,
    content: [element, ...extras],
  };
  return renderToStaticMarkup(<BuilderRenderer document={document} />);
}

function renderCarouselWidget(element: BuilderElement): string {
  const widget = getBuilderWidget("carousel")!;
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

function carouselMarkup(html: string): string {
  const match = html.match(/<div class="npb-carousel[^"]*"[\s\S]*/);
  return match?.[0] ?? html;
}

function dotsBlock(html: string): string {
  const match = html.match(/class="npb-carousel-dots"[\s\S]*?<\/div>/);
  return match?.[0] ?? "";
}

function carouselRoot(html: string): string {
  const match = html.match(/<div class="npb-carousel[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

function carouselTrackStyle(html: string): string {
  const match = html.match(/class="npb-carousel[^"]*"[\s\S]*?<div style="([^"]*)"/);
  return match?.[1] ?? "";
}

function imageSrcOrder(html: string): string[] {
  return [...carouselMarkup(html).matchAll(/<img[^>]*src="([^"]+)"/g)].map((match) => match[1]);
}

function anchorHrefs(html: string): string[] {
  return [...carouselMarkup(html).matchAll(/<a[^>]*href="([^"]+)"/g)].map((match) => match[1]);
}

function carouselWithImages(overrides: Record<string, unknown> = {}): BuilderElement {
  const carousel = createBuilderElement("carousel");
  carousel.props = {
    images: SAMPLE_IMAGES.slice(0, 3),
    slidesToShow: "1",
    slidesToScroll: "1",
    navigation: "both",
    imageSpacing: 20,
    carouselName: "",
    imageStretch: "yes",
    linkTo: "none",
    lightbox: "yes",
    autoplay: true,
    pauseOnHover: true,
    autoplaySpeed: 5000,
    infinite: true,
    effect: "slide",
    speed: 500,
    direction: "ltr",
    arrowSize: 20,
    arrowColor: "",
    dotSize: 8,
    dotColor: "",
    activeDotColor: "",
    borderRadius: 0,
    ...overrides,
  };
  return carousel;
}

describe("carousel widget settings", () => {
  describe("widget registration", () => {
    it("should expose every carousel control with matching default props", () => {
      const widget = getBuilderWidget("carousel");
      const contentSection = widget?.controls.find((section) => section.label === "Image Carousel");
      const optionsSection = widget?.controls.find((section) => section.label === "Additional Options");
      const navigationSection = widget?.controls.find((section) => section.label === "Navigation");
      const imageSection = widget?.controls.find((section) => section.label === "Image");

      expect(widget?.defaultProps).toEqual({
        images: [],
        slidesToShow: "1",
        slidesToScroll: "1",
        navigation: "both",
        imageSpacing: 20,
        carouselName: "",
        imageStretch: "yes",
        linkTo: "none",
        lightbox: "yes",
        autoplay: true,
        pauseOnHover: true,
        autoplaySpeed: 5000,
        infinite: true,
        effect: "slide",
        speed: 500,
        direction: "ltr",
        arrowSize: 20,
        arrowColor: "",
        dotSize: 8,
        dotColor: "",
        activeDotColor: "",
        borderRadius: 0,
      });

      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "carouselName",
        "images",
        "slidesToShow",
        "slidesToScroll",
        "imageStretch",
        "navigation",
        "linkTo",
        "lightbox",
      ]);
      expect(optionsSection?.controls.map((control) => control.key)).toEqual([
        "autoplay",
        "pauseOnHover",
        "autoplaySpeed",
        "infinite",
        "effect",
        "speed",
        "direction",
      ]);
      expect(navigationSection?.controls.map((control) => control.key)).toEqual([
        "arrowSize",
        "arrowColor",
        "dotSize",
        "dotColor",
        "activeDotColor",
      ]);
      expect(imageSection?.controls.map((control) => control.key)).toEqual([
        "imageSpacing",
        "borderRadius",
      ]);
    });
  });

  describe("general props", () => {
    it("should render carousel images with alt text", () => {
      const carousel = carouselWithImages();

      const html = renderCarousel(carousel);

      expect(html).toContain(`data-npb-id="${carousel.id}"`);
      expect(html).toMatch(/class="npb-carousel npb-carousel-/);
      expect(html).toContain('src="https://cdn.example.com/a.jpg"');
      expect(html).toContain('src="https://cdn.example.com/b.jpg"');
      expect(html).toContain('src="https://cdn.example.com/c.jpg"');
      expect(html).toContain('alt="Photo A"');
    });

    it("should render a placeholder when images is empty", () => {
      const carousel = carouselWithImages({ images: [] });

      const html = renderCarousel(carousel);

      expect(html).toContain('class="npb-carousel npb-carousel-empty"');
      expect(html).toContain('class="npb-placeholder"');
      expect(html).toContain("Add carousel images");
      expect(html).not.toContain("<img");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const carousel = carouselWithImages();
      carousel.advanced = { cssId: "vendor-carousel" };

      const html = renderCarousel(carousel);

      expect(html).toContain('id="vendor-carousel"');
      expect(html).toContain(`data-npb-id="${carousel.id}"`);
    });

    it("should expose carouselName as an accessible label when set", () => {
      const carousel = carouselWithImages({ carouselName: "Featured vendors" });

      const html = renderCarouselWidget(carousel);

      expect(carouselRoot(html)).toContain('aria-label="Featured vendors"');
    });
  });

  describe("slidesToShow and imageStretch", () => {
    it.each([1, 2, 3, 4] as const)("should size images for %s visible slides", (slidesToShow) => {
      const carousel = carouselWithImages({ slidesToShow: String(slidesToShow), imageStretch: "yes" });

      const html = renderCarouselWidget(carousel);
      const imgStyle = carouselMarkup(html).match(/<img[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(imgStyle).toContain(`width:${100 / slidesToShow}%`);
    });

    it("should fall back to one visible slide for invalid slidesToShow values", () => {
      const carousel = carouselWithImages({ slidesToShow: "0", imageStretch: "yes" });

      const html = renderCarouselWidget(carousel);
      const imgStyle = carouselMarkup(html).match(/<img[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(imgStyle).toContain("width:100%");
    });

    it("should keep natural image width when imageStretch is no", () => {
      const carousel = carouselWithImages({ imageStretch: "no", slidesToShow: "3" });

      const html = renderCarouselWidget(carousel);
      const imgStyle = carouselMarkup(html).match(/<img[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(imgStyle).toContain("width:auto");
    });
  });

  describe("navigation", () => {
    it("should render arrows and dots when navigation is both", () => {
      const carousel = carouselWithImages({ navigation: "both" });

      const html = renderCarouselWidget(carousel);

      expect(html).toContain('class="npb-carousel-arrows"');
      expect(html).toContain('aria-label="Previous"');
      expect(html).toContain('aria-label="Next"');
      expect(html).toContain('class="npb-carousel-dots"');
    });

    it.each(["arrows", "dots", "none"] as const)("should respect navigation mode %s", (navigation) => {
      const carousel = carouselWithImages({ navigation });

      const html = renderCarouselWidget(carousel);

      expect(html.includes('class="npb-carousel-arrows"')).toBe(navigation === "arrows" || navigation === "both");
      expect(html.includes('class="npb-carousel-dots"')).toBe(navigation === "dots" || navigation === "both");
    });

    it("should render one dot per image", () => {
      const carousel = carouselWithImages({ images: SAMPLE_IMAGES, navigation: "dots" });

      const html = renderCarouselWidget(carousel);
      const dots = dotsBlock(html);

      expect((dots.match(/border-radius:50%/g) ?? []).length).toBe(SAMPLE_IMAGES.length);
    });
  });

  describe("linkTo and lightbox", () => {
    it("should not wrap images in anchors when linkTo is none and lightbox is off", () => {
      const carousel = carouselWithImages({ linkTo: "none", lightbox: "no" });

      const html = renderCarouselWidget(carousel);

      expect(html).not.toContain("<a ");
      expect(html).toContain("<img");
    });

    it("should link to the media file when linkTo is file", () => {
      const carousel = carouselWithImages({ linkTo: "file", lightbox: "no" });

      const html = renderCarouselWidget(carousel);

      expect(html).toContain('href="https://cdn.example.com/a.jpg"');
      expect(html).not.toContain('href="https://example.com/a"');
    });

    it("should link to the custom url when linkTo is custom", () => {
      const carousel = carouselWithImages({ linkTo: "custom", lightbox: "no" });

      const html = renderCarouselWidget(carousel);

      expect(anchorHrefs(html)).toEqual([
        "https://example.com/a",
        "https://example.com/b",
        "https://example.com/c",
      ]);
    });

    it.each(["yes", "default"] as const)(
      "should emit data-npb-lightbox when lightbox is %s",
      (lightbox) => {
        const carousel = carouselWithImages({ linkTo: "none", lightbox });

        const html = renderCarouselWidget(carousel);

        expect(html).toContain('data-npb-lightbox="yes"');
        expect(html).toContain('href="https://cdn.example.com/a.jpg"');
      },
    );

    it("should omit data-npb-lightbox when lightbox is no", () => {
      const carousel = carouselWithImages({ linkTo: "file", lightbox: "no" });

      const html = renderCarouselWidget(carousel);

      expect(html).toContain('href="https://cdn.example.com/a.jpg"');
      expect(html).not.toContain("data-npb-lightbox");
    });
  });

  describe("carousel behavior props", () => {
    it("should expose runtime carousel options as data attributes", () => {
      const carousel = carouselWithImages({
        slidesToShow: "3",
        slidesToScroll: "2",
        autoplay: true,
        pauseOnHover: true,
        autoplaySpeed: 4000,
        infinite: true,
        effect: "fade",
        speed: 600,
      });

      const html = renderCarouselWidget(carousel);
      const root = carouselRoot(html);

      expect(root).toContain(`data-npb-carousel="${carousel.id}"`);
      expect(root).toContain('data-slides-to-show="3"');
      expect(root).toContain('data-slides-to-scroll="2"');
      expect(root).toContain('data-autoplay="yes"');
      expect(root).toContain('data-pause-on-hover="yes"');
      expect(root).toContain('data-autoplay-speed="4000"');
      expect(root).toContain('data-infinite="yes"');
      expect(root).toContain('data-speed="600"');
      expect(root).toContain('class="npb-carousel npb-carousel-fade"');
    });

    it("should omit autoplay and infinite flags when disabled", () => {
      const carousel = carouselWithImages({
        autoplay: false,
        pauseOnHover: false,
        infinite: false,
      });

      const html = renderCarouselWidget(carousel);
      const root = carouselRoot(html);

      expect(root).not.toContain('data-autoplay="yes"');
      expect(root).not.toContain('data-pause-on-hover="yes"');
      expect(root).not.toContain('data-infinite="yes"');
      expect(root).toContain('class="npb-carousel npb-carousel-slide"');
    });
  });

  describe("layout and image styling", () => {
    it("should apply image spacing and rtl direction on the track", () => {
      const carousel = carouselWithImages({ imageSpacing: 16, direction: "rtl" });

      const html = renderCarouselWidget(carousel);
      const trackStyle = carouselTrackStyle(html);

      expect(trackStyle).toContain("gap:16");
      expect(trackStyle).toContain("direction:rtl");
    });

    it("should apply border radius on carousel images", () => {
      const carousel = carouselWithImages({ borderRadius: 8 });

      const html = renderCarouselWidget(carousel);

      expect(html).toContain("border-radius:8");
    });
  });

  describe("navigation styling", () => {
    it("should apply arrow size and color on the arrow controls", () => {
      const carousel = carouselWithImages({
        arrowSize: 24,
        arrowColor: "#6d5dfc",
      });

      const html = renderCarouselWidget(carousel);
      const arrows = html.match(/class="npb-carousel-arrows" style="([^"]*)"/)?.[1] ?? "";

      expect(arrows).toContain("font-size:24");
      expect(arrows).toContain("color:#6d5dfc");
    });

    it("should apply dot size and colors with the first dot active", () => {
      const carousel = carouselWithImages({
        navigation: "dots",
        dotSize: 10,
        dotColor: "#d1d5db",
        activeDotColor: "#6d5dfc",
      });

      const html = renderCarouselWidget(carousel);
      const dots = dotsBlock(html);

      expect(dots).toContain("width:10");
      expect(dots).toContain("height:10");
      expect(dots).toContain("background:#6d5dfc");
      expect(dots).toContain("background:#d1d5db");
    });

    it("should fall back to default dot colors when colors are absent", () => {
      const carousel = carouselWithImages({ navigation: "dots" });

      const html = renderCarouselWidget(carousel);
      const dots = dotsBlock(html);

      expect(dots).toContain("background:#4054b2");
      expect(dots).toContain("background:#c2cbd2");
    });
  });

  describe("shared style panel", () => {
    it("should apply spacing CSS on the host wrapper", () => {
      const carousel = carouselWithImages();
      carousel.styles = {
        desktop: {
          normal: {
            marginTop: "16px",
            marginBottom: "32px",
            paddingLeft: "12px",
          },
        },
      };

      const css = styleBlockFor(renderCarousel(carousel), carousel.id);

      expect(css).toContain("margin-top:16px");
      expect(css).toContain("margin-bottom:32px");
      expect(css).toContain("padding-left:12px");
    });

    it("should apply border styles on the host wrapper", () => {
      const carousel = carouselWithImages();
      carousel.styles = {
        desktop: {
          normal: {
            borderWidth: "1px",
            borderColor: "#e5e7eb",
            borderStyle: "solid",
          },
        },
      };

      const css = styleBlockFor(renderCarousel(carousel), carousel.id);

      expect(css).toContain("border-width:1px");
      expect(css).toContain("border-color:#e5e7eb");
      expect(css).toContain("border-style:solid");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile spacing overrides", () => {
      const carousel = carouselWithImages();
      carousel.styles = {
        desktop: { normal: { marginBottom: "40px" } },
        tablet: { normal: { marginBottom: "28px" } },
        mobile: { normal: { marginBottom: "16px" } },
      };

      const html = renderCarousel(carousel);

      expect(html).toContain(`[data-npb-id="${carousel.id}"]{margin-bottom:40px`);
      expect(html).toContain(
        `@media(max-width:1024px){[data-npb-id="${carousel.id}"]{margin-bottom:28px}}`,
      );
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${carousel.id}"]{margin-bottom:16px}}`,
      );
    });

    it("should hide the carousel on selected breakpoints", () => {
      const carousel = carouselWithImages();
      carousel.advanced = { hideOnMobile: true };

      const html = renderCarousel(carousel);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${carousel.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const carousel = carouselWithImages();
      carousel.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 200,
      };

      const html = renderCarousel(carousel);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:200ms");
    });

    it("should emit hover background styles", () => {
      const carousel = carouselWithImages();
      carousel.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderCarousel(carousel);
      const hover = hoverBlockFor(html, carousel.id);

      expect(styleBlockFor(html, carousel.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });
  });
});
