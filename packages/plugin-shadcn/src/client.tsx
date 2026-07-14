"use client";

import type { UiProviderClient } from "@nextpress/core";
import * as React from "react";
import { shadcnComponentScope } from "./component-scope";
import { Toaster } from "./ui/sonner";
import { TooltipProvider } from "./ui/tooltip";

function ShadcnProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}

export const shadcnClientProvider: UiProviderClient = {
  providerId: "shadcn",
  getComponentScope() {
    return shadcnComponentScope;
  },
  ProviderWrapper: ShadcnProviderWrapper,
};
