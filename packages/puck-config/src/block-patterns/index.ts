import type { PuckData } from "@nextpress/shared";
import {
  buildStarterHomeBlocks,
  buildPublicMarketHomePuckData,
  buildPublicMarketCoreHomePuckData,
  buildE2MHomePuckData,
} from "@nextpress/shared";

export type BlockPatternKind = "section" | "page";

export interface BuiltinBlockPattern {
  id: string;
  name: string;
  description?: string;
  category: string;
  kind: BlockPatternKind;
  puckData: PuckData;
}

function section(id: string, block: { type: string; props: Record<string, unknown> }): PuckData {
  return { content: [block], root: { props: {} } };
}

/** Built-in patterns users insert from the Puck editor — raw blocks only. */
export const BUILTIN_BLOCK_PATTERNS: BuiltinBlockPattern[] = [
  {
    id: "section-hero",
    kind: "section",
    name: "Video / image hero",
    description: "Background media with title and subtitle. Add Button blocks separately for CTAs.",
    category: "hero",
    puckData: section("hero", {
      type: "HeroBanner",
      props: {
        id: "hero",
        videoUrl: "",
        title: "Welcome to",
        titleHighlight: "Your Site",
        subtitle: "Add your hero subtitle.",
        overlayOpacity: 55,
        minHeight: "lg",
      },
    }),
  },
  {
    id: "section-nav",
    kind: "section",
    name: "Navigation bar",
    description: "Standard header with logo, links, and optional CTA.",
    category: "navigation",
    puckData: section("nav", {
      type: "NavBar",
      props: {
        id: "nav",
        brandLabel: "Your Brand",
        brandHref: "/",
        logoUrl: "",
        links: [
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
      },
    }),
  },
  {
    id: "section-item-grid",
    kind: "section",
    name: "Filterable item grid",
    description: "Generic grid with optional category filters.",
    category: "directory",
    puckData: section("item-grid", {
      type: "FilterGrid",
      props: {
        id: "item-grid",
        sectionTitle: "Items",
        showFilters: true,
        columns: "3",
        items: [
          {
            id: "1",
            title: "Item one",
            category: "Category A",
            description: "Short description",
            imageUrl: "",
            linkUrl: "#",
          },
        ],
      },
    }),
  },
  {
    id: "section-intro-split",
    kind: "section",
    name: "Intro + media split",
    description: "Two-column intro with image or video beside copy.",
    category: "content",
    puckData: section("intro-split", {
      type: "ContentMedia",
      props: {
        id: "intro-split",
        title: "Section title",
        content: "Replace this paragraph with your content.",
        mediaType: "image",
        mediaPosition: "right",
        desktopImageUrl: "",
        mediaAlt: "",
        paddingY: "lg",
      },
    }),
  },
  {
    id: "section-info-cards",
    kind: "section",
    name: "Info cards row",
    description: "Composable info boxes — use Columns to place multiple InfoCard blocks.",
    category: "content",
    puckData: section("info-card", {
      type: "InfoCard",
      props: {
        id: "info-card",
        label: "Details",
        lines: "Line one\nLine two",
        alignment: "center",
      },
    }),
  },
  {
    id: "section-newsletter",
    kind: "section",
    name: "Newsletter signup",
    description: "Email capture form block.",
    category: "forms",
    puckData: section("newsletter", {
      type: "ContactForm",
      props: {
        id: "newsletter",
        formId: "newsletter",
        title: "Join our mailing list",
        description: "Keep up to date about news and events.",
        submitLabel: "Subscribe",
        successMessage: "Thank you for subscribing!",
        columns: "1",
        fields: [
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "your@email.com",
          },
        ],
      },
    }),
  },
  {
    id: "template-public-market",
    kind: "page",
    name: "Public Market Emeryville",
    description:
      "Full food-hall homepage composed from raw blocks. Apply in the editor, then save to CMS.",
    category: "templates",
    puckData: buildPublicMarketHomePuckData() as PuckData,
  },
  {
    id: "template-public-market-core",
    kind: "page",
    name: "Public Market (Core Blocks)",
    description:
      "Same Public Market homepage using core Puck blocks only — no CustomBlock-* types. Compare with the custom-block template.",
    category: "templates",
    puckData: buildPublicMarketCoreHomePuckData() as PuckData,
  },
  {
    id: "template-e2m-homepage",
    kind: "page",
    name: "E2M Solutions",
    description:
      "Full E2M homepage clone composed from CMS custom blocks + core blocks. Apply in the editor, then save to CMS.",
    category: "templates",
    puckData: buildE2MHomePuckData() as PuckData,
  },
  {
    id: "template-starter-homepage",
    kind: "page",
    name: "Starter homepage",
    description: "Minimal raw blocks — nav, hero, intro, footer. Extend in the page builder.",
    category: "templates",
    puckData: {
      root: { props: { title: "Home" } },
      content: buildStarterHomeBlocks(),
    },
  },
  {
    id: "template-blank-hero-page",
    kind: "page",
    name: "Blank hero landing",
    description: "Nav + hero only — add more blocks from the builder.",
    category: "templates",
    puckData: {
      root: { props: { title: "Home" } },
      content: [
        {
          type: "NavBar",
          props: {
            id: "nav-1",
            brandLabel: "Your Brand",
            brandHref: "/",
            links: [{ label: "About", href: "#" }],
          },
        },
        {
          type: "HeroBanner",
          props: {
            id: "hero-1",
            videoUrl: "",
            title: "Welcome to",
            titleHighlight: "Your Site",
            subtitle: "Add blocks below to build your page.",
            minHeight: "lg",
          },
        },
      ],
    },
  },
];

export function getBuiltinBlockPattern(id: string): BuiltinBlockPattern | undefined {
  return BUILTIN_BLOCK_PATTERNS.find((pattern) => pattern.id === id);
}
