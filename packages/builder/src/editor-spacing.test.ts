import { describe, expect, it } from "vitest";
import { EMPTY_BUILDER_DOCUMENT, updateBuilderElement } from "./document";
import type { BuilderElement } from "./types";

const sampleElement: BuilderElement = {
  id: "el-1",
  type: "container",
  props: {},
  styles: {
    desktop: {
      normal: {
        marginTop: "20px",
      },
    },
  },
};

/** Mirrors the editor's live spacing update path for integration coverage. */
function applySpacingUpdatesToDocument(
  document: typeof EMPTY_BUILDER_DOCUMENT,
  elementId: string,
  updates: Record<string, string>,
  breakpoint: "desktop" | "tablet" | "mobile" = "desktop",
  styleState: "normal" | "hover" | "active" | "focus" = "normal",
) {
  return updateBuilderElement(document, elementId, (element) => {
    const breakpointStyles = element.styles?.[breakpoint] ?? {};
    const stateStyles = { ...(breakpointStyles[styleState] ?? {}) } as Record<string, unknown>;
    for (const [property, value] of Object.entries(updates)) {
      if (value === "") {
        delete stateStyles[property];
      } else {
        stateStyles[property] = value;
      }
    }
    return {
      ...element,
      styles: {
        ...element.styles,
        [breakpoint]: {
          ...breakpointStyles,
          [styleState]: stateStyles,
        },
      },
    };
  });
}

describe("editor spacing integration", () => {
  it("should persist dragged spacing values into the builder document", () => {
    const document = {
      ...EMPTY_BUILDER_DOCUMENT,
      content: [sampleElement],
    };

    const updated = applySpacingUpdatesToDocument(document, "el-1", {
      marginTop: "36px",
      paddingLeft: "12px",
    });

    expect(updated.content[0]?.styles?.desktop?.normal).toMatchObject({
      marginTop: "36px",
      paddingLeft: "12px",
    });
  });

  it("should scope spacing updates to the active breakpoint and style state", () => {
    const document = {
      ...EMPTY_BUILDER_DOCUMENT,
      content: [sampleElement],
    };

    const updated = applySpacingUpdatesToDocument(
      document,
      "el-1",
      { marginTop: "12px" },
      "tablet",
      "hover",
    );

    expect(updated.content[0]?.styles?.tablet?.hover).toMatchObject({
      marginTop: "12px",
    });
    expect(updated.content[0]?.styles?.desktop?.normal).toMatchObject({
      marginTop: "20px",
    });
  });
});
