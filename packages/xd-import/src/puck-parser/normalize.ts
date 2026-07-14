import type { XdBounds } from "./xd-file";

export type XdNormalizedNode = {
  id: string;
  name: string;
  groupPath: string[];
  kind: "text" | "rect" | "ellipse" | "line" | "path" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDeg: number;
  opacity: number;
  fill?: string | null;
  stroke?: { color: string; width: number } | null;
  text?: {
    content: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    italic: boolean;
    align: string;
    color: string;
  };
  image?: { uid: string };
  svgPath?: string;
  pathLocalOrigin?: { x: number; y: number };
};

type Affine = { a: number; b: number; c: number; d: number; tx: number; ty: number };

type AgcNode = {
  type?: string;
  id?: string;
  name?: string;
  transform?: Affine;
  shape?: {
    type?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
    r?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    path?: string;
  };
  style?: {
    opacity?: number;
    fill?: {
      type?: string;
      color?: { value?: { r: number; g: number; b: number } | number; alpha?: number };
      pattern?: { meta?: { ux?: { uid?: string } }; width?: number; height?: number };
    };
    stroke?: {
      type?: string;
      color?: { value?: { r: number; g: number; b: number } | number; alpha?: number };
      width?: number;
    };
    font?: { family?: string; style?: string; size?: number };
    textAttributes?: { paragraphAlign?: string };
  };
  text?: { rawText?: string };
  meta?: {
    ux?: {
      frame?: { width?: number; height?: number };
      rangedStyles?: Array<{
        fontFamily?: string;
        fontStyle?: string;
        fontSize?: number;
        fill?: { value?: number };
      }>;
    };
  };
  group?: { children?: AgcNode[] };
  artboard?: { children?: AgcNode[] };
};

const IDENTITY: Affine = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

function multiplyTransform(m1: Affine, m2: Affine): Affine {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
}

function rotationFromMatrix(m: Affine) {
  const deg = (Math.atan2(m.b, m.a) * 180) / Math.PI;
  return Math.round(deg * 100) / 100;
}

function applyMatrix(m: Affine, x: number, y: number) {
  return { x: m.a * x + m.c * y + m.tx, y: m.b * x + m.d * y + m.ty };
}

function scaleOfMatrix(m: Affine) {
  return {
    sx: Math.hypot(m.a, m.b) || 1,
    sy: Math.hypot(m.c, m.d) || 1,
  };
}

export function colorToHex(colorValue: unknown, alpha?: number) {
  if (colorValue == null) return null;
  let r: number;
  let g: number;
  let b: number;
  if (typeof colorValue === "object" && colorValue !== null && "r" in colorValue) {
    ({ r, g, b } = colorValue as { r: number; g: number; b: number });
  } else if (typeof colorValue === "number") {
    r = (colorValue >>> 24) & 0xff;
    g = (colorValue >>> 16) & 0xff;
    b = (colorValue >>> 8) & 0xff;
  } else {
    return null;
  }
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  const a = alpha == null || alpha === 1 ? "" : hex(Math.round(alpha * 255));
  return `#${hex(r)}${hex(g)}${hex(b)}${a}`;
}

function extractFill(styleNode?: AgcNode["style"]) {
  const fill = styleNode?.fill;
  if (!fill || fill.type === "none") return { color: null, imagePattern: null as { uid: string | null } | null };
  if (fill.type === "solid") {
    return {
      color: colorToHex(fill.color?.value, fill.color?.alpha),
      imagePattern: null,
    };
  }
  if (fill.type === "pattern") {
    return {
      color: null,
      imagePattern: { uid: fill.pattern?.meta?.ux?.uid ?? null },
    };
  }
  return { color: null, imagePattern: null };
}

function extractStroke(styleNode?: AgcNode["style"]) {
  const stroke = styleNode?.stroke;
  if (!stroke || stroke.type === "none") return null;
  return {
    color: colorToHex(stroke.color?.value, stroke.color?.alpha) || "#000000",
    width: stroke.width ?? 1,
  };
}

function boundsFromSvgPath(d: string) {
  const nums = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  if (nums.length < 2) return { x: 0, y: 0, width: 0, height: 0 };
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function boundsOfShape(shape: NonNullable<AgcNode["shape"]>) {
  switch (shape.type) {
    case "rect":
      return { x: shape.x ?? 0, y: shape.y ?? 0, width: shape.width ?? 0, height: shape.height ?? 0 };
    case "circle":
      return {
        x: (shape.cx ?? 0) - (shape.r ?? 0),
        y: (shape.cy ?? 0) - (shape.r ?? 0),
        width: (shape.r ?? 0) * 2,
        height: (shape.r ?? 0) * 2,
      };
    case "line": {
      const x = Math.min(shape.x1 ?? 0, shape.x2 ?? 0);
      const y = Math.min(shape.y1 ?? 0, shape.y2 ?? 0);
      return {
        x,
        y,
        width: Math.abs((shape.x2 ?? 0) - (shape.x1 ?? 0)),
        height: Math.abs((shape.y2 ?? 0) - (shape.y1 ?? 0)),
      };
    }
    case "path":
    case "compound":
      return boundsFromSvgPath(shape.path || "");
    default:
      return { x: 0, y: 0, width: 0, height: 0 };
  }
}

function extractText(node: AgcNode) {
  const raw = node.text?.rawText ?? "";
  const ranged = node.meta?.ux?.rangedStyles?.[0] || {};
  const font = node.style?.font || {};
  return {
    content: raw,
    fontFamily: ranged.fontFamily || font.family || "Arial",
    fontSize: ranged.fontSize || font.size || 14,
    fontWeight: /bold/i.test(ranged.fontStyle || font.style || "") ? "bold" : "normal",
    italic: /italic|oblique/i.test(ranged.fontStyle || font.style || ""),
    align: node.style?.textAttributes?.paragraphAlign || "left",
    color: colorToHex(ranged.fill?.value) || colorToHex(node.style?.fill?.color?.value) || "#000000",
  };
}

export function normalizeArtboard(graphicContent: unknown, artboardOrigin: XdBounds) {
  const results: XdNormalizedNode[] = [];
  let autoId = 0;
  const nextId = (prefix: string) => `${prefix}-${(autoId++).toString(36)}`;

  const root = (graphicContent as { children?: AgcNode[] })?.children?.[0];
  if (!root) return results;

  const rootChildren = root.artboard?.children || [];

  const visit = (node: AgcNode, parentMatrix: Affine, groupPath: string[]) => {
    const localMatrix = node.transform || IDENTITY;
    const worldMatrix = multiplyTransform(parentMatrix, localMatrix);

    if (node.type === "group") {
      for (const child of node.group?.children || []) {
        visit(child, worldMatrix, [...groupPath, node.name || "Group"]);
      }
      return;
    }

    if (node.type === "shape") {
      const shape = node.shape || {};
      const isPathLike = shape.type === "path" || shape.type === "compound";
      const localBounds = boundsOfShape(shape);
      const topLeft = applyMatrix(worldMatrix, localBounds.x, localBounds.y);
      const { sx, sy } = scaleOfMatrix(worldMatrix);
      const { color, imagePattern } = extractFill(node.style);
      const stroke = extractStroke(node.style);

      const base = {
        id: node.id || nextId("shape"),
        name: node.name || shape.type || "shape",
        groupPath,
        x: topLeft.x - artboardOrigin.x,
        y: topLeft.y - artboardOrigin.y,
        width: localBounds.width * sx,
        height: localBounds.height * sy,
        rotationDeg: rotationFromMatrix(worldMatrix),
        opacity: node.style?.opacity ?? 1,
        fill: color,
        stroke,
      };

      if (imagePattern?.uid) {
        results.push({ ...base, kind: "image", image: { uid: imagePattern.uid } });
        return;
      }

      if (isPathLike) {
        results.push({
          ...base,
          kind: "path",
          svgPath: shape.path || "",
          pathLocalOrigin: { x: localBounds.x, y: localBounds.y },
        });
        return;
      }

      const kindMap: Record<string, XdNormalizedNode["kind"]> = {
        rect: "rect",
        circle: "ellipse",
        line: "line",
      };
      results.push({ ...base, kind: kindMap[shape.type ?? ""] || "rect" });
      return;
    }

    if (node.type === "text") {
      const frame = node.meta?.ux?.frame || {};
      const origin = applyMatrix(worldMatrix, 0, 0);
      const text = extractText(node);
      results.push({
        id: node.id || nextId("text"),
        name: node.name || "Text",
        groupPath,
        x: origin.x - artboardOrigin.x,
        y: origin.y - artboardOrigin.y,
        width: frame.width ?? 200,
        height: frame.height ?? Math.round((text.fontSize || 14) * 1.4),
        rotationDeg: rotationFromMatrix(worldMatrix),
        opacity: node.style?.opacity ?? 1,
        kind: "text",
        text,
      });
    }
  };

  for (const child of rootChildren) {
    visit(child, IDENTITY, []);
  }

  return results;
}
