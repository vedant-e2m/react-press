"use client";

import type { PuckComponent } from "@puckeditor/core";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import { mantineComponentScope } from "../client";
import { extractJsxFromPaste } from "../parse-jsx";
import { synthesizeSourceCode } from "../registry";

export type MantineJsxBlockProps = {
  sourceCode?: string;
  puckType?: string;
};

function getRenderableSourceCode(props: MantineJsxBlockProps): string {
  if (props.sourceCode?.trim()) {
    return extractJsxFromPaste(props.sourceCode);
  }
  return "";
}

export const MantineJsxBlock: PuckComponent<MantineJsxBlockProps> = (props) => {
  const code = getRenderableSourceCode(props) || synthesizeSourceCode({
    baseComponent: "Button",
    defaultProps: {},
  } as Parameters<typeof synthesizeSourceCode>[0]);

  if (!code) {
    return <div className="px-6 py-4 text-sm text-zinc-500">No component JSX configured.</div>;
  }

  return (
    <div className="px-6 py-4">
      <LiveProvider code={code} scope={mantineComponentScope} noInline={false}>
        <LivePreview />
        <LiveError className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" />
      </LiveProvider>
    </div>
  );
};
