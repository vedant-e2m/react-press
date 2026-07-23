import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  applySpacingDelta,
  computeSpacingFromDrag,
  dragDeltaForSide,
  MARGIN_PROPERTIES,
  PADDING_PROPERTIES,
  resolveEditorStyles,
  SpacingDragOverlay,
  spacingProperty,
} from "./spacing-overlay";
import type { BuilderElement } from "./types";

const sampleElement: BuilderElement = {
  id: "el-1",
  type: "container",
  props: {},
  styles: {
    desktop: {
      normal: {
        marginTop: "20px",
        marginRight: "8px",
        paddingTop: "12px",
        paddingLeft: "16px",
      },
      hover: {
        marginTop: "30px",
      },
    },
    tablet: {
      normal: {
        marginTop: "16px",
      },
    },
  },
};

describe("spacing overlay helpers", () => {
  it("should clamp spacing deltas to zero", () => {
    expect(applySpacingDelta(10, 5)).toBe(15);
    expect(applySpacingDelta(10, -20)).toBe(0);
  });

  it("should resolve editor styles for breakpoint and state", () => {
    expect(resolveEditorStyles(sampleElement, "desktop", "normal")).toMatchObject({
      marginTop: "20px",
      paddingLeft: "16px",
    });
    expect(resolveEditorStyles(sampleElement, "tablet", "normal")).toMatchObject({
      marginTop: "16px",
      paddingLeft: "16px",
    });
    expect(resolveEditorStyles(sampleElement, "desktop", "hover")).toMatchObject({
      marginTop: "30px",
    });
  });

  it("should map margin and padding sides to CSS properties", () => {
    expect(MARGIN_PROPERTIES.top).toBe("marginTop");
    expect(PADDING_PROPERTIES.right).toBe("paddingRight");
    expect(spacingProperty("margin", "bottom")).toBe("marginBottom");
    expect(spacingProperty("padding", "left")).toBe("paddingLeft");
  });

  it("should map pointer deltas to spacing changes per side", () => {
    expect(dragDeltaForSide("margin", "top", 0, -12)).toBe(12);
    expect(dragDeltaForSide("margin", "bottom", 0, 12)).toBe(12);
    expect(dragDeltaForSide("margin", "left", -8, 0)).toBe(8);
    expect(dragDeltaForSide("margin", "right", 8, 0)).toBe(8);
    expect(dragDeltaForSide("padding", "top", 0, 10)).toBe(10);
    expect(dragDeltaForSide("padding", "bottom", 0, -6)).toBe(6);
  });

  it("should compute spacing updates from drag gestures", () => {
    const result = computeSpacingFromDrag(
      { kind: "margin", side: "right", startX: 200, startY: 120, startValue: 8 },
      230,
      120,
    );
    expect(result).toEqual({
      property: "marginRight",
      value: 38,
      formatted: "38px",
    });
  });

  it("should not allow negative spacing values", () => {
    const result = computeSpacingFromDrag(
      { kind: "padding", side: "left", startX: 50, startY: 50, startValue: 10 },
      10,
      50,
    );
    expect(result.value).toBe(0);
    expect(result.formatted).toBe("0px");
  });
});

describe("SpacingDragOverlay", () => {
  it("should render margin and padding handles with value labels", () => {
    const html = renderToStaticMarkup(
      createElement(SpacingDragOverlay, {
        element: sampleElement,
        breakpoint: "desktop",
        styleState: "normal",
        onBeginDrag: () => {},
        onSpacingChange: () => {},
        onEndDrag: () => {},
      }),
    );

    expect(html).toContain('class="npb-spacing-overlay"');
    expect(html).toContain('class="npb-spacing-margin-layer"');
    expect(html).toContain('class="npb-spacing-padding-layer"');
    expect(html).toContain('class="npb-spacing-legend"');
    expect(html).toContain("Margin");
    expect(html).toContain("Padding");
    expect(html).toContain("MT 20");
    expect(html).toContain("MR 8");
    expect(html).toContain("PT 12");
    expect(html).toContain("PL 16");
    expect(html.match(/npb-spacing-handle-margin/g)?.length).toBe(4);
    expect(html.match(/npb-spacing-handle-padding/g)?.length).toBe(4);
  });

  it("should wire spacing change callbacks through drag math", () => {
    const onBeginDrag = vi.fn();
    const onSpacingChange = vi.fn();
    const onEndDrag = vi.fn();

    const drag = computeSpacingFromDrag(
      { kind: "margin", side: "right", startX: 200, startY: 120, startValue: 8 },
      230,
      120,
    );

    onBeginDrag();
    onSpacingChange({ [drag.property]: drag.formatted });
    onEndDrag();

    expect(onBeginDrag).toHaveBeenCalledOnce();
    expect(onSpacingChange).toHaveBeenCalledWith({ marginRight: "38px" });
    expect(onEndDrag).toHaveBeenCalledOnce();
  });
});
