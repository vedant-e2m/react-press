import { describe, expect, it } from "vitest";
import { builderWidgets, getBuilderWidget } from "./widgets";

describe("builder widget registry", () => {
  it("should load the widget module without reference errors", async () => {
    await expect(import("./widgets")).resolves.toBeDefined();
  });

  it("should register every free core widget type once", () => {
    const types = builderWidgets.map((widget) => widget.type);

    expect(new Set(types).size).toBe(types.length);
    expect(types).toEqual(
      expect.arrayContaining([
        "div-block",
        "flexbox",
        "grid",
        "container",
        "heading",
        "paragraph",
        "text-editor",
        "image",
        "button",
        "video",
        "divider",
        "spacer",
        "google-maps",
        "icon",
        "image-box",
        "icon-box",
        "gallery",
        "carousel",
        "icon-list",
        "counter",
        "progress",
        "testimonial",
        "tabs",
        "accordion",
        "toggle",
        "social-icons",
        "alert",
        "audio",
        "rating",
        "html",
        "menu-anchor",
        "read-more",
        "shortcode",
        "wordpress",
        "form",
        "svg",
        "youtube",
        "search",
        "sidebar",
        "text-path",
        "minimalist",
      ]),
    );
  });

  it("should provide defaults and content controls for every widget", () => {
    for (const widget of builderWidgets) {
      expect(widget.defaultProps).toBeTypeOf("object");
      expect(widget.controls.length).toBeGreaterThan(0);
      expect(widget.controls[0]?.controls.length).toBeGreaterThan(0);
      expect(getBuilderWidget(widget.type)).toBe(widget);
    }
  });
});
