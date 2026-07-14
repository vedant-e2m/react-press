import type { Config } from "@puckeditor/core";
import {
  XdText,
  XdImage,
  XdRect,
  XdEllipse,
  XdLine,
  XdPath,
  type XdTextProps,
  type XdImageProps,
  type XdRectProps,
  type XdEllipseProps,
  type XdLineProps,
  type XdPathProps,
} from "@nextpress/blocks";

const positionFields = {
  x: { type: "number" as const, label: "X" },
  y: { type: "number" as const, label: "Y" },
  width: { type: "number" as const, label: "Width" },
  height: { type: "number" as const, label: "Height" },
  rotation: { type: "number" as const, label: "Rotation (deg)" },
  opacity: { type: "number" as const, label: "Opacity", min: 0, max: 1, step: 0.05 },
};

export type XdPuckComponentMap = {
  XdText: XdTextProps;
  XdImage: XdImageProps;
  XdRect: XdRectProps;
  XdEllipse: XdEllipseProps;
  XdLine: XdLineProps;
  XdPath: XdPathProps;
};

export const xdPuckComponentConfig = {
  XdText: {
    fields: {
      content: { type: "textarea", label: "Text", contentEditable: true },
      fontFamily: { type: "text", label: "Font family" },
      fontSize: { type: "number", label: "Font size" },
      fontWeight: {
        type: "select",
        label: "Weight",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Bold", value: "bold" },
        ],
      },
      italic: {
        type: "radio",
        label: "Italic",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      align: {
        type: "select",
        label: "Align",
        options: ["left", "center", "right"].map((value) => ({ label: value, value })),
      },
      color: { type: "text", label: "Color" },
      ...positionFields,
    },
    defaultProps: {
      content: "Text",
      fontFamily: "Arial",
      fontSize: 14,
      fontWeight: "normal",
      italic: false,
      align: "left",
      color: "#000000",
      x: 0,
      y: 0,
      width: 100,
      height: 24,
      rotation: 0,
      opacity: 1,
    },
    label: "XD Text",
    resolveData: ({ props }) => ({
      props: {
        ...props,
        id: props.id ?? `xd-text-${props.x}-${props.y}`,
      },
    }),
    render: XdText,
  },
  XdImage: {
    fields: {
      src: { type: "text", label: "Image URL" },
      borderRadius: { type: "number", label: "Corner radius" },
      ...positionFields,
    },
    defaultProps: { src: "", borderRadius: 0, x: 0, y: 0, width: 100, height: 100, rotation: 0, opacity: 1 },
    label: "XD Image",
    render: XdImage,
  },
  XdRect: {
    fields: {
      fill: { type: "text", label: "Fill color" },
      strokeColor: { type: "text", label: "Stroke color" },
      strokeWidth: { type: "number", label: "Stroke width" },
      ...positionFields,
    },
    defaultProps: {
      fill: "#cccccc",
      strokeColor: null,
      strokeWidth: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
    },
    label: "XD Rect",
    render: XdRect,
  },
  XdEllipse: {
    fields: {
      fill: { type: "text", label: "Fill color" },
      strokeColor: { type: "text", label: "Stroke color" },
      strokeWidth: { type: "number", label: "Stroke width" },
      ...positionFields,
    },
    defaultProps: {
      fill: "#cccccc",
      strokeColor: null,
      strokeWidth: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
    },
    label: "XD Ellipse",
    render: XdEllipse,
  },
  XdLine: {
    fields: {
      strokeColor: { type: "text", label: "Color" },
      strokeWidth: { type: "number", label: "Width" },
      ...positionFields,
    },
    defaultProps: {
      strokeColor: "#000000",
      strokeWidth: 1,
      x: 0,
      y: 0,
      width: 100,
      height: 1,
      rotation: 0,
      opacity: 1,
    },
    label: "XD Line",
    render: XdLine,
  },
  XdPath: {
    fields: {
      d: { type: "textarea", label: "SVG path" },
      pathMinX: { type: "number", label: "Path min X" },
      pathMinY: { type: "number", label: "Path min Y" },
      fill: { type: "text", label: "Fill color" },
      strokeColor: { type: "text", label: "Stroke color" },
      strokeWidth: { type: "number", label: "Stroke width" },
      ...positionFields,
    },
    defaultProps: {
      d: "",
      pathMinX: 0,
      pathMinY: 0,
      fill: "#000000",
      strokeColor: null,
      strokeWidth: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
    },
    label: "XD Path",
    render: XdPath,
  },
} as Config<XdPuckComponentMap>["components"];
