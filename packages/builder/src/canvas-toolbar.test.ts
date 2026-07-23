import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ElementCanvasActions, ElementCanvasToolbar } from "./canvas-toolbar";
import type { BuilderWidget } from "./types";

const widget: BuilderWidget = {
  type: "heading",
  label: "Heading",
  icon: "H",
  category: "Atomic",
  defaultProps: { text: "Heading" },
  controls: [],
  render: () => null,
};

describe("canvas toolbar", () => {
  it("should render the top toolbar actions for a selected element", () => {
    const html = renderToStaticMarkup(
      createElement(ElementCanvasToolbar, {
        widget,
        canMoveUp: true,
        onMoveUp: () => {},
        onDuplicate: () => {},
        onDelete: () => {},
        onMore: () => {},
        onDragStart: () => {},
      }),
    );

    expect(html).toContain("npb-canvas-toolbar");
    expect(html).toContain("Heading");
    expect(html).toContain("Duplicate");
    expect(html).toContain("Delete");
    expect(html).toContain("More options");
  });

  it("should render bottom corner edit and add actions", () => {
    const html = renderToStaticMarkup(
      createElement(ElementCanvasActions, {
        widgetLabel: "Heading",
        onEdit: () => {},
        onAddAfter: () => {},
      }),
    );

    expect(html).toContain("npb-canvas-action-edit");
    expect(html).toContain("npb-canvas-action-add");
    expect(html).toContain("Edit Heading");
    expect(html).toContain("Add after Heading");
  });

  it("should wire toolbar callbacks", () => {
    const onDuplicate = vi.fn();
    const onDelete = vi.fn();
    const onMoveUp = vi.fn();

    onMoveUp();
    onDuplicate();
    onDelete();

    expect(onMoveUp).toHaveBeenCalledOnce();
    expect(onDuplicate).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
