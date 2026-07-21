import type { BuilderDocument, BuilderElement } from "./types";
import { getBuilderWidget } from "./widgets";

export const EMPTY_BUILDER_DOCUMENT: BuilderDocument = {
  editor: "nextpress",
  version: 1,
  content: [],
  settings: { contentWidth: 1200 },
  globals: {
    colors: {
      primary: "#6d5dfc",
      secondary: "#1f2937",
      text: "#111827",
      accent: "#7c3aed",
    },
    fonts: {
      primary: "Inter, sans-serif",
      secondary: "Georgia, serif",
    },
    variables: {},
    classes: [],
  },
};

/** Creates a builder element using the widget's registered defaults. */
export function createBuilderElement(type: string): BuilderElement {
  const widget = getBuilderWidget(type);
  if (!widget) {
    throw new Error(`Unknown builder widget: ${type}`);
  }
  return {
    id: crypto.randomUUID(),
    type,
    props: structuredClone(widget.defaultProps),
    styles: {
      desktop: {
        normal: type === "flexbox" || type === "container"
          ? { display: "flex", flexDirection: "column" }
          : {},
      },
    },
    children: widget.acceptsChildren ? [] : undefined,
  };
}

function updateTree(
  elements: BuilderElement[],
  id: string,
  update: (element: BuilderElement) => BuilderElement,
): BuilderElement[] {
  return elements.map((element) => {
    if (element.id === id) {
      return update(element);
    }
    if (!element.children?.length) {
      return element;
    }
    return { ...element, children: updateTree(element.children, id, update) };
  });
}

/** Updates one element anywhere in a document tree. */
export function updateBuilderElement(
  document: BuilderDocument,
  id: string,
  update: (element: BuilderElement) => BuilderElement,
): BuilderDocument {
  return { ...document, content: updateTree(document.content, id, update) };
}

/** Adds an element to the page root or a container. */
export function addBuilderElement(
  document: BuilderDocument,
  element: BuilderElement,
  parentId?: string,
): BuilderDocument {
  if (!parentId) {
    return { ...document, content: [...document.content, element] };
  }
  return updateBuilderElement(document, parentId, (parent) => ({
    ...parent,
    children: [...(parent.children ?? []), element],
  }));
}

function insertAfterInTree(
  elements: BuilderElement[],
  siblingId: string,
  element: BuilderElement,
): BuilderElement[] {
  const index = elements.findIndex((item) => item.id === siblingId);
  if (index !== -1) {
    return [...elements.slice(0, index + 1), element, ...elements.slice(index + 1)];
  }
  return elements.map((item) =>
    item.children?.length
      ? { ...item, children: insertAfterInTree(item.children, siblingId, element) }
      : item,
  );
}

/** Inserts an element immediately after a sibling anywhere in the tree. */
export function insertBuilderElementAfter(
  document: BuilderDocument,
  element: BuilderElement,
  siblingId: string,
): BuilderDocument {
  return { ...document, content: insertAfterInTree(document.content, siblingId, element) };
}

function removeFromTree(elements: BuilderElement[], id: string): BuilderElement[] {
  return elements
    .filter((element) => element.id !== id)
    .map((element) => ({
      ...element,
      children: element.children ? removeFromTree(element.children, id) : undefined,
    }));
}

/** Removes an element and its descendants from a document. */
export function removeBuilderElement(document: BuilderDocument, id: string): BuilderDocument {
  return { ...document, content: removeFromTree(document.content, id) };
}

/** Finds an element recursively by id. */
export function findBuilderElement(
  elements: BuilderElement[],
  id: string,
): BuilderElement | undefined {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    const child = findBuilderElement(element.children ?? [], id);
    if (child) {
      return child;
    }
  }
  return undefined;
}

function renewIds(element: BuilderElement): BuilderElement {
  return {
    ...structuredClone(element),
    id: crypto.randomUUID(),
    children: element.children?.map(renewIds),
  };
}

/** Duplicates an element in place, inserting the copy right after the original. */
export function duplicateBuilderElement(document: BuilderDocument, id: string): BuilderDocument {
  const element = findBuilderElement(document.content, id);
  return element
    ? insertBuilderElementAfter(document, renewIds(element), id)
    : document;
}

/** Clones an element subtree with fresh ids for clipboard paste. */
export function cloneBuilderElement(element: BuilderElement): BuilderElement {
  return renewIds(element);
}

/** Moves an existing element to the root or another container. */
export function moveBuilderElement(
  document: BuilderDocument,
  id: string,
  parentId?: string,
): BuilderDocument {
  const element = findBuilderElement(document.content, id);
  if (!element || id === parentId || findBuilderElement(element.children ?? [], parentId ?? "")) {
    return document;
  }
  return addBuilderElement(removeBuilderElement(document, id), element, parentId);
}
