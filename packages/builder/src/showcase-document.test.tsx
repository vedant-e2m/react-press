import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BuilderRenderer } from "./renderer";
import { builderWidgets } from "./widgets";
import { createShowcaseDocument, getShowcaseWidgetTypes } from "./showcase-document";

describe("showcase document", () => {
  const document = createShowcaseDocument();

  it("should include every registered free widget type", () => {
    const registered = builderWidgets.map((widget) => widget.type).sort();
    const used = getShowcaseWidgetTypes();

    for (const type of registered) {
      expect(used, `missing widget type: ${type}`).toContain(type);
    }
  });

  it("should render without errors and include widget markup", () => {
    const html = renderToStaticMarkup(<BuilderRenderer document={document} />);

    expect(html).toContain("npb-page");
    expect(html).toContain("Welcome To");
    expect(html).toContain("The Public Market");
    expect(html).toContain("npb-gallery");
    expect(html).toContain("npb-carousel");
    expect(html).toContain("npb-form");
    expect(html).toContain("npb-accordion-widget");
    expect(html).toContain("npb-counter");
    expect(html).toContain("npb-progress");
    expect(html).toContain("npb-text-path");
    expect(html).toContain("npb-social");
    expect(html).toContain("npb-placeholder");
  });

  it("should apply page settings and custom CSS", () => {
    expect(document.settings.title).toContain("Component Showcase");
    expect(document.settings.contentWidth).toBe(1200);
    expect(document.settings.customCss).toContain(".npb-page");
    expect(document.globals.colors.primary).toBe("#6d5dfc");
    expect(document.globals.classes).toHaveLength(1);
  });

  it("should configure representative widget settings", () => {
    const find = (type: string) => {
      const walk = (elements: typeof document.content): typeof document.content[number] | undefined => {
        for (const element of elements) {
          if (element.type === type) return element;
          const child = walk(element.children ?? []);
          if (child) return child;
        }
        return undefined;
      };
      return walk(document.content);
    };

    const heroHeading = find("heading");
    expect(heroHeading?.props.text).toContain("Public Market");
    expect(heroHeading?.advanced?.entranceAnimation).toBe("fadeInUp");

    const alert = find("alert");
    expect(alert?.props.alertType).toBe("info");
    expect(alert?.props.showDismiss).toBe(true);

    const counter = find("counter");
    expect(counter?.props.end).toBe(40);
    expect(counter?.props.suffix).toBe("+");

    const gallery = find("gallery");
    expect(Array.isArray(gallery?.props.images)).toBe(true);
    expect((gallery?.props.images as unknown[]).length).toBeGreaterThan(0);

    const form = find("form");
    expect(Array.isArray(form?.props.fields)).toBe(true);
    expect(form?.props.buttonText).toContain("Subscribe");

    const maps = find("google-maps");
    expect(String(maps?.props.query)).toContain("Shellmound");

    const textPath = find("text-path");
    expect(textPath?.props.showPath).toBe(true);
    expect(textPath?.props.pathType).toBe("wave");
  });

  it("should serialize responsive styles for layout containers", () => {
    const html = renderToStaticMarkup(<BuilderRenderer document={document} />);

    expect(html).toMatch(/padding-top:\s*96px/);
    expect(html).toMatch(/background-color:\s*#111827/);
    expect(html).toMatch(/font-size:\s*56px/);
  });
});
