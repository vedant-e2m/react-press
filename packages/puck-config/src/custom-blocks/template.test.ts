import type { CustomBlockField } from "@nextpress/shared";
import { describe, expect, it } from "vitest";
import { escapeHtml, renderCustomBlockTemplate } from "./template";

const fields: CustomBlockField[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "body", label: "Body", type: "richtext" },
  { name: "cta", label: "CTA", type: "text" },
];

describe("escapeHtml", () => {
  it("escapes markup-significant characters", () => {
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
  });
});

describe("renderCustomBlockTemplate", () => {
  it("interpolates and HTML-escapes plain field values", () => {
    const html = renderCustomBlockTemplate("<h2>{{title}}</h2>", { title: "<b>Hi</b>" }, fields);
    expect(html).toBe("<h2>&lt;b&gt;Hi&lt;/b&gt;</h2>");
  });

  it("passes richtext fields through without escaping", () => {
    const html = renderCustomBlockTemplate("<div>{{body}}</div>", { body: "<em>ok</em>" }, fields);
    expect(html).toBe("<div><em>ok</em></div>");
  });

  it("renders a section only when the value is present", () => {
    const template = "{{#cta}}<a>{{cta}}</a>{{/cta}}";
    expect(renderCustomBlockTemplate(template, { cta: "Buy" }, fields)).toBe("<a>Buy</a>");
    expect(renderCustomBlockTemplate(template, { cta: "" }, fields)).toBe("");
  });

  it("renders an inverted section only when the value is absent", () => {
    const template = "{{^cta}}<span>none</span>{{/cta}}";
    expect(renderCustomBlockTemplate(template, { cta: "" }, fields)).toBe("<span>none</span>");
    expect(renderCustomBlockTemplate(template, { cta: "Buy" }, fields)).toBe("");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(renderCustomBlockTemplate("<p>{{missing}}</p>", {}, fields)).toBe("<p>{{missing}}</p>");
  });
});
