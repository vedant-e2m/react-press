type DemoBlock = {
  type: string;
  props: Record<string, unknown>;
};

function block(type: string, id: string, props: Record<string, unknown>): DemoBlock {
  return { type, props: { id, ...props } };
}

export const DEMO_PAGES = [
  {
    title: "Home",
    slug: "home",
    page_status: "published" as const,
    seo_title: "NextPress — Build beautiful sites",
    seo_description: "Demo homepage built with Puck blocks.",
    puck_data: {
      root: { props: { title: "Home" } },
      content: [
        block("Hero", "home-hero", {
          title: "Build sites with drag and drop",
          subtitle:
            "NextPress combines Puck, Strapi, and Next.js so you can ship landing pages without writing code.",
          backgroundImage:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
          ctaText: "View services",
          ctaUrl: "/services",
          alignment: "center",
        }),
        block("Text", "home-intro", {
          content:
            "This is a demo homepage seeded automatically. Open the admin to edit blocks, publish changes, and preview drafts.",
          alignment: "center",
        }),
        block("Card", "home-card-1", {
          title: "Visual editor",
          description: "Drag Hero, Text, Gallery, and more onto the canvas.",
          imageUrl:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          linkUrl: "/admin/pages",
          linkText: "Open editor",
        }),
        block("Card", "home-card-2", {
          title: "Headless CMS",
          description: "Content lives in Strapi. Your Next.js site stays fast.",
          imageUrl:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          linkUrl: "/about",
          linkText: "About us",
        }),
        block("Card", "home-card-3", {
          title: "Publish instantly",
          description: "Hit publish in the editor and your page goes live at its slug.",
          imageUrl:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
          linkUrl: "/contact",
          linkText: "Get in touch",
        }),
        block("Gallery", "home-gallery", {
          columns: "3",
          images: [
            {
              src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
              alt: "Developer at laptop",
            },
            {
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
              alt: "Team collaboration",
            },
            {
              src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
              alt: "Meeting room",
            },
          ],
        }),
        block("Button", "home-cta", {
          label: "Go to admin",
          url: "/admin",
          variant: "primary",
          alignment: "center",
        }),
      ],
    },
  },
  {
    title: "About",
    slug: "about",
    page_status: "published" as const,
    seo_title: "About NextPress",
    puck_data: {
      root: { props: { title: "About" } },
      content: [
        block("Hero", "about-hero", {
          title: "About NextPress",
          subtitle: "A WordPress-like experience for React and Next.js teams.",
          alignment: "center",
        }),
        block("Text", "about-body-1", {
          content:
            "NextPress is an open-source platform for building marketing sites and landing pages. Editors use Puck to compose pages visually; developers extend the block library and theme.",
          alignment: "left",
        }),
        block("Spacer", "about-spacer", { height: "md" }),
        block("Divider", "about-divider", { style: "solid" }),
        block("Text", "about-body-2", {
          content:
            "This demo page is stored in Strapi as JSON (puck_data) and rendered by the Next.js frontend.",
          alignment: "left",
        }),
        block("Button", "about-cta", {
          label: "Back to home",
          url: "/",
          variant: "outline",
          alignment: "left",
        }),
      ],
    },
  },
  {
    title: "Services",
    slug: "services",
    page_status: "published" as const,
    puck_data: {
      root: { props: { title: "Services" } },
      content: [
        block("Hero", "services-hero", {
          title: "What we offer",
          subtitle: "Three packages to get your site live quickly.",
          alignment: "center",
        }),
        block("Card", "services-card-1", {
          title: "Starter",
          description: "Landing page, contact form block, and basic SEO fields.",
          linkText: "Choose Starter",
          linkUrl: "/contact",
        }),
        block("Card", "services-card-2", {
          title: "Business",
          description: "Multi-page site, blog-ready Strapi collections, and media library.",
          linkText: "Choose Business",
          linkUrl: "/contact",
        }),
        block("Card", "services-card-3", {
          title: "Agency",
          description: "Custom blocks, themes, and plugin hooks for your clients.",
          linkText: "Contact sales",
          linkUrl: "/contact",
        }),
        block("Video", "services-video", {
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          caption: "Product walkthrough (demo embed)",
        }),
      ],
    },
  },
  {
    title: "Contact",
    slug: "contact",
    page_status: "published" as const,
    puck_data: {
      root: { props: { title: "Contact" } },
      content: [
        block("Hero", "contact-hero", {
          title: "Contact us",
          subtitle: "We'd love to hear about your project.",
          alignment: "center",
        }),
        block("Text", "contact-body", {
          content:
            "Email: hello@nextpress.dev\n\nThis demo uses the Text block. In Phase 2 you'll get a real Contact Form block with submissions.",
          alignment: "center",
        }),
        block("Spacer", "contact-spacer", { height: "lg" }),
        block("Button", "contact-cta", {
          label: "Edit this page",
          url: "/admin/pages",
          variant: "secondary",
          alignment: "center",
        }),
      ],
    },
  },
  {
    title: "Draft preview demo",
    slug: "draft-demo",
    page_status: "draft" as const,
    puck_data: {
      root: { props: { title: "Draft demo" } },
      content: [
        block("Hero", "draft-hero", {
          title: "This page is a draft",
          subtitle:
            "It won't appear on the public site until published. Use /preview/draft-demo to preview.",
          alignment: "center",
        }),
        block("Text", "draft-body", {
          content: "Publish this page from the admin editor to make it live at /draft-demo.",
          alignment: "center",
        }),
      ],
    },
  },
];
