import type { Metadata } from "next";
import "@nextpress/builder/styles.css";
import { getCms } from "@/lib/cms";
import { themeConfigToCss, themeConfigToFontUrl } from "@/lib/theme-css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const cms = getCms();
  let siteName = "NextPress";
  let tagline: string | undefined;

  try {
    if (cms.getSiteSettings) {
      const settings = await cms.getSiteSettings();
      siteName = settings.siteName;
      tagline = settings.tagline ?? undefined;
    }
  } catch {
    // use defaults
  }

  return {
    title: siteName,
    description: tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cms = getCms();
  let customCss = "";
  let themeCss = "";
  let themeFontUrl: string | null = null;
  let headerScripts = "";
  let footerScripts = "";

  try {
    if (cms.getSiteSettings) {
      const settings = await cms.getSiteSettings();
      customCss = settings.customCss ?? "";
      headerScripts = settings.headerScripts ?? "";
      footerScripts = settings.footerScripts ?? "";
    }
  } catch {
    // ignore
  }

  try {
    if (cms.getActiveTheme) {
      const theme = await cms.getActiveTheme();
      if (theme?.config) {
        themeCss = themeConfigToCss(theme.config);
        themeFontUrl = themeConfigToFontUrl(theme.config);
      }
    }
  } catch {
    // ignore
  }

  return (
    <html lang="en">
      <body className="antialiased">
        {themeFontUrl ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={themeFontUrl} />
          </>
        ) : null}
        {headerScripts ? (
          <script dangerouslySetInnerHTML={{ __html: headerScripts }} />
        ) : null}
        <a className="skip-link" href="#main-content">Skip to content</a>
        {themeCss ? (
          <style id="theme-variables" dangerouslySetInnerHTML={{ __html: themeCss }} />
        ) : null}
        {customCss ? (
          <style id="site-custom-css" dangerouslySetInnerHTML={{ __html: customCss }} />
        ) : null}
        {children}
        {footerScripts ? (
          <script dangerouslySetInnerHTML={{ __html: footerScripts }} />
        ) : null}
      </body>
    </html>
  );
}
