import type { BuilderDocument, BuilderElement, BuilderElementAdvanced, ResponsiveStyles } from "./types";
import { getBuilderWidget } from "./widgets";

const CDN = "https://publicmarketemeryville.channel13.cloud/wp-content/uploads";

const ASSETS = {
  logo: `${CDN}/2026/03/publicmarketemeryville-logo-footer.svg`,
  emblem: `${CDN}/2026/03/Group-2704.svg`,
  galleryMark: `${CDN}/2026/03/Group-2719.svg`,
  heroPoster: `${CDN}/2026/03/3eb7d216_PosterImage.jpg`,
  heroVideo: `${CDN}/2026/03/3eb7d216.mp4`,
  vendorsBg: `${CDN}/2026/03/DTS_Banquet_Daniel_Faro_Photos_ID5376@2x.webp`,
  newsletterPhoto: `${CDN}/2026/03/people-dining.webp`,
};

const C = {
  accent: "#6FA84C",
  text: "#494747",
  dark: "#1F1F1F",
  black: "#000000",
  white: "#ffffff",
  cream: "#FAFAFA",
  muted: "rgba(255,255,255,0.5)",
  border: "#6FA84C",
  cardBorder: "#B9B9B9",
};

interface ElementOptions {
  id?: string;
  styles?: ResponsiveStyles;
  classes?: string[];
  advanced?: BuilderElementAdvanced;
  children?: BuilderElement[];
}

interface VendorDef {
  name: string;
  category: string;
  image: string;
  learnMore?: string;
  cta?: { label: string; url: string };
}

interface EventDef {
  title: string;
  excerpt: string;
  image: string;
  url: string;
  tags: string[];
}

interface GalleryDef {
  label: string;
  image: string;
}

interface LeasingDef {
  title: string;
  image: string;
  url: string;
}

let idCounter = 0;

function uid(prefix: string): string {
  idCounter += 1;
  return `pme-${prefix}-${String(idCounter).padStart(3, "0")}`;
}

function el(type: string, props: Record<string, unknown> = {}, options: ElementOptions = {}): BuilderElement {
  const widget = getBuilderWidget(type);
  if (!widget) throw new Error(`Unknown builder widget: ${type}`);

  return {
    id: options.id ?? uid(type),
    type,
    props: { ...structuredClone(widget.defaultProps), ...props },
    styles: options.styles ?? { desktop: { normal: {} } },
    classes: options.classes,
    advanced: options.advanced,
    children: widget.acceptsChildren ? options.children ?? [] : options.children,
  };
}

function sectionBox(children: BuilderElement[]): BuilderElement {
  return el("container", {
    containerLayout: "flexbox",
    contentWidth: "boxed",
    direction: "column",
    align: "center",
    justify: "center",
    gap: 12,
    minHeight: 276,
  }, {
    classes: ["pme-info-box"],
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: C.border,
          paddingTop: 34,
          paddingBottom: 34,
          paddingLeft: 30,
          paddingRight: 30,
          boxShadow: "0 3px 9px rgba(0,0,0,0.16)",
          minWidth: 260,
          maxWidth: 334,
        },
      },
    },
    children,
  });
}

function labelHeading(text: string): BuilderElement {
  return el("heading", {
    text,
    tag: "h6",
    align: "center",
    color: C.text,
  }, {
    styles: {
      desktop: {
        normal: {
          fontSize: 17,
          fontWeight: 400,
          letterSpacing: 0.04,
          marginBottom: 20,
        },
      },
    },
  });
}

function bodyText(text: string, align: "left" | "center" | "right" = "left", color = C.text): BuilderElement {
  return el("paragraph", {
    text,
    align,
    color,
  }, {
    styles: {
      desktop: {
        normal: {
          fontSize: 19,
          lineHeight: 1.53,
          fontWeight: 300,
          marginBottom: 0,
        },
      },
    },
  });
}

function marketButton(
  text: string,
  url: string,
  variant: "solid" | "outline" | "link" = "solid",
  align: "left" | "center" | "right" = "left",
): BuilderElement {
  const isLink = variant === "link";
  const isOutline = variant === "outline";

  return el("button", {
    text,
    url,
    align,
    size: "medium",
    backgroundColor: isLink || isOutline ? "transparent" : C.accent,
    textColor: isLink ? C.accent : isOutline ? C.text : C.white,
    borderRadius: isLink ? 0 : 0,
    paddingX: isLink ? 0 : 12,
    paddingY: isLink ? 0 : 11,
  }, {
    styles: {
      desktop: {
        normal: {
          borderWidth: isOutline ? 1 : 0,
          borderStyle: "solid",
          borderColor: isOutline ? C.accent : C.accent,
          fontSize: isLink ? 30 : 11,
          fontWeight: 400,
          letterSpacing: isLink ? 0 : 0.06,
          textTransform: "uppercase",
          minWidth: isLink ? 0 : 117,
        },
      },
    },
  });
}

function infoBox(title: string, lines: string[], link?: { text: string; url: string }): BuilderElement {
  const children: BuilderElement[] = [labelHeading(title), ...lines.map((line) => bodyText(line, "center"))];
  if (link) {
    children.push(el("button", {
      text: link.text,
      url: link.url,
      align: "center",
      size: "small",
      backgroundColor: "transparent",
      textColor: C.text,
      borderRadius: 0,
      paddingX: 0,
      paddingY: 0,
    }, {
      styles: {
        desktop: {
          normal: {
            fontSize: 19,
            fontWeight: 300,
            lineHeight: 1.53,
            textTransform: "none",
            letterSpacing: 0,
            whiteSpace: "pre-line",
          },
        },
      },
    }));
  }
  return sectionBox(children);
}

function vendorCard(vendor: VendorDef): BuilderElement {
  const actions: BuilderElement[] = [];
  if (vendor.learnMore) actions.push(marketButton("LEARN MORE", vendor.learnMore, "solid"));
  if (vendor.cta) actions.push(marketButton(vendor.cta.label, vendor.cta.url, "outline"));

  return el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "stretch",
    gap: 0,
    minHeight: 0,
  }, {
    classes: ["pme-vendor-card"],
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.white,
          paddingTop: 33,
          paddingBottom: 24,
          paddingLeft: 23,
          paddingRight: 23,
          minWidth: 320,
          maxWidth: 480,
          flexShrink: 0,
          textAlign: "left",
        },
      },
    },
    children: [
      el("heading", {
        text: vendor.name,
        tag: "h3",
        align: "left",
        color: C.text,
      }, {
        styles: { desktop: { normal: { fontSize: 25, fontWeight: 400, marginBottom: 0 } } },
      }),
      el("paragraph", {
        text: vendor.category,
        align: "left",
        color: C.text,
      }, {
        styles: { desktop: { normal: { fontSize: 16, opacity: 0.5, marginBottom: 22 } } },
      }),
      el("image", {
        src: vendor.image,
        alt: vendor.name,
        objectFit: "cover",
      }, {
        styles: {
          desktop: {
            normal: {
              width: "100%",
              height: 261,
              borderRadius: 7,
              boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
              objectFit: "cover",
              marginBottom: 30,
            },
          },
        },
      }),
      el("divider", {
        style: "solid",
        width: 100,
        weight: 1,
        gap: 16,
        color: C.cardBorder,
        align: "left",
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 13,
              paddingTop: 16,
            },
          },
        },
        children: actions,
      }),
    ],
  });
}

function eventCard(event: EventDef): BuilderElement {
  return el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "stretch",
    gap: 0,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 280,
          maxWidth: 400,
        },
      },
    },
    children: [
      el("image", {
        src: event.image,
        alt: event.title,
        link: event.url,
        objectFit: "cover",
      }, {
        styles: {
          desktop: {
            normal: {
              width: "100%",
              height: 420,
              objectFit: "cover",
            },
          },
        },
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              position: "relative",
              marginTop: -360,
              paddingTop: 21,
              paddingLeft: 28,
              marginBottom: 280,
            },
          },
        },
        children: event.tags.map((tag) => el("button", {
          text: tag,
          url: "#",
          align: "left",
          size: "small",
          backgroundColor: C.white,
          textColor: C.text,
          borderRadius: 999,
          paddingX: 20,
          paddingY: 8,
        }, {
          styles: {
            desktop: {
              normal: {
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: C.white,
                fontSize: 15,
                fontWeight: 400,
                textTransform: "uppercase",
                pointerEvents: "none",
              },
            },
          },
        })),
      }),
      el("heading", {
        text: event.title,
        tag: "h2",
        link: event.url,
        align: "left",
        color: C.white,
      }, {
        styles: { desktop: { normal: { fontSize: 30, fontWeight: 400, marginTop: 13, marginBottom: 7 } } },
      }),
      el("paragraph", {
        text: event.excerpt,
        align: "left",
        color: C.muted,
      }, {
        styles: { desktop: { normal: { fontSize: 16, fontWeight: 400 } } },
      }),
    ],
  });
}

function polaroid(label: string, image: string, width: string, height: number): BuilderElement {
  return el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "center",
    gap: 0,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "column",
          width,
          flexShrink: 0,
          backgroundColor: C.white,
          paddingTop: 10,
          paddingBottom: 40,
          paddingLeft: 10,
          paddingRight: 10,
          boxShadow: "0 3px 6px rgba(0,0,0,0.28)",
        },
      },
    },
    children: [
      el("image", { src: image, alt: label, objectFit: "cover" }, {
        styles: { desktop: { normal: { width: "100%", height, objectFit: "cover" } } },
      }),
      el("heading", {
        text: label,
        tag: "h3",
        align: "center",
        color: C.black,
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 30,
              fontWeight: 400,
              fontFamily: '"Caveat", cursive',
              lineHeight: 0.8,
              paddingTop: 10,
            },
          },
        },
      }),
    ],
  });
}

function leasingSlide(item: LeasingDef): BuilderElement {
  return el("image-box", {
    image: item.image,
    title: item.title,
    description: "",
    link: item.url,
    titleTag: "h3",
    imagePosition: "top",
    align: "left",
    verticalAlign: "bottom",
    imageWidth: 100,
    imageHeight: 520,
    objectFit: "cover",
    imageBorderRadius: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          position: "relative",
          minWidth: 380,
          height: 520,
          flexShrink: 0,
          backgroundImage: `linear-gradient(180deg, rgba(90,90,90,0) 0%, rgba(18,18,18,1) 100%)`,
          paddingTop: 24,
          paddingBottom: 32,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  });
}

function footerLinks(title: string, links: { text: string; url: string }[]): BuilderElement {
  return el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "stretch",
    gap: 12,
    minHeight: 0,
  }, {
    children: [
      el("heading", {
        text: title,
        tag: "h6",
        align: "left",
        color: C.accent,
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: 0.08,
              textTransform: "uppercase",
              marginBottom: 0,
            },
          },
        },
      }),
      el("icon-list", {
        layout: "traditional",
        align: "left",
        spaceBetween: 12,
        textColor: C.white,
        iconColor: C.accent,
        items: links.map((link) => ({ text: link.text, icon: "", url: link.url })),
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 14,
              letterSpacing: 0.04,
              textTransform: "uppercase",
            },
          },
        },
      }),
    ],
  });
}

const TOP_BAR_MESSAGES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Head Title 2",
  "Head Title 3 will place here.",
];

const GALLERY_ITEMS: GalleryDef[] = [
  { label: "Fish Grill", image: `${CDN}/2026/05/IMG_4925.jpg` },
  { label: "Public Bar", image: `${CDN}/2026/03/Screenshot-2026-02-03-at-4.36.27-PM@2x.jpg` },
  { label: "Sushi", image: `${CDN}/2026/05/IMG_4924.jpg` },
  { label: "Greek Food", image: `${CDN}/2026/05/IMG_4926.jpg` },
  { label: "Japanese Fusion", image: `${CDN}/2026/05/IMG_4927.jpg` },
  { label: "Ramen", image: `${CDN}/2026/05/IMG_4923.jpg` },
  { label: "Coffee and Tea", image: `${CDN}/2026/05/IMG_4928.jpg` },
  { label: "Yoga", image: `${CDN}/2026/05/IMG_4922.jpg` },
];

const VENDORS: VendorDef[] = [
  { name: "Alma Y Sazon", category: "Vegan Mexican", image: `${CDN}/2026/03/Alma-Y-Sazon-thumb-1024x827.jpg`, learnMore: "https://almaysazonvegano.com/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=d09230b7-69cc-4ee3-90f2-cbea3ca20539" } },
  { name: "Bruce's Barbershop", category: "Barber Shop", image: `${CDN}/2026/03/StockSnap_GZ3Ajcarrillo3AGraphicWork3A20193A010319LC-Bruce3AWebsite3AStockSnap_GZP9ZEQPFL.jpgP9ZEQPFL-1024x683.webp`, learnMore: "https://www.brucesbarbers.com", cta: { label: "BOOK NOW", url: "https://getsquire.com/booking/book/bruces-barbershop-emeryville" } },
  { name: "CorePower Yoga", category: "In-Studio Yoga Classes", image: `${CDN}/2026/03/yoga-studios_CA_Emeryville_emeryville@2x.jpg`, learnMore: "https://www.corepoweryoga.com/yoga-studios/CA/Emeryville/emeryville", cta: { label: "BOOK NOW", url: "https://www.corepoweryoga.com/yoga-schedules/studio" } },
  { name: "Demiya", category: "Western-Inspired Japanese", image: `${CDN}/2026/03/Demiya-1-1024x813.png`, learnMore: "https://www.instagram.com/demiya_inc/", cta: { label: "ORDER FOOD", url: "https://www.doordash.com/en-CA/store/demiya-emeryville-34161895/100592953/" } },
  { name: "Emeryville Dental Care", category: "Dental Care", image: `${CDN}/2026/03/Public-market-121-1024x683.jpg`, learnMore: "https://www.sfeastbayminis.com/" },
  { name: "Guitar Center", category: "Instruments & Equipment", image: `${CDN}/2026/04/Public-market-096-1024x683.jpg`, learnMore: "https://www.guitarcenter.com/" },
  { name: "Jayna Gyro", category: "Mediterranean & Greek", image: `${CDN}/2026/04/Public-Market-Jayna-Gyro-1-1024x683.jpg`, learnMore: "https://jaynagyro.com/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=928d258a-f743-4314-b71c-386e338171dd" } },
  { name: "Juice House Co.", category: "Cold-Pressed Juices", image: `${CDN}/2026/04/Emeryville-Public-Market_0255-1-1024x683.jpg`, learnMore: "https://www.juicehouseco.com/" },
  { name: "Koja Kitchen", category: "Korean-Japanese Reinvented", image: `${CDN}/2026/04/Koja-Kitchen-1024x683.jpg`, learnMore: "https://www.kojakitchen.com/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=35200900-95bc-4fe5-9e17-ac85b552977b" } },
  { name: "Konarq", category: "Indian Cuisine", image: `${CDN}/2026/04/Public-market-071-1024x683.jpg`, learnMore: "https://www.konarq.com/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=8634ee50-40d3-4a5f-8021-d79ade3eb59f" } },
  { name: "Le Marine Fish & Grill", category: "Seafood", image: `${CDN}/2026/04/Screenshot-2026-04-30-at-3.03.20-PM-1024x746.png`, learnMore: "https://www.lemarinefishgrill.com/", cta: { label: "ORDER FOOD", url: "https://order.toasttab.com/online/le-marine-fish-and-grill-5959-shellmound-street-ste-13?diningOption=takeout" } },
  { name: "Mr. Dewie's Cashew Creamery", category: "Ice Cream", image: `${CDN}/2026/04/Public-Market-Cashew-Creamery-2-1024x683.jpg`, learnMore: "https://www.mrdewies.com/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=4b72f45c-7244-49a0-ab0d-41517e1f0d94" } },
  { name: "NabiQ", category: "Korean BBQ", image: `${CDN}/2026/04/Public-market-101-1024x683.jpg`, learnMore: "https://www.nabiq.com" },
  { name: "Naru Sushi", category: "Japanese Cuisine", image: `${CDN}/2026/04/Public-Market-Naru-Sushi-3-1024x683.jpg`, learnMore: "https://narusushica.com/", cta: { label: "ORDER FOOD", url: "https://naru-sushi-emeryville.cloveronline.com/menu/all" } },
  { name: "Orangetheory Fitness", category: "Fitness Studio", image: `${CDN}/2026/04/Screenshot-2026-04-30-at-3.05.45-PM-1024x461.png`, learnMore: "https://www.orangetheory.com/en-us/locations/emeryvillre-california-0102", cta: { label: "BOOK NOW", url: "https://www.orangetheory.com/en-us/book-a-class-1?location_id=b5703383-93b6-42be-a953-1f16a044d098&step=1" } },
  { name: "Paradita Eatery", category: "Peruvian Street Food", image: `${CDN}/2026/04/Screenshot-2026-04-30-at-3.07.02-PM-1024x679.png`, learnMore: "https://paradita.com/", cta: { label: "ORDER FOOD", url: "https://order.toasttab.com/online/paradita" } },
  { name: "Peet's Coffee and Tea", category: "Coffee & Tea", image: `${CDN}/2026/04/Emeryville-Public-Market_0324-1024x683.jpg`, learnMore: "https://www.peets.com/" },
  { name: "Pig in a Pickle", category: "House-made BBQ", image: `${CDN}/2026/04/Emeryville-Public-Market_0107-1024x683.jpg`, learnMore: "https://www.piginapickle.com/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=placeholder" } },
  { name: "Pizzeria Mercato", category: "Italian", image: `${CDN}/2026/03/Public-market-076-1024x683.jpg`, learnMore: "https://www.pizzeriamercato.us/", cta: { label: "ORDER FOOD", url: "https://publicmarketemeryville.menu/orderforhere?menu=4aec4dab-0b09-4cf4-9349-bf5ab64172ab" } },
  { name: "Public Bar by Blush", category: "Beverages", image: `${CDN}/2026/04/Public-market-024-1024x683.jpg` },
  { name: "Ramen Hiroshi", category: "Authentic Japanese Cuisine", image: `${CDN}/2026/03/Ramen-Hiroshi-food.jpg`, learnMore: "https://ramenhiroshi.com/", cta: { label: "ORDER FOOD", url: "https://order.boons.io/site/ramen-hiroshi-emeryville/391/y" } },
  { name: "Super Duper Burgers", category: "Burgers, Fries & Shakes", image: `${CDN}/2026/04/Public-market-089-1024x683.jpg`, learnMore: "https://www.superduperburgers.com/", cta: { label: "ORDER FOOD", url: "https://order.toasttab.com/online/super-duper-emeryville" } },
  { name: "Tease Southern Kitchen", category: "Cajun Fusion Cuisine", image: `${CDN}/2026/04/item-1600000000118719527_1764699227-1024x684.jpg`, learnMore: "https://teasesouthernkitchenemeryville.com/", cta: { label: "ORDER FOOD", url: "https://teasesouthernkitchenemeryville.com/order" } },
  { name: "The Lounge Nail Spa", category: "Spa & Nail Salon", image: `${CDN}/2026/04/AdobeStock_381471190-1024x701.jpeg`, learnMore: "https://www.theloungenailspa.com/index.html", cta: { label: "BOOK NOW", url: "https://www.lldtek.org/salon/appt/NTY4NDd8bG91bmdlMTMyM3xDQV8wODYxOHw0MjViMDYyZTA0YmIyOGQ0NmZkYTJkMjI3OTc5N2I0MQ==" } },
];

const EVENTS: EventDef[] = [
  { title: "Live Music Thursday's", excerpt: "Thursday, March XX | 3pm", image: `${CDN}/2026/03/DTS_Local_Band_Allie_Lehman_Photos_ID2160@2x-1024x828.jpg`, url: "https://publicmarketemeryville.channel13.cloud/live-music-thursdays/", tags: ["Community", "Culture"] },
  { title: "Wine Wednesdays at Pizzeria Mercato", excerpt: "No corkage fee at Pizzeria Mercato on Wednesdays!", image: `${CDN}/2026/03/Public-market-083@2x-1024x828.jpg`, url: "https://publicmarketemeryville.channel13.cloud/wine-wednesdays-at-pizzeria-mercato/", tags: ["Community", "Culture"] },
  { title: "Brainstormer Trivia Tuesday", excerpt: "Every Tuesday", image: `${CDN}/2026/03/Public-market-032@2x-1024x828.jpg`, url: "https://publicmarketemeryville.channel13.cloud/brainstormer-trivia-tuesday/", tags: ["Culture", "Events"] },
  { title: "Game Nights", excerpt: "Wednesday, March XX | 3pm", image: `${CDN}/2026/03/DTS_DIVE_BAR_Agustin_Farias_Photos_ID13701@2x-1024x828.jpg`, url: "https://publicmarketemeryville.channel13.cloud/game-nights/", tags: ["Community", "Culture", "News"] },
];

const LEASING: LeasingDef[] = [
  { title: "Food Hall", image: `${CDN}/2026/03/Food-Hallsp.webp`, url: "/leasing-type/food-hall/" },
  { title: "Office & Life Science", image: `${CDN}/2026/03/Adjacent-Retail-sp.webp`, url: "/leasing-type/office-life-science/" },
  { title: "Adjacent Retail", image: `${CDN}/2026/05/TPM_Placeholder.jpg`, url: "/leasing-type/adjacent-retail/" },
];

const FOLLOW_IMAGES = [
  `${CDN}/2026/05/IMG_4933.jpg`,
  `${CDN}/2026/05/IMG_4931.jpg`,
  `${CDN}/2026/05/IMG_4932.jpg`,
  `${CDN}/2026/05/IMG_4930.jpg`,
];

/** Full Public Market Emeryville homepage using builder widgets only. */
export function createPublicMarketDocument(): BuilderDocument {
  idCounter = 0;

  const topBar = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "row",
    justify: "center",
    align: "center",
    gap: 0,
    minHeight: 40,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          backgroundColor: C.black,
          paddingTop: 11,
          paddingBottom: 11,
          paddingLeft: 26,
          paddingRight: 26,
        },
      },
    },
    children: [
      el("paragraph", {
        text: TOP_BAR_MESSAGES[0],
        align: "center",
        color: C.accent,
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 16,
              fontWeight: 400,
              lineHeight: 1.4,
              marginBottom: 0,
              maxWidth: 710,
            },
          },
        },
      }),
    ],
  });

  const heroHeader = el("flexbox", { tag: "div", contentWidth: "full" }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          paddingTop: 17,
          paddingBottom: 17,
          paddingLeft: 44,
          paddingRight: 44,
          maxWidth: 1920,
          marginLeft: "auto",
          marginRight: "auto",
        },
      },
    },
    children: [
      el("icon", {
        icon: "☰",
        view: "default",
        shape: "circle",
        link: "#menu",
        align: "left",
        primaryColor: C.white,
        size: 20,
      }, {
        styles: { desktop: { normal: { filter: "brightness(0) invert(1)", minWidth: 40 } } },
      }),
      el("image", {
        src: ASSETS.logo,
        alt: "The Public Market",
        link: "/",
        align: "center",
      }, {
        styles: {
          desktop: {
            normal: {
              width: 100,
              filter: "brightness(0) invert(1)",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            },
          },
        },
      }),
      el("button", {
        text: "ORDER FOOD",
        url: "https://publicmarketemeryville.menu/",
        align: "right",
        size: "small",
        backgroundColor: "transparent",
        textColor: C.white,
        borderRadius: 0,
        paddingX: 0,
        paddingY: 0,
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: 0.08,
              textTransform: "uppercase",
              borderWidth: 0,
              minWidth: 0,
            },
          },
        },
      }),
    ],
  });

  const navMenu = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "center",
    justify: "center",
    gap: 40,
    minHeight: 0,
  }, {
    advanced: { cssId: "menu" },
    classes: ["pme-nav-overlay"],
    styles: {
      desktop: {
        normal: {
          display: "none",
          position: "fixed",
          inset: 0,
          zIndex: 100,
          backgroundColor: "rgba(31,31,31,0.97)",
          paddingTop: 120,
          paddingBottom: 80,
          paddingLeft: 44,
          paddingRight: 44,
          textAlign: "center",
          color: C.white,
        },
      },
    },
    children: [
      el("button", {
        text: "✕",
        url: "#top",
        align: "center",
        size: "small",
        backgroundColor: "transparent",
        textColor: C.white,
        borderRadius: 0,
        paddingX: 0,
        paddingY: 0,
      }, {
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              top: 52,
              right: 44,
              fontSize: 28,
              borderWidth: 0,
              minWidth: 0,
            },
          },
        },
      }),
      el("icon-list", {
        layout: "traditional",
        align: "center",
        spaceBetween: 24,
        textColor: C.white,
        iconColor: C.accent,
        items: [
          { text: "Vendors", icon: "", url: "/vendors/" },
          { text: "Leasing", icon: "", url: "#leasing" },
          { text: "Directory", icon: "", url: "/directory/" },
          { text: "Events", icon: "", url: "/events/" },
          { text: "Order Food", icon: "", url: "https://publicmarketemeryville.menu/" },
          { text: "Contact", icon: "", url: "/contact/" },
        ],
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 28,
              fontFamily: "'Faculty Glyphic', Georgia, serif",
              letterSpacing: 0.04,
              textTransform: "uppercase",
            },
          },
        },
      }),
      el("icon-list", {
        layout: "traditional",
        align: "center",
        spaceBetween: 14,
        textColor: C.muted,
        iconColor: C.accent,
        items: [
          { text: "Food Hall", icon: "", url: "/leasing-type/food-hall/" },
          { text: "Office & Life Science", icon: "", url: "/leasing-type/office-life-science/" },
          { text: "Adjacent Retail", icon: "", url: "/leasing-type/adjacent-retail/" },
        ],
      }, {
        styles: {
          desktop: {
            normal: {
              fontSize: 18,
              letterSpacing: 0.04,
              textTransform: "uppercase",
            },
          },
        },
      }),
      el("social-icons", {
        items: [
          { network: "Instagram", icon: "IG", url: "https://www.instagram.com/publicmarketemeryville/" },
          { network: "Facebook", icon: "f", url: "https://www.facebook.com/PublicMarketEmeryville/" },
        ],
        shape: "rounded",
        columns: "auto",
        align: "center",
        size: 18,
        spacing: 20,
        padding: 0,
        primaryColor: C.white,
        secondaryColor: C.accent,
      }, {
        styles: {
          desktop: {
            normal: {
              marginTop: 20,
              letterSpacing: 0.08,
              textTransform: "uppercase",
              fontSize: 14,
            },
          },
        },
      }),
    ],
  });

  const hero = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    justify: "center",
    align: "center",
    gap: 0,
    minHeight: 600,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          paddingTop: 120,
          paddingBottom: 100,
          textAlign: "center",
          color: C.white,
          overflow: "hidden",
        },
      },
    },
    children: [
      el("video", {
        src: ASSETS.heroVideo,
        poster: ASSETS.heroPoster,
        posterEnabled: true,
        autoplay: true,
        controls: false,
        loop: true,
        muted: true,
        playsInline: true,
        preload: "metadata",
        aspectRatio: "16:9",
        download: false,
      }, {
        advanced: { cssClasses: "pme-hero-media" },
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
            },
          },
        },
      }),
      el("div-block", { tag: "div" }, {
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(124,124,124,0.45)",
              mixBlendMode: "multiply",
              zIndex: 1,
            },
          },
        },
      }),
      heroHeader,
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              position: "relative",
              zIndex: 2,
              flex: 1,
              width: "100%",
              paddingLeft: 24,
              paddingRight: 24,
            },
          },
        },
        children: [
          el("heading", {
            text: "Welcome To",
            tag: "h1",
            align: "center",
            color: C.white,
          }, {
            styles: {
              desktop: {
                normal: {
                  fontSize: 72,
                  fontWeight: 400,
                  lineHeight: 1.08,
                  marginBottom: 0,
                },
              },
              mobile: { normal: { fontSize: 42 } },
            },
          }),
          el("heading", {
            text: "The Public Market",
            tag: "h1",
            align: "center",
            color: C.white,
          }, {
            styles: {
              desktop: {
                normal: {
                  fontSize: 72,
                  fontWeight: 400,
                  lineHeight: 1.08,
                  marginBottom: 0,
                },
              },
              mobile: { normal: { fontSize: 42 } },
            },
            advanced: { entranceAnimation: "fadeInUp", animationDuration: "normal" },
          }),
          el("paragraph", {
            text: "MORE THAN JUST A FOOD HALL",
            align: "center",
            color: C.white,
          }, {
            styles: {
              desktop: {
                normal: {
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: 0.04,
                  marginBottom: 0,
                  marginTop: 16,
                },
              },
            },
          }),
        ],
      }),
      el("read-more", {
        text: "Scroll ↓",
        link: "#about-us",
      }, {
        advanced: { cssClasses: "pme-scroll-link" },
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              bottom: 44,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              color: C.accent,
              fontSize: 14,
              letterSpacing: 0.08,
              textTransform: "uppercase",
            },
          },
        },
      }),
    ],
  });

  const aboutSection = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "center",
    gap: 48,
    minHeight: 0,
  }, {
    advanced: { cssId: "about-us" },
    styles: {
      desktop: {
        normal: {
          display: "flex",
          width: "100%",
          paddingTop: 140,
          paddingBottom: 80,
          paddingLeft: 44,
          paddingRight: 44,
          textAlign: "center",
          color: C.text,
        },
      },
    },
    children: [
      el("image", {
        src: ASSETS.emblem,
        alt: "Public Market emblem",
        align: "center",
      }, {
        styles: { desktop: { normal: { width: 170, marginBottom: 20 } } },
      }),
      el("flexbox", { tag: "div", contentWidth: "boxed" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 32,
              flexWrap: "nowrap",
              width: "100%",
              maxWidth: 1280,
              marginLeft: "auto",
              marginRight: "auto",
            },
          },
          tablet: { normal: { flexWrap: "wrap", justifyContent: "center" } },
        },
        children: [
          infoBox("HOURS OF OPERATION", ["Mon – Sat", "10am – 9pm", "Sunday", "10am – 8pm"]),
          el("container", {
            containerLayout: "flexbox",
            contentWidth: "full",
            direction: "column",
            align: "center",
            gap: 29,
            minHeight: 0,
          }, {
            styles: { desktop: { normal: { flex: 1, minWidth: 320, maxWidth: 690, paddingLeft: 32, paddingRight: 32 } } },
            children: [
              el("heading", {
                text: "More than just",
                tag: "h2",
                align: "center",
                color: C.text,
              }, {
                styles: { desktop: { normal: { fontSize: 70, fontWeight: 400, lineHeight: 1.1, marginBottom: 0 } } },
              }),
              el("heading", {
                text: "a food hall",
                tag: "h2",
                align: "center",
                color: C.text,
              }, {
                styles: { desktop: { normal: { fontSize: 70, fontWeight: 400, lineHeight: 1.1, marginBottom: 0 } } },
              }),
              el("paragraph", {
                text: "Emeryville Public Market is more than a food hall—it's a vibrant, mixed-use destination where culture, commerce, and community intersect. Anchored by a curated collection of local culinary experiences, the Market is energized by a seamless blend of retail, office, and life science spaces that activate the environment from morning through evening. This layered ecosystem creates a dynamic, always-on destination—one where people come not just to dine, but to connect, work, discover, and be part of a thriving, innovation-driven community.",
                align: "center",
                color: C.text,
              }, {
                styles: { desktop: { normal: { fontSize: 21, lineHeight: 1.47, fontWeight: 300, marginTop: 29 } } },
              }),
            ],
          }),
          infoBox("ADDRESS", [], {
            text: "5959 Shellmound St.\nEmeryville, CA 94608",
            url: "https://maps.app.goo.gl/mmmuE8G2PmopdVCs5",
          }),
        ],
      }),
      el("image", {
        src: ASSETS.galleryMark,
        alt: "Gallery mark",
        align: "center",
      }, {
        styles: {
          desktop: {
            normal: {
              width: 140,
              position: "relative",
              zIndex: 4,
              marginTop: 40,
            },
          },
        },
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 0,
              flexWrap: "nowrap",
              width: "100%",
              maxWidth: 1280,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: -80,
              overflowX: "auto",
              paddingBottom: 40,
            },
          },
        },
        children: [
          polaroid(GALLERY_ITEMS[0].label, GALLERY_ITEMS[0].image, "168px", 375),
          polaroid(GALLERY_ITEMS[1].label, GALLERY_ITEMS[1].image, "196px", 388),
          polaroid(GALLERY_ITEMS[2].label, GALLERY_ITEMS[2].image, "182px", 375),
          polaroid(GALLERY_ITEMS[3].label, GALLERY_ITEMS[3].image, "266px", 339),
          polaroid(GALLERY_ITEMS[4].label, GALLERY_ITEMS[4].image, "196px", 380),
          polaroid(GALLERY_ITEMS[5].label, GALLERY_ITEMS[5].image, "196px", 380),
          polaroid(GALLERY_ITEMS[6].label, GALLERY_ITEMS[6].image, "280px", 339),
          polaroid(GALLERY_ITEMS[7].label, GALLERY_ITEMS[7].image, "182px", 392),
        ],
      }),
    ],
  });

  const vendorsSection = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "column",
    align: "stretch",
    gap: 0,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          position: "relative",
          width: "100%",
          paddingTop: 100,
          paddingBottom: 80,
          paddingLeft: 44,
          paddingRight: 44,
          color: C.white,
        },
      },
    },
    children: [
      el("image", {
        src: ASSETS.vendorsBg,
        alt: "",
        objectFit: "cover",
      }, {
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            },
          },
        },
      }),
      el("div-block", { tag: "div" }, {
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(90,90,90,0.51)",
              mixBlendMode: "multiply",
              zIndex: 1,
            },
          },
        },
      }),
      el("flexbox", { tag: "div", contentWidth: "boxed" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 40,
              position: "relative",
              zIndex: 2,
              marginBottom: 116,
              maxWidth: 1280,
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
            },
          },
        },
        children: [
          el("heading", {
            text: "Our Vendors",
            tag: "h2",
            align: "left",
            color: C.white,
          }, {
            styles: { desktop: { normal: { fontSize: 70, fontWeight: 400, marginBottom: 0 } } },
          }),
          marketButton("View All Vendors", "/vendors/", "link", "right"),
        ],
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              gap: 17,
              overflowX: "auto",
              position: "relative",
              zIndex: 2,
              paddingBottom: 142,
            },
          },
        },
        children: VENDORS.map(vendorCard),
      }),
    ],
  });

  const leasingSection = el("container", {
    containerLayout: "flexbox",
    contentWidth: "boxed",
    direction: "column",
    align: "stretch",
    gap: 0,
    minHeight: 0,
  }, {
    advanced: { cssId: "leasing" },
    styles: {
      desktop: {
        normal: {
          display: "flex",
          paddingTop: 80,
          paddingBottom: 224,
          paddingLeft: 44,
          paddingRight: 44,
          color: C.text,
          overflow: "hidden",
        },
      },
    },
    children: [
      el("flexbox", { tag: "div", contentWidth: "boxed" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 24,
            },
          },
        },
        children: [
          el("heading", {
            text: "Looking To Lease?",
            tag: "h2",
            align: "left",
            color: C.text,
          }, {
            styles: { desktop: { normal: { fontSize: 128, fontWeight: 400, lineHeight: 1.12 } } },
          }),
          marketButton("Contact Us", "/contact/", "link", "right"),
        ],
      }),
      el("divider", {
        style: "solid",
        width: 100,
        weight: 1,
        gap: 45,
        color: "#7B7474",
        align: "left",
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              gap: 10,
              overflowX: "auto",
              paddingLeft: 36,
              paddingRight: 36,
            },
          },
        },
        children: LEASING.map(leasingSlide),
      }),
    ],
  });

  const eventsSection = el("container", {
    containerLayout: "flexbox",
    contentWidth: "boxed",
    direction: "column",
    align: "stretch",
    gap: 0,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          paddingTop: 140,
          paddingBottom: 114,
          paddingLeft: 44,
          paddingRight: 44,
          backgroundColor: "rgba(31,31,31,0.95)",
          color: C.white,
        },
      },
    },
    children: [
      el("flexbox", { tag: "div", contentWidth: "boxed" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
              marginBottom: 47,
            },
          },
        },
        children: [
          el("heading", {
            text: "Events",
            tag: "h2",
            align: "left",
            color: C.white,
          }, {
            styles: { desktop: { normal: { fontSize: 60, fontWeight: 400, marginBottom: 0 } } },
          }),
          marketButton("CHECK OUT MORE", "/events/", "solid", "right"),
        ],
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 50,
              marginTop: 86,
            },
          },
        },
        children: EVENTS.map(eventCard),
      }),
    ],
  });

  const followSection = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "row",
    justify: "space-between",
    align: "center",
    gap: 0,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexWrap: "nowrap",
          paddingTop: 0,
          paddingBottom: 0,
          color: C.text,
          textAlign: "center",
          marginBottom: -180,
        },
      },
    },
    children: [
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flex: 1,
            },
          },
        },
        children: [
          el("image", { src: FOLLOW_IMAGES[0], alt: "Market 1", objectFit: "cover" }, {
            styles: { desktop: { normal: { width: "80%", height: 364, marginTop: 80, marginLeft: "auto" } } },
          }),
          el("image", { src: FOLLOW_IMAGES[1], alt: "Market 2", objectFit: "cover" }, {
            styles: { desktop: { normal: { width: "100%", height: 680 } } },
          }),
        ],
      }),
      el("container", {
        containerLayout: "flexbox",
        contentWidth: "full",
        direction: "column",
        align: "center",
        justify: "center",
        gap: 57,
        minHeight: 0,
      }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              minWidth: 600,
              paddingTop: 48,
              paddingBottom: 48,
              zIndex: 3,
            },
          },
        },
        children: [
          el("heading", {
            text: "Don't Miss\nWhat's Next",
            tag: "h2",
            align: "center",
            color: C.text,
          }, {
            styles: { desktop: { normal: { fontSize: 128, fontWeight: 400, lineHeight: 1.12 } } },
          }),
          marketButton("FOLLOW @PUBLICMARKETEMERYVILLE", "https://www.instagram.com/publicmarketemeryville/", "outline", "center"),
        ],
      }),
      el("flexbox", { tag: "div", contentWidth: "full" }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flex: 1,
            },
          },
        },
        children: [
          el("image", { src: FOLLOW_IMAGES[2], alt: "Market 3", objectFit: "cover" }, {
            styles: { desktop: { normal: { width: "75%", height: 366, marginLeft: "auto", marginTop: 80 } } },
          }),
          el("image", { src: FOLLOW_IMAGES[3], alt: "Market 4", objectFit: "cover" }, {
            styles: { desktop: { normal: { width: "90%", height: 600, marginLeft: "auto" } } },
          }),
        ],
      }),
    ],
  });

  const footer = el("container", {
    containerLayout: "flexbox",
    contentWidth: "full",
    direction: "row",
    align: "stretch",
    gap: 0,
    minHeight: 0,
  }, {
    styles: {
      desktop: {
        normal: {
          display: "flex",
          flexWrap: "wrap",
          backgroundColor: C.dark,
          color: C.white,
        },
      },
    },
    children: [
      el("container", {
        containerLayout: "flexbox",
        contentWidth: "full",
        direction: "row",
        align: "stretch",
        gap: 0,
        minHeight: 0,
      }, {
        styles: { desktop: { normal: { display: "flex", flex: 1, minWidth: 320 } } },
        children: [
          el("image", {
            src: ASSETS.newsletterPhoto,
            alt: "People dining",
            objectFit: "cover",
          }, {
            styles: {
              desktop: {
                normal: {
                  width: "50%",
                  minHeight: 420,
                  objectFit: "cover",
                  display: "block",
                },
              },
              mobile: { normal: { display: "none" } },
            },
          }),
          el("container", {
            containerLayout: "flexbox",
            contentWidth: "full",
            direction: "column",
            align: "center",
            justify: "center",
            gap: 36,
            minHeight: 420,
          }, {
            styles: {
              desktop: {
                normal: {
                  display: "flex",
                  flex: 1,
                  backgroundColor: C.cream,
                  color: C.text,
                  paddingTop: 154,
                  paddingBottom: 126,
                  paddingLeft: 70,
                  paddingRight: 70,
                  textAlign: "center",
                },
              },
            },
            children: [
              el("paragraph", {
                text: "Join our mailing list and keep up to date about market news & events",
                align: "center",
                color: C.text,
              }, {
                styles: { desktop: { normal: { fontSize: 16, maxWidth: 263, marginBottom: 0 } } },
              }),
              el("form", {
                fields: [{ label: "Email", type: "email", required: true }],
                buttonText: "SUBSCRIBE",
              }),
            ],
          }),
        ],
      }),
      el("container", {
        containerLayout: "flexbox",
        contentWidth: "full",
        direction: "column",
        align: "stretch",
        gap: 32,
        minHeight: 0,
      }, {
        styles: {
          desktop: {
            normal: {
              display: "flex",
              flex: 1,
              minWidth: 320,
              paddingTop: 107,
              paddingBottom: 37,
              paddingLeft: 90,
              paddingRight: 90,
            },
          },
        },
        children: [
          el("grid", { columns: 3, gap: 40, tag: "div" }, {
            children: [
              footerLinks("EXPLORE", [
                { text: "VENDORS", url: "/vendors/" },
                { text: "NEWS & EVENTS", url: "/news/" },
              ]),
              footerLinks("FOLLOW US", [
                { text: "INSTAGRAM", url: "https://www.instagram.com/publicmarketemeryville/" },
                { text: "FACEBOOK", url: "https://www.facebook.com/PublicMarketEmeryville/" },
              ]),
              footerLinks("LEASING", [
                { text: "ADJACENT RETAIL", url: "/leasing-type/adjacent-retail/" },
                { text: "FOOD HALL", url: "/leasing-type/food-hall/" },
                { text: "OFFICE & LIFE SCIENCE", url: "/leasing-type/office-life-science/" },
              ]),
            ],
          }),
          el("flexbox", { tag: "div", contentWidth: "full" }, {
            styles: {
              desktop: {
                normal: {
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 40,
                  alignItems: "flex-start",
                },
              },
            },
            children: [
              el("image", {
                src: ASSETS.logo,
                alt: "The Public Market",
                align: "left",
              }, {
                styles: { desktop: { normal: { width: 139, filter: "brightness(0) invert(1)" } } },
              }),
              footerLinks("LEASING CONTACT", [{ text: "EMAIL TBD", url: "#" }]),
              el("container", {
                containerLayout: "flexbox",
                contentWidth: "full",
                direction: "column",
                align: "stretch",
                gap: 20,
                minHeight: 0,
              }, {
                styles: {
                  desktop: {
                    normal: {
                      display: "flex",
                      flex: 1,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: C.accent,
                      paddingTop: 40,
                      paddingBottom: 42,
                      paddingLeft: 46,
                      paddingRight: 46,
                    },
                  },
                },
                children: [
                  el("heading", {
                    text: "VISIT US",
                    tag: "h6",
                    align: "left",
                    color: C.accent,
                  }, {
                    styles: { desktop: { normal: { fontSize: 14, textTransform: "uppercase", marginBottom: 0 } } },
                  }),
                  el("flexbox", { tag: "div", contentWidth: "full" }, {
                    styles: {
                      desktop: {
                        normal: {
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: 40,
                          flexWrap: "wrap",
                        },
                      },
                    },
                    children: [
                      el("container", {
                        containerLayout: "flexbox",
                        contentWidth: "full",
                        direction: "column",
                        gap: 8,
                        minHeight: 0,
                      }, {
                        children: [
                          el("heading", { text: "HOURS", tag: "h6", align: "left", color: C.accent }, {
                            styles: { desktop: { normal: { fontSize: 14, marginBottom: 0 } } },
                          }),
                          bodyText("Mon - Sat: 10am - 9pm", "left", C.white),
                          bodyText("Sunday: 10am - 8pm", "left", C.white),
                          bodyText("Closed Thanksgiving, Christmas & New Year's Day", "left", C.white),
                        ],
                      }),
                      el("container", {
                        containerLayout: "flexbox",
                        contentWidth: "full",
                        direction: "column",
                        gap: 8,
                        minHeight: 0,
                      }, {
                        children: [
                          el("heading", { text: "LOCATION", tag: "h6", align: "left", color: C.accent }, {
                            styles: { desktop: { normal: { fontSize: 14, marginBottom: 0 } } },
                          }),
                          el("button", {
                            text: "5959 Shellmound St.\nEmeryville, CA 94608",
                            url: "https://maps.app.goo.gl/5k1wy1fADhUDr9dm6",
                            align: "left",
                            backgroundColor: "transparent",
                            textColor: C.white,
                            borderRadius: 0,
                            paddingX: 0,
                            paddingY: 0,
                          }, {
                            styles: {
                              desktop: {
                                normal: {
                                  fontSize: 15,
                                  fontWeight: 300,
                                  lineHeight: 1.4,
                                  textTransform: "none",
                                  letterSpacing: 0,
                                  whiteSpace: "pre-line",
                                },
                              },
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          el("divider", { style: "solid", width: 100, weight: 1, gap: 16, color: "#333", align: "left" }),
          el("flexbox", { tag: "div", contentWidth: "full" }, {
            styles: {
              desktop: {
                normal: {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 14,
                },
              },
            },
            children: [
              el("paragraph", {
                text: "© Public Market Emeryville – 2026 All Rights Reserved.",
                align: "left",
                color: "#cccccc",
              }, {
                styles: { desktop: { normal: { fontSize: 14, lineHeight: 1.5 } } },
              }),
              el("read-more", {
                text: "Designed & Developed by Channel 13",
                link: "https://channel13.ca/",
              }, {
                styles: { desktop: { normal: { fontSize: 14, color: "#cccccc" } } },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return {
    editor: "nextpress",
    version: 1,
    content: [
      el("read-more", { text: "Skip to content", link: "#about-us" }, {
        styles: {
          desktop: {
            normal: {
              position: "absolute",
              left: -9999,
              top: 0,
              zIndex: 999,
            },
            focus: {
              left: 16,
              top: 16,
              backgroundColor: C.white,
              color: C.text,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
            },
          },
        },
      }),
      el("menu-anchor", { id: "top" }),
      topBar,
      navMenu,
      hero,
      aboutSection,
      el("menu-anchor", { id: "vendors" }),
      vendorsSection,
      leasingSection,
      eventsSection,
      followSection,
      footer,
    ],
    settings: {
      title: "The Public Market",
      contentWidth: 1280,
      backgroundColor: C.white,
      textColor: C.text,
      customCss: [
        "@import url('https://fonts.googleapis.com/css2?family=Caveat&family=Faculty+Glyphic&family=Roboto:ital,wght@0,300;0,400;0,500;1,300&display=swap');",
        ".npb-page { font-family: Roboto, sans-serif; font-weight: 300; color: #494747; width: 100%; max-width: none; overflow-x: hidden; }",
        ".npb-page h1, .npb-page h2, .npb-page h3, .npb-page h4, .npb-page h5, .npb-page h6 { font-family: 'Faculty Glyphic', Georgia, serif; font-weight: 400; margin: 0; }",
        ".npb-page figure { margin: 0; }",
        ".npb-page .npb-button { text-decoration: none; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }",
        ".npb-page a { text-decoration: none; }",
        ".pme-hero-media { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 0 !important; overflow: hidden !important; }",
        ".pme-hero-media .npb-video { position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; padding-bottom: 0 !important; }",
        ".pme-hero-media .npb-video video { width: 100%; height: 100%; object-fit: cover; }",
        ".pme-scroll-link a { color: #6FA84C !important; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em; font-size: 14px; }",
        ".pme-nav-overlay:target { display: flex !important; }",
        ".pme-nav-overlay .npb-icon-list { list-style: none; padding: 0; margin: 0; }",
        ".pme-nav-overlay .npb-icon-list a { color: inherit; text-decoration: none; }",
        ".npb-class-pme-vendor-card { box-shadow: none; }",
        ".npb-form { display: grid; gap: 46px; max-width: 425px; margin: 0 auto; }",
        ".npb-form label { display: grid; gap: 8px; font-size: 30px; font-family: 'Faculty Glyphic', Georgia, serif; color: #494747; text-align: center; }",
        ".npb-form input { border: 0; border-bottom: 1px solid #494747; border-radius: 0; background: transparent; padding: 0 22px 12px; text-align: center; font-size: 30px; font-family: 'Faculty Glyphic', Georgia, serif; color: #494747; }",
        ".npb-form button { min-width: 153px; padding: 13px 12px 10px; background: #6FA84C; color: #fff; border: 1px solid #6FA84C; border-radius: 0; font-size: 15px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; margin: 0 auto; }",
      ].join("\n"),
    },
    globals: {
      colors: {
        primary: C.text,
        secondary: "#71717a",
        text: C.text,
        accent: C.accent,
        background: C.white,
      },
      fonts: {
        primary: "Roboto, sans-serif",
        heading: "'Faculty Glyphic', Georgia, serif",
        accent: '"Caveat", cursive',
      },
      variables: {
        "--pme-accent": C.accent,
        "--pme-container": "1280px",
      },
      classes: [
        {
          id: "pme-info-box",
          name: "PME Info Box",
          styles: {
            desktop: {
              normal: {
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: C.border,
                boxShadow: "0 3px 9px rgba(0,0,0,0.16)",
              },
            },
          },
        },
        {
          id: "pme-vendor-card",
          name: "PME Vendor Card",
          styles: {
            desktop: {
              normal: {
                backgroundColor: C.white,
                boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
              },
            },
          },
        },
      ],
    },
  };
}
