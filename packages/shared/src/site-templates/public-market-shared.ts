/** Shared Public Market Emeryville assets, data, and page chrome. */

export const PME_ASSETS = {
  logo:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/publicmarketemeryville-logo-footer.svg",
  aboutLogo:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/Group-2719.svg",
  centerBadge:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/Group-2704.svg",
  heroVideo:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/3eb7d216.mp4",
  vendorBg:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/people-dining.webp",
  footerNewsletterBg:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/DTS_On_The_Job_Daniel_Faro_Photos_ID6637@2x.jpg",
  interiorHero:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/people-dining.webp",
  polaroid: [
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4923.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4924.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4925.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4926.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4927.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4928.jpg",
  ],
  follow: [
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/Public-market-060@2x.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/DTS_DIVE_BAR_Agustin_Farias_Photos_ID13701@2x.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4930.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4931.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4932.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/IMG_4933.jpg",
  ],
  lease: {
    foodHall:
      "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/Food-Hallsp.webp",
    office:
      "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/DTS_Banquet_Daniel_Faro_Photos_ID5376@2x.webp",
    retail:
      "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/TPM_Placeholder.jpg",
  },
  vendorThumb:
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/Alma-Y-Sazon-thumb-1024x827.jpg",
  events: [
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/Screenshot-2026-02-03-at-4.36.27-PM@2x.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/DTS_Local_Band_Allie_Lehman_Photos_ID2160@2x-1024x828.jpg",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/04/Screenshot-2026-04-30-at-3.07.02-PM-1024x679.png",
    "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/04/item-1600000000118719527_1764699227-1024x684.jpg",
  ],
} as const;

export const PME_ACCENT = "#6FA84C";
export const PME_TEXT = "#494747";

export type SeedBlock = { type: string; props: Record<string, unknown> };

/** Build a top-level Puck content block. */
export function pmeBlock(type: string, id: string, props: Record<string, unknown>): SeedBlock {
  return { type, props: { id, ...props } };
}

/** Build a nested slot block (Columns content, etc.). */
export function pmeSlot(type: string, id: string, props: Record<string, unknown>) {
  return { type, props: { id, ...props } };
}

export type PmeVendor = {
  id: string;
  slug: string;
  title: string;
  category: string;
  filterCategory: "Food & Drink" | "Health & Fitness" | "Shop";
  order?: boolean;
  book?: boolean;
};

export const PME_VENDORS: PmeVendor[] = [
  { id: "alma", slug: "alma-y-sazon", title: "Alma Y Sazon", category: "Vegan Mexican", filterCategory: "Food & Drink", order: true },
  { id: "bruce", slug: "bruces-barbershop", title: "Bruce's Barbershop", category: "Barber Shop", filterCategory: "Shop", book: true },
  { id: "corepower", slug: "corepower-yoga", title: "CorePower Yoga", category: "In-Studio Yoga Classes", filterCategory: "Health & Fitness", book: true },
  { id: "demiya", slug: "demiya", title: "Demiya", category: "Western-Inspired Japanese", filterCategory: "Food & Drink", order: true },
  { id: "dental", slug: "emeryville-dental-care", title: "Emeryville Dental Care", category: "Dental Care", filterCategory: "Health & Fitness" },
  { id: "guitar", slug: "guitar-center", title: "Guitar Center", category: "Instruments & Equipment", filterCategory: "Shop" },
  { id: "jayna", slug: "jayna-gyro", title: "Jayna Gyro", category: "Mediterranean & Greek", filterCategory: "Food & Drink", order: true },
  { id: "juice", slug: "juice-house-co", title: "Juice House Co.", category: "Cold-Pressed Juices", filterCategory: "Food & Drink" },
  { id: "koja", slug: "koja-kitchen", title: "Koja Kitchen", category: "Korean-Japanese Reinvented", filterCategory: "Food & Drink", order: true },
  { id: "konarq", slug: "konarq", title: "Konarq", category: "Indian Cuisine", filterCategory: "Food & Drink", order: true },
  { id: "marine", slug: "le-marine-fish-grill", title: "Le Marine Fish & Grill", category: "Seafood", filterCategory: "Food & Drink", order: true },
  { id: "dewie", slug: "mr-dewies-cashew-creamery", title: "Mr. Dewie's Cashew Creamery", category: "Ice Cream", filterCategory: "Food & Drink", order: true },
  { id: "nabiq", slug: "nabiq", title: "NabiQ", category: "Korean BBQ", filterCategory: "Food & Drink" },
  { id: "naru", slug: "naru-sushi", title: "Naru Sushi", category: "Japanese Cuisine", filterCategory: "Food & Drink", order: true },
  { id: "orange", slug: "orangetheory-fitness", title: "Orangetheory Fitness", category: "Fitness Studio", filterCategory: "Health & Fitness", book: true },
  { id: "paradita", slug: "paradita-eatery", title: "Paradita Eatery", category: "Peruvian Street Food", filterCategory: "Food & Drink", order: true },
  { id: "peets", slug: "peets-coffee-and-tea", title: "Peet's Coffee and Tea", category: "Coffee & Tea", filterCategory: "Food & Drink" },
  { id: "pig", slug: "pig-in-a-pickle", title: "Pig in a Pickle", category: "House-made BBQ", filterCategory: "Food & Drink", order: true },
  { id: "mercato", slug: "pizzeria-mercato", title: "Pizzeria Mercato", category: "Italian", filterCategory: "Food & Drink", order: true },
  { id: "blush", slug: "public-bar-by-blush", title: "Public Bar by Blush", category: "Beverages", filterCategory: "Food & Drink" },
  { id: "hiroshi", slug: "ramen-hiroshi", title: "Ramen Hiroshi", category: "Authentic Japanese Cuisine", filterCategory: "Food & Drink", order: true },
  { id: "super", slug: "super-duper-burgers", title: "Super Duper Burgers", category: "Burgers, Fries & Shakes", filterCategory: "Food & Drink", order: true },
  { id: "tease", slug: "tease-southern-kitchen", title: "Tease Southern Kitchen", category: "Cajun Fusion Cuisine", filterCategory: "Food & Drink", order: true },
  { id: "lounge", slug: "the-lounge-nail-spa", title: "The Lounge Nail Spa", category: "Spa & Nail Salon", filterCategory: "Health & Fitness", book: true },
];

export type PmeEvent = {
  slug: string;
  title: string;
  meta: string;
  tags: string;
  imageUrl: string;
  body: string;
};

export const PME_EVENTS: PmeEvent[] = [
  {
    slug: "live-music-thursdays",
    title: "Live Music Thursday's",
    meta: "Thursday, March XX | 3pm",
    tags: "Community, Culture",
    imageUrl: PME_ASSETS.events[0],
    body:
      "Sound Bites is Emeryville Public Market's weekly live music series, bringing fresh energy to the Market every Friday night. Featuring a rotating lineup of talented local musicians, it is a great place to unwind, discover emerging Bay Area artists, and enjoy everything the Market has to offer.",
  },
  {
    slug: "wine-wednesdays-at-pizzeria-mercato",
    title: "Wine Wednesdays at Pizzeria Mercato",
    meta: "Every Wednesday",
    tags: "Community, Culture",
    imageUrl: PME_ASSETS.events[1],
    body:
      "No corkage fee at Pizzeria Mercato on Wednesdays! Limit 2 wine bottles per table. Ask server for details.",
  },
  {
    slug: "brainstormer-trivia-tuesday",
    title: "Brainstormer Trivia Tuesday",
    meta: "Every Tuesday",
    tags: "Culture, Events",
    imageUrl: PME_ASSETS.events[2],
    body:
      "Gather your crew—it's time for Weekly Trivia, hosted by the quiz masters at Brainstormer Trivia. Just bring your sharpest wits and a fierce team spirit. You can fuel up for the challenge by exploring our amazing selection of almost endless food options.",
  },
  {
    slug: "game-nights",
    title: "Game Nights",
    meta: "Wednesday, March XX | 3pm",
    tags: "Community, Culture, News",
    imageUrl: PME_ASSETS.events[3],
    body:
      "Join neighbors and friends for Game Nights at the Public Market. Bring a competitive spirit, grab a bite, and make it a weekly tradition.",
  },
];

export const PME_DIRECTORY_RETAIL = [
  { title: "Upside Foods", size: "17,342 RSF" },
  { title: "Streamline Events", size: "9,721 RSF" },
  { title: "One Workplace", size: "5,481 RSF" },
  { title: "Orange Theory", size: "3,000 RSF" },
  { title: "Available", size: "11,460 RSF" },
  { title: "Guitar Center", size: "17,174 RSF" },
  { title: "Corepower Yoga", size: "3,500 RSF" },
  { title: "The Lounge Nail Spa", size: "1,243 RSF" },
  { title: "Available", size: "987 RSF" },
  { title: "Available", size: "858 RSF" },
  { title: "Available", size: "4,141 RSF" },
  { title: "Dr. Magno, DDS", size: "1,126 RSF" },
  { title: "Available", size: "1,114 RSF" },
  { title: "Property Management", size: "2,787 RSF" },
  { title: "Available", size: "1,127 RSF" },
] as const;

export const PME_DIRECTORY_FOOD_HALL = [
  { title: "Paradita", size: "1,486 RSF" },
  { title: "Peet's Coffee", size: "936 RSF" },
  { title: "Super Duper Burger", size: "2,652 RSF" },
  { title: "Juice House Co.", size: "334 RSF" },
  { title: "Available", size: "334 RSF" },
  { title: "Mr. Dewie's", size: "334 RSF" },
  { title: "Demiya", size: "774 RSF" },
  { title: "Alma Y Sazon", size: "858 RSF" },
  { title: "Available", size: "870 RSF" },
  { title: "The Market Bar", size: "1,742 RSF" },
  { title: "Available", size: "1,040 RSF" },
  { title: "Mamacita", size: "980 RSF" },
  { title: "Naru Sushi", size: "930 RSF" },
  { title: "Konarq", size: "920 RSF" },
  { title: "Hiroshi Ramen", size: "850 RSF" },
  { title: "Available", size: "840 RSF" },
  { title: "Nabiq", size: "1,190 RSF" },
  { title: "Tarla Mediterranean", size: "886 RSF" },
  { title: "La Marine Fish", size: "900 RSF" },
  { title: "Southern Tease Kitchen", size: "900 RSF" },
  { title: "Pig In Pickle", size: "872 RSF" },
  { title: "Available", size: "1,026 RSF" },
  { title: "Available", size: "922 RSF" },
  { title: "Available", size: "522 RSF" },
  { title: "Pizzeria Mercato", size: "3,200 RSF" },
  { title: "Sweetgreen", size: "2,035 RSF" },
] as const;

export const PME_PURVEYOR_HOURS = [
  { title: "Baby Cafe", hours: "Open Tuesday – Sunday from 11:30am-8pm\nClosed Monday" },
  { title: "Hiroshi Ramen", hours: "Open Sunday – Thursday from 11:30am-7:30pm\nOpen Saturday – Sunday from 11:30am-8:00pm" },
  { title: "Jayna Gyro", hours: "Open Sunday – Thursday from 11am-8pm\nOpen Friday – Saturday from 11am-8:30pm" },
  { title: "Juice House Co.", hours: "Open Daily from 10am-8pm" },
  { title: "Koja Kitchen", hours: "Open Monday – Friday from 11:00am-7:30pm\nOpen Saturday and Sunday from 11:30am-8:00pm" },
  { title: "Konarq Indian Cuisine", hours: "Sunday – Thursday from 11:30am-7pm\nOpen Saturday from 11:30am-7:30pm" },
  { title: "Pacific Fish & Grill", hours: "Open Sunday-Thursday from 10:30am-8:00pm\nOpen Friday and Saturday from 10:30am-8:45pm" },
  { title: "Mr. Dewies Cashew Creamery", hours: "Open Sunday – Thursday from Noon-8pm\nOpen Friday – Saturday from Noon-9pm" },
  { title: "NabiQ", hours: "Open Sunday – Thursday from 10:30am-8pm\nOpen Friday – Saturday from 10:30am-9pm" },
  { title: "Naru Sushi", hours: "Open Sunday – Thursday from 11am-8pm\nOpen Friday – Saturday from 11am-9pm" },
  { title: "Paradita Eatery", hours: "Open Sunday – Thursday from 11am-8pm\nFriday – Saturday from 11:30am-8:30pm\nClosed Mondays" },
  { title: "Peet's Coffee", hours: "Open Monday – Friday from 5:30am-6pm\nOpen Saturday-Sunday from 6am-6pm" },
  { title: "Pig in a Pickle", hours: "Open Sunday – Saturday from 11am-8pm" },
  { title: "Pizzeria Mercato", hours: "Open Sunday – Thursday from 11am–9pm\nOpen Friday – Saturday from 11am-10pm" },
  {
    title: "Public Bar by Blush",
    hours:
      "Open Monday – Thursday from 3pm-9pm\nOpen Friday from 3pm-10pm\nOpen Saturday from Noon-10pm\nOpen Sunday from Noon-8pm\nHappy Hour drink specials Monday-Friday from 3pm-5pm",
  },
  { title: "Super Duper Burgers", hours: "Open Sunday – Thursday from 10am-9:30pm\nOpen Friday – Saturday from 10am-10pm" },
  { title: "Sweetgreen", hours: "Coming Soon!" },
] as const;

export const PME_LEASING_UNITS = {
  "food-hall": [
    { id: "fh-11", title: "Unit 11", size: "980 RSF" },
    { id: "fh-6", title: "Unit 6", size: "870 RSF" },
    { id: "fh-1", title: "Unit 1", size: "522 RSF" },
  ],
  office: [
    { id: "of-20", title: "Unit 20", size: "1,330 RSF" },
    { id: "of-17", title: "Unit 17", size: "1,100 RSF" },
    { id: "of-11", title: "Unit 11", size: "980 RSF" },
    { id: "of-6", title: "Unit 6", size: "870 RSF" },
  ],
  retail: [
    { id: "rt-11", title: "Unit 11", size: "980 RSF" },
    { id: "rt-6", title: "Unit 6", size: "870 RSF" },
    { id: "rt-1", title: "Unit 1", size: "522 RSF" },
  ],
} as const;

export const PME_NAV_LINKS = [
  { label: "Vendors", href: "/vendors" },
  { label: "Leasing", href: "/leasing" },
  { label: "Directory", href: "/directory" },
  { label: "Events", href: "/events" },
  { label: "Order Food", href: "/order-food" },
  { label: "Contact", href: "/contact" },
];

const LEASING_UNIT_BLURBS =
  "Access shared utilities, seating areas, cleaning services, security, and maintenance. Operate alongside other chefs and entrepreneurs for a vibrant customer experience. Plug-and-play or partially built-out spaces reduce upfront investment.";

/** Shared announcement + drawer NavBar used across PME pages. */
export function pmeAnnouncementBar(id = "announce"): SeedBlock {
  return pmeBlock("AnnouncementBar", id, {
    messages: [
      { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      { text: "Welcome to The Public Market Emeryville — food, fitness, and community." },
    ],
    backgroundColor: "#000000",
    textColor: PME_ACCENT,
    showArrows: true,
  });
}

/** Shared announcement + drawer NavBar used across PME pages. */
export function pmeNavBar(opts: { id?: string; transparent?: boolean } = {}): SeedBlock {
  const transparent = opts.transparent ?? false;
  return pmeBlock("NavBar", opts.id ?? "nav", {
    brandLabel: "Public Market",
    brandHref: "/",
    logoUrl: PME_ASSETS.logo,
    logoInvert: transparent,
    transparent,
    textColor: transparent ? "#ffffff" : "#111111",
    accentColor: PME_ACCENT,
    menuStyle: "drawer",
    ctaVariant: "text",
    backgroundColor: transparent ? undefined : "#ffffff",
    links: PME_NAV_LINKS,
    ctaLabel: "Order Food",
    ctaHref: "/order-food",
  });
}

/** Newsletter + SiteFooter columns used on every PME page. */
export function pmeFooterColumns(id = "footer-cols"): SeedBlock {
  return pmeBlock("Columns", id, {
    columns: "2",
    backgroundColor: "#1f1f1f",
    paddingTop: 0,
    paddingBottom: 0,
    maxWidth: "full",
    content: [
      pmeSlot("ContactForm", "newsletter", {
        formId: "newsletter",
        title: "Join our mailing list and keep up to date about market news & events",
        description: "",
        submitLabel: "Subscribe",
        successMessage: "Thank you for subscribing!",
        variant: "newsletter-overlay",
        backgroundImage: PME_ASSETS.footerNewsletterBg,
        overlayOpacity: 20,
        textColor: "#ffffff",
        buttonColor: PME_ACCENT,
        columns: "1",
        fields: [
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "email@email.com",
          },
        ],
      }),
      pmeSlot("SiteFooter", "footer", {
        copyright: "© Public Market Emeryville – 2026 All Rights Reserved.",
        backgroundColor: "#1f1f1f",
        textColor: "#ffffff",
        linkColor: "#ffffff",
        columnTitleColor: PME_ACCENT,
        logoBadgeUrl: PME_ASSETS.centerBadge,
        infoBox: {
          label: "Visit Us",
          lines:
            "Hours\nMon - Sat: 10am - 9pm\nSunday: 10am - 8pm\nClosed Thanksgiving, Christmas & New Year's Day\n\nLocation\n5959 Shellmound St. Emeryville, CA 94608",
          borderColor: PME_ACCENT,
          labelColor: PME_ACCENT,
        },
        columns: [
          {
            title: "Explore",
            links: [
              { label: "Vendors", href: "/vendors" },
              { label: "News & Events", href: "/events" },
            ],
          },
          {
            title: "Follow Us",
            links: [
              { label: "Instagram", href: "https://instagram.com/publicmarketemeryville" },
              { label: "Facebook", href: "#" },
            ],
          },
          {
            title: "Leasing",
            links: [
              { label: "Adjacent Retail", href: "/leasing-adjacent-retail" },
              { label: "Food Hall", href: "/leasing-food-hall" },
              { label: "Office & Life Science", href: "/leasing-office" },
            ],
          },
          {
            title: "Leasing Contact",
            links: [{ label: "Email TBD", href: "mailto:" }],
          },
        ],
      }),
    ],
  });
}

/** Map vendors into FilterGrid item props (flat `/[slug]` routes). */
export function pmeVendorItems(opts: { useFilterCategories?: boolean } = {}) {
  return PME_VENDORS.map((v) => {
    const href = `/${v.slug}`;
    const base = {
      id: v.id,
      title: v.title,
      category: opts.useFilterCategories ? v.filterCategory : v.category,
      description: v.category,
      imageUrl: PME_ASSETS.vendorThumb,
      linkUrl: href,
      primaryCtaLabel: "Learn More",
      primaryCtaUrl: href,
    };
    if (v.order) {
      return { ...base, secondaryCtaLabel: "Order Food", secondaryCtaUrl: "/order-food" };
    }
    if (v.book) {
      return { ...base, secondaryCtaLabel: "Book Now", secondaryCtaUrl: href };
    }
    return base;
  });
}

/** Leasing unit cards for FilterGrid. */
export function pmeLeasingUnitItems(kind: keyof typeof PME_LEASING_UNITS) {
  return PME_LEASING_UNITS[kind].map((u) => ({
    id: u.id,
    title: u.title,
    category: u.size,
    description: LEASING_UNIT_BLURBS,
    primaryCtaLabel: "Inquire Now",
    primaryCtaUrl: "/contact",
    secondaryCtaLabel: "View Map",
    secondaryCtaUrl: "/directory",
  }));
}

/** Wrap page body blocks with shared chrome. */
export function withPmeChrome(
  body: SeedBlock[],
  opts: { transparentNav?: boolean } = {},
): SeedBlock[] {
  return [
    pmeAnnouncementBar(),
    pmeNavBar({ transparent: opts.transparentNav }),
    ...body,
    pmeFooterColumns(),
  ];
}

/** Standard puck_data envelope. */
export function pmePuckData(title: string, content: SeedBlock[]) {
  return {
    root: { props: { title } },
    content,
  };
}
