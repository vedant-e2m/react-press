import { describe, expect, it } from "vitest";
import { formatCssLength, parseUnitValue, parseCssLengthPx, splitCssLength } from "./css-units";

describe("css length helpers", () => {
  it("should split px lengths", () => {
    expect(splitCssLength("320px")).toEqual({ amount: "320", unit: "px" });
    expect(splitCssLength(240)).toEqual({ amount: "240", unit: "px" });
  });

  it("should preserve percentage units instead of treating them as px", () => {
    expect(splitCssLength("100%")).toEqual({ amount: "100", unit: "%" });
    expect(formatCssLength("100", "%")).toBe("100%");
    expect(formatCssLength("100", "%")).not.toContain("%px");
  });

  it("should support auto, vh, and rem", () => {
    expect(splitCssLength("auto")).toEqual({ amount: "auto", unit: "auto" });
    expect(splitCssLength("50vh")).toEqual({ amount: "50", unit: "vh" });
    expect(splitCssLength("1.5rem")).toEqual({ amount: "1.5", unit: "rem" });
    expect(formatCssLength("auto", "auto")).toBe("auto");
  });

  it("should expose only the numeric amount for px-only fields", () => {
    expect(parseUnitValue("16px")).toBe("16");
    expect(parseUnitValue("80%")).toBe("80");
    expect(parseUnitValue("")).toBe("");
  });

  it("should parse draggable px values for spacing handles", () => {
    expect(parseCssLengthPx("24px")).toBe(24);
    expect(parseCssLengthPx("")).toBe(0);
    expect(parseCssLengthPx("auto")).toBe(0);
    expect(Number.isNaN(parseCssLengthPx("10%"))).toBe(true);
    expect(Number.isNaN(parseCssLengthPx("2rem"))).toBe(true);
  });
});
