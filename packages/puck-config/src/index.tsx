import type { Config } from "@puckeditor/core";
import {
  Hero,
  Text,
  ImageBlock,
  Columns,
  ButtonBlock,
  Spacer,
  Divider,
  Card,
  Gallery,
  Video,
  type HeroProps,
  type TextProps,
  type ImageBlockProps,
  type ColumnsProps,
  type ButtonBlockProps,
  type SpacerProps,
  type DividerProps,
  type CardProps,
  type GalleryProps,
  type VideoProps,
} from "@nextpress/blocks";
import { colorField } from "./fields";

type PuckComponents = {
  Hero: HeroProps;
  Text: TextProps;
  Image: ImageBlockProps;
  Columns: ColumnsProps;
  Button: ButtonBlockProps;
  Spacer: SpacerProps;
  Divider: DividerProps;
  Card: CardProps;
  Gallery: GalleryProps;
  Video: VideoProps;
};

type PuckRootProps = Record<string, never>;

export const puckConfig: Config<PuckComponents, PuckRootProps> = {
  root: {
    render: ({ children }) => (
      <main className="min-h-screen bg-white">{children}</main>
    ),
  },
  components: {
    Hero: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        subtitle: { type: "textarea", label: "Subtitle", contentEditable: true },
        backgroundImage: { type: "text", label: "Background image URL" },
        ctaText: { type: "text", label: "Button text" },
        ctaUrl: { type: "text", label: "Button URL" },
        alignment: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        textColor: colorField("Text color"),
        overlayColor: colorField("Overlay color"),
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
        rounded: {
          type: "radio",
          label: "Rounded corners",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
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
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
          ],
        },
        content: { type: "slot" },
      },
      defaultProps: {
        columns: "3",
      },
      render: Columns,
    },
    Button: {
      fields: {
        label: { type: "text", label: "Label", contentEditable: true },
        url: { type: "text", label: "URL" },
        variant: {
          type: "radio",
          label: "Style",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Outline", value: "outline" },
          ],
        },
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
      },
      defaultProps: {
        style: "solid",
      },
      render: Divider,
    },
    Card: {
      fields: {
        title: { type: "text", label: "Title", contentEditable: true },
        description: { type: "textarea", label: "Description", contentEditable: true },
        imageUrl: { type: "text", label: "Image URL" },
        linkUrl: { type: "text", label: "Link URL" },
        linkText: { type: "text", label: "Link text" },
        textColor: colorField("Text color"),
        backgroundColor: colorField("Background color"),
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
          },
          defaultItemProps: { src: "", alt: "" },
          getItemSummary: (item) => item.alt || item.src || "Image",
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
      },
      defaultProps: {
        images: [],
        columns: "3",
      },
      render: Gallery,
    },
    Video: {
      fields: {
        url: { type: "text", label: "Video URL (YouTube, Vimeo, or embed)" },
        caption: { type: "text", label: "Caption" },
      },
      defaultProps: {
        url: "",
      },
      render: Video,
    },
  },
  categories: {
    layout: {
      title: "Layout",
      components: ["Hero", "Columns", "Spacer", "Divider"],
    },
    content: {
      title: "Content",
      components: ["Text", "Image", "Video", "Card"],
    },
    interactive: {
      title: "Interactive",
      components: ["Button", "Gallery"],
    },
  },
};

export type { PuckComponents };
