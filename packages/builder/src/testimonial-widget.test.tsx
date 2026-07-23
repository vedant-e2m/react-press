import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import type { BuilderElement } from "./types";

function renderTestimonial(element: BuilderElement, extras: BuilderElement[] = []) {
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

function testimonialRoot(html: string): string {
  const match = html.match(/<blockquote class="npb-testimonial"[^>]*>[\s\S]*<\/blockquote>/);
  return match?.[0] ?? "";
}

function testimonialRootStyle(html: string): string {
  return testimonialRoot(html).match(/^<blockquote[^>]*style="([^"]*)"/)?.[1] ?? "";
}

function imageMarkup(html: string): string {
  const match = html.match(/<img[^>]*>/);
  return match?.[0] ?? "";
}

function imageStyle(html: string): string {
  return imageMarkup(html).match(/style="([^"]*)"/)?.[1] ?? "";
}

describe("testimonial widget settings", () => {
  describe("content props", () => {
    it("should render content, name, title, and image", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        content: "Outstanding service and community.",
        image: "https://cdn.example.com/avatar.jpg",
        name: "Sarah Chen",
        title: "Local Entrepreneur",
      };

      const html = renderTestimonial(testimonial);

      expect(html).toContain(`data-npb-id="${testimonial.id}"`);
      expect(html).toContain('class="npb-testimonial"');
      expect(html).toContain("Outstanding service and community.");
      expect(html).toContain('src="https://cdn.example.com/avatar.jpg"');
      expect(html).toContain("Sarah Chen");
      expect(html).toContain("Local Entrepreneur");
    });

    it("should fall back to default content, name, and title", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {};

      const html = renderTestimonial(testimonial);

      expect(html).toContain("Lorem ipsum dolor sit amet");
      expect(html).toContain("John Doe");
      expect(html).toContain("Designer");
    });

    it("should omit the image when image is empty", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = { image: "", content: "No photo testimonial." };

      const html = renderTestimonial(testimonial);

      expect(html).not.toContain("<img");
      expect(html).toContain("No photo testimonial.");
    });

    it("should use the name as image alt text", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        image: "https://cdn.example.com/avatar.jpg",
        name: "Sarah Chen",
      };

      const html = renderTestimonial(testimonial);

      expect(imageMarkup(html)).toContain('alt="Sarah Chen"');
    });

    it("should wrap the testimonial in an anchor when link is set", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        content: "Linked quote",
        link: "https://example.com/testimonial",
      };

      const html = renderTestimonial(testimonial);

      expect(html).toContain('href="https://example.com/testimonial"');
      expect(html).toContain('class="npb-div-link"');
      expect(html).toMatch(
        /<a href="https:\/\/example.com\/testimonial" class="npb-div-link">[\s\S]*<blockquote class="npb-testimonial"/,
      );
      expect(html).toContain(`data-npb-id="${testimonial.id}"`);
    });

    it("should render without a link wrapper when link is empty", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = { content: "Plain quote", link: "" };

      const html = renderTestimonial(testimonial);

      expect(html).not.toContain('class="npb-div-link"');
      expect(html).toContain('class="npb-testimonial"');
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.advanced = { cssId: "customer-quote" };

      const html = renderTestimonial(testimonial);

      expect(html).toContain('id="customer-quote"');
      expect(html).toContain(`data-npb-id="${testimonial.id}"`);
    });
  });

  describe("layout props", () => {
    it("should lay out image beside content when image position is aside", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        image: "https://cdn.example.com/avatar.jpg",
        imagePosition: "aside",
      };

      const style = testimonialRootStyle(renderTestimonial(testimonial));

      expect(style).toContain("flex-direction:row");
    });

    it("should lay out image above content when image position is top", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        image: "https://cdn.example.com/avatar.jpg",
        imagePosition: "top",
      };

      const style = testimonialRootStyle(renderTestimonial(testimonial));

      expect(style).toContain("flex-direction:column");
    });

    it("should align text within the testimonial", () => {
      const left = createBuilderElement("testimonial");
      left.props = { align: "left" };

      const center = createBuilderElement("testimonial");
      center.props = { align: "center" };

      const right = createBuilderElement("testimonial");
      right.props = { align: "right" };

      expect(testimonialRootStyle(renderTestimonial(left))).toContain("text-align:left");
      expect(testimonialRootStyle(renderTestimonial(center))).toContain("text-align:center");
      expect(testimonialRootStyle(renderTestimonial(right))).toContain("text-align:right");
    });
  });

  describe("content style props", () => {
    it("should apply quote text color and font size on the blockquote", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        content: "Styled quote",
        textColor: "#374151",
        contentFontSize: 17,
      };

      const style = testimonialRootStyle(renderTestimonial(testimonial));

      expect(style).toContain("color:#374151");
      expect(style).toContain("font-size:17");
    });
  });

  describe("image style props", () => {
    it("should apply image size, border radius, and object-fit", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        image: "https://cdn.example.com/avatar.jpg",
        imageSize: 72,
        imageBorderRadius: 50,
      };

      const html = renderTestimonial(testimonial);
      const img = imageMarkup(html);
      const style = imageStyle(html);

      expect(img).toContain('width="72"');
      expect(img).toContain('height="72"');
      expect(style).toContain("border-radius:50");
      expect(style).toContain("object-fit:cover");
    });

    it("should default image size and border radius from control defaults", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = { image: "https://cdn.example.com/avatar.jpg" };

      const html = renderTestimonial(testimonial);
      const img = imageMarkup(html);
      const style = imageStyle(html);

      expect(img).toContain('width="60"');
      expect(img).toContain('height="60"');
      expect(style).toContain("border-radius:50");
    });
  });

  describe("name and title style props", () => {
    it("should apply name typography color and size", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        name: "Sarah Chen",
        nameColor: "#111827",
        nameFontSize: 18,
      };

      const html = renderTestimonial(testimonial);
      const nameStyle = html.match(/<strong style="([^"]*)"/)?.[1] ?? "";

      expect(nameStyle).toContain("color:#111827");
      expect(nameStyle).toContain("font-size:18");
    });

    it("should apply title typography color and size", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.props = {
        title: "Local Entrepreneur",
        jobColor: "#6b7280",
        jobFontSize: 14,
      };

      const html = renderTestimonial(testimonial);
      const titleStyle = html.match(/<span style="([^"]*)"/)?.[1] ?? "";

      expect(titleStyle).toContain("color:#6b7280");
      expect(titleStyle).toContain("font-size:14");
    });
  });

  describe("shared style panel", () => {
    it("should apply margin on the host wrapper", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.styles = {
        desktop: {
          normal: {
            marginTop: "12px",
            marginBottom: "24px",
          },
        },
      };

      const css = styleBlockFor(renderTestimonial(testimonial), testimonial.id);

      expect(css).toContain("margin-top:12px");
      expect(css).toContain("margin-bottom:24px");
    });

    it("should emit hover styles on the host wrapper", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.styles = {
        desktop: {
          normal: { opacity: 1 },
          hover: { opacity: 0.6 },
        },
      };

      const html = renderTestimonial(testimonial);

      expect(styleBlockFor(html, testimonial.id)).toContain("opacity:1");
      expect(hoverBlockFor(html, testimonial.id)).toContain("opacity:0.6");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should hide the testimonial on selected breakpoints", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.advanced = { hideOnMobile: true };

      const html = renderTestimonial(testimonial);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${testimonial.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the host wrapper", () => {
      const testimonial = createBuilderElement("testimonial");
      testimonial.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderTestimonial(testimonial);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
