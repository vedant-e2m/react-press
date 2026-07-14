import type { CreateCustomBlockInput } from "../types/plugins";

const ACCENT = "#6FA84C";
const TEXT = "#494747";
const LABEL = "#595959";

/**
 * Public Market Emeryville — section blocks tuned to match
 * https://publicmarketemeryville.channel13.cloud/
 */
export const PME_CUSTOM_BLOCK_SEEDS: CreateCustomBlockInput[] = [
  {
    puckType: "CustomBlock-pme-about-row",
    label: "PME — About row",
    category: "Public Market",
    fields: [
      { name: "hoursLabel", label: "Hours label", type: "text", defaultValue: "Hours of Operation" },
      {
        name: "hoursLines",
        label: "Hours (one per line)",
        type: "textarea",
        defaultValue: "Mon – Sat\n10am – 9pm\nSunday\n10am – 8pm",
      },
      { name: "logoUrl", label: "Center logo URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title (before highlight)", type: "text", defaultValue: "More than just" },
      { name: "highlight", label: "Highlighted words", type: "text", defaultValue: "a food hall" },
      {
        name: "body",
        label: "Body copy",
        type: "textarea",
        defaultValue:
          "Emeryville Public Market is more than a food hall—it's a vibrant, mixed-use destination where culture, commerce, and community intersect.",
      },
      { name: "addressLabel", label: "Address label", type: "text", defaultValue: "Address" },
      {
        name: "addressLines",
        label: "Address lines",
        type: "textarea",
        defaultValue: "5959 Shellmound St.\nEmeryville, CA 94608",
      },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: ACCENT },
      { name: "textColor", label: "Text color", type: "color", defaultValue: TEXT },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#F5F5F5" },
    ],
    template: `<section style="padding:64px 24px;background:{{backgroundColor}}">
  <div style="max-width:72rem;margin:0 auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;align-items:start">
    <div style="min-height:220px;border:1px solid {{accentColor}};padding:32px 24px;text-align:center;color:{{textColor}}">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:{{accentColor}}">{{hoursLabel}}</p>
      <div style="margin-top:20px;font-size:clamp(18px,2.2vw,24px);line-height:1.5;white-space:pre-line;font-family:var(--theme-font-heading,Georgia,serif)">{{hoursLines}}</div>
    </div>
    <div style="text-align:center;padding:0 12px">
      {{#logoUrl}}<img src="{{logoUrl}}" alt="The Public Market" style="max-width:220px;width:100%;height:auto;margin:0 auto 28px;display:block" />{{/logoUrl}}
      <h2 style="margin:0;font-size:clamp(26px,3.5vw,42px);font-weight:400;line-height:1.2;color:{{textColor}};font-family:var(--theme-font-heading,Georgia,serif)">
        {{title}} <span style="color:{{accentColor}}">{{highlight}}</span>
      </h2>
      <p style="margin:20px auto 0;max-width:36rem;font-size:16px;font-weight:300;line-height:1.7;color:{{textColor}}">{{body}}</p>
    </div>
    <div style="min-height:220px;border:1px solid {{accentColor}};padding:32px 24px;text-align:center;color:{{textColor}}">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.22em;color:{{accentColor}}">{{addressLabel}}</p>
      <div style="margin-top:20px;font-size:clamp(18px,2.2vw,24px);line-height:1.5;white-space:pre-line;font-family:var(--theme-font-heading,Georgia,serif)">{{addressLines}}</div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-follow-intro",
    label: "PME — Follow intro",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Don't Miss" },
      { name: "highlight", label: "Highlight", type: "text", defaultValue: "What's Next" },
      { name: "buttonLabel", label: "Button label", type: "text", defaultValue: "Follow @publicmarketemeryville" },
      { name: "buttonUrl", label: "Button URL", type: "url", defaultValue: "https://instagram.com/publicmarketemeryville" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: ACCENT },
      { name: "textColor", label: "Text color", type: "color", defaultValue: TEXT },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#ffffff" },
    ],
    template: `<section style="padding:48px 24px 24px;text-align:center;background:{{backgroundColor}}">
  <h2 style="margin:0;font-size:clamp(28px,4vw,48px);font-weight:400;color:{{textColor}};font-family:var(--theme-font-heading,Georgia,serif)">
    {{title}} <span style="color:{{accentColor}}">{{highlight}}</span>
  </h2>
  {{#buttonLabel}}<a href="{{buttonUrl}}" style="display:inline-block;margin-top:24px;padding:12px 28px;border:2px solid {{accentColor}};border-radius:4px;color:{{accentColor}};font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none">{{buttonLabel}}</a>{{/buttonLabel}}
</section>`,
  },
  {
    puckType: "CustomBlock-pme-events-header",
    label: "PME — Events header",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Events" },
      { name: "ctaLabel", label: "CTA label", type: "text", defaultValue: "Check Out More" },
      { name: "ctaUrl", label: "CTA URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: ACCENT },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#333333" },
    ],
    template: `<section style="padding:64px 24px 32px;background:{{backgroundColor}}">
  <div style="max-width:72rem;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px">
    <h2 style="margin:0;font-size:clamp(32px,4vw,56px);font-weight:400;color:#fff;font-family:var(--theme-font-heading,Georgia,serif)">{{title}}</h2>
    {{#ctaLabel}}<a href="{{ctaUrl}}" style="display:inline-block;padding:14px 28px;background:{{accentColor}};color:#fff;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;border-radius:2px">{{ctaLabel}}</a>{{/ctaLabel}}
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-contact-hero",
    label: "PME — Contact hero",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Contact us" },
      { name: "accentColor", label: "Title color", type: "color", defaultValue: ACCENT },
    ],
    template: `<section style="padding:48px 24px 0;background:#fff">
  <div style="max-width:72rem;margin:0 auto">
    <h1 style="margin:0;font-size:clamp(40px,6vw,72px);font-weight:400;color:{{accentColor}};font-family:var(--theme-font-heading,Georgia,serif)">{{title}}</h1>
    <div style="margin-top:24px;height:1px;background:{{accentColor}};opacity:0.45"></div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-contact-inquiries",
    label: "PME — Contact inquiries",
    category: "Public Market",
    fields: [
      { name: "generalTitle", label: "General title", type: "text", defaultValue: "General Inquiries" },
      { name: "generalEmail", label: "General email", type: "text", defaultValue: "xxx@publicmarketemeryville.com" },
      { name: "leasingTitle", label: "Leasing title", type: "text", defaultValue: "Leasing Inquiries" },
      { name: "leasingEmail", label: "Leasing email", type: "text", defaultValue: "xxx@publicmarketemeryville.com" },
      { name: "getInTouchLabel", label: "Get in touch label", type: "text", defaultValue: "Get in touch" },
      { name: "getInTouchText", label: "Get in touch text", type: "text", defaultValue: "Fill out the contact form ↓" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
      { name: "textColor", label: "Text", type: "color", defaultValue: TEXT },
    ],
    template: `<section style="padding:0 24px 48px;background:#fff;color:{{textColor}}">
  <div style="max-width:72rem;margin:0 auto">
    <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:24px;padding:32px 0;align-items:start;border-bottom:1px solid {{accentColor}}">
      <h2 style="margin:0;font-size:clamp(22px,2.5vw,28px);font-weight:500">{{generalTitle}}</h2>
      <div><p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888">Email</p><a href="mailto:{{generalEmail}}" style="color:{{textColor}};text-decoration:none">{{generalEmail}}</a></div>
      <div><p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888">{{getInTouchLabel}}</p><a href="#contact" style="color:{{textColor}};text-decoration:none">{{getInTouchText}}</a></div>
    </div>
    <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:24px;padding:32px 0;align-items:start;border-bottom:1px solid {{accentColor}}">
      <h2 style="margin:0;font-size:clamp(22px,2.5vw,28px);font-weight:500">{{leasingTitle}}</h2>
      <div><p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888">Email</p><a href="mailto:{{leasingEmail}}" style="color:{{textColor}};text-decoration:none">{{leasingEmail}}</a></div>
      <div><p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#888">{{getInTouchLabel}}</p><a href="#contact" style="color:{{textColor}};text-decoration:none">{{getInTouchText}}</a></div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-leasing-intro",
    label: "PME — Leasing intro",
    category: "Public Market",
    fields: [
      { name: "breadcrumb", label: "Breadcrumb", type: "text", defaultValue: "Leasing > Food Hall" },
      {
        name: "body",
        label: "Body",
        type: "textarea",
        defaultValue:
          "Are you a talented chef, baker, maker, or entrepreneur ready to grow? Join Public Market's thriving community and bring your vision to life in a dynamic space designed for vendors.",
      },
      { name: "highlight1", label: "Highlight phrase 1", type: "text", defaultValue: "ready to grow?" },
      { name: "highlight2", label: "Highlight phrase 2", type: "text", defaultValue: "bring your vision to life" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#1a1a1a" },
    ],
    template: `<section style="padding:80px 24px;background:{{backgroundColor}};color:#fff">
  <div style="max-width:72rem;margin:0 auto">
    <p style="margin:0 0 40px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase">{{breadcrumb}}</p>
    <p style="margin:0;max-width:40rem;margin-left:auto;font-size:clamp(22px,3vw,36px);line-height:1.45;font-weight:400;font-family:var(--theme-font-heading,Georgia,serif)">
      {{body}}
    </p>
    <p style="margin:24px 0 0;max-width:40rem;margin-left:auto;font-size:14px;color:{{accentColor}}">Highlights: {{highlight1}} · {{highlight2}}</p>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-pme-order-intro",
    label: "PME — Order food intro",
    category: "Public Market",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Order Food + Purveyor Hours" },
      {
        name: "body",
        label: "Body",
        type: "textarea",
        defaultValue:
          "Now your tastebuds don't have to settle for just one cuisine. Order online from multiple food hall purveyors at once, then get a text alert when your order is ready for pickup.",
      },
      { name: "ctaLabel", label: "CTA label", type: "text", defaultValue: "Order Food Now >" },
      { name: "ctaUrl", label: "CTA URL", type: "url", defaultValue: "#hours" },
      { name: "accentColor", label: "Accent", type: "color", defaultValue: ACCENT },
      { name: "textColor", label: "Text", type: "color", defaultValue: TEXT },
    ],
    template: `<section style="padding:48px 24px;background:#fff">
  <div style="max-width:72rem;margin:0 auto;border:1px solid {{accentColor}};display:grid;grid-template-columns:minmax(180px,280px) 1fr;min-height:420px">
    <div style="background:{{accentColor}};display:flex;align-items:center;justify-content:center;padding:32px">
      <div style="width:88px;height:88px;border-radius:50%;border:2px solid #111;display:flex;align-items:center;justify-content:center;font-weight:700;color:#111">PM</div>
    </div>
    <div style="padding:40px 36px;color:{{textColor}}">
      <h1 style="margin:0;font-size:clamp(28px,4vw,44px);font-weight:700;letter-spacing:0.02em;text-transform:uppercase">{{title}}</h1>
      <p style="margin:20px 0 0;max-width:40rem;font-size:16px;line-height:1.7;font-weight:300">{{body}}</p>
      {{#ctaLabel}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:24px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:{{textColor}};text-decoration:underline">{{ctaLabel}}</a>{{/ctaLabel}}
    </div>
  </div>
</section>`,
  },
];
