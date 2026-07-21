// @ts-nocheck

const PUBLIC_MARKET_THEME = {
  name: "Public Market Emeryville",
  slug: "public-market",
  is_active: true,
  config: {
    colors: {
      primary: "#595959",
      secondary: "#71717a",
      background: "#ffffff",
      foreground: "#494747",
      accent: "#6FA84C",
      text: "#494747",
      border: "#e4e4e7",
    },
    fonts: {
      heading: '"Faculty Glyphic", Georgia, serif',
      body: 'Roboto, ui-sans-serif, system-ui, sans-serif',
      accent: '"Caveat", cursive',
    },
    header: {
      backgroundColor: "transparent",
      textColor: "#ffffff",
      accentColor: "#6FA84C",
      sticky: false,
    },
    background: {
      bodyColor: "#ffffff",
    },
    spacing: {
      container: "1280px",
      section: "4rem",
    },
  },
};

const DEFAULT_THEME = {
  name: "Default",
  slug: "default",
  is_active: false,
  config: {
    colors: {
      primary: "#18181b",
      secondary: "#71717a",
      background: "#ffffff",
      foreground: "#09090b",
      accent: "#3b82f6",
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    spacing: {
      container: "1280px",
      section: "4rem",
    },
  },
};

const BLOG_THEME = {
  name: "Blog",
  slug: "blog",
  is_active: false,
  config: {
    colors: {
      primary: "#1e3a5f",
      secondary: "#64748b",
      background: "#fafafa",
      foreground: "#0f172a",
      accent: "#0ea5e9",
    },
    fonts: {
      heading: "Georgia, serif",
      body: "Inter, system-ui, sans-serif",
    },
    spacing: {
      container: "960px",
      section: "3rem",
    },
  },
};

const E2M_THEME = {
  name: "E2M Solutions",
  slug: "e2m",
  is_active: false,
  config: {
    colors: {
      primary: "#1638FB",
      secondary: "#666666",
      background: "#ffffff",
      foreground: "#1C1C1C",
      accent: "#1638FB",
      border: "#E7E7E7",
      text: "#1C1C1C",
    },
    fonts: {
      heading: '"New Grotesk", Roboto, system-ui, -apple-system, Segoe UI, sans-serif',
      body: '"New Grotesk", Roboto, system-ui, -apple-system, Segoe UI, sans-serif',
    },
    header: {
      backgroundColor: "transparent",
      textColor: "#ffffff",
      accentColor: "#1638FB",
      sticky: true,
    },
    background: {
      bodyColor: "#ffffff",
    },
    spacing: {
      container: "1280px",
      section: "5rem",
    },
    customCss: "",
  },
};

const E2M_CUSTOM_CSS = `
/* E2M Solutions — additional site CSS */
body {
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 {
  font-weight: 500;
}
.e2m-btn-primary {
  background-color: #1638FB;
  color: #fff;
  border-radius: 4px;
  font-weight: 600;
}
`;

const E2M_HEADER_MENU = {
  name: "E2M Main Navigation",
  location: "header",
  items: [
    { id: "e1", label: "Website Services", url: "https://www.e2msolutions.com/white-label-website-design-development/", order: 0, children: [] },
    { id: "e2", label: "Digital Marketing", url: "https://www.e2msolutions.com/white-label-digital-marketing-services/", order: 1, children: [] },
    { id: "e3", label: "AI Services", url: "https://www.e2msolutions.com/white-label-ai-solutions-for-agencies/", order: 2, children: [] },
    { id: "e4", label: "About E2M", url: "https://www.e2msolutions.com/about-us/", order: 3, children: [] },
    { id: "e5", label: "Resources", url: "https://www.e2msolutions.com/blog/", order: 4, children: [] },
  ],
};

const E2M_FOOTER_MENU = {
  name: "E2M Footer Links",
  location: "footer",
  items: [
    { id: "ef1", label: "About E2M", url: "https://www.e2msolutions.com/about-us/", order: 0 },
    { id: "ef2", label: "Blog", url: "https://www.e2msolutions.com/blog/", order: 1 },
    { id: "ef3", label: "Contact", url: "https://www.e2msolutions.com/contact-us/", order: 2 },
    { id: "ef4", label: "Book a Growth Call", url: "https://www.e2msolutions.com/book-a-growth-call/", order: 3 },
  ],
};

const HEADER_MENU = {
  name: "Main Navigation",
  location: "header",
  items: [
    { id: "1", label: "Vendors", url: "/vendors", order: 0, children: [] },
    {
      id: "2",
      label: "Leasing",
      url: "/leasing",
      order: 1,
      children: [
        { id: "2a", label: "Food Hall", url: "/leasing-food-hall", order: 0 },
        { id: "2b", label: "Office & Life Science", url: "/leasing-office", order: 1 },
        { id: "2c", label: "Adjacent Retail", url: "/leasing-adjacent-retail", order: 2 },
      ],
    },
    { id: "3", label: "Directory", url: "/directory", order: 2, children: [] },
    { id: "4", label: "Events", url: "/events", order: 3, children: [] },
    { id: "5", label: "Order Food", url: "/order-food", order: 4, children: [] },
    { id: "6", label: "Contact", url: "/contact", order: 5, children: [] },
  ],
};

const FOOTER_MENU = {
  name: "Footer Links",
  location: "footer",
  items: [
    { id: "f1", label: "Vendors", url: "/vendors", order: 0 },
    { id: "f2", label: "News & Events", url: "/events", order: 1 },
    { id: "f3", label: "Directory", url: "/directory", order: 2 },
    { id: "f4", label: "Order Food", url: "/order-food", order: 3 },
    { id: "f5", label: "Contact", url: "/contact", order: 4 },
  ],
};

async function upsertMenu(
  strapi: import("@strapi/strapi").Core.Strapi,
  menu: typeof HEADER_MENU,
) {
  const existing = await strapi.db.query("api::menu.menu").findOne({
    where: { location: menu.location },
  });

  if (existing) {
    await strapi.documents("api::menu.menu").update({
      documentId: existing.documentId,
      data: { name: menu.name, items: menu.items },
    });
    strapi.log.info(`Menu updated: ${menu.name}`);
    return;
  }

  await strapi.documents("api::menu.menu").create({ data: menu });
  strapi.log.info(`Menu seeded: ${menu.name}`);
}

export async function seedAppearance(strapi: import("@strapi/strapi").Core.Strapi) {
  // Site settings — Public Market is the default homepage; E2M lives at /e2m
  const existingSettings = await strapi.db.query("api::site-setting.site-setting").findOne({});
  const siteSettingsData = {
    site_name: "The Public Market",
    tagline: "More than just a food hall",
    homepage_slug: "home",
    header_background: "#ffffff",
    custom_css: "",
    widget_areas: {
      sidebar: [
        { id: "w1", type: "text", title: "About", content: "Welcome to The Public Market." },
      ],
    },
  };
  if (!existingSettings) {
    await strapi.documents("api::site-setting.site-setting").create({ data: siteSettingsData });
    strapi.log.info("Site settings seeded");
  } else {
    await strapi.documents("api::site-setting.site-setting").update({
      documentId: existingSettings.documentId,
      data: siteSettingsData,
    });
  }

  // Themes — sync public market as active starter theme
  for (const theme of [PUBLIC_MARKET_THEME, DEFAULT_THEME, BLOG_THEME, E2M_THEME]) {
    const existing = await strapi.db.query("api::theme.theme").findOne({ where: { slug: theme.slug } });
    if (!existing) {
      await strapi.documents("api::theme.theme").create({ data: theme });
      strapi.log.info(`Theme seeded: ${theme.name}`);
      continue;
    }

    await strapi.documents("api::theme.theme").update({
      documentId: existing.documentId,
      data: {
        name: theme.name,
        config: theme.config,
        is_active: theme.is_active,
      },
    });
    strapi.log.info(`Theme updated: ${theme.name}`);
  }

  // Menus
  for (const menu of [HEADER_MENU, FOOTER_MENU]) {
    await upsertMenu(strapi, menu);
  }
}
