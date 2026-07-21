import { describe, expect, it } from "vitest";
import {
  EMPTY_BUILDER_DOCUMENT,
  addBuilderElement,
  cloneBuilderElement,
  createBuilderElement,
  duplicateBuilderElement,
  findBuilderElement,
  insertBuilderElementAfter,
  moveBuilderElement,
  removeBuilderElement,
  updateBuilderElement,
} from "./document";

describe("builder document operations", () => {
  it("should add and update a root element immutably", () => {
    const heading = createBuilderElement("heading");
    const added = addBuilderElement(EMPTY_BUILDER_DOCUMENT, heading);
    const updated = updateBuilderElement(added, heading.id, (element) => ({
      ...element,
      props: { ...element.props, text: "Updated heading" },
    }));

    expect(EMPTY_BUILDER_DOCUMENT.content).toHaveLength(0);
    expect(updated.content).toHaveLength(1);
    expect(findBuilderElement(updated.content, heading.id)?.props.text).toBe("Updated heading");
  });

  it("should add and remove nested elements", () => {
    const container = createBuilderElement("container");
    const button = createBuilderElement("button");
    const withContainer = addBuilderElement(EMPTY_BUILDER_DOCUMENT, container);
    const nested = addBuilderElement(withContainer, button, container.id);
    const removed = removeBuilderElement(nested, button.id);

    expect(findBuilderElement(nested.content, button.id)).toBeDefined();
    expect(findBuilderElement(removed.content, button.id)).toBeUndefined();
  });

  it("should duplicate an element with a new id", () => {
    const heading = createBuilderElement("heading");
    const document = addBuilderElement(EMPTY_BUILDER_DOCUMENT, heading);
    const duplicated = duplicateBuilderElement(document, heading.id);

    expect(duplicated.content).toHaveLength(2);
    expect(duplicated.content[1]?.id).not.toBe(heading.id);
    expect(duplicated.content[1]?.props).toEqual(heading.props);
  });

  it("should insert an element right after a nested sibling", () => {
    const container = createBuilderElement("container");
    const first = createBuilderElement("heading");
    const last = createBuilderElement("button");
    const base = addBuilderElement(
      addBuilderElement(addBuilderElement(EMPTY_BUILDER_DOCUMENT, container), first, container.id),
      last,
      container.id,
    );

    const inserted = createBuilderElement("paragraph");
    const next = insertBuilderElementAfter(base, inserted, first.id);

    expect(next.content[0]?.children?.map((child) => child.id)).toEqual([first.id, inserted.id, last.id]);
  });

  it("should duplicate an element in place, right after the original", () => {
    const first = createBuilderElement("heading");
    const last = createBuilderElement("button");
    const document = addBuilderElement(addBuilderElement(EMPTY_BUILDER_DOCUMENT, first), last);

    const duplicated = duplicateBuilderElement(document, first.id);

    expect(duplicated.content).toHaveLength(3);
    expect(duplicated.content[0]?.id).toBe(first.id);
    expect(duplicated.content[1]?.type).toBe("heading");
    expect(duplicated.content[1]?.id).not.toBe(first.id);
    expect(duplicated.content[2]?.id).toBe(last.id);
  });

  it("should move an existing element into a container", () => {
    const container = createBuilderElement("container");
    const heading = createBuilderElement("heading");
    const document = addBuilderElement(
      addBuilderElement(EMPTY_BUILDER_DOCUMENT, container),
      heading,
    );
    const moved = moveBuilderElement(document, heading.id, container.id);

    expect(moved.content).toHaveLength(1);
    expect(moved.content[0]?.children?.[0]?.id).toBe(heading.id);
  });

  it("should clone an element subtree with fresh ids", () => {
    const flexbox = createBuilderElement("flexbox");
    const heading = createBuilderElement("heading");
    flexbox.children = [heading];

    const cloned = cloneBuilderElement(flexbox);

    expect(cloned.id).not.toBe(flexbox.id);
    expect(cloned.children?.[0]?.id).not.toBe(heading.id);
    expect(cloned.children?.[0]?.props).toEqual(heading.props);
    expect(cloned.type).toBe("flexbox");
  });

  it("should reject unknown widget types", () => {
    expect(() => createBuilderElement("unknown-widget")).toThrow("Unknown builder widget");
  });
});
