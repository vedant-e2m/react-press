/**
 * Public Market Emeryville — multi-page site builders.
 * Subpages use page-specific PME blocks matched to live screenshots
 * (not homepage FilterGrid / ArticleGrid reuse).
 * Reference: https://publicmarketemeryville.channel13.cloud/
 */
import {
  PME_ACCENT,
  PME_ASSETS,
  PME_EVENTS,
  PME_LEASING_UNITS,
  PME_TEXT,
  PME_VENDORS,
  pmeBlock,
  pmePuckData,
  pmeVendorItems,
  withPmeChrome,
  type SeedBlock,
} from "./public-market-shared";
import {
  buildDirectoryListsHtml,
  buildDirectoryMapHtml,
  buildEventsTextGridHtml,
  buildLeasingHeroBodyHtml,
  buildLeasingUnitsHtml,
  buildPurveyorHoursHtml,
  PME_DIRECTORY_HERO,
} from "./pme-html";

const ABOUT_BODY =
  "Emeryville Public Market is more than a food hall—it's a vibrant, mixed-use destination where culture, commerce, and community intersect. Anchored by a curated collection of local culinary experiences, the Market is energized by a seamless blend of retail, office, and life science spaces that activate the environment from morning through evening. This layered ecosystem creates a dynamic, always-on destination—one where people come not just to dine, but to connect, work, discover, and be part of a thriving, innovation-driven community.";

/**
 * Full Public Market homepage — CMS custom blocks + core interactive blocks.
 */
export function buildPublicMarketHomeBlocks(): SeedBlock[] {
  return [
    ...withPmeChrome(
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
        pmeBlock("InfoBand", "about", {
          hoursLabel: "Hours of Operation",
          hoursLines: "Mon – Sat\n10am – 9pm\nSunday\n10am – 8pm",
          logoUrl: PME_ASSETS.aboutLogo,
          title: "More than just",
          highlight: "a food hall",
          body: ABOUT_BODY,
          addressLabel: "Address",
          addressLines: "5959 Shellmound St.\nEmeryville, CA 94608",
          accentColor: PME_ACCENT,
          textColor: PME_TEXT,
          backgroundColor: "#F5F5F5",
        }),
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
        pmeBlock("ImageLinkGrid", "leasing", {
          title: "Looking To",
          highlight: "Lease?",
          ctaLabel: "Contact Us",
          ctaUrl: "/contact",
          highlightColor: PME_ACCENT,
          tiles: [
            {
              title: "Food Hall",
              imageUrl: PME_ASSETS.lease.foodHall,
              href: "/leasing-food-hall",
            },
            {
              title: "Office & Life Science",
              imageUrl: PME_ASSETS.lease.office,
              href: "/leasing-office",
            },
            {
              title: "Adjacent Retail",
              imageUrl: PME_ASSETS.lease.retail,
              href: "/leasing-adjacent-retail",
            },
          ],
        }),
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
        pmeBlock("HighlightCta", "follow-intro", {
          title: "Don't Miss",
          highlight: "What's Next",
          buttonLabel: "Follow @publicmarketemeryville",
          buttonUrl: "https://instagram.com/publicmarketemeryville",
          accentColor: PME_ACCENT,
          textColor: PME_TEXT,
          backgroundColor: "#ffffff",
        }),
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
    ),
  ];
}

/** Homepage puck data. */
export function buildPublicMarketHomePuckData() {
  return pmePuckData("The Public Market Emeryville", buildPublicMarketHomeBlocks());
}

/** Vendors — toolbar + large hover name list (not card grid). */
function buildVendorsPage(): SeedBlock[] {
  return withPmeChrome([
    pmeBlock("FilterToolbar", "vendors-toolbar", {
      categoryLabel: "Category: All",
      galleryLabel: "Gallery",
      listLabel: "List",
      activeView: "list",
      directoryLabel: "View Directory",
      directoryUrl: "/directory",
    }),
    pmeBlock("HoverNameList", "vendors-list", {
      items: PME_VENDORS.map((v) => ({
        title: v.title,
        href: `/${v.slug}`,
        imageUrl: PME_ASSETS.vendorThumb,
      })),
      backgroundColor: "#ffffff",
    }),
  ]);
}

/** Directory — image hero, floor plan, badge lists. */
function buildDirectoryPage(): SeedBlock[] {
  return withPmeChrome(
    [
      pmeBlock("PageHero", "directory-hero", {
        title: "Directory",
        imageUrl: PME_DIRECTORY_HERO,
        minHeight: "72vh",
        overlayOpacity: 40,
      }),
      pmeBlock("HtmlCode", "directory-map", {
        html: buildDirectoryMapHtml(),
      }),
      pmeBlock("HtmlCode", "directory-lists", {
        html: buildDirectoryListsHtml(),
      }),
    ],
    { transparentNav: true },
  );
}

/** Events — image hero + white text cards (not masonry image overlays). */
function buildEventsPage(): SeedBlock[] {
  return withPmeChrome(
    [
      pmeBlock("PageHero", "events-hero", {
        title: "Events",
        imageUrl: PME_ASSETS.interiorHero,
        minHeight: "72vh",
        overlayOpacity: 40,
      }),
      pmeBlock("HtmlCode", "events-grid", {
        html: buildEventsTextGridHtml(PME_EVENTS),
      }),
    ],
    { transparentNav: true },
  );
}

/** Contact — inquiries + split form section. */
function buildContactPage(): SeedBlock[] {
  return withPmeChrome([
    pmeBlock("InquiryList", "contact-inquiries", {
      heading: "Contact us",
      headingColor: PME_ACCENT,
      accentColor: PME_ACCENT,
      items: [
        {
          title: "General Inquiries",
          email: "xxx@publicmarketemeryville.com",
          actionText: "Fill out the contact form ↓",
          actionHref: "#contact",
        },
        {
          title: "Leasing Inquiries",
          email: "xxx@publicmarketemeryville.com",
          actionText: "Fill out the contact form ↓",
          actionHref: "#contact",
        },
      ],
    }),
    pmeBlock("ContactForm", "contact-form", {
      formId: "contact",
      blockId: "contact",
      title: "Send us a message",
      description: "",
      submitLabel: "Submit",
      successMessage: "Thanks — we'll be in touch soon.",
      variant: "inline",
      buttonColor: PME_ACCENT,
      backgroundColor: "#f5f5f5",
      columns: "2",
      fields: [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "topic",
          label: "I am contacting you about",
          type: "select",
          required: true,
          options: "General,Leasing,Events,Vendors",
        },
        { name: "comments", label: "Comments", type: "textarea", required: false },
      ],
    }),
  ]);
}

/** Order food — single bordered panel with hours inside. */
function buildOrderFoodPage(): SeedBlock[] {
  return withPmeChrome([
    pmeBlock("BorderedSplit", "order-panel", {
      borderColor: PME_ACCENT,
      mediaBackgroundColor: PME_ACCENT,
      mediaHtml:
        '<div style="font-size:64px;line-height:1.2;color:#111">🍴 ❤️<br/><span style="font-size:96px;font-weight:700">PM</span></div>',
      title: "ORDER FOOD + PURVEYOR HOURS",
      bodyHtml: `<p>Now your tastebuds don't have to settle for just one cuisine. Order online from multiple food hall purveyors at once, then get a text alert when your order is ready for pickup.</p>
<p><a href="#">ORDER FOOD NOW &gt;</a></p>
${buildPurveyorHoursHtml()}
<p><a href="/events">← Back To All News</a></p>`,
    }),
  ]);
}

/** Leasing hub — tiles only. */
function buildLeasingHubPage(): SeedBlock[] {
  return withPmeChrome([
    pmeBlock("ImageLinkGrid", "leasing-hub", {
      title: "Looking To",
      highlight: "Lease?",
      ctaLabel: "Contact Us",
      ctaUrl: "/contact",
      highlightColor: PME_ACCENT,
      tiles: [
        {
          title: "Food Hall",
          imageUrl: PME_ASSETS.lease.foodHall,
          href: "/leasing-food-hall",
        },
        {
          title: "Office & Life Science",
          imageUrl: PME_ASSETS.lease.office,
          href: "/leasing-office",
        },
        {
          title: "Adjacent Retail",
          imageUrl: PME_ASSETS.lease.retail,
          href: "/leasing-adjacent-retail",
        },
      ],
    }),
  ]);
}

/** Leasing type — dark hero, alternating units, inquire row + form. */
function buildLeasingTypePage(opts: {
  breadcrumb: string;
  kind: "food-hall" | "office" | "retail";
}): SeedBlock[] {
  const units =
    PME_LEASING_UNITS[
      opts.kind === "food-hall" ? "food-hall" : opts.kind === "office" ? "office" : "retail"
    ];

  return withPmeChrome([
    pmeBlock("MarketingHero", "leasing-hero", {
      breadcrumb: opts.breadcrumb.toUpperCase(),
      html: buildLeasingHeroBodyHtml(),
      backgroundColor: "#1a1a1a",
      accentColor: PME_ACCENT,
    }),
    pmeBlock("HtmlCode", "leasing-units", {
      html: buildLeasingUnitsHtml(units.map((u) => ({ title: u.title, size: u.size }))),
    }),
    pmeBlock("InquiryList", "leasing-inquire", {
      heading: "Inquire now",
      headingColor: PME_ACCENT,
      accentColor: PME_ACCENT,
      backgroundColor: "#f5f5f5",
      items: [
        {
          title: "Contact",
          emailLabel: "Team",
          email: "leasing@publicmarketemeryville.com",
          actionText: "Fill out the form below ↓",
          actionHref: "#leasing-form",
        },
      ],
    }),
    pmeBlock("ContactForm", "leasing-form", {
      formId: "leasing-inquire",
      blockId: "leasing-form",
      title: "",
      submitLabel: "Submit",
      successMessage: "Thanks — our leasing team will follow up.",
      buttonColor: PME_ACCENT,
      backgroundColor: "#f5f5f5",
      columns: "2",
      fields: [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel", required: false },
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "comments",
          label: "Tell us about your business",
          type: "textarea",
          required: false,
        },
      ],
    }),
  ]);
}

/** Event detail — image + copy panel. */
function buildEventDetailPage(event: (typeof PME_EVENTS)[number]): SeedBlock[] {
  return withPmeChrome([
    pmeBlock("ContentMedia", "event-panel", {
      title: event.title,
      content: `${event.meta}\n\n${event.body}`,
      mediaPosition: "left",
      mediaType: "image",
      desktopImageUrl: event.imageUrl,
      ctaLabel: "← Back To All News",
      ctaUrl: "/events",
      paddingY: "lg",
    }),
  ]);
}

/** Vendor detail — title + full-bleed image only. */
function buildVendorDetailPage(vendor: (typeof PME_VENDORS)[number]): SeedBlock[] {
  return withPmeChrome([
    pmeBlock("Text", "vendor-title", {
      content: vendor.title,
      alignment: "center",
      fontSize: "xl",
      padding: "lg",
    }),
    pmeBlock("Image", "vendor-image", {
      src: PME_ASSETS.vendorThumb,
      alt: vendor.title,
      rounded: false,
      objectFit: "cover",
      maxWidth: "full",
    }),
  ]);
}

export type PmeDemoPage = {
  title: string;
  slug: string;
  page_status: "published";
  seo_title: string;
  seo_description: string;
  puck_data: ReturnType<typeof pmePuckData>;
};

/**
 * All Public Market pages for Strapi demo seed (excluding E2M).
 */
export function buildPublicMarketSitePages(): PmeDemoPage[] {
  const pages: PmeDemoPage[] = [
    {
      title: "The Public Market Emeryville",
      slug: "home",
      page_status: "published",
      seo_title: "The Public Market Emeryville",
      seo_description:
        "Emeryville Public Market — food hall, vendors, events, and leasing at 5959 Shellmound St.",
      puck_data: buildPublicMarketHomePuckData(),
    },
    {
      title: "Vendors",
      slug: "vendors",
      page_status: "published",
      seo_title: "Vendors – The Public Market",
      seo_description: "Browse food hall, fitness, and retail vendors at Public Market Emeryville.",
      puck_data: pmePuckData("Vendors", buildVendorsPage()),
    },
    {
      title: "Directory",
      slug: "directory",
      page_status: "published",
      seo_title: "Directory – The Public Market",
      seo_description: "Retail and food hall directory with available spaces at Public Market Emeryville.",
      puck_data: pmePuckData("Directory", buildDirectoryPage()),
    },
    {
      title: "Events",
      slug: "events",
      page_status: "published",
      seo_title: "Events – The Public Market",
      seo_description: "Live music, trivia, wine nights, and community events at Public Market Emeryville.",
      puck_data: pmePuckData("Events", buildEventsPage()),
    },
    {
      title: "Contact",
      slug: "contact",
      page_status: "published",
      seo_title: "Contact – The Public Market",
      seo_description: "General and leasing inquiries for Public Market Emeryville.",
      puck_data: pmePuckData("Contact", buildContactPage()),
    },
    {
      title: "Order Food",
      slug: "order-food",
      page_status: "published",
      seo_title: "ORDER FOOD + PURVEYOR HOURS – The Public Market",
      seo_description: "Order from multiple food hall purveyors and view hours at Public Market Emeryville.",
      puck_data: pmePuckData("Order Food", buildOrderFoodPage()),
    },
    {
      title: "Leasing",
      slug: "leasing",
      page_status: "published",
      seo_title: "Leasing – The Public Market",
      seo_description: "Food hall, office & life science, and adjacent retail leasing opportunities.",
      puck_data: pmePuckData("Leasing", buildLeasingHubPage()),
    },
    {
      title: "Food Hall Leasing",
      slug: "leasing-food-hall",
      page_status: "published",
      seo_title: "Food Hall – The Public Market",
      seo_description: "Lease a food hall unit at Public Market Emeryville.",
      puck_data: pmePuckData(
        "Food Hall Leasing",
        buildLeasingTypePage({ breadcrumb: "Leasing > Food Hall", kind: "food-hall" }),
      ),
    },
    {
      title: "Office & Life Science Leasing",
      slug: "leasing-office",
      page_status: "published",
      seo_title: "Office & Life Science – The Public Market",
      seo_description: "Office and life science leasing at Public Market Emeryville.",
      puck_data: pmePuckData(
        "Office & Life Science",
        buildLeasingTypePage({ breadcrumb: "Leasing > Office & Life Science", kind: "office" }),
      ),
    },
    {
      title: "Adjacent Retail Leasing",
      slug: "leasing-adjacent-retail",
      page_status: "published",
      seo_title: "Adjacent Retail – The Public Market",
      seo_description: "Adjacent retail leasing at Public Market Emeryville.",
      puck_data: pmePuckData(
        "Adjacent Retail",
        buildLeasingTypePage({ breadcrumb: "Leasing > Adjacent Retail", kind: "retail" }),
      ),
    },
  ];

  for (const event of PME_EVENTS) {
    pages.push({
      title: event.title,
      slug: event.slug,
      page_status: "published",
      seo_title: `${event.title} – The Public Market`,
      seo_description: event.body.slice(0, 155),
      puck_data: pmePuckData(event.title, buildEventDetailPage(event)),
    });
  }

  for (const vendor of PME_VENDORS) {
    pages.push({
      title: vendor.title,
      slug: vendor.slug,
      page_status: "published",
      seo_title: `${vendor.title} – The Public Market`,
      seo_description: `${vendor.title} — ${vendor.category} at Public Market Emeryville.`,
      puck_data: pmePuckData(vendor.title, buildVendorDetailPage(vendor)),
    });
  }

  return pages;
}
