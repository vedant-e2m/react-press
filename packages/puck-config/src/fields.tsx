import type { CustomField } from "@puckeditor/core";
import { ColorPaletteField } from "./color-palette-field";
import { COLOR_PRESETS } from "./fields-presets";
import { PxFieldInput } from "./px-field-input";

export { COLOR_PRESETS };

export function colorPaletteField(label: string): CustomField<string | undefined> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => (
      <ColorPaletteField label={label} value={value} onChange={onChange} />
    ),
  };
}

export function colorField(label: string): CustomField<string | undefined> {
  return colorPaletteField(label);
}

export function pxField(
  label: string,
  opts?: { placeholder?: string; min?: number; max?: number; step?: number },
): CustomField<number | undefined> {
  const step = opts?.step ?? 1;
  return {
    type: "custom",
    label,
    render: ({ field, value, onChange }) => (
      <PxFieldInput
        label={field.label ?? label}
        value={value}
        onChange={onChange}
        placeholder={opts?.placeholder ?? "Auto"}
        min={opts?.min}
        max={opts?.max}
        step={step}
      />
    ),
  };
}
