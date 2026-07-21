import type { BuilderDocument, BuilderElement, BuilderElementAdvanced, ResponsiveStyles } from "./types";
import { getBuilderWidget } from "./widgets";

const IMG = {
  hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  market: "https://images.unsplash.com/photo-1441986300917-6466bd253576?auto=format&fit=crop&w=800&q=80",
  vendor: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
};

let idCounter = 0;

/** Creates a stable element id for showcase fixtures. */
function uid(prefix: string): string {
  idCounter += 1;
  return `showcase-${prefix}-${String(idCounter).padStart(3, "0")}`;
}

interface ElementOptions {
  id?: string;
  styles?: ResponsiveStyles;
  advanced?: BuilderElementAdvanced;
  children?: BuilderElement[];
}

/** Builds a builder element merged with widget defaults. */
function el(type: string, props: Record<string, unknown> = {}, options: ElementOptions = {}): BuilderElement {
  const widget = getBuilderWidget(type);
  if (!widget) {
    throw new Error(`Unknown builder widget: ${type}`);
  }

  return {
    id: options.id ?? uid(type),
    type,
    props: { ...structuredClone(widget.defaultProps), ...props },
    styles: options.styles ?? { desktop: { normal: {} } },
    advanced: options.advanced,
    children: widget.acceptsChildren ? options.children ?? [] : options.children,
  };
}

function sectionContainer(
  title: string,
  subtitle: string,
  children: BuilderElement[],
  background = "#ffffff",
): BuilderElement {
  return el("container", {
    containerLayout: "flexbox",
    contentWidth: "boxed",
    direction: "column",
    align: "stretch",
    gap: 24,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 64,
          paddingBottom: 64,
          paddingLeft: 24,
          paddingRight: 24,
          backgroundColor: background,
        },
      },
    },
    children: [
      el("heading", {
        text: title,
        tag: "h2",
        size: "large",
        align: "center",
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: "36px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: 8,
            },
          },
        },
      }),
      el("paragraph", {
        text: subtitle,
        align: "center",
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 18,
              color: "#6b7280",
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            },
          },
        },
      }),
      el("divider", {
        style: "solid",
        width: 80,
        weight: 3,
        gap: 24,
        color: "#6d5dfc",
        align: "center",
        addElement: "icon",
        icon: "★",
      }),
      ...children,
    ],
  });
}

/** Public Market–inspired demo page exercising every builder widget. */
export function createShowcaseDocument(): BuilderDocument {
  idCounter = 0;

  const galleryImages = [
    { src: IMG.food, alt: "Food hall", title: "Curated vendors", description: "Global flavors under one roof" },
    { src: IMG.market, alt: "Market interior", title: "Community hub", description: "Retail, office, and life science" },
    { src: IMG.vendor, alt: "Vendor stall", title: "Local favorites", description: "From ramen to rooftop yoga" },
    { src: IMG.coffee, alt: "Coffee bar", title: "Morning rituals", description: "Artisan coffee and tea" },
    { src: IMG.yoga, alt: "Wellness studio", title: "Move & connect", description: "Fitness and wellness vendors" },
    { src: IMG.hero, alt: "Dining room", title: "Evening energy", description: "A destination from dawn to dusk" },
  ];

  const hero = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    justify: "center",
    align: "center",
    gap: 24,
    minHeight: 520,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 96,
          paddingBottom: 96,
          paddingLeft: 24,
          paddingRight: 24,
          backgroundImage: `linear-gradient(135deg, rgba(17,24,39,0.88), rgba(109,93,252,0.82)), url(${IMG.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      },
    },
    children: [
      el("heading", {
        text: "Welcome To\nThe Public Market",
        tag: "h1",
        size: "xxl",
        align: "center",
        color: "#ffffff",
      }, {
        styles: { desktop: { normal: { fontSize: "56px", fontWeight: 800, lineHeight: 1.1 } } },
        advanced: { entranceAnimation: "fadeInUp", animationDuration: "normal", animationDelay: 100 },
      }),
      el("paragraph", {
        text: "More than just a food hall — a vibrant mixed-use destination where culture, commerce, and community intersect.",
        align: "center",
        color: "#e5e7eb",
      }, {
        styles: { desktop: { normal: { fontSize: 20, maxWidth: 640 } } },
      }),
      el("flexbox", {
        contentWidth: "boxed",
        tag: "div",
      }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            },
          },
        },
        children: [
          el("button", {
            text: "Order Food",
            url: "#vendors",
            align: "center",
            backgroundColor: "#ffffff",
            textColor: "#6d5dfc",
            borderRadius: 999,
            paddingX: 32,
            paddingY: 14,
            icon: "→",
            iconPosition: "after",
          }),
          el("button", {
            text: "View Vendors",
            url: "#gallery",
            align: "center",
            backgroundColor: "transparent",
            textColor: "#ffffff",
            borderRadius: 999,
            paddingX: 32,
            paddingY: 14,
            buttonType: "info",
          }),
        ],
      }),
      el("icon-list", {
        layout: "inline",
        align: "center",
        spaceBetween: 24,
        divider: false,
        iconColor: "#c4b5fd",
        textColor: "#f9fafb",
        iconSize: 16,
        textSize: 14,
        items: [
          { text: "Mon–Sat 10am–9pm", icon: "🕐", url: "" },
          { text: "5959 Shellmound St.", icon: "📍", url: "" },
          { text: "40+ Vendors", icon: "🍽", url: "" },
        ],
      }),
    ],
  });

  const layoutSection = sectionContainer(
    "Layout Components",
    "Div block, flexbox, grid, and container — the structural backbone of every page.",
    [
      el("grid", { columns: 2, rows: 1, gap: 24, justify: "stretch", align: "stretch" }, {
        styles: { desktop: { normal: { display: "grid" } } },
        children: [
          el("div-block", { tag: "section", link: "" }, {
            styles: {
              desktop: {
                normal: {
                  paddingTop: 24,
                  paddingBottom: 24,
                  paddingLeft: 24,
                  paddingRight: 24,
                  backgroundColor: "#f3f4f6",
                  borderRadius: 12,
                },
              },
            },
            children: [
              el("heading", { text: "Div Block", tag: "h3", align: "left" }),
              el("paragraph", { text: "Semantic HTML wrapper with configurable tag and optional link." }),
            ],
          }),
          el("flexbox", { contentWidth: "full", tag: "div" }, {
            styles: {
              desktop: {
                normal: {
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  paddingTop: 24,
                  paddingBottom: 24,
                  paddingLeft: 24,
                  paddingRight: 24,
                  backgroundColor: "#ede9fe",
                  borderRadius: 12,
                },
              },
            },
            children: [
              el("icon", { icon: "▦", view: "stacked", shape: "circle", primaryColor: "#6d5dfc", secondaryColor: "#fff", size: 36 }),
              el("icon", { icon: "▭", view: "framed", shape: "square", primaryColor: "#7c3aed", size: 36, borderWidth: 2 }),
            ],
          }),
        ],
      }),
      el("spacer", { height: 16 }),
      el("container", {
        containerLayout: "flexbox",
        contentWidth: "boxed",
        direction: "row",
        justify: "space-between",
        align: "center",
        gap: 20,
        wrap: "wrap",
      }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              paddingTop: 24,
              paddingBottom: 24,
              paddingLeft: 24,
              paddingRight: 24,
              backgroundColor: "#111827",
              borderRadius: 12,
            },
          },
        },
        children: [
          el("heading", { text: "Nested Container", tag: "h4", color: "#ffffff" }),
          el("read-more", { text: "Explore leasing options →", link: "#leasing" }),
        ],
      }),
    ],
    "#fafafa",
  );

  const typographySection = sectionContainer(
    "Typography & Basic",
    "Headings, paragraphs, rich text, spacers, and dividers with full style control.",
    [
      el("grid", { columns: 2, gap: 32 }, {
        children: [
          el("div-block", { tag: "div" }, {
            children: [
              el("heading", { text: "Heading XL", tag: "h2", size: "xl", align: "left" }),
              el("heading", { text: "Heading Medium", tag: "h3", size: "medium", align: "left" }),
              el("paragraph", {
                text: "Drop cap paragraph with multi-column support. Emeryville Public Market energizes the environment from morning through evening.",
                dropCap: true,
                columns: 2,
                columnGap: 24,
                align: "justify",
              }),
              el("text-editor", {
                text: "<p><strong>Rich text editor</strong> supports <em>HTML markup</em>, <a href='#'>links</a>, and styled content.</p>",
                dropCap: false,
                columns: 1,
                align: "left",
                color: "#374151",
                linkColor: "#6d5dfc",
                fontSize: 16,
                lineHeight: 1.6,
              }),
            ],
          }),
          el("div-block", { tag: "div" }, {
            children: [
              el("divider", { style: "dashed", width: 100, weight: 2, gap: 20, color: "#d1d5db", addElement: "text", text: "Section Break" }),
              el("text-path", {
                text: "Curvy Text Path Widget",
                pathType: "wave",
                align: "center",
                direction: "default",
                showPath: true,
              }),
              el("menu-anchor", { id: "vendors" }),
              el("html", {
                html: "<p style='padding:12px 16px;background:#fef3c7;border-radius:8px;color:#92400e'><strong>HTML widget:</strong> Custom markup block for advanced layouts.</p>",
              }),
            ],
          }),
        ],
      }),
    ],
  );

  const mediaSection = sectionContainer(
    "Media & Embeds",
    "Images, galleries, carousels, video, YouTube, and SVG assets.",
    [
      el("grid", { columns: 2, gap: 24 }, {
        children: [
          el("image", {
            src: IMG.food,
            alt: "Food hall spread",
            caption: "The food hall at dusk",
            align: "center",
            width: 100,
            borderRadius: 12,
            objectFit: "cover",
          }),
          el("image-box", {
            image: IMG.market,
            title: "Image Box",
            description: "Image with title, description, and configurable position.",
            imagePosition: "top",
            align: "left",
            titleColor: "#111827",
            titleFontSize: 22,
            descriptionColor: "#6b7280",
            imageBorderRadius: 12,
            imageWidth: 100,
          }),
        ],
      }),
      el("gallery", {
        images: galleryImages.map((item) => ({
          src: item.src,
          alt: item.alt,
          title: item.title,
          description: item.description,
        })),
        columns: "3",
        caption: "title",
        linkTo: "file",
        lightbox: "yes",
        gap: "extended",
        borderRadius: 8,
        captionAlign: "center",
        captionColor: "#374151",
        captionSpacing: 8,
      }),
      el("carousel", {
        carouselName: "vendor-carousel",
        images: galleryImages.slice(0, 4).map((item) => ({ src: item.src, alt: item.alt })),
        slidesToShow: "3",
        slidesToScroll: "1",
        navigation: "both",
        autoplay: true,
        infinite: true,
        imageSpacing: 16,
        borderRadius: 8,
        arrowColor: "#6d5dfc",
        dotColor: "#d1d5db",
        activeDotColor: "#6d5dfc",
      }),
      el("grid", { columns: 2, gap: 24 }, {
        children: [
          el("video", {
            src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster: IMG.hero,
            aspectRatio: "16:9",
            controls: true,
            autoplay: false,
            loop: true,
            muted: true,
          }),
          el("youtube", {
            videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
            title: "Public Market Tour",
          }),
        ],
      }),
      el("svg", {
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Bitmap_Icon_Bookmark.svg",
        title: "SVG bookmark icon",
      }),
    ],
  );

  const contentBlocks = sectionContainer(
    "Content Blocks",
    "Icon boxes, testimonials, alerts, tabs, accordion, and toggle widgets.",
    [
      el("grid", { columns: 3, gap: 24 }, {
        children: [
          el("icon-box", {
            icon: "🍽",
            view: "stacked",
            shape: "circle",
            title: "Food Hall",
            description: "Curated local culinary experiences from morning to evening.",
            iconPosition: "top",
            align: "center",
            primaryColor: "#6d5dfc",
            secondaryColor: "#ffffff",
            iconSize: 32,
            titleColor: "#111827",
            titleFontSize: 20,
          }),
          el("icon-box", {
            icon: "🏢",
            view: "framed",
            shape: "square",
            title: "Office & Life Science",
            description: "Innovation-driven spaces that activate the environment.",
            iconPosition: "top",
            align: "center",
            primaryColor: "#7c3aed",
            iconBorderWidth: 2,
            titleFontSize: 20,
          }),
          el("icon-box", {
            icon: "🛍",
            view: "default",
            title: "Adjacent Retail",
            description: "Seamless blend of retail experiences alongside dining.",
            iconPosition: "top",
            align: "center",
            primaryColor: "#059669",
            iconSize: 36,
            titleFontSize: 20,
          }),
        ],
      }),
      el("testimonial", {
        content: "The Public Market isn't just where we eat — it's where our team connects, discovers, and feels part of a thriving community.",
        image: IMG.avatar,
        name: "Sarah Chen",
        title: "Local Entrepreneur",
        imagePosition: "aside",
        align: "left",
        textColor: "#374151",
        nameColor: "#111827",
        jobColor: "#6b7280",
        imageSize: 72,
        imageBorderRadius: 50,
      }),
      el("grid", { columns: 2, gap: 16 }, {
        children: [
          el("alert", {
            alertType: "info",
            title: "Info Alert",
            description: "Market hours updated for the holiday season.",
            showDismiss: true,
            icon: "ℹ",
            backgroundColor: "#eff6ff",
            borderColor: "#3b82f6",
            titleColor: "#1e40af",
          }),
          el("alert", {
            alertType: "success",
            title: "Success Alert",
            description: "Your vendor application has been received!",
            showDismiss: true,
            icon: "✓",
            backgroundColor: "#ecfdf5",
            borderColor: "#10b981",
          }),
          el("alert", {
            alertType: "warning",
            title: "Warning Alert",
            description: "Limited parking available during peak hours.",
            showDismiss: true,
            icon: "⚠",
            backgroundColor: "#fffbeb",
            borderColor: "#f59e0b",
          }),
          el("alert", {
            alertType: "danger",
            title: "Danger Alert",
            description: "Market closed Thanksgiving, Christmas & New Year's Day.",
            showDismiss: true,
            icon: "✕",
            backgroundColor: "#fef2f2",
            borderColor: "#ef4444",
          }),
        ],
      }),
      el("tabs", {
        direction: "horizontal",
        align: "start",
        titleColor: "#6b7280",
        activeTitleColor: "#6d5dfc",
        contentColor: "#374151",
        titleSpacing: 16,
        items: [
          { title: "Vendors", content: "Explore 40+ local vendors offering global flavors — from vegan Mexican to authentic ramen." },
          { title: "Events", content: "Live music Thursdays, wine Wednesdays, trivia nights, and community game nights." },
          { title: "Leasing", content: "Food hall, office & life science, and adjacent retail spaces available." },
        ],
      }),
      el("grid", { columns: 2, gap: 24 }, {
        children: [
          el("accordion", {
            defaultState: "expanded_first",
            maxExpanded: "one",
            iconPosition: "end",
            expandIcon: "+",
            collapseIcon: "−",
            titleBackground: "#f9fafb",
            titleColor: "#111827",
            activeTitleColor: "#6d5dfc",
            contentBackground: "#ffffff",
            contentColor: "#4b5563",
            spaceBetween: 8,
            items: [
              { title: "What are the hours?", content: "Mon–Sat 10am–9pm, Sunday 10am–8pm." },
              { title: "Where do I park?", content: "Free parking available in the adjacent garage on Shellmound St." },
              { title: "Can I lease a space?", content: "Yes! Contact our leasing team for food hall, office, and retail opportunities." },
            ],
          }),
          el("toggle", {
            titleTag: "h4",
            titleColor: "#6d5dfc",
            spaceBetween: 12,
            items: [
              { title: "Order food online?", content: "Many vendors offer online ordering — look for the Order Food button on vendor cards." },
              { title: "Host a private event?", content: "The Market offers event spaces for corporate gatherings and celebrations." },
            ],
          }),
        ],
      }),
    ],
    "#fafafa",
  );

  const statsSection = sectionContainer(
    "Stats & Indicators",
    "Counters, progress bars, star ratings, and icon lists.",
    [
      el("grid", { columns: 3, gap: 32 }, {
        children: [
          el("counter", {
            start: 0,
            end: 40,
            suffix: "+",
            title: "Vendors",
            titlePosition: "after",
            numberAlign: "center",
            numberColor: "#6d5dfc",
            numberFontSize: 56,
            titleColor: "#6b7280",
            titleFontSize: 18,
          }),
          el("counter", {
            start: 0,
            end: 1200,
            suffix: "K",
            title: "Annual Visitors",
            titlePosition: "before",
            numberAlign: "center",
            numberColor: "#7c3aed",
            numberFontSize: 56,
            titleColor: "#6b7280",
          }),
          el("counter", {
            start: 0,
            end: 15,
            suffix: " yrs",
            title: "Community Hub",
            titlePosition: "after",
            numberAlign: "center",
            numberColor: "#059669",
            numberFontSize: 56,
          }),
        ],
      }),
      el("grid", { columns: 2, gap: 24 }, {
        children: [
          el("progress", {
            title: "Food Hall Occupancy",
            value: 92,
            progressType: "success",
            displayTitle: true,
            displayPercentage: true,
            innerText: "Nearly Full",
            barHeight: 14,
            borderRadius: 8,
            barColor: "#10b981",
            barBackground: "#e5e7eb",
            innerTextColor: "#ffffff",
          }),
          el("progress", {
            title: "Event Calendar",
            value: 78,
            progressType: "info",
            displayTitle: true,
            displayPercentage: true,
            barHeight: 14,
            borderRadius: 8,
            barColor: "#3b82f6",
          }),
        ],
      }),
      el("rating", {
        rating: 4.5,
        scale: 5,
        title: "Visitor Rating",
        align: "center",
        starColor: "#f59e0b",
        unmarkedColor: "#e5e7eb",
        size: 28,
      }),
      el("icon-list", {
        layout: "traditional",
        align: "left",
        divider: true,
        dividerStyle: "solid",
        dividerColor: "#e5e7eb",
        dividerWeight: 1,
        spaceBetween: 12,
        iconColor: "#6d5dfc",
        textColor: "#374151",
        iconSize: 18,
        iconGap: 10,
        items: [
          { text: "Free Wi-Fi throughout the market", icon: "📶", url: "" },
          { text: "Pet-friendly outdoor seating", icon: "🐾", url: "" },
          { text: "Accessible entrances and restrooms", icon: "♿", url: "" },
          { text: "Live music every Thursday", icon: "🎵", url: "#events" },
        ],
      }),
    ],
  );

  const interactiveSection = sectionContainer(
    "Interactive & Social",
    "Forms, maps, social icons, and audio embeds.",
    [
      el("grid", { columns: 2, gap: 32 }, {
        children: [
          el("form", {
            fields: [
              { label: "Full Name", type: "text", required: true },
              { label: "Email Address", type: "email", required: true },
              { label: "I'm interested in", type: "select", required: false },
            ],
            buttonText: "Subscribe to Market News",
          }),
          el("div-block", { tag: "div" }, {
            children: [
              el("heading", { text: "Visit Us", tag: "h3", align: "left" }),
              el("google-maps", {
                query: "5959 Shellmound St, Emeryville, CA 94608",
                zoom: 15,
                height: 280,
                saturate: 110,
                contrast: 105,
              }),
              el("spacer", { height: 20 }),
              el("social-icons", {
                shape: "circle",
                columns: "auto",
                align: "left",
                size: 20,
                padding: 12,
                spacing: 10,
                color: "#ffffff",
                secondaryColor: "#6d5dfc",
                items: [
                  { network: "Instagram", icon: "📷", url: "https://instagram.com" },
                  { network: "Facebook", icon: "f", url: "https://facebook.com" },
                  { network: "YouTube", icon: "▶", url: "https://youtube.com" },
                ],
              }),
            ],
          }),
        ],
      }),
      el("audio", {
        src: "https://soundcloud.com/forss/flickermood",
        visual: true,
        height: 166,
        autoplay: false,
        buy: true,
        like: true,
        share: true,
      }),
    ],
    "#fafafa",
  );

  const wordpressSection = sectionContainer(
    "WordPress & Legacy Widgets",
    "Shortcodes, WordPress blocks, and compatibility placeholders.",
    [
      el("grid", { columns: 3, gap: 16 }, {
        children: [
          el("shortcode", { code: "[public_market_vendors limit=\"6\"]" }),
          el("wordpress", { widget: "recent-posts", title: "Recent Posts Widget" }),
          el("wp-image", { src: IMG.coffee, alt: "WordPress image block", link: "#" }),
          el("wp-video", {
            src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            poster: IMG.hero,
            autoplay: false,
            loop: false,
          }),
          el("wp-block", { title: "Custom WordPress Block" }),
          el("sidebar", { sidebar: "" }),
        ],
      }),
      el("grid", { columns: 4, gap: 12 }, {
        children: [
          el("search", { title: "Search" }),
          el("minimalist", { title: "Minimalist Link In Bio" }),
          el("pages", { title: "Pages" }),
          el("calendar", { title: "Calendar" }),
          el("archives", { title: "Archives" }),
          el("recent-posts", { title: "Recent Posts" }),
          el("recent-comments", { title: "Recent Comments" }),
          el("rss", { title: "RSS" }),
          el("tag-cloud", { title: "Tag Cloud" }),
          el("navigation-menu", { title: "Navigation Menu" }),
          el("custom-html", { title: "Custom HTML" }),
          el("block", { title: "Block" }),
        ],
      }),
    ]
  );

  const footer = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "center",
    gap: 16,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 48,
          paddingBottom: 48,
          backgroundColor: "#111827",
        },
      },
    },
    children: [
      el("heading", {
        text: "Don't Miss What's Next",
        tag: "h2",
        align: "center",
        color: "#ffffff",
        size: "large",
      }),
      el("paragraph", {
        text: "© Public Market Emeryville — Built with NextPress Page Builder Component Showcase",
        align: "center",
        color: "#9ca3af",
      }),
      el("button", {
        text: "Back to Top",
        url: "#top",
        align: "center",
        backgroundColor: "#6d5dfc",
        textColor: "#ffffff",
        borderRadius: 8,
      }),
    ],
  });

  return {
    editor: "nextpress",
    version: 1,
    content: [
      el("menu-anchor", { id: "top" }),
      hero,
      layoutSection,
      typographySection,
      mediaSection,
      contentBlocks,
      statsSection,
      interactiveSection,
      wordpressSection,
      footer,
    ],
    settings: {
      title: "Component Showcase — The Public Market",
      contentWidth: 1200,
      backgroundColor: "#ffffff",
      textColor: "#111827",
      customCss: ".npb-page { font-family: Inter, system-ui, sans-serif; } .npb-button { text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; border: 2px solid transparent; } .npb-form { display: grid; gap: 12px; } .npb-form label { display: grid; gap: 4px; font-weight: 500; color: #374151; } .npb-form input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; } .npb-form button { padding: 12px 24px; background: #6d5dfc; color: #fff; border: 0; border-radius: 8px; font-weight: 600; cursor: pointer; }",
    },
    globals: {
      colors: {
        primary: "#6d5dfc",
        secondary: "#1f2937",
        text: "#111827",
        accent: "#7c3aed",
        success: "#10b981",
        warning: "#f59e0b",
      },
      fonts: {
        primary: "Inter, system-ui, sans-serif",
        secondary: "Georgia, serif",
      },
      variables: {
        "--npb-radius": "12px",
        "--npb-shadow": "0 4px 24px rgba(0,0,0,0.08)",
      },
      classes: [
        {
          id: "showcase-card",
          name: "Showcase Card",
          styles: {
            desktop: {
              normal: {
                paddingTop: 24,
                paddingBottom: 24,
                paddingLeft: 24,
                paddingRight: 24,
                backgroundColor: "#ffffff",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              },
            },
          },
        },
      ],
    },
  };
}

/** Returns every widget type used in the showcase document. */
export function getShowcaseWidgetTypes(): string[] {
  const types = new Set<string>();

  function walk(elements: BuilderElement[]) {
    for (const element of elements) {
      types.add(element.type);
      if (element.children?.length) {
        walk(element.children);
      }
    }
  }

  walk(createShowcaseDocument().content);
  return [...types].sort();
}
