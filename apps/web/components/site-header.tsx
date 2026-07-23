import type { MenuItem } from "@nextpress/cms-core";
import { SiteHeaderShell } from "@/components/site-header-shell";
import { getCms } from "@/lib/cms";

export async function SiteHeader() {
  const cms = getCms();

  let siteName = "NextPress";
  let logoUrl: string | null = null;
  let headerBackground: string | null = null;
  let menuItems: MenuItem[] = [];

  try {
    if (cms.getSiteSettings) {
      const settings = await cms.getSiteSettings();
      siteName = settings.siteName;
      logoUrl = settings.logoUrl ?? null;
      headerBackground = settings.headerBackground ?? null;
    }
  } catch {
    // use defaults
  }

  try {
    if (cms.getMenuByLocation) {
      const menu = await cms.getMenuByLocation("header");
      if (menu) menuItems = menu.items;
    }
  } catch {
    // no menu
  }

  return (
    <SiteHeaderShell
      siteName={siteName}
      logoUrl={logoUrl}
      menuItems={menuItems}
      headerBackground={headerBackground}
      scrollSkin
    />
  );
}
