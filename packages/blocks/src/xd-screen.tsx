import type { ReactNode } from "react";
import type { LayoutProps } from "./index";

export type XdImportedScreenProps = {
  title: string;
  artboardName: string;
  width: number;
  height: number;
  variant: "splash" | "home" | "welcome" | "generic";
  accentColor: string;
  backgroundColor?: string;
  previewImageUrl?: string;
  splash?: {
    brandName: string;
    primaryCta: string;
    secondaryCta: string;
    logoImageUrl?: string;
  };
  home?: {
    searchPlaceholder: string;
    sections: Array<{
      title: string;
      seeAll?: boolean;
      products: Array<{ name: string; price: string; imageUrl?: string }>;
    }>;
    categories: Array<{ label: string; active?: boolean }>;
  };
  welcome?: {
    title: string;
    subtitle: string;
    skipLabel?: string;
  };
  genericTexts?: Array<{
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    color?: string;
  }>;
} & LayoutProps;

function ScreenFrame({
  children,
  label,
  width,
  height,
}: {
  children: ReactNode;
  label: string;
  width: number;
  height: number;
}) {
  const isDesktop = width > 600;

  if (isDesktop) {
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <div className="text-sm font-medium text-zinc-500">{label}</div>
        <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-xl">
          <div className="relative overflow-hidden bg-white" style={{ width, minHeight: height }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm font-medium text-zinc-500">{label}</div>
      <div className="overflow-hidden rounded-[2rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl">
        <div className="relative overflow-hidden bg-white" style={{ width: 393, minHeight: 851 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SplashScreen({
  accentColor,
  splash,
  previewImageUrl,
}: Pick<XdImportedScreenProps, "accentColor" | "splash" | "previewImageUrl">) {
  if (!splash) return null;

  return (
    <div
      className="relative flex min-h-[851px] flex-col items-center justify-end px-8 pb-16 pt-24 text-white"
      style={{
        background: `linear-gradient(180deg, ${accentColor} 0%, #ff1161 100%)`,
      }}
    >
      {previewImageUrl ? (
        <img
          src={previewImageUrl}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        />
      ) : null}
      <div className="relative z-10 mb-auto mt-16 flex h-40 w-40 items-center justify-center rounded-full bg-white/15 text-6xl font-bold">
        {splash.brandName.charAt(0)}
      </div>
      <div className="relative z-10 w-full space-y-4">
        <button
          type="button"
          className="w-full rounded-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-wide"
          style={{ color: accentColor }}
        >
          {splash.primaryCta}
        </button>
        <button type="button" className="w-full py-2 text-sm font-bold uppercase tracking-wide text-white">
          {splash.secondaryCta}
        </button>
      </div>
    </div>
  );
}

function HomeScreen({
  accentColor,
  home,
}: Pick<XdImportedScreenProps, "accentColor" | "home">) {
  if (!home) return null;

  return (
    <div className="min-h-[851px] bg-white pb-24">
      <header className="sticky top-0 z-20 bg-white px-5 pb-3 pt-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-6 bg-black" />
            <span className="block h-0.5 w-4 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
          </div>
          <div className="flex items-center gap-4 text-zinc-800">
            <span className="text-lg">🔔</span>
            <span className="text-lg">🛒</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center rounded-md bg-[#f7f7f8] px-3 py-2.5 text-sm text-[#8b98b4]">
            <span className="mr-2">🔍</span>
            {home.searchPlaceholder}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f7f7f8] text-zinc-600">
            ⛃
          </div>
        </div>
      </header>

      <div className="space-y-6 px-5 pt-4">
        {home.sections.map((section) => (
          <section key={section.title}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wide text-black">{section.title}</h2>
              {section.seeAll ? (
                <button type="button" className="text-sm font-medium" style={{ color: accentColor }}>
                  See All
                </button>
              ) : null}
            </div>
            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
              {section.products.map((product) => (
                <article
                  key={`${section.title}-${product.name}`}
                  className="w-40 shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex h-28 items-center justify-center bg-[#fbfbfb]">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-3xl">🛍️</div>
                    )}
                  </div>
                  <div className="space-y-1 p-3">
                    <h3 className="line-clamp-2 text-sm capitalize text-black">{product.name}</h3>
                    <p className="text-sm font-semibold text-[#8b98b4]">{product.price}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {home.categories.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {home.categories.map((category) => (
              <span
                key={category.label}
                className="shrink-0 rounded-full px-4 py-2 text-sm capitalize"
                style={
                  category.active
                    ? { background: `linear-gradient(90deg, #ff1161, ${accentColor})`, color: "#fff" }
                    : { background: "#f7f7f8", color: "#000" }
                }
              >
                {category.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <nav
        className="absolute bottom-0 left-0 right-0 px-8 py-4 text-white"
        style={{ background: `linear-gradient(90deg, ${accentColor}, #ff1161)` }}
      >
        <div className="flex items-center justify-between text-xs">
          <span>🏠 Home</span>
          <span>📦 Orders</span>
          <span>👤 Profile</span>
        </div>
      </nav>
    </div>
  );
}

function WelcomeScreen({
  accentColor,
  welcome,
}: Pick<XdImportedScreenProps, "accentColor" | "welcome">) {
  if (!welcome) return null;

  return (
    <div className="flex min-h-[851px] flex-col bg-white px-6 py-8">
      <div className="mb-auto flex justify-end">
        {welcome.skipLabel ? (
          <button type="button" className="text-sm font-medium" style={{ color: accentColor }}>
            {welcome.skipLabel}
          </button>
        ) : null}
      </div>
      <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#f7f7f8] text-4xl">
        👤
      </div>
      <div className="space-y-2 text-center">
        <p className="text-sm text-zinc-500">{welcome.subtitle}</p>
        <h2 className="text-2xl font-semibold text-zinc-900">{welcome.title}</h2>
      </div>
      <button
        type="button"
        className="mt-10 w-full rounded-full px-6 py-4 text-sm font-bold uppercase text-white"
        style={{ background: `linear-gradient(90deg, ${accentColor}, #ff1161)` }}
      >
        Upload picture
      </button>
    </div>
  );
}

function GenericScreen({
  previewImageUrl,
  genericTexts,
  width,
  height,
}: Pick<XdImportedScreenProps, "previewImageUrl" | "genericTexts" | "width" | "height">) {
  if (genericTexts && genericTexts.length > 0) {
    return (
      <div className="relative overflow-hidden bg-white" style={{ width, minHeight: height }}>
        <div className="border-b border-zinc-100 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Imported screen</div>
        </div>
        <div className="relative" style={{ height: height - 56 }}>
          {genericTexts.map((item) => (
            <div
              key={`${item.x}-${item.y}-${item.text}`}
              className="absolute max-w-[320px] whitespace-pre-wrap leading-snug"
              style={{
                left: item.x,
                top: Math.max(0, item.y - 56),
                fontSize: item.fontSize ?? 14,
                color: item.color ?? "#111",
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (previewImageUrl) {
    return <img src={previewImageUrl} alt="" className="h-full w-full object-cover object-top" />;
  }

  return (
    <div className="flex h-full items-center justify-center bg-zinc-50 text-sm text-zinc-500">
      No preview available
    </div>
  );
}

export function XdImportedScreen({
  title,
  artboardName,
  width,
  height,
  variant,
  accentColor,
  splash,
  home,
  welcome,
  previewImageUrl,
  genericTexts,
  className,
}: XdImportedScreenProps) {
  let screen: ReactNode = null;

  if (variant === "splash") {
    screen = <SplashScreen accentColor={accentColor} splash={splash} previewImageUrl={previewImageUrl} />;
  } else if (variant === "home") {
    screen = <HomeScreen accentColor={accentColor} home={home} />;
  } else if (variant === "welcome") {
    screen = <WelcomeScreen accentColor={accentColor} welcome={welcome} />;
  } else {
    screen = (
      <GenericScreen
        previewImageUrl={previewImageUrl}
        genericTexts={genericTexts}
        width={width}
        height={height}
      />
    );
  }

  return (
    <section className={className ?? "bg-zinc-50 px-6 py-12"}>
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Imported from Adobe XD</p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-900">{title || artboardName}</h2>
        </div>
        <ScreenFrame label={artboardName} width={width} height={height}>
          {screen}
        </ScreenFrame>
      </div>
    </section>
  );
}
