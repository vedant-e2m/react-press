import type { CreateCustomBlockInput } from "../types/plugins";

const BLUE = "#1638FB";
const ORANGE = "#FF6B00";
const DARK = "#000000";
const DARK_GRAY = "#1A1A1A";
const TEXT = "#1C1C1C";
const MUTED = "#666666";

/**
 * E2M Solutions — section blocks tuned to match https://www.e2msolutions.com/
 */
export const E2M_CUSTOM_BLOCK_SEEDS: CreateCustomBlockInput[] = [
  {
    puckType: "CustomBlock-e2m-stat-row",
    label: "E2M — Stat row (6)",
    category: "E2M",
    fields: [
      { name: "stat1Value", label: "Stat 1 value", type: "text", defaultValue: "13+" },
      { name: "stat1Label", label: "Stat 1 label", type: "text", defaultValue: "Years" },
      { name: "stat2Value", label: "Stat 2 value", type: "text", defaultValue: "400+" },
      { name: "stat2Label", label: "Stat 2 label", type: "text", defaultValue: "Active Agency Partners" },
      { name: "stat3Value", label: "Stat 3 value", type: "text", defaultValue: "350+" },
      { name: "stat3Label", label: "Stat 3 label", type: "text", defaultValue: "Full-Time Experts" },
      { name: "stat4Value", label: "Stat 4 value", type: "text", defaultValue: "25k+" },
      { name: "stat4Label", label: "Stat 4 label", type: "text", defaultValue: "Hours Delivered Monthly" },
      { name: "stat5Value", label: "Stat 5 value", type: "text", defaultValue: "15,000+" },
      { name: "stat5Label", label: "Stat 5 label", type: "text", defaultValue: "Websites Built" },
      { name: "stat6Value", label: "Stat 6 value", type: "text", defaultValue: "98%" },
      { name: "stat6Label", label: "Stat 6 label", type: "text", defaultValue: "Client Retention" },
      { name: "accentColor", label: "Value color", type: "color", defaultValue: BLUE },
    ],
    template: `<section style="padding:48px 24px 80px;background:#fff">
  <div style="max-width:80rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:32px;text-align:center">
    <div><div style="font-size:clamp(32px,4vw,56px);font-weight:500;color:{{accentColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{stat1Value}}</div><div style="margin-top:8px;font-size:15px;font-weight:300;color:{{muted}}">{{stat1Label}}</div></div>
    <div><div style="font-size:clamp(32px,4vw,56px);font-weight:500;color:{{accentColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{stat2Value}}</div><div style="margin-top:8px;font-size:15px;font-weight:300;color:{{muted}}">{{stat2Label}}</div></div>
    <div><div style="font-size:clamp(32px,4vw,56px);font-weight:500;color:{{accentColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{stat3Value}}</div><div style="margin-top:8px;font-size:15px;font-weight:300;color:{{muted}}">{{stat3Label}}</div></div>
    <div><div style="font-size:clamp(32px,4vw,56px);font-weight:500;color:{{accentColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{stat4Value}}</div><div style="margin-top:8px;font-size:15px;font-weight:300;color:{{muted}}">{{stat4Label}}</div></div>
    <div><div style="font-size:clamp(32px,4vw,56px);font-weight:500;color:{{accentColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{stat5Value}}</div><div style="margin-top:8px;font-size:15px;font-weight:300;color:{{muted}}">{{stat5Label}}</div></div>
    <div><div style="font-size:clamp(32px,4vw,56px);font-weight:500;color:{{accentColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{stat6Value}}</div><div style="margin-top:8px;font-size:15px;font-weight:300;color:{{muted}}">{{stat6Label}}</div></div>
  </div>
</section>`.replace(/\{\{muted\}\}/g, MUTED),
  },
  {
    puckType: "CustomBlock-e2m-services",
    label: "E2M — Services (Abracadabra)",
    category: "E2M",
    fields: [
      { name: "iconUrl", label: "Icon URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title", type: "text", defaultValue: "Abracadabra. Your Agency Just Got Bigger. (And Better.)" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "service1Title", label: "Service 1 title", type: "text", defaultValue: "White Label Website Design and Development" },
      { name: "service1Image", label: "Service 1 image", type: "image", defaultValue: "" },
      { name: "service1Url", label: "Service 1 URL", type: "url", defaultValue: "#" },
      { name: "service2Title", label: "Service 2 title", type: "text", defaultValue: "White Label Digital Marketing" },
      { name: "service2Image", label: "Service 2 image", type: "image", defaultValue: "" },
      { name: "service2Url", label: "Service 2 URL", type: "url", defaultValue: "#" },
      { name: "service3Title", label: "Service 3 title", type: "text", defaultValue: "White Label PPC and Paid Media" },
      { name: "service3Image", label: "Service 3 image", type: "image", defaultValue: "" },
      { name: "service3Url", label: "Service 3 URL", type: "url", defaultValue: "#" },
      { name: "service4Title", label: "Service 4 title", type: "text", defaultValue: "White Label AI Solutions" },
      { name: "service4Image", label: "Service 4 image", type: "image", defaultValue: "" },
      { name: "service4Url", label: "Service 4 URL", type: "url", defaultValue: "#" },
      { name: "ctaLabel", label: "CTA label", type: "text", defaultValue: "Talk With A White Label Growth Partner" },
      { name: "ctaUrl", label: "CTA URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: BLUE },
    ],
    template: `<section style="padding:80px 24px;background:${DARK};color:#fff;text-align:center">
  <div style="max-width:80rem;margin:0 auto">
    {{#iconUrl}}<img src="{{iconUrl}}" alt="" style="width:64px;height:64px;margin:0 auto 32px;display:block" />{{/iconUrl}}
    <h2 style="margin:0;font-size:clamp(28px,4vw,48px);font-weight:500;line-height:1.2;font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
    {{#description}}<p style="margin:24px auto 0;max-width:52rem;font-size:18px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.85)">{{description}}</p>{{/description}}
    <div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;text-align:left">
      <a href="{{service1Url}}" style="display:block;text-decoration:none;color:#fff;border-radius:8px;overflow:hidden;background:${DARK_GRAY}">
        <img src="{{service1Image}}" alt="{{service1Title}}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block" />
        <div style="padding:24px"><h3 style="margin:0;font-size:18px;font-weight:500">{{service1Title}}</h3></div>
      </a>
      <a href="{{service2Url}}" style="display:block;text-decoration:none;color:#fff;border-radius:8px;overflow:hidden;background:${DARK_GRAY}">
        <img src="{{service2Image}}" alt="{{service2Title}}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block" />
        <div style="padding:24px"><h3 style="margin:0;font-size:18px;font-weight:500">{{service2Title}}</h3></div>
      </a>
      <a href="{{service3Url}}" style="display:block;text-decoration:none;color:#fff;border-radius:8px;overflow:hidden;background:${DARK_GRAY}">
        <img src="{{service3Image}}" alt="{{service3Title}}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block" />
        <div style="padding:24px"><h3 style="margin:0;font-size:18px;font-weight:500">{{service3Title}}</h3></div>
      </a>
      <a href="{{service4Url}}" style="display:block;text-decoration:none;color:#fff;border-radius:8px;overflow:hidden;background:${DARK_GRAY}">
        <img src="{{service4Image}}" alt="{{service4Title}}" style="width:100%;aspect-ratio:4/3;object-fit:cover;display:block" />
        <div style="padding:24px"><h3 style="margin:0;font-size:18px;font-weight:500">{{service4Title}}</h3></div>
      </a>
    </div>
    {{#ctaLabel}}<div style="margin-top:48px"><a href="{{ctaUrl}}" style="display:inline-flex;padding:14px 28px;background:{{accentColor}};color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:4px">{{ctaLabel}}</a></div>{{/ctaLabel}}
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-testimonials",
    label: "E2M — Testimonials (Proof Over Promises)",
    category: "E2M",
    fields: [
      { name: "iconUrl", label: "Icon URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title", type: "text", defaultValue: "Proof Over Promises." },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "quote", label: "Featured quote", type: "textarea", defaultValue: "" },
      { name: "name", label: "Name", type: "text", defaultValue: "" },
      { name: "role", label: "Role", type: "text", defaultValue: "" },
      { name: "imageUrl", label: "Photo URL", type: "image", defaultValue: "" },
      { name: "videoUrl", label: "Video URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Background color", type: "color", defaultValue: BLUE },
    ],
    template: `<section style="padding:80px 24px;background:{{accentColor}};color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;opacity:0.08;background-image:linear-gradient(90deg,#fff 1px,transparent 1px),linear-gradient(#fff 1px,transparent 1px);background-size:40px 40px"></div>
  <div style="position:relative;max-width:80rem;margin:0 auto;text-align:center">
    {{#iconUrl}}<img src="{{iconUrl}}" alt="" style="width:56px;height:56px;margin:0 auto 28px;display:block;filter:brightness(0) invert(1)" />{{/iconUrl}}
    <h2 style="margin:0;font-size:clamp(32px,4.5vw,56px);font-weight:500;font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
    {{#description}}<p style="margin:20px auto 0;max-width:42rem;font-size:18px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.9)">{{description}}</p>{{/description}}
    <div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:40px;align-items:center;text-align:left">
      <div style="position:relative">
        {{#imageUrl}}<img src="{{imageUrl}}" alt="{{name}}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block" />{{/imageUrl}}
        <a href="{{videoUrl}}" style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:12px;background:rgba(255,255,255,0.9);text-decoration:none;color:${TEXT};font-size:20px">▶</a>
        <div style="position:absolute;top:0;right:0;width:48px;height:48px;border-top:4px solid #fff;border-right:4px solid #fff"></div>
      </div>
      <div>
        <div style="font-size:64px;line-height:1;font-weight:700;opacity:0.3;margin-bottom:16px">&ldquo;</div>
        <p style="margin:0;font-size:clamp(22px,3vw,32px);font-weight:500;line-height:1.3">{{quote}}</p>
        <p style="margin:24px 0 0;font-weight:600;font-size:16px">{{name}}</p>
        <p style="margin:4px 0 0;font-size:14px;font-weight:300;color:rgba(255,255,255,0.8)">{{role}}</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-evolution",
    label: "E2M — Evolution of White Label",
    category: "E2M",
    fields: [
      { name: "iconUrl", label: "Icon URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title", type: "text", defaultValue: "E2M: The Evolution of White Label." },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "feature1Icon", label: "Feature 1 icon URL", type: "image", defaultValue: "" },
      { name: "feature1Title", label: "Feature 1 title", type: "text", defaultValue: "Month-to-Month Agreements" },
      { name: "feature1Description", label: "Feature 1 description", type: "textarea", defaultValue: "" },
      { name: "feature2Icon", label: "Feature 2 icon URL", type: "image", defaultValue: "" },
      { name: "feature2Title", label: "Feature 2 title", type: "text", defaultValue: "360-Degree Support" },
      { name: "feature2Description", label: "Feature 2 description", type: "textarea", defaultValue: "" },
      { name: "feature3Icon", label: "Feature 3 icon URL", type: "image", defaultValue: "" },
      { name: "feature3Title", label: "Feature 3 title", type: "text", defaultValue: "Integrated with Your Workflows" },
      { name: "feature3Description", label: "Feature 3 description", type: "textarea", defaultValue: "" },
      { name: "feature4Icon", label: "Feature 4 icon URL", type: "image", defaultValue: "" },
      { name: "feature4Title", label: "Feature 4 title", type: "text", defaultValue: "Incredible Results" },
      { name: "feature4Description", label: "Feature 4 description", type: "textarea", defaultValue: "" },
      { name: "feature5Icon", label: "Feature 5 icon URL", type: "image", defaultValue: "" },
      { name: "feature5Title", label: "Feature 5 title", type: "text", defaultValue: "Proactive by Default" },
      { name: "feature5Description", label: "Feature 5 description", type: "textarea", defaultValue: "" },
      { name: "feature6Icon", label: "Feature 6 icon URL", type: "image", defaultValue: "" },
      { name: "feature6Title", label: "Feature 6 title", type: "text", defaultValue: "Strict Non-Disclosure" },
      { name: "feature6Description", label: "Feature 6 description", type: "textarea", defaultValue: "" },
      { name: "iconAccentColor", label: "Icon accent color", type: "color", defaultValue: ORANGE },
    ],
    template: `<section style="padding:80px 24px;background:${DARK_GRAY};color:#fff;text-align:center">
  <div style="max-width:80rem;margin:0 auto">
    {{#iconUrl}}<img src="{{iconUrl}}" alt="" style="width:56px;height:56px;margin:0 auto 28px;display:block;filter:brightness(0) invert(1)" />{{/iconUrl}}
    <h2 style="margin:0;font-size:clamp(28px,4vw,48px);font-weight:500;font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
    {{#description}}<p style="margin:24px auto 0;max-width:52rem;font-size:18px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.8)">{{description}}</p>{{/description}}
    <div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px;text-align:left">
      <div style="padding:24px;background:rgba(0,0,0,0.3);border-radius:8px">
        {{#feature1Icon}}<img src="{{feature1Icon}}" alt="" style="width:40px;height:40px;margin-bottom:16px" />{{/feature1Icon}}
        <h3 style="margin:0;font-size:18px;font-weight:600">{{feature1Title}}</h3>
        <p style="margin:12px 0 0;font-size:14px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.75)">{{feature1Description}}</p>
      </div>
      <div style="padding:24px;background:rgba(0,0,0,0.3);border-radius:8px">
        {{#feature2Icon}}<img src="{{feature2Icon}}" alt="" style="width:40px;height:40px;margin-bottom:16px" />{{/feature2Icon}}
        <h3 style="margin:0;font-size:18px;font-weight:600">{{feature2Title}}</h3>
        <p style="margin:12px 0 0;font-size:14px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.75)">{{feature2Description}}</p>
      </div>
      <div style="padding:24px;background:rgba(0,0,0,0.3);border-radius:8px">
        {{#feature3Icon}}<img src="{{feature3Icon}}" alt="" style="width:40px;height:40px;margin-bottom:16px" />{{/feature3Icon}}
        <h3 style="margin:0;font-size:18px;font-weight:600">{{feature3Title}}</h3>
        <p style="margin:12px 0 0;font-size:14px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.75)">{{feature3Description}}</p>
      </div>
      <div style="padding:24px;background:rgba(0,0,0,0.3);border-radius:8px">
        {{#feature4Icon}}<img src="{{feature4Icon}}" alt="" style="width:40px;height:40px;margin-bottom:16px" />{{/feature4Icon}}
        <h3 style="margin:0;font-size:18px;font-weight:600">{{feature4Title}}</h3>
        <p style="margin:12px 0 0;font-size:14px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.75)">{{feature4Description}}</p>
      </div>
      <div style="padding:24px;background:rgba(0,0,0,0.3);border-radius:8px">
        {{#feature5Icon}}<img src="{{feature5Icon}}" alt="" style="width:40px;height:40px;margin-bottom:16px" />{{/feature5Icon}}
        <h3 style="margin:0;font-size:18px;font-weight:600">{{feature5Title}}</h3>
        <p style="margin:12px 0 0;font-size:14px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.75)">{{feature5Description}}</p>
      </div>
      <div style="padding:24px;background:rgba(0,0,0,0.3);border-radius:8px">
        {{#feature6Icon}}<img src="{{feature6Icon}}" alt="" style="width:40px;height:40px;margin-bottom:16px" />{{/feature6Icon}}
        <h3 style="margin:0;font-size:18px;font-weight:600">{{feature6Title}}</h3>
        <p style="margin:12px 0 0;font-size:14px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.75)">{{feature6Description}}</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-black-label",
    label: "E2M — Black Label Standard",
    category: "E2M",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "What is the E2M Black Label Standard?" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "imageUrl", label: "Image URL", type: "image", defaultValue: "" },
      { name: "linkLabel", label: "Link label", type: "text", defaultValue: "More about E2M's Black Label Standard" },
      { name: "linkUrl", label: "Link URL", type: "url", defaultValue: "#" },
      { name: "bullet1", label: "Bullet 1", type: "text", defaultValue: "High standards and attention to detail." },
      { name: "bullet2", label: "Bullet 2", type: "text", defaultValue: "Strategic thinking included." },
      { name: "bullet3", label: "Bullet 3", type: "text", defaultValue: "A full suite of white label services." },
      { name: "bullet4", label: "Bullet 4", type: "text", defaultValue: "We reach out first with proactive updates." },
      { name: "bullet5", label: "Bullet 5", type: "text", defaultValue: "Your tools, your way." },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: BLUE },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#ffffff" },
    ],
    template: `<section style="padding:80px 24px;background:{{backgroundColor}}">
  <div style="max-width:80rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:56px;align-items:center">
    {{#imageUrl}}<div style="position:relative"><img src="{{imageUrl}}" alt="" style="width:100%;border-radius:8px;object-fit:cover" /><div style="position:absolute;top:0;right:0;width:64px;height:64px;border-top:6px solid {{accentColor}};border-right:6px solid {{accentColor}}"></div></div>{{/imageUrl}}
    <div>
      <h2 style="margin:0;font-size:clamp(24px,3.5vw,36px);font-weight:500;color:${TEXT};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
      {{#description}}<p style="margin:20px 0 0;font-size:16px;font-weight:300;line-height:1.7;color:${MUTED}">{{description}}</p>{{/description}}
      <h4 style="margin:28px 0 16px;font-size:14px;font-weight:600;color:${TEXT}">What you get with our black label approach:</h4>
      <ul style="margin:0;padding:0;list-style:none">
        <li style="padding:8px 0;font-size:15px;color:${MUTED};display:flex;align-items:flex-start;gap:10px"><span style="color:{{accentColor}};font-weight:700">✓</span>{{bullet1}}</li>
        <li style="padding:8px 0;font-size:15px;color:${MUTED};display:flex;align-items:flex-start;gap:10px"><span style="color:{{accentColor}};font-weight:700">✓</span>{{bullet2}}</li>
        <li style="padding:8px 0;font-size:15px;color:${MUTED};display:flex;align-items:flex-start;gap:10px"><span style="color:{{accentColor}};font-weight:700">✓</span>{{bullet3}}</li>
        <li style="padding:8px 0;font-size:15px;color:${MUTED};display:flex;align-items:flex-start;gap:10px"><span style="color:{{accentColor}};font-weight:700">✓</span>{{bullet4}}</li>
        <li style="padding:8px 0;font-size:15px;color:${MUTED};display:flex;align-items:flex-start;gap:10px"><span style="color:{{accentColor}};font-weight:700">✓</span>{{bullet5}}</li>
      </ul>
      {{#linkLabel}}<a href="{{linkUrl}}" style="display:inline-block;margin-top:28px;font-size:15px;font-weight:600;color:{{accentColor}};text-decoration:none">{{linkLabel}} →</a>{{/linkLabel}}
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-steps",
    label: "E2M — Process steps",
    category: "E2M",
    fields: [
      { name: "iconUrl", label: "Icon URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title", type: "text", defaultValue: "Make the Hand-Off. Watch the Magic Happen." },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "step1Number", label: "Step 1 number", type: "text", defaultValue: "01" },
      { name: "step1Title", label: "Step 1 title", type: "text", defaultValue: "Book a Discovery Call" },
      { name: "step1Description", label: "Step 1 description", type: "textarea", defaultValue: "" },
      { name: "step2Number", label: "Step 2 number", type: "text", defaultValue: "02" },
      { name: "step2Title", label: "Step 2 title", type: "text", defaultValue: "Choose Your Plan" },
      { name: "step2Description", label: "Step 2 description", type: "textarea", defaultValue: "" },
      { name: "step3Number", label: "Step 3 number", type: "text", defaultValue: "03" },
      { name: "step3Title", label: "Step 3 title", type: "text", defaultValue: "Kick Off in 24-48 Hours" },
      { name: "step3Description", label: "Step 3 description", type: "textarea", defaultValue: "" },
      { name: "numberColor", label: "Step number color", type: "color", defaultValue: ORANGE },
    ],
    template: `<section style="padding:80px 24px;background:#fff;text-align:center">
  <div style="max-width:80rem;margin:0 auto">
    {{#iconUrl}}<img src="{{iconUrl}}" alt="" style="width:56px;height:56px;margin:0 auto 28px;display:block" />{{/iconUrl}}
    <h2 style="margin:0;font-size:clamp(28px,4vw,44px);font-weight:500;color:${TEXT};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
    {{#description}}<p style="margin:20px auto 0;max-width:42rem;font-size:17px;font-weight:300;line-height:1.7;color:${MUTED}">{{description}}</p>{{/description}}
    <div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:40px;text-align:left">
      <div>
        <div style="font-size:48px;font-weight:500;color:{{numberColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{step1Number}}</div>
        <h3 style="margin:16px 0 0;font-size:20px;font-weight:600;color:${TEXT}">{{step1Title}}</h3>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5" />
        <p style="margin:0;font-size:15px;font-weight:300;line-height:1.6;color:${MUTED}">{{step1Description}}</p>
      </div>
      <div>
        <div style="font-size:48px;font-weight:500;color:{{numberColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{step2Number}}</div>
        <h3 style="margin:16px 0 0;font-size:20px;font-weight:600;color:${TEXT}">{{step2Title}}</h3>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5" />
        <p style="margin:0;font-size:15px;font-weight:300;line-height:1.6;color:${MUTED}">{{step2Description}}</p>
      </div>
      <div>
        <div style="font-size:48px;font-weight:500;color:{{numberColor}};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{step3Number}}</div>
        <h3 style="margin:16px 0 0;font-size:20px;font-weight:600;color:${TEXT}">{{step3Title}}</h3>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5" />
        <p style="margin:0;font-size:15px;font-weight:300;line-height:1.6;color:${MUTED}">{{step3Description}}</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-endorsement",
    label: "E2M — Industry endorsement",
    category: "E2M",
    fields: [
      { name: "iconUrl", label: "Icon URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title", type: "text", defaultValue: "Endorsed By Industry Icons" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "quote", label: "Quote", type: "textarea", defaultValue: "" },
      { name: "imageUrl", label: "Photo URL", type: "image", defaultValue: "" },
      { name: "personName", label: "Person name", type: "text", defaultValue: "" },
      { name: "personRole", label: "Person role", type: "text", defaultValue: "" },
      { name: "videoUrl", label: "Video URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: BLUE },
    ],
    template: `<section style="padding:80px 24px;background:${DARK};color:#fff;text-align:center">
  <div style="max-width:80rem;margin:0 auto">
    {{#iconUrl}}<img src="{{iconUrl}}" alt="" style="width:56px;height:56px;margin:0 auto 28px;display:block;filter:brightness(0) invert(1)" />{{/iconUrl}}
    <h2 style="margin:0;font-size:clamp(28px,4vw,48px);font-weight:500;font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
    {{#description}}<p style="margin:20px auto 0;max-width:42rem;font-size:17px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.8)">{{description}}</p>{{/description}}
    <div style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0;background:${DARK_GRAY};border-radius:8px;overflow:hidden;text-align:left">
      <div style="position:relative;min-height:320px">
        {{#imageUrl}}<img src="{{imageUrl}}" alt="{{personName}}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />{{/imageUrl}}
        <a href="{{videoUrl}}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);text-decoration:none;color:#fff;font-size:28px;border:2px solid rgba(255,255,255,0.4)">▶</a>
      </div>
      <div style="padding:48px 40px;position:relative">
        <div style="position:absolute;top:0;right:0;width:56px;height:56px;border-top:4px solid {{accentColor}};border-right:4px solid {{accentColor}}"></div>
        <div style="font-size:56px;line-height:1;opacity:0.4;margin-bottom:16px">&ldquo;</div>
        <p style="margin:0;font-size:clamp(20px,2.5vw,28px);font-weight:500;line-height:1.35">{{quote}}</p>
        <p style="margin:28px 0 0;font-weight:600">{{personName}}</p>
        <p style="margin:4px 0 0;font-size:14px;color:rgba(255,255,255,0.7)">{{personRole}}</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-growth-guide",
    label: "E2M — Growth guide lead magnet",
    category: "E2M",
    fields: [
      { name: "bookImageUrl", label: "Book image URL", type: "image", defaultValue: "" },
      { name: "title", label: "Title", type: "text", defaultValue: "The Digital Agency Growth Guide" },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "buttonLabel", label: "Button label", type: "text", defaultValue: "Download the Guide" },
      { name: "buttonUrl", label: "Button URL", type: "url", defaultValue: "#" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: BLUE },
      { name: "backgroundColor", label: "Background", type: "color", defaultValue: "#F9F9F9" },
    ],
    template: `<section style="padding:80px 24px;background:{{backgroundColor}}">
  <div style="max-width:80rem;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:56px;align-items:center">
  {{#bookImageUrl}}<img src="{{bookImageUrl}}" alt="{{title}}" style="width:100%;max-width:360px;margin:0 auto;display:block;filter:drop-shadow(-12px 16px 24px rgba(0,0,0,0.15))" />{{/bookImageUrl}}
  <div>
    <h2 style="margin:0;font-size:clamp(28px,3.5vw,40px);font-weight:500;color:${TEXT};font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
    {{#description}}<p style="margin:20px 0 0;font-size:17px;font-weight:300;line-height:1.7;color:${MUTED}">{{description}}</p>{{/description}}
    <div style="margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <input type="text" placeholder="Name*" style="padding:14px 16px;border:1px solid #ddd;border-radius:6px;font-size:15px" />
      <input type="email" placeholder="Your Agency Email*" style="padding:14px 16px;border:1px solid #ddd;border-radius:6px;font-size:15px" />
    </div>
    {{#buttonLabel}}<a href="{{buttonUrl}}" style="display:block;margin-top:12px;padding:16px;text-align:center;background:{{accentColor}};color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px">{{buttonLabel}}</a>{{/buttonLabel}}
  </div>
  </div>
</section>`,
  },
  {
    puckType: "CustomBlock-e2m-growth-call",
    label: "E2M — Book a growth call",
    category: "E2M",
    fields: [
      { name: "title", label: "Title", type: "text", defaultValue: "Book A Growth Call" },
      { name: "subtitle", label: "Subtitle", type: "text", defaultValue: "Hi, I'm Khushbu at E2M." },
      { name: "description", label: "Description", type: "textarea", defaultValue: "" },
      { name: "avatarImageUrl", label: "Avatar image URL", type: "image", defaultValue: "" },
      { name: "buttonLabel", label: "Button label", type: "text", defaultValue: "Schedule a Call" },
      { name: "buttonUrl", label: "Button URL", type: "url", defaultValue: "https://www.e2msolutions.com/book-a-growth-call/" },
      { name: "accentColor", label: "Accent color", type: "color", defaultValue: BLUE },
    ],
    template: `<section style="padding:64px 24px;background:{{accentColor}}">
  <div style="max-width:80rem;margin:0 auto;border-radius:16px;overflow:hidden">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0;align-items:stretch">
      <div style="padding:48px 40px;color:#fff;display:flex;flex-direction:column;justify-content:flex-end;min-height:400px;position:relative">
        {{#avatarImageUrl}}<img src="{{avatarImageUrl}}" alt="" style="position:absolute;bottom:0;left:0;width:220px;height:auto;object-fit:contain" />{{/avatarImageUrl}}
        <div style="position:relative;z-index:1;margin-left:200px">
          <h2 style="margin:0;font-size:clamp(32px,4vw,48px);font-weight:500;font-family:var(--theme-font-heading,Roboto,sans-serif)">{{title}}</h2>
          <p style="margin:16px 0 0;font-size:18px;font-weight:500">{{subtitle}}</p>
          {{#description}}<p style="margin:12px 0 0;font-size:15px;font-weight:300;line-height:1.6;color:rgba(255,255,255,0.9)">{{description}}</p>{{/description}}
        </div>
      </div>
      <div style="padding:40px;background:#fff;display:flex;flex-direction:column;justify-content:center">
        <p style="margin:0 0 20px;font-size:16px;font-weight:500;color:${TEXT}">Ready to get started?</p>
        {{#buttonLabel}}<a href="{{buttonUrl}}" style="display:block;padding:16px;text-align:center;background:{{accentColor}};color:#fff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px">{{buttonLabel}}</a>{{/buttonLabel}}
      </div>
    </div>
  </div>
</section>`,
  },
];
