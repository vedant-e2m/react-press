import { describe, expect, it } from "vitest";
import { getVideoEmbedUrl, buildResponsiveSrcSet } from "./media";
import { validateContactForm } from "./forms";

describe("getVideoEmbedUrl", () => {
  it("parses YouTube watch URLs", () => {
    expect(getVideoEmbedUrl("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("parses Vimeo URLs", () => {
    expect(getVideoEmbedUrl("https://vimeo.com/12345")).toBe(
      "https://player.vimeo.com/video/12345",
    );
  });

  it("returns null for invalid URLs", () => {
    expect(getVideoEmbedUrl("not-a-url")).toBeNull();
  });
});

describe("buildResponsiveSrcSet", () => {
  it("builds srcSet from format map", () => {
    const srcSet = buildResponsiveSrcSet({
      small: { url: "/small.jpg", width: 500 },
      large: { url: "/large.jpg", width: 1200 },
    });
    expect(srcSet).toContain("/small.jpg 500w");
    expect(srcSet).toContain("/large.jpg 1200w");
  });
});

describe("validateContactForm", () => {
  const fields = [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "email", label: "Email", type: "email" as const, required: true },
  ];

  it("flags missing required fields", () => {
    const errors = validateContactForm(fields, { name: "", email: "" });
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it("validates email format", () => {
    const errors = validateContactForm(fields, { name: "Ada", email: "bad" });
    expect(errors.email).toContain("valid email");
  });

  it("returns no errors for valid input", () => {
    const errors = validateContactForm(fields, { name: "Ada", email: "ada@example.com" });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
