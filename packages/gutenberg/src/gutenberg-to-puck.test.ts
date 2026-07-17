import { describe, expect, it } from "vitest";
import { puckToGutenberg } from "./convert/puck-to-gutenberg";
import { gutenbergToPuck, resolvePuckDocument } from "./convert/gutenberg-to-puck";
import type { PuckData } from "@nextpress/shared";

describe("gutenbergToPuck", () => {
  it("should round-trip nextpress blocks for the page editor", () => {
    const puck: PuckData = {
      root: { props: {} },
      content: [
        {
          type: "AnnouncementBar",
          props: { id: "a1", text: "Hello", showArrows: true },
        },
        {
          type: "HeroBanner",
          props: { id: "h1", title: "Welcome To", titleHighlight: "Public Market" },
        },
        {
          type: "InfoBand",
          props: { id: "i1", title: "More than just", highlight: "a food hall" },
        },
      ],
    };
    const gb = puckToGutenberg(puck);
    const back = gutenbergToPuck(gb);
    expect(back.content.map((b) => b.type)).toEqual([
      "AnnouncementBar",
      "HeroBanner",
      "InfoBand",
    ]);
    expect(back.content[1].props.title).toBe("Welcome To");
    expect(back.content[2].props.highlight).toBe("a food hall");
  });

  it("should resolve either format via resolvePuckDocument", () => {
    const fromPuck = resolvePuckDocument({
      content: [{ type: "NavBar", props: { brandLabel: "PM" } }],
      root: { props: {} },
    });
    expect(fromPuck.content[0].type).toBe("NavBar");

    const gb = puckToGutenberg({
      content: [{ type: "PageHero", props: { title: "Events" } }],
      root: { props: {} },
    });
    const fromGb = resolvePuckDocument(gb);
    expect(fromGb.content[0].type).toBe("PageHero");
    expect(fromGb.content[0].props.title).toBe("Events");
  });
});
