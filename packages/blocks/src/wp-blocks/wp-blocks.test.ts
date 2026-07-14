import { describe, expect, it } from "vitest";
import { getVideoEmbedUrl } from "@nextpress/shared";

describe("blocks wp integration", () => {
  it("shared video helper works for block embeds", () => {
    expect(getVideoEmbedUrl("https://youtu.be/xyz")).toBe(
      "https://www.youtube.com/embed/xyz",
    );
  });
});
