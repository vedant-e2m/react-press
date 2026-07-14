"use client";

import { useEffect, useRef, useState } from "react";
import { COLOR_PRESETS } from "./fields-presets";

type ColorPaletteFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

function BlurCommitHexInput({
  value,
  onChange,
  label,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  label: string;
}) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const isFocusedRef = useRef(false);
  const committedRef = useRef(value);

  useEffect(() => {
    committedRef.current = value;
    if (!isFocusedRef.current) {
      setLocalValue(value ?? "");
    }
  }, [value]);

  const commit = () => {
    const next = localValue.trim() || undefined;
    if (next === committedRef.current) return;
    committedRef.current = next;
    onChange(next);
  };

  return (
    <input
      type="text"
      value={localValue}
      placeholder="Default"
      aria-label={label}
      onChange={(e) => setLocalValue(e.target.value)}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={() => {
        isFocusedRef.current = false;
        commit();
      }}
      className="min-w-0 flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
    />
  );
}

export function ColorPaletteField({ label, value, onChange }: ColorPaletteFieldProps) {
  return (
    <div className="space-y-2" data-testid="color-palette-field" data-color-label={label}>
      <div className="text-sm font-medium text-zinc-800">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {COLOR_PRESETS.map((preset) => {
          const selected = value === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              data-testid="color-preset"
              data-color={preset.value}
              title={preset.label}
              aria-label={preset.label}
              aria-pressed={selected}
              onClick={() => onChange(preset.value)}
              className={[
                "h-7 w-7 rounded-md border-2 transition",
                selected ? "border-zinc-900 ring-2 ring-zinc-300" : "border-zinc-200 hover:border-zinc-400",
              ].join(" ")}
              style={{ backgroundColor: preset.value }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value?.startsWith("#") ? value : "#18181b"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-zinc-300 bg-white p-0.5"
          aria-label={`${label} picker`}
        />
        <BlurCommitHexInput value={value} onChange={onChange} label={label} />
        {value ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="shrink-0 text-xs text-zinc-500 hover:text-zinc-800"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
