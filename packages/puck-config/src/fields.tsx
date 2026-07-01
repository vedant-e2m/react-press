import type { CustomField } from "@puckeditor/core";

export function colorField(label: string): CustomField<string | undefined> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange }) => (
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value?.startsWith("#") ? value : "#18181b"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-zinc-300 bg-white p-0.5"
        />
        <input
          type="text"
          value={value ?? ""}
          placeholder="Default"
          onChange={(e) => onChange(e.target.value || undefined)}
          className="min-w-0 flex-1 rounded-md border border-zinc-300 px-2 py-1 text-sm outline-none focus:border-zinc-400"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="shrink-0 text-xs text-zinc-500 hover:text-zinc-800"
          >
            Clear
          </button>
        )}
      </div>
    ),
  };
}
