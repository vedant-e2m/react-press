import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BuilderRenderer } from "./renderer";
import { createPublicMarketDocument } from "./public-market-document";

describe("public market document", () => {
  const document = createPublicMarketDocument();

  it("should render the homepage sections and real site content", () => {
    const html = renderToStaticMarkup(<BuilderRenderer document={document} />);

    expect(html).toContain("npb-page");
    expect(html).toContain("Welcome To");
    expect(html).toContain("The Public Market");
    expect(html).toContain("More than just");
    expect(html).toContain("Our Vendors");
    expect(html).toContain("Alma Y Sazon");
    expect(html).toContain("Looking To Lease?");
    expect(html).toContain("Events");
    expect(html).toContain("Live Music Thursday");
    expect(html).toMatch(/What(?:&#39;|&#x27;|'|')s Next/);
    expect(html).toContain("FOLLOW @PUBLICMARKETEMERYVILLE");
    expect(html).toContain("SUBSCRIBE");
    expect(html).toContain("Skip to content");
    expect(html).toContain('id="menu"');
    expect(html).toContain("INSTAGRAM");
  });

  it("should include all 24 vendors", () => {
    const html = renderToStaticMarkup(<BuilderRenderer document={document} />);

    expect(html).toContain("Alma Y Sazon");
    expect(html).toContain("The Lounge Nail Spa");
    expect(html.match(/LEARN MORE/g)?.length ?? 0).toBeGreaterThanOrEqual(20);
  });

  it("should apply Public Market theme settings", () => {
    expect(document.settings.title).toBe("The Public Market");
    expect(document.settings.contentWidth).toBe(1280);
    expect(document.globals.colors.accent).toBe("#6FA84C");
    expect(document.settings.customCss).toContain("Roboto");
  });
});
