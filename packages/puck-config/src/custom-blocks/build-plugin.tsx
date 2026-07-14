import type { BlockPlugin } from "@nextpress/core";
import type { CustomBlockField, CustomBlockRecord } from "@nextpress/shared";
import type { Config, Field } from "@puckeditor/core";
import { colorField } from "../fields";
import { CustomBlockRenderer } from "./renderer";

type ComponentConfig = Config["components"][string];

const CUSTOM_BLOCK_CATEGORY = "custom";

/** Map an editor-defined field to a native Puck sidebar field. */
function toPuckField(field: CustomBlockField): Field {
  const label = field.label || field.name;

  switch (field.type) {
    case "textarea":
    case "richtext":
      return { type: "textarea", label };
    case "number":
      return { type: "number", label };
    case "boolean":
      return {
        type: "radio",
        label,
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      };
    case "color":
      return colorField(label) as Field;
    case "select":
      return {
        type: "select",
        label,
        options: (field.options ?? []).map((option) => ({
          label: option.label,
          value: option.value,
        })),
      };
    case "image":
    case "url":
    case "text":
    default:
      return { type: "text", label };
  }
}

function buildDefaultProps(fields: CustomBlockField[]): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      props[field.name] = field.defaultValue;
    } else if (field.type === "boolean") {
      props[field.name] = false;
    } else if (field.type === "number") {
      props[field.name] = 0;
    } else {
      props[field.name] = "";
    }
  }
  return props;
}

function toComponentConfig(record: CustomBlockRecord): ComponentConfig {
  const fields = record.fields.reduce<Record<string, Field>>((acc, field) => {
    if (field.name) acc[field.name] = toPuckField(field);
    return acc;
  }, {});

  return {
    label: record.label,
    fields: fields as ComponentConfig["fields"],
    defaultProps: buildDefaultProps(record.fields),
    render: (props: Record<string, unknown>) => (
      <CustomBlockRenderer template={record.template} fields={record.fields} values={props} />
    ),
  } as ComponentConfig;
}

/**
 * Build a Puck block plugin from editor-defined custom blocks. Returns `null`
 * when there are no blocks so callers can skip merging.
 */
export function buildCustomBlocksPlugin(records: CustomBlockRecord[]): BlockPlugin | null {
  const valid = records.filter((record) => record.puckType && record.template);
  if (valid.length === 0) return null;

  const components: Record<string, ComponentConfig> = {};
  const componentsByCategory: Record<string, string[]> = {};

  for (const record of valid) {
    components[record.puckType] = toComponentConfig(record);
    const category = record.category || CUSTOM_BLOCK_CATEGORY;
    (componentsByCategory[category] ??= []).push(record.puckType);
  }

  const categories: BlockPlugin["categories"] = {};
  for (const [category, types] of Object.entries(componentsByCategory)) {
    categories[category] = {
      title: category === CUSTOM_BLOCK_CATEGORY ? "Custom blocks" : category,
      components: types,
    };
  }

  return {
    meta: {
      id: "custom-blocks",
      name: "Custom blocks",
      version: "0.1.0",
      description: "Editor-defined blocks with custom fields",
    },
    components,
    categories,
  };
}
