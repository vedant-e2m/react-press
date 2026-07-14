import type { CSSProperties } from "react";

export type XdLayerPositionProps = {
  id?: string;
  xdName?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
};

export function xdWrapperStyle(props: XdLayerPositionProps): CSSProperties {
  return {
    position: "absolute",
    left: props.x,
    top: props.y,
    width: props.width,
    height: props.height,
    transform: props.rotation ? `rotate(${props.rotation}deg)` : undefined,
    opacity: props.opacity ?? 1,
  };
}

export type XdTextProps = XdLayerPositionProps & {
  content: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  italic?: boolean;
  align?: string;
  color?: string;
};

export function XdText({
  content,
  fontFamily = "Arial",
  fontSize = 14,
  fontWeight = "normal",
  italic = false,
  align = "left",
  color = "#000000",
  ...position
}: XdTextProps) {
  return (
    <div
      style={{
        ...xdWrapperStyle(position),
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle: italic ? "italic" : "normal",
        textAlign: align as CSSProperties["textAlign"],
        color,
        whiteSpace: "pre-wrap",
      }}
    >
      {content}
    </div>
  );
}

export type XdImageProps = XdLayerPositionProps & {
  src?: string | null;
  borderRadius?: number;
};

export function XdImage({ src, borderRadius = 0, ...position }: XdImageProps) {
  return (
    <div style={xdWrapperStyle(position)}>
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius,
          }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "#e2e2e2" }} />
      )}
    </div>
  );
}

export type XdRectProps = XdLayerPositionProps & {
  fill?: string | null;
  strokeColor?: string | null;
  strokeWidth?: number;
};

export function XdRect({ fill, strokeColor, strokeWidth = 0, ...position }: XdRectProps) {
  return (
    <div
      style={{
        ...xdWrapperStyle(position),
        background: fill || "transparent",
        border: strokeWidth ? `${strokeWidth}px solid ${strokeColor ?? "#000"}` : undefined,
      }}
    />
  );
}

export type XdEllipseProps = XdRectProps;

export function XdEllipse(props: XdEllipseProps) {
  const { fill, strokeColor, strokeWidth = 0, ...position } = props;
  return (
    <div
      style={{
        ...xdWrapperStyle(position),
        borderRadius: "50%",
        background: fill || "transparent",
        border: strokeWidth ? `${strokeWidth}px solid ${strokeColor ?? "#000"}` : undefined,
      }}
    />
  );
}

export type XdLineProps = XdLayerPositionProps & {
  strokeColor?: string;
  strokeWidth?: number;
};

export function XdLine({ strokeColor = "#000000", strokeWidth = 1, ...position }: XdLineProps) {
  return (
    <div style={xdWrapperStyle(position)}>
      <svg width="100%" height="100%" style={{ overflow: "visible" }}>
        <line x1={0} y1={0} x2={position.width} y2={position.height} stroke={strokeColor} strokeWidth={strokeWidth} />
      </svg>
    </div>
  );
}

export type XdPathProps = XdLayerPositionProps & {
  d: string;
  pathMinX?: number;
  pathMinY?: number;
  fill?: string | null;
  strokeColor?: string | null;
  strokeWidth?: number;
};

export function XdPath({
  d,
  pathMinX = 0,
  pathMinY = 0,
  fill,
  strokeColor,
  strokeWidth = 0,
  ...position
}: XdPathProps) {
  return (
    <div style={xdWrapperStyle(position)}>
      <svg width="100%" height="100%" viewBox={`0 0 ${position.width} ${position.height}`} preserveAspectRatio="none">
        <path
          d={d}
          fill={fill || "none"}
          stroke={strokeColor || "none"}
          strokeWidth={strokeWidth || 0}
          transform={`translate(${-pathMinX}, ${-pathMinY})`}
        />
      </svg>
    </div>
  );
}
