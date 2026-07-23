import { BuilderRenderer } from "@nextpress/builder";
import type { BuilderDocument } from "@nextpress/builder";

/** Renders a published native builder page. */
export function PublicBuilderPage({ document }: { document: BuilderDocument }) {
  return <BuilderRenderer document={document} />;
}
