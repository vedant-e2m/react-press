import { PME_ACCENT, PME_ASSETS, PME_PURVEYOR_HOURS, PME_VENDORS, type PmeEvent } from "./public-market-shared";
import { PME_FLOORPLAN_SVG } from "./pme-floorplan";

export type PmeDirectoryUnit = {
  type: "retail" | "food-hall";
  unit: string;
  title: string;
  size: string;
  available: boolean;
};

/** Directory units with map codes from the live site. */
export const PME_DIRECTORY_UNITS: PmeDirectoryUnit[] = [
  { type: "retail", unit: "S175", title: "Upside Foods", size: "17,342 RSF", available: false },
  { type: "retail", unit: "S200", title: "Streamline Events", size: "9,721 RSF", available: false },
  { type: "retail", unit: "S185", title: "One Workplace", size: "5,481 RSF", available: false },
  { type: "retail", unit: "S190", title: "Orange Theory", size: "3,000 RSF", available: false },
  { type: "retail", unit: "S100C", title: "Available", size: "11,460 RSF", available: true },
  { type: "retail", unit: "100A", title: "Guitar Center", size: "17,174 RSF", available: false },
  { type: "retail", unit: "100B", title: "Corepower Yoga", size: "3,500 RSF", available: false },
  { type: "retail", unit: "S100", title: "The Lounge Nail Spa", size: "1,243 RSF", available: false },
  { type: "retail", unit: "S105", title: "Available", size: "987 RSF", available: true },
  { type: "retail", unit: "S140", title: "Available", size: "1,114 RSF", available: true },
  { type: "retail", unit: "S145", title: "Property Management", size: "2,787 RSF", available: false },
  { type: "retail", unit: "S150", title: "Available", size: "1,127 RSF", available: true },
  { type: "food-hall", unit: "C1", title: "Paradita", size: "1,486 RSF", available: false },
  { type: "food-hall", unit: "C2", title: "Peet's Coffee", size: "936 RSF", available: false },
  { type: "food-hall", unit: "C3", title: "Super Duper Burger", size: "2,652 RSF", available: false },
  { type: "food-hall", unit: "KA", title: "Juice House Co.", size: "334 RSF", available: false },
  { type: "food-hall", unit: "KB", title: "Available", size: "334 RSF", available: true },
  { type: "food-hall", unit: "KC", title: "Mr. Dewie's", size: "334 RSF", available: false },
  { type: "food-hall", unit: "K2", title: "Demiya", size: "774 RSF", available: false },
  { type: "food-hall", unit: "K3", title: "Alma Y Sazon", size: "858 RSF", available: false },
  { type: "food-hall", unit: "K4", title: "Available", size: "870 RSF", available: true },
  { type: "food-hall", unit: "K5", title: "The Market Bar", size: "1,742 RSF", available: false },
  { type: "food-hall", unit: "K6", title: "Available", size: "1,040 RSF", available: true },
  { type: "food-hall", unit: "K7", title: "Mamacita", size: "980 RSF", available: false },
  { type: "food-hall", unit: "K8", title: "Naru Sushi", size: "930 RSF", available: false },
  { type: "food-hall", unit: "K9", title: "Konarq", size: "920 RSF", available: false },
  { type: "food-hall", unit: "K10", title: "Hiroshi Ramen", size: "850 RSF", available: false },
  { type: "food-hall", unit: "K11", title: "Available", size: "840 RSF", available: true },
  { type: "food-hall", unit: "K12", title: "Nabiq", size: "1,190 RSF", available: false },
  { type: "food-hall", unit: "K13", title: "Tarla Mediterranean", size: "886 RSF", available: false },
  { type: "food-hall", unit: "K14", title: "La Marine Fish", size: "900 RSF", available: false },
  { type: "food-hall", unit: "K15", title: "Southern Tease Kitchen", size: "900 RSF", available: false },
  { type: "food-hall", unit: "K16", title: "Pig In Pickle", size: "872 RSF", available: false },
  { type: "food-hall", unit: "K18", title: "Available", size: "1,026 RSF", available: true },
  { type: "food-hall", unit: "K19", title: "Available", size: "922 RSF", available: true },
  { type: "food-hall", unit: "K20", title: "Available", size: "522 RSF", available: true },
  { type: "food-hall", unit: "S75", title: "Pizzeria Mercato", size: "3,200 RSF", available: false },
  { type: "food-hall", unit: "S85", title: "Sweetgreen", size: "2,035 RSF", available: false },
];

const LEASE_FEATURES = [
  "Access shared utilities, seating areas, cleaning services, security, and maintenance.",
  "Operate alongside other chefs and entrepreneurs for a vibrant customer experience.",
  "Plug-and-play or partially built-out spaces reduce upfront investment.",
];

export const PME_LEASE_IMAGES = [
  "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/AdobeStock_1693267899_Editorial_Use_Only@2x.jpg",
  "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/DTS_Banquet_Daniel_Faro_Photos_ID5367@2x.jpg",
  "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/AdobeStock_181275381@2x.jpg",
  "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/03/DTS_Banquet_Daniel_Faro_Photos_ID5363@2x.jpg",
] as const;

export const PME_DIRECTORY_HERO =
  "https://publicmarketemeryville.channel13.cloud/wp-content/uploads/2026/05/Mask-Group-16.jpg";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Large typography vendor list with hover preview images. */
export function buildVendorNameListHtml() {
  return PME_VENDORS.map((v) => {
    const img = PME_ASSETS.vendorThumb;
    return `<a href="/${esc(v.slug)}">${esc(v.title)}<img src="${esc(img)}" alt="" loading="lazy" /></a>`;
  }).join("\n");
}

/** Retail + Food Hall directory columns with unit badges. */
export function buildDirectoryListsHtml() {
  const retail = PME_DIRECTORY_UNITS.filter((u) => u.type === "retail");
  const food = PME_DIRECTORY_UNITS.filter((u) => u.type === "food-hall" && u.title !== "?");

  const row = (u: PmeDirectoryUnit, foodHall: boolean) => {
    const badgeClass = foodHall || u.available ? "pme-dir-badge is-food" : "pme-dir-badge";
    const openClass = u.available ? " is-open" : "";
    return `<div class="pme-dir-row"><span class="${badgeClass}${openClass}">${esc(u.unit)}</span><span><span class="pme-dir-name">${esc(u.title)}</span> <span class="pme-dir-size">| ${esc(u.size)}</span></span></div>`;
  };

  return `<div><h2>Retail</h2>${retail.map((u) => row(u, false)).join("")}</div>
<div><h2>Food Hall</h2>${food.map((u) => row(u, true)).join("")}</div>`;
}

/** Floor plan SVG wrapper. */
export function buildDirectoryMapHtml() {
  return `<div style="width:100%">${PME_FLOORPLAN_SVG}</div>`;
}

/** Events page text cards (no images — matches live listing). */
export function buildEventsTextGridHtml(events: PmeEvent[]) {
  return events
    .map(
      (e) => `<a class="pme-evcard" href="/${esc(e.slug)}">
  <p class="tags">${esc(e.tags.replace(/,\s*/g, ", ").toUpperCase())}</p>
  <h3>${esc(e.title)}</h3>
  <p>${esc(e.body)}</p>
</a>`,
    )
    .join("\n");
}

/** Order-food purveyor hours list. */
export function buildPurveyorHoursHtml() {
  return PME_PURVEYOR_HOURS.map((p) => {
    const lines = p.hours
      .split("\n")
      .map((l) => `<li>${esc(l)}</li>`)
      .join("");
    return `<div><a href="/vendors">${esc(p.title)}</a><ul>${lines}</ul></div>`;
  }).join("\n");
}

/** Leasing hero body with green highlight spans. */
export function buildLeasingHeroBodyHtml() {
  return `Are you a talented chef, baker, maker, or entrepreneur <span style="color:${PME_ACCENT}">ready to grow?</span> Join Public Market's thriving community and <span style="color:${PME_ACCENT}">bring your vision to life</span> in a dynamic space designed for vendors.`;
}

/** Alternating leasing unit rows as a single HTML section. */
export function buildLeasingUnitsHtml(
  units: { title: string; size: string }[],
) {
  const featureHtml = LEASE_FEATURES.map(
    (f, i) =>
      `<p style="margin:0;padding:14px 0;border-bottom:1px solid #e5e5e5;font-size:15px;line-height:1.6;color:#555">${i === 0 ? "" : ""}${esc(f)}</p>`,
  ).join("");

  return units
    .map((u, i) => {
      const imageLeft = i % 2 === 1;
      const img = PME_LEASE_IMAGES[i % PME_LEASE_IMAGES.length];
      const text = `<div>
  <h2 style="margin:0;font-size:clamp(28px,3vw,40px);font-weight:400;font-family:var(--theme-font-heading,Georgia,serif);color:#111">${esc(u.title)} <span style="font-weight:300">${esc(u.size)}</span></h2>
  <div style="margin-top:20px;border-top:1px solid #e5e5e5">${featureHtml}</div>
  <div style="margin-top:28px;display:flex;flex-wrap:wrap;gap:12px">
    <a href="/contact" style="display:inline-block;padding:12px 22px;background:${PME_ACCENT};color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.1em">INQUIRE NOW</a>
    <a href="/directory" style="display:inline-block;padding:12px 22px;border:1px solid #ccc;color:#666;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.1em">VIEW MAP</a>
  </div>
</div>`;
      const image = `<div><img src="${esc(img)}" alt="${esc(u.title)}" style="width:100%;aspect-ratio:4/3;object-fit:cover" /></div>`;
      const cols = imageLeft ? `${image}${text}` : `${text}${image}`;
      return `<div style="max-width:72rem;margin:0 auto;padding:48px 24px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;border-bottom:1px solid #e8e8e8">${cols}</div>`;
    })
    .join("\n");
}
