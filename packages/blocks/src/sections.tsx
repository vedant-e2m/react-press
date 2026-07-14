import type { ReactNode } from "react";
import { renderEditable } from "./editable";
import { WithScrollReveal } from "./motion/with-scroll-reveal";
import {
  elementTextStyleCss,
  pickElementTextStyle,
  type ElementAlign,
  type ElementFontSize,
  type ElementFontWeight,
  type ElementTextStyleProps,
  type PrefixTextStyleProps,
} from "./element-styles";
import { type LayoutProps, layoutStyle, maxWidthClass } from "./layout";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function SectionHeadingInner({
  title,
  highlight,
  description,
  alignment = "center",
  highlightColor = "#1638FB",
  dark = false,
  titleStyle,
  highlightStyle,
  descriptionStyle,
}: {
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
  alignment?: "left" | "center";
  highlightColor?: string;
  dark?: boolean;
  titleStyle?: ElementTextStyleProps;
  highlightStyle?: ElementTextStyleProps;
  descriptionStyle?: ElementTextStyleProps;
}) {
  const align = alignment === "center" ? "text-center mx-auto" : "text-left";
  const titleCss = elementTextStyleCss(titleStyle ?? {});
  const highlightCss = elementTextStyleCss({
    ...highlightStyle,
    color: highlightStyle?.color ?? highlightColor,
  });
  const descriptionCss = elementTextStyleCss(descriptionStyle ?? {});

  return (
    <div className={cn("max-w-3xl", align)} style={titleCss.textAlign ? { textAlign: titleCss.textAlign } : undefined}>
      <h2
        className={cn(
          "font-theme-heading text-[clamp(24px,3.5vw,44px)] font-normal leading-tight tracking-tight",
          !titleStyle?.color && (dark ? "text-white" : "text-[var(--theme-color-text,var(--foreground))]"),
        )}
        style={titleCss}
      >
        {renderEditable(title)}{" "}
        {highlight ? (
          <span style={highlightCss}>{renderEditable(highlight)}</span>
        ) : null}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg font-light leading-relaxed",
            !descriptionStyle?.color && (dark ? "text-[#D2D2D2]" : "text-[#666]"),
          )}
          style={descriptionCss}
        >
          {renderEditable(description)}
        </p>
      )}
    </div>
  );
}

export type SectionHeadingProps = {
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
  alignment: "left" | "center";
  highlightColor?: string;
  textColor?: string;
  backgroundColor?: string;
} & PrefixTextStyleProps<"title"> &
  PrefixTextStyleProps<"description"> &
  LayoutProps;

export function SectionHeading({
  title,
  highlight,
  description,
  alignment,
  highlightColor,
  textColor,
  backgroundColor,
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
  borderRadius,
  borderWidth,
  borderColor,
  ...styleProps
}: SectionHeadingProps) {
  const props = styleProps as Record<string, unknown>;
  const titleStyle = pickElementTextStyle(props, "title");
  // Prefer per-element titleColor; fall back to legacy block textColor from older pages.
  const resolvedTitleStyle = {
    ...titleStyle,
    color: titleStyle.color ?? textColor,
  };

  const hasCustomPadding =
    typeof paddingTop === "number" ||
    typeof paddingBottom === "number" ||
    typeof paddingLeft === "number" ||
    typeof paddingRight === "number";

  return (
    <section
      className={cn(!hasCustomPadding && "px-6 py-16", className)}
      style={{
        backgroundColor: backgroundColor || undefined,
        ...layoutStyle({
          marginTop,
          marginBottom,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          offsetX,
          offsetY,
          borderRadius,
          borderWidth,
          borderColor,
        }),
      }}
    >
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <SectionHeadingInner
          title={title}
          highlight={highlight}
          description={description}
          alignment={alignment}
          highlightColor={highlightColor}
          titleStyle={resolvedTitleStyle}
          descriptionStyle={pickElementTextStyle(props, "description")}
        />
      </div>
    </section>
  );
}

export type StatItem = { value: string; label: string };

export type StatRowProps = {
  items: StatItem[];
  accentColor?: string;
  columns?: "3" | "6";
} & LayoutProps;

export function StatRow({
  items,
  accentColor = "#1638FB",
  columns = "6",
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
}: StatRowProps) {
  const stats = items?.filter((i) => i.value) ?? [];
  const gridClass =
    columns === "6"
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      : "grid-cols-1 md:grid-cols-3";

  return (
    <section
      className={cn("px-6 pb-16", className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <div className={cn("grid gap-8", gridClass)}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-[clamp(28px,4vw,50px)] font-medium leading-tight"
                style={{ color: accentColor }}
              >
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-light text-[#666]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export type ServiceItem = { title: string; description: string; href: string };

export type ServiceSectionProps = {
  iconUrl?: string;
  title: ReactNode;
  description: ReactNode;
  services: ServiceItem[];
  ctaLabel?: ReactNode;
  ctaHref?: string;
  backgroundColor?: string;
  accentColor?: string;
  linkColor?: string;
} & PrefixTextStyleProps<"title"> &
  PrefixTextStyleProps<"description"> &
  LayoutProps;

export function ServiceSection({
  iconUrl,
  title,
  description,
  services,
  ctaLabel,
  ctaHref,
  backgroundColor = "#1C1C1C",
  accentColor = "#1638FB",
  linkColor = "#F35700",
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
}: ServiceSectionProps) {
  const props = styleProps as Record<string, unknown>;
  const items = services?.filter((s) => s.title) ?? [];

  return (
    <section
      className={cn("px-6 py-20 text-white", className)}
      style={{
        backgroundColor,
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
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <div className="mb-12 flex items-start gap-4">
          {iconUrl && <img src={iconUrl} alt="" className="mt-2 w-12 shrink-0" />}
          <SectionHeadingInner
            title={title}
            description={description}
            alignment="left"
            dark
            highlightColor={accentColor}
            titleStyle={pickElementTextStyle(props, "title")}
            descriptionStyle={pickElementTextStyle(props, "description")}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((service) => (
            <a
              key={service.title}
              href={service.href || "#"}
              className="group rounded-lg border border-white/10 bg-white/5 p-8 transition-all hover:border-[#1638FB]/50 hover:bg-white/10"
            >
              <h3 className="text-[clamp(18px,2vw,24px)] font-medium text-white group-hover:text-[#1638FB]">
                {service.title}
              </h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-[#D2D2D2]">{service.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium" style={{ color: linkColor }}>
                Learn more →
              </span>
            </a>
          ))}
        </div>
        {ctaLabel && ctaHref && (
          <div className="mt-12 text-center">
            <a
              href={ctaHref}
              className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: linkColor }}
            >
              {renderEditable(ctaLabel)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export type TestimonialItem = { quote: string; name: string; role: string; linkUrl: string };

export type TestimonialsSectionProps = {
  title: ReactNode;
  highlight?: ReactNode;
  description: ReactNode;
  items: TestimonialItem[];
  highlightColor?: string;
  linkColor?: string;
} & LayoutProps;

export function TestimonialsSection({
  title,
  highlight,
  description,
  items,
  highlightColor = "#1638FB",
  linkColor = "#1638FB",
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
}: TestimonialsSectionProps) {
  const testimonials = items?.filter((t) => t.quote) ?? [];

  return (
    <section
      className={cn("px-6 py-20", className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <SectionHeadingInner
          title={title}
          highlight={highlight}
          description={description}
          alignment="center"
          highlightColor={highlightColor}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-lg border border-[#D2D2D2]/40 bg-white p-8 shadow-sm"
            >
              <p className="flex-1 text-lg font-medium leading-snug text-[#1C1C1C]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-[#D2D2D2]/40 pt-6">
                <p className="font-semibold text-[#1C1C1C]">{t.name}</p>
                <p className="mt-1 text-sm font-light text-[#666]">{t.role}</p>
              </div>
              <a href={t.linkUrl || "#"} className="mt-4 text-sm font-medium hover:opacity-80" style={{ color: linkColor }}>
                View →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export type FeatureItem = {
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  showArrow?: boolean;
};

export type FeatureGridProps = {
  title: ReactNode;
  highlight?: ReactNode;
  description: ReactNode;
  features: FeatureItem[];
  display?: "cards" | "image-tiles";
  backgroundColor?: string;
  highlightColor?: string;
  overlayGradient?: boolean;
  sectionWatermark?: ReactNode;
  sectionCtaLabel?: ReactNode;
  sectionCtaUrl?: string;
  tileStyle?: "rounded" | "flush";
  animation?: import("./layout").ScrollAnimation;
  animationDelay?: number;
  animationDuration?: number;
} & LayoutProps;

export function FeatureGrid({
  title,
  highlight,
  description,
  features,
  display = "cards",
  backgroundColor = "#1C1C1C",
  highlightColor = "#1638FB",
  overlayGradient = true,
  sectionWatermark,
  sectionCtaLabel,
  sectionCtaUrl,
  tileStyle = "rounded",
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
  animation,
  animationDelay,
  animationDuration,
}: FeatureGridProps) {
  const list = features?.filter((f) => f.title) ?? [];
  const isLight = backgroundColor?.toLowerCase() === "#ffffff" || backgroundColor?.toLowerCase() === "#fff";

  return (
    <WithScrollReveal
      animation={animation}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
    >
      <section
        className={cn("px-6 py-20", !isLight && "text-white", className)}
        style={{
          backgroundColor,
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
        <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            {sectionWatermark ? (
              <p
                className="pointer-events-none absolute -top-6 left-0 select-none font-theme-heading text-[clamp(48px,8vw,120px)] font-normal leading-none opacity-[0.06]"
                style={{ color: isLight ? "#494747" : "#ffffff" }}
                aria-hidden
              >
                {renderEditable(sectionWatermark)}
              </p>
            ) : null}
            <SectionHeadingInner
              title={title}
              highlight={highlight}
              description={description}
              alignment="left"
              dark={!isLight}
              highlightColor={highlightColor}
            />
            {sectionCtaLabel && sectionCtaUrl ? (
              <a
                href={sectionCtaUrl}
                className="relative z-10 text-sm font-medium uppercase tracking-wide hover:opacity-80"
                style={{ color: highlightColor }}
              >
                {renderEditable(sectionCtaLabel)} ↗
              </a>
            ) : null}
          </div>
          {display === "image-tiles" ? (
            <div className={cn("mt-14 grid sm:grid-cols-2 lg:grid-cols-3", tileStyle === "flush" ? "gap-0" : "gap-6")}>
              {list.map((feature) => {
                const inner = (
                  <div className={cn("relative aspect-[4/5] overflow-hidden", tileStyle === "rounded" && "rounded-lg")}>
                    {feature.imageUrl ? (
                      <img
                        src={feature.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-700" />
                    )}
                    {overlayGradient ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                      <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                      {feature.showArrow !== false && feature.linkUrl ? (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
                          →
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
                return feature.linkUrl ? (
                  <a key={feature.title} href={feature.linkUrl} className="block transition-transform hover:scale-[1.02]">
                    {inner}
                  </a>
                ) : (
                  <div key={feature.title}>{inner}</div>
                );
              })}
            </div>
          ) : (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((feature) => (
                <div key={feature.title} className="rounded-lg border border-white/10 p-6">
                  <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[#D2D2D2]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </WithScrollReveal>
  );
}

export type SplitPanelProps = {
  title: ReactNode;
  description: ReactNode;
  linkLabel?: ReactNode;
  linkUrl?: string;
  bullets: { text: string }[];
  imageUrl?: string;
  backgroundColor?: string;
  linkColor?: string;
} & LayoutProps;

export function SplitPanel({
  title,
  description,
  linkLabel,
  linkUrl,
  bullets,
  imageUrl,
  backgroundColor = "#1C1C1C",
  linkColor = "#F35700",
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
}: SplitPanelProps) {
  const items = bullets?.filter((b) => b.text) ?? [];

  return (
    <section
      className={cn("px-6 pb-20 text-white", className)}
      style={{
        backgroundColor,
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
      <div className={cn("mx-auto grid items-center gap-10 lg:grid-cols-2", maxWidthClass(maxWidth ?? "6xl"))}>
        <div>
          <h3 className="text-2xl font-medium text-white">{renderEditable(title)}</h3>
          <p className="mt-4 font-light leading-relaxed text-[#D2D2D2]">{renderEditable(description)}</p>
          {linkLabel && linkUrl && (
            <a href={linkUrl} className="mt-6 inline-block text-sm font-medium hover:underline" style={{ color: linkColor }}>
              {renderEditable(linkLabel)}
            </a>
          )}
          <ul className="mt-8 space-y-3">
            {items.map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-sm font-light text-[#D2D2D2]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1638FB]" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="" className="w-full max-w-md opacity-80" />
          </div>
        )}
      </div>
    </section>
  );
}

export type StepItem = { number: string; title: string; description: string };

export type StepsSectionProps = {
  title: ReactNode;
  highlight?: ReactNode;
  description: ReactNode;
  steps: StepItem[];
  highlightColor?: string;
} & LayoutProps;

export function StepsSection({
  title,
  highlight,
  description,
  steps,
  highlightColor = "#1638FB",
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
}: StepsSectionProps) {
  const list = steps?.filter((s) => s.title) ?? [];

  return (
    <section
      className={cn("px-6 py-20", className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <SectionHeadingInner
          title={title}
          highlight={highlight}
          description={description}
          alignment="center"
          highlightColor={highlightColor}
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {list.map((step) => (
            <div key={step.number} className="rounded-lg border border-[#D2D2D2]/40 p-8">
              <span className="text-[clamp(40px,6vw,72px)] font-medium leading-none text-[#1638FB]/20">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-medium text-[#1C1C1C]">{step.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-[#666]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export type ProfileSpotlightProps = {
  title: ReactNode;
  description: ReactNode;
  subDescription?: ReactNode;
  personName: ReactNode;
  personRole: ReactNode;
  personInitials?: string;
  backgroundColor?: string;
} & LayoutProps;

export function ProfileSpotlight({
  title,
  description,
  subDescription,
  personName,
  personRole,
  personInitials,
  backgroundColor = "#1638FB",
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
}: ProfileSpotlightProps) {
  return (
    <section
      className={cn("px-6 py-20 text-white", className)}
      style={{
        backgroundColor,
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
      <div className={cn("mx-auto text-center", maxWidthClass(maxWidth ?? "6xl"))}>
        <SectionHeadingInner title={title} description={description} alignment="center" dark />
        {subDescription && (
          <p className="mx-auto mt-2 max-w-xl font-light text-white/70">{renderEditable(subDescription)}</p>
        )}
        <div className="mx-auto mt-12 max-w-md rounded-xl bg-white/10 p-8 backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
            {personInitials || "?"}
          </div>
          <p className="text-lg font-semibold">{renderEditable(personName)}</p>
          <p className="mt-1 text-sm font-light text-white/80">{renderEditable(personRole)}</p>
        </div>
      </div>
    </section>
  );
}

export type ArticleItem = {
  title: string;
  href: string;
  featured?: boolean;
  imageUrl?: string;
  meta?: string;
  tags?: string | Array<string | { name: string }>;
};

export type ArticleGridProps = {
  title: ReactNode;
  description: ReactNode;
  articles: ArticleItem[];
  layout?: "grid" | "masonry";
  cardVariant?: "default" | "image-overlay";
  linkColor?: string;
  backgroundColor?: string;
  textColor?: string;
  sectionCtaLabel?: string;
  sectionCtaUrl?: string;
  sectionCtaStyle?: "link" | "button";
  animation?: import("./layout").ScrollAnimation;
  animationDelay?: number;
  animationDuration?: number;
} & LayoutProps;

export function ArticleGrid({
  title,
  description,
  articles,
  layout = "grid",
  cardVariant = "default",
  linkColor = "var(--theme-color-accent)",
  backgroundColor,
  textColor,
  sectionCtaLabel,
  sectionCtaUrl,
  sectionCtaStyle = "link",
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
  animation,
  animationDelay,
  animationDuration,
}: ArticleGridProps) {
  const list = articles?.filter((a) => a.title) ?? [];
  const dark = Boolean(backgroundColor);

  const normalizeTags = (tags?: ArticleItem["tags"]) => {
    if (!tags) return [];
    if (typeof tags === "string") {
      return tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return tags.map((tag) => (typeof tag === "string" ? tag : tag.name)).filter(Boolean);
  };

  const renderArticle = (article: ArticleItem, index: number) => {
    const tagList = normalizeTags(article.tags);
    const overlay = cardVariant === "image-overlay" && article.imageUrl;

    if (overlay) {
      return (
        <a
          key={article.title}
          href={article.href || "#"}
          className={cn(
            "group relative block overflow-hidden",
            layout === "masonry" && "mb-6 break-inside-avoid",
            index % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]",
          )}
        >
          <img src={article.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          {tagList.length ? (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-theme-heading text-lg font-normal text-white">
              {article.title} <span className="inline-block opacity-70">↗</span>
            </h3>
            {article.meta ? <p className="mt-1 text-xs text-white/70">{article.meta}</p> : null}
          </div>
        </a>
      );
    }

    return (
    <a
      key={article.title}
      href={article.href || "#"}
      className={cn(
        "group block rounded-lg border border-[#D2D2D2]/40 p-6 transition-all hover:border-zinc-400 hover:shadow-md",
        article.featured && layout === "grid" && "sm:col-span-2 sm:p-10",
        dark && "border-white/20 hover:border-white/40",
        layout === "masonry" && "mb-6 break-inside-avoid",
      )}
    >
      {article.imageUrl ? (
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img
            src={article.imageUrl}
            alt=""
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          {tagList.length ? (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <h3
        className={cn(
          "font-medium group-hover:opacity-80",
          dark ? "text-white" : "text-[#1C1C1C]",
          article.featured ? "text-2xl" : "text-lg",
        )}
      >
        {article.title} <span className="inline-block opacity-60">↗</span>
      </h3>
      {article.meta ? (
        <p className={cn("mt-2 text-sm", dark ? "text-white/60" : "text-zinc-500")}>{article.meta}</p>
      ) : null}
      {cardVariant !== "image-overlay" ? (
        <span className="mt-4 inline-block text-sm font-medium" style={{ color: linkColor }}>
          Read more →
        </span>
      ) : null}
    </a>
    );
  };

  return (
    <WithScrollReveal
      animation={animation}
      animationDelay={animationDelay}
      animationDuration={animationDuration}
    >
      <section
        className={cn("px-6 py-20", className)}
        style={{
          backgroundColor: backgroundColor || undefined,
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
        <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeadingInner
              title={title}
              description={description}
              alignment="left"
              dark={dark}
              highlightColor={linkColor}
            />
            {sectionCtaLabel && sectionCtaUrl ? (
              sectionCtaStyle === "button" ? (
                <a
                  href={sectionCtaUrl}
                  className="inline-flex rounded-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:opacity-90"
                  style={{ backgroundColor: linkColor }}
                >
                  {sectionCtaLabel}
                </a>
              ) : (
                <a
                  href={sectionCtaUrl}
                  className="text-sm font-semibold uppercase tracking-wide hover:opacity-80"
                  style={{ color: linkColor }}
                >
                  {sectionCtaLabel}
                </a>
              )
            ) : null}
          </div>
          {layout === "masonry" ? (
            <div className="mt-12 columns-1 gap-6 sm:columns-2">{list.map((a, i) => renderArticle(a, i))}</div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">{list.map((a, i) => renderArticle(a, i))}</div>
          )}
        </div>
      </section>
    </WithScrollReveal>
  );
}

export type PromoBannerProps = {
  title: ReactNode;
  description: ReactNode;
  buttonLabel?: ReactNode;
  buttonHref?: string;
  theme: "dark" | "blue";
  buttonColor?: string;
  buttonTextColor?: string;
  titleColor?: string;
  titleFontSize?: ElementFontSize;
  titleFontWeight?: ElementFontWeight;
  titleAlign?: ElementAlign;
  descriptionColor?: string;
  descriptionFontSize?: ElementFontSize;
  descriptionFontWeight?: ElementFontWeight;
  descriptionAlign?: ElementAlign;
} & LayoutProps;

export function PromoBanner({
  title,
  description,
  buttonLabel,
  buttonHref,
  theme,
  buttonColor = "#F35700",
  buttonTextColor,
  titleColor,
  titleFontSize,
  titleFontWeight,
  titleAlign,
  descriptionColor,
  descriptionFontSize,
  descriptionFontWeight,
  descriptionAlign,
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
}: PromoBannerProps) {
  const bg = theme === "blue" ? "#1638FB" : "#1C1C1C";
  const text = theme === "blue" ? "text-white/85" : "text-[#D2D2D2]";
  const titleStyle = elementTextStyleCss({
    color: titleColor,
    fontSize: titleFontSize,
    fontWeight: titleFontWeight,
    align: titleAlign,
  });
  const descriptionStyle = elementTextStyleCss({
    color: descriptionColor,
    fontSize: descriptionFontSize,
    fontWeight: descriptionFontWeight,
    align: descriptionAlign,
  });

  return (
    <section
      className={cn("px-6 py-20 text-white", className)}
      style={{
        backgroundColor: bg,
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
      <div className={cn("mx-auto text-center", maxWidthClass(maxWidth ?? "6xl"))}>
        <h2
          className="text-[clamp(24px,3.5vw,40px)] font-medium leading-tight"
          style={titleStyle}
        >
          {renderEditable(title)}
        </h2>
        <p
          className={cn("mx-auto mt-4 max-w-2xl font-light", !descriptionColor && text)}
          style={descriptionStyle}
        >
          {renderEditable(description)}
        </p>
        {buttonLabel && buttonHref && (
          <div className="mt-10">
            <a
              href={buttonHref}
              className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold"
              style={{
                backgroundColor: buttonColor,
                color: buttonTextColor || "#FFFFFF",
              }}
            >
              {renderEditable(buttonLabel)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export type ContactCtaProps = {
  title: ReactNode;
  subtitle: ReactNode;
  description: ReactNode;
  avatarText?: string;
  avatarImageUrl?: string;
  avatarImageAlt?: string;
  accentColor?: string;
} & PrefixTextStyleProps<"title"> &
  PrefixTextStyleProps<"subtitle"> &
  PrefixTextStyleProps<"description"> &
  LayoutProps;

export function ContactCta({
  title,
  subtitle,
  description,
  avatarText,
  avatarImageUrl,
  avatarImageAlt,
  accentColor = "#1638FB",
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
}: ContactCtaProps) {
  const props = styleProps as Record<string, unknown>;
  const titleStyle = elementTextStyleCss(pickElementTextStyle(props, "title"));
  const subtitleStyle = elementTextStyleCss({
    ...pickElementTextStyle(props, "subtitle"),
    color: pickElementTextStyle(props, "subtitle").color ?? accentColor,
  });
  const descriptionStyle = elementTextStyleCss(pickElementTextStyle(props, "description"));

  return (
    <section
      className={cn("px-6 py-20", className)}
      style={layoutStyle({
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        offsetX,
        offsetY,
      })}
    >
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <div className="grid items-center gap-12 rounded-2xl border border-[#D2D2D2]/40 bg-[#f8f8f8] p-10 lg:grid-cols-2 lg:p-16">
          <div>
            <h2
              className="text-[clamp(28px,4vw,44px)] font-medium text-[#1C1C1C]"
              style={titleStyle}
            >
              {renderEditable(title)}
            </h2>
            <h3 className="mt-4 text-xl font-medium" style={subtitleStyle}>
              {renderEditable(subtitle)}
            </h3>
            <p className="mt-4 font-light leading-relaxed text-[#666]" style={descriptionStyle}>
              {renderEditable(description)}
            </p>
          </div>
          <div className="flex items-center justify-center">
            {avatarImageUrl ? (
              <img
                src={avatarImageUrl}
                alt={avatarImageAlt || ""}
                className="h-64 w-64 rounded-2xl object-cover shadow-xl"
              />
            ) : (
              <div
                className="flex h-64 w-64 items-center justify-center rounded-full text-6xl font-bold text-white shadow-xl"
                style={{ background: `linear-gradient(to bottom right, ${accentColor}, #0726D9)` }}
              >
                {avatarText || "?"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export type FooterColumn = { title: string; links: { label: string; href: string }[] };
export type FooterLink = { label: string; href: string };

export type SiteFooterProps = {
  logoUrl?: string;
  logoBadgeUrl?: string;
  copyright: ReactNode;
  columns: FooterColumn[];
  legalLinks?: FooterLink[];
  infoBox?: {
    label: string;
    lines: string[] | string;
    borderColor?: string;
    labelColor?: string;
  };
  backgroundColor?: string;
  linkColor?: string;
  columnTitleColor?: string;
} & LayoutProps;

export function SiteFooter({
  logoUrl,
  logoBadgeUrl,
  copyright,
  columns,
  legalLinks,
  infoBox,
  backgroundColor = "#1C1C1C",
  linkColor = "#D2D2D2",
  columnTitleColor,
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
}: SiteFooterProps) {
  const cols = columns?.filter((c) => c.title) ?? [];
  const legal = (legalLinks ?? []).filter((l) => l.label);
  const infoLines = infoBox
    ? (Array.isArray(infoBox.lines) ? infoBox.lines : infoBox.lines.split("\n"))
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  return (
    <footer
      className={cn("px-6 py-16 text-white", className)}
      style={{
        backgroundColor,
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
      <div className={cn("mx-auto", maxWidthClass(maxWidth ?? "6xl"))}>
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((col) => (
            <div key={col.title}>
              <h4
                className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em]"
                style={{ color: columnTitleColor || "var(--theme-color-accent, #6FA84C)" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2">
                {(col.links ?? []).filter((l) => l.label).map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href || "#"}
                      className="text-sm uppercase tracking-wide transition-colors hover:text-[var(--theme-color-accent)]"
                      style={{ color: linkColor }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {logoBadgeUrl ? (
            <div className="flex items-start justify-center lg:justify-end">
              <img src={logoBadgeUrl} alt="" className="h-28 w-28 object-contain" />
            </div>
          ) : null}
        </div>
        {infoBox && infoLines.length ? (
          <div
            className="mb-10 border px-6 py-6"
            style={{ borderColor: infoBox.borderColor || "var(--theme-color-accent, #6FA84C)" }}
          >
            <p
              className="text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: infoBox.labelColor || columnTitleColor || "var(--theme-color-accent, #6FA84C)" }}
            >
              {infoBox.label}
            </p>
            <div className="mt-4 grid gap-4 text-sm leading-relaxed sm:grid-cols-3">
              {infoLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            {logoUrl ? <img src={logoUrl} alt="" className="w-16" /> : null}
            {legal.length > 0 ? (
              <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:justify-start">
                {legal.map((l, idx) => (
                  <span key={`${l.label}-${idx}`} className="flex items-center gap-2">
                    <a
                      href={l.href || "#"}
                      className="transition-colors hover:text-white"
                      style={{ color: linkColor }}
                    >
                      {l.label}
                    </a>
                    {idx < legal.length - 1 ? <span style={{ color: linkColor }}>|</span> : null}
                  </span>
                ))}
              </nav>
            ) : null}
          </div>
          <p className="text-sm text-[#666]">{renderEditable(copyright)}</p>
        </div>
      </div>
    </footer>
  );
}
