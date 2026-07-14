import { pxField } from "./fields";
import { wpAdvancedFields, wpBorderFields } from "./wordpress-block-fields";
import { animationFields } from "./animation-fields";

const maxWidthOptions = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra large", value: "xl" },
  { label: "2XL", value: "2xl" },
  { label: "3XL", value: "3xl" },
  { label: "4XL", value: "4xl" },
  { label: "5XL", value: "5xl" },
  { label: "6XL", value: "6xl" },
  { label: "Full", value: "full" },
] as const;

export const layoutFields = {
  maxWidth: {
    type: "select",
    label: "Max content width",
    options: maxWidthOptions,
  },
  marginTop: pxField("Space above (margin top)"),
  marginBottom: pxField("Space below (margin bottom)"),
  paddingTop: pxField("Inner space top (padding)"),
  paddingBottom: pxField("Inner space bottom (padding)"),
  paddingLeft: pxField("Inner space left (padding)"),
  paddingRight: pxField("Inner space right (padding)"),
  offsetX: pxField("Nudge left / right", { placeholder: "0" }),
  offsetY: pxField("Nudge up / down", { placeholder: "0" }),
  ...animationFields,
  ...wpBorderFields,
  ...wpAdvancedFields,
} as const;
