import type { CSSProperties } from "react";

export type ElementFontSize = "sm" | "md" | "lg" | "xl";
export type ElementFontWeight = "light" | "normal" | "medium" | "semibold" | "bold";
export type ElementAlign = "left" | "center" | "right";
export type ElementLetterSpacing = "tight" | "normal" | "wide" | "wider";
export type ElementTextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export type ElementTextStyleProps = {
  color?: string;
  fontSize?: ElementFontSize;
  fontWeight?: ElementFontWeight;
  align?: ElementAlign;
  letterSpacing?: ElementLetterSpacing;
  textTransform?: ElementTextTransform;
};

/** Optional prefixed style props added by elementTextStyleFields in puck-config. */
export type PrefixTextStyleProps<P extends string> = Partial<
  Record<`${P}Color`, string> &
    Record<`${P}FontSize`, ElementFontSize> &
    Record<`${P}FontWeight`, ElementFontWeight> &
    Record<`${P}Align`, ElementAlign> &
    Record<`${P}LetterSpacing`, ElementLetterSpacing> &
    Record<`${P}TextTransform`, ElementTextTransform>
>;

export function cssFromPrefixedProps(
  props: Record<string, unknown>,
  prefix: string,
): CSSProperties {
  return elementTextStyleCss(pickElementTextStyle(props, prefix));
}

/** Relative to the element's inherited size (works with hero clamp() typography). */
const fontSizeMap: Record<ElementFontSize, string> = {
  sm: "0.85em",
  md: "1em",
  lg: "1.15em",
  xl: "1.35em",
};

const fontWeightMap: Record<ElementFontWeight, string | number> = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const letterSpacingMap: Record<ElementLetterSpacing, string> = {
  tight: "-0.02em",
  normal: "0",
  wide: "0.06em",
  wider: "0.12em",
};

export function elementTextStyleCss(style: ElementTextStyleProps): CSSProperties {
  return {
    color: style.color,
    fontSize: style.fontSize ? fontSizeMap[style.fontSize] : undefined,
    fontWeight: style.fontWeight ? fontWeightMap[style.fontWeight] : undefined,
    textAlign: style.align,
    letterSpacing: style.letterSpacing ? letterSpacingMap[style.letterSpacing] : undefined,
    textTransform: style.textTransform && style.textTransform !== "none" ? style.textTransform : undefined,
  };
}

export function pickElementTextStyle(
  props: Record<string, unknown>,
  prefix: string,
): ElementTextStyleProps {
  return {
    color: props[`${prefix}Color`] as string | undefined,
    fontSize: props[`${prefix}FontSize`] as ElementFontSize | undefined,
    fontWeight: props[`${prefix}FontWeight`] as ElementFontWeight | undefined,
    align: props[`${prefix}Align`] as ElementAlign | undefined,
    letterSpacing: props[`${prefix}LetterSpacing`] as ElementLetterSpacing | undefined,
    textTransform: props[`${prefix}TextTransform`] as ElementTextTransform | undefined,
  };
}
