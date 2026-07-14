import type { PuckComponent } from "@puckeditor/core";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export type ShadcnAlertBlockProps = {
  title: ReactNode;
  description: ReactNode;
  variant: "default" | "destructive";
};

function renderEditable(value: ReactNode): ReactNode {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number") return value;
  return value;
}

export const ShadcnAlertBlock: PuckComponent<ShadcnAlertBlockProps> = ({
  title,
  description,
  variant,
}) => {
  return (
    <div className="px-6 py-4">
      <Alert variant={variant}>
        <AlertTitle>{renderEditable(title)}</AlertTitle>
        <AlertDescription>{renderEditable(description)}</AlertDescription>
      </Alert>
    </div>
  );
}
