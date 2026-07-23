import Link from "next/link";
import type { MenuItem } from "@nextpress/cms-core";
import { cn } from "@/lib/utils";

interface MenuRendererProps {
  items: MenuItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function MenuRenderer({ items, className, orientation = "horizontal" }: MenuRendererProps) {
  if (items.length === 0) return null;

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <ul
      className={cn(
        orientation === "horizontal" ? "flex items-center gap-1" : "space-y-1",
        className,
      )}
    >
      {sorted.map((item) => (
        <MenuItemNode key={item.id} item={item} orientation={orientation} />
      ))}
    </ul>
  );
}

function MenuItemNode({
  item,
  orientation,
}: {
  item: MenuItem;
  orientation: "horizontal" | "vertical";
}) {
  const hasChildren = item.children && item.children.length > 0;
  const linkClass =
    "rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900";

  return (
    <li className={cn("relative", orientation === "horizontal" && hasChildren && "group")}>
      <Link href={item.url} className={linkClass}>
        {item.label}
      </Link>
      {hasChildren && (
        <ul
          className={cn(
            "min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg",
            orientation === "horizontal"
              ? "absolute left-0 top-full z-50 hidden pt-1 group-hover:block"
              : "ml-4 mt-1 space-y-0.5 border-0 bg-transparent py-0 shadow-none",
          )}
        >
          {[...(item.children ?? [])]
            .sort((a, b) => a.order - b.order)
            .map((child) => (
              <li key={child.id}>
                <Link href={child.url} className={cn(linkClass, "block")}>
                  {child.label}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </li>
  );
}
