import { describe, expect, it } from "vitest";
import {
  buildSidebarSections,
  getElementGroupFieldNames,
  getRelatedFieldKeys,
} from "./focused-fields";

describe("getRelatedFieldKeys", () => {
  const keys = [
    "title",
    "titleColor",
    "titleFontSize",
    "titleHighlight",
    "titleHighlightColor",
    "titleHighlightFontSize",
    "titleSuffix",
    "titleSuffixColor",
    "description",
    "descriptionColor",
  ];

  it("groups title style fields under title only", () => {
    const related = getRelatedFieldKeys("title", keys);
    expect(related).toContain("titleColor");
    expect(related).toContain("titleFontSize");
    expect(related).not.toContain("titleHighlight");
    expect(related).not.toContain("titleHighlightColor");
    expect(related).not.toContain("titleSuffixColor");
  });

  it("groups titleHighlight fields separately", () => {
    const related = getRelatedFieldKeys("titleHighlight", keys);
    expect(related).toContain("titleHighlightColor");
    expect(related).not.toContain("titleColor");
  });
});

describe("getElementGroupFieldNames", () => {
  it("does not duplicate fields across title and titleHighlight groups", () => {
    const keys = [
      "title",
      "titleColor",
      "titleHighlight",
      "titleHighlightColor",
      "description",
      "descriptionColor",
    ];
    const titleGroup = getElementGroupFieldNames("title", keys);
    const highlightGroup = getElementGroupFieldNames("titleHighlight", keys);
    const overlap = titleGroup.filter((k) => highlightGroup.includes(k) && k !== "title");
    expect(overlap).toEqual([]);
  });
});

describe("buildSidebarSections", () => {
  it("puts highlightColor under Highlight, not Colors", () => {
    const sections = buildSidebarSections([
      "title",
      "titleColor",
      "highlight",
      "highlightColor",
      "description",
      "descriptionColor",
      "backgroundColor",
      "marginTop",
      "paddingTop",
    ]);

    const highlight = sections.find((s) => s.id === "element-highlight");
    const colors = sections.find((s) => s.id === "block-colors");
    const layout = sections.find((s) => s.id === "block-layout");

    expect(highlight?.fieldNames).toContain("highlightColor");
    expect(colors?.fieldNames).toEqual(["backgroundColor"]);
    expect(colors?.fieldNames).not.toContain("highlightColor");
    expect(layout?.fieldNames).toEqual(expect.arrayContaining(["marginTop", "paddingTop"]));
  });
});
