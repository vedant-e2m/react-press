import type { PuckComponent } from "@puckeditor/core";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

export type ShadcnButtonBlockProps = {
  label: ReactNode;
  variant: "default" | "secondary" | "outline" | "destructive" | "ghost";
  size: "default" | "sm" | "lg";
};

function renderEditable(value: ReactNode): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return value;
}

export const ShadcnButtonBlock: PuckComponent<ShadcnButtonBlockProps> = ({
  label,
  variant,
  size,
}) => {
  return (
    <div className="flex justify-center px-6 py-4">
      <Button type="button" variant={variant} size={size}>
        {renderEditable(label)}
      </Button>
    </div>
  );
};
