"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MenuItem } from "@nextpress/cms-core";
import { MenuRenderer } from "@/components/navigation/menu-renderer";

type SiteHeaderShellProps = {
  siteName: string;
  logoUrl: string | null;
  menuItems: MenuItem[];
  headerBackground?: string | null;
  scrollSkin?: boolean;
};

const STRAPI_ADMIN_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1338"}/admin`;

/**
 * Client shell for site header — mobile menu, scroll-based skin change, smooth open animation.
 */
export function SiteHeaderShell({
  siteName,
  logoUrl,
  menuItems,
  headerBackground,
  scrollSkin = true,
}: SiteHeaderShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!scrollSkin) return;
    const onScroll = () => setScrolled(window.scrollY >= window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollSkin]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerClass = scrollSkin && scrolled
    ? "border-b border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-md"
    : scrollSkin
      ? "border-b border-transparent bg-transparent"
      : "border-b border-zinc-200/80 bg-white/90 backdrop-blur-md";

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out ${headerClass}`}
      style={{ backgroundColor: !scrollSkin && headerBackground ? headerBackground : undefined }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-base font-semibold tracking-tight text-zinc-900"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
          ) : (
            siteName
          )}
        </Link>

        {menuItems.length > 0 ? (
          <MenuRenderer items={menuItems} className="hidden sm:flex" />
        ) : (
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            <Link
              href="/blog"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              Blog
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <a
            href={STRAPI_ADMIN_URL}
            className="hidden rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:inline-flex"
          >
            Admin
          </a>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span aria-hidden="true">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav-panel"
        className={`overflow-hidden border-t border-zinc-200 bg-white transition-[max-height,opacity] duration-300 ease-out sm:hidden ${
          mobileOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav className="px-4 py-4" aria-label="Mobile navigation">
          {menuItems.length > 0 ? (
            <MenuRenderer items={menuItems} orientation="vertical" />
          ) : (
            <ul className="space-y-1">
              <li>
                <Link href="/blog" className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50" onClick={() => setMobileOpen(false)}>
                  Blog
                </Link>
              </li>
            </ul>
          )}
          <a
            href={STRAPI_ADMIN_URL}
            className="mt-3 block rounded-lg bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white"
            onClick={() => setMobileOpen(false)}
          >
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}
