import type { UiProviderServer } from "@nextpress/core";
import { mantineUiProvider } from "@nextpress/plugin-mantine/server";
import { shadcnUiProvider } from "@nextpress/plugin-shadcn/server";

export const UI_PROVIDERS: Record<string, UiProviderServer> = {
  shadcn: shadcnUiProvider,
  mantine: mantineUiProvider,
};

export const UI_PROVIDER_CATALOG = Object.values(UI_PROVIDERS).map((provider) => provider.catalog);

export function getUiProvider(providerId: string): UiProviderServer | null {
  return UI_PROVIDERS[providerId] ?? null;
}

export function getUiProviderByPluginId(pluginId: string): UiProviderServer | null {
  return Object.values(UI_PROVIDERS).find((provider) => provider.catalog.pluginId === pluginId) ?? null;
}

export { shadcnUiProvider } from "@nextpress/plugin-shadcn/server";
export { mantineUiProvider } from "@nextpress/plugin-mantine/server";
