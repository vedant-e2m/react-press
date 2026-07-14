import type { PuckData } from "@nextpress/shared";
import type { XdArtboardMeta } from "./xd-file";
import type { XdNormalizedNode } from "./normalize";

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function baseProps(node: XdNormalizedNode) {
  return {
    id: node.id,
    xdName: node.name,
    x: round(node.x),
    y: round(node.y),
    width: round(node.width),
    height: round(node.height),
    rotation: node.rotationDeg || 0,
    opacity: node.opacity ?? 1,
  };
}

function nodeToComponent(node: XdNormalizedNode, uidToAssetPath: Record<string, string>) {
  switch (node.kind) {
    case "text":
      return {
        type: "XdText",
        props: {
          ...baseProps(node),
          content: node.text?.content ?? "",
          fontFamily: node.text?.fontFamily,
          fontSize: node.text?.fontSize,
          fontWeight: node.text?.fontWeight,
          italic: node.text?.italic,
          align: node.text?.align,
          color: node.text?.color,
        },
      };

    case "image":
      return {
        type: "XdImage",
        props: {
          ...baseProps(node),
          src: (node.image?.uid && uidToAssetPath[node.image.uid]) || null,
          borderRadius: 0,
        },
      };

    case "rect":
      return {
        type: "XdRect",
        props: {
          ...baseProps(node),
          fill: node.fill,
          strokeColor: node.stroke?.color ?? null,
          strokeWidth: node.stroke?.width ?? 0,
        },
      };

    case "ellipse":
      return {
        type: "XdEllipse",
        props: {
          ...baseProps(node),
          fill: node.fill,
          strokeColor: node.stroke?.color ?? null,
          strokeWidth: node.stroke?.width ?? 0,
        },
      };

    case "line":
      return {
        type: "XdLine",
        props: {
          ...baseProps(node),
          strokeColor: node.stroke?.color ?? node.fill ?? "#000000",
          strokeWidth: node.stroke?.width ?? 1,
        },
      };

    case "path":
    default:
      return {
        type: "XdPath",
        props: {
          ...baseProps(node),
          d: node.svgPath ?? "",
          pathMinX: round(node.pathLocalOrigin?.x ?? 0),
          pathMinY: round(node.pathLocalOrigin?.y ?? 0),
          fill: node.fill,
          strokeColor: node.stroke?.color ?? null,
          strokeWidth: node.stroke?.width ?? 0,
        },
      };
  }
}

export function artboardToPuckData(
  artboard: XdArtboardMeta,
  nodes: XdNormalizedNode[],
  uidToAssetPath: Record<string, string>,
): PuckData {
  return {
    root: {
      props: {
        title: artboard.name,
        canvasWidth: artboard.bounds.width,
        canvasHeight: artboard.bounds.height,
      },
    },
    content: nodes
      .filter((n) => (n.width > 0 && n.height > 0) || n.kind === "text")
      .map((n) => nodeToComponent(n, uidToAssetPath)),
    zones: {},
  };
}
