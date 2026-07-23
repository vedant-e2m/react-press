import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createBuilderElement, EMPTY_BUILDER_DOCUMENT } from "./document";
import { BuilderRenderer } from "./renderer";
import { getBuilderWidget } from "./widgets";
import type { BuilderElement } from "./types";

function renderForm(element: BuilderElement, extras: BuilderElement[] = []) {
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

function formBlock(html: string): string {
  const match = html.match(/<form class="npb-form"[\s\S]*?<\/form>/);
  return match?.[0] ?? "";
}

function fieldLabels(html: string): string[] {
  return [...formBlock(html).matchAll(/<label>([^<]+)</g)].map((match) => match[1].trim());
}

describe("form widget settings", () => {
  describe("widget registration", () => {
    it("should expose the fields repeater and button text controls", () => {
      const widget = getBuilderWidget("form");
      const contentSection = widget?.controls.find((section) => section.label === "Content");

      expect(widget?.defaultProps).toEqual({
        fields: [
          { label: "Name", type: "text", required: true },
          { label: "Email", type: "email", required: true },
        ],
        buttonText: "Send",
      });
      expect(contentSection?.controls.map((control) => control.key)).toEqual([
        "fields",
        "buttonText",
      ]);
      expect(contentSection?.controls[0]).toEqual(
        expect.objectContaining({
          key: "fields",
          label: "Form Fields",
          type: "repeater",
        }),
      );
      expect(contentSection?.controls[1]).toEqual(
        expect.objectContaining({
          key: "buttonText",
          label: "Button Text",
          type: "text",
          defaultValue: "Send",
        }),
      );
    });
  });

  describe("content props", () => {
    it("should render default fields and submit button", () => {
      const form = createBuilderElement("form");

      const html = renderForm(form);
      const block = formBlock(html);

      expect(html).toContain(`data-npb-id="${form.id}"`);
      expect(block).toContain('class="npb-form"');
      expect(fieldLabels(html)).toEqual(["Name", "Email"]);
      expect(block).toContain('type="text"');
      expect(block).toContain('name="name"');
      expect(block).toContain('type="email"');
      expect(block).toContain('name="email"');
      expect(block).toContain('required=""');
      expect(block).toContain("<button type=\"submit\">Send</button>");
    });

    it("should render custom repeater fields and button text", () => {
      const form = createBuilderElement("form");
      form.props = {
        fields: [
          { label: "Full Name", type: "text", required: true },
          { label: "Phone", type: "tel", required: false },
          { label: "Notes", type: "textarea", required: false, placeholder: "Tell us more" },
          {
            label: "Interest",
            type: "select",
            required: false,
            options: ["Events", "Vendors"],
          },
          { label: "Subscribe", type: "checkbox", required: true },
        ],
        buttonText: "Subscribe to Market News",
      };

      const html = renderForm(form);
      const block = formBlock(html);

      expect(fieldLabels(html)).toEqual([
        "Full Name",
        "Phone",
        "Notes",
        "Interest",
        "Subscribe",
      ]);
      expect(block).toContain('name="full-name"');
      expect(block).toContain('type="tel"');
      expect(block).toContain("<textarea");
      expect(block).toContain('placeholder="Tell us more"');
      expect(block).toContain("<select");
      expect(block).toContain('name="interest"');
      expect(block).toContain("<option value=\"\">Select…</option>");
      expect(block).toContain("<option value=\"Events\">Events</option>");
      expect(block).toContain("<option value=\"Vendors\">Vendors</option>");
      expect(block).not.toContain('type="select"');
      expect(block).toContain('type="checkbox"');
      expect(block).toContain("<button type=\"submit\">Subscribe to Market News</button>");
    });

    it("should render an empty form when fields are missing or invalid", () => {
      const form = createBuilderElement("form");
      form.props = { fields: null, buttonText: "Submit" };

      const html = renderForm(form);
      const block = formBlock(html);

      expect(block).not.toContain("<label>");
      expect(block).toContain("<button type=\"submit\">Submit</button>");
    });

    it("should fall back to Send when button text is empty", () => {
      const form = createBuilderElement("form");
      form.props = { fields: [], buttonText: "" };

      const html = renderForm(form);

      expect(formBlock(html)).toContain("<button type=\"submit\">Send</button>");
    });

    it("should coerce serialized required flags and avoid invalid select inputs", () => {
      const form = createBuilderElement("form");
      form.props = {
        fields: [
          { label: "Email", type: "email", required: "true" },
          { label: "Optional", type: "text", required: "false" },
          { label: "Topic", type: "select", required: false },
        ],
        buttonText: "Go",
      };

      const html = renderForm(form);
      const block = formBlock(html);

      expect(block.match(/required=""/g)?.length).toBe(1);
      expect(block).toContain("<select");
      expect(block).not.toContain('type="select"');
    });

    it("should slugify field names and fall back to indexed names for blank labels", () => {
      const form = createBuilderElement("form");
      form.props = {
        fields: [
          { label: "I'm interested in", type: "text", required: false },
          { label: "   ", type: "text", required: false },
        ],
        buttonText: "Send",
      };

      const html = renderForm(form);
      const block = formBlock(html);

      expect(block).toContain('name="i-m-interested-in"');
      expect(block).toContain('name="field-2"');
    });

    it("should fall back to text inputs for unknown field types", () => {
      const form = createBuilderElement("form");
      form.props = {
        fields: [{ label: "Custom", type: "color-wheel", required: false }],
        buttonText: "Send",
      };

      const html = renderForm(form);

      expect(formBlock(html)).toContain('type="text"');
      expect(formBlock(html)).not.toContain('type="color-wheel"');
    });
  });

  describe("shared style panel", () => {
    it("should apply typography CSS to the form host wrapper", () => {
      const form = createBuilderElement("form");
      form.styles = {
        desktop: {
          normal: {
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: 1,
            textTransform: "uppercase",
          },
        },
      };

      const css = styleBlockFor(renderForm(form), form.id);

      expect(css).toContain("font-family:Georgia, serif");
      expect(css).toContain("font-weight:700");
      expect(css).toContain("font-size:18px");
      expect(css).toContain("letter-spacing:1px");
      expect(css).toContain("text-transform:uppercase");
    });

    it("should apply border settings from the style panel", () => {
      const form = createBuilderElement("form");
      form.styles = {
        desktop: {
          normal: {
            borderWidth: "2px",
            borderColor: "#00aa55",
            borderStyle: "dashed",
          },
        },
      };

      const css = styleBlockFor(renderForm(form), form.id);

      expect(css).toContain("border-width:2px");
      expect(css).toContain("border-color:#00aa55");
      expect(css).toContain("border-style:dashed");
    });
  });

  describe("responsive and interaction styles", () => {
    it("should emit tablet and mobile typography overrides", () => {
      const form = createBuilderElement("form");
      form.styles = {
        desktop: { normal: { fontSize: 18 } },
        tablet: { normal: { fontSize: 16 } },
        mobile: { normal: { fontSize: 14 } },
      };

      const html = renderForm(form);

      expect(html).toContain(`[data-npb-id="${form.id}"]{font-size:18px`);
      expect(html).toContain(`@media(max-width:1024px){[data-npb-id="${form.id}"]{font-size:16px}}`);
      expect(html).toContain(`@media(max-width:767px){[data-npb-id="${form.id}"]{font-size:14px}}`);
    });

    it("should emit hover background and text styles on the form host", () => {
      const form = createBuilderElement("form");
      form.styles = {
        desktop: {
          normal: { backgroundColor: "#ffffff", color: "#111111" },
          hover: { backgroundColor: "#000000", color: "#ffffff" },
        },
      };

      const html = renderForm(form);
      const hover = hoverBlockFor(html, form.id);

      expect(styleBlockFor(html, form.id)).toContain("background-color:#ffffff");
      expect(styleBlockFor(html, form.id)).toContain("color:#111111");
      expect(hover).toContain("background-color:#000000");
      expect(hover).toContain("color:#ffffff");
    });

    it("should hide the form on selected breakpoints", () => {
      const form = createBuilderElement("form");
      form.advanced = { hideOnMobile: true };

      const html = renderForm(form);

      expect(html).toContain(
        `@media(max-width:767px){[data-npb-id="${form.id}"]{display:none!important}}`,
      );
    });

    it("should apply entrance animation classes and delay on the form host", () => {
      const form = createBuilderElement("form");
      form.advanced = {
        entranceAnimation: "fadeInUp",
        animationDuration: "fast",
        animationDelay: 250,
      };

      const html = renderForm(form);

      expect(html).toContain("npb-animate");
      expect(html).toContain("npb-animate-fadeInUp");
      expect(html).toContain("npb-animate-fast");
      expect(html).toContain("animation-delay:250ms");
    });

    it("should apply advanced css id on the form host wrapper", () => {
      const form = createBuilderElement("form");
      form.advanced = { cssId: "newsletter-form" };

      const html = renderForm(form);

      expect(html).toContain(`id="newsletter-form"`);
      expect(html).toContain(`data-npb-id="${form.id}"`);
    });
  });
});
