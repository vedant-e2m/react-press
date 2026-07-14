import { describe, expect, it } from "vitest";
import { elementTextStyleCss } from "./element-styles";

describe("elementTextStyleCss", () => {
  it("uses em-based font sizes so hero typography scales relatively", () => {
    expect(elementTextStyleCss({ fontSize: "xl" }).fontSize).toBe("1.35em");
    expect(elementTextStyleCss({ fontSize: "sm" }).fontSize).toBe("0.85em");
  });

  it("omits fontSize when unset so inherited clamp() sizes apply", () => {
    expect(elementTextStyleCss({}).fontSize).toBeUndefined();
  });
});
