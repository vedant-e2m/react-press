"use client";

import type { ReactNode } from "react";
import { mantineClientProvider } from "@nextpress/plugin-mantine/client";
import { shadcnClientProvider } from "@nextpress/plugin-shadcn/client";

const CLIENT_PROVIDERS = [shadcnClientProvider, mantineClientProvider];

export function getMergedComponentScope(enabledProviderIds: string[]) {
  const scope: Record<string, unknown> = {};

  for (const provider of CLIENT_PROVIDERS) {
    if (!enabledProviderIds.includes(provider.providerId)) continue;
    Object.assign(scope, provider.getComponentScope());
  }

  return scope;
}

export function UiProviders({
  children,
  enabledProviderIds = ["shadcn"],
}: {
  children: ReactNode;
  enabledProviderIds?: string[];
}) {
  let tree = children;

  for (const provider of CLIENT_PROVIDERS) {
    if (!enabledProviderIds.includes(provider.providerId)) continue;
    const Wrapper = provider.ProviderWrapper;
    if (Wrapper) {
      tree = <Wrapper>{tree}</Wrapper>;
    }
  }

  return <>{tree}</>;
}

export { shadcnClientProvider } from "@nextpress/plugin-shadcn/client";
export { mantineClientProvider } from "@nextpress/plugin-mantine/client";
