import type { CreateCustomBlockInput } from "../types/plugins";

const ACCENT = "#6FA84C";
const TEXT = "#494747";

/**
 * Page-specific Public Market blocks — matched to live subpage designs
 * (vendors list, directory map, events text cards, order panel, leasing units, etc.)
 * rather than reusing homepage section components.
 */
export const PME_PAGE_CUSTOM_BLOCK_SEEDS: CreateCustomBlockInput[] = [
  {
    puckType: "CustomBlock-pme-page-hero",
    label: "PME — Page hero (image + title)",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Events" },
      { name: "imageUrl", label: "Background image", type: "image", defaultValue: "" },
      { name: "minHeight", label: "Min height (px)", type: "text", defaultValue: "70vh" },
      { name: "overlayOpacity", label: "Overlay 0–100", type: "text", defaultValue: "40" },
    ],
    template: `<section style="position:relative;min-height:{{minHeight}};display:flex;align-items:flex-end;background:#111;color:#fff;overflow:hidden">
  {{#imageUrl}}<img src="{{imageUrl}}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />{{/imageUrl}}
  <div style="position:absolute;inset:0;background:#000;opacity:0.{{overlayOpacity}}"></div>
  <div style="position:relative;width:100%;max-width:72rem;margin:0 auto;padding:48px 24px">
    <h1 style="margin:0;font-size:clamp(48px,8vw,96px);font-weight:600;letter-spacing:-0.02em;font-family:var(--theme-font-heading,Georgia,serif)">{{title}}</h1>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-vendor-toolbar",
    label: "PME — Vendors toolbar",
    category: "Public Market",
    fields: [
      { name: "categoryLabel", label: "Category label", type: "text", defaultValue: "Category: All" },
      { name: "galleryLabel", label: "Gallery label", type: "text", defaultValue: "Gallery" },
      { name: "listLabel", label: "List label", type: "text", defaultValue: "List" },
      { name: "directoryLabel", label: "Directory CTA", type: "text", defaultValue: "View Directory" },
      { name: "directoryUrl", label: "Directory URL", type: "url", defaultValue: "/directory" },
    ],
    template: `<section style="background:#fff;border-bottom:1px solid #e5e5e5">
  <div style="max-width:72rem;margin:0 auto;padding:16px 24px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px">
    <button type="button" style="background:none;border:0;padding:0;font-size:14px;color:#111;cursor:default">{{categoryLabel}} ▾</button>
    <div style="display:flex;align-items:center;gap:16px;font-size:14px;color:#111">
      <span><span style="font-weight:600">{{galleryLabel}}</span> · {{listLabel}}</span>
      <a href="{{directoryUrl}}" style="display:inline-flex;padding:8px 18px;border:1px solid #111;border-radius:999px;color:#111;text-decoration:none;font-size:13px">{{directoryLabel}}</a>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-vendor-name-list",
    label: "PME — Vendor name list (hover images)",
    category: "Public Market",
    fields: [
      {
        name: "listHtml",
        label: "List HTML",
        type: "richtext",
        defaultValue: "",
      },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#ffffff" },
    ],
    template: `<section style="background:{{backgroundColor}};padding:24px 0 64px">
  <style>
    .pme-vlist{max-width:72rem;margin:0 auto;padding:0 24px;position:relative}
    .pme-vlist a{position:relative;display:block;padding:10px 0;font-size:clamp(36px,5.5vw,64px);line-height:1.15;font-weight:400;color:#c8c8c8;text-decoration:none;font-family:var(--theme-font-heading,Georgia,serif);transition:color .2s ease}
    .pme-vlist a:hover{color:#494747;z-index:2}
    .pme-vlist a img{position:absolute;right:0;top:50%;transform:translateY(-50%);width:min(42vw,420px);aspect-ratio:4/3;object-fit:cover;opacity:0;pointer-events:none;box-shadow:0 18px 40px rgba(0,0,0,.18);transition:opacity .2s ease;z-index:1}
    .pme-vlist a:hover img{opacity:1}
  </style>
  <div class="pme-vlist">{{listHtml}}</div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-directory-map",
    label: "PME — Directory floor plan",
    category: "Public Market",
    fields: [
      { name: "mapHtml", label: "Map HTML / SVG", type: "richtext", defaultValue: "" },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#f3f3f3" },
    ],
    template: `<section style="background:{{backgroundColor}};padding:48px 24px">
  <div style="max-width:72rem;margin:0 auto;background:#fff;border:1px solid #e8e8e8;padding:24px;overflow:auto">
    <div style="min-width:640px">{{mapHtml}}</div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-directory-lists",
    label: "PME — Directory Retail / Food Hall lists",
    category: "Public Market",
    fields: [
      { name: "listsHtml", label: "Lists HTML", type: "richtext", defaultValue: "" },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#ffffff" },
    ],
    template: `<section style="background:{{backgroundColor}};padding:48px 24px 72px">
  <style>
    .pme-dir{max-width:72rem;margin:0 auto;display:grid;grid-template-columns:1.2fr 1fr;gap:48px}
    @media(max-width:900px){.pme-dir{grid-template-columns:1fr}}
    .pme-dir h2{margin:0 0 20px;font-size:clamp(28px,3vw,40px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif);color:#111}
    .pme-dir-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #e8e8e8;font-size:16px;color:#111;text-decoration:none}
    .pme-dir-badge{flex:0 0 auto;min-width:52px;height:28px;padding:0 10px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;background:#7b6ea8}
    .pme-dir-badge.is-food{background:#111}
    .pme-dir-badge.is-open{background:#111}
    .pme-dir-name{font-weight:600}
    .pme-dir-size{color:#666;font-weight:300}
  </style>
  <div class="pme-dir">{{listsHtml}}</div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-events-text-grid",
    label: "PME — Events text card grid",
    category: "Public Market",
    fields: [
      { name: "gridHtml", label: "Cards HTML", type: "richtext", defaultValue: "" },
      { name: "loadMoreLabel", label: "Load more label", type: "text", defaultValue: "Load More" },
      { name: "loadMoreUrl", label: "Load more URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#ffffff" },
    ],
    template: `<section style="background:{{backgroundColor}};padding:64px 24px">
  <style>
    .pme-evgrid{max-width:72rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:24px}
    @media(max-width:800px){.pme-evgrid{grid-template-columns:1fr}}
    .pme-evcard{display:block;border:1px solid #e5e5e5;padding:28px 28px 32px;text-decoration:none;color:#111;background:#fff;min-height:220px;transition:border-color .2s}
    .pme-evcard:hover{border-color:{{accentColor}}}
    .pme-evcard .tags{margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#888}
    .pme-evcard h3{margin:14px 0 0;font-size:clamp(22px,2.4vw,28px);font-weight:600;line-height:1.25}
    .pme-evcard p{margin:14px 0 0;font-size:15px;line-height:1.65;font-weight:300;color:#444}
  </style>
  <div class="pme-evgrid">{{gridHtml}}</div>
  {{#loadMoreLabel}}<div style="text-align:center;margin-top:40px"><a href="{{loadMoreUrl}}" style="display:inline-block;padding:14px 28px;background:{{accentColor}};color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">{{loadMoreLabel}}</a></div>{{/loadMoreLabel}}
</section>`,
  },
  {
    puckType: "CustomBlock-pme-contact-form-split",
    label: "PME — Contact form split heading",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Send us a message" },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#f5f5f5" },
      { name: "textColor", label: "Text", type: "color", defaultValue: "#111111" },
    ],
    template: `<section id="contact" style="background:{{backgroundColor}};padding:64px 24px 24px">
  <div style="max-width:72rem;margin:0 auto">
    <h2 style="margin:0;max-width:18rem;font-size:clamp(32px,4vw,48px);font-weight:600;line-height:1.15;color:{{textColor}};font-family:var(--theme-font-heading,Georgia,serif)">{{title}}</h2>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-order-panel",
    label: "PME — Order food + hours panel",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "ORDER FOOD + PURVEYOR HOURS" },
      {
        name: "body",
        label: "Intro",
        type: "textarea",
        defaultValue:
          "Now your tastebuds don't have to settle for just one cuisine. Order online from multiple food hall purveyors at once, then get a text alert when your order is ready for pickup.",
      },
      { name: "ctaLabel", label: "CTA", type: "text", defaultValue: "ORDER FOOD NOW >" },
      { name: "ctaUrl", label: "CTA URL", type: "url", defaultValue: "#" },
      { name: "hoursHtml", label: "Hours list HTML", type: "richtext", defaultValue: "" },
      { name: "backLabel", label: "Back link", type: "text", defaultValue: "← Back To All News" },
      { name: "backUrl", label: "Back URL", type: "url", defaultValue: "/events" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
      { name: "textColor", label: "Text", type: "color", defaultValue: TEXT },
    ],
    template: `<section style="padding:40px 24px 64px;background:#fff">
  <style>
    .pme-order-hours a{color:inherit;text-decoration:underline;font-weight:600}
    .pme-order-hours ul{margin:8px 0 22px;padding-left:18px;color:#444;font-weight:300;line-height:1.55}
  </style>
  <div style="max-width:72rem;margin:0 auto;border:1px solid {{accentColor}};display:grid;grid-template-columns:minmax(200px,280px) 1fr">
    <div style="background:{{accentColor}};min-height:480px;display:flex;align-items:center;justify-content:center;padding:32px">
      <div style="width:120px;height:120px;border-radius:50%;border:3px solid #111;display:flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;color:#111;line-height:1">
        <span style="font-size:42px">P</span><span style="font-size:18px;margin-top:2px">M</span>
      </div>
    </div>
    <div style="padding:40px 36px;color:{{textColor}}">
      <h1 style="margin:0;font-size:clamp(26px,3.5vw,40px);font-weight:700;letter-spacing:0.02em;text-transform:uppercase">{{title}}</h1>
      <p style="margin:18px 0 0;max-width:40rem;font-size:16px;line-height:1.7;font-weight:300">{{body}}</p>
      {{#ctaLabel}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:18px;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:{{textColor}}">{{ctaLabel}}</a>{{/ctaLabel}}
      <h2 style="margin:36px 0 16px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Purveyor Hours:</h2>
      <div class="pme-order-hours">{{hoursHtml}}</div>
      {{#backLabel}}<a href="{{backUrl}}" style="display:inline-block;margin-top:12px;color:{{accentColor}};text-decoration:none;font-weight:600">{{backLabel}}</a>{{/backLabel}}
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-leasing-hero",
    label: "PME — Leasing dark hero",
    category: "Public Market",
    fields: [
      { name: "breadcrumb", label: "Breadcrumb", type: "text", defaultValue: "LEASING > FOOD HALL" },
      { name: "bodyHtml", label: "Body HTML (use spans for highlights)", type: "richtext", defaultValue: "" },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#1a1a1a" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
    ],
    template: `<section style="padding:96px 24px;background:{{backgroundColor}};color:#fff">
  <div style="max-width:72rem;margin:0 auto">
    <p style="margin:0 0 48px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase">{{breadcrumb}}</p>
    <div style="max-width:42rem;margin-left:auto;font-size:clamp(24px,3.2vw,40px);line-height:1.45;font-weight:400;font-family:var(--theme-font-heading,Georgia,serif)">{{bodyHtml}}</div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-leasing-unit",
    label: "PME — Leasing unit row",
    category: "Public Market",
    fields: [
      { name: "title", label: "Unit title", type: "text", defaultValue: "Unit 11" },
      { name: "size", label: "Size", type: "text", defaultValue: "980 RSF" },
      {
        name: "features",
        label: "Features (one per line)",
        type: "textarea",
        defaultValue:
          "Access shared utilities, seating areas, cleaning services, security, and maintenance.\nOperate alongside other chefs and entrepreneurs for a vibrant customer experience.\nPlug-and-play or partially built-out spaces reduce upfront investment.",
      },
      { name: "imageUrl", label: "Image", type: "image", defaultValue: "" },
      { name: "inquireLabel", label: "Inquire label", type: "text", defaultValue: "INQUIRE NOW" },
      { name: "inquireUrl", label: "Inquire URL", type: "url", defaultValue: "/contact" },
      { name: "mapLabel", label: "Map label", type: "text", defaultValue: "VIEW MAP" },
      { name: "mapUrl", label: "Map URL", type: "url", defaultValue: "/directory" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
      {
        name: "layout",
        label: "Layout",
        type: "select",
        defaultValue: "text-left",
        options: [
          { label: "Text left / image right", value: "text-left" },
          { label: "Image left / text right", value: "image-left" },
        ],
      },
    ],
    template: `<section style="background:#fff;border-bottom:1px solid #e8e8e8">
  <div style="max-width:72rem;margin:0 auto;padding:48px 24px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center">
    {{#imageUrl}}<div style="{{#layout}}{{/layout}}"><img src="{{imageUrl}}" alt="{{title}}" style="width:100%;aspect-ratio:4/3;object-fit:cover" /></div>{{/imageUrl}}
    <div>
      <h2 style="margin:0;font-size:clamp(28px,3vw,40px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif);color:#111">{{title}} <span style="font-weight:300">{{size}}</span></h2>
      <div style="margin-top:24px;white-space:pre-line;font-size:15px;line-height:1.7;color:#555;border-top:1px solid #e5e5e5;padding-top:16px">{{features}}</div>
      <div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:12px">
        <a href="{{inquireUrl}}" style="display:inline-block;padding:12px 22px;background:{{accentColor}};color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.1em">{{inquireLabel}}</a>
        <a href="{{mapUrl}}" style="display:inline-block;padding:12px 22px;border:1px solid #ccc;color:#666;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.1em">{{mapLabel}}</a>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-html",
    label: "PME — Raw HTML section",
    category: "Public Market",
    fields: [
      { name: "html", label: "HTML", type: "richtext", defaultValue: "" },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#ffffff" },
    ],
    template: `<section style="background:{{backgroundColor}}">{{html}}</section>`,
  },
  {
    puckType: "CustomBlock-pme-leasing-inquire",
    label: "PME — Leasing inquire header row",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "INQUIRE NOW" },
      { name: "contactTitle", label: "Contact title", type: "text", defaultValue: "CONTACT" },
      { name: "contactLines", label: "Contact lines", type: "textarea", defaultValue: "Name (TBD)\nEmail (TBD)\nPhone (TBD)" },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#f5f5f5" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
    ],
    template: `<section style="background:{{backgroundColor}};padding:64px 24px 16px">
  <div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:32px">
    <h2 style="margin:0;font-size:clamp(28px,3vw,40px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif)">{{title}}</h2>
    <div>
      <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:{{accentColor}}">{{contactTitle}}</p>
      <div style="margin-top:16px;white-space:pre-line;font-size:16px;line-height:2;color:#333;border-top:1px solid #ddd;padding-top:8px">{{contactLines}}</div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-article-panel",
    label: "PME — Event / article panel",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Event title" },
      { name: "meta", label: "Date / meta", type: "text", defaultValue: "" },
      { name: "body", label: "Body", type: "textarea", defaultValue: "" },
      { name: "imageUrl", label: "Image", type: "image", defaultValue: "" },
      { name: "backLabel", label: "Back label", type: "text", defaultValue: "← Back To All News" },
      { name: "backUrl", label: "Back URL", type: "url", defaultValue: "/events" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
    ],
    template: `<section style="padding:40px 24px 64px;background:#fff">
  <div style="max-width:72rem;margin:0 auto;border:1px solid {{accentColor}};display:grid;grid-template-columns:minmax(240px,42%) 1fr">
    {{#imageUrl}}<img src="{{imageUrl}}" alt="{{title}}" style="width:100%;height:100%;min-height:420px;object-fit:cover" />{{/imageUrl}}
    <div style="padding:40px 36px">
      <h1 style="margin:0;font-size:clamp(28px,3.5vw,44px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif);color:#111">{{title}}</h1>
      {{#meta}}<p style="margin:16px 0 0;font-size:16px;font-weight:600;color:{{accentColor}}">{{meta}}</p>{{/meta}}
      <div style="margin-top:24px;font-size:16px;line-height:1.75;font-weight:300;color:#333;white-space:pre-line">{{body}}</div>
      {{#backLabel}}<a href="{{backUrl}}" style="display:inline-block;margin-top:32px;color:{{accentColor}};text-decoration:none;font-weight:600">{{backLabel}}</a>{{/backLabel}}
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-vendor-title",
    label: "PME — Vendor page title",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Vendor" },
      { name: "textColor", label: "Color", type: "color", defaultValue: "#111111" },
    ],
    template: `<section style="background:#fff;padding:56px 24px 40px">
  <div style="max-width:72rem;margin:0 auto">
    <h1 style="margin:0;font-size:clamp(40px,6vw,72px);font-weight:400;color:{{textColor}};font-family:var(--theme-font-heading,Georgia,serif)">{{title}}</h1>
  </div>
</section>`,
  },
];
