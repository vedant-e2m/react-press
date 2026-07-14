"use client";

import type { PuckComponent } from "@puckeditor/core";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import { shadcnComponentScope } from "../component-scope";
import { extractJsxFromPaste } from "../parse-jsx";
import { synthesizeSourceCode } from "../registry";

export type ShadcnJsxBlockProps = {
  sourceCode?: string;
  title?: string;
  description?: string;
  label?: string;
  variant?: string;
  size?: string;
  puckType?: string;
};

function getRenderableSourceCode(props: ShadcnJsxBlockProps): string {
  if (props.sourceCode?.trim()) {
    return extractJsxFromPaste(props.sourceCode);
  }

  if (props.title !== undefined || props.description !== undefined) {
    return synthesizeSourceCode({
      baseComponent: "Alert",
      defaultProps: props,
    } as Parameters<typeof synthesizeSourceCode>[0]);
  }

  if (props.label !== undefined) {
    const baseComponent = props.size !== undefined ? "Button" : "Badge";
    return synthesizeSourceCode({
      baseComponent,
      defaultProps: props,
    } as Parameters<typeof synthesizeSourceCode>[0]);
  }

  return "";
}

export const ShadcnJsxBlock: PuckComponent<ShadcnJsxBlockProps> = (props) => {
  const code = getRenderableSourceCode(props);

  if (!code) {
    return <div className="px-6 py-4 text-sm text-zinc-500">No component JSX configured.</div>;
  }

  return (
    <div className="px-6 py-4">
      <LiveProvider key={code} code={code} scope={shadcnComponentScope} noInline={false}>
        <LivePreview />
        <LiveError className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" />
      </LiveProvider>
    </div>
  );
};
