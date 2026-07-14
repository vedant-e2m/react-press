import type { PluginComponentRecord } from "@nextpress/shared";
import { INSTALLED_MANTINE_COMPONENTS } from "./installed-components";
import { extractJsxTags } from "./parse-jsx";

export const MANTINE_COMPONENT_SAMPLES: Record<string, { baseComponent: string; sampleCode: string }> = {
  Button: {
    baseComponent: "Button",
    sampleCode: '<Button variant="filled">Click me</Button>',
  },
  Card: {
    baseComponent: "Card",
    sampleCode: `<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Text fw={500}>Mantine Card</Text>
  <Text size="sm" c="dimmed">Paste Mantine JSX from the docs.</Text>
</Card>`,
  },
  Badge: {
    baseComponent: "Badge",
    sampleCode: '<Badge color="blue">Mantine Badge</Badge>',
  },
};

export const GENERIC_PLUGIN_FIELDS: PluginComponentRecord["fields"] = {
  sourceCode: { type: "textarea", label: "Component JSX" },
};

export function isInstalledMantineComponent(name: string): boolean {
  return INSTALLED_MANTINE_COMPONENTS.includes(name);
}

export function getInstalledMantineComponents(): string[] {
  return INSTALLED_MANTINE_COMPONENTS;
}

export function getSourceCodeForRecord(record: PluginComponentRecord): string {
  return record.sourceCode?.trim() || MANTINE_COMPONENT_SAMPLES[record.baseComponent]?.sampleCode || `<${record.baseComponent} />`;
}

export function synthesizeSourceCode(record: PluginComponentRecord): string {
  return getSourceCodeForRecord(record);
}
