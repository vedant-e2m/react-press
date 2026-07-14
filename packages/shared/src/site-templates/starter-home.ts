/** Generic homepage starter — raw blocks only, composed in the page builder. */
type SeedBlock = { type: string; props: Record<string, unknown> };

function block(type: string, id: string, props: Record<string, unknown>): SeedBlock {
  return { type, props: { id, ...props } };
}

/** Minimal raw blocks for a blank homepage (nav + hero + intro + footer). */
export function buildStarterHomeBlocks(): SeedBlock[] {
  return [
    block("NavBar", "nav", {
      brandLabel: "Your Site",
      brandHref: "/",
      links: [
        { label: "About", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Contact", href: "#contact" },
      ],
    }),
    block("HeroBanner", "hero", {
      title: "Welcome to",
      titleHighlight: "Your Site",
      subtitle: "Build your page by adding blocks below.",
      overlayOpacity: 55,
      minHeight: "lg",
    }),
    block("ContentMedia", "intro", {
      title: "About",
      content: "Replace this with your story. Add Button, Gallery, Columns, and other blocks from the page builder.",
      mediaPosition: "right",
      mediaType: "image",
      desktopImageUrl: "",
      paddingY: "lg",
    }),
    block("SiteFooter", "footer", {
      copyright: "© Your Company",
      columns: [
        {
          title: "Explore",
          links: [
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ],
        },
      ],
    }),
  ];
}
