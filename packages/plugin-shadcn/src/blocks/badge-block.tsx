import type { PuckComponent } from "@puckeditor/core";
import type { ReactNode } from "react";
import { Badge } from "../ui/badge";

export type ShadcnBadgeBlockProps = {
  label: ReactNode;
  variant: "default" | "secondary" | "destructive" | "outline";
};

function renderEditable(value: ReactNode): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return value;
}

/** Puck block matching shadcn Badge demo: https://ui.shadcn.com/docs/components/badge */
export const ShadcnBadgeBlock: PuckComponent<ShadcnBadgeBlockProps> = ({ label, variant }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 px-6 py-4">
      <Badge variant={variant}>{renderEditable(label)}</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
};
