import type { CreateCustomBlockInput } from "../types/plugins";
import { E2M_CUSTOM_BLOCK_SEEDS } from "./e2m-blocks";
import { PME_CUSTOM_BLOCK_SEEDS } from "./pme-blocks";
import { PME_PAGE_CUSTOM_BLOCK_SEEDS } from "./pme-page-blocks";

/**
 * Built-in custom blocks that replace hardcoded section components from
 * `packages/blocks/src/sections.tsx` and `info-card.tsx`.
 *
 * Seeded into Strapi on bootstrap; shown in the Puck editor under their category.
 */
export const BUILTIN_CUSTOM_BLOCK_SEEDS: CreateCustomBlockInput[] = [
  {
    puckType: "CustomBlock-section-heading",
    label: "Section heading",
    category: "sections",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Section title" },
      { name: "highlight", label: "Highlighted word", type: "text", defaultValue: "" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "highlightColor", label: "Highlight color", type: "color", defaultValue: "#6FA84C" },
      { name: "backgroundColor", label: "Background color", type: "color", defaultValue: "#ffffff" },
      {
        name: "alignment",
        label: "Alignment",
        type: "select",
        defaultValue: "center",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
    ],
    template: `<section style="padding:64px 24px;background:{{backgroundColor}};text-align:{{alignment}}">
  <div style="max-width:48rem;margin:0 auto">
    <h2 style="font-size:clamp(24px,3.5vw,44px);font-weight:400;line-height:1.2;margin:0;color:#494747">
      {{title}}{{#highlight}} <span style="color:{{highlightColor}}">{{highlight}}</span>{{/highlight}}
    </h2>
    {{#description}}<p style="margin:16px 0 0;font-size:18px;font-weight:300;line-height:1.6;color:#666">{{description}}</p>{{/description}}
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-info-card",
    label: "Info card",
    category: "sections",
    fields: [
      { name: "label", label: "Label", type: "text", defaultValue: "Hours of Operation" },
      { name: "lines", label: "Lines (one per line)", type: "textarea", defaultValue: "Mon – Sat 10am – 9pm\nSunday 10am – 8pm" },
      { name: "borderColor", label: "Border color", type: "color", defaultValue: "#6FA84C" },
      { name: "textColor", label: "Text color", type: "color", defaultValue: "#494747" },
      { name: "labelColor", label: "Label color", type: "color", defaultValue: "#595959" },
      {
        name: "alignment",
        label: "Alignment",
        type: "select",
        defaultValue: "center",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
    ],
    template: `<div style="min-height:220px;display:flex;flex-direction:column;justify-content:center;border:1px solid {{borderColor}};padding:32px 24px;text-align:{{alignment}};color:{{textColor}}">
  <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:{{labelColor}}">{{label}}</p>
  <div style="margin-top:16px;font-size:clamp(18px,2.5vw,26px);line-height:1.35;white-space:pre-line">{{lines}}</div>
</div>`,
  },
  {
    puckType: "CustomBlock-stat-row",
    label: "Stat row",
    category: "sections",
    fields: [
      { name: "stat1Value", label: "Stat 1 value", type: "text", defaultValue: "50+" },
      { name: "stat1Label", label: "Stat 1 label", type: "text", defaultValue: "Vendors" },
      { name: "stat2Value", label: "Stat 2 value", type: "text", defaultValue: "12" },
      { name: "stat2Label", label: "Stat 2 label", type: "text", defaultValue: "Cuisines" },
      { name: "stat3Value", label: "Stat 3 value", type: "text", defaultValue: "7" },
      { name: "stat3Label", label: "Stat 3 label", type: "text", defaultValue: "Days a week" },
      { name: "stat4Value", label: "Stat 4 value", type: "text", defaultValue: "1" },
      { name: "stat4Label", label: "Stat 4 label", type: "text", defaultValue: "Community" },
      { name: "accentColor", label: "Value color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:64px 24px">
  <div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:32px;text-align:center">
    <div><div style="font-size:clamp(28px,4vw,50px);font-weight:500;color:{{accentColor}}">{{stat1Value}}</div><div style="margin-top:8px;font-size:14px;font-weight:300;color:#666">{{stat1Label}}</div></div>
    <div><div style="font-size:clamp(28px,4vw,50px);font-weight:500;color:{{accentColor}}">{{stat2Value}}</div><div style="margin-top:8px;font-size:14px;font-weight:300;color:#666">{{stat2Label}}</div></div>
    <div><div style="font-size:clamp(28px,4vw,50px);font-weight:500;color:{{accentColor}}">{{stat3Value}}</div><div style="margin-top:8px;font-size:14px;font-weight:300;color:#666">{{stat3Label}}</div></div>
    <div><div style="font-size:clamp(28px,4vw,50px);font-weight:500;color:{{accentColor}}">{{stat4Value}}</div><div style="margin-top:8px;font-size:14px;font-weight:300;color:#666">{{stat4Label}}</div></div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-promo-banner",
    label: "Promo banner",
    category: "sections",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Join our community" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "Stay up to date on events, vendors, and news." },
      { name: "buttonLabel", label: "Button label", type: "text", defaultValue: "Learn more" },
      { name: "buttonHref", label: "Button URL", type: "url", defaultValue: "#" },
      { name: "backgroundColor", label: "Background color", type: "color", defaultValue: "#1C1C1C" },
      { name: "buttonColor", label: "Button color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:80px 24px;color:#fff;text-align:center;background:{{backgroundColor}}">
  <div style="max-width:72rem;margin:0 auto">
    <h2 style="font-size:clamp(24px,3.5vw,40px);font-weight:500;margin:0">{{title}}</h2>
    {{#description}}<p style="margin:16px auto 0;max-width:42rem;font-size:18px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.85)">{{description}}</p>{{/description}}
    {{#buttonLabel}}<div style="margin-top:40px"><a href="{{buttonHref}}" style="display:inline-flex;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;background:{{buttonColor}}">{{buttonLabel}}</a></div>{{/buttonLabel}}
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-contact-cta",
    label: "Contact CTA",
    category: "sections",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Get in touch" },
      { name: "subtitle", label: "Subtitle", type: "text", defaultValue: "We'd love to hear from you" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "avatarText", label: "Avatar initials", type: "text", defaultValue: "PM" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:64px 24px;background:#f5f5f5">
  <div style="max-width:48rem;margin:0 auto;text-align:center">
    <div style="width:64px;height:64px;margin:0 auto 24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#fff;background:{{accentColor}}">{{avatarText}}</div>
    <p style="margin:0;font-size:14px;font-weight:500;color:{{accentColor}};text-transform:uppercase;letter-spacing:0.1em">{{subtitle}}</p>
    <h2 style="margin:12px 0 0;font-size:clamp(24px,3vw,36px);font-weight:500;color:#1c1c1c">{{title}}</h2>
    {{#description}}<p style="margin:16px 0 0;font-size:16px;line-height:1.6;color:#666">{{description}}</p>{{/description}}
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-leasing-tiles",
    label: "Leasing tiles",
    category: "sections",
    fields: [
      { name: "title", label: "Title (before highlight)", type: "text", defaultValue: "Looking To" },
      { name: "highlight", label: "Highlighted word", type: "text", defaultValue: "Lease?" },
      { name: "watermark", label: "Watermark text", type: "text", defaultValue: "Looking To Lease?" },
      { name: "ctaLabel", label: "CTA label", type: "text", defaultValue: "Contact Us" },
      { name: "ctaUrl", label: "CTA URL", type: "url", defaultValue: "#contact" },
      { name: "highlightColor", label: "Highlight color", type: "color", defaultValue: "#6FA84C" },
      { name: "tile1Title", label: "Tile 1 title", type: "text", defaultValue: "Food Hall" },
      { name: "tile1Image", label: "Tile 1 image URL", type: "image", defaultValue: "" },
      { name: "tile1Url", label: "Tile 1 link", type: "url", defaultValue: "#" },
      { name: "tile2Title", label: "Tile 2 title", type: "text", defaultValue: "Office & Life Science" },
      { name: "tile2Image", label: "Tile 2 image URL", type: "image", defaultValue: "" },
      { name: "tile2Url", label: "Tile 2 link", type: "url", defaultValue: "#" },
      { name: "tile3Title", label: "Tile 3 title", type: "text", defaultValue: "Adjacent Retail" },
      { name: "tile3Image", label: "Tile 3 image URL", type: "image", defaultValue: "" },
      { name: "tile3Url", label: "Tile 3 link", type: "url", defaultValue: "#" },
    ],
    template: `<section style="position:relative;padding:80px 24px;background:#fff;overflow:hidden">
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:clamp(48px,12vw,120px);font-weight:700;color:rgba(0,0,0,0.04);pointer-events:none;white-space:nowrap">{{watermark}}</div>
  <div style="position:relative;max-width:72rem;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:48px">
      <h2 style="margin:0;font-size:clamp(28px,4vw,48px);font-weight:400;color:#494747">{{title}} <span style="color:{{highlightColor}}">{{highlight}}</span></h2>
      {{#ctaLabel}}<a href="{{ctaUrl}}" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:{{highlightColor}};text-decoration:none">{{ctaLabel}} ↗</a>{{/ctaLabel}}
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0">
      <a href="{{tile1Url}}" style="position:relative;display:block;min-height:520px;overflow:hidden;text-decoration:none">
        <img src="{{tile1Image}}" alt="{{tile1Title}}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 55%)"></div>
        <span style="position:absolute;bottom:28px;left:28px;color:#fff;font-size:clamp(18px,2vw,26px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif)">{{tile1Title}}</span>
        <span style="position:absolute;bottom:28px;right:28px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px">↗</span>
      </a>
      <a href="{{tile2Url}}" style="position:relative;display:block;min-height:520px;overflow:hidden;text-decoration:none">
        <img src="{{tile2Image}}" alt="{{tile2Title}}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 55%)"></div>
        <span style="position:absolute;bottom:28px;left:28px;color:#fff;font-size:clamp(18px,2vw,26px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif)">{{tile2Title}}</span>
        <span style="position:absolute;bottom:28px;right:28px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px">↗</span>
      </a>
      <a href="{{tile3Url}}" style="position:relative;display:block;min-height:520px;overflow:hidden;text-decoration:none">
        <img src="{{tile3Image}}" alt="{{tile3Title}}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
        <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 55%)"></div>
        <span style="position:absolute;bottom:28px;left:28px;color:#fff;font-size:clamp(18px,2vw,26px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif)">{{tile3Title}}</span>
        <span style="position:absolute;bottom:28px;right:28px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px">↗</span>
      </a>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-profile-spotlight",
    label: "Profile spotlight",
    category: "sections",
    fields: [
      { name: "name", label: "Name", type: "text", defaultValue: "Team member" },
      { name: "role", label: "Role", type: "text", defaultValue: "Role title" },
      { name: "quote", label: "Quote", type: "textarea", defaultValue: "A short quote or bio." },
      { name: "imageUrl", label: "Photo URL", type: "image", defaultValue: "" },
      { name: "linkLabel", label: "Link label", type: "text", defaultValue: "Read more" },
      { name: "linkUrl", label: "Link URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:64px 24px">
  <div style="max-width:56rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:40px;align-items:center">
    {{#imageUrl}}<img src="{{imageUrl}}" alt="{{name}}" style="width:100%;max-width:320px;border-radius:12px;object-fit:cover" />{{/imageUrl}}
    <div>
      <p style="margin:0;font-size:14px;font-weight:500;color:{{accentColor}}">{{role}}</p>
      <h2 style="margin:8px 0 0;font-size:clamp(24px,3vw,32px);font-weight:500;color:#1c1c1c">{{name}}</h2>
      <p style="margin:16px 0 0;font-size:16px;line-height:1.6;color:#666">{{quote}}</p>
      {{#linkLabel}}<a href="{{linkUrl}}" style="display:inline-block;margin-top:20px;font-size:14px;font-weight:600;color:{{accentColor}};text-decoration:none">{{linkLabel}} →</a>{{/linkLabel}}
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-split-panel",
    label: "Split panel",
    category: "sections",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Split section" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "Supporting copy for this section." },
      { name: "imageUrl", label: "Image URL", type: "image", defaultValue: "" },
      { name: "ctaLabel", label: "CTA label", type: "text", defaultValue: "Learn more" },
      { name: "ctaUrl", label: "CTA URL", type: "url", defaultValue: "#" },
      { name: "backgroundColor", label: "Background color", type: "color", defaultValue: "#f5f5f5" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:64px 24px;background:{{backgroundColor}}">
  <div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:48px;align-items:center">
    <div>
      <h2 style="margin:0;font-size:clamp(24px,3.5vw,40px);font-weight:500;color:#1c1c1c">{{title}}</h2>
      <p style="margin:16px 0 0;font-size:16px;line-height:1.6;color:#666">{{description}}</p>
      {{#ctaLabel}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:24px;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;color:#fff;text-decoration:none;background:{{accentColor}}">{{ctaLabel}}</a>{{/ctaLabel}}
    </div>
    {{#imageUrl}}<img src="{{imageUrl}}" alt="" style="width:100%;border-radius:12px;object-fit:cover" />{{/imageUrl}}
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-steps",
    label: "Steps",
    category: "sections",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "How it works" },
      { name: "highlight", label: "Highlighted word", type: "text", defaultValue: "" },
      { name: "step1Number", label: "Step 1 number", type: "text", defaultValue: "01" },
      { name: "step1Title", label: "Step 1 title", type: "text", defaultValue: "First step" },
      { name: "step1Description", label: "Step 1 description", type: "textarea", defaultValue: "" },
      { name: "step2Number", label: "Step 2 number", type: "text", defaultValue: "02" },
      { name: "step2Title", label: "Step 2 title", type: "text", defaultValue: "Second step" },
      { name: "step2Description", label: "Step 2 description", type: "textarea", defaultValue: "" },
      { name: "step3Number", label: "Step 3 number", type: "text", defaultValue: "03" },
      { name: "step3Title", label: "Step 3 title", type: "text", defaultValue: "Third step" },
      { name: "step3Description", label: "Step 3 description", type: "textarea", defaultValue: "" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:64px 24px">
  <div style="max-width:72rem;margin:0 auto">
    <h2 style="text-align:center;margin:0 0 48px;font-size:clamp(24px,3.5vw,40px);font-weight:500;color:#1c1c1c">{{title}}{{#highlight}} <span style="color:{{accentColor}}">{{highlight}}</span>{{/highlight}}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px">
      <div><div style="font-size:32px;font-weight:600;color:{{accentColor}}">{{step1Number}}</div><h3 style="margin:12px 0 0;font-size:18px;font-weight:600">{{step1Title}}</h3><p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#666">{{step1Description}}</p></div>
      <div><div style="font-size:32px;font-weight:600;color:{{accentColor}}">{{step2Number}}</div><h3 style="margin:12px 0 0;font-size:18px;font-weight:600">{{step2Title}}</h3><p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#666">{{step2Description}}</p></div>
      <div><div style="font-size:32px;font-weight:600;color:{{accentColor}}">{{step3Number}}</div><h3 style="margin:12px 0 0;font-size:18px;font-weight:600">{{step3Title}}</h3><p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#666">{{step3Description}}</p></div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-testimonial",
    label: "Testimonial",
    category: "sections",
    fields: [
      { name: "title", label: "Section title", type: "text", defaultValue: "What people say" },
      { name: "highlight", label: "Highlighted word", type: "text", defaultValue: "" },
      { name: "quote", label: "Quote", type: "textarea", defaultValue: "A great experience from start to finish." },
      { name: "name", label: "Name", type: "text", defaultValue: "Jane Doe" },
      { name: "role", label: "Role", type: "text", defaultValue: "Customer" },
      { name: "highlightColor", label: "Highlight color", type: "color", defaultValue: "#6FA84C" },
    ],
    template: `<section style="padding:64px 24px">
  <div style="max-width:48rem;margin:0 auto;text-align:center">
    <h2 style="margin:0 0 32px;font-size:clamp(24px,3.5vw,40px);font-weight:500;color:#1c1c1c">{{title}}{{#highlight}} <span style="color:{{highlightColor}}">{{highlight}}</span>{{/highlight}}</h2>
    <blockquote style="margin:0;padding:32px;border:1px solid #e5e5e5;border-radius:12px;background:#fff">
      <p style="margin:0;font-size:20px;font-weight:500;line-height:1.4;color:#1c1c1c">&ldquo;{{quote}}&rdquo;</p>
      <footer style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e5e5">
        <p style="margin:0;font-weight:600;color:#1c1c1c">{{name}}</p>
        <p style="margin:4px 0 0;font-size:14px;color:#666">{{role}}</p>
      </footer>
    </blockquote>
  </div>
</section>`,
  },
  ...PME_CUSTOM_BLOCK_SEEDS,
  ...PME_PAGE_CUSTOM_BLOCK_SEEDS,
  ...E2M_CUSTOM_BLOCK_SEEDS,
];

/** Puck component types replaced by CMS custom blocks (hidden from insert panel). */
export const LEGACY_SECTION_BLOCK_TYPES = [
  "SectionHeading",
  "StatRow",
  "InfoCard",
  "ServiceSection",
  "TestimonialsSection",
  "FeatureGrid",
  "SplitPanel",
  "StepsSection",
  "ProfileSpotlight",
  "ArticleGrid",
  "PromoBanner",
  "ContactCta",
] as const;
