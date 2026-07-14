import type { CSSProperties } from "react";

export type ScrollAnimation =
  | "none"
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right";

export type LayoutProps = {
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  offsetX?: number;
  offsetY?: number;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
  className?: string;
  blockId?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  animation?: ScrollAnimation;
  animationDelay?: number;
  animationDuration?: number;
};

export function layoutStyle({
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  offsetX,
  offsetY,
  borderRadius,
  borderWidth,
  borderColor,
}: LayoutProps): CSSProperties {
  const hasOffset = typeof offsetX === "number" || typeof offsetY === "number";
  return {
    marginTop: typeof marginTop === "number" ? `${marginTop}px` : undefined,
    marginBottom: typeof marginBottom === "number" ? `${marginBottom}px` : undefined,
    paddingTop: typeof paddingTop === "number" ? `${paddingTop}px` : undefined,
    paddingBottom: typeof paddingBottom === "number" ? `${paddingBottom}px` : undefined,
    paddingLeft: typeof paddingLeft === "number" ? `${paddingLeft}px` : undefined,
    paddingRight: typeof paddingRight === "number" ? `${paddingRight}px` : undefined,
    transform: hasOffset ? `translate(${offsetX ?? 0}px, ${offsetY ?? 0}px)` : undefined,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : undefined,
    borderWidth: typeof borderWidth === "number" ? `${borderWidth}px` : undefined,
    borderStyle: typeof borderWidth === "number" && borderWidth > 0 ? "solid" : undefined,
    borderColor: borderColor || undefined,
  };
}

export function maxWidthClass(maxWidth: LayoutProps["maxWidth"]) {
  if (!maxWidth || maxWidth === "full") return "max-w-none";
  const map: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
  };
  return map[maxWidth] ?? "max-w-6xl";
}
