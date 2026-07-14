import {
  buildPublicMarketSitePages,
  buildPublicMarketCoreHomePuckData,
  buildE2MHomePuckData,
} from "@nextpress/shared";

const E2M_HOME_PUCK_DATA = buildE2MHomePuckData();
const PUBLIC_MARKET_CORE_PUCK_DATA = buildPublicMarketCoreHomePuckData();

export const DEMO_PAGES = [
  ...buildPublicMarketSitePages(),
  {
    title: "Public Market (Core Blocks)",
    slug: "public-market-core",
    page_status: "published" as const,
    seo_title: "The Public Market Emeryville — Core Blocks",
    seo_description:
      "Public Market homepage rebuilt with core Puck blocks only — compare against the custom-block version at /home.",
    puck_data: PUBLIC_MARKET_CORE_PUCK_DATA,
  },
  {
    title: "E2M Solutions",
    slug: "e2m",
    page_status: "published" as const,
    seo_title: "E2M - #1 Trusted White Label Partner for Digital Agencies",
    seo_description:
      "E2M delivers white-label website development, digital marketing, PPC, and AI services with the premium Black Label Standard your agency deserves.",
    puck_data: E2M_HOME_PUCK_DATA,
  },
];

export const REMOVED_DEMO_SLUGS = [
  "about",
  "services",
  "draft-demo",
  "auction-dashboard",
  "e2m-clone",
  "news",
];
