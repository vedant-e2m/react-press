import { describe, expect, it } from "vitest";
import { resolveCdnUrl } from "./cdn";

describe("resolveCdnUrl", () => {
  it("returns original URL when no CDN is configured", () => {
    expect(resolveCdnUrl("/uploads/photo.jpg", null)).toBe("/uploads/photo.jpg");
  });

  it("rewrites relative paths with CDN base", () => {
    expect(resolveCdnUrl("/uploads/photo.jpg", "https://cdn.example.com")).toBe(
      "https://cdn.example.com/uploads/photo.jpg",
    );
  });

  it("rewrites absolute URLs keeping path and query", () => {
    expect(
      resolveCdnUrl("https://localhost:1337/uploads/a.jpg?v=1", "https://cdn.example.com"),
    ).toBe("https://cdn.example.com/uploads/a.jpg?v=1");
  });
});
