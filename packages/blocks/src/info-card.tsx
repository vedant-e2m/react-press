import { type LayoutProps, layoutStyle, maxWidthClass } from "./layout";
import { renderEditable } from "./editable";
import type { ReactNode } from "react";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type InfoCardProps = {
  label: string | ReactNode;
  lines: string[] | string;
  borderColor?: string;
  textColor?: string;
  labelColor?: string;
  alignment?: "left" | "center";
} & LayoutProps;

/**
 * Bordered info box — hours, address, contact details, stats.
 */
export function InfoCard({
  label,
  lines,
  borderColor = "var(--theme-color-accent)",
  textColor,
  labelColor,
  alignment = "center",
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  offsetX,
  offsetY,
  maxWidth,
  className,
}: InfoCardProps) {
  const items = (Array.isArray(lines) ? lines : lines.split("\n"))
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col justify-center border px-6 py-8",
        alignment === "center" ? "text-center" : "text-left",
        maxWidthClass(maxWidth ?? "sm"),
        className,
      )}
      style={{
        borderColor,
        color: textColor || undefined,
        ...layoutStyle({
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          offsetX,
          offsetY,
        }),
      }}
    >
      <p
        className="text-[11px] font-normal uppercase tracking-[0.22em]"
        style={{ color: labelColor || textColor || undefined }}
      >
        {renderEditable(label)}
      </p>
      <div className="mt-4 space-y-1">
        {items.map((line) => (
          <p key={line} className="font-theme-heading text-[clamp(18px,2.5vw,26px)] leading-snug">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
