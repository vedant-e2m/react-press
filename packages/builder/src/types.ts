import type { CSSProperties, ReactNode } from "react";

export type BuilderBreakpoint = "desktop" | "tablet" | "mobile";
export type BuilderStyleState = "normal" | "hover" | "active" | "focus";
export type BuilderControlTab = "content" | "style" | "advanced" | "general" | "interactions";

export type ResponsiveStyles = Partial<
  Record<BuilderBreakpoint, Partial<Record<BuilderStyleState, CSSProperties>>>
>;

export type EntranceAnimation =
  | "none"
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "zoomIn"
  | "bounceIn";

export interface BuilderElementAdvanced {
  cssId?: string;
  cssClasses?: string;
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
  entranceAnimation?: EntranceAnimation;
  animationDuration?: "slow" | "normal" | "fast";
  animationDelay?: number;
}

export interface BuilderElement {
  id: string;
  type: string;
  props: Record<string, unknown>;
  styles?: ResponsiveStyles;
  classes?: string[];
  advanced?: BuilderElementAdvanced;
  children?: BuilderElement[];
}

export interface BuilderGlobalClass {
  id: string;
  name: string;
  styles: ResponsiveStyles;
}

export interface BuilderDocument {
  editor: "nextpress";
  version: 1;
  content: BuilderElement[];
  settings: {
    title?: string;
    backgroundColor?: string;
    textColor?: string;
    contentWidth?: number;
    customCss?: string;
  };
  globals: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    variables: Record<string, string>;
    classes: BuilderGlobalClass[];
  };
}

export type BuilderControlType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "range"
  | "select"
  | "choices"
  | "switch"
  | "color"
  | "url"
  | "image"
  | "icon"
  | "repeater";

export interface BuilderControl {
  key: string;
  label: string;
  type: BuilderControlType;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: string; icon?: string }>;
  min?: number;
  max?: number;
  step?: number;
  responsive?: boolean;
}

export interface BuilderControlSection {
  label: string;
  tab?: BuilderControlTab;
  controls: BuilderControl[];
}

export interface BuilderHostProps {
  id?: string;
  "data-npb-id": string;
  className?: string;
  style?: CSSProperties;
}

export interface BuilderWidgetRenderProps {
  element: BuilderElement;
  children?: ReactNode;
  /** When set, the widget root should spread these so styles target the real layout element. */
  hostProps?: BuilderHostProps;
}

export interface BuilderWidget {
  type: string;
  label: string;
  category: "Atomic" | "Layout" | "Basic" | "General" | "Media" | "Interactive" | "WordPress" | "Link In Bio";
  icon: string;
  defaultProps: Record<string, unknown>;
  controls: BuilderControlSection[];
  acceptsChildren?: boolean;
  /**
   * When true, the public renderer does not wrap the widget in an extra div.
   * The widget must apply `hostProps` to its layout root so size/flex/background work.
   */
  rendersAsHost?: boolean;
  render(props: BuilderWidgetRenderProps): ReactNode;
}
