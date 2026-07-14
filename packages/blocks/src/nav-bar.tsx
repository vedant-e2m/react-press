"use client";

import { useState, type ReactNode } from "react";
import { renderEditable } from "./editable";
import {
  elementTextStyleCss,
  pickElementTextStyle,
  type PrefixTextStyleProps,
} from "./element-styles";
import { type LayoutProps, layoutStyle, maxWidthClass } from "./layout";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type NavBarLink = { label: string; href: string };

export type NavBarProps = {
  brandLabel: string | ReactNode;
  brandHref?: string;
  logoUrl?: string;
  links: NavBarLink[];
  ctaLabel?: string | ReactNode;
  ctaHref?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  sticky?: boolean;
  transparent?: boolean;
  announcementText?: string;
  menuStyle?: "inline" | "drawer";
  logoInvert?: boolean;
  ctaVariant?: "button" | "text";
  announcementBackgroundColor?: string;
  announcementTextColor?: string;
} & PrefixTextStyleProps<"brandLabel"> &
  LayoutProps;

export function NavBar({
  brandLabel,
  brandHref = "#",
  logoUrl,
  links,
  ctaLabel,
  ctaHref,
  backgroundColor,
  textColor,
  accentColor,
  sticky,
  transparent,
  announcementText,
  menuStyle = "inline",
  logoInvert,
  ctaVariant = "button",
  announcementBackgroundColor,
  announcementTextColor,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  offsetX,
  offsetY,
  maxWidth,
  className,
  ...styleProps
}: NavBarProps) {
  const props = styleProps as Record<string, unknown>;
  const brandStyle = elementTextStyleCss({
    ...pickElementTextStyle(props, "brandLabel"),
    color: pickElementTextStyle(props, "brandLabel").color ?? textColor,
  });
  const items = (links ?? []).filter((l) => l.label);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const headerClass = cn(
    sticky && "sticky top-0 z-50",
    transparent ? "absolute inset-x-0 top-0 z-50 border-b-0 bg-transparent" : "border-b border-zinc-200",
    className,
  );

  const resolvedBg = transparent ? "transparent" : backgroundColor || undefined;

  return (
    <header
      className={headerClass}
      style={{
        backgroundColor: resolvedBg,
        color: textColor || undefined,
        ...layoutStyle({
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          offsetX,
          offsetY,
        }),
      }}
    >
      {announcementText ? (
        <div
          className="border-b border-white/10 px-4 py-2 text-center text-xs font-medium tracking-wide"
          style={{
            backgroundColor:
              announcementBackgroundColor ?? accentColor ?? "var(--theme-color-accent, #6FA84C)",
            color: announcementTextColor ?? "#fff",
          }}
        >
          {announcementText}
        </div>
      ) : null}

      <div
        className={cn(
          "relative mx-auto flex items-center gap-6 px-6 py-4",
          maxWidthClass(maxWidth ?? "6xl"),
        )}
      >
        {menuStyle === "drawer" ? (
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center"
            aria-expanded={drawerOpen}
            aria-label="Open menu"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        ) : null}

        {menuStyle === "drawer" ? (
          <a
            href={brandHref}
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2"
            style={brandStyle}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={typeof brandLabel === "string" ? brandLabel : ""}
                className={cn("h-9 w-auto", logoInvert && "brightness-0 invert")}
              />
            ) : (
              renderEditable(brandLabel)
            )}
          </a>
        ) : (
          <a
            href={brandHref}
            className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
            style={brandStyle}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={typeof brandLabel === "string" ? brandLabel : ""}
                className={cn("h-8 w-auto", logoInvert && "brightness-0 invert")}
              />
            ) : (
              renderEditable(brandLabel)
            )}
          </a>
        )}

        {menuStyle === "inline" ? (
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm md:flex">
            {items.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href || "#"} className="hover:opacity-80">
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <div className="flex-1" aria-hidden />
        )}

        {ctaLabel && ctaHref ? (
          <a
            href={ctaHref}
            className={cn(
              "ml-auto inline-flex shrink-0 items-center text-sm font-medium uppercase tracking-wide hover:opacity-80",
              ctaVariant === "button" &&
                "rounded-lg px-4 py-2 normal-case tracking-normal text-white hover:opacity-90",
            )}
            style={
              ctaVariant === "button"
                ? { backgroundColor: accentColor || "#18181b" }
                : { color: textColor || undefined }
            }
          >
            {renderEditable(ctaLabel)}
          </a>
        ) : null}
      </div>

      {menuStyle === "drawer" && drawerOpen ? (
        <nav className="border-t border-white/10 px-6 py-4">
          <ul className="space-y-3 text-sm">
            {items.map((link) => (
              <li key={`${link.label}-${link.href}-mobile`}>
                <a href={link.href || "#"} className="block py-1 hover:opacity-80" onClick={() => setDrawerOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            {ctaLabel && ctaHref ? (
              <li>
                <a
                  href={ctaHref}
                  className="mt-2 inline-flex rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: accentColor || "#18181b" }}
                  onClick={() => setDrawerOpen(false)}
                >
                  {renderEditable(ctaLabel)}
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
