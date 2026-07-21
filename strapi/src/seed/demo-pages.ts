import showcaseDocument from "./builder-showcase.json";
import publicMarketDocument from "./builder-public-market.json";

/** Native builder demo pages created on a fresh installation. */
export const DEMO_PAGES = [
  {
    title: "The Public Market",
    slug: "home",
    page_status: "published",
    seo_title: "The Public Market Emeryville",
    seo_description:
      "Emeryville Public Market — a vibrant mixed-use destination where culture, commerce, and community intersect.",
    builder_data: publicMarketDocument,
  },
  {
    title: "Component Showcase",
    slug: "showcase",
    page_status: "published",
    seo_title: "NextPress Component Showcase — The Public Market",
    seo_description:
      "A demo website built with every NextPress page builder widget and its settings, styled after The Public Market Emeryville.",
    builder_data: showcaseDocument,
  },
  {
    title: "Component Showcase (Draft)",
    slug: "showcase-draft",
    page_status: "draft",
    seo_title: "NextPress Builder Showcase",
    seo_description: "Editable draft copy of the full component showcase page.",
    builder_data: showcaseDocument,
  },
];

/** Non-PME / obsolete slugs removed on every seed run. */
export const REMOVED_DEMO_SLUGS = [
  "about",
  "services",
  "draft-demo",
  "auction-dashboard",
  "e2m-clone",
  "e2m",
  "news",
  "public-market-core",
];
