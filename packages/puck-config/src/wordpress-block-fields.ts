import { colorPaletteField } from "./fields";
import { pxField } from "./fields";

/** WordPress block editor–style border settings (Dimensions → Border). */
export const wpBorderFields = {
  borderRadius: pxField("Border radius"),
  borderWidth: pxField("Border width"),
  borderColor: colorPaletteField("Border color"),
} as const;

/** WordPress Advanced panel settings. */
export const wpAdvancedFields = {
  blockId: { type: "text" as const, label: "HTML anchor (ID)" },
  className: { type: "text" as const, label: "Additional CSS class" },
};

/** WordPress Colors panel — block-level (not per-element). */
export const wpBlockColorFields = {
  backgroundColor: colorPaletteField("Background"),
  textColor: colorPaletteField("Text"),
} as const;

/** WordPress Cover/Hero media settings. */
export const wpCoverFields = {
  overlayOpacity: {
    type: "number" as const,
    label: "Overlay opacity (%)",
    min: 0,
    max: 100,
  },
  minHeight: {
    type: "radio" as const,
    label: "Minimum height",
    options: [
      { label: "Small", value: "sm" },
      { label: "Medium", value: "md" },
      { label: "Large", value: "lg" },
      { label: "Full screen", value: "screen" },
    ],
  },
} as const;

/** WordPress Image block settings. */
export const wpImageFields = {
  objectFit: {
    type: "radio" as const,
    label: "Image fit",
    options: [
      { label: "Cover", value: "cover" },
      { label: "Contain", value: "contain" },
      { label: "Fill", value: "fill" },
    ],
  },
  rounded: {
    type: "radio" as const,
    label: "Rounded corners",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
} as const;

/** WordPress Button block settings. */
export const wpButtonFields = {
  variant: {
    type: "radio" as const,
    label: "Style",
    options: [
      { label: "Fill", value: "primary" },
      { label: "Outline", value: "outline" },
      { label: "Plain", value: "secondary" },
    ],
  },
  width: {
    type: "radio" as const,
    label: "Width",
    options: [
      { label: "Auto", value: "auto" },
      { label: "Full width", value: "full" },
    ],
  },
} as const;
