import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { BuilderElement } from "./types";
import { BuilderRenderer } from "./renderer";
import { builderWidgets, getBuilderWidget } from "./widgets";
import { createShowcaseDocument, getShowcaseWidgetTypes } from "./showcase-document";

function walkElements(elements: BuilderElement[], visit: (element: BuilderElement) => void): void {
  for (const element of elements) {
    visit(element);
    walkElements(element.children ?? [], visit);
  }
}

function findElement(elements: BuilderElement[], type: string): BuilderElement | undefined {
  let found: BuilderElement | undefined;
  walkElements(elements, (element) => {
    if (!found && element.type === type) {
      found = element;
    }
  });
  return found;
}

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
    expect(html).toContain("npb-video");
    expect(html).toContain("<video");
  });

  it("should render every registered widget with default props without throwing", () => {
    for (const widget of builderWidgets) {
      const element: BuilderElement = {
        id: `default-${widget.type}`,
        type: widget.type,
        props: structuredClone(widget.defaultProps),
      };

      expect(
        () => renderToStaticMarkup(widget.render({ element, children: null })),
        `failed to render ${widget.type} with defaults`,
      ).not.toThrow();
    }
  });

  it("should not emit empty media src attributes for default video and svg widgets", () => {
    for (const type of ["video", "svg"] as const) {
      const widget = getBuilderWidget(type)!;
      const element: BuilderElement = {
        id: `empty-${type}`,
        type,
        props: structuredClone(widget.defaultProps),
      };
      const html = renderToStaticMarkup(widget.render({ element, children: null }));

      expect(html, `${type} should show a placeholder`).toContain("npb-placeholder");
      expect(html, `${type} must not render src=""`).not.toMatch(/\ssrc=""/);
    }
  });

  it("should render the showcase video widget with all configured settings", () => {
    const video = findElement(document.content, "video");
    expect(video).toBeDefined();

    const widget = getBuilderWidget("video")!;
    const html = renderToStaticMarkup(widget.render({ element: video!, children: null }));

    expect(video?.props.src).toContain(".mp4");
    expect(video?.props.posterEnabled).toBe(true);
    expect(video?.props.preload).toBe("auto");
    expect(video?.props.download).toBe(false);
    expect(html).toContain("flower.mp4#t=0,5");
    expect(html).toContain("controlsList=\"nodownload\"");
    expect(html).toContain("preload=\"auto\"");
    expect(html).toContain("poster=");
    expect(html).toContain("loop=\"\"");
    expect(html).toContain("muted=\"\"");
    expect(html).toContain("padding-bottom:56.25%");
  });

  it("should render every showcase element without throwing", () => {
    const failures: string[] = [];

    walkElements(document.content, (element) => {
      const widget = getBuilderWidget(element.type);
      if (!widget) {
        failures.push(`missing widget: ${element.type}`);
        return;
      }

      try {
        renderToStaticMarkup(widget.render({ element, children: null }));
      } catch (error) {
        failures.push(`${element.type} (${element.id}): ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    expect(failures).toEqual([]);
  });

  it("should apply page settings and custom CSS", () => {
    expect(document.settings.title).toContain("Component Showcase");
    expect(document.settings.contentWidth).toBe(1200);
    expect(document.settings.customCss).toContain(".npb-page");
    expect(document.globals.colors.primary).toBe("#6d5dfc");
    expect(document.globals.classes).toHaveLength(1);
  });

  it("should configure representative widget settings", () => {
    const find = (type: string) => findElement(document.content, type);

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

    const youtube = find("youtube");
    expect(youtube?.props.privacyMode).toBe(true);
    expect(youtube?.props.captions).toBe(true);
    expect(youtube?.props.rel).toBe(false);

    const wpVideo = find("wp-video");
    expect(wpVideo?.props.src).toContain(".mp4");
    expect(wpVideo?.props.loop).toBe(true);
  });

  it("should serialize responsive styles for layout containers", () => {
    const html = renderToStaticMarkup(<BuilderRenderer document={document} />);

    expect(html).toMatch(/padding-top:\s*96px/);
    expect(html).toMatch(/background-color:\s*#111827/);
    expect(html).toMatch(/font-size:\s*56px/);
  });
});
