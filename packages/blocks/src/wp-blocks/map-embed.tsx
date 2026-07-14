import { type LayoutProps, layoutStyle, maxWidthClass } from "../layout";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export type MapEmbedProps = {
  provider: "google" | "mapbox" | "embed";
  embedUrl?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  height?: number;
  title?: string;
  backgroundColor?: string;
} & LayoutProps;

function buildMapUrl(props: MapEmbedProps): string | null {
  if (props.provider === "embed" && props.embedUrl) return props.embedUrl;
  if (props.provider === "google" && props.latitude != null && props.longitude != null) {
    const z = props.zoom ?? 14;
    return `https://maps.google.com/maps?q=${props.latitude},${props.longitude}&z=${z}&output=embed`;
  }
  if (props.provider === "mapbox" && props.latitude != null && props.longitude != null) {
    const z = props.zoom ?? 14;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12.html?title=false&access_token=pk.placeholder#${z}/${props.latitude}/${props.longitude}`;
  }
  return props.embedUrl ?? null;
}

/**
 * Google Maps / Mapbox embed block for location pages.
 */
export function MapEmbed({
  provider = "google",
  embedUrl,
  latitude,
  longitude,
  zoom,
  height = 400,
  title = "Map",
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
  blockId,
}: MapEmbedProps) {
  const src = buildMapUrl({ provider, embedUrl, latitude, longitude, zoom });

  return (
    <section
      id={blockId || undefined}
      className={cn("px-6 py-10", className)}
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
        }),
      }}
      aria-label={title}
    >
      <div className={cn("mx-auto overflow-hidden rounded-xl border border-zinc-200", maxWidthClass(maxWidth ?? "6xl"))}>
        {src ? (
          <iframe
            src={src}
            title={title}
            className="w-full border-0"
            style={{ height: `${height}px` }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div
            className="flex items-center justify-center bg-zinc-50 text-sm text-zinc-400"
            style={{ height: `${height}px` }}
            role="img"
            aria-label="Map placeholder"
          >
            Configure map coordinates or embed URL
          </div>
        )}
      </div>
    </section>
  );
}
