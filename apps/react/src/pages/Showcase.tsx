import { BuilderRenderer } from "@nextpress/builder";
import { createShowcaseDocument } from "@nextpress/builder";
import "@nextpress/builder/styles.css";

const showcaseDocument = createShowcaseDocument();

/** Live preview of every page builder widget with configured settings. */
export function Showcase() {
  return (
    <div className="showcase-preview">
      <BuilderRenderer document={showcaseDocument} />
    </div>
  );
}
