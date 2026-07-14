import { colorPaletteField } from "./fields";

/**
 * Per-element text style fields. Color label is scoped to the element name so
 * sidebar sections don't show duplicate generic "Text color" palettes.
 */
export function elementTextStyleFields(name: string) {
  const colorLabel =
    name === "title"
      ? "Title color"
      : name === "description"
        ? "Description color"
        : name === "subtitle"
          ? "Subtitle color"
          : name === "highlight" || name === "titleHighlight"
            ? "Highlight color"
            : "Text color";

  return {
    [`${name}Color`]: colorPaletteField(colorLabel),
    [`${name}FontSize`]: {
      type: "radio" as const,
      label: "Font size (relative)",
      options: [
        { label: "Smaller", value: "sm" },
        { label: "Default", value: "md" },
        { label: "Larger", value: "lg" },
        { label: "Much larger", value: "xl" },
      ],
    },
    [`${name}FontWeight`]: {
      type: "radio" as const,
      label: "Font weight",
      options: [
        { label: "Light", value: "light" },
        { label: "Normal", value: "normal" },
        { label: "Medium", value: "medium" },
        { label: "Semibold", value: "semibold" },
        { label: "Bold", value: "bold" },
      ],
    },
    [`${name}Align`]: {
      type: "radio" as const,
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    [`${name}LetterSpacing`]: {
      type: "radio" as const,
      label: "Letter spacing",
      options: [
        { label: "Tight", value: "tight" },
        { label: "Normal", value: "normal" },
        { label: "Wide", value: "wide" },
        { label: "Wider", value: "wider" },
      ],
    },
    [`${name}TextTransform`]: {
      type: "radio" as const,
      label: "Text transform",
      options: [
        { label: "None", value: "none" },
        { label: "Uppercase", value: "uppercase" },
        { label: "Lowercase", value: "lowercase" },
        { label: "Capitalize", value: "capitalize" },
      ],
    },
  };
}

export function elementButtonStyleFields() {
  return {
    buttonColor: colorPaletteField("Button background"),
    buttonTextColor: colorPaletteField("Button text color"),
  };
}

export function elementCtaStyleFields(prefix: "primary" | "secondary") {
  return {
    [`${prefix}ButtonColor`]: colorPaletteField("Button background"),
    [`${prefix}ButtonTextColor`]: colorPaletteField("Button text color"),
  };
}
