import {
  buildPublicMarketSitePages,
} from "@nextpress/shared";

/**
 * Demo content is Public Market Emeryville only
 * (reference: https://publicmarketemeryville.channel13.cloud/).
 */
export const DEMO_PAGES = [...buildPublicMarketSitePages()];

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
