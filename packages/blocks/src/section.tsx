import type { ReactNode } from "react";
import { type LayoutProps, layoutStyle, maxWidthClass } from "./layout";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function renderSlot(slot: ReactNode | (() => ReactNode) | undefined) {
  if (!slot) return null;
  if (typeof slot === "function") return slot();
  return slot;
}

const paddingYMap = {
  none: "py-0",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-24",
} as const;

export type SectionProps = {
  backgroundColor?: string;
  backgroundImage?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  paddingY?: keyof typeof paddingYMap;
  content?: ReactNode | (() => ReactNode);
} & LayoutProps;

/**
 * Layout wrapper with optional background image/color, overlay, and a slot for nested blocks.
 */
export function Section({
  backgroundColor,
  backgroundImage,
  overlayColor = "rgba(0,0,0,0.45)",
  overlayOpacity = 0,
  paddingY = "lg",
  content,
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
  blockId,
}: SectionProps) {
  const overlayAlpha = Math.min(90, Math.max(0, overlayOpacity)) / 100;
  const hasOverlay = backgroundImage && overlayAlpha > 0;

  return (
    <section
      id={blockId || undefined}
      className={cn("relative", paddingYMap[paddingY], className)}
      style={{
        backgroundColor: backgroundColor || undefined,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? "cover" : undefined,
        backgroundPosition: backgroundImage ? "center" : undefined,
        backgroundAttachment: backgroundImage ? "fixed" : undefined,
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
      {hasOverlay ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayAlpha }}
          aria-hidden
        />
      ) : null}
      <div className={cn("relative z-10 mx-auto px-6", maxWidthClass(maxWidth ?? "full"))}>
        {renderSlot(content)}
      </div>
    </section>
  );
}
