"use client";

import { useEffect, useRef, useState } from "react";

type PxFieldInputProps = {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
};

function parsePx(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-") return undefined;
  const next = Number(trimmed);
  return Number.isFinite(next) ? next : undefined;
}

/**
 * Numeric px input that commits on every valid change so spacing updates live.
 */
export function PxFieldInput({
  label,
  value,
  onChange,
  placeholder = "Auto",
  min,
  max,
  step = 1,
}: PxFieldInputProps) {
  const [localValue, setLocalValue] = useState(value?.toString() ?? "");
  const isFocusedRef = useRef(false);
  const committedRef = useRef(value);

  useEffect(() => {
    committedRef.current = value;
    if (!isFocusedRef.current) {
      setLocalValue(value?.toString() ?? "");
    }
  }, [value]);

  const commit = (raw: string) => {
    const normalized = parsePx(raw);
    if (normalized === committedRef.current) return;
    committedRef.current = normalized;
    onChange(normalized);
  };

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-zinc-800">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          aria-label={label}
          value={localValue}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const next = e.target.value;
            setLocalValue(next);
            commit(next);
          }}
          onFocus={() => {
            isFocusedRef.current = true;
          }}
          onBlur={() => {
            isFocusedRef.current = false;
            commit(localValue);
            if (!isFocusedRef.current) {
              setLocalValue(committedRef.current?.toString() ?? "");
            }
          }}
          className="min-w-0 flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
        />
        <span className="shrink-0 text-xs text-zinc-500">px</span>
        {value !== undefined ? (
          <button
            type="button"
            onClick={() => {
              setLocalValue("");
              committedRef.current = undefined;
              onChange(undefined);
            }}
            className="shrink-0 text-xs text-zinc-500 hover:text-zinc-800"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
