/** Supported CSS length units in builder size/spacing fields. */
export const CSS_LENGTH_UNITS = ["px", "%", "rem", "em", "vh", "vw", "auto"] as const;

export type CssLengthUnit = (typeof CSS_LENGTH_UNITS)[number];

/**
 * Splits a CSS length into numeric amount and unit.
 * Preserves `%` / `rem` / etc. so editing never corrupts values into `100%px`.
 */
export function splitCssLength(raw: unknown): { amount: string; unit: CssLengthUnit } {
  if (raw === undefined || raw === null || raw === "") {
    return { amount: "", unit: "px" };
  }

  const value = String(raw).trim();
  if (value === "auto") {
    return { amount: "auto", unit: "auto" };
  }

  const match = value.match(/^(-?\d*\.?\d+)\s*(px|%|rem|em|vh|vw|svh|lvh|dvh)?$/i);
  if (!match) {
    return { amount: value.replace(/px$/i, ""), unit: "px" };
  }

  const unit = (match[2] ?? "px").toLowerCase();
  const normalized = unit === "svh" || unit === "lvh" || unit === "dvh" ? "vh" : unit;
  return {
    amount: match[1],
    unit: (CSS_LENGTH_UNITS.includes(normalized as CssLengthUnit) ? normalized : "px") as CssLengthUnit,
  };
}

/** Returns only the numeric portion of a CSS length (for px-only inputs). */
export function parseUnitValue(raw: unknown): string {
  const { amount, unit } = splitCssLength(raw);
  return unit === "auto" ? "auto" : amount;
}

/** Builds a CSS length string from an amount + unit. */
export function formatCssLength(amount: string, unit: CssLengthUnit): string {
  if (amount === "") {
    return "";
  }
  if (unit === "auto" || amount === "auto") {
    return "auto";
  }
  return `${amount}${unit}`;
}

/**
 * Parses a CSS length as pixels for canvas drag math.
 * Returns 0 for empty values; NaN when the unit is not draggable (%, rem, auto, etc.).
 */
export function parseCssLengthPx(raw: unknown): number {
  const { amount, unit } = splitCssLength(raw);
  if (amount === "" || amount === "auto" || unit === "auto") {
    return 0;
  }
  if (unit !== "px") {
    return Number.NaN;
  }
  const parsed = Number.parseFloat(amount);
  return Number.isFinite(parsed) ? parsed : 0;
}
