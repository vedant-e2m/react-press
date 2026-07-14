import type { PluginComponentRecord } from "@nextpress/shared";
import { INSTALLED_SHADCN_COMPONENTS } from "./installed-components";
import { normalizeJsxForLive } from "./normalize-jsx";

export interface ShadcnComponentSample {
  baseComponent: string;
  sampleCode: string;
}

export const SHADCN_COMPONENT_SAMPLES: Record<string, ShadcnComponentSample> = {
  Alert: {
    baseComponent: "Alert",
    sampleCode: `<Alert variant="default">
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can edit this alert in the page builder.</AlertDescription>
</Alert>`,
  },
  Badge: {
    baseComponent: "Badge",
    sampleCode: '<Badge variant="default">Badge</Badge>',
  },
  Button: {
    baseComponent: "Button",
    sampleCode: '<Button variant="default">Click me</Button>',
  },
  Card: {
    baseComponent: "Card",
    sampleCode: `<Card>
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`,
  },
  Bubble: {
    baseComponent: "Bubble",
    sampleCode: `<Bubble align="start">
  <BubbleContent>Hello from Bubble!</BubbleContent>
</Bubble>`,
  },
};

export const SHADCN_CATALOG = [
  {
    pluginId: "shadcn",
    name: "shadcn/ui",
    description:
      "Paste JSX from shadcn docs, register blocks, and use them in the Puck editor under the shadcn/ui category.",
    version: "0.1.0",
  },
] as const;

export const GENERIC_PLUGIN_FIELDS: PluginComponentRecord["fields"] = {
  sourceCode: { type: "textarea", label: "Component JSX" },
};

export function isInstalledShadcnComponent(name: string, installed?: string[]): boolean {
  const list = installed ?? INSTALLED_SHADCN_COMPONENTS;
  return list.includes(name);
}

export function getInstalledShadcnComponents(): string[] {
  return INSTALLED_SHADCN_COMPONENTS;
}

export function synthesizeSourceCode(record: PluginComponentRecord): string {
  const { baseComponent, defaultProps } = record;

  if (baseComponent === "Alert") {
    const title = String(defaultProps.title ?? "Heads up!");
    const description = String(defaultProps.description ?? "");
    const variant = String(defaultProps.variant ?? "default");
    return `<Alert variant="${variant}">
  <AlertTitle>${title}</AlertTitle>
  <AlertDescription>${description}</AlertDescription>
</Alert>`;
  }

  if (baseComponent === "Badge" || baseComponent === "Button") {
    const label = String(defaultProps.label ?? baseComponent);
    const variant = String(defaultProps.variant ?? "default");
    if (baseComponent === "Button") {
      const size = String(defaultProps.size ?? "default");
      return `<Button variant="${variant}" size="${size}">${label}</Button>`;
    }
    return `<Badge variant="${variant}">${label}</Badge>`;
  }

  const sample = SHADCN_COMPONENT_SAMPLES[baseComponent];
  return sample?.sampleCode ?? `<${baseComponent} />`;
}

export function getSourceCodeForRecord(record: PluginComponentRecord): string {
  const raw = record.sourceCode?.trim() || synthesizeSourceCode(record);
  return normalizeJsxForLive(raw);
}

/** @deprecated Use SHADCN_COMPONENT_SAMPLES */
export const SHADCN_COMPONENT_TEMPLATES = SHADCN_COMPONENT_SAMPLES;

/** @deprecated Use getInstalledShadcnComponents */
export const SUPPORTED_SHADCN_COMPONENTS = INSTALLED_SHADCN_COMPONENTS;

/** @deprecated Use isInstalledShadcnComponent */
export function isShadcnBaseComponent(value: string): boolean {
  return isInstalledShadcnComponent(value);
}
