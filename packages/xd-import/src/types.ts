import type { PuckData } from "@nextpress/shared";

export type XdRgb = { r: number; g: number; b: number; alpha?: number };

export type XdTextNode = {
  name: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  color?: string;
};

export type XdImageNode = {
  name: string;
  uid: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
};

export type XdProduct = {
  name: string;
  price: string;
  imageUid?: string;
  imageUrl?: string;
};

export type XdSection = {
  title: string;
  seeAll?: boolean;
  products: XdProduct[];
};

export type XdArtboardVariant = "splash" | "home" | "welcome" | "generic";

export type XdArtboardScreen = {
  id: string;
  name: string;
  width: number;
  height: number;
  variant: XdArtboardVariant;
  accentColor: string;
  backgroundColor: string;
  previewPath?: string;
  texts: XdTextNode[];
  images: XdImageNode[];
  splash?: {
    brandName: string;
    primaryCta: string;
    secondaryCta: string;
    logoImageUrl?: string;
  };
  home?: {
    searchPlaceholder: string;
    sections: XdSection[];
    categories: Array<{ label: string; active?: boolean }>;
  };
  welcome?: {
    title: string;
    subtitle: string;
    skipLabel?: string;
  };
};

export type XdParseResult = {
  documentName: string;
  artboards: XdArtboardScreen[];
  fonts: string[];
  assets: Record<string, { path: string; mime: string }>;
};

export type XdImportOptions = {
  title: string;
  slug: string;
  artboardNames?: string[];
  assetPublicPrefix?: string;
};

export type XdImportResult = {
  parseResult: XdParseResult;
  puckData: PuckData;
  warnings: string[];
};
