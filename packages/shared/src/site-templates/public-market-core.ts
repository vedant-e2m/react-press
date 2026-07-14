/**
 * Public Market Emeryville — homepage built from core Puck blocks only.
 * No CustomBlock-* types; for side-by-side comparison with /home (custom blocks).
 * Reference: https://publicmarketemeryville.channel13.cloud/
 */
import {
  PME_ACCENT,
  PME_ASSETS,
  PME_EVENTS,
  PME_TEXT,
  pmeBlock,
  pmeFooterColumns,
  pmeNavBar,
  pmePuckData,
  pmeSlot,
  pmeVendorItems,
  type SeedBlock,
} from "./public-market-shared";

const ABOUT_BODY =
  "Emeryville Public Market is more than a food hall—it's a vibrant, mixed-use destination where culture, commerce, and community intersect. Anchored by a curated collection of local culinary experiences, the Market is energized by a seamless blend of retail, office, and life science spaces that activate the environment from morning through evening. This layered ecosystem creates a dynamic, always-on destination—one where people come not just to dine, but to connect, work, discover, and be part of a thriving, innovation-driven community.";

/** Shared nav + footer chrome (NavBar, ContactForm, SiteFooter — all core blocks). */
function withCoreChrome(body: SeedBlock[], opts: { transparentNav?: boolean } = {}): SeedBlock[] {
  return [pmeNavBar({ transparent: opts.transparentNav }), ...body, pmeFooterColumns()];
}

/** About row — Hours | logo + heading + copy | Address (Columns + InfoCard + SectionHeading + Image). */
function buildAboutSection(): SeedBlock {
  return pmeBlock("Columns", "about", {
    columns: "3",
    backgroundColor: "#F5F5F5",
    paddingTop: 64,
    paddingBottom: 48,
    maxWidth: "6xl",
    content: [
      pmeSlot("InfoCard", "about-hours", {
        label: "Hours of Operation",
        lines: "Mon – Sat\n10am – 9pm\nSunday\n10am – 8pm",
        borderColor: PME_ACCENT,
        labelColor: PME_ACCENT,
        textColor: PME_TEXT,
        alignment: "center",
      }),
      pmeSlot("Columns", "about-center", {
        columns: "1",
        paddingTop: 0,
        paddingBottom: 0,
        content: [
          pmeSlot("Image", "about-logo", {
            src: PME_ASSETS.aboutLogo,
            alt: "The Public Market",
            rounded: false,
            alignment: "center",
            maxWidth: "xs",
          }),
          pmeSlot("SectionHeading", "about-heading", {
            title: "More than just",
            highlight: "a food hall",
            description: ABOUT_BODY,
            alignment: "center",
            highlightColor: PME_ACCENT,
            textColor: PME_TEXT,
            paddingTop: 16,
            paddingBottom: 0,
          }),
        ],
      }),
      pmeSlot("InfoCard", "about-address", {
        label: "Address",
        lines: "5959 Shellmound St.\nEmeryville, CA 94608",
        borderColor: PME_ACCENT,
        labelColor: PME_ACCENT,
        textColor: PME_TEXT,
        alignment: "center",
      }),
    ],
  });
}

/** Leasing CTA — FeatureGrid image tiles (replaces CustomBlock-leasing-tiles). */
function buildLeasingSection(): SeedBlock {
  return pmeBlock("FeatureGrid", "leasing", {
    title: "Looking To",
    highlight: "Lease?",
    description: "",
    display: "image-tiles",
    tileStyle: "flush",
    backgroundColor: "#ffffff",
    highlightColor: PME_ACCENT,
    sectionWatermark: "Looking To Lease?",
    sectionCtaLabel: "Contact Us",
    sectionCtaUrl: "/contact",
    features: [
      {
        title: "Food Hall",
        description: "",
        imageUrl: PME_ASSETS.lease.foodHall,
        linkUrl: "/leasing-food-hall",
        showArrow: true,
      },
      {
        title: "Office & Life Science",
        description: "",
        imageUrl: PME_ASSETS.lease.office,
        linkUrl: "/leasing-office",
        showArrow: true,
      },
      {
        title: "Adjacent Retail",
        description: "",
        imageUrl: PME_ASSETS.lease.retail,
        linkUrl: "/leasing-adjacent-retail",
        showArrow: true,
      },
    ],
  });
}

/** Instagram follow intro — SectionHeading + Button (replaces CustomBlock-pme-follow-intro). */
function buildFollowIntro(): SeedBlock[] {
  return [
    pmeBlock("SectionHeading", "follow-intro", {
      title: "Don't Miss",
      highlight: "What's Next",
      description: "",
      alignment: "center",
      highlightColor: PME_ACCENT,
      textColor: PME_TEXT,
      backgroundColor: "#ffffff",
      paddingTop: 48,
      paddingBottom: 0,
    }),
    pmeBlock("Button", "follow-cta", {
      label: "Follow @publicmarketemeryville",
      url: "https://instagram.com/publicmarketemeryville",
      variant: "primary",
      alignment: "center",
      backgroundColor: PME_ACCENT,
      textColor: "#ffffff",
      paddingTop: 0,
      paddingBottom: 8,
    }),
  ];
}

/**
 * Public Market homepage — core blocks only (NavBar, HeroBanner, Columns, InfoCard,
 * SectionHeading, Image, Gallery, FilterGrid, FeatureGrid, ArticleGrid, Button,
 * ContactForm, SiteFooter).
 */
export function buildPublicMarketCoreHomeBlocks(): SeedBlock[] {
  return withCoreChrome(
    [
      pmeBlock("HeroBanner", "hero", {
        videoUrl: PME_ASSETS.heroVideo,
        title: "Welcome To",
        titleHighlight: "The Public Market",
        subtitle: "MORE THAN JUST A FOOD HALL",
        subtitleTextTransform: "uppercase",
        subtitleLetterSpacing: "wider",
        overlayOpacity: 45,
        minHeight: "screen",
        showScrollIndicator: true,
        contentAlign: "center",
      }),
      buildAboutSection(),
      pmeBlock("Gallery", "polaroids", {
        layout: "scatter",
        scatterDensity: "tight",
        frameStyle: "polaroid",
        columns: "3",
        captionStyle: "below",
        captionFont: "accent",
        centerBadgeUrl: PME_ASSETS.centerBadge,
        centerBadgeAlt: "The Public Market est. 1987",
        backgroundColor: "#F5F5F5",
        paddingBottom: 48,
        images: [
          { src: PME_ASSETS.polaroid[0], alt: "Fish Grill", caption: "Fish Grill" },
          { src: PME_ASSETS.polaroid[1], alt: "Public Bar", caption: "Public Bar" },
          { src: PME_ASSETS.polaroid[2], alt: "Sushi", caption: "Sushi" },
          { src: PME_ASSETS.polaroid[3], alt: "Greek Food", caption: "Greek Food" },
          { src: PME_ASSETS.polaroid[4], alt: "Japanese Fusion", caption: "Japanese Fusion" },
          { src: PME_ASSETS.polaroid[5], alt: "Ramen", caption: "Ramen" },
        ],
      }),
      pmeBlock("FilterGrid", "vendors", {
        blockId: "vendors",
        sectionTitle: "Our Vendors",
        sectionHeaderColor: "#ffffff",
        sectionCtaLabel: "View All Vendors",
        sectionCtaUrl: "/vendors",
        accentColor: PME_ACCENT,
        backgroundImage: PME_ASSETS.vendorBg,
        overlayOpacity: 35,
        displayMode: "carousel",
        cardStyle: "title-first",
        showFilters: false,
        showViewToggle: false,
        items: pmeVendorItems(),
      }),
      buildLeasingSection(),
      pmeBlock("ArticleGrid", "events", {
        blockId: "events",
        title: "Events",
        description: "",
        layout: "masonry",
        cardVariant: "image-overlay",
        backgroundColor: "#333333",
        textColor: "#ffffff",
        linkColor: PME_ACCENT,
        sectionCtaLabel: "Check Out More",
        sectionCtaUrl: "/events",
        sectionCtaStyle: "button",
        articles: PME_EVENTS.map((e) => ({
          title: e.title,
          href: `/${e.slug}`,
          imageUrl: e.imageUrl,
          meta: e.meta,
          tags: e.tags,
        })),
      }),
      ...buildFollowIntro(),
      pmeBlock("Gallery", "follow-gallery", {
        layout: "scatter",
        scatterDensity: "tight",
        bleed: true,
        columns: "4",
        captionStyle: "none",
        backgroundColor: "#ffffff",
        paddingTop: 0,
        images: PME_ASSETS.follow.map((src, i) => ({ src, alt: `Social ${i + 1}` })),
      }),
    ],
    { transparentNav: true },
  );
}

/** Homepage puck data for the core-blocks comparison route. */
export function buildPublicMarketCoreHomePuckData() {
  return pmePuckData("The Public Market Emeryville (Core Blocks)", buildPublicMarketCoreHomeBlocks());
}
