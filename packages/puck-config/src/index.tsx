import type { Config, CustomField } from "@puckeditor/core";
import { mergePuckConfig } from "@nextpress/core";
import nextpressConfig from "../../../nextpress.config";
import {
  Hero,
  HeroBanner,
  NavBar,
  Text,
  ImageBlock,
  Columns,
  ButtonBlock,
  Spacer,
  Divider,
  Section,
  Card,
  Gallery,
  Video,
  RichText,
  ShortcodeBlock,
  HtmlCode,
  OEmbed,
  SectionHeading,
  StatRow,
  ServiceSection,
  TestimonialsSection,
  FeatureGrid,
  SplitPanel,
  StepsSection,
  ProfileSpotlight,
  ArticleGrid,
  PromoBanner,
  ContactCta,
  SiteFooter,
  InfoCard,
  ContentMedia,
  ContactFormBlock,
  CarouselBlock,
  FilterGrid,
  MapEmbed,
  type ContentMediaProps,
  type ContactFormBlockProps,
  type CarouselBlockProps,
  type FilterGridProps,
  type MapEmbedProps,
  XdImportedScreen,
  type HeroProps,
  type HeroBannerProps,
  type NavBarProps,
  type TextProps,
  type ImageBlockProps,
  type ColumnsProps,
  type SectionProps,
  type ButtonBlockProps,
  type SpacerProps,
  type DividerProps,
  type CardProps,
  type GalleryProps,
  type VideoProps,
  type RichTextProps,
  type ShortcodeBlockProps,
  type HtmlCodeProps,
  type OEmbedProps,
  type SectionHeadingProps,
  type StatRowProps,
  type ServiceSectionProps,
  type TestimonialsSectionProps,
  type FeatureGridProps,
  type SplitPanelProps,
  type StepsSectionProps,
  type ProfileSpotlightProps,
  type ArticleGridProps,
  type PromoBannerProps,
  type ContactCtaProps,
  type SiteFooterProps,
  type InfoCardProps,
  type XdImportedScreenProps,
  type XdTextProps,
  type XdImageProps,
  type XdRectProps,
  type XdEllipseProps,
  type XdLineProps,
  type XdPathProps,
} from "@nextpress/blocks";
import { colorField } from "./fields";
import { elementTextStyleFields, elementButtonStyleFields } from "./element-style-fields";
import { layoutFields } from "./layout-fields";
import { wpBlockColorFields, wpButtonFields, wpCoverFields, wpImageFields } from "./wordpress-block-fields";
import { xdPuckComponentConfig, type XdPuckComponentMap } from "./xd-puck";
import { LEGACY_SECTION_BLOCK_TYPES } from "@nextpress/shared";

type PuckComponents = {
  NavBar: NavBarProps;
  HeroBanner: HeroBannerProps;
  Hero: HeroProps;
  Text: TextProps;
  Image: ImageBlockProps;
  Columns: ColumnsProps;
  Section: SectionProps;
  Button: ButtonBlockProps;
  Spacer: SpacerProps;
  Divider: DividerProps;
  Card: CardProps;
  Gallery: GalleryProps;
  Video: VideoProps;
  RichText: RichTextProps;
  Shortcode: ShortcodeBlockProps;
  HtmlCode: HtmlCodeProps;
  OEmbed: OEmbedProps;
  SectionHeading: SectionHeadingProps;
  StatRow: StatRowProps;
  ServiceSection: ServiceSectionProps;
  TestimonialsSection: TestimonialsSectionProps;
  FeatureGrid: FeatureGridProps;
  SplitPanel: SplitPanelProps;
  StepsSection: StepsSectionProps;
  ProfileSpotlight: ProfileSpotlightProps;
  ArticleGrid: ArticleGridProps;
  PromoBanner: PromoBannerProps;
  ContactCta: ContactCtaProps;
  ContentMedia: ContentMediaProps;
  ContactForm: ContactFormBlockProps;
  Carousel: CarouselBlockProps;
  FilterGrid: FilterGridProps;
  MapEmbed: MapEmbedProps;
  SiteFooter: SiteFooterProps;
  InfoCard: InfoCardProps;
  XdImportedScreen: XdImportedScreenProps;
  XdText: XdTextProps;
  XdImage: XdImageProps;
  XdRect: XdRectProps;
  XdEllipse: XdEllipseProps;
  XdLine: XdLineProps;
  XdPath: XdPathProps;
};

type PuckRootProps = {
  title?: string;
  canvasWidth?: number;
  canvasHeight?: number;
};

export const corePuckConfig: Config<PuckComponents, PuckRootProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Page title" },
      canvasWidth: { type: "number", label: "XD canvas width" },
      canvasHeight: { type: "number", label: "XD canvas height" },
    },
    defaultProps: {
      title: "Imported XD page",
    },
    render: ({ children, canvasWidth, canvasHeight }) => {
      if (typeof canvasWidth === "number" && typeof canvasHeight === "number" && canvasWidth > 0) {
        return (
          <main className="min-h-screen overflow-x-auto bg-zinc-100">
            <div
              className="relative mx-auto bg-white shadow-sm"
              style={{ width: canvasWidth, minHeight: canvasHeight, height: canvasHeight }}
            >
              {children}
            </div>
          </main>
        );
      }

      return <main className="min-h-screen">{children}</main>;
    },
  },
  components: {
    NavBar: {
      fields: {
        brandLabel: { type: "text", label: "Brand", contentEditable: true },
        ...elementTextStyleFields("brandLabel"),
        brandHref: { type: "text", label: "Brand URL" },
        logoUrl: { type: "text", label: "Logo URL" },
        links: {
          type: "array",
          label: "Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "URL" },
          },
          defaultItemProps: { label: "Link", href: "#" },
          getItemSummary: (item) => item.label || "Link",
        },
        ctaLabel: { type: "text", label: "CTA label", contentEditable: true },
        ctaHref: { type: "text", label: "CTA URL" },
        backgroundColor: colorField("Background"),
        textColor: colorField("Text color"),
        accentColor: colorField("CTA color"),
        sticky: {
          type: "radio",
          label: "Sticky",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        transparent: {
          type: "radio",
          label: "Transparent overlay",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        announcementText: { type: "text", label: "Announcement bar text" },
        announcementBackgroundColor: colorField("Announcement background"),
        announcementTextColor: colorField("Announcement text color"),
        ctaVariant: {
          type: "radio",
          label: "CTA style",
          options: [
            { label: "Button", value: "button" },
            { label: "Text link", value: "text" },
          ],
        },
        menuStyle: {
          type: "radio",
          label: "Menu style",
          options: [
            { label: "Inline", value: "inline" },
            { label: "Drawer (mobile)", value: "drawer" },
          ],
        },
        logoInvert: {
          type: "radio",
          label: "Invert logo (for dark backgrounds)",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        ...layoutFields,
      },
      defaultProps: {
        brandLabel: "Your Site",
        brandHref: "/",
        links: [],
        sticky: false,
      },
      render: NavBar,
    },
    HeroBanner: {
      fields: {
        videoUrl: { type: "text", label: "Background video URL (.mp4)" },
        title: { type: "text", label: "Title (before highlight)", contentEditable: true },
        ...elementTextStyleFields("title"),
        titleHighlight: { type: "text", label: "Highlight", contentEditable: true },
        ...elementTextStyleFields("titleHighlight"),
        titleSuffix: { type: "text", label: "Title (after highlight)", contentEditable: true },
        ...elementTextStyleFields("titleSuffix"),
        subtitle: { type: "textarea", label: "Subtitle", contentEditable: true },
        ...elementTextStyleFields("subtitle"),
        highlightColor: colorField("Highlight color"),
        showScrollIndicator: {
          type: "radio",
          label: "Scroll indicator",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        contentAlign: {
          type: "radio",
          label: "Content alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        overlayColor: colorField("Overlay color"),
        ...wpCoverFields,
        ...layoutFields,
      },
      defaultProps: {
        videoUrl: "",
        title: "Welcome to",
        titleHighlight: "Your Site",
        subtitle: "Add your hero subtitle.",
        overlayOpacity: 55,
        minHeight: "md",
      },
      render: HeroBanner,
    },
    Hero: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        ...elementTextStyleFields("title"),
        subtitle: { type: "textarea", label: "Subtitle", contentEditable: true },
        ...elementTextStyleFields("subtitle"),
        backgroundImage: { type: "text", label: "Background image URL" },
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        ...wpBlockColorFields,
        overlayColor: colorField("Overlay color"),
        ...wpCoverFields,
        ...layoutFields,
      },
      defaultProps: {
        title: "Welcome to Our Site",
        subtitle: "Build something amazing with NextPress",
        alignment: "center",
      },
      render: Hero,
    },
    Text: {
      fields: {
        content: { type: "textarea", label: "Content", contentEditable: true },
        ...elementTextStyleFields("content"),
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        fontSize: {
          type: "radio",
          label: "Font size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra large", value: "xl" },
          ],
        },
        padding: {
          type: "radio",
          label: "Padding",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
        textColor: colorField("Text color"),
        backgroundColor: colorField("Background color"),
        ...layoutFields,
      },
      defaultProps: {
        content: "Add your text here.",
        alignment: "left",
        fontSize: "md",
        padding: "md",
      },
      render: Text,
    },
    Image: {
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt text" },
        caption: { type: "text", label: "Caption" },
        description: { type: "text", label: "Description" },
        ...wpImageFields,
        ...layoutFields,
      },
      defaultProps: {
        src: "",
        alt: "",
        rounded: true,
      },
      render: ImageBlock,
    },
    Columns: {
      fields: {
        columns: {
          type: "radio",
          label: "Columns",
          options: [
            { label: "1 (stack)", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
        content: { type: "slot" },
        ...layoutFields,
      },
      defaultProps: {
        columns: "3",
      },
      render: Columns,
    },
    Section: {
      fields: {
        backgroundColor: colorField("Background color"),
        backgroundImage: { type: "text", label: "Background image URL" },
        overlayColor: colorField("Overlay color"),
        overlayOpacity: {
          type: "number",
          label: "Overlay opacity (%)",
          min: 0,
          max: 90,
        },
        paddingY: {
          type: "radio",
          label: "Vertical padding",
          options: [
            { label: "None", value: "none" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra large", value: "xl" },
          ],
        },
        content: { type: "slot" },
        ...layoutFields,
      },
      defaultProps: {
        paddingY: "lg",
        overlayOpacity: 0,
      },
      render: Section,
    },
    Button: {
      fields: {
        label: { type: "text", label: "Label", contentEditable: true },
        ...elementTextStyleFields("label"),
        url: { type: "text", label: "URL" },
        ...wpButtonFields,
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        backgroundColor: colorField("Button color"),
        textColor: colorField("Text color"),
        ...layoutFields,
      },
      defaultProps: {
        label: "Click me",
        url: "#",
        variant: "primary",
        alignment: "center",
      },
      render: ButtonBlock,
    },
    Spacer: {
      fields: {
        height: {
          type: "radio",
          label: "Height",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra large", value: "xl" },
          ],
        },
        ...layoutFields,
      },
      defaultProps: {
        height: "md",
      },
      render: Spacer,
    },
    Divider: {
      fields: {
        style: {
          type: "radio",
          label: "Style",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
          ],
        },
        ...layoutFields,
      },
      defaultProps: {
        style: "solid",
      },
      render: Divider,
    },
    Card: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        ...elementTextStyleFields("title"),
        description: { type: "textarea", label: "Description", contentEditable: true },
        ...elementTextStyleFields("description"),
        imageUrl: { type: "text", label: "Image URL" },
        linkUrl: { type: "text", label: "Link URL" },
        linkText: { type: "text", label: "Link text" },
        backgroundColor: colorField("Background color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Card title",
        description: "Card description goes here.",
      },
      render: Card,
    },
    Gallery: {
      fields: {
        images: {
          type: "array",
          label: "Images",
          arrayFields: {
            src: { type: "text", label: "Image URL" },
            alt: { type: "text", label: "Alt text" },
            caption: { type: "text", label: "Caption" },
            linkUrl: { type: "text", label: "Link URL" },
            rotation: { type: "number", label: "Rotation (degrees)" },
          },
          defaultItemProps: { src: "", alt: "", caption: "" },
          getItemSummary: (item) => item.caption || item.alt || item.src || "Image",
        },
        layout: {
          type: "radio",
          label: "Layout",
          options: [
            { label: "Grid", value: "grid" },
            { label: "Masonry", value: "masonry" },
            { label: "Scatter", value: "scatter" },
          ],
        },
        columns: {
          type: "radio",
          label: "Columns",
          options: [
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
        captionStyle: {
          type: "radio",
          label: "Caption style",
          options: [
            { label: "None", value: "none" },
            { label: "Below", value: "below" },
            { label: "Overlay", value: "overlay" },
          ],
        },
        captionFont: {
          type: "radio",
          label: "Caption font",
          options: [
            { label: "Body", value: "body" },
            { label: "Accent / script", value: "accent" },
          ],
        },
        frameStyle: {
          type: "radio",
          label: "Frame style",
          options: [
            { label: "None", value: "none" },
            { label: "Polaroid", value: "polaroid" },
          ],
        },
        scatterDensity: {
          type: "radio",
          label: "Scatter density",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Tight / overlap", value: "tight" },
          ],
        },
        centerBadgeUrl: { type: "text", label: "Center badge image URL" },
        centerBadgeAlt: { type: "text", label: "Center badge alt text" },
        bleed: {
          type: "radio",
          label: "Bleed off edges",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: colorField("Background"),
        ...layoutFields,
      },
      defaultProps: {
        images: [],
        layout: "grid",
        columns: "3",
        captionStyle: "none",
        captionFont: "body",
      },
      render: Gallery,
    },
    Video: {
      fields: {
        url: { type: "text", label: "Video URL (YouTube, Vimeo, or embed)" },
        caption: { type: "text", label: "Caption" },
        ...layoutFields,
      },
      defaultProps: {
        url: "",
      },
      render: Video,
    },
    RichText: {
      label: "Rich Text",
      fields: {
        html: { type: "textarea", label: "HTML content" },
      },
      defaultProps: { html: "<p>Start writing…</p>" },
      render: RichText,
    },
    Shortcode: {
      label: "Shortcode",
      fields: {
        content: {
          type: "textarea",
          label: "Shortcodes (e.g. [youtube id=\"dQw4w9WgXcQ\"])",
        },
      },
      defaultProps: { content: "" },
      render: ShortcodeBlock,
    },
    HtmlCode: {
      label: "HTML / Code",
      fields: {
        html: { type: "textarea", label: "HTML source" },
        displayMode: {
          type: "radio",
          label: "Display mode",
          options: [
            { label: "Rendered", value: "rendered" },
            { label: "Code view", value: "code" },
          ],
        },
      },
      defaultProps: { html: "", displayMode: "rendered" },
      render: HtmlCode,
    },
    OEmbed: {
      label: "Embed (oEmbed)",
      fields: {
        url: { type: "text", label: "URL (YouTube, Vimeo, Twitter/X)" },
        caption: { type: "text", label: "Caption" },
      },
      defaultProps: { url: "" },
      render: OEmbed,
    },
    SectionHeading: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        ...elementTextStyleFields("title"),
        highlight: { type: "text", label: "Highlighted word", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        ...elementTextStyleFields("description"),
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        highlightColor: colorField("Highlight color"),
        backgroundColor: colorField("Background color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Section title",
        alignment: "center",
      },
      render: SectionHeading,
    },
    StatRow: {
      fields: {
        items: {
          type: "array",
          label: "Stats",
          arrayFields: {
            value: { type: "text", label: "Value" },
            label: { type: "text", label: "Label" },
          },
          defaultItemProps: { value: "100+", label: "Stat" },
          getItemSummary: (item) => item.value || "Stat",
        },
        accentColor: colorField("Value color"),
        columns: {
          type: "radio",
          label: "Columns",
          options: [
            { label: "3", value: "3" },
            { label: "6", value: "6" },
          ],
        },
        ...layoutFields,
      },
      defaultProps: { items: [], columns: "6" },
      render: StatRow,
    },
    InfoCard: {
      fields: {
        label: { type: "text", label: "Label", contentEditable: true },
        lines: { type: "textarea", label: "Lines (one per line)" },
        textColor: colorField("Text color"),
        labelColor: colorField("Label color"),
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
          ],
        },
        ...layoutFields,
      },
      defaultProps: {
        label: "Hours",
        lines: "",
        alignment: "center",
      },
      render: InfoCard,
    },
    ServiceSection: {
      fields: {
        iconUrl: { type: "text", label: "Icon URL" },
        title: { type: "text", label: "Title", contentEditable: true },
        ...elementTextStyleFields("title"),
        description: { type: "textarea", label: "Description", contentEditable: true },
        ...elementTextStyleFields("description"),
        services: {
          type: "array",
          label: "Services",
          arrayFields: {
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
            href: { type: "text", label: "URL" },
          },
          defaultItemProps: { title: "Service", description: "", href: "#" },
          getItemSummary: (item) => item.title || "Service",
        },
        ctaLabel: { type: "text", label: "CTA label", contentEditable: true },
        ctaHref: { type: "text", label: "CTA URL" },
        backgroundColor: colorField("Section background"),
        accentColor: colorField("Title highlight"),
        linkColor: colorField("Button background"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Services",
        description: "",
        services: [],
      },
      render: ServiceSection,
    },
    TestimonialsSection: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        highlight: { type: "text", label: "Highlighted word", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        items: {
          type: "array",
          label: "Testimonials",
          arrayFields: {
            quote: { type: "textarea", label: "Quote" },
            name: { type: "text", label: "Name" },
            role: { type: "text", label: "Role" },
            linkUrl: { type: "text", label: "URL" },
          },
          defaultItemProps: { quote: "", name: "", role: "", linkUrl: "#" },
          getItemSummary: (item) => item.name || "Testimonial",
        },
        highlightColor: colorField("Highlight color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Testimonials",
        description: "",
        items: [],
      },
      render: TestimonialsSection,
    },
    FeatureGrid: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        highlight: { type: "text", label: "Highlighted word", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        features: {
          type: "array",
          label: "Features",
          arrayFields: {
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
            imageUrl: { type: "text", label: "Image URL" },
            linkUrl: { type: "text", label: "Link URL" },
            showArrow: {
              type: "radio",
              label: "Show arrow",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
          },
          defaultItemProps: { title: "Feature", description: "", showArrow: true },
          getItemSummary: (item) => item.title || "Feature",
        },
        display: {
          type: "radio",
          label: "Display",
          options: [
            { label: "Text cards", value: "cards" },
            { label: "Image tiles", value: "image-tiles" },
          ],
        },
        overlayGradient: {
          type: "radio",
          label: "Image tile gradient overlay",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        sectionWatermark: { type: "text", label: "Watermark text", contentEditable: true },
        sectionCtaLabel: { type: "text", label: "Section CTA label", contentEditable: true },
        sectionCtaUrl: { type: "text", label: "Section CTA URL" },
        tileStyle: {
          type: "radio",
          label: "Tile corners",
          options: [
            { label: "Rounded", value: "rounded" },
            { label: "Flush / edge-to-edge", value: "flush" },
          ],
        },
        backgroundColor: colorField("Background"),
        highlightColor: colorField("Highlight color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Features",
        description: "",
        features: [],
        display: "cards",
        overlayGradient: true,
      },
      render: FeatureGrid,
    },
    SplitPanel: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        linkLabel: { type: "text", label: "Link label", contentEditable: true },
        linkUrl: { type: "text", label: "Link URL" },
        bullets: {
          type: "array",
          label: "Bullet points",
          arrayFields: {
            text: { type: "text", label: "Text" },
          },
          defaultItemProps: { text: "" },
          getItemSummary: (item) => item.text || "Bullet",
        },
        imageUrl: { type: "text", label: "Image URL" },
        backgroundColor: colorField("Background"),
        linkColor: colorField("Link color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Split panel",
        description: "",
        bullets: [],
      },
      render: SplitPanel,
    },
    StepsSection: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        highlight: { type: "text", label: "Highlighted word", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        steps: {
          type: "array",
          label: "Steps",
          arrayFields: {
            number: { type: "text", label: "Number" },
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
          },
          defaultItemProps: { number: "01", title: "Step", description: "" },
          getItemSummary: (item) => item.title || "Step",
        },
        highlightColor: colorField("Highlight color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Process",
        description: "",
        steps: [],
      },
      render: StepsSection,
    },
    ProfileSpotlight: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        subDescription: { type: "textarea", label: "Sub description", contentEditable: true },
        personName: { type: "text", label: "Person name", contentEditable: true },
        personRole: { type: "text", label: "Person role", contentEditable: true },
        personInitials: { type: "text", label: "Initials" },
        backgroundColor: colorField("Background"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Profile",
        description: "",
        personName: "Name",
        personRole: "Role",
        personInitials: "?",
      },
      render: ProfileSpotlight,
    },
    ArticleGrid: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        articles: {
          type: "array",
          label: "Articles",
          arrayFields: {
            title: { type: "text", label: "Title" },
            href: { type: "text", label: "URL" },
            imageUrl: { type: "text", label: "Image URL" },
            meta: { type: "text", label: "Meta (date, etc.)" },
            tags: { type: "text", label: "Tags (comma-separated)" },
            featured: {
              type: "radio",
              label: "Featured",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
          },
          defaultItemProps: { title: "Article", href: "#", featured: false },
          getItemSummary: (item) => item.title || "Article",
        },
        layout: {
          type: "radio",
          label: "Layout",
          options: [
            { label: "Grid", value: "grid" },
            { label: "Masonry", value: "masonry" },
          ],
        },
        cardVariant: {
          type: "radio",
          label: "Card style",
          options: [
            { label: "Default", value: "default" },
            { label: "Image overlay", value: "image-overlay" },
          ],
        },
        sectionCtaLabel: { type: "text", label: "Section CTA label" },
        sectionCtaUrl: { type: "text", label: "Section CTA URL" },
        sectionCtaStyle: {
          type: "radio",
          label: "Section CTA style",
          options: [
            { label: "Link", value: "link" },
            { label: "Button", value: "button" },
          ],
        },
        linkColor: colorField("Accent / link color"),
        backgroundColor: colorField("Background"),
        textColor: colorField("Text color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Articles",
        description: "",
        articles: [],
        layout: "grid",
      },
      render: ArticleGrid,
    },
    PromoBanner: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        ...elementTextStyleFields("title"),
        description: { type: "textarea", label: "Description", contentEditable: true },
        ...elementTextStyleFields("description"),
        buttonLabel: { type: "text", label: "Button label", contentEditable: true },
        buttonHref: { type: "text", label: "Button URL" },
        ...elementButtonStyleFields(),
        theme: {
          type: "radio",
          label: "Theme",
          options: [
            { label: "Dark", value: "dark" },
            { label: "Blue", value: "blue" },
          ],
        },
        ...layoutFields,
      },
      defaultProps: {
        title: "Promo",
        description: "",
        theme: "dark",
      },
      render: PromoBanner,
    },
    ContactCta: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        ...elementTextStyleFields("title"),
        subtitle: { type: "text", label: "Subtitle", contentEditable: true },
        ...elementTextStyleFields("subtitle"),
        description: { type: "textarea", label: "Description", contentEditable: true },
        ...elementTextStyleFields("description"),
        avatarText: { type: "text", label: "Avatar text" },
        avatarImageUrl: { type: "text", label: "Avatar image URL" },
        avatarImageAlt: { type: "text", label: "Avatar image alt text" },
        accentColor: colorField("Accent color"),
        ...layoutFields,
      },
      defaultProps: {
        title: "Contact",
        subtitle: "Hello",
        description: "",
        avatarText: "?",
      },
      render: ContactCta,
    },
    ContentMedia: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        content: { type: "textarea", label: "Content", contentEditable: true },
        ctaLabel: { type: "text", label: "CTA label", contentEditable: true },
        ctaUrl: { type: "text", label: "CTA URL" },
        ctaBackgroundColor: colorField("CTA background"),
        ctaTextColor: colorField("CTA text color"),
        mediaPosition: {
          type: "radio",
          label: "Media position",
          options: [
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
          ],
        },
        mediaType: {
          type: "select",
          label: "Media type",
          options: [
            { label: "Image", value: "image" },
            { label: "Video file", value: "video" },
            { label: "YouTube", value: "youtube" },
            { label: "Vimeo", value: "vimeo" },
          ],
        },
        desktopImageUrl: { type: "text", label: "Desktop image URL" },
        mobileImageUrl: { type: "text", label: "Mobile image URL" },
        videoUrl: { type: "text", label: "Video URL" },
        mediaAlt: { type: "text", label: "Media alt text" },
        backgroundColor: colorField("Background"),
        textColor: colorField("Text color"),
        paddingY: {
          type: "select",
          label: "Vertical padding",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        },
        ...layoutFields,
      },
      defaultProps: {
        title: "Content & Media",
        content: "",
        mediaPosition: "right",
        mediaType: "image",
        paddingY: "md",
      },
      render: ContentMedia,
    },
    ContactForm: {
      fields: {
        formId: { type: "text", label: "Form ID" },
        variant: {
          type: "radio",
          label: "Variant",
          options: [
            { label: "Inline", value: "inline" },
            { label: "Card", value: "card" },
            { label: "Newsletter overlay", value: "newsletter-overlay" },
          ],
        },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        submitLabel: { type: "text", label: "Submit button label" },
        successMessage: { type: "text", label: "Success message" },
        columns: {
          type: "radio",
          label: "Columns",
          options: [
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
          ],
        },
        fields: {
          type: "array",
          label: "Fields",
          arrayFields: {
            name: { type: "text", label: "Field name" },
            label: { type: "text", label: "Label" },
            type: {
              type: "select",
              label: "Type",
              options: [
                { label: "Text", value: "text" },
                { label: "Email", value: "email" },
                { label: "Phone", value: "tel" },
                { label: "Textarea", value: "textarea" },
                { label: "Select", value: "select" },
              ],
            },
            required: {
              type: "radio",
              label: "Required",
              options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
              ],
            },
            placeholder: { type: "text", label: "Placeholder" },
            options: { type: "text", label: "Select options (comma-separated)" },
          },
          defaultItemProps: { name: "field", label: "Field", type: "text", required: false },
          getItemSummary: (item) => item.label || "Field",
        },
        backgroundColor: colorField("Background"),
        backgroundImage: { type: "text", label: "Background image URL" },
        overlayColor: colorField("Overlay color"),
        overlayOpacity: {
          type: "number",
          label: "Overlay opacity (%)",
          min: 0,
          max: 90,
        },
        textColor: colorField("Text color"),
        buttonColor: colorField("Button color"),
        buttonTextColor: colorField("Button text color"),
        ...layoutFields,
      },
      defaultProps: {
        formId: "contact",
        title: "Contact us",
        columns: "1",
        overlayOpacity: 0,
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "message", label: "Message", type: "textarea", required: true },
        ],
      },
      render: ContactFormBlock,
    },
    Carousel: {
      fields: {
        slides: {
          type: "array",
          label: "Slides",
          arrayFields: {
            imageUrl: { type: "text", label: "Desktop image URL" },
            mobileImageUrl: { type: "text", label: "Mobile image URL" },
            alt: { type: "text", label: "Alt text" },
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
            linkUrl: { type: "text", label: "Link URL" },
          },
          defaultItemProps: { imageUrl: "", title: "Slide" },
          getItemSummary: (item) => item.title || "Slide",
        },
        autoplay: {
          type: "radio",
          label: "Autoplay",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        intervalMs: { type: "number", label: "Autoplay interval (ms)" },
        showDots: {
          type: "radio",
          label: "Show dots",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showArrows: {
          type: "radio",
          label: "Show arrows",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: colorField("Background"),
        ...layoutFields,
      },
      defaultProps: {
        slides: [],
        autoplay: false,
        intervalMs: 5000,
        showDots: true,
        showArrows: true,
      },
      render: CarouselBlock,
    },
    FilterGrid: {
      fields: {
        items: {
          type: "array",
          label: "Items",
          arrayFields: {
            id: { type: "text", label: "ID" },
            title: { type: "text", label: "Title" },
            category: { type: "text", label: "Category" },
            description: { type: "textarea", label: "Description" },
            imageUrl: { type: "text", label: "Image URL" },
            linkUrl: { type: "text", label: "Link URL" },
            primaryCtaLabel: { type: "text", label: "Primary CTA label" },
            primaryCtaUrl: { type: "text", label: "Primary CTA URL" },
            secondaryCtaLabel: { type: "text", label: "Secondary CTA label" },
            secondaryCtaUrl: { type: "text", label: "Secondary CTA URL" },
          },
          defaultItemProps: { id: "1", title: "Item", category: "General" },
          getItemSummary: (item) => item.title || "Item",
        },
        sectionTitle: { type: "text", label: "Section title" },
        sectionCtaLabel: { type: "text", label: "Section CTA label" },
        sectionCtaUrl: { type: "text", label: "Section CTA URL" },
        sectionHeaderColor: colorField("Section title color"),
        categories: {
          type: "array",
          label: "Filter categories (optional)",
          arrayFields: {
            name: { type: "text", label: "Category" },
          },
          defaultItemProps: { name: "" },
          getItemSummary: (item) => item.name || "Category",
        },
        columns: {
          type: "radio",
          label: "Grid columns",
          options: [
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
        displayMode: {
          type: "radio",
          label: "Display mode",
          options: [
            { label: "Grid", value: "grid" },
            { label: "Carousel", value: "carousel" },
          ],
        },
        cardStyle: {
          type: "radio",
          label: "Card style",
          options: [
            { label: "Default", value: "default" },
            { label: "Title first", value: "title-first" },
          ],
        },
        showViewToggle: {
          type: "radio",
          label: "Show grid/list toggle",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        showFilters: {
          type: "radio",
          label: "Show category filters",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: colorField("Background"),
        backgroundImage: { type: "text", label: "Background image URL" },
        overlayColor: colorField("Overlay color"),
        overlayOpacity: {
          type: "number",
          label: "Overlay opacity (%)",
          min: 0,
          max: 90,
        },
        accentColor: colorField("CTA / accent color"),
        ...layoutFields,
      },
      defaultProps: {
        items: [],
        columns: "3",
        displayMode: "grid",
        cardStyle: "default",
        showFilters: true,
        showViewToggle: true,
        overlayOpacity: 0,
      },
      render: FilterGrid,
    },
    MapEmbed: {
      fields: {
        provider: {
          type: "select",
          label: "Provider",
          options: [
            { label: "Google Maps", value: "google" },
            { label: "Mapbox", value: "mapbox" },
            { label: "Custom embed", value: "embed" },
          ],
        },
        embedUrl: { type: "text", label: "Embed URL" },
        latitude: { type: "number", label: "Latitude" },
        longitude: { type: "number", label: "Longitude" },
        zoom: { type: "number", label: "Zoom level" },
        height: { type: "number", label: "Height (px)" },
        title: { type: "text", label: "Accessible title" },
        backgroundColor: colorField("Background"),
        ...layoutFields,
      },
      defaultProps: {
        provider: "google",
        height: 400,
        title: "Location map",
      },
      render: MapEmbed,
    },
    SiteFooter: {
      fields: {
        logoUrl: { type: "text", label: "Logo URL" },
        logoBadgeUrl: { type: "text", label: "Circular badge URL" },
        copyright: { type: "text", label: "Copyright", contentEditable: true },
        columnTitleColor: colorField("Column title color"),
        infoBox: {
          type: "object",
          label: "Info box",
          objectFields: {
            label: { type: "text", label: "Label" },
            lines: { type: "textarea", label: "Lines (one per line)" },
            borderColor: colorField("Border color"),
            labelColor: colorField("Label color"),
          },
        },
        columns: {
          type: "array",
          label: "Columns",
          arrayFields: {
            title: { type: "text", label: "Column title" },
            links: {
              type: "array",
              label: "Links",
              arrayFields: {
                label: { type: "text", label: "Label" },
                href: { type: "text", label: "URL" },
              },
              defaultItemProps: { label: "Link", href: "#" },
              getItemSummary: (item) => item.label || "Link",
            },
          },
          defaultItemProps: { title: "Column", links: [] },
          getItemSummary: (item) => item.title || "Column",
        },
        legalLinks: {
          type: "array",
          label: "Legal links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "URL" },
          },
          defaultItemProps: { label: "Privacy Policy", href: "#" },
          getItemSummary: (item) => item.label || "Link",
        },
        backgroundColor: colorField("Background"),
        linkColor: colorField("Link color"),
        ...layoutFields,
      },
      defaultProps: { columns: [], legalLinks: [], copyright: "© Company" },
      render: SiteFooter,
    },
    XdImportedScreen: {
      fields: {
        title: { type: "text", label: "Screen title" },
        artboardName: { type: "text", label: "Artboard name" },
        width: { type: "number", label: "Width" },
        height: { type: "number", label: "Height" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Splash", value: "splash" },
            { label: "Home", value: "home" },
            { label: "Welcome", value: "welcome" },
            { label: "Generic", value: "generic" },
          ],
        },
        accentColor: colorField("Accent color") as CustomField<string>,
        previewImageUrl: { type: "text", label: "Preview image URL" },
        ...layoutFields,
      },
      defaultProps: {
        title: "Imported screen",
        artboardName: "Artboard",
        width: 393,
        height: 851,
        variant: "generic",
        accentColor: "#ff5b55",
        backgroundColor: "#ffffff",
      },
      render: XdImportedScreen,
    },
    ...(xdPuckComponentConfig as Pick<
      Config<PuckComponents, PuckRootProps>["components"],
      keyof XdPuckComponentMap
    >),
  },
  categories: {
    navigation: {
      title: "Navigation",
      components: ["NavBar", "SiteFooter"],
    },
    layout: {
      title: "Layout",
      components: ["HeroBanner", "Hero", "Section", "Columns", "Spacer", "Divider"],
    },
    content: {
      title: "Content",
      components: ["Text", "RichText", "Image", "Video", "OEmbed", "Shortcode", "HtmlCode", "Card", "ContentMedia", "MapEmbed"],
    },
    interactive: {
      title: "Interactive",
      components: ["Button", "Gallery", "ContactForm", "Carousel", "FilterGrid"],
    },
    /** Registered but hidden — existing pages still render; use CMS custom blocks instead. */
    _legacy: {
      title: "Legacy sections",
      visible: false,
      components: [...LEGACY_SECTION_BLOCK_TYPES],
    },
    /** Registered but hidden — keeps XD blocks off the insert list while still rendering imported pages. */
    _xd: {
      title: "XD",
      visible: false,
      components: [
        "XdImportedScreen",
        "XdText",
        "XdImage",
        "XdRect",
        "XdEllipse",
        "XdLine",
        "XdPath",
      ],
    },
  },
};

/** Core blocks + plugins registered in nextpress.config.ts */
export const puckConfig = mergePuckConfig(
  corePuckConfig as unknown as Config,
  nextpressConfig.plugins ?? [],
) as Config<PuckComponents, PuckRootProps>;

export type { PuckComponents };
