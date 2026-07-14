import type { PuckData } from "@nextpress/shared";
import type { DesignExportParseResult, DesignScreen } from "./parse-design-export";
import { pickPrimaryScreen, screensForGallery, slugify } from "./parse-design-export";

const COINBASE_ACCENT = "#A855F7";
const COINBASE_DARK = "#1C1C1C";

type CoreBlock = { type: string; props: Record<string, unknown> };

function block(type: string, id: string, props: Record<string, unknown>): CoreBlock {
  return { type, props: { id, ...props } };
}

function navLinks(screenNames: string[]) {
  const priority = [
    "Overview",
    "Users",
    "Agents",
    "Cards",
    "Bitcoin & Ethereum",
    "Payments",
    "Transactions",
    "Statistics",
    "Wallet",
    "Trade",
    "Settings",
    "Logout",
  ];

  const ordered = [
    ...priority.filter((name) => screenNames.includes(name)),
    ...screenNames.filter((name) => !priority.includes(name) && !/modal/i.test(name)),
  ];

  return ordered.slice(0, 10).map((label) => ({
    label,
    href: `#${slugify(label)}`,
  }));
}

function dashboardMetrics() {
  return [
    { value: "1.2k+", label: "Total Users" },
    { value: "850+", label: "Total Agents" },
    { value: "2.4k+", label: "Total Transactions" },
  ];
}

function transactionFeatures() {
  return [
    { title: "Visa Platinum", description: "Amount paid: $12,450 · Status: Active" },
    { title: "Visa Gold & Credit Card", description: "Amount paid: $8,320 · Status: Active" },
    { title: "UK Physical Card", description: "Amount paid: $5,100 · Status: Pending" },
    { title: "UK Virtual Card", description: "Amount paid: $3,780 · Status: Active" },
  ];
}

function managementServices(screen: DesignScreen | undefined, title: string, description: string) {
  return block("ServiceSection", `coinbase-${slugify(title)}`, {
    title,
    description,
    services: [
      {
        title: "Active accounts",
        description: "Monitor live accounts, statuses, and recent activity from the admin dashboard.",
        href: screen ? screen.publicUrl : "#",
      },
      {
        title: "Pending reviews",
        description: "Review pending signups, agent requests, and payment approvals in one place.",
        href: "#",
      },
      {
        title: "Account actions",
        description: "Open the original imported screen to compare layout details and workflows.",
        href: screen ? screen.publicUrl : "#",
      },
    ],
    ctaLabel: `Open ${title}`,
    ctaHref: screen ? screen.publicUrl : "#",
    backgroundColor: COINBASE_DARK,
    accentColor: COINBASE_ACCENT,
    linkColor: COINBASE_ACCENT,
  });
}

function findScreen(parseResult: DesignExportParseResult, name: string, role: DesignScreen["role"] = "admin") {
  return (
    parseResult.screens.find((s) => s.theme === "light" && s.role === role && s.name === name) ??
    parseResult.screens.find((s) => s.name === name)
  );
}

export function mapDesignExportToCoreBlocks(
  parseResult: DesignExportParseResult,
  options: { title: string; slug: string },
): PuckData {
  const primary = pickPrimaryScreen(parseResult.screens);
  const galleryScreens = screensForGallery(parseResult.screens, 8);
  const brand = options.title.includes("Coin") ? "CoinBase" : parseResult.documentName;

  const usersScreen = findScreen(parseResult, "Users");
  const agentsScreen = findScreen(parseResult, "Agents");
  const paymentsScreen = findScreen(parseResult, "Payments");
  const cryptoScreen = findScreen(parseResult, "Bitcoin & Ethereum");
  const statisticsScreen = findScreen(parseResult, "Statistics");
  const cardsScreen = findScreen(parseResult, "Cards");
  const walletScreen = findScreen(parseResult, "Wallet");
  const tradeScreen = findScreen(parseResult, "Trade");

  const content: CoreBlock[] = [
    block("NavBar", "coinbase-nav", {
      brandLabel: brand,
      brandHref: "#overview",
      links: navLinks(parseResult.screenNames),
      ctaLabel: "Admin Panel",
      ctaHref: primary?.publicUrl ?? "#overview",
      sticky: true,
      backgroundColor: "#FFFFFF",
      textColor: "#1C1C1C",
      accentColor: COINBASE_ACCENT,
    }),
    block("Text", "coinbase-intro", {
      content:
        "This page was built from the imported CoinBase Web Dashboard design kit using only core NextPress blocks — NavBar, StatRow, PromoBanner, FeatureGrid, ServiceSection, SplitPanel, Card, Image, and Gallery.",
      alignment: "center",
      fontSize: "md",
      padding: "md",
      maxWidth: "3xl",
    }),
    block("Image", "coinbase-overview", {
      src: primary?.publicUrl ?? "",
      alt: "CoinBase dashboard overview",
      caption: "Imported Admin Overview screen",
      rounded: true,
      maxWidth: "6xl",
    }),
    block("StatRow", "coinbase-stats", {
      items: dashboardMetrics(),
      accentColor: COINBASE_ACCENT,
      columns: "3",
    }),
    block("PromoBanner", "coinbase-welcome", {
      title: "Welcome Back",
      description:
        "Manage users, agents, cards, crypto assets, and transactions from a single admin workspace.",
      buttonLabel: "Learn More",
      buttonHref: primary?.publicUrl ?? "#",
      theme: "blue",
      buttonColor: COINBASE_ACCENT,
    }),
    block("SectionHeading", "coinbase-transactions-heading", {
      title: "Transaction Rate by",
      highlight: "Nature",
      description: "Track payment methods, card types, and transaction volume across your platform.",
      alignment: "left",
      highlightColor: COINBASE_ACCENT,
    }),
    block("FeatureGrid", "coinbase-transaction-types", {
      title: "Payment methods",
      highlight: "overview",
      description: "Mapped from the dashboard transaction rate section in the imported design.",
      features: transactionFeatures(),
      backgroundColor: COINBASE_DARK,
      highlightColor: COINBASE_ACCENT,
    }),
    block("SectionHeading", "coinbase-cards-heading", {
      title: "Cards &",
      highlight: "Wallets",
      description: "Card management screens imported from the design kit.",
      alignment: "left",
      highlightColor: COINBASE_ACCENT,
    }),
    block("Gallery", "coinbase-cards-gallery", {
      images: [cardsScreen, walletScreen, tradeScreen]
        .filter((screen): screen is DesignScreen => Boolean(screen))
        .map((screen) => ({ src: screen.publicUrl, alt: screen.name })),
      columns: "3",
      maxWidth: "6xl",
    }),
    managementServices(usersScreen, "Users", "User accounts, statuses, and profile management."),
    managementServices(agentsScreen, "Agents", "Agent onboarding, profiles, and operational controls."),
    managementServices(paymentsScreen, "Payments", "Payment activity, approvals, and reconciliation."),
    block("SplitPanel", "coinbase-crypto", {
      title: "Bitcoin & Ethereum",
      description:
        "Crypto balances, conversion tools, and asset management from the imported dashboard screens.",
      linkLabel: "Open crypto screen",
      linkUrl: cryptoScreen?.publicUrl ?? "#",
      bullets: [
        { text: "Monitor BTC and ETH balances in real time" },
        { text: "Convert between assets with admin controls" },
        { text: "View historical trends and portfolio activity" },
      ],
      imageUrl: cryptoScreen?.publicUrl ?? statisticsScreen?.publicUrl,
      backgroundColor: "#F8F5FF",
      linkColor: COINBASE_ACCENT,
    }),
    block("SectionHeading", "coinbase-stats-heading", {
      title: "Analytics &",
      highlight: "Statistics",
      description: "Charts and performance insights from the imported statistics screen.",
      alignment: "center",
      highlightColor: COINBASE_ACCENT,
    }),
    block("Image", "coinbase-statistics", {
      src: statisticsScreen?.publicUrl ?? "",
      alt: "Statistics dashboard",
      caption: "Imported Statistics screen",
      rounded: true,
      maxWidth: "6xl",
    }),
    block("ArticleGrid", "coinbase-screens", {
      title: "Imported dashboard screens",
      description: "Quick links to key screens from the uploaded design export.",
      articles: galleryScreens.map((screen) => ({
        title: screen.name,
        href: screen.publicUrl,
        featured: screen.name === "Overview",
      })),
      linkColor: COINBASE_ACCENT,
    }),
    block("Gallery", "coinbase-all-screens", {
      images: galleryScreens.map((screen) => ({
        src: screen.publicUrl,
        alt: screen.name,
      })),
      columns: "4",
      maxWidth: "6xl",
    }),
    block("Card", "coinbase-reference-card", {
      title: "Design source",
      description:
        "Built from CoinBase Web Dashboard.zip (Figma export). Components use NextPress core blocks only — no custom import renderer.",
      imageUrl: primary?.publicUrl,
      linkUrl: "#overview",
      linkText: "View overview",
      maxWidth: "4xl",
    }),
    block("SiteFooter", "coinbase-footer", {
      copyright: `© ${new Date().getFullYear()} ${brand} Dashboard Prototype`,
      columns: [
        {
          title: "Dashboard",
          links: navLinks(parseResult.screenNames).slice(0, 4),
        },
        {
          title: "More",
          links: navLinks(parseResult.screenNames).slice(4, 8),
        },
      ],
      backgroundColor: COINBASE_DARK,
      linkColor: COINBASE_ACCENT,
    }),
  ];

  return {
    root: { props: { title: options.title } },
    content,
  };
}

export type DesignImportResult = {
  parseResult: DesignExportParseResult;
  puckData: PuckData;
  warnings: string[];
};

export function buildDesignImportResult(
  parseResult: DesignExportParseResult,
  options: { title: string; slug: string },
): DesignImportResult {
  const warnings: string[] = [];

  if (!parseResult.screens.some((s) => s.name === "Overview")) {
    warnings.push("No Overview screen found — using the first available PNG as the hero image.");
  }

  if (parseResult.screens.length === 0) {
    warnings.push("No PNG screens found in the zip.");
  }

  if (!parseResult.documentName.toLowerCase().includes("fig") && parseResult.screens.length > 0) {
    warnings.push("Detected a Figma/design-kit PNG export (not an Adobe XD file).");
  }

  return {
    parseResult,
    puckData: mapDesignExportToCoreBlocks(parseResult, options),
    warnings,
  };
}
