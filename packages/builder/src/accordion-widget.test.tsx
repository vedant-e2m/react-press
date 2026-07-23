import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderAccordion(element: BuilderElement, extras: BuilderElement[] = []) {
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

function accordionBlock(html: string): string {
  const match = html.match(/<div class="npb-accordion-widget[^"]*"[\s\S]*?<\/div>\s*(?:<script[\s\S]*?<\/script>\s*)?<\/div>/);
  return match?.[0] ?? "";
}

function accordionRoot(html: string): string {
  const match = html.match(/<div class="npb-accordion-widget[^"]*"[^>]*>/);
  return match?.[0] ?? "";
}

describe("accordion widget settings", () => {
  describe("widget registration", () => {
    it("should expose layout, interaction, and style controls", () => {
      const widget = getBuilderWidget("accordion");

      expect(widget?.defaultProps).toEqual({
        items: [
          {
            title: "Accordion Item #1",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
          },
          {
            title: "Accordion Item #2",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
          },
          {
            title: "Accordion Item #3",
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
          },
        ],
        itemPosition: "stretch",
        iconPosition: "end",
        expandIcon: "▼",
        collapseIcon: "▲",
        titleTag: "div",
        faqSchema: false,
        defaultState: "expanded_first",
        maxExpanded: "one",
        animationDuration: 400,
        spaceBetween: 0,
        distanceFromContent: 0,
      });

      const layoutSection = widget?.controls.find((section) => section.label === "Layout");
      const interactionsSection = widget?.controls.find((section) => section.label === "Interactions");
      const accordionStyleSection = widget?.controls.find((section) => section.label === "Accordion");
      const headerSection = widget?.controls.find((section) => section.label === "Header");
      const contentSection = widget?.controls.find((section) => section.label === "Content");

      expect(layoutSection?.controls.map((control) => control.key)).toEqual([
        "items",
        "itemPosition",
        "iconPosition",
        "expandIcon",
        "collapseIcon",
        "titleTag",
        "faqSchema",
      ]);
      expect(interactionsSection?.controls.map((control) => control.key)).toEqual([
        "defaultState",
        "maxExpanded",
        "animationDuration",
      ]);
      expect(accordionStyleSection?.controls.map((control) => control.key)).toEqual([
        "spaceBetween",
        "distanceFromContent",
        "titleBackground",
      ]);
      expect(headerSection?.controls.map((control) => control.key)).toEqual([
        "titleColor",
        "activeTitleColor",
        "titleFontSize",
        "iconSize",
        "iconColor",
      ]);
      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "contentBackground",
        "contentColor",
        "contentFontSize",
      ]);
    });
  });

  describe("general props", () => {
    it("should render item titles and content with the first item expanded by default", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        items: [
          { title: "Overview", content: "Overview copy." },
          { title: "Details", content: "Details copy." },
        ],
      };

      const html = renderAccordion(accordion);
      const block = accordionBlock(html);

      expect(html).toContain(`data-npb-id="${accordion.id}"`);
      expect(block).toContain('class="npb-accordion-widget npb-accordion-one"');
      expect(html).toContain("Overview");
      expect(html).toContain("Details");
      expect(html).toContain("Overview copy.");
      expect(html).toContain("Details copy.");
      expect(block).toContain(`name="npb-accordion-${accordion.id}"`);
      expect(block).toMatch(new RegExp(`id="${accordion.id}-acc-0"[^>]*checked`));
      expect(html).not.toMatch(new RegExp(`id="${accordion.id}-acc-1"[^>]*checked`));
    });

    it("should wire labels to accordion inputs", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        items: [
          { title: "Alpha", content: "A" },
          { title: "Beta", content: "B" },
        ],
      };

      const html = renderAccordion(accordion);

      expect(html).toContain(`for="${accordion.id}-acc-0"`);
      expect(html).toContain(`for="${accordion.id}-acc-1"`);
      expect(html).toContain('class="npb-accordion-header"');
    });

    it("should render radio inputs when maxExpanded is one", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        maxExpanded: "one",
        items: [{ title: "One", content: "Body" }],
      };

      const html = renderAccordion(accordion);

      expect(html).toContain('type="radio"');
      expect(html).toContain('class="npb-accordion-widget npb-accordion-one"');
    });

    it("should render checkbox inputs when maxExpanded is multiple", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        maxExpanded: "multiple",
        items: [{ title: "One", content: "Body" }],
      };

      const html = renderAccordion(accordion);

      expect(html).toContain('type="checkbox"');
      expect(html).toContain('class="npb-accordion-widget npb-accordion-multiple"');
    });

    it("should render an empty shell when items are missing", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = { items: [] };

      const html = renderAccordion(accordion);

      expect(html).toContain('class="npb-accordion-widget npb-accordion-empty"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toContain("npb-accordion-header");
      expect(html).not.toContain("npb-accordion-panel");
    });

    it("should apply css id from advanced settings onto the host wrapper", () => {
      const accordion = createBuilderElement("accordion");
      accordion.advanced = { cssId: "faq-accordion" };

      const html = renderAccordion(accordion);

      expect(html).toContain('id="faq-accordion"');
      expect(html).toContain(`data-npb-id="${accordion.id}"`);
    });
  });

  describe("layout props", () => {
    it("should render the configured title html tag", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        titleTag: "h4",
        items: [{ title: "Question", content: "Answer" }],
      };

      const html = renderAccordion(accordion);

      expect(html).toMatch(/<h4[^>]*>Question<\/h4>/);
    });

    it.each([
      ["start", "justify-content:flex-start"],
      ["center", "justify-content:center"],
      ["end", "justify-content:flex-end"],
      ["stretch", "justify-content:space-between"],
    ] as const)("should position item titles to %s", (itemPosition, expected) => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        itemPosition,
        items: [{ title: "Positioned", content: "Body" }],
      };

      const html = renderAccordion(accordion);
      const headerStyle =
        accordionBlock(html).match(/npb-accordion-header[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(headerStyle).toContain(expected);
    });

    it("should stretch the title across the header row", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        itemPosition: "stretch",
        items: [{ title: "Wide title", content: "Body" }],
      };

      const html = renderAccordion(accordion);

      expect(html).toMatch(/<div[^>]*style="[^"]*flex:1[^"]*"[^>]*>Wide title<\/div>/);
    });

    it("should place the icon at the start when iconPosition is start", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        iconPosition: "start",
        items: [{ title: "Leading icon", content: "Body" }],
      };

      const html = renderAccordion(accordion);
      const headerStyle =
        accordionBlock(html).match(/npb-accordion-header[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(headerStyle).toContain("flex-direction:row-reverse");
    });

    it("should render custom expand and collapse icons for css toggling", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        expandIcon: "+",
        collapseIcon: "−",
        items: [{ title: "Custom icons", content: "Body" }],
      };

      const html = renderAccordion(accordion);

      expect(html).toContain('class="npb-accordion-icon-expand">+</span>');
      expect(html).toContain('class="npb-accordion-icon-collapse">−</span>');
    });
  });

  describe("interaction props", () => {
    it("should leave all items collapsed when defaultState is collapsed", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        defaultState: "collapsed",
        items: [
          { title: "One", content: "A" },
          { title: "Two", content: "B" },
        ],
      };

      const html = renderAccordion(accordion);

      expect(html).not.toMatch(/npb-accordion-input[^>]*checked/);
    });

    it("should expand all items when defaultState is expanded_all and maxExpanded is multiple", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        defaultState: "expanded_all",
        maxExpanded: "multiple",
        items: [
          { title: "One", content: "A" },
          { title: "Two", content: "B" },
        ],
      };

      const html = renderAccordion(accordion);

      expect(html).toMatch(new RegExp(`id="${accordion.id}-acc-0"[^>]*checked`));
      expect(html).toMatch(new RegExp(`id="${accordion.id}-acc-1"[^>]*checked`));
    });

    it("should only expand the first item when defaultState is expanded_all and maxExpanded is one", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        defaultState: "expanded_all",
        maxExpanded: "one",
        items: [
          { title: "One", content: "A" },
          { title: "Two", content: "B" },
        ],
      };

      const html = renderAccordion(accordion);

      expect(html).toMatch(new RegExp(`id="${accordion.id}-acc-0"[^>]*checked`));
      expect(html).not.toMatch(new RegExp(`id="${accordion.id}-acc-1"[^>]*checked`));
    });

    it("should emit faq schema json when faqSchema is enabled", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        faqSchema: true,
        items: [
          { title: "What are the hours?", content: "Mon–Sat 10am–9pm." },
          { title: "Where do I park?", content: "Free parking in the garage." },
        ],
      };

      const html = renderAccordion(accordion);

      expect(html).toContain('type="application/ld+json"');
      expect(html).toContain('"@type":"FAQPage"');
      expect(html).toContain('"name":"What are the hours?"');
      expect(html).toContain('"text":"Mon–Sat 10am–9pm."');
    });
  });

  describe("style props", () => {
    it("should apply spacing, colors, and typography via inline styles and css variables", () => {
      const accordion = createBuilderElement("accordion");
      accordion.props = {
        spaceBetween: 12,
        distanceFromContent: 8,
        titleBackground: "#f9fafb",
        titleColor: "#111827",
        activeTitleColor: "#6d5dfc",
        titleFontSize: 18,
        iconSize: 16,
        iconColor: "#6d5dfc",
        contentBackground: "#ffffff",
        contentColor: "#4b5563",
        contentFontSize: 15,
        animationDuration: 500,
        items: [{ title: "Styled", content: "Colored body" }],
      };

      const html = renderAccordion(accordion);
      const root = accordionRoot(html);
      const block = accordionBlock(html);
      const contentStyle =
        block.match(/npb-accordion-content[^>]*style="([^"]*)"/)?.[1] ?? "";
      const iconStyle = block.match(/npb-accordion-icon[^>]*style="([^"]*)"/)?.[1] ?? "";

      expect(root).toContain("--npb-accordion-active-color:#6d5dfc");
      expect(root).toContain("--npb-accordion-title-color:#111827");
      expect(root).toMatch(/style="[^"]*gap:12/);
      expect(root).toContain("--npb-accordion-duration:500ms");
      expect(block).toContain("background:#f9fafb");
      expect(block).toMatch(/npb-accordion-header[^>]*style="[^"]*font-size:18/);
      expect(iconStyle).toContain("font-size:16");
      expect(iconStyle).toContain("color:#6d5dfc");
      expect(contentStyle).toContain("margin-top:8");
      expect(contentStyle).toContain("color:#4b5563");
      expect(contentStyle).toContain("background:#ffffff");
      expect(contentStyle).toContain("font-size:15");
    });
  });

  describe("size settings", () => {
    it("should apply width, height, min/max size, overflow, and aspect-ratio", () => {
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

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
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

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
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

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
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

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
    it("should apply typography CSS to the accordion host", () => {
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

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
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

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
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
            borderRadius: "12px",
          },
        },
      };

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
      expect(css).toContain("border-radius:12px");
    });
  });

  describe("effects settings", () => {
    it("should apply opacity, shadow, blend, transform, and transition", () => {
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
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

      const css = styleBlockFor(renderAccordion(accordion), accordion.id);

      expect(css).toContain("opacity:0.75");
      expect(css).toContain("box-shadow:0 8px 24px #0000001a");
      expect(css).toContain("mix-blend-mode:multiply");
      expect(css).toContain("transform:translateX(10px) translateY(4px) rotate(5deg) skewX(0deg) scale(1.1)");
      expect(css).toContain("transition:all 350ms ease");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile size overrides", () => {
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
        desktop: { normal: { width: "600px", backgroundColor: "#111111" } },
        tablet: { normal: { width: "400px" } },
        mobile: { normal: { width: "100%", backgroundColor: "#222222" } },
      };

      const html = renderAccordion(accordion);

      expect(html).toContain(`[data-npb-id="${accordion.id}"]{width:600px;background-color:#111111`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${accordion.id}"]{width:400px}}`);
      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${accordion.id}"]{width:100%;background-color:#222222}}`,
      );
    });

    it("should emit hover background styles", () => {
      const accordion = createBuilderElement("accordion");
      accordion.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderAccordion(accordion);
      const hover = hoverBlockFor(html, accordion.id);

      expect(styleBlockFor(html, accordion.id)).toContain("background-color:#ffffff");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the accordion on selected breakpoints", () => {
      const accordion = createBuilderElement("accordion");
      accordion.advanced = { hideOnMobile: true };

      const html = renderAccordion(accordion);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${accordion.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay", () => {
      const accordion = createBuilderElement("accordion");
      accordion.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderAccordion(accordion);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });
  });
});
