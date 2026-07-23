"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { formatCssLength, parseCssLengthPx } from "./css-units";
import type { BuilderBreakpoint, BuilderElement, BuilderStyleState } from "./types";

export type SpacingSide = "top" | "right" | "bottom" | "left";
export type SpacingKind = "margin" | "padding";

export const MARGIN_PROPERTIES = {
  top: "marginTop",
  right: "marginRight",
  bottom: "marginBottom",
  left: "marginLeft",
} as const satisfies Record<SpacingSide, keyof CSSProperties>;

export const PADDING_PROPERTIES = {
  top: "paddingTop",
  right: "paddingRight",
  bottom: "paddingBottom",
  left: "paddingLeft",
} as const satisfies Record<SpacingSide, keyof CSSProperties>;

export type SpacingProperty =
  | (typeof MARGIN_PROPERTIES)[SpacingSide]
  | (typeof PADDING_PROPERTIES)[SpacingSide];

export type SpacingUpdates = Partial<Record<SpacingProperty, string>>;

const SPACING_SIDES: SpacingSide[] = ["top", "right", "bottom", "left"];

/** Applies a drag delta to a pixel spacing value, clamped to 0. */
export function applySpacingDelta(currentPx: number, delta: number): number {
  return Math.max(0, Math.round(currentPx + delta));
}

/** Resolves merged styles for the active breakpoint (editor canvas preview). */
export function resolveEditorStyles(
  element: BuilderElement,
  breakpoint: BuilderBreakpoint,
  styleState: BuilderStyleState,
): CSSProperties {
  return {
    ...(element.styles?.desktop?.[styleState] ?? {}),
    ...(breakpoint !== "desktop" ? element.styles?.[breakpoint]?.[styleState] ?? {} : {}),
  };
}

export function spacingProperty(kind: SpacingKind, side: SpacingSide): SpacingProperty {
  return kind === "margin" ? MARGIN_PROPERTIES[side] : PADDING_PROPERTIES[side];
}

/** Maps pointer movement to a spacing delta for the given side. */
export function dragDeltaForSide(
  kind: SpacingKind,
  side: SpacingSide,
  deltaX: number,
  deltaY: number,
): number {
  if (kind === "margin") {
    switch (side) {
      case "top":
        return -deltaY;
      case "bottom":
        return deltaY;
      case "left":
        return -deltaX;
      case "right":
        return deltaX;
    }
  }

  switch (side) {
    case "top":
      return deltaY;
    case "bottom":
      return -deltaY;
    case "left":
      return deltaX;
    case "right":
      return -deltaX;
  }
}

/** Computes the next spacing value from an in-progress drag gesture. */
export function computeSpacingFromDrag(
  drag: {
    kind: SpacingKind;
    side: SpacingSide;
    startX: number;
    startY: number;
    startValue: number;
  },
  clientX: number,
  clientY: number,
): { property: SpacingProperty; value: number; formatted: string } {
  const delta = dragDeltaForSide(drag.kind, drag.side, clientX - drag.startX, clientY - drag.startY);
  const value = applySpacingDelta(drag.startValue, delta);
  const property = spacingProperty(drag.kind, drag.side);
  return {
    property,
    value,
    formatted: formatCssLength(String(value), "px"),
  };
}

function zoneSize(value: number, min = 12): number {
  return Number.isFinite(value) ? Math.max(value, min) : min;
}

function formatHandleLabel(kind: SpacingKind, side: SpacingSide, value: number): string {
  const prefix = kind === "margin" ? "M" : "P";
  const sideLabel = side[0].toUpperCase();
  return `${prefix}${sideLabel} ${value}`;
}

interface SpacingDragOverlayProps {
  element: BuilderElement;
  breakpoint: BuilderBreakpoint;
  styleState: BuilderStyleState;
  onBeginDrag(): void;
  onSpacingChange(updates: SpacingUpdates): void;
  onEndDrag(): void;
}

/**
 * Canvas overlay for dragging margin and padding handles on a selected element.
 * Margin handles sit outside the selection box; padding handles sit inside it.
 */
export function SpacingDragOverlay({
  element,
  breakpoint,
  styleState,
  onBeginDrag,
  onSpacingChange,
  onEndDrag,
}: SpacingDragOverlayProps) {
  const styles = resolveEditorStyles(element, breakpoint, styleState);
  const dragRef = useRef<{
    kind: SpacingKind;
    side: SpacingSide;
    startX: number;
    startY: number;
    startValue: number;
  } | null>(null);
  const [activeDrag, setActiveDrag] = useState<{
    kind: SpacingKind;
    side: SpacingSide;
    value: number;
  } | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<{
    kind: SpacingKind;
    side: SpacingSide;
  } | null>(null);

  const readSpacingPx = useCallback(
    (kind: SpacingKind, side: SpacingSide) => {
      const property = spacingProperty(kind, side);
      return parseCssLengthPx(styles[property]);
    },
    [styles],
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setActiveDrag(null);
    onEndDrag();
  }, [onEndDrag]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const next = computeSpacingFromDrag(drag, event.clientX, event.clientY);
      setActiveDrag({ kind: drag.kind, side: drag.side, value: next.value });
      onSpacingChange({ [next.property]: next.formatted });
    },
    [onSpacingChange],
  );

  const handlePointerUp = useCallback(() => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
    endDrag();
  }, [endDrag, handlePointerMove]);

  const startDrag = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, kind: SpacingKind, side: SpacingSide) => {
      event.preventDefault();
      event.stopPropagation();

      const startValue = readSpacingPx(kind, side);
      if (!Number.isFinite(startValue)) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      onBeginDrag();
      dragRef.current = {
        kind,
        side,
        startX: event.clientX,
        startY: event.clientY,
        startValue,
      };
      setActiveDrag({ kind, side, value: startValue });

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    [handlePointerMove, handlePointerUp, onBeginDrag, readSpacingPx],
  );

  const margin = {
    top: readSpacingPx("margin", "top"),
    right: readSpacingPx("margin", "right"),
    bottom: readSpacingPx("margin", "bottom"),
    left: readSpacingPx("margin", "left"),
  };
  const padding = {
    top: readSpacingPx("padding", "top"),
    right: readSpacingPx("padding", "right"),
    bottom: readSpacingPx("padding", "bottom"),
    left: readSpacingPx("padding", "left"),
  };

  const isBandActive = (kind: SpacingKind, side: SpacingSide) =>
    activeDrag?.kind === kind && activeDrag.side === side;
  const isBandHovered = (kind: SpacingKind, side: SpacingSide) =>
    hoveredHandle?.kind === kind && hoveredHandle.side === side;

  const shouldShowBandFill = (kind: SpacingKind, side: SpacingSide, value: number) =>
    value > 0 || isBandActive(kind, side) || isBandHovered(kind, side);

  const shouldShowLabel = (kind: SpacingKind, side: SpacingSide, value: number) =>
    isBandActive(kind, side) || isBandHovered(kind, side) || value > 0;

  const renderHandle = (kind: SpacingKind, side: SpacingSide) => {
    const value = kind === "margin" ? margin[side] : padding[side];
    const draggable = Number.isFinite(value);
    const active = isBandActive(kind, side);
    const hovered = isBandHovered(kind, side);

    return (
      <button
        type="button"
        className={[
          "npb-spacing-handle",
          `npb-spacing-handle-${kind}`,
          `npb-spacing-handle-${side}`,
          active ? "active" : "",
          hovered ? "hovered" : "",
          draggable ? "" : "disabled",
        ].filter(Boolean).join(" ")}
        aria-label={`Drag to adjust ${kind} ${side}`}
        disabled={!draggable}
        onPointerDown={(event) => startDrag(event, kind, side)}
        onPointerEnter={() => setHoveredHandle({ kind, side })}
        onPointerLeave={() => setHoveredHandle((current) =>
          current?.kind === kind && current.side === side ? null : current,
        )}
        onClick={(event) => event.stopPropagation()}
      />
    );
  };

  const renderMarginBand = (side: SpacingSide) => {
    const value = margin[side];
    const active = isBandActive("margin", side);
    const hovered = isBandHovered("margin", side);
    const showFill = shouldShowBandFill("margin", side, value);
    const showLabel = shouldShowLabel("margin", side, value);
    const displayValue = active ? activeDrag?.value ?? value : value;

    const bandStyle: CSSProperties = {};
    if (side === "top") bandStyle.height = zoneSize(value);
    if (side === "bottom") bandStyle.height = zoneSize(value);
    if (side === "left") bandStyle.width = zoneSize(value);
    if (side === "right") bandStyle.width = zoneSize(value);

    return (
      <div
        key={`margin-${side}`}
        className={[
          "npb-spacing-band",
          "npb-spacing-band-margin",
          `npb-spacing-band-${side}`,
          showFill ? "" : "npb-spacing-band-empty",
          active ? "active" : "",
          hovered ? "hovered" : "",
        ].filter(Boolean).join(" ")}
        style={bandStyle}
      >
        {showLabel ? (
          <span className="npb-spacing-band-label npb-spacing-band-label-margin">
            {formatHandleLabel("margin", side, displayValue)}
          </span>
        ) : null}
        {renderHandle("margin", side)}
      </div>
    );
  };

  const renderPaddingBand = (side: SpacingSide) => {
    const value = padding[side];
    const active = isBandActive("padding", side);
    const hovered = isBandHovered("padding", side);
    const showFill = shouldShowBandFill("padding", side, value);
    const showLabel = shouldShowLabel("padding", side, value);
    const displayValue = active ? activeDrag?.value ?? value : value;

    const bandStyle: CSSProperties = {};
    if (side === "top") bandStyle.height = zoneSize(value, 8);
    if (side === "bottom") bandStyle.height = zoneSize(value, 8);
    if (side === "left") bandStyle.width = zoneSize(value, 8);
    if (side === "right") bandStyle.width = zoneSize(value, 8);

    return (
      <div
        key={`padding-${side}`}
        className={[
          "npb-spacing-band",
          "npb-spacing-band-padding",
          `npb-spacing-band-${side}`,
          showFill ? "" : "npb-spacing-band-empty",
          active ? "active" : "",
          hovered ? "hovered" : "",
        ].filter(Boolean).join(" ")}
        style={bandStyle}
      >
        {showLabel ? (
          <span className="npb-spacing-band-label npb-spacing-band-label-padding">
            {formatHandleLabel("padding", side, displayValue)}
          </span>
        ) : null}
        {renderHandle("padding", side)}
      </div>
    );
  };

  const tooltip = activeDrag
    ? `${activeDrag.kind} ${activeDrag.side}: ${activeDrag.value}px`
    : null;

  return (
    <div
      className={`npb-spacing-overlay${activeDrag ? " is-dragging" : ""}`}
      aria-hidden="true"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="npb-spacing-legend">
        <span className="npb-spacing-legend-item margin">Margin (outside)</span>
        <span className="npb-spacing-legend-item padding">Padding (inside)</span>
      </div>

      <div className="npb-spacing-margin-layer">
        {SPACING_SIDES.map((side) => renderMarginBand(side))}
      </div>

      <div className="npb-spacing-padding-layer">
        {SPACING_SIDES.map((side) => renderPaddingBand(side))}
      </div>

      {tooltip ? (
        <div className="npb-spacing-tooltip" role="status">
          <span className={`npb-spacing-tooltip-kind ${activeDrag.kind}`}>
            {activeDrag.kind}
          </span>
          <strong>{activeDrag.value}px</strong>
        </div>
      ) : null}
    </div>
  );
}
